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

// Use mock data until real MLS dataset is configured
// Change to: const USE_MOCK = DATASET === 'test'; when going live
const USE_MOCK = true;

// -----------------------------------------------------------------------------
// Base fetcher — adds auth header, builds URL, caches with ISR (5 min)
// -----------------------------------------------------------------------------

/**
 * Low-level fetch wrapper for Bridge API.
 * Adds Bearer auth, merges query params, and returns typed response.
 * Uses Next.js ISR caching (revalidate every 300 seconds / 5 minutes).
 */
async function bridgeFetch<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<BridgeResponse<T>> {
  // Build the full URL: base + dataset + endpoint + query params
  const url = new URL(`${BRIDGE_BASE}/${DATASET}${endpoint}`);
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

  // If Bridge returns an error, throw so callers can handle it
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

  if (params.city) filters.push(`City eq '${params.city}'`);
  if (params.zip) filters.push(`PostalCode eq '${params.zip}'`);
  if (params.min_price) filters.push(`ListPrice ge ${params.min_price}`);
  if (params.max_price) filters.push(`ListPrice le ${params.max_price}`);
  if (params.beds) filters.push(`BedroomsTotal ge ${params.beds}`);
  if (params.baths) filters.push(`BathroomsTotalInteger ge ${params.baths}`);
  if (params.property_type) filters.push(`PropertyType eq '${params.property_type}'`);

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
  if (USE_MOCK) return getMockListing(id);
  try {
    const res = await bridgeFetch<Listing>(`/listings/${id}`);
    return res.value?.[0] || null;
  } catch {
    return null;
  }
}

/**
 * Get featured/premium listings for the homepage hero section.
 * Pulls the 12 most expensive active listings above $400K.
 */
export async function getFeaturedListings(): Promise<Listing[]> {
  if (USE_MOCK) return getMockFeatured();
  try {
    const res = await getListings({
      status: 'Active',
      min_price: '400000',
      limit: '12',
      sort: 'ListPrice desc',
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
  if (USE_MOCK) return getMockListingsByCity(city).slice(0, limit);
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
