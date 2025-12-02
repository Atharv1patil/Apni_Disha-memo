import requests
import json

BASE_URL = "http://127.0.0.1:8080/api/quiz"

def print_full_json(data):
    """Pretty print the full JSON response"""
    print(json.dumps(data, indent=2, ensure_ascii=False))

def print_recommendations_detailed(recommendations):
    """Print recommendations in a readable format"""
    print("\n" + "=" * 60)
    print("CAREER RECOMMENDATIONS")
    print("=" * 60)
    
    for i, rec in enumerate(recommendations, 1):
        print(f"\n--- Career {i}: {rec.get('career', 'N/A')} ---")
        print(f"Stream: {rec.get('stream', 'N/A')}")
        print(f"Reason: {rec.get('reason', 'N/A')}")
        print("\nDegrees:")
        for deg in rec.get('degrees', []):
            print(f"  • {deg.get('degree', 'N/A')}")
            specs = deg.get('specializations', [])
            if specs:
                print(f"    Specializations: {', '.join(specs)}")
    
    print("\n" + "=" * 60)

def test_get_questions():
    print("\n--- Testing GET /questions ---")
    response = requests.get(f"{BASE_URL}/questions")
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"Total questions: {len(data.get('questions', []))}")
        print(f"Categories: {list(data.get('questions', {}).keys()) if isinstance(data.get('questions'), dict) else 'list format'}")
    else:
        print(f"Error: {response.text}")

def test_calculate_scores():
    print("\n--- Testing POST /calculate-scores ---")
    payload = {
        "answers": [
            {"trait": "R", "question": "I enjoy working with tools and machines", "rating": 4},
            {"trait": "I", "question": "I enjoy solving complex problems", "rating": 3},
            {"trait": "A", "question": "I enjoy creative activities", "rating": 5},
            {"trait": "S", "question": "I enjoy helping others", "rating": 2},
            {"trait": "E", "question": "I enjoy leading teams", "rating": 3},
            {"trait": "C", "question": "I enjoy organizing data", "rating": 1}
        ]
    }
    response = requests.post(f"{BASE_URL}/calculate-scores", json=payload)
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"Raw Scores: {data.get('raw_scores')}")
        print(f"Normalized Scores: {data.get('normalized_scores')}")
        print(f"Top Traits: {data.get('top_traits')}")
    else:
        print(f"Error: {response.text}")

def test_next_question():
    print("\n--- Testing POST /next-question ---")
    payload = {
        "questions_asked": {
            "R": ["I enjoy working with tools and machines"],
            "I": ["I enjoy solving complex problems"],
            "A": [],
            "S": [],
            "E": [],
            "C": []
        }
    }
    response = requests.post(f"{BASE_URL}/next-question", json=payload)
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"Trait: {data.get('trait')}")
        print(f"Question: {data.get('question')}")
    else:
        print(f"Error: {response.text}")

def test_submit_quiz():
    print("\n--- Testing POST /submit (Full Quiz) ---")
    payload = {
        "answers": [
            {"trait": "R", "question": "I enjoy building or fixing things with my hands", "rating": 5},
            {"trait": "I", "question": "I like to analyze problems and conduct research", "rating": 4},
            {"trait": "A", "question": "I enjoy creative activities like drawing, painting or design", "rating": 5},
            {"trait": "S", "question": "I enjoy helping and teaching others", "rating": 3},
            {"trait": "E", "question": "I enjoy leading groups and persuading others", "rating": 2},
            {"trait": "C", "question": "I enjoy organizing information and following procedures", "rating": 2}
        ]
    }
    response = requests.post(f"{BASE_URL}/submit", json=payload)
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print("\n=== FULL JSON RESPONSE ===")
        print_full_json(data)
        
        # Also print detailed recommendations
        if data.get('recommendations'):
            print_recommendations_detailed(data['recommendations'])
    else:
        print(f"Error: {response.text}")

def test_recommendations():
    print("\n--- Testing POST /recommendations ---")
    payload = {
        "qa_history": [
            {"trait": "R", "question": "I enjoy building or fixing things with my hands", "rating": 5},
            {"trait": "I", "question": "I like to analyze problems and conduct research", "rating": 4},
            {"trait": "A", "question": "I enjoy creative activities like drawing, painting or design", "rating": 5},
            {"trait": "S", "question": "I enjoy helping and teaching others", "rating": 3},
            {"trait": "E", "question": "I enjoy leading groups and persuading others", "rating": 2},
            {"trait": "C", "question": "I enjoy organizing information and following procedures", "rating": 2}
        ],
        "normalized_scores": {"R": 1.0, "I": 0.75, "A": 1.0, "S": 0.5, "E": 0.25, "C": 0.25}
    }
    response = requests.post(f"{BASE_URL}/recommendations", json=payload)
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print("\n=== FULL RECOMMENDATIONS JSON ===")
        print_full_json(data)
        
        # Also print detailed recommendations
        if data.get('recommendations'):
            print_recommendations_detailed(data['recommendations'])
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    print("=" * 50)
    print("QUIZ API TESTS")
    print("=" * 50)
    print("Make sure Flask is running on localhost:5000")
    
    test_get_questions()
    test_calculate_scores()
    test_next_question()
    test_submit_quiz()
    test_recommendations()
    
    print("\n" + "=" * 50)
    print("TESTS COMPLETE")
    print("=" * 50)
