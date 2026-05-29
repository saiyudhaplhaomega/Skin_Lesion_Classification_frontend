import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lesion Detail",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LesionDetailPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Lesion detail</p>
        <h1>Lesion Summary</h1>
        <p>
          Review body location, image history, latest AI analysis, Grad-CAM,
          notes, related lab results, reports, and privacy settings.
        </p>
      </section>
    </main>
  );
}
