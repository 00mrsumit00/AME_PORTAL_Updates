import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import bcrypt
from datetime import datetime, timezone

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def fix_admin():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    # Check server.py's DB name
    db = client.ame_portal
    
    admin_email = "vikrant39@gmail.com"
    admin_phone = "3920003920"
    
    admin = await db.public_admins.find_one({"email": admin_email})
    if admin:
        print(f"Found existing admin by email: {admin_email}")
        await db.public_admins.update_one(
            {"email": admin_email},
            {"$set": {"phone": admin_phone}}
        )
        print(f"Updated admin with phone: {admin_phone}")
    else:
        print(f"Admin not found. Creating new admin...")
        await db.public_admins.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "phone": admin_phone,
            "password": hash_password("Virus@392k"),
            "name": "Vikrant (Master Admin)",
            "role": "PUBLIC_ADMIN",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        print(f"Created new master admin: {admin_email}")

    # Verify
    verify = await db.public_admins.find_one({"phone": admin_phone})
    print(f"Verification: {verify}")

if __name__ == "__main__":
    asyncio.run(fix_admin())
