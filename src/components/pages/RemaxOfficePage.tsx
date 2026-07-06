// =============================================================================
// RemaxOfficePage — Comprehensive REMAX office landing page
// Targets "REMAX Largo", "REMAX Tampa", "REMAX Brandon" keywords
// Deep REMAX brand content: history, global reach, referrals, commercial, etc.
// Each office gets unique city-specific content with the same structure.
// =============================================================================

import Link from "next/link";
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
}

// ─── Office data with unique, city-specific content ───────────────────────────
const OFFICES: Record<string, OfficeData> = {
  tampa: {
    city: "Tampa",
    county: "Hillsborough",
    address: "14310 N. Dale Mabry Hwy, Ste 100, Tampa, FL 33618",
    zip: "33618",
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
  },
  largo: {
    city: "Largo",
    county: "Pinellas",
    address: "11200 Seminole Blvd, Ste 202, Largo, FL 33778",
    zip: "33778",
    image: "/images/office-largo.jpg",
    mapLink: "https://www.google.com/maps/search/?api=1&query=11200+Seminole+Blvd+Ste+202+Largo+FL+33778",
    intro: "The REMAX Collective Largo office sits in the Largo Professional Center on Seminole Boulevard \u2014 Pinellas County\u2019s geographic center. From here, Barrett Henry and The NOW Team serve the beaches, barrier islands, and mainland communities of the Pinellas peninsula. If you\u2019re buying or selling anywhere from Clearwater Beach to St. Pete, this is your REMAX office.",
    whyThisOffice: [
      "Pinellas County is the most densely populated county in Florida \u2014 every transaction here requires local expertise that out-of-area agents simply don\u2019t have",
      "Located mid-county on Seminole Blvd with fast access to Clearwater, Indian Rocks Beach, Seminole, Belleair, and St. Petersburg",
      "Beach and waterfront properties require specialized knowledge of flood zones, insurance, and coastal regulations \u2014 Barrett handles these daily",
      "Pinellas has some of the tightest inventory in the state, making strong negotiation skills and early access to listings critical",
    ],
    serviceAreas: ["Clearwater", "Clearwater Beach", "Indian Rocks Beach", "Belleair", "Seminole", "St. Petersburg", "Treasure Island", "Madeira Beach", "Redington Beach", "Dunedin", "Safety Harbor", "Palm Harbor"],
    marketContext: "Pinellas County is unlike any other market in Tampa Bay. Bounded by water on three sides, land is finite \u2014 which means property values hold strong even in downturns. The mix of gulf-front condos, historic bungalows in St. Pete\u2019s arts district, and family homes in Seminole and Largo creates one of the most diverse real estate markets in Florida. Buyers here compete hard, and sellers benefit from consistent demand.",
    commercialNote: "Pinellas County\u2019s commercial landscape includes Gulf Boulevard hospitality properties, US-19 retail corridors, downtown St. Pete office space, and the growing Clearwater industrial market. Through REMAX Commercial, Barrett assists investors and business owners with acquisitions, dispositions, and 1031 exchanges across the peninsula.",
    referralAngle: "Pinellas County attracts international buyers \u2014 particularly from Canada, the UK, and Germany \u2014 drawn to the beaches and the lifestyle. REMAX\u2019s presence in 120+ countries means Barrett connects directly with referring agents worldwide, making cross-border transactions seamless for buyers relocating to the Pinellas coast.",
    otherOffices: [
      { key: "tampa", city: "Tampa" },
      { key: "brandon", city: "Brandon" },
    ],
  },
  brandon: {
    city: "Brandon",
    county: "Hillsborough",
    address: "417 Lithia Pinecrest Rd, Brandon, FL 33511",
    zip: "33511",
    image: "/images/office-brandon.jpg",
    mapLink: "https://maps.app.goo.gl/gjvqfQH6TqnuN2XA8",
    intro: "The REMAX Collective Brandon office on Lithia Pinecrest Road serves East Hillsborough County \u2014 the fastest-growing residential corridor in the Tampa Bay metro. Barrett Henry lives in this area and knows every subdivision, school zone, and neighborhood from FishHawk Ranch to Riverview to Valrico. This isn\u2019t just Barrett\u2019s office \u2014 it\u2019s his backyard.",
    whyThisOffice: [
      "Barrett lives in the Brandon/Valrico area \u2014 this isn\u2019t just business, it\u2019s personal knowledge of every street, school, and HOA",
      "East Hillsborough is the most active residential market in Tampa Bay with thousands of new-construction starts every year",
      "Brandon, Riverview, and Valrico consistently rank among the best places for families in Florida \u2014 top-rated schools, low crime, and affordable price points",
      "The I-75 and SR-60 corridors give Brandon residents direct access to Tampa, MacDill AFB, and the Selmon Expressway for fast commutes",
    ],
    serviceAreas: ["Valrico", "Riverview", "FishHawk Ranch", "Lithia", "Bloomingdale", "Providence", "Dover", "Plant City", "Seffner", "Mango", "Palm River"],
    marketContext: "East Hillsborough County is where Tampa Bay families go to find space, value, and top-rated schools. Brandon and its surrounding communities \u2014 Valrico, Riverview, FishHawk, Lithia \u2014 offer everything from starter homes in the $300s to estate properties on acreage. New construction is booming along the SR-60 and Lithia Pinecrest corridors, and Barrett knows every builder, every phase, and every incentive available.",
    commercialNote: "Brandon\u2019s commercial real estate market is driven by the explosive residential growth in East Hillsborough. Retail centers along SR-60 (Brandon Blvd), medical office space near Brandon Regional Hospital, and industrial flex space along I-75 are all active sectors. Barrett handles REMAX Commercial deals for investors looking to capitalize on the area\u2019s growth trajectory.",
    referralAngle: "Brandon is a magnet for military families from MacDill AFB and for corporate relocations to Tampa\u2019s east side. REMAX\u2019s referral network means Barrett regularly receives incoming referrals from agents across the country whose clients are PCSing to MacDill or transferring to employers along the I-4 corridor.",
    otherOffices: [
      { key: "tampa", city: "Tampa" },
      { key: "largo", city: "Largo" },
    ],
  },
};

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
              mainEntity: [
                { "@type": "Question", name: `Where is the REMAX office in ${office.city}?`, acceptedAnswer: { "@type": "Answer", text: `The REMAX Collective ${office.city} office is located at ${office.address}. Barrett Henry is a Broker Associate at this location. Call (813) 733-7907.` } },
                { "@type": "Question", name: `Why should I choose REMAX in ${office.city}?`, acceptedAnswer: { "@type": "Answer", text: `REMAX is the most recognized real estate brand in the world, operating in 120+ countries with 145,000+ agents. REMAX agents average 11.9 transaction sides per year \u2014 more than double the industry average of 5.3. Barrett Henry at REMAX Collective ${office.city} brings 23+ years of experience and the full power of REMAX\u2019s global network to every client.` } },
                { "@type": "Question", name: `Who is the best REMAX agent in ${office.city}?`, acceptedAnswer: { "@type": "Answer", text: `Barrett Henry is a top-producing Broker Associate at REMAX Collective in ${office.city} with 23+ years of real estate experience, FL Broker License #BK3313308, and designations including e-PRO, MRP, and SRS. Barrett is a REMAX Hall of Fame member.` } },
                { "@type": "Question", name: `Does REMAX ${office.city} handle commercial real estate?`, acceptedAnswer: { "@type": "Answer", text: `Yes. Through REMAX Commercial, Barrett Henry handles commercial transactions including retail, office, multifamily, industrial, and land deals in ${office.city} and the Tampa Bay area. REMAX Commercial agents have access to CoStar, LoopNet Premium, and Crexi Professional.` } },
                { "@type": "Question", name: `How does the REMAX referral network work?`, acceptedAnswer: { "@type": "Answer", text: `REMAX operates the largest agent-to-agent referral network in real estate with 145,000+ agents in 120+ countries. If you\u2019re moving to or from ${office.city}, Barrett connects you with a vetted REMAX agent at your destination through the AI-powered MAXRefer platform, which supports 50+ languages.` } },
                { "@type": "Question", name: `How do I contact REMAX in ${office.city}?`, acceptedAnswer: { "@type": "Answer", text: `Call Barrett Henry directly at (813) 733-7907 or email barrett@nowtb.com. The ${office.city} office is at ${office.address}.` } },
                { "@type": "Question", name: `Does REMAX ${office.city} help with rentals?`, acceptedAnswer: { "@type": "Answer", text: `Yes. Barrett and The NOW Team assist with both sales and rentals across ${office.city}. For full-service property management, visit vivipm.com.` } },
                { "@type": "Question", name: `What is REMAX Collective?`, acceptedAnswer: { "@type": "Answer", text: `REMAX Collective is a REMAX franchise brokerage in Tampa Bay, Florida with offices in Tampa, Largo, and Brandon. The brokerage serves the West Coast of Florida with residential, commercial, luxury, and investment real estate services.` } },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
                { "@type": "ListItem", position: 2, name: `REMAX ${office.city}`, item: `https://nowtb.com/remax-${officeKey}` },
              ],
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
            REMAX {office.city}
          </h1>
          <p className="font-body text-white/80 text-lg md:text-xl max-w-3xl mb-4 leading-relaxed">
            {office.intro}
          </p>
          <p className="font-body text-white/60 text-sm mb-8">
            Barrett Henry, Broker Associate &bull; FL License #BK3313308 &bull; 23+ years of real estate experience
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
      {/* OFFICE PHOTO + BARRETT INFO                                        */}
      {/* ================================================================== */}
      <section className="section-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Office building photo */}
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={office.image} alt={`REMAX Collective ${office.city} Office — ${office.address}`} className="w-full h-auto" />
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
                  REMAX Collective. With <strong>23+ years of real estate experience</strong>, Barrett brings deep market
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
                <p><strong>Direct:</strong> <a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a></p>
                <p><strong>Email:</strong> <a href="mailto:barrett@nowtb.com" className="text-accent hover:underline">barrett@nowtb.com</a></p>
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
              <p className="font-heading font-bold text-3xl md:text-4xl text-primary">9,000+</p>
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
                  REMAX was founded in 1973 by Dave Liniger in Denver, Colorado, on a simple idea: attract the
                  best agents by letting them keep more of what they earn. That model attracted top producers from
                  day one, and it still does. REMAX agents aren&apos;t beginners learning on your dime &mdash; they&apos;re
                  experienced professionals who chose REMAX because they&apos;re serious about their careers.
                </p>
                <p>
                  The numbers prove it. <strong>REMAX agents average 11.9 transaction sides per year</strong> &mdash;
                  more than double the industry average of 5.3 sides. That&apos;s not marketing spin. That&apos;s 17
                  consecutive years of independently verified data showing REMAX agents outperform the competition 2-to-1.
                </p>
                <p>
                  REMAX has been named the <strong>#1 Most Trusted Real Estate Brand</strong> by Newsweek and BrandSpark
                  for four consecutive years, based on surveys of 29,000+ U.S. consumers. With <strong>32.9% unaided brand
                  awareness</strong> &mdash; meaning more people name REMAX first, without prompting, than any other real
                  estate company &mdash; your listing gets noticed.
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
                  <strong>90% of consumers</strong> correctly identify the REMAX brand from its colors and balloon
                  imagery alone. REMAX operates the <strong>largest corporate hot air balloon fleet in the
                  world</strong> &mdash; 108 balloons in 26 countries across 6 continents. No other real estate
                  company comes close to that kind of global visibility.
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
                <p className="font-heading font-bold text-4xl text-accent mb-2">90%</p>
                <p className="font-body text-white/70 text-sm">of consumers recognize the REMAX brand from imagery alone</p>
              </div>
              <div className="border border-white/10 p-6">
                <p className="font-heading font-bold text-4xl text-accent mb-2">32.9%</p>
                <p className="font-body text-white/70 text-sm">unaided brand awareness &mdash; more people name REMAX first than any competitor</p>
              </div>
              <div className="border border-white/10 p-6">
                <p className="font-heading font-bold text-4xl text-accent mb-2">#1</p>
                <p className="font-body text-white/70 text-sm">Most Trusted Real Estate Brand &mdash; Newsweek / BrandSpark, 4 consecutive years</p>
              </div>
              <div className="border border-white/10 p-6">
                <p className="font-heading font-bold text-4xl text-accent mb-2">108</p>
                <p className="font-body text-white/70 text-sm">hot air balloons in 26 countries &mdash; the largest corporate balloon fleet on earth</p>
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
            For 17 consecutive years, REMAX agents have sold more real estate per agent than agents at any
            competing national brand. These aren&apos;t REMAX&apos;s numbers &mdash; they&apos;re independently verified
            by industry research.
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
                  <td className="py-3 text-muted">Transaction sides per year</td>
                  <td className="py-3 text-center font-bold text-primary">11.9</td>
                  <td className="py-3 text-center text-muted">5.3</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-muted">Sales volume per agent</td>
                  <td className="py-3 text-center font-bold text-primary">$5.1M</td>
                  <td className="py-3 text-center text-muted">$3.0M</td>
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
            <p className="font-body text-muted/60 text-xs mt-4">Source: 2025 REMAX industry productivity data, independently verified.</p>
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
              standard: 23+ years of experience, a REMAX Hall of Fame member, and a track record of getting
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
                  The REMAX referral platform, <strong>MAXRefer</strong>, is AI-powered and supports <strong>50+
                  languages</strong>. It matches agents based on location, specialties, production history, and
                  client needs. It&apos;s not a random assignment &mdash; it&apos;s a data-driven match designed to pair
                  your needs with the right agent.
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
              the difference between a REMAX Broker Associate with 23+ years of experience and an agent who
              just got their license last year.
            </p>
          </div>
        </div>
      </section>

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
                  REMAX Commercial has been a force in commercial real estate since 1990, with agents closing
                  <strong> $21 billion+</strong> in commercial volume. REMAX Commercial agents have access to
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
            REMAX University offers 70+ designations, certifications, and continuing education courses. Agents
            who complete at least one REMAX University course in their first year close 29% to 38% more
            transactions. Barrett Henry holds multiple industry designations that directly benefit his clients.
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
                Barrett Henry is a <strong>REMAX Hall of Fame</strong> member &mdash; an honor reserved for agents who
                have earned $1 million+ in gross commissions during their REMAX career. Here&apos;s how the award
                levels work:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {[
                  { name: "100% Club", range: "$100K–$249K" },
                  { name: "Platinum Club", range: "$250K–$499K" },
                  { name: "Chairman\u2019s Club", range: "$500K–$749K" },
                  { name: "Titan Club", range: "$750K–$999K" },
                  { name: "Diamond Club", range: "$1M–$1.99M" },
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
                <p className="text-accent text-lg mb-4">&starf;&starf;&starf;&starf;&starf;</p>
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
              <p className="font-heading font-bold text-lg text-primary mb-1">{office.city} Office</p>
              <p className="font-body text-muted text-sm font-light mb-2">{office.address}</p>
              <p className="font-body text-accent text-xs font-bold uppercase tracking-wider">You Are Here</p>
            </div>
            {/* Other two offices */}
            {office.otherOffices.map((other) => {
              const otherData = OFFICES[other.key];
              return (
                <Link key={other.key} href={`/remax-${other.key}/`} className="border border-gray-200 p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors">
                  <p className="font-heading font-bold text-lg text-primary mb-1">{other.city} Office</p>
                  <p className="font-body text-muted text-sm font-light mb-2">{otherData.address}</p>
                  <p className="font-body text-accent text-xs tracking-[0.15em] uppercase">View REMAX {other.city} &rarr;</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FAQ — Comprehensive, REMAX-focused                                 */}
      {/* ================================================================== */}
      <section className="section-light">
        <div className="container-wide max-w-3xl">
          <h2 className="font-heading font-bold text-2xl text-primary mb-8">Frequently Asked Questions &mdash; REMAX {office.city}</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Where is the REMAX office in {office.city}?</h3>
              <p className="font-body text-muted font-light">The REMAX Collective {office.city} office is at <strong>{office.address}</strong>. Barrett Henry is a Broker Associate at this location. Call <a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a> to schedule an appointment or just walk in.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Why should I choose REMAX over other brokerages in {office.city}?</h3>
              <p className="font-body text-muted font-light">REMAX is the most recognized real estate brand in the world, operating in 120+ countries with 145,000+ agents. REMAX agents average 11.9 transaction sides per year &mdash; more than double the industry average. When you list with REMAX, your property benefits from global brand recognition, the largest referral network in real estate, and an agent (Barrett Henry) with 23+ years of experience.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Who is the best REMAX agent in {office.city}?</h3>
              <p className="font-body text-muted font-light">Barrett Henry is a top-producing Broker Associate and REMAX Hall of Fame member at REMAX Collective in {office.city}. With 23+ years of real estate experience, FL Broker License #BK3313308, and designations including e-PRO, MRP, and SRS, Barrett has the credentials and track record that matter.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Does REMAX {office.city} handle commercial real estate?</h3>
              <p className="font-body text-muted font-light">Yes. Through REMAX Commercial, Barrett handles commercial transactions including retail, office, multifamily, industrial, and land deals in {office.city} and the Tampa Bay area. REMAX Commercial agents have access to CoStar, LoopNet Premium, and Crexi Professional.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">How does the REMAX referral network help me?</h3>
              <p className="font-body text-muted font-light">Moving to or from {office.city}? Barrett connects you with a vetted REMAX agent at your destination through the AI-powered MAXRefer platform, which supports 50+ languages and covers 120+ countries. You get a warm introduction to a trusted agent &mdash; not a random name from a search engine.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">What is the REMAX balloon?</h3>
              <p className="font-body text-muted font-light">The REMAX hot air balloon is the most recognized logo in real estate. It debuted at the 1978 Albuquerque Balloon Fiesta and represents the REMAX motto: &ldquo;Above the Crowd.&rdquo; REMAX operates 108 hot air balloons in 26 countries &mdash; the largest corporate balloon fleet in the world. 90% of consumers recognize the REMAX brand from its balloon imagery alone.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">How do I contact REMAX in {office.city}?</h3>
              <p className="font-body text-muted font-light">Call Barrett Henry directly at <a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a> or email <a href="mailto:barrett@nowtb.com" className="text-accent hover:underline">barrett@nowtb.com</a>. The {office.city} office is at {office.address}.</p>
            </div>
            <div className="pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Does REMAX {office.city} help with rentals and property management?</h3>
              <p className="font-body text-muted font-light">Yes. Barrett and The NOW Team assist with both sales and rentals across {office.city} and the Tampa Bay area. For full-service property management, visit <a href="https://vivipm.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">vivipm.com</a> (ViVi PM).</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CONTACT FORM                                                       */}
      {/* ================================================================== */}
      <section className="section-white">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl text-primary mb-2 text-center">Contact REMAX {office.city}</h2>
          <p className="font-body text-muted text-center mb-8">
            Reach Barrett Henry at the {office.city} office. Call <a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a> or send a message below.
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
              Barrett Henry, Broker Associate &bull; REMAX Hall of Fame &bull; 23+ years of real estate experience
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
