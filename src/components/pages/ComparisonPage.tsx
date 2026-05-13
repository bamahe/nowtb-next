// =============================================================================
// ComparisonPage — City-vs-city or concept comparison page
// Rendered inside [citySlug] route for slugs like /brandon-vs-riverview
// (24 comparison pages)
// =============================================================================

import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import type { ComparisonData } from "@/data/comparisons";

interface ComparisonPageProps {
  comparison: ComparisonData;
}

export default function ComparisonPage({ comparison }: ComparisonPageProps) {
  const { title, excerpt, sideA, sideB, category } = comparison;

  return (
    <>
      {/* === Hero === */}
      <HeroSection title={title} subtitle={excerpt} />

      {/* === Comparison grid === */}
      <section className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* --- Side A --- */}
          <div className="card p-8">
            <h2 className="font-heading font-bold text-2xl text-primary mb-4">
              {sideA}
            </h2>
            <div className="space-y-4 font-body text-dark">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold text-primary mb-1">Location and Lifestyle</h3>
                <p className="text-muted text-sm">
                  {sideA} offers a unique lifestyle in the Tampa Bay area. Contact Barrett Henry
                  for detailed neighborhood insights and current market data.
                </p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold text-primary mb-1">Home Prices</h3>
                <p className="text-muted text-sm">
                  Home prices in {sideA} vary by neighborhood, home size, and condition.
                  Barrett can provide a current market analysis for your specific criteria.
                </p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold text-primary mb-1">Schools and Amenities</h3>
                <p className="text-muted text-sm">
                  {sideA} has access to quality schools, shopping, dining, and recreation.
                  Ask Barrett about the best school zones and community amenities.
                </p>
              </div>
            </div>
          </div>

          {/* --- Side B --- */}
          <div className="card p-8">
            <h2 className="font-heading font-bold text-2xl text-primary mb-4">
              {sideB}
            </h2>
            <div className="space-y-4 font-body text-dark">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold text-primary mb-1">Location and Lifestyle</h3>
                <p className="text-muted text-sm">
                  {sideB} provides a distinct living experience in the Tampa Bay market.
                  Barrett Henry can help you understand what makes this area unique.
                </p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold text-primary mb-1">Home Prices</h3>
                <p className="text-muted text-sm">
                  {sideB} real estate offers different price points and value opportunities.
                  Get a free consultation with Barrett to compare your options.
                </p>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold text-primary mb-1">Schools and Amenities</h3>
                <p className="text-muted text-sm">
                  {sideB} features its own mix of schools, parks, and community resources.
                  Barrett knows these areas inside and out after 23+ years of real estate experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom line section --- */}
        <div className="mt-12 card p-8 bg-primary/5">
          <h2 className="font-heading font-bold text-2xl text-primary mb-4 text-center">
            The Bottom Line: {sideA} vs {sideB}
          </h2>
          <p className="font-body text-muted text-center max-w-2xl mx-auto mb-6">
            Both {sideA} and {sideB} are excellent options in the Tampa Bay area.
            The best choice depends on your priorities — commute, schools, budget, and lifestyle.
            Barrett Henry has helped hundreds of families make this exact decision.
          </p>
          <div className="text-center">
            <Link href="/contact" className="btn-primary inline-block px-8 py-3">
              Ask Barrett Which Is Right for You
            </Link>
          </div>
        </div>
      </section>

      {/* === Related comparisons or city links === */}
      {category === "city" && (
        <section className="bg-gray-50 py-12">
          <div className="container-wide text-center">
            <h2 className="font-heading font-bold text-2xl text-primary mb-6">
              Explore Both Areas
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${sideA.toLowerCase().replace(/['\s]+/g, "-").replace(/[^a-z0-9-]/g, "")}-homes-for-sale`}
                className="btn-primary px-6 py-3"
              >
                {sideA} Homes for Sale
              </Link>
              <Link
                href={`/${sideB.toLowerCase().replace(/['\s]+/g, "-").replace(/[^a-z0-9-]/g, "")}-homes-for-sale`}
                className="btn-primary px-6 py-3"
              >
                {sideB} Homes for Sale
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* === Contact form === */}
      <section className="py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Need Help Deciding?
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Barrett Henry can give you a personalized comparison based on your
            specific needs and budget.
          </p>
          <ContactForm
            webhookUrl="/api/contact"
            source={`comparison-${comparison.slug}`}
          />
        </div>
      </section>
    </>
  );
}
