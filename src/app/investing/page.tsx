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
  title: "Real Estate Investing in Tampa Bay | Barrett Henry, REALTOR®",
  description:
    "Tampa Bay investment property opportunities — rental analysis, ROI projections, and expert investor guidance. Barrett Henry, REMAX Collective.",
};

export default function InvestingPage() {
  return (
    <>
      {/* === Hero === */}
      <HeroSection
        title="Real Estate Investing in Tampa Bay"
        subtitle="Build wealth through rental properties, fix-and-flip, and long-term appreciation in one of Florida's hottest markets."
      >
        <SearchBar />
      </HeroSection>

      {/* === Investment types === */}
      <section className="container-wide py-12">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-8 text-center">
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
      <section className="bg-gray-50 py-12">
        <div className="container-wide">
          <h2 className="font-heading font-bold text-2xl text-primary mb-6 text-center">
            Investment Properties by City
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {cities
              .filter((c) => c.tier <= 2)
              .map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}-investment-property`}
                  className="block rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent/10"
                >
                  {city.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* === Contact === */}
      <section className="py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
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
