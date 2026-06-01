// =============================================================================
// Server-side Bridge API client
// NEVER import this in client components — it uses server-only env vars
// =============================================================================

import { Listing, ListingSearchParams, BridgeResponse } from './types';
import {
  mockListings,
  getMockListingsByCity,
  getMockOpenHouses,
  getMockFeatured,
  getMockListing,
} from '@/data/mock-listings';

// Pull config from environment (set in .env.local, never committed)
const BRIDGE_BASE = process.env.BRIDGE_API_BASE!;   // e.g. https://api.bridgedataoutput.com/api/v2/OData
const BRIDGE_TOKEN = process.env.BRIDGE_SERVER_TOKEN!; // Server-side Bearer token
const DATASET = process.env.BRIDGE_DATASET || 'test';  // 'test' for dev, MLS dataset ID for prod

// Live API is ON — mock data is the fallback if Bridge returns errors or rate limits
const USE_MOCK = false;
const FALLBACK_TO_MOCK = true;

// Skip API calls during build to avoid rate limits (3,400+ pages all fetching at once).
// Pages still get their full SEO content; listings load on first visitor request via ISR.
const IS_BUILD_TIME = process.env.NEXT_PHASE === 'phase-production-build';

// -----------------------------------------------------------------------------
// Rate limit protection — tracks 429s and auto-pauses API calls for 5 minutes
// This prevents cascading failures if Bridge throttles us
// -----------------------------------------------------------------------------

let rateLimitedUntil = 0; // timestamp (ms) when we can try the API again

/**
 * Check if we're currently rate-limited.
 * Returns true if Bridge returned a 429 recently and cooldown hasn't expired.
 */
function isRateLimited(): boolean {
  return Date.now() < rateLimitedUntil;
}

/**
 * Mark the API as rate-limited for 5 minutes.
 * All calls during cooldown will fall back to mock data instead of hammering Bridge.
 */
function markRateLimited(): void {
  rateLimitedUntil = Date.now() + 5 * 60 * 1000; // 5-minute cooldown
  console.warn('[Bridge] Rate limited — falling back to mock data for 5 minutes');
}

// -----------------------------------------------------------------------------
// Base fetcher — adds auth header, builds URL, caches with ISR (5 min)
// Includes rate limit detection and a single retry with 2-second backoff
// -----------------------------------------------------------------------------

/**
 * Low-level fetch wrapper for Bridge API.
 * Adds Bearer auth, merges query params, and returns typed response.
 * Uses Next.js ISR caching (revalidate every 300 seconds / 5 minutes).
 * If Bridge returns 429 (rate limited), marks cooldown and throws.
 */
async function bridgeFetch<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<BridgeResponse<T>> {
  // If we're in cooldown from a recent 429, don't even try — throw immediately
  if (isRateLimited()) {
    throw new Error('Bridge API rate limited — in cooldown period');
  }

  // Build the full URL using OData format: base/OData/dataset/resource
  // For test dataset, use the REST endpoint; for real MLS, use OData
  const basePath = DATASET === 'test'
    ? `${BRIDGE_BASE}/${DATASET}${endpoint}`
    : `${BRIDGE_BASE}/OData/${DATASET}${endpoint.replace('/listings', '/Property')}`;
  const url = new URL(basePath);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${BRIDGE_TOKEN}`,
      Accept: 'application/json',
    },
    // Next.js ISR: cache response for 5 minutes, then revalidate in background
    next: { revalidate: 300 },
  });

  // If rate limited, wait 2 seconds and retry once before giving up
  if (res.status === 429) {
    await new Promise(r => setTimeout(r, 2000));
    const retry = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${BRIDGE_TOKEN}`,
        Accept: 'application/json',
      },
      next: { revalidate: 300 },
    });
    if (retry.status === 429) {
      // Still rate limited after retry — activate cooldown so we stop hammering
      markRateLimited();
      throw new Error('Bridge API rate limited after retry');
    }
    if (!retry.ok) {
      throw new Error(`Bridge API error: ${retry.status} ${retry.statusText}`);
    }
    return retry.json();
  }

  // If Bridge returns any other error, throw so callers can handle it
  if (!res.ok) {
    throw new Error(`Bridge API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// -----------------------------------------------------------------------------
// OData filter builder — converts friendly search params to OData $filter
// -----------------------------------------------------------------------------

/**
 * Converts ListingSearchParams into an OData $filter string.
 * Defaults to StandardStatus eq 'Active' if no status is specified.
 */
function buildFilter(params: ListingSearchParams): string {
  const filters: string[] = [];

  // Location filter: prefer zip_codes (multiple ZIPs with OR), fall back to city name
  // Many communities (Carrollwood, Brandon, etc.) aren't MLS "cities" — they're
  // under Tampa or unincorporated county. ZIP codes always work.
  if (params.zip_codes && params.zip_codes.length > 0) {
    const zipFilters = params.zip_codes.map(z => `PostalCode eq '${z}'`).join(' or ');
    filters.push(`(${zipFilters})`);
  } else if (params.city) {
    filters.push(`City eq '${params.city.toUpperCase()}'`);
  }
  if (params.zip) filters.push(`PostalCode eq '${params.zip}'`);
  if (params.min_price) filters.push(`ListPrice ge ${params.min_price}`);
  if (params.max_price) filters.push(`ListPrice le ${params.max_price}`);
  if (params.beds) filters.push(`BedroomsTotal ge ${params.beds}`);
  if (params.baths) filters.push(`BathroomsTotalInteger ge ${params.baths}`);
  if (params.property_type) filters.push(`PropertyType eq '${params.property_type}'`);

  // Topic-specific MLS boolean/numeric filters
  if (params.senior) filters.push(`SeniorCommunityYN eq true`);
  if (params.waterfront) filters.push(`WaterfrontYN eq true`);
  if (params.pool) filters.push(`PoolPrivateYN eq true`);
  if (params.new_construction) filters.push(`NewConstructionYN eq true`);
  if (params.single_story) filters.push(`Stories eq 1`);
  if (params.open_house) {
    // Only show listings with an open house in the next 7 days
    const now = new Date().toISOString();
    const week = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    filters.push(`OpenHouseStartTime ge ${now} and OpenHouseStartTime le ${week}`);
  }

  // Default to active listings unless caller explicitly sets a status
  if (params.status) filters.push(`StandardStatus eq '${params.status}'`);
  else filters.push(`StandardStatus eq 'Active'`);

  return filters.join(' and ');
}

// -----------------------------------------------------------------------------
// Public API functions — import these in Server Components / Route Handlers
// -----------------------------------------------------------------------------

/**
 * Search listings with flexible filters.
 * Pass an empty object to get all active listings (default).
 */
export async function getListings(
  params: ListingSearchParams = {}
): Promise<BridgeResponse<Listing>> {
  // At build time, return empty — listings load on first request via ISR
  if (IS_BUILD_TIME) {
    return { bundle: 'build-skip', total: 0, value: [] };
  }

  // Use mock data when Bridge dataset is 'test'
  if (USE_MOCK) {
    let filtered = [...mockListings];
    if (params.city) filtered = filtered.filter(l => l.City.toLowerCase() === params.city!.toLowerCase());
    if (params.zip) filtered = filtered.filter(l => l.PostalCode === params.zip);
    if (params.min_price) filtered = filtered.filter(l => (l.ListPrice || 0) >= Number(params.min_price));
    if (params.max_price) filtered = filtered.filter(l => (l.ListPrice || 0) <= Number(params.max_price));
    if (params.beds) filtered = filtered.filter(l => (l.BedroomsTotal || 0) >= Number(params.beds));
    if (params.baths) filtered = filtered.filter(l => (l.BathroomsTotalInteger || 0) >= Number(params.baths));
    const limit = params.limit ? Number(params.limit) : 24;
    const offset = params.offset ? Number(params.offset) : 0;
    return { bundle: 'mock', total: filtered.length, value: filtered.slice(offset, offset + limit) };
  }

  try {
    const queryParams: Record<string, string> = {};
    const filter = buildFilter(params);
    if (filter) queryParams['$filter'] = filter;
    if (params.limit) queryParams['$top'] = String(params.limit);
    if (params.offset) queryParams['$skip'] = String(params.offset);
    queryParams['$orderby'] = params.sort || 'ModificationTimestamp desc';
    return await bridgeFetch<Listing>('/listings', queryParams);
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return { bundle: '', total: 0, value: [] };
  }
}

/**
 * Fetch a single listing by its ListingKey.
 * Returns null if not found or on error (404, network issue, etc.).
 */
export async function getListing(id: string): Promise<Listing | null> {
  if (IS_BUILD_TIME) return null;
  if (USE_MOCK) return getMockListing(id);
  try {
    // OData single entity format: Property('ListingKey') — NOT Property/ListingKey
    // bridgeFetch handles the /listings → /Property replacement,
    // but we need the OData key syntax for single-entity lookups
    if (isRateLimited()) {
      return FALLBACK_TO_MOCK ? getMockListing(id) : null;
    }

    const url = DATASET === 'test'
      ? `${BRIDGE_BASE}/${DATASET}/listings/${id}`
      : `${BRIDGE_BASE}/OData/${DATASET}/Property('${id}')`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${BRIDGE_TOKEN}`,
        Accept: 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (res.status === 429) {
      markRateLimited();
      return FALLBACK_TO_MOCK ? getMockListing(id) : null;
    }

    if (!res.ok) return null;

    // OData single entity returns the object directly (not wrapped in .value)
    const data = await res.json();
    return data as Listing;
  } catch {
    return FALLBACK_TO_MOCK ? getMockListing(id) : null;
  }
}

/**
 * Get featured/premium listings for the homepage hero section.
 * Pulls the 12 most expensive active listings above $400K.
 */
export async function getFeaturedListings(): Promise<Listing[]> {
  if (IS_BUILD_TIME) return [];
  if (USE_MOCK) return getMockFeatured();
  try {
    const res = await getListings({
      status: 'Active',
      min_price: '400000',
      limit: '12',
      sort: 'ListPrice desc',
    });
    const listings = res.value || [];
    // Fall back to mock data if live feed is empty (fresh feed transition)
    if (listings.length === 0 && FALLBACK_TO_MOCK) return getMockFeatured();
    return listings;
  } catch (error) {
    console.error('Failed to fetch featured listings:', error);
    return FALLBACK_TO_MOCK ? getMockFeatured() : [];
  }
}

/**
 * Get listings with open houses in the next 7 days.
 * Sorted by soonest open house first.
 */
export async function getOpenHouses(): Promise<Listing[]> {
  if (IS_BUILD_TIME) return [];
  if (USE_MOCK) return getMockOpenHouses();
  try {
    const now = new Date().toISOString();
    const weekFromNow = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const queryParams: Record<string, string> = {
      '$filter': `OpenHouseStartTime ge ${now} and OpenHouseStartTime le ${weekFromNow} and StandardStatus eq 'Active'`,
      '$orderby': 'OpenHouseStartTime asc',
      '$top': '50',
    };

    const res = await bridgeFetch<Listing>('/listings', queryParams);
    return res.value || [];
  } catch (error) {
    console.error('Failed to fetch open houses:', error);
    return [];
  }
}

/**
 * Get active listings for a specific city (e.g. "Tampa", "Brandon").
 * Used on city hub pages like /tampa-homes-for-sale.
 */
export async function getListingsByCity(
  city: string,
  limit = 24
): Promise<Listing[]> {
  if (IS_BUILD_TIME) return [];
  if (USE_MOCK) return getMockListingsByCity(city).slice(0, limit);
  try {
    const res = await getListings({ city, limit: String(limit) });
    const listings = res.value || [];
    if (listings.length === 0 && FALLBACK_TO_MOCK) return getMockListingsByCity(city).slice(0, limit);
    return listings;
  } catch (error) {
    console.error(`Failed to fetch listings for ${city}:`, error);
    return FALLBACK_TO_MOCK ? getMockListingsByCity(city).slice(0, limit) : [];
  }
}

/**
 * Get active listings for a specific ZIP code.
 * Used on ZIP-based search results pages.
 */
export async function getListingsByZip(
  zip: string,
  limit = 24
): Promise<Listing[]> {
  const res = await getListings({ zip, limit: String(limit) });
  return res.value || [];
}
