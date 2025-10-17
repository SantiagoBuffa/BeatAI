import React, { useState } from "react";
import DiagnosisResult from "./components/DiagnosisResult";
import "./App.css";

function App() {
  const [diagnosis, setDiagnosis] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setFileName(file.name);
  
    setDiagnosis(null);
  };

  const handleAnalyze = async () => {
  if (!fileName) return; // seguridad

  setLoading(true);       // muestra spinner / bloquea botón
  setDiagnosis(null);     // limpia resultado mientras analiza (opcional)

  // Simulación de petición/procesamiento, hay que cambairlo por await fetch / axios despues 
  setTimeout(() => {
    setDiagnosis("Ritmo sinusal normal. No se detectan anomalías significativas.");
    setLoading(false);
  }, 1800); // 1.8s de simulación
};


  return (
    <div className="App">
      <header className="app-header">
        <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo" />
      </header>

      <main className="main-container">
        {/* Upload Box */}
        <div
          className="upload-box"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <div className="upload-border">
            <div className="upload-icon">
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </div>
          </div>
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
        </div>


        {/* Nombre del archivo (si se selecciona) */}
        {fileName && <p>{fileName}</p>}

        {/* Botón para analizar */}
        <button
          className={`upload-button ${!fileName ? "disabled" : ""} ${loading ? "loading" : ""}`}
          disabled={!fileName || loading}
          onClick={() => {
            if (!fileName) {
              document.getElementById("fileInput").click();
            } else {
              handleAnalyze();
            }
          }}
        >
          {loading ? "Analizando..." : "ANALIZAR ECG"}
          { /* opcional: agregar ícono spinner dentro del botón */ }
          {loading && <span className="btn-spinner" aria-hidden="true"></span>}
        </button>


        {/* Resultado del diagnóstico */}
        <DiagnosisResult diagnosis={diagnosis} />
      </main>
    </div>
  );
}

export default App;
