# Florida Amendment 3 Homestead Savings Calculator (Tampa Bay)

A client-side React/Next.js + Tailwind calculator that estimates a Tampa Bay homeowner's current annual property tax and what it would be in 2027 and 2028 if Florida Amendment 3 passes on November 3, 2026, with the school and non-school portions split out, same-year savings shown for each year, and separate handling for homesteaded vs non-homesteaded property and for existing Florida residents vs people who become residents after December 31, 2026.

## Spec
# Amendment 3 Savings Calculator: Full Implementation Spec

Build as a single `'use client'` React component in the Next.js App Router, Tailwind only, no external libraries, all math in one pure function so it can be unit tested. Everything is client side, no API calls, no server actions.

---

## 1. THE CORE IDEA IN ONE PARAGRAPH

Florida property tax has two halves: **school district millage** and **everything else (non-school)**. Amendment 3 does not touch the school half at all. It replaces the non-school homestead exemption (today $25,000 + $26,411 = $51,411) with up to $150,000 in 2027 and up to $250,000 in 2028. The school half keeps its own separate $25,000 exemption forever. So the entire calculator is: split the bill in two, change only the non-school side, and show the difference.

---

## 2. INPUTS

### 2.1 Assessed value (slider + numeric box)
- Range $50,000 to $1,500,000, step $5,000, default $350,000.
- Both a `<input type="range">` and a synced `<input type="text" inputMode="numeric">` so people can type an exact TRIM figure.
- Label: **"Assessed value"**. Helper text directly under it: *"This is the assessed value on your TRIM notice or tax bill, not your market value and not a Zestimate. Save Our Homes usually makes assessed value a lot lower than market value."*
- Accessibility: `aria-valuetext` on the range input formatted as currency.

### 2.2 County (segmented control, 5 options)
Hillsborough, Pinellas, Pasco, Polk, Manatee. Selecting a county loads the district list and prefills both millage fields.

### 2.3 Taxing district (select, options depend on county)
Not optional. Non-school millage swings from 7.6 mills to 13.6 mills across this set, which changes savings by nearly 2x. Default to the unincorporated option in every county except Pinellas (see 2.4).

### 2.4 Millage presets (prefilled, editable)

Two numeric inputs, step 0.0001, both editable, both showing a "source" caption. If the user edits either one, the caption flips to "custom."

| County | District | School mills | Non-school mills | Total | Source |
|---|---|---|---|---|---|
| Hillsborough | Unincorporated (district U) **[default]** | 6.3340 | 11.9100 | 18.2440 | HCPA official Tax Estimator service, `gis.hcpafl.org/CommonServices/property/search/TaxEstimator`, retrieved Oct 2026 |
| Hillsborough | City of Tampa (district TA) | 6.3340 | 13.4013 | 19.7353 | same |
| Pinellas | Countywide average **[default]** | 6.2930 | 12.2011 | 18.4941 | Non-school 12.2011 from the Pinellas County Property Appraiser's own Amendment FAQ (2025 countywide aggregate average non-school rate); school 6.2930 from the Pinellas County Tax Collector 2025 millage form |
| Pinellas | Unincorporated (code AA) | 6.2930 | 9.0299 | 15.3229 | Pinellas County Tax Collector, `pinellastaxcollector.gov/pdfs/2025 MILLAGE.pdf` |
| Pinellas | St. Petersburg (SP) | 6.2930 | 13.6267 | 19.9197 | same |
| Pinellas | Clearwater (CW) | 6.2930 | 13.0592 | 19.3522 | same |
| Pinellas | Largo (LA) | 6.2930 | 12.6942 | 18.9872 | same |
| Pasco | Unincorporated with MSTU Fire (UF) **[default]** | 6.1840 | 10.5126 | 16.6966 | Pasco County Property Appraiser, 2026 roll certified Oct 6 2026, `search.pascopa.com/millage.aspx` |
| Pasco | Unincorporated, no MSTU Fire (U) | 6.1840 | 8.2452 | 14.4292 | same |
| Pasco | New Port Richey (NP) | 6.1840 | 15.9400 | 22.1240 | same |
| Polk | Unincorporated, SWFWMD (code 90) **[default]** | 5.2580 | 7.6391 | 12.8971 | Polk County Property Appraiser 2026 Final Millage Rates, `polkflpa.gov/Downloads/Files/finalmillage.pdf`, printed 10/06/2026 |
| Manatee | **PROVISIONAL, DO NOT SHIP** | — | — | — | Only the FY26 countywide operating millage of 6.0326 is verified (mymanatee.org). Pull the certified aggregate from Manatee's TRIM/DR-420 before launch, or ship Manatee with blank required millage fields and a "enter the rates from your TRIM notice" prompt. |

Pinellas school 6.2930 breaks down as 3.0450 state + 3.2480 local. Hillsborough school 6.3340 includes the voter-approved mill. Pasco school 6.1840 = 2.9360 state law + 0.7480 local discretionary + 1.5000 capital + 1.0000 additional operating. Polk school 5.2580 = 3.0100 state + 2.2480 local.

### 2.5 Toggle A: Homesteaded
`homesteaded: boolean`, default `true`. Two-button segmented control: "This is my homestead" / "Rental, second home, or investment."

### 2.6 Toggle B: Residency
`existingResident: boolean`, default `true`. Labels: "I was a Florida resident on or before December 31, 2026" / "I became a Florida resident after that."
- **Disabled and visually greyed when `homesteaded === false`**, with tooltip: *"Residency only matters for the homestead exemption."*
- The cutoff date is not negotiable. The constitutional text keys off a person "who had not maintained a permanent residence in this state as of December 31, 2026."

### 2.7 Market value growth slider (non-homestead only)
- Shown only when `homesteaded === false`. Range 0% to 12%, step 0.5%, default 5.0%.
- Label: *"How fast do you expect market value to rise each year?"*
- Helper: *"The new 5% cap only helps if values rise faster than 5% a year."*

### 2.8 Advanced (collapsed `<details>`)
- `avGrowthMode`: "Flat" (default) or "Grow by Save Our Homes." Homestead only.
- If "Grow," a CPI input, default 3.0%, capped at 3% by the formula `min(0.03, cpi)`.
- Non-homestead: `AVns2026` numeric input, default equal to just value, for owners whose assessed value is already below market because of the current 10% cap.

---

## 3. THE MATH, STEP BY STEP

All taxes: `taxable * mills / 1000`. Keep full float precision internally.

### 3.1 Homestead, existing Florida resident

**School side, identical in all three columns:**
```
schoolTaxable = max(0, AV - 25000)
schoolTax     = schoolTaxable * mSchool / 1000
```
Art. VII s.6(a)(1)a.1. keeps this at "up to the assessed valuation of twenty-five thousand dollars." This row never moves.

**Non-school side, current law (the 2026 baseline):**
```
band1   = min(25000, AV)
band2   = min(26411, max(0, AV - 50000))      // the donut hole lives here
Ecur    = band1 + band2                        // $51,411 once AV >= $76,411
nsTaxCur = max(0, AV - Ecur) * mNonSchool / 1000
```

**Non-school side, 2027:**
```
E27      = min(150000, AV)
nsTax27  = max(0, AV - 150000) * mNonSchool / 1000
```

**Non-school side, 2028:**
```
E28      = min(250000, AV)
nsTax28  = max(0, AV - 250000) * mNonSchool / 1000
```

**Savings:**
```
savings27 = (E27 - Ecur) * mNonSchool / 1000
savings28 = (E28 - Ecur) * mNonSchool / 1000
```
`E27 - Ecur` is always >= 0 at every assessed value. Spot checks: AV $40,000 gives +$15,000; AV $60,000 gives +$25,000; AV $100,000 gives +$48,589; AV $200,000 or more gives the full +$98,589. For 2028 at AV >= $250,000 the delta is +$198,589.

**Cross-check against the county's own published number:** Pinellas published approximately $1,203 in 2027 and $2,423 in 2028, computed as $98,589 x 0.0122011 and $198,589 x 0.0122011. Plug 12.2011 non-school mills and AV >= $250,000 into this spec and you get $1,203 and $2,423 to the dollar. Use this as a unit test.

### 3.2 Homestead, new resident (not a FL resident on 12/31/2026)

```
schoolTaxable = max(0, AV - 25000)             // identical, $25,000
Enew          = min(50000, AV)                 // non-school, years 1 through 4
nsTaxNew      = max(0, AV - 50000) * mNonSchool / 1000
```
Applies to **both** the 2027 and 2028 columns. No step-up is computed. See the caveat on the ballot-summary vs constitutional-text conflict.

**The finding the calculator must surface:** `Enew - Ecur` goes negative above AV $75,000 and bottoms out at `50000 - 51411 = -1411`. At 11.9100 non-school mills that is about **$17 more per year**, not less. Print it:

> "Heads up. As written, someone who becomes a Florida resident after December 31, 2026 gets $50,000 of non-school exemption instead of today's $51,411. On a home at your assessed value that is about **$17 more** per year, not less, until the larger exemption kicks in several years later."

### 3.3 Non-homesteaded property

No homestead exemption exists here, so Amendment 3's exemption change is worth exactly $0. The only lever is the assessment cap dropping from 10% to 5% for non-school levies (both Art. VII s.4(g) for residential of nine units or fewer and s.4(h) for everything else, each amended to read "a. Before January 1, 2027, ten percent (10%). b. Beginning January 1, 2027, five percent (5%).").

```
JV2026 = user's just/market value
JV(y)  = JV2026 * (1 + g)^(y - 2026)

// School: uncapped at just value, both scenarios, every year. No difference, ever.
schoolTax(y) = JV(y) * mSchool / 1000

// Non-school assessed value
AVcur(2027) = min(JV(2027), AVns2026 * 1.10)
AVcur(2028) = min(JV(2028), AVcur(2027) * 1.10)
AVam3(2027) = min(JV(2027), AVns2026 * 1.05)
AVam3(2028) = min(JV(2028), AVam3(2027) * 1.05)

savings(y) = (AVcur(y) - AVam3(y)) * mNonSchool / 1000
```

Worked example, Hillsborough unincorporated, JV $400,000, g = 8%:
- 2027: JV $432,000. Current law AV $432,000 (10% cap would allow $440,000, so market binds). Amendment 3 AV $420,000. Delta $12,000 x 0.011910 = **$143**.
- 2028: JV $466,560. Current law AV $466,560. Amendment 3 AV $441,000. Delta $25,560 x 0.011910 = **$304**.
- School tax identical in both scenarios both years. Savings $0 on that half.

At g <= 5% every delta is zero. Print `$0` and the explanation, do not hide the result.

### 3.4 Optional Save Our Homes growth mode (homestead)

```
AV(2027) = AV(2026) * (1 + min(0.03, cpi))
AV(2028) = AV(2027) * (1 + min(0.03, cpi))
```
Save Our Homes is untouched by Amendment 3: Art. VII s.4(d)(1) still caps homestead assessment growth at the lower of 3% or CPI. Even in this mode, savings is still computed as same-year current-law tax minus same-year Amendment 3 tax on the **same** assessed value. Never subtract one year's bill from another's.

---

## 4. OUTPUTS

### 4.1 The table (the main event)

Four rows, three columns, horizontally scrollable inside an `overflow-x-auto` wrapper on mobile.

| | Today (current law) | 2027 | 2028 |
|---|---|---|---|
| **School taxes** | $2,059 | $2,059 | $2,059 |
| **Everything else (county, city, special districts)** | $3,556 | $2,382 | $1,191 |
| **Total estimated annual tax** | **$5,615** | **$4,441** | **$3,250** |
| **You would save** | — | **$1,174** | **$2,365** |

That is the real worked example: Hillsborough unincorporated, homesteaded, existing resident, AV $350,000, 6.3340 school mills, 11.9100 non-school mills. Use it as the golden unit test. The school row is rendered with a muted background and a small lock icon, captioned *"Amendment 3 does not change school taxes."*

### 4.2 Headline numbers
Two large stat tiles above the table: "Estimated 2027 savings" and "Estimated 2028 savings," each with the dollar figure and a one-line subcaption naming the county and district.

### 4.3 Conditional callouts (render at most two, in this priority order)

1. **Non-homesteaded:** *"Amendment 3 gives you no new exemption. Rentals, second homes, and investment property do not get the homestead exemption at all. Your only benefit is that the cap on how fast your assessed value can rise drops from 10% to 5% for non-school taxes starting January 1, 2027. School taxes stay uncapped at full market value. And a cap on value is not a cap on your bill: millage rates can still go up."*
2. **Non-homesteaded with g <= 5%:** *"At the growth rate you picked, Amendment 3 saves you $0. The 5% cap only does something when values rise faster than 5% a year."*
3. **New resident with AV >= $75,000:** the "$17 more" callout from 3.2.
4. **Homestead, existing resident, AV <= $150,000:** *"Your non-school property tax would go to $0 in 2027. The step up to $250,000 in 2028 gives you nothing extra, because you are already fully exempt. You would still owe school taxes on the assessed value above $25,000."*
5. **Homestead, existing resident, $150,000 < AV <= $250,000:** *"Your non-school property tax would go to $0 in 2028."*

### 4.4 Always-on footer block
- *"This only happens if Amendment 3 passes with at least 60% of the vote on November 3, 2026."*
- *"If it passes, the change takes effect January 1, 2027, first shows up on your August 2027 TRIM notice, and first hits a tax bill in November 2027."*
- *"This is an estimate, not tax advice. Your real bill also includes non-ad-valorem items like solid waste, stormwater, fire assessments, and CDD fees that Amendment 3 does not touch. Millage rates are set fresh every September and can go up."*
- The ballot title, stated correctly: *"Increased Homestead Exemption; Lower Cap on Increases in Non-Homestead Property Assessments."*
- Barrett Henry attribution, phone, and a link to /get-help.
- Source list: the enrolled CS/HJR 1F bill text, the Florida DOR CPI homestead certification, and each county property appraiser or tax collector millage page actually used.

---

## 5. WHAT THE CALCULATOR MUST NOT DO

1. **Must not stack** the new exemption on top of $51,411. It replaces the non-school band.
2. **Must not apply** the $150,000 or $250,000 to school millage. Non-school only.
3. **Must not use $50,000** as the current baseline. It is $51,411 for 2026.
4. **Must not give** a non-homesteaded property any exemption benefit.
5. **Must not apply** the 5% cap to school millage, ever.
6. **Must not claim** a capped assessment means a capped tax bill.
7. **Must not project** 2029 or beyond, and must not guess the new-resident step-up year.
8. **Must not say** property taxes are being eliminated or phased out. There is no elimination schedule in the final ballot summary or in the constitutional text.
9. **Must not repeat** the House staff analysis line that the exemption "would apply to all ad valorem taxes." The text and ballot summary contradict it.
10. **Must not use** the struck title "Save Our Homes from Excessive Property Taxes."
11. **Must not present** a projected 2027 or 2028 bill as a certainty, and must not compute savings as a year-over-year bill difference.
12. **Must not tell** anyone how to vote, and must not editorialize on the Revenue Estimating Conference numbers in either direction.
13. **Must not call** itself tax, legal, or financial advice, and must not be branded in a way that implies it came from a county property appraiser.
14. **Must not ship** a made-up Manatee millage preset.

---

## 6. IMPLEMENTATION NOTES

- One pure function, `computeAmendment3(input): Result`, exported separately from the component. Zero DOM, zero hooks. Unit test it against the two golden cases: Hillsborough $350,000 homestead (expect $1,174 / $2,365) and the Pinellas published figures (expect $1,203 / $2,423 at 12.2011 mills, AV >= $250,000).
- Wrap the call in `useMemo` keyed on the full input object. The math is trivial; the point is stable renders while a slider is being dragged.
- Round only in the formatter. `const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')`.
- Derive the displayed savings from the rounded total figures so the table always reconciles on screen.
- Store millage presets in a typed `COUNTY_PRESETS` constant with `{ county, district, schoolMills, nonSchoolMills, sourceLabel, sourceUrl }`. Every preset carries its own citation, rendered as a small caption under the millage inputs.
- Tailwind only, mobile first, match the existing repo tokens. Do not introduce a second design system. Sliders need visible `focus-visible` rings.
- Full keyboard operation: every slider reachable by Tab, arrow keys adjust, `aria-valuetext` reads back as currency or a percentage.
- Debounce nothing. The math is instant and live updating is the whole appeal.
- Add a "Copy my results" button that puts a short plain-text summary on the clipboard, including the disclaimer line. That is the lead-gen hook: pair it with a soft "Want me to check your actual TRIM notice?" CTA that routes into Follow Up Boss.
- SEO: single H1, question-format H2s, FAQPage schema on the surrounding page, BreadcrumbList schema, canonical URL. The calculator component itself ships no schema.


## Formulas
rate(mills) = mills / 1000
tax = taxableValue * mills / 1000
SCHOOL (all cases, all years, unchanged by Amendment 3): schoolTaxable = max(0, AV - 25000); schoolTax = schoolTaxable * mSchool / 1000
CURRENT-LAW non-school homestead exemption (2026 baseline, includes the donut hole): E_current(AV) = min(25000, AV) + min(26411, max(0, AV - 50000))
CURRENT-LAW non-school taxable: nsTaxable_current = max(0, AV - E_current(AV))
AM3 2027, EXISTING resident: E_2027(AV) = min(150000, AV); nsTaxable_2027 = max(0, AV - 150000)
AM3 2028, EXISTING resident: E_2028(AV) = min(250000, AV); nsTaxable_2028 = max(0, AV - 250000)
AM3 2027 and 2028, NEW resident (not a FL resident on 12/31/2026, years 1-4 of exemption): E_new(AV) = min(50000, AV); nsTaxable_new = max(0, AV - 50000)
Additional exempt value created by Amendment 3 in a given year: deltaE(year) = E_am3(year, AV) - E_current(AV)
Same-year savings, homestead: savings(year) = deltaE(year) * mNonSchool / 1000
Full-exemption shortcut (AV >= 250000, existing resident): deltaE_2027 = 150000 - 51411 = 98589; deltaE_2028 = 250000 - 51411 = 198589
Breakeven for new residents: E_current(AV) = 50000 when AV = 75000. Above AV = 76411, deltaE = 50000 - 51411 = -1411 (a tax INCREASE of 1411 * mNonSchool / 1000).
NON-HOMESTEAD school tax (both scenarios, every year): schoolTax(y) = JV(y) * mSchool / 1000, where JV(y) = JV_2026 * (1 + g)^(y - 2026). No cap, no exemption, no Amendment 3 effect.
NON-HOMESTEAD non-school assessed value under CURRENT law: AVcur(2027) = min(JV(2027), AVns_2026 * 1.10); AVcur(2028) = min(JV(2028), AVcur(2027) * 1.10)
NON-HOMESTEAD non-school assessed value under AMENDMENT 3: AVam3(2027) = min(JV(2027), AVns_2026 * 1.05); AVam3(2028) = min(JV(2028), AVam3(2027) * 1.05)
NON-HOMESTEAD savings(year) = (AVcur(year) - AVam3(year)) * mNonSchool / 1000. Equals 0 whenever g <= 5%.
OPTIONAL Save Our Homes growth mode (homestead): AV(2027) = AV(2026) * (1 + min(0.03, cpi)); AV(2028) = AV(2027) * (1 + min(0.03, cpi)). Savings must still be computed as sameYearCurrentLawTax - sameYearAm3Tax using the SAME AV in both branches.

## Caveats
ESTIMATE ONLY, NOT TAX ADVICE. The page must carry a visible disclaimer: this is a good-faith estimate from published millage rates and the text of CS/HJR 1F, it is not legal, tax, or financial advice, and the only authoritative numbers are on your TRIM notice and your tax bill from your county property appraiser and tax collector.
NOTHING HAPPENS UNLESS IT PASSES. Florida constitutional amendments need at least 60% approval (Art. XI s.5(e)). The House staff analysis states CS/HJR 1F is 'Subject to approval by 60 percent of the voters during the 2026 general election.' Every output must be framed conditionally ('if Amendment 3 passes'). The calculator must never urge a yes or no vote.
FIRST BILL IS NOVEMBER 2027. The amendment takes effect January 1, 2027, first shows on August 2027 TRIM notices, and first hits a tax bill delivered November 2027. Do not let the UI imply savings arrive in 2026.
SCHOOL TAXES DO NOT CHANGE. Art. VII s.6(a)(1)a.1. keeps the school district homestead exemption at 'up to the assessed valuation of twenty-five thousand dollars.' Every Florida homeowner keeps paying school millage on assessed value above $25,000. The school row must be visually locked and identical across all three columns.
THE NEW EXEMPTION REPLACES, IT DOES NOT STACK. The enrolled resolution strikes the Art. VII s.6(a)(1)b. 'greater than fifty thousand dollars and up to seventy-five thousand dollars' band. The result is $25,000 against school millage PLUS up to $150,000/$250,000 against non-school millage. It is NOT $51,411 + $150,000. Any calculator that stacks them is wrong.
THE 2026 BASELINE IS $51,411, NOT $50,000. Per the Florida DOR CPI certification: $25,000 against all millages plus $26,411 against non-school millages only. Verified live in the field: the Hillsborough County Property Appraiser tax estimator returns exemptionValue 51411 for a homesteaded parcel.
THE DONUT HOLE SURVIVES IN THE BASELINE. The second exemption applies only to assessed value above $50,000. A homestead assessed under $50,000 gets only the first $25,000 today. The baseline formula must use min(26411, max(0, AV - 50000)), not a flat $26,411.
THE $26,411 IS FROZEN IN THIS MODEL. It is CPI-indexed, so the true 2028 counterfactual second exemption is probably about $27,000 to $28,000 and the real 2028 delta is roughly $197,000 to $198,000 of exempt value, not exactly $198,589. Freezing it at the certified 2026 value slightly OVERSTATES 2028 savings. Footnote this. This is the same simplification the Pinellas County Property Appraiser used.
CPI INDEXATION HAS TWO DIFFERENT START DATES AND IS NOT MODELED. The $250,000 existing-resident exemption adjusts for inflation beginning January 1, 2029. The $50,000 new-resident non-school exemption adjusts beginning January 1, 2028. The calculator stops at 2028 and holds both nominal. Do not project 2029 or later.
NEW RESIDENTS CAN BE SLIGHTLY WORSE OFF, AND THE CALCULATOR MUST SAY SO. A person who was not a Florida resident on December 31, 2026 gets $25,000 for school and only $50,000 for non-school. Current law already gives $51,411 non-school. Breakeven is AV = $75,000; at AV = $76,411 or above the swing is -$1,411 of exempt value, which is a small tax INCREASE (about $17/yr at 12 mills). Do not suppress this result.
THE NEW-RESIDENT STEP-UP YEAR IS GENUINELY UNSETTLED AND MUST NOT BE COMPUTED. The constitutional text says the larger exemption begins 'with the fifth year of exemption.' The operative ballot summary voters read says 'maintain Florida residency for five years prior to receiving the increased homestead exemption.' Those are different triggers and the conflict is live, not historical. The Pinellas County Property Appraiser reads it as the text does: eligible beginning January 1 of the fifth year after four years of exemption. Since the amendment starts January 1, 2027, no new resident reaches the step-up by 2028 under either reading, so the calculator shows $50,000 for both 2027 and 2028 and prints a plain-language note instead of guessing a year.
THE STEP-UP AMOUNT IS NOT A FROZEN $250,000. The text steps a new resident up to the sub-sub-subparagraph a.2.II. value 'as adjusted pursuant to subparagraph (2)a.', i.e. CPI-adjusted from 2029 forward. Another reason not to project past 2028.
NON-HOMESTEAD OWNERS GET NO EXEMPTION FROM THIS AMENDMENT. Zero. Their only benefit is the non-homestead assessment cap dropping from 10% to 5% for non-school levies beginning January 1, 2027 (amended in both Art. VII s.4(g), residential of nine units or fewer, and s.4(h), everything else). If the growth slider is at or below 5%, the honest answer is $0 and the UI must print $0.
THE 5% CAP DOES NOT APPLY TO SCHOOL MILLAGE. Non-homestead property stays completely uncapped for school levies and is assessed at just value every year. Current law's 10% cap already excluded school levies and CS/HJR 1F preserves that exclusion. The non-homestead school row is identical in both scenarios.
A CAP ON ASSESSED VALUE IS NOT A CAP ON THE BILL. The Manatee County Property Appraiser states the change 'from 10% to 5% only caps assessed value, not taxes.' Millage rates are set annually by taxing authorities and can rise. This sentence, or close to it, must appear next to any non-homestead result.
SAVE OUR HOMES AND PORTABILITY ARE UNCHANGED. The 3%/CPI homestead cap in Art. VII s.4(d)(1) is untouched, and portability keeps its $500,000 maximum transferable differential and its three-year lookback. The calculator does not model portability at all; it takes assessed value as given, which already reflects any ported differential.
ORDER OF OPERATIONS MATTERS: just value, then the cap, then the exemptions. A long-held homestead with a large Save Our Homes differential may already have an assessed value under $150,000. For that owner the non-school tax goes to $0 in 2027 and the 2028 tier adds literally nothing. The calculator must detect this and say it out loud rather than quietly showing $0.
SAVINGS ARE ALWAYS A SAME-YEAR COUNTERFACTUAL, NEVER A YEAR-OVER-YEAR BILL CHANGE. savings(2027) = (2027 tax under current law) minus (2027 tax under Amendment 3), computed on the same assessed value. Never 2026 bill minus 2027 bill. If the optional Save Our Homes growth mode is on, this rule is what keeps the number honest.
MILLAGE RATES CHANGE EVERY YEAR AND THE CALCULATOR USES TODAY'S. Taxing authorities adopt new rates each September. The Revenue Estimating Conference projects -$4.95B in FY 2027-28 and -$8.78B in FY 2028-29 to local non-school revenue, with a -$11.86B recurring impact. Local governments may respond by raising millage, which would reduce or erase the modeled savings. State this.
MILLAGE VARIES ENORMOUSLY INSIDE A SINGLE COUNTY. In Pinellas alone, non-school millage runs from 9.0299 in the unincorporated county to 13.6267 in St. Petersburg. A county-level average can be off by 30% or more for an individual home. The district selector and the editable millage field are not optional niceties, they are accuracy requirements.
THE MANATEE PRESET IS NOT VERIFIED AND MUST NOT SHIP AS-IS. The only Manatee figure confirmed from a primary source is the FY26 countywide operating millage of 6.0326 (mymanatee.org), which is the BOCC general fund only and excludes the unincorporated MSTU, EMS, mosquito control, SWFWMD, and the school district. Either pull the certified Manatee aggregate from the county's TRIM/DR-420 before launch, or ship Manatee with the millage fields blank and required.
NON-AD-VALOREM ASSESSMENTS ARE NOT MODELED. Solid waste, stormwater, fire assessments, CDD fees, and PACE lines appear on the real bill and are completely unaffected by Amendment 3. The calculator's 'current annual tax' will therefore be LOWER than the bill in the mailbox. Say so.
OTHER EXEMPTIONS ARE NOT MODELED. Widow/widower, disability, veteran, first responder, and the low-income senior additional homestead exemptions are ignored. They are unchanged by Amendment 3 but they change the actual taxable value, so anyone holding one will see a different number.
LOCAL GOVERNMENTS AND SPECIAL DISTRICTS MAY GO FURTHER, AND THAT IS NOT MODELED. The amendment requires the Legislature to prescribe a uniform procedure for counties and municipalities to raise the exemption up to full assessed value, and lets special districts do the same by referendum (no more than once per 12 months). Beginning January 1, 2030 a county or municipality may shorten the new-resident waiting period by a two-thirds vote for a 'critical local need.' None of this is projectable.
THERE IS NO 'FULL ELIMINATION SCHEDULE.' That phrase appeared in an earlier draft ballot summary and is NOT in the final summary or the constitutional text. The calculator must not imply property taxes go away. The Manatee County Property Appraiser puts it plainly: 'Property taxes would not be eliminated. School taxes would still apply.'
DO NOT REPEAT THE HOUSE STAFF ANALYSIS ERROR. That analysis says the new non-school exemption 'would apply to all ad valorem taxes.' The constitutional text and the ballot summary both contradict it. Non-school only.
USE THE CORRECT BALLOT TITLE. It is 'Increased Homestead Exemption; Lower Cap on Increases in Non-Homestead Property Assessments.' The original 'Save Our Homes from Excessive Property Taxes' title was struck by Leon County Circuit Judge David Frank on August 4, 2026 as 'more akin to a political slogan' that 'is not fair or neutral.' Using the old title on a public page is both inaccurate and bad optics.
ROUNDING: compute in full precision, round each displayed dollar figure half-up to the nearest whole dollar, and derive the displayed savings from the ROUNDED tax figures so the on-screen table always reconciles. The displayed savings may therefore differ from exact arithmetic by up to $1 per row. Never display cents. Millage displays to 4 decimals.
ASSESSED VALUE, NOT MARKET VALUE, NOT A ZESTIMATE. The single most common user error. The input label, the helper text, and the tooltip all have to say 'assessed value from your TRIM notice.' Feeding market value into a homesteaded calculation overstates both the current bill and the savings.
NO EM DASHES OR EN DASHES IN ANY USER-FACING COPY on this page, per Barrett's house style. Ranges read '2027 to 2028.'