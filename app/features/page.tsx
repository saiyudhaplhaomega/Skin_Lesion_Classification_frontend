import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore educational skin lesion monitoring features including AI-assisted analysis, Grad-CAM explainability, lesion history, privacy modes, and doctor-review support.",
  alternates: {
    canonical: "/features",
  },
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Features</h1>
        <p className="text-gray-600">
          This platform is not a medical diagnosis tool. It provides
          educational AI-supported information and helps organize lesion
          history for professional review.
        </p>
      </div>
    </main>
  );
}
