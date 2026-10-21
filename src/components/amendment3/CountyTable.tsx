/**
 * Tampa Bay savings table. Server component, no client JS.
 *
 * Why this exists separately from the calculator: a table of real numbers
 * with a source on every row is the single most extractable format for AI
 * answer engines and featured snippets, and a client-side calculator renders
 * as an empty shell to a crawler. The calculator is for the reader, this is
 * for the machine, and both run off the same vetted math in lib/amendment3.
 *
 * Every number here is COMPUTED at build time from the certified millage in
 * src/lib/amendment3.ts. Nothing is typed in by hand, so a millage
 * correction updates the table automatically.
 *
 * If it breaks, check: MILLAGE_DISTRICTS in src/lib/amendment3.ts. County
 * rates are certified each fall and go stale.
 */

import {
  MILLAGE_DISTRICTS,
  computeAmendment3,
  dollars,
} from "@/lib/amendment3";

/** Representative assessed value. Above $250,000 every district shows the
 *  full effect, which makes the columns comparable across counties. */
const SAMPLE_AV = 350_000;

export default function CountyTable() {
  const rows = MILLAGE_DISTRICTS.map((d) => {
    const r = computeAmendment3({
      assessedValue: SAMPLE_AV,
      schoolMills: d.school,
      nonSchoolMills: d.nonSchool,
      homesteaded: true,
      residentBeforeCutoff: true,
    });
    return { d, r };
  });

  return (
    <section id="county-table" className="my-10 scroll-mt-24">
      <h2 className="font-heading text-2xl font-bold text-[#0c1829]">
        What would Amendment 3 save across Tampa Bay?
      </h2>
      <p className="mt-2 text-gray-700">
        Estimated annual savings on a home assessed at {dollars(SAMPLE_AV)} with
        a homestead exemption, for an owner who was already a Florida resident
        on December 31, 2026. Savings come only from the non-school portion of
        the bill, which is why the Polk and Pasco numbers are smaller: their
        non-school rates are lower, not their taxes.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">
            Estimated Amendment 3 annual savings by Tampa Bay taxing district on
            a {dollars(SAMPLE_AV)} assessed value
          </caption>
          <thead>
            <tr className="border-b-2 border-[#0c1829] text-left">
              <th scope="col" className="py-2 pr-3">County</th>
              <th scope="col" className="py-2 pr-3">Taxing district</th>
              <th scope="col" className="py-2 pr-3 text-right">Non-school mills</th>
              <th scope="col" className="py-2 pr-3 text-right">2027 saving</th>
              <th scope="col" className="py-2 pr-3 text-right">2028 saving</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ d, r }) => (
              <tr key={d.id} className="border-b border-gray-200">
                <th scope="row" className="py-2 pr-3 text-left font-semibold text-[#0c1829]">
                  {d.county}
                </th>
                <td className="py-2 pr-3 text-gray-700">{d.label}</td>
                <td className="py-2 pr-3 text-right tabular-nums text-gray-700">
                  {d.nonSchool.toFixed(4)}
                </td>
                <td className="py-2 pr-3 text-right font-semibold tabular-nums text-[#0c1829]">
                  {dollars(r.savings2027)}
                </td>
                <td className="py-2 pr-3 text-right font-semibold tabular-nums text-[#0c1829]">
                  {dollars(r.savings2028)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 space-y-2 text-xs text-gray-500">
        <p>
          <strong>How these are calculated.</strong> Amendment 3 adds about
          $98,589 of exempt value in 2027 and about $198,589 in 2028, against
          non-school millage only. Those are the gaps between the new $150,000
          and $250,000 exemptions and the $51,411 a Florida homestead already
          gets today. Saving equals the added exempt value times the non-school
          rate.
        </p>
        <p>
          <strong>Three assumptions you should know about.</strong> It assumes
          you qualify for the full exemption, that millage rates do not change,
          and it excludes non ad valorem assessments for fire, stormwater and
          solid waste, which Amendment 3 does not reduce. If your city or
          county raises millage to replace lost revenue, the saving shrinks.
        </p>
        <p>
          <strong>Manatee is not listed.</strong> We could not confirm a
          certified countywide aggregate rate from a primary source, and a
          wrong number helps nobody. Manatee owners can enter their own rates
          from their TRIM notice in the calculator above.
        </p>
        <p className="pt-1">
          Millage sources:{" "}
          {Array.from(new Set(MILLAGE_DISTRICTS.map((d) => d.source))).join("; ")}.
        </p>
      </div>
    </section>
  );
}
