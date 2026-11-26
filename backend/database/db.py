import os
import psycopg
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    return psycopg.connect(os.getenv("DATABASE_URL"))


def create_user(username, email):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (username, email)
                VALUES (%s, %s)
                RETURNING id;
                """,
                (username, email)
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            return user_id
    finally:
        conn.close()


def create_chat(user_id, title):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO chats (user_id, title)
                VALUES (%s, %s)
                RETURNING id;
                """,
                (user_id, title)
            )
            chat_id = cur.fetchone()[0]
            conn.commit()
            return chat_id
    finally:
        conn.close()


def get_chats(user_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, title, created_at
                FROM chats
                WHERE user_id = %s
                ORDER BY id DESC;
                """,
                (user_id,)
            )
            return cur.fetchall()
    finally:
        conn.close()


def save_message(chat_id, role, content):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO messages (chat_id, role, content)
                VALUES (%s, %s, %s);
                """,
                (chat_id, role, content)
            )
            conn.commit()
    finally:
        conn.close()


def get_messages(chat_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, role, content, created_at
                FROM messages
                WHERE chat_id = %s
                ORDER BY id ASC;
                """,
                (chat_id,)
            )
            return cur.fetchall()
    finally:
        conn.close()


def update_chat_title(chat_id, title):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE chats
                SET title = %s
                WHERE id = %s;
                """,
                (title, chat_id)
            )
            updated = cur.rowcount > 0
            conn.commit()
            return updated
    finally:
        conn.close()


def delete_chat(chat_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM chats
                WHERE id = %s;
                """,
                (chat_id,)
            )
            deleted = cur.rowcount > 0
            conn.commit()
            return deleted
    finally:
        conn.close()


def create_auth_user(username, email, password_hash, provider="local"):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (username, email, password_hash, provider)
                VALUES (%s, %s, %s, %s)
                RETURNING id, username, email, created_at;
                """,
                (username, email, password_hash, provider)
            )
            user = cur.fetchone()
            conn.commit()
            return user
    finally:
        conn.close()


def get_or_create_oauth_user(username, email, provider, provider_user_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # 1. Check if OAuth provider account already linked
            cur.execute(
                """
                SELECT user_id
                FROM oauth_accounts
                WHERE provider = %s AND provider_user_id = %s;
                """,
                (provider, str(provider_user_id))
            )
            linked = cur.fetchone()
            if linked:
                user_id = linked[0]
            else:
                # 2. Check if user with same email exists
                cur.execute("SELECT id FROM users WHERE email = %s;", (email,))
                existing_user = cur.fetchone()

                if existing_user:
                    user_id = existing_user[0]
                else:
                    # 3. Create new user
                    cur.execute(
                        """
                        INSERT INTO users (username, email, password_hash, provider)
                        VALUES (%s, %s, %s, %s)
                        RETURNING id;
                        """,
                        (username, email, "OAUTH_MANAGED_ACCOUNT", provider)
                    )
                    user_id = cur.fetchone()[0]

                # 4. Link OAuth account in oauth_accounts table
                cur.execute(
                    """
                    INSERT INTO oauth_accounts (user_id, provider, provider_user_id)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (provider, provider_user_id) DO NOTHING;
                    """,
                    (user_id, provider, str(provider_user_id))
                )

            conn.commit()
            return get_user_by_id(user_id)
    finally:
        conn.close()


def get_user_by_email(email):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, username, email, password_hash,
                       COALESCE(language, 'en'),
                       COALESCE(theme, 'dark'),
                       COALESCE(background, 'default'),
                       COALESCE(avatar, 'initial')
                FROM users
                WHERE email = %s;
                """,
                (email,)
            )
            return cur.fetchone()
    finally:
        conn.close()


def get_user_by_id(user_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, username, email,
                       COALESCE(language, 'en'),
                       COALESCE(theme, 'dark'),
                       COALESCE(background, 'default'),
                       COALESCE(avatar, 'initial')
                FROM users
                WHERE id = %s;
                """,
                (user_id,)
            )
            return cur.fetchone()
    finally:
        conn.close()


def update_user_preferences(user_id, language=None, theme=None, background=None, avatar=None):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE users
                SET language = COALESCE(%s, language),
                    theme = COALESCE(%s, theme),
                    background = COALESCE(%s, background),
                    avatar = COALESCE(%s, avatar),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, username, email,
                          COALESCE(language, 'en'),
                          COALESCE(theme, 'dark'),
                          COALESCE(background, 'default'),
                          COALESCE(avatar, 'initial');
                """,
                (language, theme, background, avatar, user_id)
            )
            updated_user = cur.fetchone()
            conn.commit()
            return updated_user
    finally:
        conn.close()


def get_chat_user_id(chat_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT user_id
                FROM chats
                WHERE id = %s;
                """,
                (chat_id,)
            )
            result = cur.fetchone()
            return result[0] if result else None
    finally:
        conn.close()

def delete_messages_from(chat_id: int, message_id: int | None = None) -> bool:
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            if message_id is not None:
                cur.execute(
                    "DELETE FROM messages WHERE chat_id = %s AND id >= %s;",
                    (chat_id, message_id)
                )
            else:
                # حذف آخر رد للـ assistant فقط (في حالة Regenerate)
                cur.execute(
                    """
                    DELETE FROM messages
                    WHERE id = (
                        SELECT id FROM messages
                        WHERE chat_id = %s AND role = 'assistant'
                        ORDER BY id DESC LIMIT 1
                    );
                    """,
                    (chat_id,)
                )
            conn.commit()
            return cur.rowcount > 0
    finally:
        conn.close()