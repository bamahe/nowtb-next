"use client";

// =============================================================================
// SellerIntakeForm — detailed property questionnaire for listing appointments
//
// Collects what Barrett otherwise has to chase by phone before a listing
// appointment: utility costs, HOA, roof and system ages, updates, and
// occupancy. Answers are POSTed to /api/contact as a `details` array so they
// land in the Follow Up Boss note and the alert email, not just n8n.
// =============================================================================

import { useState, type FormEvent } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

// --- Field definitions, grouped into the sections shown on the page ---
interface Field {
  name: string;
  label: string;
  type?: "text" | "number" | "tel" | "email" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  help?: string;
}

interface Section {
  title: string;
  blurb?: string;
  fields: Field[];
}

const SECTIONS: Section[] = [
  {
    title: "The property",
    fields: [
      { name: "address", label: "Property address", placeholder: "Street, city, ZIP" },
      { name: "beds", label: "Bedrooms", type: "number", placeholder: "3" },
      { name: "baths", label: "Bathrooms", type: "number", placeholder: "2" },
      { name: "sqft", label: "Approximate square feet", type: "number", placeholder: "1,450" },
      { name: "yearBuilt", label: "Year built", type: "number", placeholder: "1972" },
      {
        name: "occupancy",
        label: "Who is in the home now",
        type: "select",
        options: ["Owner occupied", "Tenant occupied", "Vacant", "Seasonal / second home"],
      },
      {
        name: "timeline",
        label: "When are you hoping to sell",
        type: "select",
        options: [
          "As soon as possible",
          "1 to 3 months",
          "3 to 6 months",
          "6 to 12 months",
          "Just exploring",
        ],
      },
    ],
  },
  {
    title: "Monthly costs",
    blurb:
      "Buyers ask about these before they write an offer. Estimates are fine. If a number surprises a buyer late, it costs you leverage.",
    fields: [
      { name: "electricCompany", label: "Electric company", placeholder: "Duke Energy, TECO, etc." },
      {
        name: "electricAverage",
        label: "Average electric bill",
        placeholder: "$180 / month",
        help: "The 12-month average if you have it, not just this month.",
      },
      { name: "waterCompany", label: "Water and sewer provider", placeholder: "City / county utility" },
      { name: "waterAverage", label: "Average water bill", placeholder: "$70 / month" },
      { name: "internetProvider", label: "Internet provider", placeholder: "Spectrum, Frontier, etc." },
      {
        name: "insuranceCarrier",
        label: "Insurance carrier and annual premium",
        placeholder: "Citizens, $3,200 / year",
      },
      {
        name: "floodInsurance",
        label: "Do you carry flood insurance",
        type: "select",
        options: ["Yes", "No", "Not sure"],
      },
    ],
  },
  {
    title: "HOA and community",
    fields: [
      {
        name: "hasHoa",
        label: "Is there an HOA or CDD",
        type: "select",
        options: ["No HOA", "HOA only", "CDD only", "Both HOA and CDD", "Not sure"],
      },
      { name: "hoaName", label: "HOA or management company name", placeholder: "If applicable" },
      { name: "hoaFee", label: "HOA fee and how often", placeholder: "$285 quarterly" },
      { name: "cddFee", label: "CDD annual amount", placeholder: "If applicable" },
      {
        name: "hoaIncludes",
        label: "What the fee covers",
        type: "textarea",
        placeholder: "Lawn, cable, roof, exterior paint, gate, pool",
      },
      {
        name: "hoaApproval",
        label: "Does the HOA approve buyers or restrict leasing",
        type: "textarea",
        placeholder: "Application fee, minimum lease term, rental cap",
      },
    ],
  },
  {
    title: "Roof, systems, and age",
    blurb:
      "In Florida these four items drive insurability. A buyer's carrier will ask, so it is better we know first.",
    fields: [
      { name: "roofAge", label: "Roof age or year replaced", placeholder: "2019" },
      { name: "roofMaterial", label: "Roof material", placeholder: "Shingle, tile, metal" },
      { name: "hvacAge", label: "A/C age or year replaced", placeholder: "2021" },
      { name: "waterHeaterAge", label: "Water heater age", placeholder: "2018" },
      {
        name: "electricalPanel",
        label: "Electrical panel age or brand",
        placeholder: "Year, and brand if you know it",
        help: "Federal Pacific and Zinsco panels affect insurability, so flag them if present.",
      },
      { name: "plumbingType", label: "Plumbing type if known", placeholder: "Copper, CPVC, PEX, polybutylene" },
    ],
  },
  {
    title: "Updates and condition",
    fields: [
      {
        name: "updates",
        label: "Updates you have made and roughly when",
        type: "textarea",
        placeholder:
          "Kitchen 2020, both baths 2021, impact windows 2022, new septic drain field 2019",
      },
      {
        name: "knownIssues",
        label: "Anything you already know needs work",
        type: "textarea",
        placeholder:
          "Be candid. Finding it now is cheap, finding it during inspection is expensive.",
      },
      {
        name: "permits",
        label: "Any work done without a permit",
        type: "select",
        options: ["No", "Yes", "Not sure"],
      },
      {
        name: "features",
        label: "Pool, garage, waterfront, or anything else worth featuring",
        type: "textarea",
        placeholder: "Screened pool, 2 car garage, conservation lot",
      },
    ],
  },
  {
    title: "Mortgage and payoff",
    blurb: "Only what you are comfortable sharing. It makes your net sheet real instead of an estimate.",
    fields: [
      { name: "lender", label: "Current lender", placeholder: "Optional" },
      { name: "payoff", label: "Approximate payoff balance", placeholder: "Optional" },
      {
        name: "secondLien",
        label: "Any second mortgage, HELOC, or solar lien",
        type: "select",
        options: ["No", "Yes", "Not sure"],
      },
    ],
  },
];

// Flatten once so we can build state and the details payload from one source
const ALL_FIELDS = SECTIONS.flatMap((s) => s.fields);

export default function SellerIntakeForm() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const set = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    // Send answers as label/value pairs so the CRM note and alert email are
    // readable without anyone having to map field names back to questions.
    const details = ALL_FIELDS.filter((f) => values[f.name]?.trim()).map((f) => ({
      label: f.label,
      value: values[f.name].trim(),
    }));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "seller-intake",
          name,
          email,
          phone,
          source: "/seller-intake/",
          message: `Seller intake submitted for ${values.address || "an unspecified address"}.`,
          details,
          // Raw answers too, so n8n can map individual fields if needed
          ...values,
          property: values.address ? { address: values.address } : undefined,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(
        "That did not go through. Call or text (813) 733-7907 and I will take it down directly."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border-2 border-primary bg-primary/5 px-6 py-8 text-center">
        <h3 className="heading-section mb-3 text-xl text-primary">Got it, thank you</h3>
        <p className="font-body text-dark leading-relaxed">
          I have everything you sent. I will put together your numbers and follow up
          shortly. If anything is urgent, call or text{" "}
          <a href="tel:+18137337907" className="font-semibold underline">
            (813) 733-7907
          </a>
          .
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2.5 font-body text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* --- Contact block, the only required part --- */}
      <fieldset>
        <legend className="heading-section mb-1 text-lg text-primary">Your contact info</legend>
        <p className="font-body mb-5 text-sm text-muted">
          The only required section. Everything below it helps, but send what you know
          and leave the rest blank.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="font-body mb-1 block text-sm font-medium text-dark">Name *</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="font-body mb-1 block text-sm font-medium text-dark">Email *</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="font-body mb-1 block text-sm font-medium text-dark">Phone</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              autoComplete="tel"
            />
          </label>
        </div>
      </fieldset>

      {/* --- Question sections --- */}
      {SECTIONS.map((section) => (
        <fieldset key={section.title}>
          <legend className="heading-section mb-1 text-lg text-primary">
            {section.title}
          </legend>
          {section.blurb && (
            <p className="font-body mb-5 text-sm text-muted">{section.blurb}</p>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {section.fields.map((field) => {
              const isWide = field.type === "textarea";
              return (
                <label
                  key={field.name}
                  className={`block ${isWide ? "sm:col-span-2" : ""}`}
                >
                  <span className="font-body mb-1 block text-sm font-medium text-dark">
                    {field.label}
                  </span>

                  {field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={values[field.name] || ""}
                      onChange={(e) => set(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={values[field.name] || ""}
                      onChange={(e) => set(field.name, e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select one</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === "number" ? "text" : field.type || "text"}
                      inputMode={field.type === "number" ? "numeric" : undefined}
                      value={values[field.name] || ""}
                      onChange={(e) => set(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  )}

                  {field.help && (
                    <span className="font-body mt-1 block text-xs text-muted">
                      {field.help}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {status === "error" && (
        <p className="font-body rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded bg-primary px-6 py-3.5 font-body font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? "Sending..." : "Send my intake"}
        </button>
        <p className="font-body mt-3 text-xs text-muted">
          This goes straight to me. It is not shared, listed, or published anywhere.
        </p>
      </div>
    </form>
  );
}
