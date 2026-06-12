import type { Metadata } from "next";
import { ClinicalAppShell, DataTable, SectionCard, StatGrid, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "Agent Workspace",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AgentsPage() {
  return (
    <ClinicalAppShell
      eyebrow="Agentic XAI"
      title="Role-based agent workspace"
      lead="Preview the patient, doctor, research, and admin assistant surfaces with strict role separation and visible evidence boundaries."
      actions={[
        { href: "/dashboard", label: "Patient view", variant: "ghost" },
        { href: "/admin", label: "Admin console" },
      ]}
    >
      <StatGrid
        stats={[
          { label: "Patient agent", value: "Safe", note: "Education only", tone: "ok" },
          { label: "Doctor agent", value: "Review", note: "Clinical packet context", tone: "info" },
          { label: "Research agent", value: "Aggregate", note: "No identifiers", tone: "ok" },
          { label: "Admin agent", value: "Ops", note: "Policy controlled", tone: "warn" },
        ]}
      />
      <div className="app-two-column">
        <SectionCard title="Conversation lanes" eyebrow="Role scoped">
          <DataTable
            columns={["Lane", "Allowed context", "Blocked context", "State"]}
            rows={[
              ["Patient", "Education, reminders, own history", "Diagnosis and treatment claims", <StatusPill key="a1" tone="ok">Ready</StatusPill>],
              ["Doctor", "Review packet, quality flags, patient notes", "Admin market research", <StatusPill key="a2" tone="info">Preview</StatusPill>],
              ["Research", "Aggregate metrics, model drift, fairness", "Patient identifiers", <StatusPill key="a3" tone="ok">Guarded</StatusPill>],
              ["Admin", "Ops, audit, source review", "Private clinical notes", <StatusPill key="a4" tone="warn">Restricted</StatusPill>],
            ]}
          />
        </SectionCard>
        <SectionCard title="Prompt safety" eyebrow="Controls">
          <div className="stack-list">
            <p>Every answer must name whether it is educational, clinical-review, research, or operations context.</p>
            <p>Patient-facing responses must avoid diagnosis, prognosis, treatment, and urgency claims.</p>
            <p>Evidence citations are required before a market or research recommendation can be approved.</p>
          </div>
        </SectionCard>
      </div>
    </ClinicalAppShell>
  );
}
