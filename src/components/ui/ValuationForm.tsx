// =============================================================================
// ValuationForm, Multi-step home valuation request form
//
// WHY MULTI-STEP:
// This is the destination of the seller CTA on ~1,760 blog posts, so it is the
// main seller funnel on the site. It used to render all 24 fields on one
// screen, which reads like a mortgage application and scares people off before
// they type anything.
//
// HOW IT WORKS NOW:
// Step 1, address + name + email + phone. Nothing else. That is already a
//            complete, callable lead, and the submit button is live on step 1,
//            so somebody who stops there is NOT lost.
// Step 2, property details (beds, baths, sqft, etc). Optional.
// Step 3, condition, upgrades, timeline, notes. Optional.
//
// IMPORTANT STRUCTURAL NOTE: this is still ONE <form> with ONE submit handler
// and ONE Turnstile widget mounted outside the step conditionals. The steps are
// just conditionally rendered field groups. Two reasons:
//   1. Every answer lives in top-level useState, so moving between steps never
// loses what was typed, React keeps the state, the fields just unmount.
//   2. Unmounting TurnstileWidget per step would tear down and re-render the
//      Cloudflare challenge each time, which is exactly how you end up with no
//      token and a dead submit button.
//
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

// Step labels, in order. Index 0 is step 1.
const STEP_LABELS = ["Your home", "The details", "Condition"];
const TOTAL_STEPS = STEP_LABELS.length;

/** Optional props, initialCity pre-fills the city field on city spoke pages */
interface ValuationFormProps {
  initialCity?: string;
}

export default function ValuationForm({ initialCity }: ValuationFormProps) {
  const router = useRouter();

  // --- Which step is on screen (1-based, to match what the visitor reads) ---
  const [step, setStep] = useState(1);

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

  // --- Honeypot ---
  // A decoy field hidden from real people with CSS. Humans never see it, so it
  // always stays empty. Bots fill in every input they can find, so anything in
  // here means the submission is automated. The API discards those silently.
  const [honeypot, setHoneypot] = useState("");

  // Is step 1 filled in well enough to be a real lead Barrett can act on?
  // This gates BOTH moving forward and submitting. It has to exist in JS, not
  // just as HTML `required`, because steps 2 and 3 unmount step 1's inputs 
  // and the browser cannot validate a field that is no longer in the document,
  // so without this check somebody could jump to step 3 and submit with no name.
  const step1Complete = Boolean(
    address.trim() && city.trim() && zip.trim() && name.trim() && email.trim()
  );

  /** Submit the valuation request to /api/contact */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Safety net described above: bounce them back to step 1 rather than
    // POSTing a lead with no way to reach them (which the API would reject).
    if (!step1Complete) {
      setStep(1);
      setErrorMessage(
        "I just need the property address, your name, and your email to run the numbers."
      );
      setStatus("error");
      return;
    }

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
          honeypot,
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
      setStep(1);
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
            {/* 2 hours, NOT 24. /thank-you/ promises 2 hours, and a visitor who
                sees both numbers catches us contradicting ourselves. If you
                change the promise, change it in both places. */}
            <p className="font-body text-muted text-sm mb-2">
              Barrett will prepare your CMA and get back to you within 2 hours.
            </p>
            <p className="font-body text-muted text-xs mb-6">
              Need a faster response? Call{" "}
              <a href="tel:8137337907" className="text-link hover:underline font-medium">
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

            {/* --- Step indicator --- */}
            {/* Shows how short this is. "1 of 3" with step 1 already enough to
                submit is far less intimidating than 24 visible fields. */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                {STEP_LABELS.map((label, i) => {
                  const n = i + 1;
                  const isCurrent = n === step;
                  const isDone = n < step;
                  return (
                    <div key={label} className="flex-1">
                      <div
                        className={cn(
                          "h-1.5 rounded-full",
                          isCurrent || isDone ? "bg-primary" : "bg-gray-200"
                        )}
                      />
                      <span
                        className={cn(
                          "font-body mt-1.5 block text-[11px]",
                          isCurrent ? "text-primary font-semibold" : "text-muted/70"
                        )}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="font-body mt-3 text-xs text-muted">
                Step {step} of {TOTAL_STEPS}.{" "}
                {step === 1
                  ? "Step 1 is all I need to get started, the rest is optional and only makes the number sharper."
                  : "Optional. You can send what you have at any point."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* ============================================================= */}
              {/* STEP 1: Address + contact, the only required step */}
              {/* ============================================================= */}
              {step === 1 && (
                <div>
                  <h3 className={sectionHeadingClasses}>Your Home &amp; Contact Info</h3>
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
                        autoComplete="street-address"
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
                          autoComplete="address-level2"
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
                          autoComplete="postal-code"
                        />
                      </div>
                    </div>

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
                        autoComplete="name"
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
                          autoComplete="email"
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
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* STEP 2: Property details, optional */}
              {/* ============================================================= */}
              {step === 2 && (
                <div>
                  <h3 className={sectionHeadingClasses}>Property Details</h3>
                  <div className="space-y-4">

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

                    {/* Photos note */}
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <p className="font-heading text-sm font-semibold text-primary mb-1">
                        Have photos of your home?
                      </p>
                      <p className="font-body text-sm text-gray-700 leading-relaxed">
                        Text them to{" "}
                        <a href="tel:8137337907" className="text-link font-medium hover:underline">
                          (813) 733-7907
                        </a>{" "}
                        after submitting this form. Front exterior, kitchen, and bathrooms are most helpful.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* STEP 3: Condition, upgrades, timeline, optional */}
              {/* ============================================================= */}
              {step === 3 && (
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
              )}

              {/* ============================================================= */}
              {/* Honeypot + Turnstile + Submit, ALWAYS mounted, every step */}
              {/* Do not move these inside a step conditional. Remounting the    */}
              {/* Turnstile widget restarts the challenge and leaves the submit  */}
              {/* button dead with no token.                                     */}
              {/* ============================================================= */}
              <div>
                {/* Honeypot, hidden decoy field. Real users never see or fill
                    this; bots fill everything. aria-hidden + tabIndex keep it
                    away from screen readers and keyboard navigation, so it
                    stays invisible to humans using assistive tech too. */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                  }}
                >
                  <label htmlFor="company-website">
                    Company website (leave this field empty)
                  </label>
                  <input
                    id="company-website"
                    name="company-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Turnstile spam protection */}
                <TurnstileWidget onVerify={handleTurnstileVerify} />

                {/* Submit button, benefit-labelled, not "Submit". Live on
                    EVERY step, including step 1, so a visitor who stops after
                    the address and their name is still a finished lead. */}
                <button
                  type="submit"
                  disabled={status === "loading" || !turnstileToken || !step1Complete}
                  className={cn(
                    "btn-primary w-full mt-4",
                    (status === "loading" || !turnstileToken || !step1Complete) &&
                      "opacity-60 cursor-not-allowed"
                  )}
                >
                  {status === "loading" ? "Sending..." : "Get My Home Value"}
                </button>

                {/* Response-time promise. Must match /thank-you/, which says 2
                    hours. Do not let these two drift apart again. */}
                <p className="font-body text-center text-xs text-muted mt-2">
                  Barrett replies within 2 hours.
                </p>

                {/* Step navigation. "Add more detail" is type="button" so it can
                    never submit the form by accident, and it stays disabled
                    until step 1 is complete, that guarantees we always have a
                    contactable lead before the optional questions start. */}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => Math.max(1, s - 1))}
                      className="font-body text-xs text-accent hover:text-primary underline transition-colors"
                    >
                      &larr; Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {step < TOTAL_STEPS && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
                      disabled={!step1Complete}
                      className={cn(
                        "font-body text-xs text-accent hover:text-primary underline transition-colors",
                        !step1Complete && "opacity-50 cursor-not-allowed no-underline"
                      )}
                    >
                      {step === 1
                        ? "Add property details for a sharper number (optional) →"
                        : "Add condition and timeline (optional) →"}
                    </button>
                  )}
                </div>

                {/* Explain a greyed-out button rather than letting them guess */}
                {!step1Complete && (
                  <p className="font-body mt-2 text-center text-xs text-muted">
                    Fill in the address, your name, and your email to continue.
                  </p>
                )}
                {step1Complete && !turnstileToken && status !== "loading" && (
                  <p className="font-body mt-2 text-center text-xs text-muted">
                    Finishing the quick spam check, the button turns on in a second.
                  </p>
                )}

                {/* Legal consent text */}
                <p className="text-[10px] text-muted/50 font-body text-center mt-3 leading-relaxed max-w-md mx-auto">
                  By submitting this form, you consent to receive calls, texts, and emails from Barrett Henry, The NOW Team, REMAX Collective, and affiliated partners at the number and email provided. Message and data rates may apply. You may opt out at any time. This is not a condition of purchase.
                </p>

                {/* Trust signals, who you are handing this to, and what we
                    will not do with it. Sits right under the button on purpose;
                    that is the moment people hesitate. */}
                <div className="mt-3 space-y-1 text-center text-xs text-muted/70 font-body">
                  <p>
                    <span className="font-semibold text-muted">Barrett Henry, REALTOR&reg;</span>
                    {" "}&bull; Broker Associate, REMAX Collective
                  </p>
                  <p>23+ years of real estate experience &bull; FL License #BK3313308</p>
                  <p>No obligation &bull; Your information is never sold</p>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
