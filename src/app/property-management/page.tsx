// =============================================================================
// /property-management — ViVi PM property management landing page
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Tampa Bay Property Management — ViVi PM | Barrett Henry",
  description:
    "Professional property management for Tampa Bay rental owners. Tenant screening, maintenance coordination, and accounting. ViVi PM by Barrett Henry.",
};

export default function PropertyManagementPage() {
  return (
    <>
      <HeroSection
        title="Tampa Bay Property Management"
        subtitle="Professional management for your rental properties — tenant screening, maintenance, and accounting."
      />

      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-accent">
          <h2>ViVi Property Management</h2>
          <p>
            ViVi PM provides full-service property management for residential rental
            properties across Tampa Bay. From tenant screening and lease execution to
            maintenance coordination and monthly accounting, we handle everything so
            you can enjoy passive income without the headaches.
          </p>

          <h2>Services Include</h2>
          <ul>
            <li>Tenant screening and background checks</li>
            <li>Lease preparation and execution</li>
            <li>Rent collection and disbursement</li>
            <li>24/7 maintenance coordination</li>
            <li>Monthly financial statements</li>
            <li>Property inspections</li>
            <li>Eviction management (if needed)</li>
          </ul>

          <h2>Maintenance by Best Bay Services</h2>
          <p>
            Our properties are maintained by Best Bay Services, providing fast and
            reliable repairs at competitive rates. This in-house maintenance team
            means faster response times and lower costs for property owners.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Get a Property Management Quote
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Contact Barrett Henry to discuss property management for your Tampa Bay rental.
          </p>
          <ContactForm webhookUrl="/api/contact" source="property-management" />
        </div>
      </section>
    </>
  );
}
