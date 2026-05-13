// =============================================================================
// /about — About Barrett Henry & The NOW Team
// Bio, designations, brokerage info, and JSON-LD LocalBusiness schema
// =============================================================================

import type { Metadata } from "next";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import { getPrimaryAgent } from "@/data/agents";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "About Barrett Henry | Broker Associate | REMAX Collective",
  description:
    "Barrett Henry is a licensed Broker Associate with REMAX Collective and team lead of The NOW Team. 23+ years of real estate experience serving Tampa Bay buyers, sellers, and investors.",
  openGraph: {
    title: "About Barrett Henry | Broker Associate | REMAX Collective",
    description:
      "23+ years of real estate experience. Broker Associate with REMAX Collective serving Tampa Bay.",
    type: "website",
  },
};

// --- JSON-LD LocalBusiness structured data ---
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Barrett Henry, REALTOR®",
  description:
    "Licensed real estate Broker Associate with REMAX Collective serving Tampa Bay. 23+ years of real estate experience.",
  telephone: "(813) 733-7907",
  email: "barrett@nowtb.com",
  url: "https://nowtb.com",
  image: "/images/barrett-henry.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tampa",
    addressRegion: "FL",
    addressCountry: "US",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "REMAX Collective",
  },
  areaServed: [
    "Hillsborough County",
    "Pinellas County",
    "Pasco County",
    "Polk County",
    "Manatee County",
    "Sarasota County",
    "Hernando County",
  ],
  openingHours: "Mo-Fr 09:00-18:00",
  priceRange: "$$",
};

export default function AboutPage() {
  // Pull Barrett's data from the agents data file
  const agent = getPrimaryAgent();

  return (
    <>
      {/* JSON-LD structured data — injected into <head> */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---- Hero Section — full viewport with label ---- */}
      <HeroSection
        title="About"
        label="BARRETT HENRY, REALTOR®"
        fullHeight
      />

      {/* ---- Bio Section — luxury 2-column layout ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Photo placeholder (left column) — large, no rounded corners */}
            <div className="aspect-[3/4] bg-[#e8e4df] flex items-center justify-center">
              {/* Replace with next/image once the photo file is added */}
              <p className="font-body text-muted text-sm tracking-wide uppercase">Barrett Henry</p>
            </div>

            {/* Bio text (right column) */}
            <div className="py-8">
              <p className="heading-label mb-4">{agent.title}</p>
              <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-primary mb-2">
                {agent.name}
              </h2>
              <div className="section-divider !mx-0 !ml-0" />
              <div className="font-body text-muted font-light space-y-4 leading-relaxed">
                <p>{agent.bio}</p>
                <p>
                  As team lead of The NOW Team, Barrett combines deep market
                  knowledge with a no-nonsense, results-driven approach. Whether
                  you&apos;re buying your first home, selling a luxury property,
                  or building an investment portfolio, Barrett provides the
                  data-driven guidance and relentless negotiation you need to win.
                </p>
              </div>
            </div>
          </div>

          {/* Stats row — large ultra-light numbers */}
          <div className="grid grid-cols-3 gap-8 mt-24 max-w-3xl mx-auto text-center">
            <div>
              <p className="stat-number text-primary">23+</p>
              <p className="heading-label mt-4">Years Experience</p>
            </div>
            <div>
              <p className="stat-number text-primary">7</p>
              <p className="heading-label mt-4">Counties Served</p>
            </div>
            <div>
              <p className="stat-number text-primary">3,500+</p>
              <p className="heading-label mt-4">Pages on Site</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Designations & Specialties — warm cream bg ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Credentials</p>
            <h2 className="heading-section text-display-sm text-primary">
              Designations & Specialties
            </h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-3xl mx-auto">
            {/* Designations */}
            <div>
              <h3 className="heading-section text-sm text-primary mb-6">
                Designations
              </h3>
              <ul className="space-y-3">
                {agent.designations.map((d) => (
                  <li
                    key={d}
                    className="font-body text-muted font-light flex items-center gap-3"
                  >
                    <span className="w-6 h-[1px] bg-accent flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specialties */}
            <div>
              <h3 className="heading-section text-sm text-primary mb-6">
                Specialties
              </h3>
              <ul className="space-y-3">
                {agent.specialties.map((s) => (
                  <li
                    key={s}
                    className="font-body text-muted font-light flex items-center gap-3"
                  >
                    <span className="w-6 h-[1px] bg-accent flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Why Tampa Bay — dark navy section ---- */}
      <section className="section-dark">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <p className="heading-label text-white/50 mb-6">The Region</p>
          <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-white">
            Why Tampa Bay
          </h2>
          <div className="section-divider" />
          <div className="font-body text-white/70 font-light space-y-6 text-base md:text-lg leading-relaxed">
            <p>
              Tampa Bay is one of the fastest-growing metro areas in the
              country — and for good reason. Year-round sunshine, no state
              income tax, world-class beaches, a booming job market, and an
              unbeatable quality of life make this region a magnet for families,
              professionals, retirees, and investors.
            </p>
            <p>
              From the urban energy of downtown Tampa and St. Petersburg to the
              suburban charm of Brandon, Riverview, and Valrico, there&apos;s a
              neighborhood for every lifestyle and budget. Barrett and The NOW
              Team serve all 7 counties in the Tampa Bay region.
            </p>
          </div>
        </div>
      </section>

      {/* ---- REMAX Collective Section — white bg ---- */}
      <section className="section-white">
        <div className="container-wide text-center max-w-3xl mx-auto">
          <p className="heading-label mb-6">Brokerage</p>
          <h2 className="heading-section text-display-sm text-primary">
            REMAX Collective
          </h2>
          <div className="section-divider" />
          <div className="font-body text-muted font-light space-y-6 text-base md:text-lg leading-relaxed">
            <p>
              Barrett Henry is proudly affiliated with REMAX Collective, a
              brokerage known for attracting top-producing agents and providing
              the tools, technology, and brand recognition that benefit every
              client.
            </p>
            <p>
              The REMAX network gives Barrett&apos;s listings global exposure
              across 110+ countries and territories — meaning more eyes on your
              property and faster results.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Contact CTA — warm cream bg ---- */}
      <section className="section-light">
        <div className="container-wide max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="about-page"
            title="Get in Touch"
            submitLabel="Send Message"
          />
        </div>
      </section>
    </>
  );
}
