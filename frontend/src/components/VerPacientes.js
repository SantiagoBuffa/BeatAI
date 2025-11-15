import React, { useEffect, useState } from "react";
import "./VerPacientes.css";
import { useNavigate } from "react-router-dom";

export default function VerPacientes() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // DNI del doctor logueado (guardado al iniciar sesión)
  const doctorDni = localStorage.getItem("doctor_dni");

  useEffect(() => {
    if (!doctorDni) {
      setError("No se pudo identificar al doctor. Volvé a iniciar sesión.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/patients/doctor/${doctorDni}`)
      .then((res) => res.json())
      .then((data) => {
        setPacientes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar pacientes:", err);
        setError("Hubo un error al cargar los pacientes.");
        setLoading(false);
      });
  }, [doctorDni]);

  return (
    <div className="patients-container">
      <header className="app-header">
        <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo" />
      </header>

      <main className="patients-main">
        <h2>Mis Pacientes</h2>

        {loading && <p>Cargando pacientes...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && pacientes.length === 0 && !error && (
          <p>No tenés pacientes registrados.</p>
        )}

        <ul className="patient-list">
          {pacientes.map((p) => (
            <li key={p.id} className="patient-item">
              <strong>{p.name}</strong>  
              <span>DNI: {p.dni}</span>
              <span>Obra social: {p.health_insurance?.name || "—"}</span>
            </li>
          ))}
        </ul>

        <button
          className="upload-button"
          onClick={() => navigate("/home")}
        >
          Volver
        </button>
      </main>
    </div>
  );
}
