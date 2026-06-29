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
 * Sanitize WordPress HTML content for rendering in Next.js.
 * Aggressively strips all WP styling, boilerplate sections, shortcodes,
 * and inline styles. Keeps only clean semantic HTML (headings, paragraphs,
 * lists, tables, images, links).
 */
export function cleanWpContent(html: string): string {
  let cleaned = html
    // 1. Strip entire <style> blocks (WP theme CSS with !important everywhere)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // 2. Strip HTML comments (<!-- wp:html --> etc.)
    .replace(/<!--[\s\S]*?-->/g, '')
    // 3. Strip ALL inline style attributes — let our CSS handle styling
    .replace(/\s*style="[^"]*"/gi, '')
    .replace(/\s*style='[^']*'/gi, '')
    // 4. Strip WordPress-specific class wrappers but keep the inner content
    //    (nowtb-post-content, nowtb-tldr, nowtb-toc, bbs-quick-answer, etc.)
    .replace(/\s*class="[^"]*"/gi, '')
    // 5. Strip WordPress shortcodes
    .replace(/\[showcaseidx[^\]]*\]/g, '')
    .replace(/\[nowtb_[^\]]*\]/g, '')
    .replace(/\[last_updated\]/g, 'June 2026')
    // 6. Rewrite relative WP image paths to the live domain
    .replace(
      /src="\/wp-content\/uploads\//g,
      'src="https://nowtb.com/wp-content/uploads/'
    )
    .replace(/srcset="([^"]*)"/g, (_match, srcset: string) =>
      `srcset="${srcset.replace(
        /\/wp-content\/uploads\//g,
        'https://nowtb.com/wp-content/uploads/'
      )}"`
    )
    .replace(/href="\/wp-content\/uploads\//g, 'href="https://nowtb.com/wp-content/uploads/')
    // 7. Fix MySQL newline corruption: literal "nn" between tags from WP migration
    .replace(/>nn</g, '><')
    .replace(/>nn/g, '>\n')
    // 8. Clean up empty divs left after stripping classes/styles
    .replace(/<div>\s*<\/div>/gi, '')
    // 8. Unwrap unnecessary div wrappers (keeps content, removes the div tags)
    .replace(/<div>\s*/gi, '')
    .replace(/\s*<\/div>/gi, '');

  // 9. Cut everything from the first boilerplate footer section onward
  //    These are WP template sections the Next.js layout already provides
  const boilerplatePatterns = [
    /<h2[^>]*>\s*Related (?:Resources|Articles)\s*<\/h2>/i,
    /<h2[^>]*>\s*Explore (?:Tampa Bay )?Communities\s*<\/h2>/i,
    /<h2[^>]*>\s*More .* Resources\s*<\/h2>/i,
    /<h2[^>]*>\s*Helpful Resources\s*<\/h2>/i,
    /<h2[^>]*>\s*About Barrett\s*<\/h2>/i,
    /<h2[^>]*>\s*Contact Barrett\s*<\/h2>/i,
    /class="nowtb-footer-section"/i,
    /class="nowtb-related"/i,
    /class="nowtb-communities"/i,
    /class="nowtb-about"/i,
    /class="nowtb-disclaimer"/i,
  ];

  for (const pattern of boilerplatePatterns) {
    const idx = cleaned.search(pattern);
    if (idx > -1) {
      cleaned = cleaned.substring(0, idx).trim();
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
 * Build the canonical URL path for a listing detail page.
 * Uses ListingKey as the unique identifier in the URL.
 * Example: "/properties/abc123"
 */
export function getListingUrl(listing: Listing): string {
  return `/properties/${listing.ListingKey}`;
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
