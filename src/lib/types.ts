// =============================================================================
// TypeScript types for Bridge/Stellar MLS listing data
// These match the RESO Web API / OData fields returned by Bridge Interactive
// =============================================================================

/** Single photo/media item attached to a listing */
export interface ListingMedia {
  MediaURL: string;
  ShortDescription?: string;
  Order: number;
}

/**
 * Full listing record from Bridge/Stellar MLS.
 * Field names match the RESO Data Dictionary used by Bridge Interactive.
 */
export interface Listing {
  // --- Identifiers ---
  ListingKey: string;                // Unique key in MLS system
  ListingId: string;                 // Human-readable MLS number

  // --- Status ---
  StandardStatus: string;            // Active, Pending, Closed, etc.

  // --- Property type ---
  PropertyType: string;              // Residential, Land, Commercial, etc.
  PropertySubType?: string;          // Single Family, Condo, Townhouse, etc.

  // --- Location ---
  City: string;
  StateOrProvince: string;
  PostalCode: string;
  UnparsedAddress: string;           // Full address as one string
  StreetNumber?: string;
  StreetName?: string;
  StreetSuffix?: string;
  Latitude?: number;
  Longitude?: number;

  // --- Pricing ---
  ListPrice: number;
  ClosePrice?: number;               // Only populated on sold listings

  // --- Property details ---
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  LivingArea?: number;               // Square footage
  LotSizeAcres?: number;
  YearBuilt?: number;
  GarageSpaces?: number;

  // --- Features ---
  PoolPrivateYN?: boolean;
  WaterfrontYN?: boolean;

  // --- HOA ---
  AssociationFee?: number;
  AssociationFeeFrequency?: string;  // Monthly, Quarterly, Annually, etc.

  // --- Market stats ---
  DaysOnMarket?: number;

  // --- Description ---
  PublicRemarks?: string;

  // --- Listing agent/office ---
  ListOfficeName?: string;
  ListAgentFullName?: string;
  ListAgentEmail?: string;
  ListAgentDirectPhone?: string;

  // --- Photos ---
  Media?: ListingMedia[];

  // --- Open house ---
  OpenHouseStartTime?: string;       // ISO 8601 datetime
  OpenHouseEndTime?: string;         // ISO 8601 datetime

  // --- Timestamps ---
  ModificationTimestamp: string;     // Last modified in MLS
  OriginalEntryTimestamp?: string;   // First entered in MLS
}

/**
 * Search/filter parameters for listing queries.
 * All fields are optional — omitted fields are not filtered.
 * Values are strings because they come from URL search params.
 */
export interface ListingSearchParams {
  city?: string;
  zip?: string;
  min_price?: string;
  max_price?: string;
  beds?: string;
  baths?: string;
  property_type?: string;
  status?: string;                   // StandardStatus value (Active, Pending, etc.)
  limit?: string;
  offset?: string;
  sort?: string;                     // OData $orderby value
}

/**
 * Standard Bridge API response envelope.
 * Uses OData conventions with a `value` array and optional pagination link.
 */
export interface BridgeResponse<T> {
  /** OData context URL */
  bundle: string;
  /** Total matching records (may exceed value.length if paginated) */
  total: number;
  /** Array of result records */
  value: T[];
  /** URL to fetch the next page of results, if any */
  '@odata.nextLink'?: string;
}

// =============================================================================
// Form submission types — used by contact/lead-capture forms
// =============================================================================

/** General contact form (footer, about page, etc.) */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  /** Where the form was submitted from (page URL or form ID) */
  source: string;
}

/** Request a private showing for a specific listing */
export interface ShowingRequestData {
  name: string;
  email: string;
  phone: string;
  listingId: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}

/** Home valuation / CMA request */
export interface ValuationRequestData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
}
