// =============================================================================
// Homepage — Barrett Henry, REALTOR® | Tampa Bay Homes for Sale
// Server component: fetches featured listings at build/revalidation time
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { Shield, TrendingUp, Users, Search, Key, DollarSign, BarChart3 } from "lucide-react";

import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ListingGrid from "@/components/ui/ListingGrid";
import CityGrid from "@/components/ui/CityGrid";
import ContactForm from "@/components/ui/ContactForm";
import { getFeaturedListings } from "@/lib/bridge";
import { getPrimaryAgent } from "@/data/agents";
import { testimonials } from "@/data/testimonials";

// ISR: cache the homepage for 15 min to avoid burning Bridge API quota on every visit
export const revalidate = 3600;

// -----------------------------------------------------------------------------
// Metadata — SEO title, description, and Open Graph tags
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Tampa Bay Homes for Sale | Barrett Henry, REALTOR®",
  description:
    "Search Tampa Bay homes for sale with Barrett Henry, Broker Associate at REMAX Collective. 23+ years of real estate experience. Browse listings in Valrico, Brandon, Riverview, Tampa, and more. Call (813) 733-7907.",
  alternates: {
    canonical: "/",
  },
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
    title: "23+ Years Closing Deals",
    description:
      "I've been in this business since 2003. That means I've seen every market cycle, every curveball, and every creative solution. Experience isn't a bullet point — it's your safety net.",
  },
  {
    icon: TrendingUp,
    title: "Numbers Don't Lie",
    description:
      "I price homes with data, not wishful thinking. My team and I pull the comps, track the trends, and give you the honest numbers so you make smart moves — not emotional ones.",
  },
  {
    icon: Users,
    title: "Tampa Bay, Inside and Out",
    description:
      "From Riverview to St. Pete, Brandon to Sarasota — I know the neighborhoods, the school zones, the flood maps, and what's actually happening on the ground across all 8 counties.",
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

  // Pick 6 testimonials for homepage display
  const featuredTestimonials = testimonials.slice(0, 6);

  return (
    <>
      {/* === JSON-LD: RealEstateAgent structured data (merged with aggregateRating) === */}
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
            sameAs: [
              "https://barretthenry.remax.com",
              "https://vivipm.com",
              "https://hencre.com",
              "https://valricopropertymgmt.com",
              "https://bestbayservices.com",
              "https://flforeclosurehelp.com",
              "https://flpermithelp.com",
              "https://parrishagent.com",
              "https://www.facebook.com/BarrettHenryREALTOR",
              "https://www.instagram.com/thenowteam",
              "https://www.linkedin.com/in/barretthenry",
            ],
            knowsAbout: [
              "Residential Real Estate",
              "Tampa Bay Homes for Sale",
              "Investment Properties",
              "New Construction",
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5.0",
              reviewCount: "31",
              bestRating: "5",
              worstRating: "1",
            },
            review: [
              {
                "@type": "Review",
                author: { "@type": "Person", name: "Regina Castillo" },
                reviewRating: { "@type": "Rating", ratingValue: "5" },
                reviewBody: "Working with Barrett Henry has truly been THE BEST experience I've ever had with a realtor.",
              },
              {
                "@type": "Review",
                author: { "@type": "Person", name: "Ryan Mauk" },
                reviewRating: { "@type": "Rating", ratingValue: "5" },
                reviewBody: "I've had Barrett as my realtor for 10 years now. After using his services to sell my first house, I never needed to find another agent.",
              },
              {
                "@type": "Review",
                author: { "@type": "Person", name: "Adam Marburger" },
                reviewRating: { "@type": "Rating", ratingValue: "5" },
                reviewBody: "Barrett is without question the most professional real estate agent I have ever done business with.",
              },
            ],
          }),
        }}
      />

      {/* === JSON-LD: WebSite schema with SearchAction (sitelinks search box) === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Barrett Henry, REALTOR® — The NOW Team",
            url: "https://nowtb.com",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://nowtb.com/properties?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* =================================================================
          SECTION 1: Hero — full viewport, content at bottom, luxury feel
          ================================================================= */}
      <HeroSection
        title="Tampa Bay Homes for Sale"
        label="BARRETT HENRY | THE NOW TEAM"
        subtitle="Broker Associate with 23+ years in the business. I help buyers, sellers, and investors across Tampa Bay get the deal done."
        bgImage="/images/hero-desktop.jpg"
        bgVideo="/images/tampa-aerial-bg.mp4"
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
          SECTION 1b: Quick-action CTA row — big buttons between hero & listings
          ================================================================= */}
      <section className="bg-primary/95 border-t border-white/10">
        <div className="container-wide py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
            <Link
              href="/properties"
              className="flex flex-col items-center gap-2 py-5 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center"
            >
              <Search className="w-6 h-6 text-accent" />
              <span className="font-body text-white text-sm font-semibold">Search Homes</span>
            </Link>
            <Link
              href="/guides/first-time-home-buyer-guide"
              className="flex flex-col items-center gap-2 py-5 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center"
            >
              <Key className="w-6 h-6 text-accent" />
              <span className="font-body text-white text-sm font-semibold">First-Time Buyers</span>
            </Link>
            <Link
              href="/sell-your-home"
              className="flex flex-col items-center gap-2 py-5 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center"
            >
              <DollarSign className="w-6 h-6 text-accent" />
              <span className="font-body text-white text-sm font-semibold">Sell Your Home</span>
            </Link>
            <Link
              href="/home-valuation"
              className="flex flex-col items-center gap-2 py-5 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center"
            >
              <BarChart3 className="w-6 h-6 text-accent" />
              <span className="font-body text-white text-sm font-semibold">Home Valuation</span>
            </Link>
          </div>
        </div>
      </section>

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
            across Hillsborough, Pinellas, Pasco, Polk, Manatee, Sarasota,
            Hernando, and Citrus counties.
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
          SECTION 5: Testimonials — real Google reviews
          ================================================================= */}
      <section className="section-dark">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label text-white/50 mb-6">What Clients Say</p>
            <h2 className="heading-section text-display-sm text-white">
              Real Reviews from Real Clients
            </h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTestimonials.map((t) => {
              const parts = t.name.split(" ");
              const displayName = parts.length > 1
                ? `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`
                : parts[0];
              return (
                <div key={t.name} className="border border-white/10 p-8">
                  {/* Stars */}
                  <p className="text-accent text-lg mb-4">★★★★★</p>
                  {/* Quote */}
                  <p className="font-body text-white/80 font-light text-sm leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  {/* Attribution */}
                  <p className="font-body text-white font-medium text-sm">{displayName}</p>
                  <p className="font-body text-white/40 text-xs">{t.location}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 5b: Lead Capture Form — navy bg, compact 3-field form
          ================================================================= */}
      <section className="bg-primary py-20">
        <div className="container-wide max-w-xl mx-auto text-center">
          <p className="heading-label text-white/50 mb-6">Talk to Barrett</p>
          <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.1em] uppercase text-white mb-2">
            Get Expert Advice on Tampa Bay Real Estate
          </h2>
          <div className="section-divider" />
          <p className="font-body text-white/60 font-light text-sm mb-10">
            Barrett Henry responds within 2 hours.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source="homepage-form"
          />
        </div>
      </section>

      {/* =================================================================
          SECTION 6: Quick Links — internal navigation to key pages
          ================================================================= */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Resources</p>
            <div className="section-divider" />
          </div>

          {/* Introductory paragraph with contextual internal links */}
          <p className="font-body text-muted text-sm font-light leading-relaxed max-w-3xl mx-auto text-center mb-12">
            Whether you&apos;re searching for{" "}
            <Link href="/valrico/" className="text-link hover:underline">Valrico homes for sale</Link>,
            exploring{" "}
            <Link href="/brandon/" className="text-link hover:underline">Brandon real estate</Link>,
            or browsing{" "}
            <Link href="/riverview/" className="text-link hover:underline">Riverview homes</Link>,
            Barrett Henry has the local expertise to help you find the right fit.
            Start with a{" "}
            <Link href="/free-home-valuation/" className="text-link hover:underline">free home valuation</Link>{" "}
            to see what your property is worth, check the latest{" "}
            <Link href="/market-updates/" className="text-link hover:underline">Tampa Bay market updates</Link>,
            or dive into our{" "}
            <Link href="/guides/" className="text-link hover:underline">buyer and seller guides</Link>{" "}
            for step-by-step advice on your next move.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { href: "/buyers", label: "Buyer Guide" },
              { href: "/sellers", label: "Seller Guide" },
              { href: "/investing", label: "Investing" },
              { href: "/luxury", label: "Luxury Homes" },
              { href: "/open-houses", label: "Open Houses" },
              { href: "/builders", label: "Builders" },
              { href: "/mortgage-calculator", label: "Mortgage Calculator" },
              { href: "/property-management", label: "Property Management" },
              { href: "/guides", label: "Market Guides" },
              { href: "/relocation", label: "Relocation" },
              { href: "/blog", label: "Blog" },
              { href: "/about", label: "About Barrett" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="card block px-4 py-3 text-center text-xs font-body font-medium tracking-[0.1em] uppercase text-primary transition-colors hover:text-accent hover:border-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 6: CTA — clean, minimal dark navy
          ================================================================= */}
      <section className="section-dark">
        <div className="container-wide text-center">
          {/* Light-weight heading */}
          <h2 className="font-heading font-extralight text-3xl md:text-4xl lg:text-5xl tracking-[0.1em] uppercase text-white mb-2">
            Let&apos;s Talk Real Estate
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
