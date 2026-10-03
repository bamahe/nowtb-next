// =============================================================================
// Pinellas Gulf beach condo content cluster (October 2026)
// One source of truth for the 7 page slugs so every page in the set can link
// to the other six, and so the sitemap stays in sync with what was built.
// =============================================================================

export interface BeachCondoPage {
  /** URL slug, no leading or trailing slash */
  slug: string;
  /** Short link label used in cross-link grids */
  label: string;
  /** One line description shown under the label */
  blurb: string;
}

export const BEACH_CONDO_PAGES: BeachCondoPage[] = [
  {
    slug: "gulf-front-condos-sirs-milestone-complete",
    label: "Buildings With SIRS and Milestone Done",
    blurb: "Which Gulf-front buildings have both reports finished.",
  },
  {
    slug: "pinellas-beach-condo-market-report",
    label: "Gulf Beach Condo Market Report",
    blurb: "Pricing, days on market, and buyer leverage for Q4 2026.",
  },
  {
    slug: "florida-condo-rules-buyers-2026",
    label: "Florida Condo Rules for Buyers",
    blurb: "What HB 913, Fannie Mae, and Citizens changed for 2026.",
  },
  {
    slug: "indian-rocks-beach-rental-rules",
    label: "Indian Rocks Beach Rental Rules",
    blurb: "City registration, guest caps, parking, and building minimums.",
  },
  {
    slug: "buying-beach-condo-llc-florida",
    label: "Buying a Beach Condo in an LLC",
    blurb: "Financing, association approval, taxes, and the document list.",
  },
  {
    slug: "beach-condo-renovation-math",
    label: "The Renovation Math",
    blurb: "Estimated costs to update a dated Gulf-front condo.",
  },
  {
    slug: "how-to-tell-if-condo-is-55-plus",
    label: "Is the Condo 55+?",
    blurb: "A step by step check that does not rely on the building name.",
  },
];

/** Every page in the set except the one being viewed */
export function otherBeachCondoPages(currentSlug: string): BeachCondoPage[] {
  return BEACH_CONDO_PAGES.filter((page) => page.slug !== currentSlug);
}

/** All slugs, used by the sitemap */
export function getBeachCondoSlugs(): string[] {
  return BEACH_CONDO_PAGES.map((page) => page.slug);
}

/**
 * Pinellas beach city and county pages that already exist on the site.
 * North Redington Beach and Belleair Beach are intentionally absent: there is
 * no city page for either one yet, so linking to them would 404.
 */
export const BEACH_CITY_LINKS: { href: string; label: string }[] = [
  { href: "/indian-rocks-beach/", label: "Indian Rocks Beach" },
  { href: "/indian-shores/", label: "Indian Shores" },
  { href: "/redington-beach/", label: "Redington Beach" },
  { href: "/redington-shores/", label: "Redington Shores" },
  { href: "/madeira-beach/", label: "Madeira Beach" },
  { href: "/pinellas-county/", label: "Pinellas County" },
];

/** Shown in the footer line of every page in this cluster */
export const BEACH_CONDO_LAST_UPDATED = "October 2026";

/** ISO date used for Article schema datePublished and dateModified */
export const BEACH_CONDO_PUBLISH_DATE = "2026-10-03";
