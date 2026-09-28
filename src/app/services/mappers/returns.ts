import type { TableRow } from "../../pages/modulePageUtils";
import type { ReturnRecord, OnlineReturn, OfflineReturn, ArchivedReturn } from "../types/returns";

export function mapReturnRecord(r: ReturnRecord): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle,
    ay: r.assessmentYear, return_type: r.returnType, request_by: r.requestBy,
    request_date: r.requestDate, approval_status: r.approvalStatus,
  };
}

export function mapOnlineReturn(r: OnlineReturn): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle,
    ay: r.assessmentYear, return_type: r.returnType,
    submission_date: r.submissionDate, tax_paid: r.taxPaid, status: r.status,
  };
}

export function mapOfflineReturn(r: OfflineReturn): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle,
    ay: r.assessmentYear, challan_no: r.challanNo, bank_name: r.bankName,
    submission_date: r.submissionDate, tax_paid: r.taxPaid, status: r.status,
  };
}

export function mapArchivedReturn(r: ArchivedReturn): TableRow {
  return {
    id: r.id, tin: r.tin, taxpayer_name: r.taxpayerName, circle: r.circle,
    ay: r.assessmentYear, archive_date: r.archiveDate, return_type: r.returnType,
    archived_by: r.archivedBy, file_size: r.fileSize,
  };
}
