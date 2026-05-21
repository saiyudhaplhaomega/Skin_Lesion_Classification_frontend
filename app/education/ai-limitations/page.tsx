import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Limitations",
  description:
    "Learn AI Limitations",
  alternates: {
    canonical: "/education/ai-limitations",
  },
};

export default function AiLimitationsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Ai Limitations Page</h1>
        <p className="text-gray-600">
          This platform is an educational support tool. It is not a medical
          diagnosis system.
        </p>
      </div>
    </main>
  );
}
