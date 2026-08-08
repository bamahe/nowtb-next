// =============================================================================
// /3813-polumbo-dr — Single-property landing page for the QR code / sign rider
// Data pulled from Stellar MLS TB8534534. Photos by Febre Frameworks, stored
// locally in /public/images/listings/3813-polumbo-dr/ so the page keeps working
// if the photographer's tour link ever expires.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Bed, Bath, Ruler, Car, Waves, TreePine } from "lucide-react";
import ContactForm from "@/components/ui/ContactForm";
import PhotoGallery from "@/components/ui/PhotoGallery";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

// --- Listing facts (Stellar MLS TB8534534) -----------------------------------
const L = {
  address: "3813 Polumbo Dr",
  city: "Valrico",
  state: "FL",
  zip: "33596",
  price: 550000,
  beds: 4,
  baths: 3,
  sqft: 2271,
  acres: 0.64,
  yearBuilt: 1991,
  garage: 3,
  mls: "TB8534534",
  status: "Coming Soon",
  taxes: 7466,
  subdivision: "Bloomingdale",
};

// Barrett's phone — defined once so it can never drift out of sync
const PHONE = "(813) 733-7907";
const PHONE_TEL = "8137337907";
const EMAIL = "barrett@nowtb.com";

const PRICE_FMT = `$${L.price.toLocaleString()}`;
const FULL_ADDRESS = `${L.address}, ${L.city}, ${L.state} ${L.zip}`;

// --- Photos ------------------------------------------------------------------
// 119 images downloaded from the listing tour, in the photographer's order:
// exteriors and twilight shots first, then interiors, then drone aerials.
const PHOTO_COUNT = 119;
const photos = Array.from({ length: PHOTO_COUNT }, (_, i) => ({
  MediaURL: `/images/listings/3813-polumbo-dr/photo-${String(i + 1).padStart(3, "0")}.jpg`,
  ShortDescription: `${FULL_ADDRESS} — photo ${i + 1} of ${PHOTO_COUNT}`,
  Order: i,
}));

export const metadata: Metadata = {
  title: "3813 Polumbo Dr, Valrico FL 33596 | 4 Bed Pool Home | $550,000",
  description:
    `Renovated 4 bed, 3 bath, 3 car garage pool home on .64 acres in Bloomingdale. 2,271 sqft, single story, no CDD. MLS ${L.mls}. Call Barrett Henry at ${PHONE}.`,
  alternates: { canonical: "/3813-polumbo-dr/" },
  openGraph: {
    title: "3813 Polumbo Dr, Valrico FL — Renovated Bloomingdale Pool Home",
    description:
      "4 bed, 3 bath, 3 car garage on .64 acres with a screened pool. Fully renovated, single story, optional HOA and no CDD.",
    url: "/3813-polumbo-dr/",
    type: "website",
    images: [{ url: "/images/listings/3813-polumbo-dr/photo-001.jpg" }],
  },
};

// Quick-facts strip shown under the hero
const FACTS = [
  { icon: Bed, label: `${L.beds} Bedrooms` },
  { icon: Bath, label: `${L.baths} Full Baths` },
  { icon: Ruler, label: `${L.sqft.toLocaleString()} Sq Ft` },
  { icon: Car, label: `${L.garage} Car Garage` },
  { icon: Waves, label: "Screened Pool" },
  { icon: TreePine, label: `${L.acres} Acres` },
];

const INTERIOR = [
  "Ceiling Fan(s)", "Eating Space In Kitchen", "High Ceilings",
  "Kitchen/Family Room Combo", "Living Room/Dining Room Combo",
  "Owners Suite Main Floor", "Split Bedroom", "Stone Counters",
  "Thermostat", "Vaulted Ceiling(s)", "Walk-In Closet(s)",
];

const EXTERIOR = [
  "In Ground Screened Pool", "Irrigation System", "Lighting",
  "Private Mailbox", "Sidewalk", "Sliding Doors", "Storage Shed",
  "Privacy Fenced Backyard", "Oversized Landscaped Lot",
];

const APPLIANCES = [
  "Dishwasher", "Disposal", "Electric Water Heater",
  "Exhaust Fan", "Microwave", "Range", "Refrigerator",
];

// Recent big-ticket updates — the questions every buyer asks first
const UPDATES = [
  { item: "Roof", year: "2022" },
  { item: "HVAC", year: "2020" },
  { item: "Irrigation", year: "2023" },
  { item: "Kitchen & all 3 baths", year: "Fully renovated" },
];

const SCHOOLS = [
  { level: "Elementary", name: "Alafia Elementary" },
  { level: "Middle", name: "Burns Middle" },
  { level: "High", name: "Bloomingdale High" },
];

const DETAILS = [
  { label: "Price", value: PRICE_FMT },
  { label: "MLS #", value: L.mls },
  { label: "Status", value: L.status },
  { label: "Property Type", value: "Single Family Residence" },
  { label: "Style", value: "Ranch / Traditional, One Story" },
  { label: "Year Built", value: String(L.yearBuilt) },
  { label: "Living Area", value: `${L.sqft.toLocaleString()} sq ft` },
  { label: "Lot Size", value: `${L.acres} acres (includes .39 acre rear easement)` },
  { label: "Construction", value: "Block & Stucco" },
  { label: "Roof", value: "Shingle (replaced 2022)" },
  { label: "Cooling / Heating", value: "Central Air / Central Electric" },
  { label: "Flood Zone", value: "X" },
  { label: "HOA", value: "Optional" },
  { label: "CDD", value: "None" },
  { label: "Annual Taxes", value: `$${L.taxes.toLocaleString()}` },
  { label: "Subdivision", value: "Bloomingdale Section L" },
];

export default function PolumboListingPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SingleFamilyResidence",
          name: FULL_ADDRESS,
          description:
            "Renovated single story 4 bedroom, 3 bath, 3 car garage pool home on .64 acres in Bloomingdale, Valrico FL.",
          numberOfRooms: L.beds,
          numberOfBathroomsTotal: L.baths,
          floorSize: { "@type": "QuantitativeValue", value: L.sqft, unitCode: "FTK" },
          yearBuilt: L.yearBuilt,
          address: {
            "@type": "PostalAddress",
            streetAddress: L.address,
            addressLocality: L.city,
            addressRegion: L.state,
            postalCode: L.zip,
            addressCountry: "US",
          },
          offers: {
            "@type": "Offer",
            price: L.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Valrico", url: "/valrico/" },
          { name: FULL_ADDRESS, url: "/3813-polumbo-dr/" },
        ])}
      />

      {/* ---------- Hero ---------- */}
      <section className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <p className="inline-block bg-accent text-primary font-bold text-xs uppercase tracking-widest px-3 py-1 rounded mb-4">
            {L.status} &middot; MLS {L.mls}
          </p>
          <h1 className="font-heading text-3xl md:text-5xl font-light tracking-wide uppercase mb-3">
            {L.address}
          </h1>
          <p className="flex items-center gap-2 text-white/80 mb-6">
            <MapPin className="h-4 w-4 shrink-0" />
            {L.city}, {L.state} {L.zip} &middot; {L.subdivision}
          </p>

          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <p className="font-heading text-4xl md:text-5xl font-bold text-accent">{PRICE_FMT}</p>
            <a
              href={`tel:+1${PHONE_TEL}`}
              className="inline-flex items-center gap-2 bg-accent text-primary font-bold px-6 py-3 rounded hover:opacity-90 transition"
            >
              <Phone className="h-5 w-5" />
              Call {PHONE}
            </a>
            <a
              href="#schedule"
              className="inline-flex items-center gap-2 border border-white/40 px-6 py-3 rounded hover:bg-white/10 transition"
            >
              Schedule a Showing
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Quick facts ---------- */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-6 gap-4">
          {FACTS.map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              <f.icon className="h-5 w-5 text-accent shrink-0" />
              <span className="font-body text-sm text-primary">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Photos ---------- */}
      <section className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <PhotoGallery photos={photos} address={FULL_ADDRESS} autoScroll />
        </div>
      </section>

      {/* ---------- Description ---------- */}
      <section className="bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl md:text-3xl font-light uppercase tracking-wide text-primary mb-5">
              What Makes This Bloomingdale Home Different?
            </h2>

            <div className="space-y-4 font-body text-base leading-relaxed text-body">
              <p>
                Single story, fully renovated, and centered on a screened pool — this{" "}
                {L.beds} bedroom, {L.baths} full bath, {L.garage} car garage Bloomingdale home
                delivers {L.sqft.toLocaleString()} square feet of move-in ready living. The kitchen
                and all three baths have been completely updated with modern finishes, and the open
                living spaces gather around a wood burning fireplace. Sliders open to the lanai and
                pool, all wrapped in a privacy fenced backyard with a storage shed.
              </p>
              <p>
                The layout is a true three way split. The owners suite sits alone on one end, quiet
                and set apart, opening through its own slider to the lanai with two separate closets
                and a spa-style bath featuring a freestanding soaking tub and frameless walk-in
                shower. At the opposite end, a bedroom and full bath close off behind a pocket door
                to create a private guest or in-law suite with its own entry from the lanai — and
                that bath doubles as the pool bath, so swimmers never cross the living space. Two
                more bedrooms and a third full bath sit between them.
              </p>
              <p>
                Big-ticket items are handled: roof replaced 2022, HVAC 2020, irrigation updated
                2023. Add a .64 acre parcel per county records, including a .39 acre easement area
                at the rear, plus Flood Zone X, optional HOA, and no CDD. And yes — that optional
                HOA means the boat or RV can come too, per county code. A side service door off the
                garage keeps yard gear and trash day out of the main bay.
              </p>
            </div>

            {/* Recent updates */}
            <h2 className="font-heading text-2xl font-light uppercase tracking-wide text-primary mt-10 mb-5">
              What Has Already Been Updated?
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {UPDATES.map((u) => (
                <div key={u.item} className="flex justify-between bg-surface border border-border rounded px-4 py-3">
                  <span className="font-body text-sm text-body">{u.item}</span>
                  <span className="font-body text-sm font-bold text-primary">{u.year}</span>
                </div>
              ))}
            </div>

            {/* Neighborhood */}
            <h2 className="font-heading text-2xl font-light uppercase tracking-wide text-primary mt-10 mb-5">
              What Is It Like Living in Bloomingdale?
            </h2>
            <div className="space-y-4 font-body text-base leading-relaxed text-body">
              <p>
                Bloomingdale is one of Tampa Bay&rsquo;s most established communities, and this
                pocket of it is built for getting outside. Bloomingdale East Park sits a five minute
                walk away with tennis, pickleball, and basketball courts, a handball wall, a full
                playground, and picnic pavilions. Natures Way is a landscaped community thoroughfare
                with bike lanes, wide sidewalks, shaded benches, and pet stations, so the evening dog
                walk and the weekend bike ride are safe and easy. Mature oaks shade the streets.
              </p>
              <p>
                The Bloomingdale Golfers Club, a Ron Garl championship course, is right in the
                neighborhood, along with the Campo Family YMCA. Bloomingdale Square is about a mile
                up the road with Publix, EoS Fitness, and a run of restaurants, and Walmart, Sprouts,
                and a second Publix all sit inside two miles. Brandon&rsquo;s full retail corridor is
                about ten minutes out. Downtown Tampa and MacDill AFB are about thirty minutes, Gulf
                beaches about an hour, and Orlando&rsquo;s theme parks make an easy day trip.
              </p>
            </div>

            {/* Features */}
            <h2 className="font-heading text-2xl font-light uppercase tracking-wide text-primary mt-10 mb-5">
              Features &amp; Finishes
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <FeatureList title="Interior" items={INTERIOR} />
              <FeatureList title="Exterior" items={EXTERIOR} />
              <FeatureList title="Appliances" items={APPLIANCES} />
            </div>

            {/* Schools */}
            <h2 className="font-heading text-2xl font-light uppercase tracking-wide text-primary mt-10 mb-5">
              Which Schools Serve This Address?
            </h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {SCHOOLS.map((s) => (
                <div key={s.level} className="bg-surface border border-border rounded px-4 py-3">
                  <p className="font-body text-xs uppercase tracking-wide text-muted mb-1">{s.level}</p>
                  <p className="font-body text-sm font-bold text-primary">{s.name}</p>
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-muted mt-3">
              School zoning is subject to change. Confirm current boundaries with Hillsborough
              County Public Schools before making a decision based on assignment.
            </p>

            {/* Details table */}
            <h2 className="font-heading text-2xl font-light uppercase tracking-wide text-primary mt-10 mb-5">
              Property Details
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-border text-left">
                <tbody>
                  {DETAILS.map((d, i) => (
                    <tr key={d.label} className={i % 2 ? "bg-surface" : "bg-white"}>
                      <th scope="row" className="font-body text-sm font-bold text-primary px-4 py-2.5 border-b border-border w-2/5">
                        {d.label}
                      </th>
                      <td className="font-body text-sm text-body px-4 py-2.5 border-b border-border">
                        {d.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ---------- Sticky agent sidebar ---------- */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-primary text-white rounded p-6">
                <p className="font-heading text-3xl font-bold text-accent mb-1">{PRICE_FMT}</p>
                <p className="font-body text-sm text-white/70 mb-5">
                  {L.beds} bd &middot; {L.baths} ba &middot; {L.sqft.toLocaleString()} sqft
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/images/barrett-headshot.png"
                    alt="Barrett Henry, REALTOR and Broker Associate at REMAX Collective"
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-body font-bold">Barrett Henry</p>
                    <p className="font-body text-xs text-white/70">
                      Broker Associate, REMAX Collective
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:+1${PHONE_TEL}`}
                  className="flex items-center justify-center gap-2 bg-accent text-primary font-bold px-4 py-3 rounded mb-3 hover:opacity-90 transition"
                >
                  <Phone className="h-4 w-4" />
                  {PHONE}
                </a>
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Showing request — ${FULL_ADDRESS}`)}`}
                  className="flex items-center justify-center gap-2 border border-white/40 px-4 py-3 rounded hover:bg-white/10 transition"
                >
                  <Mail className="h-4 w-4" />
                  Email Barrett
                </a>

                <p className="font-body text-xs text-white/60 mt-4 leading-relaxed">
                  23+ years of real estate experience. Text or call anytime — I answer my own phone.
                </p>
              </div>

              <div id="schedule" className="bg-surface border border-border rounded p-6 scroll-mt-24">
                <ContactForm
                  webhookUrl="/api/contact"
                  source="/3813-polumbo-dr/"
                  type="showing"
                  title="Request a Showing"
                  submitLabel="Request Showing"
                  property={{
                    address: L.address,
                    city: L.city,
                    state: L.state,
                    price: L.price,
                    mlsNumber: L.mls,
                    url: "https://nowtb.com/3813-polumbo-dr/",
                    beds: L.beds,
                    baths: L.baths,
                    sqft: L.sqft,
                  }}
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="bg-primary text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-light uppercase tracking-wide mb-4">
            Homes Like This in Bloomingdale Do Not Last
          </h2>
          <p className="font-body text-white/80 mb-7">
            Come see it opening weekend. Call or text to lock in a time before it hits the open
            market.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:+1${PHONE_TEL}`}
              className="inline-flex items-center gap-2 bg-accent text-primary font-bold px-7 py-3 rounded hover:opacity-90 transition"
            >
              <Phone className="h-5 w-5" />
              Call {PHONE}
            </a>
            <Link
              href="/valrico/"
              className="inline-flex items-center gap-2 border border-white/40 px-7 py-3 rounded hover:bg-white/10 transition"
            >
              More Valrico Homes
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Disclosure ---------- */}
      <section className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-body text-xs text-muted leading-relaxed">
            Listed by Barrett Henry, Broker Associate, REMAX Collective. MLS {L.mls}. Information
            deemed reliable but not guaranteed — buyer and buyer&rsquo;s agent should independently
            verify all measurements, lot dimensions, easements, flood zone, HOA status, taxes, and
            school assignments. Photography by Febre Frameworks. Equal Housing Opportunity.
          </p>
        </div>
      </section>
    </>
  );
}

// Small helper for the three feature columns
function FeatureList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-body text-sm font-bold uppercase tracking-wide text-primary mb-3">
        {title}
      </h3>
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li key={i} className="font-body text-sm text-body flex gap-2">
            <span className="text-accent" aria-hidden="true">&middot;</span>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
