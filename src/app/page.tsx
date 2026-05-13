// =============================================================================
// Homepage — Barrett Henry, REALTOR® | Tampa Bay Homes for Sale
// Server component: fetches featured listings at build/revalidation time
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { Shield, TrendingUp, Users } from "lucide-react";

import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import CityGrid from "@/components/ui/CityGrid";
import { getFeaturedListings } from "@/lib/bridge";
import { getPrimaryAgent } from "@/data/agents";

// Force dynamic rendering so mock/live data uses runtime env vars
export const dynamic = "force-dynamic";

// -----------------------------------------------------------------------------
// Metadata — SEO title, description, and Open Graph tags
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Tampa Bay Homes for Sale | Barrett Henry, REALTOR® | REMAX Collective",
  description:
    "Search Tampa Bay homes for sale with Barrett Henry, Broker Associate at REMAX Collective. 23+ years of real estate experience. Browse listings in Valrico, Brandon, Riverview, Tampa, and more.",
  openGraph: {
    title: "Tampa Bay Homes for Sale | Barrett Henry, REALTOR®",
    description:
      "Search Tampa Bay homes for sale with Barrett Henry, Broker Associate at REMAX Collective. 23+ years of real estate experience.",
    url: "/",
    type: "website",
  },
};

// -----------------------------------------------------------------------------
// Value proposition data — rendered as a 3-column grid
// -----------------------------------------------------------------------------

const VALUE_PROPS = [
  {
    icon: Shield,
    title: "23+ Years Experience",
    description:
      "Navigating complex deals with confidence built from two decades of closings.",
  },
  {
    icon: TrendingUp,
    title: "Data-Driven Strategy",
    description:
      "Market analysis and pricing strategies that maximize your investment.",
  },
  {
    icon: Users,
    title: "Local Market Expert",
    description:
      "Deep knowledge of Tampa Bay's neighborhoods, schools, and lifestyle.",
  },
] as const;

// -----------------------------------------------------------------------------
// Page component
// -----------------------------------------------------------------------------

export default async function HomePage() {
  // Fetch featured listings server-side (cached via ISR in bridge.ts)
  const featuredListings = await getFeaturedListings();

  // Pull primary agent info for JSON-LD structured data
  const agent = getPrimaryAgent();

  return (
    <>
      {/* === JSON-LD: RealEstateAgent structured data === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: agent.name,
            description: agent.bio,
            url: "https://nowtb.com",
            telephone: agent.phone,
            email: agent.email,
            image: "https://nowtb.com/images/barrett-henry.jpg",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Tampa Bay",
              addressRegion: "FL",
              addressCountry: "US",
            },
            memberOf: {
              "@type": "RealEstateOrganization",
              name: "REMAX Collective",
            },
            knowsAbout: [
              "Residential Real Estate",
              "Tampa Bay Homes for Sale",
              "Investment Properties",
              "New Construction",
            ],
          }),
        }}
      />

      {/* =================================================================
          SECTION 1: Hero — dramatic dark navy with tagline, dual CTAs, search
          ================================================================= */}
      <HeroSection
        title="Find Your Home in Tampa Bay"
        subtitle="Broker Associate at REMAX Collective with 23+ years of real estate experience — guiding buyers, sellers, and investors across 7 counties."
      >
        {/* Dual CTA buttons — primary filled + secondary outlined */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/properties" className="btn-accent px-10 py-4 text-base">
            Search Homes
          </Link>
          <Link
            href="/sell-your-home"
            className="btn-secondary px-10 py-4 text-base"
          >
            Get a Home Valuation
          </Link>
        </div>

        {/* Search bar below the CTAs */}
        <div className="mt-8">
          <SearchBar />
        </div>
      </HeroSection>

      {/* =================================================================
          SECTION 2: Featured Listings — dark navy background for contrast
          ListingGrid gets className override so it doesn't add its own
          container-wide / padding (the parent section handles that).
          ================================================================= */}
      <section className="section-dark">
        <div className="container-wide">
          {/* Section heading — white on dark */}
          <div className="text-center mb-12">
            <h2 className="heading-section text-display-sm text-white">
              Featured Tampa Bay Properties
            </h2>
            {/* Accent divider bar */}
            <div className="section-divider" />
            <p className="font-body text-accent text-lg max-w-2xl mx-auto">
              Handpicked listings across Tampa Bay&apos;s most desirable communities.
            </p>
          </div>

          {/* Listing grid — className override removes default wrapper padding */}
          <ListingGrid listings={featuredListings} className="" />

          {/* "View All Listings" link in accent color */}
          {featuredListings.length > 0 && (
            <div className="text-center mt-10">
              <Link
                href="/properties"
                className="btn-accent inline-flex items-center gap-2 px-10 py-4 text-base"
              >
                View All Listings
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =================================================================
          SECTION 3: City Grid — white background for visual contrast
          CityGrid gets className + hideHeading so we control the wrapper
          and heading from here instead of inside the component.
          ================================================================= */}
      <section className="section-white">
        <div className="container-wide">
          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="heading-section text-display-sm text-primary">
              Explore Tampa Bay Communities
            </h2>
            {/* Accent divider bar */}
            <div className="section-divider" />
            <p className="font-body text-muted text-lg max-w-2xl mx-auto">
              Browse homes for sale in the most sought-after neighborhoods across
              Tampa Bay.
            </p>
          </div>

          {/* City grid tiles — bare mode: parent handles section wrapper + heading */}
          <CityGrid bare />

          {/* Supporting copy about service area */}
          <p className="text-center font-body text-muted mt-10 max-w-3xl mx-auto">
            Barrett Henry and The NOW Team proudly serve buyers and sellers
            across Hillsborough, Pinellas, Pasco, Polk, Manatee, Sarasota, and
            Hernando counties.
          </p>
        </div>
      </section>

      {/* =================================================================
          SECTION 4: Value Props — soft gray background, 3 premium cards
          ================================================================= */}
      <section className="section-light">
        <div className="container-wide">
          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="heading-section text-display-sm text-primary">
              Why Work With Barrett
            </h2>
            <div className="section-divider" />
          </div>

          {/* 3-column card grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {VALUE_PROPS.map((prop) => {
              const Icon = prop.icon;
              return (
                <div
                  key={prop.title}
                  className="card text-center p-8"
                >
                  {/* Icon in a circular accent-colored background */}
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                    <Icon className="h-8 w-8 text-accent" />
                  </div>

                  {/* Card heading */}
                  <h3 className="font-heading font-bold text-xl text-primary mb-3">
                    {prop.title}
                  </h3>

                  {/* Card description */}
                  <p className="font-body text-muted text-base leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 5: CTA — dramatic dark navy call-to-action
          ================================================================= */}
      <section className="section-dark">
        <div className="container-wide text-center">
          <h2 className="heading-section text-display text-white mb-4">
            Ready to Make Your Move?
          </h2>
          <div className="section-divider" />
          <p className="font-body text-accent text-lg md:text-xl max-w-2xl mx-auto mb-4">
            Whether you are buying, selling, or investing in Tampa Bay real
            estate, Barrett Henry has the experience and market knowledge to get
            it done.
          </p>

          {/* Phone number — prominent display */}
          <p className="font-heading text-white text-2xl md:text-3xl font-bold mb-8">
            <a
              href={`tel:${agent.phone}`}
              className="hover:text-accent transition-colors duration-200"
            >
              {agent.phone}
            </a>
          </p>

          {/* Dual CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="btn-accent px-10 py-4 text-base"
            >
              Contact Barrett
            </Link>
            <Link
              href="/properties"
              className="btn-secondary px-10 py-4 text-base"
            >
              Search Homes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
