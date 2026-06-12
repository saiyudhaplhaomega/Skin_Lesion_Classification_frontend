import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "../../components/site/PublicShell";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore educational skin lesion monitoring features including AI-assisted analysis, Grad-CAM explainability, lesion history, privacy modes, and doctor-review support.",
  alternates: { canonical: "/features" },
};

const features = [
  {
    img: "/art/gradcam-explainer.png",
    title: "Grad-CAM explainability",
    body: "Model attention rendered as a heatmap over the lesion. Evidence you can inspect — not a black-box score.",
    href: "/xai-gradcam",
  },
  {
    img: "/art/feature-timeline.png",
    title: "Lesion history & timelines",
    body: "Every lesion tracked over time with images, notes, and review status in one auditable record.",
    href: "/lesions",
  },
  {
    img: "/art/feature-bodymap.png",
    title: "Interactive body map",
    body: "Pin lesions to an anatomical map so nothing gets lost between visits.",
    href: "/body-map",
  },
  {
    img: "/art/feature-privacy.png",
    title: "Privacy modes",
    body: "Metadata-only, thumbnail, or full-history storage — explicit consent decides.",
    href: "/privacy",
  },
  {
    img: "/art/feature-consent.png",
    title: "Doctor-review workflow",
    body: "Flagged cases route to a dermatologist queue. Human judgment closes every loop.",
    href: "/doctor",
  },
];

export default function FeaturesPage() {
  return (
    <PublicShell
      eyebrow="Platform"
      title="Features"
      lead="Educational AI-supported monitoring — built around explainability, privacy, and professional review."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="glass glass-hover edge-light group block overflow-hidden p-0 no-underline"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={f.img}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
            </div>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {f.title}
              </h2>
              <p className="mt-2 text-sm">{f.body}</p>
            </div>
          </Link>
        ))}
      </div>
    </PublicShell>
  );
}
