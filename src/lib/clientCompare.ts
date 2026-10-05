// =============================================================================
// clientCompare.ts: the math behind the private client comparison pages
//
// Pure functions only. No network calls, no file reads, no dates. Feed it the
// JSON from data/clients/<slug>.json and it hands back one computed row per
// home. Everything that lands on the page in dollars is rounded to whole
// dollars here, so the page never has to think about cents.
// =============================================================================

// ── Shapes of the JSON ───────────────────────────────────────────────────────

/** One workplace the clients drive to. */
export type Workplace = {
  name: string;
  /** Which of the two of them drives there. Optional. */
  who?: string;
};

/** Drive time and distance from one home to one workplace. */
export type Commute = {
  minutes: number;
  miles: number;
};

/**
 * The seller's existing mortgage, pulled from public records.
 * `assumable` is the switch that turns Option B on for a home.
 */
export type Loan = {
  assumable: boolean;
  /** VA, FHA, USDA, Conventional, etc. */
  type: string;
  lender: string;
  recorded: string;
  term: string;
  /** Decimal, so 2.75% is 0.0275 */
  rate: number;
  /** Estimated balance remaining today */
  bal: number;
  /** The seller's monthly principal and interest */
  pi: number;
  /** Monthly mortgage insurance that rides along with the loan (FHA) */
  mip: number;
};

export type Home = {
  name: string;
  mls: string;
  community: string;
  city: string;
  price: number;
  /** Original list price. Shown as "was $X" when it differs from price. */
  origPrice: number;
  daysOnMarket: number;
  bedsBaths: string;
  sqft: number;
  yearBuilt: number;
  stories: number;
  garage: string;
  lot: string;
  roof: string;
  /** Annual CDD fee in dollars. 0 when the community has none. */
  cdd: number;
  /** HOA in dollars per MONTH */
  hoa: number;
  /** Homeowners insurance in dollars per MONTH */
  ins: number;
  loan: Loan;
  /** One entry per workplace, in the same order as settings.workplaces */
  commute: Commute[];
  /** One way miles added versus the baseline home. The baseline itself is 0. */
  extraMilesOneWayVsBaseline: number;
  likes: string[];
  watchOuts: string[];
  negotiatingRoom: string;
};

export type Settings = {
  /** Today's VA rate as a decimal, so 6.75% is 0.0675 */
  vaRate: number;
  /** Assessed value as a share of price, so 0.80 means 80% of price */
  assessRatio: number;
  /** Homestead exemption in dollars */
  homesteadExemption: number;
  /** Total millage as a decimal, so 19.1 mills is 0.0191 */
  millage: number;
  /** Monthly kilowatt hours used per square foot */
  kwh_per_sf: number;
  /** Cost per kilowatt hour in dollars */
  electricPerKwh: number;
  /** How far a second lender will go, counting the first loan. 0.90 is typical. */
  secondMaxCltv: number;
  /** Rate on the second loan as a decimal */
  secondRate: number;
  /** How many of them commute */
  drivers: number;
  /** Work days per month */
  workDays: number;
  /** Average speed in traffic, used to turn extra miles into extra hours */
  avgMph: number;
  gasCostPerMile: number;
  /** Name of the home all commutes are measured against */
  baselineHome: string;
  workplaces: Workplace[];
};

export type ClientData = {
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
  const elecMo = usd(sqft * s.kwh_per_sf * s.electricPerKwh);

  // Everything that does not change based on which loan they use
  const fixed = taxMo + cddMo + hoaMo + insMo;

  const newVaAllIn = newVaPI + fixed + elecMo;

  const pricePerSqft = usd(price / sqft);
  const sellerEquity = usd(price - loan.bal);

  // Option B, only for homes with an assumable loan
  let assume: ComputedHome["assume"] = null;
  if (loan.assumable) {
    // What is left to cover between the seller's balance and the price
    const gap = usd(price - loan.bal);
    // A second lender will not go past secondMaxCltv of price, so the rest is cash
    const cashDown = usd(price * (1 - s.secondMaxCltv));
    const second = usd(Math.max(0, price * s.secondMaxCltv - loan.bal));
    const secondPI = usd(pmt(second, s.secondRate));

    const assumePI = usd(loan.pi + loan.mip + secondPI);
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
      allCashGapAllIn: usd(loan.pi + loan.mip) + fixed + elecMo,
    };
  }

  // Commute penalty versus the baseline home. Round trip, both drivers.
  const extraMiles = home.extraMilesOneWayVsBaseline;
  const extraDriveHoursMo =
    (extraMiles * 2 * s.drivers * s.workDays) / s.avgMph;
  const extraDriveCostMo = usd(
    extraMiles * 2 * s.drivers * s.workDays * s.gasCostPerMile
  );

  return {
    home,
    isBaseline: home.name === s.baselineHome,
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
