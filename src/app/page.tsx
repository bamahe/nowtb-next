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
          SECTION 1: Hero — full viewport, content at bottom, luxury feel
          ================================================================= */}
      <HeroSection
        title="Find Your Home"
        label="TAMPA BAY REAL ESTATE"
        subtitle="Broker Associate at REMAX Collective with 23+ years of real estate experience."
        fullHeight
      >
        {/* Dual CTA buttons — transparent with white border for luxury feel */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/properties" className="btn-secondary">
            Search Properties
          </Link>
          <Link href="/sell-your-home" className="btn-secondary">
            Home Valuation
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
      {/* =================================================================
          SECTION 2: Featured Listings — dark navy, label-only heading
          ================================================================= */}
      <section className="section-dark">
        <div className="container-wide">
          {/* Minimal heading — just label + divider, no heavy h2 */}
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Featured Properties</p>
            <div className="section-divider" />
          </div>

          {/* Listing grid — className override removes default wrapper padding */}
          <ListingGrid listings={featuredListings} className="" />

          {/* "View All" link — minimal uppercase style */}
          {featuredListings.length > 0 && (
            <div className="text-center mt-16">
              <Link
                href="/properties"
                className="text-xs font-body font-medium tracking-[0.2em] uppercase text-accent hover:text-white transition-colors duration-300"
              >
                View All &rarr;
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
      {/* =================================================================
          SECTION 3: Communities — white background, label + heading
          ================================================================= */}
      <section className="section-white">
        <div className="container-wide">
          {/* Section heading with label */}
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Communities</p>
            <h2 className="heading-section text-display-sm text-primary">
              Explore Tampa Bay
            </h2>
            <div className="section-divider" />
            <p className="font-body text-muted text-lg font-light max-w-2xl mx-auto">
              Browse homes for sale in the most sought-after neighborhoods across
              Tampa Bay.
            </p>
          </div>

          {/* City grid tiles — bare mode: parent handles section wrapper + heading */}
          <CityGrid bare />

          {/* Supporting copy about service area */}
          <p className="text-center font-body text-muted text-sm font-light mt-12 max-w-3xl mx-auto">
            Barrett Henry and The NOW Team proudly serve buyers and sellers
            across Hillsborough, Pinellas, Pasco, Polk, Manatee, Sarasota, and
            Hernando counties.
          </p>
        </div>
      </section>

      {/* =================================================================
          SECTION 4: Value Props — soft gray background, 3 premium cards
          ================================================================= */}
      {/* =================================================================
          SECTION 4: Value Props — warm cream bg, minimal card style
          ================================================================= */}
      <section className="section-light">
        <div className="container-wide">
          {/* Section heading with label */}
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Why Barrett Henry</p>
            <div className="section-divider" />
          </div>

          {/* 3-column card grid — minimal style, no card background */}
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {VALUE_PROPS.map((prop) => {
              const Icon = prop.icon;
              return (
                <div
                  key={prop.title}
                  className="text-center"
                >
                  {/* Icon — bare, no circular background */}
                  <div className="mx-auto mb-8">
                    <Icon className="h-8 w-8 text-accent mx-auto" strokeWidth={1} />
                  </div>

                  {/* Card heading — light weight, uppercase, tracked */}
                  <h3 className="heading-section text-sm text-primary mb-4">
                    {prop.title}
                  </h3>

                  {/* Card description */}
                  <p className="font-body text-sm text-muted font-light leading-relaxed">
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
      {/* =================================================================
          SECTION 5: CTA — clean, minimal dark navy
          ================================================================= */}
      <section className="section-dark">
        <div className="container-wide text-center">
          {/* Light-weight heading */}
          <h2 className="font-heading font-extralight text-3xl md:text-4xl lg:text-5xl tracking-[0.1em] uppercase text-white mb-2">
            Let&apos;s Connect
          </h2>
          <div className="section-divider" />

          {/* Phone number — large and prominent, light weight */}
          <p className="font-heading text-white text-3xl md:text-4xl font-extralight tracking-wide mt-8 mb-10">
            <a
              href={`tel:${agent.phone}`}
              className="hover:text-accent transition-colors duration-300"
            >
              {agent.phone}
            </a>
          </p>

          {/* Single CTA button */}
          <Link
            href="/contact"
            className="btn-secondary"
          >
            Contact
          </Link>
        </div>
      </section>
    </>
  );
}
