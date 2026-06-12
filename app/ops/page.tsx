import type { Metadata } from "next";
import { ClinicalAppShell, DataTable, SectionCard, StatGrid, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "Operator Surfaces",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OpsPage() {
  return (
    <ClinicalAppShell
      eyebrow="Operator surfaces"
      title="Reliability and model operations"
      lead="Operator-only boards for dead-letter queues, idempotency, circuit breakers, model drift, calibration, shadow deploys, canaries, sticky sessions, flags, and SLO budgets."
      actions={[
        { href: "/admin", label: "Admin console", variant: "ghost" },
        { href: "/research", label: "Research view" },
      ]}
    >
      <StatGrid
        stats={[
          { label: "Error budget", value: "72%", note: "Remaining", tone: "ok" },
          { label: "DLQ items", value: "4", note: "Needs replay decision", tone: "warn" },
          { label: "Drift status", value: "Watch", note: "Fitzpatrick slice", tone: "warn" },
          { label: "Canary split", value: "10%", note: "Model v2 shadow", tone: "info" },
        ]}
      />
      <div className="app-two-column">
        <SectionCard title="Operations boards" eyebrow="Runbooks">
          <DataTable
            columns={["Surface", "State", "Owner", "Action"]}
            rows={[
              ["Dead-letter queue", <StatusPill key="o1" tone="warn">4 waiting</StatusPill>, "Platform", "Inspect payload"],
              ["Circuit breaker", <StatusPill key="o2" tone="ok">Closed</StatusPill>, "API", "Monitor"],
              ["Model drift", <StatusPill key="o3" tone="warn">Watch</StatusPill>, "ML Ops", "Review slice"],
              ["Calibration", <StatusPill key="o4" tone="info">Scheduled</StatusPill>, "Research", "Run report"],
              ["Feature flags", <StatusPill key="o5" tone="info">Active</StatusPill>, "Product", "Check rollout"],
            ]}
          />
        </SectionCard>
        <SectionCard title="Degraded-mode policy" eyebrow="Patient safety">
          <div className="stack-list">
            <p>If model inference is unavailable, patient upload remains possible but analysis is clearly marked unavailable.</p>
            <p>Doctor-review packets must show missing data instead of inventing model outputs.</p>
            <p>Operators can replay failed jobs only after checking consent and idempotency keys.</p>
          </div>
        </SectionCard>
      </div>
    </ClinicalAppShell>
  );
}
