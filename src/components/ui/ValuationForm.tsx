// =============================================================================
// ValuationForm — Detailed home valuation request form
// Collects property details, condition/upgrades, contact info, and submits
// to /api/contact with type: "valuation". Includes Turnstile spam protection.
// "use client" because it manages form state and handles submit events
// =============================================================================

"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import TurnstileWidget from "@/components/ui/TurnstileWidget";

// --- Form submission status ---
type FormStatus = "idle" | "loading" | "success" | "error";

// --- Shared Tailwind class strings for consistency ---
const inputClasses =
  "w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
const selectClasses =
  "w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
const labelClasses =
  "block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5";
const sectionHeadingClasses =
  "font-heading text-lg text-primary font-semibold mb-4 pb-2 border-b border-gray-200";

/** Optional props — initialCity pre-fills the city field on city spoke pages */
interface ValuationFormProps {
  initialCity?: string;
}

export default function ValuationForm({ initialCity }: ValuationFormProps) {
  const router = useRouter();

  // --- Property Details ---
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(initialCity || "");
  const [zip, setZip] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [stories, setStories] = useState("");
  const [garage, setGarage] = useState("");
  const [pool, setPool] = useState("");

  // --- Condition & Upgrades ---
  const [condition, setCondition] = useState("");
  const [kitchenUpdated, setKitchenUpdated] = useState("");
  const [bathsUpdated, setBathsUpdated] = useState("");
  const [roofAge, setRoofAge] = useState("");
  const [hvacAge, setHvacAge] = useState("");
  const [upgrades, setUpgrades] = useState("");

  // --- Contact Info ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [timeline, setTimeline] = useState("");
  const [notes, setNotes] = useState("");

  // --- Submission state ---
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // --- Turnstile spam protection token ---
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  /** Submit the valuation request to /api/contact */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Contact info
          name,
          email,
          phone,
          // Property details
          address,
          city,
          zip,
          beds,
          baths,
          sqft,
          yearBuilt,
          lotSize,
          propertyType,
          stories,
          garage,
          pool,
          // Condition & upgrades
          condition,
          kitchenUpdated,
          bathsUpdated,
          roofAge,
          hvacAge,
          upgrades,
          // Timeline & notes
          timeline,
          notes,
          // Form metadata
          source: "free-home-valuation",
          type: "valuation",
          turnstileToken,
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      // Clear all fields on success
      setAddress(""); setCity(""); setZip("");
      setBeds(""); setBaths(""); setSqft(""); setYearBuilt("");
      setLotSize(""); setPropertyType(""); setStories("");
      setGarage(""); setPool("");
      setCondition(""); setKitchenUpdated(""); setBathsUpdated("");
      setRoofAge(""); setHvacAge(""); setUpgrades("");
      setName(""); setEmail(""); setPhone("");
      setTimeline(""); setNotes("");
      setStatus("success");

      // Redirect to thank-you page
      router.push("/thank-you/");
    } catch (err) {
      console.error("Valuation form submission failed:", err);
      setErrorMessage(
        "Something went wrong. Please try again or call us at (813) 733-7907."
      );
      setStatus("error");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

        {/* --- Success state: replaces the whole form --- */}
        {status === "success" ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-primary mb-2">Valuation Request Received!</h3>
            <p className="font-body text-muted text-sm mb-2">
              Barrett will prepare your CMA and get back to you within 24 hours.
            </p>
            <p className="font-body text-muted text-xs mb-6">
              Need a faster response? Call{" "}
              <a href="tel:+18137337907" className="text-link hover:underline font-medium">
                (813) 733-7907
              </a>
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="font-body text-xs text-accent hover:text-primary underline transition-colors"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <>
            {/* --- Error message --- */}
            {status === "error" && errorMessage && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6 text-red-800 font-body text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* ============================================================= */}
              {/* SECTION 1: Property Details                                   */}
              {/* ============================================================= */}
              <div>
                <h3 className={sectionHeadingClasses}>Property Details</h3>
                <div className="space-y-4">

                  {/* Address (full width) */}
                  <div>
                    <label htmlFor="val-address" className={labelClasses}>
                      Property Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="val-address"
                      type="text"
                      required
                      placeholder="123 Main Street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={inputClasses}
                    />
                  </div>

                  {/* City + ZIP (side by side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="val-city" className={labelClasses}>
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="val-city"
                        type="text"
                        required
                        placeholder="Tampa"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="val-zip" className={labelClasses}>
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="val-zip"
                        type="text"
                        required
                        placeholder="33594"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* Beds + Baths (side by side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="val-beds" className={labelClasses}>Beds</label>
                      <select
                        id="val-beds"
                        value={beds}
                        onChange={(e) => setBeds(e.target.value)}
                        className={selectClasses}
                      >
                        <option value="">Select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6+">6+</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="val-baths" className={labelClasses}>Baths</label>
                      <select
                        id="val-baths"
                        value={baths}
                        onChange={(e) => setBaths(e.target.value)}
                        className={selectClasses}
                      >
                        <option value="">Select</option>
                        <option value="1">1</option>
                        <option value="1.5">1.5</option>
                        <option value="2">2</option>
                        <option value="2.5">2.5</option>
                        <option value="3">3</option>
                        <option value="3.5">3.5</option>
                        <option value="4">4</option>
                        <option value="5+">5+</option>
                      </select>
                    </div>
                  </div>

                  {/* Sq Ft + Year Built (side by side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="val-sqft" className={labelClasses}>Approximate Sq Ft</label>
                      <input
                        id="val-sqft"
                        type="number"
                        placeholder="1,800"
                        value={sqft}
                        onChange={(e) => setSqft(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="val-year" className={labelClasses}>Year Built</label>
                      <input
                        id="val-year"
                        type="number"
                        placeholder="2005"
                        value={yearBuilt}
                        onChange={(e) => setYearBuilt(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* Lot Size + Property Type (side by side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="val-lot" className={labelClasses}>Lot Size</label>
                      <input
                        id="val-lot"
                        type="text"
                        placeholder="0.25 acres"
                        value={lotSize}
                        onChange={(e) => setLotSize(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="val-type" className={labelClasses}>Property Type</label>
                      <select
                        id="val-type"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className={selectClasses}
                      >
                        <option value="">Select</option>
                        <option value="Single Family">Single Family</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Condo">Condo</option>
                        <option value="Villa">Villa</option>
                        <option value="Multi-Family">Multi-Family</option>
                      </select>
                    </div>
                  </div>

                  {/* Stories + Garage (side by side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="val-stories" className={labelClasses}>Stories</label>
                      <select
                        id="val-stories"
                        value={stories}
                        onChange={(e) => setStories(e.target.value)}
                        className={selectClasses}
                      >
                        <option value="">Select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3+">3+</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="val-garage" className={labelClasses}>Garage</label>
                      <select
                        id="val-garage"
                        value={garage}
                        onChange={(e) => setGarage(e.target.value)}
                        className={selectClasses}
                      >
                        <option value="">Select</option>
                        <option value="None">None</option>
                        <option value="1 Car">1 Car</option>
                        <option value="2 Car">2 Car</option>
                        <option value="3 Car">3 Car</option>
                      </select>
                    </div>
                  </div>

                  {/* Pool (half width) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="val-pool" className={labelClasses}>Pool</label>
                      <select
                        id="val-pool"
                        value={pool}
                        onChange={(e) => setPool(e.target.value)}
                        className={selectClasses}
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================= */}
              {/* SECTION 2: Condition & Upgrades                               */}
              {/* ============================================================= */}
              <div>
                <h3 className={sectionHeadingClasses}>Condition &amp; Upgrades</h3>
                <div className="space-y-4">

                  {/* Overall Condition + Kitchen Updated (side by side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="val-condition" className={labelClasses}>Overall Condition</label>
                      <select
                        id="val-condition"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className={selectClasses}
                      >
                        <option value="">Select</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Needs Work">Needs Work</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="val-kitchen" className={labelClasses}>Kitchen Updated</label>
                      <select
                        id="val-kitchen"
                        value={kitchenUpdated}
                        onChange={(e) => setKitchenUpdated(e.target.value)}
                        className={selectClasses}
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Partially">Partially</option>
                      </select>
                    </div>
                  </div>

                  {/* Bathrooms Updated + Roof Age (side by side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="val-baths-updated" className={labelClasses}>Bathrooms Updated</label>
                      <select
                        id="val-baths-updated"
                        value={bathsUpdated}
                        onChange={(e) => setBathsUpdated(e.target.value)}
                        className={selectClasses}
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Partially">Partially</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="val-roof" className={labelClasses}>Roof Age</label>
                      <select
                        id="val-roof"
                        value={roofAge}
                        onChange={(e) => setRoofAge(e.target.value)}
                        className={selectClasses}
                      >
                        <option value="">Select</option>
                        <option value="Under 5 years">Under 5 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="10-15 years">10-15 years</option>
                        <option value="15+ years">15+ years</option>
                        <option value="Not Sure">Not Sure</option>
                      </select>
                    </div>
                  </div>

                  {/* HVAC Age (half width) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="val-hvac" className={labelClasses}>HVAC Age</label>
                      <select
                        id="val-hvac"
                        value={hvacAge}
                        onChange={(e) => setHvacAge(e.target.value)}
                        className={selectClasses}
                      >
                        <option value="">Select</option>
                        <option value="Under 5 years">Under 5 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="10+ years">10+ years</option>
                        <option value="Not Sure">Not Sure</option>
                      </select>
                    </div>
                  </div>

                  {/* Recent Upgrades (full width textarea) */}
                  <div>
                    <label htmlFor="val-upgrades" className={labelClasses}>Recent Upgrades</label>
                    <textarea
                      id="val-upgrades"
                      rows={3}
                      placeholder="List any upgrades: flooring, windows, appliances, etc."
                      value={upgrades}
                      onChange={(e) => setUpgrades(e.target.value)}
                      className={cn(inputClasses, "resize-none")}
                    />
                  </div>
                </div>
              </div>

              {/* ============================================================= */}
              {/* SECTION 3: Photos Note                                        */}
              {/* ============================================================= */}
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="font-heading text-sm font-semibold text-primary mb-1">
                  Have photos of your home?
                </p>
                <p className="font-body text-sm text-gray-700 leading-relaxed">
                  Text them to{" "}
                  <a href="tel:+18137337907" className="text-link font-medium hover:underline">
                    (813) 733-7907
                  </a>{" "}
                  after submitting this form. Front exterior, kitchen, and bathrooms are most helpful.
                </p>
              </div>

              {/* ============================================================= */}
              {/* SECTION 4: Contact Info                                       */}
              {/* ============================================================= */}
              <div>
                <h3 className={sectionHeadingClasses}>Your Contact Info</h3>
                <div className="space-y-4">

                  {/* Name (full width) */}
                  <div>
                    <label htmlFor="val-name" className={labelClasses}>
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="val-name"
                      type="text"
                      required
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>

                  {/* Email + Phone (side by side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="val-email" className={labelClasses}>
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="val-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="val-phone" className={labelClasses}>Phone</label>
                      <input
                        id="val-phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label htmlFor="val-timeline" className={labelClasses}>Timeline</label>
                    <select
                      id="val-timeline"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className={selectClasses}
                    >
                      <option value="">Select</option>
                      <option value="Just curious">Just curious</option>
                      <option value="Thinking about it">Thinking about it</option>
                      <option value="Ready in 1-3 months">Ready in 1-3 months</option>
                      <option value="Need to sell ASAP">Need to sell ASAP</option>
                    </select>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label htmlFor="val-notes" className={labelClasses}>Additional Notes</label>
                    <textarea
                      id="val-notes"
                      rows={3}
                      placeholder="Anything else Barrett should know?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className={cn(inputClasses, "resize-none")}
                    />
                  </div>
                </div>
              </div>

              {/* ============================================================= */}
              {/* Turnstile + Submit                                            */}
              {/* ============================================================= */}
              <div>
                {/* Turnstile spam protection */}
                <TurnstileWidget onVerify={handleTurnstileVerify} />

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "loading" || !turnstileToken}
                  className={cn(
                    "btn-primary w-full mt-4",
                    (status === "loading" || !turnstileToken) &&
                      "opacity-60 cursor-not-allowed"
                  )}
                >
                  {status === "loading" ? "Submitting..." : "Get My Free Valuation"}
                </button>

                {/* Legal consent text */}
                <p className="text-[10px] text-muted/50 font-body text-center mt-3 leading-relaxed max-w-md mx-auto">
                  By submitting this form, you consent to receive calls, texts, and emails from Barrett Henry, The NOW Team, REMAX Collective, and affiliated partners at the number and email provided. Message and data rates may apply. You may opt out at any time. This is not a condition of purchase.
                </p>

                {/* Trust signals */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-xs text-muted/60 font-body">
                  <span>FL License #BK3313308</span>
                  <span>&bull;</span>
                  <span>23+ Years Experience</span>
                  <span>&bull;</span>
                  <span>REMAX Collective</span>
                  <span>&bull;</span>
                  <span>e-PRO | MRP | SRS</span>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
