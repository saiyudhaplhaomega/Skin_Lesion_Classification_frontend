import type { Metadata } from "next";
import { PublicShell } from "../../components/site/PublicShell";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the Skin Lesion AI Monitoring Platform - an educational tool for tracking and understanding skin lesions with AI-assisted analysis.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PublicShell
      eyebrow="About"
      title="Why this platform exists"
      lead="Most medical AI asks for trust without showing its work. This project takes the opposite approach: every prediction comes with visible evidence, privacy controls, and a human in the loop."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <article className="glass edge-light p-7">
          <h2 className="text-lg font-semibold">The mission</h2>
          <p className="mt-3 text-sm">
            Make explainable AI for dermatology education tangible: a working
            system where Grad-CAM heatmaps, lesion timelines, and doctor-review
            workflows show what responsible medical AI can look like in
            practice.
          </p>
        </article>
        <article className="glass edge-light p-7">
          <h2 className="text-lg font-semibold">The boundary</h2>
          <p className="mt-3 text-sm">
            This platform is not a medical diagnosis tool. It provides
            educational AI-supported information and organizes lesion history
            for professional review by qualified dermatologists.
          </p>
        </article>
        <article className="glass edge-light p-7 md:col-span-2">
          <h2 className="text-lg font-semibold">The stack</h2>
          <p className="mt-3 text-sm">
            Deep learning classification with Grad-CAM explainability, a
            privacy-aware data model with consent-based storage modes, a
            doctor-review queue, and research tooling — built as an
            end-to-end demonstration of production-minded, transparent
            medical AI engineering.
          </p>
        </article>
      </div>
    </PublicShell>
  );
}
