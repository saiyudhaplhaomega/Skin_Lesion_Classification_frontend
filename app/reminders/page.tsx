import type { Metadata } from "next";
import { ClinicalAppShell, SectionCard, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "Reminders",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RemindersPage() {
  return (
    <ClinicalAppShell
      eyebrow="Reminders"
      title="Follow-up reminders"
      lead="Keep recheck tasks, monthly skin self-checks, and doctor-requested retakes visible without turning the app into a diagnosis tool."
      actions={[
        { href: "/dashboard", label: "Dashboard", variant: "ghost" },
        { href: "/analyze", label: "Retake photo" },
      ]}
    >
      <div className="reminder-grid">
        {[
          ["June 18", "Retake left shoulder photo", "Better lighting requested", "warn"],
          ["July 1", "Monthly self-check", "Full body review", "info"],
          ["July 15", "Doctor appointment packet", "Bring latest report", "ok"],
        ].map(([date, title, body, tone]) => (
          <SectionCard key={title} title={title} eyebrow={date}>
            <p>{body}</p>
            <StatusPill tone={tone as "ok" | "warn" | "info"}>{tone === "warn" ? "Due soon" : "Scheduled"}</StatusPill>
          </SectionCard>
        ))}
      </div>
    </ClinicalAppShell>
  );
}
