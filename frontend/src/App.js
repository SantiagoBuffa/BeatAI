import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import DiagnosisResult from "./components/DiagnosisResult";
import "./App.css";

function App() {
  const [diagnosis, setDiagnosis] = useState(null);

  const handleFileUpload = async (file) => {
    // Por ahora simulamos el análisis con un diagnóstico ficticio
    setDiagnosis("Ritmo sinusal normal. No se detectan anomalías significativas.");
  };

  return (
    <div className="App">
      <header>
        <h1>Analizador de ECG</h1>
      </header>
      <main>
        <FileUpload onFileUpload={handleFileUpload} />
        <DiagnosisResult diagnosis={diagnosis} />
      </main>
    </div>
  );
}

export default App;
