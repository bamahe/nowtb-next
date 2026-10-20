"use client";

/**
 * "Does the December 31, 2026 cutoff affect me?" checker.
 *
 * A short branching questionnaire. The outcome copy lives in
 * src/data/amendment-3-outcomes.ts and is generated from the research pass, so
 * the wording stays consistent with the rest of the page and cannot pick up
 * em dashes by hand editing.
 *
 * If it breaks, check: every `next` value below must be either a question id
 * that exists in QUESTIONS, or an outcome id that exists in AMD3_OUTCOMES. A
 * typo there renders a dead end.
 */

import { useState } from "react";
import { AMD3_OUTCOMES } from "@/data/amendment-3-outcomes";

type Role =
  | "owner_resident"
  | "buyer_resident"
  | "owner_nonhomestead"
  | "no_property";

interface Answer {
  label: string;
  /** Question id to go to next, or "outcome:<id>" to finish. */
  next: string;
  setRole?: Role;
}

interface Question {
  id: string;
  text: string;
  help?: string;
  answers: Answer[];
}

/**
 * The tree. Routing that depends on an earlier answer is handled in
 * resolveNext() below rather than being baked into `next`, because two
 * different roles can give the same answer and land somewhere different.
 */
const QUESTIONS: Record<string, Question> = {
  q1_role: {
    id: "q1_role",
    text: "Which one sounds like you?",
    answers: [
      {
        label: "I own a Florida home and live in it as my full time home",
        next: "q2_residency",
        setRole: "owner_resident",
      },
      {
        label: "I am buying, or plan to buy, a Florida home to live in full time",
        next: "q2_residency",
        setRole: "buyer_resident",
      },
      {
        label:
          "I own Florida property I do not live in (rental, second home, land, or commercial)",
        next: "q2b_future_homestead",
        setRole: "owner_nonhomestead",
      },
      {
        label: "I do not own Florida property",
        next: "q2_residency",
        setRole: "no_property",
      },
    ],
  },
  q2b_future_homestead: {
    id: "q2b_future_homestead",
    text: "Will that property ever become your full time home?",
    answers: [
      { label: "Yes, I plan to move into it", next: "q2_residency" },
      {
        label: "No, it stays an investment or second home",
        next: "outcome:out_f_nonhomestead",
      },
      { label: "Not sure", next: "outcome:out_f_nonhomestead" },
    ],
  },
  q2_residency: {
    id: "q2_residency",
    text: "On December 31, 2026, was Florida your permanent home, meaning the place you actually lived and intended to stay?",
    help: "This is the one date the amendment cares about. It is about where you lived, not about when you buy a house and not about when you file for homestead.",
    answers: [
      { label: "Yes, Florida was my permanent home on that date", next: "ROUTE_EXISTING" },
      { label: "No, I lived in another state or another country", next: "ROUTE_NEW" },
      {
        label: "I am not sure, or my move happened right around that date",
        next: "outcome:out_e_unclear",
      },
    ],
  },
  q3_existing_timing: {
    id: "q3_existing_timing",
    text: "When will that home have a Florida homestead exemption on it?",
    answers: [
      {
        label: "It will be homesteaded for the 2027 tax year",
        next: "outcome:out_b_full_2027",
      },
      { label: "2028 or later", next: "outcome:out_c_full_later" },
      { label: "I do not have a date yet", next: "outcome:out_c_full_later" },
    ],
  },
  q3_new_firstyear: {
    id: "q3_new_firstyear",
    text: "What is the first year you expect to have a Florida homestead exemption on a home you own?",
    answers: [
      { label: "2027", next: "outcome:out_d_new_resident" },
      { label: "2028", next: "outcome:out_d_new_resident" },
      { label: "2029", next: "outcome:out_d_new_resident" },
      { label: "2030 or later", next: "outcome:out_d_new_resident" },
      { label: "I do not know yet", next: "outcome:out_d_new_resident" },
    ],
  },
};

/** Branches that depend on the role captured in Q1. */
function resolveNext(next: string, role: Role | null): string {
  if (next === "ROUTE_EXISTING") {
    if (role === "owner_resident") return "outcome:out_a_full_now";
    if (role === "buyer_resident") return "q3_existing_timing";
    if (role === "owner_nonhomestead") return "outcome:out_c_full_later";
    return "outcome:out_g_banked";
  }
  if (next === "ROUTE_NEW") {
    if (role === "no_property") return "outcome:out_g_new_resident_no_property";
    return "q3_new_firstyear";
  }
  return next;
}

export default function ResidencyChecker() {
  const [currentId, setCurrentId] = useState("q1_role");
  const [role, setRole] = useState<Role | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [outcomeId, setOutcomeId] = useState<string | null>(null);

  function choose(answer: Answer) {
    const nextRole = answer.setRole ?? role;
    if (answer.setRole) setRole(answer.setRole);

    const resolved = resolveNext(answer.next, nextRole);
    setHistory((h) => [...h, currentId]);

    if (resolved.startsWith("outcome:")) {
      setOutcomeId(resolved.slice("outcome:".length));
    } else {
      setCurrentId(resolved);
    }
  }

  function back() {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setOutcomeId(null);
    setCurrentId(prev);
  }

  function restart() {
    setCurrentId("q1_role");
    setRole(null);
    setHistory([]);
    setOutcomeId(null);
  }

  const question = QUESTIONS[currentId];
  const outcomeHtml = outcomeId ? AMD3_OUTCOMES[outcomeId] : null;

  return (
    <div className="my-10 rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="rounded-t-lg border-b border-gray-200 bg-[#0c1829] px-6 py-4">
        <h3 className="font-heading text-xl font-bold text-white">
          Does the December 31, 2026 cutoff affect you?
        </h3>
        <p className="mt-1 text-sm text-gray-300">
          Four questions. No email required.
        </p>
      </div>

      <div className="px-6 py-6">
        {outcomeHtml ? (
          <div>
            <div
              className="prose prose-sm font-body max-w-none text-dark
                prose-headings:font-heading prose-headings:text-primary
                prose-a:text-link prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: outcomeHtml }}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={back}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={restart}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Start over
              </button>
            </div>
          </div>
        ) : question ? (
          <div>
            <p
              className="font-heading text-lg font-bold text-[#0c1829]"
              id={`amd3-q-${question.id}`}
            >
              {question.text}
            </p>
            {question.help ? (
              <p className="mt-2 text-sm text-gray-600">{question.help}</p>
            ) : null}

            <div
              className="mt-4 space-y-2"
              role="group"
              aria-labelledby={`amd3-q-${question.id}`}
            >
              {question.answers.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => choose(a)}
                  className="block w-full rounded border border-gray-300 px-4 py-3 text-left text-sm
                    text-gray-800 transition hover:border-[#0c1829] hover:bg-gray-50
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                    focus-visible:outline-[#0c1829]"
                >
                  {a.label}
                </button>
              ))}
            </div>

            {history.length > 0 ? (
              <button
                type="button"
                onClick={back}
                className="mt-4 text-sm font-semibold text-gray-600 underline hover:text-[#0c1829]"
              >
                Back
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="border-t border-gray-200 px-6 py-4 text-xs leading-relaxed text-gray-500">
        <p>
          This walks through how the amendment is written. It is not legal or
          tax advice, and the residency rule is being challenged in court.
          Confirm your own situation with your county property appraiser.
        </p>
      </div>
    </div>
  );
}
