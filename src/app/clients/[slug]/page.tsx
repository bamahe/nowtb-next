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
import { notFound } from "next/navigation";
import {
  computeAll,
  type ClientData,
  type ComputedHome,
  bestMonthly,
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
    title: data
      ? `Home Comparison for ${data.client}`
      : "Home Comparison",
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
const pct = (r: number) =>
  `${(r * 100).toFixed(r * 100 % 1 === 0 ? 2 : 3).replace(/0+$/, "").replace(/\.$/, "")}%`;

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
            bold
              ? "bg-[#F5F7FA] font-bold text-[#0B2545]"
              : "text-[#0B2545]"
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
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* 2. Summary cards */}
        <section aria-labelledby="summary-heading">
          <h2
            id="summary-heading"
            className="text-lg font-bold text-[#0B2545]"
          >
            The short version
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {rows.map((c) => {
              const h = c.home;
              return (
                <article
                  key={h.name}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <h3 className="text-base font-bold leading-snug text-[#0B2545]">
                    {h.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#475569]">
                    {h.community}, {h.city}
                  </p>

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
                    {h.commute[0].minutes} min to {s.workplaces[0].name}
                    {s.workplaces[0].who ? ` (${s.workplaces[0].who})` : ""}
                  </p>
                </article>
              );
            })}
          </div>
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
                      key={c.home.name}
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
                      {c.home.origPrice !== c.home.price && (
                        <span className="ml-1 block text-xs font-normal text-[#C62828]">
                          was {money(c.home.origPrice)}
                        </span>
                      )}
                    </>
                  ))}
                />
                <Row
                  label="Days on market"
                  cells={cells((c) => `${c.home.daysOnMarket}`)}
                />
                <Row
                  label="Beds / baths"
                  cells={cells((c) => c.home.bedsBaths)}
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
                      `${c.home.yearBuilt} / ${c.home.stories} ${
                        c.home.stories === 1 ? "story" : "stories"
                      }`
                  )}
                />
                <Row label="Garage" cells={cells((c) => c.home.garage)} />
                <Row label="Lot" cells={cells((c) => c.home.lot)} />
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
                        Recorded {c.home.loan.recorded}, {c.home.loan.term}
                      </span>
                    </>
                  ))}
                />
                <Row
                  label="Est. rate"
                  cells={cells((c) => pct(c.home.loan.rate))}
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
                <SectionRow
                  title="Option A, new VA loan, 0% down"
                  span={span}
                />
                <Row
                  label="Principal + interest"
                  cells={cells((c) => money(c.newVaPI))}
                />
                <Row
                  label="Property tax"
                  cells={cells((c) => money(c.taxMo))}
                />
                <Row
                  label="CDD"
                  cells={cells((c) =>
                    c.cddMo > 0 ? money(c.cddMo) : "None"
                  )}
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
                        {money(c.home.loan.bal)} at {pct(c.home.loan.rate)}
                      </>
                    ) : (
                      <span className="text-[#475569]">Not available</span>
                    )
                  )}
                />
                <Row
                  label="Gap to the price"
                  cells={cells((c) =>
                    c.assume ? (
                      money(c.assume.gap)
                    ) : (
                      <span className="text-[#475569]">Not available</span>
                    )
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
                          {pct(s.secondRate)}
                        </span>
                      </>
                    ) : (
                      <span className="text-[#475569]">Not available</span>
                    )
                  )}
                />
                <Row
                  label="Payments"
                  cells={cells((c) =>
                    c.assume ? (
                      <>
                        {money(c.home.loan.pi)} first
                        <span className="mt-0.5 block text-xs text-[#475569]">
                          {money(c.home.loan.mip)} MIP,{" "}
                          {money(c.assume.secondPI)} second
                        </span>
                        <span className="mt-0.5 block text-xs font-semibold">
                          {money(c.assume.assumePI)} total loan payments
                        </span>
                      </>
                    ) : (
                      <span className="text-[#475569]">Not available</span>
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
                      <span className="font-normal text-[#475569]">
                        Not available
                      </span>
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
                      <span className="text-[#475569]">Not available</span>
                    )
                  )}
                />

                {/* COMMUTE */}
                <SectionRow title="Commute" span={span} />
                {s.workplaces.map((w, wi) => (
                  <Row
                    key={w.name}
                    label={`${w.name}${w.who ? ` (${w.who})` : ""}`}
                    cells={cells((c) => (
                      <>
                        {c.home.commute[wi].minutes} min
                        <span className="mt-0.5 block text-xs text-[#475569]">
                          {c.home.commute[wi].miles} miles each way
                        </span>
                      </>
                    ))}
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
                  cells={cells((c) => <Bullets items={c.home.watchOuts} />)}
                />
                <Row
                  label="Negotiating room"
                  cells={cells((c) => (
                    <span className="text-sm leading-snug">
                      {c.home.negotiatingRoom}
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
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-[#0B2545]">
            {rows.map((c) => (
              <li key={c.home.name}>
                <strong>{c.home.name}:</strong>{" "}
                {c.home.loan.assumable ? (
                  <>
                    {c.home.loan.type} at {pct(c.home.loan.rate)} and it is
                    assumable, so Option B is open. Loan company:{" "}
                    {c.home.loan.lender}.
                  </>
                ) : (
                  <>
                    {c.home.loan.type} at {pct(c.home.loan.rate)} and it is not
                    assumable, so a new VA loan is the path here. Loan company:{" "}
                    {c.home.loan.lender}.
                  </>
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
              New VA loans are priced at {pct(s.vaRate)} over 30 years with
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
              Electric is estimated at {s.kwh_per_sf} kilowatt hours per square
              foot per month at ${s.electricPerKwh.toFixed(2)} per kilowatt
              hour.
            </li>
            <li>
              On an assumption, a second lender is assumed to go to{" "}
              {Math.round(s.secondMaxCltv * 100)}% of the price at{" "}
              {pct(s.secondRate)} over 30 years, and you bring the remaining{" "}
              {Math.round((1 - s.secondMaxCltv) * 100)}% in cash.
            </li>
            <li>
              Commute math assumes {s.drivers}{" "}
              {s.drivers === 1 ? "driver" : "drivers"} making a round trip{" "}
              {s.workDays} days a month, averaging {s.avgMph} mph, at $
              {s.gasCostPerMile.toFixed(2)} per mile for gas.
            </li>
            <li>
              Extra drive time and gas are measured against {s.baselineHome},
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
