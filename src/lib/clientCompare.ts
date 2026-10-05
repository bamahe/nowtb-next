// =============================================================================
// clientCompare.ts: the math behind the private client comparison pages
//
// Pure functions only. No network calls, no file reads, no dates. Feed it the
// JSON from data/clients/<slug>.json and it hands back one computed row per
// home. Everything that lands on the page in dollars is rounded to whole
// dollars here, so the page never has to think about cents.
//
// Two quirks of the data worth knowing before you edit anything:
//  - settings.vaRate and settings.secondRate are DECIMALS (0.06875 is 6.875%)
//    but loan.rate is a WHOLE PERCENT (3.18 is 3.18%). Loan rate is only ever
//    displayed, never used in a calculation, so the two never meet.
//  - kwh_per_sf lives on each home, not in settings, because a two story house
//    and a one story house of the same size do not use the same power.
// =============================================================================

// ── Shapes of the JSON ───────────────────────────────────────────────────────

/** Drive time and distance from one home to one workplace. Both free text. */
export type CommuteLeg = {
  miles: string;
  time: string;
};

export type CommuteBlock = {
  toWork1: CommuteLeg;
  toWork2: CommuteLeg;
  /** One way miles added versus the baseline home. The baseline itself is 0. */
  extraMilesOneWayVsBaseline: number;
};

/**
 * The seller's existing mortgage, pulled from public records.
 * `assumable` is the switch that turns Option B on for a home. When it is true,
 * pi, mip and bal all have to be filled in or Option B cannot be computed.
 */
export type Loan = {
  /** VA, FHA, USDA, Conventional */
  type: string;
  lender: string;
  /** Year and month the mortgage was recorded, as "2021-09" */
  recorded: string;
  /** Original loan amount */
  orig: number;
  /** Estimated balance remaining today */
  bal: number;
  /** A WHOLE PERCENT, so 3.01 means 3.01% */
  rate: number;
  /** Free text, for example "30-yr" or "ends 2051" */
  term: string;
  assumable: boolean;
  /** The seller's monthly principal and interest. Assumable homes only. */
  pi?: number;
  /** Monthly mortgage insurance riding with the loan. FHA has it, VA does not. */
  mip?: number;
  /** Payments left on the seller's loan. Assumable homes only. */
  remaining?: number;
};

export type Home = {
  id: string;
  name: string;
  community: string;
  mls: string;
  price: number;
  /** Original list price. Shown as "was $X" when it differs from price. */
  orig: number;
  /** Days on market */
  dom: number;
  beds: number;
  /** Can be a half, for example 2.5 */
  baths: number;
  sqft: number;
  /** Year built */
  year: number;
  /** Garage spaces */
  garage: number;
  /** Lot size in acres */
  lot: number;
  stories: number;
  roof: string;
  /** HOA in dollars per MONTH */
  hoa: number;
  /** Annual CDD fee in dollars. 0 when the community has none. */
  cdd: number;
  /** Homeowners insurance in dollars per MONTH */
  ins: number;
  /** Monthly kilowatt hours used per square foot, for this house */
  kwh_per_sf: number;
  likes: string[];
  /** Watch outs */
  cons: string[];
  /** Negotiating room, one paragraph */
  leverage: string;
  loan: Loan;
  commute: CommuteBlock;
};

export type Settings = {
  /** Today's VA rate as a decimal, so 6.875% is 0.06875 */
  vaRate: number;
  /** Rate on the second loan as a decimal */
  secondRate: number;
  /** How far a second lender will go, counting the first loan. 0.9 is typical. */
  secondMaxCltv: number;
  /** Total millage as a decimal, so 17.5 mills is 0.0175 */
  millage: number;
  /** Homestead exemption in dollars */
  homesteadExemption: number;
  /** Assessed value as a share of price, so 0.85 means 85% of price */
  assessRatio: number;
  /** Cost per kilowatt hour in dollars */
  electricPerKwh: number;
  gasCostPerMile: number;
  /** Average speed in traffic, used to turn extra miles into extra hours */
  avgMph: number;
  /** Work days per month */
  workDays: number;
  /** How many of them commute */
  drivers: number;
  /** Must match one home's id. That home shows "Baseline" in the commute rows. */
  baselineHomeId: string;
  /** Workplace names, in the same order as toWork1 and toWork2 */
  workplaces: string[];
  /** What they pay in rent today, free text. Optional. */
  rentNow?: string;
};

export type ClientData = {
  slug: string;
  client: string;
  updated: string;
  settings: Settings;
  homes: Home[];
};

// ── The one piece of real math ───────────────────────────────────────────────

/**
 * Standard mortgage payment. Principal, annual rate as a decimal, number of
 * monthly payments. Returns 0 for a loan of zero or less so the callers do not
 * have to guard against an empty second loan.
 */
export function pmt(P: number, rate: number, n = 360): number {
  if (P <= 0) return 0;
  const r = rate / 12;
  return (P * r) / (1 - Math.pow(1 + r, -n));
}

/** Round to whole dollars. Everything the page shows goes through this. */
function usd(n: number): number {
  return Math.round(n);
}

// ── What one home works out to ───────────────────────────────────────────────

export type ComputedHome = {
  home: Home;
  /** True when this home is the commute baseline */
  isBaseline: boolean;

  // The house
  pricePerSqft: number;

  // Monthly carrying costs that are the same under either loan option
  taxYear: number;
  taxMo: number;
  cddMo: number;
  hoaMo: number;
  insMo: number;
  elecMo: number;
  /** tax + CDD + HOA + insurance. Does not include electric. */
  fixed: number;

  // Option A, a brand new VA loan at 0% down
  newVaPI: number;
  newVaAllIn: number;

  // The seller's side
  sellerEquity: number;

  // Option B, taking over the seller's loan. Null when it is not assumable.
  assume: null | {
    gap: number;
    cashDown: number;
    second: number;
    secondPI: number;
    assumePI: number;
    assumeAllIn: number;
    saveVsNewVa: number;
    /** What it costs monthly if they bring the whole gap in cash, no second */
    allCashGapAllIn: number;
  };

  // Commute versus the baseline home
  extraDriveHoursMo: number;
  extraDriveCostMo: number;
};

/** Run one home through the whole model. */
export function computeHome(home: Home, s: Settings): ComputedHome {
  const { price, sqft, cdd, hoa, ins, loan } = home;

  // Option A, a new VA loan for the full price
  const newVaPI = usd(pmt(price, s.vaRate));

  // Property tax. Assessed value times millage, less the homestead exemption.
  const taxYear = usd(
    Math.max(0, (price * s.assessRatio - s.homesteadExemption) * s.millage)
  );
  const taxMo = usd(taxYear / 12);

  const cddMo = usd(cdd / 12);
  const hoaMo = usd(hoa);
  const insMo = usd(ins);
  const elecMo = usd(sqft * home.kwh_per_sf * s.electricPerKwh);

  // Everything that does not change based on which loan they use
  const fixed = taxMo + cddMo + hoaMo + insMo;

  const newVaAllIn = newVaPI + fixed + elecMo;

  const pricePerSqft = usd(price / sqft);
  const sellerEquity = usd(price - loan.bal);

  // Option B, only for homes with an assumable loan
  let assume: ComputedHome["assume"] = null;
  if (loan.assumable && typeof loan.pi === "number") {
    const pi = loan.pi;
    const mip = loan.mip ?? 0;

    // What is left to cover between the seller's balance and the price
    const gap = usd(price - loan.bal);
    // A second lender will not go past secondMaxCltv of price, so the rest is cash
    const cashDown = usd(price * (1 - s.secondMaxCltv));
    const second = usd(Math.max(0, price * s.secondMaxCltv - loan.bal));
    const secondPI = usd(pmt(second, s.secondRate));

    const assumePI = usd(pi + mip + secondPI);
    const assumeAllIn = assumePI + fixed + elecMo;

    assume = {
      gap,
      cashDown,
      second,
      secondPI,
      assumePI,
      assumeAllIn,
      saveVsNewVa: newVaPI - assumePI,
      // Same loan, no second: they fund the gap out of pocket instead
      allCashGapAllIn: usd(pi + mip) + fixed + elecMo,
    };
  }

  // Commute penalty versus the baseline home. Round trip, both drivers.
  const extraMiles = home.commute.extraMilesOneWayVsBaseline;
  const extraDriveHoursMo =
    (extraMiles * 2 * s.drivers * s.workDays) / s.avgMph;
  const extraDriveCostMo = usd(
    extraMiles * 2 * s.drivers * s.workDays * s.gasCostPerMile
  );

  return {
    home,
    isBaseline: home.id === s.baselineHomeId,
    pricePerSqft,
    taxYear,
    taxMo,
    cddMo,
    hoaMo,
    insMo,
    elecMo,
    fixed,
    newVaPI,
    newVaAllIn,
    sellerEquity,
    assume,
    extraDriveHoursMo,
    extraDriveCostMo,
  };
}

/** Run every home in a client file through the model. */
export function computeAll(data: ClientData): ComputedHome[] {
  return data.homes.map((h) => computeHome(h, data.settings));
}

/**
 * The number that leads each summary card: the cheapest monthly all in we can
 * actually get them. If the loan is assumable that is Option B, otherwise it is
 * a new VA loan.
 */
export function bestMonthly(c: ComputedHome): number {
  return c.assume ? c.assume.assumeAllIn : c.newVaAllIn;
}

/** Pull one commute leg by workplace index. */
export function commuteLeg(home: Home, i: number): CommuteLeg {
  return i === 0 ? home.commute.toWork1 : home.commute.toWork2;
}

/** "2021-09" reads as "September 2021". Anything unexpected passes through. */
export function readableMonth(ym: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return ym;
  const names = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const idx = Number(m[2]) - 1;
  if (idx < 0 || idx > 11) return ym;
  return `${names[idx]} ${m[1]}`;
}
