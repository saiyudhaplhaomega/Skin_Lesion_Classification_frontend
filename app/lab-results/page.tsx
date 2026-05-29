import type { Metadata } from "next";
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
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Lab Results</p>
        <h1>Your Lab Results</h1>
        <p>
          Upload blood tests or lab reports so your doctor can review them alongside your skin
          lesion history. Lab results are private and never used as AI diagnostic input.
        </p>
      </section>

      <section className="dashboard-section">
        <LabResultUpload />
      </section>

      <section className="dashboard-section">
        <LabResultList />
      </section>
    </main>
  );
}
