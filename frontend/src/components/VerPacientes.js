import React, { useEffect, useState } from "react";
import "./VerPacientes.css";
import { useNavigate } from "react-router-dom";

export default function VerPacientes() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchDni, setSearchDni] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null); // NUEVO

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

  const filteredPacientes = pacientes.filter((p) =>
    p.dni?.toString().includes(searchDni)
  );

  return (
    <div className="patients-container">
      <header className="app-header2">
        <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo2" />
      </header>

      <main className="patients-main">
        <div className="title-search">
          <h2>Mis Pacientes</h2>

          <input
            type="text"
            placeholder="Buscar por DNI"
            value={searchDni}
            onChange={(e) => setSearchDni(e.target.value)}
            className="search-input"
          />
        </div>

        {loading && <p>Cargando pacientes...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && filteredPacientes.length === 0 && !error && (
          <p>No se encontraron pacientes.</p>
        )}

        <div className="patient-list-container">
          <ul className="patient-list">
            {filteredPacientes.map((p) => (
              <li
                key={p.id}
                className="patient-item"
                onClick={() => setSelectedPatient(p)} // NUEVO
              >
                <strong>{p.name}</strong>
                <span>DNI: {p.dni}</span>
                <span>Obra social: {p.health_insurance?.name || "—"}</span>
              </li>
            ))}
          </ul>
        </div>

        <button className="modal-btn3 cancel" onClick={() => navigate("/home")}>
          Volver a Inicio
        </button>
      </main>

      {/* MODAL */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedPatient.name}</h3>
            <p><strong>DNI:</strong> {selectedPatient.dni}</p>
            <p><strong>Obra social:</strong> {selectedPatient.health_insurance?.name || "—"}</p>

           <div className="modal-buttons">
            <button
              className="modal-btn2"
              onClick={() => navigate(`/historial/${selectedPatient.id}`)}
            >
              Ver Historial Clínico
            </button>

            <button
              className="modal-btn2 close"
              onClick={() => setSelectedPatient(null)}
            >
              Cerrar
            </button>
          </div>

          </div>
        </div>
      )}
    </div>
  );
}
