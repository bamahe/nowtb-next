"use client";

/**
 * Interactive deal calculator for 1144 Hardwood Dr.
 * Sliders for purchase price, monthly rent, loan balance, and insurance.
 * Checkbox for professional management.
 * Calculates cash to close, monthly cash flow, equity, and interest saved.
 */

import { useState, useMemo } from "react";
import styles from "./deal.module.css";

// --- Loan constants ---
const ORIGINAL_RATE = 0.0325; // 3.25% VA loan
const MONTHLY_RATE = ORIGINAL_RATE / 12;
const REMAINING_MONTHS = 326; // ~27.2 years remaining
const MONTHLY_PI = 1071; // original P&I payment (fixed)
const HOA = 58;
const PROPERTY_TAX_RATE = 0.0085; // estimated annual rate on purchase price
const CLOSING_COST_RATE = 0.015; // 1.5% of purchase price
const MGMT_RATE = 0.10; // 10% of rent for professional management
const NEW_RATE = 0.0685; // today's conventional rate for comparison
const APPRAISED_VALUE = 330000; // estimated current market value

export default function Calculator() {
  // --- Slider state ---
  const [purchasePrice, setPurchasePrice] = useState(280000);
  const [monthlyRent, setMonthlyRent] = useState(2100);
  const [loanBalance, setLoanBalance] = useState(226000);
  const [insurance, setInsurance] = useState(280);
  const [proMgmt, setProMgmt] = useState(false);

  // --- Calculations ---
  const calc = useMemo(() => {
    // Cash to close
    const equityToSeller = purchasePrice - loanBalance;
    const closingCosts = Math.round(purchasePrice * CLOSING_COST_RATE);
    const cashToClose = equityToSeller + closingCosts;

    // Monthly expenses
    const monthlyTax = Math.round((purchasePrice * PROPERTY_TAX_RATE) / 12);
    const mgmtFee = proMgmt ? Math.round(monthlyRent * MGMT_RATE) : 0;
    const vacancy = Math.round(monthlyRent * 0.05); // 5% vacancy reserve
    const maintenance = Math.round(monthlyRent * 0.05); // 5% maintenance reserve
    const totalExpenses =
      MONTHLY_PI + monthlyTax + insurance + HOA + mgmtFee + vacancy + maintenance;

    // Cash flow
    const monthlyCashFlow = monthlyRent - totalExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    // Equity position
    const instantEquity = APPRAISED_VALUE - purchasePrice;

    // Interest savings vs new 6.85% loan over same balance/term
    const newMonthlyRate = NEW_RATE / 12;
    const newPI =
      (loanBalance * newMonthlyRate * Math.pow(1 + newMonthlyRate, REMAINING_MONTHS)) /
      (Math.pow(1 + newMonthlyRate, REMAINING_MONTHS) - 1);
    const monthlySavings = Math.round(newPI - MONTHLY_PI);
    const totalInterestSaved = monthlySavings * REMAINING_MONTHS;

    // Seller test — can they accept this price?
    const sellerNet = purchasePrice - loanBalance - Math.round(purchasePrice * 0.06); // 6% seller costs
    const sellerCanAccept = sellerNet >= 0;

    // Cash-on-cash return
    const cashOnCash = cashToClose > 0 ? ((annualCashFlow / cashToClose) * 100) : 0;

    // Year-one wealth build
    // Estimate principal paydown in year 1 from the amortization
    // At 3.25% on ~$226k with 326 months remaining, monthly interest ≈ balance * 0.0325/12
    const avgMonthlyInterest = Math.round(loanBalance * MONTHLY_RATE);
    const avgMonthlyPrincipal = MONTHLY_PI - avgMonthlyInterest;
    const yearOnePrincipal = avgMonthlyPrincipal * 12;

    return {
      equityToSeller,
      closingCosts,
      cashToClose,
      monthlyTax,
      mgmtFee,
      vacancy,
      maintenance,
      totalExpenses,
      monthlyCashFlow,
      annualCashFlow,
      instantEquity,
      monthlySavings,
      totalInterestSaved,
      sellerNet,
      sellerCanAccept,
      cashOnCash,
      yearOnePrincipal,
      newPI: Math.round(newPI),
    };
  }, [purchasePrice, monthlyRent, loanBalance, insurance, proMgmt]);

  // Format currency
  const fmt = (n: number) =>
    n < 0
      ? `-$${Math.abs(n).toLocaleString()}`
      : `$${n.toLocaleString()}`;

  return (
    <div className={styles.calcGrid}>
      {/* --- Left: Inputs --- */}
      <div className={styles.calcInputs}>
        <h3 className={`${styles.heading} ${styles.mb24}`} style={{ fontSize: 20 }}>
          Adjust the Numbers
        </h3>

        {/* Purchase Price */}
        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>Purchase Price</span>
            <span className={`${styles.sliderValue} ${styles.mono}`}>{fmt(purchasePrice)}</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={220000}
            max={340000}
            step={5000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            aria-label="Purchase price"
          />
        </div>

        {/* Monthly Rent */}
        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>Monthly Rent</span>
            <span className={`${styles.sliderValue} ${styles.mono}`}>{fmt(monthlyRent)}</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={1600}
            max={2800}
            step={50}
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            aria-label="Monthly rent"
          />
        </div>

        {/* Loan Balance */}
        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>Loan Balance</span>
            <span className={`${styles.sliderValue} ${styles.mono}`}>{fmt(loanBalance)}</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={200000}
            max={250000}
            step={1000}
            value={loanBalance}
            onChange={(e) => setLoanBalance(Number(e.target.value))}
            aria-label="Loan balance"
          />
        </div>

        {/* Insurance */}
        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>Monthly Insurance</span>
            <span className={`${styles.sliderValue} ${styles.mono}`}>{fmt(insurance)}</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={150}
            max={500}
            step={10}
            value={insurance}
            onChange={(e) => setInsurance(Number(e.target.value))}
            aria-label="Monthly insurance"
          />
        </div>

        {/* Professional Management Toggle */}
        <label className={styles.checkboxWrap}>
          <input
            type="checkbox"
            checked={proMgmt}
            onChange={(e) => setProMgmt(e.target.checked)}
          />
          Professional management (10% of rent)
        </label>
      </div>

      {/* --- Right: Results --- */}
      <div className={styles.calcResults}>
        <h3 className={`${styles.heading} ${styles.mb24}`} style={{ fontSize: 20 }}>
          Your Numbers
        </h3>

        {/* Cash to Close */}
        <div className={styles.resultItem}>
          <p className={styles.resultLabel}>Cash to Close</p>
          <p className={`${styles.resultBig} ${styles.mono}`}>{fmt(calc.cashToClose)}</p>
          <p className={styles.resultNote}>
            {fmt(calc.equityToSeller)} equity + {fmt(calc.closingCosts)} closing
          </p>
        </div>

        {/* Monthly Cash Flow */}
        <div className={styles.resultItem}>
          <p className={styles.resultLabel}>Monthly Cash Flow</p>
          <p
            className={`${styles.resultBig} ${styles.mono}`}
            style={{ color: calc.monthlyCashFlow >= 0 ? "#10b981" : "#ef4444" }}
          >
            {calc.monthlyCashFlow >= 0 ? "+" : ""}
            {fmt(calc.monthlyCashFlow)}
          </p>
          <p className={styles.resultNote}>
            {fmt(calc.annualCashFlow)}/yr &middot; {calc.cashOnCash.toFixed(1)}% cash-on-cash
          </p>
        </div>

        {/* Instant Equity */}
        <div className={styles.resultItem}>
          <p className={styles.resultLabel}>Instant Equity</p>
          <p className={`${styles.resultBig} ${styles.mono} ${styles.textGreen}`}>
            {fmt(calc.instantEquity)}
          </p>
          <p className={styles.resultNote}>
            Based on {fmt(APPRAISED_VALUE)} market value
          </p>
        </div>

        {/* Interest Saved */}
        <div className={styles.resultItem}>
          <p className={styles.resultLabel}>Interest Saved vs 6.85%</p>
          <p className={`${styles.resultBig} ${styles.mono} ${styles.textGreen}`}>
            {fmt(calc.totalInterestSaved)}
          </p>
          <p className={styles.resultNote}>
            {fmt(calc.monthlySavings)}/mo &middot; {fmt(MONTHLY_PI)} vs {fmt(calc.newPI)} P&amp;I
          </p>
        </div>

        {/* Monthly Breakdown Table */}
        <table className={styles.breakdownTable}>
          <tbody>
            <tr>
              <td>Gross Rent</td>
              <td className={styles.mono}>{fmt(monthlyRent)}</td>
            </tr>
            <tr>
              <td>P&amp;I (3.25%)</td>
              <td className={styles.mono}>-{fmt(MONTHLY_PI)}</td>
            </tr>
            <tr>
              <td>Property Tax</td>
              <td className={styles.mono}>-{fmt(calc.monthlyTax)}</td>
            </tr>
            <tr>
              <td>Insurance</td>
              <td className={styles.mono}>-{fmt(insurance)}</td>
            </tr>
            <tr>
              <td>HOA</td>
              <td className={styles.mono}>-{fmt(HOA)}</td>
            </tr>
            {proMgmt && (
              <tr>
                <td>Management (10%)</td>
                <td className={styles.mono}>-{fmt(calc.mgmtFee)}</td>
              </tr>
            )}
            <tr>
              <td>Vacancy Reserve (5%)</td>
              <td className={styles.mono}>-{fmt(calc.vacancy)}</td>
            </tr>
            <tr>
              <td>Maintenance Reserve (5%)</td>
              <td className={styles.mono}>-{fmt(calc.maintenance)}</td>
            </tr>
            <tr className={styles.totalRow}>
              <td>Net Cash Flow</td>
              <td className={styles.mono}>
                {calc.monthlyCashFlow >= 0 ? "+" : ""}
                {fmt(calc.monthlyCashFlow)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Year-One Wealth Build */}
        <h4
          className={styles.heading}
          style={{ fontSize: 16, marginTop: 32, marginBottom: 12 }}
        >
          Year-One Wealth Build
        </h4>
        <table className={styles.wealthTable}>
          <tbody>
            <tr>
              <td>Cash Flow</td>
              <td className={styles.mono}>{fmt(calc.annualCashFlow)}</td>
            </tr>
            <tr>
              <td>Principal Paydown</td>
              <td className={styles.mono}>~{fmt(calc.yearOnePrincipal)}</td>
            </tr>
            <tr>
              <td>Instant Equity</td>
              <td className={styles.mono}>{fmt(calc.instantEquity)}</td>
            </tr>
            <tr className={styles.totalRow}>
              <td>Total Year-One</td>
              <td className={styles.mono}>
                ~{fmt(calc.annualCashFlow + calc.yearOnePrincipal + calc.instantEquity)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Seller Test */}
        <div className={styles.sellerTest}>
          <p className={styles.sellerTestTitle}>Seller Test</p>
          <p className={styles.sellerTestText}>
            {calc.sellerCanAccept ? (
              <>
                At {fmt(purchasePrice)}, the seller nets ~{fmt(calc.sellerNet)} after paying off
                the {fmt(loanBalance)} loan balance and ~6% in closing/commission costs.
                <strong style={{ color: "#10b981" }}> This price works for the seller.</strong>
              </>
            ) : (
              <>
                At {fmt(purchasePrice)}, the seller would need to bring ~{fmt(Math.abs(calc.sellerNet))}
                to the table after paying off the {fmt(loanBalance)} loan and ~6% costs.
                <strong style={{ color: "#ef4444" }}> This price may be a tough sell.</strong>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
