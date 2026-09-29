import type { TableRow } from "../modulePageUtils";
import { ALL_TAXPAYER_ROWS } from "./auditData";

export interface AuditCandidateRecord extends TableRow {
  candidate_id: string;
  batch_id: string;
  taxpayer_name: string;
  tin: string;
  return_id: string;
  assessment_year: string;
  circle: string;
  coverage_tier: string;
  signals: string;
  risk_level: string;
  control_flags: string;
  candidate_status: string;
  audit_status: string;
  selection_track: string;
  selection_basis: string;
  data_quality: string;
  funnel_rule: string;
  population_considered: number;
  eligible_after_readiness: number;
  matched_criteria: number;
  after_preview: number;
  final_candidates: number;
  selected_on: string;
}

const CANDIDATE_KEY = "nbr-audit-candidates-v1";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function seedCandidates(): AuditCandidateRecord[] {
  return ALL_TAXPAYER_ROWS
    .filter((row) => String(row.audit_state ?? "") !== "Not Started")
    .slice(0, 6)
    .map((row, index) => ({
      candidate_id: `AC-2025-${String(index + 1).padStart(4, "0")}`,
      batch_id: "AUD-2025-BASELINE",
      taxpayer_name: String(row.taxpayer_name ?? "—"),
      tin: String(row.tin ?? "—"),
      return_id: String(row.return_id ?? "—"),
      assessment_year: String(row.assessment_year ?? "2025-26"),
      circle: String(row.circle ?? "—"),
      coverage_tier: String(row.coverage_tier ?? "—"),
      signals: String(row.signals ?? "—"),
      risk_level: String(row.risk_level ?? "Not determined"),
      control_flags: String(row.control_flags ?? "—"),
      candidate_status: "Selected",
      audit_status: String(row.audit_state ?? "Not Started"),
      selection_track: "Existing audit plan",
      selection_basis: String(row.reason_code ?? "Existing candidate record"),
      data_quality: String(row.data_quality ?? "—"),
      funnel_rule: "Existing audit plan",
      population_considered: 6,
      eligible_after_readiness: 6,
      matched_criteria: 6,
      after_preview: 6,
      final_candidates: 6,
      selected_on: "2026-09-01",
    }));
}

export function getAuditCandidates(): AuditCandidateRecord[] {
  if (!canUseStorage()) return seedCandidates();
  const raw = window.localStorage.getItem(CANDIDATE_KEY);
  if (!raw) {
    const seeded = seedCandidates();
    window.localStorage.setItem(CANDIDATE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw) as AuditCandidateRecord[];
    if (!Array.isArray(parsed)) return seedCandidates();
    return parsed.map((item) => ({
      ...item,
      data_quality: String(item.data_quality ?? "—"),
      funnel_rule: String(item.funnel_rule ?? item.selection_basis ?? "—"),
      population_considered: Number(item.population_considered ?? 0),
      eligible_after_readiness: Number(item.eligible_after_readiness ?? 0),
      matched_criteria: Number(item.matched_criteria ?? 0),
      after_preview: Number(item.after_preview ?? 0),
      final_candidates: Number(item.final_candidates ?? 0),
    }));
  } catch {
    return seedCandidates();
  }
}

export function addAuditCandidates(
  rows: TableRow[],
  meta: {
    assessmentYear: string;
    track: string;
    selectionBasis: string;
    funnelRule: string;
    populationConsidered: number;
    eligibleAfterReadiness: number;
    matchedCriteria: number;
    afterPreview: number;
    finalCandidates: number;
  },
): AuditCandidateRecord[] {
  const existing = getAuditCandidates();
  const selectedOn = new Date().toISOString().slice(0, 10);
  const batchToken = Date.now().toString();
  const batchId = `AUD-${meta.assessmentYear.replace(/[^0-9]/g, "")}-${batchToken.slice(-6)}`;

  const additions = rows.map((row, index): AuditCandidateRecord => ({
      candidate_id: `AC-${meta.assessmentYear.replace(/[^0-9]/g, "").slice(0, 4)}-${batchToken.slice(-6)}-${String(index + 1).padStart(3, "0")}`,
      batch_id: batchId,
      taxpayer_name: String(row.taxpayer_name ?? "—"),
      tin: String(row.tin ?? "—"),
      return_id: String(row.return_id ?? "—"),
      assessment_year: meta.assessmentYear,
      circle: String(row.circle ?? "—"),
      coverage_tier: String(row.coverage_tier ?? "—"),
      signals: String(row.signals ?? "—"),
      risk_level: String(row.risk_level ?? "Not determined"),
      control_flags: String(row.control_flags ?? "—"),
      candidate_status: "Selected",
      audit_status: "Not Started",
      selection_track: meta.track,
      selection_basis: meta.selectionBasis,
      data_quality: String(row.data_quality ?? "—"),
      funnel_rule: meta.funnelRule,
      population_considered: meta.populationConsidered,
      eligible_after_readiness: meta.eligibleAfterReadiness,
      matched_criteria: meta.matchedCriteria,
      after_preview: meta.afterPreview,
      final_candidates: meta.finalCandidates,
      selected_on: selectedOn,
    }));

  const next = [...additions, ...existing];
  if (canUseStorage()) window.localStorage.setItem(CANDIDATE_KEY, JSON.stringify(next));
  return next;
}
