// =============================================================================
// /investing — Investment property landing page
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ContactForm from "@/components/ui/ContactForm";
import { cities } from "@/data/cities";

export const metadata: Metadata = {
  title: "Investment Properties Tampa Bay | Real Estate Investing",
  description:
    "Tampa Bay investment property opportunities — rental analysis, ROI projections, and expert investor guidance from Barrett Henry, REMAX Collective. Call (813) 733-7907.",
  alternates: {
    canonical: "/investing/",
  },
};

export default function InvestingPage() {
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
              { "@type": "ListItem", position: 2, name: "Real Estate Investing", item: "https://nowtb.com/investing" },
            ],
          }),
        }}
      />
      {/* === Hero === */}
      <HeroSection
        title="Real Estate Investing in Tampa Bay"
        subtitle="Build wealth through rental properties, fix-and-flip, and long-term appreciation in one of Florida's hottest markets."
      >
        <SearchBar />
      </HeroSection>

      {/* === Investment types === */}
      <section className="container-wide py-12">
        <h2 className="heading-section text-xl text-primary mb-8 text-center">
          Investment Strategies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Rental Properties",
              desc: "Long-term rental income with Tampa Bay's growing population and strong tenant demand. Barrett analyzes cap rates, cash-on-cash returns, and appreciation potential.",
              link: "/guides/real-estate-investment-guide",
            },
            {
              title: "Short-Term Rentals",
              desc: "Vacation and Airbnb rentals in beach communities and tourist areas. Barrett knows the local regulations and best-performing neighborhoods.",
              link: "/guides/short-term-rental-guide",
            },
            {
              title: "1031 Exchanges",
              desc: "Defer capital gains taxes by exchanging into Tampa Bay investment properties. Barrett guides you through identification and closing timelines.",
              link: "/guides/1031-exchange-guide",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.link}
              className="group card p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-heading font-bold text-xl text-primary group-hover:text-accent transition-colors mb-3">
                {item.title}
              </h3>
              <p className="font-body text-muted text-sm">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* === Investment by city === */}
      <section className="section-light">
        <div className="container-wide">
          <h2 className="heading-section text-xl text-primary mb-6 text-center">
            Investment Properties by City
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {cities
              .filter((c) => c.tier <= 2)
              .map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}-investment-property`}
                  className="card block px-3 py-2 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10"
                >
                  {city.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* === Investor Resources === */}
      <section className="section-white">
        <div className="container-wide max-w-3xl text-center">
          <h2 className="heading-section text-xl text-primary mb-6">
            Full-Service Investor Support
          </h2>
          <p className="font-body text-muted mb-8">
            Barrett doesn&apos;t just help you buy investment properties &mdash; he provides
            the full ecosystem. Need professional property management?{" "}
            <a href="https://vivipm.com" target="_blank" rel="noopener noreferrer" className="text-link underline hover:text-primary">
              ViVi PM
            </a>{" "}
            handles tenant screening, rent collection, and accounting. Need maintenance
            and repairs?{" "}
            <a href="https://bestbayservices.com" target="_blank" rel="noopener noreferrer" className="text-link underline hover:text-primary">
              Best Bay Services
            </a>{" "}
            keeps your properties in top shape at competitive rates. Facing a{" "}
            <a href="https://flforeclosurehelp.com" target="_blank" rel="noopener noreferrer" className="text-link underline hover:text-primary">
              foreclosure situation
            </a>
            ? Barrett can help with that too.
          </p>
        </div>
      </section>

      {/* === Contact === */}
      <section className="py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="heading-section text-xl text-primary mb-2 text-center">
            Ready to Invest in Tampa Bay?
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Barrett Henry helps investors find high-ROI properties and navigate
            the Tampa Bay market. 23+ years of real estate experience.
          </p>
          <ContactForm webhookUrl="/api/contact" source="investing" />
        </div>
      </section>
    </>
  );
}
