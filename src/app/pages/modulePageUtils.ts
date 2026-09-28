// ─── Shared Types and Utilities for Module Pages ────────────────────────────
import type React from "react";
import type { AttachmentItem } from "../components/attachments/attachmentTypes";

export type TableCellValue = string | number | boolean | null | undefined | AttachmentItem[];
export type TableRow = Record<string, TableCellValue>;
export type IconComponent = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; color?: string; style?: React.CSSProperties }>;

export type TC = {
  id: string; primary: string; primaryDark: string; primaryLight: string;
  secondary: string; accent: string; background: string; surface: string;
  border: string; textPrimary: string; textSecondary: string;
  success: string; warning: string; error: string;
};

export interface FlatCol { key: string; label: string; headerKey?: string; badge?: boolean; mono?: boolean; mobileCard?: boolean; truncate?: "compact" | "normal" | "long" | "none"; }
export interface ColGroup { label: string; groupKey?: string; cols: FlatCol[]; }
export type ColDef = { type: "col"; col: FlatCol } | { type: "group"; group: ColGroup };

export interface RowAction { id: string; label: string; labelKey?: string; icon: IconComponent; color?: string; }
export interface FilterDef { key: string; label: string; labelKey?: string; type: "select" | "date" | "text"; options?: string[]; optionKeys?: Record<string, string>; }
export interface KpiDef { label: string; labelKey?: string; value: string; color?: string; tone?: "primary" | "success" | "warning" | "error" | "neutral"; icon?: IconComponent; }

export interface MobileCardMapping {
  primary?: string;
  identifier?: string;
  meta?: string[];
  status?: string;
  date?: string;
  amount?: string;
}

export interface PageCfg {
  title: string; titleKey?: string;
  desc: string; descKey?: string;
  cols: ColDef[];
  /** Optional separate column definitions for the details drawer (supports groups). If absent, drawer auto-generates from cols. */
  drawerCols?: ColDef[];
  filters: FilterDef[];
  actions: RowAction[];
  drawerActions?: RowAction[];
  rows: TableRow[];
  kpis?: KpiDef[];
  entryBtn?: string;
  extraBtns?: { id: string; label: string; icon: IconComponent; color?: string; tone?: "primary" | "neutral" | "warning"; formKind?: "psr-entry" | "psr-bulk-entry" | "generic-upload" }[];
  /** Optional explicit mobile card field mapping. If absent, uses smart fallback logic. */
  mobileCardMapping?: MobileCardMapping;
}

// ─── Data Constants ──────────────────────────────────────────────────────────
export const ZONES = ["All Zones", "Zone-1", "Zone-2", "Zone-3", "Zone-4"];
export const CIRCLES = ["All Circles", "Circle-1"];
export const AY_OPTS = ["All Years", "2024-25", "2023-24", "2022-23", "2021-22"];
export const CIRCLES_DATA = ["Circle-1", "Circle-1", "Circle-1", "Circle-1", "Circle-1", "Circle-1", "Circle-1", "Circle-1"];
export const NAMES = ["Rahman Enterprise", "Karim & Sons", "Haque Traders", "Matin Corp.", "Siddiqui Ltd.", "Ahmed Group", "Khan Trading", "Begum Exports", "Islam Imports", "Chowdhury & Co."];

// ─── Helper Functions ────────────────────────────────────────────────────────
export function gen(n: number, extra: (i: number) => TableRow = () => ({})): TableRow[] {
  return Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    tin: `TIN-${String(10000 + i).padStart(5, "0")}`,
    circle: CIRCLES_DATA[i % 8],
    taxpayer_name: NAMES[i % 10],
    ay: AY_OPTS[i % 4 + 1],
    ...extra(i),
  }));
}

export function rgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// ─── Column Helpers ──────────────────────────────────────────────────────────
export const fc = (key: string, label: string, opts: Partial<FlatCol> = {}): ColDef => ({ type: "col", col: { key, label, ...opts } });

export const BADGE = (key: string, label: string): ColDef => ({ type: "col", col: { key, label, badge: true, headerKey: "headers.status" } });

export const TIN_NAME: ColDef[] = [
  fc("tin", "TIN", { headerKey: "headers.tin" }),
  fc("taxpayer_name", "Taxpayer Name", { headerKey: "headers.taxpayerName" }),
];

export const CIRCLE_TIN_NAME: ColDef[] = [
  fc("circle", "Circle", { headerKey: "headers.circle" }),
  ...TIN_NAME,
];

// ─── Filter Constants ────────────────────────────────────────────────────────
export const BASE_FILTERS: FilterDef[] = [
  { key: "zone", label: "Zone", labelKey: "labels.zone", type: "select", options: ZONES, optionKeys: { "All Zones": "options.allZones" } },
  { key: "circle", label: "Circle", labelKey: "labels.circle", type: "select", options: CIRCLES, optionKeys: { "All Circles": "options.allCircles" } },
  { key: "ay", label: "Assessment Year", labelKey: "labels.assessmentYear", type: "select", options: AY_OPTS, optionKeys: { "All Years": "options.allYears" } },
  { key: "from", label: "From Date", labelKey: "labels.fromDate", type: "date" },
  { key: "to", label: "To Date", labelKey: "labels.toDate", type: "date" },
];

// ─── Mock Data Arrays ────────────────────────────────────────────────────────
export const returnApprRows = gen(42, i => ({ return_type: ["Normal", "82BB", "82C(2)", "212"][i % 4], request_by: ["Md. Alam", "S. Islam", "R. Hossain"][i % 3], request_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, approval_status: ["Pending", "Approved", "Rejected"][i % 3] }));
export const onlineRetRows = gen(38, i => ({ return_type: ["Normal", "82BB", "82C(2)"][i % 3], submission_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, tax_paid: `৳${(i * 7 + 5) * 1000}`, status: ["Pending", "Approved", "Verified"][i % 3] }));
export const offlineRetRows = gen(35, i => ({ challan_no: `CH-${2000 + i}`, bank_name: ["Janata Bank", "Agrani Bank", "Sonali Bank"][i % 3], submission_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, tax_paid: `৳${(i * 9 + 5) * 1000}`, status: ["Pending", "Approved", "Verified"][i % 3] }));
export const archiveRows = gen(30, i => ({ archive_date: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, return_type: ["Normal", "82BB"][i % 2], archived_by: ["System", "Md. Alam"][i % 2], file_size: `${300 + i * 20} KB` }));
export const reg4Rows = gen(32, i => ({ book_no: `BK-${1000 + i}`, issue_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, from_serial: String(100 + i * 5), to_serial: String(104 + i * 5), quantity: "5", recipient: NAMES[i % 10], status: ["Pending", "Issued", "Returned"][i % 3] }));
export const stockRows = gen(24, i => ({ book_type: ["82BB", "82C(2)", "212", "Normal"][i % 4], opening_stock: String(500 - i * 10), received: String(i * 5), issued: String(i * 3), closing_stock: String(500 - i * 10 + i * 5 - i * 3), last_updated: `2026-0${(i % 9) + 1}-15` }));
export const taxRegRows = gen(40, i => ({ registration_no: `REG-${5000 + i}`, business_type: ["Sole Proprietorship", "Partnership", "Company", "NGO"][i % 4], registration_date: `2020-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, zone: ZONES[i % 4 + 1], active_status: ["Active", "Inactive"][i % 2] }));
export const reg5Rows = gen(30, i => ({ case_no: `CASE-${3000 + i}`, case_type: ["Assessment", "Penalty", "Appeal"][i % 3], amount: `৳${(i * 50 + 100) * 1000}`, assigned_to: ["Md. Alam", "S. Islam"][i % 2], due_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, approval_status: ["Pending", "Approved", "Rejected"][i % 3] }));
export const psrRows = gen(36, i => ({ psr_no: `PSR-${7000 + i}`, submitted_by: ["Md. Alam", "S. Islam", "R. Hossain"][i % 3], submission_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, tax_amount: `৳${(i * 40 + 50) * 1000}`, approval_status: ["Pending", "Approved", "Rejected"][i % 3] }));
export const psrEditRows = gen(22, i => ({ psr_no: `PSR-${7000 + i}`, edit_field: ["TIN", "Amount", "Date"][i % 3], original_value: "Old Value", new_value: "New Value", requested_by: NAMES[i % 10], request_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, approval_status: ["Pending", "Approved", "Rejected"][i % 3] }));
export const deStatusRows = gen(26, i => ({ entry_no: `DE-${4000 + i}`, entry_type: ["Online", "Offline"][i % 2], first_entry_by: NAMES[i % 10], second_entry_by: NAMES[(i + 1) % 10], entry_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, match_status: ["Matched", "Pending", "Mismatched"][i % 3] }));
export const deVerifRows = gen(22, i => ({ entry_no: `DE-${4000 + i}`, amount: `৳${(i * 30 + 50) * 1000}`, verif_status: ["Verified", "Pending", "Failed"][i % 3], verif_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}` }));
export const dormantRows = gen(18, i => ({ last_return: `2022-0${(i % 9) + 1}-01`, years_dormant: String(i % 3 + 1), business_type: ["Sole Proprietorship", "Company"][i % 2], dormant_status: "Dormant" }));
export const jurisdRows = gen(16, i => ({ issue_type: ["Wrong Circle", "Wrong Zone"][i % 2], current_circle: CIRCLES_DATA[i % 8], correct_circle: CIRCLES_DATA[(i + 1) % 8], reported_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, resolution_status: ["Pending", "Resolved", "Transferred"][i % 3] }));
export const otherCircRows = gen(22, i => ({ original_circle: CIRCLES_DATA[i % 8], entry_circle: CIRCLES_DATA[(i + 2) % 8], entry_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, transfer_status: ["Pending", "Transferred"][i % 2], remarks: ["Wrong filing", "Taxpayer request"][i % 2] }));
export const misfiledRows = gen(17, i => ({ misfiled_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, correct_taxpayer: NAMES[(i + 3) % 10], misfiled_to: NAMES[(i + 5) % 10], resolve_status: ["Pending", "Resolved"][i % 2], detected_by: ["System", "Officer"][i % 2] }));
export const invalidRows = gen(20, i => ({ invalid_reason: ["Duplicate TIN", "Wrong AY", "Missing Signature", "Format Error"][i % 4], detected_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, detected_by: ["System Auto-Check", "Manual Review"][i % 2], resolution_status: ["Pending", "Resolved"][i % 2] }));
export const approvalListRows = gen(30, i => ({ request_type: ["Return View", "PSR Entry", "Edit Request"][i % 3], requested_by: NAMES[i % 10], request_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, priority: ["High", "Normal", "Low"][i % 3], approval_status: ["Pending", "Approved", "Rejected"][i % 3] }));
export const transferRows = gen(26, i => ({ from_circle: CIRCLES_DATA[i % 8], to_circle: CIRCLES_DATA[(i + 1) % 8], transfer_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, transferred_by: NAMES[i % 10], reason: ["Jurisdictional Change", "Taxpayer Request", "Admin Order"][i % 3], transfer_status: ["Transferred", "Pending", "Cancelled"][i % 3] }));
export const litRows = (type: string) => gen(20, i => ({ case_no: `${type.slice(0, 3).toUpperCase()}-${2000 + i}`, case_type: type, case_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, court: ["High Court", "Supreme Court", "Tax Tribunal"][i % 3], amount: `৳${(i * 80 + 100) * 1000}`, case_status: ["Pending", "Approved", "Rejected", "Active"][i % 4] }));
export const appealRows = gen(25, i => ({ appeal_no: `APP-${6000 + i}`, appeal_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, hearing_date: `2026-0${(i % 9) + 2}-${String((i % 28) + 1).padStart(2, "0")}`, appeal_ground: ["Assessment Error", "Penalty Waiver"][i % 2], amount: `৳${(i * 60 + 50) * 1000}`, appeal_status: ["Pending", "Approved", "Rejected", "Under Review"][i % 4] }));
export const tribunalRows = gen(20, i => ({ tribunal_no: `TRB-${8000 + i}`, tribunal_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, bench: ["Bench-1", "Bench-2"][i % 2], case_type: ["Income Tax", "VAT"][i % 2], amount: `৳${(i * 90 + 100) * 1000}`, tribunal_status: ["Pending", "Decided", "Adjourned"][i % 3] }));
export const demandRows = gen(28, i => ({ demand_no: `DEM-${9000 + i}`, demand_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, demand_amount: `৳${(i * 100 + 100) * 1000}`, paid_amount: `৳${(i * 50 + 50) * 1000}`, outstanding: `৳${(i * 50) * 1000}`, payment_status: ["Paid", "Unpaid", "Partially Paid"][i % 3] }));
export const ledgerRows = gen(20, i => ({ transaction_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, particulars: ["Tax Payment", "Penalty", "TDS Credit", "Advance Tax"][i % 4], debit: `৳${(i * 20 + 50) * 1000}`, credit: `৳${(i * 10 + 10) * 1000}`, balance: `৳${(i * 10 + 100) * 1000}`, reference: `REF-${3000 + i}` }));
export const refundRows = gen(22, i => ({ refund_no: `RFD-${5000 + i}`, refund_type: ["TDS Refund", "Advance Tax Refund", "Error Adjustment"][i % 3], refund_amount: `৳${(i * 30 + 50) * 1000}`, request_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, refund_status: ["Pending", "Approved", "Rejected", "Disbursed"][i % 4] }));
export const certDataRows = gen(25, i => ({ request_no: `CER-${4000 + i}`, cert_type: ["Income Certificate", "Tax Clearance", "No Dues Certificate"][i % 3], requested_by: NAMES[i % 10], request_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, approval_status: ["Pending", "Approved", "Rejected", "Issued"][i % 4] }));
export const certEditRows = gen(15, i => ({ request_no: `CER-${4000 + i}`, cert_type: ["Income Certificate", "Tax Clearance"][i % 2], edit_field: ["Name", "Address", "TIN"][i % 3], original_value: "Previous Value", requested_value: "New Value", edit_status: ["Pending", "Approved", "Rejected"][i % 3] }));
export const certDisposalRows = gen(18, i => ({ request_no: `CER-${4000 + i}`, cert_type: ["Income Certificate", "Tax Clearance"][i % 2], issued_to: NAMES[i % 10], disposal_date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`, disposal_method: ["Handed Over", "Postal", "Digital"][i % 3], disposal_status: "Disposed" }));
export const specialRegRows = gen(20, i => ({ reg_no: `SREG-${2000 + i}`, reg_type: ["NGO", "Trust", "Society", "Foundation"][i % 4], reg_date: `2020-0${(i % 9) + 1}-01`, zone: ZONES[i % 4 + 1], active_status: ["Active", "Inactive", "Suspended"][i % 3] }));
export const timeExtRows = gen(22, i => ({ request_no: `TEX-${3000 + i}`, extension_type: ["Return Submission", "Document Submission", "Hearing"][i % 3], original_deadline: `2026-0${(i % 9) + 1}-15`, requested_deadline: `2026-0${(i % 9) + 2}-15`, requested_by: NAMES[i % 10], approval_status: ["Pending", "Approved", "Rejected"][i % 3] }));
export const auditRows = gen(18, i => ({ selection_no: `AUD-${1000 + i}`, selection_method: ["Risk-Based", "Random", "Special Order"][i % 3], ay_for_audit: AY_OPTS[i % 4 + 1], selected_date: `2026-0${(i % 9) + 1}-01`, audit_officer: ["Md. Alam", "S. Islam"][i % 2], audit_status: ["Selected", "In Progress", "Completed", "Cancelled"][i % 4] }));

// ─── Action Sets (Import icons where needed) ─────────────────────────────────
// Note: Icons must be imported from lucide-react in consuming modules
// ROW_VIEW is the standard row action - only "View Details" appears in table rows
// All other actions (Edit, Approve, Reject, etc.) should be passed via drawerActions