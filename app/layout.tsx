import type { Metadata } from "next";
import { OrganizationJsonLd } from "../components/seo/OrganizationJsonLd";
import { SoftwareApplicationJsonLd } from "../components/seo/SoftwareApplicationJsonLd";
import "./styles.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Skin Lesion AI Monitoring Platform",
    template: "%s | Skin Lesion AI Monitoring Platform",
  },
  description:
    "An educational AI-assisted skin lesion monitoring platform with Grad-CAM explainability, lesion history, privacy controls, and doctor-review support.",
  applicationName: "Skin Lesion AI Monitoring Platform",
  keywords: [
    "skin lesion monitoring",
    "Grad-CAM explainability",
    "AI medical imaging education",
    "lesion history tracking",
    "explainable AI healthcare",
  ],
  authors: [{ name: "Saiyudh Mannan" }],
  creator: "Saiyudh Mannan",
  publisher: "Saiyudh Mannan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Skin Lesion AI Monitoring Platform",
    title: "Skin Lesion AI Monitoring Platform",
    description:
      "Educational AI-assisted skin lesion monitoring with explainability, privacy controls, and doctor-review support.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Skin lesion AI monitoring platform overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skin Lesion AI Monitoring Platform",
    description:
      "Educational AI-assisted skin lesion monitoring with Grad-CAM explainability and privacy-first workflows.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <OrganizationJsonLd />
        <SoftwareApplicationJsonLd />
        {children}
      </body>
    </html>
  );
}
