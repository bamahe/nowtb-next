// =============================================================================
// ValuationForm — Client-side home valuation form with address fields
// "use client" because it manages form state and handles submit events
// =============================================================================

"use client";

import { useState, useCallback, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import TurnstileWidget from "@/components/ui/TurnstileWidget";

// --- Form submission status ---
type FormStatus = "idle" | "loading" | "success" | "error";

export default function ValuationForm() {
  // --- Form field state ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // --- Turnstile spam protection token ---
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  /** Submit the valuation request to the API */
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
          address,
          city,
          zip,
          message,
          source: "valuation",
          type: "valuation",
          turnstileToken,
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      // Clear form on success
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setCity("");
      setZip("");
      setMessage("");
      setStatus("success");
    } catch (err) {
      console.error("Valuation form submission failed:", err);
      setErrorMessage(
        "Something went wrong. Please try again or call us at (813) 733-7907."
      );
      setStatus("error");
    }
  }

  return (
    <div className="card p-6 sm:p-8">
      <h3 className="heading-section text-xl text-primary mb-6">
        Request Your Free Home Valuation
      </h3>

      {/* Success message */}
      {status === "success" && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-6 text-green-800 font-body text-sm">
          Your valuation request has been received. Barrett will be in touch
          shortly with your home&apos;s market value.
        </div>
      )}

      {/* Error message */}
      {status === "error" && errorMessage && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6 text-red-800 font-body text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="val-name"
            className="block text-sm font-body font-medium text-dark mb-1"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="val-name"
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
            htmlFor="val-email"
            className="block text-sm font-body font-medium text-dark mb-1"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="val-email"
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
            htmlFor="val-phone"
            className="block text-sm font-body font-medium text-dark mb-1"
          >
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="val-phone"
            type="tel"
            required
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Property Address */}
        <div>
          <label
            htmlFor="val-address"
            className="block text-sm font-body font-medium text-dark mb-1"
          >
            Property Address <span className="text-red-500">*</span>
          </label>
          <input
            id="val-address"
            type="text"
            required
            placeholder="123 Main Street"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full"
          />
        </div>

        {/* City + Zip (side by side) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="val-city"
              className="block text-sm font-body font-medium text-dark mb-1"
            >
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="val-city"
              type="text"
              required
              placeholder="Tampa"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label
              htmlFor="val-zip"
              className="block text-sm font-body font-medium text-dark mb-1"
            >
              Zip Code <span className="text-red-500">*</span>
            </label>
            <input
              id="val-zip"
              type="text"
              required
              placeholder="33594"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Message (optional) */}
        <div>
          <label
            htmlFor="val-message"
            className="block text-sm font-body font-medium text-dark mb-1"
          >
            Message
          </label>
          <textarea
            id="val-message"
            rows={3}
            placeholder="Anything else we should know about your property?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none"
          />
        </div>

        {/* Turnstile spam protection — must verify before submitting */}
        <TurnstileWidget onVerify={handleTurnstileVerify} />

        {/* Submit — disabled until Turnstile passes */}
        <button
          type="submit"
          disabled={status === "loading" || !turnstileToken}
          className={cn(
            "btn-primary w-full",
            (status === "loading" || !turnstileToken) &&
              "opacity-60 cursor-not-allowed"
          )}
        >
          {status === "loading" ? "Submitting..." : "Get My Home Value"}
        </button>
      </form>
    </div>
  );
}
