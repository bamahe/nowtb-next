// =============================================================================
// RemaxOfficePage — Dedicated REMAX office landing page
// Targets "REMAX Largo", "REMAX Tampa", "REMAX Brandon" keywords
// =============================================================================

import Link from "next/link";
import ContactForm from "@/components/ui/ContactForm";
import ListingGrid from "@/components/ui/ListingGrid";
import { getListings } from "@/lib/bridge";
import { testimonials } from "@/data/testimonials";

interface OfficeData {
  city: string;
  address: string;
  zip: string;
  image: string;
  mapLink: string;
}

const OFFICES: Record<string, OfficeData> = {
  tampa: {
    city: "Tampa",
    address: "14310 N. Dale Mabry Hwy, Ste 100, Tampa, FL 33618",
    zip: "33618",
    image: "/images/office-tampa.jpg",
    mapLink: "https://www.google.com/maps/place/Barrett+Henry,+REALTOR%C2%AE+-+REMAX+Collective/@28.075781,-82.508415,17z",
  },
  largo: {
    city: "Largo",
    address: "11200 Seminole Blvd, Ste 202, Largo, FL 33778",
    zip: "33778",
    image: "/images/office-largo.jpg",
    mapLink: "https://www.google.com/maps/search/?api=1&query=11200+Seminole+Blvd+Ste+202+Largo+FL+33778",
  },
  brandon: {
    city: "Brandon",
    address: "417 Lithia Pinecrest Rd, Brandon, FL 33511",
    zip: "33511",
    image: "/images/office-brandon.jpg",
    mapLink: "https://maps.app.goo.gl/gjvqfQH6TqnuN2XA8",
  },
};

export function getRemaxOffice(slug: string): OfficeData | null {
  const s = slug.toLowerCase();
  for (const key of Object.keys(OFFICES)) {
    if (s === `remax-${key}`) return OFFICES[key];
  }
  return null;
}

export default async function RemaxOfficePage({ officeKey }: { officeKey: string }) {
  const office = OFFICES[officeKey] || OFFICES.tampa;
  const featured = testimonials.slice(0, 3);

  let listings: import("@/lib/types").Listing[] = [];
  try {
    const res = await getListings({
      city: office.city,
      exclude_rental: true,
      limit: "12",
      sort: "ModificationTimestamp desc",
    });
    listings = res.value || [];
  } catch { listings = []; }

  return (
    <>
      {/* === JSON-LD FAQPage === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: `Where is the REMAX office in ${office.city}?`, acceptedAnswer: { "@type": "Answer", text: `The REMAX Collective ${office.city} office is located at ${office.address}. Barrett Henry is a Broker Associate at this location. Call (813) 733-7907.` } },
              { "@type": "Question", name: `Who is the best REMAX agent in ${office.city}?`, acceptedAnswer: { "@type": "Answer", text: `Barrett Henry is a top-producing Broker Associate at REMAX Collective in ${office.city} with 23+ years of real estate experience, FL Broker License #BK3313308, and designations including e-PRO, MRP, and SRS.` } },
              { "@type": "Question", name: `How do I contact REMAX in ${office.city}?`, acceptedAnswer: { "@type": "Answer", text: `Call Barrett Henry directly at (813) 733-7907 or email barrett@nowtb.com. The ${office.city} office is at ${office.address}.` } },
              { "@type": "Question", name: `Does REMAX ${office.city} help with rentals?`, acceptedAnswer: { "@type": "Answer", text: `Yes. Barrett Henry and The NOW Team assist with both sales and rentals across ${office.city} and the Tampa Bay area. For property management, visit vivipm.com.` } },
            ],
          }),
        }}
      />

      {/* === Hero === */}
      <section className="bg-primary pt-32 pb-16">
        <div className="container-wide">
          <p className="heading-label text-white/50 mb-4">REMAX COLLECTIVE</p>
          <h1 className="font-heading font-extralight text-3xl md:text-5xl tracking-[0.1em] uppercase text-white mb-4">
            REMAX {office.city}
          </h1>
          <p className="font-body text-white/70 text-lg max-w-2xl mb-6">
            Barrett Henry, Broker Associate at REMAX Collective serving {office.city} and the Tampa Bay area.
            23+ years of real estate experience. FL Broker License #BK3313308.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="tel:+18137337907" className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 text-sm hover:bg-accent/90 transition-colors">
              (813) 733-7907
            </a>
            <Link href="/contact/" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors">
              Contact Barrett
            </Link>
          </div>
        </div>
      </section>

      {/* === Office Photo + Info === */}
      <section className="section-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={office.image} alt={`REMAX Collective ${office.city} Office`} className="w-full h-auto" />
            </div>
            <div>
              <p className="heading-label mb-4">Why Choose Barrett Henry at REMAX {office.city}</p>
              <h2 className="font-heading font-extralight text-2xl md:text-3xl tracking-[0.08em] uppercase text-primary mb-6">
                Your {office.city} Real Estate Expert
              </h2>
              <div className="font-body text-muted font-light space-y-4 leading-relaxed">
                <p>
                  <strong>Barrett Henry</strong> is a licensed Florida Real Estate <strong>Broker Associate</strong> with
                  REMAX Collective, serving {office.city} and the entire Tampa Bay metro. With <strong>23+ years of
                  experience</strong>, Barrett brings deep market knowledge, strong negotiation skills, and a
                  no-nonsense approach to every transaction.
                </p>
                <p>
                  Whether you&apos;re buying your first home, selling a property, investing in rental income, or
                  relocating to {office.city}, Barrett and <strong>The NOW Team</strong> deliver results. Every client
                  gets Barrett&apos;s direct cell — no call centers, no runaround.
                </p>
              </div>
              <div className="mt-6 space-y-2 font-body text-sm text-muted">
                <p><strong>Office:</strong> {office.address}</p>
                <p><strong>Direct:</strong> <a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a></p>
                <p><strong>Email:</strong> <a href="mailto:barrett@nowtb.com" className="text-accent hover:underline">barrett@nowtb.com</a></p>
                <p><strong>License:</strong> FL Broker #BK3313308</p>
                <p><strong>Designations:</strong> e-PRO, MRP, SRS</p>
              </div>
              <div className="mt-6">
                <a href={office.mapLink} target="_blank" rel="noopener noreferrer" className="font-body text-xs tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors">
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Listings === */}
      {listings.length > 0 && (
        <ListingGrid
          listings={listings}
          title={`Homes for Sale in ${office.city}`}
          subtitle={`Latest active listings near the REMAX Collective ${office.city} office.`}
        />
      )}

      {/* === Testimonials === */}
      <section className="section-dark">
        <div className="container-wide">
          <h2 className="heading-section text-xl text-white text-center mb-12">What Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((t) => (
              <div key={t.name} className="border border-white/10 p-8">
                <p className="text-accent text-lg mb-4">★★★★★</p>
                <p className="font-body text-white/80 font-light text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <p className="font-body text-white font-medium text-sm">{t.name}</p>
                <p className="font-body text-white/40 text-xs">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FAQ === */}
      <section className="container-wide py-12">
        <h2 className="font-heading font-bold text-2xl text-primary mb-8">Frequently Asked Questions — REMAX {office.city}</h2>
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-6">
            <h3 className="font-heading font-bold text-lg text-primary mb-2">Where is the REMAX office in {office.city}?</h3>
            <p className="font-body text-muted font-light">The REMAX Collective {office.city} office is at <strong>{office.address}</strong>. Barrett Henry is a Broker Associate at this location. Call <a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a>.</p>
          </div>
          <div className="border-b border-gray-100 pb-6">
            <h3 className="font-heading font-bold text-lg text-primary mb-2">Who is the best REMAX agent in {office.city}?</h3>
            <p className="font-body text-muted font-light">Barrett Henry is a top-producing Broker Associate at REMAX Collective with 23+ years of experience, FL Broker License #BK3313308, and designations including e-PRO, MRP, and SRS.</p>
          </div>
          <div className="border-b border-gray-100 pb-6">
            <h3 className="font-heading font-bold text-lg text-primary mb-2">How do I contact REMAX in {office.city}?</h3>
            <p className="font-body text-muted font-light">Call Barrett directly at <a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a> or email <a href="mailto:barrett@nowtb.com" className="text-accent hover:underline">barrett@nowtb.com</a>.</p>
          </div>
          <div className="pb-6">
            <h3 className="font-heading font-bold text-lg text-primary mb-2">Does REMAX {office.city} help with rentals?</h3>
            <p className="font-body text-muted font-light">Yes. Barrett and The NOW Team assist with sales and rentals across {office.city}. For property management, visit <a href="https://vivipm.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">vivipm.com</a>.</p>
          </div>
        </div>
      </section>

      {/* === Contact Form === */}
      <section className="section-light">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl text-primary mb-2 text-center">Contact REMAX {office.city}</h2>
          <p className="font-body text-muted text-center mb-8">Reach Barrett Henry at the {office.city} office.</p>
          <ContactForm webhookUrl="/api/contact" source={`remax-${officeKey}`} />
        </div>
      </section>
    </>
  );
}
