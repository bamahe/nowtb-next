// =============================================================================
// RealtorPage — Comprehensive city-specific REALTOR landing page
// Targets "[City] realtor", "[City] real estate agent" long-tail searches
// 1,000+ words of unique content per city with neighborhood links,
// service breakdowns, credentials, FAQs with schema, and testimonials.
// =============================================================================

import Link from "next/link";
import ListingGrid from "@/components/ui/ListingGrid";
import SpokeNav from "@/components/city/SpokeNav";
import ContactForm from "@/components/ui/ContactForm";
import { getListings } from "@/lib/bridge";
import { getPrimaryAgent } from "@/data/agents";
import { neighborhoods } from "@/data/neighborhoods";
import { SPOKE_TOPICS } from "@/data/cities";
import { testimonials } from "@/data/testimonials";
import type { CityData } from "@/data/cities";

interface RealtorPageProps {
  /** Full city data object — includes name, slug, county, zip_codes, etc. */
  city: CityData;
}

export default async function RealtorPage({ city }: RealtorPageProps) {
  // Fetch recent listings using ZIP codes
  let listings: import("@/lib/types").Listing[] = [];
  let totalListings = 0;
  try {
    const res = await getListings({
      zip_codes: city.zip_codes,
      exclude_rental: true,
      limit: "12",
      sort: "ModificationTimestamp desc",
    });
    listings = res.value || [];
    totalListings = res.total || listings.length;
  } catch {
    listings = [];
  }

  // Get Barrett's agent info
  const agent = getPrimaryAgent();

  // Get neighborhoods for this city
  const cityNeighborhoods = neighborhoods.filter((n) => n.city === city.slug);

  // Get real testimonials (use first 3)
  const featured = testimonials.slice(0, 3);

  // Property search spoke links for this city
  const spokeLinks = SPOKE_TOPICS.filter(
    (t) => t.slug !== "neighborhood-guide" && t.slug !== "housing-market"
  );

  return (
    <>
      {/* ================================================================== */}
      {/* JSON-LD: FAQPage + BreadcrumbList + RealEstateAgent schemas        */}
      {/* ================================================================== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: `Who is the best realtor in ${city.name}, Florida?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Barrett Henry is a top-producing REALTOR\u00AE and Broker Associate with REMAX Collective serving ${city.name} and the Tampa Bay area. With 24+ years of real estate experience, FL Broker License #BK3313308, and designations including e-PRO, MRP, and SRS, Barrett has the credentials and track record to deliver results. He is a REMAX Hall of Fame member. Call (813) 733-7907.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `Who is the best realtor in ${city.name} for relocation?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Barrett Henry holds the MRP (Military Relocation Professional) designation and works relocating buyers into ${city.name} and ${city.county} County regularly, including remote buyers who tour and close without flying down twice. Relocation needs more than listing access: Florida property taxes reset to market value at purchase rather than carrying over the seller's capped assessment, homestead portability only transfers between Florida homesteads so an out-of-state buyer starts fresh, and insurance underwriting on roof age and flood zone decides more deals than the inspection does. Call (813) 733-7907.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `Will my property taxes in ${city.name} match the seller's current bill?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Almost certainly not, and this is the biggest surprise for out-of-state buyers. Florida's Save Our Homes cap limits annual assessed-value increases on a homesteaded property, so a long-time owner may pay far less than you will on an identical house. You reset to market value at purchase. Homestead portability transfers an accumulated Save Our Homes benefit only from one Florida homestead to another, so a buyer moving in from out of state starts fresh: apply for homestead exemption with the county property appraiser and the cap protects you going forward. A second home or rental gets the 10 percent non-homestead cap instead, with no exemption. Budget from the actual parcel record, not the seller's bill.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `Can I buy a home in ${city.name} without flying to Florida?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Yes. Barrett Henry runs relocation buyers and sellers remotely as standard practice: video walkthroughs on request rather than canned listing tours, honest condition read-outs, electronic signatures, and a title company that closes remotely. Military families relocating to MacDill AFB on a PCS timeline are a regular part of the work, which is what the MRP designation covers. Call (813) 733-7907 with your timeline and where you are moving from.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `How do I find a REALTOR\u00AE in ${city.name}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Contact Barrett Henry directly at (813) 733-7907 or email barrett@nowtb.com. Barrett is a licensed Florida Broker Associate with REMAX Collective and serves all of ${city.name}, ${city.county} County, and the greater Tampa Bay metro. No call centers, no runaround \u2014 Barrett answers his own phone.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `What neighborhoods does Barrett Henry serve in ${city.name}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Barrett Henry serves all neighborhoods in ${city.name}, ${city.county} County, including ${cityNeighborhoods.slice(0, 8).map((n) => n.name).join(", ")}${cityNeighborhoods.length > 8 ? `, and ${cityNeighborhoods.length - 8} more` : ""}. Barrett also covers the entire Tampa Bay metro across 8 counties.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `Does Barrett Henry help with buying and selling in ${city.name}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Yes. Barrett Henry assists buyers, sellers, investors, and renters across ${city.name}. Services include residential sales, luxury homes, new construction, investment properties, commercial real estate, military relocation (MRP designation), and property management through ViVi PM. Call (813) 733-7907.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `How much does a REALTOR\u00AE cost in ${city.name}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Buyer representation with Barrett Henry costs you nothing out of pocket \u2014 the seller typically pays the buyer\u2019s agent commission in ${city.name}. For sellers, Barrett offers competitive commission structures with full-service marketing, professional photography, MLS exposure, and global reach through the REMAX network. Call (813) 733-7907 for a free consultation.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `What is the ${city.name} real estate market like right now?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `The ${city.name} real estate market is active with ${totalListings > 0 ? `${totalListings}+ active listings` : "homes available"} in ${city.county} County. Market conditions change daily \u2014 Barrett Henry monitors MLS data in real time and can provide a current market analysis for ${city.name} in minutes. Call (813) 733-7907 for the latest numbers.`,
                  },
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
                { "@type": "ListItem", position: 2, name: `${city.name} Homes`, item: `https://nowtb.com/${city.slug}` },
                { "@type": "ListItem", position: 3, name: `${city.name} REALTOR\u00AE`, item: `https://nowtb.com/${city.slug}-realtor` },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "Barrett Henry",
              jobTitle: "Broker Associate",
              description: `Top-producing REALTOR\u00AE and Broker Associate with REMAX Collective serving ${city.name}, ${city.county} County, and the Tampa Bay area. 24+ years of real estate experience. REMAX Hall of Fame member.`,
              telephone: "+1-813-733-7907",
              email: "barrett@nowtb.com",
              url: `https://nowtb.com/${city.slug}-realtor`,
              image: "https://nowtb.com/images/barrett-henry.jpg",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Tampa",
                addressRegion: "FL",
                postalCode: "33618",
                streetAddress: "14310 N. Dale Mabry Hwy, Ste 100",
              },
              areaServed: {
                "@type": "City",
                name: city.name,
                containedInPlace: {
                  "@type": "AdministrativeArea",
                  name: `${city.county} County, Florida`,
                },
              },
              memberOf: {
                "@type": "Organization",
                name: "REMAX Collective",
              },
              hasCredential: [
                { "@type": "EducationalOccupationalCredential", credentialCategory: "license", name: "FL Broker License #BK3313308" },
                { "@type": "EducationalOccupationalCredential", credentialCategory: "designation", name: "e-PRO" },
                { "@type": "EducationalOccupationalCredential", credentialCategory: "designation", name: "MRP (Military Relocation Professional)" },
                { "@type": "EducationalOccupationalCredential", credentialCategory: "designation", name: "SRS (Seller Representative Specialist)" },
              ],
            },
          ]),
        }}
      />

      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}
      <section className="bg-primary pt-36 pb-16">
        <div className="container-wide">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-2 text-xs font-body text-white/80 mb-6 tracking-wide uppercase">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${city.slug}`} className="hover:text-white/80 transition-colors">{city.name}</Link>
            <span>/</span>
            <span className="text-accent">REALTOR&reg;</span>
          </nav>

          <h1 className="heading-display text-display md:text-display-lg text-white mb-3">
            {city.name} REALTOR&reg; &mdash; Barrett Henry
          </h1>
          <p className="font-body text-white/80 text-lg max-w-3xl mb-4 leading-relaxed">
            Broker Associate with REMAX Collective serving {city.name}, {city.county} County, and the
            entire Tampa Bay metro. 24+ years of real estate experience. REMAX Hall of Fame member.
            FL Broker License #BK3313308.
          </p>
          <p className="font-body text-white/60 text-sm mb-8">
            Designations: e-PRO &bull; MRP (Military Relocation Professional) &bull; SRS (Seller Representative Specialist)
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 text-sm hover:bg-accent/90 transition-colors"
            >
              (813) 733-7907
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* WHY BARRETT — Deep value proposition                               */}
      {/* ================================================================== */}
      <section className="section-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — About Barrett + credentials */}
            <div>
              <p className="heading-label mb-4">YOUR {city.name.toUpperCase()} REALTOR&reg;</p>
              <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary mb-6">
                Why Choose Barrett Henry in {city.name}?
              </h2>
              <div className="font-body text-muted font-light space-y-4 leading-relaxed">
                <p>
                  Finding the right REALTOR&reg; in {city.name} can make the difference between a smooth transaction
                  and a stressful one. <strong>Barrett Henry</strong> is a licensed Florida Real Estate{" "}
                  <strong>Broker Associate</strong> with REMAX Collective &mdash; not a sales agent learning on
                  your deal. With <strong>24+ years of real estate experience</strong>, Barrett brings the market
                  knowledge, negotiation skill, and local expertise that {city.name} buyers and sellers need to
                  win in today&apos;s competitive market.
                </p>
                <p>
                  Barrett is a <strong>REMAX Hall of Fame</strong> member, meaning he has earned over $1 million
                  in gross commissions during his REMAX career. He holds three professional designations:{" "}
                  <strong>e-PRO</strong> (digital marketing and technology), <strong>MRP</strong> (Military
                  Relocation Professional), and <strong>SRS</strong> (Seller Representative Specialist). These
                  aren&apos;t participation trophies &mdash; they represent specialized training that directly
                  benefits clients.
                </p>
                <p>
                  Every client gets Barrett&apos;s direct cell phone number:{" "}
                  <a href="tel:+18137337907" className="text-accent font-semibold hover:underline">(813) 733-7907</a>.
                  No call centers. No automated voicemail trees. No being handed off to a junior agent. When you
                  call Barrett, Barrett answers.
                </p>
              </div>
            </div>
            {/* Right — Quick stats + contact card */}
            <div className="space-y-6">
              <div className="bg-primary p-8 text-white">
                <h3 className="font-heading font-bold text-lg mb-6">Barrett Henry at a Glance</h3>
                <div className="space-y-4 font-body text-sm">
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-white/70">Experience</span>
                    <span className="font-medium">24+ Years</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-white/70">License</span>
                    <span className="font-medium">FL Broker #BK3313308</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-white/70">Brokerage</span>
                    <span className="font-medium">REMAX Collective</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-white/70">Career Award</span>
                    <span className="font-medium">REMAX Hall of Fame</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-white/70">Designations</span>
                    <span className="font-medium">e-PRO, MRP, SRS</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-white/70">Team</span>
                    <span className="font-medium">The NOW Team</span>
                  </div>
                  <div className="flex justify-between pb-3">
                    <span className="text-white/70">Service Area</span>
                    <span className="font-medium">8 Tampa Bay Counties</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                  <p className="text-white/90 font-medium">
                    <a href="tel:+18137337907" className="hover:text-accent transition-colors">(813) 733-7907</a>
                  </p>
                  <p className="text-white/70 text-sm">
                    <a href="mailto:barrett@nowtb.com" className="hover:text-accent transition-colors">barrett@nowtb.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SERVICES — What Barrett does in this city                          */}
      {/* ================================================================== */}
      <section className="section-light">
        <div className="container-wide">
          <p className="heading-label text-center mb-4">FULL-SERVICE REAL ESTATE</p>
          <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary text-center mb-6">
            Real Estate Services in {city.name}
          </h2>
          <p className="font-body text-muted font-light text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            Barrett Henry and The NOW Team handle every type of real estate transaction in {city.name} &mdash;
            from first-time buyers to luxury estates, investment properties to commercial deals. Here&apos;s
            what Barrett brings to the table.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service cards */}
            {[
              {
                title: `Buying a Home in ${city.name}`,
                desc: `Looking for homes in ${city.name}? Barrett helps buyers at every price point — from starter homes to luxury properties. You get Barrett's direct guidance on neighborhoods, school zones, flood maps, HOA rules, and pricing strategy. Buyer representation typically costs you nothing out of pocket.`,
                link: `/${city.slug}-homes-for-sale/`,
                linkText: "Browse Homes for Sale",
              },
              {
                title: `Selling Your ${city.name} Home`,
                desc: `Barrett's seller clients benefit from professional photography, MLS exposure, targeted digital marketing, and the global reach of the REMAX network (145,000+ agents in 120+ countries). Every listing gets a custom pricing strategy backed by current MLS comp data — not a Zestimate.`,
                link: `/sell-your-home-${city.slug}/`,
                linkText: "Selling Resources",
              },
              {
                title: "Investment Properties",
                desc: `Whether you're buying your first rental property or expanding a portfolio, Barrett analyzes cap rates, cash-on-cash returns, and rental market data for ${city.name} and ${city.county} County. He also manages investment properties through ViVi PM for clients who want hands-off ownership.`,
                link: `/${city.slug}-investment-property/`,
                linkText: "Investment Properties",
              },
              {
                title: "New Construction",
                desc: `${city.name} has active new-construction communities with builder incentives that change monthly. Barrett knows every builder, every phase, and which incentives are actually worth taking. Having your own REALTOR® in a new-construction deal protects your interests — the builder's agent works for the builder, not you.`,
                link: `/${city.slug}-new-construction/`,
                linkText: "New Construction",
              },
              {
                title: "Military Relocation (MRP)",
                desc: `Barrett holds the Military Relocation Professional (MRP) designation and understands VA loans, BAH calculations, PCS timelines, and the unique challenges military families face. Whether you're PCSing to MacDill AFB, relocating from another base, or a veteran using your VA benefit, Barrett has you covered.`,
                link: "/contact/",
                linkText: "Contact Barrett",
              },
              {
                title: "Commercial Real Estate",
                desc: `Through REMAX Commercial, Barrett handles commercial transactions in ${city.name} including retail, office, multifamily, industrial, and land. REMAX Commercial agents have access to CoStar, LoopNet Premium, and Crexi Professional — the same tools used by the largest commercial brokerages.`,
                link: "/contact/",
                linkText: "Discuss a Commercial Deal",
              },
            ].map((service) => (
              <div key={service.title} className="bg-white border border-gray-100 p-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-3">{service.title}</h3>
                <p className="font-body text-muted text-sm font-light leading-relaxed mb-4">{service.desc}</p>
                <Link href={service.link} className="font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors">
                  {service.linkText} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PROPERTY SEARCH LINKS — Spoke topic grid for SEO internal linking  */}
      {/* ================================================================== */}
      <section className="section-white">
        <div className="container-wide">
          <p className="heading-label text-center mb-4">SEARCH BY PROPERTY TYPE</p>
          <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary text-center mb-8">
            {city.name} Property Search
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {spokeLinks.map((topic) => (
              <Link
                key={topic.slug}
                href={`/${city.slug}-${topic.slug}/`}
                className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10"
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* LISTINGS — Active homes for sale                                   */}
      {/* ================================================================== */}
      {listings.length > 0 && (
        <ListingGrid
          listings={listings}
          title={`Homes for Sale in ${city.name}`}
          subtitle={`${totalListings > listings.length ? `Showing ${listings.length} of ${totalListings}` : listings.length} active listings in ${city.name}, ${city.county} County. Updated daily from Stellar MLS.`}
        />
      )}

      {/* MLS disclaimer */}
      {listings.length > 0 && (
        <section className="container-wide pb-4">
          <p className="font-body text-xs text-muted/60 leading-relaxed max-w-4xl">
            Listing information provided by Stellar MLS. IDX information is for personal, non-commercial use only.
            Data is deemed reliable but not guaranteed. All properties are subject to prior sale, change, or withdrawal.
          </p>
        </section>
      )}

      {/* ================================================================== */}
      {/* NEIGHBORHOODS — Every neighborhood in this city, linked            */}
      {/* ================================================================== */}
      {cityNeighborhoods.length > 0 && (
        <section className="section-light">
          <div className="container-wide">
            <p className="heading-label text-center mb-4">NEIGHBORHOODS &amp; SUBDIVISIONS</p>
            <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary text-center mb-4">
              {city.name} Neighborhoods Barrett Serves
            </h2>
            <p className="font-body text-muted font-light text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              Barrett Henry is your REALTOR&reg; for every neighborhood and subdivision in {city.name}. Whether
              you&apos;re buying, selling, or just exploring, Barrett knows the streets, the schools, the HOAs,
              and the price trends in each of these communities.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {cityNeighborhoods.map((n) => (
                <Link
                  key={n.slug}
                  href={`/${n.slug}/`}
                  className="block border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10"
                >
                  {n.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* REMAX BRAND — Why REMAX matters for this city                      */}
      {/* ================================================================== */}
      <section className="section-dark">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="heading-label text-white/50 mb-4">THE REMAX ADVANTAGE</p>
              <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-white mb-6">
                Why REMAX in {city.name}?
              </h2>
              <div className="font-body text-white/80 font-light space-y-4 leading-relaxed">
                <p>
                  When you work with Barrett Henry, you get the full power of the most recognized real estate brand
                  on the planet. REMAX operates in <strong>120+ countries</strong> with <strong>145,000+ agents</strong> and
                  over <strong>50 years</strong> of proven results. REMAX agents average <strong>11.9 transaction
                  sides per year</strong> &mdash; more than double the industry average of 5.3.
                </p>
                <p>
                  For sellers in {city.name}, that brand recognition translates directly into more eyeballs on
                  your listing. REMAX has <strong>32.9% unaided brand awareness</strong> &mdash; more people name
                  REMAX first, without prompting, than any other real estate company. When your listing has the
                  REMAX name behind it, buyers pay attention.
                </p>
                <p>
                  For buyers, REMAX&apos;s global referral network means Barrett can connect you with a vetted agent
                  anywhere in the world. Moving to {city.name} from out of state? Barrett receives referrals from
                  REMAX agents nationwide. Leaving {city.name}? Barrett connects you with someone he trusts at your
                  destination.
                </p>
              </div>
              <div className="mt-6">
                <Link href="/remax-tampa/" className="font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-white transition-colors">
                  Learn More About REMAX &rarr;
                </Link>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/10 p-6 text-center">
                <p className="font-heading font-bold text-3xl text-accent">120+</p>
                <p className="font-body text-white/70 text-xs mt-1">Countries</p>
              </div>
              <div className="border border-white/10 p-6 text-center">
                <p className="font-heading font-bold text-3xl text-accent">145K+</p>
                <p className="font-body text-white/70 text-xs mt-1">Agents</p>
              </div>
              <div className="border border-white/10 p-6 text-center">
                <p className="font-heading font-bold text-3xl text-accent">11.9</p>
                <p className="font-body text-white/70 text-xs mt-1">Avg Sides/Year</p>
              </div>
              <div className="border border-white/10 p-6 text-center">
                <p className="font-heading font-bold text-3xl text-accent">#1</p>
                <p className="font-body text-white/70 text-xs mt-1">Most Trusted Brand</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* TESTIMONIALS — Real Google reviews                                 */}
      {/* ================================================================== */}
      <section className="section-white">
        <div className="container-wide">
          <p className="heading-label text-center mb-4">CLIENT REVIEWS</p>
          <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary text-center mb-10">
            What Clients Say About Barrett Henry
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((t) => (
              <div key={t.name} className="border border-gray-100 p-8">
                <p className="text-accent text-lg mb-4">★★★★★</p>
                <p className="font-body text-muted font-light text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <p className="font-body text-primary font-medium text-sm">{t.name}</p>
                <p className="font-body text-muted/60 text-xs">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* THE BUYING PROCESS — Educational SEO content                       */}
      {/* ================================================================== */}
      <section className="section-light">
        <div className="container-wide max-w-3xl">
          <p className="heading-label mb-4">STEP BY STEP</p>
          <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary mb-8">
            How Barrett Helps You Buy a Home in {city.name}
          </h2>
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Initial Consultation",
                desc: `Call Barrett at (813) 733-7907 or schedule a meeting. You'll discuss your goals, budget, timeline, and what you're looking for in ${city.name}. Barrett will explain the current market conditions, what your budget can get you, and what to expect from start to close.`,
              },
              {
                step: "2",
                title: "Pre-Approval & Strategy",
                desc: "Barrett connects you with trusted local lenders for pre-approval. He'll help you understand your buying power across different loan programs — FHA, VA, conventional, USDA, and down payment assistance programs specific to your county.",
              },
              {
                step: "3",
                title: "Home Search & Showings",
                desc: `Barrett sets up custom MLS alerts based on your exact criteria — neighborhood, price range, features, school zones. You'll see new listings within minutes of hitting the market. Barrett schedules and attends every showing with you, pointing out things you might miss.`,
              },
              {
                step: "4",
                title: "Offer & Negotiation",
                desc: `Barrett writes competitive offers backed by comp analysis, not emotion. He negotiates on your behalf — price, closing costs, repairs, timelines, contingencies. With 24+ years of real estate experience, Barrett knows how to win in multiple-offer situations without overpaying.`,
              },
              {
                step: "5",
                title: "Under Contract to Close",
                desc: "Barrett manages inspections, appraisals, title, and lender coordination. He stays on top of every deadline so nothing falls through the cracks. You'll know exactly where things stand at every step — no surprises, no last-minute scrambles.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white font-heading font-bold text-xl flex items-center justify-center">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">{item.title}</h3>
                  <p className="font-body text-muted font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* RELOCATION — targets "[city] relocation realtor" / "moving to [city]" */}
      {/* ================================================================== */}
      <section className="section-light">
        <div className="container-wide max-w-3xl">
          <p className="heading-label mb-4">MOVING FROM OUT OF STATE</p>
          <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary mb-6">
            Relocating to {city.name}? Start Here
          </h2>
          <p className="font-body text-muted font-light leading-relaxed mb-8">
            Relocation is a different job than a local move, and most of what trips people up in
            Florida has nothing to do with the house itself. Barrett Henry holds the{" "}
            <strong>MRP (Military Relocation Professional)</strong> designation and works relocating
            buyers into {city.name} and {city.county} County regularly &mdash; including remote
            buyers who tour and close without flying down twice. Here is what actually matters.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                Your property taxes will not match your neighbor&apos;s
              </h3>
              <div className="font-body text-muted font-light space-y-3 leading-relaxed">
                <p>
                  This is the single biggest surprise for out-of-state buyers. Florida&apos;s{" "}
                  <strong>Save Our Homes</strong> cap limits how much a homesteaded property&apos;s
                  assessed value can rise each year, so a neighbor who has owned since 2012 may pay a
                  fraction of what you will on an identical house. You are not inheriting their
                  number &mdash; you reset to market value at purchase.
                </p>
                <p>
                  And <strong>portability does not help you</strong> on a move into Florida. It
                  transfers an accumulated Save Our Homes benefit from one <em>Florida</em> homestead
                  to another. Coming from out of state, you start fresh: apply for{" "}
                  <strong>homestead exemption</strong> with the county property appraiser, and the
                  cap begins protecting you going forward. If the property will be a second home or a
                  rental rather than your primary residence, you get the <strong>10% non-homestead
                  cap</strong> instead of the homestead cap, and no exemption. Budget from the actual
                  parcel record, never from the seller&apos;s current tax bill.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                Insurance is the real gate, not the inspection
              </h3>
              <div className="font-body text-muted font-light space-y-3 leading-relaxed">
                <p>
                  In Florida, deals die at underwriting more often than at inspection. The deciding
                  factors are usually <strong>roof age</strong>, <strong>flood zone</strong>, and
                  whether anyone has filed a current wind mitigation inspection.
                </p>
                <p>
                  Useful protection to know: under Florida Statute 627.7011(5), an insurer{" "}
                  <strong>may not refuse to issue or renew</strong> a policy on a home with a roof{" "}
                  <strong>less than 15 years old</strong> solely because of the roof&apos;s age. If
                  the roof is 15 or older, an inspection showing <strong>five or more years of
                  remaining useful life</strong> gives you the same protection. Separately, a{" "}
                  <strong>four-point inspection</strong> is not required by Florida law at all
                  &mdash; it is a carrier underwriting requirement, and Citizens triggers one on
                  properties more than 20 years old.
                </p>
                <p>
                  Do this before your inspection period closes: pull the flood zone, ask the roof&apos;s
                  age and documented remaining life, get a current wind mitigation inspection on the
                  state form, and have the policy <strong>quoted in your own name</strong>. A quote in
                  the seller&apos;s name tells you very little.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                If you are buying a condo, the documents decide it
              </h3>
              <div className="font-body text-muted font-light leading-relaxed">
                <p>
                  Florida&apos;s post-Surfside law requires condo and co-op buildings{" "}
                  <strong>three habitable stories or more</strong> to complete a{" "}
                  <strong>milestone structural inspection</strong> and fund a{" "}
                  <strong>Structural Integrity Reserve Study</strong>, and associations subject to a
                  reserve study can no longer vote to underfund those structural components. That has
                  pushed dues up and triggered special assessments across Tampa Bay. Before you waive
                  due diligence, get the completed milestone report, the reserve study, current
                  reserve balances, twelve months of board minutes, and any assessment already voted
                  or under discussion. A well-funded building at a higher price usually beats a cheap
                  one whose assessment has not landed yet.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                Ask which jurisdiction the parcel is actually in
              </h3>
              <div className="font-body text-muted font-light leading-relaxed">
                <p>
                  A {city.name} mailing address does not always mean the property sits inside{" "}
                  {city.name} city limits &mdash; Tampa Bay is full of unincorporated pockets with
                  city mailing addresses. The distinction is not cosmetic: it changes your{" "}
                  <strong>property tax millage</strong>, <strong>who issues your permits</strong>,
                  your <strong>floodplain repair rules</strong>, and even your{" "}
                  <strong>flood insurance discount</strong>, since FEMA rates each community
                  separately. Confirm it on the county property appraiser&apos;s parcel record before
                  you write an offer.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                You do not have to fly down twice
              </h3>
              <div className="font-body text-muted font-light leading-relaxed">
                <p>
                  Barrett runs relocation buyers and sellers remotely as a matter of course: video
                  walkthroughs on request rather than canned listing tours, honest read-outs on
                  condition, electronic signatures, and coordination with a title company that closes
                  remotely. Military families moving to MacDill AFB on a PCS timeline are a regular
                  part of the work &mdash; that is what the MRP designation is for. See the{" "}
                  <Link href="/remote-seller-process/" className="text-link hover:underline">
                    remote process
                  </Link>{" "}
                  if you are selling from out of the area.
                </p>
              </div>
            </div>
          </div>

          {/* Relocation CTA + guides */}
          <div className="mt-10 bg-primary p-8">
            <h3 className="font-heading font-bold text-xl text-white mb-2">
              Moving to {city.name} from out of state?
            </h3>
            <p className="font-body text-white/70 text-sm leading-relaxed mb-6">
              Tell Barrett your timeline, your must-haves, and where you are coming from. You will get
              a straight read on neighborhoods, taxes, and insurance before you book a trip &mdash; not
              a drip campaign.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+18137337907"
                className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 text-sm hover:bg-accent/90 transition-colors"
              >
                Call (813) 733-7907
              </a>
              <Link
                href="/relocation/"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors"
              >
                Relocation Services
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {[
              { href: "/blog/ultimate-tampa-bay-relocation-guide/", label: "The ultimate Tampa Bay relocation guide" },
              { href: "/blog/relocating-tampa-bay-2026/", label: "Relocating to Tampa Bay: what to know first" },
              { href: "/blog/military-relocation-tampa-macdill-guide/", label: "Military relocation & MacDill AFB" },
              { href: "/blog/relocating-to-florida-from-northeast/", label: "Relocating from the Northeast" },
              { href: "/blog/moving-to-tampa-bay-cost-of-living-guide/", label: "Tampa Bay cost of living" },
              { href: "/blog/homestead-exemption-florida-guide/", label: "Florida homestead exemption guide" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-body text-sm text-link hover:underline font-light leading-snug"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FAQ — Comprehensive, targeting long-tail "[city] realtor" queries   */}
      {/* ================================================================== */}
      <section className="section-white">
        <div className="container-wide max-w-3xl">
          <h2 className="font-heading font-bold text-2xl text-primary mb-8">
            Frequently Asked Questions &mdash; {city.name} REALTOR&reg;
          </h2>
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Who is the best realtor in {city.name}, Florida?</h3>
              <p className="font-body text-muted font-light">Barrett Henry is a top-producing REALTOR&reg; and Broker Associate with REMAX Collective serving {city.name} and the Tampa Bay area. With 24+ years of real estate experience, FL Broker License #BK3313308, and designations including e-PRO, MRP, and SRS, Barrett has the credentials and track record that matter. He is a REMAX Hall of Fame member. Call <a href="tel:+18137337907" className="text-link hover:underline">(813) 733-7907</a>.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Who is the best realtor in {city.name} for relocation?</h3>
              <p className="font-body text-muted font-light">Barrett Henry holds the <strong>MRP (Military Relocation Professional)</strong> designation and works relocating buyers into {city.name} and {city.county} County regularly &mdash; including remote buyers who tour and close without flying down twice. Relocation takes more than listing access: Florida property taxes reset to market value at purchase instead of carrying over the seller&apos;s capped assessment, homestead portability only transfers between Florida homesteads so an out-of-state buyer starts fresh, and insurance underwriting on roof age and flood zone kills more deals than the inspection does. Call <a href="tel:+18137337907" className="text-link hover:underline">(813) 733-7907</a>.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Will my {city.name} property taxes match the seller&apos;s current bill?</h3>
              <p className="font-body text-muted font-light">Almost certainly not. Florida&apos;s <strong>Save Our Homes</strong> cap limits annual assessed-value increases on a homesteaded property, so a long-time owner may pay a fraction of what you will on an identical house &mdash; you reset to market value at purchase. <strong>Portability transfers only between Florida homesteads</strong>, so moving in from out of state you start fresh: apply for homestead exemption with the county property appraiser and the cap protects you going forward. A second home or rental gets the 10% non-homestead cap instead, with no exemption. See our <a href="/blog/homestead-exemption-florida-guide/" className="text-link hover:underline">Florida homestead exemption guide</a>.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Can I buy a home in {city.name} without flying to Florida?</h3>
              <p className="font-body text-muted font-light">Yes. Barrett runs relocation buyers and sellers remotely as standard practice: video walkthroughs on request rather than canned listing tours, honest condition read-outs, electronic signatures, and a title company that closes remotely. Military families on a PCS timeline to MacDill AFB are a regular part of the work. See the <a href="/remote-seller-process/" className="text-link hover:underline">remote process</a> or call <a href="tel:+18137337907" className="text-link hover:underline">(813) 733-7907</a>.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">How do I find a REALTOR&reg; in {city.name}?</h3>
              <p className="font-body text-muted font-light">Contact Barrett Henry directly at <a href="tel:+18137337907" className="text-link hover:underline">(813) 733-7907</a> or email <a href="mailto:barrett@nowtb.com" className="text-link hover:underline">barrett@nowtb.com</a>. Barrett is a licensed Florida Broker Associate with REMAX Collective and serves all of {city.name}, {city.county} County, and the greater Tampa Bay metro.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">What neighborhoods does Barrett serve in {city.name}?</h3>
              <p className="font-body text-muted font-light">Barrett serves every neighborhood in {city.name}{cityNeighborhoods.length > 0 ? `, including ${cityNeighborhoods.map((n) => n.name).join(", ")}` : ""}. Barrett also covers the entire Tampa Bay metro across 8 counties: Hillsborough, Pinellas, Pasco, Polk, Manatee, Sarasota, Hernando, and Citrus.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">Does Barrett help with buying and selling in {city.name}?</h3>
              <p className="font-body text-muted font-light">Yes. Barrett assists buyers, sellers, investors, and renters across {city.name}. Services include residential sales, luxury homes, new construction, investment properties, commercial real estate, military relocation, and property management through ViVi PM.</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">How much does a REALTOR&reg; cost in {city.name}?</h3>
              <p className="font-body text-muted font-light">Buyer representation with Barrett Henry typically costs you nothing out of pocket — the seller usually pays the buyer&apos;s agent commission. For sellers, Barrett offers competitive commission structures with full-service marketing, professional photography, MLS exposure, and global reach through REMAX&apos;s 145,000+ agent network.</p>
            </div>
            <div className="pb-6">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">What is the {city.name} real estate market like right now?</h3>
              <p className="font-body text-muted font-light">{totalListings > 0 ? `There are currently ${totalListings}+ active listings in ${city.name}.` : `The ${city.name} market is active.`} Market conditions change daily — Barrett monitors MLS data in real time and can provide a current market analysis for {city.name} in minutes. Call <a href="tel:+18137337907" className="text-link hover:underline">(813) 733-7907</a> for the latest numbers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SPOKE NAV — Explore more about this city                           */}
      {/* ================================================================== */}
      <SpokeNav city={city} currentTopic="realtor" />

      {/* ================================================================== */}
      {/* CONTACT FORM                                                       */}
      {/* ================================================================== */}
      <section className="section-light">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl text-primary mb-2 text-center">
            Contact Your {city.name} REALTOR&reg;
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Reach Barrett Henry directly. Call{" "}
            <a href="tel:+18137337907" className="text-link hover:underline">(813) 733-7907</a>{" "}
            or send a message below.
          </p>
          <ContactForm webhookUrl="/api/contact" source={`${city.slug}-realtor`} />
        </div>
      </section>

      {/* ================================================================== */}
      {/* BOTTOM CTA BAR                                                     */}
      {/* ================================================================== */}
      <section className="bg-primary py-12">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-white mb-1">
              Work with the Best REALTOR&reg; in {city.name}
            </h2>
            <p className="font-body text-white/70 text-sm">
              Barrett Henry &bull; Broker Associate &bull; REMAX Hall of Fame &bull; 24+ years of real estate experience
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="tel:+18137337907" className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 text-sm hover:bg-accent/90 transition-colors">
              Call Now
            </a>
            <Link href="/contact/" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors">
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
