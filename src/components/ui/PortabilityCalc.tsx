// =============================================================================
// PortabilityCalc — Save Our Homes portability calculator
// Client component: calculates how much SOH benefit transfers when moving
// =============================================================================

"use client";

import { useState } from "react";

// Format number as currency (no decimals)
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function PortabilityCalc() {
  // Current home values
  const [currentMarket, setCurrentMarket] = useState(400000);
  const [currentAssessed, setCurrentAssessed] = useState(280000);
  // New home value
  const [newMarket, setNewMarket] = useState(450000);

  // Calculate SOH benefit (gap between market and assessed)
  const sohBenefit = Math.max(0, currentMarket - currentAssessed);

  // Portability calculation
  const isUpsizing = newMarket >= currentMarket;
  // Upsizing: full benefit transfers (capped at $500K)
  // Downsizing: proportional — (new value / old value) * benefit
  const portedBenefit = isUpsizing
    ? Math.min(sohBenefit, 500000)
    : Math.round((newMarket / currentMarket) * sohBenefit);

  // New assessed value = new market value - ported benefit
  const newAssessed = Math.max(0, newMarket - portedBenefit);

  // Estimate tax savings (using ~1.1% effective rate for Hillsborough County)
  const taxRate = 0.011;
  const annualSavings = Math.round(portedBenefit * taxRate);

  return (
    <div className="bg-white border-2 border-primary/20 rounded-xl p-6 md:p-8 my-8">
      <h3 className="font-heading font-bold text-xl text-primary mb-2">
        Save Our Homes Portability Calculator
      </h3>
      <p className="font-body text-muted text-sm mb-6">
        Enter your current and new home values to see how much SOH benefit you can port.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Current home */}
        <div className="space-y-4">
          <p className="font-heading font-bold text-sm text-primary uppercase tracking-wide">
            Current Home
          </p>
          <div>
            <label className="font-body text-xs text-muted block mb-1">
              Market Value (what it would sell for)
            </label>
            <input
              type="text"
              value={fmt(currentMarket)}
              onChange={(e) => {
                const num = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
                setCurrentMarket(num);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 font-body text-sm text-primary focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="font-body text-xs text-muted block mb-1">
              Assessed Value (from your TRIM notice or tax bill)
            </label>
            <input
              type="text"
              value={fmt(currentAssessed)}
              onChange={(e) => {
                const num = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
                setCurrentAssessed(num);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 font-body text-sm text-primary focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* New home */}
        <div className="space-y-4">
          <p className="font-heading font-bold text-sm text-primary uppercase tracking-wide">
            New Home
          </p>
          <div>
            <label className="font-body text-xs text-muted block mb-1">
              Market Value (purchase price or appraised value)
            </label>
            <input
              type="text"
              value={fmt(newMarket)}
              onChange={(e) => {
                const num = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
                setNewMarket(num);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 font-body text-sm text-primary focus:border-accent focus:outline-none"
            />
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mt-2">
            <p className="font-body text-xs text-muted">
              {isUpsizing ? "Upsizing" : "Downsizing"} — {isUpsizing
                ? "full SOH benefit transfers (up to $500K cap)"
                : `${Math.round((newMarket / currentMarket) * 100)}% of your benefit transfers`}
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-primary/5 rounded-xl p-6">
        <p className="font-heading font-bold text-sm text-primary uppercase tracking-wide mb-4">
          Your Portability Results
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="font-heading font-bold text-xl text-primary">{fmt(sohBenefit)}</p>
            <p className="font-body text-xs text-muted mt-1">Current SOH Benefit</p>
          </div>
          <div className="text-center">
            <p className="font-heading font-bold text-xl text-accent">{fmt(portedBenefit)}</p>
            <p className="font-body text-xs text-muted mt-1">Benefit You Can Port</p>
          </div>
          <div className="text-center">
            <p className="font-heading font-bold text-xl text-primary">{fmt(newAssessed)}</p>
            <p className="font-body text-xs text-muted mt-1">New Assessed Value</p>
          </div>
          <div className="text-center">
            <p className="font-heading font-bold text-xl text-green-600">{fmt(annualSavings)}/yr</p>
            <p className="font-body text-xs text-muted mt-1">Est. Annual Tax Savings</p>
          </div>
        </div>
      </div>

      <p className="font-body text-xs text-muted mt-4">
        Estimate based on ~1.1% effective tax rate (Hillsborough County average).
        Actual savings depend on your county, millage rate, and additional exemptions.
        Contact Barrett at <a href="tel:+18137337907" className="text-accent hover:underline">(813) 733-7907</a> for
        a personalized tax impact analysis before you list or buy.
      </p>
    </div>
  );
}
