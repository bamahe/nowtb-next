// =============================================================================
// /inspectors — Home inspectors in Tampa Bay: why inspections matter,
// types of inspections, what to expect, and Barrett's inspector network
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";

// --- SEO metadata — keyword-first title, CTA in description ---
export const metadata: Metadata = {
  title: "Home Inspectors Tampa Bay | Trusted Referrals | Barrett Henry",
  description:
    "Find a trusted home inspector in Tampa Bay. Barrett Henry connects buyers and sellers with experienced inspectors for general, 4-point, wind mitigation, and WDO inspections. Call (813) 733-7907.",
  alternates: {
    canonical: "/inspectors",
  },
};

// --- FAQ data used in both the rendered section and JSON-LD schema ---
const faqs = [
  {
    question: "How much does a home inspection cost in Tampa Bay?",
    answer:
      "A standard home inspection in Tampa Bay typically costs between $350 and $600, depending on the size and age of the home. Specialty inspections like wind mitigation, 4-point, or WDO reports are usually $75 to $175 each, and many inspectors offer package pricing when you bundle multiple reports together.",
  },
  {
    question: "How long does a home inspection take?",
    answer:
      "Most home inspections take two to four hours for an average-sized single-family home. Larger properties, older homes, or homes with pools, detached structures, or septic systems may take longer. Your inspector will walk through findings with you at the end, so plan to be on-site for the full appointment.",
  },
  {
    question: "Can a seller refuse to make repairs after the inspection?",
    answer:
      "Yes. In Florida, there is no legal requirement for sellers to make repairs. However, buyers can negotiate repair credits, ask the seller to fix specific items, request a price reduction, or exercise their inspection contingency and walk away from the contract. Barrett helps buyers navigate these negotiations strategically.",
  },
  {
    question: "Do I need a 4-point inspection and wind mitigation report?",
    answer:
      "Most Florida insurance companies require a 4-point inspection for homes older than 20 to 25 years. A wind mitigation report is not always required, but it documents hurricane-resistant features that can earn significant insurance discounts. Both are well worth the small investment.",
  },
  {
    question: "Should I attend the home inspection?",
    answer:
      "Absolutely. Walking through the inspection with your inspector is one of the most valuable parts of the home-buying process. You will learn how the major systems work, see any concerns firsthand, and have the chance to ask questions in real time. Barrett encourages every buyer to attend.",
  },
];

export default function InspectorsPage() {
  return (
    <>
      {/* --- JSON-LD: FAQPage schema for search engines and AI answer engines --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* === Hero === */}
      <HeroSection
        title="Home Inspectors"
        subtitle="Protect your investment with a thorough home inspection from a trusted Tampa Bay professional."
      />

      {/* === Main content — prose styling for readability === */}
      <section className="container-wide py-12">
        <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-accent">

          {/* --- Why inspections matter in Florida --- */}
          <h2>Why Do Home Inspections Matter in Florida?</h2>
          <p>
            Florida homes face challenges that buyers in other states rarely encounter.
            High humidity drives mold growth behind walls and inside HVAC systems.
            Termites and wood-destroying organisms (WDO) thrive year-round in the
            subtropical climate. Hurricane-force winds test every roof, window, and
            structural connection. And large portions of the Tampa Bay area sit in
            designated{" "}
            <Link href="/guides/florida-flood-insurance-guide">flood zones</Link>{" "}
            or on terrain where sinkholes have been documented.
          </p>
          <p>
            A professional home inspection catches these issues before they become
            your financial responsibility. Roof age alone can determine whether you
            qualify for homeowners insurance in Florida — many carriers will not write
            a policy on a roof older than 15 years. An inspector identifies the age,
            condition, and remaining useful life of every major system so you can make
            an informed decision.
          </p>

          {/* --- Types of inspections --- */}
          <h2>What Types of Home Inspections Are Available?</h2>
          <p>
            Depending on the property and your insurance requirements, you may need
            one or several of the following inspection types:
          </p>
          <ul>
            <li>
              <strong>General Home Inspection</strong> — A comprehensive evaluation
              of the roof, structure, electrical, plumbing, HVAC, appliances, and
              overall condition. This is the standard inspection every buyer should
              get.
            </li>
            <li>
              <strong>4-Point Inspection</strong> — Required by most Florida
              insurance companies for older homes. Covers four systems: roof,
              electrical, plumbing, and HVAC.
            </li>
            <li>
              <strong>Wind Mitigation Inspection</strong> — Documents
              hurricane-resistant features such as roof-to-wall connections, roof
              covering type, opening protection, and roof deck attachment. Can save
              you hundreds per year on insurance premiums.
            </li>
            <li>
              <strong>WDO/Termite Inspection</strong> — Checks for active
              infestations and damage from termites, carpenter ants, wood-boring
              beetles, and other wood-destroying organisms. Often required by
              lenders.
            </li>
            <li>
              <strong>Roof Inspection</strong> — A dedicated evaluation of the roof
              covering, flashing, penetrations, and overall condition. Especially
              important for homes with roofs nearing the end of their expected
              lifespan.
            </li>
            <li>
              <strong>Sewer Scope Inspection</strong> — A camera is fed through the
              main sewer line to check for cracks, root intrusion, bellied pipe, and
              other problems that are invisible from the surface.
            </li>
            <li>
              <strong>Pool and Spa Inspection</strong> — Evaluates the pool shell,
              pump, filter, heater, deck, barrier fencing, and safety features.
              Florida law requires specific pool barrier standards, and this
              inspection confirms compliance.
            </li>
          </ul>

          {/* --- What inspectors look for --- */}
          <h2>What Do Inspectors Look for in Florida Homes?</h2>
          <p>
            A qualified Florida home inspector examines the property from the roof
            down to the foundation. Key areas of focus include:
          </p>
          <ul>
            <li>
              <strong>Roof condition and age</strong> — shingle or tile integrity,
              flashing, underlayment, and evidence of prior repairs or storm damage.
            </li>
            <li>
              <strong>Moisture and mold</strong> — water stains, musty odors,
              moisture meter readings in walls and ceilings, and HVAC condensation
              issues.
            </li>
            <li>
              <strong>Electrical system</strong> — panel condition, wiring type
              (aluminum wiring is common in older Florida homes and can be a hazard),
              GFCI protection in wet areas, and grounding.
            </li>
            <li>
              <strong>Plumbing</strong> — pipe material (polybutylene piping is a
              known problem in Florida homes built between 1978 and 1995), water
              pressure, water heater condition, and visible leaks.
            </li>
            <li>
              <strong>HVAC performance</strong> — system age, refrigerant type,
              temperature differential, ductwork condition, and drainage.
            </li>
            <li>
              <strong>Structural integrity</strong> — foundation cracks, stucco
              damage, window and door frames, and evidence of settling or sinkhole
              activity.
            </li>
            <li>
              <strong>Hurricane readiness</strong> — impact windows or shutters,
              garage door bracing, roof-to-wall connections, and roof deck
              attachment.
            </li>
          </ul>

          {/* --- How to choose an inspector --- */}
          <h2>How Should You Choose a Home Inspector?</h2>
          <p>
            Not all inspectors are created equal. When selecting a home inspector in
            Tampa Bay, look for these qualifications:
          </p>
          <ul>
            <li>
              <strong>Florida licensing</strong> — All home inspectors in Florida
              must be licensed by the Department of Business and Professional
              Regulation (DBPR). Verify their license number before hiring.
            </li>
            <li>
              <strong>Experience with Florida construction</strong> — Block
              construction, stucco, tile roofs, and hurricane-rated systems are
              standard here. Choose someone who inspects Florida homes daily, not
              occasionally.
            </li>
            <li>
              <strong>Insurance and E&O coverage</strong> — A professional inspector
              carries general liability and errors-and-omissions insurance.
            </li>
            <li>
              <strong>Detailed, photo-rich reports</strong> — Modern inspection
              reports include photos of every deficiency, clear descriptions, and
              repair recommendations. Expect a report within 24 hours.
            </li>
            <li>
              <strong>Availability for questions</strong> — A good inspector is
              willing to walk through the findings with you after the inspection and
              answer follow-up questions later.
            </li>
          </ul>

          {/* --- What happens if problems are found --- */}
          <h2>What Happens if the Inspection Finds Problems?</h2>
          <p>
            Finding issues during the inspection is normal — every home has them. What
            matters is how you handle them. In Florida, buyers typically have three
            options after reviewing the inspection report:
          </p>
          <ul>
            <li>
              <strong>Negotiate repairs</strong> — Ask the seller to fix specific
              items before closing. This works well for safety issues, code
              violations, or major system failures.
            </li>
            <li>
              <strong>Request a credit or price reduction</strong> — Instead of
              repairs, ask the seller to reduce the purchase price or provide a
              closing cost credit so you can handle repairs on your own timeline with
              your own contractors.
            </li>
            <li>
              <strong>Walk away</strong> — If the inspection reveals deal-breaking
              issues — structural damage, active sinkholes, extensive mold, or costs
              that exceed what you are willing to absorb — you can exercise your
              inspection contingency and cancel the contract with your deposit
              returned.
            </li>
          </ul>
          <p>
            Barrett Henry has negotiated thousands of inspection responses over 23+
            years of real estate experience. He knows which items are worth fighting
            for, which are cosmetic, and how to position your repair request so
            sellers take it seriously. For a deeper look at the full inspection
            process, read the{" "}
            <Link href="/guides/home-inspection-guide">
              Complete Home Inspection Guide
            </Link>.
          </p>

          {/* --- Barrett's inspector network --- */}
          <h2>How Does Barrett Connect You with a Trusted Inspector?</h2>
          <p>
            Over two decades in real estate, Barrett Henry has worked with hundreds of
            inspectors across Tampa Bay. The inspectors he recommends share three
            qualities: they are thorough, they communicate clearly, and they show up
            on time. Barrett matches you with an inspector based on the property type,
            location, and any specialty reports you may need.
          </p>
          <p>
            Whether you are buying your first home, investing in a rental property, or
            selling and want a pre-listing inspection to avoid surprises, Barrett has
            an inspector who fits. Call{" "}
            <a href="tel:+18137337907">(813) 733-7907</a> or{" "}
            <Link href="/contact">reach out online</Link> for a referral.
          </p>
        </div>
      </section>

      {/* === FAQ section === */}
      <section className="section-light py-12">
        <div className="container-wide max-w-3xl">
          <h2 className="font-heading heading-section text-xl text-primary mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="card p-6 group"
              >
                <summary className="font-heading font-bold text-primary cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  {/* Chevron rotates when open */}
                  <span className="ml-4 text-accent transition-transform group-open:rotate-180">
                    &#9662;
                  </span>
                </summary>
                <p className="font-body text-dark mt-4 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* === Related guides grid === */}
      <section className="py-12">
        <div className="container-wide">
          <h2 className="font-heading heading-section text-xl text-primary mb-6 text-center">
            Related Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                href: "/guides/home-inspection-guide",
                label: "Home Inspection Guide",
              },
              {
                href: "/guides/florida-flood-insurance-guide",
                label: "Florida Flood Insurance Guide",
              },
              {
                href: "/guides/home-inspection-guide-florida",
                label: "Florida Home Inspection Guide",
              },
              {
                href: "/guides/condo-milestone-inspection-guide",
                label: "Condo Milestone Inspection Guide",
              },
              {
                href: "/buyers",
                label: "Buyer Resources",
              },
              {
                href: "/contact",
                label: "Contact Barrett",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card p-4 text-center hover:shadow-lg transition-shadow"
              >
                <span className="font-heading font-bold text-sm text-primary">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === Contact form CTA === */}
      <section className="section-light py-12">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading heading-section text-xl text-primary mb-2 text-center">
            Need an Inspector Recommendation?
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Tell Barrett about the property and he will connect you with the
            right inspector for the job.
          </p>
          <ContactForm webhookUrl="/api/contact" source="inspectors" />
        </div>
      </section>
    </>
  );
}
