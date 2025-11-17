import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Historial.css";

export default function Historial() {
  const { dni } = useParams();
  const navigate = useNavigate();

  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    fetch(`http://localhost:5000/patients/${dni}/diagnosis`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setDiagnosticos(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el historial del paciente.");
        setLoading(false);
      });
  }, [dni]);

  return (
    <>
      <header className="app-header2">
        <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo2" />
      </header>

      <div className="historial-box">
        <header className="historial-header">
          <div className="header-text">
            <h2>Historial Clínico</h2>
            <h2>DNI {dni}</h2>
          </div>
        </header>

        <main className="historial-main">
          {loading && <p>Cargando historial...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && diagnosticos.length === 0 && !error && (
            <p>Este paciente no tiene diagnósticos registrados.</p>
          )}

          {/* zona con scroll */}
          <div className="diagnosis-scroll-area">
            <div className="diagnosis-grid">
              {diagnosticos.map((diag) => (
                <div key={diag.id} className="diagnosis-card">
                  <p className="date">{diag.fecha}</p>

                  {diag.ecg_route ? (
                    <img
                      src={`http://localhost:5000/${diag.ecg_route}`}
                      alt="ECG"
                      className="ecg-image"
                      onClick={() => setSelectedImage(`http://localhost:5000/${diag.ecg_route}`)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <p className="no-image">No se encontró imagen ECG.</p>
                  )}

                  <p className="result">
                    <strong>Resultado:</strong> {diag.result}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      {selectedImage && (
      <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
        <div className="modal-container">
          <img src={selectedImage} alt="ECG ampliado" className="modal-image" />
        </div>
      </div>
      )}

      <button className="modal-btn3 cancel" onClick={() => navigate("/pacientes")}>
        Volver
      </button>
    </>
  );
}
