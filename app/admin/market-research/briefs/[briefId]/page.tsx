import type { Metadata } from "next";
import { ClinicalAppShell, SectionCard, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "Admin Market Research Brief",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMarketResearchBriefPage({
  params,
}: {
  params: { briefId: string };
}) {
  return (
    <ClinicalAppShell
      eyebrow="Decision brief"
      title="Generated market research brief"
      lead="Review the executive summary, recommendation, evidence, risks, assumptions, missing data, and next actions before any product decision."
      actions={[
        { href: "/admin/market-research", label: "Research home", variant: "ghost" },
        { href: "/admin/market-research/sources", label: "Sources" },
      ]}
    >
      <div className="app-two-column">
        <SectionCard title={params.briefId.toUpperCase()} eyebrow="Recommendation">
          <StatusPill tone="warn">Draft requires approval</StatusPill>
          <p>
            Early evidence suggests focusing on privacy-safe doctor handoff and
            educational explainability before adding paid market expansion features.
          </p>
        </SectionCard>
        <SectionCard title="Evidence and risks" eyebrow="Audit trail">
          <div className="stack-list">
            <p>Evidence: approved source library, Golden Docs, competitor notes.</p>
            <p>Risk: market claims must not become medical claims.</p>
            <p>Missing data: pricing validation and user research sample size.</p>
          </div>
        </SectionCard>
      </div>
    </ClinicalAppShell>
  );
}
