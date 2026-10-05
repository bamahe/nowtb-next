// =============================================================================
// /clients/[slug]: private home comparison packet for one buyer client
//
// Reads data/clients/<slug>.json at build time and renders the whole
// comparison. To change, add or remove homes, edit that JSON file and push.
// Nothing in this file needs to be touched.
//
// These pages are private. They carry robots noindex, they are served with an
// X-Robots-Tag header (see vercel.json), they are disallowed in robots.txt,
// they are left out of the sitemap, and nothing on the site links to them.
// =============================================================================

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CompareCalculator from "@/components/clients/CompareCalculator";
import {
  computeAll,
  commuteLeg,
  readableMonth,
  bestMonthly,
  listingUrl,
  type ClientData,
  type ComputedHome,
} from "@/lib/clientCompare";

const DATA_DIR = join(process.cwd(), "data", "clients");

// ── Loading the client file ──────────────────────────────────────────────────

function loadClient(slug: string): ClientData | null {
  // Guard against anything that could climb out of data/clients
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  try {
    return JSON.parse(
      readFileSync(join(DATA_DIR, `${slug}.json`), "utf8")
    ) as ClientData;
  } catch {
    return null;
  }
}

// Pre-render one page per JSON file in data/clients
export function generateStaticParams() {
  let files: string[] = [];
  try {
    files = readdirSync(DATA_DIR);
  } catch {
    return [];
  }
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ slug: f.replace(/\.json$/, "") }));
}

// Any slug without a JSON file returns 404 instead of being rendered on demand
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = loadClient(slug);
  return {
    title: data ? `Home Comparison for ${data.client}` : "Home Comparison",
    // Private client packet. Keep it out of search entirely.
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
  };
}

// ── Formatting helpers ───────────────────────────────────────────────────────

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
/** settings rates are decimals, so 0.06875 reads as 6.875% */
const pctDec = (r: number) => `${+(r * 100).toFixed(3)}%`;
/** loan.rate is already a whole percent, so 3.01 reads as 3.01% */
const pctWhole = (r: number) => `${r}%`;

// ── Small presentational pieces ──────────────────────────────────────────────

/** A full width band that introduces a group of table rows. */
function SectionRow({ title, span }: { title: string; span: number }) {
  return (
    <tr>
      <th
        colSpan={span}
        scope="colgroup"
        className="sticky left-0 bg-[#0B2545] px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-white"
      >
        {title}
      </th>
    </tr>
  );
}

/**
 * One labelled row. The label cell is sticky so it stays visible while the
 * home columns scroll sideways under it.
 */
function Row({
  label,
  cells,
  bold,
}: {
  label: string;
  cells: React.ReactNode[];
  bold?: boolean;
}) {
  return (
    <tr className="border-b border-slate-200 align-top">
      <th
        scope="row"
        className={`sticky left-0 z-10 min-w-[8.5rem] max-w-[10rem] border-r border-slate-200 bg-[#F5F7FA] px-3 py-2.5 text-left text-xs font-semibold text-[#475569] ${
          bold ? "text-[#0B2545]" : ""
        }`}
      >
        {label}
      </th>
      {cells.map((c, i) => (
        <td
          key={i}
          className={`min-w-[11rem] border-r border-slate-200 px-3 py-2.5 text-sm ${
            bold ? "bg-[#F5F7FA] font-bold text-[#0B2545]" : "text-[#0B2545]"
          }`}
        >
          {c}
        </td>
      ))}
    </tr>
  );
}

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "green" | "red";
}) {
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : "bg-red-50 text-[#C62828] ring-red-200";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${cls}`}
    >
      {children}
    </span>
  );
}

/** A short list inside a table cell. */
function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-4 text-sm leading-snug">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

function NotAvailable() {
  return <span className="font-normal text-[#475569]">Not available</span>;
}

/** "4 bed / 2.5 bath" */
function bedsBaths(beds: number, baths: number) {
  return `${beds} bed / ${baths} bath`;
}

// ── The page ─────────────────────────────────────────────────────────────────

export default async function ClientComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = loadClient(slug);
  if (!data) notFound();

  const rows = computeAll(data);
  const s = data.settings;
  const span = rows.length + 1;
  const cells = (fn: (c: ComputedHome) => React.ReactNode) => rows.map(fn);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F7FA] text-[#0B2545]">
      {/* 1. Header */}
      <header className="bg-[#0B2545] px-4 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            Your Home Comparison
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            Prepared for {data.client} by Barrett Henry, REMAX Collective.
            Updated {data.updated}.
          </p>
          {s.rentNow && (
            <p className="mt-3 text-sm text-slate-300">
              For reference, you pay {s.rentNow} in rent today.
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* 2. Summary cards */}
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="text-lg font-bold text-[#0B2545]">
            The short version
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {rows.map((c) => {
              const h = c.home;
              const leg1 = commuteLeg(h, 0);
              return (
                <article
                  key={h.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <h3 className="text-base font-bold leading-snug text-[#0B2545]">
                    {h.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#475569]">{h.community}</p>

                  <p className="mt-3 text-2xl font-bold text-[#1565C0]">
                    {money(bestMonthly(c))}
                    <span className="ml-1 text-sm font-semibold text-[#475569]">
                      per month, all in
                    </span>
                  </p>

                  <p className="mt-2 text-sm leading-snug text-[#0B2545]">
                    {c.assume ? (
                      <>
                        Taking over the loan, needs about{" "}
                        <strong>{money(c.assume.cashDown)}</strong> cash (new
                        VA: {money(c.newVaAllIn)})
                      </>
                    ) : (
                      <>
                        New VA loan, about <strong>$0</strong> down
                      </>
                    )}
                  </p>

                  <p className="mt-3 border-t border-slate-200 pt-3 text-xs text-[#475569]">
                    {leg1.time} to {s.workplaces[0]}
                  </p>

                  <Link
                    href={listingUrl(h)}
                    className="mt-3 inline-block text-xs font-semibold text-[#1565C0] underline"
                  >
                    See all photos and details on nowtb.com
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* 2b. Sliders, so they can push the numbers around themselves */}
        <section className="mt-10">
          <CompareCalculator data={data} />
        </section>

        {/* 3. Side by side table */}
        <section aria-labelledby="table-heading" className="mt-10">
          <h2 id="table-heading" className="text-lg font-bold text-[#0B2545]">
            Side by side
          </h2>
          <p className="mt-1 text-xs text-[#475569]">
            Scroll sideways to see every home. The labels stay put.
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Home comparison for {data.client}
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-20 min-w-[8.5rem] max-w-[10rem] border-b-2 border-r border-slate-200 bg-white px-3 py-3 text-xs font-semibold uppercase text-[#475569]"
                  >
                    Home
                  </th>
                  {rows.map((c) => (
                    <th
                      key={c.home.id}
                      scope="col"
                      className="min-w-[11rem] border-b-2 border-r border-slate-200 bg-white px-3 py-3 align-top text-sm font-bold text-[#0B2545]"
                    >
                      {c.home.name}
                      <span className="mt-0.5 block text-xs font-normal text-[#475569]">
                        {c.home.community}
                      </span>
                      <span className="mt-0.5 block text-xs font-normal text-[#475569]">
                        MLS {c.home.mls}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* THE HOUSE */}
                <SectionRow title="The house" span={span} />
                <Row
                  label="List price"
                  bold
                  cells={cells((c) => (
                    <>
                      {money(c.home.price)}
                      {c.home.orig !== c.home.price && (
                        <span className="mt-0.5 block text-xs font-normal text-[#C62828]">
                          was {money(c.home.orig)}
                        </span>
                      )}
                    </>
                  ))}
                />
                <Row
                  label="Days on market"
                  cells={cells((c) => `${c.home.dom}`)}
                />
                <Row
                  label="Beds / baths"
                  cells={cells((c) => bedsBaths(c.home.beds, c.home.baths))}
                />
                <Row
                  label="Square feet"
                  cells={cells((c) => c.home.sqft.toLocaleString("en-US"))}
                />
                <Row
                  label="Price per sq ft"
                  cells={cells((c) => money(c.pricePerSqft))}
                />
                <Row
                  label="Year built / stories"
                  cells={cells(
                    (c) =>
                      `${c.home.year} / ${c.home.stories} ${
                        c.home.stories === 1 ? "story" : "stories"
                      }`
                  )}
                />
                <Row
                  label="Garage"
                  cells={cells((c) => `${c.home.garage} car`)}
                />
                <Row
                  label="Lot"
                  cells={cells((c) => `${c.home.lot} acre`)}
                />
                <Row label="Roof" cells={cells((c) => c.home.roof)} />

                {/* SELLER'S LOAN */}
                <SectionRow
                  title="Seller's loan (public records, estimate)"
                  span={span}
                />
                <Row
                  label="Loan type"
                  cells={cells((c) => (
                    <>
                      <span className="mr-2 font-semibold">
                        {c.home.loan.type}
                      </span>
                      {c.home.loan.assumable ? (
                        <Pill tone="green">Assumable</Pill>
                      ) : (
                        <Pill tone="red">Not assumable</Pill>
                      )}
                    </>
                  ))}
                />
                <Row
                  label="Lender, recorded, term"
                  cells={cells((c) => (
                    <>
                      {c.home.loan.lender}
                      <span className="mt-0.5 block text-xs text-[#475569]">
                        Recorded {readableMonth(c.home.loan.recorded)},{" "}
                        {c.home.loan.term}
                      </span>
                    </>
                  ))}
                />
                <Row
                  label="Est. rate"
                  cells={cells((c) => pctWhole(c.home.loan.rate))}
                />
                <Row
                  label="Est. balance"
                  cells={cells((c) => money(c.home.loan.bal))}
                />
                <Row
                  label="Seller's est. equity"
                  cells={cells((c) => money(c.sellerEquity))}
                />

                {/* OPTION A */}
                <SectionRow title="Option A, new VA loan, 0% down" span={span} />
                <Row
                  label="Principal + interest"
                  cells={cells((c) => money(c.newVaPI))}
                />
                <Row label="Property tax" cells={cells((c) => money(c.taxMo))} />
                <Row
                  label="CDD"
                  cells={cells((c) => (c.cddMo > 0 ? money(c.cddMo) : "None"))}
                />
                <Row label="HOA" cells={cells((c) => money(c.hoaMo))} />
                <Row label="Insurance" cells={cells((c) => money(c.insMo))} />
                <Row label="Electric" cells={cells((c) => money(c.elecMo))} />
                <Row
                  label="Total per month"
                  bold
                  cells={cells((c) => money(c.newVaAllIn))}
                />
                <Row
                  label="Cash to close"
                  cells={cells(() => "Closing costs only (ask seller to pay)")}
                />

                {/* OPTION B */}
                <SectionRow
                  title="Option B, take over the seller's loan"
                  span={span}
                />
                <Row
                  label="Loan taken over"
                  cells={cells((c) =>
                    c.assume ? (
                      <>
                        {money(c.home.loan.bal)} at{" "}
                        {pctWhole(c.home.loan.rate)}
                        {c.home.loan.remaining && (
                          <span className="mt-0.5 block text-xs text-[#475569]">
                            {c.home.loan.remaining} payments left
                          </span>
                        )}
                      </>
                    ) : (
                      <NotAvailable />
                    )
                  )}
                />
                <Row
                  label="Gap to the price"
                  cells={cells((c) =>
                    c.assume ? money(c.assume.gap) : <NotAvailable />
                  )}
                />
                <Row
                  label="Cash + second loan"
                  cells={cells((c) =>
                    c.assume ? (
                      <>
                        {money(c.assume.cashDown)} cash
                        <span className="mt-0.5 block text-xs text-[#475569]">
                          plus a {money(c.assume.second)} second at{" "}
                          {pctDec(s.secondRate)}
                        </span>
                      </>
                    ) : (
                      <NotAvailable />
                    )
                  )}
                />
                <Row
                  label="Payments"
                  cells={cells((c) =>
                    c.assume ? (
                      <>
                        {money(c.home.loan.pi ?? 0)} first
                        <span className="mt-0.5 block text-xs text-[#475569]">
                          {money(c.home.loan.mip ?? 0)} MIP,{" "}
                          {money(c.assume.secondPI)} second
                        </span>
                        <span className="mt-0.5 block text-xs font-semibold">
                          {money(c.assume.assumePI)} total loan payments
                        </span>
                      </>
                    ) : (
                      <NotAvailable />
                    )
                  )}
                />
                <Row
                  label="Total per month"
                  bold
                  cells={cells((c) =>
                    c.assume ? (
                      <>
                        {money(c.assume.assumeAllIn)}
                        {c.assume.saveVsNewVa > 0 && (
                          <span className="mt-1 block">
                            <Pill tone="green">
                              saves {money(c.assume.saveVsNewVa)}/mo vs new VA
                            </Pill>
                          </span>
                        )}
                      </>
                    ) : (
                      <NotAvailable />
                    )
                  )}
                />
                <Row
                  label="If you cover the whole gap in cash"
                  cells={cells((c) =>
                    c.assume ? (
                      <>
                        {money(c.assume.allCashGapAllIn)} per month
                        <span className="mt-0.5 block text-xs text-[#475569]">
                          takes {money(c.assume.gap)} cash, no second loan
                        </span>
                      </>
                    ) : (
                      <NotAvailable />
                    )
                  )}
                />

                {/* COMMUTE */}
                <SectionRow title="Commute" span={span} />
                {s.workplaces.map((w, wi) => (
                  <Row
                    key={w}
                    label={w}
                    cells={cells((c) => {
                      const leg = commuteLeg(c.home, wi);
                      return (
                        <>
                          {leg.time}
                          <span className="mt-0.5 block text-xs text-[#475569]">
                            {leg.miles} each way
                          </span>
                        </>
                      );
                    })}
                  />
                ))}
                <Row
                  label="Extra hours in the car per month"
                  cells={cells((c) =>
                    c.isBaseline ? (
                      <Pill tone="green">Baseline</Pill>
                    ) : (
                      `${c.extraDriveHoursMo.toFixed(1)} hours`
                    )
                  )}
                />
                <Row
                  label="Extra gas per month"
                  cells={cells((c) =>
                    c.isBaseline ? (
                      <Pill tone="green">Baseline</Pill>
                    ) : (
                      money(c.extraDriveCostMo)
                    )
                  )}
                />

                {/* TOUR NOTES */}
                <SectionRow title="What you said on the tour" span={span} />
                <Row
                  label="Likes"
                  cells={cells((c) => <Bullets items={c.home.likes} />)}
                />
                <Row
                  label="Watch outs"
                  cells={cells((c) => <Bullets items={c.home.cons} />)}
                />
                <Row
                  label="Negotiating room"
                  cells={cells((c) => (
                    <span className="text-sm leading-snug">
                      {c.home.leverage}
                    </span>
                  ))}
                />
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. How assumptions work */}
        <section
          aria-labelledby="how-heading"
          className="mt-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 id="how-heading" className="text-lg font-bold text-[#0B2545]">
            How taking over a loan works
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#0B2545]">
            <li>
              VA and FHA loans can be taken over by a qualified buyer, who keeps
              the seller's rate and remaining term and must qualify with the
              seller's loan company.
            </li>
            <li>
              The gap is paid with cash, a second loan, or both. Most second
              lenders cap total borrowing near 90% of price, so plan on about
              10% cash.
            </li>
            <li>
              The same bank usually does not lend the gap. Expect a credit union
              or an assumption specialist lender, but ask the servicer first.
            </li>
            <li>
              Plan on 60 to 90 days. The contract needs a longer closing date
              and an assumption contingency.
            </li>
            <li>
              FHA: taking it over does not use the VA benefit, FHA mortgage
              insurance stays with the loan, and you should confirm rate,
              balance, and current servicer.
            </li>
            <li>
              VA: the buyer substitutes their VA entitlement so the seller gets
              theirs back, and part of the buyer's VA benefit stays tied to that
              loan.
            </li>
          </ul>

          <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-[#475569]">
            Where each home stands
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#475569]">
            These come from public records, which tell us the loan type, the
            rate and roughly what is owed, but not whether the servicer will
            actually approve an assumption. That is a phone call I make on your
            behalf once you pick a favorite, and the answer can change the
            numbers below.
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#0B2545]">
            {rows.map((c) => (
              <li key={c.home.id}>
                <strong>{c.home.name}:</strong> {c.home.loan.type} at{" "}
                {pctWhole(c.home.loan.rate)} through {c.home.loan.lender}, and
                it is{" "}
                {c.home.loan.assumable ? (
                  <>assumable, so Option B is open.</>
                ) : (
                  <>not assumable, so a new VA loan is the path here.</>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* 5. Assumptions */}
        <section
          aria-labelledby="assumptions-heading"
          className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2
            id="assumptions-heading"
            className="text-lg font-bold text-[#0B2545]"
          >
            Assumptions behind these numbers
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#0B2545]">
            <li>
              New VA loans are priced at {pctDec(s.vaRate)} over 30 years with
              nothing down.
            </li>
            <li>
              Property tax assumes the county assesses at{" "}
              {Math.round(s.assessRatio * 100)}% of the purchase price, less a{" "}
              {money(s.homesteadExemption)} homestead exemption, taxed at{" "}
              {(s.millage * 1000).toFixed(1)} mills.
            </li>
            <li>
              CDD is the annual fee divided by 12. HOA and insurance are already
              monthly figures.
            </li>
            <li>
              Electric is estimated per house from its own usage rate at $
              {s.electricPerKwh.toFixed(3)} per kilowatt hour.
            </li>
            <li>
              On an assumption, a second lender is assumed to go to{" "}
              {Math.round(s.secondMaxCltv * 100)}% of the price at{" "}
              {pctDec(s.secondRate)} over 30 years, and you bring the remaining{" "}
              {Math.round((1 - s.secondMaxCltv) * 100)}% in cash.
            </li>
            <li>
              Commute math assumes {s.drivers}{" "}
              {s.drivers === 1 ? "driver" : "drivers"} making a round trip{" "}
              {s.workDays} days a month, averaging {s.avgMph} mph, at $
              {s.gasCostPerMile.toFixed(2)} per mile for gas.
            </li>
            <li>
              Extra drive time and gas are measured against{" "}
              {rows.find((r) => r.isBaseline)?.home.name ?? s.baselineHomeId},
              the closest home on this list.
            </li>
          </ul>
          <p className="mt-4 border-t border-slate-200 pt-4 text-xs leading-relaxed text-[#475569]">
            All figures are estimates for comparison only, not a loan offer.
            Loan balances and rates come from public records and will be
            confirmed with each seller's loan company. Your lender will provide
            official numbers.
          </p>
        </section>

        {/* 7. Links back into nowtb.com */}
        <section
          aria-labelledby="links-heading"
          className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 id="links-heading" className="text-lg font-bold text-[#0B2545]">
            The listings and more on nowtb.com
          </h2>

          <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-[#475569]">
            These four homes
          </h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {rows.map((c) => (
              <li key={c.home.id}>
                <Link
                  href={listingUrl(c.home)}
                  className="text-sm font-semibold text-[#1565C0] underline"
                >
                  {c.home.name}
                </Link>
                <span className="block text-xs text-[#475569]">
                  {money(c.home.price)}, {c.home.community}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-[#475569]">
            Worth reading before you write an offer
          </h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {[
              {
                href: "/va-loan-florida/",
                label: "VA loans in Florida",
                note: "How your entitlement works and what it covers",
              },
              {
                href: "/fha-loan-florida/",
                label: "FHA loans in Florida",
                note: "Relevant to the Blue Pacific assumption",
              },
              {
                href: "/mortgage-calculator/",
                label: "Mortgage calculator",
                note: "Run a payment on any price you like",
              },
              {
                href: "/buyers/",
                label: "Buyer guide",
                note: "What happens at each step, start to close",
              },
              {
                href: "/properties/",
                label: "Search every listing",
                note: "The full MLS, updated hourly",
              },
              {
                href: "/contact/",
                label: "Reach me",
                note: "Call, text or send a question",
              },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm font-semibold text-[#1565C0] underline"
                >
                  {l.label}
                </Link>
                <span className="block text-xs text-[#475569]">{l.note}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 rounded-lg bg-[#0B2545] p-4 text-sm leading-relaxed text-white">
            Seen enough? Text or call me at{" "}
            <a href="tel:+18137337907" className="font-bold underline">
              (813) 733-7907
            </a>{" "}
            and I will call the servicer on your favorite to confirm the
            assumption before we write anything.
          </p>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className="bg-[#0B2545] px-4 py-6 text-center text-sm text-slate-200">
        <p className="mx-auto max-w-6xl leading-relaxed">
          Barrett Henry | REMAX Collective |{" "}
          <a href="tel:+18137337907" className="underline">
            (813) 733-7907
          </a>{" "}
          |{" "}
          <a href="mailto:barrett@nowtb.com" className="underline">
            barrett@nowtb.com
          </a>
        </p>
      </footer>
    </div>
  );
}
