import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <main>
      <h1>Admin Dashboard</h1>
    </main>
  );
}
