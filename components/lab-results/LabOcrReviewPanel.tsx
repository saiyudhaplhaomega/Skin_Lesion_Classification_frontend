"use client";

import { useEffect, useState } from "react";
import {
  createLabOcrRun,
  getLatestLabOcrRun,
  reviewLabOcrValue,
  type LabExtractedValueResponse,
  type LabOcrReviewPageResponse,
  type LabOcrReviewPayload,
} from "@/lib/api";
import { SectionCard, StatusPill } from "@/components/app/ClinicalAppShell";

type DraftEdits = Record<string, { value: string; unit: string; note: string }>;

export function LabOcrReviewPanel({ labResultId }: { labResultId: string }) {
  const [data, setData] = useState<LabOcrReviewPageResponse | null>(null);
  const [edits, setEdits] = useState<DraftEdits>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function loadLatest() {
    setLoading(true);
    setError("");
    try {
      const latest = await getLatestLabOcrRun(labResultId);
      setData(latest);
      const nextEdits: DraftEdits = {};
      latest.run.values.forEach((value) => {
        nextEdits[value.id] = {
          value: value.reviewed_value ?? value.value,
          unit: value.reviewed_unit ?? value.unit ?? "",
          note: value.review_note ?? "",
        };
      });
      setEdits(nextEdits);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load OCR draft.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLatest();
  }, [labResultId]);

  async function startRun() {
    setBusy("start");
    setError("");
    try {
      await createLabOcrRun(labResultId);
      await loadLatest();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start OCR draft.");
    } finally {
      setBusy("");
    }
  }

  async function submitReview(value: LabExtractedValueResponse, reviewStatus: LabOcrReviewPayload["review_status"]) {
    const edit = edits[value.id] ?? { value: value.value, unit: value.unit ?? "", note: "" };
    const payload: LabOcrReviewPayload = {
      review_status: reviewStatus,
      review_note: edit.note || undefined,
    };

    if (reviewStatus === "edited") {
      payload.reviewed_value = edit.value;
      payload.reviewed_unit = edit.unit || undefined;
    }

    setBusy(value.id);
    setError("");
    try {
      const reviewed = await reviewLabOcrValue(labResultId, value.id, payload);
      setData((current) => {
        if (!current) return current;
        return {
          ...current,
          run: {
            ...current.run,
            values: current.run.values.map((item) => (item.id === reviewed.id ? reviewed : item)),
          },
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save review decision.");
    } finally {
      setBusy("");
    }
  }

  if (loading) {
    return (
      <SectionCard title="OCR draft review" eyebrow="Loading">
        <div className="skeleton-stack" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </SectionCard>
    );
  }

  return (
    <div className="app-page-stack">
      {error && (
        <SectionCard title="OCR draft unavailable" eyebrow="Needs setup">
          <p className="error-msg">{error}</p>
          <button type="button" className="btn-primary" onClick={startRun} disabled={busy === "start"}>
            {busy === "start" ? "Starting..." : "Start manual OCR draft"}
          </button>
        </SectionCard>
      )}

      {data && (
        <>
          <div className="app-two-column">
            <SectionCard title="Original lab result" eyebrow="Source document">
              <div className="stack-list">
                <p>
                  Keep the original report visible while reviewing OCR. Draft values are
                  helper text only until a doctor accepts, edits, or rejects them.
                </p>
                <div className="stack-item">
                  <div>
                    <span className="mono-label">Lab</span>
                    <h3>{data.lab_result.lab_name ?? "Unnamed lab report"}</h3>
                    <p>{data.lab_result.test_date ?? data.lab_result.created_at.slice(0, 10)}</p>
                  </div>
                  <StatusPill tone={data.lab_result.consent_to_share_with_doctor ? "ok" : "warn"}>
                    {data.lab_result.consent_to_share_with_doctor ? "Doctor consent" : "No consent"}
                  </StatusPill>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Extraction run" eyebrow={data.run.provider}>
              <div className="stack-list">
                <StatusPill tone={data.run.status === "reviewed" ? "ok" : "info"}>
                  {data.run.status}
                </StatusPill>
                <p>
                  {data.run.values.length === 0
                    ? "The manual stub returned no automatic values. This is expected until a real OCR provider is selected."
                    : `${data.run.values.length} draft values require doctor review.`}
                </p>
                <button type="button" className="btn-ghost" onClick={startRun} disabled={busy === "start"}>
                  Create another draft run
                </button>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Draft extracted values" eyebrow="Doctor review required">
            {data.run.values.length === 0 ? (
              <p>No draft values were extracted. Keep the original lab upload as the source of truth.</p>
            ) : (
              <div className="stack-list">
                {data.run.values.map((value) => {
                  const edit = edits[value.id] ?? { value: value.value, unit: value.unit ?? "", note: "" };
                  return (
                    <article className="stack-item" key={value.id}>
                      <div className="form-stack">
                        <div>
                          <span className="mono-label">Draft - pending review</span>
                          <h3>{value.name}</h3>
                          <p>
                            OCR read: {value.value}
                            {value.unit ? ` ${value.unit}` : ""} - confidence{" "}
                            {Math.round(value.confidence * 100)}%
                          </p>
                        </div>
                        <label>
                          <span className="label">Corrected value</span>
                          <input
                            type="text"
                            value={edit.value}
                            onChange={(event) =>
                              setEdits((current) => ({
                                ...current,
                                [value.id]: { ...edit, value: event.target.value },
                              }))
                            }
                          />
                        </label>
                        <label>
                          <span className="label">Unit</span>
                          <input
                            type="text"
                            value={edit.unit}
                            onChange={(event) =>
                              setEdits((current) => ({
                                ...current,
                                [value.id]: { ...edit, unit: event.target.value },
                              }))
                            }
                          />
                        </label>
                        <label>
                          <span className="label">Review note</span>
                          <textarea
                            rows={2}
                            value={edit.note}
                            onChange={(event) =>
                              setEdits((current) => ({
                                ...current,
                                [value.id]: { ...edit, note: event.target.value },
                              }))
                            }
                          />
                        </label>
                      </div>
                      <div className="review-actions">
                        <StatusPill tone={value.review_status === "pending" ? "warn" : "ok"}>
                          {value.review_status}
                        </StatusPill>
                        <button
                          type="button"
                          className="btn-ghost"
                          disabled={busy === value.id}
                          onClick={() => void submitReview(value, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          disabled={busy === value.id}
                          onClick={() => void submitReview(value, "edited")}
                        >
                          Save edit
                        </button>
                        <button
                          type="button"
                          className="btn-ghost"
                          disabled={busy === value.id}
                          onClick={() => void submitReview(value, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </>
      )}
    </div>
  );
}
