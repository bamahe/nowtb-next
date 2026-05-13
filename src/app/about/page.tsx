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

      {/* ---- Hero Section ---- */}
      <HeroSection title="About Barrett Henry" />

      {/* ---- Bio Section ---- */}
      <section className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Photo placeholder (left column) */}
          <div className="aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center">
            {/* Replace with next/image once the photo file is added */}
            <p className="font-body text-muted text-sm">Photo: Barrett Henry</p>
          </div>

          {/* Bio text (right column) */}
          <div>
            <h2 className="heading-section text-display-sm text-primary mb-2">
              {agent.name}
            </h2>
            <p className="font-body text-accent font-medium mb-6">
              {agent.title}
            </p>
            <div className="font-body text-muted space-y-4">
              <p>{agent.bio}</p>
              <p>
                As team lead of The NOW Team, Barrett combines deep market
                knowledge with a no-nonsense, results-driven approach. Whether
                you&apos;re buying your first home, selling a luxury property,
                or building an investment portfolio, Barrett provides the
                data-driven guidance and relentless negotiation you need to win.
              </p>
            </div>

            {/* Quick facts */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="card p-4 text-center">
                <p className="font-heading font-bold text-2xl text-accent">
                  23+
                </p>
                <p className="font-body text-muted text-sm">
                  Years of Experience
                </p>
              </div>
              <div className="card p-4 text-center">
                <p className="font-heading font-bold text-2xl text-accent">
                  7
                </p>
                <p className="font-body text-muted text-sm">
                  Counties Served
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Designations & Specialties ---- */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide">
          <h2 className="heading-section text-display-sm text-primary text-center mb-12">
            Designations & Specialties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Designations */}
            <div>
              <h3 className="heading-section text-lg text-primary mb-4">
                Designations
              </h3>
              <ul className="space-y-2">
                {agent.designations.map((d) => (
                  <li
                    key={d}
                    className="font-body text-muted flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specialties */}
            <div>
              <h3 className="heading-section text-lg text-primary mb-4">
                Specialties
              </h3>
              <ul className="space-y-2">
                {agent.specialties.map((s) => (
                  <li
                    key={s}
                    className="font-body text-muted flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Why Tampa Bay ---- */}
      <section className="container-wide py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary text-center mb-6">
            Why Tampa Bay
          </h2>
          <div className="font-body text-muted space-y-4 text-lg">
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

      {/* ---- REMAX Collective Section ---- */}
      <section className="bg-accent/10 py-16">
        <div className="container-wide text-center max-w-3xl mx-auto">
          <h2 className="heading-section text-display-sm text-primary mb-6">
            REMAX Collective
          </h2>
          <div className="font-body text-muted space-y-4 text-lg">
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

      {/* ---- Contact Form ---- */}
      <section className="container-wide py-16">
        <div className="max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="about-page"
            title="Get in Touch With Barrett"
            submitLabel="Send Message"
          />
        </div>
      </section>
    </>
  );
}
