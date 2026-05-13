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
