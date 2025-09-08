import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

# This will load variables from a .env file for local development
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
cors = CORS()

def create_app():
    """Application Factory to create and configure the Flask app."""
    
    app = Flask(__name__)

    # --- Configuration ---
    # Load secrets from environment variables
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # --- Initialize Extensions ---
    db.init_app(app)
    cors.init_app(app, supports_credentials=True)

    # --- Register API Blueprints ---
    # We import them here to avoid circular imports.
    from src.admin import admin_bp
    from src.candidate import candidate_bp
    from src.employee import employee_bp
    from src.files import files_bp
    from src.indeed import indeed_bp

    app.register_blueprint(admin_bp, url_prefix='/api')
    app.register_blueprint(candidate_bp, url_prefix='/api')
    app.register_blueprint(employee_bp, url_prefix='/api')
    app.register_blueprint(files_bp, url_prefix='/api')
    app.register_blueprint(indeed_bp, url_prefix='/api/indeed')

    # --- Health Check Route ---
    @app.route("/api/health")
    def health_check():
        return "Flask API is running!"

    # --- Temporary route to initialize the database ---
    # IMPORTANT: Change the secret_key or delete this route after use
    @app.route("/api/init-db/a-very-secret-key-that-you-will-change")
    def init_db():
        with app.app_context():
            db.create_all()
        return "Database tables created successfully!"

    # This is the correct location for the return statement
    return app

# Vercel will look for a callable 'app' object.
app = create_app()
