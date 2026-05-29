import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grad-CAM Explainability",
  description:
    "Learn how Grad-CAM explainability can show model attention for medical image AI without proving disease.",
  alternates: {
    canonical: "/xai-gradcam",
  },
};

export default function XaiGradcamPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Grad-CAM Explainability</h1>
        <p className="text-gray-600">
          Grad-CAM shows model attention, not proof of disease.
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
