import { useTranslation } from "react-i18next";

interface StatusBadgeProps {
  value: string;
}

const SUCCESS_STATUSES = new Set([
  "approved", "active", "verified", "paid", "resolved", "transferred",
  "disposed", "matched", "decided", "issued", "completed", "disbursed",
]);
const ERROR_STATUSES = new Set([
  "rejected", "inactive", "invalid", "unpaid", "failed", "cancelled",
  "mismatched", "suspended",
]);
const WARNING_STATUSES = new Set([
  "pending", "pending review", "dormant", "partially paid", "in progress", "selected",
  "adjourned", "under review", "misfiled", "out of jurisdiction",
]);
const SECONDARY_STATUSES = new Set(["waived"]);

const STATUS_KEYS: Record<string, string> = {
  "active": "active", "inactive": "inactive", "pending": "pending",
  "approved": "approved", "rejected": "rejected", "verified": "verified",
  "unverified": "unverified", "draft": "draft", "submitted": "submitted",
  "completed": "completed", "in progress": "inProgress", "cancelled": "cancelled",
  "paid": "paid", "unpaid": "unpaid", "partially paid": "partiallyPaid",
  "resolved": "resolved", "transferred": "transferred", "disposed": "disposed",
  "matched": "matched", "decided": "decided", "issued": "issued",
  "disbursed": "disbursed", "invalid": "invalid", "failed": "failed",
  "mismatched": "mismatched", "suspended": "suspended", "dormant": "dormant",
  "selected": "selected", "adjourned": "adjourned", "under review": "underReview",
  "misfiled": "misfiled", "out of jurisdiction": "outOfJurisdiction", "waived": "waived",
  "pending review": "pendingReview",
};

function getVariant(v: string): string {
  if (SUCCESS_STATUSES.has(v)) return "badge badge-success";
  if (ERROR_STATUSES.has(v)) return "badge badge-error";
  if (WARNING_STATUSES.has(v)) return "badge badge-warning";
  if (SECONDARY_STATUSES.has(v)) return "badge badge-secondary";
  return "badge badge-neutral";
}

export function StatusBadge({ value }: StatusBadgeProps) {
  const { t: translate } = useTranslation("status");
  const v = (value ?? "").toLowerCase();
  const className = getVariant(v);
  const label = STATUS_KEYS[v] ? translate(STATUS_KEYS[v]) : value;

  return <span className={className}>{label}</span>;
}
