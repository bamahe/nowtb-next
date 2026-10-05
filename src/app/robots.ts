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
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://nowtb.com").trim();

  return {
    rules: [
      // Allow all legitimate crawlers (Google, Bing, AI bots, etc.)
      {
        userAgent: "*",
        allow: "/",
        // /c/ and /clients/ hold private per-client packets (CMAs, net sheets,
        // home comparisons). Kept out of search entirely, and also served with
        // X-Robots-Tag via vercel.json.
        disallow: ["/api/", "/admin/", "/auth/", "/account/", "/login/", "/card/", "/thank-you/", "/compare/", "/c/", "/clients/"],
      },
      // Explicitly allow AI crawlers for AEO/GEO visibility.
      // Each still gets /c/ disallowed — an unqualified allow:"/" would
      // otherwise invite them straight into the private client packets.
      { userAgent: "GPTBot", allow: "/", disallow: ["/c/", "/clients/"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/c/", "/clients/"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/c/", "/clients/"] },
      { userAgent: "Applebot-Extended", allow: "/", disallow: ["/c/", "/clients/"] },
      { userAgent: "GoogleOther", allow: "/", disallow: ["/c/", "/clients/"] },
      { userAgent: "Google-Extended", allow: "/", disallow: ["/c/", "/clients/"] },
      { userAgent: "Bytespider", allow: "/", disallow: ["/c/", "/clients/"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/c/", "/clients/"] },
      { userAgent: "anthropic-ai", allow: "/", disallow: ["/c/", "/clients/"] },
      { userAgent: "cohere-ai", allow: "/", disallow: ["/c/", "/clients/"] },
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
