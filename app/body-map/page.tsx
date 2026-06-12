import type { Metadata } from "next";
import { ClinicalAppShell } from "@/components/app/ClinicalAppShell";
import { BodyMap2D } from "@/components/body-map/BodyMap2D";

export const metadata: Metadata = {
  title: "Body Map",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BodyMapPage() {
  return (
    <ClinicalAppShell
      eyebrow="Body map"
      title="Body location tracking"
      lead="Keep lesion locations, patient notes, and doctor-verification status in one privacy-safe visual map."
      actions={[
        { href: "/lesions", label: "Lesion profiles", variant: "ghost" },
        { href: "/analyze", label: "Add photo" },
      ]}
    >
      <BodyMap2D />
    </ClinicalAppShell>
  );
}
