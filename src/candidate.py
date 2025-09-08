from flask import Blueprint, request, jsonify
from models.user import db
from models.candidate import Candidate
from datetime import datetime

candidate_bp = Blueprint('candidate', __name__)

@candidate_bp.route('/candidates', methods=['GET'])
def get_candidates():
    """Get all candidates with optional filtering"""
    try:
        pipeline_status = request.args.get('pipeline_status')
        admin_approval = request.args.get('admin_approval')
        
        query = Candidate.query
        
        if pipeline_status:
            query = query.filter(Candidate.pipeline_status == pipeline_status)
        if admin_approval:
            query = query.filter(Candidate.admin_approval == admin_approval)
            
        candidates = query.all()
        return jsonify([candidate.to_dict() for candidate in candidates])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@candidate_bp.route('/candidates', methods=['POST'])
def create_candidate():
    """Create a new candidate"""
    try:
        data = request.get_json()
        
        required_fields = ['first_name', 'last_name', 'email']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        candidate = Candidate(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone=data.get('phone'),
            resume_path=data.get('resume_path'),
            pipeline_status=data.get('pipeline_status', 'Applied'),
            admin_approval=data.get('admin_approval', 'Pending'),
            indeed_registration_id=data.get('indeed_registration_id'),
            ats_candidate_id=data.get('ats_candidate_id'),
            ats_application_id=data.get('ats_application_id'),
            indeed_status=data.get('indeed_status')
        )
        
        db.session.add(candidate)
        db.session.commit()
        
        return jsonify(candidate.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@candidate_bp.route('/candidates/<int:candidate_id>', methods=['GET'])
def get_candidate(candidate_id):
    """Get a specific candidate by ID"""
    try:
        candidate = Candidate.query.get_or_404(candidate_id)
        return jsonify(candidate.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@candidate_bp.route('/candidates/<int:candidate_id>', methods=['PUT'])
def update_candidate(candidate_id):
    """Update a candidate"""
    try:
        candidate = Candidate.query.get_or_404(candidate_id)
        data = request.get_json()
        
        if 'first_name' in data:
            candidate.first_name = data['first_name']
        if 'last_name' in data:
            candidate.last_name = data['last_name']
        if 'email' in data:
            candidate.email = data['email']
        if 'phone' in data:
            candidate.phone = data['phone']
        if 'resume_path' in data:
            candidate.resume_path = data['resume_path']
        if 'pipeline_status' in data:
            candidate.pipeline_status = data['pipeline_status']
        if 'admin_approval' in data:
            candidate.admin_approval = data['admin_approval']
        if 'indeed_registration_id' in data:
            candidate.indeed_registration_id = data['indeed_registration_id']
        if 'ats_candidate_id' in data:
            candidate.ats_candidate_id = data['ats_candidate_id']
        if 'ats_application_id' in data:
            candidate.ats_application_id = data['ats_application_id']
        if 'indeed_status' in data:
            candidate.indeed_status = data['indeed_status']
            
        candidate.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(candidate.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@candidate_bp.route('/candidates/<int:candidate_id>', methods=['DELETE'])
def delete_candidate(candidate_id):
    """Delete a candidate"""
    try:
        candidate = Candidate.query.get_or_404(candidate_id)
        db.session.delete(candidate)
        db.session.commit()
        
        return jsonify({'message': 'Candidate deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@candidate_bp.route('/candidates/<int:candidate_id>/approve', methods=['POST'])
def approve_candidate(candidate_id):
    """Approve a candidate"""
    try:
        candidate = Candidate.query.get_or_404(candidate_id)
        candidate.admin_approval = 'Approved'
        candidate.pipeline_status = 'Approved'
        candidate.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(candidate.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@candidate_bp.route('/candidates/<int:candidate_id>/deny', methods=['POST'])
def deny_candidate(candidate_id):
    """Deny a candidate"""
    try:
        candidate = Candidate.query.get_or_404(candidate_id)
        candidate.admin_approval = 'Denied'
        candidate.pipeline_status = 'Denied'
        candidate.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(candidate.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@candidate_bp.route('/candidates/pipeline-stats', methods=['GET'])
def get_pipeline_stats():
    """Get pipeline statistics"""
    try:
        stats = {
            'total': Candidate.query.count(),
            'applied': Candidate.query.filter(Candidate.pipeline_status == 'Applied').count(),
            'interviewing': Candidate.query.filter(Candidate.pipeline_status == 'Interviewing').count(),
            'offered': Candidate.query.filter(Candidate.pipeline_status == 'Offered').count(),
            'approved': Candidate.query.filter(Candidate.admin_approval == 'Approved').count(),
            'denied': Candidate.query.filter(Candidate.admin_approval == 'Denied').count(),
            'pending': Candidate.query.filter(Candidate.admin_approval == 'Pending').count()
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
