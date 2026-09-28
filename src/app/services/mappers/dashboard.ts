import type { TableRow } from "../../pages/modulePageUtils";
import type { RecentSubmission, PsrCircleSummary, RecentPsrEntry, OfflineReturnSummary, LitigationSummary, TaxCategorySummary } from "../types/dashboard";

export function mapRecentSubmission(r: RecentSubmission): TableRow {
  return {
    id: r.id,
    tin: r.tin,
    taxpayer_name: r.taxpayerName,
    circle: r.circle,
    return_type: r.returnType,
    submitted_at: r.submittedAt,
    submission_status: r.submissionStatus,
    ay: r.assessmentYear,
  };
}

export function mapPsrCircleSummary(r: PsrCircleSummary): TableRow {
  return {
    circle: r.circle,
    total: r.total,
    pending: r.pending,
    approved: r.approved,
    rejected: r.rejected,
    tax: r.taxTotal,
  };
}

export function mapRecentPsrEntry(r: RecentPsrEntry): TableRow {
  return {
    id: r.id,
    psr_no: r.psrNo,
    submitted_by: r.submittedBy,
    tax_amount: r.taxAmount,
    approval_status: r.approvalStatus,
  };
}

export function mapOfflineReturnSummary(r: OfflineReturnSummary): TableRow {
  return {
    id: r.id,
    circle: r.circle,
    t_82bb: r.today82bb,
    t_82c2: r.today82c2,
    t_212: r.today212,
    t_normal: r.todayNormal,
    t_total: r.todayTotal,
  };
}

export function mapLitigationSummary(r: LitigationSummary): TableRow {
  return {
    id: r.id,
    circle: r.circle,
    t_pending: r.pending,
    t_approved: r.approved,
    t_rejected: r.rejected,
    t_total: r.total,
    t_revenue: r.revenue,
  };
}

export function mapTaxCategorySummary(r: TaxCategorySummary): TableRow {
  return {
    id: r.id,
    category: r.category,
    online_fmt: r.online.toLocaleString(),
    offline_fmt: r.offline.toLocaleString(),
    total_fmt: r.total.toLocaleString(),
  };
}
