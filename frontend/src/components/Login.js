import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:5000/doctor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          license: username,
          password_hash: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Credenciales incorrectas");
        setLoading(false);
        return;
      }
      localStorage.setItem("doctor_dni", data.dni);

      navigate("/home");
    }catch (error) {
      console.error(error);
      setError("Error al conectar con el servidor");
    } finally {
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

        <p className="signup-text">
          ¿No tienes cuenta?{" "}
          <span className="signup-link" onClick={() => navigate("/signup1")}>
            Registrarse
          </span>
        </p>
      </main>
    </div>
  );
}

export default Login;
