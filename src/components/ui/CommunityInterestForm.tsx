// =============================================================================
// CommunityInterestForm: "get updates on this community" lead capture
//
// Same shape, styling and submit path as ContactForm (POSTs to /api/contact,
// keeps the Turnstile gate, redirects to /thank-you/). The two differences:
//   1. An "interest" dropdown, so the lead tells us WHICH kind of lot or
//      situation they are in before Barrett ever picks up the phone.
//   2. An extraTags prop, so a community page can tag its own leads in Follow
//      Up Boss without a new form type per community.
//
// "use client" because it holds form state and handles the submit event.
// =============================================================================

"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import TurnstileWidget from "@/components/ui/TurnstileWidget";

interface CommunityInterestFormProps {
  /** Community display name, used in the confirmation copy */
  communityName: string;
  /** Identifies where this form lives, i.e. the page URL */
  source: string;
  /** Options for the "interest" dropdown, in display order */
  interestOptions: string[];
  /** Extra Follow Up Boss tags for this community, e.g. ["Lake Juliana"] */
  extraTags?: string[];
  /** Heading displayed above the form */
  title?: string;
  /** Submit button label */
  submitLabel?: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export default function CommunityInterestForm({
  communityName,
  source,
  interestOptions,
  extraTags = [],
  title,
  submitLabel = "Get Updates",
}: CommunityInterestFormProps) {
  const router = useRouter();

  // --- Form field state ---
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(interestOptions[0] || "");
  const [message, setMessage] = useState("");

  // Hidden honeypot. A human never sees it, so anything typed here is a bot.
  // /api/contact silently discards submissions that fill it in.
  const [honeypot, setHoneypot] = useState("");

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // --- Turnstile spam protection token ---
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

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
          // Fold the dropdown answer into the message so it lands in the Follow
          // Up Boss note even if the tag list is ever trimmed.
          message: `Interest: ${interest}\n\n${message}`.trim(),
          // "details" is rendered as a labelled block in Barrett's alert email
          // and in the Follow Up Boss note. Shape must stay {label, value}[].
          details: [
            { label: "Community", value: communityName },
            { label: "Interest", value: interest },
          ],
          source,
          type: "community-interest",
          // Per-community Follow Up Boss tags, merged server side with the
          // standard type tags.
          extraTags,
          honeypot,
          turnstileToken,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setStatus("success");

      router.push("/thank-you/");
    } catch (err) {
      console.error("Community interest form submission failed:", err);
      setErrorMessage(
        "Something went wrong. Please try again or call Barrett directly at (813) 733-7907."
      );
      setStatus("error");
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8 max-w-lg mx-auto">
      {title && (
        <h3 className="heading-section text-xl text-primary mb-6">{title}</h3>
      )}

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-heading text-xl text-primary mb-2">You are on the list</h3>
          <p className="font-body text-muted text-sm mb-2">
            Barrett will email you the moment there is real news on {communityName}.
          </p>
          <p className="font-body text-muted text-xs">
            Want to talk sooner? Call{" "}
            <a href="tel:+18137337907" className="text-link hover:underline font-medium">
              (813) 733-7907
            </a>
          </p>
        </div>
      ) : (
        <>
          {status === "error" && errorMessage && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6 text-red-800 font-body text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (required) */}
            <div>
              <label
                htmlFor="gapway-name"
                className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="gapway-name"
                type="text"
                required
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Phone (required, because lot buyers get called, not emailed) */}
            <div>
              <label
                htmlFor="gapway-phone"
                className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
              >
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="gapway-phone"
                type="tel"
                required
                placeholder="(813) 555-0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Email (required) */}
            <div>
              <label
                htmlFor="gapway-email"
                className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="gapway-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Interest (required, pre-selected) */}
            <div>
              <label
                htmlFor="gapway-interest"
                className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
              >
                I am interested in <span className="text-red-500">*</span>
              </label>
              <select
                id="gapway-interest"
                required
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {interestOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Message (optional) */}
            <div>
              <label
                htmlFor="gapway-message"
                className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
              >
                Anything else?
              </label>
              <textarea
                id="gapway-message"
                rows={3}
                placeholder="Lot size, timeline, questions about the build process."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Honeypot: visually hidden, never focusable by a real visitor */}
            <div className="absolute left-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
              <label htmlFor="gapway-company">Company</label>
              <input
                id="gapway-company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Turnstile spam protection: must verify before submitting */}
            <TurnstileWidget onVerify={handleTurnstileVerify} />

            <button
              type="submit"
              disabled={status === "loading" || !turnstileToken}
              className={cn(
                "btn-primary w-full",
                (status === "loading" || !turnstileToken) &&
                  "opacity-60 cursor-not-allowed"
              )}
            >
              {status === "loading" ? "Sending..." : submitLabel}
            </button>

            <p className="text-[10px] text-muted/50 font-body text-center mt-3 leading-relaxed max-w-md mx-auto">
              By submitting this form, you consent to receive calls, texts, and emails
              from Barrett Henry, The NOW Team, REMAX Collective, and affiliated partners
              at the number and email provided. Message and data rates may apply. You may
              opt out at any time. This is not a condition of purchase.
            </p>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-xs text-muted/60 font-body">
              <span>FL License #BK3313308</span>
              <span>&bull;</span>
              <span>23+ Years Experience</span>
              <span>&bull;</span>
              <span>REMAX Collective</span>
              <span>&bull;</span>
              <span>e-PRO | MRP | SRS</span>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
