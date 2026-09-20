"use client";

// =============================================================================
// FeedbackKiosk — the "on your way out" survey.
//
// The point is NOT the data alone — it is to slow the visitor down. A buyer who
// walks a house in ninety seconds never forms an opinion worth acting on. The
// room-by-room question forces them to mentally walk back through the home one
// space at a time, which is where attachment actually happens. Everything else
// is kept to taps so the extra time is spent remembering, not typing.
//
// Posts to /api/contact (same pipe as every other form, so it lands in FUB) and
// resets itself for the next guest.
// =============================================================================

import { useState, useEffect, useRef, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";

const ADDRESS = "11417 Cypress Park St";
const CITY_LINE = "Tampa, FL 33624";

// Lender working the open house - tagged onto every lead for later filtering.
const LENDER_NAME = "Christian Gardner";

// The deliberate slow-down. Listing the rooms out makes them replay the walk-
// through instead of answering "it was nice" — and multi-select means they
// linger over more than one space.
const ROOM_OPTIONS = [
  "The kitchen",
  "Owners suite",
  "The home office",
  "Screened patio",
  "The backyard",
  "Living / family room",
  "Curb appeal",
  "The cul-de-sac location",
];

const IMPRESSION_OPTIONS = ["Loved it", "Liked it", "It's just okay", "Not for me"];
const PRICE_OPTIONS = ["Great value", "Priced about right", "A little high", "Too high"];
const NEXT_STEP_OPTIONS = [
  "I want to see it again",
  "I'm interested — call me",
  "Send me similar homes",
  "Just looking today",
];

export default function FeedbackKiosk() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [impression, setImpression] = useState("");
  const [price, setPrice] = useState("");
  const [change, setChange] = useState("");
  const [nextStep, setNextStep] = useState("");

  // Honeypot: hidden from humans, irresistible to form-filling bots.
  const [hp, setHp] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const nameRef = useRef<HTMLInputElement>(null);

  // After the thank-you screen, wipe everything and focus the first field so
  // the next guest can just start typing.
  useEffect(() => {
    if (status !== "done") return;
    const t = setTimeout(() => {
      setName(""); setPhone(""); setRooms([]);
      setImpression(""); setPrice(""); setChange(""); setNextStep("");
      setStatus("idle");
      nameRef.current?.focus();
    }, 4000);
    return () => clearTimeout(t);
  }, [status]);

  function toggleRoom(room: string) {
    setRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    // Folded into the message body so it reaches Follow Up Boss without needing
    // new API fields — and so it can be pasted straight into a seller report.
    const message = [
      `OPEN HOUSE FEEDBACK — ${ADDRESS}`,
      impression && `Overall: ${impression}`,
      price && `Price opinion: ${price}`,
      rooms.length > 0 && `Favorite spaces: ${rooms.join(", ")}`,
      change && `Would change: ${change}`,
      nextStep && `Next step: ${nextStep}`,
    ].filter(Boolean).join("\n");

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Open house guest (feedback)",
          phone,
          message,
          source: "/11417-cypress-park-st/feedback/",
          type: "open-house-feedback",
          // Tagged onto the FUB contact. The address and today's date are added
          // server-side, so this only carries who was on site.
          extraTags: [LENDER_NAME],
          // Hidden field — invisible to a guest, but scripts fill every input
          // they find. Anything in here means the submission is a bot.
          honeypot: hp,
          property: {
            address: ADDRESS, city: "Tampa", state: "FL",
            price: 514990, mlsNumber: "TB8549024",
            url: "https://nowtb.com/11417-cypress-park-st/",
            beds: 3, baths: 2, sqft: 1800,
          },
        }),
      });
    } catch {
      // Never show an error at an open house — a failed POST must not stop the
      // line at the door. The guest still sees the thank-you.
    }
    setStatus("done");
  }

  // ---- Thank-you screen ----
  if (status === "done") {
    return (
      <main className="min-h-screen bg-primary text-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-8 h-28 w-28 rounded-full bg-accent flex items-center justify-center">
            <Check className="h-16 w-16 text-primary" strokeWidth={3} />
          </div>
          <h1 className="font-heading text-5xl font-light uppercase tracking-wide mb-4">
            Thank You
          </h1>
          <p className="font-body text-2xl text-white/80">
            That genuinely helps — I pass every note straight to the seller.
          </p>
          <p className="font-body text-lg text-white/50 mt-10">Ready for the next guest…</p>
        </div>
      </main>
    );
  }

  // ---- Feedback form ----
  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary text-white px-8 pt-10 pb-7 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-light uppercase tracking-wide">
          Before You Go
        </h1>
        <p className="font-body text-xl text-accent mt-2">
          What did you think of {ADDRESS}?
        </p>
        <p className="font-body text-base text-white/60 mt-1">
          {CITY_LINE} &middot; Takes about 30 seconds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-8 space-y-7">
        {/* Honeypot. Off-screen rather than display:none - some bots skip
            hidden inputs but still fill positioned ones. aria-hidden and
            tabIndex keep it away from screen readers and keyboard users. */}
        <input
          type="text"
          name="company"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-px w-px opacity-0"
        />
        <Choice
          label="Overall, what did you think?"
          options={IMPRESSION_OPTIONS}
          value={impression}
          onChange={setImpression}
        />

        {/* The slow-down question — multi-select on purpose */}
        <MultiChoice
          label="Which spaces stood out? (pick any)"
          options={ROOM_OPTIONS}
          values={rooms}
          onToggle={toggleRoom}
        />

        <Choice
          label="How does the price feel to you?"
          options={PRICE_OPTIONS}
          value={price}
          onChange={setPrice}
        />

        <Field label="If you could change one thing, what would it be?">
          <input
            type="text"
            value={change}
            onChange={(e) => setChange(e.target.value)}
            autoComplete="off"
            placeholder="Honest answers help the seller most"
            className={INPUT}
          />
        </Field>

        <Choice
          label="What would you like to happen next?"
          options={NEXT_STEP_OPTIONS}
          value={nextStep}
          onChange={setNextStep}
        />

        {/* Name and phone last and optional — asking up front makes people bail */}
        <div className="grid md:grid-cols-2 gap-7">
          <Field label="Your name (optional)">
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              autoCapitalize="words"
              className={INPUT}
            />
          </Field>
          <Field label="Phone (only if you want a call back)">
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="off"
              className={INPUT}
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-accent text-primary font-heading text-3xl font-bold uppercase tracking-wide py-7 rounded-xl disabled:opacity-40 transition active:scale-[0.99] flex items-center justify-center gap-3"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin" />
              Sending…
            </>
          ) : (
            "Send Feedback"
          )}
        </button>

        <p className="text-center font-body text-sm text-muted pb-6">
          Anonymous unless you leave your name. Never sold or shared.
        </p>
      </form>
    </main>
  );
}

// Oversized inputs — 24px text stops iOS from zooming on focus
const INPUT =
  "w-full rounded-xl border-2 border-border bg-white px-5 py-5 text-2xl text-primary focus:border-accent focus:outline-none placeholder:text-base placeholder:text-muted";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-body text-lg font-bold text-primary mb-2">{label}</span>
      {children}
    </label>
  );
}

// Big tap-target button group — faster than a dropdown on a touchscreen
function Choice({
  label, options, value, onChange,
}: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="font-body text-lg font-bold text-primary mb-2">{label}</p>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(active ? "" : o)}
              aria-pressed={active}
              className={`rounded-xl border-2 px-6 py-4 font-body text-xl transition ${
                active
                  ? "border-accent bg-accent text-primary font-bold"
                  : "border-border bg-white text-body"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Same control, but several can be on at once
function MultiChoice({
  label, options, values, onToggle,
}: { label: string; options: string[]; values: string[]; onToggle: (v: string) => void }) {
  return (
    <div>
      <p className="font-body text-lg font-bold text-primary mb-2">{label}</p>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => {
          const active = values.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => onToggle(o)}
              aria-pressed={active}
              className={`rounded-xl border-2 px-6 py-4 font-body text-xl transition ${
                active
                  ? "border-accent bg-accent text-primary font-bold"
                  : "border-border bg-white text-body"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
