// =============================================================================
// /card — Digital business card for Barrett Henry
// =============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { getPrimaryAgent } from "@/data/agents";

export const metadata: Metadata = {
  title: "Barrett Henry — Digital Business Card",
  description: "Barrett Henry, Broker Associate at REMAX Collective. (813) 733-7907 | barrett@nowtb.com",
};

export default function CardPage() {
  const agent = getPrimaryAgent();

  return (
    <section className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="card max-w-sm w-full p-8 text-center">
        {/* Name and title */}
        <h1 className="font-heading font-bold text-2xl text-primary mb-1">
          {agent.name}
        </h1>
        <p className="font-body text-accent text-sm mb-1">{agent.title}</p>
        <p className="font-body text-muted text-xs mb-6">
          REMAX Collective | The NOW Team
        </p>

        {/* Contact links */}
        <div className="space-y-3">
          <a
            href={`tel:${agent.phone.replace(/[^\d]/g, "")}`}
            className="btn-primary block px-6 py-3 text-sm"
          >
            Call {agent.phone}
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="block rounded-lg border border-accent px-6 py-3 text-sm font-semibold text-accent hover:bg-accent/10 transition-colors"
          >
            Email {agent.email}
          </a>
          <a
            href={`sms:${agent.phone.replace(/[^\d]/g, "")}`}
            className="block rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-primary hover:bg-gray-50 transition-colors"
          >
            Text Barrett
          </a>
        </div>

        {/* Website link */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="font-body text-sm text-accent hover:underline"
          >
            nowtb.com
          </Link>
        </div>
      </div>
    </section>
  );
}
