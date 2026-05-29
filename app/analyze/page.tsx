import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyze",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyzePage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Analyze</p>
        <h1>Image Analysis</h1>
        <p>Upload a supported lesion image for educational AI analysis.</p>
      </section>
    </main>
  );
}
