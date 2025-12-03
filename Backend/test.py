import requests
import json

BASE_URL = "http://127.0.0.1:8080/api"
USER_ID = "user_35l6iiRSXODVUmL5V2v8EEb7CxH"  # Replace with your test user

def test_recommend_colleges():
    response = requests.get(f"{BASE_URL}/colleges/recommend/{USER_ID}")
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=2))
        
        # Assertions
        assert data["success"] is True
        assert isinstance(data["data"], list)
        assert len(data["data"]) <= 10  # Top 10
        assert all("matched_courses" in college for college in data["data"])
        
        # Check sorting (highest rating first)
        ratings = [c["rating"] for c in data["data"]]
        assert ratings == sorted(ratings, reverse=True)  # Non-increasing
        
        print("✅ All tests passed!")
    else:
        print(f"❌ Failed: {response.text}")

if __name__ == "__main__":
    test_recommend_colleges()