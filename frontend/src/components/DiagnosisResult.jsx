import React from "react";

export default function DiagnosisResult({ diagnosis }) {
  if (!diagnosis) return null;

  return (
    <div className="diagnosis-result">
      <h3>Diagnóstico aproximado:</h3>
      <p>{diagnosis}</p>
    </div>
  );
}
