import type { Metadata } from "next";
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
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Research</p>
        <h1>Research &amp; Fairness Dashboard</h1>
        <p>
          Aggregate metrics only. No patient identifiers are displayed here.
        </p>
      </section>

      <section className="dashboard-section">
        <ResearchDatasetPanel />
      </section>

      <section className="dashboard-section">
        <ActiveLearningPanel />
      </section>
    </main>
  );
}
