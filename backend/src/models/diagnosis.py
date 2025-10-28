from ..database import db
from datetime import datetime

class Diagnosis(db.Model):
    __tablename__ = 'diagnosis'

    id = db.Column(db.Integer, primary_key = True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable = False)
    fecha = db.Column(db.DateTime, default=datetime.now)
    result = db.Column(db.String(200))
    ecg_route = db.Column(db.String(200))