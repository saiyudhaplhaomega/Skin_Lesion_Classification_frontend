import type { Metadata } from "next";
import { ClinicalAppShell, DataTable, EmptyState, SectionCard, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "My Lesions",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LesionsPage() {
  return (
    <ClinicalAppShell
      eyebrow="My lesions"
      title="Lesion profiles"
      lead="Review saved lesion metadata, consent mode, photo quality, and follow-up state before sharing with a clinician."
      actions={[
        { href: "/body-map", label: "Open body map", variant: "ghost" },
        { href: "/analyze", label: "Add new analysis" },
      ]}
    >
      <div className="app-two-column">
        <SectionCard title="Saved profiles" eyebrow="Clinical timeline">
          <DataTable
            columns={["ID", "Location", "Consent", "Status"]}
            rows={[
              ["L-1024", "Left shoulder", "Thumbnail only", <StatusPill key="l1" tone="warn">Review</StatusPill>],
              ["L-1088", "Upper back", "Metadata only", <StatusPill key="l2" tone="ok">Stable</StatusPill>],
              ["L-1119", "Right calf", "Full history", <StatusPill key="l3" tone="info">Retake</StatusPill>],
            ]}
          />
        </SectionCard>

        <SectionCard title="No raw image stored" eyebrow="Privacy">
          <EmptyState
            title="Metadata-only mode is active"
            body="The app can keep location, dates, and review notes without storing the original photo. You can change this per lesion before upload."
            action={{ href: "/privacy", label: "Review settings", variant: "ghost" }}
          />
        </SectionCard>
      </div>
    </ClinicalAppShell>
  );
}
