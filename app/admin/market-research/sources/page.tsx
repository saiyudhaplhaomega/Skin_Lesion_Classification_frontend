import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Market Research Sources",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMarketResearchSourcesPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Source review</p>
        <h1>Market Research Sources</h1>
        <p>
          Review source upload states, approval queues, approved source libraries,
          rejected sources, and Golden Doc candidates.
        </p>
      </section>
    </main>
  );
}
