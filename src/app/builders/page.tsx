// =============================================================================
// /builders — Tampa Bay home builders page
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Tampa Bay Home Builders | Barrett Henry, REALTOR®",
  description: "Top home builders in Tampa Bay — DR Horton, Lennar, Pulte, Taylor Morrison, Toll Brothers, and more. Barrett Henry, REMAX Collective.",
};

export default function BuildersPage() {
  const builders = [
    { name: "DR Horton", slug: "dr-horton-homes-tampa-bay", desc: "America's largest homebuilder with communities across Tampa Bay." },
    { name: "Lennar", slug: "lennar-homes-tampa-bay", desc: "Everything's Included homes with smart home technology." },
    { name: "Pulte Homes", slug: "pulte-homes-tampa-bay", desc: "Life Tested floor plans designed for how you really live." },
    { name: "Taylor Morrison", slug: "taylor-morrison-homes-tampa-bay", desc: "Award-winning homes with premium standard features." },
    { name: "Toll Brothers", slug: "toll-brothers-homes-tampa-bay", desc: "Luxury new construction with upscale finishes." },
    { name: "M/I Homes", slug: "mi-homes-tampa-bay", desc: "Quality craftsmanship with flexible floor plans." },
  ];

  return (
    <>
      <HeroSection
        title="Tampa Bay Home Builders"
        subtitle="Browse new construction communities from the area's top builders."
      >
        <SearchBar />
      </HeroSection>

      <section className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builders.map((builder) => (
            <Link
              key={builder.slug}
              href={`/${builder.slug}`}
              className="group card p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-heading font-bold text-xl text-primary group-hover:text-accent transition-colors mb-2">
                {builder.name}
              </h3>
              <p className="font-body text-muted text-sm">{builder.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-accent">
          <h2>Why You Need Your Own REALTOR for New Construction</h2>
          <p>
            Builder sales agents work for the builder, not you. Having Barrett Henry
            represent you costs nothing extra — the builder pays the commission — and
            Barrett negotiates upgrades, lot premiums, and closing cost credits on your behalf.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Interested in New Construction?
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Barrett Henry can tour builder communities with you and negotiate the best deal.
          </p>
          <ContactForm webhookUrl="/api/contact" source="builders" />
        </div>
      </section>
    </>
  );
}
