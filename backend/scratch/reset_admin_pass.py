import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def reset_admin_password():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.ame_portal
    
    phone = "3920003920"
    new_pass = "Virus392k"
    hashed = hash_password(new_pass)
    
    res = await db.public_admins.update_one(
        {"phone": phone},
        {"$set": {"password": hashed}}
    )
    print(f"Updated {res.modified_count} admin accounts. New password set to: {new_pass}")

if __name__ == "__main__":
    asyncio.run(reset_admin_password())
