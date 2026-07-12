// =============================================================================
// TourScheduler — Interactive tour scheduling widget for listing detail pages
// "use client" because it manages tab state, date selection, and form submission
// =============================================================================

"use client";

import { useState, useCallback, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import TurnstileWidget from "@/components/ui/TurnstileWidget";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface TourSchedulerProps {
  /** Full street address of the listing */
  listingAddress: string;
  /** Bridge API ListingKey */
  listingId: string;
  /** Listing price in dollars (used in the submission payload) */
  listingPrice: number;
}

/** Which type of tour the visitor wants */
type TourType = "in-person" | "video";

/** Time-of-day preference */
type TimeSlot = "morning" | "afternoon" | "evening";

/** Submission state machine */
type FormStatus = "idle" | "loading" | "success" | "error";

// -----------------------------------------------------------------------------
// Helpers — build the next 7 calendar days for the date picker
// -----------------------------------------------------------------------------

/** Short day names for the buttons */
const DAY_ABBREV = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Month abbreviations */
const MONTH_ABBREV = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Returns an array of the next 7 days starting from today */
function getNextSevenDays(): Date[] {
  const days: Date[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  return days;
}

/** Format a Date for display: "Mon\nJun 25" */
function formatDayLabel(date: Date): { dayName: string; dateStr: string } {
  return {
    dayName: DAY_ABBREV[date.getDay()],
    dateStr: `${MONTH_ABBREV[date.getMonth()]} ${date.getDate()}`,
  };
}

/** Format a Date for the API payload: "2026-06-25" */
function formatDateForApi(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Time slot display labels and actual hour ranges
const TIME_SLOTS: { key: TimeSlot; label: string; range: string }[] = [
  { key: "morning", label: "Morning", range: "9 AM - 12 PM" },
  { key: "afternoon", label: "Afternoon", range: "12 - 4 PM" },
  { key: "evening", label: "Evening", range: "4 - 7 PM" },
];

// =============================================================================
// Component
// =============================================================================

export default function TourScheduler({
  listingAddress,
  listingId,
  listingPrice,
}: TourSchedulerProps) {
  // --- Tour type tab ---
  const [tourType, setTourType] = useState<TourType>("in-person");

  // --- Date & time selection ---
  const days = getNextSevenDays();
  const [selectedDate, setSelectedDate] = useState<Date>(days[0]);
  const [selectedTime, setSelectedTime] = useState<TimeSlot>("morning");

  // --- Contact fields ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // --- Submission state ---
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // --- Turnstile spam protection ---
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  // ---------------------------------------------------------------------------
  // Submit handler — posts to /api/contact with type="showing"
  // ---------------------------------------------------------------------------

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          source: `tour-scheduler:${listingId}`,
          type: "showing",
          turnstileToken,
          message: `${tourType === "video" ? "Video Chat" : "In-Person"} Tour Request\nDate: ${formatDateForApi(selectedDate)}\nTime: ${selectedTime}\nProperty: ${listingAddress}`,
          property: {
            address: listingAddress,
            price: listingPrice,
            mlsNumber: listingId,
            tourType,
            preferredDate: formatDateForApi(selectedDate),
            preferredTime: selectedTime,
          },
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      // Clear fields on success
      setName("");
      setEmail("");
      setPhone("");
      setStatus("success");
    } catch (err) {
      console.error("Tour request submission failed:", err);
      setErrorMessage(
        "Something went wrong. Please try again or call us directly."
      );
      setStatus("error");
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="card p-6 sm:p-8 mt-6">
      <h3 className="heading-section text-xl text-primary mb-6">
        Schedule a Tour
      </h3>

      {/* === Success state — replaces the form === */}
      {status === "success" ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="font-heading text-xl text-primary mb-2">
            Tour Requested!
          </h3>
          <p className="font-body text-muted text-sm mb-2">
            Barrett will confirm your tour within 2 hours.
          </p>
          <p className="font-body text-muted text-xs mb-6">
            Need a faster response? Call{" "}
            <a
              href="tel:+18137337907"
              className="text-link hover:underline font-medium"
            >
              (813) 733-7907
            </a>
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="font-body text-xs text-accent hover:text-primary underline transition-colors"
          >
            Schedule another tour
          </button>
        </div>
      ) : (
        <>
          {/* === Tour type tabs === */}
          <div className="flex border border-border rounded-lg overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setTourType("in-person")}
              className={cn(
                "flex-1 py-3 text-xs font-body font-medium tracking-[0.1em] uppercase transition-colors",
                tourType === "in-person"
                  ? "bg-primary text-white"
                  : "bg-white text-muted hover:text-primary"
              )}
            >
              In-Person Tour
            </button>
            <button
              type="button"
              onClick={() => setTourType("video")}
              className={cn(
                "flex-1 py-3 text-xs font-body font-medium tracking-[0.1em] uppercase transition-colors",
                tourType === "video"
                  ? "bg-primary text-white"
                  : "bg-white text-muted hover:text-primary"
              )}
            >
              Video Chat Tour
            </button>
          </div>

          {/* === Date picker — next 7 days as buttons === */}
          <div className="mb-5">
            <p className="heading-label mb-3">Pick a Day</p>
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((day) => {
                const { dayName, dateStr } = formatDayLabel(day);
                const isSelected =
                  formatDateForApi(day) === formatDateForApi(selectedDate);
                return (
                  <button
                    key={formatDateForApi(day)}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "flex flex-col items-center py-2.5 rounded-lg text-center transition-all duration-200 border",
                      isSelected
                        ? "bg-accent/20 border-accent text-primary"
                        : "bg-white border-border text-muted hover:border-accent/50 hover:text-primary"
                    )}
                  >
                    <span className="text-[10px] font-body font-medium uppercase tracking-wider">
                      {dayName}
                    </span>
                    <span className="text-xs font-body mt-0.5">{dateStr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* === Time slot picker === */}
          <div className="mb-6">
            <p className="heading-label mb-3">Preferred Time</p>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.key}
                  type="button"
                  aria-pressed={selectedTime === slot.key}
                  onClick={() => setSelectedTime(slot.key)}
                  className={cn(
                    "py-3 rounded-lg text-center transition-all duration-200 border",
                    selectedTime === slot.key
                      ? "bg-accent/20 border-accent text-primary"
                      : "bg-white border-border text-muted hover:border-accent/50 hover:text-primary"
                  )}
                >
                  <span className="block text-xs font-body font-medium">
                    {slot.label}
                  </span>
                  <span className="block text-[10px] font-body text-muted mt-0.5">
                    {slot.range}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* === Error message === */}
          {status === "error" && errorMessage && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-4 text-red-800 font-body text-sm">
              {errorMessage}
            </div>
          )}

          {/* === Contact form fields === */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="tour-name"
                className="block text-sm font-body font-medium text-dark mb-1"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="tour-name"
                type="text"
                required
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="tour-email"
                className="block text-sm font-body font-medium text-dark mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="tour-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="tour-phone"
                className="block text-sm font-body font-medium text-dark mb-1"
              >
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="tour-phone"
                type="tel"
                required
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Turnstile spam protection */}
            <TurnstileWidget onVerify={handleTurnstileVerify} />

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === "loading" || !turnstileToken}
              className={cn(
                "btn-primary w-full",
                (status === "loading" || !turnstileToken) &&
                  "opacity-60 cursor-not-allowed"
              )}
            >
              {status === "loading" ? "Submitting..." : "Request Tour"}
            </button>

            {/* Fine print */}
            <p className="font-body text-xs text-muted text-center mt-2">
              Scheduling is free, and you can cancel anytime.
            </p>
          </form>
        </>
      )}
    </div>
  );
}
