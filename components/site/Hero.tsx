"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const stats = [
  { value: "Grad-CAM", label: "Visual explainability" },
  { value: "7 classes", label: "Lesion categories" },
  { value: "Privacy-first", label: "Consent-based modes" },
  { value: "Doctor loop", label: "Human review built in" },
];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced || !root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero-media]",
        { autoAlpha: 0, scale: 1.06 },
        { autoAlpha: 1, scale: 1, duration: 1.6, ease: "power2.out" }
      )
        .fromTo(
          "[data-hero-item]",
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 },
          "-=1.1"
        )
        .fromTo(
          "[data-hero-stat]",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 },
          "-=0.5"
        );

      // Slow ambient drift on the media so a static fallback still feels alive
      gsap.to("[data-hero-media]", {
        scale: 1.04,
        duration: 18,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Background media: video loop with image fallback */}
      <div data-hero-media className="absolute inset-0">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/brand/hero/hero-dark.png"
        >
          <source src="/brand/hero/hero-loop.mp4" type="video/mp4" />
        </video>
        {/* Legibility scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/70 to-ink-950/30" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-[min(1120px,92%)] pb-24 pt-36">
        <p data-hero-item className="eyebrow">
          Explainable AI · Dermatology education
        </p>
        <h1 data-hero-item className="display max-w-3xl">
          See <span className="text-gradient">why</span> the AI looks where
          it looks.
        </h1>
        <p
          data-hero-item
          className="mt-6 max-w-xl text-lg text-slate-soft"
        >
          Skin lesion monitoring with Grad-CAM heatmaps, lesion history,
          body mapping, and a doctor-review workflow — built privacy-first,
          for education, not diagnosis.
        </p>

        <div data-hero-item className="mt-9 flex flex-wrap gap-3">
          <Link href="/analyze" className="btn-primary">
            Analyze a lesion →
          </Link>
          <Link href="/how-it-works" className="btn-ghost">
            How it works
          </Link>
        </div>

        <p
          data-hero-item
          className="mt-6 max-w-xl rounded-xl border border-teal-bright/25 bg-teal-bright/10 px-4 py-3 text-sm text-teal-mist"
        >
          Educational tool — not a medical device. Results always require
          review by a qualified dermatologist.
        </p>

        <div
          className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4"
          aria-label="Platform highlights"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              data-hero-stat
              className="glass edge-light px-5 py-4"
            >
              <p className="font-mono text-lg font-semibold text-teal-glow">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-slate-soft">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
