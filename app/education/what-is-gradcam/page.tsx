import type { Metadata } from "next";
import { ClinicalAppShell, SectionCard, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "What Is Grad-CAM?",
  description:
    "Learn what Grad-CAM model attention means in educational AI-assisted skin lesion monitoring.",
  alternates: {
    canonical: "/education/what-is-gradcam",
  },
};

export default function WhatIsGradcamPage() {
  return (
    <ClinicalAppShell
      eyebrow="Education"
      title="What is Grad-CAM?"
      lead="Grad-CAM is a visual explanation that shows which image regions influenced a model. It is a context tool, not medical proof."
      actions={[
        { href: "/xai-gradcam", label: "XAI overview", variant: "ghost" },
        { href: "/analyze", label: "Try analysis" },
      ]}
    >
      <div className="app-two-column">
        <SectionCard title="Attention, not diagnosis" eyebrow="Meaning">
          <StatusPill tone="info">Model attention</StatusPill>
          <p>
            A Grad-CAM heatmap can help explain why a model produced an output by
            highlighting image regions that mattered to its internal calculation.
            The highlighted region does not prove disease and does not replace a
            clinician.
          </p>
        </SectionCard>

        <SectionCard title="How to read it safely" eyebrow="Checklist">
          <div className="stack-list">
            <p>Compare the heatmap with the original photo and image quality checks.</p>
            <p>Look for whether the model focused on the lesion or irrelevant background.</p>
            <p>Use the explanation as a question to discuss with a doctor.</p>
          </div>
        </SectionCard>
      </div>
    </ClinicalAppShell>
  );
}
