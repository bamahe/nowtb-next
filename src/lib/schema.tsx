/**
 * JSON-LD schema generators for SEO.
 * Used in generateMetadata() or inline <script> tags.
 */

import React from "react";

import { Listing } from "./types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nowtb.com";
const PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "(813) 733-7907";
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "barrett@nowtb.com";

/** RealEstateAgent schema — for homepage and about page */
export function realEstateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Barrett Henry, REALTOR®",
    description:
      "Licensed real estate Broker Associate with REMAX Collective serving Tampa Bay. 23+ years of real estate experience, licensed since September 2003.",
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    image: `${SITE_URL}/images/barrett-henry.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tampa",
      addressRegion: "FL",
      addressCountry: "US",
    },
    parentOrganization: {
      "@type": "RealEstateAgent",
      name: "REMAX Collective",
    },
    areaServed: [
      "Hillsborough County, FL",
      "Pinellas County, FL",
      "Pasco County, FL",
      "Manatee County, FL",
      "Polk County, FL",
      "Sarasota County, FL",
      "Hernando County, FL",
      "Citrus County, FL",
    ],
    knowsAbout: [
      "Residential Real Estate",
      "Investment Properties",
      "New Construction",
      "Military Relocation",
      "First-Time Home Buyers",
    ],
    sameAs: [
      "https://barretthenry.remax.com",
      "https://vivipm.com",
      "https://hencre.com",
      "https://valricopropertymgmt.com",
      "https://bestbayservices.com",
      "https://flforeclosurehelp.com",
      "https://valricoagent.com",
      "https://firsttimehomebuyertb.com",
      "https://valoantb.com",
      "https://tampabaydownpayment.com",
      // Third-party authority profiles. These matter because answer engines
      // cite agent directories directly, so sameAs is what tells them the
      // directory profile and this site are the same entity.
      "https://www.fastexpert.com/agents/barrett-henry-135533/",
      "https://www.facebook.com/BarrettHenryREALTOR",
      "https://www.instagram.com/thenowteam",
      "https://www.linkedin.com/in/barretthenry",
    ],
  };
}

/** LocalBusiness schema — for about page and contact page */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Barrett Henry, REALTOR® — REMAX Collective",
    telephone: PHONE,
    email: EMAIL,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tampa",
      addressRegion: "FL",
      addressCountry: "US",
    },
    openingHours: "Mo-Fr 09:00-18:00",
    priceRange: "$$",
  };
}

/** RealEstateListing schema — for individual listing pages */
export function realEstateListingSchema(listing: Listing) {
  const photos = listing.Media?.map((m) => m.MediaURL).filter(Boolean) || [];
  const address = [
    listing.StreetNumber,
    listing.StreetName,
    listing.StreetSuffix,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${address}, ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}`,
    description: listing.PublicRemarks?.substring(0, 300),
    url: `${SITE_URL}/properties/${listing.ListingKey}`,
    image: photos,
    datePosted: listing.OriginalEntryTimestamp,
    dateModified: listing.ModificationTimestamp,
    offers: {
      "@type": "Offer",
      price: listing.ListPrice,
      priceCurrency: "USD",
      availability: listing.StandardStatus === "Active"
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: listing.City,
      addressRegion: listing.StateOrProvince,
      postalCode: listing.PostalCode,
      addressCountry: "US",
    },
    geo: listing.Latitude && listing.Longitude
      ? {
          "@type": "GeoCoordinates",
          latitude: listing.Latitude,
          longitude: listing.Longitude,
        }
      : undefined,
    numberOfRooms: listing.BedroomsTotal,
    floorSize: listing.LivingArea
      ? {
          "@type": "QuantitativeValue",
          value: listing.LivingArea,
          unitCode: "SQF",
        }
      : undefined,
  };
}

/**
 * Place schema for a city — the factual entity behind every city hub and spoke
 * page. Gives Google and the AI crawlers real coordinates, the county it sits
 * in, and the ZIPs it covers, so "homes for sale in X" resolves to a real
 * location rather than just a page title.
 */
export function cityPlaceSchema(city: {
  name: string;
  slug: string;
  county: string;
  lat: number;
  lng: number;
  zip_codes?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "City",
    name: `${city.name}, Florida`,
    url: `${SITE_URL}/${city.slug}/`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: "FL",
      addressCountry: "US",
      ...(city.zip_codes?.length ? { postalCode: city.zip_codes[0] } : {}),
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.lat,
      longitude: city.lng,
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: `${city.county} County, Florida`,
    },
  };
}

/**
 * ItemList of property listings shown on a page. Search engines and LLMs read
 * this to understand that the page is a real inventory of homes, not just prose
 * — which is what makes it eligible to be cited for "homes for sale in X".
 * Pass only the listings actually rendered, so the markup matches the page.
 */
export function listingItemListSchema(
  listings: Listing[],
  listName: string
) {
  if (!listings.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: listings.length,
    itemListElement: listings.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: realEstateListingSchema(l),
    })),
  };
}

/** BreadcrumbList schema — for spoke pages */
export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Article schema for editorial content pages (market reports, rules guides).
 * Author is always Barrett Henry, Broker Associate at REMAX Collective, and the
 * publisher reuses the site's RealEstateAgent entity so Google and the AI
 * crawlers tie the page back to one consistent author.
 */
export function articleSchema(article: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    author: {
      "@type": "Person",
      name: "Barrett Henry",
      jobTitle: "Broker Associate",
      worksFor: {
        "@type": "RealEstateAgent",
        name: "REMAX Collective",
      },
      url: `${SITE_URL}/about/`,
      image: `${SITE_URL}/images/barrett-henry-headshot.jpg`,
      telephone: PHONE,
      sameAs: [
        SITE_URL,
        "https://barretthenry.remax.com",
        "https://www.linkedin.com/in/barretthenry",
      ],
      hasCredential: [
        { "@type": "EducationalOccupationalCredential", credentialCategory: "Designation", name: "e-PRO" },
        { "@type": "EducationalOccupationalCredential", credentialCategory: "Designation", name: "MRP (Military Relocation Professional)" },
        { "@type": "EducationalOccupationalCredential", credentialCategory: "Designation", name: "SRS (Seller Representative Specialist)" },
      ],
    },
    publisher: {
      "@type": "RealEstateAgent",
      name: "Barrett Henry, REALTOR®",
      url: SITE_URL,
      telephone: PHONE,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/remax-logo-white.png`,
      },
    },
    // Tells AI assistants and voice search which part of the page to read aloud
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".quick-answer", "h1"],
    },
  };
}

/** FAQPage schema — pass the same questions rendered on the page */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * WebPage schema with a speakable specification. Required alongside the
 * page-specific type so AI answer engines and voice search know which block on
 * the page is the quotable answer.
 */
export function webPageSchema(page: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.name,
    description: page.description,
    url: page.url,
    ...(page.datePublished ? { datePublished: page.datePublished } : {}),
    ...(page.dateModified ? { dateModified: page.dateModified } : {}),
    isPartOf: {
      "@type": "WebSite",
      name: "Barrett Henry, REALTOR\u00ae",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Florida condominium purchases",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".quick-answer", "h1"],
    },
    publisher: {
      "@type": "RealEstateAgent",
      name: "Barrett Henry, REALTOR\u00ae",
      url: SITE_URL,
      telephone: PHONE,
    },
  };
}

/** Helper to render JSON-LD as a script tag */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
