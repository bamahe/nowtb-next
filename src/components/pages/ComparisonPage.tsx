// =============================================================================
// ComparisonPage — City-vs-city or concept comparison page
// Pulls live MLS data for both sides and renders real stats + content
// =============================================================================

import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import { getListings } from "@/lib/bridge";
import { formatPrice } from "@/lib/utils";
import { cities, getCityBySlug } from "@/data/cities";
import type { ComparisonData } from "@/data/comparisons";
import { getConceptContent } from "@/data/concept-comparisons";
import type { Listing } from "@/lib/types";

interface ComparisonPageProps {
  comparison: ComparisonData;
}

// Slugify a community name for URL matching
function toSlug(name: string): string {
  return name.toLowerCase().replace(/['\s]+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// Compute stats from a set of listings
function computeStats(listings: Listing[]) {
  if (listings.length === 0) return null;
  const prices = listings.map(l => l.ListPrice).sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)];
  const avg = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);
  const low = prices[0];
  const high = prices[prices.length - 1];
  const domListings = listings.filter(l => l.DaysOnMarket != null);
  const avgDom = domListings.length > 0
    ? Math.round(domListings.reduce((s, l) => s + (l.DaysOnMarket || 0), 0) / domListings.length)
    : 0;
  const sqftListings = listings.filter(l => l.LivingArea && l.LivingArea > 0);
  const avgSqft = sqftListings.length > 0
    ? Math.round(sqftListings.reduce((s, l) => s + (l.LivingArea || 0), 0) / sqftListings.length)
    : 0;
  const avgPpsf = sqftListings.length > 0
    ? Math.round(sqftListings.reduce((s, l) => s + (l.ListPrice / (l.LivingArea || 1)), 0) / sqftListings.length)
    : 0;
  return { count: listings.length, median, avg, low, high, avgDom, avgSqft, avgPpsf };
}

// Known community details for richer content
const COMMUNITY_INFO: Record<string, { description: string; highlights: string[]; schools: string }> = {
  "fishhawk-ranch": {
    description: "FishHawk Ranch is a 3,200-acre master-planned community in Lithia with A-rated schools, 40+ miles of trails, and resort-style amenities including pools, sports courts, and community centers.",
    highlights: ["A-rated Newsome High School", "40+ miles of trails and parks", "Multiple pools and clubhouses", "Active community events calendar", "CDD keeps amenities maintained"],
    schools: "Stowers Elementary, Barrington Middle, Newsome High (all A-rated)",
  },
  "waterset": {
    description: "Waterset is a newer master-planned community off Balm Road in Lithia featuring modern homes built 2016+, resort-style amenities, and family-friendly parks throughout the neighborhood.",
    highlights: ["Newer construction (2016+)", "Resort-style pool and amenities", "Walking trails and parks", "Modern floor plans and energy efficiency", "Growing community with new phases"],
    schools: "Stowers Elementary, Barrington Middle, Newsome High",
  },
  "brandon": {
    description: "Brandon is an established community in eastern Hillsborough County with easy access to I-75 and I-4, shopping at Westfield Brandon, and a mix of older and newer neighborhoods at various price points.",
    highlights: ["Central location with highway access", "Westfield Brandon Mall shopping", "Diverse housing inventory", "Established neighborhoods", "Reasonable property taxes"],
    schools: "Multiple elementary options, McLane Middle, Brandon High, Bloomingdale High",
  },
  "riverview": {
    description: "Riverview is one of Tampa Bay's fastest-growing communities with a mix of new master-planned developments and established neighborhoods. Located in southern Hillsborough County with easy access to US-301 and I-75.",
    highlights: ["Fastest-growing area in Hillsborough", "New construction available", "Multiple master-planned communities", "Competitive pricing vs Tampa proper", "Growing retail and dining"],
    schools: "Multiple options including Sumner High, Riverview High, Newsome High zone",
  },
  "valrico": {
    description: "Valrico is a family-oriented community between Brandon and Lithia known for excellent schools, established neighborhoods, and a suburban feel with easy access to Tampa.",
    highlights: ["Top-rated school zones", "Bloomingdale neighborhood amenities", "Family-friendly atmosphere", "Proximity to FishHawk and Brandon", "Lower density than Brandon"],
    schools: "Bloomingdale Senior High, Burns Middle, multiple A-rated elementaries",
  },
  "wesley-chapel": {
    description: "Wesley Chapel is a booming community in Pasco County with extensive new construction, the Shops at Wiregrass, and a mix of master-planned communities attracting families from across Tampa Bay.",
    highlights: ["Massive new construction inventory", "Shops at Wiregrass premium retail", "Epperson Crystal Lagoon", "Growing medical corridor", "Lower property taxes than Hillsborough"],
    schools: "Wesley Chapel High, Wiregrass Ranch High, multiple new schools",
  },
  "land-o-lakes": {
    description: "Land O' Lakes offers a mix of established and newer communities in central Pasco County. Known for slightly larger lots and a more suburban/rural feel than Wesley Chapel.",
    highlights: ["Larger lot sizes available", "Mix of old and new construction", "Competitive pricing", "Connerton and Bexley communities", "Easy access to SR-54/56 corridor"],
    schools: "Land O' Lakes High, Sunlake High, multiple elementary options",
  },
  "lutz": {
    description: "Lutz straddles the Hillsborough-Pasco line and offers a mix of older ranch homes on acreage and newer planned communities. Popular with families wanting more space close to Tampa.",
    highlights: ["Mix of acreage and planned communities", "Close to Tampa without Tampa prices", "Steinbrenner High School zone", "Rural feel in parts", "No CDD in older neighborhoods"],
    schools: "Steinbrenner High, Martinez Middle, multiple elementary zones",
  },
  "clearwater-beach": {
    description: "Clearwater Beach is a premier Gulf Coast destination known for white sand, turquoise water, and a vibrant tourist economy. Waterfront condos and homes command premium prices.",
    highlights: ["#1 rated beach in the US (TripAdvisor)", "Waterfront condos and homes", "Strong rental income potential", "Pier 60 and marina access", "Premium location, premium prices"],
    schools: "Clearwater Fundamental Middle, Countryside High zone",
  },
  "siesta-key": {
    description: "Siesta Key is a barrier island off Sarasota known for its quartz crystal sand and laid-back beach lifestyle. Properties range from beachfront condos to luxury estates.",
    highlights: ["World-famous quartz sand beach", "Barrier island exclusivity", "Village shopping and dining", "Strong vacation rental market", "Sarasota cultural amenities nearby"],
    schools: "Sarasota County school zones",
  },
  "st-petersburg": {
    description: "St. Petersburg is a vibrant waterfront city with a thriving arts scene, craft breweries, and diverse neighborhoods. The downtown area has seen massive revitalization in recent years.",
    highlights: ["Downtown revitalization and walkability", "Arts and culture scene", "Waterfront parks and trails", "Diverse neighborhood options", "Strong appreciation in recent years"],
    schools: "Multiple magnet and choice programs, Northeast High, Lakewood High",
  },
  "tampa": {
    description: "Tampa is the economic hub of the Bay area with diverse neighborhoods from South Tampa's historic homes to New Tampa's planned communities. Corporate relocations and population growth drive strong demand.",
    highlights: ["Major employment center", "Diverse neighborhoods and price points", "International airport", "Professional sports teams", "Water Street and downtown growth"],
    schools: "Multiple district and magnet options across the city",
  },
  "south-tampa": {
    description: "South Tampa is one of the most desirable addresses in the Bay area. Tree-lined streets, walkable neighborhoods, Bayshore Boulevard, and proximity to downtown make it a premium market.",
    highlights: ["Bayshore Boulevard waterfront", "Plant High and Robinson High zones", "Hyde Park Village shopping", "Walkable neighborhoods", "Highest per-sqft prices in Tampa"],
    schools: "Plant High, Robinson High, Mitchell Elementary, multiple private schools",
  },
  "new-tampa": {
    description: "New Tampa is a planned suburban area in northern Hillsborough County. Built mostly in the 2000s-2010s with master-planned communities, it offers newer homes and strong school zones.",
    highlights: ["Newer construction throughout", "USF and Moffitt Cancer Center nearby", "Premium Outlets and retail", "I-75 and I-275 access", "Wharton and Steinbrenner school zones"],
    schools: "Wharton High, Liberty Middle, multiple A-rated elementaries",
  },
  // --- Added July 2026 for new comparison pages ---
  "seffner": {
    description: "Seffner is an affordable alternative to Brandon tucked between I-4 and SR-574. With quick access to both downtown Tampa and Lakeland, it draws buyers looking for value in eastern Hillsborough County without the Brandon price tag.",
    highlights: ["Lower median prices than Brandon", "Direct I-4 access to Tampa and Lakeland", "Mix of older homes and newer builds", "Quieter suburban feel", "ZIP 33584 covers the core area"],
    schools: "Armwood High, Seffner Christian Academy (private), multiple elementary zones",
  },
  "dover": {
    description: "Dover is a rural agricultural community in eastern Hillsborough County known for strawberry farms, large lots, and a country lifestyle just minutes from Brandon. ZIP 33527 covers this unincorporated area where zoning allows livestock and farming.",
    highlights: ["Large lots and acreage available", "Agricultural zoning for horses and livestock", "Strawberry farms and rural character", "Lower prices than neighboring communities", "Close to Brandon shopping and dining"],
    schools: "Durant High, Turkey Creek Middle, Dover Elementary",
  },
  "plant-city": {
    description: "Plant City is the Strawberry Capital of the World with a charming historic downtown, annual Strawberry Festival, and a growing housing market. ZIPs 33563-33567 cover everything from downtown bungalows to newer subdivisions on the outskirts.",
    highlights: ["Historic downtown with local shops and dining", "Annual Florida Strawberry Festival", "Growing new construction inventory", "More affordable than western Hillsborough", "Rail trail and parks system"],
    schools: "Plant City High, Strawberry Crest High, Durant High zone edges",
  },
  "thonotosassa": {
    description: "Thonotosassa offers large lots, horse properties, and a rural lifestyle along the Hillsborough River in eastern Hillsborough County. ZIP 33592 attracts buyers who want acreage and privacy without leaving the Tampa metro.",
    highlights: ["Large lots and horse-friendly properties", "Hillsborough River access and parks", "Rural feel within 20 minutes of Tampa", "No HOA on most older properties", "Lower property taxes on ag-exempt land"],
    schools: "Armwood High, Thonotosassa Elementary, multiple middle school zones",
  },
  "apollo-beach": {
    description: "Apollo Beach is a waterfront community on Tampa Bay's eastern shore offering canal-front homes, the Waterset master-planned community, and direct bay access. ZIP 33572 covers everything from older waterfront cottages to brand-new construction.",
    highlights: ["Waterfront and canal-front homes", "Tampa Bay boat access and marinas", "Waterset master-planned community", "Manatee viewing center", "Growing retail along US-41"],
    schools: "East Bay High, Apollo Beach Elementary, Eisenhower Middle",
  },
  "ruskin": {
    description: "Ruskin sits in the SouthShore area of Hillsborough County adjacent to Sun City Center. ZIP 33570 offers affordable waterfront options, newer subdivisions, and a quieter pace of life with easy access to I-75 and US-41.",
    highlights: ["Affordable waterfront opportunities", "Sun City Center adjacent (55+ options nearby)", "Newer subdivisions with competitive pricing", "E.G. Simmons Park and nature preserves", "Growing commercial corridor along US-41"],
    schools: "Lennard High, East Bay High zone edges, multiple elementary options",
  },
  "lithia": {
    description: "Lithia is home to FishHawk Ranch and several other upscale communities in southeastern Hillsborough County. ZIP 33547 offers a mix of master-planned luxury living and older rural properties with acreage along Lithia Pinecrest Road.",
    highlights: ["FishHawk Ranch master-planned community", "A-rated Newsome High School zone", "Mix of luxury and rural properties", "Alafia River State Park nearby", "Large lots available outside planned communities"],
    schools: "Newsome High, Randall Middle, multiple A-rated elementaries",
  },
  "fishhawk": {
    description: "FishHawk Ranch is a 3,200-acre master-planned community in Lithia with A-rated Newsome High School, 40+ miles of trails, resort-style pools, sports courts, and an active community calendar. One of Tampa Bay's most desirable family neighborhoods.",
    highlights: ["A-rated Newsome High School", "40+ miles of trails and parks", "Multiple pools and clubhouses", "Active community events", "CDD-maintained amenities"],
    schools: "Newsome High School, Barrington Middle, FishHawk Creek Elementary",
  },

};

export default async function ComparisonPage({ comparison }: ComparisonPageProps) {
  const { title, excerpt, sideA, sideB, category } = comparison;
  const slugA = toSlug(sideA);
  const slugB = toSlug(sideB);

  // Look up city data for ZIP-based filtering
  // Try exact match, then partial match (e.g. "fishhawk-ranch" → "fishhawk")
  const cityA = cities.find(c => toSlug(c.name) === slugA || c.slug === slugA)
    || cities.find(c => slugA.startsWith(c.slug) || c.slug.startsWith(slugA));
  const cityB = cities.find(c => toSlug(c.name) === slugB || c.slug === slugB)
    || cities.find(c => slugB.startsWith(c.slug) || c.slug.startsWith(slugB));

  // Fetch live MLS data for both sides (city comparisons only)
  let statsA = null;
  let statsB = null;

  if (category === "city") {
    const [resA, resB] = await Promise.all([
      cityA ? getListings({ zip_codes: cityA.zip_codes, limit: "100", exclude_rental: true }).catch(() => ({ value: [] })) : Promise.resolve({ value: [] }),
      cityB ? getListings({ zip_codes: cityB.zip_codes, limit: "100", exclude_rental: true }).catch(() => ({ value: [] })) : Promise.resolve({ value: [] }),
    ]);
    statsA = computeStats((resA.value || []) as Listing[]);
    statsB = computeStats((resB.value || []) as Listing[]);
  }

  const infoA = COMMUNITY_INFO[slugA];
  const infoB = COMMUNITY_INFO[slugB];

  // Load concept comparison content for non-city comparisons
  const conceptData = category === "concept" ? getConceptContent(comparison.slug) : undefined;

  // ── Concept comparison layout (FSBO vs REALTOR, renting vs buying, etc.) ──
  if (category === "concept" && conceptData) {
    return (
      <>
        {/* === Breadcrumb + Hero === */}
        <section className="bg-primary pt-36 pb-16">
          <div className="container-wide">
            <nav className="flex items-center gap-2 text-xs font-body text-white/80 mb-6 tracking-wide uppercase">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/guides/" className="hover:text-white transition-colors">Guides</Link>
              <span>/</span>
              <span className="text-accent">{title}</span>
            </nav>
            <h1 className="heading-display text-display md:text-display-lg text-white mb-3">{title}</h1>
            <p className="font-body text-white/70 text-lg max-w-2xl">{excerpt}</p>
          </div>
        </section>

        {/* === Intro Content === */}
        <section className="container-wide py-12">
          <div className="max-w-3xl mx-auto font-body text-dark leading-relaxed space-y-4">
            {conceptData.introContent.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-muted">{paragraph}</p>
            ))}
          </div>
        </section>

        {/* === Side-by-Side Comparison Table === */}
        <section className="container-wide pb-12">
          <h2 className="font-heading font-bold text-2xl text-primary mb-8 text-center">
            {sideA} vs {sideB}: Side-by-Side Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-primary/20">
                  <th className="font-heading font-bold text-primary py-3 px-4 w-1/5">Category</th>
                  <th className="font-heading font-bold text-primary py-3 px-4 w-2/5">{sideA}</th>
                  <th className="font-heading font-bold text-primary py-3 px-4 w-2/5">{sideB}</th>
                </tr>
              </thead>
              <tbody className="font-body text-sm">
                {conceptData.comparisonRows.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="py-3 px-4 text-primary font-semibold align-top">{row.category}</td>
                    <td className="py-3 px-4 text-muted align-top">{row.sideA}</td>
                    <td className="py-3 px-4 text-muted align-top">{row.sideB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* === Pros & Cons === */}
        <section className="bg-gray-50 py-12">
          <div className="container-wide">
            <h2 className="font-heading font-bold text-2xl text-primary mb-8 text-center">
              Pros and Cons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Side A pros/cons */}
              <div className="card p-8">
                <h3 className="font-heading font-bold text-xl text-primary mb-6">{sideA}</h3>
                <div className="mb-6">
                  <h4 className="font-heading font-semibold text-green-700 mb-3">Pros</h4>
                  <ul className="space-y-2">
                    {conceptData.prosConsA.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted font-body">
                        <span className="text-green-600 mt-0.5 shrink-0">+</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-red-700 mb-3">Cons</h4>
                  <ul className="space-y-2">
                    {conceptData.prosConsA.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted font-body">
                        <span className="text-red-600 mt-0.5 shrink-0">-</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Side B pros/cons */}
              <div className="card p-8">
                <h3 className="font-heading font-bold text-xl text-primary mb-6">{sideB}</h3>
                <div className="mb-6">
                  <h4 className="font-heading font-semibold text-green-700 mb-3">Pros</h4>
                  <ul className="space-y-2">
                    {conceptData.prosConsB.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted font-body">
                        <span className="text-green-600 mt-0.5 shrink-0">+</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-red-700 mb-3">Cons</h4>
                  <ul className="space-y-2">
                    {conceptData.prosConsB.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted font-body">
                        <span className="text-red-600 mt-0.5 shrink-0">-</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === Bottom Line / Verdict === */}
        <section className="container-wide py-12">
          <div className="bg-primary/5 rounded-xl p-8 max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-xl text-primary mb-3">
              The Bottom Line: {sideA} or {sideB}?
            </h2>
            <p className="font-body text-muted leading-relaxed">{conceptData.bottomLine}</p>
          </div>
        </section>

        {/* === CTA bar === */}
        <section className="bg-primary py-8">
          <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-heading font-bold text-white text-lg">
                Need help deciding between {sideA.toLowerCase()} and {sideB.toLowerCase()}?
              </p>
              <p className="font-body text-white/70 text-sm">
                Barrett Henry, Broker Associate at REMAX Collective — 23+ years of real estate experience
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="tel:+18137337907"
                className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded text-sm hover:bg-accent/90 transition-colors"
              >
                Call (813) 733-7907
              </a>
              <Link
                href="/contact/"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
              >
                Send a Message
              </Link>
            </div>
          </div>
        </section>

        {/* === FAQ Section === */}
        <section className="container-wide py-12">
          <h2 className="font-heading font-bold text-2xl text-primary mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {conceptData.faq.map((item, i) => (
              <details key={i} className="group border border-gray-200 rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-heading font-semibold text-primary hover:bg-gray-50 transition-colors">
                  {item.question}
                  <span className="ml-4 shrink-0 text-muted group-open:rotate-180 transition-transform">&#9662;</span>
                </summary>
                <div className="px-5 pb-5 pt-0">
                  <p className="font-body text-muted text-sm leading-relaxed">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* === FAQPage JSON-LD Schema === */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: conceptData.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            }),
          }}
        />

        {/* === Contact form === */}
        <section className="py-16">
          <div className="container-wide max-w-2xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
              Get a Personalized Analysis
            </h2>
            <p className="font-body text-muted text-center mb-8">
              Barrett Henry will walk you through the numbers based on your specific situation, budget, and goals.
            </p>
            <ContactForm
              webhookUrl="/api/contact"
              source={`comparison-${comparison.slug}`}
            />
          </div>
        </section>
      </>
    );
  }

  // ── City comparison layout (original) ─────────────────────────────────────

  return (
    <>
      {/* === Breadcrumb + Hero === */}
      <section className="bg-primary pt-36 pb-16">
        <div className="container-wide">
          <nav className="flex items-center gap-2 text-xs font-body text-white/80 mb-6 tracking-wide uppercase">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/communities/" className="hover:text-white transition-colors">Communities</Link>
            <span>/</span>
            <span className="text-accent">{title}</span>
          </nav>
          <h1 className="heading-display text-display md:text-display-lg text-white mb-3">{title}</h1>
          <p className="font-body text-white/70 text-lg max-w-2xl">{excerpt}</p>
        </div>
      </section>

      {/* === Live Market Stats Comparison Table === */}
      {statsA && statsB && (
        <section className="container-wide py-12">
          <h2 className="font-heading font-bold text-2xl text-primary mb-8 text-center">
            {sideA} vs {sideB}: By the Numbers
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-primary/20">
                  <th className="font-heading font-bold text-primary py-3 px-4">Metric</th>
                  <th className="font-heading font-bold text-primary py-3 px-4">{sideA}</th>
                  <th className="font-heading font-bold text-primary py-3 px-4">{sideB}</th>
                </tr>
              </thead>
              <tbody className="font-body text-sm">
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-muted font-semibold">Active Listings</td>
                  <td className="py-3 px-4 text-dark">{statsA.count}</td>
                  <td className="py-3 px-4 text-dark">{statsB.count}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-muted font-semibold">Median Price</td>
                  <td className="py-3 px-4 text-dark font-bold">{formatPrice(statsA.median)}</td>
                  <td className="py-3 px-4 text-dark font-bold">{formatPrice(statsB.median)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-muted font-semibold">Price Range</td>
                  <td className="py-3 px-4 text-dark">{formatPrice(statsA.low)} – {formatPrice(statsA.high)}</td>
                  <td className="py-3 px-4 text-dark">{formatPrice(statsB.low)} – {formatPrice(statsB.high)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-muted font-semibold">Avg. Price / Sq Ft</td>
                  <td className="py-3 px-4 text-dark">${statsA.avgPpsf}</td>
                  <td className="py-3 px-4 text-dark">${statsB.avgPpsf}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-muted font-semibold">Avg. Sq Ft</td>
                  <td className="py-3 px-4 text-dark">{statsA.avgSqft.toLocaleString()}</td>
                  <td className="py-3 px-4 text-dark">{statsB.avgSqft.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-muted font-semibold">Avg. Days on Market</td>
                  <td className="py-3 px-4 text-dark">{statsA.avgDom} days</td>
                  <td className="py-3 px-4 text-dark">{statsB.avgDom} days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-body text-xs text-muted mt-3 text-center">
            Data from Stellar MLS. Updated daily. Stats based on active listings.
          </p>
        </section>
      )}

      {/* === Side-by-side community details === */}
      <section className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* --- Side A --- */}
          <div className="card p-8">
            <h2 className="font-heading font-bold text-2xl text-primary mb-4">
              {sideA}
            </h2>
            {infoA ? (
              <div className="space-y-4 font-body text-dark">
                <p className="text-muted leading-relaxed">{infoA.description}</p>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Highlights</h3>
                  <ul className="space-y-1">
                    {infoA.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted">
                        <span className="text-accent mt-1">✓</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-semibold text-primary mb-1">Schools</h3>
                  <p className="text-muted text-sm">{infoA.schools}</p>
                </div>
                {statsA && (
                  <div className="bg-light rounded-lg p-4">
                    <p className="font-semibold text-primary text-sm mb-1">Market at a Glance</p>
                    <p className="text-muted text-sm">
                      {statsA.count} active listings · Median {formatPrice(statsA.median)} · {statsA.avgDom} avg DOM
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 font-body text-dark">
                <p className="text-muted leading-relaxed">
                  {sideA} is a popular area in the Tampa Bay market. Contact Barrett Henry at (813) 733-7907 for detailed insights and current listings.
                </p>
                {statsA && (
                  <div className="bg-light rounded-lg p-4">
                    <p className="font-semibold text-primary text-sm mb-1">Market at a Glance</p>
                    <p className="text-muted text-sm">
                      {statsA.count} active listings · Median {formatPrice(statsA.median)} · {statsA.avgDom} avg DOM
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- Side B --- */}
          <div className="card p-8">
            <h2 className="font-heading font-bold text-2xl text-primary mb-4">
              {sideB}
            </h2>
            {infoB ? (
              <div className="space-y-4 font-body text-dark">
                <p className="text-muted leading-relaxed">{infoB.description}</p>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Highlights</h3>
                  <ul className="space-y-1">
                    {infoB.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted">
                        <span className="text-accent mt-1">✓</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-semibold text-primary mb-1">Schools</h3>
                  <p className="text-muted text-sm">{infoB.schools}</p>
                </div>
                {statsB && (
                  <div className="bg-light rounded-lg p-4">
                    <p className="font-semibold text-primary text-sm mb-1">Market at a Glance</p>
                    <p className="text-muted text-sm">
                      {statsB.count} active listings · Median {formatPrice(statsB.median)} · {statsB.avgDom} avg DOM
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 font-body text-dark">
                <p className="text-muted leading-relaxed">
                  {sideB} offers its own distinct advantages in the Tampa Bay market. Barrett Henry can help you weigh the options. Call (813) 733-7907.
                </p>
                {statsB && (
                  <div className="bg-light rounded-lg p-4">
                    <p className="font-semibold text-primary text-sm mb-1">Market at a Glance</p>
                    <p className="text-muted text-sm">
                      {statsB.count} active listings · Median {formatPrice(statsB.median)} · {statsB.avgDom} avg DOM
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* === Quick Answer for AEO === */}
      <section className="container-wide pb-12">
        <div className="bg-primary/5 rounded-xl p-8 max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-xl text-primary mb-3">
            So Which Is Better: {sideA} or {sideB}?
          </h2>
          <div className="font-body text-muted leading-relaxed space-y-3">
            {category === "city" && statsA && statsB ? (
              <>
                <p>
                  {statsA.median > statsB.median
                    ? `${sideA} has a higher median price (${formatPrice(statsA.median)} vs ${formatPrice(statsB.median)}), which typically means more established neighborhoods, larger homes, or more desirable amenities.`
                    : `${sideB} comes in at a higher median price (${formatPrice(statsB.median)} vs ${formatPrice(statsA.median)}), reflecting its market positioning and demand.`
                  }
                </p>
                <p>
                  {statsA.avgDom < statsB.avgDom
                    ? `Homes in ${sideA} sell faster (${statsA.avgDom} vs ${statsB.avgDom} days on market), suggesting stronger buyer demand.`
                    : `${sideB} has faster sales (${statsB.avgDom} vs ${statsA.avgDom} days on market), indicating a competitive market.`
                  }
                </p>
                <p>
                  The right choice depends on your budget, commute, school preferences, and lifestyle priorities. Barrett Henry has helped hundreds of buyers make this exact decision over 23+ years of real estate experience. Call <a href="tel:+18137337907" className="text-accent font-semibold">(813) 733-7907</a> for a personalized comparison.
                </p>
              </>
            ) : (
              <p>
                Both options have their strengths. The best choice depends on your specific situation, goals, and timeline. Barrett Henry can walk you through the pros and cons based on 23+ years of real estate experience. Call <a href="tel:+18137337907" className="text-accent font-semibold">(813) 733-7907</a>.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* === CTA bar === */}
      <section className="bg-primary py-8">
        <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-heading font-bold text-white text-lg">
              Need help choosing between {sideA} and {sideB}?
            </p>
            <p className="font-body text-white/70 text-sm">
              Barrett Henry, Broker Associate at REMAX Collective
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded text-sm hover:bg-accent/90 transition-colors"
            >
              Call (813) 733-7907
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>

      {/* === Explore Both Areas === */}
      {category === "city" && (
        <section className="bg-gray-50 py-12">
          <div className="container-wide">
            <h2 className="font-heading font-bold text-2xl text-primary mb-6 text-center">
              Explore Both Areas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href={`/${slugA}-homes-for-sale/`} className="block rounded-lg bg-white border border-gray-200 p-4 text-center hover:shadow-md hover:border-accent/30 transition-all no-underline">
                <p className="font-heading font-bold text-primary text-sm">{sideA} Homes</p>
                <p className="font-body text-xs text-muted mt-1">Browse listings</p>
              </Link>
              <Link href={`/${slugB}-homes-for-sale/`} className="block rounded-lg bg-white border border-gray-200 p-4 text-center hover:shadow-md hover:border-accent/30 transition-all no-underline">
                <p className="font-heading font-bold text-primary text-sm">{sideB} Homes</p>
                <p className="font-body text-xs text-muted mt-1">Browse listings</p>
              </Link>
              <Link href={`/${slugA}-housing-market/`} className="block rounded-lg bg-white border border-gray-200 p-4 text-center hover:shadow-md hover:border-accent/30 transition-all no-underline">
                <p className="font-heading font-bold text-primary text-sm">{sideA} Market</p>
                <p className="font-body text-xs text-muted mt-1">Stats & trends</p>
              </Link>
              <Link href={`/${slugB}-housing-market/`} className="block rounded-lg bg-white border border-gray-200 p-4 text-center hover:shadow-md hover:border-accent/30 transition-all no-underline">
                <p className="font-heading font-bold text-primary text-sm">{sideB} Market</p>
                <p className="font-body text-xs text-muted mt-1">Stats & trends</p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* === Contact form === */}
      <section className="py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Get a Personalized Comparison
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Barrett Henry will give you a side-by-side analysis based on your budget, schools, commute, and lifestyle priorities.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source={`comparison-${comparison.slug}`}
          />
        </div>
      </section>
    </>
  );
}
