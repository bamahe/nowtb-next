// =============================================================================
// /30935-whitlock-dr — Single-property landing page for the QR code / sign
// rider. Data pulled from Stellar MLS TB8556541. Photos pulled from the listing
// feed and stored locally in /public/images/listings/30935-whitlock-dr/ so the
// page keeps working if the feed URL ever rotates.
//
// This is the destination the permanent printed QR codes currently point at —
// see the CURRENT OPEN HOUSE block at the top of next.config.mjs.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Bed, Bath, Ruler, Car, Trees, Home, CalendarDays, Navigation, ClipboardCheck, ShieldCheck } from "lucide-react";
import ContactForm from "@/components/ui/ContactForm";
import PhotoGallery from "@/components/ui/PhotoGallery";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

// --- Listing facts (Stellar MLS TB8556541) -----------------------------------
const L = {
  address: "30935 Whitlock Dr",
  city: "Wesley Chapel",
  state: "FL",
  zip: "33543",
  price: 274900,
  beds: 3,
  baths: 2,
  sqft: 1626,
  totalSqft: 2162,
  acres: 0.11,
  yearBuilt: 2004,
  garage: 2,
  mls: "TB8556541",
  status: "Active",
  lat: 28.174761,
  lng: -82.30456,
  taxes: 5550,
  cdd: 2160,
  hoaMonthly: 197,
  hoaAnnual2: 90,
  totalAnnualFees: 2454,
  subdivision: "Meadow Pointe III",
};

// Barrett's phone — defined once so it can never drift out of sync
const PHONE = "(813) 733-7907";
const PHONE_TEL = "8137337907";
const EMAIL = "barrett@nowtb.com";

const PRICE_FMT = `$${L.price.toLocaleString()}`;
const FULL_ADDRESS = `${L.address}, ${L.city}, ${L.state} ${L.zip}`;

// Open house details, straight off the two Stellar open house records
// (Oct 10 and Oct 11, 18:00–20:00 UTC = 2:00–4:00 PM Eastern). Update this one
// string when the next weekend is scheduled — the printed QR never changes.
const OPEN_HOUSE = "Saturday, October 10 & Sunday, October 11 · 2:00 – 4:00 PM";

// Unbranded Stellar virtual tour — fine to link publicly under IDX rules
const TOUR_URL = "https://www.propertypanorama.com/instaview/stellar/TB8556541";

// Lender joining the open house. Set to null when nobody is confirmed — every
// lender block on the page is wrapped in a check, so leaving it null simply
// removes the sidebar card and the kiosk's "want an intro?" question.
//
// To turn it back on, fill this object in (same shape the Cypress Park page
// used) and set LENDER_FIRST in sign-in/SignInKiosk.tsx to match:
//   { name, company, title, phone, email, nmls, branchNmls, photo, applyUrl, applyQr }
const LENDER: null | {
  name: string; company: string; title: string; phone: string; email: string;
  nmls: string; branchNmls: string; photo: string; applyUrl: string; applyQr: string;
} = null;

// Turn-by-turn navigation straight to the driveway. Uses lat/lng rather than the
// address string so the phone never geocodes it to the wrong end of the street.
// This universal Google Maps URL opens the native app on both iOS and Android.
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${L.lat}%2C${L.lng}`;

// --- Photos ------------------------------------------------------------------
// 35 images downloaded from the listing feed, in MLS display order:
// exteriors first, then interiors, then the lanai and the community amenities.
const PHOTO_COUNT = 35;
const photos = Array.from({ length: PHOTO_COUNT }, (_, i) => ({
  MediaURL: `/images/listings/30935-whitlock-dr/photo-${String(i + 1).padStart(3, "0")}.jpg`,
  ShortDescription: `${FULL_ADDRESS} — photo ${i + 1} of ${PHOTO_COUNT}`,
  Order: i,
}));

export const metadata: Metadata = {
  title: "30935 Whitlock Dr, Wesley Chapel FL 33543 | 3 Bed Villa | $274,900",
  description:
    `Gated 3 bed, 2 bath, 2 car garage villa backing to conservation in Meadow Pointe III. 1,626 sqft, single story, new AC 2025, HOA covers roof and lawn. MLS ${L.mls}. Call Barrett Henry at ${PHONE}.`,
  alternates: { canonical: "/30935-whitlock-dr/" },
  openGraph: {
    title: "Open House Sat & Sun 2p–4p — 30935 Whitlock Dr, Wesley Chapel FL",
    description:
      "Lock-and-leave 3 bed, 2 bath, 2 car garage villa in gated Meadow Pointe III, backing to conservation. New AC 2025, no carpet, screened lanai. Open house Saturday and Sunday, 2:00 to 4:00.",
    url: "/30935-whitlock-dr/",
    type: "website",
    images: [
      {
        url: "/images/listings/30935-whitlock-dr/og-open-house.jpg",
        width: 1200,
        height: 630,
        alt: "Open House Saturday and Sunday 2p to 4p — 30935 Whitlock Dr, Wesley Chapel FL, $274,900",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open House Sat & Sun 2p–4p — 30935 Whitlock Dr, Wesley Chapel FL",
    description: "Gated 3 bed, 2 bath, 2 car garage villa backing to conservation in Meadow Pointe III. $274,900.",
    images: ["/images/listings/30935-whitlock-dr/og-open-house.jpg"],
  },
};

// Quick-facts strip shown under the hero
const FACTS = [
  { icon: Bed, label: `${L.beds} Bedrooms` },
  { icon: Bath, label: `${L.baths} Full Baths` },
  { icon: Ruler, label: `${L.sqft.toLocaleString()} Sq Ft` },
  { icon: Car, label: `${L.garage} Car Garage` },
  { icon: Trees, label: "Conservation Lot" },
  { icon: Home, label: "Single Story Villa" },
];

const INTERIOR = [
  "Ceiling Fan(s)", "Owners Suite Main Floor", "Eating Space in Kitchen",
  "Breakfast Bar", "Solar Tube / Skylight", "Window Treatments & Blinds",
  "Ceramic Tile Throughout — No Carpet", "Fresh Neutral Paint",
  "Wood Cabinetry", "Gas Range", "Inside Laundry Closet",
];

const EXTERIOR = [
  "Covered Screened Lanai", "Front Porch", "Irrigation System", "Lighting",
  "Rain Gutters", "Private Mailbox", "Sliding Doors", "Mature Tropical Landscaping",
  "Fruit Trees", "Conservation Area Lot",
];

const APPLIANCES = [
  "Dryer", "Microwave", "Range (Gas)", "Refrigerator", "Washer",
];

// Recent big-ticket updates — the questions every buyer asks first
const UPDATES = [
  { item: "AC & gas furnace", year: "2025 — American Standard, 10 yr warranty" },
  { item: "Owners suite windows", year: "2025" },
  { item: "Interior paint", year: "Fresh neutral" },
  { item: "Roof & exterior paint", year: "Maintained by the HOA" },
];

// What the HOA actually covers — the whole argument for a villa at this price
const HOA_COVERS = [
  "Roof", "Exterior paint", "Lawn & grounds care", "Pest control",
  "Private road", "Gated entry", "Escrow reserves", "Management",
];

// Meadow Pointe III CDD clubhouse, about 3 minutes away
const AMENITIES = [
  "Resort-style pool", "Splash pad", "Fitness center", "Tennis courts",
  "Sand volleyball", "Playground", "Clubhouse", "Park",
];

const SCHOOLS = [
  { level: "Elementary", name: "Wiregrass Elementary" },
  { level: "Middle", name: "John Long Middle School" },
  { level: "High", name: "Wiregrass Ranch High School" },
];

const DETAILS = [
  { label: "Price", value: PRICE_FMT },
  { label: "MLS #", value: L.mls },
  { label: "Status", value: L.status },
  { label: "Property Type", value: "Villa (Attached Single Family)" },
  { label: "Style", value: "One Story · Florida" },
  { label: "Year Built", value: String(L.yearBuilt) },
  { label: "Living Area", value: `${L.sqft.toLocaleString()} sq ft (${L.totalSqft.toLocaleString()} sq ft total)` },
  { label: "Lot Size", value: `${L.acres} acres (${(4872).toLocaleString()} sq ft)` },
  { label: "Construction", value: "Block & Stucco" },
  { label: "Roof", value: "Shingle (maintained by HOA)" },
  { label: "Cooling / Heating", value: "Central Air (new 2025) / Central Natural Gas (new 2025)" },
  { label: "Flooring", value: "Ceramic Tile — no carpet" },
  { label: "Foundation", value: "Slab" },
  { label: "HOA", value: `$${L.hoaMonthly}/mo villa HOA + $${L.hoaAnnual2}/yr Meadow Pointe III ($${L.totalAnnualFees.toLocaleString()}/yr total)` },
  { label: "CDD Assessment", value: `$${L.cdd.toLocaleString()} per year (billed on the annual tax bill)` },
  { label: "Annual Taxes", value: `$${L.taxes.toLocaleString()} (2025, includes CDD)` },
  { label: "Flood Zone", value: "X" },
  { label: "Financing", value: "Cash, Conventional, FHA, VA" },
  { label: "Minimum Lease", value: "1–2 years · pets allowed" },
  { label: "Subdivision", value: "Meadow Pointe III, Phase 1 Unit 1C-2" },
  { label: "County", value: "Pasco" },
];

export default function WhitlockListingPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SingleFamilyResidence",
          name: FULL_ADDRESS,
          description:
            "Single story 3 bedroom, 2 bath, 2 car garage villa backing to conservation in the gated Whitlock enclave of Meadow Pointe III, Wesley Chapel FL.",
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
          { name: "Wesley Chapel", url: "/wesley-chapel/" },
          { name: FULL_ADDRESS, url: "/30935-whitlock-dr/" },
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
              href="/30935-whitlock-dr/sign-in/"
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
              What Makes This Meadow Pointe Villa Different?
            </h2>

            <div className="space-y-4 font-body text-base leading-relaxed text-body">
              <p>
                This one is behind the gate in the Whitlock villa enclave, tucked against protected
                conservation land and ringed by ponds — so the view out back is trees, not a
                neighbor&rsquo;s window. That is the part you feel first. The second is the fee
                structure: the HOA handles the roof, the exterior paint, the lawn and grounds, and
                pest control, which means your weekends belong to you and the two biggest surprise
                expenses in Florida homeownership are not yours to carry.
              </p>
              <p>
                Inside, {L.sqft.toLocaleString()} square feet runs on ceramic tile end to end — no
                carpet anywhere — under fresh neutral paint, ceiling fans, and a solar tube that drops
                daylight into the middle of the floorplan. The kitchen keeps rich wood cabinetry with
                a gas range, a breakfast bar, and a real eat-in space, so it works for a weeknight
                dinner and for everyone standing around it on a holiday. The owners suite sits on the
                main floor with new windows installed in 2025.
              </p>
              <p>
                Big-ticket items are already handled and documented: a new American Standard air
                conditioner with a natural gas furnace went in during 2025, carrying a 10-year
                extended warranty that transfers the worry off your plate. Out back, the covered and
                screened lanai looks over a private yard with mature tropical landscaping and fruit
                trees. There is a full 2-car attached garage, and the refrigerator, washer, and dryer
                all stay. Flood Zone X.
              </p>
            </div>

            {/* HOA coverage — the single biggest selling point, called out */}
            <h2 className="font-heading text-2xl font-light uppercase tracking-wide text-primary mt-10 mb-5">
              What Does the HOA Actually Cover?
            </h2>
            <div className="bg-surface border border-border rounded p-6">
              <p className="font-body text-base text-body leading-relaxed mb-4">
                The villa HOA runs ${L.hoaMonthly} a month, plus a ${L.hoaAnnual2} annual Meadow
                Pointe III master association fee — ${L.totalAnnualFees.toLocaleString()} a year all
                in. For that, these items stop being your problem:
              </p>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {HOA_COVERS.map((h) => (
                  <li key={h} className="font-body text-sm text-body flex gap-2 items-start">
                    <ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
              <p className="font-body text-xs text-muted mt-4 leading-relaxed">
                A CDD assessment of ${L.cdd.toLocaleString()} per year is billed on the annual Pasco
                County tax bill and funds the community infrastructure and the amenity center. Verify
                all fees and what they include with Wise Property Management before closing.
              </p>
            </div>

            {/* Recent updates */}
            <h2 className="font-heading text-2xl font-light uppercase tracking-wide text-primary mt-10 mb-5">
              What Has Already Been Updated?
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {UPDATES.map((u) => (
                <div key={u.item} className="flex justify-between gap-4 bg-surface border border-border rounded px-4 py-3">
                  <span className="font-body text-sm text-body shrink-0">{u.item}</span>
                  <span className="font-body text-sm font-bold text-primary text-right">{u.year}</span>
                </div>
              ))}
            </div>

            {/* Neighborhood */}
            <h2 className="font-heading text-2xl font-light uppercase tracking-wide text-primary mt-10 mb-5">
              What Is It Like Living in Meadow Pointe III?
            </h2>
            <div className="space-y-4 font-body text-base leading-relaxed text-body">
              <p>
                Meadow Pointe III is one of the established master-planned communities that made
                Wesley Chapel what it is, and the CDD amenity center is about three minutes from this
                front door. That gets you a resort-style pool, a splash pad, a fitness center, tennis
                courts, sand volleyball, a playground, and the clubhouse — the kind of amenity package
                that is normally priced into a much higher monthly fee somewhere else.
              </p>
              <p>
                Everyday life is short drives. The Shops at Wiregrass, AdventHealth Wesley Chapel, and
                the full SR 56 corridor of restaurants and grocery stores are all minutes away, and
                I-75 puts downtown Tampa around thirty-five minutes out and Tampa International under
                forty-five. The home is zoned for Wiregrass Elementary, John Long Middle, and Wiregrass
                Ranch High School.
              </p>
            </div>

            {/* Amenities */}
            <h2 className="font-heading text-2xl font-light uppercase tracking-wide text-primary mt-10 mb-5">
              Community Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AMENITIES.map((a) => (
                <div key={a} className="bg-surface border border-border rounded px-4 py-3">
                  <p className="font-body text-sm text-primary">{a}</p>
                </div>
              ))}
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
              School zoning is subject to change. Confirm current boundaries with Pasco County
              Schools before making a decision based on assignment.
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

            <p className="font-body text-sm text-body mt-6">
              Can&rsquo;t make it out this weekend?{" "}
              <a
                href={TOUR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold underline underline-offset-2 hover:text-accent"
              >
                Walk the virtual tour
              </a>{" "}
              or{" "}
              <Link href="/wesley-chapel/" className="text-primary font-bold underline underline-offset-2 hover:text-accent">
                see more Wesley Chapel homes
              </Link>
              .
            </p>
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
                    src="/images/listings/30935-whitlock-dr/barrett-henry-vcard-qr.png"
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
                  23+ years of real estate experience. Text or call anytime — I answer my own phone.
                </p>
              </div>

              {/* Lender on site — only renders when one is confirmed */}
              {LENDER && (
                <div className="bg-surface border border-border rounded p-6">
                  <p className="font-body text-xs uppercase tracking-wide text-muted mb-2">
                    Lender On Site at the Open House
                  </p>
                  <div className="flex items-start gap-3 mb-4">
                    <Image
                      src={LENDER.photo}
                      alt={`${LENDER.name}, ${LENDER.title} at ${LENDER.company}`}
                      width={52}
                      height={52}
                      className="rounded-full object-cover shrink-0"
                    />
                    <div>
                      <p className="font-body font-bold text-primary">{LENDER.name}</p>
                      <p className="font-body text-xs text-muted">
                        {[LENDER.title, LENDER.company].filter(Boolean).join(" · ")}
                      </p>
                      <p className="font-body text-xs text-muted">
                        NMLS #{LENDER.nmls}
                        {LENDER.branchNmls ? ` · Branch NMLS #${LENDER.branchNmls}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Apply QR — a buyer can start the application from the
                      living room without typing a URL off a business card. */}
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
                  </a>

                  <a
                    href={`tel:+1${LENDER.phone.replace(/\D/g, "")}`}
                    className="flex items-center justify-center gap-2 bg-primary text-white font-bold px-4 py-2.5 rounded mb-2 hover:opacity-90 transition"
                  >
                    <Phone className="h-4 w-4" />
                    {LENDER.phone}
                  </a>
                  <a
                    href={`mailto:${LENDER.email}?subject=${encodeURIComponent(`Pre-approval question — ${FULL_ADDRESS}`)}`}
                    className="flex items-center justify-center gap-2 border border-border px-4 py-2.5 rounded text-primary hover:bg-white transition"
                  >
                    <Mail className="h-4 w-4" />
                    Email {LENDER.name.split(" ")[0]}
                  </a>
                </div>
              )}

              <div id="schedule" className="bg-surface border border-border rounded p-6 scroll-mt-24">
                <ContactForm
                  webhookUrl="/api/contact"
                  source="/30935-whitlock-dr/"
                  type="showing"
                  title="Request a Showing"
                  submitLabel="Request Showing"
                  property={{
                    address: L.address,
                    city: L.city,
                    state: L.state,
                    price: L.price,
                    mlsNumber: L.mls,
                    url: "https://nowtb.com/30935-whitlock-dr/",
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
            Under $275K Behind a Gate in Wesley Chapel
          </h2>
          <p className="font-body text-white/80 mb-7">
            Walk it Saturday or Sunday between 2 and 4, or call and I&rsquo;ll open it up for you on
            your schedule.
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
              href="/wesley-chapel/"
              className="inline-flex items-center gap-2 border border-white/40 px-7 py-3 rounded hover:bg-white/10 transition"
            >
              More Wesley Chapel Homes
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
            dimensions, flood zone, HOA and CDD fees, taxes, lease restrictions, and school
            assignments. Equal Housing Opportunity.
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
