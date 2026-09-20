// =============================================================================
// /11417-cypress-park-st — Single-property landing page for the QR code / sign
// rider. Data pulled from Stellar MLS TB8549024. Photos pulled from the listing
// feed and stored locally in /public/images/listings/11417-cypress-park-st/ so
// the page keeps working if the feed URL ever rotates.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Bed, Bath, Ruler, Car, Briefcase, Home, CalendarDays, Navigation, ClipboardCheck, Landmark } from "lucide-react";
import ContactForm from "@/components/ui/ContactForm";
import PhotoGallery from "@/components/ui/PhotoGallery";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

// --- Listing facts (Stellar MLS TB8549024) -----------------------------------
const L = {
  address: "11417 Cypress Park St",
  city: "Tampa",
  state: "FL",
  zip: "33624",
  price: 514990,
  beds: 3,
  baths: 2,
  sqft: 1800,
  acres: 0.14,
  yearBuilt: 1998,
  garage: 2,
  mls: "TB8549024",
  status: "Active",
  lat: 28.05035,
  lng: -82.519273,
  taxes: 2798,
  hoa: 740,
  subdivision: "Casey's Landing",
};

// Barrett's phone — defined once so it can never drift out of sync
const PHONE = "(813) 733-7907";
const PHONE_TEL = "8137337907";
const EMAIL = "barrett@nowtb.com";

const PRICE_FMT = `$${L.price.toLocaleString()}`;
const FULL_ADDRESS = `${L.address}, ${L.city}, ${L.state} ${L.zip}`;

// Open house details. Unlike the Polumbo page, this listing has a single
// scheduled open house, so the date is spelled out. Update this one string when
// the next weekend is scheduled — the QR code and signs never have to change.
const OPEN_HOUSE = "Sunday, September 20 · 2:00 – 4:00 PM";

// Lender joining the open house, straight from Christian's own signature block.
// This is his direct line; src/data/vendors/lenders.json has been corrected to
// match. Any field left empty is skipped when rendering.
//
// applyUrl deliberately drops the `_gl=` parameter that came with the link he
// sent. That is a Google Analytics cross-domain session token — it goes stale,
// and baking it into a QR code makes the code denser for no benefit.
const LENDER = {
  name: "Christian Gardner",
  company: "CMG Home Loans",
  title: "Senior Loan Officer",
  phone: "(727) 365-4180",
  email: "Christiang@CMGHomeLoans.com",
  nmls: "1639012",
  branchNmls: "2653957",
  photo: "/images/listings/11417-cypress-park-st/christian-gardner.jpg",
  applyUrl: "https://secure.cmghomeloans.com/apply?id=225594",
  applyQr: "/images/listings/11417-cypress-park-st/christian-gardner-apply-qr.png",
};

// Turn-by-turn navigation straight to the driveway. Uses lat/lng rather than the
// address string so the phone never geocodes it to the wrong end of the street.
// This universal Google Maps URL opens the native app on both iOS and Android.
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${L.lat}%2C${L.lng}`;

// --- Photos ------------------------------------------------------------------
// 54 images downloaded from the listing feed, in MLS display order:
// exteriors first, then interiors, then the back patio and yard.
const PHOTO_COUNT = 54;
const photos = Array.from({ length: PHOTO_COUNT }, (_, i) => ({
  MediaURL: `/images/listings/11417-cypress-park-st/photo-${String(i + 1).padStart(3, "0")}.jpg`,
  ShortDescription: `${FULL_ADDRESS} — photo ${i + 1} of ${PHOTO_COUNT}`,
  Order: i,
}));

export const metadata: Metadata = {
  title: "11417 Cypress Park St, Tampa FL 33624 | 3 Bed + Office | $514,990",
  description:
    `Updated 3 bed, 2 bath, 2 car garage home with a home office on a Carrollwood cul-de-sac. 1,800 sqft, single story, low $740/yr HOA. MLS ${L.mls}. Call Barrett Henry at ${PHONE}.`,
  alternates: { canonical: "/11417-cypress-park-st/" },
  openGraph: {
    title: "Open House Sunday 2p–4p — 11417 Cypress Park St, Tampa FL",
    description:
      "3 bed, 2 bath, 2 car garage plus a home office at the end of a quiet Carrollwood cul-de-sac. Hardwood floors, quartz kitchen, screened patio. Open house Sunday, 2:00 to 4:00.",
    url: "/11417-cypress-park-st/",
    type: "website",
    images: [
      {
        url: "/images/listings/11417-cypress-park-st/og-open-house.jpg",
        width: 1200,
        height: 630,
        alt: "Open House Sunday 2p to 4p — 11417 Cypress Park St, Tampa FL, $514,990",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open House Sunday 2p–4p — 11417 Cypress Park St, Tampa FL",
    description: "3 bed, 2 bath, 2 car garage plus office on a Carrollwood cul-de-sac. $514,990.",
    images: ["/images/listings/11417-cypress-park-st/og-open-house.jpg"],
  },
};

// Quick-facts strip shown under the hero
const FACTS = [
  { icon: Bed, label: `${L.beds} Bedrooms` },
  { icon: Bath, label: `${L.baths} Full Baths` },
  { icon: Ruler, label: `${L.sqft.toLocaleString()} Sq Ft` },
  { icon: Car, label: `${L.garage} Car Garage` },
  { icon: Briefcase, label: "Home Office / Den" },
  { icon: Home, label: "Single Story" },
];

const INTERIOR = [
  "Ceiling Fan(s)", "Open Floorplan", "High Ceilings",
  "Kitchen/Family Room Combo", "Living Room/Dining Room Combo",
  "Owners Suite Main Floor", "Split Bedroom", "Solid Surface Counters",
  "Plantation Shutters", "Walk-In Closet(s)", "Inside Laundry Room",
];

const EXTERIOR = [
  "Screened Patio", "Irrigation System", "Lighting", "Rain Gutters",
  "Flagstone Paver Driveway", "Landscape Curbing", "Wood Privacy Fence",
  "Tropical Landscaping", "Cul-de-Sac Lot",
];

const APPLIANCES = [
  "Dishwasher", "Dryer", "Electric Water Heater",
  "Microwave", "Range", "Refrigerator", "Washer",
];

// Recent big-ticket updates — the questions every buyer asks first
const UPDATES = [
  { item: "Windows", year: "2020" },
  { item: "HVAC", year: "2020" },
  { item: "Roof", year: "2016" },
  { item: "Kitchen", year: "Quartz & travertine" },
];

const SCHOOLS = [
  { level: "Elementary / Middle", name: "Carrollwood K-8 School" },
  { level: "High", name: "Gaither High School" },
];

const DETAILS = [
  { label: "Price", value: PRICE_FMT },
  { label: "MLS #", value: L.mls },
  { label: "Status", value: L.status },
  { label: "Property Type", value: "Single Family Residence" },
  { label: "Style", value: "One Story" },
  { label: "Year Built", value: String(L.yearBuilt) },
  { label: "Living Area", value: `${L.sqft.toLocaleString()} sq ft` },
  { label: "Lot Size", value: `${L.acres} acres (6,000 sq ft, 60 x 100)` },
  { label: "Construction", value: "Block & Stucco" },
  { label: "Roof", value: "Shingle (replaced 2016)" },
  { label: "Cooling / Heating", value: "Central Air (2020) / Central Electric" },
  { label: "Foundation", value: "Slab" },
  { label: "HOA", value: `$${L.hoa.toLocaleString()} per year` },
  { label: "Financing", value: "Cash, Conventional, FHA, VA" },
  { label: "Annual Taxes", value: `$${L.taxes.toLocaleString()} (2025)` },
  { label: "Subdivision", value: "Casey's Landing" },
];

export default function CypressParkListingPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SingleFamilyResidence",
          name: FULL_ADDRESS,
          description:
            "Updated single story 3 bedroom, 2 bath, 2 car garage home with a home office on a cul-de-sac in Carrollwood, Tampa FL.",
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
          geo: {
            "@type": "GeoCoordinates",
            latitude: L.lat,
            longitude: L.lng,
          },
          hasMap: DIRECTIONS_URL,
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Tampa", url: "/tampa/" },
          { name: FULL_ADDRESS, url: "/11417-cypress-park-st/" },
        ])}
      />

      {/* ---------- Open house banner — first thing a QR scanner sees ----------
           pt-24 clears the fixed 80px site header, which otherwise sits on top
           of this band and hides the directions button. */}
      <section className="bg-accent text-primary pt-24">
        <div className="max-w-6xl mx-auto px-4 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <CalendarDays className="h-6 w-6 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-heading text-lg md:text-xl font-bold uppercase tracking-wide leading-tight">
                Open House
              </p>
              <p className="font-body text-sm md:text-base font-semibold">{OPEN_HOUSE}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded hover:opacity-90 transition"
            >
              <Navigation className="h-5 w-5" aria-hidden="true" />
              Tap for Directions
            </a>
            <Link
              href="/11417-cypress-park-st/sign-in/"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded border-2 border-primary hover:bg-primary hover:text-white transition"
            >
              <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
              Sign Into Open House
            </Link>
          </div>
        </div>
      </section>

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
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/40 px-6 py-3 rounded hover:bg-white/10 transition"
            >
              <Navigation className="h-5 w-5" aria-hidden="true" />
              Directions
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
              What Makes This Carrollwood Home Different?
            </h2>

            <div className="space-y-4 font-body text-base leading-relaxed text-body">
              <p>
                This one sits at the end of a quiet cul-de-sac, which is the part you feel before
                you ever walk inside — no through traffic, no headlights sweeping the front window.
                Homes in this pocket of Carrollwood rarely come up. Inside, {L.sqft.toLocaleString()}{" "}
                square feet opens up with hardwood floors, tall ceilings, and plantation shutters on
                the windows, so you can dial the light exactly where you want it.
              </p>
              <p>
                The kitchen is the upgrade that carries the house: quartz counters, travertine
                flooring, and pendant lighting over the working space, open to the family room so
                whoever is cooking is still part of the conversation. Past it, the split floorplan
                puts the owners suite on its own side with a walk-in closet, and the two secondary
                bedrooms on the other. The home office is a fourth room on top of those three
                bedrooms — open to the floorplan rather than closed off, so it reads as a bright
                work space or a den depending on what you need from it.
              </p>
              <p>
                Out back, the screened patio looks over tropical landscaping inside a wood privacy
                fence, which is where this house earns its keep in the evenings. Big-ticket items are
                already handled: windows replaced in 2020, air conditioning in 2020, roof in 2016.
                The HOA runs just ${L.hoa} a year, and the flagstone paver driveway and landscape
                curbing mean the curb appeal is done, not a project waiting for you.
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
              What Is It Like Living in Carrollwood?
            </h2>
            <div className="space-y-4 font-body text-base leading-relaxed text-body">
              <p>
                Carrollwood is one of Tampa&rsquo;s original established suburbs, and this address
                puts you minutes from Carrollwood Village Park just up Casey Road — one of the best
                public parks in the county, with a playground, dog park, skate park, splash area, and
                an amphitheater that runs events through the cooler months. The Carrollwood Cultural
                Center sits nearby with classes, galleries, and live performances.
              </p>
              <p>
                Everyday errands are short: Gunn Highway and Dale Mabry both carry full runs of
                grocery stores, gyms, and restaurants, with a local brewery scene that has grown
                steadily in the last few years. Veterans Expressway is the on-ramp that makes the
                location work — Tampa International is roughly twenty minutes, downtown Tampa about
                twenty-five, and the Gulf beaches at Clearwater around forty-five. The home is zoned
                for Gaither High School.
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

                {/* Save-my-contact QR. Encodes a vCard, not a URL — scanning it
                    opens the phone's "Add Contact" card directly, so a buyer
                    walking the open house leaves with Barrett already in their
                    phone instead of a business card in a pocket. */}
                <div className="bg-white rounded p-4 mt-5 text-center">
                  <Image
                    src="/images/listings/11417-cypress-park-st/barrett-henry-vcard-qr.png"
                    alt="QR code to save Barrett Henry's contact information to your phone"
                    width={150}
                    height={150}
                    className="mx-auto"
                    unoptimized
                  />
                  <p className="font-body text-sm font-bold text-primary mt-3">
                    Scan to Save My Contact
                  </p>
                  <p className="font-body text-xs text-muted mt-0.5">
                    Adds me straight to your phone
                  </p>
                </div>

                <p className="font-body text-xs text-white/60 mt-4 leading-relaxed">
                  24+ years of real estate experience. Text or call anytime — I answer my own phone.
                </p>
              </div>

              {/* Lender on site — only renders the fields that are filled in */}
              <div className="bg-surface border border-border rounded p-6">
                <p className="font-body text-xs uppercase tracking-wide text-muted mb-2">
                  Lender On Site at the Open House
                </p>
                <div className="flex items-start gap-3 mb-4">
                  {LENDER.photo ? (
                    <Image
                      src={LENDER.photo}
                      alt={`${LENDER.name}, ${LENDER.title} at ${LENDER.company}`}
                      width={52}
                      height={52}
                      className="rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <Landmark className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    <p className="font-body font-bold text-primary">{LENDER.name}</p>
                    <p className="font-body text-xs text-muted">
                      {[LENDER.title, LENDER.company].filter(Boolean).join(" · ")}
                    </p>
                    {LENDER.nmls && (
                      <p className="font-body text-xs text-muted">
                        NMLS #{LENDER.nmls}
                        {LENDER.branchNmls ? ` · Branch NMLS #${LENDER.branchNmls}` : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Apply QR — the whole point of having him here. A buyer can
                    start the application from the living room without typing a
                    URL off a business card. */}
                {LENDER.applyQr && (
                  <a
                    href={LENDER.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white border border-border rounded p-4 mb-4 text-center hover:border-accent transition"
                  >
                    <Image
                      src={LENDER.applyQr}
                      alt={`QR code to start a mortgage application with ${LENDER.name} at ${LENDER.company}`}
                      width={160}
                      height={160}
                      className="mx-auto"
                      unoptimized
                    />
                    <p className="font-body text-sm font-bold text-primary mt-3">
                      Scan to Start Your Application
                    </p>
                    <p className="font-body text-xs text-muted mt-0.5">
                      Secure CMG Home Loans portal
                    </p>
                  </a>
                )}

                <p className="font-body text-sm text-body leading-relaxed mb-4">
                  Get pre-approved on the spot Sunday. Bring your questions on payment, down payment
                  assistance, and what you actually qualify for — no appointment needed.
                </p>
                {LENDER.phone && (
                  <a
                    href={`tel:+1${LENDER.phone.replace(/\D/g, "")}`}
                    className="flex items-center justify-center gap-2 bg-primary text-white font-bold px-4 py-2.5 rounded mb-2 hover:opacity-90 transition"
                  >
                    <Phone className="h-4 w-4" />
                    {LENDER.phone}
                  </a>
                )}
                {LENDER.email && (
                  <a
                    href={`mailto:${LENDER.email}?subject=${encodeURIComponent(`Pre-approval question — ${FULL_ADDRESS}`)}`}
                    className="flex items-center justify-center gap-2 border border-border px-4 py-2.5 rounded text-primary hover:bg-white transition"
                  >
                    <Mail className="h-4 w-4" />
                    Email {LENDER.name.split(" ")[0]}
                  </a>
                )}
              </div>

              <div id="schedule" className="bg-surface border border-border rounded p-6 scroll-mt-24">
                <ContactForm
                  webhookUrl="/api/contact"
                  source="/11417-cypress-park-st/"
                  type="showing"
                  title="Request a Showing"
                  submitLabel="Request Showing"
                  property={{
                    address: L.address,
                    city: L.city,
                    state: L.state,
                    price: L.price,
                    mlsNumber: L.mls,
                    url: "https://nowtb.com/11417-cypress-park-st/",
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
            Cul-de-Sac Homes in Carrollwood Go Fast
          </h2>
          <p className="font-body text-white/80 mb-7">
            Walk it Sunday between 2 and 4, or call and I'll set up a private showing.
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
              href="/tampa/"
              className="inline-flex items-center gap-2 border border-white/40 px-7 py-3 rounded hover:bg-white/10 transition"
            >
              More Tampa Homes
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Disclosure ---------- */}
      <section className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-body text-xs text-muted leading-relaxed">
            Listing courtesy of REMAX Collective. MLS {L.mls}. Open house hosted by Barrett Henry,
            Broker Associate, REMAX Collective. Information deemed reliable but not guaranteed —
            buyer and buyer&rsquo;s agent should independently verify all measurements, lot
            dimensions, flood zone, HOA fees, taxes, and school assignments. Equal Housing
            Opportunity.
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
