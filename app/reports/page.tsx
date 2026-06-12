import type { Metadata } from "next";
import { ClinicalAppShell, SectionCard, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "Reports",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReportsPage() {
  return (
    <ClinicalAppShell
      eyebrow="Reports"
      title="Doctor review packet"
      lead="Assemble lesion history, quality notes, Grad-CAM explanation language, and consent-safe attachments for a clinical appointment."
      actions={[
        { href: "/doctor", label: "Doctor queue", variant: "ghost" },
        { href: "/lesions", label: "Choose lesions" },
      ]}
    >
      <div className="report-builder">
        {[
          ["1", "Select lesions", "3 selected", "ok"],
          ["2", "Attach explanations", "Grad-CAM notes ready", "info"],
          ["3", "Check privacy", "Thumbnail-only packet", "ok"],
          ["4", "Export packet", "Awaiting final review", "warn"],
        ].map(([step, title, body, tone]) => (
          <SectionCard key={step} title={title} eyebrow={`Step ${step}`}>
            <p>{body}</p>
            <StatusPill tone={tone as "ok" | "warn" | "info"}>{body}</StatusPill>
          </SectionCard>
        ))}
      </div>
    </ClinicalAppShell>
  );
}
