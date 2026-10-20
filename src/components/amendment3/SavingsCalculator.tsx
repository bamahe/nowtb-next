"use client";

/**
 * Amendment 3 savings calculator.
 *
 * All the arithmetic lives in src/lib/amendment3.ts so it can be unit tested
 * without React. This file is only inputs and presentation.
 *
 * If it breaks, check: the millage presets in src/lib/amendment3.ts. County
 * rates are certified once a year and will need refreshing each fall.
 */

import { useMemo, useState } from "react";
import {
  MILLAGE_DISTRICTS,
  DEFAULT_DISTRICT_ID,
  computeAmendment3,
  currentExemption,
  dollars,
} from "@/lib/amendment3";

export default function SavingsCalculator() {
  const [assessedValue, setAssessedValue] = useState(350_000);
  const [districtId, setDistrictId] = useState(DEFAULT_DISTRICT_ID);
  const [homesteaded, setHomesteaded] = useState(true);
  const [residentBeforeCutoff, setResidentBeforeCutoff] = useState(true);
  const [customMode, setCustomMode] = useState(false);
  const [customNonSchool, setCustomNonSchool] = useState("");
  const [customSchool, setCustomSchool] = useState("");

  const district =
    MILLAGE_DISTRICTS.find((d) => d.id === districtId) ?? MILLAGE_DISTRICTS[0];

  // In custom mode the homeowner types the rates straight off their TRIM
  // notice, which is always more accurate than any preset we can ship.
  const schoolMills = customMode
    ? parseFloat(customSchool) || 0
    : district.school;
  const nonSchoolMills = customMode
    ? parseFloat(customNonSchool) || 0
    : district.nonSchool;

  const result = useMemo(
    () =>
      computeAmendment3({
        assessedValue,
        schoolMills,
        nonSchoolMills,
        homesteaded,
        residentBeforeCutoff,
      }),
    [assessedValue, schoolMills, nonSchoolMills, homesteaded, residentBeforeCutoff],
  );

  const exemptNow = homesteaded ? currentExemption(assessedValue) : 0;
  const ratesMissing = customMode && (!nonSchoolMills || !schoolMills);

  return (
    <div className="my-10 rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-[#0c1829] px-6 py-4 rounded-t-lg">
        <h3 className="font-heading text-xl font-bold text-white">
          What would Amendment 3 do to your tax bill?
        </h3>
        <p className="mt-1 text-sm text-gray-300">
          Enter your assessed value, not your market value. You will find it on
          your TRIM notice.
        </p>
      </div>

      <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
        {/* ------------------------------ inputs ------------------------- */}
        <div className="space-y-5">
          <div>
            <label
              htmlFor="amd3-av"
              className="block text-sm font-semibold text-[#0c1829]"
            >
              County assessed value
            </label>
            <output
              htmlFor="amd3-av"
              className="mt-1 block font-heading text-3xl font-bold text-[#0c1829]"
            >
              {dollars(assessedValue)}
            </output>
            <input
              id="amd3-av"
              type="range"
              min={50_000}
              max={1_500_000}
              step={5_000}
              value={assessedValue}
              onChange={(e) => setAssessedValue(Number(e.target.value))}
              className="mt-2 w-full accent-[#0c1829]"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$50k</span>
              <span>$1.5M</span>
            </div>
          </div>

          <div>
            <label
              htmlFor="amd3-district"
              className="block text-sm font-semibold text-[#0c1829]"
            >
              Where is the home?
            </label>
            <select
              id="amd3-district"
              value={customMode ? "custom" : districtId}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setCustomMode(true);
                } else {
                  setCustomMode(false);
                  setDistrictId(e.target.value);
                }
              }}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {MILLAGE_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.county}: {d.label}
                </option>
              ))}
              <option value="custom">
                Somewhere else, I will enter my own rates
              </option>
            </select>

            {customMode ? (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="amd3-ns"
                    className="block text-xs font-semibold text-gray-700"
                  >
                    Non school mills
                  </label>
                  <input
                    id="amd3-ns"
                    type="number"
                    step="0.0001"
                    inputMode="decimal"
                    value={customNonSchool}
                    onChange={(e) => setCustomNonSchool(e.target.value)}
                    placeholder="11.9100"
                    className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="amd3-sc"
                    className="block text-xs font-semibold text-gray-700"
                  >
                    School mills
                  </label>
                  <input
                    id="amd3-sc"
                    type="number"
                    step="0.0001"
                    inputMode="decimal"
                    value={customSchool}
                    onChange={(e) => setCustomSchool(e.target.value)}
                    placeholder="6.3340"
                    className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                  />
                </div>
                <p className="col-span-2 text-xs text-gray-500">
                  Both rates are printed on your TRIM notice. Manatee is not in
                  the list above because we could not confirm a certified
                  countywide rate, and a wrong number is worse than none.
                </p>
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-500">
                {district.nonSchool.toFixed(4)} non school mills,{" "}
                {district.school.toFixed(4)} school mills. Source:{" "}
                {district.source}.
              </p>
            )}
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-[#0c1829]">
              About you
            </legend>
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={homesteaded}
                onChange={(e) => setHomesteaded(e.target.checked)}
                className="mt-0.5 accent-[#0c1829]"
              />
              <span>This is my homesteaded primary residence</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={residentBeforeCutoff}
                onChange={(e) => setResidentBeforeCutoff(e.target.checked)}
                disabled={!homesteaded}
                className="mt-0.5 accent-[#0c1829] disabled:opacity-40"
              />
              <span>
                I was a permanent Florida resident on December 31, 2026
              </span>
            </label>
          </fieldset>
        </div>

        {/* ------------------------------ results ------------------------ */}
        <div className="rounded-lg bg-gray-50 p-5">
          {ratesMissing ? (
            <p className="text-sm text-gray-600">
              Enter both millage rates from your TRIM notice to see your
              numbers.
            </p>
          ) : !homesteaded ? (
            <div className="space-y-3 text-sm text-gray-700">
              <p className="font-semibold text-[#0c1829]">
                No change to your exemption.
              </p>
              <p>
                The larger homestead exemption only applies to a homesteaded
                primary residence. What Amendment 3 does change for you is the
                annual assessment cap, which drops from 10% to 5% on non school
                levies. That slows how fast your assessed value can climb in a
                rising market. It does nothing in a year when values grow less
                than 5%.
              </p>
              <p className="text-xs text-gray-500">
                Estimated current annual tax at this value:{" "}
                {dollars(result.currentLaw.totalTax)}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {result.isIncrease && (
                <div className="rounded border-l-4 border-red-500 bg-red-50 p-3">
                  <p className="text-sm font-semibold text-red-800">
                    For you, this is an increase, not a cut.
                  </p>
                  <p className="mt-1 text-xs text-red-700">
                    Because you were not a Florida resident on December 31,
                    2026, you get the plain $50,000 for your first four years.
                    That is less than the $51,411 you would have had under
                    today&rsquo;s rules.
                  </p>
                </div>
              )}

              <Row
                label="Exempt today"
                value={dollars(exemptNow)}
                sub="against non school taxes"
              />
              <Row
                label="Exempt in 2027"
                value={dollars(result.am3_2027.exemption)}
                sub="replaces, does not stack"
              />
              <Row
                label="Exempt in 2028"
                value={dollars(result.am3_2028.exemption)}
              />

              <hr className="border-gray-300" />

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Estimated change to your annual bill
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <Savings year={2027} amount={result.savings2027} />
                  <Savings year={2028} amount={result.savings2028} />
                </div>
              </div>

              <div className="rounded bg-white p-3 text-xs text-gray-600">
                <p className="font-semibold text-[#0c1829]">
                  Your school taxes do not change.
                </p>
                <p className="mt-1">
                  School millage still applies to{" "}
                  {dollars(result.currentLaw.schoolTaxable)} of value, about{" "}
                  {dollars(result.currentLaw.schoolTax)} a year, before and
                  after Amendment 3.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4 text-xs leading-relaxed text-gray-500">
        <p>
          <strong>This is an estimate, not tax advice.</strong> It assumes you
          qualify for the full exemption, that your millage rates do not change,
          and it excludes non ad valorem assessments for things like fire,
          stormwater and solid waste, which Amendment 3 does not reduce. If
          local governments raise millage to replace lost revenue, your savings
          shrink. Confirm your own numbers with your county property appraiser.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-sm text-gray-600">
        {label}
        {sub ? (
          <span className="block text-xs text-gray-400">{sub}</span>
        ) : null}
      </span>
      <span className="font-heading text-lg font-bold text-[#0c1829]">
        {value}
      </span>
    </div>
  );
}

function Savings({ year, amount }: { year: number; amount: number }) {
  const isCut = amount >= 0;
  return (
    <div
      className={`rounded p-3 text-center ${
        isCut ? "bg-green-50" : "bg-red-50"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {year}
      </p>
      <p
        className={`font-heading text-2xl font-bold ${
          isCut ? "text-green-700" : "text-red-700"
        }`}
      >
        {isCut ? "-" : "+"}
        {dollars(Math.abs(amount))}
      </p>
      <p className="text-xs text-gray-500">{isCut ? "lower" : "higher"}</p>
    </div>
  );
}
