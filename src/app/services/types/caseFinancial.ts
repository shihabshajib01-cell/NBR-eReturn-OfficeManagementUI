import type { ApprovalStatus } from "./api";

export interface LitigationCase {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  assessmentYear: string;
  caseNo: string;
  caseType: string;
  caseDate: string;
  court: string;
  amount: string;
  caseStatus: ApprovalStatus | "Active";
}

export interface AppealRecord {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  assessmentYear: string;
  appealNo: string;
  appealDate: string;
  hearingDate: string;
  appealGround: string;
  amount: string;
  appealStatus: ApprovalStatus | "Under Review";
}

export interface TribunalRecord {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  assessmentYear: string;
  tribunalNo: string;
  tribunalDate: string;
  bench: string;
  caseType: string;
  amount: string;
  tribunalStatus: "Pending" | "Decided" | "Adjourned";
}

export interface DemandRecord {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  assessmentYear: string;
  demandNo: string;
  demandDate: string;
  demandAmount: string;
  paidAmount: string;
  outstanding: string;
  paymentStatus: "Paid" | "Unpaid" | "Partially Paid";
}

export interface LedgerEntry {
  id: string;
  tin: string;
  taxpayerName: string;
  transactionDate: string;
  particulars: string;
  debit: string;
  credit: string;
  balance: string;
  reference: string;
}

export interface RefundRecord {
  id: string;
  tin: string;
  taxpayerName: string;
  circle: string;
  refundNo: string;
  refundType: string;
  refundAmount: string;
  requestDate: string;
  refundStatus: ApprovalStatus | "Disbursed";
}
