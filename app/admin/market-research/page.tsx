import type { Metadata } from "next";
import { ClinicalAppShell, DataTable, SectionCard, StatGrid, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "Admin Market Research",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMarketResearchPage() {
  return (
    <ClinicalAppShell
      eyebrow="Admin market research"
      title="Market research RAG"
      lead="Review Golden Docs status, approved source libraries, generated decision briefs, evidence, risks, and missing data without mixing research material into patient care."
      actions={[
        { href: "/admin/market-research/sources", label: "Sources", variant: "ghost" },
        { href: "/admin/market-research/briefs/demo", label: "Open brief" },
      ]}
    >
      <StatGrid
        stats={[
          { label: "Approved sources", value: "42", note: "Golden docs: 8", tone: "ok" },
          { label: "Pending review", value: "6", note: "Needs admin approval", tone: "warn" },
          { label: "Briefs drafted", value: "12", note: "3 this week", tone: "info" },
          { label: "Evidence gaps", value: "5", note: "Tracked", tone: "neutral" },
        ]}
      />
      <div className="app-two-column">
        <SectionCard title="Recent briefs" eyebrow="Decision support">
          <DataTable
            columns={["Brief", "State", "Evidence", "Owner"]}
            rows={[
              ["German dermatology market", <StatusPill key="b1" tone="warn">Draft</StatusPill>, "12 sources", "Admin"],
              ["Teledermatology pricing", <StatusPill key="b2" tone="info">Review</StatusPill>, "9 sources", "Strategy"],
              ["Competitor consent flows", <StatusPill key="b3" tone="ok">Approved</StatusPill>, "15 sources", "Product"],
            ]}
          />
        </SectionCard>
        <SectionCard title="Research guardrails" eyebrow="Separation">
          <p>
            This area is admin-only. Market research material must not appear in
            patient, doctor, or model-output screens unless it has been converted
            into approved product copy.
          </p>
        </SectionCard>
      </div>
    </ClinicalAppShell>
  );
}
