import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin, onSwitchToSignUp }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simula login
      setTimeout(() => {
        setLoading(false);
        onLogin(username);
      }, 1000);
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <header className="app-header">
        <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo" />
      </header>

      <main className="login-main">
        <h2>Iniciar Sesión</h2>
        {error && <p className="error-text">{error}</p>}

        <input
          type="text"
          placeholder="N° Matrícula"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button
          className={`upload-button ${loading ? "loading" : ""}`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Ingresando..." : "INICIAR SESIÓN"}
          {loading && <span className="btn-spinner" aria-hidden="true"></span>}
        </button>

        {/* 🔹 Enlace a Registro */}
        <p className="signup-text">
          ¿No tienes cuenta?{" "}
          <span className="signup-link" onClick={onSwitchToSignUp}>
            Registrarse
          </span>
        </p>
      </main>
    </div>
  );
}

export default Login;
