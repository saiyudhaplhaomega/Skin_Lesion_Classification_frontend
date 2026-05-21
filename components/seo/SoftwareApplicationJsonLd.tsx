import { JsonLd } from "./JsonLd";

export function SoftwareApplicationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Skin Lesion AI Monitoring Platform",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        description:
          "Educational AI-assisted skin lesion monitoring with Grad-CAM explainability, lesion history, and privacy controls.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
      }}
    />
  );
}
