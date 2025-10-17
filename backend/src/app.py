from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app) # permite llamadas desde el frontend

# cargar el modelo entrenado
model = tf.keras.models.load_model("../../models/ecg_modelv3.h5")


def preprocess_image(image_bytes):
    """Preprocesa una imagen ECG antes de predecir"""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((150,150))
    arr = np.array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)  #(1, 150, 150 , 3)
    return arr

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