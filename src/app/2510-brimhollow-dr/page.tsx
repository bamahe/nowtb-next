// =============================================================================
// /2510-brimhollow-dr — Single-property landing page for the QR code / sign
// rider. Data pulled from Stellar MLS TB8558255. Photos pulled from the listing
// feed and stored locally in /public/images/listings/2510-brimhollow-dr/ so the
// page keeps working if the feed URL ever rotates.
//
// This is the destination the permanent printed QR codes currently point at —
// see the CURRENT OPEN HOUSE block at the top of next.config.mjs.
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Bed, Bath, Ruler, Car, Waves, Home, CalendarDays, Navigation, ClipboardCheck } from "lucide-react";
import ContactForm from "@/components/ui/ContactForm";
import PhotoGallery from "@/components/ui/PhotoGallery";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

// --- Listing facts (Stellar MLS TB8558255) -----------------------------------
// Barrett's own listing, so this page says "listed by", not "hosted by".
const L = {
  address: "2510 Brimhollow Dr",
  city: "Valrico",
  state: "FL",
  zip: "33596",
  price: 479900,
  beds: 3,
  baths: 2,
  halfBaths: 1,
  sqft: 2280,
  acres: 0.19,
  yearBuilt: 1987,
  // The MLS record has GarageSpaces: 0 while GarageYN and AttachedGarageYN are
  // both true and the listing remarks say "two car garage". That is a data
  // entry slip in the feed, not a house without a garage — 2 is correct.
  garage: 2,
  mls: "TB8558255",
  status: "Active",
  lat: 27.898605,
  lng: -82.238704,
  taxes: 8044,
  hoaAnnual: 30,
  subdivision: "Buckhorn",
};

// Barrett's phone — defined once so it can never drift out of sync
const PHONE = "(813) 733-7907";
const PHONE_TEL = "8137337907";
const EMAIL = "barrett@nowtb.com";

const PRICE_FMT = `$${L.price.toLocaleString()}`;
const FULL_ADDRESS = `${L.address}, ${L.city}, ${L.state} ${L.zip}`;

// Sunday only this time. Update this one string when the next date is
// scheduled — the printed QR never changes.
const OPEN_HOUSE = "Sunday, October 18 · 2:00 - 4:00 PM";

// Unbranded Stellar virtual tour — fine to link publicly under IDX rules
const TOUR_URL = "https://www.propertypanorama.com/instaview/stellar/TB8558255";

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
// 25 images downloaded from the listing feed, in MLS display order:
// exteriors first, then interiors, then the lanai and pool.
const PHOTO_COUNT = 25;
const photos = Array.from({ length: PHOTO_COUNT }, (_, i) => ({
  MediaURL: `/images/listings/2510-brimhollow-dr/photo-${String(i + 1).padStart(3, "0")}.jpg`,
  ShortDescription: `${FULL_ADDRESS} — photo ${i + 1} of ${PHOTO_COUNT}`,
  Order: i,
}));

export const metadata: Metadata = {
  title: "2510 Brimhollow Dr, Valrico FL 33596 | Buckhorn Pool Home | $479,900",
  description:
    `Buckhorn pool home with 3 bedrooms, 2.5 baths, 2 car garage and a private office. 2,280 sqft single story, screened lanai, wood burning fireplace, optional $30/yr HOA. MLS ${L.mls}. Call Barrett Henry at ${PHONE}.`,
  alternates: { canonical: "/2510-brimhollow-dr/" },
  openGraph: {
    title: "Open House Sunday 2 to 4 — 2510 Brimhollow Dr, Valrico FL",
    description:
      "Buckhorn pool home. 3 bedrooms, 2.5 baths, 2 car garage, private office, and a screened lanai around an in-ground pool. 2,280 sqft on one floor. Open house Sunday, 2:00 to 4:00.",
    url: "/2510-brimhollow-dr/",
    type: "website",
    images: [
      {
        url: "/images/listings/2510-brimhollow-dr/og-open-house.jpg",
        width: 1200,
        height: 630,
        alt: "Open House Sunday 2 to 4 — 2510 Brimhollow Dr, Valrico FL, $479,900",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open House Sunday 2 to 4 — 2510 Brimhollow Dr, Valrico FL",
    description: "Buckhorn pool home. 3 bed, 2.5 bath, 2 car garage, private office, screened lanai. $479,900.",
    images: ["/images/listings/2510-brimhollow-dr/og-open-house.jpg"],
  },
};

// Quick-facts strip shown under the hero
const FACTS = [
  { icon: Bed, label: `${L.beds} Bedrooms` },
  { icon: Bath, label: `${L.baths}.5 Baths` },
  { icon: Ruler, label: `${L.sqft.toLocaleString()} Sq Ft` },
  { icon: Car, label: `${L.garage} Car Garage` },
  { icon: Waves, label: "In-Ground Pool" },
  { icon: Home, label: "Single Story" },
];

const INTERIOR = [
  "Owners Suite Main Floor", "Split Bedroom Plan", "Private Office",
  "Formal Living & Dining Rooms", "Wood Burning Fireplace", "Crown Molding",
  "Solid Wood Cabinets", "Solid Surface Counters", "Eating Space in Kitchen",
  "Walk-In Closet(s)", "Remodeled Owners Bath with Tiled Shower",
  "Ceiling Fan(s)", "Window Treatments",
];

const EXTERIOR = [
  "Screened Lanai & Tiled Pool Deck", "Three Sets of Sliding Doors",
  "Double Pane Windows", "Hurricane Shutters", "Fenced Yard",
  "Irrigation System", "Rain Gutters", "Private Mailbox", "Sidewalk",
  "Mature Trees", "Near Buckhorn Springs Golf & Country Club",
];

const APPLIANCES = [
  "Dishwasher", "Disposal", "Dryer", "Electric Water Heater",
  "Exhaust Fan", "Microwave", "Range", "Washer", "Water Softener",
];

// The pool, which is the reason most people come to this one
const POOL = [
  "In-Ground", "Screen Enclosure", "Tiled Deck",
  "Covered Lanai", "Outside Bath Access",
];

const SCHOOLS = [
  { level: "Elementary", name: "Buckhorn Elementary School" },
  { level: "Middle", name: "Mulrennan Middle School" },
  { level: "High", name: "Durant High School" },
];

const DETAILS = [
  { label: "Price", value: PRICE_FMT },
  { label: "MLS #", value: L.mls },
  { label: "Status", value: L.status },
  { label: "Property Type", value: "Single Family Residence" },
  { label: "Style", value: "One Story" },
  { label: "Year Built", value: String(L.yearBuilt) },
  { label: "Living Area", value: `${L.sqft.toLocaleString()} sq ft` },
  { label: "Lot Size", value: `${L.acres} acres (8,250 sq ft, 75 x 110)` },
  { label: "Pool", value: "In-ground, screen enclosed, tiled deck" },
  { label: "Construction", value: "Brick & Wood Frame" },
  { label: "Roof", value: "Shingle" },
  { label: "Cooling / Heating", value: "Central Air / Central Heat Pump" },
  { label: "Windows", value: "Double pane, plus hurricane shutters" },
  { label: "Foundation", value: "Slab" },
  { label: "HOA", value: `Optional, $${L.hoaAnnual} per year` },
  { label: "Annual Taxes", value: `$${L.taxes.toLocaleString()} (2025)` },
  { label: "Flood Zone", value: "X" },
  { label: "Financing", value: "Cash, Conventional, FHA, VA" },
  { label: "Subdivision", value: "Buckhorn" },
  { label: "County", value: "Hillsborough" },
];

export default function BrimhollowListingPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SingleFamilyResidence",
          name: FULL_ADDRESS,
          description:
            "Single story 3 bedroom, 2.5 bath, 2 car garage pool home with a private office in Buckhorn, Valrico FL.",
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
          { name: "Valrico", url: "/valrico/" },
          { name: FULL_ADDRESS, url: "/2510-brimhollow-dr/" },
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
              href="/2510-brimhollow-dr/sign-in/"
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
              What Makes This Buckhorn Pool Home Different?
            </h2>

            <div className="space-y-4 font-body text-base leading-relaxed text-body">
              <p>
                Three sets of sliding doors open onto the lanai, and that is the whole idea of this
                house. The screened enclosure wraps a tiled deck and an in-ground pool, with a bath
                you can reach from outside so nobody tracks through the living room. Buckhorn is an
                established neighborhood with real trees and sidewalks, and homes here are not
                stacked on top of each other &mdash; this one sits on a {L.acres} acre lot, 75 by 110,
                with a fenced yard.
              </p>
              <p>
                Inside, {L.sqft.toLocaleString()} square feet is laid out the way people actually
                live rather than as one open box. There is a formal living room and a separate dining
                room, a family room with a wood burning fireplace, and a private office that is a
                real room with a door &mdash; not a corner of a bedroom. The split plan puts the
                owners suite on its own side with a walk-in closet and a remodeled bath with a tiled
                shower, and the two secondary bedrooms on the other. Wood, vinyl, and tile run
                throughout.
              </p>
              <p>
                The kitchen keeps solid wood cabinets and solid surface counters with room to eat in.
                On the practical side: double pane windows and hurricane shutters, which is what
                keeps the power bill and the storm prep manageable, plus a water softener, irrigation,
                and a 2 car garage. The washer and dryer stay. The HOA is optional and runs
                ${L.hoaAnnual} a year, so there is no association telling you what color to paint the
                door. Flood Zone X.
              </p>
            </div>

            {/* Pool — the reason most people come to this one */}
            <h2 className="font-heading text-2xl font-light uppercase tracking-wide text-primary mt-10 mb-5">
              Tell Me About the Pool
            </h2>
            <div className="bg-surface border border-border rounded p-6">
              <p className="font-body text-base text-body leading-relaxed mb-4">
                In-ground, screen enclosed, with a tiled deck and a covered lanai for the hours when
                you want to be outside but not in the sun. The screen is what makes it usable in
                August instead of a mosquito problem.
              </p>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {POOL.map((f) => (
                  <li key={f} className="font-body text-sm text-body flex gap-2 items-start">
                    <Waves className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Neighborhood */}
            <h2 className="font-heading text-2xl font-light uppercase tracking-wide text-primary mt-10 mb-5">
              What Is It Like Living in Buckhorn?
            </h2>
            <div className="space-y-4 font-body text-base leading-relaxed text-body">
              <p>
                Buckhorn is one of the older established pockets of Valrico, which is why the trees
                are mature and the lots are a real size. Buckhorn Springs Golf &amp; Country Club is
                right there if you play, and the neighborhood has sidewalks and the kind of street
                layout that does not funnel cut-through traffic past your driveway.
              </p>
              <p>
                Errands are short. Publix is about four minutes out and the Bloomingdale Library is
                about five. I-75 is roughly ten minutes, HCA Florida Brandon Hospital about eleven,
                and Westfield Brandon fifteen. Downtown Tampa runs around thirty minutes depending on
                the hour. The home is zoned for Buckhorn Elementary, Mulrennan Middle, and Durant
                High School.
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
              School zoning is subject to change. Confirm current boundaries with Hillsborough County
              Public Schools before making a decision based on assignment.
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
              <Link href="/valrico/" className="text-primary font-bold underline underline-offset-2 hover:text-accent">
                see more Valrico homes
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
                  {L.beds} bd &middot; {L.baths}.5 ba &middot; {L.sqft.toLocaleString()} sqft
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/images/barrett-headshot.png"
                    alt="Barrett Henry, Licensed Florida Real Estate Broker at REMAX Collective"
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-body font-bold">Barrett Henry</p>
                    <p className="font-body text-xs text-white/70">
                      Licensed FL Real Estate Broker, REMAX Collective
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
                    src="/images/listings/2510-brimhollow-dr/barrett-henry-vcard-qr.png"
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
                  23 years licensed. Text or call anytime — I answer my own phone.
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
                  source="/2510-brimhollow-dr/"
                  type="showing"
                  title="Request a Showing"
                  submitLabel="Request Showing"
                  property={{
                    address: L.address,
                    city: L.city,
                    state: L.state,
                    price: L.price,
                    mlsNumber: L.mls,
                    url: "https://nowtb.com/2510-brimhollow-dr/",
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
            Pool Homes in Buckhorn Do Not Sit Long
          </h2>
          <p className="font-body text-white/80 mb-7">
            Walk it Sunday between 2 and 4, or call and I&rsquo;ll open it up for you on your
            schedule.
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
            Listed by Barrett Henry, Licensed Florida Real Estate Broker, REMAX Collective.
            MLS {L.mls}. Information deemed reliable but not guaranteed &mdash; buyer and
            buyer&rsquo;s agent should independently verify all measurements, lot dimensions, flood
            zone, HOA fees, taxes, pool equipment, and school assignments. Equal Housing
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
