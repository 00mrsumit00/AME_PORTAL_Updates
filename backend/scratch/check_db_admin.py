import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def check_admin():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.admissions_db
    
    admin = await db.public_admins.find_one({"phone": "3920003920"})
    print(f"Admin with phone 3920003920: {admin}")
    
    all_admins = await db.public_admins.find({}).to_list(length=10)
    print(f"All public admins: {all_admins}")

if __name__ == "__main__":
    asyncio.run(check_admin())
