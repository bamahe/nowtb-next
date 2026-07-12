// =============================================================================
// /commercial — Commercial real estate in Tampa Bay
// Barrett Henry, Broker Associate at REMAX Collective
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ContactForm from "@/components/ui/ContactForm";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import type { Listing } from "@/lib/types";

// ISR: cache for 15 min to reduce Bridge API calls
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Commercial Real Estate Tampa Bay | Barrett Henry, REALTOR®",
  description:
    "Tampa Bay commercial real estate — office, retail, industrial, multifamily, and land. 23+ years of experience. Barrett Henry, REMAX Collective. (813) 733-7907.",
  alternates: {
    canonical: "/commercial/",
  },
};

// -- FAQ data used for both schema and rendered content --
const faqs = [
  {
    q: "What types of commercial real estate are available in Tampa Bay?",
    a: "Tampa Bay offers a wide range of commercial property types including Class A and B office space, retail storefronts and shopping centers, industrial warehouses, multifamily apartment complexes, and vacant land for development. Barrett Henry helps buyers and investors identify the right asset class based on their goals, budget, and risk tolerance.",
  },
  {
    q: "What cap rates can investors expect on Tampa Bay commercial properties?",
    a: "Cap rates in Tampa Bay vary by property type and location. Multifamily properties typically range from 5% to 7%, retail from 5.5% to 8%, office space from 6% to 8.5%, and industrial from 5% to 7.5%. These figures shift with market conditions, interest rates, and location. Contact Barrett Henry at (813) 733-7907 for current data on specific submarkets.",
  },
  {
    q: "Do I need a commercial real estate license to buy commercial property in Florida?",
    a: "No. Buyers do not need a license to purchase commercial property in Florida. However, working with a licensed REALTOR who understands commercial transactions, zoning regulations, environmental due diligence, and lease analysis is strongly recommended. Barrett Henry holds a Florida Broker Associate license and has 23+ years of real estate experience.",
  },
  {
    q: "Which Tampa Bay corridors are best for commercial investment?",
    a: "The strongest commercial corridors include the Westshore Business District (Tampa Bay's largest office market), Downtown Tampa, the I-75 corridor through Hillsborough and Pasco counties, the I-4 corridor connecting Tampa to Lakeland and Orlando, and the Gateway area in St. Petersburg. Each corridor serves different tenant profiles and investment strategies.",
  },
  {
    q: "Can Barrett Henry help with 1031 exchanges into commercial property?",
    a: "Yes. Barrett Henry regularly assists investors executing 1031 exchanges from residential into commercial assets and from one commercial property into another. He coordinates with qualified intermediaries, tax advisors, and title companies to ensure exchange timelines and IRS requirements are met. Visit the investing page at nowtb.com/investing for more details.",
  },
];

// Major area ZIPs for commercial listings
const AREA_SEARCHES = [
  { name: "Tampa", zips: ["33602","33604","33606","33609","33611","33614","33619","33647"] },
  { name: "St. Petersburg", zips: ["33701","33702","33704","33710","33712"] },
  { name: "Brandon", zips: ["33510","33511"] },
  { name: "Riverview", zips: ["33578","33579"] },
  { name: "Lakeland", zips: ["33801","33803","33805","33809","33810","33811","33813"] },
  { name: "Clearwater", zips: ["33755","33756","33763","33765"] },
  { name: "Largo", zips: ["33770","33771","33778"] },
  { name: "Bradenton", zips: ["34201","34202","34205","34207","34208"] },
  { name: "Sarasota", zips: ["34231","34232","34236","34237"] },
  { name: "Wesley Chapel", zips: ["33543","33544","33558","33559"] },
  { name: "Pasco County", zips: ["34638","34639","34652","34653","34655"] },
];

export default async function CommercialPage() {
  // Fetch commercial listings from Bridge API
  let commercialListings: Listing[] = [];
  let totalCommercial = 0;
  try {
    const res = await getListings({
      property_type: "Commercial Sale",
      limit: "24",
      sort: "ModificationTimestamp desc",
    });
    commercialListings = res.value || [];
    totalCommercial = res.total || commercialListings.length;
  } catch {
    commercialListings = [];
  }

  // Also fetch land listings
  let landListings: Listing[] = [];
  try {
    const res = await getListings({
      property_type: "Land",
      limit: "12",
      sort: "ModificationTimestamp desc",
    });
    landListings = res.value || [];
  } catch {
    landListings = [];
  }

  return (
    <>
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Commercial Real Estate", item: "https://nowtb.com/commercial" },
            ],
          }),
        }}
      />

      {/* FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* === Hero === */}
      <HeroSection
        title="Commercial Real Estate in Tampa Bay"
        subtitle="Office, retail, industrial, multifamily, and land opportunities across Tampa Bay's fastest-growing corridors."
      >
        <SearchBar />
      </HeroSection>

      {/* === Overview === */}
      <section className="section-white">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-section text-xl text-primary mb-6 text-center">
            Tampa Bay Commercial Real Estate Overview
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              Tampa Bay is one of the fastest-growing metropolitan areas in the United States,
              and its commercial real estate market reflects that momentum. Population growth,
              corporate relocations, infrastructure investment, and tourism have created strong
              demand across every commercial asset class. Whether you are an investor looking for
              stable cash flow, a business owner searching for the right space, or a developer
              evaluating land opportunities, Tampa Bay delivers.
            </p>
            <p>
              Barrett Henry is a Broker Associate at REMAX Collective with 23+ years of real
              estate experience. He works with buyers, sellers, tenants, and investors on
              commercial transactions ranging from small retail storefronts to multifamily
              apartment complexes. Barrett provides market analysis, property evaluation,
              lease review, and negotiation support through every phase of a commercial deal.
            </p>
          </div>
        </div>
      </section>

      {/* === Property Types === */}
      <section className="section-light">
        <div className="container-wide">
          <h2 className="heading-section text-xl text-primary mb-8 text-center">
            Commercial Property Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Office Space",
                desc: "Class A towers in Westshore and Downtown Tampa, Class B suburban offices along the I-75 and I-4 corridors, and flexible co-working conversions. Tampa Bay's office market benefits from corporate relocations and Florida's business-friendly tax structure.",
              },
              {
                title: "Retail Properties",
                desc: "Strip centers, standalone storefronts, outparcels, and neighborhood shopping plazas. Retail performs well in high-traffic corridors with strong residential rooftops. Barrett helps tenants and landlords negotiate NNN, modified gross, and percentage leases.",
              },
              {
                title: "Industrial & Warehouse",
                desc: "Distribution centers, flex space, light manufacturing, and cold storage facilities. Tampa Bay's port access, interstate connectivity, and e-commerce growth drive consistent industrial demand across Hillsborough, Pasco, and Polk counties.",
              },
              {
                title: "Multifamily Investments",
                desc: "Apartment complexes, duplexes, fourplexes, and mixed-use buildings. Tampa Bay's population growth and rental demand create strong occupancy rates. Multifamily assets typically deliver cap rates between 5% and 7% depending on location and condition.",
              },
              {
                title: "Vacant Land",
                desc: "Development-ready parcels, agricultural land for conversion, and infill lots in established submarkets. Zoning analysis, environmental review, and entitlement research are critical — Barrett coordinates with land-use attorneys and engineers.",
              },
              {
                title: "Mixed-Use Development",
                desc: "Ground-floor retail with upper-story residential or office space. Mixed-use projects are expanding rapidly in urban cores like Downtown Tampa, St. Petersburg, and Dunedin, driven by walkability demand and municipal incentive programs.",
              },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Commercial Listings === */}
      {commercialListings.length > 0 && (
        <>
          <ListingGrid
            listings={commercialListings}
            title="Commercial Properties for Sale"
            subtitle={`${totalCommercial.toLocaleString()} commercial properties available across Tampa Bay. Updated daily from Stellar MLS.`}
          />
          <section className="container-wide py-4 text-center">
            <Link
              href="/properties/search/?property_type=Commercial+Sale"
              className="btn-primary inline-block px-10 py-4"
            >
              View All {totalCommercial.toLocaleString()} Commercial Listings
            </Link>
          </section>
        </>
      )}

      {/* === Land Listings === */}
      {landListings.length > 0 && (
        <ListingGrid
          listings={landListings}
          title="Land for Sale"
          subtitle="Development-ready parcels, agricultural land, and infill lots across Tampa Bay."
        />
      )}

      {/* === Search by Area === */}
      <section className="section-light">
        <div className="container-wide">
          <h2 className="heading-section text-xl text-primary mb-6 text-center">
            Commercial Real Estate by Area
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {AREA_SEARCHES.map((area) => (
              <Link
                key={area.name}
                href={`/properties/search/?property_type=Commercial+Sale&zip_codes=${area.zips.join(",")}&q=${encodeURIComponent(area.name)}`}
                className="block rounded-lg border border-gray-200 bg-white px-4 py-4 text-center hover:shadow-md hover:border-accent/30 transition-all no-underline"
              >
                <p className="font-heading font-bold text-primary text-sm">{area.name}</p>
                <p className="font-body text-xs text-muted mt-1">Commercial Properties</p>
              </Link>
            ))}
            <Link
              href="/properties/search/?property_type=Land"
              className="block rounded-lg border border-gray-200 bg-white px-4 py-4 text-center hover:shadow-md hover:border-accent/30 transition-all no-underline"
            >
              <p className="font-heading font-bold text-primary text-sm">All Areas</p>
              <p className="font-body text-xs text-muted mt-1">Land &amp; Lots</p>
            </Link>
          </div>
        </div>
      </section>

      {/* === Key Corridors === */}
      <section className="section-white">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-section text-xl text-primary mb-6 text-center">
            Key Commercial Corridors
          </h2>
          <div className="font-body text-muted space-y-6 leading-relaxed">
            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                Westshore Business District
              </h3>
              <p>
                Tampa Bay&apos;s largest concentration of office space, with over 14 million
                square feet. Westshore sits between Tampa International Airport and Downtown,
                making it a top choice for corporate headquarters, financial firms, and
                professional services. Retail and hospitality also thrive in the district.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                Downtown Tampa &amp; Water Street
              </h3>
              <p>
                Downtown Tampa has transformed with the Water Street development, Sparkman
                Wharf, and a wave of Class A office towers. Mixed-use projects are drawing
                national tenants, and residential density is fueling ground-floor retail
                demand. The area also benefits from proximity to the University of Tampa and
                Amalie Arena.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                I-75 Corridor (Hillsborough &amp; Pasco)
              </h3>
              <p>
                The I-75 corridor from Brandon north through Wesley Chapel is one of the
                fastest-growing commercial corridors in the state. New retail plazas,
                medical offices, industrial parks, and multifamily developments are
                following the explosive residential growth in Pasco County.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                I-4 Corridor (Tampa to Lakeland)
              </h3>
              <p>
                The I-4 corridor connects Tampa Bay to Central Florida and sees heavy
                industrial and logistics activity. Warehouse distribution centers,
                manufacturing facilities, and flex space are concentrated along this route,
                particularly near Plant City and eastern Hillsborough County.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                Gateway Area &amp; St. Petersburg
              </h3>
              <p>
                The Gateway area near St. Pete-Clearwater International Airport is Pinellas
                County&apos;s primary office and industrial submarket. Downtown St. Petersburg
                has also emerged as a vibrant commercial district with boutique office space,
                arts-driven retail, and upscale mixed-use development along Central Avenue
                and the waterfront.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === Cap Rates & Investment === */}
      <section className="section-light">
        <div className="container-wide max-w-4xl">
          <h2 className="heading-section text-xl text-primary mb-6 text-center">
            Commercial Cap Rate Ranges in Tampa Bay
          </h2>
          <p className="font-body text-muted text-center mb-8 max-w-2xl mx-auto">
            Cap rates fluctuate with market conditions, interest rates, and property quality.
            The following ranges reflect typical Tampa Bay commercial transactions. Contact
            Barrett for current data on specific submarkets and asset classes.
          </p>
          {/* Cap rate comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-primary/20">
                  <th className="font-heading font-bold text-primary py-3 px-4">Property Type</th>
                  <th className="font-heading font-bold text-primary py-3 px-4">Typical Cap Rate</th>
                  <th className="font-heading font-bold text-primary py-3 px-4">Key Drivers</th>
                </tr>
              </thead>
              <tbody className="font-body text-muted text-sm">
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold">Multifamily</td>
                  <td className="py-3 px-4">5.0% &ndash; 7.0%</td>
                  <td className="py-3 px-4">Population growth, rental demand, occupancy rates</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold">Retail</td>
                  <td className="py-3 px-4">5.5% &ndash; 8.0%</td>
                  <td className="py-3 px-4">Traffic counts, tenant credit, lease terms</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold">Office</td>
                  <td className="py-3 px-4">6.0% &ndash; 8.5%</td>
                  <td className="py-3 px-4">Location, building class, tenant mix</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold">Industrial</td>
                  <td className="py-3 px-4">5.0% &ndash; 7.5%</td>
                  <td className="py-3 px-4">E-commerce demand, port access, ceiling height</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold">Mixed-Use</td>
                  <td className="py-3 px-4">5.5% &ndash; 7.5%</td>
                  <td className="py-3 px-4">Urban location, walkability, zoning flexibility</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === Why Barrett === */}
      <section className="section-white">
        <div className="container-wide max-w-3xl">
          <h2 className="heading-section text-xl text-primary mb-6 text-center">
            Why Work with Barrett Henry for Commercial Real Estate?
          </h2>
          <div className="font-body text-muted space-y-4 leading-relaxed">
            <p>
              Commercial real estate transactions are more complex than residential deals.
              They involve longer due diligence periods, environmental assessments, zoning
              verification, lease audits, tenant estoppels, and financial underwriting that
              residential agents rarely encounter. Barrett Henry brings 23+ years of real
              estate experience and a Broker Associate license to every commercial
              engagement.
            </p>
            <p>
              Barrett works across all seven Tampa Bay counties &mdash; Hillsborough, Pinellas,
              Pasco, Manatee, Sarasota, Hernando, and Polk &mdash; giving investors and
              business owners access to a broader set of opportunities. He coordinates with
              commercial lenders, environmental consultants, land-use attorneys, and 1031
              exchange intermediaries to keep transactions on track.
            </p>
            <p>
              For investors building a portfolio, Barrett connects the dots between
              acquisition, property management through{" "}
              <a
                href="https://vivipm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:text-primary"
              >
                ViVi PM
              </a>
              , and maintenance through{" "}
              <a
                href="https://bestbayservices.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:text-primary"
              >
                Best Bay Services
              </a>
              . For deeper commercial real estate research, analysis, and market reports, visit{" "}
              <a
                href="https://hencre.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:text-primary"
              >
                hencre.com
              </a>
              .
            </p>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <Link
              href="/investing"
              className="card p-4 text-center hover:shadow-lg transition-shadow"
            >
              <span className="font-heading font-bold text-sm text-primary">
                Investment Properties
              </span>
            </Link>
            <Link
              href="/contact"
              className="card p-4 text-center hover:shadow-lg transition-shadow"
            >
              <span className="font-heading font-bold text-sm text-primary">
                Contact Barrett
              </span>
            </Link>
            <a
              href="https://hencre.com"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-4 text-center hover:shadow-lg transition-shadow"
            >
              <span className="font-heading font-bold text-sm text-primary">
                Commercial RE Research &mdash; hencre.com
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* === FAQ Section === */}
      <section className="section-light">
        <div className="container-wide max-w-3xl">
          <h2 id="faq" className="font-heading font-bold text-2xl md:text-3xl text-primary mb-8">
            Commercial Real Estate FAQs
          </h2>
          <div className="space-y-6">
            {faqs.map((f, i) => (
              <div key={i} className="border-b border-gray-100 pb-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  {f.q}
                </h3>
                <p className="font-body text-muted font-light leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Contact Form === */}
      <section className="py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="heading-section text-xl text-primary mb-2 text-center">
            Discuss Your Commercial Real Estate Goals
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Barrett Henry helps buyers, sellers, tenants, and investors navigate
            Tampa Bay&apos;s commercial market. Call{" "}
            <a href="tel:+18137337907" className="text-accent hover:underline font-semibold">
              (813) 733-7907
            </a>{" "}
            or fill out the form below.
          </p>
          <ContactForm webhookUrl="/api/contact" source="commercial" />
        </div>
      </section>
    </>
  );
}
