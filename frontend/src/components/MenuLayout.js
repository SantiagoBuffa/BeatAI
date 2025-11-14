import React, { useState } from "react";
import "./MenuLayout.css";

function MenuLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-wrapper">

      {/* ICONO DEL MENÚ */}
      <div className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">

          <button className="sidebar-button" onClick={() => window.location.href="/home"}>
            Inicio
          </button>

          <button className="sidebar-button" onClick={() => window.location.href="/registrar"}>
            Registrar Paciente
          </button>

          <button className="sidebar-button" onClick={() => window.location.href="/ver"}>
            Ver Pacientes
          </button>

          <button className="sidebar-button" onClick={() => window.location.href="/historial"}>
            Historial
          </button>

          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={() => window.location.href="/"}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* CONTENIDO DE LA PÁGINA */}
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  );
}

export default MenuLayout;



