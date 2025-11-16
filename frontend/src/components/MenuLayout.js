import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MenuLayout.css";

function MenuLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="layout-wrapper">

      {/* Columna fija blanca a la izquierda */}
      <div className="left-column">
        <div className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          
        </div>

        <div className="profile-icon" onClick={() => navigate("/miperfil")}>
            <i className="fa-solid fa-user"></i>
        </div>

        <div className="profile-icon" onClick={() => navigate("/ayuda")}>
            <i className="fa-solid fa-question"></i>
        </div>

        <div className="logout" onClick={() => navigate("/")}>
            <i className="fa-solid fa-right-from-bracket"></i>
        </div>

      </div>

      {/* Sidebar deslizable */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="menuu">- Menú -</div>
          <button className="sidebar-button" onClick={() => navigate("/home")}>Inicio</button>
          <button className="sidebar-button" onClick={() => navigate("/miperfil")}>Mi Perfil</button>
          <button className="sidebar-button" onClick={() => navigate("/pacientes")}>Mis Pacientes</button>
          <button className="sidebar-button" onClick={() => navigate("/registrar")}>Registrar Paciente</button>

          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={() => navigate("/")}>Cerrar sesión</button>
          </div>
        </div>
      </div>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className="content-wrapper">{children}</div>
    </div>
  );
}

export default MenuLayout;
