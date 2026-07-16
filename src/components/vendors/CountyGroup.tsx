// =============================================================================
// CountyGroup — Groups vendors by county with a county label header
// Renders a responsive grid of VendorCard components
// =============================================================================

import VendorCard, { type Vendor } from "./VendorCard";

interface CountyGroupProps {
  county: string;
  vendors: Vendor[];
}

export default function CountyGroup({ county, vendors }: CountyGroupProps) {
  if (vendors.length === 0) return null;

  return (
    <div className="mb-10">
      {/* County label — small uppercase like the site's heading-label style */}
      <h3 className="font-body text-xs font-medium tracking-[0.2em] uppercase text-accent mb-4">
        {county} County
      </h3>

      {/* Responsive grid: 1 col mobile → 2 cols tablet → 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.name} vendor={vendor} />
        ))}
      </div>
    </div>
  );
}
