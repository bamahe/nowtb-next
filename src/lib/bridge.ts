// =============================================================================
// Server-side Bridge API client
// NEVER import this in client components — it uses server-only env vars
// =============================================================================

import { Listing, ListingSearchParams, BridgeResponse } from './types';
import { getCached, setCached, makeCacheKey } from './api-cache';

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
 * Exported so pages can show "temporarily unavailable" instead of hard 404.
 */
export function isRateLimited(): boolean {
  return Date.now() < rateLimitedUntil;
}

/**
 * Mark the API as rate-limited for 5 minutes.
 * All calls during cooldown will return empty results instead of hammering Bridge.
 */
function markRateLimited(): void {
  rateLimitedUntil = Date.now() + 60 * 1000; // 1-minute cooldown (was 5 min — too aggressive)
  console.warn('[Bridge] Rate limited — pausing API calls for 1 minute');
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
  // If in cooldown from a recent 429, log but still try — the ISR cache
  // means we only call once per 5 min, so we should always attempt the call.
  // The old approach of throwing here caused cascading failures across all pages.
  if (isRateLimited()) {
    console.warn('[Bridge] In cooldown but attempting call anyway (ISR cached)');
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
    // Cache Bridge API responses for 15 minutes to reduce API calls
    // With 4,000+ pages, shorter cache = thousands of requests/hour
    next: { revalidate: 1800 },
  });

  // If rate limited, activate cooldown immediately — don't waste another request
  if (res.status === 429) {
    markRateLimited();
    throw new Error('Bridge API rate limited — cooldown active for 30 minutes');
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
  // Stellar MLS uses PropertySubType for Condominium/Townhouse (PropertyType is just "Residential")
  if (params.property_type) {
    if (params.property_type === 'Condominium' || params.property_type === 'Townhouse') {
      filters.push(`PropertySubType eq '${params.property_type}'`);
    } else {
      filters.push(`PropertyType eq '${params.property_type}'`);
    }
  }
  if (params.property_sub_type) filters.push(`PropertySubType eq '${params.property_sub_type}'`);

  // Topic-specific MLS boolean/numeric filters
  if (params.senior) filters.push(`SeniorCommunityYN eq true`);
  if (params.waterfront) filters.push(`WaterfrontYN eq true`);
  if (params.pool) filters.push(`PoolPrivateYN eq true`);
  if (params.new_construction) filters.push(`NewConstructionYN eq true`);
  if (params.single_story) filters.push(`Stories eq 1`);
  if (params.rental) filters.push(`PropertyType eq 'Residential Lease'`);
  if (params.exclude_rental) filters.push(`PropertyType ne 'Residential Lease'`);
  // open_house filter is handled separately by getOpenHouses() — skip here
  // The OData Property endpoint does not support OpenHouseStartTime filtering

  // Advanced FilterPanel filters
  if (params.min_sqft) filters.push(`LivingArea ge ${params.min_sqft}`);
  if (params.max_sqft) filters.push(`LivingArea le ${params.max_sqft}`);
  if (params.min_year) filters.push(`YearBuilt ge ${params.min_year}`);
  if (params.price_reduced) filters.push(`OriginalListPrice gt ListPrice`);
  if (params.garage) filters.push(`GarageYN eq true`);
  if (params.min_acreage) filters.push(`LotSizeAcres ge ${params.min_acreage}`);
  // Note: keyword search (PublicRemarks) is not supported by Bridge OData $filter.
  // It is applied as a client-side filter in the /api/listings route instead.

  // Subdivision name filter (for neighborhood-specific searches)
  // Uses 'contains' instead of 'eq' because MLS subdivision names have variations
  // e.g. "BLOOMINGDALE SEC U V PH", "VILLAGES OF BLOOMINGDALE", etc.
  if (params.subdivision) filters.push(`contains(SubdivisionName,'${params.subdivision.toUpperCase()}')`);

  // Address search: matches street number + name in UnparsedAddress
  if (params.address) filters.push(`contains(UnparsedAddress,'${params.address.toUpperCase()}')`);

  // Default to active listings unless caller explicitly sets a status
  // Address searches skip the status filter to find properties in any state
  if (params.status) filters.push(`StandardStatus eq '${params.status}'`);
  else if (!params.address) filters.push(`StandardStatus eq 'Active'`);

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
  if (IS_BUILD_TIME) {
    return { bundle: 'build-skip', total: 0, value: [] };
  }

  // CHECK CACHE — same query within 5 min returns cached response
  const cacheKey = makeCacheKey('listings', params as Record<string, string | undefined>);
  const cached = getCached<BridgeResponse<Listing>>(cacheKey);
  if (cached) return cached;

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
    // Cache successful non-empty responses
    if (raw.value && raw.value.length > 0) {
      setCached(cacheKey, raw);
    }
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
  // Check cache
  const cacheKey = `listing:${id}`;
  const cached = getCached<Listing>(cacheKey);
  if (cached) return cached;
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
      next: { revalidate: 1800 },
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
        next: { revalidate: 1800 },
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
    const listing = data as Listing;
    if (listing?.ListingKey) setCached(cacheKey, listing);
    return listing;
  } catch {
    return null;
  }
}

/**
 * Look up a listing by its MLS ID (e.g. "TB8526478") instead of ListingKey.
 * Used by the new SEO-friendly URL format: /properties/StellarMLS/TB8526478/city/address
 */
export async function getListingByMlsId(mlsId: string): Promise<Listing | null> {
  if (IS_BUILD_TIME) return null;
  try {
    if (isRateLimited()) return null;
    const queryParams: Record<string, string> = {
      '$filter': `ListingId eq '${mlsId}'`,
      '$top': '1',
    };
    const data = await bridgeFetch<Listing>('/listings', queryParams);
    return data.value?.[0] || null;
  } catch {
    return null;
  }
}

/**
 * Get just-listed properties in a city (by ZIP codes).
 * Returns the 8 most recently listed active properties.
 */
export async function getJustListed(zipCodes: string[], excludeKey?: string): Promise<Listing[]> {
  if (IS_BUILD_TIME) return [];
  try {
    const zipFilter = zipCodes.map(z => `PostalCode eq '${z}'`).join(' or ');
    const filters = [
      `(${zipFilter})`,
      `StandardStatus eq 'Active'`,
      `PropertyType ne 'Residential Lease'`,
    ];
    if (excludeKey) filters.push(`ListingKey ne '${excludeKey}'`);
    const res = await bridgeFetch<Listing>('/listings', {
      '$filter': filters.join(' and '),
      '$orderby': 'OriginalEntryTimestamp desc',
      '$top': '8',
    });
    return res.value || [];
  } catch {
    return [];
  }
}

/**
 * Get price-reduced properties in a city (by ZIP codes).
 * Filters for active listings where current price is below original price.
 */
export async function getPriceReduced(zipCodes: string[], excludeKey?: string): Promise<Listing[]> {
  if (IS_BUILD_TIME) return [];
  try {
    const zipFilter = zipCodes.map(z => `PostalCode eq '${z}'`).join(' or ');
    const filters = [
      `(${zipFilter})`,
      `StandardStatus eq 'Active'`,
      `PropertyType ne 'Residential Lease'`,
      `OriginalListPrice gt ListPrice`,
    ];
    if (excludeKey) filters.push(`ListingKey ne '${excludeKey}'`);
    const res = await bridgeFetch<Listing>('/listings', {
      '$filter': filters.join(' and '),
      '$orderby': 'PriceChangeTimestamp desc',
      '$top': '8',
    });
    return res.value || [];
  } catch {
    return [];
  }
}

/**
 * Get recently sold properties in a city (by ZIP codes).
 * Returns the 8 most recently closed SALES (not rentals) within 180 days.
 */
export async function getRecentSales(zipCodes: string[], excludeKey?: string): Promise<Listing[]> {
  if (IS_BUILD_TIME) return [];
  try {
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();
    const zipFilter = zipCodes.map(z => `PostalCode eq '${z}'`).join(' or ');
    const filters = [
      `(${zipFilter})`,
      `StandardStatus eq 'Closed'`,
      `PropertyType ne 'Residential Lease'`,
      `ClosePrice ge 50000`,
      `ModificationTimestamp ge ${sixMonthsAgo}`,
    ];
    if (excludeKey) filters.push(`ListingKey ne '${excludeKey}'`);
    const res = await bridgeFetch<Listing>('/listings', {
      '$filter': filters.join(' and '),
      '$orderby': 'CloseDate desc',
      '$top': '8',
    });
    return res.value || [];
  } catch {
    return [];
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
    // Priority city ZIPs only — fewer ZIPs = smaller filter = faster API response
    const serviceAreaZips = [
      '33602','33606','33609','33611','33614','33619', // Tampa (core)
      '33510','33511', // Brandon
      '33578','33579', // Riverview
      '33594','33596', // Valrico
      '33572', // Apollo Beach
      '33527', // Dover
      '33584', // Seffner
      '33563','33565', // Plant City
      '33547', // Lithia
      '33570', // Ruskin
      '33592', // Thonotosassa
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
 * Optionally filter by ZIP codes (for city-specific open house pages).
 */
export async function getOpenHouses(zipCodes?: string[]): Promise<Listing[]> {
  if (IS_BUILD_TIME) return [];
  try {
    const now = new Date().toISOString();
    const weekFromNow = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    // Step 1: Fetch open house records from the Bridge REST API
    // The OData Property endpoint does NOT support OpenHouseStartTime filtering.
    const url = new URL(`${BRIDGE_BASE}/${DATASET}/openhouses`);
    url.searchParams.set('OpenHouseStartTime.gte', now);
    url.searchParams.set('OpenHouseStartTime.lte', weekFromNow);
    url.searchParams.set('sortBy', 'OpenHouseStartTime');
    url.searchParams.set('limit', '200');
    url.searchParams.set('fields', 'ListingKey,ListingId,OpenHouseStartTime,OpenHouseEndTime,OpenHouseDate');

    const ohRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${BRIDGE_TOKEN}`,
        Accept: 'application/json',
      },
      next: { revalidate: 1800 },
    });

    if (ohRes.status === 429) { markRateLimited(); return []; }
    if (!ohRes.ok) {
      console.error(`[Bridge] Open houses endpoint error: ${ohRes.status}`);
      return [];
    }
    const ohData = await ohRes.json();

    // Bridge REST API returns 200 with rate limit error IN the body:
    // { success: false, status: 429, bundle: { name: "RateLimitError" } }
    if (ohData.success === false || ohData.status === 429) {
      console.warn('[Bridge] Open houses rate limited (in-body 429)');
      markRateLimited();
      return [];
    }

    // bundle is an array on success, an error object on failure
    const rawBundle = ohData.bundle;
    const openHouseRecords = Array.isArray(rawBundle) ? rawBundle : (Array.isArray(ohData.value) ? ohData.value : []);
    console.log(`[Bridge] Open houses: ${openHouseRecords.length} records`);
    if (openHouseRecords.length === 0) return [];

    // Step 2: Get unique listing keys from open house records
    const keySet = new Set<string>();
    for (const oh of openHouseRecords) {
      if (oh.ListingKey) keySet.add(oh.ListingKey);
    }
    const listingKeys = Array.from(keySet);

    if (listingKeys.length === 0) return [];

    // Step 3: Fetch full listing details for those keys via OData
    // If ZIP filter provided, add it to the OData query so we only get local listings
    // This prevents non-Tampa listings from taking up our 20-key cap
    const keysToFetch = listingKeys.slice(0, 40); // Increased cap to 40 for better coverage
    const keyFilter = keysToFetch.map(k => `ListingKey eq '${k}'`).join(' or ');
    const zipFilter = zipCodes && zipCodes.length > 0
      ? ' and (' + zipCodes.slice(0, 30).map(z => `PostalCode eq '${z}'`).join(' or ') + ')'
      : '';
    const allListings: Listing[] = [];

    try {
      const res = await bridgeFetch<Listing>('/listings', {
        '$filter': `(${keyFilter}) and StandardStatus eq 'Active'${zipFilter}`,
        '$top': '40',
      });
      if (res.value) allListings.push(...res.value);
    } catch {
      // If rate limited, return empty rather than crashing
      return [];
    }

    // Step 4: Attach open house date/time to each listing
    // Build a map of ListingKey -> earliest open house schedule
    const ohMap = new Map<string, { start: string; end: string }>();
    for (const oh of openHouseRecords) {
      if (oh.ListingKey && oh.OpenHouseStartTime) {
        // Keep the earliest upcoming open house for each listing
        if (!ohMap.has(oh.ListingKey)) {
          ohMap.set(oh.ListingKey, {
            start: oh.OpenHouseStartTime,
            end: oh.OpenHouseEndTime || '',
          });
        }
      }
    }
    for (const listing of allListings) {
      const oh = ohMap.get(listing.ListingKey);
      if (oh) {
        listing.OpenHouseStartTime = oh.start;
        listing.OpenHouseEndTime = oh.end;
      }
    }

    // Step 5: Sort by soonest open house first
    allListings.sort((a, b) => {
      const aTime = a.OpenHouseStartTime ? new Date(a.OpenHouseStartTime).getTime() : Infinity;
      const bTime = b.OpenHouseStartTime ? new Date(b.OpenHouseStartTime).getTime() : Infinity;
      return aTime - bTime;
    });

    // Step 6: Filter by ZIP codes for city-specific open house pages
    // (also applied in the OData query above, but belt-and-suspenders)
    if (zipCodes && zipCodes.length > 0) {
      const zipSet = new Set(zipCodes);
      return allListings.filter(l => l.PostalCode && zipSet.has(l.PostalCode));
    }

    return allListings;
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
