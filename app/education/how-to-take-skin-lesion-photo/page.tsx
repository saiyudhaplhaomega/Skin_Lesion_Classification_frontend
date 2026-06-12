import type { Metadata } from "next";
import { ClinicalAppShell, SectionCard, StatusPill } from "@/components/app/ClinicalAppShell";

export const metadata: Metadata = {
  title: "How to Take a Skin Lesion Photo",
  description:
    "Learn safe photo tips for clear skin lesion monitoring images, including lighting, focus, distance, glare, scale, and privacy.",
  alternates: {
    canonical: "/education/how-to-take-skin-lesion-photo",
  },
};

export default function HowToTakeSkinLesionPhotoPage() {
  return (
    <ClinicalAppShell
      eyebrow="Education"
      title="How to take a skin lesion photo"
      lead="Use consistent, privacy-safe photos so your timeline is easier to compare and your doctor has cleaner context."
      actions={[
        { href: "/education", label: "Education hub", variant: "ghost" },
        { href: "/analyze", label: "Upload photo" },
      ]}
    >
      <div className="report-builder">
        {[
          ["Lighting", "Use bright, even light. Avoid flash glare and deep shadows.", "ok"],
          ["Focus", "Hold the camera steady and retake if the lesion edge is blurry.", "warn"],
          ["Framing", "Center the lesion and include a little surrounding skin.", "info"],
          ["Privacy", "Avoid face, tattoos, documents, mirrors, or other identifying details.", "warn"],
        ].map(([title, body, tone]) => (
          <SectionCard key={title} title={title} eyebrow="Photo check">
            <p>{body}</p>
            <StatusPill tone={tone as "ok" | "warn" | "info"}>{title}</StatusPill>
          </SectionCard>
        ))}
      </div>
    </ClinicalAppShell>
  );
}
