import type { Metadata } from "next";
import { ClinicalAppShell, SectionCard, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "Lesion Detail",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LesionDetailPage({
  params,
}: {
  params: { lesionId: string };
}) {
  return (
    <ClinicalAppShell
      eyebrow="Lesion detail"
      title="Lesion summary"
      lead="Review body location, image history, latest educational AI analysis, Grad-CAM context, notes, related lab results, and privacy settings."
      actions={[
        { href: "/lesions", label: "All lesions", variant: "ghost" },
        { href: "/reports", label: "Add to report" },
      ]}
    >
      <div className="app-two-column">
        <SectionCard title={params.lesionId.toUpperCase()} eyebrow="Current status">
          <div className="case-panel">
            <StatusPill tone="warn">Professional review recommended</StatusPill>
            <p>
              Latest photo quality passed with a glare warning. The model attention
              region overlaps an area of uneven color and border contrast.
            </p>
            <div className="heatmap-card" aria-label="Grad-CAM detail preview">
              <div className="heatmap-card__base" />
              <div className="heatmap-card__overlay" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Timeline" eyebrow="History">
          <div className="timeline-list">
            {[
              ["Today", "Report packet prepared", "Awaiting review"],
              ["June 1", "New photo uploaded", "Quality usable"],
              ["May 10", "Body map location set", "Patient submitted"],
            ].map(([date, title, status]) => (
              <article key={title}>
                <span>{date}</span>
                <h3>{title}</h3>
                <StatusPill tone={status.includes("Awaiting") ? "warn" : "info"}>
                  {status}
                </StatusPill>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </ClinicalAppShell>
  );
}
