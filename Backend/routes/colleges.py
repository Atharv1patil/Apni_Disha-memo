

# Backend/routes/colleges.py

from flask import Blueprint, request, jsonify
from services.connectDB import connect_db
from bson import ObjectId
from pymongo import UpdateOne
import json
import re  # For fuzzy matching if needed

college_routes = Blueprint("college_routes", __name__)


def serialize_college(doc):
    doc["_id"] = str(doc["_id"])
    # Ensure interest is always present
    doc["interest"] = int(doc.get("interest", 0))
    return doc


# Degree to short_name mapping (expand as needed based on quiz degrees)
DEGREE_TO_SHORTNAME = {
    "B.Tech": "BTECH",
    "B.Arch": "BARCH",
    "BBA": "BBA",
    "MBA": "MBA",
    "B.Com": "BCOM",
    "B.Sc": "BSC",
    "BCA": "BCA",
    "B.Des": "BDES",
    "BA": "BA",
    "B.Pharm": "BPHARM",
    # Add more mappings as per quiz outputs
}


def get_short_name_from_degree(degree_name):
    """Map degree name to short_name. Use fuzzy if exact not found."""
    short_name = DEGREE_TO_SHORTNAME.get(degree_name)
    if short_name:
        return short_name.upper()
    
    # Fuzzy fallback: e.g., "B.Tech in Civil" -> "BTECH"
    degree_upper = degree_name.upper()
    if "B.TECH" in degree_upper:
        return "BTECH"
    if "B.ARCH" in degree_upper:
        return "BARCH"
    if "BBA" in degree_upper:
        return "BBA"
    if "MBA" in degree_upper:
        return "MBA"
    if "B.COM" in degree_upper or "BCOM" in degree_upper:
        return "BCOM"
    if "B.SC" in degree_upper:
        return "BSC"
    if "BCA" in degree_upper:
        return "BCA"
    if "B.DES" in degree_upper:
        return "BDES"
    if "BA" in degree_upper:
        return "BA"
    if "B.PHARM" in degree_upper:
        return "BPHARM"
    return None


def matches_specialization(quiz_specs, course_specs):
    """Check if any quiz specialization matches any course specialization (case-insensitive partial match)."""
    if not quiz_specs or not course_specs:
        return True  # If no specs, consider match
    quiz_specs = [s.lower() for s in quiz_specs]
    course_specs = [s.lower() for s in course_specs if s]  # Filter None/empty
    for q_spec in quiz_specs:
        if any(q_spec in c_spec for c_spec in course_specs):
            return True
    return False


def parse_rating(val):
    """Parse rating to float, handling strings like '4.5' or null/None."""
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    if isinstance(val, str):
        # Extract numeric part, e.g., "4.5" or "4.5/5"
        match = re.search(r'(\d+(?:\.\d+)?)', val)
        return float(match.group(1)) if match else 0.0
    return 0.0


def parse_reviews_count(val):
    """Parse reviews_count to int, handling strings like '38 Student Reviews' or '5 reviews' or null/None."""
    if val is None:
        return 0
    if isinstance(val, int):
        return val
    if isinstance(val, str):
        # Extract numeric part, e.g., "38 Student Reviews" → 38
        match = re.search(r'(\d+)', val)
        return int(match.group(1)) if match else 0
    return 0


def parse_nirf_rank(val):
    """Parse nirf_rank to int or None."""
    if val is None:
        return None
    if isinstance(val, int):
        return val
    if isinstance(val, str):
        match = re.search(r'\d+', val)
        return int(match.group()) if match else None
    return None


# -----------------------------------
# GET /api/colleges  -> list colleges
# -----------------------------------
@college_routes.route("/colleges", methods=["GET"])
def get_colleges():
    db = connect_db()
    colleges_cursor = db.College.find()

    colleges = [serialize_college(c) for c in colleges_cursor]

    # total interest to help frontend compute %
    total_interest = sum(c["interest"] for c in colleges)

    return jsonify({
        "success": True,
        "data": colleges,
        "totalInterest": total_interest,
        "total": len(colleges)
    }), 200


# -----------------------------------
# POST /api/colleges -> add new college (optional)
# -----------------------------------
@college_routes.route("/colleges", methods=["POST"])
def add_college():
    db = connect_db()
    data = request.json or {}

    # default interest = 0
    data.setdefault("interest", 0)

    result = db.College.insert_one(data)

    return jsonify({
        "success": True,
        "message": "College added successfully",
        "id": str(result.inserted_id)
    }), 201


# -------------------------------------------------
# POST /api/colleges/interest-batch
# body: { "interest": { "<collegeId>": increment, ... } }
# -------------------------------------------------
@college_routes.route("/colleges/interest-batch", methods=["POST"])
def interest_batch():
    db = connect_db()

    # Read raw body (works for sendBeacon + fetch + axios)
    raw_data = request.get_data(as_text=True)
    print("🔥 RAW interest-batch BODY:", raw_data)

    payload = {}
    if raw_data:
        try:
            payload = json.loads(raw_data)
        except Exception as e:
            print("⚠ Failed to parse JSON from raw_data:", e)
            # fallback: try normal get_json
            payload = request.get_json(silent=True) or {}
    else:
        payload = request.get_json(silent=True) or {}

    interest_map = payload.get("interest", {})
    print("🧩 Parsed interest_map:", interest_map)

    if not isinstance(interest_map, dict) or not interest_map:
        return jsonify({"success": False, "message": "No interest data"}), 400

    updated_ids = []

    for college_id, inc in interest_map.items():
        try:
            inc = int(inc)
            if inc <= 0:
                continue

            # Try ObjectId, fallback to string ID
            try:
                oid = ObjectId(college_id)
                filter_query = {"_id": oid}
            except Exception:
                filter_query = {"_id": college_id}

            result = db.College.update_one(
                filter_query, {"$inc": {"interest": inc}})

            if result.modified_count > 0:
                updated_ids.append(college_id)
                print(f"✅ Incremented interest for {college_id} by {inc}")
            else:
                print(f"⚠ No document matched for {college_id}")

        except Exception as e:
            print("❌ Interest update error:", e)
            continue

    print("📊 Final updated_ids:", updated_ids)

    return jsonify({"success": True, "updated": updated_ids}), 200


@college_routes.route("/colleges/update-many", methods=["PUT"])
def update_many_colleges():
    db = connect_db()

    # Read JSON safely
    payload = request.get_json(silent=True) or {}
    updates = payload.get("updates", [])

    # If nothing to update → return early (no error)
    if not isinstance(updates, list) or len(updates) == 0:
        return jsonify({
            "success": True,
            "updated": [],
            "count": 0,
            "message": "No updates provided"
        }), 200

    bulk_ops = []
    updated_ids = []

    for item in updates:
        college_id = item.get("_id")
        update_data = item.get("data")

        # Validate each item
        if not college_id or not isinstance(update_data, dict):
            continue

        # Convert ID to ObjectId if possible
        try:
            oid = ObjectId(college_id)
        except:
            oid = college_id  # fallback string ID

        # Add bulk update operation
        bulk_ops.append(
            UpdateOne(
                {"_id": oid},
                {"$set": update_data}
            )
        )
        updated_ids.append(college_id)

    # Run bulk update
    if len(bulk_ops) > 0:
        db.College.bulk_write(bulk_ops)

    return jsonify({
        "success": True,
        "updated": updated_ids,
        "count": len(updated_ids),
        "message": "Bulk update completed"
    }), 200


# -------------------------------------------------
# GET /api/colleges/recommend/<user_id>
# Recommend top 15 colleges: 10 in Nagpur (priority), then 5 outside
# -------------------------------------------------
@college_routes.route("/colleges/recommend/<user_id>", methods=["GET"])
def recommend_colleges(user_id):
    db = connect_db()
    
    # Fetch student profile
    student = db.Students.find_one({"user_id": user_id})
    if not student:
        return jsonify({"success": False, "message": "Student not found"}), 404
    
    quiz_results = student.get("quiz_results")
    if not quiz_results or not quiz_results.get("recommendations"):
        return jsonify({"success": False, "message": "No quiz results available"}), 404
    
    # Extract unique degrees and their specializations from recommendations
    all_degrees = {}
    for rec in quiz_results["recommendations"]:
        for degree_obj in rec.get("degrees", []):
            degree_name = degree_obj.get("degree", "").strip()
            specs = degree_obj.get("specializations", [])
            short_name = get_short_name_from_degree(degree_name)
            if short_name:
                # Merge specs for same short_name
                if short_name in all_degrees:
                    all_degrees[short_name].extend(specs)
                else:
                    all_degrees[short_name] = specs
                # Deduplicate specs
                all_degrees[short_name] = list(set(all_degrees[short_name]))
    
    if not all_degrees:
        return jsonify({"success": False, "message": "No matching degrees found"}), 400
    
    # Find colleges with matching courses
    nagpur_colleges = []
    outside_nagpur = []
    for college in db.College.find():
        college_dict = serialize_college(dict(college))
        matched_courses = []
        
        for course in college.get("courses", []):
            # Safely handle short_name
            short_name_val = course.get("short_name")
            course_short = (short_name_val or "").upper() if isinstance(short_name_val, str) else ""
            
            if course_short in all_degrees:
                course_specs = course.get("specializations") or []
                if matches_specialization(all_degrees[course_short], course_specs):
                    matched_courses.append({
                        "name": course.get("name"),
                        "short_name": course_short,
                        "specializations": course_specs,
                        "duration": course.get("duration"),
                        "eligibility": course.get("eligibility"),
                        "tuition_fee": course.get("tuition_fee"),
                        "annual_fee": course.get("annual_fee")
                    })
        
        if matched_courses:
            college_dict["matched_courses"] = matched_courses
            # Parse sorting fields
            nirf_rank = parse_nirf_rank(college_dict.get("nirf_rank"))
            college_dict["nirf_rank_parsed"] = nirf_rank  # For sorting
            college_dict["rating"] = parse_rating(college_dict.get("rating"))
            college_dict["reviews_count"] = parse_reviews_count(college_dict.get("reviews_count"))
            
            # Split by Nagpur (check district or nirf_city)
            is_nagpur = (
                college_dict.get("district", "").lower() == "nagpur" or
                college_dict.get("nirf_city", "").lower() == "nagpur"
            )
            if is_nagpur:
                nagpur_colleges.append(college_dict)
            else:
                outside_nagpur.append(college_dict)
    
    # Custom sort key: nirf_rank asc (lower better, None last), then reviews desc, then rating desc
    def sort_key(c):
        rank = c["nirf_rank_parsed"] if c["nirf_rank_parsed"] is not None else float('inf')
        return (rank, -c["reviews_count"], -c["rating"])
    
    # Sort both lists
    nagpur_colleges.sort(key=sort_key)
    outside_nagpur.sort(key=sort_key)
    
    # Top 10 Nagpur + Top 5 outside (or adjust if fewer)
    top_nagpur = nagpur_colleges[:10]
    top_outside = outside_nagpur[:5]
    top_colleges = top_nagpur + top_outside
    
    if not top_colleges:
        return jsonify({"success": True, "data": [], "message": "No matching colleges found"}), 200
    
    return jsonify({
        "success": True,
        "data": top_colleges,
        "total": len(nagpur_colleges) + len(outside_nagpur),
        "nagpur_count": len(top_nagpur),
        "outside_count": len(top_outside),
        "message": f"Recommended {len(top_colleges)} colleges: {len(top_nagpur)} in Nagpur, {len(top_outside)} outside"
    }), 200

