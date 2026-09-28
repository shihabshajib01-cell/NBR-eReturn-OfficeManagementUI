import type { QueryParams, PaginatedResponse, ApiResponse } from "../types/api";
import type {
  DashboardKpis, RecentSubmission, PsrKpis, RecentPsrEntry,
  PsrCircleSummary, OfflineReturnSummary, LitigationSummary, TaxCategorySummary,
} from "../types/dashboard";
import { apiRequest } from "../api/client";
import { CIRCLES_DATA, NAMES, AY_OPTS } from "../../pages/modulePageUtils";
import { MOCK_DATA } from "../../data/mockData";

// ── Dashboard KPIs ─────────────────────────────────────────────────────────

export async function getDashboardKpis(): Promise<ApiResponse<DashboardKpis>> {
  // TODO: return apiRequest<ApiResponse<DashboardKpis>>("/dashboard/kpis");
  void apiRequest; // reserved for real implementation
  return {
    success: true,
    data: {
      totalOnlineRegistrations: 107,
      currentOnlineRegistrations: 0,
      totalOnlineSubmissions: 0,
      taxPaidEReturn: 0,
      totalTdsAdvanceTax: 0,
      totalAmendmentReturns: 0,
      taxPaidWithReturn: 0,
      totalClaimedIbasChallan: 0,
      advanceTaxCarChallan: 0,
      tdsSavingCertificate: 0,
      tdsBankInterest: 0,
      otherTdsAitClaims: 0,
    },
  };
}

// ── Recent Submissions ─────────────────────────────────────────────────────

export async function getRecentSubmissions(params?: QueryParams): Promise<PaginatedResponse<RecentSubmission>> {
  // TODO: return apiRequest<PaginatedResponse<RecentSubmission>>("/dashboard/submissions/recent", { params });
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 6;
  const mock: RecentSubmission[] = Array.from({ length: 6 }, (_, i) => ({
    id: String(i + 1),
    tin: `TIN-${String(10000 + i).padStart(5, "0")}`,
    taxpayerName: NAMES[i % 10],
    circle: CIRCLES_DATA[i % 8],
    returnType: (["Normal", "82BB", "82C(2)"] as const)[i % 3],
    submittedAt: `2026-05-${String(28 - i).padStart(2, "0")}`,
    submissionStatus: (["Approved", "Pending", "Verified"] as const)[i % 3],
    assessmentYear: AY_OPTS[(i % 4) + 1],
  }));
  return { success: true, data: mock.slice((page - 1) * perPage, page * perPage), total: mock.length, page, perPage };
}

// ── PSR Dashboard ──────────────────────────────────────────────────────────

export async function getPsrKpis(): Promise<ApiResponse<PsrKpis>> {
  // TODO: return apiRequest<ApiResponse<PsrKpis>>("/dashboard/psr/kpis");
  return { success: true, data: { totalPsrEntries: 8421, pendingApproval: 312, approvedToday: 87, rejectedToday: 14 } };
}

export async function getPsrCircleSummary(params?: QueryParams): Promise<PaginatedResponse<PsrCircleSummary>> {
  // TODO: return apiRequest<PaginatedResponse<PsrCircleSummary>>("/dashboard/psr/circle-summary", { params });
  const mock: PsrCircleSummary[] = CIRCLES_DATA.map((circle, i) => ({
    circle, total: 300 + i * 80, pending: 10 + i * 5,
    approved: 280 + i * 70, rejected: 10 + i * 3, taxTotal: `৳${20 + i * 8}L`,
  }));
  return { success: true, data: mock, total: mock.length, page: 1, perPage: mock.length };
}

export async function getRecentPsrEntries(params?: QueryParams): Promise<PaginatedResponse<RecentPsrEntry>> {
  // TODO: return apiRequest<PaginatedResponse<RecentPsrEntry>>("/dashboard/psr/recent", { params });
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 6;
  const mock: RecentPsrEntry[] = Array.from({ length: 6 }, (_, i) => ({
    id: String(i + 1),
    psrNo: `PSR-${7000 + i}`,
    submittedBy: NAMES[i % 10],
    taxAmount: `৳${(i * 40 + 50) * 1000}`,
    approvalStatus: (["Approved", "Pending", "Rejected"] as const)[i % 3],
  }));
  return { success: true, data: mock.slice((page - 1) * perPage, page * perPage), total: mock.length, page, perPage };
}

// ── Combined Dashboard ─────────────────────────────────────────────────────

export async function getOfflineReturnSummary(): Promise<PaginatedResponse<OfflineReturnSummary>> {
  // TODO: return apiRequest<PaginatedResponse<OfflineReturnSummary>>("/dashboard/returns/offline-summary");
  const rows = (MOCK_DATA["offline-return-report"] ?? []).slice(0, 5);
  const mock: OfflineReturnSummary[] = rows.map(r => ({
    id: Number(r.id), circle: String(r.circle),
    today82bb: Number(r.t_82bb), today82c2: Number(r.t_82c2),
    today212: Number(r.t_212), todayNormal: Number(r.t_normal), todayTotal: Number(r.t_total),
  }));
  return { success: true, data: mock, total: mock.length, page: 1, perPage: mock.length };
}

export async function getLitigationSummary(): Promise<PaginatedResponse<LitigationSummary>> {
  // TODO: return apiRequest<PaginatedResponse<LitigationSummary>>("/dashboard/litigation/summary");
  const rows = (MOCK_DATA["litigation-arrear"] ?? []).slice(0, 5);
  const mock: LitigationSummary[] = rows.map(r => ({
    id: Number(r.id), circle: String(r.circle),
    pending: Number(r.t_pending), approved: Number(r.t_approved),
    rejected: Number(r.t_rejected), total: Number(r.t_total), revenue: String(r.t_revenue),
  }));
  return { success: true, data: mock, total: mock.length, page: 1, perPage: mock.length };
}

export async function getTaxCategorySummary(): Promise<PaginatedResponse<TaxCategorySummary>> {
  // TODO: return apiRequest<PaginatedResponse<TaxCategorySummary>>("/dashboard/tax-categories");
  const rows = (MOCK_DATA["tax-category-report"] ?? []).slice(0, 5);
  const mock: TaxCategorySummary[] = rows.map(r => ({
    id: Number(r.id), category: String(r.category),
    online: Number(r.online), offline: Number(r.offline), total: Number(r.total),
  }));
  return { success: true, data: mock, total: mock.length, page: 1, perPage: mock.length };
}
