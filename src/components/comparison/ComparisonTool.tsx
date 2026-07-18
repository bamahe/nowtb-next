'use client';

/**
 * ComparisonTool - Interactive buyer home comparison calculator.
 * Renders a full comparison page from a Comparison data object.
 * All inputs are controlled via React state and recalculate live.
 */

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Comparison } from '@/data/buyer-comparisons/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format a number as US currency (no decimals) */
function fmt(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

/** Format number with commas, no dollar sign */
function fmtNum(n: number, decimals = 0): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Editable number input for the calculator rows */
function NumInput({
  value,
  onChange,
  step,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  step: number;
  label: string;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      step={step}
      aria-label={label}
      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-right font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 print:border-none print:bg-transparent print:p-0"
    />
  );
}

/** A highlighted callout box */
function CalloutBox({
  title,
  body,
  variant = 'navy',
}: {
  title: string;
  body: string;
  variant?: 'navy' | 'red';
}) {
  const bg = variant === 'red' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200';
  const titleColor = variant === 'red' ? 'text-red-800' : 'text-[#0B2545]';
  return (
    <div className={`my-6 rounded-lg border p-5 ${bg}`}>
      <h4 className={`mb-2 text-lg font-bold ${titleColor}`}>{title}</h4>
      <p className="text-sm leading-relaxed text-slate-700">{body}</p>
    </div>
  );
}

/** Section heading */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 mt-10 text-2xl font-bold text-[#0B2545] print:mt-6">
      {children}
    </h2>
  );
}

/** Section note text below headings */
function SectionNote({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 text-sm text-slate-500">{children}</p>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ComparisonTool({
  comparison,
}: {
  comparison: Comparison;
}) {
  const { properties, sqftA, sqftB } = comparison;
  const [propA, propB] = properties;

  // ── Upfront state ─────────────────────────────────────────────────────────
  const upfrontDefaults: Record<string, [number, number]> = {};
  comparison.upfrontRows.forEach((r) => {
    upfrontDefaults[r.id] = [r.defaultA, r.defaultB];
  });

  const [upfront, setUpfront] = useState<Record<string, [number, number]>>(upfrontDefaults);

  const setUpfrontVal = (id: string, side: 0 | 1, val: number) => {
    setUpfront((prev) => {
      const row = prev[id] ? [...prev[id]] : [0, 0];
      row[side] = val;
      return { ...prev, [id]: row as [number, number] };
    });
  };

  // ── Monthly state ─────────────────────────────────────────────────────────
  const monthlyDefaults: Record<string, [number, number]> = {};
  comparison.monthlyRows.forEach((r) => {
    monthlyDefaults[r.id] = [r.defaultA, r.defaultB];
  });

  const [monthly, setMonthly] = useState<Record<string, [number, number]>>(monthlyDefaults);

  const setMonthlyVal = (id: string, side: 0 | 1, val: number) => {
    setMonthly((prev) => {
      const row = prev[id] ? [...prev[id]] : [0, 0];
      row[side] = val;
      return { ...prev, [id]: row as [number, number] };
    });
  };

  // ── Commute state ─────────────────────────────────────────────────────────
  const cd = comparison.commuteData.defaults;
  const [commuteMinA, setCommuteMinA] = useState(cd.minutesA);
  const [commuteMinB, setCommuteMinB] = useState(cd.minutesB);
  const [commuteMilesA, setCommuteMilesA] = useState(cd.milesA);
  const [commuteMilesB, setCommuteMilesB] = useState(cd.milesB);
  const [commuteDaysA, setCommuteDaysA] = useState(cd.daysA);
  const [commuteDaysB, setCommuteDaysB] = useState(cd.daysB);
  const [commuteMpg, setCommuteMpg] = useState(cd.mpg);
  const [commuteFuel, setCommuteFuel] = useState(cd.fuelPrice);

  // ── Priority state ────────────────────────────────────────────────────────
  const [weights, setWeights] = useState<number[]>(
    comparison.priorityRows.map((r) => r.defaultWeight)
  );

  // ── Upfront calculations ──────────────────────────────────────────────────
  const upfrontCalc = useMemo(() => {
    let sumA = 0;
    let sumB = 0;
    let credA = 0;
    let credB = 0;

    comparison.upfrontRows.forEach((row) => {
      const [a, b] = upfront[row.id] || [row.defaultA, row.defaultB];
      if (row.id === 'cred') {
        credA = a;
        credB = b;
      } else {
        sumA += a;
        sumB += b;
      }
    });

    const totalA = sumA - credA;
    const totalB = sumB - credB;
    const diff = Math.abs(totalA - totalB);
    const perSqftA = totalA / sqftA;
    const perSqftB = totalB / sqftB;

    let verdict = '';
    if (diff < 2500) {
      verdict = `Within ${fmt(diff)} of each other. Basically the same money.`;
    } else if (totalA < totalB) {
      verdict = `${propA.address} is ${fmt(diff)} less total cash out the door.`;
    } else {
      verdict = `${propB.address} is ${fmt(diff)} less total cash out the door.`;
    }

    return { totalA, totalB, perSqftA, perSqftB, verdict };
  }, [upfront, comparison.upfrontRows, sqftA, sqftB, propA.address, propB.address]);

  // ── Monthly calculations ──────────────────────────────────────────────────
  const monthlyCalc = useMemo(() => {
    // Annual rows: tax, ins, cdd, hoa  |  Monthly rows: elec, gas
    const annualIds = ['tax', 'ins', 'cdd', 'hoa'];
    const monthlyIds = ['elec', 'gas'];

    let annualA = 0;
    let annualB = 0;
    let monthA = 0;
    let monthB = 0;

    comparison.monthlyRows.forEach((row) => {
      const [a, b] = monthly[row.id] || [row.defaultA, row.defaultB];
      if (annualIds.includes(row.id)) {
        annualA += a;
        annualB += b;
      } else if (monthlyIds.includes(row.id)) {
        monthA += a;
        monthB += b;
      }
    });

    const totalA = annualA / 12 + monthA;
    const totalB = annualB / 12 + monthB;
    const diff = Math.abs(totalA - totalB);

    let verdict = '';
    if (diff < 25) {
      verdict = `Within $${Math.round(diff)} of each other per month.`;
    } else if (totalA < totalB) {
      verdict = `${propA.address} is $${Math.round(diff)} less per month ($${fmtNum(Math.round(diff * 12))} per year).`;
    } else {
      verdict = `${propB.address} is $${Math.round(diff)} less per month ($${fmtNum(Math.round(diff * 12))} per year).`;
    }

    return { totalA, totalB, verdict };
  }, [monthly, comparison.monthlyRows, propA.address, propB.address]);

  // ── Commute calculations ──────────────────────────────────────────────────
  const commuteCalc = useMemo(() => {
    const hoursA = (commuteMinA * 2 * commuteDaysA * 50) / 60;
    const hoursB = (commuteMinB * 2 * commuteDaysB * 50) / 60;
    const fuelA = ((commuteMilesA * 2 * commuteDaysA * 50) / commuteMpg) * commuteFuel;
    const fuelB = ((commuteMilesB * 2 * commuteDaysB * 50) / commuteMpg) * commuteFuel;
    const hourDiff = Math.abs(hoursA - hoursB);
    const fuelDiff = Math.abs(fuelA - fuelB);

    let verdict = '';
    if (hourDiff < 8) {
      verdict = 'Close enough that commute time alone should not decide this.';
    } else if (hoursA < hoursB) {
      verdict = `${propA.address} saves about ${Math.round(hourDiff)} hours and ${fmt(Math.round(fuelDiff))} in fuel per year.`;
    } else {
      verdict = `${propB.address} saves about ${Math.round(hourDiff)} hours and ${fmt(Math.round(fuelDiff))} in fuel per year.`;
    }

    return { hoursA, hoursB, fuelA, fuelB, verdict };
  }, [commuteMinA, commuteMinB, commuteMilesA, commuteMilesB, commuteDaysA, commuteDaysB, commuteMpg, commuteFuel, propA.address, propB.address]);

  // ── Priority calculations ─────────────────────────────────────────────────
  const priorityCalc = useMemo(() => {
    let scoreA = 0;
    let scoreB = 0;

    comparison.priorityRows.forEach((row, i) => {
      const w = weights[i];
      if (row.winner === 'a') {
        scoreA += w;
      } else if (row.winner === 'b') {
        scoreB += w;
      } else if (row.winner === 'calc') {
        // Award to whichever has lower upfront total
        if (upfrontCalc.totalA < upfrontCalc.totalB) {
          scoreA += w;
        } else if (upfrontCalc.totalB < upfrontCalc.totalA) {
          scoreB += w;
        } else {
          // Split if equal
          scoreA += w / 2;
          scoreB += w / 2;
        }
      }
      // "tie" adds to neither
    });

    const diff = Math.abs(scoreA - scoreB);
    let verdict = '';
    if (diff <= 3) {
      verdict = 'Coin flip. Your priorities do not clearly favor one home over the other.';
    } else if (scoreA > scoreB) {
      verdict = `${propA.address} is ahead by ${Math.round(diff)} points based on what matters to you.`;
    } else {
      verdict = `${propB.address} is ahead by ${Math.round(diff)} points based on what matters to you.`;
    }

    return { scoreA, scoreB, verdict };
  }, [weights, comparison.priorityRows, upfrontCalc.totalA, upfrontCalc.totalB, propA.address, propB.address]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F7F4] font-[var(--font-inter)] text-slate-800">
      {/* Header */}
      <header className="bg-[#0B2545] py-10 text-white print:py-4">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold md:text-4xl">{comparison.title}</h1>
          <p className="mt-3 max-w-3xl text-base text-slate-300">
            {comparison.subtitle}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* ── Property Cards ─────────────────────────────────────────── */}
        <div className="grid gap-6 md:grid-cols-2">
          {[propA, propB].map((prop, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={prop.photo}
                  alt={prop.photoAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#0B2545]">
                  {prop.address}
                </h3>
                <p className="text-sm text-slate-500">
                  {prop.neighborhood}, {prop.zipCode}
                </p>
                <p className="mt-2 text-2xl font-bold text-[#1E5AA8]">
                  {prop.priceLabel}
                </p>
                <p className="mt-1 text-xs text-slate-500">{prop.priceNote}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Facts ──────────────────────────────────────────────────── */}
        <SectionHeading>Side by side facts</SectionHeading>
        <SectionNote>{comparison.factsSectionNote}</SectionNote>

        <div className="grid gap-6 md:grid-cols-2">
          {[propA, propB].map((prop, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="mb-3 font-bold text-[#0B2545]">{prop.address}</h3>
              <dl className="space-y-2 text-sm">
                {prop.facts.map((f, i) => (
                  <div key={i} className="flex flex-col border-b border-slate-100 pb-2 last:border-0">
                    <dt className="font-semibold text-slate-600">{f.label}</dt>
                    <dd className="text-slate-800">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        {/* ── Pros / Cons ────────────────────────────────────────────── */}
        <SectionHeading>What you gain and what you give up</SectionHeading>

        <div className="grid gap-6 md:grid-cols-2">
          {[propA, propB].map((prop, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="mb-3 font-bold text-[#0B2545]">{prop.address}</h3>

              <h4 className="mb-2 text-sm font-bold text-[#1B6B4A]">What you gain</h4>
              <ul className="mb-4 space-y-1 text-sm">
                {prop.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#1B6B4A]">+</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <h4 className="mb-2 text-sm font-bold text-[#B23A2E]">What you give up</h4>
              <ul className="space-y-1 text-sm">
                {prop.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#B23A2E]">-</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Photo Observations ─────────────────────────────────────── */}
        <SectionHeading>Curb appeal observations</SectionHeading>

        <div className="grid gap-6 md:grid-cols-2">
          {[propA, propB].map((prop, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="mb-3 font-bold text-[#0B2545]">{prop.address}</h3>

              <h4 className="mb-2 text-sm font-bold text-[#1B6B4A]">Positives</h4>
              <ul className="mb-4 space-y-1 text-sm">
                {prop.photoPros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#1B6B4A]">+</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <h4 className="mb-2 text-sm font-bold text-[#B23A2E]">Look at closely</h4>
              <ul className="space-y-1 text-sm">
                {prop.photoCons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#B23A2E]">!</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Upfront Cost Calculator ────────────────────────────────── */}
        <SectionHeading>Upfront cost calculator</SectionHeading>
        <SectionNote>{comparison.upfrontSectionNote}</SectionNote>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-bold text-[#0B2545]">Item</th>
                <th className="px-4 py-3 text-right font-bold text-[#0B2545]">
                  {propA.address}
                </th>
                <th className="px-4 py-3 text-right font-bold text-[#0B2545]">
                  {propB.address}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.upfrontRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-700">{row.label}</div>
                    <div className="text-xs text-slate-400">{row.sublabel}</div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <NumInput
                      value={upfront[row.id]?.[0] ?? row.defaultA}
                      onChange={(v) => setUpfrontVal(row.id, 0, v)}
                      step={row.step}
                      label={`${row.label} for ${propA.address}`}
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <NumInput
                      value={upfront[row.id]?.[1] ?? row.defaultB}
                      onChange={(v) => setUpfrontVal(row.id, 1, v)}
                      step={row.step}
                      label={`${row.label} for ${propB.address}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                <td className="px-4 py-3 text-[#0B2545]">Total out the door</td>
                <td className="px-4 py-3 text-right text-[#0B2545]">
                  {fmt(upfrontCalc.totalA)}
                </td>
                <td className="px-4 py-3 text-right text-[#0B2545]">
                  {fmt(upfrontCalc.totalB)}
                </td>
              </tr>
              <tr className="bg-slate-50 text-xs text-slate-500">
                <td className="px-4 pb-3">Cost per sq ft</td>
                <td className="px-4 pb-3 text-right">
                  ${upfrontCalc.perSqftA.toFixed(2)}/sq ft
                </td>
                <td className="px-4 pb-3 text-right">
                  ${upfrontCalc.perSqftB.toFixed(2)}/sq ft
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Upfront verdict */}
        <div className="mt-4 rounded-lg border border-[#1E5AA8]/20 bg-[#1E5AA8]/5 p-4">
          <p className="font-semibold text-[#0B2545]">{upfrontCalc.verdict}</p>
        </div>

        {/* ── Monthly Cost Calculator ────────────────────────────────── */}
        <SectionHeading>Monthly cost calculator</SectionHeading>
        <SectionNote>{comparison.monthlySectionNote}</SectionNote>

        {comparison.monthlyCallout && (
          <CalloutBox
            title={comparison.monthlyCallout.title}
            body={comparison.monthlyCallout.body}
            variant="navy"
          />
        )}

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-bold text-[#0B2545]">Item</th>
                <th className="px-4 py-3 text-right font-bold text-[#0B2545]">
                  {propA.address}
                </th>
                <th className="px-4 py-3 text-right font-bold text-[#0B2545]">
                  {propB.address}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.monthlyRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-700">{row.label}</div>
                    <div className="text-xs text-slate-400">{row.sublabel}</div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <NumInput
                      value={monthly[row.id]?.[0] ?? row.defaultA}
                      onChange={(v) => setMonthlyVal(row.id, 0, v)}
                      step={row.step}
                      label={`${row.label} for ${propA.address}`}
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <NumInput
                      value={monthly[row.id]?.[1] ?? row.defaultB}
                      onChange={(v) => setMonthlyVal(row.id, 1, v)}
                      step={row.step}
                      label={`${row.label} for ${propB.address}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                <td className="px-4 py-3 text-[#0B2545]">Total per month</td>
                <td className="px-4 py-3 text-right text-[#0B2545]">
                  {fmt(Math.round(monthlyCalc.totalA))}
                </td>
                <td className="px-4 py-3 text-right text-[#0B2545]">
                  {fmt(Math.round(monthlyCalc.totalB))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Monthly verdict */}
        <div className="mt-4 rounded-lg border border-[#1E5AA8]/20 bg-[#1E5AA8]/5 p-4">
          <p className="font-semibold text-[#0B2545]">{monthlyCalc.verdict}</p>
        </div>

        {/* ── Commute Calculator ─────────────────────────────────────── */}
        <div className="print:break-before-page">
          <SectionHeading>Commute calculator</SectionHeading>
          <SectionNote>
            From {comparison.commuteData.origin} ({comparison.commuteData.originAddress})
          </SectionNote>

          {/* Route info cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {[comparison.commuteData.propertyA, comparison.commuteData.propertyB].map(
              (cd2, idx) => {
                const prop = idx === 0 ? propA : propB;
                return (
                  <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
                    <h4 className="mb-2 font-bold text-[#0B2545]">{prop.address}</h4>
                    <dl className="space-y-1">
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Distance</dt>
                        <dd>{cd2.distance}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Midday</dt>
                        <dd>{cd2.middayDrive}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Rush hour</dt>
                        <dd>{cd2.rushHourDrive}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Route</dt>
                        <dd className="text-right">{cd2.route}</dd>
                      </div>
                    </dl>
                    <p className="mt-2 text-xs text-slate-400">{cd2.trafficNotes}</p>
                  </div>
                );
              }
            )}
          </div>

          {/* Commute inputs */}
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white print:hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-bold text-[#0B2545]">Input</th>
                  <th className="px-4 py-3 text-right font-bold text-[#0B2545]">
                    {propA.address}
                  </th>
                  <th className="px-4 py-3 text-right font-bold text-[#0B2545]">
                    {propB.address}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-700">Minutes one way</td>
                  <td className="px-4 py-2 text-right">
                    <NumInput value={commuteMinA} onChange={setCommuteMinA} step={1} label="Minutes one way A" />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <NumInput value={commuteMinB} onChange={setCommuteMinB} step={1} label="Minutes one way B" />
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-700">Miles one way</td>
                  <td className="px-4 py-2 text-right">
                    <NumInput value={commuteMilesA} onChange={setCommuteMilesA} step={0.5} label="Miles one way A" />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <NumInput value={commuteMilesB} onChange={setCommuteMilesB} step={0.5} label="Miles one way B" />
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-700">Days per week</td>
                  <td className="px-4 py-2 text-right">
                    <NumInput value={commuteDaysA} onChange={setCommuteDaysA} step={1} label="Days per week A" />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <NumInput value={commuteDaysB} onChange={setCommuteDaysB} step={1} label="Days per week B" />
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-700">Vehicle MPG</td>
                  <td className="px-4 py-2 text-right" colSpan={2}>
                    <NumInput value={commuteMpg} onChange={setCommuteMpg} step={1} label="Vehicle MPG" />
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-700">Fuel price per gallon</td>
                  <td className="px-4 py-2 text-right" colSpan={2}>
                    <NumInput value={commuteFuel} onChange={setCommuteFuel} step={0.1} label="Fuel price" />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                  <td className="px-4 py-3 text-[#0B2545]">Hours per year</td>
                  <td className="px-4 py-3 text-right text-[#0B2545]">
                    {Math.round(commuteCalc.hoursA)}
                  </td>
                  <td className="px-4 py-3 text-right text-[#0B2545]">
                    {Math.round(commuteCalc.hoursB)}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="px-4 pb-3 text-[#0B2545]">Fuel per year</td>
                  <td className="px-4 pb-3 text-right text-[#0B2545]">
                    {fmt(Math.round(commuteCalc.fuelA))}
                  </td>
                  <td className="px-4 pb-3 text-right text-[#0B2545]">
                    {fmt(Math.round(commuteCalc.fuelB))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Commute verdict */}
          <div className="mt-4 rounded-lg border border-[#1E5AA8]/20 bg-[#1E5AA8]/5 p-4">
            <p className="font-semibold text-[#0B2545]">{commuteCalc.verdict}</p>
          </div>
        </div>

        {/* ── Build Year Comparison ──────────────────────────────────── */}
        <SectionHeading>2013 vs 2020 build comparison</SectionHeading>
        <SectionNote>{comparison.buildYearSectionNote}</SectionNote>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-bold text-[#0B2545]">Component</th>
                <th className="px-4 py-3 text-left font-bold text-[#0B2545]">
                  {propA.address} (2013)
                </th>
                <th className="px-4 py-3 text-left font-bold text-[#0B2545]">
                  {propB.address} (2020)
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.buildYearRows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-700">{row.component}</td>
                  <td className="px-4 py-3 text-slate-600">{row.propertyA}</td>
                  <td className="px-4 py-3 text-slate-600">{row.propertyB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CalloutBox
          title={comparison.buildYearCallout.title}
          body={comparison.buildYearCallout.body}
          variant="navy"
        />

        {/* ── Priority Scoring ───────────────────────────────────────── */}
        <div className="print:break-before-page">
          <SectionHeading>Priority scoring</SectionHeading>
          <SectionNote>{comparison.prioritySectionNote}</SectionNote>

          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
            {comparison.priorityRows.map((row, i) => (
              <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">{row.label}</span>
                  <span className="text-xs text-slate-400">
                    {row.winner === 'calc' ? row.winnerLabel : `Favors ${row.winnerLabel}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 print:hidden">0</span>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={weights[i]}
                    onChange={(e) => {
                      const newWeights = [...weights];
                      newWeights[i] = Number(e.target.value);
                      setWeights(newWeights);
                    }}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#1E5AA8] print:hidden"
                    aria-label={`Weight for ${row.label}`}
                  />
                  <span className="text-xs text-slate-400 print:hidden">10</span>
                  <span className="w-8 text-center text-sm font-bold text-[#0B2545]">
                    {weights[i]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Priority scores */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
              <p className="text-sm text-slate-500">{propA.address}</p>
              <p className="text-3xl font-bold text-[#0B2545]">{Math.round(priorityCalc.scoreA)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
              <p className="text-sm text-slate-500">{propB.address}</p>
              <p className="text-3xl font-bold text-[#0B2545]">{Math.round(priorityCalc.scoreB)}</p>
            </div>
          </div>

          {/* Priority verdict */}
          <div className="mt-4 rounded-lg border border-[#1E5AA8]/20 bg-[#1E5AA8]/5 p-4">
            <p className="font-semibold text-[#0B2545]">{priorityCalc.verdict}</p>
          </div>
        </div>

        {/* ── Final Callout ──────────────────────────────────────────── */}
        <div className="mt-10 rounded-lg border-2 border-[#0B2545] bg-[#0B2545] p-6 text-white">
          <h3 className="mb-3 text-xl font-bold">{comparison.finalCallout.title}</h3>
          <p className="leading-relaxed text-slate-200">{comparison.finalCallout.body}</p>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <p className="font-semibold text-[#0B2545]">
            Barrett Henry, Broker Associate, REMAX Collective. REALTOR(R).
          </p>
          <p className="mt-1">
            MOVE WITH CONFIDENCE. Straight talk. Smart Strategy.
          </p>
          <p className="mt-1">
            <a href="tel:8137337907" className="text-[#1E5AA8] hover:underline">
              (813) 733-7907
            </a>{' '}
            |{' '}
            <a href="mailto:barrett@nowtb.com" className="text-[#1E5AA8] hover:underline">
              barrett@nowtb.com
            </a>
          </p>
          <p className="mt-4 text-xs text-slate-400">
            Repair estimates, insurance and tax figures are planning estimates only, not quotes.
            Verify all MLS data, HOA, CDD and tax amounts independently before making a decision.
          </p>
        </footer>
      </main>

      {/* ── Print styles ───────────────────────────────────────────────── */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-size: 11px !important;
          }
          .bg-\\[\\#F8F7F4\\] {
            background: white !important;
          }
          .bg-\\[\\#0B2545\\] {
            background: #0B2545 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          input[type='number'],
          input[type='range'] {
            display: none !important;
          }
          /* Show values as static text in print (handled by print:hidden on sliders) */
          .print\\:hidden {
            display: none !important;
          }
          .print\\:break-before-page {
            break-before: page;
          }
          .print\\:mt-6 {
            margin-top: 1.5rem !important;
          }
          .print\\:py-4 {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }
          /* Keep two-column grid in print */
          .md\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
}
