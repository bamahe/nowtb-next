// =============================================================================
// Server-side Bridge API client
// NEVER import this in client components — it uses server-only env vars
// =============================================================================

import { Listing, ListingSearchParams, BridgeResponse } from './types';

// Pull config from environment (set in .env.local, never committed)
const BRIDGE_BASE = process.env.BRIDGE_API_BASE || '';
const BRIDGE_TOKEN = process.env.BRIDGE_SERVER_TOKEN || '';
const DATASET = process.env.BRIDGE_DATASET;

// Fail fast if required env vars are missing (except during build)
if (!DATASET && process.env.NEXT_PHASE !== 'phase-production-build') {
  console.error('[Bridge] BRIDGE_DATASET env var is missing — listings will not load');
}

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
 * All calls during cooldown will return empty results instead of hammering Bridge.
 */
function markRateLimited(): void {
  rateLimitedUntil = Date.now() + 5 * 60 * 1000; // 5-minute cooldown
  console.warn('[Bridge] Rate limited — returning empty results for 5 minutes');
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
    // Cache Bridge API responses for 60 seconds, then revalidate
    next: { revalidate: 60 },
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
  if (params.rental) filters.push(`PropertyType eq 'Residential Lease'`);
  if (params.exclude_rental) filters.push(`PropertyType ne 'Residential Lease'`);
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

  try {
    const queryParams: Record<string, string> = {};
    const filter = buildFilter(params);
    if (filter) queryParams['$filter'] = filter;
    if (params.limit) queryParams['$top'] = String(params.limit);
    if (params.offset) queryParams['$skip'] = String(params.offset);
    queryParams['$orderby'] = params.sort || 'ModificationTimestamp desc';
    queryParams['$count'] = 'true'; // Get total count for pagination/stats
    const raw = await bridgeFetch<Listing>('/listings', queryParams);
    // OData returns count as @odata.count, map it to our 'total' field
    const odataCount = (raw as unknown as Record<string, unknown>)['@odata.count'];
    if (typeof odataCount === 'number') raw.total = odataCount;
    return raw;
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
  try {
    if (isRateLimited()) return null;

    // Try direct lookup first (full 32-char ListingKey)
    const url = DATASET === 'test'
      ? `${BRIDGE_BASE}/${DATASET}/listings/${id}`
      : `${BRIDGE_BASE}/OData/${DATASET}/Property('${id}')`;

    let res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${BRIDGE_TOKEN}`,
        Accept: 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (res.status === 429) {
      markRateLimited();
      return null;
    }

    // If direct lookup fails and the key is short (partial), try a filter search
    if (!res.ok && id.length < 32 && /^[a-f0-9]+$/i.test(id)) {
      const searchUrl = `${BRIDGE_BASE}/OData/${DATASET}/Property?$filter=startswith(ListingKey,'${id}')&$top=1`;
      res = await fetch(searchUrl, {
        headers: {
          Authorization: `Bearer ${BRIDGE_TOKEN}`,
          Accept: 'application/json',
        },
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const searchData = await res.json();
        if (searchData.value && searchData.value.length > 0) {
          return searchData.value[0] as Listing;
        }
      }
      return null;
    }

    if (!res.ok) return null;

    // OData single entity returns the object directly (not wrapped in .value)
    const data = await res.json();
    return data as Listing;
  } catch {
    return null;
  }
}

/**
 * Get featured listings for the homepage — newest active listings
 * across Barrett's 8-county Tampa Bay service area.
 * Uses a representative set of ZIP codes from each county to ensure
 * geographic spread. Sorted by most recently listed.
 */
export async function getFeaturedListings(): Promise<Listing[]> {
  if (IS_BUILD_TIME) return [];
  try {
    // Representative ZIPs from each of the 8 counties (not all 202 — keeps query manageable)
    // Hillsborough: Tampa, Brandon, Riverview, Valrico
    // Pinellas: St Pete, Clearwater, Largo
    // Pasco: Wesley Chapel, Trinity, New Port Richey
    // Manatee: Bradenton, Lakewood Ranch
    // Polk: Lakeland, Winter Haven
    // Sarasota: Sarasota, Venice
    // Hernando: Spring Hill, Brooksville
    // Citrus: Crystal River
    const serviceAreaZips = [
      '33602','33604','33606','33609','33611','33614','33617','33619','33647', // Tampa
      '33510','33511', // Brandon
      '33578','33579', // Riverview
      '33594','33596', // Valrico
      '33572', // Apollo Beach
      '33701','33702','33703','33704','33705','33706','33710','33712', // St Pete
      '33755','33756','33763','33765', // Clearwater
      '33770','33771','33778', // Largo
      '33543','33544','33545', // Wesley Chapel
      '33655', // Trinity (using nearby)
      '34652','34653','34654','34655', // New Port Richey area
      '34637','34638','34639', // Land O Lakes/Lutz
      '34201','34202','34205','34207','34208','34211','34212', // Bradenton/LWR
      '33801','33803','33809','33810','33813', // Lakeland
      '33880','33881','33884', // Winter Haven
      '34231','34232','34236','34237','34239', // Sarasota
      '34285','34292', // Venice
      '34606','34608','34609', // Spring Hill
      '34601','34602', // Brooksville
      '34428','34429', // Crystal River
    ];
    const res = await getListings({
      zip_codes: serviceAreaZips,
      status: 'Active',
      exclude_rental: true,
      limit: '12',
      sort: 'ModificationTimestamp desc',
    });
    return res.value || [];
  } catch (error) {
    console.error('Failed to fetch featured listings:', error);
    return [];
  }
}

/**
 * Get listings with open houses in the next 7 days.
 * Sorted by soonest open house first.
 */
export async function getOpenHouses(): Promise<Listing[]> {
  if (IS_BUILD_TIME) return [];
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
  try {
    const res = await getListings({ city, limit: String(limit) });
    return res.value || [];
  } catch (error) {
    console.error(`Failed to fetch listings for ${city}:`, error);
    return [];
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
