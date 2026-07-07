// =============================================================================
// Market update data helper — loads housing market posts from JSON export
// Reads src/data/market-updates-export.json once and caches in memory.
// Only runs server-side (uses fs/path).
// =============================================================================

import fs from 'fs';
import path from 'path';

// Shape of each market update post in the JSON export
export interface MarketUpdate {
  id: number;
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
}

// In-memory cache
let _updates: MarketUpdate[] | null = null;

/** Load and parse the market updates JSON. Cached after first call. */
function loadUpdates(): MarketUpdate[] {
  if (_updates) return _updates;
  const filePath = path.join(process.cwd(), 'src/data/market-updates-export.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  _updates = JSON.parse(raw);
  return _updates!;
}

/** Get all market updates sorted newest-first by date. */
export function getAllMarketUpdates(): MarketUpdate[] {
  return loadUpdates().sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Find a single market update by its URL slug. */
export function getMarketUpdateBySlug(slug: string): MarketUpdate | undefined {
  return loadUpdates().find(p => p.slug === slug);
}

/** Get all unique slugs for static generation. */
export function getAllMarketUpdateSlugs(): string[] {
  return loadUpdates().map(p => p.slug);
}

/** Get the featured image for a market update. */
export function getMarketUpdateThumbnail(post: MarketUpdate): string | null {
  // Check for a dedicated image
  const dedicatedPath = `/images/blog/${post.slug}.jpg`;

  // Try extracting from post content
  const match = post.content.match(/src="([^"]*\/wp-content\/uploads\/[^"]+)"/);
  if (match) {
    const src = match[1];
    return src.replace(/https?:\/\/nowtb\.com/, '').replace(/-\d+x\d+\./, '.');
  }

  // Fall back to dedicated blog image
  return dedicatedPath;
}

/** Get related market updates by city name pattern. */
export function getRelatedMarketUpdates(currentSlug: string, limit = 4): MarketUpdate[] {
  const parts = currentSlug.split('-');
  // Try to extract city from slug (e.g. "brandon" from "brandon-housing-market-q2-2026")
  const cityParts = [];
  for (const part of parts) {
    if (part === 'housing' || part === 'real' || part === 'estate' || part === 'market') break;
    cityParts.push(part);
  }
  const cityGuess = cityParts.join('-');
  if (!cityGuess) return [];

  return loadUpdates()
    .filter(p => p.slug !== currentSlug && p.slug.includes(cityGuess))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
