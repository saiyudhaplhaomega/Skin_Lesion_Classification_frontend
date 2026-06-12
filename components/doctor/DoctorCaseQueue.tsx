import { DataTable, SectionCard, StatGrid, StatusPill } from "../app/ClinicalAppShell";

const cases = [
  ["PX-2401", "New Grad-CAM review", <StatusPill key="p1" tone="warn">Priority</StatusPill>, "12 min"],
  ["PX-2388", "Patient follow-up packet", <StatusPill key="p2" tone="info">Queued</StatusPill>, "34 min"],
  ["PX-2302", "Quality retake requested", <StatusPill key="p3" tone="ok">Ready</StatusPill>, "1 hr"],
];

export function DoctorCaseQueue() {
  return (
    <div className="app-page-stack">
      <StatGrid
        stats={[
          { label: "Cases waiting", value: "18", note: "4 flagged by model", tone: "warn" },
          { label: "Ready packets", value: "11", note: "Images and history attached", tone: "ok" },
          { label: "Retakes needed", value: "5", note: "Lighting or focus failed", tone: "info" },
          { label: "Avg review time", value: "7m", note: "Today", tone: "neutral" },
        ]}
      />

      <div className="app-two-column">
        <SectionCard title="Review queue" eyebrow="Clinical worklist">
          <DataTable
            columns={["Case", "Task", "Status", "Age"]}
            rows={cases}
          />
        </SectionCard>

        <SectionCard title="Selected case" eyebrow="Explainability packet">
          <div className="case-panel">
            <StatusPill tone="warn">Professional review recommended</StatusPill>
            <h3>PX-2401</h3>
            <p>
              Patient uploaded a shoulder lesion photo with a model attention region
              around asymmetric color variation. Quality checks passed with glare
              warning.
            </p>
            <div className="heatmap-card compact" aria-label="Grad-CAM summary preview">
              <div className="heatmap-card__base" />
              <div className="heatmap-card__overlay" />
            </div>
            <div className="review-actions">
              <button type="button" className="btn-primary">Add review note</button>
              <button type="button" className="btn-ghost">Request retake</button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
