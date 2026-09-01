import type { MetadataRoute } from "next";

import { navItems, siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Section anchors are indexed so search results can deep-link into the page.
    ...navItems
      .filter((item) => item.id !== "home")
      .map((item) => ({
        url: `${siteConfig.url}/${item.href}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
