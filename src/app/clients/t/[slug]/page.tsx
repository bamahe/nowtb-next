// =============================================================================
// /clients/t/[slug]: private Client Timeline for one buyer or seller
//
// Reads data/timelines/<slug>.json at build time. Shows every showing and
// deal milestone in order: photo, address, time, directions, nowtb.com
// listing link, and a call/text button to the agent.
//
// Private like the comparison pages: robots noindex here, X-Robots-Tag via
// vercel.json (/clients/*), disallowed in robots.txt, not in the sitemap.
// =============================================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DEFAULT_AGENT,
  KIND_LABEL,
  dayKey,
  directionsUrl,
  fmtDate,
  fmtTime,
  loadTimeline,
  mapUrl,
  nowtbListingUrl,
  sortEvents,
  timelineSlugs,
  type TimelineEvent,
} from "@/lib/clientTimeline";

export function generateStaticParams() {
  return timelineSlugs().map((slug) => ({ slug }));
}

// Unknown slugs 404 instead of rendering on demand
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = loadTimeline(slug);
  return {
    title: data ? `${data.client} | Your Home Timeline` : "Your Home Timeline",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
  };
}

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const digits = (p: string) => p.replace(/[^0-9]/g, "");

// ── Small pieces ─────────────────────────────────────────────────────────────

/** The dot on the timeline line: green check when done, ring when upcoming. */
function Dot({ status }: { status: TimelineEvent["status"] }) {
  if (status === "done") {
    return (
      <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-emerald-100">
        <svg viewBox="0 0 20 20" className="h-4 w-4 text-white" fill="currentColor" aria-hidden>
          <path d="M7.7 13.3 4.4 10l-1.1 1.1 4.4 4.4 9-9-1.1-1.1z" />
        </svg>
      </span>
    );
  }
  if (status === "canceled") {
    return <span className="relative z-10 h-7 w-7 rounded-full border-2 border-slate-300 bg-slate-100" />;
  }
  return (
    <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1D4ED8] bg-white">
      <span className="h-2.5 w-2.5 rounded-full bg-[#1D4ED8]" />
    </span>
  );
}

function HousePlaceholder() {
  return (
    <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-[#0B2545] to-[#1D4ED8]">
      <svg viewBox="0 0 24 24" className="h-12 w-12 text-white/70" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
      </svg>
    </div>
  );
}

function LinkButton({
  href,
  children,
  external,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-semibold ${
        primary
          ? "bg-[#0B2545] text-white"
          : "border border-slate-300 bg-white text-[#0B2545]"
      }`}
    >
      {children}
    </a>
  );
}

/** A showing or open house: the card with photo, facts, and buttons. */
function PropertyCard({ e, stop }: { e: TimelineEvent; stop?: number }) {
  const listing = nowtbListingUrl(e);
  const facts = [
    e.beds != null ? `${e.beds} bd` : null,
    e.baths != null ? `${e.baths} ba` : null,
    e.sqft ? `${e.sqft.toLocaleString("en-US")} sf` : null,
  ].filter(Boolean);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="relative">
        {e.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.photo} alt={e.address || "Property"} className="h-44 w-full object-cover" loading="lazy" />
        ) : (
          <HousePlaceholder />
        )}
        {stop ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#0B2545] shadow">
            Stop {stop}
          </span>
        ) : null}
        {e.price ? (
          <span className="absolute bottom-3 left-3 rounded-md bg-[#0B2545]/90 px-2.5 py-1 text-sm font-bold text-white">
            {money(e.price)}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <a href={mapUrl(e)} target="_blank" rel="noopener noreferrer" className="block font-semibold text-[#0B2545]">
            {e.address}
          </a>
          <p className="text-sm text-[#475569]">
            {[e.city, e.zip].filter(Boolean).join(", ")}
            {facts.length ? ` · ${facts.join(" · ")}` : ""}
          </p>
        </div>

        {e.gateCode ? (
          <p className="rounded-lg bg-[#EFF4FB] px-3 py-2 text-sm text-[#0B2545]">
            <span className="font-semibold">Gate code:</span> {e.gateCode}
          </p>
        ) : null}

        <div className="flex gap-2">
          <LinkButton href={directionsUrl(e)} external primary>
            Directions
          </LinkButton>
          {listing ? <LinkButton href={listing}>View Listing</LinkButton> : null}
        </div>
      </div>
    </div>
  );
}

// ── The page ─────────────────────────────────────────────────────────────────

export default async function ClientTimelinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = loadTimeline(slug);
  if (!data) notFound();

  const agent = { ...DEFAULT_AGENT, ...(data.agent || {}) };
  const events = sortEvents(data.events);

  // Number the showings within each day so the client sees "Stop 1, 2, 3"
  const stopNumber = new Map<TimelineEvent, number>();
  const perDay = new Map<string, number>();
  for (const e of events) {
    if (e.kind !== "showing") continue;
    const k = dayKey(e.when);
    const n = (perDay.get(k) || 0) + 1;
    perDay.set(k, n);
    stopNumber.set(e, n);
  }

  const done = events.filter((e) => e.status === "done").length;
  const live = events.filter((e) => e.status !== "canceled").length;
  const next = events.find((e) => (e.status ?? "scheduled") === "scheduled");

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F7FA] text-[#0B2545]">
      {/* Agent bar: who to call */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-4">
          {agent.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={agent.photo} alt={agent.name} className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B2545] text-lg font-bold text-white">
              {agent.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-lg font-bold leading-tight">{agent.name}</p>
            <p className="truncate text-xs text-[#475569]">{agent.brokerage}</p>
          </div>
          <a href={`sms:${digits(agent.phone)}`} aria-label="Text" className="rounded-full border border-slate-300 p-2.5">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M4 5h16v11H8l-4 4z" />
            </svg>
          </a>
          <a href={`tel:${digits(agent.phone)}`} aria-label="Call" className="rounded-full bg-[#0B2545] p-2.5 text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
            </svg>
          </a>
        </div>
      </div>

      <main className="mx-auto max-w-xl px-4 pb-16 pt-6">
        {/* Client header + progress */}
        <p className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">Your home timeline</p>
        <h1 className="mt-1 font-heading text-3xl font-bold">{data.client}</h1>
        {data.headline ? <p className="mt-1 text-[#475569]">{data.headline}</p> : null}

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{done} of {live} complete</span>
            {next?.when ? (
              <span className="text-[#475569]">
                Next: {fmtDate(next.when)}{next.allDay ? "" : `, ${fmtTime(next.when)}`}
              </span>
            ) : null}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${live ? (done / live) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Timeline */}
        <ol className="relative mt-8">
          {/* the vertical line */}
          <span className="absolute bottom-2 left-[13px] top-2 w-0.5 bg-slate-200" aria-hidden />
          {events.map((e, i) => {
            const status = e.status ?? "scheduled";
            const isProperty = (e.kind === "showing" || e.kind === "open_house") && e.address;
            return (
              <li key={i} className={`relative flex gap-4 pb-8 ${status === "canceled" ? "opacity-50" : ""}`}>
                <Dot status={status} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#475569]">
                    {KIND_LABEL[e.kind]}
                    {status === "canceled" ? " · Canceled" : ""}
                  </p>
                  <h2 className={`font-heading text-xl font-bold leading-snug ${status === "canceled" ? "line-through" : ""}`}>
                    {e.title}
                  </h2>
                  <p className="mt-0.5 text-sm text-[#475569]">
                    {e.when
                      ? `${fmtDate(e.when)}${e.allDay ? "" : ` · ${fmtTime(e.when)}`}`
                      : "Date to be set"}
                  </p>
                  {e.note ? <p className="mt-2 text-[15px] leading-relaxed">{e.note}</p> : null}
                  {isProperty ? <PropertyCard e={e} stop={stopNumber.get(e)} /> : null}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Footer contact */}
        <div className="rounded-xl bg-[#0B2545] p-5 text-white">
          <p className="font-heading text-lg font-bold">Questions about anything here?</p>
          <p className="mt-1 text-sm text-white/80">
            {agent.name}, {agent.title}, {agent.brokerage}
          </p>
          <div className="mt-4 flex gap-2">
            <a href={`tel:${digits(agent.phone)}`} className="flex-1 rounded-lg bg-white py-2.5 text-center text-sm font-semibold text-[#0B2545]">
              Call {agent.phone}
            </a>
            <a href={`mailto:${agent.email}`} className="flex-1 rounded-lg border border-white/40 py-2.5 text-center text-sm font-semibold">
              Email
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
