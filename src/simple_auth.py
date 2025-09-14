from flask import Blueprint, request, jsonify, session
from models.auth import AdminUser
from models.user import db
from werkzeug.security import check_password_hash
from datetime import datetime, timedelta
import secrets

simple_auth_bp = Blueprint('simple_auth', __name__)

@simple_auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Simple authentication login"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        # Find user by username or email
        user = AdminUser.query.filter(
            (AdminUser.username == username) | (AdminUser.email == username)
        ).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is disabled'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create session
        session_id = secrets.token_urlsafe(32)
        session['user_id'] = user.id
        session['session_id'] = session_id
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@simple_auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    """Simple authentication logout"""
    try:
        session.clear()
        return jsonify({'message': 'Logout successful'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@simple_auth_bp.route('/auth/me', methods=['GET'])
def get_current_user():
    """Get current authenticated user"""
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user = AdminUser.query.get(user_id)
        if not user or not user.is_active:
            session.clear()
            return jsonify({'error': 'User not found or inactive'}), 401
        
        return jsonify({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'last_login': user.last_login.isoformat() if user.last_login else None
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@simple_auth_bp.route('/auth/register', methods=['POST'])
def register():
    """Simple user registration (for initial setup)"""
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({'error': 'Username, email, and password required'}), 400
        
        # Check if user already exists
        existing_user = AdminUser.query.filter(
            (AdminUser.username == username) | (AdminUser.email == email)
        ).first()
        
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        # Create new user
        user = AdminUser(
            username=username,
            email=email,
            role='admin'
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

