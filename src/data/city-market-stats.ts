// =============================================================================
// city-market-stats — verified closed-sale medians per city
//
// Why this file exists: the city hub market stats bar was dead code. It only
// rendered when a client-side listings array was non-empty, and that array was
// hardcoded empty, so no city page ever showed market data. Crawlers and AI
// answer engines saw city pages with no numbers at all. These figures make
// real, sourced numbers server-rendered and crawler-visible.
//
// Source: Stellar MLS closed sales via the Bridge API, trailing 12 months,
// lease records and manufactured/mobile housing excluded. Every row was fully
// paginated — complete datasets, not samples.
// 91 communities, 93,058 closed sales (85 by city, 6 by ZIP).
//
// Two bases, because the MLS does not file every community under its own name:
//   basis "city" — matched on the MLS City field.
//   basis "zip"  — matched on the community's ZIP codes, used where the MLS
//                  files the area under a parent city. Westchase, Carrollwood
//                  and Town 'n' Country come through as Tampa, FishHawk as
//                  Lithia, East Lake as Palm Harbor, Siesta Key as Sarasota.
//                  A city-name query returns a sliver of the real market there
//                  (Westchase returned under 20 sales against 356 by ZIP), so
//                  ZIP is the honest basis. The page labels it as such.
//
// Deliberately absent, rather than published wrong:
//   - Ridge Manor. Its ZIPs 33523/33597 are 51% Dade City and 47% Webster
//     closings and only 2% Ridge Manor, so the ZIP describes a different market.
//   - Ozona. ZIP 34660 has no MLS closed sales in the window.
//   - Any community under 20 closed sales, where a median is noise.
// Callers get undefined for those and skip the block entirely.
//
// To refresh: re-run the generator and update the rows plus AS_OF. Figures move
// month to month; AS_OF renders on the page so a reader knows the window.
// =============================================================================

/** Human-readable window these figures cover. Shown on the page. */
export const AS_OF = "the twelve months ending October 2026";

/** Minimum closed sales before a median is worth publishing. */
export const MIN_SAMPLE = 20;

export interface CityMarketStats {
  slug: string;
  /** How the sales were matched — see the file header */
  basis: "city" | "zip";
  /** ZIP codes used when basis is "zip"; null for city-matched rows */
  zips: string[] | null;
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
    slug: "anna-maria", basis: "city", zips: null,
    totalSales: 94,
    sfSales: 77, sfMedian: 1945000, sfDom: 78,
    condoSales: 5, condoMedian: 525000, condoDom: 145,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 1750000, allDom: 101,
  },
  {
    slug: "apollo-beach", basis: "city", zips: null,
    totalSales: 805,
    sfSales: 680, sfMedian: 534995, sfDom: 69,
    condoSales: 9, condoMedian: 200000, condoDom: 108,
    thSales: 38, thMedian: 325990, thDom: 68,
    allMedian: 489999, allDom: 68,
  },
  {
    slug: "auburndale", basis: "city", zips: null,
    totalSales: 560,
    sfSales: 507, sfMedian: 345000, sfDom: 47,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 9, thMedian: 258990, thDom: 42,
    allMedian: 335455, allDom: 47,
  },
  {
    slug: "bartow", basis: "city", zips: null,
    totalSales: 479,
    sfSales: 438, sfMedian: 304870, sfDom: 42,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 304870, allDom: 43,
  },
  {
    slug: "belleair", basis: "city", zips: null,
    totalSales: 118,
    sfSales: 56, sfMedian: 1049998, sfDom: 23,
    condoSales: 54, condoMedian: 475000, condoDom: 94,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 725000, allDom: 39,
  },
  {
    slug: "bradenton", basis: "city", zips: null,
    totalSales: 4937,
    sfSales: 3012, sfMedian: 517750, sfDom: 39,
    condoSales: 1065, condoMedian: 225000, condoDom: 67,
    thSales: 242, thMedian: 297750, thDom: 47,
    allMedian: 410000, allDom: 47,
  },
  {
    slug: "bradenton-beach", basis: "city", zips: null,
    totalSales: 71,
    sfSales: 23, sfMedian: 1750000, sfDom: 75,
    condoSales: 33, condoMedian: 555000, condoDom: 57,
    thSales: 3, thMedian: 1100000, thDom: 37,
    allMedian: 904500, allDom: 59,
  },
  {
    slug: "brandon", basis: "city", zips: null,
    totalSales: 870,
    sfSales: 677, sfMedian: 390000, sfDom: 22,
    condoSales: 27, condoMedian: 142500, condoDom: 27,
    thSales: 123, thMedian: 239000, thDom: 42,
    allMedian: 370000, allDom: 26,
  },
  {
    slug: "brooksville", basis: "city", zips: null,
    totalSales: 1102,
    sfSales: 869, sfMedian: 330000, sfDom: 64,
    condoSales: 2, condoMedian: 190000, condoDom: 203,
    thSales: 2, thMedian: 176000, thDom: 8,
    allMedian: 323995, allDom: 58,
  },
  {
    slug: "carrollwood", basis: "zip", zips: ["33618", "33624", "33625"],
    totalSales: 1164,
    sfSales: 812, sfMedian: 492500, sfDom: 20,
    condoSales: 103, condoMedian: 205000, condoDom: 46,
    thSales: 182, thMedian: 320000, thDom: 44,
    allMedian: 440000, allDom: 27,
  },
  {
    slug: "clearwater", basis: "city", zips: null,
    totalSales: 2496,
    sfSales: 1245, sfMedian: 425000, sfDom: 27,
    condoSales: 822, condoMedian: 158000, condoDom: 60,
    thSales: 161, thMedian: 355000, thDom: 64,
    allMedian: 330000, allDom: 40,
  },
  {
    slug: "crystal-beach", basis: "city", zips: null,
    totalSales: 26,
    sfSales: 24, sfMedian: 501500, sfDom: 81,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 475000, allDom: 81,
  },
  {
    slug: "crystal-river", basis: "city", zips: null,
    totalSales: 316,
    sfSales: 159, sfMedian: 349900, sfDom: 68,
    condoSales: 26, condoMedian: 171875, condoDom: 93,
    thSales: 1, thMedian: 145000, thDom: 184,
    allMedian: 291000, allDom: 69,
  },
  {
    slug: "dade-city", basis: "city", zips: null,
    totalSales: 718,
    sfSales: 599, sfMedian: 363065, sfDom: 45,
    condoSales: 1, condoMedian: 150000, condoDom: 19,
    thSales: 17, thMedian: 230140, thDom: 27,
    allMedian: 352500, allDom: 48,
  },
  {
    slug: "davenport", basis: "city", zips: null,
    totalSales: 2727,
    sfSales: 2007, sfMedian: 379000, sfDom: 40,
    condoSales: 127, condoMedian: 190000, condoDom: 83,
    thSales: 547, thMedian: 295000, thDom: 39,
    allMedian: 357335, allDom: 43,
  },
  {
    slug: "dover", basis: "city", zips: null,
    totalSales: 117,
    sfSales: 101, sfMedian: 455000, sfDom: 33,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 430000, allDom: 34,
  },
  {
    slug: "dundee", basis: "city", zips: null,
    totalSales: 162,
    sfSales: 97, sfMedian: 299990, sfDom: 88,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 54, thMedian: 241500, thDom: 17,
    allMedian: 265980, allDom: 57,
  },
  {
    slug: "dunedin", basis: "city", zips: null,
    totalSales: 797,
    sfSales: 415, sfMedian: 549000, sfDom: 31,
    condoSales: 218, condoMedian: 181750, condoDom: 55,
    thSales: 73, thMedian: 485000, thDom: 42,
    allMedian: 425000, allDom: 40,
  },
  {
    slug: "east-lake", basis: "zip", zips: ["34685"],
    totalSales: 254,
    sfSales: 167, sfMedian: 630000, sfDom: 31,
    condoSales: 31, condoMedian: 200000, condoDom: 72,
    thSales: 9, thMedian: 365000, thDom: 60,
    allMedian: 475000, allDom: 40,
  },
  {
    slug: "ellenton", basis: "city", zips: null,
    totalSales: 91,
    sfSales: 86, sfMedian: 431000, sfDom: 69,
    condoSales: 1, condoMedian: 236500, condoDom: 21,
    thSales: 1, thMedian: 365000, thDom: 140,
    allMedian: 427500, allDom: 70,
  },
  {
    slug: "englewood", basis: "city", zips: null,
    totalSales: 1491,
    sfSales: 908, sfMedian: 395000, sfDom: 46,
    condoSales: 172, condoMedian: 217500, condoDom: 96,
    thSales: 1, thMedian: 595000, thDom: 105,
    allMedian: 359995, allDom: 59,
  },
  {
    slug: "fishhawk", basis: "zip", zips: ["33547"],
    totalSales: 509,
    sfSales: 422, sfMedian: 609000, sfDom: 27,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 45, thMedian: 282500, thDom: 63,
    allMedian: 565000, allDom: 30,
  },
  {
    slug: "floral-city", basis: "city", zips: null,
    totalSales: 59,
    sfSales: 42, sfMedian: 327500, sfDom: 42,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 277500, allDom: 62,
  },
  {
    slug: "fort-meade", basis: "city", zips: null,
    totalSales: 103,
    sfSales: 73, sfMedian: 265000, sfDom: 62,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 245000, allDom: 77,
  },
  {
    slug: "gibsonton", basis: "city", zips: null,
    totalSales: 156,
    sfSales: 128, sfMedian: 322675, sfDom: 43,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 20, thMedian: 230000, thDom: 43,
    allMedian: 310000, allDom: 44,
  },
  {
    slug: "gulfport", basis: "city", zips: null,
    totalSales: 309,
    sfSales: 198, sfMedian: 425000, sfDom: 53,
    condoSales: 77, condoMedian: 228000, condoDom: 55,
    thSales: 5, thMedian: 562500, thDom: 62,
    allMedian: 390000, allDom: 52,
  },
  {
    slug: "haines-city", basis: "city", zips: null,
    totalSales: 1453,
    sfSales: 1311, sfMedian: 315000, sfDom: 46,
    condoSales: 25, condoMedian: 95000, condoDom: 47,
    thSales: 76, thMedian: 259999, thDom: 65,
    allMedian: 310000, allDom: 47,
  },
  {
    slug: "hernando-beach", basis: "city", zips: null,
    totalSales: 136,
    sfSales: 101, sfMedian: 540000, sfDom: 76,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 500000, allDom: 83,
  },
  {
    slug: "holiday", basis: "city", zips: null,
    totalSales: 620,
    sfSales: 533, sfMedian: 235000, sfDom: 28,
    condoSales: 37, condoMedian: 125000, condoDom: 75,
    thSales: 5, thMedian: 260000, thDom: 51,
    allMedian: 230000, allDom: 34,
  },
  {
    slug: "holmes-beach", basis: "city", zips: null,
    totalSales: 232,
    sfSales: 135, sfMedian: 1525000, sfDom: 76,
    condoSales: 60, condoMedian: 635000, condoDom: 69,
    thSales: 4, thMedian: 700750, thDom: 29,
    allMedian: 1134500, allDom: 76,
  },
  {
    slug: "homosassa", basis: "city", zips: null,
    totalSales: 481,
    sfSales: 340, sfMedian: 342000, sfDom: 76,
    condoSales: 6, condoMedian: 189000, condoDom: 161,
    thSales: 1, thMedian: 310000, thDom: 118,
    allMedian: 335000, allDom: 67,
  },
  {
    slug: "hudson", basis: "city", zips: null,
    totalSales: 1087,
    sfSales: 842, sfMedian: 310000, sfDom: 47,
    condoSales: 65, condoMedian: 135000, condoDom: 88,
    thSales: 9, thMedian: 230000, thDom: 70,
    allMedian: 292000, allDom: 51,
  },
  {
    slug: "indian-rocks-beach", basis: "city", zips: null,
    totalSales: 164,
    sfSales: 67, sfMedian: 1130000, sfDom: 59,
    condoSales: 42, condoMedian: 628500, condoDom: 78,
    thSales: 28, thMedian: 670000, thDom: 55,
    allMedian: 795000, allDom: 63,
  },
  {
    slug: "indian-shores", basis: "city", zips: null,
    totalSales: 105,
    sfSales: 3, sfMedian: 5500000, sfDom: 35,
    condoSales: 80, condoMedian: 642500, condoDom: 72,
    thSales: 14, thMedian: 970000, thDom: 71,
    allMedian: 650000, allDom: 72,
  },
  {
    slug: "inverness", basis: "city", zips: null,
    totalSales: 490,
    sfSales: 318, sfMedian: 261490, sfDom: 56,
    condoSales: 8, condoMedian: 116000, condoDom: 78,
    thSales: 7, thMedian: 201500, thDom: 51,
    allMedian: 253600, allDom: 59,
  },
  {
    slug: "kenneth-city", basis: "city", zips: null,
    totalSales: 88,
    sfSales: 44, sfMedian: 383500, sfDom: 11,
    condoSales: 40, condoMedian: 89000, condoDom: 58,
    thSales: 4, thMedian: 335000, thDom: 70,
    allMedian: 292450, allDom: 34,
  },
  {
    slug: "lake-wales", basis: "city", zips: null,
    totalSales: 770,
    sfSales: 594, sfMedian: 280000, sfDom: 45,
    condoSales: 22, condoMedian: 116500, condoDom: 147,
    thSales: 18, thMedian: 242990, thDom: 214,
    allMedian: 270000, allDom: 53,
  },
  {
    slug: "lakeland", basis: "city", zips: null,
    totalSales: 2983,
    sfSales: 2545, sfMedian: 336000, sfDom: 33,
    condoSales: 91, condoMedian: 170000, condoDom: 54,
    thSales: 90, thMedian: 254900, thDom: 38,
    allMedian: 325000, allDom: 35,
  },
  {
    slug: "lakewood-ranch", basis: "city", zips: null,
    totalSales: 1412,
    sfSales: 1060, sfMedian: 673050, sfDom: 36,
    condoSales: 156, condoMedian: 314500, condoDom: 36,
    thSales: 71, thMedian: 310000, thDom: 72,
    allMedian: 579990, allDom: 40,
  },
  {
    slug: "land-o-lakes", basis: "city", zips: null,
    totalSales: 1562,
    sfSales: 1247, sfMedian: 435000, sfDom: 41,
    condoSales: 18, condoMedian: 215000, condoDom: 77,
    thSales: 189, thMedian: 304990, thDom: 48,
    allMedian: 406000, allDom: 42,
  },
  {
    slug: "largo", basis: "city", zips: null,
    totalSales: 1274,
    sfSales: 823, sfMedian: 410000, sfDom: 27,
    condoSales: 241, condoMedian: 175000, condoDom: 74,
    thSales: 80, thMedian: 330000, thDom: 43,
    allMedian: 368500, allDom: 36,
  },
  {
    slug: "lecanto", basis: "city", zips: null,
    totalSales: 93,
    sfSales: 62, sfMedian: 362500, sfDom: 42,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 3, thMedian: 227000, thDom: 116,
    allMedian: 350000, allDom: 40,
  },
  {
    slug: "lithia", basis: "city", zips: null,
    totalSales: 508,
    sfSales: 422, sfMedian: 609000, sfDom: 27,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 44, thMedian: 272250, thDom: 62,
    allMedian: 566500, allDom: 30,
  },
  {
    slug: "longboat-key", basis: "city", zips: null,
    totalSales: 529,
    sfSales: 126, sfMedian: 2280000, sfDom: 83,
    condoSales: 351, condoMedian: 890000, condoDom: 72,
    thSales: 5, thMedian: 735000, thDom: 52,
    allMedian: 1012500, allDom: 72,
  },
  {
    slug: "lutz", basis: "city", zips: null,
    totalSales: 842,
    sfSales: 663, sfMedian: 566750, sfDom: 24,
    condoSales: 43, condoMedian: 205000, condoDom: 75,
    thSales: 86, thMedian: 336028, thDom: 36,
    allMedian: 506000, allDom: 30,
  },
  {
    slug: "madeira-beach", basis: "city", zips: null,
    totalSales: 223,
    sfSales: 71, sfMedian: 700000, sfDom: 87,
    condoSales: 88, condoMedian: 657500, condoDom: 73,
    thSales: 5, thMedian: 362000, thDom: 123,
    allMedian: 600000, allDom: 70,
  },
  {
    slug: "mulberry", basis: "city", zips: null,
    totalSales: 253,
    sfSales: 205, sfMedian: 310000, sfDom: 31,
    condoSales: 18, condoMedian: 150500, condoDom: 64,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 303500, allDom: 35,
  },
  {
    slug: "new-port-richey", basis: "city", zips: null,
    totalSales: 2075,
    sfSales: 1457, sfMedian: 309450, sfDom: 32,
    condoSales: 274, condoMedian: 124900, condoDom: 78,
    thSales: 78, thMedian: 259750, thDom: 55,
    allMedian: 278000, allDom: 40,
  },
  {
    slug: "nokomis", basis: "city", zips: null,
    totalSales: 930,
    sfSales: 733, sfMedian: 533000, sfDom: 40,
    condoSales: 21, condoMedian: 315000, condoDom: 58,
    thSales: 61, thMedian: 297000, thDom: 98,
    allMedian: 480000, allDom: 45,
  },
  {
    slug: "north-port", basis: "city", zips: null,
    totalSales: 2842,
    sfSales: 1740, sfMedian: 320825, sfDom: 47,
    condoSales: 28, condoMedian: 187000, condoDom: 126,
    thSales: 14, thMedian: 200500, thDom: 61,
    allMedian: 315000, allDom: 60,
  },
  {
    slug: "odessa", basis: "city", zips: null,
    totalSales: 587,
    sfSales: 514, sfMedian: 730000, sfDom: 35,
    condoSales: 2, condoMedian: 195000, condoDom: 189,
    thSales: 40, thMedian: 342500, thDom: 56,
    allMedian: 699500, allDom: 37,
  },
  {
    slug: "oldsmar", basis: "city", zips: null,
    totalSales: 395,
    sfSales: 237, sfMedian: 535000, sfDom: 39,
    condoSales: 55, condoMedian: 169000, condoDom: 58,
    thSales: 55, thMedian: 305000, thDom: 70,
    allMedian: 389000, allDom: 51,
  },
  {
    slug: "osprey", basis: "city", zips: null,
    totalSales: 228,
    sfSales: 151, sfMedian: 730000, sfDom: 39,
    condoSales: 56, condoMedian: 360000, condoDom: 71,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 633000, allDom: 45,
  },
  {
    slug: "palm-harbor", basis: "city", zips: null,
    totalSales: 1404,
    sfSales: 824, sfMedian: 535500, sfDom: 26,
    condoSales: 238, condoMedian: 200000, condoDom: 63,
    thSales: 145, thMedian: 350990, thDom: 53,
    allMedian: 413700, allDom: 36,
  },
  {
    slug: "palmetto", basis: "city", zips: null,
    totalSales: 1063,
    sfSales: 907, sfMedian: 389990, sfDom: 46,
    condoSales: 49, condoMedian: 418500, condoDom: 94,
    thSales: 21, thMedian: 254900, thDom: 21,
    allMedian: 377943, allDom: 47,
  },
  {
    slug: "parrish", basis: "city", zips: null,
    totalSales: 2261,
    sfSales: 2027, sfMedian: 410000, sfDom: 55,
    condoSales: 1, condoMedian: 241500, condoDom: 0,
    thSales: 128, thMedian: 280000, thDom: 44,
    allMedian: 400000, allDom: 53,
  },
  {
    slug: "pinellas-park", basis: "city", zips: null,
    totalSales: 648,
    sfSales: 444, sfMedian: 339500, sfDom: 23,
    condoSales: 78, condoMedian: 180000, condoDom: 55,
    thSales: 70, thMedian: 360000, thDom: 42,
    allMedian: 325000, allDom: 34,
  },
  {
    slug: "plant-city", basis: "city", zips: null,
    totalSales: 992,
    sfSales: 809, sfMedian: 365000, sfDom: 32,
    condoSales: 15, condoMedian: 260000, condoDom: 54,
    thSales: 34, thMedian: 274900, thDom: 61,
    allMedian: 350000, allDom: 35,
  },
  {
    slug: "polk-city", basis: "city", zips: null,
    totalSales: 150,
    sfSales: 97, sfMedian: 335000, sfDom: 49,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 305500, allDom: 50,
  },
  {
    slug: "port-richey", basis: "city", zips: null,
    totalSales: 876,
    sfSales: 735, sfMedian: 245000, sfDom: 26,
    condoSales: 81, condoMedian: 125000, condoDom: 82,
    thSales: 3, thMedian: 215000, thDom: 93,
    allMedian: 238000, allDom: 32,
  },
  {
    slug: "redington-beach", basis: "city", zips: null,
    totalSales: 58,
    sfSales: 43, sfMedian: 815000, sfDom: 95,
    condoSales: 9, condoMedian: 1100000, condoDom: 95,
    thSales: 2, thMedian: 1162500, thDom: 110,
    allMedian: 817500, allDom: 95,
  },
  {
    slug: "redington-shores", basis: "city", zips: null,
    totalSales: 95,
    sfSales: 30, sfMedian: 677500, sfDom: 88,
    condoSales: 50, condoMedian: 720000, condoDom: 84,
    thSales: 4, thMedian: 787500, thDom: 100,
    allMedian: 688425, allDom: 88,
  },
  {
    slug: "riverview", basis: "city", zips: null,
    totalSales: 1727,
    sfSales: 1465, sfMedian: 392500, sfDom: 39,
    condoSales: 32, condoMedian: 164000, condoDom: 48,
    thSales: 194, thMedian: 235000, thDom: 41,
    allMedian: 375000, allDom: 40,
  },
  {
    slug: "ruskin", basis: "city", zips: null,
    totalSales: 625,
    sfSales: 509, sfMedian: 330000, sfDom: 47,
    condoSales: 10, condoMedian: 145000, condoDom: 45,
    thSales: 79, thMedian: 278490, thDom: 71,
    allMedian: 319990, allDom: 49,
  },
  {
    slug: "safety-harbor", basis: "city", zips: null,
    totalSales: 270,
    sfSales: 186, sfMedian: 640000, sfDom: 20,
    condoSales: 27, condoMedian: 263000, condoDom: 65,
    thSales: 17, thMedian: 415000, thDom: 69,
    allMedian: 560000, allDom: 37,
  },
  {
    slug: "san-antonio-fl", basis: "city", zips: null,
    totalSales: 353,
    sfSales: 225, sfMedian: 429990, sfDom: 50,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 44, thMedian: 276475, thDom: 57,
    allMedian: 356500, allDom: 50,
  },
  {
    slug: "sarasota", basis: "city", zips: null,
    totalSales: 6198,
    sfSales: 3638, sfMedian: 595000, sfDom: 39,
    condoSales: 1420, condoMedian: 350000, condoDom: 75,
    thSales: 342, thMedian: 337085, thDom: 72,
    allMedian: 493500, allDom: 51,
  },
  {
    slug: "seffner", basis: "city", zips: null,
    totalSales: 283,
    sfSales: 245, sfMedian: 369000, sfDom: 24,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 21, thMedian: 329510, thDom: 59,
    allMedian: 362650, allDom: 28,
  },
  {
    slug: "seminole", basis: "city", zips: null,
    totalSales: 1020,
    sfSales: 703, sfMedian: 485000, sfDom: 24,
    condoSales: 180, condoMedian: 150000, condoDom: 80,
    thSales: 78, thMedian: 500000, thDom: 99,
    allMedian: 425000, allDom: 37,
  },
  {
    slug: "siesta-key", basis: "zip", zips: ["34242"],
    totalSales: 539,
    sfSales: 184, sfMedian: 1690000, sfDom: 75,
    condoSales: 276, condoMedian: 712000, condoDom: 79,
    thSales: 9, thMedian: 795000, thDom: 93,
    allMedian: 965000, allDom: 78,
  },
  {
    slug: "south-pasadena", basis: "city", zips: null,
    totalSales: 142,
    sfSales: 18, sfMedian: 430000, sfDom: 37,
    condoSales: 120, condoMedian: 267500, condoDom: 60,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 292500, allDom: 59,
  },
  {
    slug: "spring-hill", basis: "city", zips: null,
    totalSales: 2426,
    sfSales: 2185, sfMedian: 318000, sfDom: 38,
    condoSales: 1, condoMedian: 228000, condoDom: 34,
    thSales: 10, thMedian: 205000, thDom: 50,
    allMedian: 311000, allDom: 37,
  },
  {
    slug: "st-pete-beach", basis: "city", zips: null,
    totalSales: 360,
    sfSales: 157, sfMedian: 840000, sfDom: 75,
    condoSales: 149, condoMedian: 413500, condoDom: 69,
    thSales: 9, thMedian: 695000, thDom: 63,
    allMedian: 605000, allDom: 71,
  },
  {
    slug: "st-petersburg", basis: "city", zips: null,
    totalSales: 6019,
    sfSales: 3666, sfMedian: 430000, sfDom: 32,
    condoSales: 1632, condoMedian: 380000, condoDom: 27,
    thSales: 293, thMedian: 590000, thDom: 55,
    allMedian: 432250, allDom: 33,
  },
  {
    slug: "sun-city-center", basis: "city", zips: null,
    totalSales: 845,
    sfSales: 449, sfMedian: 300000, sfDom: 49,
    condoSales: 341, condoMedian: 170000, condoDom: 54,
    thSales: 4, thMedian: 280000, thDom: 45,
    allMedian: 250000, allDom: 54,
  },
  {
    slug: "tampa", basis: "city", zips: null,
    totalSales: 8951,
    sfSales: 6080, sfMedian: 460000, sfDom: 27,
    condoSales: 1185, condoMedian: 260000, condoDom: 48,
    thSales: 1014, thMedian: 380995, thDom: 42,
    allMedian: 430000, allDom: 33,
  },
  {
    slug: "tarpon-springs", basis: "city", zips: null,
    totalSales: 692,
    sfSales: 481, sfMedian: 499000, sfDom: 46,
    condoSales: 108, condoMedian: 168000, condoDom: 73,
    thSales: 32, thMedian: 362500, thDom: 108,
    allMedian: 430000, allDom: 52,
  },
  {
    slug: "temple-terrace", basis: "city", zips: null,
    totalSales: 238,
    sfSales: 171, sfMedian: 427000, sfDom: 26,
    condoSales: 40, condoMedian: 150000, condoDom: 76,
    thSales: 17, thMedian: 249000, thDom: 33,
    allMedian: 387500, allDom: 41,
  },
  {
    slug: "thonotosassa", basis: "city", zips: null,
    totalSales: 126,
    sfSales: 103, sfMedian: 482770, sfDom: 35,
    condoSales: 3, condoMedian: 154000, condoDom: 71,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 479370, allDom: 42,
  },
  {
    slug: "tierra-verde", basis: "city", zips: null,
    totalSales: 94,
    sfSales: 36, sfMedian: 1332798, sfDom: 93,
    condoSales: 30, condoMedian: 787500, condoDom: 49,
    thSales: 25, thMedian: 582000, thDom: 77,
    allMedian: 925000, allDom: 58,
  },
  {
    slug: "town-n-country", basis: "zip", zips: ["33615", "33634", "33635"],
    totalSales: 824,
    sfSales: 616, sfMedian: 450000, sfDom: 27,
    condoSales: 70, condoMedian: 174500, condoDom: 75,
    thSales: 110, thMedian: 275000, thDom: 43,
    allMedian: 412000, allDom: 35,
  },
  {
    slug: "treasure-island", basis: "city", zips: null,
    totalSales: 243,
    sfSales: 97, sfMedian: 1000000, sfDom: 91,
    condoSales: 81, condoMedian: 339000, condoDom: 61,
    thSales: 17, thMedian: 660000, thDom: 119,
    allMedian: 725000, allDom: 79,
  },
  {
    slug: "trinity", basis: "city", zips: null,
    totalSales: 230,
    sfSales: 207, sfMedian: 510000, sfDom: 30,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 9, thMedian: 330000, thDom: 31,
    allMedian: 496250, allDom: 32,
  },
  {
    slug: "valrico", basis: "city", zips: null,
    totalSales: 783,
    sfSales: 733, sfMedian: 427000, sfDom: 28,
    condoSales: 3, condoMedian: 190000, condoDom: 21,
    thSales: 32, thMedian: 226500, thDom: 34,
    allMedian: 420000, allDom: 29,
  },
  {
    slug: "venice", basis: "city", zips: null,
    totalSales: 3015,
    sfSales: 1900, sfMedian: 475000, sfDom: 38,
    condoSales: 569, condoMedian: 259000, condoDom: 66,
    thSales: 47, thMedian: 275000, thDom: 89,
    allMedian: 393500, allDom: 47,
  },
  {
    slug: "weeki-wachee", basis: "city", zips: null,
    totalSales: 739,
    sfSales: 504, sfMedian: 370000, sfDom: 55,
    condoSales: 21, condoMedian: 136900, condoDom: 53,
    thSales: 0, thMedian: null, thDom: null,
    allMedian: 341545, allDom: 53,
  },
  {
    slug: "wesley-chapel", basis: "city", zips: null,
    totalSales: 1876,
    sfSales: 1428, sfMedian: 485210, sfDom: 37,
    condoSales: 10, condoMedian: 197500, condoDom: 170,
    thSales: 327, thMedian: 292990, thDom: 62,
    allMedian: 430000, allDom: 43,
  },
  {
    slug: "westchase", basis: "zip", zips: ["33626"],
    totalSales: 356,
    sfSales: 213, sfMedian: 700000, sfDom: 15,
    condoSales: 25, condoMedian: 215000, condoDom: 42,
    thSales: 101, thMedian: 460000, thDom: 29,
    allMedian: 550000, allDom: 24,
  },
  {
    slug: "wimauma", basis: "city", zips: null,
    totalSales: 620,
    sfSales: 540, sfMedian: 362130, sfDom: 42,
    condoSales: 0, condoMedian: null, condoDom: null,
    thSales: 15, thMedian: 244690, thDom: 0,
    allMedian: 353814, allDom: 47,
  },
  {
    slug: "winter-haven", basis: "city", zips: null,
    totalSales: 1800,
    sfSales: 1495, sfMedian: 296000, sfDom: 44,
    condoSales: 98, condoMedian: 119150, condoDom: 66,
    thSales: 41, thMedian: 234990, thDom: 50,
    allMedian: 289115, allDom: 46,
  },
  {
    slug: "zephyrhills", basis: "city", zips: null,
    totalSales: 1224,
    sfSales: 1055, sfMedian: 389990, sfDom: 48,
    condoSales: 23, condoMedian: 127000, condoDom: 104,
    thSales: 24, thMedian: 219245, thDom: 39,
    allMedian: 375000, allDom: 49,
  },
];

/**
 * Look up verified market stats for a city slug.
 * Returns undefined when we have no reliable figures, so callers can skip the
 * block rather than render placeholder zeros.
 */
export function getCityMarketStats(slug: string): CityMarketStats | undefined {
  return CITY_MARKET_STATS.find((s) => s.slug === slug);
}

/**
 * Small samples make a median meaningless. Callers use this to decide whether
 * to publish a per-property-type figure or omit it.
 */
export function hasReliableSample(n: number): boolean {
  return n >= MIN_SAMPLE;
}

/**
 * One-sentence provenance line for the page, so the basis is never hidden from
 * the reader. ZIP-matched rows say so explicitly.
 */
export function statsSourceNote(s: CityMarketStats, cityName: string): string {
  const scope =
    s.basis === "zip" && s.zips
      ? `closed sales in ZIP ${s.zips.join(", ")}`
      : `${cityName} closed sales`;
  return `${scope} over ${AS_OF}, from Stellar MLS. Rentals and manufactured housing excluded.`;
}
