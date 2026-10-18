// =============================================================================
// CityMarketTable — verified closed-sale breakdown by property type
//
// WHY THIS EXISTS:
// The city hub already renders a stat bar, but it only surfaces 4 numbers
// (total sales, median house, house DOM, and ONE of median condo/townhome).
// `city-market-stats.ts` actually holds up to 13 verified figures per city —
// sales count, median price and median days-on-market for single-family,
// condo AND townhome, plus the all-types median. The rest were sitting in the
// data file unrendered.
//
// Thin location pages lose to competitors that publish tables of local
// numbers. This component publishes the numbers we already verified, in a
// table, so both readers and AI answer engines can extract them.
//
// HONESTY RULES (do not relax these):
//   - A median built on fewer than MIN_SAMPLE (20) closed sales is noise.
//     Those rows show the sale count but suppress price and DOM, and say why.
//   - Property types with zero sales are omitted entirely, not shown as $0.
//   - The source note always renders, including the ZIP-vs-city basis, so a
//     reader is never shown a number without knowing where it came from.
//
// If it breaks, check: getCityMarketStats returns undefined for cities with no
// reliable data (Ridge Manor, Ozona, anything under 20 sales). The caller must
// handle undefined — this component never renders a placeholder or a guess.
// =============================================================================

import {
  type CityMarketStats,
  hasReliableSample,
  statsSourceNote,
  MIN_SAMPLE,
  AS_OF,
} from "@/data/city-market-stats";

interface CityMarketTableProps {
  stats: CityMarketStats;
  cityName: string;
}

/** One row of the table, already resolved to display values. */
interface Row {
  label: string;
  sales: number;
  median: number | null;
  dom: number | null;
}

/** Format a whole-dollar price, e.g. 427000 -> "$427,000". */
function formatPrice(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export default function CityMarketTable({ stats, cityName }: CityMarketTableProps) {
  // Build the per-property-type rows. Types with no sales at all are dropped
  // rather than rendered as an empty or zero row.
  const rows: Row[] = [
    { label: "Single-family home", sales: stats.sfSales, median: stats.sfMedian, dom: stats.sfDom },
    { label: "Townhome", sales: stats.thSales, median: stats.thMedian, dom: stats.thDom },
    { label: "Condo", sales: stats.condoSales, median: stats.condoMedian, dom: stats.condoDom },
  ].filter((r) => r.sales > 0);

  // Nothing worth showing — caller should not have rendered us, but guard anyway.
  if (rows.length === 0) return null;

  // Share of market, computed off the same total the MLS gave us so the
  // percentages reconcile with the "all types" row.
  const share = (n: number) =>
    stats.totalSales > 0 ? Math.round((n / stats.totalSales) * 100) : 0;

  // True when at least one row had to suppress its median for small sample.
  const anySuppressed = rows.some((r) => !hasReliableSample(r.sales));

  return (
    <section className="bg-gray-50 py-12">
      <div className="container-wide">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2">
          What is the median home price in {cityName}, FL?
        </h2>
        <p className="font-body text-muted mb-6 max-w-3xl">
          {stats.allMedian !== null ? (
            <>
              The median {cityName} home sold for{" "}
              <strong className="text-primary">{formatPrice(stats.allMedian)}</strong>
              {stats.allDom !== null && (
                <> in <strong className="text-primary">{stats.allDom} days</strong></>
              )}{" "}
              across {stats.totalSales.toLocaleString()} closed sales over {AS_OF}. Here is
              how that breaks down by property type.
            </>
          ) : (
            <>
              Here is how {stats.totalSales.toLocaleString()} closed {cityName} sales over{" "}
              {AS_OF} break down by property type.
            </>
          )}
        </p>

        {/* Wide tables must scroll inside their own container, never the page */}
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm min-w-[560px]">
            <caption className="sr-only">
              {cityName}, Florida closed home sales by property type — median price and
              median days on market
            </caption>
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th scope="col" className="py-3 pr-4 font-heading font-bold text-primary">
                  Property type
                </th>
                <th scope="col" className="py-3 px-4 font-heading font-bold text-primary text-right">
                  Homes sold
                </th>
                <th scope="col" className="py-3 px-4 font-heading font-bold text-primary text-right">
                  Share of market
                </th>
                <th scope="col" className="py-3 px-4 font-heading font-bold text-primary text-right">
                  Median price
                </th>
                <th scope="col" className="py-3 pl-4 font-heading font-bold text-primary text-right">
                  Median days on market
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const reliable = hasReliableSample(r.sales);
                return (
                  <tr key={r.label} className="border-b border-gray-200">
                    <th scope="row" className="py-3 pr-4 font-semibold text-dark text-left">
                      {r.label}
                    </th>
                    <td className="py-3 px-4 text-right text-dark">
                      {r.sales.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-dark">
                      {share(r.sales) < 1 ? "<1%" : `${share(r.sales)}%`}
                    </td>
                    {/* Below MIN_SAMPLE a median is noise — suppress rather than mislead */}
                    <td className="py-3 px-4 text-right text-dark">
                      {reliable && r.median !== null ? formatPrice(r.median) : (
                        <span className="text-muted">Too few sales</span>
                      )}
                    </td>
                    <td className="py-3 pl-4 text-right text-dark">
                      {reliable && r.dom !== null ? r.dom : (
                        <span className="text-muted">&mdash;</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {/* All-types summary row */}
              <tr className="border-b-2 border-gray-400 bg-white/60">
                <th scope="row" className="py-3 pr-4 font-heading font-bold text-primary text-left">
                  All property types
                </th>
                <td className="py-3 px-4 text-right font-bold text-primary">
                  {stats.totalSales.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-bold text-primary">100%</td>
                <td className="py-3 px-4 text-right font-bold text-primary">
                  {stats.allMedian !== null ? formatPrice(stats.allMedian) : <span className="text-muted">&mdash;</span>}
                </td>
                <td className="py-3 pl-4 text-right font-bold text-primary">
                  {stats.allDom !== null ? stats.allDom : <span className="text-muted">&mdash;</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Provenance — a number without a source is not a fact */}
        <p className="font-body text-xs text-muted mt-4 max-w-3xl">
          Source: {statsSourceNote(stats, cityName)}
          {anySuppressed && (
            <>
              {" "}
              Property types with fewer than {MIN_SAMPLE} closed sales show the sale count
              only — a median built on a handful of sales is not meaningful.
            </>
          )}
        </p>
      </div>
    </section>
  );
}
