import type { QueryParams, PaginatedResponse } from "../types/api";
import type { LitigationCase, AppealRecord, TribunalRecord, DemandRecord, LedgerEntry, RefundRecord } from "../types/caseFinancial";
import { apiRequest } from "../api/client";
import { litRows, appealRows, tribunalRows, demandRows, ledgerRows, refundRows } from "../../pages/modulePageUtils";

function paginate<T>(items: T[], params?: QueryParams): PaginatedResponse<T> {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;
  return { success: true, data: items.slice((page - 1) * perPage, page * perPage), total: items.length, page, perPage };
}

export async function getLitigationCases(caseType: string, params?: QueryParams): Promise<PaginatedResponse<LitigationCase>> {
  // TODO: return apiRequest<PaginatedResponse<LitigationCase>>(`/litigation/${caseType}`, { params });
  void apiRequest;
  const typed: LitigationCase[] = litRows(caseType).map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), assessmentYear: String(r.ay),
    caseNo: String(r.case_no), caseType: String(r.case_type), caseDate: String(r.case_date),
    court: String(r.court), amount: String(r.amount),
    caseStatus: r.case_status as LitigationCase["caseStatus"],
  }));
  return paginate(typed, params);
}

export async function getAppeals(params?: QueryParams): Promise<PaginatedResponse<AppealRecord>> {
  // TODO: return apiRequest<PaginatedResponse<AppealRecord>>("/appeals", { params });
  const typed: AppealRecord[] = appealRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), assessmentYear: String(r.ay),
    appealNo: String(r.appeal_no), appealDate: String(r.appeal_date),
    hearingDate: String(r.hearing_date), appealGround: String(r.appeal_ground),
    amount: String(r.amount), appealStatus: r.appeal_status as AppealRecord["appealStatus"],
  }));
  return paginate(typed, params);
}

export async function getTribunalCases(params?: QueryParams): Promise<PaginatedResponse<TribunalRecord>> {
  // TODO: return apiRequest<PaginatedResponse<TribunalRecord>>("/tribunal", { params });
  const typed: TribunalRecord[] = tribunalRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), assessmentYear: String(r.ay),
    tribunalNo: String(r.tribunal_no), tribunalDate: String(r.tribunal_date),
    bench: String(r.bench), caseType: String(r.case_type), amount: String(r.amount),
    tribunalStatus: r.tribunal_status as TribunalRecord["tribunalStatus"],
  }));
  return paginate(typed, params);
}

export async function getDemandRegister(params?: QueryParams): Promise<PaginatedResponse<DemandRecord>> {
  // TODO: return apiRequest<PaginatedResponse<DemandRecord>>("/demand-payment/demands", { params });
  const typed: DemandRecord[] = demandRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), assessmentYear: String(r.ay),
    demandNo: String(r.demand_no), demandDate: String(r.demand_date),
    demandAmount: String(r.demand_amount), paidAmount: String(r.paid_amount),
    outstanding: String(r.outstanding), paymentStatus: r.payment_status as DemandRecord["paymentStatus"],
  }));
  return paginate(typed, params);
}

export async function getTaxpayerLedger(tin: string, params?: QueryParams): Promise<PaginatedResponse<LedgerEntry>> {
  // TODO: return apiRequest<PaginatedResponse<LedgerEntry>>(`/demand-payment/ledger/${tin}`, { params });
  const typed: LedgerEntry[] = ledgerRows.map(r => ({
    id: String(r.id), tin, taxpayerName: String(r.taxpayer_name ?? ""),
    transactionDate: String(r.transaction_date), particulars: String(r.particulars),
    debit: String(r.debit), credit: String(r.credit),
    balance: String(r.balance), reference: String(r.reference),
  }));
  return paginate(typed, params);
}

export async function getRefundAdjustments(params?: QueryParams): Promise<PaginatedResponse<RefundRecord>> {
  // TODO: return apiRequest<PaginatedResponse<RefundRecord>>("/demand-payment/refunds", { params });
  const typed: RefundRecord[] = refundRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), refundNo: String(r.refund_no), refundType: String(r.refund_type),
    refundAmount: String(r.refund_amount), requestDate: String(r.request_date),
    refundStatus: r.refund_status as RefundRecord["refundStatus"],
  }));
  return paginate(typed, params);
}
