import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = [
    "",
    "/about",
    "/features",
    "/how-it-works",
    "/xai-gradcam",
    "/privacy",
    "/terms",
    "/education/what-is-gradcam",
    "/education/how-to-take-skin-lesion-photo",
    "/education/ai-limitations",
  ];

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
