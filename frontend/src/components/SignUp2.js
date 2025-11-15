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

  const handleRegister = async () => {
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

  try {
    const response = await fetch("http://localhost:5000/doctor/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dni: userData.dni,
        name: userData.nombreCompleto,
        license: userData.matricula,
        email: email,
        password_hash: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Ocurrió un error en el registro");
      setLoading(false);
      return;
    }

    // Registro exitoso
    navigate("/");
  } catch (error) {
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
