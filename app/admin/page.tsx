import type { Metadata } from "next";
import { AdminReviewDashboard } from "@/components/admin/AdminReviewDashboard";
import { ClinicalAppShell } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <ClinicalAppShell
      eyebrow="Admin"
      title="Platform operations"
      lead="Monitor clinical safety queues, doctor verification, consent exports, model health, and staged feature rollout controls."
      actions={[
        { href: "/admin/market-research", label: "Market research", variant: "ghost" },
        { href: "/doctor", label: "Doctor queue" },
      ]}
    >
      <AdminReviewDashboard />
    </ClinicalAppShell>
  );
}
