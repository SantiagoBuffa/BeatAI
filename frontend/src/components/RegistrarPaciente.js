import React, { useState } from "react";
import MenuLayout from "./MenuLayout"; 
import "./RegistrarPacientes.css";

function RegistrarPacientes() {
  const [formData, setFormData] = useState({
    dni: "",
    name: "",
    date_of_birth: "",
    doctor_dni: "",
    insurance_name: "",
    insurance_member: "",
    insurance_plan: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      dni: formData.dni,
      name: formData.name,
      date_of_birth: formData.date_of_birth,
      doctor_dni: formData.doctor_dni,
      health_insurance: {
        name: formData.insurance_name,
        nro_member: formData.insurance_member,
        nro_plan: formData.insurance_plan,
      },
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/register_patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      alert(data.message);
    } catch (err) {
      alert("Error registrando paciente");
    }
  };

  return (
    <MenuLayout>
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

          <label className="rp-label">DNI del Doctor</label>
          <input
            className="rp-input"
            type="text"
            name="doctor_dni"
            value={formData.doctor_dni}
            onChange={handleChange}
            required
          />

          {/* --- OBRA SOCIAL --- */}
          <div className="rp-insurance-box">
            <div className="rp-insurance-title">Obra Social</div>

            <div className="rp-insurance-grid">
              <div className="rp-form-group">
                <label className="rp-label">Nombre</label>
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
                <label className="rp-label">Nro Afiliado</label>
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
                <label className="rp-label">Plan</label>
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
    </MenuLayout>
  );
}

export default RegistrarPacientes;
