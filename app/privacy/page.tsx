import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn about privacy modes, consent, deletion, doctor review, and lab-result privacy for skin lesion monitoring.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Page</h1>
        <p className="text-gray-600">
          Privacy workflows support metadata-only mode, thumbnail mode, full
          clinical history mode, consent, deletion, doctor review, and lab
          result privacy.
        </p>
        <p className="text-gray-600">
          This platform is not a medical diagnosis tool. It provides
          educational AI-supported information and helps organize lesion
          history for professional review.
        </p>
      </div>
    </main>
  );
}
