from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
import cv2
from src.models import Doctor, Patient, Diagnosis, HealthInsurance
from src.database import db

app = Flask(__name__)
CORS(app) # permite llamadas desde el frontend

# ✅ Configuración de la base de datos SQLite
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'beat_ai.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # (opcional, evita warnings)

# Conectar SQLAlchemy con Flask
db.init_app(app)

# Crear tablas en la DB
with app.app_context():
    db.create_all()

# cargar el modelo entrenado

# Ruta absoluta al modelo
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "models", "ecg_modelV3.h5")

model = tf.keras.models.load_model(MODEL_PATH)

# def preprocess_image(image_bytes):
#     """
#     Igual que preprocess_ecg_image del entrenamiento, pero recibe bytes de archivo
#     """
#     # Convertir bytes a PIL.Image y luego a np.ndarray
#     img = Image.open(io.BytesIO(image_bytes))
#     img = np.array(img)

#     # --- Ahora usamos exactamente la misma función del entrenamiento ---
#     # --- Normalización de forma ---
#     if img.ndim == 3 and img.shape[-1] == 3:
#         img = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
#     elif img.ndim == 3 and img.shape[-1] == 4:
#         img = cv2.cvtColor(img, cv2.COLOR_RGBA2GRAY)
#     elif img.ndim == 3 and img.shape[-1] == 1:
#         img = np.squeeze(img, axis=-1)
#     elif img.ndim == 2:
#         pass
#     else:
#         raise ValueError(f"Formato de imagen inesperado: {img.shape}")

#     # --- Normalización ---
#     img = img.astype(np.float32) / 255.0

#     # --- Invertir colores ---
#     img = 1.0 - img

#     # --- Umbral de Otsu para quitar fondo cuadriculado ---
#     img_8bit = (img * 255).astype(np.uint8)
#     _, img_bin_8bit = cv2.threshold(img_8bit, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#     img_bin = img_bin_8bit / 255.0

#     # --- Recorte automático de bordes blancos ---
#     coords = cv2.findNonZero((img_bin * 255).astype(np.uint8))
#     if coords is not None:
#         x, y, w, h = cv2.boundingRect(coords)
#         img_cropped = img_bin[y:y+h, x:x+w]
#     else:
#         img_cropped = img_bin

#     # --- Redimensionar ---
#     img_resized = cv2.resize(img_cropped, (160, 160))

#     # --- Canal final y batch ---
#     img_resized = np.expand_dims(img_resized, axis=-1)  # canal
#     img_resized = np.expand_dims(img_resized, axis=0)   # batch

#     return img_resized


def preprocess_image(image_bytes, num_rows=4, smooth=True, target_len=2048):
    """
    Convierte una imagen ECG recibida como bytes en un vector 1D normalizado,
    igual que el preprocesamiento usado durante el entrenamiento.
    """
    import numpy as np
    import cv2
    import io
    from PIL import Image

    def resize_vector(vec, target_len):
        x_old = np.linspace(0, 1, len(vec))
        x_new = np.linspace(0, 1, target_len)
        return np.interp(x_new, x_old, vec)

    # Leer imagen desde bytes → array OpenCV (BGR)
    nimg = Image.open(io.BytesIO(image_bytes))
    img = nimg.resize((1100, 786), Image.LANCZOS)
    img = np.array(img)
    if img.ndim == 3 and img.shape[-1] == 4:
        img = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
    elif img.ndim == 3 and img.shape[-1] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    elif img.ndim == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C,
                                   cv2.THRESH_BINARY_INV, 35, 10)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 1))
    clean = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

    contours, _ = cv2.findContours(clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if len(contours) > 0:
        x, y, w, h = cv2.boundingRect(max(contours, key=cv2.contourArea))
        clean = clean[y:y+h, x:x+w]

    height = clean.shape[0]
    row_height = height // num_rows
    signals = []
    for i in range(num_rows):
        row = clean[i*row_height:(i+1)*row_height, :]
        ys = []
        for col in range(row.shape[1]):
            pixels = np.where(row[:, col] > 0)[0]
            if len(pixels) > 0:
                ys.append(np.mean(pixels))
            else:
                ys.append(np.nan)
        ys = np.array(ys)
        nans = np.isnan(ys)
        if np.any(nans):
            ys[nans] = np.interp(np.flatnonzero(nans), np.flatnonzero(~nans), ys[~nans])
        ys = (ys - np.min(ys)) / (np.max(ys) - np.min(ys))
        signals.append(ys)

    vector = np.concatenate(signals)
    if smooth:
        vector = cv2.GaussianBlur(vector.reshape(-1, 1), (9, 1), 0).flatten()

    # --- Igualar longitud y formato ---
    vector = resize_vector(vector, target_len)
    vector = np.expand_dims(vector, axis=-1)  # (length, 1)
    vector = np.expand_dims(vector, axis=0)   # (1, length, 1)

    return vector


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