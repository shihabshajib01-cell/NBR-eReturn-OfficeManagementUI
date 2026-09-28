import type { TableRow } from "../../pages/modulePageUtils";
import type { LitigationCase, AppealRecord, TribunalRecord, DemandRecord, LedgerEntry, RefundRecord } from "../types/caseFinancial";

export function mapLitigationCase(r: LitigationCase): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle, ay: r.assessmentYear,
    case_no: r.caseNo, case_type: r.caseType, case_date: r.caseDate,
    court: r.court, amount: r.amount, case_status: r.caseStatus,
  };
}

export function mapAppealRecord(r: AppealRecord): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle, ay: r.assessmentYear,
    appeal_no: r.appealNo, appeal_date: r.appealDate, hearing_date: r.hearingDate,
    appeal_ground: r.appealGround, amount: r.amount, appeal_status: r.appealStatus,
  };
}

export function mapTribunalRecord(r: TribunalRecord): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle, ay: r.assessmentYear,
    tribunal_no: r.tribunalNo, tribunal_date: r.tribunalDate, bench: r.bench,
    case_type: r.caseType, amount: r.amount, tribunal_status: r.tribunalStatus,
  };
}

export function mapDemandRecord(r: DemandRecord): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle, ay: r.assessmentYear,
    demand_no: r.demandNo, demand_date: r.demandDate, demand_amount: r.demandAmount,
    paid_amount: r.paidAmount, outstanding: r.outstanding, payment_status: r.paymentStatus,
  };
}

export function mapLedgerEntry(r: LedgerEntry): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName,
    transaction_date: r.transactionDate, particulars: r.particulars,
    debit: r.debit, credit: r.credit, balance: r.balance, reference: r.reference,
  };
}

export function mapRefundRecord(r: RefundRecord): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle,
    refund_no: r.refundNo, refund_type: r.refundType, refund_amount: r.refundAmount,
    request_date: r.requestDate, refund_status: r.refundStatus,
  };
}
