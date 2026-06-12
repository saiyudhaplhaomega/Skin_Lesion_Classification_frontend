import type { Metadata } from "next";
import { PublicShell } from "../../components/site/PublicShell";

export const metadata: Metadata = {
  title: "Education",
  description: "Educational safety topics for AI-assisted lesion monitoring.",
};

const topics = [
  {
    title: "What Grad-CAM means",
    body: "How attention heatmaps are computed, what warm regions indicate, and why attention is not diagnosis.",
  },
  {
    title: "Understanding confidence",
    body: "Why a 92% score is not a 92% chance of disease. Calibration, class imbalance, and dataset limits matter.",
  },
  {
    title: "Taking better lesion photos",
    body: "Lighting, distance, focus, and scale references that improve both AI input quality and clinical usefulness.",
  },
  {
    title: "When to seek professional review",
    body: "ABCDE warning signs and changes over time that warrant a dermatologist visit, independent of any AI output.",
  },
];

export default function EducationPage() {
  return (
    <PublicShell
      eyebrow="Education"
      title="Safety and XAI basics"
      lead="Learn what Grad-CAM means, what confidence means, how to take better lesion photos, and when to seek professional review."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {topics.map((t) => (
          <article key={t.title} className="glass glass-hover edge-light p-6">
            <h2 className="text-base font-semibold">{t.title}</h2>
            <p className="mt-3 text-sm">{t.body}</p>
          </article>
        ))}
      </div>
      <p className="safety-note mt-10 max-w-3xl">
        This platform is not a medical diagnosis tool. It provides educational
        AI-supported information and helps organize lesion history for
        professional review.
      </p>
    </PublicShell>
  );
}
