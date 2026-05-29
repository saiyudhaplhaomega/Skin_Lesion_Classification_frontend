import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Monitoring dashboard</p>
        <h1>Patient Dashboard</h1>
        <p>
          Track lesion profiles, recent AI analyses, privacy settings, lab
          result tasks, and doctor-review preparation in one place.
        </p>
      </section>
      <section className="dashboard-grid" aria-label="Dashboard summary">
        <article className="dashboard-tile">
          <span>Total lesions</span>
          <strong>0</strong>
        </article>
        <article className="dashboard-tile">
          <span>Need follow-up</span>
          <strong>0</strong>
        </article>
        <article className="dashboard-tile">
          <span>Recent analyses</span>
          <strong>0</strong>
        </article>
        <article className="dashboard-tile">
          <span>Lab results pending</span>
          <strong>0</strong>
        </article>
      </section>
      <nav className="dashboard-nav" aria-label="Dashboard navigation">
        <a href="/lesions">My Lesions</a>
        <a href="/body-map">Body Map</a>
        <a href="/analyze">Analyze</a>
        <a href="/lab-results">Lab Results</a>
        <a href="/privacy">Privacy</a>
        <a href="/reports">Reports</a>
      </nav>
    </main>
  );
}
