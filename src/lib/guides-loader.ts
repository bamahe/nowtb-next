// =============================================================================
// Guide content loader — reads real WordPress content from guides-content.json
// Falls back to placeholder sections from guides.ts if no WP content found.
// Only runs server-side (uses fs/path).
// =============================================================================

import fs from 'fs';
import path from 'path';

// Shape of each guide in the JSON export
interface GuideContentEntry {
  slug: string;
  title: string;
  content: string; // raw HTML from WordPress post_content
}

// In-memory cache so we only parse the JSON once per process
let _guidesContent: GuideContentEntry[] | null = null;

/**
 * Load and parse the guides content JSON file. Cached after first call.
 */
function loadGuidesContent(): GuideContentEntry[] {
  if (_guidesContent) return _guidesContent;
  const filePath = path.join(process.cwd(), 'src/data/guides-content.json');
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    _guidesContent = JSON.parse(raw);
    return _guidesContent!;
  } catch {
    // If the file doesn't exist or is invalid, return empty array
    // (will fall back to placeholder sections)
    _guidesContent = [];
    return _guidesContent;
  }
}

/**
 * Get the real WordPress HTML content for a guide by slug.
 * Returns null if no WP content is available (falls back to placeholder).
 */
export function getGuideContent(slug: string): string | null {
  const entries = loadGuidesContent();
  const entry = entries.find((e) => e.slug === slug);
  return entry ? entry.content : null;
}

/**
 * Get the real WordPress title for a guide by slug.
 * Returns null if no WP content is available.
 */
export function getGuideTitle(slug: string): string | null {
  const entries = loadGuidesContent();
  const entry = entries.find((e) => e.slug === slug);
  return entry ? entry.title : null;
}

/**
 * Check if a guide has real WP content (vs placeholder).
 */
export function hasGuideContent(slug: string): boolean {
  const entries = loadGuidesContent();
  return entries.some((e) => e.slug === slug);
}
