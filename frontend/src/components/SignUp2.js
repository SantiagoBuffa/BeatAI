import React, { useState } from "react";
import "./SignUp.css";
import { useLocation, useNavigate } from "react-router-dom";

function SignUp2() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state;

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

    setTimeout(() => {
      setLoading(false);
      navigate("/"); 
    }, 1000);
  };

  return (
    <div className="login-container">
      <header className="app-header">
        <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo" />
      </header>

      <main className="signup-main">
        <h2>Registro - Paso 2</h2>
        {error && <p className="error-text">{error}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
        />

        <div className="signup-grid">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="signup-input"
          />
        </div>

        <button className="upload-button" onClick={handleRegister} disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </main>
    </div>
  );
}

export default SignUp2;
