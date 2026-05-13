// =============================================================================
// /inspectors — Recommended home inspectors page
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Recommended Home Inspectors | Barrett Henry, REALTOR®",
  description: "Barrett Henry's recommended home inspectors in Tampa Bay — trusted professionals for thorough home inspections.",
};

export default function InspectorsPage() {
  return (
    <>
      <HeroSection
        title="Recommended Home Inspectors"
        subtitle="Trusted home inspection professionals Barrett works with across Tampa Bay."
      />
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-accent">
          <p>
            A thorough home inspection can save you thousands. Barrett Henry recommends
            inspectors who are detail-oriented, responsive, and experienced with Florida
            homes — including common issues like roofing, moisture, and foundation concerns.
          </p>
          <p>
            Contact Barrett at <a href="tel:8137337907">(813) 733-7907</a> for a
            personalized inspector recommendation.
          </p>
          <h2>Related Guides</h2>
          <ul>
            <li><Link href="/guides/home-inspection-guide">Home Inspection Guide</Link></li>
            <li><Link href="/guides/home-inspection-guide-florida">Florida Home Inspection Guide</Link></li>
            <li><Link href="/guides/condo-milestone-inspection-guide">Condo Milestone Inspection Guide</Link></li>
          </ul>
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Need an Inspector Recommendation?
          </h2>
          <ContactForm webhookUrl="/api/contact" source="inspectors" />
        </div>
      </section>
    </>
  );
}
