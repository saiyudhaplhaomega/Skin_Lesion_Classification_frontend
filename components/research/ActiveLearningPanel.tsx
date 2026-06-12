"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface ActiveLearningCase {
  prediction_id: string;
  model_version: string;
  reason: string;
  calibrated_confidence: number | null;
}

interface ActiveLearningQueue {
  cases: ActiveLearningCase[];
  uncertainty_threshold: number;
  note: string;
}

const REASON_LABELS: Record<string, string> = {
  high_uncertainty: "High uncertainty",
  rare_pattern: "Rare pattern",
  edge_case: "Edge case",
  model_disagreement: "Model disagreement",
};

export function ActiveLearningPanel() {
  const [data, setData] = useState<ActiveLearningQueue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/research/active-learning/queue`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json() as Promise<ActiveLearningQueue>;
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading active learning queue...</p>;
  if (error) return <p className="error-msg">Could not load queue: {error}</p>;
  if (!data) return null;

  return (
    <div className="app-card">
      <p className="app-card__eyebrow">Research review</p>
      <h2>Active learning queue</h2>
      <p className="caption">
        Cases flagged for doctor or research review (uncertainty threshold:{" "}
        {(data.uncertainty_threshold * 100).toFixed(0)}%).
      </p>
      {data.note && <p className="info-msg">{data.note}</p>}

      {data.cases.length === 0 ? (
        <p>No cases in the active learning queue.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Prediction ID</th>
              <th>Model</th>
              <th>Reason</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {data.cases.map((c) => (
              <tr key={c.prediction_id}>
                <td className="mono">{c.prediction_id.slice(0, 8)}...</td>
                <td>{c.model_version}</td>
                <td>{REASON_LABELS[c.reason] ?? c.reason}</td>
                <td>
                  {c.calibrated_confidence != null
                    ? `${(c.calibrated_confidence * 100).toFixed(1)}%`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
