import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

async def verify_db_credentials():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.ame_portal
    
    phone = "3920003920"
    password_to_test = "Virus392k"
    
    admin = await db.public_admins.find_one({"phone": phone})
    if not admin:
        print(f"FAILED: Admin with phone {phone} not found in DB!")
        return

    print(f"Found admin: {admin['name']}")
    hashed = admin['password']
    print(f"Hashed password in DB: {hashed}")
    
    match = verify_password(password_to_test, hashed)
    print(f"Password match for '{password_to_test}': {match}")

if __name__ == "__main__":
    asyncio.run(verify_db_credentials())
