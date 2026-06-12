import type { Metadata } from "next";
import Image from "next/image";
import { PublicShell } from "../../components/site/PublicShell";

export const metadata: Metadata = {
  title: "Grad-CAM Explainability",
  description:
    "Learn how Grad-CAM explainability can show model attention for medical image AI without proving disease.",
  alternates: { canonical: "/xai-gradcam" },
};

export default function XaiGradcamPage() {
  return (
    <PublicShell
      eyebrow="Explainable AI"
      title="Grad-CAM: seeing what the model sees"
      lead="Grad-CAM shows model attention, not proof of disease. It turns a black-box prediction into visual evidence a human can question."
    >
      <div className="glass-strong edge-light overflow-hidden p-2">
        <Image
          src="/art/gradcam-explainer.png"
          alt="Diagram of a Grad-CAM heatmap over a skin lesion photo"
          width={1280}
          height={720}
          className="h-auto w-full rounded-[1rem]"
        />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <article className="glass edge-light p-6">
          <h2 className="text-lg font-semibold">What it shows</h2>
          <p className="mt-3 text-sm">
            Gradient-weighted Class Activation Mapping highlights the image
            regions that most influenced the model&apos;s prediction —
            rendered as a thermal overlay from cool (low influence) to warm
            (high influence).
          </p>
        </article>
        <article className="glass edge-light p-6">
          <h2 className="text-lg font-semibold">What it does not show</h2>
          <p className="mt-3 text-sm">
            A warm region is not a diagnosis. Attention can be drawn by
            artifacts, lighting, or skin texture. Grad-CAM is a debugging and
            trust tool — it never replaces histopathology or clinical
            examination.
          </p>
        </article>
        <article className="glass edge-light p-6">
          <h2 className="text-lg font-semibold">Why it matters</h2>
          <p className="mt-3 text-sm">
            Explainability lets patients and doctors audit the model: if the
            heatmap focuses outside the lesion, the prediction deserves
            skepticism. Transparency turns AI output into a discussion, not a
            verdict.
          </p>
        </article>
      </div>

      <p className="safety-note mt-10 max-w-3xl">
        This platform is not a medical diagnosis tool. It provides educational
        AI-supported information and organizes lesion history for professional
        review.
      </p>
    </PublicShell>
  );
}
