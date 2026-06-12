import type { Metadata } from "next";
import Image from "next/image";
import { PublicShell } from "../../components/site/PublicShell";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how the skin lesion monitoring platform combines image upload, AI classification, Grad-CAM explainability, privacy modes, and doctor-review support.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  {
    img: "/art/howitworks-upload.png",
    title: "1 · Upload with consent",
    body: "A lesion photo enters the pipeline only after you choose a privacy mode — metadata-only, thumbnail, or full history. Image quality guidance helps you capture a usable photo.",
  },
  {
    img: "/art/howitworks-heatmap.png",
    title: "2 · AI classification + Grad-CAM",
    body: "A convolutional model classifies the lesion across seven categories, and Grad-CAM renders the model's attention as a thermal heatmap over the image — showing where the evidence came from.",
  },
  {
    img: "/art/howitworks-explain.png",
    title: "3 · Plain-language explanation",
    body: "The prediction is paired with an educational explanation of the visual features involved. The wording is deliberately non-diagnostic: it informs, it never concludes.",
  },
  {
    img: "/art/howitworks-review.png",
    title: "4 · Professional review",
    body: "Lesion history, heatmaps, and notes are organized for a dermatologist's review. The platform prepares the evidence; the clinical judgment stays human.",
  },
];

export default function HowItWorksPage() {
  return (
    <PublicShell
      eyebrow="Pipeline"
      title="How the platform works"
      lead="From photo to explainable, doctor-reviewable insight in four steps. This platform is educational — it is not a medical diagnosis tool."
    >
      <div className="grid gap-5">
        {steps.map((s, i) => (
          <article
            key={s.title}
            className="glass edge-light grid items-center gap-6 overflow-hidden p-6 md:grid-cols-[280px_1fr]"
          >
            <div
              className={`relative aspect-[16/10] overflow-hidden rounded-xl ${
                i % 2 ? "md:order-2" : ""
              }`}
            >
              <Image
                src={s.img}
                alt=""
                fill
                sizes="(min-width: 768px) 280px, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{s.title}</h2>
              <p className="mt-3">{s.body}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="safety-note mt-10 max-w-3xl">
        Every output requires review by a qualified dermatologist. The AI
        organizes and explains — it does not diagnose.
      </p>
    </PublicShell>
  );
}
