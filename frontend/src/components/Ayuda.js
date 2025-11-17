import React from "react";
import "./Ayuda.css";
import MenuLayout from "../components/MenuLayout";

function Ayuda() {
  return (
    <MenuLayout>
      <div className="ayuda-container">
        <h1 className="ayuda-title">Guía de Uso</h1>

        <div className="ayuda-card">
          <h2>▶ Cómo cargar un ECG</h2>
          <p>
            1. Desde el menú seleccioná <b>Inicio</b>.<br/>
            2. Hacé clic en la caja blanca para seleccionar una imagen o arrastrala dentro.<br/>
            3. Luego presioná <b>Analizar ECG</b>.<br/>
            4. Una vez procesado, el resultado aparecerá en pantalla.
          </p>
        </div>

        <div className="ayuda-card">
          <h2>▶ Cómo ver tus pacientes</h2>
          <p>
            1. Desde el menú seleccioná <b>Mis Pacientes</b>.<br/>
            2. Vas a ver una lista con todos los pacientes registrados.<br/>
            3. Podés seleccionar uno para ver su historial y sus análisis previos.
          </p>
        </div>

        <div className="ayuda-card">
          <h2>▶ Registrar un nuevo paciente</h2>
          <p>
            1. En el menú elegí <b>Registrar Paciente</b>.<br/>
            2. Completá los campos obligatorios: nombre, DNI, fecha de nacimiento, etc.<br/>
            3. Guardá los datos para que el paciente quede registrado en tu base.
          </p>
        </div>

        <div className="ayuda-card">
          <h2>▶ Cómo se generan los diagnósticos</h2>
          <p>
            • El sistema analiza la imagen del ECG usando un modelo de IA entrenado.<br/>
            • Identifica patrones comunes en arritmias y anomalías.<br/>
            • El diagnóstico es una <b>sugerencia médica</b>, no reemplaza la evaluación del profesional.
          </p>
        </div>

        <div className="ayuda-card">
          <h2>▶ Consejos de uso</h2>
          <p>
            • Usar imágenes claras y bien recortadas del ECG.<br/>
            • Evitar sombras o fotos borrosas.<br/>
            • Guardar cada paciente para mantener un historial organizado.<br/>
            • Revisar los diagnósticos junto con la historia clínica del paciente.
          </p>
        </div>
      </div>
    </MenuLayout>
  );
}

export default Ayuda;
