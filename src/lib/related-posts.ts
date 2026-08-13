// =============================================================================
// Intelligent Related Posts Engine
// Finds 6-8 related blog posts using a 3-tier matching strategy:
//   1. Same city (highest priority — fixes the zero cross-link problem)
//   2. Same topic (schools, cost-of-living, neighborhoods, etc.)
//   3. Same county (geographic proximity fallback)
// Used at build time by the blog post template to generate cross-links.
// =============================================================================

import { cities, type CityData } from "@/data/cities";
import type { BlogPost } from "@/lib/posts";

// Topic keywords extracted from slugs — used for second-priority matching
const TOPIC_PATTERNS: { topic: string; pattern: RegExp }[] = [
  { topic: "schools", pattern: /school|education|elementary|middle-school|high-school/ },
  { topic: "cost-of-living", pattern: /cost-of-living|cost-to-live|affordable|expenses/ },
  { topic: "neighborhoods", pattern: /best-neighborhoods|neighborhood-guide|community-guide|guide-to-living/ },
  { topic: "housing-market", pattern: /housing-market|market-update|market-report|market-forecast|market-trend/ },
  { topic: "investment", pattern: /invest|1031|rental-property|flip|dscr|vacation-rental|short-term-rental/ },
  { topic: "waterfront", pattern: /waterfront|canal|bayfront|beachfront|lakefront/ },
  { topic: "buying", pattern: /buying-home|first-time-buyer|home-inspection|pre-approval|mortgage|fha|va-home|usda|conventional|jumbo/ },
  { topic: "selling", pattern: /sell-home-fast|selling-|staging|pricing-your-home|listing-agreement/ },
  { topic: "luxury", pattern: /luxury-home|million-dollar|estate-home|high-end/ },
  { topic: "new-construction", pattern: /new-construction|new-build|builder|development/ },
  { topic: "retirement", pattern: /retire|55-plus|senior|active-adult/ },
  { topic: "relocation", pattern: /moving-to|relocation|relocat|transplant/ },
  { topic: "outdoor-lifestyle", pattern: /things-to-do|park|trail|outdoor|recreation|golf|fishing|boating/ },
  { topic: "safety", pattern: /safe|crime|safety|dangerous/ },
  { topic: "family", pattern: /family|kid|children|daycare|playground/ },
  { topic: "restaurants", pattern: /restaurant|dining|food|eat|brunch|pizza|taco|sushi|bbq|barbecue|fried-chicken/ },
  { topic: "commute", pattern: /commut|traffic|drive-time|highway|transit/ },
  { topic: "pool-homes", pattern: /pool-home|homes-with-pool/ },
  { topic: "condos", pattern: /condo|townhome|townhouse/ },
  { topic: "land", pattern: /land-for-sale|acreage|lot-for-sale/ },
  { topic: "gated", pattern: /gated-communit/ },
  { topic: "horse", pattern: /horse|equestrian/ },
];

// Sort cities by slug length descending so "apollo-beach" matches before "beach"
const citiesSortedByLength = [...cities].sort(
  (a, b) => b.slug.length - a.slug.length
);

/**
 * Extract the city that a blog post belongs to, based on its slug.
 * Returns the CityData object or null if no city match found.
 */
function extractCity(slug: string): CityData | null {
  for (const city of citiesSortedByLength) {
    if (slug.includes(city.slug)) {
      return city;
    }
  }
  return null;
}

/**
 * Extract topic tags from a post slug.
 * Returns an array of matched topic strings (e.g., ["schools", "neighborhoods"]).
 */
function extractTopics(slug: string): string[] {
  const matched: string[] = [];
  for (const { topic, pattern } of TOPIC_PATTERNS) {
    if (pattern.test(slug)) {
      matched.push(topic);
    }
  }
  return matched;
}

/**
 * Find 6-8 intelligently related posts for a given blog post slug.
 *
 * Strategy (posts are scored and ranked):
 *   - Same city match: +10 points (these are the cross-links we're missing)
 *   - Same topic match: +5 points per shared topic
 *   - Same county match: +3 points (geographic proximity)
 *   - Recency bonus: +1 point for posts within the last year
 *   - Never includes the current post itself
 *
 * @param currentSlug - The slug of the current blog post
 * @param allPosts - All available blog posts
 * @param limit - Number of related posts to return (default 8)
 * @returns Array of related posts, sorted by relevance score then date
 */
export function findRelatedPosts(
  currentSlug: string,
  allPosts: BlogPost[],
  limit = 8
): BlogPost[] {
  // Extract city, topics, and county for the current post
  const currentCity = extractCity(currentSlug);
  const currentTopics = extractTopics(currentSlug);
  const currentCounty = currentCity?.county ?? null;

  // Score every other post
  const scored = allPosts
    .filter((p) => p.slug !== currentSlug) // Never link to self
    .map((post) => {
      let score = 0;
      const postCity = extractCity(post.slug);
      const postTopics = extractTopics(post.slug);

      // Priority 1: Same city — biggest SEO win (cross-links within city cluster)
      if (currentCity && postCity && currentCity.slug === postCity.slug) {
        score += 10;
      }

      // Priority 2: Same topic(s) — topical relevance
      const sharedTopics = currentTopics.filter((t) => postTopics.includes(t));
      score += sharedTopics.length * 5;

      // Priority 3: Same county — geographic proximity fallback
      if (
        currentCounty &&
        postCity &&
        postCity.county === currentCounty &&
        // Don't double-count if already matched city
        !(currentCity && currentCity.slug === postCity.slug)
      ) {
        score += 3;
      }

      // Recency bonus — slightly prefer newer content
      const postDate = new Date(post.date).getTime();
      const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
      if (postDate > oneYearAgo) {
        score += 1;
      }

      return { post, score };
    })
    .filter((item) => item.score > 0) // Only include posts with SOME relevance
    .sort((a, b) => {
      // Sort by score descending, then by date descending (newest first)
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    });

  // If we have enough scored results, return them
  if (scored.length >= limit) {
    return scored.slice(0, limit).map((s) => s.post);
  }

  // If not enough relevant posts, pad with recent posts (still useful for SEO)
  const usedSlugs = new Set([currentSlug, ...scored.map((s) => s.post.slug)]);
  const filler = allPosts
    .filter((p) => !usedSlugs.has(p.slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit - scored.length);

  return [...scored.map((s) => s.post), ...filler];
}

/**
 * Get a human-readable section title based on what kind of matches we found.
 * Returns "More About {City}" if city-matched, or "Related Articles" otherwise.
 */
export function getRelatedPostsTitle(
  currentSlug: string,
  relatedPosts: BlogPost[]
): string {
  const currentCity = extractCity(currentSlug);
  if (!currentCity) return "Related Articles";

  // Check if most of the related posts are from the same city
  const cityMatchCount = relatedPosts.filter((p) =>
    p.slug.includes(currentCity.slug)
  ).length;

  // If at least half the results are same-city, use the city-specific title
  if (cityMatchCount >= Math.ceil(relatedPosts.length / 2)) {
    return `More About ${currentCity.name}`;
  }

  return "You Might Also Like";
}
