// =============================================================================
// Lead Validation — spam scoring for inbound form submissions
//
// WHY THIS EXISTS:
// Bots were filling out nowtb.com forms with junk like:
//   name: "Zljs Jjonafp"  email: "s.jg.e.nc.o@gmail.com"  phone: "3709308350"
// Those fake emails bounce, which wrecks our sending reputation.
//
// TWO LEVELS OF DEFENSE (this is the important idea):
//   1. REJECT  — definitely a bot. Throw the submission away entirely.
//   2. SUSPECT — probably junk, but we're not sure. Save the lead to Follow Up
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

/** Throwaway/disposable email domains — nobody buying a house uses these. */
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

  // --- Gmail dot-abuse ---
  // Gmail ignores dots, so "s.jg.e.nc.o@gmail.com" and "sjgenco@gmail.com" are
  // the SAME inbox. Bots scatter dots to generate thousands of unique-looking
  // addresses from one real account. A real person types at most one dot.
  // 3+ dots is our threshold — "first.middle.last@gmail.com" (2 dots) is safe.
  if (domain === "gmail.com" || domain === "googlemail.com") {
    const dotCount = (localPart.match(/\./g) || []).length;
    if (dotCount >= 3) {
      return { reject: `gmail dot-abuse (${dotCount} dots in address)` };
    }
  }

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
 * Only ever flags (never rejects) — real names are wildly diverse and
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
 * Main entry point — scores one form submission.
 *
 * @param data.name    submitted name (optional)
 * @param data.email   submitted email (optional — open-house walk-ins may omit)
 * @param data.phone   submitted phone (optional)
 * @param data.honeypot  hidden field value; ANY content means a bot filled it
 */
export function validateLead(data: {
  name?: string;
  email?: string;
  phone?: string;
  honeypot?: string;
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
  if (!data.email && !data.phone) {
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
  // Any ONE weak signal is forgivable (people typo). But a bad phone AND a
  // gibberish name together is the exact fingerprint of the bot spam we saw,
  // so two or more independent flags escalates to a hard reject.
  if (!reject && reasons.length >= 2) {
    reject = true;
    reasons.push("multiple independent spam signals");
  }

  return { reject, suspect, reasons };
}
