import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def revert_db_changes():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.ame_portal
    
    # 1. Reset Master Admin password to original and remove phone
    email = "vikrant39@gmail.com"
    original_pass = "Virus@392k"
    
    res = await db.public_admins.update_one(
        {"email": email},
        {
            "$set": {"password": hash_password(original_pass)},
            "$unset": {"phone": ""}
        }
    )
    print(f"Reverted Master Admin account ({email}).")
    
    # 2. Cleanup any sub-admins that might have phone numbers (optional but cleaner)
    await db.public_admins.update_many({}, {"$unset": {"phone": ""}})
    print("Removed 'phone' field from all admin accounts.")

if __name__ == "__main__":
    asyncio.run(revert_db_changes())
