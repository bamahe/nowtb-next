// =============================================================================
// city-market-stats — verified closed-sale medians per city
//
// Why this file exists: the city hub pages previously hardcoded their market
// stats to zero, so the stats bar never rendered and crawlers (and AI answer
// engines) saw city pages with no market data at all. These figures make real
// numbers server-rendered and crawler-visible.
//
// Source: Stellar MLS closed sales via the Bridge API, trailing 12 months,
// with lease records and manufactured/mobile housing excluded. Every city
// below was fully paginated — these are complete datasets, not samples.
//
// To refresh: re-run the generator against the Bridge API and update both the
// rows and AS_OF. Figures move month to month; AS_OF is rendered on the page
// so readers always know the window.
// =============================================================================

/** Human-readable window these figures cover. Shown on the page. */
export const AS_OF = "the twelve months ending October 2026";

export interface CityMarketStats {
  slug: string;
  /** All closed sales in the window, excluding leases and manufactured housing */
  totalSales: number;
  sfSales: number;
  sfMedian: number | null;
  sfDom: number | null;
  condoSales: number;
  condoMedian: number | null;
  condoDom: number | null;
  thSales: number;
  thMedian: number | null;
  thDom: number | null;
  /** Median across every property type in the window */
  allMedian: number | null;
  allDom: number | null;
}

export const CITY_MARKET_STATS: CityMarketStats[] = [
  {
    slug: "valrico",
    totalSales: 783,
    sfSales: 733, sfMedian: 427000, sfDom: 28,
    condoSales: 3, condoMedian: 190000, condoDom: 21,
    thSales: 32, thMedian: 226500, thDom: 34,
    allMedian: 420000, allDom: 29,
  },
  {
    slug: "brandon",
    totalSales: 870,
    sfSales: 677, sfMedian: 390000, sfDom: 22,
    condoSales: 27, condoMedian: 142500, condoDom: 27,
    thSales: 123, thMedian: 239000, thDom: 42,
    allMedian: 370000, allDom: 26,
  },
  {
    slug: "riverview",
    totalSales: 1727,
    sfSales: 1465, sfMedian: 392500, sfDom: 39,
    condoSales: 32, condoMedian: 164000, condoDom: 48,
    thSales: 194, thMedian: 235000, thDom: 41,
    allMedian: 375000, allDom: 40,
  },
  {
    slug: "plant-city",
    totalSales: 992,
    sfSales: 809, sfMedian: 365000, sfDom: 32,
    condoSales: 15, condoMedian: 260000, condoDom: 54,
    thSales: 34, thMedian: 274900, thDom: 61,
    allMedian: 350000, allDom: 35,
  },
  {
    slug: "apollo-beach",
    totalSales: 805,
    sfSales: 680, sfMedian: 534995, sfDom: 69,
    condoSales: 9, condoMedian: 200000, condoDom: 108,
    thSales: 38, thMedian: 325990, thDom: 68,
    allMedian: 489999, allDom: 68,
  },
  {
    slug: "tampa",
    totalSales: 8951,
    sfSales: 6080, sfMedian: 460000, sfDom: 27,
    condoSales: 1185, condoMedian: 260000, condoDom: 48,
    thSales: 1014, thMedian: 380995, thDom: 42,
    allMedian: 430000, allDom: 33,
  },
  {
    slug: "largo",
    totalSales: 1274,
    sfSales: 823, sfMedian: 410000, sfDom: 27,
    condoSales: 241, condoMedian: 175000, condoDom: 74,
    thSales: 80, thMedian: 330000, thDom: 43,
    allMedian: 368500, allDom: 36,
  },
];

/**
 * Look up verified market stats for a city slug.
 * Returns undefined when we have not pulled that city yet, so callers can
 * skip the block entirely rather than render placeholder zeros.
 */
export function getCityMarketStats(slug: string): CityMarketStats | undefined {
  return CITY_MARKET_STATS.find((s) => s.slug === slug);
}

/**
 * Small samples make a median meaningless. Callers use this to decide whether
 * to publish a figure or omit it.
 */
export function hasReliableSample(n: number): boolean {
  return n >= 20;
}
