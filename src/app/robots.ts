import { MetadataRoute } from "next";

/**
 * robots.txt — allow all crawlers including AI bots, block spam bots,
 * point to sitemap.
 *
 * AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) are explicitly
 * allowed so Barrett's content shows up in AI answer engines (AEO/GEO).
 * Spam/scraper bots are blocked to protect content from unauthorized use.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nowtb.com";

  return {
    rules: [
      // Allow all legitimate crawlers (Google, Bing, AI bots, etc.)
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/auth/", "/account/", "/login/", "/card/"],
      },
      // Explicitly allow AI crawlers for AEO/GEO visibility
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "GoogleOther", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      // Block spam/scraper bots
      { userAgent: "SemrushBot", disallow: "/" },
      { userAgent: "AhrefsBot", disallow: "/" },
      { userAgent: "MJ12bot", disallow: "/" },
      { userAgent: "DotBot", disallow: "/" },
      { userAgent: "BLEXBot", disallow: "/" },
      { userAgent: "DataForSeoBot", disallow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
