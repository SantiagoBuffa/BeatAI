from ..database import db
from werkzeug.security import generate_password_hash, check_password_hash 

class Doctor(db.Model):
    __tablename__ = 'doctor'
    
    id = db.Column(db.Integer, primary_key=True)
    dni = db.Column(db.Integer)
    name = db.Column(db.String(150), nullable =False)
    license = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    patients = db.relationship('Patient', backref='doctor', lazy=True)

def set_password(self, password):
    self.password_hash = generate_password_hash(password)

def check_password(self, password):
    return check_password_hash(self.password_hash, password)