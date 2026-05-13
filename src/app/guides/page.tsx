// =============================================================================
// /guides — Guide index page listing all buyer/seller/investor guides
// Groups guides by category with links to individual guide pages
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import { guides } from "@/data/guides";

export const metadata: Metadata = {
  title: "Real Estate Guides | Barrett Henry, REALTOR®",
  description:
    "Free real estate guides for Tampa Bay buyers, sellers, and investors. First-time buyer guides, mortgage guides, selling guides, and more from Barrett Henry at REMAX Collective.",
};

export default function GuidesIndexPage() {
  // Group guides by category for organized display
  const categories = Array.from(new Set(guides.map((g) => g.category)));
  const guidesByCategory = categories.map((cat) => ({
    category: cat,
    guides: guides.filter((g) => g.category === cat),
  }));

  return (
    <>
      {/* === Hero === */}
      <HeroSection
        title="Real Estate Guides"
        subtitle="Free guides for buyers, sellers, and investors. 23+ years of real estate experience, distilled into actionable advice."
      >
        <SearchBar />
      </HeroSection>

      {/* === Guide grid by category === */}
      <section className="container-wide py-12">
        {guidesByCategory.map(({ category, guides: catGuides }) => (
          <div key={category} className="mb-12">
            {/* Category heading */}
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6 border-b border-gray-200 pb-3">
              {category} Guides
            </h2>

            {/* Guide cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group card p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Category badge */}
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-body font-semibold bg-accent/20 text-primary mb-3">
                    {guide.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg text-primary group-hover:text-accent transition-colors mb-2 line-clamp-2">
                    {guide.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="font-body text-muted text-sm line-clamp-3 mb-3">
                    {guide.excerpt}
                  </p>

                  {/* Reading time */}
                  <span className="font-body text-xs text-accent">
                    {guide.readingTime}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* === CTA section === */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide text-center max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-4">
            Need Personalized Advice?
          </h2>
          <p className="font-body text-muted mb-6">
            These guides are a great starting point, but every situation is
            different. Barrett Henry can give you expert guidance tailored to
            your goals.
          </p>
          <Link
            href="/contact"
            className="btn-primary inline-block px-8 py-3"
          >
            Contact Barrett
          </Link>
        </div>
      </section>
    </>
  );
}
