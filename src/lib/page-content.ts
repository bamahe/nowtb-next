// =============================================================================
// Page Content Loader — reads real WordPress content from pages-content.json
// This file is only used at build time / server-side (fs module).
// The JSON file contains ~1,065 pages exported from the WordPress site.
// =============================================================================

import fs from "fs";
import path from "path";

/** Shape of each page record in the exported JSON */
interface PageContent {
  slug: string;
  title: string;
  content: string;
}

// In-memory cache so we only read/parse the JSON file once per build
let _pages: PageContent[] | null = null;

/**
 * Lazily loads and caches the pages-content.json data.
 * Returns an empty array if the file is missing or invalid.
 */
function loadPages(): PageContent[] {
  if (_pages) return _pages;

  const filePath = path.join(process.cwd(), "src/data/pages-content.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    _pages = JSON.parse(raw);
    return _pages!;
  } catch {
    // File missing or corrupt — fall back to empty (placeholder content will render)
    console.warn("[page-content] Could not load pages-content.json — using placeholder content");
    return [];
  }
}

/**
 * Get the HTML content for a page by its slug.
 * Returns null if no WordPress content exists for this slug.
 *
 * @param slug - The page slug (e.g. "valrico" or "valrico-homes-for-sale")
 */
export function getPageContent(slug: string): string | null {
  const page = loadPages().find((p) => p.slug === slug);
  return page?.content || null;
}

/**
 * Get the title for a page by its slug.
 * Returns null if no WordPress content exists for this slug.
 *
 * @param slug - The page slug (e.g. "valrico" or "valrico-homes-for-sale")
 */
export function getPageTitle(slug: string): string | null {
  const page = loadPages().find((p) => p.slug === slug);
  return page?.title || null;
}
