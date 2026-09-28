import type { QueryParams, PaginatedResponse } from "../types/api";
import type { CertificateRecord, CertificateEditRequest, CertificateDisposal, SystemUser, SpecialRegistration, TimeExtensionRequest, AuditSelection } from "../types/administration";
import { apiRequest } from "../api/client";
import { certDataRows, certEditRows, certDisposalRows, specialRegRows, timeExtRows, auditRows } from "../../pages/modulePageUtils";
import { MOCK_DATA } from "../../data/mockData";

function paginate<T>(items: T[], params?: QueryParams): PaginatedResponse<T> {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;
  return { success: true, data: items.slice((page - 1) * perPage, page * perPage), total: items.length, page, perPage };
}

export async function getCertificateRequests(params?: QueryParams): Promise<PaginatedResponse<CertificateRecord>> {
  // TODO: return apiRequest<PaginatedResponse<CertificateRecord>>("/certificates/requests", { params });
  void apiRequest;
  const typed: CertificateRecord[] = certDataRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), requestNo: String(r.request_no), certType: String(r.cert_type),
    requestedBy: String(r.requested_by), requestDate: String(r.request_date),
    approvalStatus: r.approval_status as CertificateRecord["approvalStatus"],
  }));
  return paginate(typed, params);
}

export async function getCertificateEditRequests(params?: QueryParams): Promise<PaginatedResponse<CertificateEditRequest>> {
  // TODO: return apiRequest<PaginatedResponse<CertificateEditRequest>>("/certificates/edit-requests", { params });
  const typed: CertificateEditRequest[] = certEditRows.map(r => ({
    id: String(r.id), requestNo: String(r.request_no), certType: String(r.cert_type),
    editField: String(r.edit_field), originalValue: String(r.original_value),
    requestedValue: String(r.requested_value),
    editStatus: r.edit_status as CertificateEditRequest["editStatus"],
  }));
  return paginate(typed, params);
}

export async function getCertificateDisposals(params?: QueryParams): Promise<PaginatedResponse<CertificateDisposal>> {
  // TODO: return apiRequest<PaginatedResponse<CertificateDisposal>>("/certificates/disposals", { params });
  const typed: CertificateDisposal[] = certDisposalRows.map(r => ({
    id: String(r.id), requestNo: String(r.request_no), certType: String(r.cert_type),
    issuedTo: String(r.issued_to), disposalDate: String(r.disposal_date),
    disposalMethod: r.disposal_method as CertificateDisposal["disposalMethod"],
    disposalStatus: "Disposed" as const,
  }));
  return paginate(typed, params);
}

export async function getSystemUsers(params?: QueryParams): Promise<PaginatedResponse<SystemUser>> {
  // TODO: return apiRequest<PaginatedResponse<SystemUser>>("/admin/users", { params });
  const rows = MOCK_DATA["user-activity-report"] ?? [];
  const typed: SystemUser[] = rows.map(r => ({
    id: String(r.id), circle: String(r.circle), userId: String(r.user_id),
    designation: String(r.designation), userName: String(r.user_name),
    email: String(r.email), phone: String(r.phone),
    lastLogin: String(r.last_login), lastPassChange: String(r.last_pass_change),
    activeStatus: r.active_status as SystemUser["activeStatus"],
    entryToday: Number(r.entry_today), entryUpto: Number(r.entry_upto),
  }));
  return paginate(typed, params);
}

export async function getSpecialRegistrations(params?: QueryParams): Promise<PaginatedResponse<SpecialRegistration>> {
  // TODO: return apiRequest<PaginatedResponse<SpecialRegistration>>("/admin/special-registrations", { params });
  const typed: SpecialRegistration[] = specialRegRows.map(r => ({
    id: String(r.id), regNo: String(r.reg_no), regType: String(r.reg_type),
    regDate: String(r.reg_date), zone: String(r.zone),
    activeStatus: r.active_status as SpecialRegistration["activeStatus"],
  }));
  return paginate(typed, params);
}

export async function getTimeExtensions(params?: QueryParams): Promise<PaginatedResponse<TimeExtensionRequest>> {
  // TODO: return apiRequest<PaginatedResponse<TimeExtensionRequest>>("/admin/time-extensions", { params });
  const typed: TimeExtensionRequest[] = timeExtRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    requestNo: String(r.request_no), extensionType: String(r.extension_type),
    originalDeadline: String(r.original_deadline), requestedDeadline: String(r.requested_deadline),
    requestedBy: String(r.requested_by),
    approvalStatus: r.approval_status as TimeExtensionRequest["approvalStatus"],
  }));
  return paginate(typed, params);
}

export async function getAuditSelections(params?: QueryParams): Promise<PaginatedResponse<AuditSelection>> {
  // TODO: return apiRequest<PaginatedResponse<AuditSelection>>("/admin/audit-selections", { params });
  const typed: AuditSelection[] = auditRows.map(r => ({
    id: String(r.id), tin: String(r.tin), taxpayerName: String(r.taxpayer_name),
    circle: String(r.circle), selectionNo: String(r.selection_no),
    selectionMethod: String(r.selection_method), ayForAudit: String(r.ay_for_audit),
    selectedDate: String(r.selected_date), auditOfficer: String(r.audit_officer),
    auditStatus: r.audit_status as AuditSelection["auditStatus"],
  }));
  return paginate(typed, params);
}
