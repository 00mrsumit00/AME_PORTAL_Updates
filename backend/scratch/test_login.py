import requests
import json

BASE_URL = "http://localhost:8000"

def test_login():
    print("Testing /api/auth/login...")
    payload = {
        "email": "vikrantame@gmail.com",
        "password": "8983001441"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Login Successful!")
        print(f"Response: {response.json()}")
    else:
        print("Login Failed!")
        print(f"Response: {response.text}")

if __name__ == "__main__":
    test_login()
