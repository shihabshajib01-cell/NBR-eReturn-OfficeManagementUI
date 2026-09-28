import type { TableRow } from "../../pages/modulePageUtils";
import type { CertificateRecord, CertificateEditRequest, CertificateDisposal, SystemUser, SpecialRegistration, TimeExtensionRequest, AuditSelection } from "../types/administration";

export function mapCertificateRecord(r: CertificateRecord): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle,
    request_no: r.requestNo, cert_type: r.certType, requested_by: r.requestedBy,
    request_date: r.requestDate, approval_status: r.approvalStatus,
  };
}

export function mapCertificateEditRequest(r: CertificateEditRequest): TableRow {
  return {
    id: r.id, request_no: r.requestNo, cert_type: r.certType, edit_field: r.editField,
    original_value: r.originalValue, requested_value: r.requestedValue, edit_status: r.editStatus,
  };
}

export function mapCertificateDisposal(r: CertificateDisposal): TableRow {
  return {
    id: r.id, request_no: r.requestNo, cert_type: r.certType, issued_to: r.issuedTo,
    disposal_date: r.disposalDate, disposal_method: r.disposalMethod, disposal_status: r.disposalStatus,
  };
}

export function mapSystemUser(r: SystemUser): TableRow {
  return {
    id: r.id, circle: r.circle, user_id: r.userId, designation: r.designation,
    user_name: r.userName, email: r.email, phone: r.phone,
    last_login: r.lastLogin, last_pass_change: r.lastPassChange,
    active_status: r.activeStatus, entry_today: r.entryToday, entry_upto: r.entryUpto,
  };
}

export function mapSpecialRegistration(r: SpecialRegistration): TableRow {
  return {
    id: r.id, reg_no: r.regNo, reg_type: r.regType,
    reg_date: r.regDate, zone: r.zone, active_status: r.activeStatus,
  };
}

export function mapTimeExtensionRequest(r: TimeExtensionRequest): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, request_no: r.requestNo,
    extension_type: r.extensionType, original_deadline: r.originalDeadline,
    requested_deadline: r.requestedDeadline, requested_by: r.requestedBy,
    approval_status: r.approvalStatus,
  };
}

export function mapAuditSelection(r: AuditSelection): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle,
    selection_no: r.selectionNo, selection_method: r.selectionMethod,
    ay_for_audit: r.ayForAudit, selected_date: r.selectedDate,
    audit_officer: r.auditOfficer, audit_status: r.auditStatus,
  };
}
