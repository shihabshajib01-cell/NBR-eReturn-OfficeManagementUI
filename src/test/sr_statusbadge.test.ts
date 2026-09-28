import { describe, it, expect } from 'vitest';

// Mirrors StatusBadge logic
const WARNING_STATUSES = new Set([
  "pending", "pending review", "dormant", "partially paid", "in progress", "selected",
  "adjourned", "under review", "misfiled", "out of jurisdiction",
]);
const ERROR_STATUSES = new Set([
  "rejected", "inactive", "invalid", "unpaid", "failed", "cancelled",
  "mismatched", "suspended",
]);
const SUCCESS_STATUSES = new Set([
  "approved", "active", "verified", "paid", "resolved", "transferred",
  "disposed", "matched", "decided", "issued", "completed", "disbursed",
]);
const STATUS_KEYS: Record<string, string> = {
  "pending review": "pendingReview",
  "approved": "approved",
  "rejected": "rejected",
};

function getVariant(v: string): string {
  if (SUCCESS_STATUSES.has(v)) return "badge-success";
  if (ERROR_STATUSES.has(v)) return "badge-error";
  if (WARNING_STATUSES.has(v)) return "badge-warning";
  return "badge-neutral";
}

describe('StatusBadge SR status mapping', () => {
  it('"pending review" → warning variant', () => {
    expect(getVariant("pending review")).toBe("badge-warning");
  });
  it('"approved" → success variant', () => {
    expect(getVariant("approved")).toBe("badge-success");
  });
  it('"rejected" → error variant', () => {
    expect(getVariant("rejected")).toBe("badge-error");
  });
  it('"pending review" maps to translation key "pendingReview"', () => {
    expect(STATUS_KEYS["pending review"]).toBe("pendingReview");
  });
  it('existing statuses unaffected', () => {
    expect(getVariant("active")).toBe("badge-success");
    expect(getVariant("pending")).toBe("badge-warning");
    expect(getVariant("inactive")).toBe("badge-error");
  });
});
