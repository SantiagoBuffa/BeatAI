import React from "react";
import "./Perfil.css";
import { useNavigate } from "react-router-dom";

function Perfil() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="perfil-icon">
          <i className="fa-solid fa-user"></i>
        </div>
        <h1>Mi Perfil</h1>
      </div>

      <div className="perfil-info">
        <p><strong>Nombre:</strong> {user.nombreCompleto}</p>
        <p><strong>DNI:</strong> {user.dni}</p>
        <p><strong>Matrícula:</strong> {user.matricula}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      
    </div>
  );
}

export default Perfil;
