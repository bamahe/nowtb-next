/**
 * City data for hub/spoke pages.
 * Tier 1 cities ship at launch. Tier 2+ added later.
 */

export interface CityData {
  name: string;
  slug: string;
  county: string;
  zip_codes: string[];
  tier: 1 | 2 | 3;
  /** Topics that apply to this city (spoke pages) */
  topics: string[];
  /** Short tagline for hero sections */
  tagline: string;
  /** Lat/lng center for map views */
  lat: number;
  lng: number;
}

/** Spoke topics — each becomes a /{city}-{topic} page
 *  Matches all 15 property-type spokes from the WordPress site */
export const SPOKE_TOPICS = [
  { slug: "homes-for-sale", label: "Homes for Sale", filter: {} },
  { slug: "homes-with-pool", label: "Pool Homes", filter: { pool: true } },
  { slug: "new-construction", label: "New Construction", filter: { property_type: "New Construction" } },
  { slug: "luxury-homes", label: "Luxury Homes", filter: { min_price: "750000" } },
  { slug: "waterfront-homes", label: "Waterfront Homes", filter: { waterfront: true } },
  { slug: "55-plus-homes", label: "55+ Communities", filter: { senior: true } },
  { slug: "open-houses", label: "Open Houses", filter: { open_house: true } },
  { slug: "investment-property", label: "Investment Properties", filter: { property_type: "Investment" } },
  { slug: "new-listings", label: "New Listings", filter: { sort: "OriginalEntryTimestamp desc" } },
  { slug: "single-story-homes", label: "Single-Story Homes", filter: { stories: "1" } },
  { slug: "land-for-sale", label: "Land for Sale", filter: { property_type: "Land" } },
  { slug: "condos-townhomes", label: "Condos & Townhomes", filter: { property_type: "Condominium" } },
  { slug: "gated-community-homes", label: "Gated Communities", filter: { gated: true } },
  { slug: "neighborhood-guide", label: "Neighborhood Guide", filter: {} },
  { slug: "housing-market", label: "Housing Market", filter: {} },
] as const;

/** Additional city page types — not property-type spokes */
export const CITY_PAGE_TYPES = [
  { slug: "realtor", label: "Your {City} REALTOR®" },
  { slug: "sell-your-home", prefix: "sell-your-home-", label: "Sell Your {City} Home" },
] as const;

export const cities: CityData[] = [
  {
    name: "Valrico",
    slug: "valrico",
    county: "Hillsborough",
    zip_codes: ["33594", "33596"],
    tier: 1,
    topics: ["homes-for-sale", "pool-homes", "new-construction", "luxury-homes", "open-houses"],
    tagline: "Family-friendly community with top-rated schools and spacious homes",
    lat: 27.9378,
    lng: -82.2368,
  },
  {
    name: "Brandon",
    slug: "brandon",
    county: "Hillsborough",
    zip_codes: ["33510", "33511"],
    tier: 1,
    topics: ["homes-for-sale", "pool-homes", "new-construction", "luxury-homes", "55-plus-communities", "open-houses"],
    tagline: "Tampa Bay's best suburban value with easy commutes and endless amenities",
    lat: 27.9378,
    lng: -82.2859,
  },
  {
    name: "Riverview",
    slug: "riverview",
    county: "Hillsborough",
    zip_codes: ["33569", "33578", "33579"],
    tier: 1,
    topics: ["homes-for-sale", "pool-homes", "new-construction", "luxury-homes", "waterfront-homes", "open-houses"],
    tagline: "One of Florida's fastest-growing communities with new homes and master-planned neighborhoods",
    lat: 27.8764,
    lng: -82.3268,
  },
  {
    name: "Tampa",
    slug: "tampa",
    county: "Hillsborough",
    zip_codes: ["33602", "33603", "33604", "33605", "33606", "33607", "33609", "33610", "33611", "33612", "33613", "33614", "33615", "33616", "33617", "33618", "33619", "33620", "33621", "33624", "33625", "33626", "33629", "33634", "33635", "33647"],
    tier: 1,
    topics: ["homes-for-sale", "pool-homes", "new-construction", "luxury-homes", "waterfront-homes", "55-plus-communities", "open-houses"],
    tagline: "Florida's Gulf Coast metro with world-class dining, culture, and waterfront living",
    lat: 27.9506,
    lng: -82.4572,
  },
  {
    name: "Lithia",
    slug: "lithia",
    county: "Hillsborough",
    zip_codes: ["33547"],
    tier: 1,
    topics: ["homes-for-sale", "pool-homes", "new-construction", "luxury-homes", "open-houses"],
    tagline: "Rural charm meets upscale living in Hillsborough County's hidden gem",
    lat: 27.8667,
    lng: -82.2134,
  },
  {
    name: "FishHawk",
    slug: "fishhawk",
    county: "Hillsborough",
    zip_codes: ["33547"],
    tier: 1,
    topics: ["homes-for-sale", "pool-homes", "new-construction", "luxury-homes", "open-houses"],
    tagline: "Premier master-planned community with A-rated schools and resort-style amenities",
    lat: 27.8537,
    lng: -82.2193,
  },
  {
    name: "Apollo Beach",
    slug: "apollo-beach",
    county: "Hillsborough",
    zip_codes: ["33572"],
    tier: 1,
    topics: ["homes-for-sale", "pool-homes", "new-construction", "luxury-homes", "waterfront-homes", "open-houses"],
    tagline: "Waterfront paradise on Tampa Bay with boating, fishing, and Gulf sunsets",
    lat: 27.7731,
    lng: -82.4076,
  },
  {
    name: "Plant City",
    slug: "plant-city",
    county: "Hillsborough",
    zip_codes: ["33563", "33565", "33566", "33567"],
    tier: 1,
    topics: ["homes-for-sale", "pool-homes", "new-construction", "open-houses"],
    tagline: "Small-town Florida living with acreage, farms, and the world-famous Strawberry Festival",
    lat: 28.0142,
    lng: -82.1195,
  },
  {
    name: "Seffner",
    slug: "seffner",
    county: "Hillsborough",
    zip_codes: ["33584"],
    tier: 1,
    topics: ["homes-for-sale", "pool-homes", "new-construction", "open-houses"],
    tagline: "Affordable homes with easy I-4 access between Tampa and Lakeland",
    lat: 27.9836,
    lng: -82.2762,
  },
  {
    name: "Dover",
    slug: "dover",
    county: "Hillsborough",
    zip_codes: ["33527"],
    tier: 1,
    topics: ["homes-for-sale", "pool-homes", "open-houses"],
    tagline: "Country living minutes from the city with large lots and agricultural charm",
    lat: 27.9942,
    lng: -82.2184,
  },
];

/** Get all Tier 1 cities (launch set) */
export function getTier1Cities(): CityData[] {
  return cities.filter((c) => c.tier === 1);
}

/** Look up a city by its URL slug */
export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}

/** Get all spoke topics for a given city */
export function getCityTopics(city: CityData) {
  return SPOKE_TOPICS.filter((t) => city.topics.includes(t.slug));
}
