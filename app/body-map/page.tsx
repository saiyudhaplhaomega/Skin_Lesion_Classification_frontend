import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Body Map",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BodyMapPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Body Map</p>
        <h1>Body Location Tracking</h1>
        <p>Location submitted by patient - awaiting doctor verification.</p>
      </section>
    </main>
  );
}
