// =============================================================================
// RegionalPage — Tampa Bay regional and city-prefixed pages
// Rendered inside [citySlug] route for slugs like /tampa-bay-luxury-homes
// (34 regional pages)
// =============================================================================

import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ContactForm from "@/components/ui/ContactForm";
import type { RegionalPageData } from "@/data/regional-pages";

interface RegionalPageProps {
  page: RegionalPageData;
}

export default function RegionalPage({ page }: RegionalPageProps) {
  const { title, excerpt, category } = page;

  return (
    <>
      {/* === Hero === */}
      <HeroSection title={title} subtitle={excerpt}>
        <SearchBar />
      </HeroSection>

      {/* === Main content === */}
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto">
          {/* Category badge */}
          <span className="inline-block px-4 py-1 rounded-full text-xs font-body font-semibold bg-accent/20 text-primary mb-6">
            {category}
          </span>

          {/* Page content — placeholder until WP content is imported */}
          <div className="prose prose-lg font-body text-dark max-w-none prose-headings:font-heading prose-headings:text-primary prose-a:text-accent">
            <p>
              {excerpt} Barrett Henry, Broker Associate at REMAX Collective,
              brings 23+ years of real estate experience to help you navigate
              the Tampa Bay market.
            </p>

            {/* Builder pages get builder-specific content */}
            {category === "Builders" && (
              <>
                <h2>Why Work with Barrett When Buying New Construction?</h2>
                <p>
                  Builder sales agents represent the builder, not you. Having your own
                  REALTOR costs you nothing — the builder pays the commission — and Barrett
                  negotiates upgrades, lot premiums, and closing costs on your behalf.
                </p>
                <p>
                  Barrett has helped hundreds of buyers purchase new construction homes
                  across Tampa Bay and knows which builders deliver the best value in each area.
                </p>
              </>
            )}

            {/* Relocation pages get relocation content */}
            {category === "Relocation" && (
              <>
                <h2>Barrett Henry: Your Tampa Bay Relocation Expert</h2>
                <p>
                  Whether you are moving from out of state, across the country, or across
                  town, Barrett Henry provides comprehensive relocation services. From
                  neighborhood tours to school zone research to coordinating with your
                  current agent, Barrett handles the details so you can focus on your move.
                </p>
              </>
            )}

            {/* Search pages get listing CTA */}
            {category === "Search" && (
              <>
                <h2>Search Tampa Bay Listings</h2>
                <p>
                  Browse the latest listings across Tampa Bay, updated daily from Stellar MLS.
                  Use the search bar above to filter by city, price, property type, and more.
                </p>
              </>
            )}

            {/* Financing pages get loan info */}
            {category === "Financing" && (
              <>
                <h2>Financing Your Tampa Bay Home</h2>
                <p>
                  Barrett works with a network of trusted local lenders who offer competitive
                  rates on conventional, FHA, VA, and specialty loan programs. Get a referral
                  for your specific situation.
                </p>
              </>
            )}

            {/* Agent pages get bio content */}
            {(category === "Agent") && (
              <>
                <h2>About Barrett Henry</h2>
                <p>
                  Barrett Henry is a licensed real estate Broker Associate with REMAX Collective
                  and team lead of The NOW Team. With 23+ years of real estate experience,
                  Barrett specializes in residential sales, investment properties, new construction,
                  and military relocation across Tampa Bay.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* === City links grid === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide">
          <h2 className="font-heading font-bold text-2xl text-primary mb-6 text-center">
            Explore Tampa Bay by City
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              "Brandon", "Riverview", "Valrico", "Tampa", "St. Petersburg",
              "Clearwater", "Lakeland", "Wesley Chapel", "Lutz", "Land O' Lakes",
              "Palm Harbor", "Bradenton",
            ].map((city) => {
              const citySlug = city
                .toLowerCase()
                .replace(/['\s]+/g, "-")
                .replace(/\./g, "");
              return (
                <Link
                  key={citySlug}
                  href={`/${citySlug}`}
                  className="block rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10"
                >
                  {city}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* === Contact form === */}
      <section className="py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Let Barrett Help You
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Have questions about Tampa Bay real estate? Barrett Henry is ready to help.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source={`regional-${page.slug}`}
          />
        </div>
      </section>
    </>
  );
}
