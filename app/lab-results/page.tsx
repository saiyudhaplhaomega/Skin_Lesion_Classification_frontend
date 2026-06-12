import type { Metadata } from "next";
import { ClinicalAppShell } from "@/components/app/ClinicalAppShell";
import { LabResultUpload } from "@/components/lab-results/LabResultUpload";
import { LabResultList } from "@/components/lab-results/LabResultList";

export const metadata: Metadata = {
  title: "Lab Results",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LabResultsPage() {
  return (
    <ClinicalAppShell
      eyebrow="Lab results"
      title="Your lab results"
      lead="Upload blood tests or lab reports so your doctor can review them alongside lesion history. Lab results are private and never used as AI diagnostic input."
      actions={[
        { href: "/dashboard", label: "Dashboard", variant: "ghost" },
        { href: "/doctor", label: "Doctor review" },
      ]}
    >
      <div className="app-two-column">
        <LabResultUpload />
        <LabResultList />
      </div>
    </ClinicalAppShell>
  );
}
