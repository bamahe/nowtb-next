// =============================================================================
// MiniCalc — Inline mortgage calculator for listing detail pages
// Shows estimated monthly payment based on the listing price.
// Renders inline (not floating) — placed below TourScheduler in the sidebar.
// =============================================================================

"use client";

import { useState } from "react";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function calcMonthlyPI(loan: number, rate: number, years: number): number {
  const r = rate / 100 / 12;
  const n = years * 12;
  if (r <= 0) return loan / n;
  return (loan * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
}

interface MiniCalcProps {
  /** Listing price to pre-fill */
  listingPrice: number;
}

export default function MiniCalc({ listingPrice }: MiniCalcProps) {
  // Start expanded so the estimate is visible immediately
  const [expanded, setExpanded] = useState(true);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.75);
  const [term, setTerm] = useState(30);

  const downPayment = listingPrice * (downPct / 100);
  const loanAmount = listingPrice - downPayment;
  const pi = calcMonthlyPI(loanAmount, rate, term);
  const tax = (listingPrice * 0.011) / 12; // 1.1% annual property tax estimate
  const insurance = 150;
  const pmi = downPct < 20 ? 100 : 0;
  const total = pi + tax + insurance + pmi;

  return (
    <div className="bg-white border border-border shadow-sm mt-6">
      {/* Header — always visible, toggles detail view */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-primary px-5 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-accent" />
          <span className="font-body text-white text-sm font-medium tracking-wide">
            Payment Estimate
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-body text-white font-bold text-sm">
            {fmt(Math.round(total))}/mo
          </span>
          {expanded ? (
            <ChevronUp size={16} className="text-white/50" />
          ) : (
            <ChevronDown size={16} className="text-white/50" />
          )}
        </div>
      </button>

      {/* Expandable body — sliders + breakdown */}
      {expanded && (
        <div className="p-5 space-y-4">
          {/* Price display */}
          <div>
            <p className="font-body text-[10px] tracking-[0.15em] uppercase text-muted mb-1">
              Home Price
            </p>
            <p className="font-heading text-2xl font-bold text-primary">
              {fmt(listingPrice)}
            </p>
          </div>

          {/* Down payment slider */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-body text-[10px] tracking-[0.15em] uppercase text-muted">
                Down Payment
              </label>
              <span className="font-body text-xs text-primary font-medium">
                {downPct}% ({fmt(downPayment)})
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>

          {/* Interest rate slider */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-body text-[10px] tracking-[0.15em] uppercase text-muted">
                Interest Rate
              </label>
              <span className="font-body text-xs text-primary font-medium">
                {rate.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={10}
              step={0.125}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>

          {/* Term buttons */}
          <div>
            <p className="font-body text-[10px] tracking-[0.15em] uppercase text-muted mb-2">
              Loan Term
            </p>
            <div className="flex gap-2">
              {[15, 20, 25, 30].map((y) => (
                <button
                  key={y}
                  onClick={() => setTerm(y)}
                  className={`flex-1 py-1.5 text-xs font-body font-medium border transition-colors
                    ${term === y
                      ? "bg-primary text-white border-primary"
                      : "bg-transparent text-muted border-border hover:border-primary"
                    }`}
                >
                  {y} yr
                </button>
              ))}
            </div>
          </div>

          {/* Payment breakdown */}
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between font-body text-xs">
              <span className="text-muted">Principal & Interest</span>
              <span className="text-primary font-medium">{fmt(Math.round(pi))}</span>
            </div>
            <div className="flex justify-between font-body text-xs">
              <span className="text-muted">Property Tax (est.)</span>
              <span className="text-primary font-medium">{fmt(Math.round(tax))}</span>
            </div>
            <div className="flex justify-between font-body text-xs">
              <span className="text-muted">Insurance (est.)</span>
              <span className="text-primary font-medium">{fmt(insurance)}</span>
            </div>
            {pmi > 0 && (
              <div className="flex justify-between font-body text-xs">
                <span className="text-muted">PMI (est.)</span>
                <span className="text-primary font-medium">{fmt(pmi)}</span>
              </div>
            )}
            <div className="flex justify-between font-body text-sm pt-2 border-t border-border">
              <span className="text-primary font-bold">Total Monthly</span>
              <span className="text-primary font-bold text-lg">{fmt(Math.round(total))}</span>
            </div>
          </div>

          {/* Full calculator link */}
          <Link
            href="/mortgage-calculator/"
            className="block text-center font-body text-[10px] tracking-[0.15em] uppercase text-accent hover:text-primary transition-colors"
          >
            Full Calculator →
          </Link>
        </div>
      )}
    </div>
  );
}
