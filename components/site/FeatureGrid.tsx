import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

const features = [
  {
    img: "/art/feature-timeline.png",
    title: "Lesion history & timelines",
    body: "Track every lesion over time — images, notes, and review status in one auditable record.",
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
    body: "Metadata-only, thumbnail, or full-history workflows — consent decides what is stored.",
    href: "/privacy",
  },
  {
    img: "/art/feature-consent.png",
    title: "Consent & doctor review",
    body: "Explicit consent gates and a built-in dermatologist review loop for flagged cases.",
    href: "/doctor",
  },
];

export function FeatureGrid() {
  return (
    <section className="relative z-[2] mx-auto w-[min(1120px,92%)] py-24">
      <Reveal>
        <p className="eyebrow">Platform</p>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          Built for monitoring, designed for trust
        </h2>
      </Reveal>

      <Reveal stagger className="mt-12 grid gap-5 sm:grid-cols-2">
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
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm">{f.body}</p>
              <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-teal-glow">
                Explore →
              </p>
            </div>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
