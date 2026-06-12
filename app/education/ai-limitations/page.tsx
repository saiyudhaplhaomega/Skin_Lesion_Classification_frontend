import type { Metadata } from "next";
import { ClinicalAppShell, SectionCard, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "AI Limitations",
  description:
    "Understand the limits of educational AI-assisted skin lesion monitoring and why professional review remains important.",
  alternates: {
    canonical: "/education/ai-limitations",
  },
};

export default function AiLimitationsPage() {
  return (
    <ClinicalAppShell
      eyebrow="Education"
      title="AI limitations"
      lead="Understand where educational AI assistance can help, where it can fail, and why professional review remains the important next step."
      actions={[
        { href: "/education", label: "Education hub", variant: "ghost" },
        { href: "/analyze", label: "Analyze safely" },
      ]}
    >
      <div className="article-grid">
        <SectionCard title="What can affect output" eyebrow="Limitations">
          <div className="stack-list">
            {[
              "Blurry, low-light, overexposed, or cropped photos can reduce usefulness.",
              "Training data may not represent every skin tone, body location, camera, or lesion type equally.",
              "Grad-CAM highlights model attention, not a diagnosis or proof of disease.",
              "Confidence scores need calibration and clinical context before they are useful.",
            ].map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Safe interpretation" eyebrow="Patient guidance">
          <StatusPill tone="warn">Not a diagnosis</StatusPill>
          <p>
            Use this platform to organize photos, notes, and follow-up questions.
            Any concerning change, symptom, or uncertainty should be reviewed by a
            qualified medical professional.
          </p>
        </SectionCard>
      </div>
    </ClinicalAppShell>
  );
}
