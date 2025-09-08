import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
cors = CORS()

def create_app():
    """Application Factory to create and configure the Flask app."""
    
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    cors.init_app(app, supports_credentials=True)

    # We import them here to avoid circular imports.
    from src.admin import admin_bp
    from src.candidate import candidate_bp
    # from src.employee import employee_bp # This file does not exist, so we comment it out
    from src.files import files_bp
    from src.indeed import indeed_bp
    from src.simple_auth import simple_auth_bp

    app.register_blueprint(admin_bp, url_prefix='/api')
    app.register_blueprint(candidate_bp, url_prefix='/api')
    # app.register_blueprint(employee_bp, url_prefix='/api') # This file does not exist
    app.register_blueprint(files_bp, url_prefix='/api')
    app.register_blueprint(indeed_bp, url_prefix='/api/indeed')
    app.register_blueprint(simple_auth_bp, url_prefix='/api')

    @app.route("/api/health")
    def health_check():
        return "Flask API is running!"

    # IMPORTANT: This route is for one-time use.
    @app.route("/api/init-db/a-very-secret-key-that-you-will-change")
    def init_db():
        with app.app_context():
            db.create_all()
        return "Database tables created successfully!"

    return app

# This is the entry point for Render
app = create_app()
