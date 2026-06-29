// =============================================================================
// /contact — Contact Page
// Luxury minimalist: full-viewport hero, spacious 2-column layout
// Left: large heading + contact details. Right: minimal contact form.
// =============================================================================

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

// Leaflet requires window/DOM — load client-side only
const TampaBayMap = dynamic(() => import("@/components/ui/TampaBayMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-100 flex items-center justify-center">
      <p className="font-body text-muted text-sm">Loading map...</p>
    </div>
  ),
});

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Contact Barrett Henry | Tampa Bay REALTOR® | (813) 733-7907",
  description:
    "Get in touch with Barrett Henry, Broker Associate with REMAX Collective. Call (813) 733-7907 or send a message. Serving Tampa Bay's 8 counties.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Barrett Henry | Tampa Bay REALTOR®",
    description:
      "Reach Barrett Henry for buying, selling, or investing in Tampa Bay real estate. (813) 733-7907.",
    type: "website",
  },
};

// --- Tampa Bay's 8 counties ---
const counties = [
  "Hillsborough County",
  "Pinellas County",
  "Pasco County",
  "Polk County",
  "Manatee County",
  "Sarasota County",
  "Hernando County",
  "Citrus County",
];

export default function ContactPage() {
  return (
    <>
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Contact Barrett Henry", item: "https://nowtb.com/contact" },
            ],
          }),
        }}
      />
      {/* ---- Hero Section — full viewport ---- */}
      <HeroSection
        title="Let&apos;s Talk"
        label="BARRETT HENRY | THE NOW TEAM"
        subtitle="Have a question about buying, selling, or investing? I'd rather talk than text. Call me directly or drop a message below."
      />

      {/* ---- Two-Column: Contact Info (left) + Form (right) ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left column — Barrett's photo + contact details */}
            <div className="py-8">
              {/* Barrett's headshot */}
              <div className="mb-8 w-32 h-32 relative overflow-hidden">
                <Image
                  src="/images/barrett-henry.jpg"
                  alt="Barrett Henry, REALTOR® and Broker Associate"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>

              <p className="heading-label mb-6">Barrett Henry, REALTOR®</p>
              <h2 className="font-heading font-extralight text-3xl md:text-4xl lg:text-5xl tracking-[0.1em] uppercase text-primary leading-tight">
                Talk to Barrett Directly
              </h2>
              <div className="section-divider !mx-0 !ml-0" />

              {/* Phone — large and prominent, primary CTA */}
              <div className="mb-10">
                <p className="heading-label mb-3">Call Me</p>
                <a
                  href="tel:+18137337907"
                  className="font-heading font-extralight text-2xl md:text-3xl text-primary hover:text-accent transition-colors duration-300"
                >
                  (813) 733-7907
                </a>
                <p className="font-body text-muted text-sm font-light mt-2">
                  I pick up. If I miss you, I&apos;ll call back.
                </p>
              </div>

              {/* Email */}
              <div className="mb-10">
                <p className="heading-label mb-3">Email</p>
                <a
                  href="mailto:barrett@nowtb.com"
                  className="font-body text-lg font-light text-muted hover:text-accent transition-colors duration-300"
                >
                  barrett@nowtb.com
                </a>
              </div>

              {/* Office Locations */}
              <div className="mb-10">
                <p className="heading-label mb-3">Office Locations</p>
                <div className="space-y-4">
                  <div>
                    <p className="font-body text-dark font-medium">Tampa</p>
                    <p className="font-body text-muted font-light text-sm">
                      14310 N. Dale Mabry Hwy, Ste 100<br />Tampa, FL 33618
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-dark font-medium">Largo</p>
                    <p className="font-body text-muted font-light text-sm">
                      11200 Seminole Blvd, Ste 202<br />Largo, FL 33778
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-dark font-medium">Brandon</p>
                    <p className="font-body text-muted font-light text-sm">
                      417 Lithia Pinecrest Rd<br />Brandon, FL 33511
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div>
                <p className="heading-label mb-3">Hours</p>
                <p className="font-body text-muted font-light">
                  Monday – Friday: 9:00 AM – 6:00 PM
                  <br />
                  Saturday: 10:00 AM – 4:00 PM
                  <br />
                  Sunday: By Appointment
                </p>
              </div>
            </div>

            {/* Right column — Contact form */}
            <div className="py-8">
              <ContactForm
                webhookUrl="/api/contact"
                source="contact-page"
                title="Send a Message"
                submitLabel="Send Message"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Office Locations Map ---- */}
      <section className="section-light">
        <div className="container-wide">
          <p className="heading-label text-center mb-6">Our Offices</p>
          <TampaBayMap
            markers={[
              { name: "REMAX Collective — Tampa", lat: 28.0753, lng: -82.5035, label: "Tampa Office<br>14310 N. Dale Mabry Hwy, Ste 100", type: "office" },
              { name: "REMAX Collective — Largo", lat: 27.8839, lng: -82.7873, label: "Largo Office<br>11200 Seminole Blvd, Ste 202", type: "office" },
              { name: "REMAX Collective — Brandon", lat: 27.9295, lng: -82.2859, label: "Brandon Office<br>417 Lithia Pinecrest Rd", type: "office" },
            ]}
            zoom={10}
            centerLat={27.96}
            centerLng={-82.50}
          />
          {/* Office cards below map */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 text-center">
              <p className="font-body text-dark font-medium mb-1">Tampa Office</p>
              <p className="font-body text-muted font-light text-sm">
                14310 N. Dale Mabry Hwy, Ste 100<br />Tampa, FL 33618
              </p>
            </div>
            <div className="bg-white p-6 text-center">
              <p className="font-body text-dark font-medium mb-1">Largo Office</p>
              <p className="font-body text-muted font-light text-sm">
                11200 Seminole Blvd, Ste 202<br />Largo, FL 33778
              </p>
            </div>
            <div className="bg-white p-6 text-center">
              <p className="font-body text-dark font-medium mb-1">Brandon Office</p>
              <p className="font-body text-muted font-light text-sm">
                417 Lithia Pinecrest Rd<br />Brandon, FL 33511
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Serving Tampa Bay's 8 Counties — dark navy ---- */}
      <section className="section-dark">
        <div className="container-wide text-center">
          <p className="heading-label text-white/50 mb-6">Service Area</p>
          <h2 className="heading-section text-display-sm text-white mb-16">
            Serving Tampa Bay&apos;s 8 Counties
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {counties.map((county) => (
              <div key={county} className="text-center">
                <p className="font-body text-white/70 font-light text-sm">
                  {county}
                </p>
              </div>
            ))}
          </div>
          <div className="section-divider mt-12" />
          <p className="font-body text-white/50 font-light mt-8 text-sm">
            Whether you&apos;re buying, selling, or investing anywhere in the
            Tampa Bay metro — call Barrett directly at{" "}
            <a href="tel:+18137337907" className="text-white/70 hover:text-accent transition-colors duration-300">
              (813) 733-7907
            </a>.
            The NOW Team is ready when you are.
          </p>
        </div>
      </section>
    </>
  );
}
