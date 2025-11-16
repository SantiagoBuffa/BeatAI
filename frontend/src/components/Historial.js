import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Historial.css";

export default function Historial() {
  const { dni } = useParams();
  const navigate = useNavigate();

  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="historial-container">

      {/* Caja blanca principal */}
      <div className="historial-box">

        {/* Encabezado */}
        <header className="historial-header">
          <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo3" />
          <div className="header-text">
            <h1>Historial Clínico</h1>
            <h2>DNI {dni}</h2>
          </div>
        </header>

        <main className="historial-main">

          {loading && <p>Cargando historial...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && diagnosticos.length === 0 && !error && (
            <p>Este paciente no tiene diagnósticos registrados.</p>
          )}

          {/* ZONA CON SCROLL */}
          <div className="diagnosis-scroll-area">
            <div className="diagnosis-grid">
              {diagnosticos.map((diag) => (
                <div key={diag.id} className="diagnosis-card">
                  <p className="date">{diag.fecha}</p>

                  {diag.ecg_route ? (
                    <img
                      src={diag.ecg_route}
                      alt="ECG"
                      className="ecg-image"
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

          <button className="back-btn" onClick={() => navigate(-1)}>
            Volver
          </button>

        </main>

      </div>

    </div>
  );
}
