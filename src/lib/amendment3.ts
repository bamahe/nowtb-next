/**
 * Amendment 3 property tax math.
 *
 * This file is deliberately pure: no React, no hooks, no DOM. That means the
 * numbers can be unit tested on their own, which matters because this page
 * makes dollar claims to homeowners and a wrong number here is worse than no
 * calculator at all.
 *
 * JARGON, once:
 *   - "millage" is the tax rate. 1 mill = $1 of tax per $1,000 of taxable
 *     value. So tax = taxableValue * mills / 1000.
 *   - "assessed value" (AV) is the county's value for tax purposes, which is
 *     usually LOWER than market value for a homesteaded house because of the
 *     Save Our Homes 3% cap.
 *   - "exemption" reduces the TAXABLE VALUE, not the tax bill. A $150,000
 *     exemption does not save you $150,000. This is the single most common
 *     misunderstanding about Amendment 3.
 *   - "non-school millage" is every levy except the school district's. The
 *     school portion of your bill is NOT changed by Amendment 3 at all.
 *
 * Sources for every number are in SOURCES at the bottom of this file.
 */

// ---------------------------------------------------------------------------
// Current law, 2026 baseline
// ---------------------------------------------------------------------------

/** First homestead band: $25,000 off everything, including school taxes. */
export const SCHOOL_EXEMPTION = 25_000;

/**
 * Second homestead band, non-school only. It is $26,411 and not $25,000
 * because this band is CPI adjusted and has drifted up over the years. Most
 * coverage of Amendment 3 uses $50,000 here and gets the savings wrong.
 */
export const SECOND_BAND = 26_411;

/**
 * The "donut hole": the second band only applies to assessed value above
 * $50,000. A house assessed at $60,000 gets $25,000 plus $10,000, not
 * $25,000 plus $26,411.
 */
export const DONUT_HOLE_FLOOR = 50_000;

/** Total current non-school homestead exemption at full value: $51,411. */
export const CURRENT_FULL_EXEMPTION = SCHOOL_EXEMPTION + SECOND_BAND;

// ---------------------------------------------------------------------------
// Amendment 3, if it passes
// ---------------------------------------------------------------------------

/** Non-school homestead exemption from Jan 1 2027. REPLACES the current one. */
export const AM3_EXEMPTION_2027 = 150_000;

/** Non-school homestead exemption from Jan 1 2028. Also a replacement. */
export const AM3_EXEMPTION_2028 = 250_000;

/**
 * What someone who was NOT a Florida resident on Dec 31 2026 gets during
 * their first four years of holding the exemption: the plain $50,000, with
 * no CPI adjusted second band.
 */
export const NEW_RESIDENT_EXEMPTION = 50_000;

/** Non-homestead annual assessment growth cap: 10% today, 5% under Am 3. */
export const NON_HOMESTEAD_CAP_CURRENT = 0.10;
export const NON_HOMESTEAD_CAP_AM3 = 0.05;

// ---------------------------------------------------------------------------
// Millage presets
// ---------------------------------------------------------------------------

export interface MillageDistrict {
  id: string;
  county: string;
  label: string;
  /** School district mills. Amendment 3 does not touch these. */
  school: number;
  /** Everything except the school district. This is what Amendment 3 affects. */
  nonSchool: number;
  source: string;
}

/**
 * Real certified rates, not averages we made up. Millage varies enormously
 * INSIDE a single county: Pinellas runs from 9.03 mills unincorporated to
 * 13.63 in St. Petersburg, which changes the answer by about 30%. That is why
 * the district picker exists and why the rate stays editable.
 *
 * Manatee is deliberately absent. The only Manatee figure we could confirm
 * from a primary source was the countywide operating millage, which excludes
 * the MSTU, EMS, mosquito control, SWFWMD and the school district. Shipping a
 * wrong Manatee number is worse than shipping none, so Manatee homeowners get
 * the custom option below.
 */
export const MILLAGE_DISTRICTS: MillageDistrict[] = [
  {
    id: "hillsborough-unincorporated",
    county: "Hillsborough",
    label: "Unincorporated Hillsborough",
    school: 6.3340,
    nonSchool: 11.9100,
    source: "Hillsborough County Property Appraiser Tax Estimator, retrieved Oct 2026",
  },
  {
    id: "hillsborough-tampa",
    county: "Hillsborough",
    label: "City of Tampa",
    school: 6.3340,
    nonSchool: 13.4013,
    source: "Hillsborough County Property Appraiser Tax Estimator, retrieved Oct 2026",
  },
  {
    id: "pinellas-countywide",
    county: "Pinellas",
    label: "Pinellas countywide average",
    school: 6.2930,
    nonSchool: 12.2011,
    source: "Pinellas County Property Appraiser Amendment 3 FAQ, 2025 countywide aggregate",
  },
  {
    id: "pinellas-unincorporated",
    county: "Pinellas",
    label: "Unincorporated Pinellas",
    school: 6.2930,
    nonSchool: 9.0299,
    source: "Pinellas County Tax Collector 2025 millage schedule",
  },
  {
    id: "pinellas-st-petersburg",
    county: "Pinellas",
    label: "St. Petersburg",
    school: 6.2930,
    nonSchool: 13.6267,
    source: "Pinellas County Tax Collector 2025 millage schedule",
  },
  {
    id: "pinellas-clearwater",
    county: "Pinellas",
    label: "Clearwater",
    school: 6.2930,
    nonSchool: 13.0592,
    source: "Pinellas County Tax Collector 2025 millage schedule",
  },
  {
    id: "pinellas-largo",
    county: "Pinellas",
    label: "Largo",
    school: 6.2930,
    nonSchool: 12.6942,
    source: "Pinellas County Tax Collector 2025 millage schedule",
  },
  {
    id: "pasco-unincorporated-fire",
    county: "Pasco",
    label: "Unincorporated Pasco with MSTU fire",
    school: 6.1840,
    nonSchool: 10.5126,
    source: "Pasco County Property Appraiser, 2026 roll certified Oct 6 2026",
  },
  {
    id: "pasco-unincorporated",
    county: "Pasco",
    label: "Unincorporated Pasco, no MSTU fire",
    school: 6.1840,
    nonSchool: 8.2452,
    source: "Pasco County Property Appraiser, 2026 roll certified Oct 6 2026",
  },
  {
    id: "pasco-new-port-richey",
    county: "Pasco",
    label: "New Port Richey",
    school: 6.1840,
    nonSchool: 15.9400,
    source: "Pasco County Property Appraiser, 2026 roll certified Oct 6 2026",
  },
  {
    id: "polk-unincorporated",
    county: "Polk",
    label: "Unincorporated Polk (SWFWMD)",
    school: 5.2580,
    nonSchool: 7.6391,
    source: "Polk County Property Appraiser 2026 Final Millage Rates, printed Oct 6 2026",
  },
];

export const DEFAULT_DISTRICT_ID = "hillsborough-unincorporated";

// ---------------------------------------------------------------------------
// The calculation
// ---------------------------------------------------------------------------

export interface Amd3Input {
  /** County assessed value of the home, in dollars. */
  assessedValue: number;
  /** School district mills. */
  schoolMills: number;
  /** All non-school mills combined. */
  nonSchoolMills: number;
  /** Is this the owner's homesteaded primary residence? */
  homesteaded: boolean;
  /**
   * Was this person a permanent Florida resident on Dec 31 2026? If false they
   * are in the four year waiting period and get the plain $50,000 instead.
   */
  residentBeforeCutoff: boolean;
}

export interface YearResult {
  year: number;
  /** Non-school exemption applied this year. */
  exemption: number;
  nonSchoolTaxable: number;
  nonSchoolTax: number;
  schoolTaxable: number;
  schoolTax: number;
  totalTax: number;
}

export interface Amd3Result {
  /** What the bill looks like if Amendment 3 fails and nothing changes. */
  currentLaw: YearResult;
  /** 2027 under Amendment 3. */
  am3_2027: YearResult;
  /** 2028 under Amendment 3. */
  am3_2028: YearResult;
  /** Positive means a saving, negative means Amendment 3 costs this owner money. */
  savings2027: number;
  savings2028: number;
  /**
   * True when this owner ends up paying MORE under Amendment 3. Happens to
   * people who are not Florida residents by Dec 31 2026 and own a home
   * assessed above about $76,411, because their $50,000 is smaller than the
   * $51,411 they would have had under current law.
   */
  isIncrease: boolean;
}

/** Tax in dollars for a taxable value at a millage rate. */
function taxOf(taxableValue: number, mills: number): number {
  return Math.max(0, taxableValue) * (mills / 1000);
}

/**
 * The current law non-school homestead exemption, including the donut hole.
 * At AV $40,000 this is $40,000. At $60,000 it is $35,000. At $76,411+ it is
 * the full $51,411.
 */
export function currentExemption(assessedValue: number): number {
  const band1 = Math.min(SCHOOL_EXEMPTION, assessedValue);
  const band2 = Math.min(SECOND_BAND, Math.max(0, assessedValue - DONUT_HOLE_FLOOR));
  return band1 + band2;
}

function buildYear(
  year: number,
  assessedValue: number,
  nonSchoolExemption: number,
  homesteaded: boolean,
  schoolMills: number,
  nonSchoolMills: number,
): YearResult {
  // School side never changes: homesteaded homes get the flat $25,000, and
  // non-homesteaded property gets nothing at all.
  const schoolTaxable = homesteaded
    ? Math.max(0, assessedValue - SCHOOL_EXEMPTION)
    : assessedValue;
  const nonSchoolTaxable = Math.max(0, assessedValue - nonSchoolExemption);

  const schoolTax = taxOf(schoolTaxable, schoolMills);
  const nonSchoolTax = taxOf(nonSchoolTaxable, nonSchoolMills);

  return {
    year,
    exemption: nonSchoolExemption,
    nonSchoolTaxable,
    nonSchoolTax,
    schoolTaxable,
    schoolTax,
    totalTax: schoolTax + nonSchoolTax,
  };
}

/**
 * Work out what Amendment 3 does to one specific home.
 *
 * Savings are always computed as (current law tax) minus (Amendment 3 tax) for
 * the SAME assessed value, so we are never comparing different years' values
 * and calling the difference a saving.
 */
export function computeAmendment3(input: Amd3Input): Amd3Result {
  const { assessedValue: av, schoolMills, nonSchoolMills, homesteaded, residentBeforeCutoff } = input;

  // Non-homesteaded property gets no homestead exemption in any scenario. The
  // 5% cap helps it over time, but that is a growth cap, not an exemption, so
  // in a single year with the same assessed value there is no difference.
  if (!homesteaded) {
    const flat = buildYear(2026, av, 0, false, schoolMills, nonSchoolMills);
    return {
      currentLaw: flat,
      am3_2027: { ...flat, year: 2027 },
      am3_2028: { ...flat, year: 2028 },
      savings2027: 0,
      savings2028: 0,
      isIncrease: false,
    };
  }

  const currentLaw = buildYear(
    2026, av, currentExemption(av), true, schoolMills, nonSchoolMills,
  );

  // A new resident is capped at the plain $50,000 for their first four years.
  const exempt2027 = residentBeforeCutoff
    ? Math.min(AM3_EXEMPTION_2027, av)
    : Math.min(NEW_RESIDENT_EXEMPTION, av);
  const exempt2028 = residentBeforeCutoff
    ? Math.min(AM3_EXEMPTION_2028, av)
    : Math.min(NEW_RESIDENT_EXEMPTION, av);

  const am3_2027 = buildYear(2027, av, exempt2027, true, schoolMills, nonSchoolMills);
  const am3_2028 = buildYear(2028, av, exempt2028, true, schoolMills, nonSchoolMills);

  const savings2027 = currentLaw.totalTax - am3_2027.totalTax;
  const savings2028 = currentLaw.totalTax - am3_2028.totalTax;

  return {
    currentLaw,
    am3_2027,
    am3_2028,
    savings2027,
    savings2028,
    isIncrease: savings2027 < -0.5 || savings2028 < -0.5,
  };
}

/** Round to whole dollars for display. */
export function dollars(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/**
 * SOURCES
 * - Enrolled CS/HJR 1F: https://www.flsenate.gov/Session/Bill/2026F/1F/BillText/er/PDF
 * - Pinellas County Property Appraiser Amendment 3 FAQ: https://www.pcpao.gov/amendment3
 * - Florida 2026 constitutional amendment booklet:
 *   https://files.floridados.gov/media/711369/eng-2026-booklet-constitutional-amendpub-updated-20260903.pdf
 */
