import type { Metadata } from "next";
import { ClinicalAppShell, DataTable, SectionCard, StatGrid, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "Embedded Analytics",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsPage() {
  return (
    <ClinicalAppShell
      eyebrow="Embedded analytics"
      title="Analytics shell"
      lead="Internal analytics surfaces for approved aggregate metrics, fairness monitoring, lesion timeline quality, and consent-safe data contracts."
      actions={[
        { href: "/research", label: "Research dashboard", variant: "ghost" },
        { href: "/ops", label: "Ops boards" },
      ]}
    >
      <StatGrid
        stats={[
          { label: "Timeline events", value: "1.2k", note: "Consent safe", tone: "ok" },
          { label: "Quality failures", value: "8.4%", note: "Lighting is top cause", tone: "warn" },
          { label: "Fairness slices", value: "12", note: "Aggregate only", tone: "info" },
          { label: "Export contracts", value: "5", note: "Reviewed", tone: "neutral" },
        ]}
      />
      <div className="app-two-column">
        <SectionCard title="Lesion history timeline" eyebrow="Aggregate">
          <DataTable
            columns={["Event", "Volume", "Signal", "Privacy"]}
            rows={[
              ["Photo uploaded", "420", <StatusPill key="x1" tone="info">Normal</StatusPill>, "User scoped"],
              ["Retake requested", "67", <StatusPill key="x2" tone="warn">Elevated</StatusPill>, "No raw image"],
              ["Report exported", "103", <StatusPill key="x3" tone="ok">Stable</StatusPill>, "Consent logged"],
              ["Deletion requested", "9", <StatusPill key="x4" tone="ok">Completed</StatusPill>, "Audit only"],
            ]}
          />
        </SectionCard>
        <SectionCard title="Analytics contract" eyebrow="Safety">
          <div className="stack-list">
            <p>Analytics dashboards use aggregate data and role-based access.</p>
            <p>Patient-facing analytics must never replace the native clinical UX.</p>
            <p>Every export requires consent, purpose, owner, retention, and deletion behavior.</p>
          </div>
        </SectionCard>
      </div>
    </ClinicalAppShell>
  );
}
