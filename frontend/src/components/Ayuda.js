import React, { useState } from "react";
import "./Ayuda.css";
import MenuLayout from "./MenuLayout";

function Ayuda() {
  const [open, setOpen] = useState(null);

  const toggle = (i) => {
    setOpen(open === i ? null : i);
  };

  const items = [
    {
      title: "¿Cómo subir un ECG para analizarlo?",
      text: "En la pantalla principal, seleccioná el botón 'Subir ECG'. Elegí la imagen desde tu dispositivo y luego presioná 'Analizar'. El sistema procesará automáticamente la señal."
    },
    {
      title: "¿Cómo registrar un nuevo paciente?",
      text: "Ingresá a 'Registrar Paciente' desde el menú. Completá los datos requeridos y presioná 'Registrar'."
    },
    {
      title: "¿Cómo visualizar mis pacientes?",
      text: "En 'Mis Pacientes' podés ver la lista, buscar por DNI y acceder al historial."
    },
    {
      title: "¿Cómo editar mi perfil?",
      text: "Ingresá a 'Mi Perfil' y presioná 'Editar'."
    },
    {
      title: "¿Cómo ver el historial de un paciente?",
      text: "Desde la lista de pacientes, seleccioná uno y presioná 'Ver Historial'."
    }
  ];

  return (
    <MenuLayout>
      <div className="ayuda-container">
        <h2 className="ayuda-title">Centro de Ayuda</h2>

        <div className="accordion">
          {items.map((item, i) => (
            <div key={i} className="accordion-item">

              <div className="accordion-header" onClick={() => toggle(i)}>
                {item.title}
                <span className={`chevron ${open === i ? "rotate" : ""}`}>
                  ❯
                </span>
              </div>

              <div
                className={`accordion-content-wrapper ${
                  open === i ? "open" : ""
                }`}
              >
                <div className="accordion-content">
                  <p>{item.text}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </MenuLayout>
  );
}

export default Ayuda;
