import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education",
  description: "Educational safety topics for AI-assisted lesion monitoring.",
};

export default function EducationPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <p className="eyebrow">Education</p>
        <h1>Safety And XAI Basics</h1>
        <p>
          Learn what Grad-CAM means, what confidence means, how to take better
          lesion photos, and when to seek professional review.
        </p>
        <p>
          This platform is not a medical diagnosis tool. It provides
          educational AI-supported information and helps organize lesion
          history for professional review.
        </p>
      </section>
    </main>
  );
}
