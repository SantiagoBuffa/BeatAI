from ..database import db
from datetime import date

class Patient(db.Model):
    __tablename__ = 'patient'
    
    id = db.Column(db.Integer, primary_key=True)
    dni = db.Column(db.Integer)
    name = db.Column(db.String(150), nullable=False)
    date_of_birth = db.Column(db.Date)
    doctor_dni = db.Column(db.Integer, db.ForeignKey('doctor.dni'), nullable=False)
    
    health_insurance_id = db.Column(db.Integer, db.ForeignKey('health_insurance.id'), nullable=False)
    diagnosticos = db.relationship('Diagnosis', backref='patient', lazy=True)
    @property
    def edad(self):
        if self.date_of_birth:
            today = date.today()
            return today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        return None