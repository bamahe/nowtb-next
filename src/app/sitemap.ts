import { MetadataRoute } from "next";
import { cities, SPOKE_TOPICS } from "@/data/cities";

/**
 * Dynamic sitemap — static pages + city hubs + city spokes
 * Listing detail pages are handled by Showcase IDX sitemap on the WordPress side
 * and will be added here once Bridge API integration is live.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nowtb.com";
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/properties`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteUrl}/buyers`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/sellers`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/sell-your-home`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/open-houses`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/agents`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // City hub pages
  const cityHubs: MetadataRoute.Sitemap = cities
    .filter((c) => c.tier === 1)
    .map((city) => ({
      url: `${siteUrl}/${city.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  // City spoke pages (city-topic combos)
  const citySpokes: MetadataRoute.Sitemap = cities
    .filter((c) => c.tier === 1)
    .flatMap((city) =>
      SPOKE_TOPICS.filter((t) => city.topics.includes(t.slug)).map((topic) => ({
        url: `${siteUrl}/${city.slug}-${topic.slug}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      }))
    );

  return [...staticPages, ...cityHubs, ...citySpokes];
}
