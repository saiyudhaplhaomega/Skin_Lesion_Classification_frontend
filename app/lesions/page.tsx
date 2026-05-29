import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Lesions",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LesionsPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">My Lesions</p>
        <h1>Lesion Profiles</h1>
        <p>No image stored - metadata-only mode.</p>
      </section>
      <section className="dashboard-card">
        <h2>Saved lesion cards will appear here.</h2>
        <p>Location submitted by patient - awaiting doctor verification.</p>
      </section>
    </main>
  );
}
