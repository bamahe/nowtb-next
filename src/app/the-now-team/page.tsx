// =============================================================================
// /the-now-team — The NOW Team page at REMAX Collective
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import ContactForm from "@/components/ui/ContactForm";
import { agents } from "@/data/agents";

export const metadata: Metadata = {
  title: "The NOW Team at REMAX Collective | Barrett Henry",
  description:
    "Meet The NOW Team — Barrett Henry and his real estate team at REMAX Collective serving Tampa Bay since 2015.",
};

export default function TheNowTeamPage() {
  return (
    <>
      <HeroSection
        title="The NOW Team"
        subtitle="Real estate professionals at REMAX Collective serving Tampa Bay since 2015."
      />

      {/* === Team members === */}
      <section className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div key={agent.id} className="card p-6 text-center">
              <h3 className="font-heading font-bold text-xl text-primary mb-1">
                {agent.name}
              </h3>
              <p className="font-body text-accent text-sm mb-3">{agent.title}</p>
              <p className="font-body text-muted text-sm mb-4 line-clamp-3">
                {agent.bio}
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  {agent.phone}
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  {agent.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Why The NOW Team === */}
      <section className="bg-gray-50 py-12">
        <div className="container-wide max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6 text-center">
            Why Work with The NOW Team?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "23+ Years Experience", desc: "Decades of real estate experience across residential, investment, and new construction." },
              { title: "7-County Coverage", desc: "We serve Hillsborough, Pinellas, Pasco, Manatee, Polk, Sarasota, and Hernando counties." },
              { title: "REMAX Network", desc: "Backed by the global reach and brand recognition of REMAX Collective." },
              { title: "Data-Driven Approach", desc: "Every recommendation is backed by market data, not guesswork." },
            ].map((item) => (
              <div key={item.title} className="card p-5">
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Contact === */}
      <section className="py-16">
        <div className="container-wide max-w-2xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2 text-center">
            Connect with The NOW Team
          </h2>
          <p className="font-body text-muted text-center mb-8">
            Ready to buy, sell, or invest in Tampa Bay real estate? We are here to help.
          </p>
          <ContactForm webhookUrl="/api/contact" source="the-now-team" />
        </div>
      </section>
    </>
  );
}
