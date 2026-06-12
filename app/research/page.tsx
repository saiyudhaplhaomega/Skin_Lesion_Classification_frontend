import type { Metadata } from "next";
import { ClinicalAppShell } from "@/components/app/ClinicalAppShell";
import { ResearchDatasetPanel } from "@/components/research/ResearchDatasetPanel";
import { ActiveLearningPanel } from "@/components/research/ActiveLearningPanel";

export const metadata: Metadata = {
  title: "Research Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResearchPage() {
  return (
    <ClinicalAppShell
      eyebrow="Research"
      title="Research and fairness dashboard"
      lead="Aggregate metrics only. No patient identifiers are displayed here, and research review stays separate from patient-facing workflows."
      actions={[
        { href: "/admin", label: "Admin console", variant: "ghost" },
        { href: "/doctor", label: "Doctor queue" },
      ]}
    >
      <div className="app-two-column">
        <ResearchDatasetPanel />
        <ActiveLearningPanel />
      </div>
    </ClinicalAppShell>
  );
}
