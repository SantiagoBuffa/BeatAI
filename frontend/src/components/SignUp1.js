import React, { useState } from "react";
import "./Login.css"; // reutilizamos el mismo estilo

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
    // Pasamos los datos al siguiente paso
    onNext({ dni, matricula, nombre, apellido });
  };

  return (
    <div className="login-container">
      <header className="app-header">
        <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo" />
      </header>

      <main className="login-main">
        <h2>Registro - Paso 1</h2>
        {error && <p className="error-text">{error}</p>}

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

        <button className="upload-button" onClick={handleNext}>
          Siguiente
        </button>

        <p className="switch-text">
          ¿Ya tenés cuenta?{" "}
          <button className="switch-link" onClick={onSwitchToLogin}>
            Iniciar sesión
          </button>
        </p>
      </main>
    </div>
  );
}

export default SignUp1;
