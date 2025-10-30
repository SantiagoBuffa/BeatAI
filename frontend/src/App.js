import React, { useState } from "react";
import DiagnosisResult from "./components/DiagnosisResult";
import Login from "./components/Login";
import SignUp1 from "./components/SignUp1";
import SignUp2 from "./components/SignUp2";
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // usuario logueado
  const [signUpStep, setSignUpStep] = useState(null); // controla el paso del registro
  const [signUpData, setSignUpData] = useState({}); // guarda datos del registro
  const [diagnosis, setDiagnosis] = useState(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // ----------- Funciones de ECG ----------------
  const handleFileUpload = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setSelectedFile(file);
    setDiagnosis(null);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
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
    } catch (err) {
      setDiagnosis("Error de conexión con el backend Flask.");
    }

    setLoading(false);
  };

  // ------------------- RENDER -------------------

  // 🔹 Si NO hay usuario logueado, mostramos Login o SignUp
  if (!user) {
    // Paso 1 del registro
    if (signUpStep === 1) {
      return (
        <SignUp1
          onNext={(data) => {
            setSignUpData(data);
            setSignUpStep(2);
          }}
          onSwitchToLogin={() => setSignUpStep(null)}
        />
      );
    }

    // Paso 2 del registro
    if (signUpStep === 2) {
      return (
        <SignUp2
          userData={signUpData}
          onRegister={(finalData) => {
            console.log("✅ Datos finales del registro:", finalData);
            setSignUpStep(null); // vuelve al login
          }}
          onBack={() => setSignUpStep(1)}
          onSwitchToLogin={() => setSignUpStep(null)}
        />
      );
    }

    // Login normal
    return <Login onLogin={setUser} onSwitchToSignUp={() => setSignUpStep(1)} />;
  }

  // 🔹 Si hay usuario logueado → pantalla principal del ECG
  return (
    <div className="App">
      <header className="app-header">
        <img src="/beatAI_logo.png" alt="BeatAI Logo" className="beatai-logo" />
        <div className="user-greeting">
          Hola, {user}
          <button onClick={() => setUser(null)} className="logout-btn">
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="main-container">
        {/* Upload Box */}
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
          {loading && <span className="btn-spinner" aria-hidden="true"></span>}
        </button>

        {/* Botón para cargar otra imagen */}
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

        {/* Resultado del diagnóstico */}
        <DiagnosisResult diagnosis={diagnosis} />
      </main>
    </div>
  );
}

export default App;
