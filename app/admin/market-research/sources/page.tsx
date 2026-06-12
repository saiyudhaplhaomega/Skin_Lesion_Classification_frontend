import type { Metadata } from "next";
import { ClinicalAppShell, DataTable, SectionCard, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "Admin Market Research Sources",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMarketResearchSourcesPage() {
  return (
    <ClinicalAppShell
      eyebrow="Source review"
      title="Market research sources"
      lead="Review source upload states, approval queues, approved source libraries, rejected sources, and Golden Doc candidates."
      actions={[
        { href: "/admin/market-research", label: "Research home", variant: "ghost" },
        { href: "/admin", label: "Admin console" },
      ]}
    >
      <SectionCard title="Source library" eyebrow="Evidence controls">
        <DataTable
          columns={["Source", "Type", "State", "Notes"]}
          rows={[
            ["Teledermatology reimbursement report", "PDF", <StatusPill key="s1" tone="ok">Approved</StatusPill>, "Golden Doc"],
            ["Competitor pricing page", "URL", <StatusPill key="s2" tone="info">Queued</StatusPill>, "Needs citation check"],
            ["Unverified forum summary", "Text", <StatusPill key="s3" tone="alert">Rejected</StatusPill>, "Low reliability"],
            ["German dermatology association guidance", "PDF", <StatusPill key="s4" tone="warn">Candidate</StatusPill>, "Admin review"],
          ]}
        />
      </SectionCard>
    </ClinicalAppShell>
  );
}
