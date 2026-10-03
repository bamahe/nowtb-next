// =============================================================================
// RemaxOfficePage — Comprehensive REMAX office landing page
// Targets "REMAX Largo", "REMAX Tampa", "REMAX Brandon" keywords
// Deep REMAX brand content: history, global reach, referrals, commercial, etc.
// Each office gets unique city-specific content with the same structure.
// =============================================================================

import Link from "next/link";
import Image from "next/image";
import ContactForm from "@/components/ui/ContactForm";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { testimonials } from "@/data/testimonials";

interface OfficeData {
  city: string;
  county: string;
  address: string;
  zip: string;
  image: string;
  mapLink: string;
  /** Geo coordinates for LocalBusiness / RealEstateAgent schema */
  lat: number;
  lng: number;
  /** Page-specific metadata. Falls back to a generic template when absent. */
  metaTitle?: string;
  metaDescription?: string;
  /** Keyword-tuned H1. Falls back to "REMAX {city}" when absent. */
  h1?: string;
  /** Unique intro paragraph about this specific office location */
  intro: string;
  /** Why choose REMAX in THIS city specifically */
  whyThisOffice: string[];
  /** Neighborhoods / areas this office primarily serves */
  serviceAreas: string[];
  /** City-specific market context */
  marketContext: string;
  /** City-specific commercial note */
  commercialNote: string;
  /** City-specific referral angle */
  referralAngle: string;
  /** Links to the other two offices for cross-linking */
  otherOffices: { key: string; city: string }[];
  /** Optional deep, locally-researched editorial content. Rendered only when present. */
  deep?: DeepContent;
}

/**
 * DeepContent holds the genuinely-local, reader-useful material for an office page:
 * the rules, costs, and tradeoffs someone actually needs before they transact.
 * Every number in here must trace back to a named source in `sources`.
 */
interface DeepContent {
  /** AEO direct answer — leads the page, 2-4 sentences, answers the core query head-on */
  quickAnswer: string;
  /** "What you need to know before you buy or sell here" — the hard local stuff */
  realities: {
    heading: string;
    /** Each string is one paragraph */
    body: string[];
    /** Optional at-a-glance takeaway rendered as a callout */
    takeaway?: string;
  }[];
  /** Real, verified named neighborhoods — never invented */
  neighborhoods: { name: string; note: string }[];
  /** Comparison table — AI engines extract tabular data readily */
  comparison?: {
    heading: string;
    intro: string;
    headers: string[];
    rows: string[][];
    note?: string;
  };
  /** Local guides already published on this site, grouped for scanning */
  resources: { group: string; links: { href: string; label: string }[] }[];
  /** City-specific FAQs, appended to the shared REMAX set */
  localFaqs: { q: string; a: string }[];
  /** Citations backing every figure used above */
  sources: { label: string; href: string }[];
}

// ─── Office data with unique, city-specific content ───────────────────────────
const OFFICES: Record<string, OfficeData> = {
  tampa: {
    city: "Tampa",
    county: "Hillsborough",
    address: "14310 N. Dale Mabry Hwy, Ste 100, Tampa, FL 33618",
    zip: "33618",
    lat: 28.075781,
    lng: -82.508415,
    // layout.tsx appends " | Barrett Henry, REALTOR®" — do not repeat the name here.
    metaTitle: "REMAX Tampa — Hillsborough Realtor",
    metaDescription:
      "Barrett Henry, Broker Associate at REMAX Collective Tampa — 14310 N. Dale Mabry. Real Tampa MLS data, tax millage, flood zones. Call (813) 733-7907.",
    h1: "REMAX Realtor in Tampa, FL",
    image: "/images/office-tampa.jpg",
    mapLink: "https://www.google.com/maps/place/Barrett+Henry,+REALTOR%C2%AE+-+REMAX+Collective/@28.075781,-82.508415,17z",
    intro: "The REMAX Collective Tampa office on Dale Mabry Highway is Barrett Henry\u2019s home base \u2014 centrally located in North Tampa with easy access to Carrollwood, Westchase, Town \u2019N\u2019 Country, New Tampa, and downtown. This is where The NOW Team runs day-to-day operations for buyers, sellers, investors, and landlords across Hillsborough County and beyond.",
    whyThisOffice: [
      "Central North Tampa location on Dale Mabry \u2014 one of the most recognized corridors in Hillsborough County",
      "Direct access to Tampa\u2019s hottest markets: South Tampa, Seminole Heights, Westchase, Carrollwood, New Tampa, and the downtown core",
      "Hillsborough County is the economic engine of Tampa Bay \u2014 home to MacDill AFB, USF, Tampa General, and the region\u2019s largest employers",
      "Tampa\u2019s population has grown 12% since 2020, driving demand across every price point from starter homes to waterfront estates",
    ],
    serviceAreas: ["South Tampa", "Carrollwood", "Westchase", "New Tampa", "Town \u2019N\u2019 Country", "Seminole Heights", "Temple Terrace", "Lutz", "Land O\u2019 Lakes", "Downtown Tampa"],
    marketContext: "Tampa is the beating heart of the Tampa Bay metro \u2014 a city that consistently ranks among the fastest-growing in the country. From the high-rise condos of Channelside to the tree-lined streets of Palma Ceia, Tampa offers everything from first-time buyer townhomes to multi-million dollar waterfront estates. The Dale Mabry corridor puts this office within 20 minutes of virtually every Tampa neighborhood.",
    commercialNote: "Tampa\u2019s commercial real estate market includes the Westshore Business District (the largest office submarket between Miami and Atlanta), the emerging Water Street Tampa development, and industrial corridors along I-4 and I-75. Barrett handles REMAX Commercial transactions including retail, office, multifamily, and land deals throughout Hillsborough County.",
    referralAngle: "Tampa is one of the top relocation destinations in the U.S. \u2014 people move here from New York, Chicago, Philadelphia, and the entire Northeast corridor. REMAX\u2019s global referral network means Barrett receives and sends referrals for clients moving to and from Tampa every month.",
    otherOffices: [
      { key: "largo", city: "Largo" },
      { key: "brandon", city: "Brandon" },
    ],
    deep: {
      quickAnswer:
        "Barrett Henry is a licensed Florida Broker Associate at the REMAX Collective office at 14310 N. Dale Mabry Hwy in Tampa, serving the city and all of Hillsborough County. Tampa\u2019s market splits hard right now: single-family homes sold at a $460,000 median in 27 days over the past year while condos sold at $260,000 and took 48 days. Whether a parcel sits inside City of Tampa limits or in unincorporated Hillsborough also changes your tax bill by about 1.6 mills. Call (813) 733-7907 with an address for a straight read.",

      realities: [
        {
          heading: "What the Tampa market is actually doing right now",
          body: [
            "These are our own numbers, pulled from <strong>Stellar MLS closed sales inside the City of Tampa over the trailing twelve months</strong> &mdash; all 9,058 of them, with rental records and manufactured housing removed. Not a vendor estimate, not a three-month snapshot.",
            "<strong>Single-family homes: 6,114 sales, $460,000 median, 27 days on market.</strong> <strong>Condominiums: 1,187 sales, $260,000 median, 48 days.</strong> Townhomes landed between at $380,000 and 42 days across 1,023 sales. Villas were the quickest category at 22 days.",
            "Be careful with the headline numbers you see elsewhere, because the public portals disagree sharply on Tampa right now. One widely-cited figure put the Tampa median at $479,000 and up 10% year over year on a rolling three-month basis; another put it at $445,000 and <em>down</em> 3.3% for a single month; a third at $400,000 and up 2.6%. Those cannot all describe the same market, and the differences come from different boundaries, different windows, and different property mixes. We publish the MLS figures above and tell you exactly what window they cover.",
            "On competitiveness, Redfin scored Tampa <strong>46 out of 100</strong> &mdash; &ldquo;somewhat competitive&rdquo; &mdash; with the median sale closing at <strong>96.9% of list price</strong>, only <strong>14.3% of homes selling above list</strong>, and <strong>42% of listings carrying a price drop</strong>. That is a market where buyers can negotiate and where overpricing gets punished.",
          ],
          takeaway:
            "Tampa single-family runs about $460,000 and 27 days; condos about $260,000 and 48 days. Buyers have room, and the portals' conflicting headline medians are not worth anchoring to.",
        },
        {
          heading: "City of Tampa or unincorporated Hillsborough? It is worth about 1.6 mills",
          body: [
            "Hillsborough County has only three incorporated cities &mdash; Tampa, Temple Terrace, and Plant City. Everything else, including Brandon, Valrico, Riverview, FishHawk, and Lithia, is <strong>unincorporated county</strong>. Which side of that line a parcel sits on changes both your tax bill and who issues your permits.",
            "For tax year 2025, a <strong>City of Tampa parcel carried 19.8428 total mills</strong>: the city\u2019s own <strong>6.2076</strong>, school levies totaling <strong>6.3400</strong>, countywide <strong>5.5212</strong>, Library Services <strong>0.5583</strong>, HART transit <strong>0.5000</strong>, the Children\u2019s Board <strong>0.4589</strong>, SWFWMD <strong>0.1831</strong>, and the Port Authority <strong>0.0737</strong>.",
            "An <strong>unincorporated Hillsborough parcel carried 18.2515 mills</strong> &mdash; about <strong>8% less</strong>. It pays no municipal millage at all. Instead it pays a <strong>General Purpose County MSTU of 4.6163 mills</strong>, which funds the municipal-equivalent services, plus the same Library Services levy. Net of everything, the unincorporated municipal-equivalent bundle runs about one mill cheaper than Tampa\u2019s city rate.",
            "One wrinkle worth knowing because it is counterintuitive: <strong>Temple Terrace has the highest municipal rate in the county at 6.4550 mills, yet a lower all-in total than Tampa</strong> (19.5319), because Temple Terrace parcels pay no Library Services millage. Plant City pays neither Library nor HART transit, which is why its total of 18.2926 nearly matches unincorporated despite a 5.7157 city levy. Never infer a tax bill from the city rate alone.",
            "Note that every figure above is ad valorem millage only. Non-ad valorem assessments &mdash; things like solid waste, stormwater, and fire assessments &mdash; are billed separately and are not included in any millage number. Pull the actual parcel on the <a href=\"https://www.hcpafl.org/\" target=\"_blank\" rel=\"noopener noreferrer\">Hillsborough County Property Appraiser</a> site before you budget.",
          ],
          takeaway:
            "City of Tampa ran 19.8428 mills for tax year 2025 versus 18.2515 unincorporated. Confirm the jurisdiction, and never estimate a bill from the municipal rate alone.",
        },
        {
          heading: "Tampa is 36% water, and that drives everything about flood",
          body: [
            "This is the number that reframes Tampa for most buyers: the city covers roughly <strong>114.5 square miles of land and 63.6 square miles of water</strong>. More than a third of Tampa\u2019s area is water, between Tampa Bay, Hillsborough Bay, the Hillsborough River, and the bayous threading through South Tampa. Flood exposure is not an edge case here; it is a central feature of the market.",
            "On the insurance side, FEMA\u2019s Community Rating System gives NFIP premium discounts based on how well a community manages its floodplain &mdash; and the gap here just widened. The <strong>City of Tampa is rated Class 5, earning a 25% discount</strong>, while <strong>unincorporated Hillsborough County improved to Class 4, earning 30%, effective October 1, 2026.</strong> FEMA notified the county of the upgrade in July 2026, and the county estimates it saves unincorporated residents roughly $7.1 million a year. So being <em>outside</em> Tampa city limits is now worth five percentage points on your flood premium, on top of the lower millage.",
            "The exception is worth knowing: <strong>Temple Terrace is rated Class 8, earning only a 10% discount</strong>, and <strong>Plant City is Class 6 at 20%</strong>. Each municipality is its own NFIP community, so never apply the county\u2019s number to a city parcel or vice versa.",
            "For the detail on zone types, elevation certificates, and how to look up a specific address, see our <a href=\"/blog/waterfront-homes-tampa-guide/\">Tampa waterfront and flood zone guide</a> and the <a href=\"/blog/buyer-due-diligence-checklist-tampa-bay/\">Tampa Bay buyer due diligence checklist</a>. The practical move on any Tampa tour: ask for the current flood premium and declarations page, the elevation certificate if one exists, and the permit history, then get the policy quoted in your own name before your inspection period closes.",
          ],
          takeaway:
            "Over a third of Tampa is water. The city earns a 25% CRS flood discount; unincorporated Hillsborough improved to 30% on October 1, 2026, and Temple Terrace earns only 10% \u2014 check the community, not the county.",
        },
        {
          heading: "The 50% rule in Hillsborough has four different clocks",
          body: [
            "Every jurisdiction in Hillsborough County uses the same <strong>50% threshold</strong> for substantial improvement and substantial damage &mdash; if the cost of repairs or improvements to a flood-zone building reaches half the structure&rsquo;s market value, the whole building must be brought into floodplain compliance. What differs, and what costs people money, is <strong>how long the clock runs and when it starts.</strong>",
            "<strong>Unincorporated Hillsborough County</strong> uses a <strong>12-month cumulative look-back</strong>: repairs, alterations, and additions are added together, and the accumulation period begins when the permit for the first improvement is issued and runs through 12 months after the certificate of occupancy or final inspection, whichever gives the longer period. <strong>The City of Tampa</strong> also uses a one-year cumulative window, but it begins on the <em>later</em> of the final inspection on trade permits or the certificate of occupancy. <strong>Plant City</strong> runs a one-year window from the first permit issued after June 13, 2016. <strong>Temple Terrace has no cumulative window at all</strong> &mdash; it applies the plain single-project 50% test.",
            "So a contractor who tells you &ldquo;Hillsborough uses a 12-month look-back&rdquo; is right for a Brandon address and wrong for a Tampa one. Confirm the rule with whichever department issues your permit before you phase a renovation, because splitting a project across two permits does not reset the clock in three of the four jurisdictions.",
            "<strong>Tampa also carries a trigger the county does not,</strong> and it matters in South Tampa: a structure counts as substantially damaged if it sustains <strong>flood-related damage on two separate occasions within ten years where the repair cost each time averaged 25% or more of market value.</strong> That is the NFIP repetitive-loss test. Two moderate flood claims can push a Tampa house into mandatory-elevation territory without either single event approaching 50%.",
            "On valuation, both the county and the city define market value as the <strong>structure only, excluding land</strong>, established either by a qualified independent appraiser&rsquo;s actual cash value or by <strong>120% of the Property Appraiser&rsquo;s assessed structure value</strong>. The Hillsborough County Property Appraiser publishes a <a href=\"https://www.hcpafl.org/Home/FEMA-50-Rule\" target=\"_blank\" rel=\"noopener noreferrer\">FEMA 50% Rule lookup and calculator</a> &mdash; enter a folio or address and get the threshold for that parcel. Use it before you budget a flood-zone remodel. Hillsborough&rsquo;s pre-FIRM cutoff is <strong>June 18, 1980</strong>; homes predating it are where this bites hardest.",
          ],
          takeaway:
            "The threshold is 50% everywhere in Hillsborough, but the look-back clock differs in all four jurisdictions \u2014 and Tampa adds a two-floods-in-ten-years trigger. Run the parcel through the Property Appraiser's 50% calculator first.",
        },
        {
          heading: "Sinkholes: the coverage you have is probably not the coverage you think",
          body: [
            "Florida splits sinkhole protection into two completely different coverages, and the gap between them is where owners get hurt.",
            "<strong>Catastrophic ground cover collapse is mandatory.</strong> Under Statute 627.706(1)(a) every insurer writing property insurance in Florida must provide it. But it pays only when <strong>all four</strong> of these are true: an abrupt collapse of the ground cover, a depression clearly visible to the naked eye, structural damage to the building including the foundation, and <strong>the structure being condemned and ordered vacated</strong> by the authorized government agency. The statute states explicitly that damage consisting merely of settling or cracking <em>does not</em> qualify.",
            "<strong>Sinkhole loss coverage is optional</strong> and costs extra. Under 627.706(1)(b) the insurer must make it available for an additional premium and may require an inspection first. It is far broader &mdash; structural damage caused by sinkhole activity, with no condemned-and-vacated requirement. Residential sinkhole deductibles run <strong>1%, 2%, 5%, or 10% of your dwelling limit</strong>; on a $500,000 dwelling limit a 10% sinkhole deductible is $50,000.",
            "Put plainly: without the optional endorsement, a cracked slab and a sinking foundation are your problem. Florida requires insurers to spell this out in <strong>bold type no smaller than 14 points</strong> when sinkhole coverage is excluded &mdash; read that page of the policy.",
            "Two things to do in Hillsborough. First, <strong>search the address</strong>: the Property Appraiser runs a public <a href=\"https://gis.hcpafl.org/SubsidenceSearch/\" target=\"_blank\" rel=\"noopener noreferrer\">Subsidence Search</a> by folio, owner, address, or subdivision, flagging parcels as unremediated, remediated, or inconclusive. It is limited data and the office disclaims its accuracy, so treat it as a starting point, not a clearance. Second, know that <strong>a seller must disclose a paid sinkhole claim before closing</strong> under Statute 627.7073(2)(c), including whether the full proceeds were actually used to repair the damage &mdash; and the insurer&rsquo;s report and payment amount get recorded with the clerk of court, so a paid claim is discoverable in the public record.",
            "One more deadline: a sinkhole claim is barred unless notice was given <strong>within two years</strong> after the policyholder knew or reasonably should have known about the loss, per 627.706(5).",
          ],
          takeaway:
            "Mandatory coverage pays only if your home is condemned and you are ordered out. Optional sinkhole coverage is what covers cracking and settling \u2014 and a seller must disclose any paid sinkhole claim before closing.",
        },
        {
          heading: "South Tampa's luxury tier is split: under $1.1M moves, above it sits",
          body: [
            "This is the most useful thing in our Tampa sales data and you will not find it on a portal. In the 33629 and 33606 luxury corridor, <strong>time on market does not rise smoothly with price &mdash; it breaks at roughly $1.1 million.</strong>",
            "Below that line, high-end South Tampa is genuinely liquid. <strong>Southland</strong> sold at a $1,100,000 median in <strong>9 days</strong>. <strong>Virginia Park</strong> went at $962,450 in <strong>15 days</strong>. <strong>Palma Ceia Park</strong> &mdash; 26 sales, the busiest luxury pocket in the city &mdash; cleared a $1,000,000 median in <strong>17 days</strong>.",
            "Above it, the same neighborhoods stall. <strong>Sunset Park</strong> took <strong>116 days</strong> at a $1,150,000 median. <strong>Davis Islands</strong> took <strong>122 days</strong> at $1,340,000. <strong>Beach Park</strong> took <strong>157 days</strong> at $1,519,000 &mdash; more than five months.",
            "If you are selling in that upper band, plan for a materially longer marketing period and price accordingly from day one; the data says chasing the market down from an aspirational number costs you a season. If you are buying above $1.1 million in South Tampa, you have far more negotiating leverage than the neighborhood\u2019s reputation suggests.",
          ],
          takeaway:
            "South Tampa under about $1.1M sells in two to three weeks; above it, expect four to five months. That break point should set both your pricing and your negotiating posture.",
        },
        {
          heading: "Tampa condos: cheaper, slower, and carrying new structural obligations",
          body: [
            "Tampa condos sold at a <strong>$260,000 median in 48 days</strong> over the trailing twelve months, against <strong>$460,000 and 27 days</strong> for single-family. So condos trade at roughly <strong>57% of a house</strong> and take nearly twice as long to sell. Independently, the Zillow Home Value Index for Tampa condos fell <strong>7.5%</strong> over the year ending August 2026 while the single-family index was essentially flat at <strong>&minus;0.35%</strong>.",
            "The cause is largely Florida\u2019s post-Surfside structural safety law, and it applies statewide. Condo and co-op buildings <strong>three habitable stories or more</strong> must complete a <strong>milestone inspection</strong> under Statute 553.899 by December 31 of the year the building turns 30, then every 10 years, with local authorities able to require it at 25 years. Separately, Statute 718.112(2)(g) requires a <strong>Structural Integrity Reserve Study</strong> at least every 10 years, and associations that must have one <strong>can no longer vote to waive or underfund reserves</strong> for the covered structural components. Buildings that deferred maintenance are now legally required to price it and fund it.",
            "Downtown Tampa shows the carrying-cost side clearly. In our sales data, <strong>Grand Central at Kennedy</strong> condos moved at a $367,500 median but took <strong>110 days</strong>, with median HOA dues near <strong>$960 a month</strong>. <strong>The Quarter at Ybor</strong> ran $171,156 with dues near $799. Those dues are not incidental &mdash; at $960 a month you are carrying roughly $11,500 a year before taxes or insurance.",
            "None of that makes Tampa condos a bad buy. It makes the documents decisive. Before you waive due diligence, get the <strong>completed milestone inspection</strong>, the <strong>SIRS</strong>, current <strong>reserve balances</strong>, the last <strong>12 months of board minutes</strong>, and any <strong>special assessment</strong> voted or under discussion. A well-funded building at a higher price is usually the better deal than a cheap one whose assessment has not landed yet.",
          ],
          takeaway:
            "Tampa condos run about 57% of a house and take nearly twice as long to sell. The milestone report, SIRS, and reserve balances decide whether a given building is a bargain or a trap.",
        },
      ],

      // All figures from Stellar MLS closed sales in the City of Tampa, trailing
      // 12 months, leases and manufactured housing excluded. New-construction
      // tracts with builder-closing artifacts (0-day DOM) are deliberately omitted.
      neighborhoods: [
        { name: "Palma Ceia Park", note: "South Tampa (33629) and the busiest luxury pocket in the city \u2014 26 sales at a $1,000,000 median in just 17 days. Mid-1940s homes averaging about 2,470 sq ft, typically 4 bedrooms, with roughly a third carrying a private pool and no HOA on recent sales." },
        { name: "Southland", note: "South Tampa (33629). The fastest high-end sales in Tampa: a $1,100,000 median in 9 days. Early-1970s homes near 2,830 sq ft, usually 4 bedrooms, and about 57% come with a pool." },
        { name: "Virginia Park", note: "South Tampa (33629). A $962,450 median in 15 days across 8 sales. Early-1950s homes around 2,275 sq ft, often 4 bedrooms, a quarter with pools and no HOA on recent sales." },
        { name: "Sunset Park", note: "South Tampa (33629). A $1,150,000 median across 25 sales \u2014 but 116 days on market. Late-1990s median build at roughly 3,460 sq ft, nearly half with pools and about 12% waterfront. Prestigious and patient; price it for a long runway." },
        { name: "Davis Islands", note: "Tampa (33606). A $1,340,000 median across 25 sales with a 122-day median time to contract. Mid-1970s median build near 2,890 sq ft, roughly 36% of sales waterfront. Scarce, iconic, and slow-moving at current pricing." },
        { name: "Beach Park", note: "Tampa (33609). The priciest pocket in our data at a $1,519,000 median \u2014 and the slowest at 157 days. Late-1980s median build around 3,190 sq ft, about 77% with pools and 31% waterfront. Expect a five-month marketing window." },
        { name: "Westchase", note: "Northwest Tampa (33626). A $765,000 median in 20 days. Mid-1990s homes near 2,580 sq ft, 4 bedrooms, with HOA dues around $421 \u2014 and an unusually high 83% of sales including a private pool." },
        { name: "Idlewild on the Hillsborough", note: "Seminole Heights area (33604). A $427,000 median in 8 days across 10 sales \u2014 one of the fastest in Tampa. Homes dating to the 1920s around 1,170 sq ft, no HOA on recent sales, a few waterfront on the river." },
        { name: "Hampton Terrace", note: "Seminole Heights area (33604). A $455,750 median in 12 days. Early-1940s bungalow-era homes near 1,345 sq ft, often 4 bedrooms, no HOA on recent sales." },
        { name: "El Portal", note: "North Tampa (33604). A $365,000 median in 10 days across 11 sales. Mid-1950s homes around 1,490 sq ft, 3 bedrooms, no HOA on recent sales \u2014 solid entry-to-mid pricing that moves quickly." },
        { name: "Golfland of Tampa's North Side", note: "North Tampa (33612). A $380,000 median in 10 days across 14 sales. Mid-1950s homes near 1,385 sq ft, 3 bedrooms, no HOA on recent sales." },
        { name: "Grant Park", note: "East Tampa (33619). A $325,000 median in 9 days across 13 sales. Notably newer stock for the price \u2014 median year built 2004, about 1,570 sq ft, 3 bedrooms, no HOA on recent sales." },
        { name: "Port Tampa City", note: "South Tampa (33616). A $515,000 median across 25 sales, though at 57 days it moves slower than the rest of South Tampa. Median build 2005 at roughly 1,520 sq ft \u2014 the newer construction near MacDill." },
        { name: "Grand Central at Kennedy", note: "Downtown Tampa (33602). Condos at a $367,500 median, but 110 days to contract and median HOA dues near $960 a month. Mid-2000s construction around 1,050 sq ft. Verify the reserve study and any pending assessment before committing to that carrying cost." },
      ],

      comparison: {
        heading: "Hillsborough County Property Taxes by Jurisdiction",
        intro:
          "Hillsborough has only three incorporated cities; everything else is unincorporated county. The all-in millage below is for tax year 2025 (FY 2025–26 as adopted). Note that the highest city rate does not produce the highest total bill — which levies apply matters as much as the municipal rate.",
        headers: ["Jurisdiction", "Municipal millage", "All-in total millage", "Notes"],
        rows: [
          ["City of Tampa", "6.2076", "19.8428", "Highest total in the county"],
          ["City of Temple Terrace", "6.4550", "19.5319", "Highest city rate, but pays no Library levy"],
          ["City of Plant City", "5.7157", "18.2926", "Pays neither Library nor HART transit"],
          ["Unincorporated Hillsborough", "none", "18.2515", "Brandon, Valrico, Riverview, FishHawk, Lithia"],
        ],
        note:
          "Ad valorem millage only. Unincorporated parcels pay no municipal millage but do pay a General Purpose County MSTU of 4.6163 mills plus Library Services of 0.5583. Non-ad valorem assessments (solid waste, stormwater, fire) are billed separately and are not included in any figure here. Sources: Hillsborough County Property Appraiser Final 2025 millage; Florida Department of Revenue, Property Tax Oversight, Table 1 (Hillsborough County), FY 2025–26 as adopted.",
      },

      resources: [
        {
          group: "Buying in Tampa",
          links: [
            { href: "/blog/buyer-due-diligence-checklist-tampa-bay/", label: "Tampa Bay buyer due diligence checklist" },
            { href: "/tampa-homes-for-sale/", label: "Tampa homes for sale" },
            { href: "/blog/waterfront-homes-tampa-guide/", label: "Tampa waterfront homes & flood zones" },
            { href: "/blog/new-construction-tampa-guide/", label: "Tampa new construction & builders" },
            { href: "/blog/luxury-homes-tampa-guide/", label: "Tampa luxury homes: what your money gets" },
            { href: "/blog/military-relocation-tampa-macdill-guide/", label: "MacDill AFB & military relocation" },
          ],
        },
        {
          group: "Selling & Market Data",
          links: [
            { href: "/tampa-home-valuation/", label: "What is my Tampa home worth?" },
            { href: "/tampa-housing-market/", label: "Tampa housing market data" },
            { href: "/blog/florida-property-tax-portability-guide/", label: "Florida property tax portability" },
            { href: "/blog/homestead-exemption-florida-guide/", label: "Florida homestead exemption guide" },
            { href: "/tampa-realtor/", label: "Choosing a Tampa REALTOR®" },
            { href: "/blog/brandon-fl-vs-tampa/", label: "Brandon vs Tampa: honest comparison" },
          ],
        },
        {
          group: "Tampa & Hillsborough Research",
          links: [
            { href: "/blog/ultimate-tampa-bay-relocation-guide/", label: "The ultimate Tampa Bay relocation guide" },
            { href: "/blog/moving-to-tampa-bay-cost-of-living-guide/", label: "Tampa Bay cost of living" },
            { href: "/blog/va-home-loans-tampa-bay-guide-2026/", label: "VA home loans in Tampa Bay" },
            { href: "/blog/fha-loans-tampa-bay-requirements-guide/", label: "FHA loans: requirements & limits" },
            { href: "/hillsborough-county/", label: "All Hillsborough County communities" },
            { href: "/blog/tampa-bay-beaches-relocation-guide/", label: "Tampa Bay beaches for new residents" },
          ],
        },
      ],

      localFaqs: [
        {
          q: "What is the median home price in Tampa, FL?",
          a: "Based on Stellar MLS closed sales inside the City of Tampa over the trailing twelve months, excluding rentals and manufactured housing, <strong>single-family homes sold at a $460,000 median in 27 days</strong> and <strong>condominiums at a $260,000 median in 48 days</strong>. Townhomes came in at $380,000 and 42 days. Be aware that public portals currently report Tampa medians ranging from $400,000 to $479,000 depending on the boundary, time window, and property mix each one uses — always check which window a figure covers.",
        },
        {
          q: "Is it cheaper to live in the City of Tampa or unincorporated Hillsborough County?",
          a: "Unincorporated is cheaper on property tax. For tax year 2025, a City of Tampa parcel carried <strong>19.8428 total mills</strong> versus <strong>18.2515 mills</strong> for an unincorporated Hillsborough parcel — about 8% less. Unincorporated parcels pay no municipal millage, but they do pay a General Purpose County MSTU of 4.6163 mills plus Library Services of 0.5583. Flood insurance is a wash: both the City of Tampa and unincorporated Hillsborough are FEMA CRS Class 5, earning a 25% NFIP discount. Non-ad valorem assessments are billed separately in both cases.",
        },
        {
          q: "Which Tampa neighborhoods sell the fastest?",
          a: "In our MLS data for the trailing twelve months, the quickest were <strong>Idlewild on the Hillsborough</strong> (8 days, $427,000 median), <strong>Grant Park</strong> (9 days, $325,000), <strong>Southland</strong> (9 days, $1,100,000), <strong>El Portal</strong> and <strong>Golfland of Tampa's North Side</strong> (both 10 days, $365,000 and $380,000), and <strong>Hampton Terrace</strong> (12 days, $455,750). On the luxury side, Palma Ceia Park cleared a $1,000,000 median in 17 days. By contrast Beach Park took 157 days, Davis Islands 122, and Sunset Park 116.",
        },
        {
          q: "Why do expensive South Tampa homes take so long to sell?",
          a: "Time on market in South Tampa does not rise smoothly with price — it breaks at roughly $1.1 million. Below that line the market is liquid: Southland sold at a $1,100,000 median in 9 days, Virginia Park at $962,450 in 15 days, Palma Ceia Park at $1,000,000 in 17 days. Above it, the same area stalls: Sunset Park 116 days at $1,150,000, Davis Islands 122 days at $1,340,000, Beach Park 157 days at $1,519,000. If you are selling above that threshold, plan for a four-to-five-month marketing window and price correctly at launch. If you are buying there, you have more leverage than the neighborhoods' reputations suggest.",
        },
        {
          q: "What flood insurance discount does Tampa get?",
          a: "They now differ, and the change is very recent. The <strong>City of Tampa is rated Class 5 under FEMA's Community Rating System, earning a 25% NFIP flood insurance discount</strong>. <strong>Unincorporated Hillsborough County improved from Class 5 to Class 4 effective October 1, 2026, which earns a 30% discount</strong> — FEMA notified the county in July 2026, and the county estimates about $7.1 million in annual savings for unincorporated residents. Within the same county, Plant City is Class 6 at 20% and Temple Terrace is Class 8 at only 10%. Because every community is rated separately, the discount follows the property's community rather than the county. Flood matters more in Tampa than most buyers expect: roughly 63.6 of the city's 178 square miles are water.",
        },
      ],

      sources: [
        { label: "Stellar MLS closed sales, City of Tampa, trailing 12 months (accessed via Bridge Interactive)", href: "https://www.stellarmls.com/" },
        { label: "Hillsborough County Property Appraiser — Final 2025 millage rates", href: "https://www.hcpafl.org/" },
        { label: "Florida Department of Revenue — Property Tax Oversight, Table 1 (Hillsborough County)", href: "https://floridarevenue.com/property/Pages/DataPortal.aspx" },
        { label: "FEMA — Community Rating System eligible communities list (effective April 1, 2026)", href: "https://www.fema.gov/floodplain-management/community-rating-system" },
        { label: "Hillsborough County — Community Rating System Class 4 upgrade effective October 1, 2026", href: "https://hcfl.gov/residents/public-safety/flooding/community-rating-system" },
        { label: "U.S. Census Bureau — Tampa, Florida land and water area", href: "https://data.census.gov/profile/Tampa_city,_Florida" },
        { label: "Redfin — Tampa, FL housing market", href: "https://www.redfin.com/city/18142/FL/Tampa/housing-market" },
        { label: "Zillow Research — Zillow Home Value Index data", href: "https://www.zillow.com/research/data/" },
        { label: "Florida Statute 553.899 — Milestone inspections", href: "https://www.flsenate.gov/Laws/Statutes/2026/553.899" },
        { label: "Florida Statute 718.112 — Structural Integrity Reserve Study requirements", href: "https://www.flsenate.gov/Laws/Statutes/2026/718.112" },
        { label: "Hillsborough County — Special Flood Hazard Area requirements and substantial damage/improvement guidelines", href: "https://hcfl.gov/businesses/hillsgovhub/miscellaneous-checklists-and-submittal-requirements/special-flood-hazard-area-requirements" },
        { label: "City of Tampa — flood information and Code § 5-121, Flood-Resistant Development", href: "https://www.tampa.gov/construction-services/flood-information" },
        { label: "Hillsborough County Property Appraiser — FEMA 50% Rule calculator", href: "https://www.hcpafl.org/Home/FEMA-50-Rule" },
        { label: "Hillsborough County Property Appraiser — Subsidence Search", href: "https://gis.hcpafl.org/SubsidenceSearch/" },
        { label: "Florida Statute 627.706 — sinkhole and catastrophic ground cover collapse coverage", href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.706.html" },
        { label: "Florida Statute 627.7073 — sinkhole reports and seller disclosure", href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.7073.html" },
      ],
    },
  },
  largo: {
    city: "Largo",
    county: "Pinellas",
    address: "11200 Seminole Blvd, Ste 202, Largo, FL 33778",
    zip: "33778",
    lat: 27.9114595,
    lng: -82.7877318,
    // NOTE: layout.tsx appends " | Barrett Henry, REALTOR®" via the title template,
    // so do NOT repeat his name here or the tag renders it twice and overruns 60 chars.
    metaTitle: "REMAX Largo FL — Pinellas Realtor",
    h1: "REMAX Realtor in Largo, FL",
    metaDescription:
      "Barrett Henry, Broker Associate at REMAX Collective Largo — 11200 Seminole Blvd. Largo and Pinellas flood zones, taxes, condo rules. Call (813) 733-7907.",
    image: "/images/office-largo.jpg",
    mapLink: "https://www.google.com/maps/search/?api=1&query=11200+Seminole+Blvd+Ste+202+Largo+FL+33778",
    intro: "The REMAX Collective Largo office sits in the Largo Professional Center on Seminole Boulevard \u2014 Pinellas County\u2019s geographic center and the third-largest city in the county. From here, Barrett Henry and The NOW Team serve the beaches, barrier islands, and mainland communities of the Pinellas peninsula. If you\u2019re buying or selling anywhere from Clearwater Beach to St. Pete, this is your REMAX office.",
    whyThisOffice: [
      "Pinellas County is the most densely populated county in Florida \u2014 every transaction here requires local expertise that out-of-area agents simply don\u2019t have",
      "Located mid-county on Seminole Blvd with fast access to Clearwater, Indian Rocks Beach, Seminole, Belleair, and St. Petersburg",
      "Beach and waterfront properties require specialized knowledge of flood zones, insurance, and coastal regulations \u2014 Barrett handles these daily",
      "Pinellas is land-constrained on three sides, so new supply is limited — but the current market still favors prepared buyers, and pricing a listing correctly matters more here than almost anywhere in Tampa Bay",
    ],
    serviceAreas: ["Clearwater", "Clearwater Beach", "Indian Rocks Beach", "Belleair", "Seminole", "St. Petersburg", "Treasure Island", "Madeira Beach", "Redington Beach", "Dunedin", "Safety Harbor", "Palm Harbor"],
    marketContext: "Pinellas County is unlike any other market in Tampa Bay. Bounded by water on three sides, land is finite, so the long-term supply picture stays tight even when prices soften in the short term. The mix of gulf-front condos, historic bungalows in St. Pete\u2019s arts district, and family homes in Seminole and Largo creates one of the most diverse real estate markets in Florida. Right now that market is split: single-family values have held roughly flat while older condos have repriced sharply as Florida\u2019s new structural reserve requirements take hold. Knowing which side of that divide a property sits on is most of the job.",
    commercialNote: "Pinellas County\u2019s commercial landscape includes Gulf Boulevard hospitality properties, US-19 retail corridors, downtown St. Pete office space, and the growing Clearwater industrial market. Through REMAX Commercial, Barrett assists investors and business owners with acquisitions, dispositions, and 1031 exchanges across the peninsula.",
    referralAngle: "Pinellas County attracts international buyers \u2014 particularly from Canada, the UK, and Germany \u2014 drawn to the beaches and the lifestyle. REMAX\u2019s presence in 120+ countries means Barrett connects directly with referring agents worldwide, making cross-border transactions seamless for buyers relocating to the Pinellas coast.",
    otherOffices: [
      { key: "tampa", city: "Tampa" },
      { key: "brandon", city: "Brandon" },
    ],
    // ─── Deep, locally-researched content. Every figure traces to `sources`. ───
    deep: {
      quickAnswer:
        "Barrett Henry is a licensed Florida Broker Associate at the REMAX Collective office at 11200 Seminole Blvd in Largo, serving Largo and all of Pinellas County. In this market three things decide most deals: whether your address sits in the City of Largo or unincorporated Pinellas, how much you can legally spend repairing a flood-zone home before the county forces you to elevate it, and whether a condo building has funded its structural reserves. Call (813) 733-7907 with an address and you will get a straight read on where each of those stands and who has to sign off on it.",

      realities: [
        {
          heading: "What the Largo market is actually doing right now",
          body: [
            "Largo is a buyer-friendlier market than most of Pinellas County. Over the three months ending <strong>August 2026</strong>, the median Largo home sold for <strong>$349,669, down 3.9% year over year</strong>, while the Pinellas County median was <strong>$411,124, up 5.4%</strong>. That puts Largo roughly <strong>15% below the county median</strong> — one of the better value propositions on the peninsula.",
            "Homes also move faster here. Largo&rsquo;s median days on market was <strong>50 days</strong> versus <strong>75 days</strong> countywide. But sellers are negotiating: the median sale came in at <strong>96.2% of list price</strong>, only <strong>12.9% of homes sold above list</strong>, and <strong>42.9% of homes on the market carried a price drop</strong>. Redfin scores Largo <strong>45 out of 100</strong> on competitiveness — &ldquo;somewhat competitive,&rdquo; not a frenzy.",
            "Read that together and the strategy is obvious. Buyers have real negotiating room and should not be bullied into waiving inspections. Sellers who price to the current comps typically sell in roughly seven weeks; sellers who price to 2022 end up among the 43% carrying a price cut anyway, just later and from a weaker position.",
          ],
          takeaway:
            "Largo is priced about 15% under the county and sells 25 days faster. Buyers have leverage, and sellers who price right the first time do measurably better than those who chase the market down.",
        },
        {
          heading: "Are you in the City of Largo or unincorporated Pinellas? It changes the rules",
          body: [
            "This is the single most misunderstood thing about buying in Largo, and it costs people real money. A <strong>&ldquo;Largo, FL&rdquo; mailing address does not mean the property is inside Largo city limits.</strong> The Largo ZIPs — <strong>33770, 33771, 33773, 33774, and 33778</strong> — cover both incorporated City of Largo parcels and large pockets of unincorporated Pinellas County. They also cross municipal lines: in closed sales over the past year roughly <strong>15% of 33770 carried a Belleair Bluffs designation and about 20% of 33778 came through as Seminole</strong>. And despite what you will read elsewhere, <strong>33777 is not a Largo ZIP</strong> — 99% of its recent sales are designated Seminole. Which one you are in determines who issues your permits and which floodplain rule you live under.",
            "The thresholds are genuinely different. The <strong>City of Largo</strong> treats a home as substantially damaged when repair costs reach <strong>50% or more</strong> of the building&rsquo;s market value. <strong>Unincorporated Pinellas County</strong> sets that line at <strong>49% or more</strong>. Pinellas County states it plainly on its own site: if you live within a city, you have to contact that city for its substantial damage rules — the county&rsquo;s do not apply to you.",
            "There is a second, bigger consequence, and it shows up on your flood insurance bill every year. FEMA\u2019s Community Rating System gives NFIP premium discounts based on how aggressively a community manages its floodplain, and <strong>each municipality is its own NFIP community with its own rating.</strong> Per FEMA\u2019s eligible-communities list effective April 1, 2026, <strong>unincorporated Pinellas County is rated Class 2, earning a 40% flood insurance discount, while the City of Largo is Class 6, earning 20%.</strong> Two otherwise identical Largo-addressed homes can carry materially different flood premiums for no reason other than which side of the city line they sit on.",
            "Do not generalize that to the rest of the county, either. Clearwater, Dunedin, and St. Petersburg are Class 5 at 25%; Belleair and Belleair Bluffs are Class 7 at 15%; Kenneth City and South Pasadena are Class 8 at 10%. And the <strong>City of Seminole does not appear on FEMA\u2019s CRS eligible-communities list at all</strong>, which means no CRS discount there. Never assume a Pinellas municipality has a discount, and never apply the county\u2019s number to a city parcel.",
            "One percentage point sounds trivial until you are deciding whether a $180,000 renovation triggers a mandatory elevation. Before you write an offer on anything in a flood zone, confirm the jurisdiction on the <a href=\"https://www.pcpao.gov/\" target=\"_blank\" rel=\"noopener noreferrer\">Pinellas County Property Appraiser</a> parcel record, then call that jurisdiction&rsquo;s building department — Largo&rsquo;s Building Division is (727) 586-7488, and Pinellas County Floodplain Management is (727) 464-7700.",
          ],
          takeaway:
            "Confirm the jurisdiction before you make an offer. City of Largo uses a 50% repair threshold and earns a 20% CRS flood discount; unincorporated Pinellas uses 49% and earns 40%. Same mailing address, different rules and different premiums.",
        },
        {
          heading: "How the 50% rule can cap your renovation before you start",
          body: [
            "The rule most people call the &ldquo;FEMA 50% rule&rdquo; works like this: if the cost to repair or improve a flood-zone building reaches the threshold for your jurisdiction, you can no longer simply repair it. The whole structure has to be brought into compliance with current floodplain code. The standard differs by jurisdiction: <strong>Pinellas County requires new and substantially improved buildings to be built at least one foot above base flood elevation</strong>, while the <strong>City of Largo</strong> requires the structure to be rebuilt or elevated to <strong>meet or exceed base flood elevation</strong>. Confirm the applicable standard with whichever department issues your permit.",
            "Two details decide whether you clear the bar. First, <strong>market value means the building only, excluding the land</strong> and excluding site improvements like pools, fences, and landscaping. On a Largo lot where much of the price is the dirt, the structure value can be far lower than buyers assume — which makes the 49% or 50% ceiling far lower too. Second, <strong>costs are calculated at average commercial rates for labor and materials.</strong> Doing the work yourself or sourcing your own materials does not help; you still have to estimate it at market rates.",
            "If you exceed the threshold, your options narrow to four: elevate and repair the existing home, replace it with an elevated home, relocate the home outside the flood hazard area, or remove it. None of those are cheap surprises to discover mid-project.",
            "The leverage point is the valuation. Both jurisdictions let you establish the structure&rsquo;s value with an <strong>independent appraisal of actual cash value</strong> rather than accepting the Property Appraiser&rsquo;s adjusted just value — and Pinellas County offers a <strong>free pre-storm building value reconsideration</strong> through the Property Appraiser&rsquo;s office. A higher documented structure value means a higher dollar ceiling before the rule bites. If you disagree with a determination, both Largo and the county have a reassessment process; Largo asks for photos, an elevation certificate, a detailed repair estimate, and an independent appraisal.",
            "One more thing people learn the hard way: <strong>pull the permits.</strong> Largo is explicit that unpermitted work has to be removed or redone. Unpermitted repairs on a flood-zone property are one of the most expensive problems to inherit, and they surface at exactly the wrong moment — when you try to sell.",
          ],
          takeaway:
            "Your renovation ceiling is a percentage of the structure value, not the purchase price. Get that number established early, in writing, before you budget a flood-zone remodel.",
        },
        {
          heading: "Check the flood zone before you write the offer, not after",
          body: [
            "Much of Largo sits inland on the Pinellas peninsula, which generally means better elevation and lower flood risk than the barrier islands to the west. But &ldquo;generally&rdquo; is doing real work in that sentence. Across its roughly <strong>18.8 square miles, Largo ranges from about 3 feet above sea level at its lowest to roughly 70 feet at its highest.</strong> That is a wide spread for a city this size, and it is precisely why flood zone designations here change street by street — sometimes within the same subdivision. Two houses a few blocks apart can carry completely different insurance obligations.",
            "Pinellas County puts it bluntly on its own flood information page: <strong>everyone lives in a flood zone</strong> — it may be high, moderate, or low risk, but &ldquo;not in a flood zone&rdquo; is not a thing here. The question is never whether you are in one, it is which one.",
            "Flood zone drives your insurance cost, your lender&rsquo;s requirements, whether you need an elevation certificate, and whether the substantial improvement rule above ever applies to you. It is a ten-minute check that changes the math on the entire purchase.",
            "We already published the full breakdown rather than repeat it here: see <a href=\"/blog/pinellas-county-flood-zones/\">Pinellas County Flood Zones: What Every Buyer and Homeowner Needs to Know</a> for the zone types, how to look up a specific address, what an elevation certificate is, Risk Rating 2.0, and Florida&rsquo;s flood disclosure requirements. For Largo waterfront specifically, see <a href=\"/blog/waterfront-homes-largo-guide/\">Waterfront Homes in Largo: Pricing &amp; Flood Zones</a>.",
            "Practical checklist when you tour a Largo home: ask the seller for the <strong>current flood premium and declarations page</strong>, the <strong>elevation certificate</strong> if one exists, and the <strong>permit history</strong>. Ask your agent to check whether the seller&rsquo;s flood policy can transfer to you — on some policies it can, and inheriting an older rate is worth real money. Then ask a Florida insurance agent to quote it for you, in your name, before your inspection period ends.",
          ],
          takeaway:
            "Inland Largo is lower-risk than the beaches, but zones vary block by block. Pull the zone, the elevation certificate, and a real insurance quote during due diligence.",
        },
        {
          heading: "The inspections and roof rules that decide whether you can insure it",
          body: [
            "In Florida the deal-killer usually is not the inspection report — it is the insurance underwriting that follows it. Worth knowing up front: <strong>Florida law does not require a four-point inspection.</strong> It is an insurance company underwriting requirement, and each carrier sets its own trigger. Citizens, for example, requires one for properties <strong>more than 20 years old</strong>. The four points are the <strong>roof, electrical, plumbing, and HVAC</strong>. Per the Florida Office of the Insurance Consumer Advocate, the report generally must be dated <strong>within 30 days before you submit the application</strong> — not the 90 days to a year you will see repeated online — though each carrier sets the acceptable window. Budget roughly <strong>$100 to $300</strong> and about an hour; a 20-minute inspection is a red flag, not a bargain.",
            "Roof age is where Largo deals actually die. Citizens requires documentation showing at least <strong>five years of remaining useful life</strong> for roofs older than <strong>25 years</strong> (shingle and similar) or <strong>50 years</strong> (tile, slate, clay, concrete, metal). If the roof has less than five years left, the owner has to <strong>prove a full roof replacement before any policy will be written</strong>. Translation: on an older Largo home, find out the roof&rsquo;s age and condition before your inspection period closes, because the answer can determine whether the property is insurable at all — and therefore whether it is financeable.",
            "Now the part most buyers never hear, and it is in your favor. Under <strong>Florida Statute 627.7011(5)</strong>, an insurer <strong>may not refuse to issue or renew a homeowner&rsquo;s policy on a residential structure with a roof less than 15 years old solely because of the age of the roof.</strong> For a roof 15 years or older, you can get an inspection, and if it shows <strong>five or more years of useful life remaining</strong>, the insurer again may not refuse solely because of roof age. Roof age is measured from the last date 100% of the roof surface was built or replaced. The inspection has to be done by an authorized inspector the insurer recognizes — the statutory list includes licensed home inspectors, certified building code inspectors, professional engineers, architects, and general, building, or residential contractors, and since July 2024 explicitly <strong>roofing contractors</strong>. If a carrier is pushing back purely on roof age, that statute is worth quoting.",
            "Two more rules worth knowing before you sign anything. <strong>Roof deductibles are capped.</strong> Under Statute 627.701(10), a separate roof deductible may not exceed <strong>the lesser of 2% of your Coverage A limit or 50% of the cost to replace the roof</strong> — it is a ceiling set at whichever is lower, not a choice. It cannot be applied at all to a total loss under the valued policy law, to hurricane roof losses, to roof damage from a tree fall or similar hazard that punctures the roof deck, or to repairs requiring less than 50% roof replacement. And if your policy carries one, the premium must include an actuarially sound credit or discount for it.",
            "<strong>Claim deadlines are short and they run from the date of loss, not from when you noticed.</strong> Under Statute 627.70132, notice of a new or reopened property claim must be given <strong>within one year of the date of loss</strong>, and a <strong>supplemental</strong> claim within <strong>18 months</strong>. That applies to damage from any peril, not just hurricanes. If you are buying a Largo home that took storm damage, ask when the loss occurred and whether claims were filed and closed — those windows may already have expired, which means the repair is now the owner&rsquo;s problem, and after closing, yours.",
            "A rule that saves sellers real money: under <strong>Florida Statute 553.844(5)</strong>, if an existing roof was built, repaired, or replaced in compliance with the 2007 Florida Building Code or later, and 25% or more of it is being repaired, replaced, or recovered, <strong>only the repaired or replaced portion</strong> has to meet the current code. This is statewide law, not a local Pinellas rule, and it is frequently misquoted as requiring a full tear-off.",
            "Pinellas also has its own re-roof process. <strong>Every re-roofing project requires an in-progress inspection</strong> so the county can review the underlayment and roofing material during installation, and metal and tile roofs need separate dry-in and flashing inspections. Re-roofing mitigation affidavits are still required for concealed work like deck nailing. If you are buying a Largo home with a recent roof, confirm the permit was finaled — an uninspected re-roof becomes your problem at resale.",
            "On the wind side, the <strong>Pinellas County Construction Licensing Board has adopted a 145 mph ultimate design wind speed (Vult) for Risk Category II buildings</strong>, which covers typical single-family homes, countywide across both incorporated and unincorporated Pinellas. That is the engineering standard new and substantially improved construction is designed against here. Pinellas sits outside Florida&rsquo;s High-Velocity Hurricane Zone, which covers Miami-Dade and Broward, but is still fully subject to Florida&rsquo;s hurricane wind-design requirements — a distinction that occasionally gets misread as &ldquo;Pinellas has lighter standards.&rdquo; It does not.",
            "And file the wind mitigation form. The state form, <strong>OIR-B1-1802, was revised effective April 1, 2026</strong>, and the form itself states it is <strong>valid for up to five years</strong> provided no material changes to the structure. It documents nine items including roof covering, roof deck attachment, roof-to-wall attachment, roof geometry, secondary water resistance, and opening protection. Florida law requires residential property insurers to offer actuarially reasonable discounts for these features, so an uninspected home with hurricane-rated windows and a strapped roof is simply overpaying.",
          ],
          takeaway:
            "Check roof age before your inspection period closes — under 5 years of remaining life can make an older Largo home uninsurable until it is replaced. Then get a current wind mitigation inspection on the April 2026 form.",
        },
        {
          heading: "If your policy is with Citizens, two things are about to matter",
          body: [
            "Citizens Property Insurance is Florida&rsquo;s insurer of last resort, and Pinellas leans on it heavily — as of June 30, 2026 Pinellas was <strong>Citizens&rsquo; fourth-largest county by exposure</strong>, with 21,401 policies and about <strong>$7.6 billion</strong> in insured value, behind only Miami-Dade, Broward, and Palm Beach. Statewide, Citizens is shrinking fast: <strong>266,231 policies in force as of August 31, 2026</strong>, down from a peak of roughly 1.42 million in October 2023.",
            "First deadline. Citizens has been phasing in a <strong>requirement that its policyholders carry flood insurance</strong>, by dwelling value: $600,000 and up in 2024, $500,000 and up in 2025, $400,000 and up in 2026, and <strong>all personal residential policies with wind coverage effective January 1, 2027</strong>. Citizens does not sell flood insurance, so you have to source it yourself, and your flood limit generally has to match your Citizens dwelling coverage or the maximum NFIP limit. Citizens lists condo unit-owner policies, tenant contents policies, and policies that exclude wind as not subject to the requirement. If you own a Largo home insured by Citizens and you do not carry flood today, that is a 2027 budget item you should price now, not in December.",
            "Second: <strong>depopulation</strong>. Private carriers can make offers to assume your Citizens policy, and the rules are stricter than most owners realize. If an offer comes in <strong>no more than 20% above</strong> your estimated Citizens renewal premium, you are <em>no longer eligible</em> to stay with Citizens. If you do not register a choice by the deadline on the offer form, Citizens assigns you to the carrier with the lowest estimated premium. And once an assumption happens, <strong>it is final</strong> — there is no longer a window to return to Citizens. Read the depopulation packet the week it arrives; it is not junk mail.",
            "The better news: Florida regulators approved Citizens&rsquo; <strong>first average personal-lines rate decrease since 2015</strong>, effective July 1, 2026 for new policies and at renewal for existing ones — averaging about <strong>8.8% lower for homeowners multiperil</strong> and <strong>5.5% lower for wind-only</strong>, with every personal-lines policyholder getting at least a 2% reduction.",
            "Finally, <strong>wind mitigation pays</strong>. Across all Citizens personal residential wind policies as of June 30, 2026, about <strong>80% carried a windstorm mitigation credit</strong>, and those credits cut the wind portion of premium by roughly <strong>52% on average — about $2,507 a year</strong>. Credits attach to documented features: roof covering, roof-deck attachment, roof-to-wall connections, secondary water resistance, opening protection, and roof shape. If a Largo home you are buying has had a roof replaced or shutters added and nobody filed a current wind mitigation inspection, that is money sitting on the table. Citizens does not publish per-feature credit percentages, so get an actual quote rather than trusting a percentage you read somewhere.",
          ],
          takeaway:
            "Citizens policyholders need flood coverage by January 1, 2027, and a depopulation offer within 20% of your renewal premium removes your right to stay. Get a current wind mitigation inspection either way.",
        },
        {
          heading: "Why Largo condo values fell while houses held: milestone inspections and SIRS",
          body: [
            "The divergence in this market is dramatic and it is not random. Over the year ending August 2026, the Zillow Home Value Index for Largo <strong>single-family homes rose 0.7%</strong> while the index for Largo <strong>condos and co-ops fell 8.3%</strong>. The typical Largo condo is now valued at roughly <strong>43% of the typical Largo single-family home</strong>. Florida&rsquo;s post-Surfside structural safety laws are a large part of why.",
            "Our own read of Stellar MLS closed sales confirms it independently. Across the trailing twelve months in Largo, excluding rentals and manufactured housing, <strong>single-family homes sold at a $410,000 median in 28 days</strong> while <strong>condominiums sold at a $175,000 median in 74 days</strong>. That is condos trading at about <strong>43% of the single-family price and taking more than two and a half times as long to sell</strong> &mdash; two unrelated data sources landing on the same ratio. Townhomes and villas sat in between, at $322,450 and $235,000 medians respectively.",
            "Two separate requirements apply to condo and co-op buildings that are <strong>three habitable stories or more</strong>. The first is the <strong>milestone inspection</strong> under Florida Statute 553.899: a structural inspection by a licensed engineer or architect by December 31 of the year the building turns <strong>30 years old</strong>, then every <strong>10 years</strong> after. Local authorities may require it at <strong>25 years</strong> where conditions warrant — proximity to salt water is named in the statute, which matters across coastal Pinellas. A Phase 1 visual inspection is the default; a Phase 2 inspection with testing is triggered only if Phase 1 finds substantial structural deterioration.",
            "The second is the <strong>Structural Integrity Reserve Study (SIRS)</strong> under Statute 718.112(2)(g), required at least every 10 years and covering the roof, load-bearing structure, fireproofing and fire protection, plumbing, electrical, waterproofing and exterior painting, windows and exterior doors, plus any item over <strong>$25,000</strong> that affects structural integrity. Associations in existence on or before July 1, 2022 were required to complete a SIRS by <strong>December 31, 2025</strong>. Critically, associations that must have a SIRS <strong>can no longer vote to waive or underfund reserves</strong> for those specific components, apart from a narrow exception for certain multicondominium associations using a division-approved alternative funding method. There is limited flexibility: with a <strong>majority vote of the total voting interests</strong>, an association may fund repairs through a loan or line of credit, and for a <strong>budget adopted on or before December 31, 2028</strong> it may pause reserve contributions for up to two consecutive budget years to fund repairs the milestone inspection recommended — provided the milestone was completed within the previous two calendar years and a SIRS is performed before contributions resume.",
            "Translated into plain terms: buildings that deferred maintenance for thirty years are now legally required to find out what it costs and start funding it. That shows up as higher monthly dues and special assessments, and the market has repriced older condos accordingly.",
            "This is not a reason to avoid Largo condos — it is a reason to buy them with your eyes open, and there are genuine bargains among well-run buildings. Before you waive due diligence, request the <strong>completed milestone inspection report</strong>, the <strong>SIRS</strong>, the current <strong>reserve balances</strong>, the last <strong>12 months of board meeting minutes</strong>, and any <strong>special assessment</strong> already voted or under discussion. A building that has done the work and funded the reserves is a safer buy than a cheaper one that has not — the cheap one is often cheap precisely because the assessment has not landed yet.",
          ],
          takeaway:
            "Largo condo prices fell 8.3% largely because structural reserve funding is now mandatory. Get the milestone report, the SIRS, and the reserve balances before you remove your inspection contingency.",
        },
        {
          heading: "Buying for a school? Pinellas zoning does not work the way you think",
          body: [
            "This is where out-of-area buyers get hurt worst, because Pinellas does not behave like most districts. It is a <strong>zoned district with a choice program layered on top</strong> — your address maps to a grid, the grid maps to an attendance zone, and that zone is your default school. But buying the house is not the same as getting the seat.",
            "Read the district&rsquo;s own rule carefully, because it is the single most important thing on this page for a family: <strong>new students entering kindergarten, sixth, or ninth grade are assigned to their zoned school. Every other new student is assigned to their zoned school on a space-available basis.</strong> If space is not available, the student is assigned to another school in the transportation cluster. Pinellas County Schools also states plainly that using its school locator &ldquo;does not enroll a student, reserve a seat, or guarantee placement at any school.&rdquo;",
            "So if you are moving to Largo with a child entering, say, fourth or tenth grade, <strong>buying inside a zone guarantees you nothing.</strong> Call Pinellas County Schools Student Assignment at <strong>(727) 588-6210</strong> and ask whether there is space in that specific grade at that specific school for a new zoned student — before you write the offer, not after you close.",
            "Second trap: <strong>Largo is not one school district unto itself.</strong> Different Largo addresses feed different schools. Largo addresses are served by Largo High, <strong>Pinellas Park High</strong>, and <strong>Seminole High</strong> depending on where you are; middle schools include Largo Middle, Seminole, Osceola, and Morgan Fitzgerald; and at least seven zoned elementaries carry a Largo address — Anona, Frontier, Fuguitt, Mildred Helms, Oakhurst, Ridgecrest, and Walsingham Oaks K-8. Never trust a listing that names a school. <strong>Run the address yourself</strong> on the district locator at <a href=\"https://asd.pcsb.org/PubInfo/\" target=\"_blank\" rel=\"noopener noreferrer\">asd.pcsb.org/PubInfo</a>.",
            "Third: zones change. The Pinellas County School Board has been working through attendance-boundary changes that include Mid-County — Largo&rsquo;s area. Any zoning statement, including the ones above, is perishable. The locator shows both the current year and proposed changes for the following year, so check both.",
            "On the choice side, Largo sits in the district&rsquo;s <strong>Mid/Central application area</strong>. Magnet programs may be countywide or limited to a geographic application area, while <strong>all fundamental programs are open countywide</strong>, so a Largo family can apply to any of them. Programs physically in Largo include <strong>Mildred Helms Elementary</strong> (IB Primary Years), <strong>Ridgecrest Elementary</strong> (Center for Gifted Studies), <strong>Largo Middle</strong> (IB Middle Years), <strong>Morgan Fitzgerald Middle</strong> (Center for Gifted Studies), <strong>Largo High</strong> (International Baccalaureate, Automotive Academy, and ExCEL), and <strong>Pinellas Park High</strong> (Criminal Justice Academy and First Responders).",
            "Two things about choice that agents routinely oversell. <strong>Proximity priority is weak.</strong> It applies only to kindergarten, sixth, and ninth grade, only to your first-choice program, only after military, feeder-pattern, sibling, professional-courtesy, and school-board-employee priorities are satisfied — and it is capped at no more than 20% of remaining seats for elementary and middle, 25% for ninth grade. Buying nearer a magnet is not a strategy. And <strong>choice usually means you drive.</strong> Magnet and career academies get &ldquo;arterial&rdquo; busing if you are outside roughly two miles, but stops can sit more than a mile and a half from home and may require crossing a multi-lane road. Fundamental elementary programs and Special Assignment Requests come with <strong>no transportation at all</strong>, and buses do not run on private roads or inside gated communities.",
            "Finally, a rule that quietly costs people their kid&rsquo;s season: if you move, you must notify the principal <strong>within five days</strong> of the change of residence — even if you believe you are still in the same zone. Failure to give timely notice can mean reassignment to the zoned school and <strong>loss of eligibility for athletics and other activities</strong>. Residency documents are signed under penalty of perjury, and the district does investigate address fraud.",
          ],
          takeaway:
            "Only kindergarten, sixth, and ninth graders are guaranteed their zoned school — every other grade is space-available. Call Student Assignment at (727) 588-6210 about your child&rsquo;s specific grade before you write an offer.",
        },
        {
          heading: "What you will actually pay in property taxes",
          body: [
            "The <strong>City of Largo&rsquo;s municipal millage is 5.5200</strong>, unchanged since FY2023. That is only the city&rsquo;s slice. Of every property tax dollar a Largo owner pays, the City of Largo gets roughly <strong>29 cents</strong>; about <strong>33 cents</strong> goes to Pinellas County Schools, about <strong>29 cents</strong> to Pinellas County, and about <strong>9 cents</strong> to special districts.",
            "For the 2025 tax year a City of Largo parcel carried <strong>18.9872 total mills</strong>: the city&rsquo;s <strong>5.5200</strong>, the <strong>School Board&rsquo;s 6.2930</strong> (the single largest line on the bill), the <strong>countywide levy of 4.6136</strong> combining the general fund and Health Department, <strong>EMS at 0.8050</strong>, the <strong>Transit District at 0.7300</strong>, and <strong>1.0256 across other districts</strong> — the Juvenile Welfare Board, the Southwest Florida Water Management District, and the Pinellas Planning Council. Note what is <em>not</em> on that list: Largo parcels do <strong>not</strong> pay the county&rsquo;s 0.5000 Library Services levy, because the city funds library service itself. Unincorporated parcels pay that levy, and an MSTU, instead of city millage. For your exact rate, pull the parcel on the <a href=\"https://www.pcpao.gov/\" target=\"_blank\" rel=\"noopener noreferrer\">Pinellas County Property Appraiser</a> site rather than trusting any round number you read online, including ours.",
            "Two Florida rules matter more than the millage itself. <strong>Save Our Homes</strong> caps annual assessed-value increases on a homesteaded property, which is why a long-time neighbor can pay a fraction of what you will pay on an identical house. And <strong>portability</strong> lets you carry your accumulated homestead savings to your next Florida home — a benefit a surprising number of move-up and downsizing sellers never claim.",
            "If you are moving within Florida, run your numbers before you list: see our <a href=\"/blog/florida-property-tax-portability-guide/\">Florida property tax portability guide</a> and <a href=\"/blog/homestead-exemption-florida-guide/\">Florida homestead exemption guide</a>. The one thing to never miss is the filing deadline with the county Property Appraiser — losing a year of exemption is an entirely self-inflicted and avoidable cost.",
          ],
          takeaway:
            "Largo&rsquo;s city millage is 5.5200, but that is under a fifth of your bill. Budget from the actual parcel record, and claim portability if you are moving within Florida.",
        },
      ],

      // Every name, price, DOM, HOA fee, pool rate, and size below comes from
      // Stellar MLS closed sales in Largo over the trailing 12 months (via Bridge),
      // excluding lease records and manufactured housing. No invented subdivisions.
      neighborhoods: [
        {
          name: "Pinebrook Estates",
          note: "In the 33773 Largo mailing area, and the busiest single subdivision in our Largo sales data. Know this before you search: most of the broader Pinebrook plat falls inside the City of Pinellas Park, and only the northern section is City of Largo — confirm the jurisdiction on the specific parcel. The figures here reflect the Largo-addressed portion: 26 closed sales in the last 12 months, more than anywhere else in Largo, at a $394,500 median and 26 days on market. Early-1980s homes around 1,380 sq ft, typically 3 bed / 2 bath. About a third of sales carry an HOA, median dues near $380, and roughly a quarter have a private pool.",
        },
        {
          name: "Largo Lake Villas",
          note: "North Largo (33770) and the fastest-moving address in town: a 6-day median time to contract at $367,500. Despite the name these are detached single-family homes, built around 1963, compact at roughly 1,100 sq ft. Recent sales show no HOA, and about a quarter have a pool.",
        },
        {
          name: "Keene Park",
          note: "Northeast Largo (33771), just off Keene Road. Seven days to contract at a $345,000 median — second-fastest in Largo. Mid-1960s homes near 1,075 sq ft, usually 2 bed / 2 bath, and recent sales show no HOA dues.",
        },
        {
          name: "Harbor Bluffs",
          note: "A Largo mailing address that is NOT inside Largo city limits — county records place these parcels in unincorporated Pinellas near Belleair Bluffs, and 609 of the 680 parcels mail as Largo. That is exactly the trap this page warns about, so confirm jurisdiction before you budget permits. It is also the top of the conventional market: a $762,500 median that still moved in 25 days. The largest homes on this list at roughly 2,140 sq ft, late-1950s construction, 3 bed / 3 bath. Around 60% have a private pool and most sales carry modest HOA dues near $420. Note the Largo mailing address does not necessarily mean inside Largo city limits.",
        },
        {
          name: "Del Prado Imperial",
          note: "Southwest Largo (33774), toward the beaches. A $539,500 median in 20 days, with the biggest floor plans in the fast-moving tier at about 1,615 sq ft and frequently 4 bedrooms. Early-1970s construction, 40% with pools, and HOA dues that are nominal where they exist.",
        },
        {
          name: "Orangewood Estates",
          note: "South Largo (33778). A $485,000 median in just 8 days, which is unusual at that price point. Mid-1970s homes around 1,575 sq ft, 3 bed / 2 bath, no HOA on recent sales — and notably about 64% come with a private pool, the highest pool rate on this list.",
        },
        {
          name: "Harbor Crest",
          note: "Southwest Largo (33774), closer to the Gulf side. A $515,000 median in roughly 13 days. Late-1950s homes near 1,435 sq ft, 3 bed / 2 bath, no HOA on recent sales, and about 63% have pools.",
        },
        {
          name: "Mill Pond",
          note: "Southwest Largo (33774). A $400,000 median in 15 days, late-1970s homes around 1,330 sq ft, 3 bed / 2 bath. Recent sales show no HOA, and close to half include a pool.",
        },
        {
          name: "Highland Park",
          note: "North Largo (33770) and one of the oldest pockets in the city — median year built 1951. Eighteen sales at a $295,800 median in 21 days makes it Largo's most active entry-to-mid market. Roughly 1,165 sq ft, 3 bed / 2 bath, no HOA and essentially no pools on recent sales.",
        },
        {
          name: "Sun Coast Estates",
          note: "East Largo (33771). A $323,500 median in about 12 days. Late-1950s homes near 1,430 sq ft, often 3 to 4 bedrooms, no HOA on recent sales.",
        },
        {
          name: "Floral Gardens",
          note: "East Largo (33771). A $331,000 median in 27 days, mid-1970s homes around 1,335 sq ft, 3 bed / 2 bath, no HOA on recent sales and roughly a quarter with pools.",
        },
        {
          name: "Roosevelt Groves",
          note: "North Largo (33770) and confirmed inside Largo city limits — one of the larger platted subdivisions in the city at 335 homes. A $290,000 median at 40 days, early-1970s homes near 1,080 sq ft, 3 bed / 2 bath, no HOA on recent sales.",
        },
        {
          name: "Big Acres",
          note: "West Largo (33774) and confirmed inside city limits, 239 homes. A $375,000 median, though at 58 days it moves slower than the fast tier. Homes from around 1960 near 1,225 sq ft, 3 bed / 2 bath, no HOA on recent sales.",
        },
        {
          name: "Marsandra Estates",
          note: "West Largo (33770), confirmed inside city limits. A $384,000 median at 40 days across 9 sales. Late-1950s homes around 1,130 sq ft — and notably about 56% of recent sales included a private pool. No HOA on recent sales.",
        },
        {
          name: "Lakeview of Largo",
          note: "Southwest Largo (33774) and confirmed inside city limits — at 513 units, one of the largest condo communities in the city. A $147,300 median across 20 sales, but 61 days to contract, which is typical for Largo condos right now. Early-1970s construction.",
        },
        {
          name: "Shadow Lakes",
          note: "South Largo (33778), confirmed inside city limits, 151 condo units. A $151,500 median at 35 days across 11 sales — quicker than most Largo condo product. Early-1980s construction.",
        },
        {
          name: "Orange Lake Village",
          note: "South Largo (33773) and the city's entry-level volume leader — 23 sales in the original section at a $255,000 median, plus a second section that moved in 13 days at $272,000. Mid-1950s homes, genuinely small at roughly 815 to 870 sq ft and often 2 bed / 1 bath. The most affordable site-built houses in Largo.",
        },
        {
          name: "Lake Seminole Village",
          note: "South Largo (33773). Attached villas from the mid-1980s, about 1,340 sq ft, that moved at a $284,950 median in 9 days. Every sale carries an HOA, median dues around $369 a month — budget that in alongside the price.",
        },
        {
          name: "Belle Oak Villas",
          note: "East Largo (33771). Mid-1980s villas near 1,035 sq ft, 2 bed / 2 bath, at a $250,000 median in 24 days across 15 sales. All sales carry an HOA with median dues around $264 a month. One of the more liquid low-maintenance options in Largo.",
        },
        {
          name: "Azalea Shores",
          note: "Southwest Largo (33774) and effectively the only new construction in the city — median year built 2025. Townhomes around 1,675 sq ft, 3 bed / 3 bath, at a $400,000 median with HOA dues near $165. Took about 40 days to contract, slower than resale single-family but the trade is a brand-new building envelope and a current-code roof.",
        },
        {
          name: "Shipwatch",
          note: "Southwest Largo (33774), gated and genuinely on the water — about half of recent sales were waterfront. The parcel sits in unincorporated Pinellas County despite the Largo mailing address. A $325,000 median, but two numbers matter more: 58 days on market and median HOA dues near $980 a month. That fee is the tradeoff for the location and the marina setting, and it is the kind of condo carrying cost to verify against the reserve study before you commit.",
        },
        {
          name: "Imperial Point",
          note: "Another Largo mailing address that is not City of Largo — county records put these 613 parcels in unincorporated Pinellas under Seminole jurisdiction, 454 of them mailing as Largo. Large 1970s homes averaging roughly 2,200 sq ft at a $580,500 median, with HOA dues near $700 a month and a 61-day median time to contract. Space and location at the cost of carrying expense and slower resale.",
        },
      ],

      comparison: {
        heading: "Largo Property Taxes vs. Other Pinellas Cities",
        intro:
          "Where you buy inside Pinellas County changes your municipal tax rate meaningfully. These are the adopted municipal millage rates for fiscal year 2025–26 — the city portion only. Largo sits in the middle of the pack, below St. Petersburg, Clearwater, and Pinellas Park.",
        headers: ["City", "Municipal millage (FY 2025–26)", "Relative to Largo"],
        rows: [
          ["St. Petersburg", "6.4525", "0.93 higher"],
          ["Clearwater", "5.8850", "0.37 higher"],
          ["Pinellas Park", "5.6500", "0.13 higher"],
          ["Largo", "5.5200", "—"],
          ["Dunedin", "4.1345", "1.39 lower"],
          ["Seminole", "2.4793", "3.04 lower"],
        ],
        note:
          "Municipal millage only. These figures exclude the Pinellas County countywide levy, the Pinellas County School Board levy, and special districts — the school board levy is typically the largest single line on a Florida tax bill. Unincorporated Pinellas parcels pay no municipal millage, but pay a county MSTU of about 2.0857 plus the 0.5000 Library Services levy instead — still less overall than an incorporated Largo parcel. Sources: Florida Department of Revenue, Property Tax Oversight, Table 1 (Pinellas County), FY 2025–26 as adopted; Pinellas County Tax Collector 2025 millage table.",
      },

      resources: [
        {
          group: "Buying in Largo",
          links: [
            { href: "/blog/buying-home-largo-guide/", label: "Complete guide to buying a home in Largo" },
            { href: "/largo-homes-for-sale/", label: "Largo homes for sale" },
            { href: "/blog/largo-homes-under-400k/", label: "Largo homes under $400,000" },
            { href: "/blog/best-neighborhoods-largo/", label: "Best neighborhoods in Largo" },
            { href: "/blog/largo-vs-clearwater-vs-seminole/", label: "Largo vs. Clearwater vs. Seminole" },
            { href: "/largo-condos-for-sale/", label: "Largo condos for sale" },
          ],
        },
        {
          group: "Selling in Largo",
          links: [
            { href: "/blog/selling-home-largo-fl/", label: "Selling your home in Largo" },
            { href: "/blog/sell-home-fast-largo/", label: "How to sell fast in Largo: pricing & timeline" },
            { href: "/largo-home-valuation/", label: "What is my Largo home worth?" },
            { href: "/largo-housing-market/", label: "Largo housing market data" },
            { href: "/blog/florida-property-tax-portability-guide/", label: "Florida property tax portability" },
            { href: "/largo-realtor/", label: "Choosing a Largo REALTOR®" },
          ],
        },
        {
          group: "Largo & Pinellas Research",
          links: [
            { href: "/blog/pinellas-county-flood-zones/", label: "Pinellas County flood zones explained" },
            { href: "/blog/guide-to-living-in-largo-fl/", label: "The complete guide to living in Largo" },
            { href: "/blog/largo-fl-schools-guide/", label: "Schools in Largo: zones & ratings" },
            { href: "/blog/cost-of-living-largo-fl/", label: "Cost of living in Largo" },
            { href: "/blog/waterfront-homes-largo-guide/", label: "Largo waterfront homes & flood zones" },
            { href: "/pinellas-county/", label: "All Pinellas County communities" },
          ],
        },
      ],

      localFaqs: [
        {
          q: "What is the median home price in Largo, FL?",
          a: "Over the three months ending August 2026 the median Largo home sold for <strong>$349,669, down 3.9% from a year earlier</strong>, according to Redfin. That is about 15% below the Pinellas County median of $411,124 for the same period, which makes Largo one of the better-value markets on the Pinellas peninsula. Median price per square foot was $245.",
        },
        {
          q: "How long does it take to sell a house in Largo, FL?",
          a: "The median Largo home went under contract in <strong>50 days</strong> as of August 2026, compared with 75 days for Pinellas County overall, per Redfin. Expect negotiation: the median sale closed at 96.2% of list price, and 42.9% of Largo homes on the market carried a price drop. Pricing correctly at launch is typically the difference between about seven weeks and several months.",
        },
        {
          q: "Am I in the City of Largo or unincorporated Pinellas County?",
          a: "A Largo mailing address does not settle it — the Largo ZIPs (33770, 33771, 33773, 33774, and 33778) include both City of Largo parcels and large pockets of unincorporated Pinellas County. Those ZIPs also cross city lines: roughly 15% of recent 33770 sales were designated Belleair Bluffs and about 20% of 33778 came through as Seminole, and 33777 — often listed as Largo — is actually 99% Seminole. It matters because the two have different floodplain repair thresholds: the City of Largo uses 50% of the building's market value, while unincorporated Pinellas County uses 49%. Check the parcel record on the Pinellas County Property Appraiser site, then call that jurisdiction's building department — Largo Building Division at (727) 586-7488 or Pinellas County Floodplain Management at (727) 464-7700.",
        },
        {
          q: "What flood insurance discount does Largo get?",
          a: "Per FEMA's Community Rating System eligible-communities list effective April 1, 2026, the <strong>City of Largo is rated Class 6, which earns a 20% NFIP flood insurance discount</strong>. Unincorporated Pinellas County is rated Class 2 and earns <strong>40%</strong> — double Largo's discount. Because every municipality is its own NFIP community, the discount follows the property's community, not the county, so an address inside Largo city limits and one just outside it can pay noticeably different flood premiums. For reference, Clearwater, Dunedin, and St. Petersburg are Class 5 at 25%, and the City of Seminole does not appear on the CRS list at all.",
        },
        {
          q: "What is the FEMA 50% rule in Largo, FL?",
          a: "If the cost to repair or improve a flood-zone building reaches 50% or more of the building's market value — excluding the land — the City of Largo treats it as substantially damaged, and the structure must be rebuilt or elevated to meet or exceed base flood elevation. Unincorporated Pinellas County applies the same concept at 49%, and requires new and substantially improved buildings to be built at least one foot above base flood elevation. Costs are calculated at average commercial labor and material rates even if you do the work yourself, and you can establish a higher structure value through an independent appraisal of actual cash value.",
        },
        {
          q: "Does my Largo condo need a milestone inspection or a SIRS?",
          a: "If the building is three habitable stories or more, yes to both. Florida Statute 553.899 requires a milestone structural inspection by December 31 of the year the building turns 30, then every 10 years, and local authorities may require it at 25 years where conditions such as proximity to salt water warrant it. Statute 718.112(2)(g) separately requires a Structural Integrity Reserve Study at least every 10 years, and associations that existed before July 1, 2022 were required to complete one by December 31, 2025. Request both reports plus current reserve balances before you waive your inspection contingency.",
        },
        {
          q: "Why are Largo condo prices falling?",
          a: "Largo condo and co-op values fell 8.3% in the year ending August 2026 while single-family values rose 0.7%, per the Zillow Home Value Index. The main driver is Florida's post-Surfside structural safety law: buildings three stories and up must now complete milestone inspections and fund a Structural Integrity Reserve Study, and associations subject to a SIRS can no longer vote to waive or underfund reserves for structural components. That means higher dues and special assessments, and the market has repriced older buildings to reflect it. Well-run buildings that have already completed the work and funded reserves are often the better buy.",
        },
        {
          q: "What is the property tax rate in Largo, FL?",
          a: "The City of Largo's municipal millage is 5.5200, unchanged since FY2023, and a City of Largo parcel carried 18.9872 total mills for the 2025 tax year. The city's share is roughly 29 cents of every property tax dollar; about 33 cents goes to Pinellas County Schools, 29 cents to Pinellas County, and 9 cents to special districts. The bill combines the city's 5.5200, the School Board's 6.2930, a countywide 4.6136, EMS at 0.8050, Transit District at 0.7300, and 1.0256 in other districts. Largo parcels do not pay the county's 0.5000 Library Services levy because the city funds library service itself. Pull your parcel on the Pinellas County Property Appraiser site for your exact rate.",
        },
        {
          q: "Does buying a house in a Largo school zone guarantee my child a seat?",
          a: "Only at three grades. Pinellas County Schools assigns new students entering <strong>kindergarten, sixth, or ninth grade</strong> to their zoned school, but <strong>all other new students are assigned to their zoned school on a space-available basis</strong>. If space is not available, the student is assigned to another school within the transportation cluster. The district also states that its school locator does not enroll a student, reserve a seat, or guarantee placement. If your child is entering any grade other than K, 6, or 9, call Student Assignment at (727) 588-6210 and ask about space in that specific grade and school before you write an offer.",
        },
        {
          q: "Which schools serve Largo, FL?",
          a: "Largo is not served by a single set of schools — it depends on the address. Largo addresses feed Largo High, Pinellas Park High, or Seminole High; middle schools include Largo Middle, Seminole, Osceola, and Morgan Fitzgerald; and at least seven zoned elementaries carry a Largo address: Anona, Frontier, Fuguitt, Mildred Helms, Oakhurst, Ridgecrest, and Walsingham Oaks K-8. Attendance boundaries also change, and the Pinellas County School Board has been reviewing Mid-County boundaries. Always run the specific address on the district locator at asd.pcsb.org/PubInfo rather than relying on a school named in a listing.",
        },
        {
          q: "Will an old roof stop me from insuring a Largo home?",
          a: "It can stop the purchase entirely. Citizens requires documentation showing at least five years of remaining useful life for roofs older than 25 years (shingle or similar) or 50 years (tile, slate, clay, concrete, or metal), and if the roof has less than five years left the owner must prove a full roof replacement before any policy will be written. No policy means no financing. Check the roof's age and condition before your inspection period closes, not after. Note also that Florida law does not require a four-point inspection at all — it is an insurance underwriting requirement, and Citizens triggers it on properties more than 20 years old.",
        },
        {
          q: "Can a Florida insurer refuse to cover my Largo home because of the roof's age?",
          a: "Not on roof age alone, within limits. Under Florida Statute 627.7011(5), an insurer may not refuse to issue or renew a homeowner's policy on a home with a roof <strong>less than 15 years old</strong> solely because of the roof's age. If the roof is 15 years or older, you may obtain an inspection, and if it shows <strong>five or more years of useful life remaining</strong>, the insurer again may not refuse solely because of roof age. Roof age runs from the last date 100% of the roof surface was built or replaced. The inspection must be performed by an authorized inspector the insurer recognizes — the statute lists home inspectors, building code inspectors, engineers, architects, general, building and residential contractors, and since July 2024, roofing contractors.",
        },
        {
          q: "How long do I have to file a storm damage claim in Florida?",
          a: "Under Florida Statute 627.70132, notice of a new or reopened property insurance claim must be given <strong>within one year of the date of loss</strong>, and a supplemental claim within <strong>18 months</strong> of the date of loss. The clock runs from the date of loss, not from when you discovered the damage, and it applies to damage from any peril rather than just hurricanes. If you are buying a Largo home that sustained storm damage, ask when the loss occurred and whether a claim was filed and closed — if those windows have passed, the unrepaired damage becomes the buyer's problem after closing.",
        },
        {
          q: "Does a roof repair in Largo mean replacing the whole roof?",
          a: "Not necessarily. Under Florida Statute 553.844(5), if an existing roof was built, repaired, or replaced in compliance with the 2007 Florida Building Code or any later edition, and 25% or more of it is being repaired, replaced, or recovered, only the repaired or replaced portion must meet the current code. This is statewide Florida law, not a Pinellas rule, and it is widely misquoted as requiring a full tear-off. Separately, Pinellas County requires an in-progress inspection on every re-roofing project, so confirm any recent roof permit was properly finaled before you buy.",
        },
        {
          q: "Does Citizens Property Insurance require flood insurance in Largo?",
          a: "Yes, and the final phase lands soon. Citizens has been phasing in a flood insurance requirement by dwelling value — $600,000 and up in 2024, $500,000 and up in 2025, $400,000 and up in 2026 — and <strong>all personal residential Citizens policies with wind coverage must carry flood insurance effective January 1, 2027</strong>. Citizens does not sell flood coverage, so you have to obtain it separately, and the limit generally must match your Citizens dwelling coverage or the maximum NFIP limit. Citizens lists condo unit-owner policies, tenant contents policies, and policies excluding wind as not subject to the requirement. Price it now rather than at renewal.",
        },
        {
          q: "Is Largo, FL a good place to buy right now?",
          a: "Largo currently favors prepared buyers. Prices are down 3.9% year over year, 42.9% of listings cut price before selling, only 12.9% sold above list, and Redfin scores the market 45 out of 100 on competitiveness. That is real negotiating room, and it means you should not be pressured into waiving inspections or flood due diligence. Largo also runs about 15% below the county median while sitting inland of the barrier islands, which generally means better elevation than the beach communities. Call Barrett Henry at (813) 733-7907 to talk through whether your specific situation fits this market.",
        },
      ],

      sources: [
        { label: "City of Largo — Substantial Damage / FEMA 50% Rule", href: "https://www.largo.com/building_services/substantial_damage.php" },
        { label: "City of Largo — Substantial Damage FAQs", href: "https://largo.com/building_services/substantial_damage_faqs.php" },
        { label: "Pinellas County — Substantial Damage & Substantial Improvement Rule (49% threshold, unincorporated)", href: "https://pinellas.gov/substantial-damage-substantial-improvement/" },
        { label: "Pinellas County — Construction in a Floodplain (one foot above base flood elevation)", href: "https://pinellas.gov/construction-in-a-floodplain/" },
        { label: "Florida Statute 553.899 — Milestone inspections", href: "https://www.flsenate.gov/Laws/Statutes/2026/553.899" },
        { label: "Florida Statute 718.112 — Structural Integrity Reserve Study requirements", href: "https://www.flsenate.gov/Laws/Statutes/2026/718.112" },
        { label: "Redfin — Largo, FL housing market (August 2026)", href: "https://www.redfin.com/city/10017/FL/Largo/housing-market" },
        { label: "Redfin — Pinellas County, FL housing market (August 2026)", href: "https://www.redfin.com/county/488/FL/Pinellas-County/housing-market" },
        { label: "Zillow Research — Zillow Home Value Index data (August 2026)", href: "https://www.zillow.com/research/data/" },
        { label: "Florida Department of Revenue — Property Tax Oversight, millage by county and municipality", href: "https://floridarevenue.com/property/Pages/DataPortal.aspx" },
        { label: "City of Largo — How your property taxes fund city services", href: "https://www.largo.com/financial_center/property_tax.php" },
        { label: "Pinellas County Property Appraiser — parcel and millage lookup", href: "https://www.pcpao.gov/" },
        { label: "Pinellas County Tax Collector — property tax and millage rates by taxing district", href: "https://www.pinellastaxcollector.gov/property-tax" },
        { label: "U.S. Census Bureau — Largo, Florida population and land area", href: "https://data.census.gov/profile/Largo_city,_Florida" },
        { label: "U.S. Geological Survey — elevation data (3DEP)", href: "https://www.usgs.gov/3d-elevation-program" },
        { label: "Citizens Property Insurance — flood insurance requirement phase-in", href: "https://www.citizensfla.com/flood" },
        { label: "Citizens Property Insurance — depopulation / assumption process", href: "https://www.citizensfla.com/depopulation" },
        { label: "Citizens Property Insurance — 2026 approved rate decrease", href: "https://www.citizensfla.com/-/20260304-citizens-2026-multiperil-rates-to-drop-statewide" },
        { label: "Citizens Property Insurance — policies in force and county exposure reports", href: "https://www.citizensfla.com/policies-in-force" },
        { label: "Citizens Property Insurance — windstorm mitigation discounts", href: "https://www.citizensfla.com/discounts" },
        { label: "Citizens Property Insurance — inspection and roof requirements", href: "https://www.citizensfla.com/inspections" },
        { label: "Florida Office of the Insurance Consumer Advocate — what to expect: four-point inspection", href: "https://myfloridacfo.com/division/consumers" },
        { label: "Florida Statute 553.844 — windstorm loss mitigation; roof repair 25% rule", href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0500-0599/0553/Sections/0553.844.html" },
        { label: "Florida Statute 627.0629 — residential property insurance windstorm discounts", href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.0629.html" },
        { label: "Florida Statute 627.7011 — roof age and refusal to insure", href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.7011.html" },
        { label: "Florida Statute 627.701 — roof deductible limits", href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.701.html" },
        { label: "Florida Statute 627.70132 — property claim notice deadlines", href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.70132.html" },
        { label: "Florida OIR — wind mitigation form OIR-B1-1802 and resources", href: "https://floir.gov/consumers/wind-mitigation-resources" },
        { label: "Pinellas County Construction Licensing Board — local technical amendments (ultimate design wind speed)", href: "https://www.pcclb.com/amendments.htm" },
        { label: "Pinellas County — roofing inspection policies", href: "https://pinellas.gov/roofing-inspection-policies/" },
        { label: "Pinellas County — flood information and flood maps", href: "https://pinellas.gov/flood-information/" },
        { label: "FEMA — Community Rating System eligible communities list (effective April 1, 2026)", href: "https://www.fema.gov/floodplain-management/community-rating-system" },
        { label: "Pinellas County Schools — school zone locator", href: "https://asd.pcsb.org/PubInfo/" },
        { label: "Pinellas County Schools — new student registration and zoned school assignment", href: "https://www.pcsb.org/departments/district-services/student-registration/new-student-registration" },
        { label: "Pinellas County Schools — magnet, fundamental and application programs", href: "https://www.pcsb.org/Page/27216" },
        { label: "Stellar MLS closed sales data, Largo, trailing 12 months (accessed via Bridge Interactive)", href: "https://www.stellarmls.com/" },
      ],
    },
  },
  brandon: {
    city: "Brandon",
    county: "Hillsborough",
    address: "417 Lithia Pinecrest Rd, Brandon, FL 33511",
    zip: "33511",
    lat: 27.9320144,
    lng: -82.277254,
    // layout.tsx appends " | Barrett Henry, REALTOR®" — do not repeat the name here.
    metaTitle: "REMAX Brandon FL Realtor",
    metaDescription:
      "Barrett Henry, Broker Associate at REMAX Collective Brandon — 417 Lithia Pinecrest Rd. Real Brandon MLS data, taxes, HOA dues. Call (813) 733-7907.",
    h1: "REMAX Realtor in Brandon, FL",
    image: "/images/office-brandon.jpg",
    mapLink: "https://maps.app.goo.gl/gjvqfQH6TqnuN2XA8",
    intro: "The REMAX Collective Brandon office on Lithia Pinecrest Road serves East Hillsborough County \u2014 the fastest-growing residential corridor in the Tampa Bay metro. Barrett Henry lives in this area and knows every subdivision, school zone, and neighborhood from FishHawk Ranch to Riverview to Valrico. This isn\u2019t just Barrett\u2019s office \u2014 it\u2019s his backyard.",
    whyThisOffice: [
      "Barrett lives in the Brandon/Valrico area \u2014 this isn\u2019t just business, it\u2019s personal knowledge of every street, school, and HOA",
      "East Hillsborough is the most active residential market in Tampa Bay with thousands of new-construction starts every year",
      "Brandon, Riverview, and Valrico consistently rank among the best places for families in Florida \u2014 top-rated schools, low crime, and affordable price points",
      "The I-75 and SR-60 corridors give Brandon residents direct access to Tampa, MacDill AFB, and the Selmon Expressway for fast commutes",
    ],
    serviceAreas: ["Valrico", "Riverview", "FishHawk Ranch", "Lithia", "Bloomingdale", "Providence", "Dover", "Plant City", "Seffner", "Mango", "Palm River", "Parrish", "Bradenton", "Sarasota"],
    marketContext: "East Hillsborough County is where Tampa Bay families go to find space, value, and top-rated schools. Brandon and its surrounding communities \u2014 Valrico, Riverview, FishHawk, Lithia \u2014 offer everything from starter homes in the $300s to estate properties on acreage. New construction is booming along the SR-60 and Lithia Pinecrest corridors, and Barrett knows every builder, every phase, and every incentive available.",
    commercialNote: "Brandon\u2019s commercial real estate market is driven by the explosive residential growth in East Hillsborough. Retail centers along SR-60 (Brandon Blvd), medical office space near Brandon Regional Hospital, and industrial flex space along I-75 are all active sectors. Barrett handles REMAX Commercial deals for investors looking to capitalize on the area\u2019s growth trajectory.",
    referralAngle: "Brandon is a magnet for military families from MacDill AFB and for corporate relocations to Tampa\u2019s east side. REMAX\u2019s referral network means Barrett regularly receives incoming referrals from agents across the country whose clients are PCSing to MacDill or transferring to employers along the I-4 corridor.",
    otherOffices: [
      { key: "tampa", city: "Tampa" },
      { key: "largo", city: "Largo" },
    ],
    deep: {
      quickAnswer:
        "Barrett Henry is a licensed Florida Broker Associate at the REMAX Collective office at 417 Lithia Pinecrest Rd in Brandon, serving East Hillsborough County. The first thing to understand about Brandon: it is not a city. There is no City of Brandon government, which means Hillsborough County issues your permits, enforces code, and sets your floodplain rules \u2014 and your parcel pays no municipal property tax. Brandon single-family homes also move faster than anywhere else in the metro, at a 22-day median. Call (813) 733-7907 with an address.",

      realities: [
        {
          heading: "Brandon is not a city, and that changes several things",
          body: [
            "This surprises nearly every buyer relocating here. <strong>Brandon has no municipal government.</strong> The U.S. Census Bureau classifies it as a <strong>Census Designated Place</strong> &mdash; a statistical boundary with no active government &mdash; covering about <strong>33.1 square miles</strong>. Tampa, Plant City, and Temple Terrace are the only three incorporated cities in Hillsborough County. Brandon, along with Valrico, Riverview, FishHawk, and Lithia, is unincorporated county.",
            "The practical consequences are real. <strong>Hillsborough County issues your building permits</strong>, not a city building department. <strong>County code enforcement</strong> handles violations. <strong>County floodplain management</strong> determines your substantial-improvement standard. There is no city commission to appeal to and no city hall to call &mdash; everything routes through the county.",
            "The upside lands on your tax bill. <strong>A Brandon parcel pays no municipal millage at all.</strong> For tax year 2025 the all-in rate was <strong>18.2515 mills</strong>, versus <strong>19.8428</strong> inside the City of Tampa &mdash; roughly <strong>8% less</strong>. On a $350,000 taxable value that difference is in the neighborhood of $550 a year.",
            "What replaces the city levy is a <strong>General Purpose County MSTU of 4.6163 mills</strong>, which funds the municipal-equivalent services for unincorporated residents. Watch that line: it rose <strong>9.8%</strong> over the prior year and sits about <strong>8.1% above the rolled-back rate</strong> &mdash; the largest percentage increase of any levy on the Hillsborough table. Unincorporated Brandon <em>also</em> pays the <strong>0.5583 Library Services</strong> levy, which is worth noting because in Pinellas County the City of Largo does not.",
            "One more thing the millage numbers do not capture: <strong>non-ad valorem assessments</strong>. Solid waste, stormwater, fire, and community development district assessments are billed separately on the tax bill and appear in no millage figure anywhere, including ours. When you evaluate a Brandon property, ask for the <strong>actual prior-year tax bill</strong> rather than estimating from a millage rate &mdash; the assessments can add meaningfully, especially in newer master-planned communities.",
          ],
          takeaway:
            "There is no City of Brandon. The county handles permits, code, and floodplain, and you pay no municipal millage — 18.2515 mills versus Tampa's 19.8428. Always request the actual tax bill, not a millage estimate.",
        },
        {
          heading: "Brandon single-family homes are the fastest-moving in the metro",
          body: [
            "These are our own numbers from <strong>Stellar MLS closed sales in Brandon over the trailing twelve months</strong> &mdash; all 881 of them, with rentals and manufactured housing removed.",
            "<strong>Single-family: 677 sales, $390,000 median, 22 days on market.</strong> That 22-day figure is the fastest of the three markets we serve from our offices: Brandon 22 days, Tampa 27, Largo 28. <strong>Townhomes: 124 sales, $238,500 median, 42 days.</strong> <strong>Condominiums: 27 sales, $142,500 median, 27 days.</strong>",
            "Independent data agrees. Redfin scores Brandon <strong>60 out of 100</strong> on competitiveness versus <strong>46 for Tampa</strong>, with a tighter sale-to-list ratio (<strong>98.7%</strong> versus Tampa&rsquo;s 96.9%) and far more homes selling above asking (<strong>22.2%</strong> versus 14.3%). Two unrelated datasets both say Brandon is the tighter market.",
            "What that means in practice: in Brandon you are more likely to face competition and less likely to negotiate deep discounts than in Tampa or Largo. Come pre-approved, be ready to move on a property the week it lists, and do not assume the 40%-of-listings price-drop statistic applies to the homes you actually want &mdash; the good ones here are not sitting.",
            "Brandon also offers the region&rsquo;s most affordable condo product at a $142,500 median, and notably these move in 27 days rather than languishing. That is a sharp contrast with Largo, where condos take 74 days, largely because Largo carries far more older coastal condo stock now subject to Florida&rsquo;s milestone inspection and reserve-study requirements.",
          ],
          takeaway:
            "Brandon single-family runs about $390,000 and 22 days — faster than Tampa or Largo. Two independent sources rate it the tighter market, so come prepared to compete.",
        },
        {
          heading: "HOA dues in Brandon swing by a factor of ten — verify before you offer",
          body: [
            "Brandon has far more HOA and master-planned product than Largo or much of Tampa, and the dues are wildly inconsistent between communities that look similar from the street. In our closed-sales data the median monthly dues ranged from <strong>$83 to $845</strong> &mdash; a tenfold spread inside one market.",
            "Some concrete examples from recent sales. <strong>Sterling Ranch</strong> carried median dues near <strong>$83</strong>. <strong>Lakeview Village</strong> came in around <strong>$147</strong>. <strong>Woodberry</strong> about <strong>$288</strong>, <strong>Bloomingdale Townes</strong> about <strong>$300</strong>, <strong>Edgewater at Lake Brandon</strong> about <strong>$383</strong>, <strong>Watermill at Providence Lakes</strong> about <strong>$466</strong>, <strong>Regency Key</strong> about <strong>$529</strong>, <strong>Barrington Preserve</strong> about <strong>$575</strong>, and <strong>Chelsea Manor</strong> about <strong>$845</strong>.",
            "At $845 a month you are carrying roughly <strong>$10,100 a year</strong> before taxes, insurance, or principal and interest. Against a $230,000 purchase price that materially changes what you can actually afford, and it changes what a lender will approve. Two Brandon townhomes at the same price can differ by $7,000 a year in carrying cost.",
            "Before you write an offer, get the dues in writing, ask what they include, ask when they last increased and by how much, and ask whether any special assessment has been voted or discussed. Then ask separately whether the community carries a <strong>community development district assessment on the tax bill</strong> &mdash; that is a different charge from HOA dues, it does not show up in the HOA estimate, and in newer master-planned communities it can be substantial.",
          ],
          takeaway:
            "Brandon HOA dues ran $83 to $845 a month in recent sales. Get them in writing, and ask separately about any district assessment on the tax bill — they are not the same charge.",
        },
        {
          heading: "CDD assessments: the East Hillsborough cost nobody quotes you",
          body: [
            "This is the biggest hidden carrying cost in Brandon, Riverview, FishHawk, and the rest of East Hillsborough, and it is <strong>not</strong> the HOA. A <strong>Community Development District</strong> is a unit of special-purpose local government created under <strong>Chapter 190, Florida Statutes</strong>. Developers use them to finance infrastructure &mdash; roads, drainage, water, sewer, parks &mdash; with tax-exempt bonds, repaid by assessments levied against the lots.",
            "It arrives on your <strong>property tax bill</strong>, in the non-ad valorem section, collected at the same time and in the same manner as county taxes. It appears in no millage rate, including the ones on this page. And it comes in <strong>two separate pieces</strong>: a <strong>debt assessment</strong> repaying the bonds, payable in no more than 30 yearly installments under Statute 190.022(2), and a <strong>maintenance assessment</strong> funding operations. The debt piece eventually retires. <strong>The maintenance piece never goes away.</strong>",
            "Real numbers, from a district&rsquo;s own adopted budget rather than an estimate. Triple Creek CDD in Riverview adopted its FY 2026&ndash;27 budget in August 2026 with annual totals per home of <strong>$2,605 to $4,067</strong>, depending on lot type and bond series. Within that, the <strong>debt portion alone ran $413 to $1,875</strong> and the maintenance portion was <strong>$2,192</strong> for every unit. The variation is not just district to district &mdash; it is village to village <em>inside one district</em>. Never accept a &ldquo;typical&rdquo; countywide CDD figure from anyone.",
            "Can you pay off the debt portion early? Usually yes in practice, but there is <strong>no blanket statutory right</strong>. Chapter 170 provides only narrow windows, and beyond those your payoff rights live in that district&rsquo;s assessment resolution and bond documents. Get the payoff figure from the district manager, not from a listing.",
            "Here is the part that should change how you shop. <strong>Florida only requires CDD disclosure on the initial sale.</strong> Statute 190.048 mandates a bold, conspicuous disclosure immediately above the buyer&rsquo;s signature line &mdash; but only in each contract for the <em>initial</em> sale of a parcel or residential unit. There is no equivalent statutory resale disclosure anywhere in Chapter 689. The district does record a Notice of Establishment in county records within 30 days of formation under Statute 190.0485, which is constructive notice to every later buyer &mdash; precisely why the contract requirement was never extended to resales. Translated: <strong>the law forces the builder to tell you. On a resale, finding out is on you and your agent.</strong>",
            "Three ways to check a specific property: pull the recorded <strong>Notice of Establishment</strong> in the Hillsborough County Clerk&rsquo;s official records, read the non-ad valorem section of the <strong>actual prior-year tax bill</strong>, and check the <strong>district&rsquo;s own website</strong>, since Florida CDDs must publish budgets and assessment schedules. For county assessment questions, Hillsborough&rsquo;s Special Assessments Coordinator is at <strong>(813) 272-6599</strong>.",
          ],
          takeaway:
            "A CDD assessment can add $2,600 to $4,100 a year on the tax bill and appears in no millage rate. Florida only requires disclosure on the initial sale \u2014 on a resale, you have to go looking.",
        },
        {
          heading: "Sinkholes and the 50% rule in unincorporated Hillsborough",
          body: [
            "Two county-specific rules worth knowing before you buy in Brandon.",
            "<strong>The substantial improvement threshold is 50%</strong> &mdash; if repairs or improvements to a flood-zone building reach half the structure&rsquo;s market value, the whole building must be brought into floodplain compliance. Unincorporated Hillsborough applies a <strong>12-month cumulative look-back</strong>, and the clock starts when the permit for the first improvement is issued, running through 12 months after the certificate of occupancy or final inspection, whichever period is longer. Phasing a renovation across two permits does not reset it. Market value means the <strong>structure only, excluding land</strong>, set either by an independent appraiser&rsquo;s actual cash value or by <strong>120% of the Property Appraiser&rsquo;s assessed structure value</strong>. The Property Appraiser publishes a <a href=\"https://www.hcpafl.org/Home/FEMA-50-Rule\" target=\"_blank\" rel=\"noopener noreferrer\">FEMA 50% Rule calculator</a> that returns the threshold for a specific parcel. Note the City of Tampa, Plant City, and Temple Terrace each start that clock differently, so advice written for a Tampa address does not apply here.",
            "<strong>Sinkholes are the other one.</strong> Florida gives you two different coverages and most owners only hold the weaker one. <strong>Catastrophic ground cover collapse is mandatory</strong> under Statute 627.706(1)(a), but it pays only if all four conditions are met &mdash; abrupt collapse, a depression visible to the naked eye, structural damage, and <strong>the home being condemned and ordered vacated</strong>. The statute says outright that mere settling or cracking does not qualify. <strong>Sinkhole loss coverage is optional</strong> under 627.706(1)(b), costs extra, may require an inspection, and is what actually covers a cracking foundation. Deductibles run 1%, 2%, 5%, or 10% of the dwelling limit.",
            "Before you write an offer, run the address through the Property Appraiser&rsquo;s public <a href=\"https://gis.hcpafl.org/SubsidenceSearch/\" target=\"_blank\" rel=\"noopener noreferrer\">Subsidence Search</a>, which flags parcels as unremediated, remediated, or inconclusive. It is limited data the office itself disclaims, so treat it as a starting point. Also know that a <strong>seller must disclose a paid sinkhole claim before closing</strong> under Statute 627.7073(2)(c), including whether the full proceeds went into repairing the damage &mdash; and the insurer&rsquo;s report and payment amount are recorded with the clerk of court, making a paid claim discoverable.",
          ],
          takeaway:
            "Unincorporated Hillsborough uses a 50% threshold with a 12-month cumulative look-back. And mandatory sinkhole coverage only pays if your home is condemned \u2014 the optional endorsement is what covers cracking.",
        },
        {
          heading: "New construction in Brandon, and why its days-on-market number lies",
          body: [
            "Brandon is one of the most active new-construction markets in Tampa Bay, and two communities dominated recent closings. <strong>Bloomingdale Townes</strong> delivered 25 sales at a <strong>$399,990</strong> median, median year built <strong>2025</strong>, townhomes around 2,230 square feet with dues near $300 and a striking 44% of sales classified waterfront. <strong>Barrington Preserve</strong> closed 14 sales at a <strong>$997,942</strong> median, median year built <strong>2026</strong>, large homes near 3,450 square feet with dues around $575 and roughly a third including a pool.",
            "Here is the insider caveat, and it is the sort of thing that makes portal data misleading. <strong>Barrington Preserve shows a median zero days on market.</strong> That does not mean homes there sell instantly. It means these were builder contracts written long before the home existed, with the listing entered and closed around delivery. Any ranking of &ldquo;fastest-selling neighborhoods&rdquo; built from raw days-on-market will put brand-new construction tracts at the top, and it will be wrong every time. We exclude those from our speed rankings for exactly that reason.",
            "If you are buying new in Brandon, the real questions are different from resale. Ask what the <strong>builder incentive</strong> is worth and whether it requires using the builder&rsquo;s lender and title company. Ask for the <strong>district assessment</strong> amount on the tax bill, not just HOA dues. Ask what phase you are in and what is still to be built behind you. And get your own inspection at both pre-drywall and final walkthrough &mdash; a new home is not an inspected home.",
            "The structural upside of new construction in Florida right now is genuine and worth weighing: a current-code roof, a current-code building envelope, and a wind-mitigation profile that will price better with insurers than a 1970s house with a twenty-year-old roof.",
          ],
          takeaway:
            "Bloomingdale Townes and Barrington Preserve lead Brandon's new construction. Ignore new-build days-on-market entirely — those are builder closings, not market speed.",
        },
        {
          heading: "Flood and insurance in East Hillsborough",
          body: [
            "Brandon is inland, which generally means better flood positioning than coastal Pinellas or South Tampa &mdash; but East Hillsborough has its own water. The Alafia River, Bullfrog Creek, and a dense network of lakes and retention systems run through the area, and several of the neighborhoods in our data show meaningful waterfront shares: Lakeview Village around 33%, Watermill at Providence Lakes 29%, Park Lake at Parsons 27%, Bloomingdale Townes 44%.",
            "On flood insurance pricing, Brandon takes the county&rsquo;s rating &mdash; and it just got better. <strong>Unincorporated Hillsborough County improved from CRS Class 5 to Class 4 effective October 1, 2026, which earns a 30% NFIP flood insurance discount.</strong> FEMA notified the county of the upgrade in July 2026, and the county estimates it saves unincorporated residents roughly $7.1 million a year. Because Brandon has no municipal government, it has no separate NFIP community and no separate rating &mdash; there is no Brandon row on FEMA&rsquo;s list at all, so it inherits the county&rsquo;s 30%. For comparison inside the same county, the <strong>City of Tampa is Class 5 at 25%</strong>, Plant City is Class 6 at 20%, and Temple Terrace is Class 8 at just 10%. Brandon now carries the best flood discount in Hillsborough County.",
            "The statewide insurance rules that drive Florida deals apply here exactly as they do everywhere else, and they are worth reading before you shop: roof age limits under Statute 627.7011, the roof deductible cap under 627.701, the one-year and 18-month claim deadlines under 627.70132, and the Citizens Property Insurance requirement that <strong>all personal residential policies with wind coverage carry flood insurance effective January 1, 2027</strong>. Our <a href=\"/remax-largo/\">Largo office page</a> covers each of those in detail.",
            "The practical Brandon checklist is short: pull the flood zone, ask the age of the roof and whether it has five years of documented life left, get a current wind mitigation inspection on the April 2026 state form, and get the policy quoted in your own name before your inspection period closes. On an inland Brandon house with a newer roof those numbers are usually favorable &mdash; but find out, do not assume.",
          ],
          takeaway:
            "Brandon inherits unincorporated Hillsborough's CRS rating, which improved to Class 4 and a 30% flood discount on October 1, 2026 — the best in the county. Inland does not mean no flood risk, though: several Brandon communities are a third waterfront.",
        },
      ],

      // All figures from Stellar MLS closed sales in Brandon, trailing 12 months,
      // leases and manufactured housing excluded. "UNPLATTED" is a county catch-all
      // for parcels without a recorded subdivision, not a neighborhood — excluded.
      neighborhoods: [
        { name: "Brandon Valley", note: "North Brandon (33510). The fastest sales in Brandon at a $367,500 median in 7 days. Mid-1970s homes around 1,510 sq ft, often 4 bedrooms, a third with pools, and no HOA on recent sales." },
        { name: "Woodbery Estates", note: "North Brandon (33510). A $349,500 median in 12 days across 10 sales. Mid-1970s homes near 1,330 sq ft, 3 bedrooms, no HOA on recent sales — straightforward established Brandon." },
        { name: "Southwood Hills", note: "South Brandon (33511). A $360,000 median in 12 days. Late-1970s homes around 1,290 sq ft, and notably about 56% of recent sales included a private pool. No HOA on recent sales." },
        { name: "Watermill at Providence Lakes", note: "South Brandon (33511). A $375,000 median in 13 days. Mid-1980s homes near 1,970 sq ft with HOA dues around $466, roughly 43% with pools and 29% of sales waterfront." },
        { name: "Lakeview Village", note: "North Brandon (33510). A $400,000 median in 19 days, with a second section at $416,950 and 21 days. Mid-to-late 1980s homes from about 1,570 to 2,060 sq ft, low HOA dues near $147, better than half with pools and a meaningful waterfront share." },
        { name: "Brandon Estates", note: "North Brandon (33510). A $310,000 median in 20 days. Early-1970s homes around 1,155 sq ft, frequently 4 bedrooms, no HOA on recent sales. Among the more affordable established options." },
        { name: "Tanglewood", note: "South Brandon (33511). A $335,000 median in 21 days. Mid-1970s homes near 1,660 sq ft, 3 bedrooms, no HOA on recent sales." },
        { name: "Woodberry", note: "North Brandon (33510). A $419,500 median in 22 days across 10 sales. Early-2000s construction around 1,990 sq ft, typically 4 bedrooms, HOA dues near $288 and about half with pools — newer stock than most of established Brandon." },
        { name: "Bloomingdale", note: "South Brandon (33511), Section D. A $467,750 median in 25 days. Early-1980s homes averaging about 2,420 sq ft, often 4 bedrooms, with two-thirds of recent sales including a pool and modest HOA dues near $100." },
        { name: "Sterling Ranch", note: "South Brandon (33511). A $350,000 median at 40 days. Homes from around 1990 near 1,500 sq ft — and the lowest HOA dues in our Brandon data at roughly $83 a month." },
        { name: "Bloomingdale Townes", note: "South Brandon (33511) and Brandon's most active new construction — 25 sales, median year built 2025. Townhomes around 2,230 sq ft at a $399,990 median with HOA dues near $300, and about 44% of sales classified waterfront. Took 38 days, which for new construction reflects delivery timing more than demand." },
        { name: "Barrington Preserve", note: "South Brandon (33511). New construction at the top of the Brandon market — median year built 2026, roughly 3,450 sq ft, a $997,942 median, HOA dues near $575 and about a third with pools. Its zero-day days-on-market figure reflects builder contracts closing at delivery, not market speed." },
        { name: "Regency Key", note: "North Brandon (33510). Townhomes from around 2001, about 1,110 sq ft, at a $179,500 median in 22 days. HOA dues near $529 a month — run that number against the price before you commit." },
        { name: "Chelsea Manor", note: "North Brandon (33510). Townhomes from the mid-2000s near 1,240 sq ft at a $230,000 median in 26 days. The highest dues in our Brandon data at roughly $845 a month, which works out to about $10,100 a year in carrying cost." },
        { name: "Edgewater at Lake Brandon", note: "South Brandon (33511). Mid-2000s townhomes around 1,470 sq ft at a $232,500 median, 34 days, with HOA dues near $383." },
        { name: "Park Lake at Parsons", note: "South Brandon (33511). Condominiums from the late 1980s, compact at roughly 740 sq ft, at a $135,000 median in 18 days. Dues near $363, with about 45% having pool access and 27% of sales waterfront. The most affordable entry point in Brandon." },
      ],

      comparison: {
        heading: "Brandon vs. Tampa vs. Largo — Same Data, Same Period",
        intro:
          "Most market comparisons blend different sources, boundaries, and time windows, which makes them useless. These figures all come from Stellar MLS closed sales over the identical trailing twelve months, with rentals and manufactured housing excluded from each. This is a true apples-to-apples read on the three markets we serve from our offices.",
        headers: ["Market", "Single-family median", "SF days on market", "Condo median", "Condo days on market"],
        rows: [
          ["Brandon", "$390,000", "22 days", "$142,500", "27 days"],
          ["Tampa", "$460,000", "27 days", "$260,000", "48 days"],
          ["Largo", "$410,000", "28 days", "$175,000", "74 days"],
        ],
        note:
          "Stellar MLS closed sales, trailing 12 months, leases and manufactured housing excluded. Counts: Brandon 881 total sales, Tampa 9,058, Largo 1,529. Brandon condo sample is small at 27 sales — treat that figure as indicative rather than precise. Brandon figures describe the Census-designated Brandon area and do not include Valrico, Riverview, FishHawk, or Lithia, which are separate MLS cities.",
      },

      resources: [
        {
          group: "Buying in Brandon",
          links: [
            { href: "/blog/buying-home-brandon-guide/", label: "Complete guide to buying in Brandon" },
            { href: "/brandon-homes-for-sale/", label: "Brandon homes for sale" },
            { href: "/blog/best-neighborhoods-brandon/", label: "Best neighborhoods in Brandon" },
            { href: "/blog/new-construction-brandon-guide/", label: "Brandon new construction & builders" },
            { href: "/blog/pool-homes-brandon-fl/", label: "Pool homes in Brandon: real costs" },
            { href: "/blog/luxury-homes-brandon-guide/", label: "Luxury living in Brandon" },
          ],
        },
        {
          group: "Selling & Market Data",
          links: [
            { href: "/blog/selling-your-home-brandon-fl/", label: "Selling your home in Brandon" },
            { href: "/blog/sell-home-fast-brandon/", label: "How to sell fast in Brandon" },
            { href: "/brandon-home-valuation/", label: "What is my Brandon home worth?" },
            { href: "/brandon-housing-market/", label: "Brandon housing market data" },
            { href: "/blog/florida-property-tax-portability-guide/", label: "Florida property tax portability" },
            { href: "/brandon-realtor/", label: "Choosing a Brandon REALTOR®" },
          ],
        },
        {
          group: "Compare the Area",
          links: [
            { href: "/blog/brandon-fl-vs-tampa/", label: "Brandon vs. Tampa: honest comparison" },
            { href: "/blog/brandon-vs-riverview-vs-valrico/", label: "Brandon vs. Riverview vs. Valrico" },
            { href: "/blog/valrico-vs-brandon-2026/", label: "Valrico vs. Brandon in 2026" },
            { href: "/blog/bloomingdale-brandon-fl/", label: "Where exactly is Bloomingdale?" },
            { href: "/blog/waterfront-homes-brandon-guide/", label: "Brandon waterfront & flood zones" },
            { href: "/hillsborough-county/", label: "All Hillsborough County communities" },
          ],
        },
      ],

      localFaqs: [
        {
          q: "Is Brandon, FL a city?",
          a: "No. Brandon has no municipal government. The U.S. Census Bureau classifies it as a <strong>Census Designated Place</strong> — a statistical boundary with no active government — covering roughly 33.1 square miles. Hillsborough County has only three incorporated cities: Tampa, Temple Terrace, and Plant City. Brandon, Valrico, Riverview, FishHawk, and Lithia are all unincorporated county. Practically, that means Hillsborough County issues your permits, handles code enforcement, and sets your floodplain rules — and your parcel pays no municipal property tax.",
        },
        {
          q: "What is the property tax rate in Brandon, FL?",
          a: "For tax year 2025 an unincorporated Hillsborough parcel, which includes Brandon, carried <strong>18.2515 total mills</strong> — about 8% less than the 19.8428 mills inside the City of Tampa, because Brandon pays no municipal millage. In its place Brandon pays a <strong>General Purpose County MSTU of 4.6163 mills</strong> plus <strong>Library Services of 0.5583</strong>, alongside school levies totaling 6.3400, countywide 5.5212, HART transit 0.5000, the Children's Board 0.4589, SWFWMD 0.1831, and the Port Authority 0.0737. Note that non-ad valorem assessments — solid waste, stormwater, fire, and community development district charges — are billed separately and appear in no millage figure. Always request the actual prior-year tax bill.",
        },
        {
          q: "How fast do homes sell in Brandon, FL?",
          a: "Fast — the fastest of the three markets we serve. Based on Stellar MLS closed sales over the trailing twelve months, Brandon <strong>single-family homes sold at a $390,000 median in 22 days</strong>, compared with 27 days in Tampa and 28 in Largo. Townhomes took 42 days at a $238,500 median and condominiums 27 days at $142,500. Redfin independently scores Brandon 60 out of 100 on competitiveness versus 46 for Tampa, with 22.2% of Brandon homes selling above list price. Come pre-approved and be ready to act quickly.",
        },
        {
          q: "How much are HOA fees in Brandon, FL?",
          a: "They vary enormously — median monthly dues in our recent closed sales ranged from about <strong>$83 to $845</strong>, a tenfold spread within one market. Sterling Ranch came in near $83 and Lakeview Village near $147, while Regency Key ran about $529 and Chelsea Manor about $845. At $845 a month you are carrying roughly $10,100 a year before taxes, insurance, or mortgage payment, which materially affects both affordability and loan approval. Get the dues in writing, ask when they last increased, ask about any special assessment, and ask separately whether the community carries a community development district assessment on the tax bill — that is a different charge from HOA dues.",
        },
        {
          q: "Why do new construction homes in Brandon show zero days on market?",
          a: "Because those are builder contracts, not market speed. In new-construction communities like Barrington Preserve, buyers sign contracts long before the home is built, and the listing is often entered and closed around delivery — producing a days-on-market figure of zero. Any ranking of fastest-selling neighborhoods built from raw days-on-market data will put brand-new tracts at the top and will be misleading. We exclude new-construction tracts from our speed rankings for that reason. When buying new in Brandon, the figures that actually matter are the builder incentive and its conditions, the district assessment on the tax bill, which phase you are buying in, and whether you have your own pre-drywall and final inspections.",
        },
        {
          q: "What is a CDD fee in Brandon and do I have to pay it?",
          a: "A Community Development District is a unit of special-purpose local government created under Chapter 190, Florida Statutes, that finances a community's infrastructure with tax-exempt bonds. If your property is in one, you pay it — it is levied against the lot and collected on your <strong>property tax bill</strong> in the non-ad valorem section, at the same time and in the same manner as county taxes, and it appears in no millage rate. It has two parts: a debt assessment repaying the bonds, payable in up to 30 yearly installments, and a maintenance assessment funding operations. The debt portion eventually retires; <strong>the maintenance portion never does</strong>. For scale, Triple Creek CDD in Riverview adopted FY 2026–27 annual totals of $2,605 to $4,067 per home depending on lot type and bond series, with the debt piece alone running $413 to $1,875. Amounts vary village to village even inside one district, so never rely on a countywide average.",
        },
        {
          q: "Does a seller have to tell me a Brandon home is in a CDD?",
          a: "Only on a brand-new home. Statute 190.048 requires a bold, conspicuous CDD disclosure immediately above the buyer's signature line in each contract for the <strong>initial</strong> sale of a parcel or residential unit — but Florida has no equivalent statutory resale disclosure, and Chapter 689 contains nothing on CDDs. The district does record a Notice of Establishment in county records within 30 days of formation under Statute 190.0485, which serves as constructive notice to every subsequent buyer, which is why the contract requirement was never extended to resales. Practically: on a resale, finding out is on you and your agent. Check the recorded Notice of Establishment with the Hillsborough County Clerk, read the non-ad valorem section of the actual prior-year tax bill, and check the district's own website for its budget and assessment schedule.",
        },
        {
          q: "Do I need sinkhole insurance in Brandon, FL?",
          a: "You already have the weaker version, and it may not be what you think. <strong>Catastrophic ground cover collapse coverage is mandatory</strong> in Florida under Statute 627.706(1)(a), but it pays only if all four conditions are met: abrupt collapse of the ground cover, a depression clearly visible to the naked eye, structural damage to the building, and <strong>the structure being condemned and ordered vacated</strong>. The statute states explicitly that mere settling or cracking does not qualify. <strong>Sinkhole loss coverage is separate and optional</strong> under 627.706(1)(b) — it costs an additional premium, the insurer may require an inspection, and it is what actually covers a cracking foundation. Deductibles are 1%, 2%, 5%, or 10% of your dwelling limit. Before you buy, run the address through the Hillsborough County Property Appraiser's public Subsidence Search, and note that a seller must disclose any paid sinkhole claim before closing under Statute 627.7073(2)(c).",
        },
        {
          q: "What flood insurance discount does Brandon get?",
          a: "Brandon takes unincorporated Hillsborough County's rating, and it recently improved. <strong>Unincorporated Hillsborough went from CRS Class 5 to Class 4 effective October 1, 2026, which earns a 30% NFIP flood insurance discount</strong> — FEMA notified the county in July 2026, and the county estimates roughly $7.1 million in annual savings for unincorporated residents. Because Brandon has no municipal government it has no separate NFIP community and appears nowhere on FEMA's list, so it inherits the county's 30%. Within the same county the City of Tampa is Class 5 at 25%, Plant City is Class 6 at 20%, and Temple Terrace is Class 8 at only 10% — meaning Brandon currently carries the best flood insurance discount in Hillsborough County. Brandon is inland, which generally helps, but several Brandon communities show substantial waterfront, so always pull the specific flood zone.",
        },
      ],

      sources: [
        { label: "Stellar MLS closed sales, Brandon, trailing 12 months (accessed via Bridge Interactive)", href: "https://www.stellarmls.com/" },
        { label: "U.S. Census Bureau — Brandon CDP, Florida (Census Designated Place, land area)", href: "https://data.census.gov/profile/Brandon_CDP,_Florida" },
        { label: "Hillsborough County Property Appraiser — Final 2025 millage rates", href: "https://www.hcpafl.org/" },
        { label: "Florida Department of Revenue — Property Tax Oversight, Table 1 (Hillsborough County)", href: "https://floridarevenue.com/property/Pages/DataPortal.aspx" },
        { label: "FEMA — Community Rating System eligible communities list (effective April 1, 2026)", href: "https://www.fema.gov/floodplain-management/community-rating-system" },
        { label: "Hillsborough County — Community Rating System Class 4 upgrade effective October 1, 2026", href: "https://hcfl.gov/residents/public-safety/flooding/community-rating-system" },
        { label: "Redfin — Brandon, FL housing market", href: "https://www.redfin.com/city/21605/FL/Brandon/housing-market" },
        { label: "Hillsborough County — permits, floodplain management and code enforcement", href: "https://hillsboroughcounty.org/" },
        { label: "Florida Statute 627.7011 — roof age and refusal to insure", href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.7011.html" },
        { label: "Citizens Property Insurance — flood insurance requirement phase-in", href: "https://www.citizensfla.com/flood" },
        { label: "Florida Statutes Chapter 190 — Community Development Districts", href: "https://www.flsenate.gov/Laws/Statutes/2026/Chapter190" },
        { label: "Florida Statute 190.048 — CDD disclosure on initial sale", href: "https://www.flsenate.gov/Laws/Statutes/2026/190.048" },
        { label: "Triple Creek CDD (Riverview) — FY 2026–27 adopted budget", href: "https://www.triplecreekcdd.com/documents" },
        { label: "Hillsborough County Tax Collector — non-ad valorem assessments and special districts", href: "https://www.hillstaxfl.gov/" },
        { label: "Hillsborough County Property Appraiser — FEMA 50% Rule calculator", href: "https://www.hcpafl.org/Home/FEMA-50-Rule" },
        { label: "Hillsborough County Property Appraiser — Subsidence Search", href: "https://gis.hcpafl.org/SubsidenceSearch/" },
        { label: "Florida Statute 627.706 — sinkhole and catastrophic ground cover collapse coverage", href: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.706.html" },
      ],
    },
  },
};

/**
 * Strips HTML tags and decodes the few entities we use, so an answer written with
 * inline links can be reused as plain text inside FAQPage JSON-LD. Schema answers
 * must be plain text — raw markup there causes Google to drop the rich result.
 */
function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&rsquo;/g, "’")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Public helper — used by [citySlug]/page.tsx to detect REMAX office slugs ──
export function getRemaxOffice(slug: string): OfficeData | null {
  const s = slug.toLowerCase();
  for (const key of Object.keys(OFFICES)) {
    if (s === `remax-${key}`) return OFFICES[key];
  }
  return null;
}

// =============================================================================
// Main page component
// =============================================================================
export default async function RemaxOfficePage({ officeKey }: { officeKey: string }) {
  const office = OFFICES[officeKey] || OFFICES.tampa;
  const featured = testimonials.slice(0, 3);

  // Fetch active listings near this office
  let listings: import("@/lib/types").Listing[] = [];
  try {
    const res = await getListings({
      city: office.city,
      exclude_rental: true,
      limit: "12",
      sort: "ModificationTimestamp desc",
    });
    listings = res.value || [];
  } catch { listings = []; }

  return (
    <>
      {/* ================================================================== */}
      {/* JSON-LD: FAQPage + RealEstateAgent + BreadcrumbList schemas        */}
      {/* ================================================================== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              // Capped at 12 questions — house standard for FAQPage markup. Local
              // market questions come first, so the cap trims generic brand Q&A, not
              // the locally-specific answers. All questions stay visible on the page.
              mainEntity: [
                // Local market questions first — mirrors the visible FAQ order
                ...(office.deep?.localFaqs || []).map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: toPlainText(f.a) },
                })),
                { "@type": "Question", name: `Where is the REMAX office in ${office.city}?`, acceptedAnswer: { "@type": "Answer", text: `The REMAX Collective ${office.city} office is located at ${office.address}. Barrett Henry is a Broker Associate at this location. Call (813) 733-7907.` } },
                { "@type": "Question", name: `Why should I choose REMAX in ${office.city}?`, acceptedAnswer: { "@type": "Answer", text: `REMAX is the most recognized real estate brand in the world, operating in 120+ countries with 145,000+ agents. REMAX agents averaged 11.7 transaction sides in 2025 versus 5.4 for agents at competing large brokerages \u2014 more than double, per the 2026 RealTrends Verified rankings. Barrett Henry at REMAX Collective ${office.city} brings 24+ years of real estate experience and the full power of REMAX\u2019s global network to every client.` } },
                { "@type": "Question", name: `Who is the best REMAX agent in ${office.city}?`, acceptedAnswer: { "@type": "Answer", text: `Barrett Henry is a top-producing Broker Associate at REMAX Collective in ${office.city} with 24+ years of real estate experience, FL Broker License #BK3313308, and designations including e-PRO, MRP, and SRS. Barrett is a REMAX Hall of Fame member.` } },
                { "@type": "Question", name: `Does REMAX ${office.city} handle commercial real estate?`, acceptedAnswer: { "@type": "Answer", text: `Yes. Through REMAX Commercial, Barrett Henry handles commercial transactions including retail, office, multifamily, industrial, and land deals in ${office.city} and the Tampa Bay area. REMAX Commercial agents have access to CoStar, LoopNet Premium, and Crexi Professional.` } },
                { "@type": "Question", name: `How does the REMAX referral network work?`, acceptedAnswer: { "@type": "Answer", text: `REMAX operates the largest agent-to-agent referral network in real estate with 145,000+ agents in 120+ countries. If you\u2019re moving to or from ${office.city}, Barrett connects you with a vetted REMAX agent at your destination through MAXRefer, the AI-powered global referral platform REMAX launched in 2025.` } },
                { "@type": "Question", name: `How do I contact REMAX in ${office.city}?`, acceptedAnswer: { "@type": "Answer", text: `Call Barrett Henry directly at (813) 733-7907 or email barrett@nowtb.com. The ${office.city} office is at ${office.address}.` } },
                { "@type": "Question", name: `Does REMAX ${office.city} help with rentals?`, acceptedAnswer: { "@type": "Answer", text: `Yes. Barrett and The NOW Team assist with both sales and rentals across ${office.city}. For full-service property management, visit vivipm.com.` } },
                { "@type": "Question", name: `What is REMAX Collective?`, acceptedAnswer: { "@type": "Answer", text: `REMAX Collective is a REMAX franchise brokerage in Tampa Bay, Florida with offices in Tampa, Largo, and Brandon. The brokerage serves the West Coast of Florida with residential, commercial, luxury, and investment real estate services.` } },
              ].slice(0, 12),
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
                { "@type": "ListItem", position: 2, name: `REMAX ${office.city}`, item: `https://nowtb.com/remax-${officeKey}` },
              ],
            },
            // RealEstateAgent — ties Barrett (the person) to THIS office location with
            // real NAP + geo. This is what search and AI engines read to answer
            // "who is the REMAX agent in Largo" and to rank the name "Barrett Henry".
            {
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "@id": `https://nowtb.com/remax-${officeKey}/#agent`,
              name: "Barrett Henry, REALTOR®",
              description: `Barrett Henry is a licensed Florida Broker Associate with REMAX Collective ${office.city}, serving ${office.county} County. 24+ years of real estate experience.`,
              url: `https://nowtb.com/remax-${officeKey}/`,
              telephone: "+1-813-733-7907",
              email: "barrett@nowtb.com",
              image: "https://nowtb.com/images/barrett-henry.jpg",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: office.address.split(",")[0],
                addressLocality: office.city,
                addressRegion: "FL",
                postalCode: office.zip,
                addressCountry: "US",
              },
              geo: { "@type": "GeoCoordinates", latitude: office.lat, longitude: office.lng },
              areaServed: office.serviceAreas.map((a) => ({
                "@type": "Place",
                name: `${a}, FL`,
              })),
              parentOrganization: { "@type": "RealEstateAgent", name: "REMAX Collective" },
              sameAs: [
                "https://barretthenry.remax.com",
                "https://vivipm.com",
                "https://hencre.com",
                "https://www.facebook.com/BarrettHenryREALTOR",
                "https://www.instagram.com/thenowteam",
                "https://www.linkedin.com/in/barretthenry",
              ],
              employee: {
                "@type": "Person",
                name: "Barrett Henry",
                jobTitle: "Broker Associate",
                image: "https://nowtb.com/images/barrett-henry.jpg",
                telephone: "+1-813-733-7907",
                email: "barrett@nowtb.com",
                worksFor: { "@type": "Organization", name: "REMAX Collective" },
                hasCredential: [
                  {
                    "@type": "EducationalOccupationalCredential",
                    credentialCategory: "license",
                    name: "Florida Real Estate Broker License #BK3313308",
                  },
                  { "@type": "EducationalOccupationalCredential", credentialCategory: "certification", name: "e-PRO" },
                  {
                    "@type": "EducationalOccupationalCredential",
                    credentialCategory: "certification",
                    name: "MRP — Military Relocation Professional",
                  },
                  {
                    "@type": "EducationalOccupationalCredential",
                    credentialCategory: "certification",
                    name: "SRS — Seller Representative Specialist",
                  },
                ],
              },
            },
          ]),
        }}
      />

      {/* ================================================================== */}
      {/* HERO — Big, bold, REMAX-branded                                    */}
      {/* ================================================================== */}
      <section className="bg-primary pt-32 pb-20">
        <div className="container-wide">
          <p className="heading-label text-white/50 mb-4">REMAX COLLECTIVE &bull; {office.county} COUNTY</p>
          <h1 className="font-heading font-extralight text-3xl md:text-5xl lg:text-6xl tracking-[0.1em] uppercase text-white mb-6">
            {office.h1 || `REMAX ${office.city}`}
          </h1>
          <p className="font-body text-white/80 text-lg md:text-xl max-w-3xl mb-4 leading-relaxed">
            {office.intro}
          </p>
          <p className="font-body text-white/60 text-sm mb-8">
            Barrett Henry, Broker Associate &bull; FL License #BK3313308 &bull; 24+ years of real estate experience
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="tel:+18137337907" className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 text-sm hover:bg-accent/90 transition-colors">
              (813) 733-7907
            </a>
            <Link href="/contact/" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors">
              Contact Barrett
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* QUICK ANSWER — direct answer up top for AI engines + skimmers      */}
      {/* Only renders for offices with researched deep content.             */}
      {/* ================================================================== */}
      {office.deep && (
        <section className="bg-accent/10 border-b border-accent/30 py-8">
          <div className="container-wide max-w-3xl">
            <p className="heading-label mb-3">THE SHORT ANSWER</p>
            <p className="font-body text-primary text-base md:text-lg leading-relaxed">
              {office.deep.quickAnswer}
            </p>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* OFFICE PHOTO + BARRETT INFO                                        */}
      {/* ================================================================== */}
      <section className="section-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Office building photo */}
            <div>
              <Image src={office.image} alt={`REMAX Collective ${office.city} Office — ${office.address}`} width={800} height={500} className="w-full h-auto" />
              <p className="font-body text-muted text-xs mt-3">REMAX Collective {office.city} &mdash; {office.address}</p>
            </div>
            {/* Barrett info + contact */}
            <div>
              <p className="heading-label mb-4">Your REMAX {office.city} Agent</p>
              <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary mb-6">
                Barrett Henry, Broker Associate
              </h2>
              <div className="font-body text-muted font-light space-y-4 leading-relaxed">
                <p>
                  <strong>Barrett Henry</strong> is a licensed Florida Real Estate <strong>Broker Associate</strong> with
                  REMAX Collective. With <strong>24+ years of real estate experience</strong>, Barrett brings deep market
                  knowledge, strong negotiation skills, and a no-nonsense approach to every transaction. Barrett is a
                  <strong> REMAX Hall of Fame</strong> member and holds the <strong>e-PRO</strong>, <strong>MRP</strong> (Military
                  Relocation Professional), and <strong>SRS</strong> (Seller Representative Specialist) designations.
                </p>
                <p>
                  Every client gets Barrett&apos;s direct cell phone number. No call centers. No runaround. No being
                  handed off to a junior agent. Whether you&apos;re buying your first home, selling a property, investing
                  in rental income, or relocating to {office.city}, Barrett and <strong>The NOW Team</strong> deliver results.
                </p>
              </div>
              <div className="mt-6 space-y-2 font-body text-sm text-muted">
                <p><strong>Office:</strong> {office.address}</p>
                <p><strong>Direct:</strong> <a href="tel:+18137337907" className="text-link hover:underline">(813) 733-7907</a></p>
                <p><strong>Email:</strong> <a href="mailto:barrett@nowtb.com" className="text-link hover:underline">barrett@nowtb.com</a></p>
                <p><strong>License:</strong> FL Broker #BK3313308</p>
                <p><strong>Designations:</strong> e-PRO, MRP, SRS</p>
                <p><strong>Career Award:</strong> REMAX Hall of Fame</p>
              </div>
              <div className="mt-6">
                <a href={office.mapLink} target="_blank" rel="noopener noreferrer" className="font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors">
                  Open in Google Maps &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* WHY CHOOSE REMAX — Global brand power                              */}
      {/* ================================================================== */}
      <section className="section-light">
        <div className="container-wide">
          <p className="heading-label text-center mb-4">THE WORLD&apos;S MOST RECOGNIZED REAL ESTATE BRAND</p>
          <h2 className="font-heading font-extralight text-2xl md:text-4xl tracking-[0.08em] uppercase text-primary text-center mb-6">
            Why REMAX {office.city}?
          </h2>
          <p className="font-body text-muted font-light text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            When you work with Barrett Henry at REMAX {office.city}, you get more than a local agent. You get the full
            power of the most recognized real estate brand on the planet &mdash; a network that spans 120+ countries,
            145,000+ agents, and over 50 years of proven results.
          </p>

          {/* Stats grid — hard numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-white border border-gray-100">
              <p className="font-heading font-bold text-3xl md:text-4xl text-primary">120+</p>
              <p className="font-body text-muted text-sm mt-2">Countries &amp; Territories</p>
            </div>
            <div className="text-center p-6 bg-white border border-gray-100">
              <p className="font-heading font-bold text-3xl md:text-4xl text-primary">145K+</p>
              <p className="font-body text-muted text-sm mt-2">Agents Worldwide</p>
            </div>
            <div className="text-center p-6 bg-white border border-gray-100">
              <p className="font-heading font-bold text-3xl md:text-4xl text-primary">8,500+</p>
              <p className="font-body text-muted text-sm mt-2">Offices Globally</p>
            </div>
            <div className="text-center p-6 bg-white border border-gray-100">
              <p className="font-heading font-bold text-3xl md:text-4xl text-primary">50+</p>
              <p className="font-body text-muted text-sm mt-2">Years in Business</p>
            </div>
          </div>

          {/* Two-column: brand story + city-specific reasons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — REMAX brand story */}
            <div>
              <h3 className="font-heading font-bold text-xl text-primary mb-4">The REMAX Advantage</h3>
              <div className="font-body text-muted font-light space-y-4 leading-relaxed">
                <p>
                  REMAX was founded in 1973 by Dave and Gail Liniger in Denver, Colorado, on a simple idea: attract the
                  best agents by letting them keep more of what they earn. That model attracted top producers from
                  day one, and it still does. REMAX agents aren&apos;t beginners learning on your dime &mdash; they&apos;re
                  experienced professionals who chose REMAX because they&apos;re serious about their careers.
                </p>
                <p>
                  The numbers prove it. <strong>REMAX agents averaged 11.7 transaction sides in 2025, versus 5.4
                  for agents at competing large brokerages</strong> &mdash; more than double. That is not marketing spin:
                  it is <strong>18 consecutive years</strong> of independently verified data, drawn from the 2026
                  RealTrends Verified brokerage rankings covering U.S. brokerages that closed 500 or more sides.
                </p>
                <p>
                  American shoppers voted REMAX the <strong>most trusted real estate agency brand</strong> in the
                  BrandSpark American Trust Study &mdash; published with Newsweek as the Most Trusted Awards &mdash; for
                  <strong>four years (2022&ndash;2025)</strong>, plus 2019. The 2025 study surveyed 29,420 U.S.
                  participants. REMAX also leads on <strong>32.9% unaided brand awareness</strong>, meaning more people
                  name REMAX first, without prompting, than any other real estate company (MMR Strategy Group study of
                  unaided awareness, 2025 data). Your listing gets noticed.
                </p>
              </div>
            </div>
            {/* Right — Why THIS office specifically */}
            <div>
              <h3 className="font-heading font-bold text-xl text-primary mb-4">Why REMAX {office.city} Specifically</h3>
              <ul className="space-y-4">
                {office.whyThisOffice.map((reason, i) => (
                  <li key={i} className="flex gap-3 font-body text-muted font-light leading-relaxed">
                    <span className="text-accent font-bold text-lg mt-0.5 flex-shrink-0">&bull;</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-6 bg-primary text-white">
                <p className="font-heading font-bold text-lg mb-2">Areas We Serve from {office.city}</p>
                <p className="font-body text-white/70 text-sm leading-relaxed">
                  {office.serviceAreas.join(" \u2022 ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* THE REMAX BALLOON — Brand history + recognition                    */}
      {/* ================================================================== */}
      <section className="section-dark">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="heading-label text-white/50 mb-4">ABOVE THE CROWD SINCE 1978</p>
              <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-white mb-6">
                The Most Recognized Logo in Real Estate
              </h2>
              <div className="font-body text-white/80 font-light space-y-4 leading-relaxed">
                <p>
                  The REMAX hot air balloon first appeared at the 1978 Albuquerque International Balloon Fiesta
                  and became the company&apos;s official logo shortly after. The balloon represents what REMAX agents
                  do every day: rise above the crowd. It&apos;s not just a logo &mdash; it&apos;s the most recognized
                  symbol in real estate worldwide.
                </p>
                <p>
                  Roughly <strong>8 out of 10 U.S. homebuyers and sellers know of REMAX</strong>, and REMAX operates
                  the <strong>largest hot air balloon fleet in the world</strong> &mdash; about 106 balloons. No other
                  real estate company comes close to that kind of global visibility.
                </p>
                <p>
                  When your home is listed with a REMAX agent, buyers recognize the brand immediately. That
                  recognition translates to trust, and trust translates to more showings, stronger offers, and
                  faster sales. In {office.city}, that brand power works for you from the moment the sign goes in
                  the yard.
                </p>
              </div>
            </div>
            {/* Right — recognition stats */}
            <div className="space-y-6">
              <div className="border border-white/10 p-6">
                <p className="font-heading font-bold text-4xl text-accent mb-2">8 in 10</p>
                <p className="font-body text-white/70 text-sm">U.S. homebuyers and sellers know of REMAX &mdash; MMR Strategy Group</p>
              </div>
              <div className="border border-white/10 p-6">
                <p className="font-heading font-bold text-4xl text-accent mb-2">32.9%</p>
                <p className="font-body text-white/70 text-sm">unaided brand awareness &mdash; more people name REMAX first than any competitor</p>
              </div>
              <div className="border border-white/10 p-6">
                <p className="font-heading font-bold text-4xl text-accent mb-2">#1</p>
                <p className="font-body text-white/70 text-sm">Most trusted real estate agency brand &mdash; BrandSpark American Trust Study, 2022&ndash;2025</p>
              </div>
              <div className="border border-white/10 p-6">
                <p className="font-heading font-bold text-4xl text-accent mb-2">106</p>
                <p className="font-body text-white/70 text-sm">hot air balloons worldwide &mdash; the largest balloon fleet on earth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* AGENT PRODUCTIVITY — REMAX agents outperform 2:1                   */}
      {/* ================================================================== */}
      <section className="section-white">
        <div className="container-wide">
          <p className="heading-label text-center mb-4">PROVEN RESULTS, NOT PROMISES</p>
          <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary text-center mb-6">
            REMAX Agents Outperform the Competition 2-to-1
          </h2>
          <p className="font-body text-muted font-light text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            For 18 consecutive years, REMAX agents have sold more real estate per agent than agents at
            competing national brands. These aren&apos;t REMAX&apos;s numbers &mdash; they come from the
            independently compiled RealTrends Verified brokerage rankings.
          </p>

          {/* Comparison table — AI loves extracting this */}
          <div className="max-w-2xl mx-auto mb-12">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="text-left py-3 font-heading font-bold text-primary">Metric</th>
                  <th className="text-center py-3 font-heading font-bold text-primary">REMAX Agent</th>
                  <th className="text-center py-3 font-heading font-bold text-primary">Industry Avg</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-muted">Transaction sides per agent (2025)</td>
                  <td className="py-3 text-center font-bold text-primary">11.7</td>
                  <td className="py-3 text-center text-muted">5.4</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-muted">Sales volume per agent (2025)</td>
                  <td className="py-3 text-center font-bold text-primary">$5.3M</td>
                  <td className="py-3 text-center text-muted">$3.2M</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-muted">Unaided brand awareness</td>
                  <td className="py-3 text-center font-bold text-primary">32.9%</td>
                  <td className="py-3 text-center text-muted">Varies</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted">Countries / territories</td>
                  <td className="py-3 text-center font-bold text-primary">120+</td>
                  <td className="py-3 text-center text-muted">Varies</td>
                </tr>
              </tbody>
            </table>
            <p className="font-body text-muted/60 text-xs mt-4">Sources: transaction sides and sales volume per agent from the 2026 RealTrends Verified brokerage rankings (2025 data, U.S. brokerages closing 500+ sides / $350M+). Unaided brand awareness from MMR Strategy Group. Country count from REMAX Holdings, as of December 31, 2025.</p>
          </div>

          <div className="font-body text-muted font-light space-y-4 leading-relaxed max-w-3xl mx-auto">
            <p>
              Why do REMAX agents outproduce everyone else? Because the REMAX model attracts top talent.
              REMAX agents pay their own way &mdash; they cover desk fees and overhead rather than splitting
              commissions with the brokerage. That structure attracts driven, experienced professionals who
              don&apos;t need hand-holding. They choose REMAX because they want the brand, the tools, and the
              referral network &mdash; not because they need a broker to find them business.
            </p>
            <p>
              That&apos;s the agent you want in your corner. In {office.city}, Barrett Henry embodies that REMAX
              standard: 24+ years of real estate experience, a REMAX Hall of Fame member, and a track record of getting
              deals done in every market condition.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* REMAX GLOBAL REFERRAL NETWORK                                      */}
      {/* ================================================================== */}
      <section className="section-light">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="heading-label mb-4">145,000+ AGENTS IN 120+ COUNTRIES</p>
              <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary mb-6">
                The REMAX Referral Network
              </h2>
              <div className="font-body text-muted font-light space-y-4 leading-relaxed">
                <p>
                  Moving to {office.city} from out of state? Relocating from {office.city} to another city &mdash; or
                  another country? REMAX operates the largest agent-to-agent referral network in the real estate
                  industry. With <strong>145,000+ agents in 120+ countries</strong>, Barrett can connect you with a
                  vetted, experienced REMAX agent at your destination &mdash; or receive a referral from an agent
                  who&apos;s sending their client your way.
                </p>
                <p>
                  The REMAX referral platform, <strong>MAXRefer</strong>, launched in 2025 and is AI-powered. It
                  matches agents based on location, specialties, production history, and client needs. It&apos;s not a
                  random assignment &mdash; it&apos;s a data-driven match designed to pair your needs with the right
                  agent. Separately, REMAX&apos;s global listing site publishes properties in 50 languages and 72
                  currencies, which matters when your buyer is overseas.
                </p>
                <p>
                  {office.referralAngle}
                </p>
              </div>
            </div>
            <div className="bg-primary p-8 lg:p-12">
              <h3 className="font-heading font-bold text-xl text-white mb-6">How REMAX Referrals Work</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="font-heading font-bold text-2xl text-accent flex-shrink-0">1</span>
                  <div>
                    <p className="font-body text-white font-medium mb-1">You Tell Barrett Where You&apos;re Going</p>
                    <p className="font-body text-white/70 text-sm">Moving to Denver? London? Across town? Barrett identifies the right agent for your destination.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-heading font-bold text-2xl text-accent flex-shrink-0">2</span>
                  <div>
                    <p className="font-body text-white font-medium mb-1">Barrett Connects You Directly</p>
                    <p className="font-body text-white/70 text-sm">Through MAXRefer, Barrett matches you with a vetted REMAX agent who specializes in your destination market.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-heading font-bold text-2xl text-accent flex-shrink-0">3</span>
                  <div>
                    <p className="font-body text-white font-medium mb-1">You&apos;re Taken Care Of — Anywhere</p>
                    <p className="font-body text-white/70 text-sm">Your referred agent knows you came from Barrett. You get VIP treatment because your agent&apos;s reputation is on the line.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CITY MARKET CONTEXT                                                */}
      {/* ================================================================== */}
      <section className="section-white">
        <div className="container-wide max-w-3xl">
          <p className="heading-label mb-4">LOCAL MARKET EXPERTISE</p>
          <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary mb-6">
            The {office.city} Real Estate Market
          </h2>
          <div className="font-body text-muted font-light space-y-4 leading-relaxed">
            <p>{office.marketContext}</p>
            <p>
              Barrett Henry doesn&apos;t just list homes in {office.city} &mdash; he knows the inventory, the comps,
              the school zones, the flood maps, the HOA restrictions, and the price trends block by block. That&apos;s
              the difference between a REMAX Broker Associate with 24+ years of real estate experience and an agent who
              just got their license last year.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* LOCAL REALITIES — the rules and costs that actually decide deals   */}
      {/* This is the substance: flood rules, insurance, taxes, condo law.   */}
      {/* ================================================================== */}
      {office.deep && (
        <section className="section-light">
          <div className="container-wide max-w-3xl">
            <p className="heading-label mb-4">BEFORE YOU BUY OR SELL HERE</p>
            <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary mb-6">
              What {office.city} Buyers and Sellers Need to Know
            </h2>
            <p className="font-body text-muted font-light leading-relaxed mb-10">
              {office.county} County has rules that do not apply in most of the country. These are the
              ones that change what a property is worth, what you can do with it, and what it costs to
              own. Skip them and you find out the expensive way, usually after the inspection period has
              already closed.
            </p>

            <div className="space-y-10">
              {office.deep.realities.map((item) => (
                <div key={item.heading}>
                  <h3 className="font-heading font-bold text-lg md:text-xl text-primary mb-3">
                    {item.heading}
                  </h3>
                  <div className="font-body text-muted font-light space-y-3 leading-relaxed">
                    {item.body.map((para, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                    ))}
                  </div>
                  {item.takeaway && (
                    <p className="mt-4 border-l-2 border-accent bg-white px-4 py-3 font-body text-sm text-primary">
                      <strong>Bottom line:</strong> {item.takeaway}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Mid-page CTA at a natural decision point */}
            <div className="mt-12 bg-primary p-8">
              <h3 className="font-heading font-bold text-xl text-white mb-2">
                Not sure how any of this applies to your property?
              </h3>
              <p className="font-body text-white/70 text-sm leading-relaxed mb-6">
                Send Barrett the address. He will pull the flood zone, the assessed value, the permit
                history, and the comps, then tell you straight what it means for your plans &mdash; no
                obligation and no sales pitch.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:+18137337907"
                  className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 text-sm hover:bg-accent/90 transition-colors"
                >
                  Call (813) 733-7907
                </a>
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors"
                >
                  Send the Address
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* COMPARISON TABLE — AI engines extract tabular data readily         */}
      {/* ================================================================== */}
      {office.deep?.comparison && (
        <section className="section-white">
          <div className="container-wide max-w-4xl">
            <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary mb-6">
              {office.deep.comparison.heading}
            </h2>
            <p className="font-body text-muted font-light leading-relaxed mb-8">
              {office.deep.comparison.intro}
            </p>
            {/* Wide tables must scroll inside their own container, never the page body */}
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm min-w-[560px]">
                <thead>
                  <tr className="border-b-2 border-primary">
                    {office.deep.comparison.headers.map((h) => (
                      <th key={h} className="text-left py-3 pr-4 font-heading font-bold text-primary">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {office.deep.comparison.rows.map((row) => (
                    <tr key={row[0]} className="border-b border-gray-100 align-top">
                      {row.map((cell, i) => (
                        <td
                          key={i}
                          className={`py-3 pr-4 ${i === 0 ? "font-medium text-primary" : "text-muted"}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {office.deep.comparison.note && (
              <p className="font-body text-muted/60 text-xs mt-4">{office.deep.comparison.note}</p>
            )}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* NEIGHBORHOODS — real, verified named areas                         */}
      {/* ================================================================== */}
      {office.deep && office.deep.neighborhoods.length > 0 && (
        <section className="section-light">
          <div className="container-wide max-w-4xl">
            <p className="heading-label mb-4">NEIGHBORHOOD BY NEIGHBORHOOD</p>
            <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary mb-6">
              Where People Actually Buy in {office.city}
            </h2>
            <p className="font-body text-muted font-light leading-relaxed mb-10">
              {office.city} is not one market. Build era, elevation, lot size, and whether a
              neighborhood carries HOA dues change the real cost of ownership block by block. Every
              figure below &mdash; median sale price, days on market, HOA dues, square footage, pool
              rate &mdash; comes from <strong>Stellar MLS closed sales in {office.city} over the
              trailing twelve months</strong>, with rental records and manufactured housing excluded.
              These are measured, not guessed, and they will shift as the market does.
            </p>
            <p className="font-body text-muted font-light leading-relaxed mb-10">
              One caveat that matters more here than almost anywhere: these are grouped by
              <strong> {office.city} mailing address</strong>, because that is how buyers search and how
              the MLS files them. A {office.city} mailing address does not always mean the parcel sits
              inside {office.city} city limits &mdash; several of the best-known names below are legally
              in unincorporated county. We flag those individually, because the distinction changes your
              permits, your floodplain rules, and your tax bill.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {office.deep.neighborhoods.map((n) => (
                <div key={n.name} className="border-l-2 border-accent/40 pl-4">
                  <h3 className="font-heading font-bold text-base text-primary mb-1">{n.name}</h3>
                  <p className="font-body text-muted text-sm font-light leading-relaxed">{n.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* REMAX COMMERCIAL                                                   */}
      {/* ================================================================== */}
      <section className="section-dark">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="heading-label text-white/50 mb-4">REMAX COMMERCIAL</p>
              <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-white mb-6">
                Commercial Real Estate in {office.city}
              </h2>
              <div className="font-body text-white/80 font-light space-y-4 leading-relaxed">
                <p>
                  REMAX Commercial has been part of the REMAX network since 1990. In 2023, REMAX Commercial
                  practitioners closed <strong>more than $17.5 billion</strong> in volume across 60,000+ commercial
                  transaction sides, through 11,000+ commercial brokers in 640+ offices. REMAX Commercial agents have access to
                  institutional-grade tools including <strong>CoStar</strong>, <strong>LoopNet Premium</strong>,
                  <strong> Crexi Professional</strong>, and <strong>Catylist</strong> &mdash; the same platforms used by
                  the largest commercial brokerages in the world.
                </p>
                <p>{office.commercialNote}</p>
              </div>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white mb-6">Commercial Property Types</h3>
              <div className="grid grid-cols-2 gap-4">
                {["Retail", "Office", "Multifamily", "Industrial", "Land", "Special Use"].map((type) => (
                  <div key={type} className="border border-white/10 p-4 text-center">
                    <p className="font-body text-white/90 font-medium text-sm">{type}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <a href="tel:+18137337907" className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 text-sm hover:bg-accent/90 transition-colors">
                  Discuss a Commercial Deal &mdash; (813) 733-7907
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* REMAX TRAINING & DESIGNATIONS                                      */}
      {/* ================================================================== */}
      <section className="section-white">
        <div className="container-wide">
          <p className="heading-label text-center mb-4">EDUCATION &amp; CREDENTIALS</p>
          <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary text-center mb-6">
            REMAX Agents Are the Most Trained in the Industry
          </h2>
          <p className="font-body text-muted font-light text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            REMAX University offers 60+ relevant designations, certifications, and courses plus over 2,000
            on-demand videos. In a REMAX study of 3,000 U.S. agents recruited between January 2021 and March 2024,
            new agents who engaged with REMAX University closed <strong>60% more transactions</strong> and earned
            <strong>145% more in commissions</strong> from their first year to their second. Barrett Henry holds
            multiple industry designations that directly benefit his clients.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8 bg-gray-50">
              <p className="font-heading font-bold text-lg text-primary mb-2">e-PRO</p>
              <p className="font-body text-muted text-sm font-light">
                Certified in digital marketing, social media strategy, and technology-driven real estate.
                Barrett leverages online tools to market your property to the widest possible audience.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-50">
              <p className="font-heading font-bold text-lg text-primary mb-2">MRP</p>
              <p className="font-body text-muted text-sm font-light">
                Military Relocation Professional. Trained to serve active-duty military, veterans, and
                their families during PCS moves. Barrett understands VA loans, BAH, and military timelines.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-50">
              <p className="font-heading font-bold text-lg text-primary mb-2">SRS</p>
              <p className="font-body text-muted text-sm font-light">
                Seller Representative Specialist. Advanced training in listing presentations, pricing
                strategy, and seller advocacy. Your interests come first, every step of the way.
              </p>
            </div>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <h3 className="font-heading font-bold text-xl text-primary mb-4 text-center">REMAX Career Awards</h3>
            <div className="font-body text-muted font-light space-y-3 leading-relaxed">
              <p>
                REMAX recognizes top-producing agents through a tiered award system based on gross commission income.
                The club levels below are annual commission tiers; Hall of Fame and the awards above it are career totals.
                Thresholds are administered regionally, so exact figures can vary by region.
                Barrett Henry is a <strong>REMAX Hall of Fame</strong> member &mdash; an honor reserved for agents who
                have earned $1 million+ in gross commissions during their REMAX career. Here&apos;s how the award
                levels work:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {[
                  { name: "Executive Club", range: "$50K–$99K" },
                  { name: "100% Club", range: "$100K–$249K" },
                  { name: "Platinum Club", range: "$250K–$499K" },
                  { name: "Chairman\u2019s Club", range: "$500K–$749K" },
                  { name: "Titan Club", range: "$750K–$999K" },
                  { name: "Diamond Club", range: "$1M–$1.99M" },
                  { name: "Pinnacle Club", range: "$2M+" },
                  { name: "Hall of Fame", range: "$1M+ career" },
                ].map((award) => (
                  <div key={award.name} className="border border-gray-100 p-3 text-center">
                    <p className="font-heading font-bold text-sm text-primary">{award.name}</p>
                    <p className="font-body text-muted text-xs">{award.range}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* THE REMAX COLLECTION — LUXURY                                      */}
      {/* ================================================================== */}
      <section className="section-light">
        <div className="container-wide max-w-3xl">
          <p className="heading-label mb-4">LUXURY REAL ESTATE</p>
          <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary mb-6">
            The REMAX Collection
          </h2>
          <div className="font-body text-muted font-light space-y-4 leading-relaxed">
            <p>
              <strong>The REMAX Collection</strong> is REMAX&apos;s luxury division, reserved for properties priced at
              two times or more the average sold price in the listing area. In {office.city} and the Tampa Bay
              market, that means waterfront estates, golf course properties, gated community homes, and
              high-rise condos that command premium pricing.
            </p>
            <p>
              REMAX Collection listings receive elevated marketing: professional photography, dedicated luxury
              property websites, international exposure through REMAX&apos;s global network, and placement on
              luxury-specific portals that attract high-net-worth buyers. Barrett Henry brings the same
              attention to detail and negotiation skill to luxury transactions that he does to every deal.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* LISTINGS — Active homes for sale near this office                   */}
      {/* ================================================================== */}
      {listings.length > 0 && (
        <ListingGrid
          listings={listings}
          title={`Homes for Sale in ${office.city}`}
          subtitle={`Latest active listings near the REMAX Collective ${office.city} office. Updated daily from Stellar MLS.`}
        />
      )}

      {/* ================================================================== */}
      {/* TESTIMONIALS                                                       */}
      {/* ================================================================== */}
      <section className="section-dark">
        <div className="container-wide">
          <p className="heading-label text-white/50 text-center mb-4">CLIENT REVIEWS</p>
          <h2 className="heading-section text-xl text-white text-center mb-12">What Clients Say About Barrett at REMAX {office.city}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((t) => (
              <div key={t.name} className="border border-white/10 p-8">
                <p className="text-accent text-lg mb-4">★★★★★</p>
                <p className="font-body text-white/80 font-light text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <p className="font-body text-white font-medium text-sm">{t.name}</p>
                <p className="font-body text-white/40 text-xs">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* OTHER OFFICES — Cross-linking                                      */}
      {/* ================================================================== */}
      <section className="section-white">
        <div className="container-wide">
          <p className="heading-label text-center mb-4">3 TAMPA BAY LOCATIONS</p>
          <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary text-center mb-8">
            REMAX Collective Offices
          </h2>
          <p className="font-body text-muted font-light text-center max-w-2xl mx-auto mb-10">
            Barrett Henry serves all of Tampa Bay from three REMAX Collective office locations. No matter where
            your property is, Barrett is never more than a short drive away.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Current office — highlighted */}
            <div className="border-2 border-accent p-6 text-center bg-accent/5">
              <p className="font-heading font-bold text-lg text-primary mb-1">REMAX Collective {office.city}</p>
              <p className="font-body text-muted text-sm font-light mb-2">{office.address}</p>
              <p className="font-body text-accent text-xs font-bold uppercase tracking-wider">You Are Here</p>
            </div>
            {/* Other two offices — full name + address */}
            {office.otherOffices.map((other) => {
              const otherData = OFFICES[other.key];
              return (
                <Link key={other.key} href={`/remax-${other.key}/`} className="border border-gray-200 p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors">
                  <p className="font-heading font-bold text-lg text-primary mb-1">REMAX Collective {other.city}</p>
                  <p className="font-body text-muted text-sm font-light mb-2">{otherData.address}</p>
                  <p className="font-body text-accent text-xs tracking-[0.15em] uppercase">View REMAX {other.city} &rarr;</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* RESOURCE HUB — links to the real local guides already on the site  */}
      {/* ================================================================== */}
      {office.deep && office.deep.resources.length > 0 && (
        <section className="section-light">
          <div className="container-wide max-w-5xl">
            <p className="heading-label mb-4">FREE {office.city.toUpperCase()} RESOURCES</p>
            <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary mb-6">
              Keep Reading &mdash; {office.city} Guides
            </h2>
            <p className="font-body text-muted font-light leading-relaxed mb-10">
              Every guide below was written for this market specifically. No gates, no email required.
              Read what you need and call when you want a second opinion on your own situation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {office.deep.resources.map((group) => (
                <div key={group.group}>
                  {/* <p> not <h3> — these are nav labels, not content headings */}
                  <p className="font-heading font-bold text-sm uppercase tracking-wider text-primary mb-3 pb-2 border-b border-gray-200">
                    {group.group}
                  </p>
                  <ul className="space-y-2">
                    {group.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="font-body text-sm text-link hover:underline font-light leading-snug"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* FAQ — Comprehensive, REMAX-focused                                 */}
      {/* ================================================================== */}
      <section className="section-light">
        <div className="container-wide max-w-3xl">
          <h2 className="font-heading font-bold text-2xl text-primary mb-8">Frequently Asked Questions &mdash; REMAX {office.city}</h2>
          <div className="space-y-6">
            {/* Local, market-specific questions first — these are what people actually search */}
            {office.deep?.localFaqs.map((f) => (
              <div key={f.q} className="border-b border-gray-200 pb-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-2">{f.q}</h3>
                <p
                  className="font-body text-muted font-light"
                  dangerouslySetInnerHTML={{ __html: f.a }}
                />
              </div>
            ))}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Where is the REMAX office in {office.city}?</h3>
              <p className="font-body text-muted font-light">The REMAX Collective {office.city} office is at <strong>{office.address}</strong>. Barrett Henry is a Broker Associate at this location. Call <a href="tel:+18137337907" className="text-link hover:underline">(813) 733-7907</a> to schedule an appointment or just walk in.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Why should I choose REMAX over other brokerages in {office.city}?</h3>
              <p className="font-body text-muted font-light">REMAX is the most recognized real estate brand in the world, operating in 120+ countries with 145,000+ agents. REMAX agents averaged 11.7 transaction sides in 2025 versus 5.4 for agents at competing large brokerages &mdash; more than double, per the 2026 RealTrends Verified rankings. When you list with REMAX, your property benefits from global brand recognition, the largest referral network in real estate, and an agent (Barrett Henry) with 24+ years of real estate experience.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Who is the best REMAX agent in {office.city}?</h3>
              <p className="font-body text-muted font-light">Barrett Henry is a top-producing Broker Associate and REMAX Hall of Fame member at REMAX Collective in {office.city}. With 24+ years of real estate experience, FL Broker License #BK3313308, and designations including e-PRO, MRP, and SRS, Barrett has the credentials and track record that matter.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Does REMAX {office.city} handle commercial real estate?</h3>
              <p className="font-body text-muted font-light">Yes. Through REMAX Commercial, Barrett handles commercial transactions including retail, office, multifamily, industrial, and land deals in {office.city} and the Tampa Bay area. REMAX Commercial agents have access to CoStar, LoopNet Premium, and Crexi Professional.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">How does the REMAX referral network help me?</h3>
              <p className="font-body text-muted font-light">Moving to or from {office.city}? Barrett connects you with a vetted REMAX agent at your destination through MAXRefer, the AI-powered global referral platform REMAX launched in 2025, spanning a network present in 120+ countries and territories. You get a warm introduction to a trusted agent &mdash; not a random name from a search engine.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">What is the REMAX balloon?</h3>
              <p className="font-body text-muted font-light">The REMAX hot air balloon is the most recognized logo in real estate. It debuted at the 1978 Albuquerque Balloon Fiesta and represents the REMAX motto: &ldquo;Above the Crowd.&rdquo; REMAX operates about 106 hot air balloons &mdash; the largest balloon fleet in the world. Roughly 8 out of 10 U.S. homebuyers and sellers know of REMAX.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">How do I contact REMAX in {office.city}?</h3>
              <p className="font-body text-muted font-light">Call Barrett Henry directly at <a href="tel:+18137337907" className="text-link hover:underline">(813) 733-7907</a> or email <a href="mailto:barrett@nowtb.com" className="text-link hover:underline">barrett@nowtb.com</a>. The {office.city} office is at {office.address}.</p>
            </div>
            <div className="pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Does REMAX {office.city} help with rentals and property management?</h3>
              <p className="font-body text-muted font-light">Yes. Barrett and The NOW Team assist with both sales and rentals across {office.city} and the Tampa Bay area. For full-service property management, visit <a href="https://vivipm.com" target="_blank" rel="noopener noreferrer" className="text-link hover:underline">vivipm.com</a> (ViVi PM).</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SOURCES — every figure above traces back to a named source         */}
      {/* ================================================================== */}
      {office.deep && office.deep.sources.length > 0 && (
        <section className="section-white border-t border-gray-100">
          <div className="container-wide max-w-3xl">
            {/* <p> not a heading — this is a reference list, not a content section */}
            <p className="font-heading font-bold text-sm uppercase tracking-wider text-primary mb-4">
              Sources &amp; Where to Verify This Yourself
            </p>
            <ul className="space-y-2">
              {office.deep.sources.map((s) => (
                <li key={s.href} className="font-body text-xs text-muted font-light leading-relaxed">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link hover:underline"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="font-body text-muted/60 text-xs mt-6 leading-relaxed">
              Market figures move month to month and the rules above get amended by the Florida
              Legislature and by local ordinance. Everything here was accurate when published, but
              verify anything you are relying on for a transaction &mdash; or call Barrett and he will
              confirm the current numbers for your specific property. Nothing on this page is legal,
              tax, or insurance advice.
            </p>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* CONTACT FORM                                                       */}
      {/* ================================================================== */}
      <section className="section-white">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl text-primary mb-2 text-center">Contact REMAX {office.city}</h2>
          <p className="font-body text-muted text-center mb-8">
            Reach Barrett Henry at the {office.city} office. Call <a href="tel:+18137337907" className="text-link hover:underline">(813) 733-7907</a> or send a message below.
          </p>
          <ContactForm webhookUrl="/api/contact" source={`remax-${officeKey}`} />
        </div>
      </section>

      {/* ================================================================== */}
      {/* BOTTOM CTA BAR                                                     */}
      {/* ================================================================== */}
      <section className="bg-primary py-12">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-white mb-1">
              Ready to Work with REMAX {office.city}?
            </h2>
            <p className="font-body text-white/70 text-sm">
              Barrett Henry, Broker Associate &bull; REMAX Hall of Fame &bull; 24+ years of real estate experience
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 text-sm hover:bg-accent/90 transition-colors"
            >
              Call Now
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
