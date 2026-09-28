import type { TableRow } from "../../pages/modulePageUtils";
import type { PsrRecord, PsrEditRequest, DoubleEntryStatus, DoubleEntryVerification, DormantRecord } from "../types/psr";

export function mapPsrRecord(r: PsrRecord): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle, ay: r.assessmentYear,
    psr_no: r.psrNo, submitted_by: r.submittedBy, submission_date: r.submissionDate,
    tax_amount: r.taxAmount, approval_status: r.approvalStatus,
  };
}

export function mapPsrEditRequest(r: PsrEditRequest): TableRow {
  return {
    id: r.id, psr_no: r.psrNo, edit_field: r.editField,
    original_value: r.originalValue, new_value: r.newValue,
    requested_by: r.requestedBy, request_date: r.requestDate, approval_status: r.approvalStatus,
  };
}

export function mapDoubleEntryStatus(r: DoubleEntryStatus): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle, ay: r.assessmentYear,
    entry_no: r.entryNo, entry_type: r.entryType, first_entry_by: r.firstEntryBy,
    second_entry_by: r.secondEntryBy, entry_date: r.entryDate, match_status: r.matchStatus,
  };
}

export function mapDoubleEntryVerification(r: DoubleEntryVerification): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle,
    entry_no: r.entryNo, amount: r.amount, verif_status: r.verifStatus, verif_date: r.verifDate,
  };
}

export function mapDormantRecord(r: DormantRecord): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle,
    last_return: r.lastReturn, years_dormant: r.yearsDormant,
    business_type: r.businessType, dormant_status: r.dormantStatus,
  };
}
