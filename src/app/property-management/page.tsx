// =============================================================================
// /property-management — ViVi PM property management landing page
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Property Management Tampa Bay | ViVi PM | Barrett Henry",
  description:
    "Professional property management for Tampa Bay rental owners. Tenant screening, maintenance coordination, and accounting. ViVi PM by Barrett Henry. Call (813) 733-7907.",
  alternates: {
    canonical: "/property-management/",
  },
  openGraph: {
    title: "Property Management Tampa Bay | ViVi PM | Barrett Henry",
    description:
      "Professional property management for Tampa Bay rental owners. Tenant screening, maintenance coordination, and accounting by ViVi PM.",
    url: "/property-management/",
    type: "website",
  },
};

// --- Services list ---
const services = [
  { title: "Tenant Screening", desc: "Full background checks, credit reports, income verification, and rental history review before any lease is signed." },
  { title: "Lease Preparation", desc: "Legally compliant lease agreements tailored to Florida landlord-tenant law, executed and stored digitally." },
  { title: "Rent Collection", desc: "On-time rent collection with online payment portals and direct disbursement to your account." },
  { title: "24/7 Maintenance", desc: "Round-the-clock maintenance coordination with trusted local vendors — fast response, competitive rates." },
  { title: "Financial Reporting", desc: "Monthly owner statements, year-end tax documents, and full transparency on every dollar." },
  { title: "Property Inspections", desc: "Regular move-in, move-out, and periodic inspections to protect your investment." },
  { title: "Eviction Management", desc: "If it comes to it, we handle the legal process from notice to court filing so you don't have to." },
];

export default function PropertyManagementPage() {
  return (
    <>
      {/* === Hero === */}
      <HeroSection
        title="Property Management"
        label="VIVI PM | BARRETT HENRY"
        subtitle="Professional management for your Tampa Bay rental properties. We handle everything — you collect the income."
      />

      {/* === Intro Section === */}
      <section className="section-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="heading-label mb-6">Full-Service Management</p>
              <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-primary leading-tight">
                ViVi PM
              </h2>
              <div className="section-divider !mx-0 !ml-0" />
              <p className="font-body text-muted font-light text-lg leading-relaxed mb-6">
                <a href="https://vivipm.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary transition-colors font-medium">ViVi PM</a> provides
                full-service property management for residential rental
                properties across Tampa Bay. From tenant screening and lease execution to
                maintenance coordination and monthly accounting, we handle everything so
                you can enjoy passive income without the headaches.
              </p>
              <p className="font-body text-muted font-light leading-relaxed">
                We coordinate all maintenance through a network of trusted local vendors,
                ensuring fast and reliable repairs at competitive rates. Our vendor
                relationships mean faster response times and lower costs for property
                owners.
              </p>
            </div>
            <div>
              <div className="bg-primary p-8 md:p-10">
                <p className="heading-label text-white/50 mb-4">Why ViVi PM?</p>
                <ul className="space-y-4">
                  {[
                    "No hidden fees — flat monthly rate",
                    "Trusted local vendor network for fast maintenance",
                    "23+ years of real estate experience",
                    "Online owner portal with real-time reporting",
                    "Licensed Broker oversight on every property",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-accent mt-1 flex-shrink-0">→</span>
                      <span className="font-body text-white/80 font-light">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a
                    href="tel:+18137337907"
                    className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 text-sm hover:bg-accent/90 transition-colors"
                  >
                    Call (813) 733-7907
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Services Grid === */}
      <section className="section-light">
        <div className="container-wide">
          <p className="heading-label text-center mb-4">What We Handle</p>
          <h2 className="heading-section text-xl text-primary text-center mb-12">
            Our Property Management Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={service.title} className="bg-white p-8 shadow-sm">
                <p className="font-body text-accent text-xs tracking-[0.2em] uppercase mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-heading font-bold text-lg text-primary mb-3">
                  {service.title}
                </h3>
                <p className="font-body text-muted font-light text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA + Contact Form === */}
      <section className="section-dark">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="py-4">
              <p className="heading-label text-white/50 mb-6">Get Started</p>
              <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-white leading-tight mb-6">
                Get a Property Management Quote
              </h2>
              <div className="section-divider !mx-0 !ml-0" />
              <p className="font-body text-white/70 font-light text-lg leading-relaxed mb-8">
                Whether you have one rental or a portfolio, Barrett Henry and the ViVi PM
                team will give you a straight answer on what it costs and what you can expect.
                No sales pitch — just numbers.
              </p>
              <div className="space-y-4">
                <a
                  href="tel:+18137337907"
                  className="block font-heading font-extralight text-2xl text-white/80 hover:text-accent transition-colors"
                >
                  (813) 733-7907
                </a>
                <a
                  href="mailto:barrett@nowtb.com"
                  className="block font-body text-white/50 hover:text-accent transition-colors"
                >
                  barrett@nowtb.com
                </a>
              </div>
            </div>
            <div className="bg-white p-8 md:p-10">
              <ContactForm
                webhookUrl="/api/contact"
                source="property-management"
                title="Request a Quote"
                submitLabel="Get My Quote"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
