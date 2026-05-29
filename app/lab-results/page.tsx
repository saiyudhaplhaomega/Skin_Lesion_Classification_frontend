import type { Metadata } from "next";

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
        <h1>Lab Result Review</h1>
        <p>Lab result uploads will appear here after doctor review support is connected.</p>
      </section>
    </main>
  );
}
