/**
 * ============================================================================
 * Email Validation & Disposable Domain Blocker
 * ============================================================================
 *
 * Ensures only genuine, verified email addresses can register for AlgoHub Beta.
 * Rejects fake/temporary domains and catches common domain typos.
 */

const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.com",
  "temp-mail.org",
  "tempmail.net",
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "sharklasers.com",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "dispostable.com",
  "trashmail.com",
  "trashmail.net",
  "getairmail.com",
  "throwawaymail.com",
  "fakeinbox.com",
  "crazymailing.com",
  "mohmal.com",
  "generator.email",
  "maildrop.cc",
  "inboxkitten.com",
  "burnermail.io",
  "tempinbox.com",
]);

const DOMAIN_TYPO_MAP: Record<string, string> = {
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gemail.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmal.com": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yaho.co": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
};

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
}

export function validateGenuineEmail(email: string): EmailValidationResult {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    return { isValid: false, error: "Email address is required." };
  }

  // 1. Basic RFC Format Regex Check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, error: "Please enter a valid email format (e.g. name@gmail.com)." };
  }

  const parts = cleanEmail.split("@");
  if (parts.length !== 2) {
    return { isValid: false, error: "Invalid email address structure." };
  }

  const [, domain] = parts;

  // 2. Reject Disposable / Temporary Email Services
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: "Temporary/disposable email addresses are not permitted. Please use your personal or university email.",
    };
  }

  // 3. Detect and Suggest Common Domain Typos
  if (DOMAIN_TYPO_MAP[domain]) {
    const suggestedDomain = DOMAIN_TYPO_MAP[domain];
    return {
      isValid: false,
      error: `Did you mean @${suggestedDomain}? Please double-check your email domain spelling.`,
      suggestion: `${parts[0]}@${suggestedDomain}`,
    };
  }

  return { isValid: true };
}
