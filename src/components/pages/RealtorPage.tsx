// =============================================================================
// RealtorPage — City-specific REALTOR landing page for Barrett Henry
// Rendered inside the [citySlug] route for slugs like /valrico-realtor
// (285 city pages)
// =============================================================================

import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListingsByCity } from "@/lib/bridge";
import { getPrimaryAgent } from "@/data/agents";

interface RealtorPageProps {
  /** Display name of the city (e.g. "Valrico") */
  cityName: string;
  /** URL slug for the city (e.g. "valrico") */
  citySlug: string;
}

export default async function RealtorPage({
  cityName,
  citySlug,
}: RealtorPageProps) {
  // Fetch recent listings for this city to show Barrett's market activity
  const listings = await getListingsByCity(cityName, 8);
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
                name: `${cityName} Homes for Sale`,
                item: `https://nowtb.com/${citySlug}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `${cityName} REALTOR`,
                item: `https://nowtb.com/${citySlug}-realtor`,
              },
            ],
          }),
        }}
      />

      {/* === Hero section === */}
      <HeroSection
        title={`Your ${cityName} REALTOR\u00AE \u2014 Barrett Henry`}
        subtitle={`Broker Associate at REMAX Collective with 23+ years of real estate experience. Let Barrett guide your ${cityName} home search or sale.`}
      >
        {/* Back link to city hub */}
        <Link
          href={`/${citySlug}`}
          className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors mt-4 text-sm font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {cityName} Homes for Sale
        </Link>
      </HeroSection>

      {/* === Why choose Barrett — 3 value proposition cards === */}
      <section className="container-wide py-12">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
          Why Work With Barrett in {cityName}
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
              {cityName} Market Expert
            </h3>
            <p className="font-body text-muted text-sm">
              Barrett knows {cityName} inside and out — schools, neighborhoods,
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
        title={`Recent Listings in ${cityName}`}
        subtitle={`Browse active homes for sale in ${cityName} represented or curated by Barrett Henry.`}
      />

      {/* === About Barrett section === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
            About Barrett Henry
          </h2>
          <div className="prose font-body text-dark max-w-none space-y-4">
            <p>{agent.bio}</p>
            <p>
              Ready to buy or sell in {cityName}? Barrett is just a call away at{" "}
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
            &ldquo;Barrett made our {cityName} home search seamless. His market
            knowledge is unmatched and he negotiated a deal that saved us
            thousands.&rdquo;
          </blockquote>
          <p className="font-body text-muted text-sm">
            — Happy {cityName} Homeowner
          </p>
        </div>
      </section>

      {/* === Contact form === */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Connect With Barrett in {cityName}
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Whether you&apos;re buying, selling, or just exploring — Barrett is
            here to help.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source={`${citySlug}-realtor`}
          />
        </div>
      </section>
    </>
  );
}
