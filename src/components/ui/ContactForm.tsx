// =============================================================================
// ContactForm — Reusable client-side contact form with webhook submission
// "use client" because it manages form state and handles submit events
// =============================================================================

"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  /** URL the form data will be POSTed to (e.g. n8n webhook) */
  webhookUrl: string;
  /** Identifies where this form lives (page URL or form ID) */
  source: string;
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

  /** Handle form submission — POST data as JSON to the webhook */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, source }),
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

      {/* --- Success Message --- */}
      {status === "success" && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-6 text-green-800 font-body text-sm">
          Thanks for reaching out! We&apos;ll get back to you shortly.
        </div>
      )}

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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "btn-primary w-full",
            status === "loading" && "opacity-60 cursor-not-allowed"
          )}
        >
          {status === "loading" ? "Sending..." : submitLabel}
        </button>
      </form>
    </div>
  );
}
