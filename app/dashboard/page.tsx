import type { Metadata } from "next";
import Link from "next/link";
import { ClinicalAppShell, SectionCard, StatGrid, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "Patient Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return (
    <ClinicalAppShell
      eyebrow="Monitoring dashboard"
      title="Patient dashboard"
      lead="Track lesion profiles, recent educational AI analyses, reminders, privacy settings, and doctor-review preparation in one place."
      actions={[
        { href: "/analyze", label: "Analyze photo" },
        { href: "/privacy", label: "Privacy settings", variant: "ghost" },
      ]}
    >
      <StatGrid
        stats={[
          { label: "Tracked lesions", value: "3", note: "1 needs review", tone: "warn" },
          { label: "Recent analyses", value: "4", note: "Last 30 days", tone: "info" },
          { label: "Follow-ups", value: "2", note: "Scheduled", tone: "ok" },
          { label: "Privacy mode", value: "Balanced", note: "Thumbnail only", tone: "neutral" },
        ]}
      />

      <div className="app-two-column">
        <SectionCard title="Next best actions" eyebrow="Today">
          <div className="action-list">
            <Link href="/analyze">Upload a clearer shoulder retake</Link>
            <Link href="/reports">Prepare a doctor review packet</Link>
            <Link href="/body-map">Confirm body map locations</Link>
            <Link href="/reminders">Update follow-up reminders</Link>
          </div>
        </SectionCard>

        <SectionCard title="Recent activity" eyebrow="Timeline">
          <div className="timeline-list">
            {[
              ["Today", "Grad-CAM review packet drafted", "Doctor review recommended"],
              ["Yesterday", "Body map location added", "Awaiting verification"],
              ["May 28", "Privacy mode updated", "Balanced mode active"],
            ].map(([date, title, status]) => (
              <article key={title}>
                <span>{date}</span>
                <h3>{title}</h3>
                <StatusPill tone={status.includes("recommended") ? "warn" : "info"}>
                  {status}
                </StatusPill>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </ClinicalAppShell>
  );
}
