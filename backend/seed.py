import asyncio
import os
import certifi
import uuid
import bcrypt
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'ame_portal')

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def seed():
    # Robust connection for Cloud environments (Render/Atlas)
    try:
        print(f"Connecting to: {DB_NAME} (Secure Mode)...")
        client = AsyncIOMotorClient(
            MONGO_URL,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=20000,
            retryWrites=True,
            tlsCAFile=certifi.where()
        )
        db = client[DB_NAME]
    except Exception as e:
        print(f"Connection error: {e}")
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
    
    # Ensure Master Admin
    admin = await db.users.find_one({"role": "ADMIN"})
    admin_data = {
        "email": "virus392k@gmail.com",
        "password": hash_password("Virus@392k"),
        "name": "Super Admin",
        "role": "ADMIN",
        "is_active": True,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    if not admin:
        admin_data["id"] = str(uuid.uuid4())
        admin_data["created_at"] = admin_data["updated_at"]
        await db.users.insert_one(admin_data)
        print("✅ Master Admin created: virus392k@gmail.com / Virus@392k")
    else:
        await db.users.update_one({"id": admin["id"]}, {"$set": admin_data})
        print("✅ Master Admin updated: virus392k@gmail.com / Virus@392k")

    # Seed some mock data if needed (optional)
    
    print("Done seeding!")

if __name__ == "__main__":
    asyncio.run(seed())
