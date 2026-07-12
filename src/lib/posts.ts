// =============================================================================
// Blog post data helper — loads 624 WordPress posts from JSON export
// Reads src/data/posts-export.json once and caches in memory.
// Only runs server-side (uses fs/path).
// =============================================================================

import fs from 'fs';
import path from 'path';

// Shape of each blog post in the JSON export
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
}

// In-memory cache so we only parse the 29MB JSON once per process
let _posts: BlogPost[] | null = null;

/**
 * Load and parse the posts JSON file. Cached after first call.
 */
function loadPosts(): BlogPost[] {
  if (_posts) return _posts;
  const filePath = path.join(process.cwd(), 'src/data/posts-export.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  _posts = JSON.parse(raw);
  return _posts!;
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
 * Find a single post by its URL slug.
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
  // Grab the last word from the slug as a rough city name guess
  const parts = currentSlug.split('-');
  const cityGuess = parts[parts.length - 1];
  return loadPosts()
    .filter(p => p.slug !== currentSlug && p.slug.includes(cityGuess))
    .slice(0, limit);
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
