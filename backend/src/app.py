from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
import cv2

app = Flask(__name__)
CORS(app) # permite llamadas desde el frontend

# cargar el modelo entrenado
model = tf.keras.models.load_model("../../models/ecg_modelV3.h5")

def preprocess_image(image_bytes):
    """
    Igual que preprocess_ecg_image del entrenamiento, pero recibe bytes de archivo
    """
    # Convertir bytes a PIL.Image y luego a np.ndarray
    img = Image.open(io.BytesIO(image_bytes))
    img = np.array(img)

    # --- Ahora usamos exactamente la misma función del entrenamiento ---
    # --- Normalización de forma ---
    if img.ndim == 3 and img.shape[-1] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    elif img.ndim == 3 and img.shape[-1] == 4:
        img = cv2.cvtColor(img, cv2.COLOR_RGBA2GRAY)
    elif img.ndim == 3 and img.shape[-1] == 1:
        img = np.squeeze(img, axis=-1)
    elif img.ndim == 2:
        pass
    else:
        raise ValueError(f"Formato de imagen inesperado: {img.shape}")

    # --- Normalización ---
    img = img.astype(np.float32) / 255.0

    # --- Invertir colores ---
    img = 1.0 - img

    # --- Umbral de Otsu para quitar fondo cuadriculado ---
    img_8bit = (img * 255).astype(np.uint8)
    _, img_bin_8bit = cv2.threshold(img_8bit, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    img_bin = img_bin_8bit / 255.0

    # --- Recorte automático de bordes blancos ---
    coords = cv2.findNonZero((img_bin * 255).astype(np.uint8))
    if coords is not None:
        x, y, w, h = cv2.boundingRect(coords)
        img_cropped = img_bin[y:y+h, x:x+w]
    else:
        img_cropped = img_bin

    # --- Redimensionar ---
    img_resized = cv2.resize(img_cropped, (160, 160))

    # --- Canal final y batch ---
    img_resized = np.expand_dims(img_resized, axis=-1)  # canal
    img_resized = np.expand_dims(img_resized, axis=0)   # batch

    return img_resized


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