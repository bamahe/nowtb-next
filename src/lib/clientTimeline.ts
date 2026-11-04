// =============================================================================
// Client Timeline: types and helpers
//
// One JSON file per client in data/timelines/<slug>.json drives the page at
// https://nowtb.com/clients/t/<slug>. Edit the JSON, push, done.
// See README-clients.md, "Client Timeline" section, for every field.
// =============================================================================

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Every kind of step a timeline can show. Drives the icon and label. */
export type EventKind =
  | "showing"
  | "open_house"
  | "offer_sent"
  | "offer_accepted"
  | "escrow_deposit"
  | "inspection"
  | "appraisal"
  | "loan_approval"
  | "final_walkthrough"
  | "closing"
  | "other";

export type EventStatus = "scheduled" | "done" | "canceled";

export type TimelineEvent = {
  kind: EventKind;
  /** Big line on the card, e.g. "Property Showing" */
  title: string;
  /** Local time with offset, e.g. "2026-11-08T10:00:00-05:00". Omit for "date TBD" */
  when?: string;
  /** Set true when only the date matters (deadlines), hides the clock time */
  allDay?: boolean;
  status?: EventStatus;
  /** One or two plain sentences for the client */
  note?: string;

  // Property fields, mostly for showings
  address?: string;
  city?: string;
  zip?: string;
  mls?: string;
  price?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  /** Full https link to a listing photo. No photo = clean placeholder */
  photo?: string;
  /**
   * Gate code only. NEVER put lockbox, Supra, or combo codes in this file:
   * the client sees everything here.
   */
  gateCode?: string;
};

export type TimelineData = {
  client: string;
  /** Short line under the client name, e.g. "Home search, Brandon / Valrico" */
  headline?: string;
  agent?: {
    name?: string;
    title?: string;
    brokerage?: string;
    phone?: string;
    email?: string;
    photo?: string;
  };
  events: TimelineEvent[];
};

const DATA_DIR = join(process.cwd(), "data", "timelines");

/** Barrett is the default agent. A file can override any piece of this. */
export const DEFAULT_AGENT = {
  name: "Barrett Henry",
  title: "Licensed Florida Real Estate Broker",
  brokerage: "REMAX Collective",
  phone: "(813) 733-7907",
  email: "barrett@nowtb.com",
  photo: "",
};

export function loadTimeline(slug: string): TimelineData | null {
  // Only letters, numbers, hyphens: nothing can climb out of data/timelines
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  try {
    return JSON.parse(
      readFileSync(join(DATA_DIR, `${slug}.json`), "utf8")
    ) as TimelineData;
  } catch {
    return null;
  }
}

export function timelineSlugs(): string[] {
  try {
    return readdirSync(DATA_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

const TZ = "America/New_York";

/**
 * Turns a "when" value into a real moment in time.
 * "2026-11-08T10:00" (no offset) is read as Tampa local time, so you never
 * have to think about daylight saving. A value with an offset or Z is used as is.
 */
export function toDate(when: string): Date {
  if (/[zZ]|[+-]\d\d:?\d\d$/.test(when)) return new Date(when);
  const [d, t = "00:00"] = when.split("T");
  const asUtc = new Date(`${d}T${t.length === 5 ? t + ":00" : t}Z`);
  // How far New York is from UTC at that moment (-4h or -5h)
  const ny = new Date(asUtc.toLocaleString("en-US", { timeZone: TZ }));
  const utc = new Date(asUtc.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(asUtc.getTime() + (utc.getTime() - ny.getTime()));
}

/**
 * Sort by time. A step with no date yet (TBD) keeps its spot from the file:
 * it borrows the time of the step right before it, so "Appraisal" listed
 * between Inspection and Closing stays there.
 */
export function sortEvents(events: TimelineEvent[]): TimelineEvent[] {
  let last = -Infinity;
  return events
    .map((e, i) => {
      const t = e.when ? toDate(e.when).getTime() : last;
      if (e.when) last = t;
      return { e, i, t };
    })
    .sort((a, b) => (a.t === b.t ? a.i - b.i : a.t - b.t))
    .map((x) => x.e);
}

/** nowtb.com listing link, the format that actually resolves on the site. */
export function nowtbListingUrl(e: TimelineEvent): string | null {
  if (!e.mls || !e.address) return null;
  const street = e.address
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const city = (e.city || "fl").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `/properties/StellarMLS/${e.mls}/${city}/${street}/`;
}

/** Full one-line address for maps. */
export function fullAddress(e: TimelineEvent): string {
  return [e.address, e.city, e.zip ? `FL ${e.zip}` : "FL"]
    .filter(Boolean)
    .join(", ");
}

/** Opens turn-by-turn directions in Google Maps (works on iPhone and Android). */
export function directionsUrl(e: TimelineEvent): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    fullAddress(e)
  )}`;
}

/** Plain Google Maps search; the client can tap into Street View from there. */
export function mapUrl(e: TimelineEvent): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddress(e)
  )}`;
}


export function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(toDate(iso));
}

export function fmtTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
  }).format(toDate(iso));
}

/** Day key used to group showings that happen on the same day. */
export function dayKey(iso?: string): string {
  if (!iso) return "tbd";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(toDate(iso));
}

export const KIND_LABEL: Record<EventKind, string> = {
  showing: "Showing",
  open_house: "Open House",
  offer_sent: "Offer Sent",
  offer_accepted: "Offer Accepted",
  escrow_deposit: "Escrow Deposit",
  inspection: "Inspection",
  appraisal: "Appraisal",
  loan_approval: "Loan Approval",
  final_walkthrough: "Final Walkthrough",
  closing: "Closing",
  other: "Update",
};
