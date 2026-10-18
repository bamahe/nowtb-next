// =============================================================================
// Community pages: hand-built community pages that live NESTED under a city
// (e.g. /auburndale/gapway-lakes-estates/) rather than at the root level.
//
// WHY THIS FILE EXISTS:
// Root-level neighborhoods live in neighborhoods.ts, which auto-generates three
// routes each (/{slug}/, /{slug}-homes-for-sale/, /{slug}-realtor/). That is the
// right shape for an established neighborhood with MLS inventory. It is the
// WRONG shape for a community that has no homes yet, because two of those three
// pages would render an empty listing grid.
//
// So pre-development and otherwise hand-written communities get registered here
// instead. One entry gives us: the link from the parent city hub, the link from
// the county page, the sitemap entry, and the root-level redirect. One route, no
// thin pages.
//
// -----------------------------------------------------------------------------
// ADDING AN ENTRY — read this first, it has broken the live site before
// -----------------------------------------------------------------------------
// The CANONICAL URL for a community is the NESTED one in `href`
// (/auburndale/gapway-lakes-estates/). Four places have to agree on that, and
// they already do automatically EXCEPT the first one:
//
//   1. next.config.mjs — the ":city flatten" redirect turns /{city}/{anything}
//      into /{anything}/. Any slug in this file must be excluded from it, or the
//      flatten and the redirect in step 2 bounce off each other forever (308 ->
//      308 -> 308...). As of 2026-10-17 that exclusion list is GENERATED from
//      this file by getCommunityFlattenExclusions(), so a new entry excludes
//      itself. Do not hardcode slugs back into that regex.
//   2. src/app/[citySlug]/page.tsx — sends the bare /{slug}/ to `href` with one
//      308. Driven by getCommunityPageBySlug() below, so it needs no edit.
//   3. src/app/sitemap.ts — emits `${siteUrl}${c.href}`, so it needs no edit.
//   4. The actual page file must exist at src/app/{citySlug}/{slug}/page.tsx.
//      Nothing here creates the route; this file only registers and links it.
//
// If it breaks, check: this trap is INVISIBLE in `next dev` (the filesystem
// route wins locally) and only appears on the live domain. Verify a new
// community with:
//   curl -sSI -L --max-redirs 5 https://nowtb.com/{city}/{slug}/ | grep -iE "^HTTP|^location"
// You want exactly one 200 and no repeating Location values.
// =============================================================================

export interface CommunityPage {
  /** URL slug of the community, e.g. "gapway-lakes-estates" */
  slug: string;
  /** Display name, e.g. "Gapway Lakes Estates" */
  name: string;
  /** Parent city slug, must match a slug in cities.ts */
  citySlug: string;
  /** Parent city display name */
  cityName: string;
  /** County display name (no "County" suffix), must match cities.ts */
  county: string;
  /** Full nested path including trailing slash */
  href: string;
  /** One line shown on the parent city hub and the county page */
  blurb: string;
  /** Set true to surface this on the /new-construction/ hub */
  newConstruction?: boolean;
  /** Set true to surface this on the /waterfront/ hub */
  waterfront?: boolean;
}

export const communityPages: CommunityPage[] = [
  {
    slug: "gapway-lakes-estates",
    name: "Gapway Lakes Estates",
    citySlug: "auburndale",
    cityName: "Auburndale",
    county: "Polk",
    href: "/auburndale/gapway-lakes-estates/",
    blurb:
      "45 approved one acre estate lots on Lake Juliana. Pre-development, no lots released yet.",
    newConstruction: true,
    waterfront: true,
  },
];

/** All community pages whose parent city matches this slug */
export function getCommunityPagesByCity(citySlug: string): CommunityPage[] {
  return communityPages.filter((c) => c.citySlug === citySlug);
}

/** All community pages inside this county (pass "Polk", not "Polk County") */
export function getCommunityPagesByCounty(county: string): CommunityPage[] {
  return communityPages.filter(
    (c) => c.county.toLowerCase() === county.toLowerCase()
  );
}

/**
 * Looks up a community by its bare slug. Used by the [citySlug] catch-all to
 * redirect the root-level URL (/gapway-lakes-estates/) to the nested canonical
 * one, the same way /southoak/ redirects to /brandon/southoak/.
 */
export function getCommunityPageBySlug(slug: string): CommunityPage | undefined {
  return communityPages.find((c) => c.slug === slug);
}
