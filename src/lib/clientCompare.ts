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
  /** Optional. Only used to make the listing URL read nicely. */
  city?: string;
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

/**
 * What the sliders on the page can change. Leave a field out and the number
 * from settings is used instead, so computeHome(home, settings) with no third
 * argument behaves exactly as it always did.
 */
export type Overrides = {
  /** Cash down as a share of price, so 0.05 is 5% down. Defaults to 0. */
  downPct?: number;
  /** New VA rate as a decimal. Defaults to settings.vaRate. */
  vaRate?: number;
  /** Second loan rate as a decimal. Defaults to settings.secondRate. */
  secondRate?: number;
  /** Insurance per month, applied to every home. Defaults to each home's ins. */
  insMo?: number;
}

/** Build a listing URL on nowtb.com. Only the MLS id is used for the lookup. */
export function listingUrl(home: Home): string {
  const slug = home.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const city = home.city ? home.city : "fl";
  return `/properties/StellarMLS/${home.mls}/${city}/${slug}/`;
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

  // Option A, a brand new VA loan
  newVaPI: number;
  newVaAllIn: number;
  /** Cash the buyer puts down under Option A. Zero unless a slider moved it. */
  newVaDown: number;

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
    /**
     * True when the cash slider was pushed below what a second lender allows.
     * The math floors the cash at that minimum, so the page can say why.
     */
    cashFloored: boolean;
  };

  // Commute versus the baseline home
  extraDriveHoursMo: number;
  extraDriveCostMo: number;
};

/** Run one home through the whole model. */
export function computeHome(
  home: Home,
  s: Settings,
  o: Overrides = {}
): ComputedHome {
  const { price, sqft, cdd, hoa, loan } = home;

  // Slider values when the page sends them, otherwise the file's own numbers
  const downPct = o.downPct ?? 0;
  const vaRate = o.vaRate ?? s.vaRate;
  const secondRate = o.secondRate ?? s.secondRate;
  const ins = o.insMo ?? home.ins;

  // Option A, a new VA loan for whatever is left after the cash down
  const newVaDown = usd(price * downPct);
  const newVaPI = usd(pmt(price - newVaDown, vaRate));

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

    // A second lender will not go past secondMaxCltv of price, so there is a
    // floor on how little cash can work. Sliding below it is not an option a
    // lender would actually fund, so the math holds it at the floor.
    const minCash = price * (1 - s.secondMaxCltv);
    const wantCash = downPct > 0 ? price * downPct : minCash;
    const cashFloored = wantCash < minCash;
    // Never ask for more cash than the gap itself
    const cashDown = usd(Math.min(Math.max(wantCash, minCash), gap));

    const second = usd(Math.max(0, gap - cashDown));
    const secondPI = usd(pmt(second, secondRate));

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
      cashFloored,
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
    newVaDown,
    sellerEquity,
    assume,
    extraDriveHoursMo,
    extraDriveCostMo,
  };
}

/** Run every home in a client file through the model. */
export function computeAll(
  data: ClientData,
  o: Overrides = {}
): ComputedHome[] {
  return data.homes.map((h) => computeHome(h, data.settings, o));
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
