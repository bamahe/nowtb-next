// =============================================================================
// MortgageCalc — Client-side mortgage + affordability calculator
// Two tabs: Monthly Payment Calculator and Affordability Calculator
// Uses the site's luxury minimalist design system (navy + steel blue)
// =============================================================================

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

// --- Currency formatter (no decimals) ---
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

// --- Format number with commas for display in text inputs ---
const fmtInput = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

// --- Calculate monthly P&I given loan amount, annual rate, and term in years ---
function calcMonthlyPI(loanAmount: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  if (monthlyRate <= 0) return loanAmount / numPayments;
  return (
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

// --- Solve for max loan amount given a monthly payment budget ---
function calcMaxLoan(monthlyBudget: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  if (monthlyRate <= 0) return monthlyBudget * numPayments;
  return (
    monthlyBudget *
    ((Math.pow(1 + monthlyRate, numPayments) - 1) /
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)))
  );
}

// --- Shared slider + number input component ---
function SliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = "currency",
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: "currency" | "percent" | "number";
  suffix?: string;
}) {
  // Display value formatting
  const displayValue =
    format === "currency"
      ? fmt(value)
      : format === "percent"
        ? `${value.toFixed(1)}%`
        : `${fmtInput(value)}${suffix}`;

  return (
    <div className="mb-6">
      {/* Label row with current value */}
      <div className="flex items-center justify-between mb-2">
        <label className="font-body text-sm font-semibold text-primary tracking-wide uppercase">
          {label}
        </label>
        <span className="font-heading text-lg text-primary">{displayValue}</span>
      </div>

      {/* Range slider — styled with accent color */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-[#e2e6ed] appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
                   [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-primary
                   [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                   [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2
                   [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:cursor-pointer"
      />

      {/* Min/Max labels */}
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted font-body">
          {format === "currency" ? fmt(min) : format === "percent" ? `${min}%` : `${min}${suffix}`}
        </span>
        <span className="text-xs text-muted font-body">
          {format === "currency" ? fmt(max) : format === "percent" ? `${max}%` : `${max}${suffix}`}
        </span>
      </div>
    </div>
  );
}

// --- Tab button component ---
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 font-body text-xs font-medium tracking-[0.2em] uppercase
                  transition-all duration-300 border-b-2
                  ${active
                    ? "border-accent text-primary bg-white"
                    : "border-transparent text-muted hover:text-primary hover:border-accent/30"
                  }`}
    >
      {children}
    </button>
  );
}

// --- Breakdown row for results display ---
function BreakdownRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        highlight ? "border-t-2 border-accent mt-2 pt-4" : "border-t border-[#e2e6ed]"
      }`}
    >
      <span className={`font-body text-sm ${highlight ? "font-semibold text-primary" : "text-muted"}`}>
        {label}
      </span>
      <span className={`font-heading ${highlight ? "text-xl text-primary" : "text-base text-dark"}`}>
        {value}
      </span>
    </div>
  );
}

// =============================================================================
// Monthly Payment Calculator
// =============================================================================
function PaymentCalculator() {
  const [price, setPrice] = useState(400000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);

  // Derived values
  const downPaymentDollars = price * (downPct / 100);
  const loanAmount = price - downPaymentDollars;
  const monthlyPI = calcMonthlyPI(loanAmount, rate, term);
  const monthlyTax = (price * 0.011) / 12; // 1.1% of home price annually
  const monthlyInsurance = 150; // flat estimate
  const monthlyPMI = downPct < 20 ? 100 : 0; // PMI if < 20% down
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;

  // Percentage of total for each component (for the visual bar)
  const piPct = (monthlyPI / totalMonthly) * 100;
  const taxPct = (monthlyTax / totalMonthly) * 100;
  const insPct = (monthlyInsurance / totalMonthly) * 100;
  const pmiPct = (monthlyPMI / totalMonthly) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left column — Inputs */}
      <div>
        <p className="heading-label mb-8">Adjust Your Loan Details</p>

        <SliderInput
          label="Home Price"
          value={price}
          min={100000}
          max={2000000}
          step={5000}
          onChange={setPrice}
          format="currency"
        />

        <SliderInput
          label="Down Payment"
          value={downPct}
          min={0}
          max={50}
          step={1}
          onChange={setDownPct}
          format="percent"
        />

        {/* Show down payment in dollars */}
        <p className="text-xs text-muted font-body -mt-4 mb-6">
          Down payment amount: {fmt(downPaymentDollars)}
        </p>

        <SliderInput
          label="Interest Rate"
          value={rate}
          min={3}
          max={10}
          step={0.1}
          onChange={setRate}
          format="percent"
        />

        {/* Loan term — button group instead of slider */}
        <div className="mb-6">
          <label className="block font-body text-sm font-semibold text-primary tracking-wide uppercase mb-3">
            Loan Term
          </label>
          <div className="flex gap-0">
            {[15, 20, 25, 30].map((t) => (
              <button
                key={t}
                onClick={() => setTerm(t)}
                className={`flex-1 py-3 font-body text-sm font-medium tracking-wider uppercase
                            border border-[#e2e6ed] transition-all duration-300
                            ${term === t
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-muted hover:text-primary hover:border-accent"
                            }`}
              >
                {t} yr
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right column — Results */}
      <div>
        <p className="heading-label mb-6">Your Estimated Payment</p>

        {/* Big total number */}
        <div className="text-center py-8 bg-white border border-[#e2e6ed]">
          <span className="block heading-label mb-2">Total Monthly Payment</span>
          <span className="block font-heading font-extralight text-5xl md:text-6xl text-primary tracking-wide">
            {fmt(totalMonthly)}
          </span>
          <span className="block font-body text-sm text-muted mt-2">/month</span>
        </div>

        {/* Visual breakdown bar */}
        <div className="flex h-3 mt-8 overflow-hidden">
          <div style={{ width: `${piPct}%` }} className="bg-primary" title="Principal & Interest" />
          <div style={{ width: `${taxPct}%` }} className="bg-accent" title="Property Tax" />
          <div style={{ width: `${insPct}%` }} className="bg-[#6b7a8d]" title="Insurance" />
          {pmiPct > 0 && (
            <div style={{ width: `${pmiPct}%` }} className="bg-[#c4a265]" title="PMI" />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-3 mb-6">
          <span className="flex items-center gap-2 text-xs font-body text-muted">
            <span className="w-3 h-3 bg-primary inline-block" /> P&I
          </span>
          <span className="flex items-center gap-2 text-xs font-body text-muted">
            <span className="w-3 h-3 bg-accent inline-block" /> Tax
          </span>
          <span className="flex items-center gap-2 text-xs font-body text-muted">
            <span className="w-3 h-3 bg-[#6b7a8d] inline-block" /> Insurance
          </span>
          {monthlyPMI > 0 && (
            <span className="flex items-center gap-2 text-xs font-body text-muted">
              <span className="w-3 h-3 bg-[#c4a265] inline-block" /> PMI
            </span>
          )}
        </div>

        {/* Line-item breakdown */}
        <div>
          <BreakdownRow label="Principal & Interest" value={fmt(monthlyPI)} />
          <BreakdownRow label="Property Tax (est. 1.1%)" value={fmt(monthlyTax)} />
          <BreakdownRow label="Homeowners Insurance (est.)" value={fmt(monthlyInsurance)} />
          {monthlyPMI > 0 && (
            <BreakdownRow label="PMI (down payment < 20%)" value={fmt(monthlyPMI)} />
          )}
          <BreakdownRow label="Total Monthly Payment" value={fmt(totalMonthly)} highlight />
        </div>

        {/* Loan summary */}
        <div className="mt-6 py-4 border-t border-[#e2e6ed]">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <span className="block text-xs text-muted font-body uppercase tracking-wider">Loan Amount</span>
              <span className="block font-heading text-lg text-primary mt-1">{fmt(loanAmount)}</span>
            </div>
            <div>
              <span className="block text-xs text-muted font-body uppercase tracking-wider">Down Payment</span>
              <span className="block font-heading text-lg text-primary mt-1">{fmt(downPaymentDollars)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Affordability Calculator — uses 28/36 DTI rule
// =============================================================================
function AffordabilityCalculator() {
  const [income, setIncome] = useState(100000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(60000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);

  // 28/36 DTI rule calculations
  const grossMonthly = income / 12;

  // 28% rule: max housing payment = 28% of gross monthly income
  const maxHousingPayment = grossMonthly * 0.28;

  // 36% rule: total debt (housing + other debts) can't exceed 36% of gross monthly
  const maxTotalDebt = grossMonthly * 0.36;
  const maxHousingFromDebtRule = maxTotalDebt - monthlyDebts;

  // The binding constraint is whichever is lower
  const effectiveMaxHousing = Math.max(0, Math.min(maxHousingPayment, maxHousingFromDebtRule));

  // Subtract estimated tax (1.1% / 12) and insurance ($150/mo) to get P&I budget
  // We need to solve: maxHome * 0.011/12 + 150 + P&I(maxHome - downPayment) = effectiveMaxHousing
  // This requires iteration since tax depends on home price
  // Simple iterative approach:
  const calcMaxHome = useCallback(() => {
    let homePrice = 200000; // starting guess
    for (let i = 0; i < 50; i++) {
      const loanAmt = Math.max(0, homePrice - downPayment);
      const pi = calcMonthlyPI(loanAmt, rate, term);
      const tax = (homePrice * 0.011) / 12;
      const insurance = 150;
      const pmi = (downPayment / homePrice) < 0.2 ? 100 : 0;
      const totalPayment = pi + tax + insurance + pmi;
      // Adjust home price based on difference
      const diff = effectiveMaxHousing - totalPayment;
      if (Math.abs(diff) < 10) break;
      homePrice += diff * 15; // convergence factor
      if (homePrice < 0) { homePrice = 0; break; }
    }
    return Math.max(0, homePrice);
  }, [downPayment, rate, term, effectiveMaxHousing]);

  const maxHomePrice = calcMaxHome();

  // Calculate the payment breakdown at the max home price
  const maxLoanAmount = Math.max(0, maxHomePrice - downPayment);
  const estMonthlyPI = calcMonthlyPI(maxLoanAmount, rate, term);
  const estMonthlyTax = (maxHomePrice * 0.011) / 12;
  const estMonthlyInsurance = 150;
  const estPMI = (downPayment / maxHomePrice) < 0.2 ? 100 : 0;
  const estTotalMonthly = estMonthlyPI + estMonthlyTax + estMonthlyInsurance + estPMI;

  // Which rule is the binding constraint?
  const bindingRule = maxHousingFromDebtRule < maxHousingPayment ? "36% total debt" : "28% housing";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left column — Inputs */}
      <div>
        <p className="heading-label mb-8">Your Financial Details</p>

        <SliderInput
          label="Annual Gross Income"
          value={income}
          min={30000}
          max={500000}
          step={5000}
          onChange={setIncome}
          format="currency"
        />

        {/* Monthly debts — number input for precision */}
        <div className="mb-6">
          <label className="block font-body text-sm font-semibold text-primary tracking-wide uppercase mb-2">
            Monthly Debts (car, student loans, credit cards)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-body">$</span>
            <input
              type="number"
              value={monthlyDebts}
              onChange={(e) => setMonthlyDebts(Math.max(0, Number(e.target.value)))}
              min={0}
              step={50}
              className="w-full pl-8 pr-4 py-3 border border-[#e2e6ed] bg-white font-body text-dark
                         focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <p className="text-xs text-muted font-body mt-1">
            Total minimum monthly payments (exclude rent/mortgage)
          </p>
        </div>

        <SliderInput
          label="Down Payment Available"
          value={downPayment}
          min={0}
          max={500000}
          step={5000}
          onChange={setDownPayment}
          format="currency"
        />

        <SliderInput
          label="Interest Rate"
          value={rate}
          min={3}
          max={10}
          step={0.1}
          onChange={setRate}
          format="percent"
        />

        {/* Loan term — button group */}
        <div className="mb-6">
          <label className="block font-body text-sm font-semibold text-primary tracking-wide uppercase mb-3">
            Loan Term
          </label>
          <div className="flex gap-0">
            {[15, 20, 25, 30].map((t) => (
              <button
                key={t}
                onClick={() => setTerm(t)}
                className={`flex-1 py-3 font-body text-sm font-medium tracking-wider uppercase
                            border border-[#e2e6ed] transition-all duration-300
                            ${term === t
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-muted hover:text-primary hover:border-accent"
                            }`}
              >
                {t} yr
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right column — Results */}
      <div>
        <p className="heading-label mb-6">What You Can Afford</p>

        {/* Big max home price */}
        <div className="text-center py-8 bg-white border border-[#e2e6ed]">
          <span className="block heading-label mb-2">Maximum Home Price</span>
          <span className="block font-heading font-extralight text-5xl md:text-6xl text-primary tracking-wide">
            {fmt(maxHomePrice)}
          </span>
          <span className="block font-body text-sm text-muted mt-2">
            Based on the {bindingRule} rule
          </span>
        </div>

        {/* DTI explanation */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="py-4 px-6 border border-[#e2e6ed] bg-white text-center">
            <span className="block text-xs text-muted font-body uppercase tracking-wider mb-1">
              28% Rule Limit
            </span>
            <span className="block font-heading text-lg text-primary">
              {fmt(maxHousingPayment)}
            </span>
            <span className="block text-xs text-muted font-body mt-1">max housing/mo</span>
          </div>
          <div className="py-4 px-6 border border-[#e2e6ed] bg-white text-center">
            <span className="block text-xs text-muted font-body uppercase tracking-wider mb-1">
              36% Rule Limit
            </span>
            <span className="block font-heading text-lg text-primary">
              {fmt(maxHousingFromDebtRule)}
            </span>
            <span className="block text-xs text-muted font-body mt-1">max housing/mo</span>
          </div>
        </div>

        {/* Payment breakdown at max price */}
        <div className="mt-8">
          <p className="text-xs text-muted font-body uppercase tracking-wider mb-4">
            Estimated Payment at {fmt(maxHomePrice)}
          </p>
          <BreakdownRow label="Principal & Interest" value={fmt(estMonthlyPI)} />
          <BreakdownRow label="Property Tax (est. 1.1%)" value={fmt(estMonthlyTax)} />
          <BreakdownRow label="Homeowners Insurance (est.)" value={fmt(estMonthlyInsurance)} />
          {estPMI > 0 && (
            <BreakdownRow label="PMI (down payment < 20%)" value={fmt(estPMI)} />
          )}
          <BreakdownRow label="Est. Monthly Payment" value={fmt(estTotalMonthly)} highlight />
        </div>

        {/* Loan summary */}
        <div className="mt-6 py-4 border-t border-[#e2e6ed]">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <span className="block text-xs text-muted font-body uppercase tracking-wider">Loan Amount</span>
              <span className="block font-heading text-lg text-primary mt-1">{fmt(maxLoanAmount)}</span>
            </div>
            <div>
              <span className="block text-xs text-muted font-body uppercase tracking-wider">Your Down Payment</span>
              <span className="block font-heading text-lg text-primary mt-1">{fmt(downPayment)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main export — tabbed calculator with CTA
// =============================================================================
export default function MortgageCalc() {
  const [activeTab, setActiveTab] = useState<"payment" | "affordability">("payment");

  return (
    <>
      {/* === Hero section === */}
      <section className="section-dark">
        <div className="container-wide text-center">
          <p className="heading-label text-accent mb-4">Financial Tools</p>
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Mortgage Calculator
          </h1>
          <div className="section-divider" />
          <p className="font-body text-accent/80 text-lg max-w-2xl mx-auto mb-8">
            Estimate your monthly payment or find out how much home you can afford.
            All calculations update instantly as you adjust the inputs.
          </p>
          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/properties/"
              className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-8 py-3 rounded text-sm hover:bg-accent/90 transition-colors"
            >
              Search Homes
            </Link>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-3 rounded text-sm hover:bg-white/10 transition-colors"
            >
              Get Pre-Approved
            </Link>
          </div>
        </div>
      </section>

      {/* === Calculator tabs === */}
      <section className="section-white">
        <div className="container-wide">
          {/* Tab navigation */}
          <div className="flex justify-center border-b border-[#e2e6ed] mb-12">
            <TabButton
              active={activeTab === "payment"}
              onClick={() => setActiveTab("payment")}
            >
              Monthly Payment
            </TabButton>
            <TabButton
              active={activeTab === "affordability"}
              onClick={() => setActiveTab("affordability")}
            >
              Affordability
            </TabButton>
          </div>

          {/* Active calculator */}
          {activeTab === "payment" ? <PaymentCalculator /> : <AffordabilityCalculator />}
        </div>
      </section>

      {/* === How it works — brief explainer === */}
      <section className="section-light">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="heading-label mb-4">How It Works</p>
            <h2 className="heading-section text-2xl md:text-3xl text-primary">
              Understanding Your Mortgage
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white border border-[#e2e6ed] p-8 text-center">
              <span className="block font-heading text-4xl font-extralight text-accent mb-4">01</span>
              <h3 className="font-heading text-lg font-light tracking-wide text-primary mb-3">
                Principal & Interest
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                The core of your payment. Principal pays down your loan balance while
                interest is the cost of borrowing. A larger down payment means a smaller loan
                and lower monthly P&I.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#e2e6ed] p-8 text-center">
              <span className="block font-heading text-4xl font-extralight text-accent mb-4">02</span>
              <h3 className="font-heading text-lg font-light tracking-wide text-primary mb-3">
                Taxes & Insurance
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                Florida property taxes average about 1.1% of your home&apos;s value per year.
                Homeowners insurance is required by your lender. Both are typically rolled into
                your monthly payment via escrow.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#e2e6ed] p-8 text-center">
              <span className="block font-heading text-4xl font-extralight text-accent mb-4">03</span>
              <h3 className="font-heading text-lg font-light tracking-wide text-primary mb-3">
                The 28/36 Rule
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                Lenders use the 28/36 guideline: your housing costs should stay under 28% of
                gross monthly income, and total debts under 36%. Our affordability calculator
                applies both rules automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === CTA section === */}
      <section className="section-dark">
        <div className="container-wide text-center max-w-3xl mx-auto">
          <p className="heading-label text-accent mb-4">Next Steps</p>
          <h2 className="heading-section text-2xl md:text-3xl text-white mb-6">
            Want to Know Exactly What You Can Afford?
          </h2>
          <div className="section-divider" />
          <p className="font-body text-accent/80 text-lg mb-8">
            These estimates are a great starting point, but every situation is unique.
            Call Barrett for a personalized consultation and a referral to a trusted local lender
            who can get you pre-approved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+18137337907"
              className="btn-primary"
            >
              Call (813) 733-7907
            </a>
            <Link href="/contact" className="btn-secondary">
              Send a Message
            </Link>
          </div>
          <p className="font-body text-accent/60 text-sm mt-6">
            Estimates are for informational purposes only and do not constitute a loan offer.
            Actual rates and payments will vary based on your credit, lender, and loan program.
          </p>
        </div>
      </section>
    </>
  );
}
