import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Is Grad-CAM?",
  description:
    "Learn how What Is Grad-CAM?",
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
          This platform is an educational support tool. It is not a medical
          diagnosis system.
        </p>
      </div>
    </main>
  );
}
