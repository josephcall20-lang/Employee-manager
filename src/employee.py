from models.user import db
from datetime import datetime

class Employee(db.Model):
    __tablename__ = 'employees'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    contracts = db.relationship('Contract', backref='employee', lazy=True, cascade='all, delete-orphan')
    policy_documents = db.relationship('PolicyDocument', backref='employee', lazy=True, cascade='all, delete-orphan')
    administrative_actions = db.relationship('AdministrativeAction', backref='employee', lazy=True, cascade='all, delete-orphan')
    absences = db.relationship('Absence', backref='employee', lazy=True, cascade='all, delete-orphan')
    pto = db.relationship('PTO', backref='employee', uselist=False, cascade='all, delete-orphan')
    licensures = db.relationship('Licensure', backref='employee', lazy=True, cascade='all, delete-orphan')
    recommendations = db.relationship('Recommendation', backref='employee', lazy=True, cascade='all, delete-orphan')
    awards = db.relationship('Award', backref='employee', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Employee {self.first_name} {self.last_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Contract(db.Model):
    __tablename__ = 'contracts'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    contract_title = db.Column(db.String(200), nullable=False)
    contract_path = db.Column(db.String(500))
    sign_date = db.Column(db.Date, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'contract_title': self.contract_title,
            'contract_path': self.contract_path,
            'sign_date': self.sign_date.isoformat() if self.sign_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class PolicyDocument(db.Model):
    __tablename__ = 'policy_documents'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    document_title = db.Column(db.String(200), nullable=False)
    document_path = db.Column(db.String(500))
    sign_date = db.Column(db.Date, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'document_title': self.document_title,
            'document_path': self.document_path,
            'sign_date': self.sign_date.isoformat() if self.sign_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AdministrativeAction(db.Model):
    __tablename__ = 'administrative_actions'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    action_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=False)
    document_path = db.Column(db.String(500))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'action_date': self.action_date.isoformat() if self.action_date else None,
            'description': self.description,
            'document_path': self.document_path,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Absence(db.Model):
    __tablename__ = 'absences'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    absence_date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'absence_date': self.absence_date.isoformat() if self.absence_date else None,
            'reason': self.reason,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class PTO(db.Model):
    __tablename__ = 'pto'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    available_hours = db.Column(db.Integer, default=0)
    used_hours = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'available_hours': self.available_hours,
            'used_hours': self.used_hours,
            'remaining_hours': self.available_hours - self.used_hours,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Licensure(db.Model):
    __tablename__ = 'licensures'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    license_name = db.Column(db.String(200), nullable=False)
    issuing_body = db.Column(db.String(200))
    issue_date = db.Column(db.Date)
    expiry_date = db.Column(db.Date)
    license_path = db.Column(db.String(500))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'license_name': self.license_name,
            'issuing_body': self.issuing_body,
            'issue_date': self.issue_date.isoformat() if self.issue_date else None,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'license_path': self.license_path,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Recommendation(db.Model):
    __tablename__ = 'recommendations'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    recommender_name = db.Column(db.String(200), nullable=False)
    recommendation_path = db.Column(db.String(500))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'recommender_name': self.recommender_name,
            'recommendation_path': self.recommendation_path,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Award(db.Model):
    __tablename__ = 'awards'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    award_name = db.Column(db.String(200), nullable=False)
    award_date = db.Column(db.Date)
    description = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'employee_id': self.employee_id,
            'award_name': self.award_name,
            'award_date': self.award_date.isoformat() if self.award_date else None,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

