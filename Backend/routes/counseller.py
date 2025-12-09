"""
Career Mentor API
==================
Flask API endpoint for the Career Mentor AI Agent.
Provides a single endpoint for chat with conversation history support.
"""

from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from typing import Dict
import os
from dotenv import load_dotenv
from services.connectDB import connect_db
import json
from .career_mentor_agent import create_agent, CareerMentorAgent

counseller_routes = Blueprint("counseller_routes", __name__)


# Load environment variables
load_dotenv()



# Store active agent sessions (user_id -> CareerMentorAgent)
# In production, you'd want to use Redis or a database for this
agent_sessions: Dict[str, CareerMentorAgent] = {}


def get_or_create_agent(user_id: str) -> CareerMentorAgent:
    """
    Get an existing agent for a user or create a new one.
    
    Args:
        user_id: The user's unique identifier.
        
    Returns:
        CareerMentorAgent instance for the user.
    """
    if user_id not in agent_sessions:
        agent_sessions[user_id] = create_agent(user_id=user_id, verbose=False)
        print(f"[API] Created new agent session for user: {user_id}")
    return agent_sessions[user_id]


@counseller_routes.route('/counseller/chat', methods=['POST'])
def chat():
    """
    Chat endpoint for the Career Mentor AI.
    
    Request JSON:
    {
        "user_id": "unique_user_id",
        "message": "User's message here"
    }
    
    Response JSON:
    {
        "success": true,
        "response": "AI's response here",
        "user_id": "unique_user_id"
    }
    
    Error Response:
    {
        "success": false,
        "error": "Error message here"
    }
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data provided"
            }), 400
        
        # Validate required fields
        user_id = data.get("user_id")
        message = data.get("message")
        
        if not user_id:
            return jsonify({
                "success": False,
                "error": "user_id is required"
            }), 400
        
        if not message:
            return jsonify({
                "success": False,
                "error": "message is required"
            }), 400
        
        # Get or create agent for this user
        agent = get_or_create_agent(user_id)
        
        # Get response from agent
        response = agent.chat(message)
        
        return jsonify({
            "success": True,
            "response": response,
            "user_id": user_id
        })
        
    except Exception as e:
        print(f"[API ERROR] {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@counseller_routes.route('/counseller/clear', methods=['POST'])
def clear_history():
    """
    Clear conversation history for a user.
    
    Request JSON:
    {
        "user_id": "unique_user_id"
    }
    
    Response JSON:
    {
        "success": true,
        "message": "Conversation history cleared"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data provided"
            }), 400
        
        user_id = data.get("user_id")
        
        if not user_id:
            return jsonify({
                "success": False,
                "error": "user_id is required"
            }), 400
        
        # Get agent and clear history
        if user_id in agent_sessions:
            agent_sessions[user_id].clear_history()
        
        return jsonify({
            "success": True,
            "message": "Conversation history cleared",
            "user_id": user_id
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@counseller_routes.route('/counseller/history', methods=['POST'])
def get_history():
    """
    Get conversation history for a user.
    
    Request JSON:
    {
        "user_id": "unique_user_id"
    }
    
    Response JSON:
    {
        "success": true,
        "history": [
            {"role": "user", "content": "..."},
            {"role": "assistant", "content": "..."}
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data provided"
            }), 400
        
        user_id = data.get("user_id")
        
        if not user_id:
            return jsonify({
                "success": False,
                "error": "user_id is required"
            }), 400
        
        # Get history if agent exists
        history = []
        if user_id in agent_sessions:
            history = agent_sessions[user_id].get_history()
            return jsonify({
                "success": True,
                "history": history,
                "user_id": user_id
                })
        else:
                #no user history, new desu
                print("new user ig")
                return jsonify({
                    "success": True,
                    "history": history,
                    "user_id": user_id
                })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@counseller_routes.route('/counseller/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "Career Mentor API",
        "active_sessions": len(agent_sessions)
    })


""" if __name__ == '__main__':
    print("\n" + "="*60)
    print("CAREER MENTOR API")
    print("="*60)
    print("Starting Flask server...")
    print("\nEndpoints:")
    print("  POST /chat    - Send a message to the AI mentor")
    print("  POST /clear   - Clear conversation history")
    print("  POST /history - Get conversation history")
    print("  GET  /health  - Health check")
    print("="*60 + "\n")
    
    # Run the Flask counseller_routes
    counseller_routes.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    ) """
