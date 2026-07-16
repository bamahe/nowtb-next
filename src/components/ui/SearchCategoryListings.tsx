// Shows live listings on blog posts that are search category pages
// (e.g., tampa-waterfront-condos, tampa-historic-homes, etc.)

"use client";

import ClientListings from "@/components/ui/ClientListings";

// Map blog slugs to listing search parameters
const CATEGORY_LISTINGS: Record<string, {
  zipCodes: string[];
  title: string;
  filters?: Record<string, string>;
  limit?: number;
}> = {
  "tampa-waterfront-condos": {
    zipCodes: ["33602","33603","33606","33609","33611","33615","33616","33619","33621"],
    title: "Tampa Waterfront Condos for Sale",
    filters: { property_type: "Condominium", waterfront: "true" },
    limit: 12,
  },
  "tampa-historic-homes": {
    zipCodes: ["33602","33603","33604","33605","33606","33609","33610","33611"],
    title: "Tampa Historic Homes for Sale",
    filters: { min_year: "1900", max_year: "1965" },
    limit: 12,
  },
  "tampa-golf-course-homes": {
    zipCodes: ["33602","33606","33609","33611","33614","33618","33624","33625","33626","33647","33594","33596"],
    title: "Tampa Bay Golf Course Area Homes",
    limit: 12,
  },
  "tampa-modern-homes": {
    zipCodes: ["33602","33606","33609","33611","33614","33615","33616"],
    title: "Modern & New Construction Homes in Tampa",
    filters: { new_construction: "true" },
    limit: 12,
  },
  "tampa-craftsman-homes": {
    zipCodes: ["33603","33604","33605","33610"],
    title: "Seminole Heights & Tampa Heights Homes",
    limit: 12,
  },
  "tampa-mediterranean-homes": {
    zipCodes: ["33606","33609","33611","33629"],
    title: "South Tampa Homes for Sale",
    limit: 12,
  },
  "tampa-colonial-homes": {
    zipCodes: ["33606","33609","33611","33629"],
    title: "South Tampa Colonial & Traditional Homes",
    limit: 12,
  },
  "tampa-key-west-homes": {
    zipCodes: ["33606","33611","33572","33715"],
    title: "Coastal Style Homes in Tampa Bay",
    limit: 12,
  },
  "tampa-homes-with-guest-house": {
    zipCodes: ["33594","33596","33547","33527","33563","33606","33609"],
    title: "Homes with Guest Houses & Large Lots",
    filters: { min_acreage: "0.5" },
    limit: 12,
  },
  "tampa-condos-ev-charging": {
    zipCodes: ["33602","33606","33609","33611"],
    title: "Downtown Tampa Condos",
    filters: { property_type: "Condominium" },
    limit: 12,
  },
  "tampa-villa-homes": {
    zipCodes: ["33573","33578","33579","33594","33596","34211","34212"],
    title: "Villa & Low-Maintenance Homes",
    limit: 12,
  },
};

export default function SearchCategoryListings({ slug }: { slug: string }) {
  const config = CATEGORY_LISTINGS[slug];
  if (!config) return null;

  return (
    <ClientListings
      zipCodes={config.zipCodes}
      title={config.title}
      subtitle="Active listings from Stellar MLS — updated daily"
      limit={config.limit || 12}
      filters={config.filters || {}}
      areaName="Tampa Bay"
    />
  );
}
