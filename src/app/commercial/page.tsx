// =============================================================================
// /commercial — Commercial real estate page
// =============================================================================

import type { Metadata } from "next";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Commercial Real Estate — Tampa Bay | Barrett Henry",
  description: "Commercial real estate opportunities in Tampa Bay — office, retail, industrial, and investment properties.",
};

export default function CommercialPage() {
  return (
    <>
      <HeroSection
        title="Commercial Real Estate"
        subtitle="Office, retail, industrial, and investment properties across Tampa Bay."
      />
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-accent">
          <p>
            Barrett Henry and The NOW Team assist with commercial real estate transactions
            including office buildings, retail spaces, industrial properties, and
            multi-family investment opportunities across the Tampa Bay area.
          </p>
          <p>
            Contact Barrett at <a href="tel:8137337907">(813) 733-7907</a> to discuss
            your commercial real estate needs.
          </p>
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Discuss Your Commercial Needs
          </h2>
          <ContactForm webhookUrl="/api/contact" source="commercial" />
        </div>
      </section>
    </>
  );
}
