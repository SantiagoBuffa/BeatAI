from ..database import db

class Health_insurance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    nro_member = db.Column(db.String(50))
    nro_plan = db.Column(db.String(50))
    patient = db.relationship('Patient', backref='health_insurance', lazy=True)