import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReportsPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Reports</p>
        <h1>Doctor Review Packet</h1>
        <p>Prepare lesion history, analysis notes, and privacy-safe reports for review.</p>
      </section>
    </main>
  );
}
