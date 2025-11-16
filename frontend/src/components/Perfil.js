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


  return (
    <>
      <header className="app-header2">
          <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo2" />
      </header><div className="perfil-container">
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


    </div><button
      className="modal-btn3 cancel"
      onClick={() => navigate("/home")}
    >
        Volver a Inicio
      </button></>
  );
}

export default Perfil;
