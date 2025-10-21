import React, { useState } from "react";

export default function FileUpload({ onFileUpload }) {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Por favor, seleccioná un archivo antes de analizar.");
      return;
    }
    onFileUpload(file);
  };

  return (
    <div className="file-upload">
      <h2>Subir archivo de ECG</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv,.txt,.png,.jpg,.jpeg"
          onChange={handleChange}
        />
        <button type="submit">Analizar</button>
      </form>
      {file && <p>Archivo seleccionado: <b>{file.name}</b></p>}
    </div>
  );
}
