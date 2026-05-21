import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResearchPage() {
  return (
    <main>
      <h1>Research Dashboard</h1>
    </main>
  );
}
