// =============================================================================
// /agents — Team Roster Page
// Displays all agents from the agents data file with cards
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import { agents } from "@/data/agents";

// --- SEO metadata + Open Graph tags ---
export const metadata: Metadata = {
  title: "Meet Your Tampa Bay Real Estate Team",
  description:
    "Meet Barrett Henry and The NOW Team at REMAX Collective. Experienced REALTORS® serving Tampa Bay's 7 counties — residential sales, investment properties, new construction, and more.",
  openGraph: {
    title: "Meet Your Tampa Bay Real Estate Team | Barrett Henry, REALTOR®",
    description:
      "The NOW Team at REMAX Collective — experienced agents serving all of Tampa Bay.",
    type: "website",
  },
};

export default function AgentsPage() {
  return (
    <>
      {/* ---- Hero Section ---- */}
      <HeroSection
        title="Meet Your Tampa Bay Real Estate Team"
        subtitle="The NOW Team at REMAX Collective — experienced agents ready to help you buy, sell, or invest"
      />

      {/* ---- Agent Cards ---- */}
      <section className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div key={agent.id} className="card overflow-hidden">
              {/* Photo placeholder */}
              <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
                {/* Replace with next/image once photo files are added */}
                <p className="font-body text-muted text-sm">
                  Photo: {agent.name}
                </p>
              </div>

              {/* Agent info */}
              <div className="p-6">
                {/* Name + title */}
                <h2 className="heading-section text-xl text-primary">
                  {agent.name}
                </h2>
                <p className="font-body text-accent font-medium text-sm mb-3">
                  {agent.title}
                </p>

                {/* Contact info */}
                <div className="space-y-1 mb-4">
                  <p className="font-body text-muted text-sm">
                    <a
                      href={`tel:${agent.phone.replace(/[^\d+]/g, "")}`}
                      className="hover:text-accent transition-colors"
                    >
                      {agent.phone}
                    </a>
                  </p>
                  <p className="font-body text-muted text-sm">
                    <a
                      href={`mailto:${agent.email}`}
                      className="hover:text-accent transition-colors"
                    >
                      {agent.email}
                    </a>
                  </p>
                </div>

                {/* Bio excerpt — first 150 chars */}
                <p className="font-body text-muted text-sm mb-4">
                  {agent.bio.length > 150
                    ? `${agent.bio.substring(0, 150)}...`
                    : agent.bio}
                </p>

                {/* Specialties badges */}
                <div className="flex flex-wrap gap-2">
                  {agent.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-block px-3 py-1 text-xs font-body font-medium bg-accent/10 text-accent rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CTA Section ---- */}
      <section className="bg-primary py-16">
        <div className="container-wide text-center">
          <h2 className="heading-section text-display-sm text-white mb-4">
            Ready to Work With Us?
          </h2>
          <p className="font-body text-accent text-lg max-w-2xl mx-auto mb-8">
            Whether you&apos;re buying your first home, selling a property, or
            building an investment portfolio, The NOW Team has the experience and
            local knowledge to get it done.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-primary inline-block bg-accent hover:bg-accent/90"
            >
              Contact Us
            </Link>
            <Link
              href="/properties"
              className="inline-block px-6 py-3 rounded-lg border-2 border-white text-white font-body font-medium hover:bg-white hover:text-primary transition-colors"
            >
              Search Properties
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
