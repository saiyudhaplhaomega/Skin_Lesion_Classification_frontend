import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Limitations",
  description:
    "Understand the limits of educational AI-assisted skin lesion monitoring and why professional review remains important.",
  alternates: {
    canonical: "/education/ai-limitations",
  },
};

export default function AiLimitationsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Limitations</h1>
        <p className="text-gray-600">
          AI outputs can be affected by image quality, training data,
          calibration, and workflow context.
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
