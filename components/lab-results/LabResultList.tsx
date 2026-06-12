"use client";

import { useEffect, useState } from "react";
import { LabResultStatus } from "./LabResultStatus";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface LabResult {
  id: string;
  lesion_id: string | null;
  test_date: string | null;
  lab_name: string | null;
  file_type: string;
  status: string;
  patient_note: string | null;
  doctor_note: string | null;
  consent_to_share_with_doctor: boolean;
  created_at: string;
}

export function LabResultList() {
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/lab-results`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json() as Promise<LabResult[]>;
      })
      .then(setResults)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading lab results...</p>;
  if (error) return <p className="error-msg">Could not load lab results: {error}</p>;
  if (results.length === 0) return <p>No lab results uploaded yet.</p>;

  return (
    <div className="app-card lab-result-list">
      <p className="app-card__eyebrow">Doctor-visible only with consent</p>
      <h2>Uploaded lab results</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Lab</th>
            <th>Type</th>
            <th>Status</th>
            <th>Shared with doctor</th>
            <th>Doctor note</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id}>
              <td>{r.test_date ?? r.created_at.slice(0, 10)}</td>
              <td>{r.lab_name ?? "-"}</td>
              <td>{r.file_type}</td>
              <td>
                <LabResultStatus status={r.status} />
              </td>
              <td>{r.consent_to_share_with_doctor ? "Yes" : "No"}</td>
              <td>{r.doctor_note ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
