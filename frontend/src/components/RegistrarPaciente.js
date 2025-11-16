import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrarPacientes.css";

function RegistrarPacientes() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dni: "",
    name: "",
    date_of_birth: "",
    insurance_name: "",
    insurance_member: "",
    insurance_plan: "",
  });

  const [showModal, setShowModal] = useState(false); // ⬅️ Modal

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      dni: "",
      name: "",
      date_of_birth: "",
      insurance_name: "",
      insurance_member: "",
      insurance_plan: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const doctorDni = localStorage.getItem("doctor_dni");
    if (!doctorDni) {
      alert("Error: no se encontró el DNI del doctor. Volvé a iniciar sesión.");
      return;
    }

    const payload = {
      dni: formData.dni,
      name: formData.name,
      date_of_birth: formData.date_of_birth,
      health_insurance: {
        name: formData.insurance_name,
        nro_member: formData.insurance_member,
        nro_plan: formData.insurance_plan,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/patients/register_patient/${doctorDni}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowModal(true); // ⬅️ Muestra el modal
      } else {
        alert(data.message || "Error al registrar");
      }

    } catch (err) {
      alert("Error registrando paciente");
    }
  };

  return (
    <>
      <div className="rp-container">
        <h2 className="rp-title">Registrar Paciente</h2>

        <form className="rp-form" onSubmit={handleSubmit}>
          <label className="rp-label">DNI</label>
          <input
            className="rp-input"
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            required
          />

          <label className="rp-label">Nombre Completo</label>
          <input
            className="rp-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label className="rp-label">Fecha de Nacimiento</label>
          <input
            className="rp-input"
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />

          {/* --- OBRA SOCIAL --- */}
          <div className="rp-insurance-box">
            <div className="rp-insurance-title">Obra Social</div>

            <div className="rp-insurance-grid">
              <div className="rp-form-group">
                <label className="rp-label"> Nombre</label>
                <input
                  className="rp-input"
                  type="text"
                  name="insurance_name"
                  value={formData.insurance_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="rp-form-group">
                <label className="rp-label"> Nro Afiliado</label>
                <input
                  className="rp-input"
                  type="text"
                  name="insurance_member"
                  value={formData.insurance_member}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="rp-form-group">
                <label className="rp-label"> Plan</label>
                <input
                  className="rp-input"
                  type="text"
                  name="insurance_plan"
                  value={formData.insurance_plan}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button className="rp-button" type="submit">Registrar</button>
        </form>
      </div>

      {/* ------------ MODAL ------------ */}
      {showModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h3>Paciente registrado exitosamente</h3>

            <button
              className="modal-btn"
              onClick={() => {
                resetForm();
                setShowModal(false);
              }}
            >
              Registrar otro
            </button>

            <button
              className="modal-btn cancel"
              onClick={() => navigate("/home")}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default RegistrarPacientes;
