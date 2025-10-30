import React, { useState } from "react";
import "./SignUp.css";

function SignUp1({ onNext, onSwitchToLogin }) {
  const [dni, setDni] = useState("");
  const [matricula, setMatricula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!dni || !matricula || !nombre || !apellido) {
      setError("Por favor, completá todos los campos");
      return;
    }
    setError("");
    onNext({ dni, matricula, nombre, apellido });
  };

  return (
    <div className="login-container">
      <header className="app-header">
        <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo" />
      </header>

      <main className="signup-main">
        <h2>Registro</h2>
        {error && <p className="error-text">{error}</p>}

        <div className="signup-grid">
          <input
            type="text"
            placeholder="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="login-input"
          />
          <input
            type="text"
            placeholder="N° Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="login-input"
          />
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="login-input"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="login-input"
          />
        </div>

        <button className="upload-button" onClick={handleNext}>
          Siguiente
        </button>

        <p className="signup-text">
          ¿Ya tenés cuenta?{" "}
          <span className="signup-link" onClick={onSwitchToLogin}>
            Iniciar sesión
          </span>
        </p>
      </main>
    </div>
  );
}

export default SignUp1;
