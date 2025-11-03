from datetime import datetime
from flask import Blueprint, request, jsonify
from models.patient import Patient
from models.diagnosis import Diagnosis
from ..database import db
from models.healthInsurance import HealthInsurance

patient_routes = Blueprint('patient_routes', __name__)

@patient_routes.route('/register_patient', methods=['POST'])
def register_patient():
    data = request.get_json()

    existing_insurance = HealthInsurance.query.filter_by(name=data['health_insurance']['name']).first()

    if not existing_insurance:
        insurance = HealthInsurance(
            name=data['health_insurance']['name'],
            nro_member=data['health_insurance']['nro_member'],
            nro_plan=data['health_insurance']['nro_plan']
        )
        db.session.add(insurance)
        db.session.flush()  # Para obtener el id sin hacer commit todavía
        insurance_id = insurance.id
    else:
        insurance_id = existing_insurance.id

    # Crear el paciente
    patient = Patient(
        dni=data['dni'],
        name=data['name'],
        date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d'),
        doctor_dni=data['doctor_dni'],
        health_insurance_id=insurance_id
    )

    db.session.add(patient)
    db.session.commit()

    return jsonify({'message': 'Paciente y obra social registrados correctamente'}), 201


@patient_routes.route('/add_diagnosis', methods=['POST'])
def add_diagnosis():
    data = request.get_json()
    patient = Patient.query.filter_by(dni=data['dni']).first()
    if not patient:
        return jsonify({'error': 'Paciente no encontrado'}), 404

    diagnosis = Diagnosis(
        patient_id=patient.id,
        descripcion=data.get('descripcion', ''),
        ruta_ecg=data.get('ruta_ecg', ''),
        fecha=datetime.utcnow()
    )
    db.session.add(diagnosis)
    db.session.commit()
    return jsonify({'message': 'Diagnóstico agregado correctamente'})

@patient_routes.route('/patients', methods=['GET'])
def get_all_patients():
    patients = Patient.query.all()
    return jsonify([
        {
            'id': p.id,
            'dni': p.dni,
            'name': p.name,
            'date_of_birth': p.date_of_birth.strftime('%Y-%m-%d'),
            'doctor_dni': p.doctor_dni,
            'health_insurance': {
                'name': p.health_insurance.name if p.health_insurance else None,
                'nro_plan': p.health_insurance.nro_plan if p.health_insurance else None,
                'nro_member': p.health_insurance.nro_member if p.health_insurance else None
            }
        }
        for p in patients
    ])


@patient_routes.route('/patients/<string:dni>', methods=['GET']) #Permite buscar un paciente directamente desde el front con GET /patients/12345678.
def get_patient_by_dni(dni):
    patient = Patient.query.filter_by(dni=dni).first()
    if not patient:
        return jsonify({'error': 'Paciente no encontrado'}), 404

    return jsonify({
        'id': patient.id,
        'dni': patient.dni,
        'name': patient.name,
        'date_of_birth': patient.date_of_birth.strftime('%Y-%m-%d'),
        'doctor_dni': patient.doctor_dni,
        'edad' : patient.edad,
        'health_insurance': {
            'name': patient.health_insurance.name if patient.health_insurance else None,
            'nro_plan': patient.health_insurance.nro_plan if patient.health_insurance else None,
            'nro_member': patient.health_insurance.nro_member if patient.health_insurance else None
        }
    })

@patient_routes.route('/patients/<string:dni>/diagnoses', methods=['GET'])
def get_diagnoses_by_patient(dni):
    patient = Patient.query.filter_by(dni=dni).first()
    if not patient:
        return jsonify({'error': 'Paciente no encontrado'}), 404

    diagnoses = Diagnosis.query.filter_by(patient_id=patient.id).all()
    return jsonify([
        {
            'id': d.id,
            'descripcion': d.descripcion,
            'ruta_ecg': d.ruta_ecg,
            'fecha': d.fecha.strftime('%Y-%m-%d %H:%M:%S')
        }
        for d in diagnoses
    ])
