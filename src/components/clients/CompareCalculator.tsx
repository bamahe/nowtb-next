"use client";

// =============================================================================
// CompareCalculator: the sliders on a client comparison page
//
// Lets the buyers drag cash down, the VA rate, the second loan rate and the
// insurance estimate, and watch all four homes recalculate at once. It runs the
// exact same math as the static table above it (computeAll from
// src/lib/clientCompare.ts), so the two can never drift apart.
//
// This is a client component because sliders need state. The data comes down as
// plain JSON from the server component, which is why only ClientData crosses
// the boundary and no functions do.
// =============================================================================

import { useMemo, useState } from "react";
import {
  computeAll,
  bestMonthly,
  type ClientData,
  type ComputedHome,
} from "@/lib/clientCompare";

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** One labelled slider with its current value shown on the right. */
function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  hint?: string;
}) {
  const id = `slider-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-[#0B2545]">
          {label}
        </label>
        <span className="text-sm font-bold text-[#1565C0]">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-6 w-full cursor-pointer accent-[#1565C0]"
      />
      {hint && <p className="mt-1 text-xs text-[#475569]">{hint}</p>}
    </div>
  );
}

export default function CompareCalculator({ data }: { data: ClientData }) {
  const s = data.settings;

  // Slider state. Rates are held as percents here because that is what reads
  // naturally on a slider, then converted to decimals for the math.
  const [downPct, setDownPct] = useState(0);
  const [vaRatePct, setVaRatePct] = useState(+(s.vaRate * 100).toFixed(3));
  const [secondRatePct, setSecondRatePct] = useState(
    +(s.secondRate * 100).toFixed(3)
  );
  // Starts at the average of what the file already assumes per home
  const [insMo, setInsMo] = useState(
    Math.round(
      data.homes.reduce((sum, h) => sum + h.ins, 0) / data.homes.length
    )
  );

  const rows: ComputedHome[] = useMemo(
    () =>
      computeAll(data, {
        downPct: downPct / 100,
        vaRate: vaRatePct / 100,
        secondRate: secondRatePct / 100,
        insMo,
      }),
    [data, downPct, vaRatePct, secondRatePct, insMo]
  );

  // Cheapest monthly across the four, so the winner can be highlighted
  const cheapest = Math.min(...rows.map(bestMonthly));

  function reset() {
    setDownPct(0);
    setVaRatePct(+(s.vaRate * 100).toFixed(3));
    setSecondRatePct(+(s.secondRate * 100).toFixed(3));
    setInsMo(
      Math.round(
        data.homes.reduce((sum, h) => sum + h.ins, 0) / data.homes.length
      )
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-[#0B2545]">
          Run your own numbers
        </h2>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-[#475569] hover:bg-[#F5F7FA]"
        >
          Reset
        </button>
      </div>
      <p className="mt-1 text-sm text-[#475569]">
        Drag any slider and all four homes update together. Nothing here is
        saved or sent anywhere.
      </p>

      {/* The sliders */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Slider
          label="Cash down"
          value={downPct}
          display={`${downPct}%`}
          min={0}
          max={25}
          step={1}
          onChange={setDownPct}
          hint={
            downPct === 0
              ? "A VA loan allows nothing down. Taking over a loan still needs about 10%."
              : "Applied to both options where the lender allows it."
          }
        />
        <Slider
          label="New VA rate"
          value={vaRatePct}
          display={`${vaRatePct}%`}
          min={4.5}
          max={9}
          step={0.125}
          onChange={setVaRatePct}
          hint="Only changes Option A. Taking over a loan keeps the seller's rate."
        />
        <Slider
          label="Second loan rate"
          value={secondRatePct}
          display={`${secondRatePct}%`}
          min={5}
          max={14}
          step={0.25}
          onChange={setSecondRatePct}
          hint="Only changes Option B, on the piece that covers the gap."
        />
        <Slider
          label="Insurance estimate"
          value={insMo}
          display={`${money(insMo)}/mo`}
          min={100}
          max={600}
          step={5}
          onChange={setInsMo}
          hint="Applied to every home so you can compare them on equal footing."
        />
      </div>

      {/* Live results, one card per home */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {rows.map((c) => {
          const best = bestMonthly(c);
          const isCheapest = best === cheapest;
          return (
            <div
              key={c.home.id}
              className={`rounded-lg border p-4 ${
                isCheapest
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-[#F5F7FA]"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-bold text-[#0B2545]">
                  {c.home.name}
                </h3>
                {isCheapest && (
                  <span className="whitespace-nowrap rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                    Cheapest
                  </span>
                )}
              </div>

              <p className="mt-2 text-xl font-bold text-[#1565C0]">
                {money(best)}
                <span className="ml-1 text-xs font-semibold text-[#475569]">
                  per month
                </span>
              </p>

              <dl className="mt-3 space-y-1.5 text-xs text-[#0B2545]">
                <div className="flex justify-between gap-2">
                  <dt className="text-[#475569]">Option A, new VA</dt>
                  <dd className="font-semibold">
                    {money(c.newVaAllIn)}
                    {c.newVaDown > 0 && (
                      <span className="font-normal text-[#475569]">
                        {" "}
                        + {money(c.newVaDown)} down
                      </span>
                    )}
                  </dd>
                </div>

                <div className="flex justify-between gap-2">
                  <dt className="text-[#475569]">Option B, take over loan</dt>
                  <dd className="font-semibold">
                    {c.assume ? money(c.assume.assumeAllIn) : "Not available"}
                  </dd>
                </div>

                {c.assume && (
                  <>
                    <div className="flex justify-between gap-2">
                      <dt className="text-[#475569]">Cash needed for B</dt>
                      <dd className="font-semibold">
                        {money(c.assume.cashDown)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-[#475569]">Second loan for B</dt>
                      <dd className="font-semibold">
                        {c.assume.second > 0
                          ? money(c.assume.second)
                          : "None needed"}
                      </dd>
                    </div>
                    {c.assume.saveVsNewVa > 0 && (
                      <div className="flex justify-between gap-2 border-t border-slate-200 pt-1.5">
                        <dt className="text-[#475569]">B saves per month</dt>
                        <dd className="font-bold text-emerald-700">
                          {money(c.assume.saveVsNewVa)}
                        </dd>
                      </div>
                    )}
                    {c.assume.cashFloored && (
                      <p className="pt-1 text-[#C62828]">
                        Held at {money(c.assume.cashDown)}. A second lender caps
                        total borrowing near{" "}
                        {Math.round(s.secondMaxCltv * 100)}% of price, so that is
                        the least cash this option can work with.
                      </p>
                    )}
                  </>
                )}
              </dl>
            </div>
          );
        })}
      </div>

      <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-relaxed text-[#475569]">
        Estimates for comparison only, not a loan offer. Taxes, insurance and
        electric are modeled, not quoted. Your lender will give you official
        numbers.
      </p>
    </div>
  );
}
