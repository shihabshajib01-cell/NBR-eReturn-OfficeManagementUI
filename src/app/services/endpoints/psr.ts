import type { QueryParams, PaginatedResponse } from "../types/api";
import type { PsrRecord, PsrEditRequest, DoubleEntryStatus, DoubleEntryVerification, DormantRecord } from "../types/psr";
import { apiRequest } from "../api/client";
import { psrRows, psrEditRows, deStatusRows, deVerifRows, dormantRows } from "../../pages/modulePageUtils";

function paginate<T>(items: T[], params?: QueryParams): PaginatedResponse<T> {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;
  return { success: true, data: items.slice((page - 1) * perPage, page * perPage), total: items.length, page, perPage };
}

export async function getPsrApprovals(params?: QueryParams): Promise<PaginatedResponse<PsrRecord>> {
  // TODO: return apiRequest<PaginatedResponse<PsrRecord>>("/psr/approvals", { params });
  void apiRequest;
  const typed: PsrRecord[] = psrRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), assessmentYear: String(r.ay),
    psrNo: String(r.psr_no), submittedBy: String(r.submitted_by),
    submissionDate: String(r.submission_date), taxAmount: String(r.tax_amount),
    approvalStatus: r.approval_status as PsrRecord["approvalStatus"],
  }));
  return paginate(typed, params);
}

export async function getPsrEditRequests(params?: QueryParams): Promise<PaginatedResponse<PsrEditRequest>> {
  // TODO: return apiRequest<PaginatedResponse<PsrEditRequest>>("/psr/edit-requests", { params });
  const typed: PsrEditRequest[] = psrEditRows.map(r => ({
    id: String(r.id), psrNo: String(r.psr_no), editField: String(r.edit_field),
    originalValue: String(r.original_value), newValue: String(r.new_value),
    requestedBy: String(r.requested_by), requestDate: String(r.request_date),
    approvalStatus: r.approval_status as PsrEditRequest["approvalStatus"],
  }));
  return paginate(typed, params);
}

export async function getDoubleEntryStatus(params?: QueryParams): Promise<PaginatedResponse<DoubleEntryStatus>> {
  // TODO: return apiRequest<PaginatedResponse<DoubleEntryStatus>>("/psr/double-entry/status", { params });
  const typed: DoubleEntryStatus[] = deStatusRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), assessmentYear: String(r.ay),
    entryNo: String(r.entry_no), entryType: r.entry_type as DoubleEntryStatus["entryType"],
    firstEntryBy: String(r.first_entry_by), secondEntryBy: String(r.second_entry_by),
    entryDate: String(r.entry_date), matchStatus: r.match_status as DoubleEntryStatus["matchStatus"],
  }));
  return paginate(typed, params);
}

export async function getDoubleEntryVerifications(params?: QueryParams): Promise<PaginatedResponse<DoubleEntryVerification>> {
  // TODO: return apiRequest<PaginatedResponse<DoubleEntryVerification>>("/psr/double-entry/verification", { params });
  const typed: DoubleEntryVerification[] = deVerifRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), entryNo: String(r.entry_no), amount: String(r.amount),
    verifStatus: r.verif_status as DoubleEntryVerification["verifStatus"],
    verifDate: String(r.verif_date),
  }));
  return paginate(typed, params);
}

export async function getDormantTaxpayers(params?: QueryParams): Promise<PaginatedResponse<DormantRecord>> {
  // TODO: return apiRequest<PaginatedResponse<DormantRecord>>("/psr/dormant", { params });
  const typed: DormantRecord[] = dormantRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), lastReturn: String(r.last_return),
    yearsDormant: String(r.years_dormant), businessType: String(r.business_type),
    dormantStatus: "Dormant" as const,
  }));
  return paginate(typed, params);
}
