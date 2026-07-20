// =============================================================================
// Blog post data helper
// Merges two sources:
//   1. Static JSON export (949 historical posts from WordPress migration)
//   2. Supabase blog_posts table (new auto-generated posts)
// Only runs server-side (uses fs/path + Supabase server client).
// =============================================================================

import fs from 'fs';
import path from 'path';

// Shape of each blog post (unified across both sources)
interface BlogPost {
  id: number | string;
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
}

// In-memory cache so we only parse the 29MB JSON once per process
let _jsonPosts: BlogPost[] | null = null;
// Supabase posts cache (5 min TTL)
let _supabasePosts: BlogPost[] | null = null;
let _supabaseFetchedAt = 0;
const SUPABASE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Load posts from the static JSON file. Cached permanently per process.
 */
function loadJsonPosts(): BlogPost[] {
  if (_jsonPosts) return _jsonPosts;
  const filePath = path.join(process.cwd(), 'src/data/posts-export.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  _jsonPosts = JSON.parse(raw);
  return _jsonPosts!;
}

/**
 * Load new posts from Supabase. Cached for 5 minutes.
 * Falls back to empty array on error (Supabase posts are supplemental).
 */
async function loadSupabasePosts(): Promise<BlogPost[]> {
  const now = Date.now();
  if (_supabasePosts && now - _supabaseFetchedAt < SUPABASE_CACHE_TTL) {
    return _supabasePosts;
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return [];

    const res = await fetch(
      `${url}/rest/v1/blog_posts?select=id,slug,title,body_mdx,excerpt,published_at&status=eq.published&order=published_at.desc`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) return [];
    const rows = await res.json();

    // Map Supabase schema to BlogPost shape
    _supabasePosts = rows.map((r: Record<string, string>) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      date: r.published_at,
      content: `<div class="nowtb-post-content">${r.body_mdx || ""}</div>`,
      excerpt: r.excerpt || "",
    }));
    _supabaseFetchedAt = now;
    return _supabasePosts!;
  } catch {
    return [];
  }
}

/**
 * Load and merge all posts from both sources. Deduplicates by slug.
 * Supabase posts override JSON posts with the same slug.
 */
function loadPosts(): BlogPost[] {
  // Synchronous path for backward compatibility — only uses JSON
  // Async callers should use loadAllPosts() instead
  return loadJsonPosts();
}

/**
 * Get all posts sorted newest-first by date.
 */
export function getAllPosts(): BlogPost[] {
  return loadPosts().sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get all posts including Supabase (async version for Server Components).
 * Merges JSON + Supabase, deduplicates by slug, sorts newest-first.
 */
export async function getAllPostsAsync(): Promise<BlogPost[]> {
  const [json, supabase] = await Promise.all([
    Promise.resolve(loadJsonPosts()),
    loadSupabasePosts(),
  ]);

  // Merge: Supabase posts take priority if slug conflicts
  const slugSet = new Set(supabase.map(p => p.slug));
  const merged = [...supabase, ...json.filter(p => !slugSet.has(p.slug))];
  return merged.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Find a single post by slug (checks Supabase first, then JSON).
 */
export async function getPostBySlugAsync(slug: string): Promise<BlogPost | undefined> {
  const supabasePosts = await loadSupabasePosts();
  const match = supabasePosts.find(p => p.slug === slug);
  if (match) return match;
  return loadJsonPosts().find(p => p.slug === slug);
}

/**
 * Find a single post by its URL slug (sync, JSON only).
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return loadPosts().find(p => p.slug === slug);
}

/**
 * Filter posts by category using slug-based pattern matching.
 * Categories are inferred from slug patterns since the WP export
 * doesn't include category taxonomy data.
 */
export function getPostsByCategory(category: string): BlogPost[] {
  const patterns: Record<string, RegExp> = {
    'neighborhood-guides': /best-neighborhoods-|neighborhood-guide/,
    'market-updates': /housing-market|market-q[0-9]|market-update/,
    'buyer-tips': /buying-home-|first-time|home-inspection|va-home-loan/,
    'seller-tips': /sell-home-fast|selling-/,
    'community-spotlight': /community-guide|guide-to-living/,
    'luxury': /luxury-homes-.*-guide/,
  };
  const re = patterns[category];
  if (!re) return [];
  return loadPosts().filter(p => re.test(p.slug));
}

/**
 * Blog filter categories — maps a human-readable label to slug patterns.
 * Used by the blog index page for category filtering.
 */
const BLOG_CATEGORIES: { label: string; pattern: RegExp }[] = [
  { label: "Buying", pattern: /buy|first-time|home-inspection|appraisal|pre-approval|loan|fha|va-home|usda|jumbo|conventional|dscr|mortgage|condo|hoa|new-construction|relocation|military|macdill|snowbird|house-hacking/ },
  { label: "Selling", pattern: /sell|staging|pricing|listing-agreement|open-house|disclosure|home-valuation/ },
  { label: "Investing", pattern: /invest|1031|rental|flip|dscr|vacation-rental|short-term-rental/ },
  { label: "Market Updates", pattern: /housing-market|market-q[0-9]|market-update|market-report|market-forecast|market-trend/ },
  { label: "Neighborhoods", pattern: /best-neighborhoods|neighborhood|community|guide-to-living|things-to-do|moving-to|living-in/ },
];

/**
 * Categorize a single post by matching its slug against known patterns.
 * Returns the first matching category label, or "General" if none match.
 */
export function categorizePost(slug: string): string {
  for (const cat of BLOG_CATEGORIES) {
    if (cat.pattern.test(slug)) return cat.label;
  }
  return "General";
}

/**
 * Get unique category labels present in the blog, sorted alphabetically.
 * Includes only categories that actually have posts.
 */
export function getBlogCategories(): string[] {
  const all = loadPosts();
  const cats = new Set<string>();
  for (const p of all) {
    cats.add(categorizePost(p.slug));
  }
  return Array.from(cats).sort();
}

/**
 * Find related posts by looking for shared city names in slugs.
 * Uses the last word of the current slug as a city guess.
 */
export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  // Match city by checking all known city slugs against the post slug.
  // Sorted longest-first so "plant-city" matches before "city".
  const { cities } = require('@/data/cities');
  const sortedCities = (cities as { slug: string }[])
    .map(c => c.slug)
    .sort((a, b) => b.length - a.length);
  const matchedCity = sortedCities.find(slug => currentSlug.includes(slug));

  if (matchedCity) {
    const related = loadPosts()
      .filter(p => p.slug !== currentSlug && p.slug.includes(matchedCity))
      .slice(0, limit);
    if (related.length >= limit) return related;
    // Pad with recent posts if not enough city matches
    const used = new Set([currentSlug, ...related.map(p => p.slug)]);
    const filler = loadPosts().filter(p => !used.has(p.slug)).slice(0, limit - related.length);
    return [...related, ...filler];
  }

  // Fallback: most recent posts
  return loadPosts().filter(p => p.slug !== currentSlug).slice(0, limit);
}

/**
 * Get the featured image for a blog post.
 * Priority: 1) dedicated blog image in /images/blog/{slug}.jpg
 *           2) first wp-content image in the post body
 *           3) null (template shows gradient fallback)
 */
export function getPostThumbnail(post: BlogPost): string | null {
  // Check if a dedicated blog image exists at /images/blog/{slug}.jpg
  // Posts without a local image return null (template shows no hero)
  try {
    const fs = require('fs');
    const path = require('path');
    const imgPath = path.join(process.cwd(), 'public', 'images', 'blog', `${post.slug}.jpg`);
    if (fs.existsSync(imgPath)) {
      return `/images/blog/${post.slug}.jpg`;
    }
  } catch {}
  return null;
}

export type { BlogPost };
