// =============================================================================
// /relocation — Tampa Bay relocation services page
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import SearchBar from "@/components/ui/SearchBar";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Tampa Bay Relocation Services | Barrett Henry, REALTOR®",
  description: "Relocating to Tampa Bay? Barrett Henry provides full relocation services for individuals, families, and military.",
};

export default function RelocationPage() {
  return (
    <>
      <HeroSection
        title="Tampa Bay Relocation Services"
        subtitle="Moving to Tampa Bay? Barrett Henry makes the transition seamless."
      >
        <SearchBar />
      </HeroSection>

      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-accent">
          <h2>Full-Service Relocation Support</h2>
          <p>
            Whether you are moving from out of state, across the country, or from
            another country, Barrett Henry provides comprehensive relocation services.
            With 23+ years of real estate experience, Barrett knows every neighborhood
            in Tampa Bay and will match you with the perfect community.
          </p>
          <h2>Relocation Services Include</h2>
          <ul>
            <li>Virtual and in-person neighborhood tours</li>
            <li>School zone research and recommendations</li>
            <li>Cost of living comparisons</li>
            <li>Coordination with your current agent</li>
            <li>Temporary housing assistance</li>
            <li>Military PCS relocation expertise (MRP certified)</li>
          </ul>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container-wide">
          <h2 className="font-heading font-bold text-2xl text-primary mb-6 text-center">
            Relocation Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link href="/guides/relocation-guide" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <span className="font-heading font-bold text-sm text-primary">Relocation Guide</span>
            </Link>
            <Link href="/guides/military-home-buying-guide" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <span className="font-heading font-bold text-sm text-primary">Military Home Buying</span>
            </Link>
            <Link href="/guides/macdill-afb-housing-guide" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <span className="font-heading font-bold text-sm text-primary">MacDill AFB Housing</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Planning Your Move to Tampa Bay?
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Barrett Henry will create a personalized relocation plan for you.
          </p>
          <ContactForm webhookUrl="/api/contact" source="relocation" />
        </div>
      </section>
    </>
  );
}
