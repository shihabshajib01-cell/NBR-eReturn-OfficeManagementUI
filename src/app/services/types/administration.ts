import type { ApprovalStatus, ActiveStatus } from "./api";

export interface CertificateRecord {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  requestNo: string;
  certType: string;
  requestedBy: string;
  requestDate: string;
  approvalStatus: ApprovalStatus | "Issued";
}

export interface CertificateEditRequest {
  id: string;
  requestNo: string;
  certType: string;
  editField: string;
  originalValue: string;
  requestedValue: string;
  editStatus: ApprovalStatus;
}

export interface CertificateDisposal {
  id: string;
  requestNo: string;
  certType: string;
  issuedTo: string;
  disposalDate: string;
  disposalMethod: "Handed Over" | "Postal" | "Digital";
  disposalStatus: "Disposed";
}

export interface SystemUser {
  id: string;
  circle: string;
  userId: string;
  designation: string;
  userName: string;
  email: string;
  phone: string;
  lastLogin: string;
  lastPassChange: string;
  activeStatus: ActiveStatus;
  entryToday: number;
  entryUpto: number;
}

export interface SpecialRegistration {
  id: string;
  regNo: string;
  regType: string;
  regDate: string;
  zone: string;
  activeStatus: ActiveStatus;
}

export interface TimeExtensionRequest {
  id: string;
  tin: string;
  taxpayerName: string;
  requestNo: string;
  extensionType: string;
  originalDeadline: string;
  requestedDeadline: string;
  requestedBy: string;
  approvalStatus: ApprovalStatus;
}

export interface AuditSelection {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  selectionNo: string;
  selectionMethod: string;
  ayForAudit: string;
  selectedDate: string;
  auditOfficer: string;
  auditStatus: "Selected" | "In Progress" | "Completed" | "Cancelled";
}
