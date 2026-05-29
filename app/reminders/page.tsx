import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reminders",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RemindersPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Reminders</p>
        <h1>Follow-Up Reminders</h1>
        <p>Recheck reminders and monthly skin self-check tasks will appear here.</p>
      </section>
    </main>
  );
}
