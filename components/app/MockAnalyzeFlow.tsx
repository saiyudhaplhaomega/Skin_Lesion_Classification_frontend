"use client";

import { useMemo, useState } from "react";
import { SectionCard, StatusPill } from "./ClinicalAppShell";

type Stage = "idle" | "quality" | "result" | "error";

export function MockAnalyzeFlow() {
  const [fileName, setFileName] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [consent, setConsent] = useState("balanced");
  const [explanationOpen, setExplanationOpen] = useState(true);

  const qualityRows = useMemo(
    () => [
      ["Focus", "Usable", "Edges are clear enough for an educational pass."],
      ["Lighting", "Monitor", "A little glare is present; retake if possible."],
      ["Framing", "Usable", "Lesion area is centered with enough surrounding context."],
    ],
    []
  );

  function runDemo() {
    if (!fileName) {
      setStage("error");
      return;
    }
    setStage("quality");
    window.setTimeout(() => setStage("result"), 700);
  }

  return (
    <div className="app-two-column">
      <SectionCard title="Upload and consent" eyebrow="Step 1">
        <form className="analysis-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            <span>Image file</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                setFileName(event.target.files?.[0]?.name ?? "");
                setStage("idle");
              }}
            />
          </label>

          <fieldset>
            <legend>Storage mode</legend>
            <label>
              <input
                type="radio"
                name="consent"
                value="metadata"
                checked={consent === "metadata"}
                onChange={() => setConsent("metadata")}
              />
              Metadata only
            </label>
            <label>
              <input
                type="radio"
                name="consent"
                value="balanced"
                checked={consent === "balanced"}
                onChange={() => setConsent("balanced")}
              />
              Privacy balanced
            </label>
            <label>
              <input
                type="radio"
                name="consent"
                value="history"
                checked={consent === "history"}
                onChange={() => setConsent("history")}
              />
              Full history
            </label>
          </fieldset>

          <button type="button" className="btn-primary" onClick={runDemo}>
            Run educational analysis
          </button>

          <p className="app-note">
            This is not a diagnosis. Use clear lighting, steady focus, and a neutral
            background. Do not upload emergency or identifying images.
          </p>
        </form>
      </SectionCard>

      <SectionCard title="Analysis state" eyebrow="Preview">
        {stage === "idle" && (
          <div className="analysis-preview">
            <StatusPill tone="neutral">Waiting for image</StatusPill>
            <h3>No image selected</h3>
            <p>
              Upload a lesion photo to preview quality checks, Grad-CAM availability,
              safe explanation text, and doctor-review routing.
            </p>
          </div>
        )}

        {stage === "error" && (
          <div className="analysis-preview">
            <StatusPill tone="alert">Image required</StatusPill>
            <h3>Select a file first</h3>
            <p>
              The upload step must complete before quality checks or model explanation
              can run.
            </p>
          </div>
        )}

        {stage === "quality" && (
          <div className="analysis-preview">
            <StatusPill tone="info">Checking quality</StatusPill>
            <h3>Preparing safe analysis</h3>
            <div className="skeleton-stack" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {stage === "result" && (
          <div className="analysis-preview">
            <StatusPill tone="warn">Professional review recommended</StatusPill>
            <h3>{fileName}</h3>
            <div className="heatmap-card" aria-label="Abstract Grad-CAM preview">
              <div className="heatmap-card__base" />
              <div className="heatmap-card__overlay" />
            </div>
            <div className="quality-list">
              {qualityRows.map(([label, status, body]) => (
                <div key={label}>
                  <strong>{label}</strong>
                  <span>{status}</span>
                  <p>{body}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setExplanationOpen((value) => !value)}
            >
              {explanationOpen ? "Hide explanation" : "Show explanation"}
            </button>
            {explanationOpen && (
              <p className="app-note">
                The model focused on a region with uneven color and border contrast.
                This language is educational only and should be reviewed with a
                qualified dermatologist.
              </p>
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

