import Link from "next/link";
import { Reveal } from "./Reveal";

export function CtaBand() {
  return (
    <section className="relative z-[2] mx-auto w-[min(1120px,92%)] py-24">
      <Reveal>
        <div className="glass-strong edge-light relative overflow-hidden p-10 text-center md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-radial-fade"
          />
          <p className="eyebrow justify-center">Get started</p>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Understand the model before you trust it
          </h2>
          <p className="mx-auto mt-4 max-w-xl">
            Run an analysis, inspect the Grad-CAM heatmap, and see how
            explainable AI supports — never replaces — clinical judgment.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/analyze" className="btn-primary">
              Try the demo →
            </Link>
            <Link href="/xai-gradcam" className="btn-ghost">
              Learn about Grad-CAM
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
