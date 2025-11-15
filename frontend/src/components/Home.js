import React, { useState } from "react";
import DiagnosisModal from "./DiagnosisModal";
import "./Home.css";

function Home() {
  const [diagnosis, setDiagnosis] = useState(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setSelectedFile(file);
    setDiagnosis(null);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setDiagnosis(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const texto = `Resultado: ${data.class_name} (confianza: ${(data.confidence * 100).toFixed(2)}%)`;
        setDiagnosis(texto);
      } else {
        setDiagnosis("Error del servidor: " + (data.error || "Desconocido"));
      }
    } catch {
      setDiagnosis("Error de conexión con el backend Flask.");
    }

    setLoading(false);
  };

  return (
    <div className="App">
      {/* HEADER */}
      <header className="app-header">
        <div className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

        <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo" />
      </header>

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <button
            className="sidebar-button"
            onClick={() => {
              setSidebarOpen(false);
              window.location.href = "/registrar";
            }}
          >
            Registrar Pacientes
          </button>

          <button
            className="sidebar-button"
            onClick={() => {
              setSidebarOpen(false);
              window.location.href = "/pacientes";
            }}
          >
            Ver Pacientes
          </button>

          <button
            className="sidebar-button"
            onClick={() => {
              setSidebarOpen(false);
              window.location.href = "/historial";
            }}
          >
            Historial
          </button>

          <div className="sidebar-bottom">
            <button
              className="logout-btn"
              onClick={() => (window.location.href = "/")}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* MAIN */}
      <main className="main-container">
        <div
          className="upload-box"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <div className="upload-border">
            {preview ? (
              <>
                <img src={preview} alt="Vista previa" className="preview-image" />
                <p className="file-name-overlay">{fileName}</p>
              </>
            ) : (
              <div className="upload-icon">
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <p className="upload-text">Subir Archivo</p>
              </div>
            )}
          </div>

          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
        </div>

        <button
          className={`upload-button ${!fileName ? "disabled" : ""} ${
            loading ? "loading" : ""
          }`}
          disabled={!fileName || loading}
          onClick={() =>
            !fileName
              ? document.getElementById("fileInput").click()
              : handleAnalyze()
          }
        >
          {loading ? "Analizando..." : "ANALIZAR ECG"}
          {loading && <span className="btn-spinner" aria-hidden="true"></span>}
        </button>

        {preview && !loading && (
          <button
            className="secondary-button"
            onClick={() => {
              setPreview(null);
              setFileName("");
              setSelectedFile(null);
              setDiagnosis(null);
              document.getElementById("fileInput").click();
            }}
          >
            CARGAR OTRA IMAGEN
          </button>
        )}

        {/* MODAL DE DIAGNÓSTICO */}
        {diagnosis && (
          <DiagnosisModal
            diagnosis={diagnosis}
            onClose={() => setDiagnosis(null)}
          />
        )}
      </main>
    </div>
  );
}

export default Home;
