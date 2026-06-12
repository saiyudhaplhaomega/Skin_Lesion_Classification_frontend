import type { Metadata } from "next";
import { ClinicalAppShell } from "@/components/app/ClinicalAppShell";
import { MockAnalyzeFlow } from "@/components/app/MockAnalyzeFlow";

export const metadata: Metadata = {
  title: "Analyze",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyzePage() {
  return (
    <ClinicalAppShell
      eyebrow="Analyze"
      title="Image analysis"
      lead="Upload a supported lesion image, choose consent level, preview quality checks, and prepare an explainability packet for doctor review."
      actions={[
        { href: "/dashboard", label: "Dashboard", variant: "ghost" },
        { href: "/reports", label: "Prepare report" },
      ]}
    >
      <MockAnalyzeFlow />
    </ClinicalAppShell>
  );
}
