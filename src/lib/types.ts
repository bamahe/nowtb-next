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
  PoolFeatures?: string[];           // Heated, In Ground, Screened, etc.
  SpaFeatures?: string[];            // In Ground, Heated, etc.
  WaterfrontYN?: boolean;
  WaterfrontFeatures?: string[];
  ViewYN?: boolean;
  View?: string[];                   // Pool, Water, Golf Course, etc.
  FireplaceYN?: boolean;
  FireplacesTotal?: number;

  // --- Interior ---
  InteriorFeatures?: string[];       // Ceiling Fan(s), Walk-In Closet(s), etc.
  Flooring?: string[];               // Carpet, Tile, Hardwood, etc.
  Appliances?: string[];             // Dishwasher, Range, Refrigerator, etc.
  LaundryFeatures?: string[];        // Inside, Laundry Room, etc.
  WindowFeatures?: string[];         // Low-E Windows, etc.
  Cooling?: string[];                // Central Air, etc.
  Heating?: string[];                // Central, Electric, etc.
  RoomsTotal?: number;

  // --- Exterior / Structure ---
  ConstructionMaterials?: string[];  // Block, Stucco, Frame, etc.
  Roof?: string[];                   // Shingle, Tile, Metal, etc.
  FoundationDetails?: string[];      // Slab, etc.
  Fencing?: string[];                // Fenced, Wood, Vinyl, etc.
  ExteriorFeatures?: string[];       // Sliding Doors, Storage, etc.
  OtherStructures?: string[];        // Shed(s), Guest House, etc.
  StoriesTotal?: number;
  Levels?: string[];                 // One, Two, etc.
  DirectionFaces?: string;           // East, West, etc.
  SecurityFeatures?: string[];       // Alarm, Smoke Detector(s), etc.
  RoadSurfaceType?: string[];        // Paved, Asphalt, etc.

  // --- Lot ---
  LotFeatures?: string[];            // Near Golf Course, Corner Lot, etc.
  LotSizeSquareFeet?: number;
  LotSizeDimensions?: string;        // 70 x 100

  // --- Utilities ---
  WaterSource?: string[];            // Public, Well, etc.
  Sewer?: string[];                  // Public Sewer, Septic, etc.
  Utilities?: string[];              // Cable, Electric, etc.

  // --- Parking ---
  GarageYN?: boolean;
  CarportYN?: boolean;

  // --- HOA ---
  AssociationYN?: boolean;
  AssociationFee?: number;
  AssociationFeeFrequency?: string;  // Monthly, Quarterly, Annually, etc.

  // --- Financial ---
  TaxAnnualAmount?: number;
  TaxYear?: number;
  ListingTerms?: string[];           // Cash, Conventional, FHA, VA, etc.
  Ownership?: string;                // Fee Simple, Condo, etc.
  Zoning?: string;

  // --- Schools ---
  ElementarySchool?: string;
  MiddleOrJuniorSchool?: string;
  HighSchool?: string;

  // --- Location extras ---
  CountyOrParish?: string;
  SubdivisionName?: string;
  MLSAreaMajor?: string;
  Directions?: string;
  ParcelNumber?: string;

  // --- Market stats ---
  DaysOnMarket?: number;
  CumulativeDaysOnMarket?: number;
  OriginalListPrice?: number;
  OnMarketDate?: string;

  // --- Description ---
  PublicRemarks?: string;
  VirtualTourURLUnbranded?: string;

  // --- Listing agent/office ---
  ListOfficeName?: string;
  ListOfficePhone?: string;
  ListAgentFullName?: string;
  ListAgentEmail?: string;
  ListAgentDirectPhone?: string;
  ListAgentPreferredPhone?: string;

  // --- Photos ---
  Media?: ListingMedia[];
  PhotosCount?: number;

  // --- Open house ---
  OpenHouseStartTime?: string;       // ISO 8601 datetime
  OpenHouseEndTime?: string;         // ISO 8601 datetime

  // --- Building ---
  BuildingAreaTotal?: number;        // Total area including non-living
  NewConstructionYN?: boolean;
  PropertyCondition?: string[];      // Completed, Updated, etc.
  SeniorCommunityYN?: boolean;
  Furnished?: string;                // Unfurnished, Furnished, Partially

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
  zip_codes?: string[];              // Multiple ZIP codes (OR filter)
  min_price?: string;
  max_price?: string;
  beds?: string;
  baths?: string;
  property_type?: string;
  status?: string;                   // StandardStatus value (Active, Pending, etc.)
  limit?: string;
  offset?: string;
  sort?: string;                     // OData $orderby value
  // Topic-specific filters (mapped to MLS boolean/numeric fields)
  senior?: boolean;                  // SeniorCommunityYN
  waterfront?: boolean;              // WaterfrontYN
  pool?: boolean;                    // PoolPrivateYN
  new_construction?: boolean;        // NewConstructionYN
  single_story?: boolean;            // Stories eq 1
  open_house?: boolean;              // Has upcoming open house
  rental?: boolean;                  // PropertyType eq 'Residential Lease'
  exclude_rental?: boolean;          // PropertyType ne 'Residential Lease'
  subdivision?: string;              // SubdivisionName eq 'value'
  // Advanced filters added by FilterPanel
  min_sqft?: string;                 // LivingArea ge value
  max_sqft?: string;                 // LivingArea le value
  min_year?: string;                 // YearBuilt ge value
  price_reduced?: boolean;           // OriginalListPrice gt ListPrice
  garage?: boolean;                  // GarageYN eq true
  keyword?: string;                  // Client-side text search in remarks
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
