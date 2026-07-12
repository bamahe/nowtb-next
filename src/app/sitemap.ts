// =============================================================================
// Sitemap — includes ALL 3,400+ pages for complete Google indexing
// Static pages + blog posts + guides + city hubs + city spokes + neighborhoods
// + counties + loan guides + comparisons + regional + misc catch-all pages
// =============================================================================

import { MetadataRoute } from "next";
import { cities, SPOKE_TOPICS } from "@/data/cities";
import { neighborhoods } from "@/data/neighborhoods";
import { getAllComparisonSlugs } from "@/data/comparisons";
import { getAllRegionalSlugs } from "@/data/regional-pages";
import { getCatchAllMiscSlugs } from "@/data/misc-pages";
import { getAllPosts } from "@/lib/posts";
import { getAllGuideSlugs } from "@/data/guides";
import { getAllMarketUpdates } from "@/lib/market-updates";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nowtb.com";
  const now = new Date();

  // ── Static pages (manually curated) ──
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
    { url: `${siteUrl}/luxury`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/communities`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/investing`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/mortgage-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/home-valuation`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/free-home-valuation`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/property-management`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/the-now-team`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/relocation`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/commercial`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/lenders`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/builders`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/inspectors`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // ── Blog posts (624 posts) — canonical URL is /blog/{slug} ──
  const blogPosts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Market updates ──
  const marketUpdatePages: MetadataRoute.Sitemap = [
    // Market updates index page
    { url: `${siteUrl}/market-updates`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    // Individual market update posts
    ...getAllMarketUpdates().map((update) => ({
      url: `${siteUrl}/market-updates/${update.slug}`,
      lastModified: update.date ? new Date(update.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  // ── Guides (51 guides) ──
  const guidesPages: MetadataRoute.Sitemap = getAllGuideSlugs().map((slug) => ({
    url: `${siteUrl}/guides/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── City hub pages (ALL 70 cities, not just Tier 1) ──
  const cityHubs: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${siteUrl}/${city.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: city.tier === 1 ? 0.9 : city.tier === 2 ? 0.7 : 0.6,
  }));

  // ── City spoke pages (city + topic combos, ~1,050 pages) ──
  const citySpokes: MetadataRoute.Sitemap = cities.flatMap((city) =>
    SPOKE_TOPICS.filter((t) => city.topics.includes(t.slug)).map((topic) => ({
      url: `${siteUrl}/${city.slug}-${topic.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: city.tier === 1 ? 0.7 : 0.5,
    }))
  );

  // ── City realtor pages (70 pages) ──
  const cityRealtorPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${siteUrl}/${city.slug}-realtor`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // ── Sell-your-home city pages (70 pages) ──
  const sellCityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${siteUrl}/sell-your-home-${city.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // ── Neighborhood pages (461 base + 461 homes-for-sale + 461 realtor = 1,383) ──
  const neighborhoodPages: MetadataRoute.Sitemap = neighborhoods.flatMap((n) => [
    {
      url: `${siteUrl}/${n.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/${n.slug}-homes-for-sale`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/${n.slug}-realtor`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ]);

  // ── County pages (8 pages) ──
  const countyPages: MetadataRoute.Sitemap = [
    "hillsborough-county", "pinellas-county", "pasco-county", "manatee-county",
    "polk-county", "sarasota-county", "hernando-county", "citrus-county",
  ].map((slug) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // ── Loan guide pages (8 pages) ──
  const loanPages: MetadataRoute.Sitemap = [
    "fha-loan-florida", "va-loan-florida", "usda-loan-florida",
    "conventional-loan-florida", "jumbo-loan-florida", "renovation-loan-florida",
    "reverse-mortgage-florida", "construction-loan-florida",
  ].map((slug) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Comparison pages (24 pages) ──
  const comparisonPages: MetadataRoute.Sitemap = getAllComparisonSlugs().map((slug) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // ── Regional pages (36 pages) ──
  const regionalPagesList: MetadataRoute.Sitemap = getAllRegionalSlugs().map((slug) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // ── Misc catch-all pages (33 pages) ──
  const miscPagesList: MetadataRoute.Sitemap = getCatchAllMiscSlugs().map((slug) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [
    ...staticPages,
    ...blogPosts,
    ...marketUpdatePages,
    ...guidesPages,
    ...cityHubs,
    ...citySpokes,
    ...cityRealtorPages,
    ...sellCityPages,
    ...neighborhoodPages,
    ...countyPages,
    ...loanPages,
    ...comparisonPages,
    ...regionalPagesList,
    ...miscPagesList,
  ];
}
