import { DataTable, SectionCard, StatGrid, StatusPill } from "../app/ClinicalAppShell";

export function AdminReviewDashboard() {
  return (
    <div className="app-page-stack">
      <StatGrid
        stats={[
          { label: "System health", value: "99.9%", note: "API and model online", tone: "ok" },
          { label: "Flagged uploads", value: "7", note: "Needs moderation", tone: "warn" },
          { label: "Doctor accounts", value: "24", note: "2 pending verification", tone: "info" },
          { label: "Audit events", value: "186", note: "Last 24 hours", tone: "neutral" },
        ]}
      />

      <div className="app-two-column">
        <SectionCard title="Operational review" eyebrow="Admin console">
          <DataTable
            columns={["Area", "State", "Owner", "Next action"]}
            rows={[
              ["Model inference", <StatusPill key="s1" tone="ok">Healthy</StatusPill>, "ML Ops", "Monitor"],
              ["Image moderation", <StatusPill key="s2" tone="warn">Attention</StatusPill>, "Safety", "Review queue"],
              ["Consent exports", <StatusPill key="s3" tone="info">Scheduled</StatusPill>, "Privacy", "Run nightly job"],
              ["Doctor verification", <StatusPill key="s4" tone="warn">Pending</StatusPill>, "Admin", "Check documents"],
            ]}
          />
        </SectionCard>

        <SectionCard title="Release controls" eyebrow="Feature flags">
          <div className="flag-list">
            {[
              ["Grad-CAM overlay v2", "Enabled for 25 percent"],
              ["Doctor packet builder", "Internal beta"],
              ["Patient reminder email", "Disabled until SMTP setup"],
              ["Research dashboard export", "Admin only"],
            ].map(([label, body]) => (
              <label key={label}>
                <input type="checkbox" defaultChecked={!body.startsWith("Disabled")} />
                <span>
                  <strong>{label}</strong>
                  <small>{body}</small>
                </span>
              </label>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
