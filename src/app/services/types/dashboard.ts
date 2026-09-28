import type { ApprovalStatus, ReturnType } from "./api";

export interface DashboardKpis {
  totalOnlineRegistrations: number;
  currentOnlineRegistrations: number;
  totalOnlineSubmissions: number;
  taxPaidEReturn: number;
  totalTdsAdvanceTax: number;
  totalAmendmentReturns: number;
  taxPaidWithReturn: number;
  totalClaimedIbasChallan: number;
  advanceTaxCarChallan: number;
  tdsSavingCertificate: number;
  tdsBankInterest: number;
  otherTdsAitClaims: number;
}

export interface RecentSubmission {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  returnType: ReturnType;
  submittedAt: string;
  submissionStatus: ApprovalStatus | "Verified";
  assessmentYear: string;
}

export interface CircleSummary {
  circle: string;
  total: number;
  pending: number;
  approved: number;
  taxCollected: string;
}

export interface PsrCircleSummary {
  circle: string;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  taxTotal: string;
}

export interface PsrKpis {
  totalPsrEntries: number;
  pendingApproval: number;
  approvedToday: number;
  rejectedToday: number;
}

export interface RecentPsrEntry {
  id: string;
  psrNo: string;
  submittedBy: string;
  taxAmount: string;
  approvalStatus: ApprovalStatus;
}

export interface OfflineReturnSummary {
  id: number;
  circle: string;
  today82bb: number;
  today82c2: number;
  today212: number;
  todayNormal: number;
  todayTotal: number;
}

export interface LitigationSummary {
  id: number;
  circle: string;
  pending: number;
  approved: number;
  rejected: number;
  total: number;
  revenue: string;
}

export interface TaxCategorySummary {
  id: number;
  category: string;
  online: number;
  offline: number;
  total: number;
}
