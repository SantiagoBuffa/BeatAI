import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import DiagnosisResult from "./components/DiagnosisResult";
import "./App.css";

function App() {
  const [diagnosis, setDiagnosis] = useState(null);

  const handleFileUpload = async (file) => {
    // Simulación de diagnóstico
    setDiagnosis("Ritmo sinusal normal. No se detectan anomalías significativas.");
  };

  return (
    <div className="App">
      <header className="app-header">
        <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo" />
      </header>

      <main className="main-container">
        <div className="upload-box">
          <div className="upload-icon">
            <i className="fa-solid fa-cloud-arrow-up"></i>
          </div>
        </div>

        <button className="upload-button">CARGAR ECG</button>

        <DiagnosisResult diagnosis={diagnosis} />
      </main>
    </div>
  );
}

export default App;