from ..database import db

class HealthInsurance(db.Model):
    __tablename__ = 'health_insurance'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    nro_member = db.Column(db.String(50))
    nro_plan = db.Column(db.String(50))
    patients = db.relationship('Patient', backref='health_insurance', lazy=True)