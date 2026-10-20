# Amendment 3 Residency Cutoff Checker

A four-question branching decision tool for Barrett's Florida Amendment 3 page that tells a visitor whether the December 31, 2026 residency cutoff gives them the full expanded homestead exemption in 2027, puts them in the smaller new-resident exemption with a step up later, or does not apply to them at all. Every outcome is written in plain English, sourced only to the enrolled CS/HJR 1F text, the official ballot summary, and county property appraiser guidance, and every branch where the law is genuinely unsettled routes to a "go verify" outcome instead of a guess.

## Spec
# Amendment 3 Residency Cutoff Checker

React client component for a Next.js App Router page (nowtb.com). Single `'use client'` component, no external dependencies, Tailwind only, mobile first.

Suggested path: `src/components/pages/Amendment3CutoffChecker.tsx`, rendered inside the Amendment 3 page (server component) so the page keeps its own metadata, breadcrumbs, and FAQ schema.

---

## 0. GLOBAL FRAMING (renders above the first question and stays visible on every step)

**Pre-election banner (show until November 3, 2026 results are certified):**

"Amendment 3 has not passed yet. It is on the November 3, 2026 ballot and needs at least 60 percent yes votes. Everything this tool tells you assumes it passes. If it fails, nothing changes and your current exemption stays as it is."

**Post-election swap:** replace the banner with either "Amendment 3 passed. It takes effect January 1, 2027." or "Amendment 3 did not reach 60 percent, so none of this takes effect." Store the state in a single exported constant `AMENDMENT_STATUS: 'pending' | 'passed' | 'failed'` so it is a one line edit.

**Persistent footer line under the tool:**

"This tool is general information, not tax or legal advice. Your county property appraiser is the only office that can decide your exemption."

---

## 1. STATE SHAPE

```
type Answers = {
  role?: 'owner_resident' | 'buyer_resident' | 'owner_nonhomestead' | 'no_property';
  futureHomestead?: 'yes' | 'no' | 'unsure';   // only asked on the non-homestead path
  residency?: 'yes' | 'no' | 'unsure';          // Florida permanent home on Dec 31, 2026
  homesteadTiming?: '2027' | '2028_or_later' | 'unsure';
  firstExemptionYear?: 2027 | 2028 | 2029 | 2030 | null;  // null = "I do not know yet"
  valueBand?: string;
}
```

Keep a `history: NodeId[]` stack so Back works. Expose `Start over`. Max depth is four questions. Show a small "Question X of up to 4" counter.

---

## 2. DECISION TREE

### Q1 `q1_role` — "Which one sounds like you?"

Buttons (exact labels):
1. `I own a Florida home and live in it as my full time home`  → `q2_residency`
2. `I am buying, or plan to buy, a Florida home to live in full time`  → `q2_residency`
3. `I own Florida property I do not live in (rental, second home, land, or commercial)`  → `q2b_future_homestead`
4. `I do not own Florida property`  → `q2_residency`

Sets `role` to `owner_resident`, `buyer_resident`, `owner_nonhomestead`, `no_property` in that order.

---

### Q2b `q2b_future_homestead` — "Will that property ever become your full time home?"

Shown only after answer 3 on Q1.

Buttons:
1. `Yes, I plan to move into it`  → `q2_residency`  (sets `futureHomestead: 'yes'`)
2. `No, it stays an investment or second home`  → **OUTCOME F**
3. `Not sure`  → **OUTCOME F** (with the "if that changes" paragraph shown)

---

### Q2 `q2_residency` — "On December 31, 2026, was Florida your permanent home, meaning the place you actually lived and intended to stay?"

Helper text under the question: "This is the one date the amendment cares about. It is about where you lived, not about when you buy a house and not about when you file for homestead."

Buttons:
1. `Yes, Florida was my permanent home on that date`  → routes by role (below)
2. `No, I lived in another state or another country`  → routes by role (below)
3. `I am not sure, or my move happened right around that date`  → **OUTCOME E**

Routing for answer 1 (existing Florida resident):
- `role = owner_resident` → `q4_value_existing` → **OUTCOME A**
- `role = buyer_resident` → `q3_existing_timing`
- `role = owner_nonhomestead` + `futureHomestead = yes` → **OUTCOME C** (with the non-homestead cap paragraph appended)
- `role = no_property` → **OUTCOME G1**

Routing for answer 2 (new resident):
- `role = owner_resident` or `buyer_resident` → `q3_new_firstyear`
- `role = owner_nonhomestead` + `futureHomestead = yes` → `q3_new_firstyear`
- `role = no_property` → **OUTCOME G2**

---

### Q3 (existing resident branch) `q3_existing_timing` — "When will that home have a Florida homestead exemption on it?"

Buttons:
1. `It will be homesteaded for the 2027 tax year`  → `q4_value_existing` → **OUTCOME B**
2. `2028 or later`  → **OUTCOME C**
3. `I do not have a date yet`  → **OUTCOME C**

---

### Q3 (new resident branch) `q3_new_firstyear` — "What is the first year you expect to have a Florida homestead exemption on a home you own?"

Buttons:
1. `2027`  → `q4_value_new` → **OUTCOME D** with `stepUpYear = 2031`
2. `2028`  → `q4_value_new` → **OUTCOME D** with `stepUpYear = 2032`
3. `2029`  → `q4_value_new` → **OUTCOME D** with `stepUpYear = 2033`
4. `2030 or later`  → `q4_value_new` → **OUTCOME D** with `stepUpYear = null` (use the generic "your first exemption year plus four" wording)
5. `I do not know yet`  → `q4_value_new` → **OUTCOME D** with `stepUpYear = null`

---

### Q4 `q4_value_existing` — optional refinement

Question: "Roughly what is the assessed value on your property appraiser's record? That is not market value and not what you paid."

Buttons:
1. `Under $150,000`
2. `$150,000 to $250,000`
3. `Over $250,000`
4. `Skip this`

### Q4 `q4_value_new` — optional refinement

Same question text. Buttons:
1. `Under $50,000`
2. `$50,000 or more`
3. `Skip this`

The value band only adds one extra paragraph to the outcome. It never changes which outcome fires.

---

## 3. OUTCOME TEXT (exact copy, use verbatim)

Every outcome renders in this order: headline, one sentence verdict, the numbers, what does not change, what to do next, then the value band paragraph if one was selected, then the CTA.

---

### OUTCOME A — `out_a_full_now`
**Headline:** You are on the full track. The cutoff does not slow you down.

You were living in Florida as your permanent home on December 31, 2026, and you already have a homestead. If Amendment 3 passes, you get the bigger exemption right away, with no waiting period.

What you get against county, city, and special district taxes:
- 2027: up to $150,000 of your assessed value is exempt.
- 2028: up to $250,000.
- 2029 and after: the $250,000 is adjusted for inflation each year.

What does not change:
- School taxes. The homestead exemption against school millage stays at $25,000, exactly like today. School taxes stay on your bill.
- Save Our Homes. Your assessment can still only rise by 3 percent a year or the inflation rate, whichever is lower.
- Portability. Still a $500,000 maximum transfer, still a three year lookback.

How much this is worth: today you have $51,411 exempt from the non school part of your bill, which is $25,000 plus the inflation adjusted $26,411. The new exemption replaces that, it does not stack on top of it. So 2027 gives you roughly $98,589 of newly exempt value against non school taxes. The Pinellas County Property Appraiser puts that at about $1,203 in 2027 and about $2,423 in 2028, using a countywide average non school rate of 12.2011 mills. Every county and city sets its own rate, so treat those as a ballpark, not your number.

When you would see it: the August 2027 TRIM notice, then the tax bill mailed in November 2027.

What to do: keep your homestead exemption in good standing with your county property appraiser. If you move, sell, or change how the property is titled, call them.

---

### OUTCOME B — `out_b_full_2027`
**Headline:** You are on the full track as long as the homestead is in place for 2027.

Florida was your permanent home on December 31, 2026, so the five year waiting period in Amendment 3 does not apply to you. The waiting period is tied to where you lived on that date, not to when you bought.

What you get against county, city, and special district taxes once the homestead is on the property:
- 2027: up to $150,000 of assessed value exempt.
- 2028: up to $250,000.
- 2029 and after: inflation adjusted.

What does not change: school taxes still apply above $25,000 of assessed value, Save Our Homes stays at 3 percent or inflation, and portability stays at $500,000 with a three year lookback.

What to do: the exemption is not automatic on a home you just bought. You have to own it, live in it as your permanent residence, and file for homestead with your county property appraiser. Call their office and confirm the filing deadline for the year you want it, and ask what proof of residence they want to see. If the homestead does not get on the property for 2027, you simply pick up the benefit the first year it does.

---

### OUTCOME C — `out_c_full_later`
**Headline:** You keep full status, even if you buy years from now.

This is the part most people get wrong. The December 31, 2026 cutoff is about where you lived on that date. It is not a deadline to buy a house and it is not a deadline to file for homestead.

Because Florida was your permanent home on December 31, 2026, the amendment treats you as an existing resident. When you do homestead a Florida home, whether that is 2028 or 2032, you get the full exemption amount in force that year with no five year wait.

The amounts you would be stepping into: up to $250,000 of assessed value exempt from county, city, and special district taxes starting in 2028, adjusted for inflation each year from 2029 forward. School taxes stay at a $25,000 exemption no matter what.

One thing to know: the amendment ties this to the person, not to the house. You do not inherit a seller's status and a buyer does not inherit yours. You carry your own.

What to do: keep records that show Florida was your permanent home on or before December 31, 2026. A Florida driver license, voter registration, vehicle registration, utility accounts in your name, and a declaration of domicile are the kinds of records appraisers usually look at. Dated on or before that day is what matters.

---

### OUTCOME D — `out_d_new_resident` (parameterized by `stepUpYear`)
**Headline:** You are a new resident, so you start at the smaller exemption and step up later.

You were not living in Florida as your permanent home on December 31, 2026. Under Amendment 3 that puts you on the new resident track.

What you get in your early homestead years:
- $25,000 against school taxes, which is the same as everybody else.
- Up to $50,000 against county, city, and special district taxes. That $50,000 is adjusted for inflation starting January 1, 2028.

Compared to a longtime Florida neighbor with the same house, you are exempting up to $50,000 against the non school part of the bill while they exempt up to $150,000 in 2027 and up to $250,000 in 2028. Same house, different bill.

When you step up: {if stepUpYear} the constitutional text says the larger exemption begins with your fifth year of exemption. If your first homestead year is {firstExemptionYear}, that points to {stepUpYear}. {else} the constitutional text says the larger exemption begins with your fifth year of exemption, which means the first year you hold the exemption plus four more years. Pin down your first homestead year and you have your answer. {end}

**Read this before you plan around a date.** There are two official versions of this rule and they do not say the same thing. The constitutional text counts five years of holding the homestead exemption. The ballot summary voters read counts five years of Florida residency before the larger exemption starts. If you move here in 2027 but do not buy until 2030, those two readings land on different years. The ballot language for this amendment has already been to court once, and this conflict is not resolved. Nobody can honestly give you one date yet. Ask your county property appraiser how they intend to count it, and ask again after the Legislature writes the implementing rules.

One more door that may open: starting January 1, 2030, a county or a city can vote by a two thirds majority of its governing body to shorten the new resident waiting period for what the amendment calls a critical local need. That is something a local government may choose to do. It is not something you can apply for, and no county has done it, because the power does not exist until 2030.

What does not change for you: Save Our Homes still caps your assessment increases at 3 percent or inflation, whichever is lower, from your first homestead year forward. School taxes still apply above $25,000.

---

### OUTCOME E — `out_e_unclear`
**Headline:** Honest answer: this one needs your property appraiser, not a web tool.

Everything in Amendment 3 turns on one fact, whether you maintained a permanent residence in Florida as of December 31, 2026. The amendment does not define that phrase, and the Legislature has not written the rules that will tell property appraisers how to apply it.

Situations where the answer is genuinely unclear today:
- You own a Florida home but your driver license and voting are still in another state.
- You split the year between Florida and somewhere else.
- You closed on a Florida home in late December 2026 but did not actually move in until January.
- You are active duty military stationed outside Florida but claim Florida as your home of record.
- You were a Florida resident years ago, moved away, and came back.
- The home is in a trust, or you inherited it, or you are a surviving spouse continuing a homestead.

None of those have a published answer yet. Anyone who tells you otherwise is guessing.

What to do right now:
1. Call your county property appraiser and ask exactly what they will accept as proof of permanent Florida residence as of December 31, 2026.
2. Gather what you have that is dated on or before that day. Florida driver license, voter registration, vehicle registration, utility accounts, lease or deed, declaration of domicile.
3. Do not throw any of it away. If this ever gets questioned, the date on the paperwork is the whole argument.

---

### OUTCOME F — `out_f_nonhomestead`
**Headline:** The residency cutoff does not apply to you. A different part of the amendment does.

The December 31, 2026 cutoff only controls the size of a homestead exemption. Property that is not your permanent home does not get a homestead exemption either way, so that date is not your issue.

What does affect you, starting January 1, 2027: the yearly cap on how much the assessed value of non homestead property can rise drops from 10 percent to 5 percent. That covers rentals, second homes, vacant land, commercial property, and residential buildings with nine units or fewer. The cap applies to county, city, and special district taxes.

Two limits you need to understand:
1. School taxes are not capped at all on non homestead property. For school millage your property is assessed at full market value every single year, same as today. The 10 percent cap never applied to school taxes and the 5 percent cap will not either.
2. A cap on assessed value is not a cap on your tax bill. The Manatee County Property Appraiser says it plainly, the change only caps assessed value, not taxes. Taxing authorities can still raise millage rates, and a 5 percent cap on value does nothing to stop that.

If that property ever becomes your full time home: your exemption then depends on where you were living on December 31, 2026, not on when you bought the property. Start this tool over and answer that you are moving into it.

---

### OUTCOME G1 — `out_g_banked`
**Headline:** Nothing changes for you today, but your December 31, 2026 status is worth protecting.

You do not own Florida property, so there is no homestead exemption in play right now. The amendment does not do anything to you directly.

Here is why it still matters: because Florida was your permanent home on December 31, 2026, the amendment treats you as an existing resident whenever you do buy. Buy in 2028, buy in 2033, it does not matter. When you homestead that home you get the full exemption in force that year, up to $250,000 of assessed value exempt from county, city, and special district taxes, with no five year wait. Someone who moves here in 2027 and buys the same house the same week does not get that.

What to do: keep proof that Florida was your permanent home on or before December 31, 2026. Driver license, voter registration, lease, utility accounts, vehicle registration. You may need to show it years from now.

Worth knowing either way: the state's own Revenue Estimating Conference projects local non school property tax revenue drops of about $4.95 billion in the 2027 to 2028 fiscal year and about $8.78 billion in the 2028 to 2029 fiscal year, with a recurring impact around $11.86 billion. Local governments will respond to that somehow, and renters are not insulated from it.

---

### OUTCOME G2 — `out_g_new_resident_no_property`
**Headline:** Nothing changes for you today. The clock does not start until you own and homestead a home.

You do not own Florida property and you were not living in Florida as your permanent home on December 31, 2026. There is no exemption to adjust yet.

When you do buy and homestead a Florida home, you start on the new resident track:
- $25,000 against school taxes.
- Up to $50,000 against county, city, and special district taxes, adjusted for inflation starting January 1, 2028.
- Then a step up to the large exemption later.

The timing of that step up is genuinely unsettled. The constitutional text says it begins with your fifth year of holding the homestead exemption. The ballot summary voters read says five years of Florida residency. Those are not the same clock and the conflict has not been resolved. Do not sign anything based on one date.

What to do: when you are ready to buy, ask your county property appraiser how they are counting the five years. That answer will exist before you need it.

---

## 4. VALUE BAND PARAGRAPHS (appended to the outcome when Q4 was answered)

Note that "assessed value" here means the value on the property appraiser's roll after Save Our Homes, not market value and not taxable value.

**Existing resident, `Under $150,000`:**
"At that assessed value the 2027 exemption covers your whole property for the non school part of the bill, so your county, city, and special district property taxes would go to zero. You would still owe school taxes on the amount above $25,000. School millage is usually around a third of a Florida tax bill, so your bill does not disappear, it shrinks a lot."

**Existing resident, `$150,000 to $250,000`:**
"In 2027 the first $150,000 of your assessed value comes off the non school part of the bill and you pay non school taxes on the rest. In 2028 the exemption grows to $250,000, which covers your whole assessed value, so the non school part would go to zero that year. School taxes still apply above $25,000 in both years."

**Existing resident, `Over $250,000`:**
"You get the full exemption both years, $150,000 of assessed value exempt in 2027 and $250,000 in 2028, against county, city, and special district taxes. You still pay non school taxes on everything above that, plus school taxes on everything above $25,000."

**New resident, `Under $50,000`:**
"At that assessed value the $50,000 new resident exemption covers your whole property for the non school part of the bill, so the gap between you and a longtime resident neighbor is small or zero on the county and city portion. You still owe school taxes on the amount above $25,000."

**New resident, `$50,000 or more`:**
"The first $50,000 of assessed value comes off the non school part of your bill and you pay non school taxes on everything above that. A neighbor who was a Florida resident on December 31, 2026 exempts up to $150,000 in 2027 and up to $250,000 in 2028 on the identical house. That gap is the whole point of the cutoff."

---

## 5. OPTIONAL SAVINGS ESTIMATOR (bolt on, shown only on outcomes A, B, C)

Collapsed by default behind a button labeled `Estimate the dollars`. Two inputs: assessed value (number) and non school millage rate (number, defaults to 12.2011 with the label "Pinellas countywide average for 2025, replace with your own from your TRIM notice").

Output line: "Rough estimate only. Confirm with your TRIM notice."

Compute with the formulas in the formulas list. Never present the output as a guaranteed number and never store it as a promise. Round to whole dollars.

---

## 6. CTA AND LEAD HANDOFF

Below every outcome, one CTA block. Vary the copy by outcome rather than repeating one generic line:
- Outcomes A, B: `See what this does to your 2027 bill and your home value` with phone plus the form link.
- Outcome C: `Planning your next Florida move? Let's time it right.`
- Outcome D, G2: `New to Florida? Here is what to expect on your first tax bill.`
- Outcome E: `Need help gathering your residency proof? Start here.`
- Outcome F: `Running the numbers on a Florida rental under the new 5 percent cap?`
- Outcome G1: `Thinking about buying? Your 2026 residency status is already an asset.`

Pass the outcome code as a hidden field on the lead form so Follow Up Boss gets it as a tag. Never gate the result behind the form. The answer shows first, the CTA comes after.

---

## 7. IMPLEMENTATION NOTES

- Buttons: real `<button>` elements, full width on mobile, min 48px tall, visible focus ring. Not divs.
- Wrap the result in `role="status" aria-live="polite"` so screen readers announce the outcome.
- Breadcrumb trail of chosen answers above the result, each one clickable to jump back and change it.
- `Start over` button always present once past Q1.
- Sync state to the URL hash (for example `#q=role.owner_resident,res.yes`) so an outcome can be shared or linked from an email. Parse the hash on mount.
- Print stylesheet: hide the question UI, print the outcome plus the date and the disclaimer. People will take this to their property appraiser.
- Fire an analytics event per outcome reached.
- No em dashes or en dashes anywhere in the copy. Ranges read "2027 to 2028".
- Dollar amounts, the December 31, 2026 date, and the step up years are the only numbers in the component. Put them in one exported `AMENDMENT_3_FACTS` object at the top of the file with a source URL comment on each, so a single CPI update does not require hunting through JSX.
- Source list rendered under the tool, linking the enrolled CS/HJR 1F text, the official ballot summary PDF, the Florida Department of Revenue CPI homestead page, and the Pinellas County Property Appraiser FAQ.

## Formulas
existingResident = (person maintained a permanent residence in Florida as of 2026-12-31). This is the only gate. It is person based, not property based, and is not affected by purchase date or homestead filing date.
nonSchoolExemptionCap(year, existingResident=true): year <= 2026 -> 51411 effective (25000 + 26411 donut hole tier); 2027 -> 150000; 2028 -> 250000; year >= 2029 -> 250000 adjusted by CPI annually
nonSchoolExemptionCap(year, existingResident=false, beforeStepUp): 50000, CPI adjusted annually beginning 2028
schoolExemptionCap = 25000 for everyone, every year, unchanged by Amendment 3
stepUpYear (constitutional text reading) = firstHomesteadExemptionYear + 4, i.e. the fifth year of exemption
stepUpYear (ballot summary reading) = max(floridaResidencyStartYear + 5, firstHomesteadExemptionYear). These two readings conflict; the tool must show both, not pick one.
nonSchoolExemptValue = min(assessedValue, nonSchoolExemptionCap)
schoolExemptValue = min(assessedValue, 25000)
nonSchoolTaxableValue = max(0, assessedValue - nonSchoolExemptionCap)
schoolTaxableValue = max(0, assessedValue - 25000)
currentLawNonSchoolExempt(assessedValue) = 25000 + clamp(assessedValue - 50000, 0, 26411)   // the donut hole: the second tier only applies to assessed value above $50,000
newlyExemptValue2027 = min(assessedValue, 150000) - currentLawNonSchoolExempt(assessedValue)   // equals 98589 for any assessed value at or above 77411
newlyExemptValue2028 = min(assessedValue, 250000) - currentLawNonSchoolExempt(assessedValue)   // nominally 198589, but roughly 197000 to 198000 in reality because the 26411 tier is itself CPI indexed
estimatedAnnualSavings = newlyExemptValue * (nonSchoolMillageRate / 1000)
Pinellas worked example: 98589 * 0.0122011 = about $1,203 for 2027; 198589 * 0.0122011 = about $2,423 for 2028, at the 2025 countywide aggregate average non-school rate of 12.2011 mills
nonHomesteadAssessmentCap: before 2027-01-01 = 10 percent per year; beginning 2027-01-01 = 5 percent per year; applies to all levies other than school district levies; school levies remain uncapped at just value
saveOurHomesCap = min(3 percent, CPI change) per year, unchanged by Amendment 3
portabilityCap = 500000 transferable Save Our Homes differential with a three year lookback, unchanged by Amendment 3

## Caveats
GATE EVERYTHING ON PASSAGE. As of now Amendment 3 has not been voted on. It needs 60 percent approval on November 3, 2026 and takes effect January 1, 2027. The tool must carry a pending-state banner and a single AMENDMENT_STATUS constant to flip after the election. Do not ship outcome copy written as if it already passed.
GENUINELY UNCLEAR, BRANCH D AND G2: the five year clock has two conflicting official statements. The enrolled constitutional text says the larger exemption begins 'with the fifth year of exemption.' The enrolled ballot summary says a person must 'maintain Florida residency for five years prior to receiving the increased homestead exemption.' Those produce different years for anyone who establishes residency and buys in different years. This conflict is live, not historical, and the ballot language for this amendment was already rewritten once under court order in August 2026. The tool must present both readings side by side and tell the user no single date is reliable yet. Do not let a developer or a copy editor 'simplify' this into one number.
GENUINELY UNCLEAR, BRANCH E: the phrase 'maintained a permanent residence in this state as of December 31, 2026' is not defined in the constitutional text and there is no implementing legislation. Part year residents, people domiciled elsewhere who own Florida property, December 2026 closings, active duty military, and former Florida residents who left and returned all have no published answer. Route all of them to the unclear outcome. Do not guess.
GENUINELY UNCLEAR, NOT ADDRESSED AT ALL: surviving spouse continuation, inherited homestead, homestead held in a trust or LLC, and whether existing-resident status can ever be lost by moving out of state and returning. The verified sources are silent. Outcome E must list these and stop there.
DO NOT STACK THE EXEMPTIONS. The new non-school exemption replaces the current $25,000 plus $26,411 structure against non-school millage, it does not sit on top of it. Total non-school exempt value is up to $150,000 in 2027 and up to $250,000 in 2028, not $175,000 or $301,411. The Pinellas arithmetic ($150,000 minus $51,411 equals $98,589) confirms this reading. Any copy that says 'on top of your current exemption' is wrong.
SCHOOL TAXES ARE UNCHANGED FOR EVERYONE. The $25,000 school exemption is untouched. The House staff analysis contains a statement that the new exemption 'would apply to all ad valorem taxes,' which is contradicted by both the constitutional text and the ballot summary. Do not repeat that line and do not let a research pass pull it in as a source.
OUT-YEAR DOLLARS ARE ESTIMATES. The $250,000 existing-resident figure is CPI adjusted beginning January 1, 2029 and the $50,000 new-resident figure is CPI adjusted beginning January 1, 2028. Two different start dates. Any number past those dates must be labeled approximate.
THE 2028 COMPARISON FIGURE IS SOFT. The clean $198,589 of newly exempt value assumes the current $26,411 tier is frozen at its 2026 value, which it is not, since it is CPI indexed. The honest range is roughly $197,000 to $198,000. Present the 2028 delta as 'about' and never to the dollar.
SAVINGS NUMBERS ARE PINELLAS SPECIFIC. The $1,203 and $2,423 figures come from the Pinellas County Property Appraiser using a 12.2011 mill countywide aggregate average non-school rate for 2025. Hillsborough, Pasco, Manatee, and Polk rates differ, and city and special district rates differ within each county. Label every dollar figure as an illustration and push the user to their own TRIM notice.
THE 5 PERCENT CAP IS NOT A TAX CAP. It caps assessed value growth on non-homestead property for non-school levies only. Millage rates can still rise. School millage on non-homestead property remains completely uncapped at just value. Outcome F must say both of these or it is misleading.
FILING MECHANICS ARE OUTSIDE THE VERIFIED FACT SET. The March 1 homestead filing deadline and the January 1 status date are standard Florida homestead law, not part of the Amendment 3 sources provided. The outcome copy above deliberately says 'confirm the filing deadline with your county property appraiser' rather than stating a date. Verify against s.196.011 and s.196.031 before adding any specific deadline to the page.
AUTOMATIC APPLICATION IS AN ASSUMPTION. Nothing in the verified sources says whether existing homesteads get the increase automatically or whether any new filing is required. Outcome A is written as 'keep your homestead in good standing,' not 'you do not need to do anything.' Do not upgrade that to a promise without a Department of Revenue or property appraiser source.
LOCAL OPTIONS ARE POSSIBILITIES, NOT BENEFITS. Special districts can raise the exemption by referendum, counties and cities can raise it up to full assessed value under a uniform procedure the Legislature still has to write, and from January 1, 2030 locals can shorten the new-resident wait by a two thirds vote for a critical local need. None of this is predictable and none of it is something a homeowner can apply for. Mention as optional future possibilities only.
NO FULL ELIMINATION SCHEDULE EXISTS. Earlier drafts and a lot of secondary coverage reference a 'schedule for full elimination' of property taxes. That language is not in the final ballot summary and not in the constitutional text. Keep it out of the page entirely.
NEVER GATE THE ANSWER BEHIND THE LEAD FORM. Show the outcome first, CTA after. Also avoid asking for anything personal in the questions, no ages, no income, no household details. Residency date, property type, and a value band are enough.
ADD A VISIBLE 'not tax or legal advice, your county property appraiser decides' disclaimer on the tool itself, not only in a page footer. This tool makes a prediction about a tax benefit and people will act on it.