"use client";

/* Pinned GSAP scroll story for the four-step Grad-CAM pipeline.
   Falls back to a simple stacked layout under reduced motion. */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    img: "/art/howitworks-upload.png",
    kicker: "01 - Capture",
    title: "Upload a lesion photo",
    body: "A photo enters the pipeline with consent controls applied first: metadata-only, thumbnail, or full history, your choice.",
  },
  {
    img: "/art/howitworks-heatmap.png",
    kicker: "02 - Attention",
    title: "Grad-CAM shows where the model looked",
    body: "The classifier's attention is rendered as an educational heatmap: evidence you can see, not a black box score.",
  },
  {
    img: "/art/howitworks-explain.png",
    kicker: "03 - Explain",
    title: "Plain-language explanation",
    body: "Each prediction is paired with an educational explanation of the visual features behind it, written to inform, never to diagnose.",
  },
  {
    img: "/art/howitworks-review.png",
    kicker: "04 - Review",
    title: "A doctor closes the loop",
    body: "Flagged cases route into a dermatologist review workflow. The AI organizes evidence; the human makes the call.",
  },
];

export function GradcamStory() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduced || !isDesktop) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-story-panel]");
      const images = gsap.utils.toArray<HTMLElement>("[data-story-img]");

      gsap.set(panels.slice(1), { autoAlpha: 0, y: 40 });
      gsap.set(images.slice(1), { autoAlpha: 0, scale: 1.04 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${steps.length * 90}%`,
          pin: true,
          scrub: 0.6,
        },
      });

      steps.forEach((_, i) => {
        if (i === 0) return;
        tl.to(panels[i - 1], { autoAlpha: 0, y: -40, duration: 0.4 }, i)
          .to(images[i - 1], { autoAlpha: 0, scale: 0.98, duration: 0.4 }, i)
          .to(panels[i], { autoAlpha: 1, y: 0, duration: 0.4 }, i + 0.15)
          .to(
            images[i],
            { autoAlpha: 1, scale: 1, duration: 0.4 },
            i + 0.15
          );
      });

      tl.eventCallback("onUpdate", () => {
        const bar = el.querySelector<HTMLElement>("[data-story-bar]");
        if (bar) bar.style.transform = `scaleX(${tl.progress()})`;
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="pipeline-story">
      <div className="pipeline-story__inner">
        <p className="eyebrow">The pipeline</p>
        <h2 className="pipeline-story__title">
          From photo to explainable answer in four steps
        </h2>

        <div className="pipeline-story__progress">
          <div
            data-story-bar
            className="pipeline-story__progress-bar"
          />
        </div>

        <div className="pipeline-story__grid">
          <div className="pipeline-story__copy-stack">
            {steps.map((s) => (
              <div
                key={s.kicker}
                data-story-panel
                className="pipeline-story__panel"
              >
                <p className="pipeline-story__kicker">{s.kicker}</p>
                <h3 className="pipeline-story__step-title">{s.title}</h3>
                <p className="pipeline-story__body">{s.body}</p>
                <div className="pipeline-story__mobile-image">
                  <Image
                    src={s.img}
                    alt={s.title}
                    width={640}
                    height={420}
                    className="pipeline-story__mobile-img"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pipeline-story__image-stack">
            {steps.map((s) => (
              <div
                key={s.img}
                data-story-img
                className="pipeline-story__image-frame glass edge-light"
              >
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  sizes="(min-width: 768px) 520px, 100vw"
                  className="pipeline-story__image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
