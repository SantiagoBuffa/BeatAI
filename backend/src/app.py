from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

# cargar el modelo entrenado
model = tf.keras.models.load_model("model/ecg_model.h5")

def preprocess_image(image_bytes):
    """Preprocesa una imagen ECG antes de predecir"""
    img = Image.open(io.BytesIO(image_bytes)).convert("L").resize((128,128))
    arr = np.array(img) / 255.0
    arr = np.expand_dims(arr, axis=(0,-1))  # (1,128,128,1)
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

    return jsonify({"class": class_id, "confidence": confidence})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
