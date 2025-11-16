from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from config.setting import Settings
from routes.chat import create_chat_blueprint
from services.gemini_service import GeminiChatService


def create_app() -> Flask:
    # Load .env variables (no-op if not present)
    load_dotenv()

    # Initialize Flask app
    app = Flask(__name__)

    # CORS (lock this down to specific origins in production)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Load settings
    settings = Settings.from_env()

    # Initialize Gemini service
    chat_service = GeminiChatService(
    api_key=settings.GEMINI_API_KEY,
    model_name=settings.GEMINI_MODEL,
    system_prompt=settings.load_system_prompt(),
    generation_config=settings.gemini_generation_config()
)
    # Register blueprints
    app.register_blueprint(create_chat_blueprint(chat_service), url_prefix="/api")

    # Health endpoint
    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    return app


if __name__ == "__main__":
    # For local dev: python app.py
    app = create_app()
    host = os.getenv("FLASK_RUN_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_RUN_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "1") == "1"
    app.run(host=host, port=port, debug=debug)
