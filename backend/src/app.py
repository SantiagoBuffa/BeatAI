from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from datetime import datetime
from PIL import Image
from scipy.signal import medfilt
from werkzeug.utils import secure_filename
import io
import os
import cv2
from src.models import Doctor, Patient, Diagnosis, HealthInsurance
from src.database import db
from src.routes.doctor_routes import doctor_bp
from src.routes.patients_routes import patient_bp

def save_diagnosis(dni, result, ecg_route):
    patient = Patient.query.filter_by(dni=dni).first()
    if not patient:
        return False, "Paciente no encontrado"

    diagnosis = Diagnosis(
        patient_id=patient.id,
        result=result,
        ecg_route=ecg_route,
        fecha=datetime.utcnow()
    )
    db.session.add(diagnosis)
    db.session.commit()

    return True, "Diagnóstico guardado"


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # backend/
STATIC_DIR = os.path.join(BASE_DIR, "static")

app = Flask(
    __name__,
    static_folder=STATIC_DIR,
    static_url_path="/static"
)
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
MODEL_PATH = os.path.join(BASE_DIR, "models", "ecg_modelVectorFinal.h5")

# cargar el modelo entrenado
model = tf.keras.models.load_model(MODEL_PATH)


#Cargar imagen desde bytes y convertir a blanco y negro
def cargar_imagen_bn_desde_bytes(image_bytes):
    """Carga imagen desde bytes y la devuelve en B&W (0=negro, 255=blanco)."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = np.array(img)
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    _, bw = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return bw

# Divide el ECG en varias partes
def kmeans_1d_weighted(indices, weights, k=3, max_iter=100, tol=1e-3):
    idx_min, idx_max = indices.min(), indices.max()
    centers = np.linspace(idx_min, idx_max, k)

    for _ in range(max_iter):
        dists = np.abs(indices.reshape(-1,1) - centers.reshape(1,-1))
        labels = dists.argmin(axis=1)

        new_centers = np.zeros_like(centers)
        for j in range(k):
            mask = labels == j
            if not np.any(mask):
                new_centers[j] = centers[j]
            else:
                w = weights[mask]
                idxs = indices[mask]
                new_centers[j] = np.sum(idxs * w) / (np.sum(w) + 1e-9)

        if np.max(np.abs(new_centers - centers)) < tol:
            break

        centers = new_centers

    return np.sort(centers)

# Ajusta la longitud del vector a longitud fija
def ajustar_longitud(v, target_len):
    x_old = np.linspace(0, 1, len(v))
    x_new = np.linspace(0, 1, target_len)
    return np.interp(x_new, x_old, v).astype(np.float32)

#Extrae la region principal, sacando lo que no sirve
def recortar_zona_util(img_bw, min_area=1000):
    inverted_img = 255 - img_bw
    contours, _ = cv2.findContours(inverted_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        return img_bw

    big = max(contours, key=cv2.contourArea)
    if cv2.contourArea(big) < min_area:
        return img_bw

    x, y, w_roi, h_roi = cv2.boundingRect(big)
    return img_bw[y:y+h_roi, x:x+w_roi]

#Dividir el ECG en partes usando proyeccion horizontal
def dividir_en_secciones(roi_bw, num_parts=3):
    h, w = roi_bw.shape
    inverted_img = 255 - roi_bw
    proj = inverted_img.sum(axis=1).astype(float)

    rows = np.arange(len(proj))
    weights = proj / (proj.max() + 1e-9)

    centers = kmeans_1d_weighted(rows, weights, k=num_parts)
    centers = np.array(centers)

    cuts = []
    for i in range(len(centers)-1):
        cuts.append(int(round((centers[i] + centers[i+1]) / 2)))

    parts = []
    start = 0
    for c in cuts:
        parts.append(roi_bw[start:c, :])
        start = c
    parts.append(roi_bw[start:h, :])

    return parts

#Extrae cada parte en una curva 1D
def extraer_curva_de_seccion(part_bw):
    h, w = part_bw.shape
    if h == 0 or w == 0:
        return np.array([], dtype=float)

    ys = np.zeros(w, dtype=float)

    for col in range(w):
        rows_on = np.where(part_bw[:, col] == 0)[0]
        ys[col] = np.median(rows_on) if rows_on.size > 0 else np.nan

    nans = np.isnan(ys)
    if nans.all():
        ys[:] = h / 2.0
    elif nans.any():
        not_nan = ~nans
        xs = np.arange(w)
        ys[nans] = np.interp(xs[nans], xs[not_nan], ys[not_nan])

    ys = (h - 1) - ys
    return ys

#Bytes a vector ECG listo para el modelo
def ecg_bw_bytes_to_vector(image_bytes, target_len=2048, num_parts=3):
    """Versión final para usar en Flask."""
    img_bw = cargar_imagen_bn_desde_bytes(image_bytes)
    if img_bw is None:
        return None

    roi_bw = recortar_zona_util(img_bw)
    parts = dividir_en_secciones(roi_bw, num_parts)

    vecs = []

    for p in parts:
        v = extraer_curva_de_seccion(p)
        if v.size == 0: continue

        baseline = np.nanmedian(v)
        v = v - baseline if not np.isnan(baseline) else v

        vecs.append(v)

    if not vecs:
        return None

    full = np.concatenate(vecs)

    mn, mx = np.nanmin(full), np.nanmax(full)
    full = (full - mn) / (mx - mn) if mx - mn > 1e-6 else np.full_like(full, 0.5)

    full = medfilt(full, kernel_size=3)

    final = ajustar_longitud(full, target_len)

    return final



@app.route("/BeatAI",)

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    dni = request.form.get("dni")

    if not dni:
        return jsonify({"error": "DNI no enviado"}), 400
    
    # Guardar imagen en disco
    filename = secure_filename(file.filename)
    save_dir = "static/ecg_images"
    os.makedirs(save_dir, exist_ok=True)

    save_path = os.path.join(save_dir, filename)
    file.save(save_path)

    with open(save_path, "rb") as f:
        img_bytes = f.read()


    vec = ecg_bw_bytes_to_vector(img_bytes, target_len=2048)
    if vec is None:
        return jsonify({"error": "Could not process ECG image"}), 400

    # Convertimos a batch: (1, 2048, 1)
    arr = vec.reshape(1, -1, 1)

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

    # ---- GUARDAR DIAGNÓSTICO ----
    ok, msg = save_diagnosis(
        dni=dni,
        result=class_name,
        ecg_route=f"static/ecg_images/{filename}"
    )

    if not ok:
        return jsonify({"error": msg}), 404
  

    return jsonify({
        "class": class_id,
        "class_name": class_name, 
        "confidence": confidence,
        "ruta_ecg": save_path,
        "message": "Diagnóstico guardado correctamente"
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)