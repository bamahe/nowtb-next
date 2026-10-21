// =============================================================================
// Lead Validation, spam scoring for inbound form submissions
//
// WHY THIS EXISTS:
// Bots were filling out nowtb.com forms with junk like:
//   name: "Zljs Jjonafp"  email: "s.jg.e.nc.o@gmail.com"  phone: "3709308350"
// Those fake emails bounce, which wrecks our sending reputation.
//
// TWO LEVELS OF DEFENSE (this is the important idea):
// 1. REJECT, definitely a bot. Throw the submission away entirely.
// 2. SUSPECT, probably junk, but we're not sure. Save the lead to Follow Up
//                Boss so Barrett can judge it, but DON'T send the auto-responder
//                email. That protects our email reputation without losing a
//                real lead to an over-eager filter.
//
// Losing a real lead is worse than receiving a spam one, so every rule here is
// deliberately conservative.
// =============================================================================

/** The verdict for one form submission. */
export interface LeadVerdict {
  /** true = definitely a bot, discard the submission */
  reject: boolean;
  /** true = looks like junk; save the lead but skip the auto-responder email */
  suspect: boolean;
  /** Human-readable reasons, for logging so we can tune these rules later */
  reasons: string[];
}

/** Throwaway/disposable email domains, nobody buying a house uses these. */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "temp-mail.org", "throwawaymail.com", "yopmail.com", "trashmail.com",
  "sharklasers.com", "getnada.com", "dispostable.com", "maildrop.cc",
  "fakeinbox.com", "spam4.me", "grr.la", "mailnesia.com", "mintemail.com",
]);

/**
 * Checks one email address.
 * Returns null if it looks fine, or a string reason if it doesn't.
 */
function checkEmail(email: string): { reject?: string; suspect?: string } {
  const clean = email.trim().toLowerCase();

  // --- Basic shape: something@something.tld ---
  // Not a full RFC validator on purpose; we only want to catch obvious garbage.
  const shape = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/;
  if (!shape.test(clean)) return { reject: "email is not a valid address" };

  const [localPart, domain] = clean.split("@");

  // --- Disposable/throwaway domain ---
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { reject: `disposable email domain (${domain})` };
  }

  // --- Gmail dot-abuse rule: REMOVED on purpose ---
  // This used to hard-reject any gmail address with 3+ dots in the local part,
  // on the theory that bots scatter dots to fake unique addresses.
  //
  // It was removed because it costs more than it saves:
  //   1. It rejects real people. "barrett.a.b.henry@gmail.com" is a perfectly
  //      normal address, and so is any first.middle.last.suffix pattern.
  //   2. The thing this whole file exists to prevent is BOUNCES wrecking our
  // sending reputation. A dotted gmail address does not bounce, Gmail
  //      ignores dots, so it delivers to the same real inbox either way. So
  //      the rule was blocking leads without protecting anything.
  //
  // The honeypot, the rate limit, and the signals below still catch the bots.
  // If dot-spam ever becomes a real problem again, flag it as `suspect` (lead
  // reaches Follow Up Boss, no auto-responder sent), never `reject`.

  // --- Random-string local part ---
  // Flag (don't reject) local parts with a long run of consonants, which is
  // typical of machine-generated text and rare in real names/words.
  const letters = localPart.replace(/[^a-z]/g, "");
  if (letters.length >= 6 && /[bcdfghjklmnpqrstvwxz]{6,}/.test(letters)) {
    return { suspect: "email local part looks machine-generated" };
  }

  return {};
}

/**
 * Checks a US phone number.
 * We only flag (never reject) on phone, because real people typo their number
 * and an open-house walk-in may hand over a partial one.
 */
function checkPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");

  // Strip a leading country code "1" so 11-digit US numbers validate.
  const national = digits.length === 11 && digits.startsWith("1")
    ? digits.slice(1)
    : digits;

  if (national.length !== 10) return "phone is not 10 digits";

  const areaCode = national.slice(0, 3);
  const exchange = national.slice(3, 6);

  // North American Numbering Plan rules:
  //  - area code and exchange must both start with 2-9 (never 0 or 1)
  //  - N11 codes (211, 311, 411 ... 911) are service codes, never assigned
  //  - 555 exchange is reserved for fiction/directory assistance
  if (areaCode[0] === "0" || areaCode[0] === "1") return "invalid area code";
  if (/^\d11$/.test(areaCode)) return "area code is a reserved service code";
  if (exchange[0] === "0" || exchange[0] === "1") return "invalid exchange code";
  if (exchange === "555") return "555 is a reserved fake exchange";

  // All-same-digit numbers like 5555555555 or 1231231234
  if (/^(\d)\1{9}$/.test(national)) return "phone is a repeated digit";

  return null;
}

/**
 * Checks a name for machine-generated gibberish.
 * Only ever flags (never rejects), real names are wildly diverse and
 * rejecting on a name would eventually cost us a genuine client.
 */
function checkName(name: string): string | null {
  const clean = name.trim().toLowerCase();
  if (!clean) return null;

  // Look at each word of 4+ letters. A word with NO vowels at all
  // (like "Zljs") is essentially never a real name.
  const words = clean.split(/\s+/).filter((w) => /^[a-z]{4,}$/.test(w));
  for (const word of words) {
    if (!/[aeiouy]/.test(word)) return `name contains no vowels ("${word}")`;
  }

  return null;
}

/**
 * Main entry point, scores one form submission.
 *
 * @param data.name    submitted name (optional)
 * @param data.email submitted email (optional, open-house walk-ins may omit)
 * @param data.phone   submitted phone (optional)
 * @param data.honeypot  hidden field value; ANY content means a bot filled it
 * @param data.allowNoContact  skip the "must have email or phone" rejection.
 *   Set ONLY for open house kiosks: the sign-in sheet requires just a name and
 *   the exit feedback form requires nothing at all, so the default rule threw
 *   away every name-only walk-in and every piece of anonymous seller feedback.
 */
export function validateLead(data: {
  name?: string;
  email?: string;
  phone?: string;
  honeypot?: string;
  allowNoContact?: boolean;
}): LeadVerdict {
  const reasons: string[] = [];
  let reject = false;
  let suspect = false;

  // --- Honeypot: the single most reliable bot signal ---
  // The field is hidden from humans via CSS, so a real user can never fill it.
  // Automated scripts fill every input they find and give themselves away.
  if (data.honeypot && data.honeypot.trim() !== "") {
    return { reject: true, suspect: true, reasons: ["honeypot field was filled"] };
  }

  // --- Must have at least one way to contact them ---
  // Open house kiosks opt out: a walk-in who gives only a name is still a real
  // person Barrett just shook hands with, and anonymous exit feedback is worth
  // capturing for the seller report even with no way to reply.
  if (!data.email && !data.phone && !data.allowNoContact) {
    return { reject: true, suspect: true, reasons: ["no email or phone provided"] };
  }

  if (data.email) {
    const result = checkEmail(data.email);
    if (result.reject) {
      reject = true;
      reasons.push(result.reject);
    }
    if (result.suspect) {
      suspect = true;
      reasons.push(result.suspect);
    }
  }

  if (data.phone) {
    const phoneIssue = checkPhone(data.phone);
    if (phoneIssue) {
      suspect = true;
      reasons.push(phoneIssue);
    }
  }

  if (data.name) {
    const nameIssue = checkName(data.name);
    if (nameIssue) {
      suspect = true;
      reasons.push(nameIssue);
    }
  }

  // --- Combination rule ---
  // THRESHOLD TRADEOFF, read this before changing the number.
  //
  // This used to hard-reject at TWO soft flags. Two weak signals is not proof:
  // a seller who mistypes their phone number AND has an unusual short name
  // (think "Ngoc Tran", the no-vowel word check flags words like that) hit the
  // limit and had their lead thrown away while the website told them "Message
  // Sent!". That is the worst possible outcome on the site.
  //
  // Now it takes THREE independent flags, which means a bad phone AND a
  // gibberish name AND a machine-looking email address, all at once, in one
  // submission. That is a bot, not a person having a bad typing day.
  //
  // What happens at one or two flags instead: `suspect` stays true (any single
  // flag sets it). The lead still lands in Follow Up Boss so Barrett can call
  // it, but we do NOT send the auto-responder email, which is the actual
  // protection we needed, since bounces are what damage our sending
  // reputation. We keep the lead and skip the risky email.
  //
  // Hard rejects that are NOT subject to this threshold and still fire on their
  // own: the honeypot being filled, no email and no phone at all, a malformed
  // email, and disposable-domain addresses. Those are certainties, not guesses.
  if (!reject && reasons.length >= 3) {
    reject = true;
    reasons.push("three or more independent spam signals");
  }

  return { reject, suspect, reasons };
}
