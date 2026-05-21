import { JsonLd } from "./JsonLd";

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Skin Lesion AI Monitoring Platform",
        url: process.env.NEXT_PUBLIC_SITE_URL,
        description:
          "Educational AI-assisted skin lesion monitoring platform with explainability and privacy-first workflows.",
      }}
    />
  );
}
