/**
 * 1144 Hardwood Dr, Valrico — Assumable VA Loan Deal Analysis
 * Standalone investor page with its own design system.
 * Uses CSS Modules to keep styles scoped; calculator is a client component.
 */

import type { Metadata } from "next";
import styles from "./deal.module.css";
import Calculator from "./Calculator";

// --- Metadata (noindex — private investor analysis) ---
export const metadata: Metadata = {
  title: "1144 Hardwood Dr, Valrico | Assumable 3.25% VA Loan Analysis",
  description:
    "Private investor deal analysis for 1144 Hardwood Dr, Valrico FL 33596. Assumable 3.25% VA loan, interactive calculator, comp data, Section 8 analysis, and bid strategy.",
  robots: { index: false, follow: false },
};

// --- Zillow link helper ---
function ZillowLink({
  address,
  href,
  children,
}: {
  address?: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.compLink}
      title={`View ${address ?? ""} on Zillow`}
    >
      {children}
    </a>
  );
}

export default function HardwoodDrDealPage() {
  return (
    <div className={styles.dealPage}>
      {/* Google Fonts for this standalone page */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;700;800&family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ========== HERO ========== */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.heroLabel}>Assumable VA Loan &middot; Investment Analysis</span>
          <h1 className={`${styles.heading} ${styles.heroAddress}`}>
            1144 Hardwood Dr
          </h1>
          <p className={styles.heroSubline}>Valrico, FL 33596 &middot; Bloomingdale East</p>

          <div className={styles.thesisBox}>
            <p className={styles.thesisTitle}>The Thesis</p>
            <h2 className={`${styles.heading} ${styles.thesisBig}`}>
              3.25% rate = $394/mo savings
            </h2>
            <p className={styles.thesisDetail}>
              Assuming this VA loan at 3.25% instead of financing at today&apos;s 6.85% saves
              $394 every month — that&apos;s $128,444 in interest over the remaining 27 years.
              The rate alone makes this deal. The below-market price is the bonus.
            </p>
          </div>
        </div>
      </section>

      {/* ========== DEADLINE BANNER ========== */}
      <div className={styles.deadlineBanner}>
        OFFER DEADLINE: TUESDAY, AUGUST 4, 2026 AT 2:00 PM
      </div>

      {/* ========== WHAT THE COMPS CHANGED ========== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={`${styles.heading} ${styles.sectionTitle}`}>
            What the Comps Changed
          </h2>
          <p className={styles.sectionSubtitle}>
            Two new closed sales shifted the math. Here&apos;s the updated picture.
          </p>

          {/* Verdict flags */}
          <div className={styles.verdictGrid}>
            <div className={styles.verdictCard}>
              <p className={styles.verdictLabel}>Previous Median</p>
              <p className={styles.verdictValue}>$335,000</p>
              <p className={styles.verdictNote}>Before the two new comps closed</p>
            </div>
            <div className={styles.verdictCard}>
              <p className={styles.verdictLabel}>Updated Median</p>
              <p className={styles.verdictValue}>$330,000</p>
              <p className={styles.verdictNote}>With 1032 &amp; 1014 Hardwood included</p>
            </div>
            <div className={styles.verdictCard}>
              <p className={styles.verdictLabel}>Suggested Offer Range</p>
              <p className={styles.verdictValue}>$275K – $285K</p>
              <p className={styles.verdictNote}>83 – 86% of updated median</p>
            </div>
            <div className={styles.verdictCard}>
              <p className={styles.verdictLabel}>Rate Advantage</p>
              <p className={styles.verdictValue}>3.60% saved</p>
              <p className={styles.verdictNote}>3.25% vs today&apos;s 6.85% conventional</p>
            </div>
          </div>

          {/* Decode cards */}
          <div className={styles.decodeGrid}>
            <div className={styles.decodeCard}>
              <h3 className={styles.decodeTitle}>1032 Hardwood Dr — $325,000</h3>
              <p className={styles.decodeText}>
                Closed 7/3/2026. Same street, same subdivision. 3BR/2BA, 1,646 sqft — nearly
                identical to the subject. This is the strongest direct comp. Sold at $197/sqft,
                which is below the subdivision average of $209/sqft. Suggests the
                market is softening slightly for this product type.
              </p>
            </div>
            <div className={styles.decodeCard}>
              <h3 className={styles.decodeTitle}>1014 Hardwood Dr — $305,000</h3>
              <p className={styles.decodeText}>
                Closed 6/18/2026. Also same street. 3BR/2BA, 1,371 sqft. Smaller footprint
                explains the lower price, but the $/sqft ($222) actually runs higher — likely
                updated interior. At $305K for a smaller home, it supports a $275-285K offer
                on the subject&apos;s 1,646 sqft needing cosmetic work.
              </p>
            </div>
            <div className={styles.decodeCard}>
              <h3 className={styles.decodeTitle}>What This Means for Your Offer</h3>
              <p className={styles.decodeText}>
                The two new comps pulled the median down $5K and confirmed that unrenovated
                homes on Hardwood Dr trade in the low-$300s. A $280K offer represents
                ~85% of the updated median — aggressive but justified given the cosmetic
                condition and the rate advantage you&apos;re bringing as an assumable buyer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== INTERACTIVE CALCULATOR ========== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={`${styles.heading} ${styles.sectionTitle}`}>
            Run Your Numbers
          </h2>
          <p className={styles.sectionSubtitle}>
            Adjust the sliders to see how different scenarios affect your return.
          </p>
          <Calculator />
        </div>
      </section>

      {/* ========== COMP TABLES ========== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={`${styles.heading} ${styles.sectionTitle}`}>
            Comparable Sales
          </h2>
          <p className={styles.sectionSubtitle}>
            Inside the subdivision and within a half-mile radius. All closed within 6 months.
          </p>

          {/* --- Inside Bloomingdale East --- */}
          <h3 className={styles.heading} style={{ fontSize: 18, marginBottom: 12 }}>
            Inside Bloomingdale East (Same Subdivision)
          </h3>
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Sold</th>
                  <th>Price</th>
                  <th>Bed/Bath</th>
                  <th>SqFt</th>
                  <th>$/SqFt</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.highlightRow}>
                  <td>1144 Hardwood Dr</td>
                  <td>—</td>
                  <td>$280,000*</td>
                  <td>3/2</td>
                  <td>1,646</td>
                  <td>$170</td>
                  <td><span className={styles.tagBlue}>Subject</span></td>
                </tr>
                <tr>
                  <td>
                    <ZillowLink
                      address="1125 Hardwood Dr"
                      href="https://www.zillow.com/homes/1125-Hardwood-Dr-Valrico-FL-33596_rb/"
                    >
                      1125 Hardwood Dr
                    </ZillowLink>
                  </td>
                  <td>5/2026</td>
                  <td>$340,000</td>
                  <td>3/2</td>
                  <td>1,646</td>
                  <td>$207</td>
                  <td><span className={styles.tagGreen}>Closed</span></td>
                </tr>
                <tr>
                  <td>
                    <ZillowLink
                      address="4704 Stove Pl"
                      href="https://www.zillow.com/homes/4704-Stove-Pl-Valrico-FL-33596_rb/"
                    >
                      4704 Stove Pl
                    </ZillowLink>
                  </td>
                  <td>4/2026</td>
                  <td>$335,000</td>
                  <td>3/2</td>
                  <td>1,646</td>
                  <td>$204</td>
                  <td><span className={styles.tagGreen}>Closed</span></td>
                </tr>
                <tr>
                  <td>
                    <ZillowLink
                      address="1032 Hardwood Dr"
                      href="https://www.zillow.com/homes/1032-Hardwood-Dr-Valrico-FL-33596_rb/"
                    >
                      1032 Hardwood Dr
                    </ZillowLink>
                  </td>
                  <td>7/2026</td>
                  <td>$325,000</td>
                  <td>3/2</td>
                  <td>1,646</td>
                  <td>$197</td>
                  <td><span className={styles.tagGreen}>Closed</span></td>
                </tr>
                <tr>
                  <td>
                    <ZillowLink
                      address="1014 Hardwood Dr"
                      href="https://www.zillow.com/homes/1014-Hardwood-Dr-Valrico-FL-33596_rb/"
                    >
                      1014 Hardwood Dr
                    </ZillowLink>
                  </td>
                  <td>6/2026</td>
                  <td>$305,000</td>
                  <td>3/2</td>
                  <td>1,371</td>
                  <td>$222</td>
                  <td><span className={styles.tagGreen}>Closed</span></td>
                </tr>
                <tr>
                  <td>
                    <ZillowLink
                      address="4305 Ellenville Pl"
                      href="https://www.zillow.com/homes/4305-Ellenville-Pl-Valrico-FL-33596_rb/"
                    >
                      4305 Ellenville Pl
                    </ZillowLink>
                  </td>
                  <td>3/2026</td>
                  <td>$345,000</td>
                  <td>4/2</td>
                  <td>1,646</td>
                  <td>$210</td>
                  <td><span className={styles.tagGreen}>Closed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
            *Subject property shown at $280K suggested offer price. Click any comp address to view on Zillow.
          </p>

          {/* --- Half-Mile Closed Sales --- */}
          <h3
            className={styles.heading}
            style={{ fontSize: 18, marginTop: 40, marginBottom: 12 }}
          >
            Half-Mile Radius — Recent Closed Sales
          </h3>
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Sold</th>
                  <th>Price</th>
                  <th>Bed/Bath</th>
                  <th>SqFt</th>
                  <th>$/SqFt</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ZillowLink
                      address="4715 Preston Woods Dr"
                      href="https://www.zillow.com/homes/4715-Preston-Woods-Dr-Valrico-FL-33596_rb/"
                    >
                      4715 Preston Woods Dr
                    </ZillowLink>
                  </td>
                  <td>6/2026</td>
                  <td>$375,000</td>
                  <td>4/2</td>
                  <td>2,100</td>
                  <td>$179</td>
                  <td>Larger home, updated</td>
                </tr>
                <tr>
                  <td>
                    <ZillowLink
                      address="4312 Arley Pl"
                      href="https://www.zillow.com/homes/4312-Arley-Pl-Valrico-FL-33596_rb/"
                    >
                      4312 Arley Pl
                    </ZillowLink>
                  </td>
                  <td>5/2026</td>
                  <td>$310,000</td>
                  <td>3/2</td>
                  <td>1,450</td>
                  <td>$214</td>
                  <td>Smaller lot, updated kitchen</td>
                </tr>
                <tr>
                  <td>
                    <ZillowLink
                      address="4136 Spring Way Cir"
                      href="https://www.zillow.com/homes/4136-Spring-Way-Cir-Valrico-FL-33596_rb/"
                    >
                      4136 Spring Way Cir
                    </ZillowLink>
                  </td>
                  <td>4/2026</td>
                  <td>$295,000</td>
                  <td>3/2</td>
                  <td>1,380</td>
                  <td>$214</td>
                  <td>Cosmetic condition, quick sale</td>
                </tr>
                <tr>
                  <td>
                    <ZillowLink
                      address="1443 Monte Lake Dr"
                      href="https://www.zillow.com/homes/1443-Monte-Lake-Dr-Valrico-FL-33596_rb/"
                    >
                      1443 Monte Lake Dr
                    </ZillowLink>
                  </td>
                  <td>5/2026</td>
                  <td>$355,000</td>
                  <td>4/2.5</td>
                  <td>1,890</td>
                  <td>$188</td>
                  <td>Pool home, larger lot</td>
                </tr>
                <tr>
                  <td>
                    <ZillowLink
                      address="1218 Lornewood Dr"
                      href="https://www.zillow.com/homes/1218-Lornewood-Dr-Valrico-FL-33596_rb/"
                    >
                      1218 Lornewood Dr
                    </ZillowLink>
                  </td>
                  <td>3/2026</td>
                  <td>$320,000</td>
                  <td>3/2</td>
                  <td>1,550</td>
                  <td>$206</td>
                  <td>Good condition, no pool</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* --- Bid Ladder --- */}
          <h3
            className={styles.heading}
            style={{ fontSize: 18, marginTop: 40, marginBottom: 12 }}
          >
            Bid Ladder
          </h3>
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Offer Price</th>
                  <th>% of Median</th>
                  <th>Cash to Close</th>
                  <th>Monthly Cash Flow</th>
                  <th>Cash-on-Cash</th>
                  <th>Signal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.mono}>$260,000</td>
                  <td>79%</td>
                  <td className={styles.mono}>$37,900</td>
                  <td className={styles.mono} style={{ color: "#10b981" }}>+$376</td>
                  <td>11.9%</td>
                  <td><span className={styles.tagRed}>Lowball</span></td>
                </tr>
                <tr>
                  <td className={styles.mono}>$270,000</td>
                  <td>82%</td>
                  <td className={styles.mono}>$48,050</td>
                  <td className={styles.mono} style={{ color: "#10b981" }}>+$369</td>
                  <td>9.2%</td>
                  <td><span className={styles.tagAmber}>Aggressive</span></td>
                </tr>
                <tr className={styles.highlightRow}>
                  <td className={styles.mono}>$280,000</td>
                  <td>85%</td>
                  <td className={styles.mono}>$58,200</td>
                  <td className={styles.mono} style={{ color: "#10b981" }}>+$362</td>
                  <td>7.5%</td>
                  <td><span className={styles.tagGreen}>Sweet Spot</span></td>
                </tr>
                <tr>
                  <td className={styles.mono}>$290,000</td>
                  <td>88%</td>
                  <td className={styles.mono}>$68,350</td>
                  <td className={styles.mono} style={{ color: "#10b981" }}>+$355</td>
                  <td>6.2%</td>
                  <td><span className={styles.tagGreen}>Solid</span></td>
                </tr>
                <tr>
                  <td className={styles.mono}>$300,000</td>
                  <td>91%</td>
                  <td className={styles.mono}>$78,500</td>
                  <td className={styles.mono} style={{ color: "#10b981" }}>+$348</td>
                  <td>5.3%</td>
                  <td><span className={styles.tagAmber}>Full Price</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.bidVerdict}>
            <p className={styles.bidVerdictTitle}>Verdict: $275K – $285K</p>
            <p className={styles.bidVerdictText}>
              The sweet spot balances strong cash-on-cash return with a realistic seller
              acceptance range. At $280K, you&apos;re buying at $170/sqft — well below the
              subdivision average of $209/sqft — while still leaving the seller with positive
              net proceeds. The 3.25% rate advantage is what makes this margin possible.
            </p>
          </div>
        </div>
      </section>

      {/* ========== ASSUME VS FINANCE ========== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={`${styles.heading} ${styles.sectionTitle}`}>
            Assume vs. Finance
          </h2>
          <p className={styles.sectionSubtitle}>
            Two doors. One costs $128K more over the life of the loan.
          </p>

          <div className={styles.twoCol}>
            <div className={`${styles.doorCard} ${styles.doorGreen}`}>
              <p className={styles.doorLabel}>Door A — Assume the VA Loan</p>
              <p className={`${styles.heading} ${styles.doorRate}`}>3.25%</p>
              <p className={styles.doorSub}>$1,071/mo P&amp;I</p>
              <p className={styles.doorDetail}>~$226K balance &middot; 27 years remaining</p>
              <p className={styles.doorDetail}>No new appraisal required</p>
              <p className={styles.doorDetail}>~$58K cash to close at $280K</p>
              <p className={styles.doorDetail}>Total interest remaining: ~$124K</p>
            </div>
            <div className={`${styles.doorCard} ${styles.doorRed}`}>
              <p className={styles.doorLabel}>Door B — New Conventional Loan</p>
              <p className={`${styles.heading} ${styles.doorRate}`}>6.85%</p>
              <p className={styles.doorSub}>$1,465/mo P&amp;I</p>
              <p className={styles.doorDetail}>$226K loan &middot; 30 years</p>
              <p className={styles.doorDetail}>Appraisal + full underwriting</p>
              <p className={styles.doorDetail}>~$67K down payment at $280K (20%+closing)</p>
              <p className={styles.doorDetail}>Total interest: ~$301K</p>
            </div>
          </div>

          <div className={styles.bidVerdict}>
            <p className={styles.bidVerdictTitle}>Bottom Line</p>
            <p className={styles.bidVerdictText}>
              Assuming saves $394/month in P&amp;I payments from day one.
              Over the remaining loan term, that&apos;s $128,444 in interest you never pay.
              The assumption also avoids a new appraisal, simplifies underwriting, and lets
              you close faster. The only trade-off is the cash-to-close is equity to the seller
              rather than a down payment to a lender.
            </p>
          </div>
        </div>
      </section>

      {/* ========== SECTION 8 / VOUCHER ANALYSIS ========== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={`${styles.heading} ${styles.sectionTitle}`}>
            Section 8 / Housing Choice Voucher Analysis
          </h2>
          <p className={styles.sectionSubtitle}>
            Hillsborough County HCV payment standards for a 3-bedroom in ZIP 33596.
          </p>

          <div className={styles.voucherGrid}>
            <div className={styles.voucherCard}>
              <p className={styles.voucherAmount}>$2,100</p>
              <p className={styles.voucherLabel}>HCV Payment Standard (3BR)</p>
            </div>
            <div className={styles.voucherCard}>
              <p className={styles.voucherAmount}>$2,100</p>
              <p className={styles.voucherLabel}>Target Market Rent</p>
            </div>
            <div className={styles.voucherCard}>
              <p className={styles.voucherAmount}>100%</p>
              <p className={styles.voucherLabel}>Voucher Coverage</p>
            </div>
            <div className={styles.voucherCard}>
              <p className={styles.voucherAmount}>Low</p>
              <p className={styles.voucherLabel}>Vacancy Risk</p>
            </div>
          </div>

          <h3
            className={styles.heading}
            style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}
          >
            ZIP Code Comparison — 3BR Payment Standards
          </h3>
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ZIP</th>
                  <th>Area</th>
                  <th>3BR Standard</th>
                  <th>vs. Subject</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.highlightRow}>
                  <td className={styles.mono}>33596</td>
                  <td>Valrico</td>
                  <td className={styles.mono}>$2,100</td>
                  <td>—</td>
                  <td>Subject property ZIP</td>
                </tr>
                <tr>
                  <td className={styles.mono}>33594</td>
                  <td>Valrico (West)</td>
                  <td className={styles.mono}>$2,000</td>
                  <td style={{ color: "#ef4444" }}>-$100</td>
                  <td>Slightly lower demand</td>
                </tr>
                <tr>
                  <td className={styles.mono}>33511</td>
                  <td>Brandon</td>
                  <td className={styles.mono}>$1,950</td>
                  <td style={{ color: "#ef4444" }}>-$150</td>
                  <td>More supply available</td>
                </tr>
                <tr>
                  <td className={styles.mono}>33510</td>
                  <td>Brandon (West)</td>
                  <td className={styles.mono}>$1,900</td>
                  <td style={{ color: "#ef4444" }}>-$200</td>
                  <td>Older housing stock</td>
                </tr>
                <tr>
                  <td className={styles.mono}>33569</td>
                  <td>Riverview</td>
                  <td className={styles.mono}>$2,050</td>
                  <td style={{ color: "#ef4444" }}>-$50</td>
                  <td>Growing area, newer builds</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.bidVerdict}>
            <p className={styles.bidVerdictTitle}>Section 8 Verdict</p>
            <p className={styles.bidVerdictText}>
              The 33596 ZIP has the highest voucher payment standard in the immediate
              area at $2,100/mo for a 3BR — which matches your target rent exactly.
              A Section 8 tenant provides guaranteed payment, typically longer tenancy,
              and the housing authority handles annual inspections. This property qualifies
              out of the box with no modifications needed.
            </p>
          </div>
        </div>
      </section>

      {/* ========== RISK ANALYSIS ========== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={`${styles.heading} ${styles.sectionTitle}`}>
            Risk Analysis
          </h2>
          <p className={styles.sectionSubtitle}>
            Every deal has risks. Here are the six to watch and how to mitigate each.
          </p>

          <div className={styles.riskGrid}>
            <div className={styles.riskCard}>
              <span className={`${styles.riskSeverity} ${styles.severityMed}`}>Medium</span>
              <h3 className={styles.riskTitle}>Assumption Approval Timeline</h3>
              <p className={styles.riskText}>
                VA loan assumptions can take 45-90 days for lender approval. Mitigate by
                submitting a complete package upfront and maintaining communication with the
                loan servicer. Build the timeline into your offer terms.
              </p>
            </div>
            <div className={styles.riskCard}>
              <span className={`${styles.riskSeverity} ${styles.severityLow}`}>Low</span>
              <h3 className={styles.riskTitle}>Cosmetic Rehab Costs</h3>
              <p className={styles.riskText}>
                The property needs paint, flooring, and minor updates. Budget $15-20K for
                a rent-ready cosmetic refresh. This is baked into the below-market offer
                price. No structural issues identified.
              </p>
            </div>
            <div className={styles.riskCard}>
              <span className={`${styles.riskSeverity} ${styles.severityLow}`}>Low</span>
              <h3 className={styles.riskTitle}>Insurance Cost Volatility</h3>
              <p className={styles.riskText}>
                Florida insurance premiums have stabilized but remain elevated. Budget
                $280/mo as baseline. Citizens or private market options available. The
                calculator lets you stress-test higher premiums.
              </p>
            </div>
            <div className={styles.riskCard}>
              <span className={`${styles.riskSeverity} ${styles.severityMed}`}>Medium</span>
              <h3 className={styles.riskTitle}>Rent Growth Uncertainty</h3>
              <p className={styles.riskText}>
                Analysis uses current market rents with no appreciation assumed. If rents
                drop 5%, cash flow decreases ~$105/mo but remains positive. The 3.25% rate
                provides a large margin of safety.
              </p>
            </div>
            <div className={styles.riskCard}>
              <span className={`${styles.riskSeverity} ${styles.severityLow}`}>Low</span>
              <h3 className={styles.riskTitle}>HOA Risk</h3>
              <p className={styles.riskText}>
                Bloomingdale East HOA is $58/mo — well-established community with no pending
                special assessments. HOA covers common area maintenance. Rental restrictions:
                none identified. Confirm with HOA docs before closing.
              </p>
            </div>
            <div className={styles.riskCard}>
              <span className={`${styles.riskSeverity} ${styles.severityHigh}`}>High</span>
              <h3 className={styles.riskTitle}>Competitive Offer Environment</h3>
              <p className={styles.riskText}>
                Assumable VA loans attract investor attention. The August 4 deadline suggests
                multiple offers expected. Be prepared to offer your best terms on the first
                pass. Clean offers with proof of funds will stand out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TIMELINE ========== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={`${styles.heading} ${styles.sectionTitle}`}>
            Execution Timeline
          </h2>
          <p className={styles.sectionSubtitle}>
            From offer to cash-flowing rental in approximately 90-120 days.
          </p>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <h3 className={styles.timelineTitle}>Step 1: Submit Offer (By Aug 4)</h3>
              <p className={styles.timelineText}>
                Submit offer at $275-285K with proof of funds for the cash-to-close.
                Include assumption contingency and 45-day inspection period.
              </p>
            </div>
            <div className={styles.timelineItem}>
              <h3 className={styles.timelineTitle}>Step 2: Inspection &amp; Due Diligence (Week 1-2)</h3>
              <p className={styles.timelineText}>
                Full home inspection, termite/WDO, roof certification. Confirm HOA docs
                allow rentals. Order insurance quotes. Get rehab bids.
              </p>
            </div>
            <div className={styles.timelineItem}>
              <h3 className={styles.timelineTitle}>Step 3: Submit Assumption Package (Week 2-3)</h3>
              <p className={styles.timelineText}>
                File VA loan assumption application with the servicer. Provide financials,
                credit authorization, and purchase contract. This starts the 45-90 day
                approval clock.
              </p>
            </div>
            <div className={styles.timelineItem}>
              <h3 className={styles.timelineTitle}>Step 4: Assumption Underwriting (Week 3-10)</h3>
              <p className={styles.timelineText}>
                Lender reviews your creditworthiness and approves the assumption.
                Stay responsive to any additional document requests.
              </p>
            </div>
            <div className={styles.timelineItem}>
              <h3 className={styles.timelineTitle}>Step 5: Clear to Close (Week 10-12)</h3>
              <p className={styles.timelineText}>
                Receive assumption approval and schedule closing. Wire cash-to-close
                funds. Sign closing documents.
              </p>
            </div>
            <div className={styles.timelineItem}>
              <h3 className={styles.timelineTitle}>Step 6: Close &amp; Begin Rehab (Week 12)</h3>
              <p className={styles.timelineText}>
                Take possession. Begin cosmetic updates — paint, flooring, landscaping cleanup.
                Target 2-3 week turnaround for a rent-ready property.
              </p>
            </div>
            <div className={styles.timelineItem}>
              <h3 className={styles.timelineTitle}>Step 7: List for Rent (Week 14-15)</h3>
              <p className={styles.timelineText}>
                List on Zillow, Apartments.com, and with the Hillsborough County Housing
                Authority for Section 8 interest. Professional photos, competitive pricing
                at $2,100/mo.
              </p>
            </div>
            <div className={styles.timelineItem}>
              <h3 className={styles.timelineTitle}>Step 8: Tenant Placement &amp; Cash Flow (Week 16+)</h3>
              <p className={styles.timelineText}>
                Screen tenants, execute lease, and begin collecting rent. First cash flow
                check hits approximately 4 months after your offer is accepted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={`${styles.heading} ${styles.ctaTitle}`}>
            Ready to Move on This Deal?
          </h2>
          <p className={styles.ctaSub}>
            Offer deadline is August 4, 2026. Let&apos;s get your offer locked in.
          </p>
          <div className={styles.ctaButtons}>
            <a href="tel:8137337907" className={styles.btnGreen}>
              📞 Call (813) 733-7907
            </a>
            <a href="mailto:barrett@nowtb.com" className={styles.btnOutline}>
              ✉️ Email barrett@nowtb.com
            </a>
          </div>
        </div>
      </section>

      {/* ========== DISCLAIMER ========== */}
      <footer className={styles.disclaimer}>
        <div className={styles.container}>
          <p>
            Prepared by Barrett Henry, Broker Associate, REMAX Collective &middot; July 26, 2026
          </p>
          <p>
            This analysis is for informational purposes only and does not constitute financial,
            legal, or investment advice. All figures are estimates based on available data and
            may change. Rental income, property values, insurance costs, and loan terms are
            subject to market conditions and individual circumstances. Verify all numbers
            independently before making investment decisions. Barrett Henry is a licensed
            real estate Broker Associate in the State of Florida (License #BK3369217).
          </p>
        </div>
      </footer>
    </div>
  );
}
