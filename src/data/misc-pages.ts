/**
 * Miscellaneous page data — uncategorized pages from nowtb.com that
 * don't fit into city, neighborhood, guide, comparison, or regional categories.
 * These are handled either as static pages or via the [citySlug] catch-all.
 * Auto-generated 2026-05-12.
 */

export interface MiscPageData {
  /** URL slug */
  slug: string;
  /** Page title */
  title: string;
  /** SEO meta description */
  excerpt: string;
  /** How this page should be handled */
  handling: "static-page" | "catch-all" | "redirect";
  /** If handling is "redirect", where it goes */
  redirectTo?: string;
}

/** All misc/uncategorized pages from nowtb.com */
export const miscPages: MiscPageData[] = [
  // --- Pages that get their own /route ---
  { slug: "communities", title: "Tampa Bay Communities", excerpt: "Explore all Tampa Bay communities by county — Hillsborough, Pinellas, Pasco, Manatee, Polk, and Sarasota.", handling: "static-page" },
  { slug: "luxury", title: "Tampa Bay Luxury Real Estate", excerpt: "Browse luxury homes for sale across Tampa Bay. Waterfront estates, gated communities, and premium properties.", handling: "static-page" },
  { slug: "investing", title: "Real Estate Investing in Tampa Bay", excerpt: "Tampa Bay investment property opportunities — rental analysis, ROI projections, and expert investor guidance.", handling: "static-page" },
  { slug: "property-management", title: "Tampa Bay Property Management — ViVi PM", excerpt: "Professional property management for Tampa Bay rental owners. Tenant screening, maintenance, and accounting.", handling: "static-page" },
  { slug: "the-now-team", title: "The NOW Team at REMAX Collective", excerpt: "Meet The NOW Team — Barrett Henry and his real estate team at REMAX Collective serving Tampa Bay.", handling: "static-page" },
  { slug: "privacy-policy", title: "Privacy Policy", excerpt: "Privacy policy for nowtb.com — how we collect, use, and protect your information.", handling: "static-page" },
  { slug: "terms-of-use", title: "Terms of Use", excerpt: "Terms of use for nowtb.com — website usage terms and conditions.", handling: "static-page" },
  { slug: "accessibility", title: "Accessibility Statement", excerpt: "Accessibility statement for nowtb.com — our commitment to digital accessibility.", handling: "static-page" },
  { slug: "lenders", title: "Recommended Lenders", excerpt: "Barrett Henry's recommended mortgage lenders in Tampa Bay — trusted partners for home financing.", handling: "static-page" },
  { slug: "builders", title: "Tampa Bay Home Builders", excerpt: "Top home builders in Tampa Bay — DR Horton, Lennar, Pulte, Taylor Morrison, and more.", handling: "static-page" },
  { slug: "inspectors", title: "Recommended Home Inspectors", excerpt: "Barrett Henry's recommended home inspectors in Tampa Bay — trusted partners for thorough inspections.", handling: "static-page" },
  { slug: "commercial", title: "Commercial Real Estate — Tampa Bay", excerpt: "Commercial real estate opportunities in Tampa Bay — office, retail, industrial, and investment properties.", handling: "static-page" },
  { slug: "mortgage-calculator", title: "Mortgage Calculator", excerpt: "Free mortgage calculator — estimate your monthly payment, interest, taxes, and insurance for Tampa Bay homes.", handling: "static-page" },
  { slug: "free-home-valuation", title: "Free Home Valuation", excerpt: "Get a free home valuation from Barrett Henry. Find out what your Tampa Bay home is worth today.", handling: "static-page" },
  { slug: "home-valuation", title: "Home Valuation", excerpt: "Request a free home valuation for your Tampa Bay property from Barrett Henry at REMAX Collective.", handling: "static-page" },
  { slug: "relocation", title: "Tampa Bay Relocation Services", excerpt: "Relocating to Tampa Bay? Barrett Henry provides full relocation services for individuals, families, and military.", handling: "static-page" },
  { slug: "fair-housing", title: "Fair Housing Statement", excerpt: "Our commitment to fair housing — equal opportunity in housing for all.", handling: "static-page" },
  { slug: "dmca-notice", title: "DMCA Notice", excerpt: "DMCA copyright notice and takedown request process for nowtb.com.", handling: "static-page" },
  { slug: "card", title: "Barrett Henry — Digital Business Card", excerpt: "Barrett Henry's digital business card — REALTOR and Broker Associate at REMAX Collective.", handling: "static-page" },

  // --- Catch-all pages handled by [citySlug] route ---
  { slug: "credit-score-for-home-buying", title: "Credit Score for Home Buying", excerpt: "What credit score do you need to buy a home? Minimum scores for FHA, VA, conventional, and jumbo loans.", handling: "catch-all" },
  { slug: "down-payment-assistance", title: "Down Payment Assistance Programs", excerpt: "Down payment assistance programs for Florida home buyers — grants, loans, and eligibility requirements.", handling: "catch-all" },
  { slug: "down-payment-assistance-florida", title: "Down Payment Assistance in Florida", excerpt: "Florida down payment assistance programs — state and local grants, second mortgages, and how to qualify.", handling: "catch-all" },
  { slug: "florida-homestead-exemption", title: "Florida Homestead Exemption", excerpt: "How to file for homestead exemption in Florida — eligibility, savings, and deadlines.", handling: "catch-all" },
  { slug: "florida-housing-market-2026", title: "Florida Housing Market 2026", excerpt: "2026 Florida housing market forecast — prices, inventory, interest rates, and what to expect.", handling: "catch-all" },
  { slug: "hoa-cdd-fees-florida", title: "HOA and CDD Fees in Florida", excerpt: "Understanding HOA and CDD fees in Florida — what they cover, average costs, and how to compare.", handling: "catch-all" },
  { slug: "home-buying-contingencies", title: "Home Buying Contingencies Explained", excerpt: "Common home buying contingencies — inspection, financing, appraisal, and sale contingencies explained.", handling: "catch-all" },
  { slug: "home-buying-timeline", title: "Home Buying Timeline", excerpt: "Step-by-step home buying timeline from pre-approval to closing — how long each step takes.", handling: "catch-all" },
  { slug: "home-selling-timeline", title: "Home Selling Timeline", excerpt: "How long does it take to sell a home? Step-by-step selling timeline from listing to closing.", handling: "catch-all" },
  { slug: "homestead-exemption-florida", title: "Homestead Exemption Florida", excerpt: "Everything about Florida's homestead exemption — eligibility, filing, and property tax savings.", handling: "catch-all" },
  { slug: "macdill-afb-relocation", title: "MacDill AFB Relocation Guide", excerpt: "PCS to MacDill AFB? Complete relocation guide — housing, schools, BAH, and nearby neighborhoods.", handling: "catch-all" },
  { slug: "military-relocation-tampa", title: "Military Relocation to Tampa", excerpt: "Military relocation guide for Tampa Bay — MacDill AFB, neighborhoods, VA loans, and MRP agent.", handling: "catch-all" },
  { slug: "negotiating-home-sale-offers", title: "Negotiating Home Sale Offers", excerpt: "How to negotiate offers on your home — counter-offer strategies, contingencies, and closing terms.", handling: "catch-all" },
  { slug: "pre-foreclosure-short-sale-options", title: "Pre-Foreclosure and Short Sale Options", excerpt: "Options for homeowners facing foreclosure — short sales, loan modifications, and forbearance programs.", handling: "catch-all" },
  { slug: "probate-estate-sales", title: "Probate and Estate Sales", excerpt: "Guide to probate and estate sales in Florida — the process, timeline, and how to sell an inherited property.", handling: "catch-all" },
  { slug: "title-insurance-florida", title: "Title Insurance in Florida", excerpt: "How title insurance works in Florida — costs, coverage, and who pays at closing.", handling: "catch-all" },
  { slug: "understanding-hoa-documents-florida", title: "Understanding HOA Documents in Florida", excerpt: "How to read and understand HOA documents before buying a Florida home — declarations, bylaws, and financials.", handling: "catch-all" },
  { slug: "when-to-sell", title: "When Is the Best Time to Sell Your Home?", excerpt: "Best time to sell your home in Florida — seasonal trends, market conditions, and personal timing factors.", handling: "catch-all" },
  { slug: "first-time-buyers", title: "First-Time Buyers", excerpt: "Resources for first-time home buyers in Tampa Bay — programs, guides, and expert help.", handling: "catch-all" },

  // --- REMAX office pages ---
  { slug: "remax-brandon", title: "REMAX Brandon — Barrett Henry", excerpt: "Barrett Henry, Broker Associate at REMAX Collective serving Brandon, FL and surrounding areas.", handling: "catch-all" },
  { slug: "remax-largo", title: "REMAX Largo — Barrett Henry", excerpt: "Barrett Henry, Broker Associate at REMAX Collective serving Largo, FL and Pinellas County.", handling: "catch-all" },
  { slug: "remax-tampa", title: "REMAX Tampa — Barrett Henry", excerpt: "Barrett Henry, Broker Associate at REMAX Collective serving Tampa, FL and Hillsborough County.", handling: "catch-all" },

  // --- Loan city pages ---
  { slug: "fha-loans-tampa", title: "FHA Loans in Tampa", excerpt: "FHA loan guide for Tampa home buyers — eligibility, down payment, and loan limits.", handling: "catch-all" },
  { slug: "va-loans-tampa", title: "VA Loans in Tampa", excerpt: "VA loan guide for Tampa veterans and active duty — zero down, no PMI, and competitive rates.", handling: "catch-all" },

  // --- Neighborhood pages not in neighborhoods.ts (need to be added) ---
  { slug: "citrus-park-housing-market", title: "Citrus Park Housing Market", excerpt: "Citrus Park housing market data — prices, trends, and market analysis.", handling: "catch-all" },
  { slug: "fishhawk-housing-market", title: "FishHawk Housing Market", excerpt: "FishHawk Ranch housing market data — prices, trends, and market analysis.", handling: "catch-all" },
  { slug: "new-tampa-housing-market", title: "New Tampa Housing Market", excerpt: "New Tampa housing market data — prices, trends, and market analysis.", handling: "catch-all" },
  { slug: "polk-county-homes-for-sale", title: "Polk County Homes for Sale", excerpt: "Search homes for sale in Polk County, FL. Browse Lakeland, Winter Haven, and surrounding cities.", handling: "catch-all" },
  { slug: "st-pete-homes-for-sale", title: "St. Pete Homes for Sale", excerpt: "Search homes for sale in St. Petersburg, FL. Updated daily from Stellar MLS.", handling: "redirect", redirectTo: "/st-petersburg-homes-for-sale" },

  // --- Additional neighborhood slugs missing from neighborhoods.ts ---
  { slug: "boyette-homes-for-sale", title: "Boyette Homes for Sale", excerpt: "Browse homes for sale in Boyette, Riverview, FL.", handling: "catch-all" },
  { slug: "mango-homes-for-sale", title: "Mango Homes for Sale", excerpt: "Browse homes for sale in Mango, FL near Seffner and Brandon.", handling: "catch-all" },
  { slug: "new-tampa-homes-for-sale", title: "New Tampa Homes for Sale", excerpt: "Browse homes for sale in New Tampa, FL.", handling: "catch-all" },
  { slug: "new-tampa-realtor", title: "New Tampa REALTOR — Barrett Henry", excerpt: "Looking for a REALTOR in New Tampa? Barrett Henry at REMAX Collective.", handling: "catch-all" },
  { slug: "home", title: "Home", excerpt: "nowtb.com home page", handling: "redirect", redirectTo: "/" },
];

/** Look up a misc page by slug */
export function getMiscPageBySlug(slug: string): MiscPageData | undefined {
  return miscPages.find((p) => p.slug === slug);
}

/** Get all catch-all handled misc page slugs */
export function getCatchAllMiscSlugs(): string[] {
  return miscPages.filter((p) => p.handling === "catch-all").map((p) => p.slug);
}

/** Get all redirect misc pages */
export function getRedirectMiscPages(): MiscPageData[] {
  return miscPages.filter((p) => p.handling === "redirect");
}
