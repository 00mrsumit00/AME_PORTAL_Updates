import requests
import json

def test_login():
    url = "http://localhost:8000/api/public/auth/login"
    payload = {
        "phone": "3920003920",
        "password": "Virus392k"
    }
    
    print(f"Testing login at {url}...")
    print(f"Payload: {payload}")
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error connecting to server: {e}")

if __name__ == "__main__":
    test_login()
