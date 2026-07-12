// =============================================================================
// Utility functions used across the app
// =============================================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import type { Listing } from './types';

// Fallback image when a listing has no photos
const PLACEHOLDER_IMAGE = '/images/no-photo.jpg';

// -----------------------------------------------------------------------------
// Styling
// -----------------------------------------------------------------------------

/**
 * Merge Tailwind classes without conflicts.
 * Combines clsx (conditional classes) + tailwind-merge (deduplication).
 * Usage: cn('px-4 py-2', isActive && 'bg-blue-500', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

/**
 * Format a number as a USD price string.
 * Example: 450000 -> "$450,000"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format an ISO date string to a readable date.
 * Example: "2026-05-12T14:30:00Z" -> "May 12, 2026"
 */
export function formatDate(date: string): string {
  try {
    return format(parseISO(date), 'MMMM d, yyyy');
  } catch {
    // If the date string is invalid, return it as-is
    return date;
  }
}

/**
 * Format square footage with commas.
 * Example: 2450 -> "2,450 sq ft"
 */
export function formatSqFt(sqft: number): string {
  return `${sqft.toLocaleString('en-US')} sq ft`;
}

// -----------------------------------------------------------------------------
// WordPress content cleanup
// -----------------------------------------------------------------------------

/**
 * Clean WordPress post_content HTML for rendering in Next.js.
 * Preserves layout classes (nowtb-*, bbs-*) and inline styles so that
 * stat grids, CTA boxes, FAQ sections, and highlight boxes render properly.
 * Strips WP boilerplate <style> blocks, shortcodes, and comments.
 */
export function cleanWpContent(html: string): string {
  let cleaned = html
    // 1. Strip entire <style> blocks (WP theme CSS — we define styles in globals.css)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // 2. Strip HTML comments (<!-- wp:html --> etc.)
    .replace(/<!--[\s\S]*?-->/g, '')
    // 3. Strip WordPress shortcodes
    .replace(/\[showcaseidx[^\]]*\]/g, '')
    .replace(/\[nowtb_[^\]]*\]/g, '')
    .replace(/\[last_updated\]/g, 'July 2026')
    // 3b. Strip inline CTA divs (Schedule a Buyer Strategy Call / Calculate Your Payment)
    //     These are now rendered as proper buttons in the page header component
    .replace(/<div[^>]*>(?:<a[^>]*>(?:Schedule a (?:Buyer )?Strategy Call|Calculate Your Payment|Talk to a Tampa Bay Expert|Search All Homes|Talk to Barrett About Investing|See Investment Properties)<\/a>\s*)+<\/div>/gi, '')
    // 3c. (highlight-box dark backgrounds handled by CSS !important override in globals.css)
    // 4. WP image paths — rewrite to local public/ folder
    .replace(/https?:\/\/nowtb\.com\/wp-content\/uploads\//g, '/wp-content/uploads/')
    .replace(/src="\/wp-content\/uploads\//g, 'src="/wp-content/uploads/')
    .replace(/srcset="([^"]*)"/g, (_match, srcset: string) =>
      `srcset="${srcset.replace(
        /https?:\/\/nowtb\.com\/wp-content\/uploads\//g,
        '/wp-content/uploads/'
      )}"`
    )
    .replace(/href="\/wp-content\/uploads\//g, 'href="/wp-content/uploads/')
    // 5. Fix MySQL newline corruption
    .replace(/>nn</g, '><')
    .replace(/>nn/g, '>\n')
    // 6. Strip width-constraining inline styles from WP content
    .replace(/\s*max-width:\s*\d+px;?/gi, '')
    .replace(/\s*margin:\s*\d+px\s+auto[^;]*;?/gi, '')
    .replace(/\s*margin:\s*0\s+auto[^;]*;?/gi, '')
    // 6b. Fix CTA button colors from WP content:
    //     - Gold buttons (#c8a84b, #e8a020) → white with dark text (on dark bg sections)
    //     - White buttons (#fff) on light backgrounds → blue (#2563eb) with white text
    .replace(/(<a[^>]*style="[^"]*?)background:\s*#c8a84b\b/gi, '$1background:#fff')
    .replace(/(<a[^>]*style="[^"]*?)background:\s*#e8a020\b/gi, '$1background:#fff')
    .replace(/(<a[^>]*style="[^"]*?background:\s*#fff[^"]*?)color:\s*#fff\b/gi, '$1color:#0f172a')
    .replace(/(<a[^>]*style="[^"]*?)background:\s*white\b/gi, '$1background:#2563eb')
    // 7. Strip useless WP inline styles: font-family overrides, empty styles
    .replace(/style="\s*font-family:[^"]*"/gi, '')
    .replace(/style="\s*"/gi, '')
    // 8. Strip WP wrapper divs that only add spacing/width constraints
    .replace(/<div style="[^"]*margin:\s*\d+px auto[^"]*">/gi, '<div>')
    // 9. Clean up truly empty divs (no class, no content)
    .replace(/<div>\s*<\/div>/gi, '');

  // 9. Cut boilerplate footer sections — but ONLY when they appear in the
  //    last 30% of the content. These are WP template footer blocks, NOT
  //    legitimate content headings. Early matches would destroy real content.

  // "Always cut" patterns — these are ALWAYS boilerplate regardless of position
  const alwaysCutPatterns = [
    /<h2[^>]*>\s*Related (?:Resources|Articles)\s*<\/h2>/i,
    /<h2[^>]*>\s*Explore (?:Tampa Bay )?Communities\s*<\/h2>/i,
    /<h2[^>]*>\s*More .* Resources\s*<\/h2>/i,
    /<h2[^>]*>\s*Helpful Resources\s*<\/h2>/i,
    /class="nowtb-footer-section"/i,
    /class="nowtb-related"/i,
    /class="nowtb-communities"/i,
    /class="nowtb-about"/i,
    /class="nowtb-disclaimer"/i,
  ];

  for (const pattern of alwaysCutPatterns) {
    const idx = cleaned.search(pattern);
    if (idx > -1) {
      cleaned = cleaned.substring(0, idx).trim();
    }
  }

  // "Late cut" patterns — only cut if found in the last 30% of content
  // These headings appear legitimately in content but are boilerplate at the end
  const lateCutPatterns = [
    /<h2[^>]*>\s*About Barrett\s*<\/h2>/i,
    /<h2[^>]*>\s*Contact Barrett\s*<\/h2>/i,
    /<h2[^>]*>\s*Work(?:ing)? with Barrett\s*<\/h2>/i,
    /<h2[^>]*>[^<]*Homes for Sale\s*<\/h2>/i,
    /<h2[^>]*>\s*Recently Sold\s*<\/h2>/i,
    /<h2[^>]*>[^<]*(?:Real Estate|Explore)[^<]*<\/h2>/i,
    /<h2[^>]*>\s*Frequently Asked Questions\s*<\/h2>/i,
  ];

  const contentLength = cleaned.length;
  const lateThreshold = Math.floor(contentLength * 0.7); // last 30%

  for (const pattern of lateCutPatterns) {
    // Find the LAST match, not the first
    let lastIdx = -1;
    let match;
    const regex = new RegExp(pattern.source, pattern.flags + (pattern.flags.includes('g') ? '' : 'g'));
    while ((match = regex.exec(cleaned)) !== null) {
      lastIdx = match.index;
    }
    // Only cut if the match is in the last 30% of content
    if (lastIdx > lateThreshold) {
      cleaned = cleaned.substring(0, lastIdx).trim();
    }
  }

  // 10. Clean up excessive whitespace
  cleaned = cleaned
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}

// -----------------------------------------------------------------------------
// URL helpers
// -----------------------------------------------------------------------------

/**
 * Convert any text to a URL-safe slug.
 * Example: "Tampa Bay Area" -> "tampa-bay-area"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove special characters
    .replace(/[\s_]+/g, '-')     // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-')         // Collapse multiple hyphens
    .replace(/^-|-$/g, '');      // Trim leading/trailing hyphens
}

/**
 * Build an SEO-friendly URL for a listing detail page.
 * Format: /properties/StellarMLS/{MlsId}/{city-slug}/{address-slug}
 * Example: /properties/StellarMLS/TB8526478/tampa/5120-n-matanzas-avenue
 */
export function getListingUrl(listing: Listing): string {
  const citySlug = slugify(listing.City || 'florida');
  const addressSlug = slugify(listing.UnparsedAddress || 'listing');
  const mlsId = listing.ListingId || listing.ListingKey;
  return `/properties/StellarMLS/${mlsId}/${citySlug}/${addressSlug}`;
}

/**
 * Parse the new SEO-friendly listing URL segments.
 * Expected: ["StellarMLS", "TB8526478", "tampa", "5120-n-matanzas-avenue"]
 * Returns the MLS ID for API lookup.
 */
export function extractMlsId(segments: string[]): string | null {
  // New format: /properties/StellarMLS/{mlsId}/{city}/{address}
  if (segments.length >= 2 && segments[0] === 'StellarMLS') {
    return segments[1];
  }
  return null;
}

/**
 * Extract the ListingKey from an old-format listing URL slug.
 * Used for backward compatibility redirects from old URLs.
 * Old format: /properties/{address-slug}-{listingKey}
 */
export function extractListingKey(slug: string): string {
  // If the slug IS just a raw ListingKey (32 hex chars), use as-is
  if (/^[a-f0-9]{20,}$/i.test(slug)) return slug;
  // Look for a 32-char hex key at the end of the slug
  const match = slug.match(/([a-f0-9]{32})$/i);
  if (match) return match[1];
  // Try the last hyphen-separated segment if it looks like a key
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  if (/^[a-f0-9]{16,}$/i.test(lastPart)) return lastPart;
  // Fallback: use the whole slug as the key
  return slug;
}

/**
 * Get the primary photo URL for a listing.
 * Returns the first Media item sorted by Order, or a placeholder if no photos.
 */
export function getListingPhotoUrl(listing: Listing): string {
  // If there are media items, grab the one with the lowest Order value
  if (listing.Media && listing.Media.length > 0) {
    const sorted = [...listing.Media].sort((a, b) => a.Order - b.Order);
    return sorted[0].MediaURL;
  }
  // No photos — return placeholder
  return PLACEHOLDER_IMAGE;
}
