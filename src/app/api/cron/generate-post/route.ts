// =============================================================================
// Blog Post Auto-Generator — /api/cron/generate-post
// Triggered every 3 days by Vercel Cron.
// Uses Claude API to write a Tampa Bay real estate blog post,
// then inserts it into the Supabase blog_posts table.
// =============================================================================

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2 minutes — AI generation can take time

// Barrett's real phone number. Defined once so a typo can't spread across posts.
const CONTACT_PHONE = "(813) 733-7907";
const CONTACT_PHONE_TEL = "8137337907";

// Top-level URL paths that are real pages on the site. Anything else the AI
// writes as a bare path is assumed to be a blog article and gets /blog/ added.
// City pages (/valrico/, /brandon/, ...) are handled by the single-segment check
// in sanitizeInternalLinks — they are the only bare slugs that legitimately exist.
const REAL_TOP_LEVEL_PATHS = new Set([
  "blog", "properties", "contact", "about", "agents", "guides", "compare",
  "builders", "market-updates", "relocation", "property-management",
  "mortgage-calculator", "free-home-valuation", "new-construction",
  "waterfront", "pool-homes", "golf-homes", "condos", "townhomes", "no-hoa",
  "land-acreage", "single-story", "price-reduced", "55-plus-communities",
  "luxury", "neighborhoods",
]);

/**
 * Rewrite internal links that point at pages which don't exist.
 *
 * The AI reliably writes blog cross-links as bare slugs — href="/moving-to-brandon-fl/"
 * — but blog articles are served from /blog/<slug>/. Left as-is, every one of those
 * links is a dead end. This adds the missing /blog/ prefix.
 *
 * A path is left alone when it is a known real section (/properties/, /contact/, ...)
 * or a single-segment city page that the site's [citySlug] route handles.
 * If it breaks, check: a new top-level page was added but not listed in
 * REAL_TOP_LEVEL_PATHS, so its links are being wrongly sent to /blog/.
 */
function sanitizeInternalLinks(html: string): string {
  return html.replace(/href=(["'])(\/[^"'\s>]*)\1/g, (whole, quote, url) => {
    // Split off any #fragment or ?query so we only inspect the path itself,
    // then re-attach it to whatever we rewrite the path to.
    const [path] = url.split(/[#?]/);
    const rest = url.slice(path.length);
    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) return whole;                  // "/" — homepage
    if (REAL_TOP_LEVEL_PATHS.has(segments[0])) return whole;  // real section, leave alone

    // Invented sub-page like /valrico/luxury-homes/ — only the city page exists
    if (segments.length > 1) return `href=${quote}/${segments[0]}/${rest}${quote}`;

    // Single bare slug. City slugs are short (valrico, wesley-chapel, sun-city-center);
    // blog slugs are long and descriptive (moving-to-brandon-fl-relocation-guide).
    if (segments[0].split("-").length <= 3) return whole;      // looks like a city page
    return `href=${quote}/blog/${segments[0]}/${rest}${quote}`; // treat as blog article
  });
}

// Topic categories with specific prompts for variety
const TOPIC_POOL = [
  {
    category: "market-update",
    prompt: "Write a Tampa Bay real estate market update for the current month. Cover median prices, inventory levels, days on market, and what buyers and sellers should know. Reference specific cities: Valrico, Brandon, Riverview, Wesley Chapel, Lakeland. Include real-sounding but general statistics (median around $400K, inventory around 3-4 months, etc.).",
  },
  {
    category: "neighborhood",
    prompt: "Write a neighborhood spotlight on a Tampa Bay neighborhood. Pick one from: Bloomingdale (Valrico), Buckhorn (Valrico), Starkey Ranch (Odessa), FishHawk Ranch (Lithia), Westchase, Carrollwood, Seminole Heights, Hyde Park, Apollo Beach, or Sun City Center. Cover prices, schools, amenities, lifestyle, and who it's best for.",
  },
  {
    category: "buyer-tips",
    prompt: "Write a practical buyer tip article for Tampa Bay homebuyers. Topics could include: how to win a multiple offer situation, understanding CDD fees, what inspections to get in Florida, how to evaluate a school zone, the real cost of new construction upgrades, or how insurance affects affordability.",
  },
  {
    category: "seller-tips",
    prompt: "Write a practical seller tip article for Tampa Bay home sellers. Topics could include: how to price your home correctly, staging tips for Florida homes, when to list for maximum exposure, how to handle low appraisals, what repairs to make before listing, or how to choose a listing agent.",
  },
  {
    category: "investment",
    prompt: "Write an investment-focused article about Tampa Bay real estate. Topics could include: best areas for rental income, cap rates by neighborhood, short-term rental regulations, 1031 exchange strategies, or comparing buy-and-hold vs flip opportunities in the current market.",
  },
  {
    category: "community-event",
    prompt: "Write about a seasonal real estate topic relevant to the current time of year in Tampa Bay. Spring = best time to list, summer = slower market and deals, fall = year-end tax strategies, winter = snowbird season and seasonal buyers. Include practical advice for the season.",
  },
];

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json(
      { error: "Missing ANTHROPIC_API_KEY or Supabase credentials" },
      { status: 500 }
    );
  }

  try {
    // Pick a random topic from the pool
    const topic = TOPIC_POOL[Math.floor(Math.random() * TOPIC_POOL.length)];

    // Generate the post with Claude
    const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `You are a blog writer for Barrett Henry, a REALTOR® and Broker Associate at REMAX Collective in Tampa Bay, Florida. Barrett has 23+ years of real estate experience (NEVER tie this to Tampa Bay specifically).

Write a blog post following these rules:
- 800-1200 words
- Use "owners suite" never "master suite"
- Use "REMAX" never "RE/MAX"
- Question-format H2 headings
- First paragraph: answer the page's main question directly
- Include Barrett's phone: (813) 733-7907
- Include Barrett's email: barrett@nowtb.com
- End with a CTA to contact Barrett
- No fluff phrases, no AI-sounding transitions
- Write like a knowledgeable local agent, direct and practical
- Internal links: city pages are /valrico/, /brandon/, /riverview/, /wesley-chapel/, /lithia/, /tampa/
- CRITICAL: links to other blog articles MUST start with /blog/ (e.g. /blog/moving-to-brandon-fl/). A bare /moving-to-brandon-fl/ is a dead 404 page.
- Only link to city pages listed above or /blog/ articles. Never invent paths like /brandon-fl-homes-for-sale/ or /city/luxury-homes/ — those do not exist.
- Content should sound like it was written today (${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })})

${topic.prompt}

Respond with ONLY valid JSON in this exact format (no markdown, no code blocks):
{"title": "Your Title Here", "slug": "your-slug-here", "content": "<p>Your HTML content here...</p>", "excerpt": "First 150 chars of content as plain text"}`,
        },
      ],
    });

    // Parse the AI response
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No text in AI response" }, { status: 500 });
    }

    let post: { title: string; slug: string; content: string; excerpt: string };
    try {
      post = JSON.parse(textBlock.text);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON", raw: textBlock.text.slice(0, 500) },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!post.title || !post.slug || !post.content) {
      return NextResponse.json({ error: "Missing required fields in AI response" }, { status: 500 });
    }

    // Safety net: the AI writes blog links as bare slugs (/moving-to-brandon-fl/),
    // but blog articles actually live under /blog/. Left alone those are 404s.
    // Anything that isn't a known real route gets rewritten to /blog/<slug>/.
    post.content = sanitizeInternalLinks(post.content);

    // Safety net: never let a wrong phone number reach a published post.
    post.content = post.content
      .replace(/\(813\)\s*750-0926/g, CONTACT_PHONE)
      .replace(/8137500926/g, CONTACT_PHONE_TEL);

    // Check for duplicate slug
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${post.slug}&select=id`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const existing = await checkRes.json();
    if (existing.length > 0) {
      // Append timestamp to make slug unique
      post.slug = `${post.slug}-${Date.now()}`;
    }

    // Insert into Supabase
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        slug: post.slug,
        title: post.title,
        body_mdx: post.content,
        excerpt: post.excerpt || post.title,
        status: "published",
        published_at: new Date().toISOString(),
      }),
    });

    if (!insertRes.ok) {
      const err = await insertRes.text();
      return NextResponse.json({ error: "Supabase insert failed", detail: err }, { status: 500 });
    }

    const inserted = await insertRes.json();

    return NextResponse.json({
      status: "ok",
      post: {
        title: post.title,
        slug: post.slug,
        url: `https://nowtb.com/blog/${post.slug}/`,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Generation failed", detail: String(err) },
      { status: 500 }
    );
  }
}
