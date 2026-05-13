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
          SECTION 1: Hero — full-width dark navy with search bar and CTAs
          ================================================================= */}
      <HeroSection
        title="Find Your Home in Tampa Bay"
        subtitle="23+ years of real estate experience. Your trusted local expert."
      >
        {/* Search bar in the hero */}
        <SearchBar />

        {/* CTA buttons below the search bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/properties" className="btn-primary px-8 py-3 text-base">
            Browse Listings
          </Link>
          <Link
            href="/sell-your-home"
            className="btn-outline px-8 py-3 text-base text-white border-white hover:bg-white hover:text-primary"
          >
            Get a Home Valuation
          </Link>
        </div>
      </HeroSection>

      {/* =================================================================
          SECTION 2: Featured Listings — grid of top listings from MLS
          ================================================================= */}
      <ListingGrid
        listings={featuredListings}
        title="Featured Tampa Bay Properties"
        subtitle="Handpicked listings across Tampa Bay's most desirable communities."
      />

      {/* "View All Listings" link below the grid */}
      {featuredListings.length > 0 && (
        <div className="container-wide pb-8 text-center">
          <Link
            href="/properties"
            className="btn-primary inline-block px-8 py-3"
          >
            View All Listings
          </Link>
        </div>
      )}

      {/* =================================================================
          SECTION 3: City Grid — links to city hub pages
          ================================================================= */}
      <CityGrid />

      {/* =================================================================
          SECTION 4: Value Props — 3-column grid with icons
          ================================================================= */}
      <section className="container-wide py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {VALUE_PROPS.map((prop) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.title}
                className="text-center px-6 py-8 rounded-xl bg-white shadow-sm"
              >
                {/* Icon circle */}
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
                  <Icon className="h-7 w-7 text-accent" />
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  {prop.title}
                </h3>

                {/* Description */}
                <p className="font-body text-muted text-sm leading-relaxed">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================
          SECTION 5: CTA — dark background call-to-action
          ================================================================= */}
      <section className="bg-primary py-16">
        <div className="container-wide text-center">
          <h2 className="heading-section text-display-sm text-white mb-4">
            Ready to Make Your Move?
          </h2>
          <p className="font-body text-accent text-lg max-w-2xl mx-auto mb-8">
            Whether you are buying, selling, or investing in Tampa Bay real estate,
            Barrett Henry has the experience and market knowledge to get it done.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="btn-primary bg-accent text-primary hover:bg-accent/90 px-8 py-3 text-base font-semibold"
            >
              Contact Barrett
            </Link>
            <Link
              href="/properties"
              className="btn-outline border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-base"
            >
              Search Homes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
