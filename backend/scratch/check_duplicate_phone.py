import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_duplicate_phone():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.ame_portal
    
    phone = "3920003920"
    
    student = await db.public_users.find_one({"phone": phone})
    admin = await db.public_admins.find_one({"phone": phone})
    
    print(f"Student with phone {phone}: {student}")
    print(f"Admin with phone {phone}: {admin}")

if __name__ == "__main__":
    asyncio.run(check_duplicate_phone())
