// =============================================================================
// /about — About Barrett Henry & The NOW Team
// Bio, designations, brokerage info, and JSON-LD LocalBusiness schema
// =============================================================================

import Image from "next/image";

import type { Metadata } from "next";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import { getPrimaryAgent } from "@/data/agents";
import { testimonials } from "@/data/testimonials";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "About Barrett Henry | Broker Associate | REMAX Collective",
  description:
    "Barrett Henry is a licensed Broker Associate with REMAX Collective and team lead of The NOW Team. 23+ years of real estate experience serving Tampa Bay buyers, sellers, and investors. Call (813) 733-7907.",
  alternates: {
    canonical: "/about",
  },
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
  image: "https://nowtb.com/images/barrett-henry.jpg",
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
    "Citrus County",
  ],
  openingHours: "Mo-Fr 09:00-18:00",
  priceRange: "$$",
};

// --- JSON-LD Person schema for Barrett Henry ---
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Barrett Henry",
  jobTitle: "Broker Associate",
  description: "Licensed Florida REALTOR and Broker Associate with 23+ years of real estate experience.",
  url: "https://nowtb.com/about",
  image: "https://nowtb.com/images/barrett-henry.jpg",
  telephone: "(813) 733-7907",
  email: "barrett@nowtb.com",
  hasCredential: [
    { "@type": "EducationalOccupationalCredential", credentialCategory: "designation", name: "e-PRO" },
    { "@type": "EducationalOccupationalCredential", credentialCategory: "designation", name: "MRP (Military Relocation Professional)" },
    { "@type": "EducationalOccupationalCredential", credentialCategory: "designation", name: "SRS (Seller Representative Specialist)" },
  ],
  memberOf: {
    "@type": "Organization",
    name: "REMAX Collective",
  },
  sameAs: [
    "https://barretthenry.remax.com",
    "https://www.linkedin.com/in/barretthenry",
    "https://www.facebook.com/BarrettHenryREALTOR",
    "https://www.instagram.com/thenowteam",
    "https://vivipm.com",
    "https://hencre.com",
    "https://bestbayservices.com",
    "https://flforeclosurehelp.com",
    "https://valricopropertymgmt.com",
  ],
  knowsAbout: [
    "Residential Real Estate",
    "Tampa Bay Homes for Sale",
    "Investment Properties",
    "New Construction",
    "Military Relocation",
    "Property Management",
  ],
};

// --- BreadcrumbList JSON-LD ---
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
    { "@type": "ListItem", position: 2, name: "About Barrett Henry", item: "https://nowtb.com/about" },
  ],
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
      {/* Person schema for Barrett Henry */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ---- Hero Section — full viewport with label ---- */}
      <HeroSection
        title="About"
        label="BARRETT HENRY, REALTOR®"
      />

      {/* ---- Bio Section — luxury 2-column layout ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Barrett's headshot (left column) */}
            <div className="aspect-[3/4] bg-[#e8e4df] overflow-hidden">
              <Image
                src="/images/barrett-headshot.png"
                alt="Barrett Henry, REALTOR® and Broker Associate at REMAX Collective — Tampa Bay real estate expert with 23+ years experience"
                width={378}
                height={373}
                className="w-full h-full object-cover object-top"
                priority
              />
            </div>

            {/* Bio text (right column) — first-person, personal tone */}
            <div className="py-8">
              <p className="heading-label mb-4">Broker Associate | REMAX Collective</p>
              <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-primary mb-2">
                Barrett Henry
              </h2>
              <div className="section-divider !mx-0 !ml-0" />
              <div className="font-body text-muted font-light space-y-4 leading-relaxed">
                <p>
                  I&apos;ve been in real estate since 2003 — 23+ years and
                  counting. I&apos;m a licensed Broker Associate with REMAX
                  Collective and the team lead of The NOW Team. My focus is
                  simple: get my clients the best possible outcome, whether
                  that&apos;s buying, selling, or investing.
                </p>
                <p>
                  I specialize in residential sales, investment properties, new
                  construction, and military relocation across Tampa Bay. My
                  approach is data-driven and no-nonsense — I give you the real
                  numbers, the honest advice, and the relentless negotiation it
                  takes to win in this market. The NOW Team and I serve buyers
                  and sellers across 8 counties, and we treat every transaction
                  like our reputation depends on it — because it does.
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
              <p className="stat-number text-primary">8</p>
              <p className="heading-label mt-4">Counties Served</p>
            </div>
            <div>
              <p className="stat-number text-primary">TNT</p>
              <p className="heading-label mt-4">The NOW Team</p>
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
              Team serve all 8 counties in the Tampa Bay region.
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

      {/* ---- Barrett's Services — contextual cross-site links ---- */}
      <section className="section-light">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Full-Service Real Estate</p>
            <h2 className="heading-section text-display-sm text-primary">
              Beyond Buying &amp; Selling
            </h2>
            <div className="section-divider" />
          </div>
          <div className="font-body text-muted font-light space-y-6 text-base md:text-lg leading-relaxed">
            <p>
              Barrett&apos;s real estate services extend well beyond traditional
              buying and selling. For investors who need professional property
              management,{" "}
              <a
                href="https://vivipm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                ViVi Property Management
              </a>{" "}
              handles tenant screening, rent collection, and monthly accounting
              across Tampa Bay.
            </p>
            <p>
              Barrett also publishes in-depth commercial real estate insights at{" "}
              <a
                href="https://hencre.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                hencre.com
              </a>
              , covering CRE trends, investment analysis, and market data for
              the Tampa Bay region.
            </p>
            <p>
              For property owners looking for reliable, local property management
              in the Valrico and Brandon area,{" "}
              <a
                href="https://valricopropertymgmt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Valrico Property Management
              </a>{" "}
              provides dedicated service for residential rental portfolios.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Testimonials — real Google reviews ---- */}
      <section id="testimonials" className="section-dark">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label text-white/50 mb-6">Client Reviews</p>
            <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-white">
              What Clients Say
            </h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t) => {
              // First name + last initial (e.g. "Regina C.")
              const parts = t.name.split(" ");
              const displayName = parts.length > 1
                ? `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`
                : parts[0];
              return (
                <div key={t.name} className="card p-6 bg-white/5 border border-white/10">
                  {/* Stars */}
                  <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                  {/* Quote */}
                  <p className="font-body text-white/80 font-light text-sm leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  {/* Attribution */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-body text-white text-xs font-semibold">{displayName}</p>
                      <p className="font-body text-white/50 text-xs">{t.source === "google" ? "Google Review" : "Client Review"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Google reviews link */}
          <div className="text-center mt-12">
            <a
              href="https://www.google.com/search?kgmid=/g/11xvn_2943&hl=en-US&q=Barrett+Henry,+REALTOR%C2%AE+-+REMAX+Collective"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-block"
            >
              See All Google Reviews
            </a>
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
