import type { QueryParams, PaginatedResponse } from "../types/api";
import type { ReturnRecord, OnlineReturn, OfflineReturn, ArchivedReturn } from "../types/returns";
import { apiRequest } from "../api/client";
import { returnApprRows, onlineRetRows, offlineRetRows, archiveRows } from "../../pages/modulePageUtils";

function paginate<T>(items: T[], params?: QueryParams): PaginatedResponse<T> {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;
  return { success: true, data: items.slice((page - 1) * perPage, page * perPage), total: items.length, page, perPage };
}

export async function getReturnApprovals(params?: QueryParams): Promise<PaginatedResponse<ReturnRecord>> {
  // TODO: return apiRequest<PaginatedResponse<ReturnRecord>>("/returns/approvals", { params });
  void apiRequest;
  const typed: ReturnRecord[] = returnApprRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), assessmentYear: String(r.ay),
    returnType: r.return_type as ReturnRecord["returnType"],
    requestBy: String(r.request_by), requestDate: String(r.request_date),
    approvalStatus: r.approval_status as ReturnRecord["approvalStatus"],
  }));
  return paginate(typed, params);
}

export async function getOnlineReturns(params?: QueryParams): Promise<PaginatedResponse<OnlineReturn>> {
  // TODO: return apiRequest<PaginatedResponse<OnlineReturn>>("/returns/online", { params });
  const typed: OnlineReturn[] = onlineRetRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), assessmentYear: String(r.ay),
    returnType: r.return_type as OnlineReturn["returnType"],
    submissionDate: String(r.submission_date), taxPaid: String(r.tax_paid),
    status: r.status as OnlineReturn["status"],
  }));
  return paginate(typed, params);
}

export async function getOfflineReturns(params?: QueryParams): Promise<PaginatedResponse<OfflineReturn>> {
  // TODO: return apiRequest<PaginatedResponse<OfflineReturn>>("/returns/offline", { params });
  const typed: OfflineReturn[] = offlineRetRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), assessmentYear: String(r.ay),
    challanNo: String(r.challan_no), bankName: String(r.bank_name),
    returnType: "Normal" as OfflineReturn["returnType"],
    submissionDate: String(r.submission_date), taxPaid: String(r.tax_paid),
    status: r.status as OfflineReturn["status"],
  }));
  return paginate(typed, params);
}

export async function getArchivedReturns(params?: QueryParams): Promise<PaginatedResponse<ArchivedReturn>> {
  // TODO: return apiRequest<PaginatedResponse<ArchivedReturn>>("/returns/archive", { params });
  const typed: ArchivedReturn[] = archiveRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), assessmentYear: String(r.ay),
    archiveDate: String(r.archive_date), returnType: r.return_type as ArchivedReturn["returnType"],
    archivedBy: String(r.archived_by), fileSize: String(r.file_size),
  }));
  return paginate(typed, params);
}
