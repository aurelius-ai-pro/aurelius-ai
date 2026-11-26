from database.db import get_connection


def create_tables():
    conn = get_connection()

    try:
        with conn.cursor() as cur:

            # =========================
            # USERS
            # =========================
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(100) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash TEXT,
                    avatar_url TEXT,
                    avatar TEXT DEFAULT 'initial|none',
                    language VARCHAR(10) DEFAULT 'en',
                    theme VARCHAR(20) DEFAULT 'dark',
                    background VARCHAR(30) DEFAULT 'default',
                    provider VARCHAR(30) DEFAULT 'local',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Add authentication & user preference columns if table already exists
            cur.execute("""
                ALTER TABLE users
                ADD COLUMN IF NOT EXISTS password_hash TEXT,
                ADD COLUMN IF NOT EXISTS avatar_url TEXT,
                ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT 'initial|none',
                ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en',
                ADD COLUMN IF NOT EXISTS theme VARCHAR(20) DEFAULT 'dark',
                ADD COLUMN IF NOT EXISTS background VARCHAR(30) DEFAULT 'default',
                ADD COLUMN IF NOT EXISTS provider VARCHAR(30) DEFAULT 'local',
                ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
            """)

            # Upgrade existing avatar column from VARCHAR(50) to TEXT to store custom cropped photos + frames
            cur.execute("""
                ALTER TABLE users
                ALTER COLUMN avatar TYPE TEXT;
            """)

            # =========================
            # CHATS
            # =========================
            cur.execute("""
                CREATE TABLE IF NOT EXISTS chats (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    title VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # =========================
            # MESSAGES
            # =========================
            cur.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id SERIAL PRIMARY KEY,
                    chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
                    role VARCHAR(20) NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # =========================
            # OAUTH ACCOUNTS
            # =========================
            cur.execute("""
                CREATE TABLE IF NOT EXISTS oauth_accounts (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL
                        REFERENCES users(id) ON DELETE CASCADE,
                    provider VARCHAR(50) NOT NULL,
                    provider_user_id VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                    UNIQUE(provider, provider_user_id)
                );
            """)

        conn.commit()
        print("Database tables created/updated successfully!")

    finally:
        conn.close()


if __name__ == "__main__":
    create_tables()