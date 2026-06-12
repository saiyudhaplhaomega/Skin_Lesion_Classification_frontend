import type { Metadata } from "next";
import Image from "next/image";
import { PublicShell } from "../../components/site/PublicShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn about privacy modes, consent, deletion, doctor review, and lab-result privacy for skin lesion monitoring.",
  alternates: { canonical: "/privacy" },
};

const modes = [
  {
    title: "Metadata-only mode",
    body: "Only structured facts are stored: body location, date, and notes. No images leave your device.",
  },
  {
    title: "Thumbnail mode",
    body: "A reduced, anonymized thumbnail is kept for visual reference; full-resolution images are discarded after analysis.",
  },
  {
    title: "Full-history mode",
    body: "Complete image history is stored encrypted for longitudinal comparison and doctor review, with explicit consent.",
  },
];

export default function PrivacyPage() {
  return (
    <PublicShell
      eyebrow="Trust"
      title="Privacy"
      lead="Consent decides what is stored. Three privacy modes, encryption at rest, full deletion rights, and no third-party tracking."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {modes.map((m) => (
          <article key={m.title} className="glass edge-light p-6">
            <h2 className="text-base font-semibold">{m.title}</h2>
            <p className="mt-3 text-sm">{m.body}</p>
          </article>
        ))}
      </div>

      <div className="glass edge-light mt-8 grid items-center gap-6 p-6 md:grid-cols-[200px_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image
            src="/art/trust-data-deletion.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Deletion and consent</h2>
          <p className="mt-3 text-sm">
            Consent can be withdrawn at any time, and deletion removes images,
            thumbnails, and derived heatmaps completely. Doctor review and lab
            result sharing each require their own explicit opt-in.
          </p>
        </div>
      </div>

      <p className="safety-note mt-10 max-w-3xl">
        This platform is not a medical diagnosis tool. It provides educational
        AI-supported information and organizes lesion history for professional
        review.
      </p>
    </PublicShell>
  );
}
