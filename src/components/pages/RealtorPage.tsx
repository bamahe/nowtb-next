// =============================================================================
// RealtorPage — City-specific REALTOR landing page for Barrett Henry
// Rendered inside the [citySlug] route for slugs like /valrico-realtor
// (285 city pages)
// =============================================================================

import Link from "next/link";
import ListingGrid from "@/components/ui/ListingGrid";
import SpokeNav from "@/components/city/SpokeNav";
import { getListings } from "@/lib/bridge";
import { getPrimaryAgent } from "@/data/agents";
import type { CityData } from "@/data/cities";

interface RealtorPageProps {
  /** Full city data object — includes name, slug, county, zip_codes, etc. */
  city: CityData;
}

export default async function RealtorPage({ city }: RealtorPageProps) {
  // Fetch recent listings using ZIP codes (more reliable than city name in MLS)
  let listings: import("@/lib/types").Listing[] = [];
  try {
    const res = await getListings({ zip_codes: city.zip_codes, limit: "12" });
    listings = res.value || [];
  } catch {
    // If the API call fails, render the page with an empty listing grid
    listings = [];
  }

  // Get Barrett's agent info for the bio section
  const agent = getPrimaryAgent();

  return (
    <>
      {/* --- JSON-LD BreadcrumbList for SEO --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://nowtb.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: city.name,
                item: `https://nowtb.com/${city.slug}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Your REALTOR\u00AE",
                item: `https://nowtb.com/${city.slug}-realtor`,
              },
            ],
          }),
        }}
      />

      {/* === Hero — compact with breadcrumb + CTA (matches spoke page pattern) === */}
      <section className="bg-primary pt-12 pb-16">
        <div className="container-wide">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-2 text-xs font-body text-white/50 mb-6 tracking-wide uppercase">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${city.slug}`} className="hover:text-white/80 transition-colors">{city.name}</Link>
            <span>/</span>
            <span className="text-accent">Your REALTOR&reg;</span>
          </nav>

          {/* Title */}
          <h1 className="heading-display text-display md:text-display-lg text-white mb-3">
            Your {city.name} REALTOR&reg; &mdash; Barrett Henry
          </h1>
          <p className="font-body text-white/70 text-lg max-w-2xl mb-6">
            {city.county} County, Florida
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded text-sm hover:bg-accent/90 transition-colors"
            >
              (813) 733-7907
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* === Why choose Barrett — 3 value proposition cards === */}
      <section className="container-wide py-12">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
          Why Work With Barrett in {city.name}
        </h2>
        <p className="font-body text-muted text-center mb-8 max-w-2xl mx-auto">
          Not all agents are created equal. Here&apos;s what sets Barrett apart.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Value prop 1 — Experience */}
          <div className="card p-6">
            <div className="text-accent text-3xl mb-3">
              {/* Briefcase icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.64-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-lg text-primary mb-2">
              23+ Years of Experience
            </h3>
            <p className="font-body text-muted text-sm">
              With over two decades in real estate, Barrett brings deep market
              knowledge, sharp negotiation skills, and a proven track record to
              every transaction.
            </p>
          </div>

          {/* Value prop 2 — Local market knowledge */}
          <div className="card p-6">
            <div className="text-accent text-3xl mb-3">
              {/* Map pin icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-lg text-primary mb-2">
              {city.name} Market Expert
            </h3>
            <p className="font-body text-muted text-sm">
              Barrett knows {city.name} inside and out — schools, neighborhoods,
              pricing trends, and which streets are worth the premium. That
              insight saves you time and money.
            </p>
          </div>

          {/* Value prop 3 — Data-driven approach */}
          <div className="card p-6">
            <div className="text-accent text-3xl mb-3">
              {/* Chart icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-lg text-primary mb-2">
              Data-Driven Results
            </h3>
            <p className="font-body text-muted text-sm">
              Every recommendation is backed by current MLS data, comp analysis,
              and market trends — not guesswork. Barrett&apos;s clients make
              informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* === Recent listings in this city === */}
      <ListingGrid
        listings={listings}
        title={`Recent Listings in ${city.name}`}
        subtitle={`Browse active homes for sale in ${city.name} represented or curated by Barrett Henry.`}
      />

      {/* === MLS disclaimer — only shown when listings are displayed === */}
      {listings.length > 0 && (
        <section className="container-wide pb-4">
          <p className="font-body text-xs text-muted/60 leading-relaxed max-w-4xl">
            Listing information provided by Stellar MLS. IDX information is for personal, non-commercial use only. Data is deemed reliable but not guaranteed. All properties are subject to prior sale, change, or withdrawal.
          </p>
        </section>
      )}

      {/* === About Barrett section === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            About Barrett Henry
          </h2>
          <div className="prose font-body text-dark max-w-none space-y-4">
            <p>{agent.bio}</p>
            <p>
              Ready to buy or sell in {city.name}? Barrett is just a call away at{" "}
              <a
                href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
                className="text-accent font-semibold hover:underline"
              >
                {agent.phone}
              </a>{" "}
              or email{" "}
              <a
                href={`mailto:${agent.email}`}
                className="text-accent font-semibold hover:underline"
              >
                {agent.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* === Testimonial placeholder === */}
      <section className="container-wide py-12">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6 text-center">
          What Clients Say
        </h2>
        <div className="max-w-2xl mx-auto card p-8 text-center">
          <blockquote className="font-body text-dark text-lg italic mb-4">
            &ldquo;Barrett made our {city.name} home search seamless. His market
            knowledge is unmatched and he negotiated a deal that saved us
            thousands.&rdquo;
          </blockquote>
          <p className="font-body text-muted text-sm">
            — Happy {city.name} Homeowner
          </p>
        </div>
      </section>

      {/* === Spoke navigation — explore more about this city === */}
      <SpokeNav city={city} currentTopic="realtor" />

      {/* === CTA bar — dark bg with call + message buttons === */}
      <section className="bg-primary py-12">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-white mb-1">
              Work with Barrett Henry in {city.name}
            </h2>
            <p className="font-body text-white/70 text-sm">
              REALTOR&reg; &amp; Broker Associate — 23+ years of real estate experience
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="tel:+18137337907" className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded text-sm hover:bg-accent/90 transition-colors">Call Now</a>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded text-sm hover:bg-white/10 transition-colors">Send a Message</Link>
          </div>
        </div>
      </section>
    </>
  );
}
