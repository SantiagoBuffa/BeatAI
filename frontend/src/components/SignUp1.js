import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

function SignUp1() {
  const navigate = useNavigate();

  const [dni, setDni] = useState("");
  const [matricula, setMatricula] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!dni || !matricula || !nombreCompleto) {
      setError("Por favor, completá todos los campos");
      return;
    }
    setError("");

    navigate("/signup2", {
      state: { dni, matricula, nombreCompleto },
    });
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
            className="signup-input"
          />
          <input
            type="text"
            placeholder="N° Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="signup-input"
          />
        </div>

        <input
          type="text"
          placeholder="Nombre y Apellido"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          className="signup-input"
        />

        <button className="upload-button" onClick={handleNext}>
          Siguiente
        </button>

        <p className="signup-text">
          ¿Ya tenés cuenta?{" "}
          <span className="signup-link" onClick={() => navigate("/")}>
            Iniciar sesión
          </span>
        </p>
      </main>
    </div>
  );
}

export default SignUp1;
