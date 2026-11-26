# =============================================================
#  ai/formatter.py
#  Aurelius — Response Formatter
#  بيتأكد إن الرد اللي جاي من Gemini جاهز صح للـ Frontend
# =============================================================

import re


def clean_reply(text: str) -> str:
    """
    Light post-processing on Gemini's reply before saving / sending.

    What it does:
    1. Strips leading / trailing whitespace.
    2. Collapses runs of 3+ blank lines into exactly 2 (keeps paragraphs
       readable without huge gaps).
    3. Leaves LaTeX, markdown, Quran blocks, artifacts, and Arabic text untouched.
    """
    if not text:
        return ""

    # 1. Strip outer whitespace
    text = text.strip()

    # 2. Collapse excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text


def auto_title(first_message: str, max_length: int = 40) -> str:
    """
    Generate a short chat title from the user's first message.

    - Cleans embedded base64 image markdown so titles stay readable.
    - Strips leading/trailing whitespace.
    - Truncates to `max_length` characters and appends "…" if needed.
    """
    # استبدال كود الصورة المرفوعة باسمها فقط عند توليد عنوان الشات
    title = re.sub(r"!\[([^\]]*)\]\(data:[^)]+\)", r"[\1]", first_message).strip()

    if len(title) > max_length:
        title = title[:max_length - 1] + "…"

    return title or "New conversation"