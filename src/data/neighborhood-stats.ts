// neighborhood-stats.ts
// Structured data for key Valrico/Brandon/Riverview neighborhoods.
// Used to power stats strips, school info, commute tables, HOA notes,
// comparison tables, and FAQ sections on neighborhood detail pages.
// DO NOT invent data — every field here must match verified source data.

export interface NeighborhoodStat {
  // Key stats strip
  priceRange: string;        // e.g. "$300K–$500K"
  zip: string;               // e.g. "33596"
  totalHomes?: string;       // e.g. "5,200+"
  yearBuilt?: string;        // e.g. "1980s–2000s"
  gated?: boolean;
  communityPool?: boolean;
  golf?: boolean;

  // Schools
  highSchool: string;        // e.g. "Bloomingdale HS"
  highSchoolRating?: string; // e.g. "A-rated, 8/10"
  middleSchool?: string;
  elementarySchools?: string[];
  schoolNote?: string;       // e.g. "Zoning varies by address"

  // Commute times
  commutes: { destination: string; distance: string; time: string }[];

  // HOA
  hoaRequired: "yes" | "no" | "varies";
  hoaRange?: string;         // e.g. "$50–$200/mo"
  hoaNote?: string;
  cdd?: boolean;

  // Comparison with nearby neighborhoods
  comparisons: { name: string; slug: string; price: string; distinction: string }[];

  // Target buyers
  idealFor: string[];

  // FAQ — natural Q&A pairs, answers 2-3 sentences max
  faqs: { question: string; answer: string }[];

  // Amenities highlights
  amenities?: string[];
}

export const NEIGHBORHOOD_STATS: Record<string, NeighborhoodStat> = {

  // ─── Bloomingdale ──────────────────────────────────────────────────────────
  "bloomingdale-community": {
    priceRange: "$300K–$500K",
    zip: "33596",
    totalHomes: "5,200+",
    yearBuilt: "1980s–2000s",
    gated: false,
    communityPool: false,
    golf: false,

    highSchool: "Bloomingdale HS",
    highSchoolRating: "A-rated, 8/10",
    middleSchool: "Burns Middle",
    elementarySchools: ["Alafia Elementary", "Cimino Elementary", "Brooker Elementary"],

    commutes: [
      { destination: "I-75 on-ramp",       distance: "~6 mi",  time: "12–15 min" },
      { destination: "Downtown Tampa",      distance: "~20 mi", time: "28–40 min" },
      { destination: "MacDill AFB",         distance: "~24 mi", time: "35–45 min" },
      { destination: "Brandon Town Center", distance: "~5 mi",  time: "10–15 min" },
      { destination: "Tampa Airport",       distance: "~27 mi", time: "35–45 min" },
    ],

    hoaRequired: "varies",
    hoaRange: "$50–$200/mo",
    hoaNote: "Roughly half of Bloomingdale sub-neighborhoods have a mandatory HOA. Several sections have no HOA at all.",

    comparisons: [
      { name: "Buckhorn",          slug: "buckhorn-bloomingdale", price: "$350K–$500K",   distinction: "Newsome HS zone" },
      { name: "Brentwood Hills",   slug: "brentwood-hills",       price: "$340K–$475K",   distinction: "Community pool included" },
      { name: "River Hills",       slug: "river-hills",           price: "$500K–$1M+",    distinction: "Gated golf community" },
      { name: "Bloomingdale Oaks", slug: "bloomingdale-oaks",     price: "$350K–$475K",   distinction: "Popular sub-section of Bloomingdale" },
    ],

    idealFor: [
      "Families wanting Bloomingdale HS",
      "Buyers wanting mature lots and established trees",
      "First-time buyers in a strong school zone",
      "Buyers seeking no-HOA options",
      "MacDill military families",
    ],

    amenities: [
      "Lithia Springs Park nearby",
      "Alafia River State Park access",
      "Bloomingdale Ave shopping corridor",
    ],

    faqs: [
      {
        question: "What is the price range in Bloomingdale?",
        answer: "Homes in Bloomingdale typically sell between $300K and $500K, depending on size, lot, and sub-neighborhood. The community's 5,200+ homes span a wide range of styles and price points built from the 1980s through the 2000s.",
      },
      {
        question: "What schools serve Bloomingdale?",
        answer: "Most Bloomingdale addresses are zoned for Bloomingdale High School (A-rated, 8/10), Burns Middle, and one of Alafia, Cimino, or Brooker Elementary. Always verify zoning by exact address with Hillsborough County Schools.",
      },
      {
        question: "Is HOA required in Bloomingdale?",
        answer: "It depends on the sub-neighborhood. About half of Bloomingdale's sections have a mandatory HOA ranging from $50–$200/mo, while others have no HOA at all — making it one of the few large communities where HOA-free homes are still available.",
      },
      {
        question: "Can I find a home in Bloomingdale with no HOA?",
        answer: "Yes. Several sections within Bloomingdale have no mandatory HOA, which is rare for a community this size. A local agent can filter listings specifically for no-HOA sub-neighborhoods.",
      },
      {
        question: "How far is Bloomingdale from I-75?",
        answer: "The I-75 on-ramp is approximately 6 miles from most Bloomingdale addresses, typically a 12–15 minute drive. This makes it easy to reach Downtown Tampa in about 28–40 minutes.",
      },
      {
        question: "How many sub-neighborhoods are in Bloomingdale?",
        answer: "Bloomingdale is one of Valrico's largest master communities with over 5,200 homes spread across dozens of named sub-neighborhoods. Popular sections include Bloomingdale Oaks, Buckhorn, and Brentwood Hills.",
      },
      {
        question: "How does Bloomingdale compare to Buckhorn or River Hills?",
        answer: "Buckhorn is priced similarly ($350K–$500K) but sits in the Newsome HS zone rather than Bloomingdale HS. River Hills is a gated golf community starting around $500K with a significantly higher price ceiling — Bloomingdale offers more variety and no-gate options at a lower price point.",
      },
    ],
  },

  // ─── River Hills ───────────────────────────────────────────────────────────
  "river-hills": {
    priceRange: "$400K–$800K+",
    zip: "33596",
    totalHomes: "~1,326",
    yearBuilt: undefined,
    gated: true,
    communityPool: true,
    golf: true,

    highSchool: "Bloomingdale HS",
    highSchoolRating: "A-rated, 8/10",
    middleSchool: "Burns Middle",

    commutes: [
      { destination: "I-75 on-ramp",       distance: "~7 mi",  time: "~15 min" },
      { destination: "Downtown Tampa",      distance: "~22 mi", time: "30–42 min" },
      { destination: "MacDill AFB",         distance: "~25 mi", time: "35–45 min" },
      { destination: "Brandon Town Center", distance: "~7 mi",  time: "~14 min" },
      { destination: "Tampa Airport",       distance: "~30 mi", time: "35–45 min" },
    ],

    hoaRequired: "yes",
    hoaNote: "HOA covers 24/7 guard gate, community pools, tennis courts, and trail maintenance. Country club membership is separate and optional.",

    comparisons: [
      { name: "River Hills Masters", slug: "river-hills-masters", price: "$350K–$550K",   distinction: "Same gate and amenities at a lower price point" },
      { name: "Bloomingdale",        slug: "bloomingdale-community", price: "$375K–$600K", distinction: "No gate, larger selection of homes" },
      { name: "Diamond Hill",        slug: "diamond-hill",          price: "$400K–$700K+", distinction: "Gated golf, different course and vibe" },
      { name: "Arista",              slug: "arista",                price: "$425K–$575K",  distinction: "Newer construction, no golf" },
    ],

    idealFor: [
      "Buyers seeking an executive lifestyle",
      "Golfers who want to live on-course",
      "Security-focused families wanting 24/7 guard gate",
      "Retirees wanting resort-style amenities",
      "Out-of-state relocators wanting turnkey prestige",
    ],

    amenities: [
      "18-hole championship golf course (Joe Lee design, 7,007 yards)",
      "Private Alafia River trail access",
      "Country club and fitness facilities",
      "Community pools",
      "Tennis courts",
    ],

    faqs: [
      {
        question: "What is the price range in River Hills?",
        answer: "Homes in River Hills typically range from $400K to $800K and above, depending on lot size, view, and upgrades. The community's ~1,326 homes span a variety of single-family styles within the gated boundaries.",
      },
      {
        question: "Is River Hills a gated community?",
        answer: "Yes. River Hills is a 24/7 guard-gated community, meaning all entry is controlled through a staffed gate. This is one of the primary reasons buyers pay a premium over nearby non-gated neighborhoods.",
      },
      {
        question: "What schools serve River Hills?",
        answer: "River Hills is zoned for Bloomingdale High School (A-rated, 8/10) and Burns Middle School. Always confirm zoning with Hillsborough County Schools using the exact property address.",
      },
      {
        question: "What does the HOA in River Hills cover?",
        answer: "The HOA covers the 24/7 guard gate, community pools, tennis courts, and trail maintenance. Country club membership — including golf — is separate and not required for residents.",
      },
      {
        question: "Do I have to join the golf club to live in River Hills?",
        answer: "No. Golf club and country club membership is completely separate from HOA membership. Residents can choose whether or not to join the club.",
      },
      {
        question: "How does River Hills compare to Diamond Hill?",
        answer: "Both are gated golf communities, but River Hills tends to carry a higher price ceiling and features the Joe Lee-designed championship course. Diamond Hill is priced slightly lower and serves some addresses in the Newsome HS zone rather than Bloomingdale HS.",
      },
    ],
  },

  // ─── Diamond Hill ──────────────────────────────────────────────────────────
  "diamond-hill": {
    priceRange: "$350K–$550K+",
    zip: "33594",
    gated: true,
    communityPool: true,
    golf: true,

    highSchool: "varies by address — Bloomingdale HS or Newsome HS",
    schoolNote: "School zoning varies by address within Diamond Hill. Newsome HS zones typically command a premium. Always verify with Hillsborough County Schools.",

    commutes: [
      { destination: "I-75 on-ramp",       distance: "~4 mi",  time: "8–10 min" },
      { destination: "Downtown Tampa",      distance: "~18 mi", time: "25–35 min" },
      { destination: "MacDill AFB",         distance: "~22 mi", time: "30–40 min" },
      { destination: "Brandon Town Center", distance: "~6 mi",  time: "~12 min" },
      { destination: "Tampa Airport",       distance: "~25 mi", time: "30–40 min" },
    ],

    hoaRequired: "yes",
    hoaRange: "$150–$300/mo",
    hoaNote: "HOA includes gate access, Olympic-size pool, fitness center, clubhouse, playground, basketball courts, and tennis courts.",
    cdd: true,

    comparisons: [
      { name: "River Hills",     slug: "river-hills",        price: "$600K–$1.2M+",  distinction: "Premium golf with higher price point" },
      { name: "Arista",          slug: "arista",             price: "$425K–$575K",   distinction: "Newer construction, no golf" },
      { name: "Heritage Crest",  slug: "heritage-crest",     price: "$400K–$500K",   distinction: "Newer construction without golf community" },
      { name: "Crestwood Estates", slug: "crestwood-estates", price: "$500K–$900K",  distinction: "Estate lots" },
    ],

    idealFor: [
      "Golfers who want country club living below River Hills prices",
      "Families wanting resort-style amenities",
      "Retirees seeking patio homes with community features",
      "Security-conscious buyers wanting a gated community",
      "MacDill military families",
    ],

    amenities: [
      "Diamond Hill Golf Club (par-72, 6,920 yards, separate membership)",
      "Olympic-size community pool",
      "Fitness center",
      "Clubhouse",
      "Playground",
      "Basketball courts",
      "Tennis courts",
    ],

    faqs: [
      {
        question: "What is the price range in Diamond Hill?",
        answer: "Diamond Hill homes typically range from $350K to $550K and above, depending on lot size, golf course proximity, and updates. It offers gated golf community living at a lower entry point than River Hills.",
      },
      {
        question: "Does school zoning vary within Diamond Hill?",
        answer: "Yes. Some Diamond Hill addresses fall in the Bloomingdale HS zone and others in the Newsome HS zone. Newsome HS zones tend to command a slight price premium, so always verify zoning by exact address.",
      },
      {
        question: "How much is the HOA in Diamond Hill?",
        answer: "HOA fees typically run $150–$300/mo and include the guard gate, Olympic pool, fitness center, clubhouse, playground, basketball, and tennis courts. CDD fees may also apply to some sections.",
      },
      {
        question: "Is the golf membership required to live in Diamond Hill?",
        answer: "No. Diamond Hill Golf Club membership is separate from the community HOA. Residents can choose whether or not to join the club.",
      },
      {
        question: "Is Diamond Hill gated?",
        answer: "Yes, Diamond Hill is a gated community. The HOA fee covers gate access and security.",
      },
      {
        question: "What amenities are included in Diamond Hill's HOA?",
        answer: "HOA dues cover the Olympic-size pool, fitness center, clubhouse, playground, basketball courts, and tennis courts. Golf club membership is purchased separately through Diamond Hill Golf Club.",
      },
    ],
  },

  // ─── Brentwood Hills ───────────────────────────────────────────────────────
  "brentwood-hills": {
    priceRange: "$340K–$475K",
    zip: "33594/33596",  // straddles both ZIPs
    communityPool: true,

    highSchool: "Bloomingdale HS",
    highSchoolRating: "A-rated, 8/10",
    middleSchool: "Burns Middle",
    elementarySchools: ["Alafia Elementary", "Cimino Elementary"],

    commutes: [
      { destination: "I-75 on-ramp",       distance: "~5 mi",  time: "10–14 min" },
      { destination: "Downtown Tampa",      distance: "~19 mi", time: "26–38 min" },
      { destination: "MacDill AFB",         distance: "~23 mi", time: "33–43 min" },
      { destination: "Brandon Town Center", distance: "~4 mi",  time: "8–12 min" },
      { destination: "Tampa Airport",       distance: "~26 mi", time: "34–44 min" },
    ],

    hoaRequired: "yes",
    hoaNote: "HOA maintains the community pool and common areas. Sidewalks run throughout the neighborhood.",

    comparisons: [
      { name: "Bloomingdale",        slug: "bloomingdale-community", price: "$300K–$500K", distinction: "Largest selection in the area" },
      { name: "Bloomingdale Oaks",   slug: "bloomingdale-oaks",      price: "$350K–$475K", distinction: "Similar pricing in same school zone" },
      { name: "Buckhorn",            slug: "buckhorn-bloomingdale",  price: "$350K–$500K", distinction: "Newsome HS zone rather than Bloomingdale HS" },
    ],

    idealFor: [
      "Families wanting sidewalks, a pool, and school zone stability",
      "First-time buyers and young families",
      "Buyers wanting walkable access to nearby commercial",
      "MacDill military families",
    ],

    faqs: [
      {
        question: "What is the price range in Brentwood Hills?",
        answer: "Brentwood Hills homes typically sell between $340K and $475K. It sits in a similar price range to nearby Bloomingdale Oaks and offers a community pool included in HOA dues.",
      },
      {
        question: "What school zone is Brentwood Hills in?",
        answer: "Most Brentwood Hills addresses are zoned for Bloomingdale High School (A-rated, 8/10), Burns Middle, and Alafia or Cimino Elementary. Verify zoning by exact address with Hillsborough County Schools.",
      },
      {
        question: "Is HOA required in Brentwood Hills?",
        answer: "Yes, Brentwood Hills has a mandatory HOA that covers the community pool and common area maintenance. The fee helps maintain sidewalks and shared spaces throughout the neighborhood.",
      },
      {
        question: "Does Brentwood Hills have a community pool?",
        answer: "Yes. The community pool is maintained through the HOA and is one of Brentwood Hills' most-cited features among residents.",
      },
      {
        question: "What ZIP code is Brentwood Hills in?",
        answer: "Brentwood Hills straddles both 33594 and 33596. Check the specific address to confirm which ZIP applies — this can matter for insurance and some lender zip-code-based programs.",
      },
      {
        question: "How close is Brentwood Hills to the highway?",
        answer: "The I-75 on-ramp is approximately 5 miles away, a 10–14 minute drive. Brandon Town Center is only about 4 miles away, making everyday errands quick.",
      },
      {
        question: "Are there sidewalks in Brentwood Hills?",
        answer: "Yes. Sidewalks run throughout the neighborhood, which is a key feature for families with children and residents who prefer walkable streets.",
      },
      {
        question: "How does Brentwood Hills compare to nearby neighborhoods?",
        answer: "Brentwood Hills is priced similarly to Bloomingdale Oaks and includes a community pool. Buckhorn is in the same price range but falls in the Newsome HS zone. The larger Bloomingdale master community offers more variety but no guaranteed pool.",
      },
    ],
  },

  // ─── Abbey Grove ───────────────────────────────────────────────────────────
  "abbey-grove": {
    priceRange: "$350K–$425K",
    zip: "33594",
    totalHomes: "69",
    yearBuilt: "2003–2004",

    highSchool: "Durant HS",
    middleSchool: "Mulrennan Middle",
    elementarySchools: ["Buckhorn Elementary"],

    commutes: [
      { destination: "I-75 on-ramp",   distance: "~5 mi",  time: "~10 min" },
      { destination: "Downtown Tampa", distance: "~20 mi", time: "28–38 min" },
    ],

    hoaRequired: "yes",
    hoaRange: "$40/mo",
    hoaNote: "One of the lowest HOA fees in the Valrico area. No CDD fees apply.",
    cdd: false,

    comparisons: [
      { name: "Savannah Landings", slug: "savannah-landings", price: "$350K–$450K", distinction: "Higher HOA at $285/mo" },
      { name: "Copper Ridge",      slug: "copper-ridge",      price: "$375K–$475K", distinction: "Has CDD fees on top of HOA" },
    ],

    idealFor: [
      "Buyers wanting the lowest HOA fees in Valrico",
      "Families in the Buckhorn Elementary school zone",
    ],

    faqs: [
      {
        question: "How much is the HOA in Abbey Grove?",
        answer: "Abbey Grove's HOA is just $40/mo, making it one of the most affordable HOA communities in Valrico. There is no CDD fee, so your monthly carrying costs stay low.",
      },
      {
        question: "Does Abbey Grove have a CDD fee?",
        answer: "No. Abbey Grove has no CDD, which is a significant cost advantage over nearby communities like Copper Ridge where CDD fees can add $2,000+ per year.",
      },
      {
        question: "What are typical lot sizes in Abbey Grove?",
        answer: "Abbey Grove was built in 2003–2004 with 69 homes. Lot sizes vary — a local agent can pull exact specs for any active or sold listing within the community.",
      },
      {
        question: "What school zone is Abbey Grove in?",
        answer: "Abbey Grove is zoned for Durant High School, Mulrennan Middle, and Buckhorn Elementary. Always confirm zoning by exact address with Hillsborough County Schools.",
      },
    ],
  },

  // ─── Buckhorn / Buckhorn-Bloomingdale ──────────────────────────────────────
  "buckhorn-bloomingdale": {
    priceRange: "$350K–$500K",
    zip: "33596",

    highSchool: "Newsome HS",
    highSchoolRating: "A-rated",
    middleSchool: "Mulrennan Middle",
    elementarySchools: ["Buckhorn Elementary", "Mintz Elementary"],

    commutes: [
      { destination: "I-75 on-ramp",       distance: "~5 mi",  time: "10–14 min" },
      { destination: "Downtown Tampa",      distance: "~20 mi", time: "28–40 min" },
      { destination: "MacDill AFB",         distance: "~24 mi", time: "35–45 min" },
    ],

    hoaRequired: "varies",
    hoaNote: "HOA requirements vary by sub-neighborhood within the Buckhorn area. Some sections have mandatory HOAs; others do not.",

    comparisons: [
      { name: "Bloomingdale",  slug: "bloomingdale-community", price: "$300K–$500K",  distinction: "Bloomingdale HS zone, larger selection" },
      { name: "Diamond Hill",  slug: "diamond-hill",           price: "$350K–$550K",  distinction: "Gated golf community" },
      { name: "River Hills",   slug: "river-hills",            price: "$500K–$1M+",   distinction: "Premium gated golf" },
    ],

    idealFor: [
      "Families specifically seeking Newsome HS zoning",
      "Buyers along the Boyette Road corridor",
    ],

    faqs: [
      {
        question: "What school zone is the Buckhorn area in?",
        answer: "Most Buckhorn-area addresses are zoned for Newsome High School (A-rated), Mulrennan Middle, and Buckhorn or Mintz Elementary. Always verify by exact address with Hillsborough County Schools.",
      },
      {
        question: "What is the price range in the Buckhorn area?",
        answer: "Homes in the Buckhorn/Bloomingdale corridor typically range from $350K to $500K. The Newsome HS school zone is a key pricing driver compared to adjacent Bloomingdale HS neighborhoods.",
      },
      {
        question: "Is HOA required in Buckhorn?",
        answer: "It varies by sub-neighborhood. Some sections along Boyette Road have mandatory HOAs while others do not. A local agent can identify which sections have HOA requirements.",
      },
      {
        question: "How does Buckhorn compare to Bloomingdale?",
        answer: "Both are in similar price ranges, but Buckhorn is zoned for Newsome HS while Bloomingdale feeds Bloomingdale HS. If Newsome zoning is a priority, Buckhorn-area homes are worth the targeted search.",
      },
    ],
  },

  // ─── FishHawk Ranch ────────────────────────────────────────────────────────
  "fishhawk-ranch": {
    priceRange: "$400K–$700K+",
    zip: "33547",
    gated: true,  // some sections
    communityPool: true,

    highSchool: "Newsome HS",
    highSchoolRating: "A-rated",
    middleSchool: "Randall Middle",
    schoolNote: "Multiple elementary schools serve FishHawk Ranch. Verify by exact address.",

    commutes: [
      { destination: "I-75 on-ramp",   distance: "~8 mi",  time: "15–20 min" },
      { destination: "Downtown Tampa", distance: "~25 mi", time: "35–45 min" },
    ],

    hoaRequired: "yes",
    hoaNote: "FishHawk Ranch has both HOA and CDD fees. Combined monthly costs typically run $300–$500+/mo depending on the section.",
    cdd: true,

    comparisons: [
      { name: "Waterset",      slug: "waterset",              price: "$375K–$550K",  distinction: "Newer master-planned community" },
      { name: "Bloomingdale",  slug: "bloomingdale-community", price: "$300K–$500K", distinction: "Lower cost, established community" },
      { name: "River Hills",   slug: "river-hills",            price: "$500K–$1M+",  distinction: "Gated golf community" },
    ],

    idealFor: [
      "Families wanting resort-quality amenities",
      "Buyers seeking Newsome HS zoning",
      "Active lifestyle buyers (trails, courts, splash pads)",
    ],

    amenities: [
      "Multiple community pools",
      "Splash pads",
      "Miles of trails",
      "Sports courts",
      "Skate park",
      "Clubhouses",
    ],

    faqs: [
      {
        question: "What is the price range in FishHawk Ranch?",
        answer: "FishHawk Ranch homes typically range from $400K to $700K and above, depending on the section, lot size, and upgrades. It is one of Lithia's most established master-planned communities.",
      },
      {
        question: "How much are the CDD fees in FishHawk Ranch?",
        answer: "FishHawk Ranch has both an HOA and a CDD fee. Combined, these costs typically run $300–$500+/mo. The exact amount varies by section, so always request a full fee disclosure before making an offer.",
      },
      {
        question: "What school zone is FishHawk Ranch in?",
        answer: "FishHawk Ranch is zoned for Newsome High School (A-rated) and Randall Middle School. Multiple elementary schools serve the community — verify by exact address with Hillsborough County Schools.",
      },
      {
        question: "What amenities does FishHawk Ranch offer?",
        answer: "FishHawk Ranch features multiple pools, splash pads, miles of trails, sports courts, a skate park, and several clubhouses — giving it a true resort-community feel that's hard to match in the area.",
      },
      {
        question: "How does FishHawk Ranch compare to Waterset?",
        answer: "Waterset (Apollo Beach) is newer and priced slightly lower ($375K–$550K), while FishHawk Ranch ($400K–$700K+) is more established with a wider variety of home styles. Both have HOA and CDD fees and resort-style amenities.",
      },
    ],
  },

  // ─── Copper Ridge ──────────────────────────────────────────────────────────
  "copper-ridge": {
    priceRange: "$375K–$475K",
    zip: "33594",
    yearBuilt: "2005–2008",

    highSchool: "Durant HS",
    middleSchool: "Mulrennan Middle",
    elementarySchools: ["Buckhorn Elementary"],

    commutes: [],

    hoaRequired: "yes",
    hoaNote: "Copper Ridge has both an HOA fee and a CDD fee. CDD is approximately $2,000+/year in addition to the HOA.",
    cdd: true,

    comparisons: [
      { name: "Abbey Grove",    slug: "abbey-grove",    price: "$350K–$425K", distinction: "Just $40/mo HOA with no CDD fees" },
      { name: "Heritage Crest", slug: "heritage-crest", price: "$400K–$500K", distinction: "Newer construction (2015–2020)" },
    ],

    idealFor: [
      "Families wanting newer construction in Valrico",
    ],

    faqs: [
      {
        question: "How much is the CDD fee in Copper Ridge?",
        answer: "Copper Ridge carries a CDD fee of approximately $2,000+ per year in addition to the HOA. This is an important cost to factor into your monthly budget when comparing it to HOA-only communities like Abbey Grove.",
      },
      {
        question: "What school zone is Copper Ridge in?",
        answer: "Copper Ridge is zoned for Durant High School, Mulrennan Middle, and Buckhorn Elementary. Always confirm by exact address with Hillsborough County Schools.",
      },
      {
        question: "How does Copper Ridge compare to Abbey Grove?",
        answer: "Abbey Grove offers a lower price range ($350K–$425K) and only $40/mo HOA with no CDD. Copper Ridge is slightly newer and pricier but comes with CDD fees — buyers focused on total monthly cost often prefer Abbey Grove.",
      },
    ],
  },

  // ─── Heritage Crest ────────────────────────────────────────────────────────
  "heritage-crest": {
    priceRange: "$400K–$500K",
    zip: "33594",
    yearBuilt: "2015–2020",

    highSchool: "Durant HS",
    middleSchool: "Mulrennan Middle",

    commutes: [],

    hoaRequired: "yes",
    hoaNote: "Heritage Crest has both an HOA fee and a CDD fee.",
    cdd: true,

    comparisons: [
      { name: "Copper Ridge",  slug: "copper-ridge",  price: "$375K–$475K", distinction: "Slightly older construction (2005–2008)" },
      { name: "Diamond Hill",  slug: "diamond-hill",  price: "$350K–$550K", distinction: "Gated golf community" },
    ],

    idealFor: [
      "Buyers wanting newer construction without paying a golf community premium",
    ],

    faqs: [
      {
        question: "Does Heritage Crest have a CDD fee?",
        answer: "Yes. Heritage Crest has both an HOA and a CDD fee. Request a full fee disclosure before making an offer so you have the complete monthly cost picture.",
      },
      {
        question: "What school zone is Heritage Crest in?",
        answer: "Heritage Crest is zoned for Durant High School and Mulrennan Middle School. Verify elementary zoning by exact address with Hillsborough County Schools.",
      },
      {
        question: "When was Heritage Crest built?",
        answer: "Heritage Crest homes were built between 2015 and 2020, making it one of the newer Valrico communities. Buyers get more modern construction standards without paying the premium of a gated golf community.",
      },
      {
        question: "How does Heritage Crest compare to Diamond Hill?",
        answer: "Diamond Hill is a gated golf community with a wider price range ($350K–$550K+) and an Olympic pool, fitness center, and other resort amenities. Heritage Crest is newer and similarly priced but without the golf, gated entry, or full amenity package.",
      },
    ],
  },

  // ─── Eagles Landing ────────────────────────────────────────────────────────
  "eagles-landing": {
    priceRange: "$325K–$400K",
    zip: "33594",

    highSchool: "Durant HS",
    middleSchool: "Mulrennan Middle",
    elementarySchools: ["Buckhorn Elementary"],

    commutes: [],

    hoaRequired: "yes",
    hoaNote: "Eagles Landing has a low HOA fee. Specific monthly amount should be confirmed through HOA documents or a local agent.",

    comparisons: [
      { name: "Abbey Grove",   slug: "abbey-grove",  price: "$350K–$425K", distinction: "Similar low-HOA feel, same school zone" },
      { name: "Copper Ridge",  slug: "copper-ridge", price: "$375K–$475K", distinction: "Newer construction, has CDD fees" },
    ],

    idealFor: [
      "First-time buyers in Valrico",
      "Budget-conscious families",
    ],

    faqs: [
      {
        question: "What is the price range in Eagles Landing?",
        answer: "Eagles Landing homes typically sell in the $325K–$400K range, making it one of the more affordable gateways into Valrico. It is a good option for first-time buyers who want to stay in the Durant HS zone.",
      },
      {
        question: "What school zone is Eagles Landing in?",
        answer: "Eagles Landing is zoned for Durant High School, Mulrennan Middle, and Buckhorn Elementary. Always verify by exact address with Hillsborough County Schools.",
      },
      {
        question: "How much is the HOA in Eagles Landing?",
        answer: "Eagles Landing has a low HOA fee. The exact amount should be confirmed through the community's HOA documents or disclosure — a local agent can pull this before you make an offer.",
      },
    ],
  },

  // ─── Southoak ──────────────────────────────────────────────────────────────
  "southoak": {
    priceRange: "$575K–$1M+",
    zip: "33511",
    yearBuilt: "1983–1990",
    gated: false,
    communityPool: false,
    golf: false,

    highSchool: "Bloomingdale HS",
    middleSchool: "Burns Middle",
    elementarySchools: ["Cimino Elementary"],
    schoolNote: "School boundaries can shift over time. Confirm by address before writing an offer.",

    commutes: [
      { destination: "I-75 on-ramp",       distance: "~6 mi",  time: "12–15 min" },
      { destination: "Downtown Tampa",      distance: "~22 mi", time: "30–40 min" },
      { destination: "Brandon Town Center", distance: "~6 mi",  time: "12–15 min" },
      { destination: "Tampa Airport",       distance: "~28 mi", time: "35–45 min" },
      { destination: "HCA FL Brandon Hosp", distance: "~5 mi",  time: "10–12 min" },
    ],

    hoaRequired: "yes",
    hoaRange: "$500–$550/yr",
    hoaNote: "Southoak is deed restricted with a mandatory HOA, the South Oak Community Association, with annual dues confirmed at $500 to $550 depending on section. No CDD. Golf carts are allowed in the community.",
    cdd: false,

    comparisons: [
      { name: "Bloomingdale",    slug: "bloomingdale",    price: "$300K–$500K",   distinction: "Larger community, smaller lots" },
      { name: "River Hills",     slug: "river-hills",     price: "$500K–$1M+",    distinction: "Gated golf community" },
      { name: "FishHawk Ranch",  slug: "fishhawk-ranch",  price: "$400K–$800K+",  distinction: "Master-planned, newer construction" },
    ],

    idealFor: [
      "Custom home buyers who want acreage without leaving the Bloomingdale area",
      "Hobby farm and equestrian buyers looking for 1 to 5+ acre lots",
      "Privacy seekers who want mature oaks and space between neighbors",
      "Families zoned for Cimino Elementary, Burns Middle, and Bloomingdale High",
    ],

    amenities: [
      "Bloomingdale Golfers Club",
      "Campo Family YMCA",
      "Bloomingdale East & West Parks",
      "Bloomingdale Regional Library",
      "Alafia River State Park",
      "Golf cart friendly streets",
    ],

    faqs: [
      {
        question: "Is Southoak in Valrico or Brandon?",
        answer: "Southoak carries a Brandon, FL 33511 mailing address, but it sits within the broader Bloomingdale community. It is located off Bell Shoals Road, between Bloomingdale and FishHawk.",
      },
      {
        question: "How big are the lots in Southoak?",
        answer: "Lot sizes range from under an acre to 5 or more acres, with some homes backing to conservation land, significantly larger than most Bloomingdale subdivisions.",
      },
      {
        question: "What schools serve Southoak?",
        answer: "Cimino Elementary, Burns Middle School, and Bloomingdale High School. Boundaries can shift over time, so confirm by address before writing an offer.",
      },
      {
        question: "What are homes selling for in Southoak?",
        answer: "Recent sales landed at $666,444 for 3,002 square feet and $804,000 for 3,706 square feet, roughly $217 to $222 per square foot. Active listings as of July 2026 range from $575,000 to $1,000,000. This is a small, low inventory neighborhood, so treat these as a starting range and run a current comp for any specific home.",
      },
      {
        question: "Does Southoak have an HOA?",
        answer: "Yes. Southoak is deed restricted with a mandatory HOA, the South Oak Community Association, with annual dues confirmed at $500 to $550 depending on section. No CDD.",
      },
      {
        question: "Are Southoak homes on well and septic or county utilities?",
        answer: "A mix. Homes are on septic tanks rather than county sewer, and while public water reaches most houses, many lots also have a private well used just for irrigation. Confirm the exact setup for any specific property before writing an offer.",
      },
      {
        question: "When was Southoak built?",
        answer: "Dates back to 1983, with most homes built between 1986 and 1990.",
      },
    ],
  },
};
