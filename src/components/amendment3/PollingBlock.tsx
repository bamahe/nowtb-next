/**
 * Polling block. Server component, no client JS.
 *
 * Fed by src/data/amendment-3/polling.json, refreshed by the pre-election
 * updater. Renders nothing when the array is empty, which is correct: no
 * polling is better than invented polling.
 *
 * THE WHOLE POINT OF THIS COMPONENT is the 60% line. A Florida constitutional
 * amendment needs 60% yes, not a majority, so a poll showing 55 yes to 26 no
 * is a measure that is LOSING despite being twenty points "ahead". Most
 * coverage reports the margin and buries the threshold. Every row here is
 * judged against 60 and labelled accordingly.
 *
 * If it breaks, check: polling.json entries need pollster, yes, and no at
 * minimum. Rows missing those are skipped rather than rendered half empty.
 */

import polling from "@/data/amendment-3/polling.json";

/** Florida constitutional amendments require at least 60% approval. */
const THRESHOLD = 60;

interface Poll {
  pollster: string;
  fieldStart?: string;
  fieldEnd?: string;
  sampleSize?: number | null;
  population?: string;
  marginOfError?: number | null;
  yes: number;
  no: number;
  undecided?: number | null;
  sourceUrl?: string;
}

function fmt(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? iso + "T12:00:00Z" : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export default function PollingBlock() {
  const polls = ((polling.polls ?? []) as Poll[]).filter(
    (p) => p.pollster && typeof p.yes === "number" && typeof p.no === "number",
  );
  if (!polls.length) return null;

  const clearing = polls.filter((p) => p.yes >= THRESHOLD).length;

  return (
    <section id="polling" className="my-10 scroll-mt-24">
      <h2 className="font-heading text-2xl font-bold text-[#0c1829]">
        What does the polling say about Amendment 3?
      </h2>
      <p className="mt-2 text-gray-700">
        {clearing} of {polls.length} recent public polls show Amendment 3 at or
        above the 60% it needs. This is the number that matters and the one most
        coverage skips: Florida constitutional amendments require 60% approval,
        not a simple majority, so a measure can lead by twenty points and still
        fail.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <caption className="sr-only">
            Recent public polling on Florida Amendment 3 against the 60 percent
            passage threshold
          </caption>
          <thead>
            <tr className="border-b-2 border-[#0c1829] text-left">
              <th scope="col" className="py-2 pr-3">Pollster</th>
              <th scope="col" className="py-2 pr-3">Field dates</th>
              <th scope="col" className="py-2 pr-3 text-right">Yes</th>
              <th scope="col" className="py-2 pr-3 text-right">No</th>
              <th scope="col" className="py-2 pr-3">Clears 60%?</th>
            </tr>
          </thead>
          <tbody>
            {polls.map((p) => {
              const clears = p.yes >= THRESHOLD;
              return (
                <tr key={p.pollster + (p.fieldEnd ?? "")} className="border-b border-gray-200">
                  <th scope="row" className="py-2 pr-3 text-left font-semibold text-[#0c1829]">
                    {p.sourceUrl ? (
                      <a
                        href={p.sourceUrl}
                        className="text-link hover:underline"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {p.pollster}
                      </a>
                    ) : (
                      p.pollster
                    )}
                    {p.sampleSize ? (
                      <span className="block text-xs font-normal text-gray-500">
                        n={p.sampleSize}
                        {p.population ? `, ${p.population}` : ""}
                        {p.marginOfError ? `, MoE ${p.marginOfError}` : ""}
                      </span>
                    ) : null}
                  </th>
                  <td className="py-2 pr-3 text-gray-700">
                    {fmt(p.fieldStart)}
                    {p.fieldStart && p.fieldEnd ? " to " : ""}
                    {fmt(p.fieldEnd)}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums font-semibold text-[#0c1829]">
                    {p.yes}%
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums text-gray-700">
                    {p.no}%
                  </td>
                  <td className="py-2 pr-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${
                        clears
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {clears ? "Yes" : "Short of 60%"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Public polling only, listed newest first, last checked{" "}
        {fmt(polling.checkedAt)}. Undecided voters are excluded from these two
        columns, so yes and no will not always total 100. Polls measure opinion
        on the day they were taken and are not a prediction.
      </p>
    </section>
  );
}
