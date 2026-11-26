import os
import re
import time
import random
import smtplib
from email.message import EmailMessage
from urllib.parse import urlencode
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from auth.dependencies import get_current_user_id
from auth.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from database.db import (
    create_auth_user,
    get_or_create_oauth_user,
    get_user_by_email,
    get_user_by_id,
    update_user_preferences,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
FACEBOOK_CLIENT_ID = os.getenv("FACEBOOK_CLIENT_ID", "")
FACEBOOK_CLIENT_SECRET = os.getenv("FACEBOOK_CLIENT_SECRET", "")
BACKEND_URL = os.getenv("BACKEND_URL", "https://aurelius-backend-brown.vercel.app")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://aurelius-ai-frontend.vercel.app")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

ALLOWED_DOMAINS = {"gmail.com", "facebook.com"}

# تخزين مؤقت لأكواد الدخول (2FA OTP) لمدة 10 دقائق
PENDING_LOGIN_OTPS: dict[str, dict] = {}


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class VerifyLoginOtpRequest(BaseModel):
    email: str
    code: str


class PreferencesRequest(BaseModel):
    language: Optional[str] = None
    theme: Optional[str] = None
    background: Optional[str] = None
    avatar: Optional[str] = None


def validate_allowed_email(email: str) -> None:
    pattern = r"^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$"
    match = re.match(pattern, email)
    if not match:
        raise HTTPException(
            status_code=400,
            detail="Invalid email format. Please write the full email (e.g. name@gmail.com)."
        )

    domain = match.group(1).lower()
    if domain not in ALLOWED_DOMAINS:
        raise HTTPException(
            status_code=400,
            detail=f"Domain '@{domain}' is not allowed. Only @gmail.com or @facebook.com emails are accepted."
        )


def validate_strong_password(password: str) -> None:
    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="This password is weak. Use at least 6 characters, avoid repeated digits (like 111111) or sequential numbers (like 123456)."
        )

    # منع التكرار الكامل مثل 111111 أو aaaaaa
    if len(set(password)) <= 2:
        raise HTTPException(
            status_code=400,
            detail="This password is weak. Avoid repeated characters like '111111' and mix letters with numbers."
        )

    # منع الأرقام المتتالية مثل 123456 أو 654321
    sequences = "01234567890 09876543210 abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba"
    if password.lower() in sequences:
        raise HTTPException(
            status_code=400,
            detail="This password is weak. Do not use sequential numbers like '123456'; combine letters, numbers, and symbols."
        )


def send_login_otp_email(to_email: str, username: str, code: str) -> None:
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"\n[DEV LOGIN 2FA OTP] To: {to_email} | User: {username} | Code: {code}\n")
        return

    msg = EmailMessage()
    msg["Subject"] = f"{code} is your Aurelius sign-in verification code"
    msg["From"] = f"Aurelius Security <{SMTP_USER}>"
    msg["To"] = to_email
    msg.set_content(
        f"Hello {username},\n\n"
        f"Your 6-digit Aurelius verification code is: {code}\n"
        f"This code is valid for 10 minutes.\n\n"
        f"If you did not try to sign in, please ignore this message."
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)


# =========================
# 1. REGISTER (DIRECT DB SAVE -> REDIRECT TO LOGIN)
# =========================

@router.post("/register")
def register(request: RegisterRequest):
    username = request.username.strip()
    email = request.email.strip().lower()
    password = request.password
    confirm_password = request.confirm_password

    if not username or len(username) < 2:
        raise HTTPException(status_code=400, detail="Username must be at least 2 characters.")

    validate_allowed_email(email)

    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    validate_strong_password(password)

    existing = get_user_by_email(email)
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered. Please sign in.")

    hashed_pw = hash_password(password)
    user = create_auth_user(username, email, hashed_pw, provider="local")

    return {
        "message": "Account created successfully! Please sign in.",
        "email": user[2]
    }


# =========================
# 2. LOGIN STEP 1 (CHECK CREDENTIALS -> SEND 6-DIGIT OTP)
# =========================

@router.post("/login")
def login(request: LoginRequest):
    email = request.email.strip().lower()
    password = request.password

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    user_id, username, user_email, password_hash, language, theme, background, avatar = user

    if password_hash == "OAUTH_MANAGED_ACCOUNT":
        raise HTTPException(
            status_code=400,
            detail="This account was created via Google/Facebook button. Click 'Continue with Google' or 'Facebook' above, or register a password first."
        )

    if not verify_password(password, password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    # توليد كود عشوائي من 6 أرقام وإرساله للإيميل
    otp_code = f"{random.randint(100000, 999999)}"
    PENDING_LOGIN_OTPS[user_email] = {
        "code": otp_code,
        "expires_at": time.time() + 600,
        "attempts": 0,
        "user": {
            "id": user_id,
            "username": username,
            "email": user_email,
            "language": language,
            "theme": theme,
            "background": background,
            "avatar": avatar,
        }
    }

    try:
        send_login_otp_email(user_email, username, otp_code)
    except Exception as exc:
        PENDING_LOGIN_OTPS.pop(user_email, None)
        raise HTTPException(status_code=500, detail=f"Could not send verification email: {str(exc)}")

    return {
        "requires_2fa": True,
        "email": user_email,
        "message": "Verification code sent to your email."
    }


# =========================
# 3. LOGIN STEP 2 (VERIFY 6-DIGIT OTP -> GRANT ACCESS)
# =========================

@router.post("/verify-login-otp")
def verify_login_otp(request: VerifyLoginOtpRequest):
    email = request.email.strip().lower()
    code = request.code.strip()

    pending = PENDING_LOGIN_OTPS.get(email)
    if not pending:
        raise HTTPException(status_code=400, detail="Verification session expired. Please sign in again.")

    if time.time() > pending["expires_at"]:
        PENDING_LOGIN_OTPS.pop(email, None)
        raise HTTPException(status_code=400, detail="Code expired. Please sign in again.")

    pending["attempts"] += 1
    if pending["attempts"] > 5:
        PENDING_LOGIN_OTPS.pop(email, None)
        raise HTTPException(status_code=429, detail="Too many wrong attempts. Please sign in again.")

    if pending["code"] != code:
        raise HTTPException(status_code=400, detail="Incorrect verification code. Please check your email and try again.")

    user_data = pending["user"]
    PENDING_LOGIN_OTPS.pop(email, None)

    access_token = create_access_token(user_data["id"])

    return {
        "message": "Identity verified!",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data
    }


# =========================
# 4. DIRECT GOOGLE OAUTH 2.0 (NO EXTRA OTP)
# =========================

@router.get("/google/login")
def google_login():
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth credentials are missing in backend .env"
        )

    redirect_uri = f"{BACKEND_URL}/auth/google/callback"
    params = urlencode({
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "prompt": "select_account",
    })
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


@router.get("/google/callback")
async def google_callback(code: str = None, error: str = None):
    if error or not code:
        return RedirectResponse(f"{FRONTEND_URL}?oauth_error=Google+sign-in+cancelled")

    redirect_uri = f"{BACKEND_URL}/auth/google/callback"

    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
        )
        token_data = token_res.json()
        access_token = token_data.get("access_token")
        if not access_token:
            return RedirectResponse(f"{FRONTEND_URL}?oauth_error=Google+token+exchange+failed")

        user_res = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        profile = user_res.json()

    provider_user_id = profile.get("id")
    email = (profile.get("email") or "").strip().lower()
    username = (profile.get("name") or email.split("@")[0] or "Google User").strip()

    if not email or not provider_user_id:
        return RedirectResponse(f"{FRONTEND_URL}?oauth_error=Google+account+has+no+email")

    user = get_or_create_oauth_user(username, email, provider="google", provider_user_id=provider_user_id)
    jwt_token = create_access_token(user[0])

    return RedirectResponse(f"{FRONTEND_URL}?oauth_token={jwt_token}")


# =========================
# 5. DIRECT FACEBOOK OAUTH 2.0 (NO EXTRA OTP)
# =========================

@router.get("/facebook/login")
def facebook_login():
    if not FACEBOOK_CLIENT_ID or not FACEBOOK_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Facebook OAuth credentials are missing in backend .env"
        )

    redirect_uri = f"{BACKEND_URL}/auth/facebook/callback"
    params = urlencode({
        "client_id": FACEBOOK_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "scope": "email,public_profile",
        "response_type": "code",
    })
    return RedirectResponse(f"https://www.facebook.com/v19.0/dialog/oauth?{params}")


@router.get("/facebook/callback")
async def facebook_callback(code: str = None, error: str = None):
    if error or not code:
        return RedirectResponse(f"{FRONTEND_URL}?oauth_error=Facebook+sign-in+cancelled")

    redirect_uri = f"{BACKEND_URL}/auth/facebook/callback"

    async with httpx.AsyncClient() as client:
        token_res = await client.get(
            "https://graph.facebook.com/v19.0/oauth/access_token",
            params={
                "client_id": FACEBOOK_CLIENT_ID,
                "client_secret": FACEBOOK_CLIENT_SECRET,
                "redirect_uri": redirect_uri,
                "code": code,
            },
        )
        token_data = token_res.json()
        access_token = token_data.get("access_token")
        if not access_token:
            return RedirectResponse(f"{FRONTEND_URL}?oauth_error=Facebook+token+exchange+failed")

        user_res = await client.get(
            "https://graph.facebook.com/me",
            params={
                "fields": "id,name,email",
                "access_token": access_token,
            },
        )
        profile = user_res.json()

    fb_id = profile.get("id")
    if not fb_id:
        return RedirectResponse(f"{FRONTEND_URL}?oauth_error=Facebook+profile+fetch+failed")

    email = (profile.get("email") or "").strip().lower()
    username = (profile.get("name") or "Facebook User").strip()

    if not email:
        email = f"{fb_id}@facebook.com"

    user = get_or_create_oauth_user(username, email, provider="facebook", provider_user_id=fb_id)
    jwt_token = create_access_token(user[0])

    return RedirectResponse(f"{FRONTEND_URL}?oauth_token={jwt_token}")


# =========================
# 6. CURRENT USER & SETTINGS
# =========================

@router.get("/me")
def get_me(user_id: int = Depends(get_current_user_id)):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user[0],
        "username": user[1],
        "email": user[2],
        "language": user[3],
        "theme": user[4],
        "background": user[5],
        "avatar": user[6],
    }


@router.put("/preferences")
def update_preferences(
    request: PreferencesRequest,
    user_id: int = Depends(get_current_user_id)
):
    if request.language and request.language not in ("en", "ar"):
        raise HTTPException(status_code=400, detail="Unsupported language")
    if request.theme and request.theme not in ("dark", "light"):
        raise HTTPException(status_code=400, detail="Unsupported theme")

    updated = update_user_preferences(
        user_id,
        language=request.language,
        theme=request.theme,
        background=request.background,
        avatar=request.avatar,
    )

    if not updated:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": updated[0],
        "username": updated[1],
        "email": updated[2],
        "language": updated[3],
        "theme": updated[4],
        "background": updated[5],
        "avatar": updated[6],
    }