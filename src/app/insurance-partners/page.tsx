// =============================================================================
// /insurance-partners — Tampa Bay Insurance Partners Resource Directory
// Independent agencies that shop multiple carriers for homeowners, flood, auto
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tampa Bay Insurance Partners | Homeowners, Flood & Auto | Barrett Henry",
  description:
    "Trusted independent insurance agencies across all 8 Tampa Bay counties. Homeowners, flood, and auto coverage — agents who shop multiple carriers for the best rate. Recommended by Barrett Henry, REALTOR®.",
  alternates: { canonical: "/insurance-partners/" },
  openGraph: {
    title: "Tampa Bay Insurance Partners Directory",
    description: "Independent agencies across 8 counties that shop multiple carriers for homeowners, flood, and auto.",
    url: "/insurance-partners/",
    type: "website",
  },
};

// Insurance partner data organized by county
const COUNTIES = [
  {
    name: "Hillsborough County",
    partners: [
      { name: "Southshore Insurance Professionals", location: "Riverview, FL", phone: "813-448-7580", rating: "5.0", reviews: "476", description: "A Riverview independent agency known for treating clients like neighbors, not policy numbers. They shop multiple carriers for the best rate, do proactive renewal check-ins to keep premiums in line, and handle homeowners and business coverage with fast, personal service." },
      { name: "Runnels Insurance", location: "Brandon, FL", phone: "813-653-0681", rating: "4.9", reviews: "368", description: "A longtime Brandon independent agency that consistently saves clients money by comparing home, auto, flood, and umbrella options side by side. Clients praise their patience with first-time buyers and their willingness to fight on claims." },
      { name: "L&M Insurance Group", location: "Riverview, FL", phone: "813-672-4100", rating: "4.8", reviews: "235", description: "A Riverview team that makes Florida homeowners insurance simple, especially for buyers new to the process. They respond fast, walk you through every option, and are used to hitting tight closing timelines." },
      { name: "Brandon Insurance", location: "Brandon, FL", phone: "813-681-1832", rating: "4.9", reviews: "72", description: "A local Brandon broker that shops home and auto to find the strongest coverage for the price. Clients highlight clear communication, honest guidance, and a broker who answers questions instead of just quoting." },
      { name: "Seibert Insurance Agency", location: "Tampa, FL", phone: "813-960-4672", rating: "5.0", reviews: "588", description: "A top-rated Tampa independent agency where you keep the same agent instead of a call-center lottery. They compare carriers on home and auto, and real estate pros regularly send buyers their way for smooth, deadline-friendly service." },
      { name: "Cornerstone Insurance", location: "Odessa / North Tampa, FL", phone: "813-920-8181", rating: "4.9", reviews: "615", description: "A North Tampa independent agency that shines when it counts, including placing coverage fast after a non-renewal. Clients get quick responses, clear help with four-point inspections, and competitive home, flood, and auto rates." },
    ],
  },
  {
    name: "Pinellas County",
    partners: [
      { name: "HH Insurance Group", location: "St. Petersburg, FL", phone: "727-498-5551", rating: "5.0", reviews: "2,371", description: "One of the highest-reviewed agencies in the entire bay area, with a deep bench for homeowners and flood. Buyers praise clear coverage explanations, strong follow-up, and an easy, low-stress process from quote to bind." },
      { name: "Insurance Resources", location: "St. Petersburg, FL", phone: "727-345-0242", rating: "4.9", reviews: "255", description: "A St. Pete independent agency families have trusted for decades on home and auto. Known for patient, responsive agents who take time to explain coverage and consistently find real savings." },
      { name: "Island Insurance Specialists", location: "Clearwater, FL", phone: "727-754-5036", rating: "5.0", reviews: "202", description: "A Clearwater agency that shops multiple carriers to secure the best homeowners coverage and rate, then explains every step. A strong option for North Pinellas and coastal buyers navigating a tough market." },
      { name: "Coleman Insurance Agency", location: "Palm Harbor, FL", phone: "727-441-9911", rating: "4.9", reviews: "422", description: "A Palm Harbor independent agency that turns quotes around fast, even when buyers have several properties under contract. Responsive, thorough service on auto, home, and renters, tuned to relocation and closing timelines." },
    ],
  },
  {
    name: "Pasco County",
    partners: [
      { name: "Paradise Insurance Services (Kness & Associates)", location: "New Port Richey, FL", phone: "727-233-2012", rating: "4.9", reviews: "267", description: "A New Port Richey agency that shines at placing hard-to-insure homes, including properties with prior claims. Clients value how they educate you through every step so you can make the best decision." },
      { name: "Family First Insurance Services", location: "Wesley Chapel, FL", phone: "813-994-3900", rating: "4.9", reviews: "83", description: "A Wesley Chapel independent agency praised for lowering premiums while keeping the coverage clients actually need. Quick to respond, detail-oriented, and easy to work with on home and auto." },
      { name: "Brightway Insurance, The Torres-Grubbs Agency", location: "New Port Richey, FL", phone: "727-315-0707", rating: "4.9", reviews: "62", description: "A New Port Richey team that shops homeowners and flood side by side to find real savings. Clients get several quotes in minutes and a staff that takes time to sit down and explain them." },
    ],
  },
  {
    name: "Polk County",
    partners: [
      { name: "Garland Insurance, Inc.", location: "Lakeland, FL", phone: "863-683-9334", rating: "4.8", reviews: "545", description: "One of Lakeland's most-reviewed independent agencies, strong on both home and commercial coverage. Fast quotes, clear communication, and a professional, personable process buyers consistently recommend." },
      { name: "Headley Insurance Agency", location: "Lakeland, FL", phone: "863-701-7411", rating: "4.9", reviews: "221", description: "A Lakeland agency that finds the best policy for the best cost and deals with the carriers directly on your behalf. Clients love the quick turnaround and reliable service on home and auto." },
      { name: "Lock Insurance (A Division of World)", location: "Lakeland, FL", phone: "863-646-4300", rating: "4.7", reviews: "442", description: "A Lakeland team that walks new Florida homeowners through every insurance type and pulls quotes from multiple carriers. Patient, responsive, and good at explaining the pros and cons of each option." },
    ],
  },
  {
    name: "Manatee County",
    partners: [
      { name: "Trout & Leigh Insurance, Inc.", location: "Bradenton, FL", phone: "941-748-1641", rating: "5.0", reviews: "274", description: "A Bradenton mainstay families have trusted for decades on home and auto. Knowledgeable agents who explain coverage clearly and look out for your best interest instead of just selling a policy." },
      { name: "Insurance Time of Bradenton, Inc.", location: "Bradenton, FL", phone: "941-746-5151", rating: "4.9", reviews: "328", description: "A Bradenton one-stop shop for home, flood, and auto that responds within minutes, even by email. They compare policies for you and explain each one in detail before you decide." },
      { name: "Florida Homeowners Insurance Center", location: "Bradenton / Lakewood Ranch, FL", phone: "941-756-5100", rating: "5.0", reviews: "126", description: "A homeowners-focused agency that makes finding coverage simple and pain-free. Clients highlight better coverage at great rates and a team that handles everything in a timely, professional way." },
    ],
  },
  {
    name: "Sarasota County",
    partners: [
      { name: "Dees Insurance Group", location: "Sarasota, FL", phone: "941-306-4524", rating: "4.9", reviews: "934", description: "One of the highest-reviewed agencies on the Gulf coast, frequently recommended by Realtors for new home purchases. Diligent agents who find the best rate and the right coverage, often saving clients over a thousand dollars a year." },
      { name: "Insurance Service of Sarasota, Inc.", location: "Osprey, FL", phone: "941-966-5606", rating: "5.0", reviews: "114", description: "A Sarasota-area agency that makes first-time and out-of-state home purchases easy and streamlined. They shop multiple carriers and consistently come back with lower rates than the competition." },
      { name: "The Peeples Insurance Agency", location: "Sarasota, FL", phone: "941-377-7654", rating: "4.8", reviews: "287", description: "A Sarasota independent agency that thrives under tight closing windows and big renewal increases. Prompt, friendly, and used to working with Realtors and their clients to secure affordable homeowners coverage." },
    ],
  },
  {
    name: "Hernando County",
    partners: [
      { name: "Advantage Insurance", location: "Spring Hill, FL", phone: "352-688-1518", rating: "4.9", reviews: "407", description: "A highly-reviewed Spring Hill agency strong on home, flood, and auto. Responsive agents who make sure clients understand their coverage and never give up on tough flood or hurricane-season placements." },
      { name: "ISU Bauknight Insurance", location: "Spring Hill, FL", phone: "352-686-0612", rating: "4.8", reviews: "240", description: "A Spring Hill agency that does the legwork for you, comparing carriers to find the best rate and acting as your liaison for renewals and changes. New residents get insured quickly at reasonable rates." },
    ],
  },
  {
    name: "Citrus County",
    partners: [
      { name: "The Hagar Group", location: "Inverness, FL", phone: "352-726-1691", rating: "4.3", reviews: "99", description: "Widely regarded as one of the best agencies in Citrus County for comparing homeowners rates so you don't have to. A go-to for first-time buyers, with same-day coverage and clear, patient answers." },
      { name: "Nature Coast Insurance Agency", location: "Inverness, FL", phone: "352-341-0040", rating: "4.6", reviews: "38", description: "A friendly Nature Coast independent agency that responds fast and goes to bat for clients at claim time. Fair quotes and knowledgeable agents who make homeowners coverage easy to understand." },
    ],
  },
];

export default function InsurancePartnersPage() {
  return (
    <>
      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nowtb.com" },
              { "@type": "ListItem", position: 2, name: "Insurance Partners", item: "https://nowtb.com/insurance-partners" },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-primary pt-32 pb-16">
        <div className="container-wide text-center">
          <p className="heading-label text-accent mb-4">Resource Directory</p>
          <h1 className="heading-display text-display md:text-display-lg text-white mb-4">
            Tampa Bay Insurance Partners
          </h1>
          <div className="section-divider" />
          <p className="font-body text-white/70 text-lg max-w-2xl mx-auto">
            Independent agencies that shop multiple carriers for homeowners, flood, and auto
            across all 8 counties The NOW Team serves. Google ratings shown are current and subject to change.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark">
          <p>
            Florida insurance is complicated — and expensive. The agencies listed below are
            independent brokers Barrett Henry has vetted and recommends to his buyers and sellers.
            They shop multiple carriers to find the best rate and coverage, and they&apos;re used to
            working on tight real estate closing timelines.
          </p>
          <p>
            <strong>Why independent?</strong> Unlike captive agents who sell one company&apos;s
            products, independent agencies compare quotes from dozens of carriers. In Florida&apos;s
            volatile insurance market, that flexibility matters — especially for homeowners,
            flood zones, and older roofs.
          </p>
        </div>
      </section>

      {/* County sections */}
      {COUNTIES.map((county) => (
        <section key={county.name} className="container-wide py-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6 border-b border-gray-200 pb-3">
            {county.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {county.partners.map((partner) => (
              <div key={partner.name} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-primary">{partner.name}</h3>
                    <p className="font-body text-muted text-sm">{partner.location}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-heading font-bold text-accent text-lg">★ {partner.rating}</p>
                    <p className="font-body text-muted text-xs">({partner.reviews} reviews)</p>
                  </div>
                </div>
                <p className="font-body text-dark text-sm leading-relaxed mb-4">{partner.description}</p>
                <a
                  href={`tel:${partner.phone.replace(/[^0-9]/g, "")}`}
                  className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                >
                  📞 {partner.phone}
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container-wide text-center max-w-2xl">
          <h2 className="font-heading font-bold text-2xl text-white mb-4">
            Need Help Finding the Right Insurance?
          </h2>
          <p className="font-body text-white/70 mb-6">
            Barrett Henry coordinates insurance quotes as part of every home purchase.
            Tell him your situation and he&apos;ll connect you with the right agency for your county and property type.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+18137337907"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg text-sm"
            >
              Call (813) 733-7907
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-6 py-3 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>

      {/* Related resources */}
      <section className="container-wide py-12">
        <h2 className="font-heading font-bold text-xl text-primary mb-6 text-center">Related Resources</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <Link href="/guides/florida-flood-insurance-guide/" className="card p-4 text-center hover:shadow-lg transition-shadow">
            <p className="font-heading font-bold text-sm text-primary">Flood Insurance Guide</p>
          </Link>
          <Link href="/guides/florida-property-insurance-guide/" className="card p-4 text-center hover:shadow-lg transition-shadow">
            <p className="font-heading font-bold text-sm text-primary">Property Insurance Guide</p>
          </Link>
          <Link href="/guides/florida-homestead-exemption-save-our-homes/" className="card p-4 text-center hover:shadow-lg transition-shadow">
            <p className="font-heading font-bold text-sm text-primary">Homestead Exemption</p>
          </Link>
          <Link href="/buyers/" className="card p-4 text-center hover:shadow-lg transition-shadow">
            <p className="font-heading font-bold text-sm text-primary">Buyer Resources</p>
          </Link>
        </div>
      </section>
    </>
  );
}
