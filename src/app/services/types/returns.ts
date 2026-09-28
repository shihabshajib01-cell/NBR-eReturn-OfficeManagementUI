import type { ApprovalStatus, ReturnType } from "./api";

export interface ReturnRecord {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  assessmentYear: string;
  returnType: ReturnType;
  requestBy: string;
  requestDate: string;
  approvalStatus: ApprovalStatus;
}

export interface OnlineReturn {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  assessmentYear: string;
  returnType: ReturnType;
  submissionDate: string;
  taxPaid: string;
  status: ApprovalStatus | "Verified";
}

export interface OfflineReturn {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  assessmentYear: string;
  challanNo: string;
  bankName: string;
  submissionDate: string;
  taxPaid: string;
  status: ApprovalStatus | "Verified";
}

export interface ArchivedReturn {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  assessmentYear: string;
  archiveDate: string;
  returnType: ReturnType;
  archivedBy: string;
  fileSize: string;
}
