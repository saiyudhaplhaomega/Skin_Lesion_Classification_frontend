import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Take a Skin Lesion Photo",
  description:
    "Learn safe photo tips for clear skin lesion monitoring images, including lighting, focus, distance, glare, scale, and privacy.",
  alternates: {
    canonical: "/education/how-to-take-skin-lesion-photo",
  },
};

export default function HowToTakeSkinLesionPhotoPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Take a Skin Lesion Photo</h1>
        <p className="text-gray-600">
          Use steady lighting, focus, consistent distance, minimal glare, and
          the same angle over time. Do not include face or identifying details.
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
