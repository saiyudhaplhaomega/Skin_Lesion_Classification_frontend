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
    <main>
      <h1>Patient Dashboard</h1>
    </main>
  );
}
