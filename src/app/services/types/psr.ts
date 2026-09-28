import type { ApprovalStatus } from "./api";

export interface PsrRecord {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  assessmentYear: string;
  psrNo: string;
  submittedBy: string;
  submissionDate: string;
  taxAmount: string;
  approvalStatus: ApprovalStatus;
}

export interface PsrEditRequest {
  id: string;
  psrNo: string;
  editField: string;
  originalValue: string;
  newValue: string;
  requestedBy: string;
  requestDate: string;
  approvalStatus: ApprovalStatus;
}

export interface DoubleEntryStatus {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  assessmentYear: string;
  entryNo: string;
  entryType: "Online" | "Offline";
  firstEntryBy: string;
  secondEntryBy: string;
  entryDate: string;
  matchStatus: "Matched" | "Pending" | "Mismatched";
}

export interface DoubleEntryVerification {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  entryNo: string;
  amount: string;
  verifStatus: "Verified" | "Pending" | "Failed";
  verifDate: string;
}

export interface DormantRecord {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  lastReturn: string;
  yearsDormant: string;
  businessType: string;
  dormantStatus: "Dormant";
}
