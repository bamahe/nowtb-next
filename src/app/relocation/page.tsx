// =============================================================================
// /relocation — Tampa Bay Relocation Services
// Full-service relocation page: why Tampa Bay, checklist, areas by lifestyle,
// school overview, cost of living, how Barrett helps, FAQ with schema
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Relocating to Tampa Bay | Full Relocation Services | Barrett Henry",
  description:
    "Relocating to Tampa Bay? Barrett Henry, Broker Associate at REMAX Collective, provides full relocation services — virtual tours, neighborhood research, and selling-agent coordination. Call (813) 733-7907.",
  alternates: {
    canonical: "/relocation/",
  },
  openGraph: {
    title: "Relocating to Tampa Bay | Barrett Henry, REALTOR®",
    description:
      "Full-service relocation support from a Broker Associate with 23+ years of real estate experience. Virtual tours, area research, and seamless coordination.",
    type: "website",
  },
};

// --- FAQ data used in both the page content and FAQPage schema ---
const faqs = [
  {
    question: "What is the best time of year to relocate to Tampa Bay?",
    answer:
      "Most people move between April and October when inventory is highest and you can experience the summer climate firsthand. However, winter moves often mean less competition and better negotiating leverage. Barrett can help you time your move regardless of season.",
  },
  {
    question: "Can Barrett help me find a home before I arrive in Tampa Bay?",
    answer:
      "Yes. Barrett offers live virtual tours via FaceTime or Zoom so you can walk through homes in real time from anywhere in the country. Many relocation clients go under contract before they ever set foot in Tampa Bay.",
  },
  {
    question: "How does Barrett coordinate with my current selling agent?",
    answer:
      "Barrett works directly with your listing agent to align timelines, manage contingencies, and ensure your sale and purchase close smoothly. This dual-agent coordination prevents gaps in housing and reduces stress.",
  },
  {
    question: "Is Tampa Bay affordable compared to the Northeast or California?",
    answer:
      "Tampa Bay's median home price is significantly lower than metro areas in the Northeast and California. Combined with zero state income tax, lower insurance costs outside of flood zones, and a lower overall cost of living, most relocators see meaningful savings from day one.",
  },
  {
    question: "Does Barrett help with military PCS relocations?",
    answer:
      "Yes. Barrett holds the Military Relocation Professional (MRP) certification and has experience assisting service members with PCS moves to MacDill AFB and other Tampa Bay installations. He understands BAH rates, VA loan requirements, and base proximity considerations.",
  },
];

// --- Relocation checklist steps ---
const checklistBefore = [
  "Get pre-approved for a mortgage so you know your budget before touring homes",
  "Research school districts, commute times, and neighborhood lifestyles",
  "Schedule a virtual consultation with Barrett to discuss your priorities",
  "Connect Barrett with your current selling agent to coordinate timelines",
  "Request a relocation package with area guides and market data",
];

const checklistDuring = [
  "Tour neighborhoods in person or via live virtual walkthrough",
  "Visit schools, grocery stores, parks, and daily-life destinations",
  "Review HOA documents, flood zones, and insurance estimates for each property",
  "Make an offer and complete inspections before your move date",
  "Arrange temporary housing if your closing timeline requires it",
];

const checklistAfter = [
  "Update your driver license, vehicle registration, and voter registration",
  "Transfer utilities, internet, and home services to your new address",
  "Register children in their new school district",
  "Establish care with local doctors, dentists, and veterinarians",
  "Explore your new community — Barrett sends a curated local guide after closing",
];

// --- Areas by lifestyle ---
const lifestyleAreas = [
  {
    lifestyle: "Families",
    areas: "Wesley Chapel, FishHawk Ranch, Lithia, Westchase, Land O' Lakes",
    why: "Top-rated school districts, family-friendly master-planned communities, parks, sports leagues, and safe neighborhoods with strong resale values.",
  },
  {
    lifestyle: "Retirees",
    areas: "Sun City Center, Apollo Beach, Safety Harbor, Dunedin, Largo",
    why: "55+ communities, waterfront living, walkable downtowns, world-class healthcare at Tampa General and Moffitt Cancer Center, and no state income tax on retirement income.",
  },
  {
    lifestyle: "Young Professionals",
    areas: "Downtown Tampa, St. Petersburg, Seminole Heights, South Tampa, Ybor City",
    why: "Walkable urban neighborhoods, thriving restaurant and nightlife scenes, proximity to major employers, and easy access to Tampa International Airport.",
  },
  {
    lifestyle: "Military Families",
    areas: "Brandon, Riverview, Apollo Beach, South Tampa, Town 'n' Country",
    why: "Close proximity to MacDill AFB, strong VA loan activity, military-friendly schools, and established support networks for service members and their families.",
  },
];

// --- Cost of living comparison data ---
const costComparisons = [
  { category: "Median Home Price", tampaBay: "$380K", northeast: "$550K+", california: "$750K+" },
  { category: "State Income Tax", tampaBay: "0%", northeast: "5-10%", california: "9.3-13.3%" },
  { category: "Property Tax Rate", tampaBay: "~0.9%", northeast: "1.5-2.5%", california: "~0.75%" },
  { category: "Average Rent (2BR)", tampaBay: "$1,800", northeast: "$2,400+", california: "$2,800+" },
  { category: "Gas (per gallon)", tampaBay: "$3.20", northeast: "$3.50+", california: "$4.50+" },
];

export default function RelocationPage() {
  return (
    <>
      {/* --- JSON-LD: BreadcrumbList schema --- */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://nowtb.com" },
          { name: "Relocation", url: "https://nowtb.com/relocation" },
        ])}
      />

      {/* --- JSON-LD: FAQPage schema --- */}
      <JsonLd
        data={{
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
        }}
      />

      {/* ---- Hero Section ---- */}
      <HeroSection
        title="Tampa Bay Relocation Services"
        label="BARRETT HENRY | BROKER ASSOCIATE"
        subtitle="Moving to Tampa Bay from out of state? Barrett Henry makes the transition seamless with 23+ years of real estate experience."
      />

      {/* ---- Why People Relocate to Tampa Bay ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">The Draw</p>
            <h2 className="heading-section text-display-sm text-primary">
              Why Are So Many People Moving to Tampa Bay?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-link">
            <p>
              Tampa Bay consistently ranks among the top relocation destinations in the
              United States, and for good reason. Florida has no state income tax, which
              means your paycheck goes further from the day you arrive. The climate
              delivers 240+ days of sunshine per year, mild winters, and year-round
              outdoor living that most northern transplants can only dream about.
            </p>
            <p>
              The job market is booming. Tampa Bay is home to major employers across
              healthcare, finance, defense, technology, and logistics. Companies like
              USAA, JPMorgan Chase, Citi, and Moffitt Cancer Center anchor the economy,
              while a growing startup scene attracts younger professionals. Tampa
              International Airport, consistently rated one of the best in the country,
              makes business travel and visits back home easy.
            </p>
            <p>
              Cost of living is the clincher. Compared to metro areas in the Northeast,
              Midwest, and California, Tampa Bay offers significantly lower housing costs,
              no state income tax burden, and everyday expenses that stretch your dollar.
              Many relocators find they can buy more home for less money and still live
              within 20 minutes of the beach.
            </p>
            <p>
              Whether you are{" "}
              <Link href="/guides/relocation-guide">relocating for work</Link>,{" "}
              <Link href="/guides/first-time-home-buyer-guide">buying your first home</Link>, or{" "}
              <Link href="/retiring-to-tampa-bay">retiring to Florida</Link>, Barrett
              Henry provides the local expertise you need to make a confident move.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Relocation Checklist ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Your Roadmap</p>
            <h2 className="heading-section text-display-sm text-primary">
              What Should You Do Before, During, and After Your Move?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-5xl mx-auto">
            {/* Before */}
            <div>
              <div className="w-8 h-[1px] bg-accent mb-6" />
              <h3 className="heading-section text-sm text-primary mb-4">Before You Move</h3>
              <ul className="space-y-3">
                {checklistBefore.map((item) => (
                  <li key={item} className="font-body text-sm text-muted font-light leading-relaxed flex gap-2">
                    <span className="text-accent mt-1 flex-shrink-0">--</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* During */}
            <div>
              <div className="w-8 h-[1px] bg-accent mb-6" />
              <h3 className="heading-section text-sm text-primary mb-4">During Your Move</h3>
              <ul className="space-y-3">
                {checklistDuring.map((item) => (
                  <li key={item} className="font-body text-sm text-muted font-light leading-relaxed flex gap-2">
                    <span className="text-accent mt-1 flex-shrink-0">--</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div>
              <div className="w-8 h-[1px] bg-accent mb-6" />
              <h3 className="heading-section text-sm text-primary mb-4">After You Arrive</h3>
              <ul className="space-y-3">
                {checklistAfter.map((item) => (
                  <li key={item} className="font-body text-sm text-muted font-light leading-relaxed flex gap-2">
                    <span className="text-accent mt-1 flex-shrink-0">--</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Best Areas by Lifestyle ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Find Your Fit</p>
            <h2 className="heading-section text-display-sm text-primary">
              Which Tampa Bay Neighborhoods Match Your Lifestyle?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-4xl mx-auto">
            {lifestyleAreas.map((area) => (
              <div key={area.lifestyle}>
                <div className="w-8 h-[1px] bg-accent mb-6" />
                <h3 className="heading-section text-sm text-primary mb-2">
                  {area.lifestyle}
                </h3>
                <p className="font-body text-xs text-accent tracking-wide uppercase mb-3">
                  {area.areas}
                </p>
                <p className="font-body text-sm text-muted font-light leading-relaxed">
                  {area.why}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/communities" className="btn-secondary">
              Explore All Communities
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Schools Overview ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Education</p>
            <h2 className="heading-section text-display-sm text-primary">
              What About Schools in Tampa Bay?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-3xl mx-auto prose prose-lg font-body text-dark prose-headings:font-heading prose-headings:text-primary prose-a:text-link">
            <p>
              Tampa Bay is home to some of Florida's highest-rated public and private
              school districts. Hillsborough County Public Schools is one of the largest
              districts in the nation, offering magnet programs, IB programs, and
              career academies. Pasco County has seen rapid growth with brand-new schools
              in Wesley Chapel and Zephyrhills. Pinellas County offers strong performing
              arts and STEM programs.
            </p>
            <p>
              Private and charter school options include Academy at the Lakes, Berkeley
              Preparatory School, Jesuit High School, and dozens of Montessori and
              faith-based schools throughout the region. For higher education, the
              University of South Florida, University of Tampa, and Hillsborough
              Community College anchor the area.
            </p>
            <p>
              Barrett provides school zone data for every property you consider, and can
              connect you with families who have firsthand experience in the districts
              you are evaluating.
            </p>
            <p>
              <Link href="/tampa-bay-schools-guide">
                Read the full Tampa Bay Schools Guide
              </Link>{" "}
              for detailed rankings, enrollment tips, and district comparisons.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Cost of Living Comparison ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Your Dollar Goes Further</p>
            <h2 className="heading-section text-display-sm text-primary">
              How Does Tampa Bay Compare on Cost of Living?
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="py-3 pr-4 font-heading text-primary font-semibold">Category</th>
                  <th className="py-3 pr-4 font-heading text-primary font-semibold">Tampa Bay</th>
                  <th className="py-3 pr-4 font-heading text-primary font-semibold">Northeast</th>
                  <th className="py-3 font-heading text-primary font-semibold">California</th>
                </tr>
              </thead>
              <tbody>
                {costComparisons.map((row) => (
                  <tr key={row.category} className="border-b border-gray-100">
                    <td className="py-3 pr-4 text-muted font-light">{row.category}</td>
                    <td className="py-3 pr-4 text-accent font-medium">{row.tampaBay}</td>
                    <td className="py-3 pr-4 text-muted font-light">{row.northeast}</td>
                    <td className="py-3 text-muted font-light">{row.california}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="font-body text-xs text-muted mt-4 font-light">
              Figures are approximate averages based on 2025-2026 market data and may vary by specific location.
            </p>
          </div>
        </div>
      </section>

      {/* ---- How Barrett Helps With Relocation ---- */}
      <section className="section-dark">
        <div className="container-wide text-center">
          <p className="heading-label text-white/50 mb-6">Your Relocation Partner</p>
          <h2 className="font-heading font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-white">
            How Does Barrett Help With Your Move?
          </h2>
          <div className="section-divider" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-12 max-w-4xl mx-auto text-left">
            <div>
              <div className="w-8 h-[1px] bg-accent mb-6" />
              <h3 className="heading-section text-sm text-white mb-3">
                Virtual Tours From Anywhere
              </h3>
              <p className="font-body text-sm text-white/70 font-light leading-relaxed">
                Barrett conducts live video tours via FaceTime or Zoom so you can walk
                through homes, explore neighborhoods, and ask questions in real time —
                no matter where you currently live.
              </p>
            </div>
            <div>
              <div className="w-8 h-[1px] bg-accent mb-6" />
              <h3 className="heading-section text-sm text-white mb-3">
                Neighborhood Deep Dives
              </h3>
              <p className="font-body text-sm text-white/70 font-light leading-relaxed">
                Beyond the listing photos, Barrett drives you through communities, shows
                you schools and parks, points out commute routes, and gives you the
                unfiltered local perspective that online research cannot provide.
              </p>
            </div>
            <div>
              <div className="w-8 h-[1px] bg-accent mb-6" />
              <h3 className="heading-section text-sm text-white mb-3">
                Selling-Agent Coordination
              </h3>
              <p className="font-body text-sm text-white/70 font-light leading-relaxed">
                Barrett communicates directly with your current listing agent to align
                closing dates, manage contingencies, and ensure you are never stuck
                without housing. Seamless timeline management is the goal.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <p className="font-body text-white/70 font-light text-base max-w-2xl mx-auto mb-8">
              Barrett Henry is a Broker Associate at REMAX Collective with 23+ years of
              real estate experience, MRP certification for military relocations, and a
              deep knowledge of every Tampa Bay community. Call{" "}
              <a href="tel:+18137337907" className="text-accent hover:underline">
                (813) 733-7907
              </a>{" "}
              to start planning your move.
            </p>
            <Link href="/contact" className="btn-secondary">
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Related Guides ---- */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="heading-label mb-6">Keep Reading</p>
            <h2 className="heading-section text-display-sm text-primary">
              Relocation Guides and Resources
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link
              href="/moving-to-tampa-bay"
              className="card p-5 text-center hover:shadow-lg transition-shadow"
            >
              <span className="font-heading font-bold text-sm text-primary">
                Moving to Tampa Bay
              </span>
            </Link>
            <Link
              href="/retiring-to-tampa-bay"
              className="card p-5 text-center hover:shadow-lg transition-shadow"
            >
              <span className="font-heading font-bold text-sm text-primary">
                Retiring to Tampa Bay
              </span>
            </Link>
            <Link
              href="/guides/first-time-home-buyer-guide"
              className="card p-5 text-center hover:shadow-lg transition-shadow"
            >
              <span className="font-heading font-bold text-sm text-primary">
                First-Time Buyer Guide
              </span>
            </Link>
            <Link
              href="/guides/military-home-buying-guide"
              className="card p-5 text-center hover:shadow-lg transition-shadow"
            >
              <span className="font-heading font-bold text-sm text-primary">
                Military Home Buying
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- FAQ Section ---- */}
      <section className="section-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="heading-label mb-6">Common Questions</p>
            <h2 className="heading-section text-display-sm text-primary">
              Tampa Bay Relocation FAQ
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-3xl mx-auto space-y-10">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="heading-section text-sm text-primary mb-3">
                  {faq.question}
                </h3>
                <p className="font-body text-sm text-muted font-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Contact Form CTA ---- */}
      <section className="section-light">
        <div className="container-wide max-w-xl mx-auto">
          <ContactForm
            webhookUrl="/api/contact"
            source="relocation"
            title="Planning Your Move to Tampa Bay?"
            submitLabel="Start My Relocation"
          />
          <p className="font-body text-xs text-muted text-center mt-4 font-light">
            Barrett responds within 2 hours. Your information is confidential.
          </p>
        </div>
      </section>
    </>
  );
}
