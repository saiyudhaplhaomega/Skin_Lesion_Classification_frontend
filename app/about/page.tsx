import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the Skin Lesion AI Monitoring Platform - an educational tool for tracking and understanding skin lesions with AI-assisted analysis.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About</h1>
        <p className="text-gray-600">
          This platform is an educational support tool. It is not a medical
          diagnosis system.
        </p>
      </div>
    </main>
  );
}
