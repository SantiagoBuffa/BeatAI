from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, request, jsonify
from ..models.doctor import Doctor
from ..database import db


doctor_bp = Blueprint('doctor', __name__, url_prefix='/doctor')

@doctor_bp.route('/register', methods=['POST'])
def register_doctor():
    data = request.get_json()
    if Doctor.query.filter_by(dni=data['dni']).first():
        return jsonify({'error': 'El doctor ya está registrado'}), 400
    doctor = Doctor(
        dni=data['dni'],
        name=data['name'],
        license=data['license'],
        email=data['email'],
        password_hash=generate_password_hash(data['password_hash'])
    )
    db.session.add(doctor)
    db.session.commit()
    return jsonify({'message': 'Doctor registrado con éxito'}), 201

@doctor_bp.route('/login', methods=['POST'])
def login_doctor():
    data = request.get_json()
    doctor = Doctor.query.filter_by(license=data['license']).first()
    if doctor and check_password_hash(doctor.password_hash, data['password_hash']):
        return jsonify({'message': 'Inicio de sesión exitoso', 'dni': doctor.dni}), 200
    return jsonify({'message': 'Credenciales inválidas'}), 401
