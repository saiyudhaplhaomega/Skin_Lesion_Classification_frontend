import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Is Grad-CAM?",
  description:
    "Learn what Grad-CAM model attention means in educational AI-assisted skin lesion monitoring.",
  alternates: {
    canonical: "/education/what-is-gradcam",
  },
};

export default function WhatIsGradcamPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">What Is Grad-CAM?</h1>
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
