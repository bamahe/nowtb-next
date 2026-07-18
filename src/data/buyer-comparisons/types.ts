/**
 * TypeScript interfaces for the Buyer Home Comparison Tool.
 * Each Comparison object powers a full interactive comparison page
 * at /compare/[slug].
 */

export interface Property {
  address: string;
  neighborhood: string;
  zipCode: string;
  priceLabel: string;
  priceNote: string;
  photo: string; // path relative to public/
  photoAlt: string;
  facts: { label: string; value: string }[];
  pros: string[];
  cons: string[];
  photoPros: string[];
  photoCons: string[];
}

export interface UpfrontRow {
  id: string;
  label: string;
  sublabel: string;
  defaultA: number;
  defaultB: number;
  step: number;
}

export interface MonthlyRow {
  id: string;
  label: string;
  sublabel: string;
  defaultA: number;
  defaultB: number;
  step: number;
}

export interface CommuteData {
  origin: string;
  originAddress: string;
  propertyA: {
    distance: string;
    middayDrive: string;
    rushHourDrive: string;
    route: string;
    trafficNotes: string;
  };
  propertyB: {
    distance: string;
    middayDrive: string;
    rushHourDrive: string;
    route: string;
    trafficNotes: string;
  };
  defaults: {
    minutesA: number;
    minutesB: number;
    milesA: number;
    milesB: number;
    daysA: number;
    daysB: number;
    mpg: number;
    fuelPrice: number;
  };
}

export interface BuildYearRow {
  component: string;
  propertyA: string;
  propertyB: string;
}

export interface PriorityRow {
  label: string;
  winner: "a" | "b" | "calc" | "tie";
  winnerLabel: string;
  defaultWeight: number;
}

export interface Callout {
  title: string;
  body: string;
  color?: string; // defaults to red accent
}

export interface Comparison {
  slug: string;
  title: string;
  subtitle: string;
  buyerFirstName?: string;
  createdAt: string;
  noindex: boolean;
  properties: [Property, Property];
  factsSectionNote: string;
  upfrontSectionNote: string;
  upfrontRows: UpfrontRow[];
  monthlySectionNote: string;
  monthlyCallout?: { title: string; body: string };
  monthlyRows: MonthlyRow[];
  commuteData: CommuteData;
  buildYearSectionNote: string;
  buildYearRows: BuildYearRow[];
  buildYearCallout: Callout;
  prioritySectionNote: string;
  priorityRows: PriorityRow[];
  finalCallout: Callout;
  sqftA: number;
  sqftB: number;
}
