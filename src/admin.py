from flask import Blueprint, request, jsonify
from models.user import db
from models.auth import AdminUser
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/users', methods=['GET'])
def get_users():
    """Get all users"""
    try:
        users = AdminUser.query.all()
        return jsonify([{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'is_active': user.is_active,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'last_login': user.last_login.isoformat() if user.last_login else None
        } for user in users])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        
        required_fields = ['username', 'email', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        if AdminUser.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
            
        if AdminUser.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        password_hash = generate_password_hash(data['password'])
        
        user = AdminUser(
            username=data['username'],
            email=data['email'],
            password_hash=password_hash,
            role=data['role'],
            is_active=data.get('is_active', True)
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'is_active': user.is_active,
            'created_at': user.created_at.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update a user"""
    try:
        user = AdminUser.query.get_or_404(user_id)
        data = request.get_json()
        
        if 'username' in data:
            existing = AdminUser.query.filter(AdminUser.username == data['username'], AdminUser.id != user_id).first()
            if existing:
                return jsonify({'error': 'Username already exists'}), 400
            user.username = data['username']
            
        if 'email' in data:
            existing = AdminUser.query.filter(AdminUser.email == data['email'], AdminUser.id != user_id).first()
            if existing:
                return jsonify({'error': 'Email already exists'}), 400
            user.email = data['email']
            
        if 'role' in data:
            user.role = data['role']
            
        if 'is_active' in data:
            user.is_active = data['is_active']
            
        if 'password' in data and data['password']:
            password_hash = generate_password_hash(data['password'])
            user.password_hash = password_hash
        
        db.session.commit()
        
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'is_active': user.is_active,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'last_login': user.last_login.isoformat() if user.last_login else None
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user"""
    try:
        user = AdminUser.query.get_or_404(user_id)
        
        if user.role == 'admin':
            admin_count = AdminUser.query.filter_by(role='admin', is_active=True).count()
            if admin_count <= 1:
                return jsonify({'error': 'Cannot delete the last admin user'}), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/database/stats', methods=['GET'])
def get_database_stats():
    """Get database statistics"""
    try:
        from models.candidate import Candidate
        from models.employee import Employee
        
        stats = {
            'total_candidates': Candidate.query.count(),
            'total_employees': Employee.query.count(),
            'total_users': AdminUser.query.count(),
            'active_users': AdminUser.query.filter_by(is_active=True).count(),
            'candidate_pipeline_stats': {
                'applied': Candidate.query.filter_by(pipeline_status='Applied').count(),
                'interviewing': Candidate.query.filter_by(pipeline_status='Interviewing').count(),
                'offered': Candidate.query.filter_by(pipeline_status='Offered').count(),
                'approved': Candidate.query.filter_by(admin_approval='Approved').count(),
                'pending': Candidate.query.filter_by(admin_approval='Pending').count(),
                'denied': Candidate.query.filter_by(admin_approval='Denied').count()
            }
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
