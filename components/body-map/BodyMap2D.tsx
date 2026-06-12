"use client";

import { useState } from "react";
import { SectionCard, StatusPill } from "../app/ClinicalAppShell";

const lesions = [
  {
    id: "L-1024",
    label: "Left shoulder",
    side: "front",
    x: 38,
    y: 27,
    status: "Doctor review",
    change: "Border change noted in May",
  },
  {
    id: "L-1088",
    label: "Upper back",
    side: "back",
    x: 52,
    y: 31,
    status: "Stable",
    change: "No visible change across two photos",
  },
  {
    id: "L-1119",
    label: "Right calf",
    side: "back",
    x: 59,
    y: 76,
    status: "Recheck due",
    change: "Retake photo with better lighting",
  },
];

export function BodyMap2D() {
  const [side, setSide] = useState<"front" | "back">("front");
  const visibleLesions = lesions.filter((lesion) => lesion.side === side);

  return (
    <div className="app-two-column body-map-layout">
      <SectionCard title="Tracked locations" eyebrow="Patient submitted">
        <div className="segmented-control" aria-label="Body side">
          <button
            type="button"
            aria-pressed={side === "front"}
            onClick={() => setSide("front")}
          >
            Front
          </button>
          <button
            type="button"
            aria-pressed={side === "back"}
            onClick={() => setSide("back")}
          >
            Back
          </button>
        </div>

        <div className="body-map-frame">
          <img
            src={`/art/bodymap-${side}.png`}
            alt={`${side} body map`}
            className="body-map-image"
          />
          {visibleLesions.map((lesion) => (
            <button
              key={lesion.id}
              type="button"
              className="body-map-pin"
              style={{ left: `${lesion.x}%`, top: `${lesion.y}%` }}
              aria-label={`${lesion.label}, ${lesion.status}`}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Location notes" eyebrow="Doctor handoff">
        <div className="stack-list">
          {lesions.map((lesion) => (
            <article key={lesion.id} className="stack-item">
              <div>
                <span className="mono-label">{lesion.id}</span>
                <h3>{lesion.label}</h3>
                <p>{lesion.change}</p>
              </div>
              <StatusPill
                tone={
                  lesion.status === "Stable"
                    ? "ok"
                    : lesion.status === "Recheck due"
                      ? "warn"
                      : "info"
                }
              >
                {lesion.status}
              </StatusPill>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
