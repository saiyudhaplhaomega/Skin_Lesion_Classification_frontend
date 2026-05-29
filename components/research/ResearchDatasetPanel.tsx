"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface DatasetMetrics {
  total_approved: number;
  total_rejected: number;
  total_pending: number;
  model_version: string;
}

export function ResearchDatasetPanel() {
  const [data, setData] = useState<DatasetMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/research/metrics/dataset`)
      .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json() as Promise<DatasetMetrics>; })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dataset metrics…</p>;
  if (error) return <p className="error-msg">Could not load metrics: {error}</p>;
  if (!data) return null;

  return (
    <div className="card">
      <h2>Training Dataset</h2>
      <p className="caption">Model version: <strong>{data.model_version}</strong></p>
      <div className="stat-grid">
        <div className="stat">
          <span className="stat-value">{data.total_approved}</span>
          <span className="stat-label">Approved</span>
        </div>
        <div className="stat">
          <span className="stat-value">{data.total_pending}</span>
          <span className="stat-label">Pending review</span>
        </div>
        <div className="stat">
          <span className="stat-value">{data.total_rejected}</span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>
    </div>
  );
}
