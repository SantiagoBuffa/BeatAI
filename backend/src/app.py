from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
import cv2
from src.models import Doctor, Patient, Diagnosis, HealthInsurance
from src.database import db
from src.routes.doctor_routes import doctor_bp
from src.routes.patients_routes import patient_bp


app = Flask(__name__)
CORS(app) # permite llamadas desde el frontend

# Configuración de la base de datos SQLite
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'beat_ai.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # (opcional, evita warnings)

# Conectar SQLAlchemy con Flask
db.init_app(app)

# Crear tablas en la DB
with app.app_context():
    db.create_all()

#Registra las rutas
app.register_blueprint(doctor_bp)
app.register_blueprint(patient_bp)


# Ruta absoluta al modelo
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "models", "modelVGGV2.keras")

# cargar el modelo entrenado
model = tf.keras.models.load_model(MODEL_PATH)

predict_datagen = ImageDataGenerator(rescale=1./255)

def preprocess_image(image_bytes):
    img_height, img_width = 390, 550

    # Leer directamente desde bytes
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((img_width, img_height))

    img_array = img_to_array(img)

    # Expandir dims para que parezca un batch de 1
    img_array = np.expand_dims(img_array, axis=0)

    # Aplicar el preprocesamiento EXACTO al de test_generator
    img_array = predict_datagen.standardize(img_array)
    
    return img_array


@app.route("/BeatAI",)

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    img_bytes = file.read()
    arr = preprocess_image(img_bytes)

    pred = model.predict(arr)
    class_id = int(np.argmax(pred))
    confidence = float(np.max(pred))

    classes = ["ECG Images of Myocardial Infarction Patients (240x12=2880)",
               "ECG Images of Patient that have History of MI (172x12=2064)",
               "ECG Images of Patient that have abnormal heartbeat (233x12=2796)", 
               "Normal Person ECG Images (284x12=3408)" ]

    if class_id < len(classes):
        class_name = classes[class_id]
    else:
        class_name = "Desconocido"

    return jsonify({
        "class": class_id,
        "class_name": class_name, 
        "confidence": confidence
        })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)