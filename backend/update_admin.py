import asyncio
import os
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'ame_portal')

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def update_admin():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    new_email = "virus392k@gmail.com"
    new_password = hash_password("Virus@392k")
    
    print(f"Connecting to {MONGO_URL}, DB: {DB_NAME}")
    
    # Try to find the old admin or update any admin
    old_admin = await db.users.find_one({"role": "ADMIN"})
    
    if old_admin:
        await db.users.update_one(
            {"id": old_admin["id"]},
            {"$set": {
                "email": new_email,
                "password": new_password,
                "name": "Super Admin"
            }}
        )
        print(f"[SUCCESS] Master Admin updated: {new_email} / Virus@392k")
    else:
        # Create new one if none exists
        import uuid
        from datetime import datetime, timezone
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": new_email,
            "password": new_password,
            "name": "Super Admin",
            "role": "ADMIN",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        print(f"[SUCCESS] Master Admin created: {new_email} / Virus@392k")

if __name__ == "__main__":
    asyncio.run(update_admin())
