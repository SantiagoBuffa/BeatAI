import React from "react";
import "./DiagnosisModal.css";

function DiagnosisModal({ diagnosis, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Diagnóstico</h2>
        <p>{diagnosis}</p>

        <button className="close-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default DiagnosisModal;
