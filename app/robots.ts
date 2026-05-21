import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/features",
          "/how-it-works",
          "/xai-gradcam",
          "/privacy",
          "/terms",
          "/education",
        ],
        disallow: [
          "/dashboard",
          "/lesions",
          "/analyze",
          "/reports",
          "/doctor",
          "/admin",
          "/research",
          "/api",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
