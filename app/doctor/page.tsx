import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DoctorPage() {
  return (
    <main>
      <h1>Doctor Dashboard</h1>
    </main>
  );
}
