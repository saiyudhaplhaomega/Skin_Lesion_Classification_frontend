import type { Metadata } from "next";
import { ClinicalAppShell } from "@/components/app/ClinicalAppShell";
import { LabOcrReviewPanel } from "@/components/lab-results/LabOcrReviewPanel";

export const metadata: Metadata = {
  title: "Lab OCR Review",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DoctorLabOcrReviewPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <ClinicalAppShell
      eyebrow="Doctor workspace"
      title="Lab OCR draft review"
      lead="Review OCR draft values against the original lab report. Draft values stay unverified until a doctor accepts, edits, or rejects each one."
      actions={[
        { href: "/doctor", label: "Doctor queue", variant: "ghost" },
        { href: "/lab-results", label: "Patient lab results" },
      ]}
    >
      <LabOcrReviewPanel labResultId={params.id} />
    </ClinicalAppShell>
  );
}
