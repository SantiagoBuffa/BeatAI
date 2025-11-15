import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MenuLayout.css";

function MenuLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="layout-wrapper">
      <div className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <button className="sidebar-button" onClick={() => navigate("/home")}>
            Inicio
          </button>

          <button className="sidebar-button" onClick={() => navigate("/registrar")}>
            Registrar Paciente
          </button>

          <button className="sidebar-button" onClick={() => navigate("/ver")}>
            Ver Pacientes
          </button>

          <button className="sidebar-button" onClick={() => navigate("/historial")}>
            Historial
          </button>

          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={() => navigate("/")}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className="content-wrapper">{children}</div>
    </div>
  );
}

export default MenuLayout;

