import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

async def check():
    url = "mongodb+srv://ame_admin:AMEportal2026@ame-portal-cluster.qo43ruc.mongodb.net/ame_portal?retryWrites=true&w=majority"
    client = AsyncIOMotorClient(url)
    db = client.get_default_database()
    print(f"Database: {db.name}")
    collections = await db.list_collection_names()
    print(f"Collections: {collections}")
    
    if "users" in collections:
        count = await db.users.count_documents({})
        print(f"Users count: {count}")
        async for user in db.users.find({}, {"password": 0}):
            print(f"User: {user.get('name')} ({user.get('role')}) - {user.get('email')}")
    else:
        print("❌ 'users' collection not found!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check())
