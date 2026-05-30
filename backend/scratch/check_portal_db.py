
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

async def check_db():
    load_dotenv()
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'ame_portal')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print(f"Checking collection 'portal_config' in {db_name}...")
    ticker = await db.portal_config.find_one({"type": "ticker"})
    print(f"Ticker: {ticker}")
    
    print("\nChecking collection 'public_updates'...")
    updates = await db.public_updates.count_documents({})
    print(f"Updates count: {updates}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_db())
