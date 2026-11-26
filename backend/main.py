# =============================================================
#  main.py
#  Aurelius — FastAPI Entry Point (Secured, Multimodal & Artifacts)
# =============================================================

import io
import os
import re
import json
import base64
from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
from database.init_db import create_tables


from pypdf import PdfReader
from docx import Document
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import arabic_reshaper
from bidi.algorithm import get_display

from auth.dependencies import get_current_user_id
from auth.router import router as auth_router
from database.db import (
    get_connection,
    create_chat,
    save_message,
    get_chats,
    get_messages,
    update_chat_title,
    delete_chat,
    get_chat_user_id,
    delete_messages_from,
)

from ai.gemini import ask_aurelius, stream_aurelius, generate_or_edit_image
from ai.formatter import clean_reply, auto_title


# ── App setup ────────────────────────────────────────────────
app = FastAPI(title="Aurelius API", version="2.4.0")
app.include_router(auth_router)

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        create_tables()
    except Exception as e:
        print(f"[DB Startup Warning]: {e}")
    yield

app = FastAPI(title="Aurelius API", version="2.4.0", lifespan=lifespan)

ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_ORIGIN", "http://localhost:5500"),
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://aurelius-ai.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


# ── Request / Response schemas ───────────────────────────────
class ChatRequest(BaseModel):
    user_id: int
    title: str = Field(..., min_length=1, max_length=255)


class MessageRequest(BaseModel):
    chat_id: int
    message: str = Field(..., min_length=1, max_length=32000)
    mode: str = Field(default="low", pattern="^(low|medium|high)$")


class ChatTitleRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)


class ExportArtifactRequest(BaseModel):
    type: str
    filename: str
    content: str


# ── Helper: التحقق من ملكية المحادثة ─────────────────────────
def verify_chat_owner(chat_id: int, current_user_id: int) -> None:
    chat_user_id = get_chat_user_id(chat_id)
    if chat_user_id is None:
        raise HTTPException(status_code=404, detail="Chat not found.")
    if chat_user_id != current_user_id:
        raise HTTPException(status_code=403, detail="You are not allowed to access this chat.")


# ── Helper: تنفيذ عمليات الداتابيز قبل البث في اتصال واحد ────
def prepare_chat_turn(chat_id: int, user_message: str) -> list[tuple]:
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, role, content, created_at FROM messages WHERE chat_id = %s ORDER BY id ASC;",
                (chat_id,)
            )
            history = list(cur.fetchall())

            if not history:
                title = auto_title(user_message)
                cur.execute("UPDATE chats SET title = %s WHERE id = %s;", (title, chat_id))

            cur.execute(
                """
                INSERT INTO messages (chat_id, role, content)
                VALUES (%s, 'user', %s)
                RETURNING id, role, content, created_at;
                """,
                (chat_id, user_message)
            )
            new_row = cur.fetchone()
            conn.commit()

            history.append(new_row)
            return history
    finally:
        conn.close()


# ── Helpers: معالجة النصوص العربية وبناء PDF / DOCX ───────────
def fix_arabic_pdf_text(text: str) -> str:
    """إصلاح اتجاه وتشكيل الحروف العربية داخل ملفات PDF حتى لا تتقطع"""
    reshaped = arabic_reshaper.reshape(text)
    return get_display(reshaped)


def build_pdf_base64(content_text: str) -> str:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    font_name = "Helvetica"
    for candidate in [
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/tahoma.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    ]:
        if os.path.exists(candidate):
            pdfmetrics.registerFont(TTFont("ArabicFont", candidate))
            font_name = "ArabicFont"
            break

    c.setFont(font_name, 12)
    y = height - 50
    for raw_line in content_text.splitlines():
        if y < 50:
            c.showPage()
            c.setFont(font_name, 12)
            y = height - 50

        line = raw_line.strip()
        if not line:
            y -= 14
            continue

        is_ar = bool(re.search(r"[\u0600-\u06FF]", line))
        display_line = fix_arabic_pdf_text(line) if (is_ar and font_name == "ArabicFont") else line
        if is_ar:
            c.drawRightString(width - 45, y, display_line[:110])
        else:
            c.drawString(45, y, display_line[:110])
        y -= 20

    c.save()
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")


def build_docx_base64(content_text: str) -> str:
    doc = Document()
    for line in content_text.splitlines():
        p = doc.add_paragraph(line)
        if re.search(r"[\u0600-\u06FF]", line):
            p.paragraph_format.bidi = True
    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")


def extract_uploaded_file(file: UploadFile, raw_bytes: bytes) -> dict:
    filename = file.filename or "attachment"
    mime_type = file.content_type or ""
    extracted_text = ""

    if filename.lower().endswith(".pdf") or mime_type == "application/pdf":
        reader = PdfReader(io.BytesIO(raw_bytes))
        extracted_text = "\n".join(page.extract_text() or "" for page in reader.pages)
    elif filename.lower().endswith(".docx"):
        doc = Document(io.BytesIO(raw_bytes))
        extracted_text = "\n".join(p.text for p in doc.paragraphs)
    elif not mime_type.startswith("image/"):
        extracted_text = raw_bytes.decode("utf-8", errors="ignore")

    return {
        "filename": filename,
        "mime_type": mime_type,
        "bytes": raw_bytes,
        "extracted_text": extracted_text,
    }


def _stream_with_artifacts(
    chat_id: int,
    history: list[tuple],
    mode: str,
    background_tasks: BackgroundTasks,
    attachment: dict | None = None
):
    # كشف لغة آخر رسالة للمستخدم لعرض رسالة التحميل بنفس لغته
    last_user_msg = history[-1][2] if history else ""
    clean_user_text = re.sub(r"!\[[^\]]*\]\(data:image/[^)]+\)", "", str(last_user_msg))
    is_arabic_user = bool(re.search(r"[\u0600-\u06FF]", clean_user_text))

    def event_generator():
        full_reply = ""
        buffer_text = ""
        try:
            for chunk in stream_aurelius(history, mode=mode, attachment=attachment):
                full_reply += chunk
                buffer_text += chunk

                # 1. اعتراض أمر إنشاء/تعديل صورة وعرضها في الشات مباشرة بدون فتح الـ Side Bar
                img_match = re.search(r"\[\[IMAGE_EDIT:\s*(.*?)\]\]", buffer_text, re.DOTALL)
                if img_match:
                    prompt_desc = img_match.group(1).strip()
                    before_tag = buffer_text[:img_match.start()]
                    if before_tag:
                        yield f"data: {json.dumps({'chunk': before_tag})}\n\n"

                    status_msg = "جاري إنشاء صورتك..." if is_arabic_user else "Creating your image..."
                    yield f"data: {json.dumps({'status': status_msg})}\n\n"

                    src_bytes = (
                        attachment["bytes"]
                        if (attachment and attachment["mime_type"].startswith("image/"))
                        else None
                    )
                    src_mime = attachment["mime_type"] if src_bytes else "image/png"
                    img_data_url = generate_or_edit_image(prompt_desc, src_bytes, src_mime)

                    if img_data_url:
                        img_markdown = f"\n![Aurelius Image]({img_data_url})\n"
                        yield f"data: {json.dumps({'chunk': img_markdown})}\n\n"
                        full_reply = full_reply.replace(img_match.group(0), img_markdown)
                    else:
                        fail_msg = "\n*(تعذر توليد الصورة حالياً)*\n" if is_arabic_user else "\n*(Could not generate the image right now)*\n"
                        yield f"data: {json.dumps({'chunk': fail_msg})}\n\n"
                        full_reply = full_reply.replace(img_match.group(0), fail_msg)

                    buffer_text = buffer_text[img_match.end():]
                    continue

                # إرسال النص العادي طالما مفيش تاج مفتوح
                if "[[" not in buffer_text:
                    yield f"data: {json.dumps({'chunk': buffer_text})}\n\n"
                    buffer_text = ""

            if buffer_text:
                yield f"data: {json.dumps({'chunk': buffer_text})}\n\n"

            # 2. فحص وجود ملف PDF أو DOCX أو HTML في الرد لفتحه في الـ Right Side Panel
            art_match = re.search(r"```artifact:(pdf|docx|html):([^\n]+)\n([\s\S]*?)```", full_reply)
            if art_match:
                art_type = art_match.group(1).strip()
                art_name = art_match.group(2).strip()
                art_body = art_match.group(3).strip()

                yield f"data: {json.dumps({'status': f'جاري تجهيز ملف {art_name} وعرضه في اللوحة الجانبية...'})}\n\n"

                if art_type == "pdf":
                    b64 = build_pdf_base64(art_body)
                    yield f"data: {json.dumps({'artifact': {'type': 'pdf', 'filename': art_name, 'data_url': f'data:application/pdf;base64,{b64}', 'text': art_body}})}\n\n"
                elif art_type == "docx":
                    b64 = build_docx_base64(art_body)
                    yield f"data: {json.dumps({'artifact': {'type': 'docx', 'filename': art_name, 'data_url': f'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,{b64}', 'text': art_body}})}\n\n"
                elif art_type == "html":
                    yield f"data: {json.dumps({'artifact': {'type': 'html', 'filename': art_name, 'html': art_body}})}\n\n"

            cleaned = clean_reply(full_reply)
            background_tasks.add_task(save_message, chat_id, "assistant", cleaned)
            yield f"data: {json.dumps({'done': True, 'reply': cleaned})}\n\n"

        except Exception as exc:
            err_msg = f"**Error:** {str(exc)}"
            try:
                save_message(chat_id, "assistant", err_msg)
            except Exception:
                pass
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )


# ── Health / utility endpoints ───────────────────────────────
@app.get("/")
def root():
    return {"message": "Aurelius API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/db-test")
def db_test(current_user_id: int = Depends(get_current_user_id)):
    try:
        conn = get_connection()
        conn.close()
        return {"status": "ok", "database": "PostgreSQL connected"}
    except Exception:
        raise HTTPException(status_code=500, detail="Database connection failed.")


# ── Chats ────────────────────────────────────────────────────
@app.get("/chats/{user_id}")
def get_chats_endpoint(
    user_id: int,
    current_user_id: int = Depends(get_current_user_id)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="You are not allowed to access these chats.")

    try:
        chats = get_chats(user_id)
        return {
            "chats": [
                {"id": c[0], "title": c[1], "created_at": c[2]}
                for c in chats
            ]
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to retrieve chats.")


@app.post("/chats")
def create_chat_endpoint(
    request: ChatRequest,
    current_user_id: int = Depends(get_current_user_id)
):
    if request.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="You are not allowed to create a chat for this user.")

    title = request.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Chat title cannot be empty.")

    try:
        chat_id = create_chat(request.user_id, title)
        return {
            "id": chat_id,
            "user_id": request.user_id,
            "title": title
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to create chat.")


@app.put("/chats/{chat_id}/title")
def rename_chat_endpoint(
    chat_id: int,
    request: ChatTitleRequest,
    current_user_id: int = Depends(get_current_user_id)
):
    verify_chat_owner(chat_id, current_user_id)

    title = request.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Chat title cannot be empty.")

    try:
        updated = update_chat_title(chat_id, title)
        if not updated:
            raise HTTPException(status_code=404, detail="Chat not found.")

        return {
            "message": "Chat renamed successfully.",
            "chat_id": chat_id,
            "title": title
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to rename chat.")


@app.delete("/chats/{chat_id}")
def delete_chat_endpoint(
    chat_id: int,
    current_user_id: int = Depends(get_current_user_id)
):
    verify_chat_owner(chat_id, current_user_id)

    try:
        deleted = delete_chat(chat_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Chat not found.")

        return {
            "message": "Chat deleted successfully.",
            "chat_id": chat_id
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to delete chat.")


# ── Messages ─────────────────────────────────────────────────
@app.get("/chats/{chat_id}/messages")
def get_messages_endpoint(
    chat_id: int,
    current_user_id: int = Depends(get_current_user_id)
):
    verify_chat_owner(chat_id, current_user_id)

    try:
        msgs = get_messages(chat_id)
        return {
            "messages": [
                {"id": m[0], "role": m[1], "content": m[2], "created_at": m[3]}
                for m in msgs
            ]
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to load messages.")


@app.delete("/chats/{chat_id}/messages/truncate")
def truncate_messages_endpoint(
    chat_id: int,
    from_message_id: int | None = None,
    current_user_id: int = Depends(get_current_user_id)
):
    verify_chat_owner(chat_id, current_user_id)
    delete_messages_from(chat_id, from_message_id)
    return {"status": "ok"}


# ── Export Saved Artifacts (PDF / DOCX) ──────────────────────
@app.post("/artifacts/export")
def export_saved_artifact(
    request: ExportArtifactRequest,
    current_user_id: int = Depends(get_current_user_id)
):
    if request.type == "pdf":
        b64 = build_pdf_base64(request.content)
        return {
            "type": "pdf",
            "filename": request.filename,
            "data_url": f"data:application/pdf;base64,{b64}",
            "text": request.content
        }
    elif request.type == "docx":
        b64 = build_docx_base64(request.content)
        return {
            "type": "docx",
            "filename": request.filename,
            "data_url": f"data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,{b64}",
            "text": request.content
        }
    raise HTTPException(status_code=400, detail="Unsupported artifact type.")


# ── Main chat endpoint (standard) ────────────────────────────
@app.post("/chat")
def chat(
    request: MessageRequest,
    background_tasks: BackgroundTasks,
    current_user_id: int = Depends(get_current_user_id)
):
    verify_chat_owner(request.chat_id, current_user_id)

    clean_msg = request.message.strip()
    if not clean_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        history = prepare_chat_turn(request.chat_id, clean_msg)
        raw_reply = ask_aurelius(history, mode=request.mode)
        reply = clean_reply(raw_reply)

        background_tasks.add_task(save_message, request.chat_id, "assistant", reply)
        return {"reply": reply}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to generate response.")


# ── Main chat endpoint (streaming text) ──────────────────────
@app.post("/chat/stream")
def chat_stream(
    request: MessageRequest,
    background_tasks: BackgroundTasks,
    current_user_id: int = Depends(get_current_user_id)
):
    verify_chat_owner(request.chat_id, current_user_id)

    clean_msg = request.message.strip()
    if not clean_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    history = prepare_chat_turn(request.chat_id, clean_msg)
    return _stream_with_artifacts(request.chat_id, history, request.mode, background_tasks)


# ── Main chat endpoint (multimodal files & images) ───────────
@app.post("/chat/stream-multimodal")
async def chat_stream_multimodal(
    background_tasks: BackgroundTasks,
    chat_id: int = Form(...),
    message: str = Form(""),
    mode: str = Form("low"),
    file: UploadFile | None = File(None),
    current_user_id: int = Depends(get_current_user_id),
):
    verify_chat_owner(chat_id, current_user_id)

    attachment = None
    if file is not None:
        raw_bytes = await file.read()
        attachment = extract_uploaded_file(file, raw_bytes)

    user_display_msg = message.strip()
    if attachment:
        if attachment["mime_type"].startswith("image/"):
            b64_src = base64.b64encode(attachment["bytes"]).decode("utf-8")
            img_md = f"![{attachment['filename']}](data:{attachment['mime_type']};base64,{b64_src})"
            user_display_msg = f"{user_display_msg}\n{img_md}".strip()
        else:
            user_display_msg = f"{user_display_msg}\n📎 [{attachment['filename']}]".strip()

    if not user_display_msg:
        raise HTTPException(status_code=400, detail="Message or file is required.")

    history = prepare_chat_turn(chat_id, user_display_msg)
    return _stream_with_artifacts(chat_id, history, mode, background_tasks, attachment=attachment)