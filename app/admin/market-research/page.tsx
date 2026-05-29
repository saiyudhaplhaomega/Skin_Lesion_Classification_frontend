import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Market Research",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMarketResearchPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Admin market research</p>
        <h1>Market Research RAG</h1>
        <p>
          Review Golden Docs status, approved source libraries, market research
          questions, generated decision briefs, evidence, risks, and missing data.
        </p>
      </section>
    </main>
  );
}
