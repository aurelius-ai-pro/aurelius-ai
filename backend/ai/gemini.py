import os
import re
import base64
import io
from PIL import Image
import urllib.parse
import urllib.request
from google import genai
from google.genai import types
from dotenv import load_dotenv
from ai.prompts import AURELIUS_SYSTEM_PROMPT, inject_language_instruction

load_dotenv()

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

TEMPERATURE = 0.4
MAX_RETRIES = 1

MODE_CONFIGS = {
    "low": {
        "models": ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.7-flash"],
        "thinking_budget": None,
    },
    "medium": {
        "models": ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"],
        "thinking_budget": None,
    },
    "high": {
        "models": ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.6-flash", "gemini-3.5-flash"],
        "thinking_budget": 512,
    },
}


def build_config(mode: str, model_name: str, system_prompt: str) -> dict:
    """
    بناء config مع الـ system prompt الديناميكي (اللي فيه language injection).
    """
    settings = MODE_CONFIGS.get(mode, MODE_CONFIGS["low"])
    config = {
        "system_instruction": system_prompt,   # ← هنا بنبعت الـ prompt المعدّل
        "temperature": TEMPERATURE,
    }
    if "lite" not in model_name and settings["thinking_budget"] is not None:
        config["thinking_config"] = {"thinking_budget": settings["thinking_budget"]}
    return config


def _strip_embedded_base64(text: str) -> str:
    return re.sub(r"!\[([^\]]*)\]\(data:image/[^)]+\)", r"[Attached Image: \1]", str(text or ""))


def build_contents(history_rows: list[tuple], attachment: dict | None = None) -> list[dict]:
    contents = []
    for idx, row in enumerate(history_rows):
        role = "model" if row[1] == "assistant" else row[1]
        clean_text = _strip_embedded_base64(row[2])
        parts = [{"text": clean_text}]

        if idx == len(history_rows) - 1 and role == "user" and attachment:
            mime_type = attachment.get("mime_type", "")
            raw_bytes = attachment.get("bytes")
            extracted_text = attachment.get("extracted_text")

            if raw_bytes and mime_type.startswith("image/"):
                parts.append(
                    types.Part.from_bytes(data=raw_bytes, mime_type=mime_type)
                )
            elif extracted_text:
                parts.append({
                    "text": f"\n\n[Attached File: {attachment.get('filename', 'file')}]\n{extracted_text[:25000]}"
                })

        contents.append({"role": role, "parts": parts})
    return contents


def _crop_watermark_bottom(img_bytes: bytes, crop_px: int = 48) -> bytes:
    try:
        with Image.open(io.BytesIO(img_bytes)) as im:
            w, h = im.size
            if h > crop_px * 2:
                cropped = im.crop((0, 0, w, h - crop_px))
                out = io.BytesIO()
                cropped.save(out, format="PNG")
                return out.getvalue()
    except Exception as exc:
        print(f"[Crop Watermark Warning]: {exc}")
    return img_bytes


def generate_or_edit_image(
    prompt: str,
    source_image_bytes: bytes | None = None,
    mime_type: str = "image/png"
) -> str | None:
    for img_model in ["gemini-3.1-flash-lite-image", "gemini-3.1-flash-image", "gemini-2.5-flash-image"]:
        try:
            req_contents = [prompt]
            if source_image_bytes:
                req_contents.append(
                    types.Part.from_bytes(data=source_image_bytes, mime_type=mime_type)
                )

            res = _client.models.generate_content(
                model=img_model,
                contents=req_contents,
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE"]
                )
            )
            for part in res.candidates[0].content.parts:
                if part.inline_data and part.inline_data.data:
                    b64 = base64.b64encode(part.inline_data.data).decode("utf-8")
                    out_mime = part.inline_data.mime_type or "image/png"
                    return f"data:{out_mime};base64,{b64}"
        except Exception as exc:
            print(f"[Gemini Image {img_model} Error]: {exc}")

    if not source_image_bytes:
        try:
            encoded_prompt = urllib.parse.quote(prompt)
            url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true"
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=25) as resp:
                img_bytes = resp.read()
                if img_bytes:
                    clean_bytes = _crop_watermark_bottom(img_bytes, crop_px=48)
                    b64 = base64.b64encode(clean_bytes).decode("utf-8")
                    return f"data:image/png;base64,{b64}"
        except Exception as exc:
            print(f"[Pollinations Image Error]: {exc}")

    return None


def ask_aurelius(history_rows: list[tuple], mode: str = "low", attachment: dict | None = None) -> str:
    candidate_models = MODE_CONFIGS.get(mode, MODE_CONFIGS["low"])["models"]

    # ← الحل الأساسي: inject language instruction بناءً على آخر رسالة
    dynamic_system_prompt = inject_language_instruction(history_rows)

    trimmed = list(history_rows[-10:])
    while trimmed and trimmed[0][1] != "user":
        trimmed.pop(0)

    contents = build_contents(trimmed, attachment=attachment)
    last_error = None

    for model_name in candidate_models:
        config = build_config(mode, model_name, dynamic_system_prompt)
        for attempt in range(MAX_RETRIES):
            try:
                response = _client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=config,
                )
                if not response.text:
                    raise ValueError("Gemini returned an empty response.")
                return response.text
            except Exception as exc:
                last_error = exc
                err_str = str(exc)
                if any(code in err_str for code in ("503", "429", "404", "400", "UNAVAILABLE", "RESOURCE_EXHAUSTED", "NOT_FOUND")):
                    continue
                break

    raise last_error


def stream_aurelius(history_rows: list[tuple], mode: str = "low", attachment: dict | None = None):
    candidate_models = MODE_CONFIGS.get(mode, MODE_CONFIGS["low"])["models"]

    # ← الحل الأساسي: inject language instruction بناءً على آخر رسالة
    dynamic_system_prompt = inject_language_instruction(history_rows)

    trimmed = list(history_rows[-10:])
    while trimmed and trimmed[0][1] != "user":
        trimmed.pop(0)

    contents = build_contents(trimmed, attachment=attachment)
    last_error = None

    for model_name in candidate_models:
        config = build_config(mode, model_name, dynamic_system_prompt)
        for attempt in range(MAX_RETRIES):
            try:
                print(f"[Aurelius] Trying model: {model_name} | lang_injected=True")
                response = _client.models.generate_content_stream(
                    model=model_name,
                    contents=contents,
                    config=config,
                )
                has_yielded = False
                for chunk in response:
                    if chunk.text:
                        has_yielded = True
                        yield chunk.text
                if has_yielded:
                    return
            except Exception as exc:
                last_error = exc
                err_str = str(exc)
                print(f"[Aurelius] {model_name} failed: {err_str[:150]}")
                if any(code in err_str for code in ("503", "429", "404", "400", "UNAVAILABLE", "RESOURCE_EXHAUSTED", "NOT_FOUND")):
                    continue
                break

    if last_error is not None:
        raise last_error