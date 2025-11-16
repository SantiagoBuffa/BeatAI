import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MenuLayout.css";

function MenuLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Función para navegar y cerrar el sidebar
  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="layout-wrapper">

      {/* Columna fija blanca a la izquierda */}
      <div className="left-column">
        <div className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

        <div className="profile-icon" onClick={() => navigate("/home")}>
            <i className="fa-solid fa-house"></i>
        </div>

        <div className="profile-icon" onClick={() => navigate("/miperfil")}>
          <i className="fa-solid fa-user-doctor" style={{fontSize: "1.2em" }}></i>
        </div>

        <div className="profile-icon" onClick={() => navigate("/pacientes")}>
            <i className="fa-solid fa-users"></i>
        </div>

        <div className="profile-icon" onClick={() => navigate("/registrar")}>
            <i className="fa-solid fa-user-plus"></i>
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
          <button className="sidebar-button" onClick={() => handleNavigate("/home")}>Inicio</button>
          <button className="sidebar-button" onClick={() => handleNavigate("/miperfil")}>Mi Perfil</button>
          <button className="sidebar-button" onClick={() => handleNavigate("/pacientes")}>Mis Pacientes</button>
          <button className="sidebar-button" onClick={() => handleNavigate("/registrar")}>Registrar Paciente</button>
          <button className="sidebar-button" onClick={() => handleNavigate("/ayuda")}>Ayuda</button>

          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={() => handleNavigate("/")}>Cerrar sesión</button>
          </div>
        </div>
      </div>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className="content-wrapper">{children}</div>
    </div>
  );
}

export default MenuLayout;
