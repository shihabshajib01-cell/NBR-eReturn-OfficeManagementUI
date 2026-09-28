import {
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js/max";

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

export function normalizePhoneDigits(value: string): string {
  return value
    .split("")
    .map(ch => {
      const idx = BANGLA_DIGITS.indexOf(ch);
      return idx >= 0 ? String(idx) : ch;
    })
    .join("")
    .replace(/[^\d]/g, "");
}

export function toE164Phone(phoneNational: string, countryCode: CountryCode): string {
  const digits = normalizePhoneDigits(phoneNational);
  try {
    const parsed = parsePhoneNumberFromString(digits, countryCode);
    if (parsed && parsed.isValid()) return parsed.format("E.164");
  } catch { /* fall through */ }
  try {
    const calling = getCountryCallingCode(countryCode);
    return `+${calling}${digits}`;
  } catch {
    return digits;
  }
}

export function nationalFromE164(e164: string, countryCode: CountryCode): string {
  if (!e164) return "";
  try {
    const parsed = parsePhoneNumberFromString(e164, countryCode);
    if (parsed) return parsed.nationalNumber;
  } catch { /* fall through */ }
  try {
    const calling = "+" + getCountryCallingCode(countryCode);
    if (e164.startsWith(calling)) return e164.slice(calling.length);
  } catch { /* fall through */ }
  return e164;
}

// ── Length rule cache ─────────────────────────────────────────────────────────

export interface PhoneLengthRule {
  allowedLengths: number[];
  minDigits: number;
  maxDigits: number;
  requiredDigits: number;
}

const phoneLengthCache = new Map<string, PhoneLengthRule | null>();

export function getPhoneLengthRule(countryCode: CountryCode): PhoneLengthRule | null {
  if (phoneLengthCache.has(countryCode)) return phoneLengthCache.get(countryCode)!;

  const allowed: number[] = [];
  for (let len = 1; len <= 20; len++) {
    // Probe with "1" prefix to avoid trunk-code ambiguity (trunk codes are typically "0")
    const probe = len === 1 ? "1" : "1" + "0".repeat(len - 1);
    const result = validatePhoneNumberLength(probe, countryCode);
    if (result === undefined) allowed.push(len);
  }

  const max = allowed.length > 0 ? Math.max(...allowed) : 0;
  const rule: PhoneLengthRule | null = allowed.length > 0
    ? {
        allowedLengths: allowed,
        minDigits: Math.min(...allowed),
        maxDigits: max,
        requiredDigits: max,
      }
    : null;

  phoneLengthCache.set(countryCode, rule);
  return rule;
}

// ── Format allowed lengths ────────────────────────────────────────────────────

export function formatAllowedLengths(lengths: number[]): string {
  if (lengths.length === 0) return "";
  if (lengths.length === 1) return `${lengths[0]}`;

  // Group into consecutive ranges
  const ranges: Array<[number, number]> = [];
  let start = lengths[0];
  let end = lengths[0];
  for (let i = 1; i < lengths.length; i++) {
    if (lengths[i] === end + 1) {
      end = lengths[i];
    } else {
      ranges.push([start, end]);
      start = lengths[i];
      end = lengths[i];
    }
  }
  ranges.push([start, end]);

  const parts = ranges.map(([s, e]) => s === e ? `${s}` : `${s}–${e}`);

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} or ${parts[1]}`;
  return parts.slice(0, -1).join(", ") + ", or " + parts[parts.length - 1];
}

// ── Validation ────────────────────────────────────────────────────────────────

export type PhoneValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validatePhoneForCountry(
  phoneNational: string,
  countryCode: CountryCode | "",
  t: (key: string, opts?: Record<string, unknown>) => string,
  countryName?: string,
  dialCode?: string,
): PhoneValidationResult {
  if (!countryCode) {
    return { ok: false, error: t("validation.phoneNoCountry") };
  }
  const digits = normalizePhoneDigits(phoneNational);
  if (!digits) {
    return { ok: false, error: t("validation.required") };
  }

  const rule = getPhoneLengthRule(countryCode);
  if (rule) {
    if (digits.length !== rule.requiredDigits) {
      const resolvedDial = dialCode ?? `+${getCountryCallingCode(countryCode)}`;
      return {
        ok: false,
        error: t("validation.phoneExactError", {
          country: countryName ?? countryCode,
          requiredDigits: rule.requiredDigits,
          dialCode: resolvedDial,
          enteredDigits: digits.length,
        }),
      };
    }
    return { ok: true };
  }

  // Fallback: use library length check when no rule available
  const lengthResult = validatePhoneNumberLength(digits, countryCode);
  if (lengthResult === "TOO_SHORT" || lengthResult === "TOO_LONG" || lengthResult === "INVALID_LENGTH") {
    return { ok: false, error: t("validation.phoneInvalidLength") };
  }

  return { ok: true };
}

export function parsePastedPhone(
  pasted: string,
  selectedCountry: CountryCode
): { nationalNumber: string; countryMatch: boolean } {
  try {
    const parsed = parsePhoneNumberFromString(pasted);
    if (parsed && parsed.country) {
      const countryMatch = parsed.country === selectedCountry;
      return { nationalNumber: parsed.nationalNumber, countryMatch };
    }
  } catch { /* fall through */ }
  return { nationalNumber: normalizePhoneDigits(pasted), countryMatch: true };
}
