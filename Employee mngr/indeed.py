from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.candidate import Candidate
from src.routes.auth import token_required, admin_required
import requests
import os
from datetime import datetime

indeed_bp = Blueprint('indeed', __name__)

# Indeed API configuration (these would be set as environment variables in production)
INDEED_API_BASE = "https://api.indeed.com"
INDEED_CLIENT_ID = os.getenv('INDEED_CLIENT_ID', 'your_client_id')
INDEED_CLIENT_SECRET = os.getenv('INDEED_CLIENT_SECRET', 'your_client_secret')

@indeed_bp.route('/sync-candidates', methods=['POST'])
@token_required
@admin_required
def sync_candidates(current_user):
    """Sync candidates from Indeed ATS"""
    try:
        # This is a mock implementation since we don't have real Indeed API credentials
        # In a real implementation, this would:
        # 1. Authenticate with Indeed API
        # 2. Fetch candidate data from Indeed
        # 3. Update local database with Indeed data
        
        # Mock data for demonstration
        mock_indeed_candidates = [
            {
                "indeed_registration_id": "REG123456",
                "ats_candidate_id": "CAND789",
                "ats_application_id": "APP456",
                "first_name": "Michael",
                "last_name": "Brown",
                "email": "michael.brown@email.com",
                "phone": "555-0123",
                "indeed_status": "Active"
            },
            {
                "indeed_registration_id": "REG789012",
                "ats_candidate_id": "CAND345",
                "ats_application_id": "APP789",
                "first_name": "Emily",
                "last_name": "Davis",
                "email": "emily.davis@email.com",
                "phone": "555-0456",
                "indeed_status": "Under Review"
            }
        ]
        
        synced_candidates = []
        
        for candidate_data in mock_indeed_candidates:
            # Check if candidate already exists by Indeed registration ID
            existing_candidate = Candidate.query.filter_by(
                indeed_registration_id=candidate_data['indeed_registration_id']
            ).first()
            
            if existing_candidate:
                # Update existing candidate
                existing_candidate.ats_candidate_id = candidate_data['ats_candidate_id']
                existing_candidate.ats_application_id = candidate_data['ats_application_id']
                existing_candidate.indeed_status = candidate_data['indeed_status']
                existing_candidate.last_sync_timestamp = datetime.utcnow()
                existing_candidate.updated_at = datetime.utcnow()
                synced_candidates.append(existing_candidate.to_dict())
            else:
                # Create new candidate
                new_candidate = Candidate(
                    first_name=candidate_data['first_name'],
                    last_name=candidate_data['last_name'],
                    email=candidate_data['email'],
                    phone=candidate_data['phone'],
                    indeed_registration_id=candidate_data['indeed_registration_id'],
                    ats_candidate_id=candidate_data['ats_candidate_id'],
                    ats_application_id=candidate_data['ats_application_id'],
                    indeed_status=candidate_data['indeed_status'],
                    pipeline_status='Applied',
                    admin_approval='Pending',
                    last_sync_timestamp=datetime.utcnow()
                )
                db.session.add(new_candidate)
                db.session.flush()
                synced_candidates.append(new_candidate.to_dict())
        
        db.session.commit()
        
        return jsonify({
            'message': f'Successfully synced {len(synced_candidates)} candidates from Indeed',
            'synced_candidates': synced_candidates
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@indeed_bp.route('/push-candidate-status', methods=['POST'])
@token_required
@admin_required
def push_candidate_status(current_user):
    """Push candidate status updates to Indeed"""
    try:
        data = request.get_json()
        
        if 'candidate_id' not in data:
            return jsonify({'error': 'candidate_id is required'}), 400
        
        candidate = Candidate.query.get_or_404(data['candidate_id'])
        
        if not candidate.indeed_registration_id:
            return jsonify({'error': 'Candidate is not synced with Indeed'}), 400
        
        # Mock API call to Indeed
        # In a real implementation, this would make an actual API call to Indeed
        mock_response = {
            'success': True,
            'message': 'Status updated successfully in Indeed',
            'indeed_status': candidate.pipeline_status
        }
        
        # Update local record
        candidate.indeed_status = candidate.pipeline_status
        candidate.last_sync_timestamp = datetime.utcnow()
        candidate.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Candidate status pushed to Indeed successfully',
            'candidate': candidate.to_dict(),
            'indeed_response': mock_response
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@indeed_bp.route('/sync-status', methods=['GET'])
@token_required
def get_sync_status(current_user):
    """Get Indeed sync status and statistics"""
    try:
        total_candidates = Candidate.query.count()
        synced_candidates = Candidate.query.filter(
            Candidate.indeed_registration_id.isnot(None)
        ).count()
        
        recent_sync = Candidate.query.filter(
            Candidate.last_sync_timestamp.isnot(None)
        ).order_by(Candidate.last_sync_timestamp.desc()).first()
        
        last_sync_time = recent_sync.last_sync_timestamp if recent_sync else None
        
        return jsonify({
            'total_candidates': total_candidates,
            'synced_candidates': synced_candidates,
            'sync_percentage': (synced_candidates / max(total_candidates, 1)) * 100,
            'last_sync_time': last_sync_time.isoformat() if last_sync_time else None,
            'indeed_api_configured': bool(INDEED_CLIENT_ID and INDEED_CLIENT_SECRET)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@indeed_bp.route('/configure', methods=['POST'])
@token_required
@admin_required
def configure_indeed_api(current_user):
    """Configure Indeed API credentials (admin only)"""
    try:
        data = request.get_json()
        
        # In a real implementation, these would be stored securely
        # For now, we'll just validate the format
        required_fields = ['client_id', 'client_secret']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Mock validation
        if len(data['client_id']) < 10 or len(data['client_secret']) < 10:
            return jsonify({'error': 'Invalid credentials format'}), 400
        
        return jsonify({
            'message': 'Indeed API credentials configured successfully',
            'configured': True
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

