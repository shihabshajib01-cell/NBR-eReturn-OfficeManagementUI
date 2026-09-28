import { describe, it, expect } from 'vitest';
import {
  getPhoneLengthRule,
  validatePhoneForCountry,
  formatAllowedLengths,
} from '../app/utils/phoneNumber';

// Minimal t() stub with template interpolation
function makeT() {
  const templates: Record<string, string> = {
    'validation.phoneNoCountry': 'Please select a country first.',
    'validation.required': 'This field is required.',
    'validation.phoneInvalidLength': 'Phone number has an invalid number of digits.',
    'validation.phoneExactError':
      'For {{country}}, enter exactly {{requiredDigits}} digits after {{dialCode}}. Entered: {{enteredDigits}}.',
  };
  return (key: string, opts?: Record<string, unknown>) => {
    let msg = templates[key] ?? key;
    if (opts) {
      for (const [k, v] of Object.entries(opts)) {
        msg = msg.replaceAll(`{{${k}}}`, String(v));
      }
    }
    return msg;
  };
}

function makeTBn() {
  return (key: string, opts?: Record<string, unknown>) => {
    const template = '{{country}}র জন্য {{dialCode}}-এর পরে ঠিক {{requiredDigits}}টি সংখ্যা লিখুন। লিখেছেন: {{enteredDigits}}টি।';
    if (key !== 'validation.phoneExactError') return key;
    let msg = template;
    if (opts) {
      for (const [k, v] of Object.entries(opts)) {
        msg = msg.replaceAll(`{{${k}}}`, String(v));
      }
    }
    return msg;
  };
}

// ── getPhoneLengthRule ────────────────────────────────────────────────────────

describe('getPhoneLengthRule', () => {
  it('Bangladesh: requiredDigits is 10', () => {
    const rule = getPhoneLengthRule('BD');
    expect(rule).not.toBeNull();
    expect(rule!.requiredDigits).toBe(10);
    expect(rule!.maxDigits).toBe(10);
  });

  it('result is cached (same reference on second call)', () => {
    const r1 = getPhoneLengthRule('BD');
    const r2 = getPhoneLengthRule('BD');
    expect(r1).toBe(r2);
  });

  it('US: requiredDigits is a positive number', () => {
    const rule = getPhoneLengthRule('US');
    expect(rule).not.toBeNull();
    expect(rule!.requiredDigits).toBeGreaterThan(0);
  });

  it('Andorra (AD): requiredDigits equals maxDigits', () => {
    const rule = getPhoneLengthRule('AD');
    expect(rule).not.toBeNull();
    expect(rule!.requiredDigits).toBe(rule!.maxDigits);
  });

  it('requiredDigits is always maxDigits', () => {
    for (const cc of ['BD', 'US', 'GB', 'DE', 'AU'] as const) {
      const rule = getPhoneLengthRule(cc);
      if (rule) expect(rule.requiredDigits).toBe(rule.maxDigits);
    }
  });
});

// ── formatAllowedLengths (kept for internal use) ──────────────────────────────

describe('formatAllowedLengths', () => {
  it('single length', () => {
    expect(formatAllowedLengths([10])).toBe('10');
  });

  it('two non-consecutive lengths', () => {
    expect(formatAllowedLengths([6, 9])).toBe('6 or 9');
  });

  it('consecutive range', () => {
    expect(formatAllowedLengths([6, 7, 8, 9, 10])).toBe('6–10');
  });

  it('empty array returns empty string', () => {
    expect(formatAllowedLengths([])).toBe('');
  });
});

// ── validatePhoneForCountry ───────────────────────────────────────────────────

describe('validatePhoneForCountry — Bangladesh', () => {
  const t = makeT();

  it('exactly 10 digits passes', () => {
    const result = validatePhoneForCountry('1712345678', 'BD', t, 'Bangladesh', '+880');
    expect(result.ok).toBe(true);
  });

  it('5 digits fails with exact error', () => {
    const result = validatePhoneForCountry('17123', 'BD', t, 'Bangladesh', '+880');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Bangladesh');
      expect(result.error).toContain('+880');
      expect(result.error).toContain('10');
      expect(result.error).toContain('5');
    }
  });

  it('6 digits still fails', () => {
    const result = validatePhoneForCountry('171234', 'BD', t, 'Bangladesh', '+880');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('6');
  });

  it('9 digits still fails', () => {
    const result = validatePhoneForCountry('171234567', 'BD', t, 'Bangladesh', '+880');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('9');
  });

  it('error clears only at exactly 10 digits', () => {
    for (let len = 1; len <= 9; len++) {
      const digits = '1' + '0'.repeat(len - 1);
      const result = validatePhoneForCountry(digits, 'BD', t, 'Bangladesh', '+880');
      expect(result.ok, `expected fail at ${len} digits`).toBe(false);
    }
    const result = validatePhoneForCountry('1712345678', 'BD', t, 'Bangladesh', '+880');
    expect(result.ok).toBe(true);
  });

  it('11 digits fails (over-length is blocked at input level)', () => {
    // validatePhoneForCountry still rejects if somehow 11 digits are passed
    const result = validatePhoneForCountry('17123456789', 'BD', t, 'Bangladesh', '+880');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('10');
      expect(result.error).toContain('11');
    }
  });

  it('Bangla digits normalize correctly — 10 Bangla digits passes', () => {
    const result = validatePhoneForCountry('১৭১২৩৪৫৬৭৮', 'BD', t, 'Bangladesh', '+880');
    expect(result.ok).toBe(true);
  });

  it('empty input returns required error', () => {
    const result = validatePhoneForCountry('', 'BD', t, 'Bangladesh', '+880');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('required');
  });

  it('no country code returns phoneNoCountry error', () => {
    const result = validatePhoneForCountry('1234567890', '', t);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('country');
  });
});

describe('validatePhoneForCountry — Andorra', () => {
  const t = makeT();

  it('uses requiredDigits (maxDigits) as the exact requirement', () => {
    const rule = getPhoneLengthRule('AD')!;
    const exact = '1' + '0'.repeat(rule.requiredDigits - 1);
    const result = validatePhoneForCountry(exact, 'AD', t, 'Andorra', '+376');
    expect(result.ok).toBe(true);
  });

  it('shorter than requiredDigits fails', () => {
    const rule = getPhoneLengthRule('AD')!;
    const short = '1' + '0'.repeat(rule.requiredDigits - 2);
    const result = validatePhoneForCountry(short, 'AD', t, 'Andorra', '+376');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Andorra');
      expect(result.error).toContain('+376');
      expect(result.error).toContain(String(rule.requiredDigits));
    }
  });
});

describe('validatePhoneForCountry — general', () => {
  const t = makeT();

  it('falls back to country code in error when no name provided', () => {
    const result = validatePhoneForCountry('1', 'GB', t);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('GB');
  });

  it('country name appears in error when provided', () => {
    const result = validatePhoneForCountry('1', 'GB', t, 'United Kingdom', '+44');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('United Kingdom');
  });

  it('EN interpolation: message includes requiredDigits and enteredDigits', () => {
    const rule = getPhoneLengthRule('BD')!;
    const result = validatePhoneForCountry('12345', 'BD', t, 'Bangladesh', '+880');
    if (!result.ok) {
      expect(result.error).toContain(String(rule.requiredDigits));
      expect(result.error).toContain('5');
    }
  });

  it('BN interpolation: message renders in Bengali template', () => {
    const tBn = makeTBn();
    const result = validatePhoneForCountry('12345', 'BD', tBn, 'বাংলাদেশ', '+৮৮০');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('বাংলাদেশ');
      expect(result.error).toContain('+৮৮০');
    }
  });

  it('country change: each country has its own requiredDigits', () => {
    expect(getPhoneLengthRule('BD')!.requiredDigits).toBe(10);
    const us = getPhoneLengthRule('US');
    expect(us).not.toBeNull();
    expect(us!.requiredDigits).toBeGreaterThan(0);
    const au = getPhoneLengthRule('AU');
    expect(au).not.toBeNull();
    expect(au!.requiredDigits).toBeGreaterThan(0);
    // Different countries can have different required lengths
    expect(getPhoneLengthRule('BD')!.requiredDigits).not.toBe(getPhoneLengthRule('DE')!.requiredDigits);
  });
});
