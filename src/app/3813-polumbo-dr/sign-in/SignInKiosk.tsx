"use client";

// =============================================================================
// SignInKiosk — the actual open house sign-in form.
// Posts to /api/contact (same pipe as every other form, so leads land in FUB),
// then shows a 4 second thank-you and resets itself for the next guest.
// =============================================================================

import { useState, useEffect, useRef, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";

const ADDRESS = "3813 Polumbo Dr";
const CITY_LINE = "Valrico, FL 33596";
const PHONE = "(813) 733-7907";

// Radio-button groups. Kept short on purpose — long forms kill sign-in rates.
const AGENT_OPTIONS = ["No, I'm on my own", "Yes, I have an agent"];
const TIMEFRAME_OPTIONS = ["ASAP", "1–3 months", "3–6 months", "Just looking"];
const FINANCING_OPTIONS = ["Pre-approved", "Need a lender", "Cash", "Not yet"];
const HEARD_OPTIONS = ["Drove by / sign", "Zillow", "Realtor.com", "Facebook / Instagram", "Friend", "Other"];

export default function SignInKiosk() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agent, setAgent] = useState("");
  const [agentName, setAgentName] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [financing, setFinancing] = useState("");
  const [heard, setHeard] = useState("");
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const nameRef = useRef<HTMLInputElement>(null);

  // After the thank-you screen, wipe everything and focus the first field so
  // the next guest can just start typing.
  useEffect(() => {
    if (status !== "done") return;
    const t = setTimeout(() => {
      setName(""); setPhone(""); setEmail("");
      setAgent(""); setAgentName(""); setTimeframe("");
      setFinancing(""); setHeard(""); setNotes("");
      setStatus("idle");
      nameRef.current?.focus();
    }, 4000);
    return () => clearTimeout(t);
  }, [status]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setStatus("sending");

    // Everything that isn't a standard field gets folded into the message body
    // so it still reaches Follow Up Boss without needing new API fields.
    const message = [
      `OPEN HOUSE SIGN-IN — ${ADDRESS}`,
      agent && `Working with an agent: ${agent}${agentName ? ` (${agentName})` : ""}`,
      timeframe && `Timeframe: ${timeframe}`,
      financing && `Financing: ${financing}`,
      heard && `Heard about us: ${heard}`,
      notes && `Notes: ${notes}`,
    ].filter(Boolean).join("\n");

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, message,
          source: "/3813-polumbo-dr/sign-in/",
          type: "showing",
          property: {
            address: ADDRESS, city: "Valrico", state: "FL",
            price: 550000, mlsNumber: "TB8534534",
            url: "https://nowtb.com/3813-polumbo-dr/",
            beds: 4, baths: 3, sqft: 2271,
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
            Enjoy the home — I&rsquo;m here if you have questions.
          </p>
          <p className="font-body text-lg text-white/50 mt-10">Ready for the next guest…</p>
        </div>
      </main>
    );
  }

  // ---- Sign-in form ----
  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary text-white px-8 py-7 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-light uppercase tracking-wide">
          Welcome — Please Sign In
        </h1>
        <p className="font-body text-xl text-accent mt-2">
          {ADDRESS} &middot; {CITY_LINE}
        </p>
        <p className="font-body text-base text-white/60 mt-1">
          Barrett Henry, REMAX Collective &middot; {PHONE}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-8 space-y-7">
        {/* Name */}
        <Field label="Your Name" required>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
            autoCapitalize="words"
            className={INPUT}
          />
        </Field>

        {/* Phone + email side by side on the iPad's wide screen */}
        <div className="grid md:grid-cols-2 gap-7">
          <Field label="Phone">
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

        <Choice label="Are you working with an agent?" options={AGENT_OPTIONS} value={agent} onChange={setAgent} />

        {/* Only ask for the agent's name if they said yes */}
        {agent === "Yes, I have an agent" && (
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
        )}

        <Choice label="When are you looking to move?" options={TIMEFRAME_OPTIONS} value={timeframe} onChange={setTimeframe} />
        <Choice label="Financing" options={FINANCING_OPTIONS} value={financing} onChange={setFinancing} />
        <Choice label="How did you hear about this open house?" options={HEARD_OPTIONS} value={heard} onChange={setHeard} />

        <Field label="Anything you're looking for? (optional)">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            autoComplete="off"
            className={INPUT}
          />
        </Field>

        <button
          type="submit"
          disabled={status === "sending" || !name.trim()}
          className="w-full bg-accent text-primary font-heading text-3xl font-bold uppercase tracking-wide py-7 rounded-xl disabled:opacity-40 transition active:scale-[0.99] flex items-center justify-center gap-3"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin" />
              Signing In…
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center font-body text-sm text-muted pb-6">
          We respect your privacy. Your information is never sold or shared.
        </p>
      </form>
    </main>
  );
}

// Oversized inputs — 24px text stops iOS from zooming on focus
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
