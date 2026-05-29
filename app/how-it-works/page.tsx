import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how the skin lesion monitoring platform combines image upload, AI classification, Grad-CAM explainability, privacy modes, and doctor-review support.",
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">How the Skin Lesion AI Monitoring Platform Works</h1>
        <p className="text-gray-600">
          This platform is not a medical diagnosis tool. It provides
          educational AI-supported information and helps organize lesion
          history for professional review.
        </p>
        <p className="text-gray-600">
          The workflow moves from image upload to image quality guidance, AI
          model output, Grad-CAM explanation, lesion history, and professional
          review.
        </p>
      </div>
    </main>
  );
}
