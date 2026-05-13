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

export type { BlogPost };
