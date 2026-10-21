"use client";

// =============================================================================
// SignInKiosk, the open house sign-in form.
// Posts to /api/contact (same pipe as every other form, so leads land in FUB),
// then shows a 4 second thank-you and resets itself for the next guest.
//
// `type: "open-house"` is what tells /api/contact to skip Turnstile and the
// lead-validation gate. Do not change it, or walk-ins get silently dropped
// while the kiosk still shows its thank-you screen.
//
// WHAT THIS FORM DELIBERATELY DOES NOT ASK
// Earlier versions of this kiosk asked timeframe, financing, and whether the
// guest wanted an intro to the lender. Those are gone on purpose. Florida
// Statute 475.278's open house exemption from brokerage relationship disclosure
// depends on not eliciting confidential information from a visitor, and
// budget / timeline / motivation questions are exactly what that means. Do not
// add them back when cloning this file for the next listing.
// =============================================================================

import { useState, useEffect, useRef, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";

const ADDRESS = "2510 Brimhollow Dr";
const CITY_LINE = "Valrico, FL 33596";
const PHONE = "(813) 733-7907";
const MLS = "TB8558255";
const PRICE = 479900;

// The only branching question on the sheet. Knowing whether someone is already
// represented is a cooperation question, not a confidential one.
const AGENT_OPTIONS = ["No, I'm on my own", "Yes, I have an agent"];

export default function SignInKiosk() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agent, setAgent] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agentBrokerage, setAgentBrokerage] = useState("");

  // Honeypot: hidden from humans, irresistible to form-filling bots.
  const [hp, setHp] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const firstRef = useRef<HTMLInputElement>(null);

  const represented = agent === "Yes, I have an agent";

  // After the thank-you screen, wipe everything and focus the first field so
  // the next guest can just start typing.
  useEffect(() => {
    if (status !== "done") return;
    const t = setTimeout(() => {
      setFirstName(""); setLastName(""); setPhone(""); setEmail("");
      setAgent(""); setAgentName(""); setAgentBrokerage("");
      setStatus("idle");
      firstRef.current?.focus();
    }, 4000);
    return () => clearTimeout(t);
  }, [status]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) return;
    setStatus("sending");

    // Everything that isn't a standard field gets folded into the message body
    // so it reaches Follow Up Boss without needing new API fields.
    const message = [
      `OPEN HOUSE CHECK-IN, ${ADDRESS}`,
      agent && `Working with an agent: ${agent}`,
      represented && agentName && `Agent: ${agentName}`,
      represented && agentBrokerage && `Brokerage: ${agentBrokerage}`,
    ].filter(Boolean).join("\n");

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          message,
          source: "/2510-brimhollow-dr/sign-in/",
          type: "open-house",
          // Tagged onto the FUB contact alongside the server-side "Open House"
          // tag. "OH <address>" is what keeps this weekend's walk-ins separate
          // from every previous open house in the database.
          extraTags: [
            "OH 2510 Brimhollow",
            agent ? (represented ? "OH Represented" : "OH Unrepresented") : "",
          ].filter(Boolean),
          // Hidden field, invisible to a guest, but scripts fill every input
          // they find. Anything in here means the submission is a bot.
          honeypot: hp,
          property: {
            address: ADDRESS, city: "Valrico", state: "FL",
            price: PRICE, mlsNumber: MLS,
            url: "https://nowtb.com/2510-brimhollow-dr/",
            beds: 3, baths: 2, sqft: 2280,
          },
        }),
      });
    } catch {
      // Never show an error at an open house, a failed POST must not stop the
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
            You&rsquo;re Checked In
          </h1>
          <p className="font-body text-2xl text-white/80">
            Welcome to {ADDRESS}. I&rsquo;m here if you have questions.
          </p>
          {/* Points at the existing /card route, which builds the .vcf and
              triggers the download. Do not invent a static .vcf path here 
              there isn't one in public/. */}
          <a
            href="/card/"
            className="inline-block mt-8 bg-accent text-primary font-heading text-2xl font-bold uppercase tracking-wide px-10 py-5 rounded-xl"
          >
            Save My Contact
          </a>
          <p className="font-body text-lg text-white/50 mt-10">Ready for the next guest…</p>
        </div>
      </main>
    );
  }

  // ---- Check-in form ----
  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary text-white px-8 pt-10 pb-7 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-light uppercase tracking-wide">
          Check In to the Open House
        </h1>
        <p className="font-body text-xl text-accent mt-2">
          {ADDRESS} &middot; {CITY_LINE}
        </p>
        <p className="font-body text-base text-white/60 mt-1">
          Barrett Henry, Licensed FL Real Estate Broker &middot; REMAX Collective &middot; {PHONE}
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

        <div className="grid md:grid-cols-2 gap-7">
          <Field label="First Name" required>
            <input
              ref={firstRef}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="off"
              autoCapitalize="words"
              className={INPUT}
            />
          </Field>
          <Field label="Last Name">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="off"
              autoCapitalize="words"
              className={INPUT}
            />
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-7">
          <Field label="Mobile">
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="off"
              className={INPUT}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              autoCapitalize="none"
              className={INPUT}
            />
          </Field>
        </div>

        <Choice
          label="Are you working with a real estate agent?"
          options={AGENT_OPTIONS}
          value={agent}
          onChange={setAgent}
        />

        {/* Only ask who, once they've said yes */}
        {represented && (
          <div className="grid md:grid-cols-2 gap-7">
            <Field label="Your agent's name">
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                autoComplete="off"
                autoCapitalize="words"
                className={INPUT}
              />
            </Field>
            <Field label="Their brokerage">
              <input
                type="text"
                value={agentBrokerage}
                onChange={(e) => setAgentBrokerage(e.target.value)}
                autoComplete="off"
                autoCapitalize="words"
                className={INPUT}
              />
            </Field>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending" || !firstName.trim()}
          className="w-full bg-accent text-primary font-heading text-3xl font-bold uppercase tracking-wide py-7 rounded-xl disabled:opacity-40 transition active:scale-[0.99] flex items-center justify-center gap-3"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin" />
              Checking You In…
            </>
          ) : (
            "Check In"
          )}
        </button>

        {/* TCPA consent, same wording as the Request a Showing form */}
        <p className="text-center font-body text-xs text-muted leading-relaxed pb-6">
          By submitting this form, you consent to receive calls, texts, and emails from Barrett
          Henry, The NOW Team, REMAX Collective, and affiliated partners at the number and email
          provided. Message and data rates may apply. You may opt out at any time. This is not a
          condition of purchase. Your information is never sold or shared.
        </p>
      </form>
    </main>
  );
}

// Oversized inputs, 24px text stops iOS from zooming on focus
const INPUT =
  "w-full rounded-xl border-2 border-border bg-white px-5 py-5 text-2xl text-primary focus:border-accent focus:outline-none";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-body text-lg font-bold text-primary mb-2">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
    </label>
  );
}

// Big tap-target button group, faster than a dropdown on a touchscreen
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
