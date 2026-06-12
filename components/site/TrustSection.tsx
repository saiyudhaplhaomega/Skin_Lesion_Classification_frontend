import Image from "next/image";
import { Reveal } from "./Reveal";

const trust = [
  {
    img: "/art/trust-privacy-shield.png",
    title: "Privacy by design",
    body: "Data minimization and consent-based storage modes from the first photo.",
  },
  {
    img: "/art/trust-encryption-key.png",
    title: "Encrypted at rest",
    body: "Images and history are protected in storage and in transit.",
  },
  {
    img: "/art/trust-doctor-reviewed.png",
    title: "Doctor in the loop",
    body: "AI organizes the evidence; a dermatologist makes the judgment.",
  },
  {
    img: "/art/trust-data-deletion.png",
    title: "Right to deletion",
    body: "Remove your images and history at any time, completely.",
  },
  {
    img: "/art/trust-no-tracking.png",
    title: "No ad tracking",
    body: "No third-party trackers. Your skin is not a marketing dataset.",
  },
  {
    img: "/art/trust-educational-info.png",
    title: "Educational, not diagnostic",
    body: "Every output is framed as education and requires professional review.",
  },
];

export function TrustSection() {
  return (
    <section className="relative z-[2] border-y border-[var(--glass-border)] bg-ink-900/40 py-24">
      <div className="mx-auto w-[min(1120px,92%)]">
        <Reveal>
          <p className="eyebrow">Trust</p>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Medical data deserves more than a checkbox
          </h2>
        </Reveal>

        <Reveal stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trust.map((t) => (
            <div key={t.title} className="glass edge-light flex gap-4 p-5">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                <Image src={t.img} alt="" fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {t.title}
                </h3>
                <p className="mt-1.5 text-sm">{t.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
