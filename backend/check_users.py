import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'ame_portal')

async def check_users():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(100)
    print(f"Total Users: {len(users)}")
    for u in users:
        print(f"- {u.get('name')} ({u.get('email')}, Role: {u.get('role')})")

if __name__ == "__main__":
    asyncio.run(check_users())
