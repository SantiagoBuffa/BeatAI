import React, { useState } from "react";
import "./Login.css";

function SignUp2({ userData, onRegister, onBack, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      setError("Por favor, completá todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError("");
    setLoading(true);

    // Simula un registro exitoso
    setTimeout(() => {
      setLoading(false);
      onRegister({ ...userData, email, password });
    }, 1000);
  };

  return (
    <div className="login-container">
      <header className="app-header">
        <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo" />
      </header>

      <main className="login-main">
        <h2>Registro - Paso 2</h2>
        {error && <p className="error-text">{error}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="login-input"
        />

        <button
          className={`upload-button ${loading ? "loading" : ""}`}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
          {loading && <span className="btn-spinner" aria-hidden="true"></span>}
        </button>

        <button className="secondary-button" onClick={onBack}>
          Volver
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

export default SignUp2;
