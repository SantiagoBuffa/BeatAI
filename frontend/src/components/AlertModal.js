import React from "react";
import "./AlertModal.css";

function AlertModal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Atención</h2>
        <p>{message}</p>

        <button className="modal-button" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default AlertModal;
