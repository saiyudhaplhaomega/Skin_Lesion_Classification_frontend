"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function LabResultUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [labName, setLabName] = useState("");
  const [patientNote, setPatientNote] = useState("");
  const [shareWithDoctor, setShareWithDoctor] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setStatus("uploading");
    setErrorMsg("");

    const form = new FormData();
    form.append("file", file);
    if (labName) form.append("lab_name", labName);
    if (patientNote) form.append("patient_note", patientNote);
    form.append("consent_to_share_with_doctor", String(shareWithDoctor));

    try {
      const res = await fetch(`${API_BASE}/api/v1/lab-results`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      setStatus("success");
      setFile(null);
      setLabName("");
      setPatientNote("");
      setShareWithDoctor(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  return (
    <div className="app-card">
      <p className="app-card__eyebrow">Private upload</p>
      <h2>Upload lab result</h2>
      <p className="caption">
        Upload a PDF or photo of your lab report. Your doctor can only access it
        if you check the sharing box below.
      </p>

      <form onSubmit={handleSubmit} className="form-stack">
        <label>
          <span className="label">Lab report file (PDF or image)</span>
          <input
            type="file"
            accept="application/pdf,image/*"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <label>
          <span className="label">Lab provider / lab name (optional)</span>
          <input
            type="text"
            placeholder="e.g. Berlin dermatology lab"
            value={labName}
            onChange={(e) => setLabName(e.target.value)}
          />
        </label>

        <label>
          <span className="label">Your note (optional)</span>
          <textarea
            placeholder="Any context you want your doctor to know"
            value={patientNote}
            onChange={(e) => setPatientNote(e.target.value)}
            rows={3}
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={shareWithDoctor}
            onChange={(e) => setShareWithDoctor(e.target.checked)}
          />
          <span>Allow my doctor to view this lab result</span>
        </label>

        <button type="submit" disabled={!file || status === "uploading"} className="btn-primary">
          {status === "uploading" ? "Uploading..." : "Upload"}
        </button>

        {status === "success" && <p className="success-msg">Lab result uploaded successfully.</p>}
        {status === "error" && <p className="error-msg">{errorMsg}</p>}
      </form>
    </div>
  );
}
