import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Market Research Brief",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMarketResearchBriefPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Decision brief</p>
        <h1>Generated Market Research Brief</h1>
        <p>
          Review the executive summary, recommendation, evidence, risks,
          assumptions, missing data, and next actions.
        </p>
      </section>
    </main>
  );
}
