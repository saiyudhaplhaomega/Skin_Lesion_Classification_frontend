import type { Metadata } from "next";
import { ClinicalAppShell } from "@/components/app/ClinicalAppShell";
import { DoctorCaseQueue } from "@/components/doctor/DoctorCaseQueue";

export const metadata: Metadata = {
  title: "Doctor Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DoctorPage() {
  return (
    <ClinicalAppShell
      eyebrow="Doctor workspace"
      title="Clinical review queue"
      lead="Review patient-submitted lesion photos, quality flags, Grad-CAM explanations, and follow-up packets without exposing unnecessary personal data."
      actions={[
        { href: "/reports", label: "Reports", variant: "ghost" },
        { href: "/dashboard", label: "Patient view" },
      ]}
    >
      <DoctorCaseQueue />
    </ClinicalAppShell>
  );
}
