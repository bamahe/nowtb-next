/**
 * Election status banner. Server component, no client JS.
 *
 * Reads ONE field, result.json.status, and renders the matching block of copy
 * that Barrett wrote in advance in branches.ts. That is the entire
 * post-election mechanism. The automation never writes prose here; on
 * November 4 it flips the enum and this renders a different approved block.
 *
 * If it breaks, check: result.json.status must be exactly "pending",
 * "passed", or "failed". Anything else falls back to "pending", which is the
 * safe direction because it claims nothing about an outcome.
 */

import { AMD3_BRANCHES, type Amd3Status } from "@/data/amendment-3/branches";
import result from "@/data/amendment-3/result.json";

/** Narrow the JSON string to our enum, defaulting to the claim-nothing state. */
function statusOf(raw: string): Amd3Status {
  return raw === "passed" || raw === "failed" ? raw : "pending";
}

export default function StatusBanner() {
  const status = statusOf(result.status);
  const branch = AMD3_BRANCHES[status];

  const tone =
    status === "passed"
      ? "border-green-600 bg-green-50"
      : status === "failed"
        ? "border-gray-400 bg-gray-50"
        : "border-[#0c1829] bg-gray-50";

  return (
    <section
      aria-label="Amendment 3 status"
      className={`my-8 rounded-lg border-l-4 p-6 ${tone}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
        {branch.badge}
      </p>
      <h2 className="mt-1 font-heading text-2xl font-bold text-[#0c1829]">
        {branch.headline}
      </h2>
      <div className="mt-3 space-y-3 font-body leading-relaxed text-dark">
        {branch.paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>

      {/* Only show vote numbers once they exist AND carry a source. There is
          no code path that renders a bare unsourced number. */}
      {status !== "pending" &&
      result.yesPercent !== null &&
      result.primarySource ? (
        <p className="mt-4 border-t border-gray-300 pt-3 text-sm text-gray-700">
          Reported result: {result.yesPercent}% yes, {result.noPercent}% no
          {result.certified ? ", certified" : ", unofficial"}.{" "}
          <a
            href={result.primarySource}
            className="text-link hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Source
          </a>
        </p>
      ) : null}
    </section>
  );
}
