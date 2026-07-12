// =============================================================================
// ContactForm — Reusable client-side contact form with webhook submission
// "use client" because it manages form state and handles submit events
// =============================================================================

"use client";

import { useState, useCallback, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import TurnstileWidget from "@/components/ui/TurnstileWidget";

/** Property details attached to showing requests so FUB shows what they want */
interface PropertyContext {
  address?: string;
  city?: string;
  state?: string;
  price?: number;
  mlsNumber?: string;
  url?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
}

interface ContactFormProps {
  /** URL the form data will be POSTed to — always use "/api/contact" */
  webhookUrl: string;
  /** Identifies where this form lives (page URL or form ID) */
  source: string;
  /** Form type — tells /api/contact which n8n webhook to forward to
   *  Options: "contact" | "showing" | "valuation" | "newsletter" | "buyer-reg" */
  type?: string;
  /** Property details to attach — used on listing pages for showing requests */
  property?: PropertyContext;
  /** Optional heading displayed above the form */
  title?: string;
  /** Custom label for the submit button (default: "Send Message") */
  submitLabel?: string;
}

// Possible form states
type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm({
  webhookUrl,
  source,
  type = "contact",
  property,
  title,
  submitLabel = "Send Message",
}: ContactFormProps) {
  // --- Form field state ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // --- Submission state ---
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // --- Turnstile spam protection token ---
  const [turnstileToken, setTurnstileToken] = useState("");
  // Memoized callback so TurnstileWidget doesn't re-render unnecessarily
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  /** Handle form submission — POST data as JSON to the webhook */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, source, type, property, turnstileToken }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      // Reset fields on success
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setStatus("success");
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setErrorMessage(
        "Something went wrong. Please try again or call us directly."
      );
      setStatus("error");
    }
  }

  return (
    <div className="card p-6 sm:p-8">
      {/* --- Title (optional) --- */}
      {title && (
        <h3 className="heading-section text-xl text-primary mb-6">{title}</h3>
      )}

      {/* --- Success Message — replaces the form after submission --- */}
      {status === "success" ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-heading text-xl text-primary mb-2">Message Sent!</h3>
          <p className="font-body text-muted text-sm mb-2">
            Thanks for reaching out! Barrett will get back to you within 2 hours.
          </p>
          <p className="font-body text-muted text-xs mb-6">
            Need a faster response? Call{" "}
            <a href="tel:+18137337907" className="text-accent hover:underline font-medium">
              (813) 733-7907
            </a>
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="font-body text-xs text-accent hover:text-primary underline transition-colors"
          >
            Send another message
          </button>
        </div>
      ) : (
      <>
      {/* --- Error Message --- */}
      {status === "error" && errorMessage && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6 text-red-800 font-body text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden source field — tells us where the lead came from */}
        <input type="hidden" name="source" value={source} />

        {/* Name (required) */}
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-body font-medium text-dark mb-1"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Email (required) */}
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-body font-medium text-dark mb-1"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Phone (optional) */}
        <div>
          <label
            htmlFor="contact-phone"
            className="block text-sm font-body font-medium text-dark mb-1"
          >
            Phone
          </label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Message (required) */}
        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-body font-medium text-dark mb-1"
          >
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            rows={4}
            placeholder="How can we help you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none"
          />
        </div>

        {/* Turnstile spam protection — must verify before submitting */}
        <TurnstileWidget onVerify={handleTurnstileVerify} />

        {/* Submit Button — disabled until Turnstile passes */}
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

        {/* Trust signals — credentials displayed below submit for credibility */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-xs text-muted/60 font-body">
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
