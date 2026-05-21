import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Take a Skin Lesion Photos",
  description:
    "Learn how to Take a Skin Lesion Photo",
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
          This platform is an educational support tool. It is not a medical
          diagnosis system.
        </p>
      </div>
    </main>
  );
}
