import { useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Printer, Download } from "lucide-react";
import { handleExportDisabled } from "../../utils/exportDisabled";
import { StatusBadge } from "../badges/StatusBadge";
import { ResponsiveOverlay } from "../shared/ResponsiveOverlay";
import { SafeText, ExpandableText } from "../shared/SafeText";
import { AttachmentList } from "../attachments/AttachmentList";
import { type AttachmentItem, isAttachmentArray } from "../attachments/attachmentTypes";
import { CopyValueButton, isCopyableField } from "../shared/CopyValueButton";

interface ColumnDef {
  key: string;
  label: string;
  labelKey?: string;
  groupLabel?: string;
  groupLabelKey?: string;
}

import type { TableRow } from "../../pages/modulePageUtils";

interface DynamicDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  columns: ColumnDef[];
  rowData: TableRow | null;
  excludeKeys?: string[];
  showActions?: boolean;
  /** Extra action buttons appended to the drawer footer (e.g. Edit/Delete for custom records) */
  extraFooterActions?: ReactNode;
  /** Key in rowData whose value renders as a subtitle under the name in the summary card */
  summarySubtitleKey?: string;
}

// ── Action / UI-only keys — never shown as data ──────────────────────────────
const UI_KEY_FRAGMENTS = [
  "actions", "action", "more", "see_more", "edit", "delete",
  "view", "details", "print", "download", "menu",
  "__actions__", "__more__", "__edit__", "__delete__", "__view__",
];

// ── Status summary block helpers ─────────────────────────────────────────────
const isStatusKey = (k: string) =>
  k === "status" || k.endsWith("_status");

const isIdentifierKey = (k: string) =>
  ["tin", "user_id", "case_no", "psr_no", "cert_no", "reg_no",
   "entry_no", "ref_no", "tracking_no", "challan_no", "book_no"].includes(k) ||
  k.includes("case_no") || k.includes("psr_no") || k.includes("cert_no") ||
  k.includes("reg_no") || k.includes("tracking");

const isNameKey = (k: string) =>
  ["taxpayer_name", "user_name", "business_name", "name", "recipient"].includes(k) ||
  k.endsWith("_name");

const isSummaryDateKey = (k: string) =>
  ["last_login", "last_activity_time", "date", "updated_date", "request_date",
   "submission_date", "case_date"].includes(k);

// ── Auto-grouping patterns — checked in order, first match wins ──────────────
interface AutoGroup {
  label: string;
  groupKey: string;
  test: (k: string) => boolean;
}

const AUTO_GROUPS: AutoGroup[] = [
  {
    label: "Basic Information",
    groupKey: "groups.basicInfo",
    test: k =>
      ["circle", "tin", "user_id", "taxpayer_name", "business_name", "designation",
       "category", "type", "ay", "assessment_year", "user_name", "zone",
       "email", "phone", "level", "role", "tax_circle", "tax_zone"].includes(k) ||
      k.endsWith("_name"),
  },
  {
    label: "Activity / Login Details",
    groupKey: "groups.activityLogin",
    test: k =>
      k.includes("login") || k.includes("session") ||
      k === "entry_today" || k === "entry_upto" ||
      k.includes("total_actions") || k === "last_activity_time",
  },
  {
    label: "Case / Approval Details",
    groupKey: "groups.caseApproval",
    test: k =>
      k.includes("case") || k.includes("psr") || k.includes("cert") ||
      k.includes("selection") || k.includes("request") || k.includes("approver") ||
      k.includes("assigned") || k.includes("audit") ||
      k === "method" || k === "reason" ||
      k === "ref_no" || k.includes("book") ||
      k.includes("bench") || k.includes("court") ||
      k.includes("tribunal") || k.includes("appeal") || k.includes("tracking"),
  },
  {
    label: "Financial Information",
    groupKey: "groups.financial",
    test: k =>
      k.includes("amount") || k.includes("_tax") || k.includes("revenue") ||
      k.includes("demand") || k.includes("payment") || k.includes("paid") ||
      k.includes("outstanding") || k.includes("penalty") || k.includes("credit") ||
      k.includes("debit") || k.includes("balance") || k.includes("challan") ||
      k.includes("tds") || k === "tax_paid" || k === "tax_total",
  },
  {
    label: "Dates",
    groupKey: "groups.dates",
    test: k =>
      (k.includes("_date") && !k.startsWith("records_")) ||
      k === "last_pass_change" ||
      k.includes("submitted") || k.includes("issued_date"),
  },
  {
    label: "System Activity",
    groupKey: "groups.systemActivity",
    test: k =>
      k.startsWith("records_") || k === "reports_downloaded" ||
      k === "prints_taken" || k.includes("failed_login") ||
      k === "last_action" || k === "activity_summary" ||
      k.includes("password_change"),
  },
];

// Keys whose values are long — span full grid width
const WIDE_KEY_PATTERNS = [
  "summary", "remarks", "notes", "description", "address",
  "last_action", "activity_summary", "reason", "message", "details",
  "endpoint", "api_endpoint", "url", "link", "email",
];
const isWide = (k: string) => WIDE_KEY_PATTERNS.some(p => k.includes(p));

// Keys that should use ExpandableText with generous limits
const EXPANDABLE_KEYS = new Set([
  "description", "remarks", "notes", "address", "reason",
  "message", "details", "summary", "activity_summary", "last_action",
  "endpoint", "api_endpoint", "url", "link", "email",
]);
const isExpandable = (k: string) =>
  EXPANDABLE_KEYS.has(k) || EXPANDABLE_KEYS.has(k.replace(/_/g, "")) ||
  k.includes("description") || k.includes("remark") || k.includes("endpoint") ||
  k.includes("email") || k.includes("address") || k.includes("reason") ||
  k.includes("url") || k.includes("summary");

// Attachment metadata keys — excluded from normal field rendering
const ATTACHMENT_META_KEYS = new Set([
  "attachments", "attachment_count", "attachment_names", "source_file",
  "uploaded_files", "file_names", "file_count", "file_upload", "document_names",
]);
const isAttachmentMetadataKey = (k: string) =>
  ATTACHMENT_META_KEYS.has(k) ||
  k.endsWith("_attachments") ||
  k === "attachment_files";

function extractAttachments(rowData: TableRow): AttachmentItem[] {
  // 1. Direct attachment array on known keys
  for (const key of ["attachments", "uploaded_files", "attachment_files"]) {
    if (isAttachmentArray(rowData[key])) return rowData[key] as AttachmentItem[];
  }
  // 2. Any key ending with _attachments
  for (const [k, v] of Object.entries(rowData)) {
    if (k.endsWith("_attachments") && isAttachmentArray(v)) return v as AttachmentItem[];
  }
  // 3. Metadata-only fallback: build from attachment_names or source_file
  const names = rowData["attachment_names"] ?? rowData["file_names"] ?? rowData["document_names"];
  const sourceFile = rowData["source_file"];
  const items: AttachmentItem[] = [];
  if (typeof names === "string" && names.trim()) {
    names.split(",").forEach((n, i) => {
      const name = n.trim();
      const ext = "." + (name.split(".").pop()?.toLowerCase() ?? "bin");
      items.push({ id: `meta-${i}`, name, size: 0, sizeLabel: "—", type: "", extension: ext, previewKind: "unknown" });
    });
  } else if (typeof sourceFile === "string" && sourceFile.trim()) {
    const ext = "." + (sourceFile.split(".").pop()?.toLowerCase() ?? "bin");
    items.push({ id: "meta-0", name: sourceFile.trim(), size: 0, sizeLabel: "—", type: "", extension: ext, previewKind: "unknown" });
  }
  return items;
}

// Returns true when a value should be treated as empty
const isEmpty = (val: unknown): boolean => {
  if (val === null || val === undefined || val === "" || val === "—") return true;
  if (Array.isArray(val)) return val.length === 0;
  if (val !== null && typeof val === "object") return Object.keys(val as object).length === 0;
  return false;
};

// Given an ordered list of columns, compute whether each should span 2 cols.
// Wide keys always span 2. A normal key spans 2 when it would be alone in its row.
const computeSpans = (cols: ColumnDef[]): boolean[] => {
  const spans: boolean[] = new Array(cols.length).fill(false);
  let gridCol = 0; // 0 = left, 1 = right

  for (let i = 0; i < cols.length; i++) {
    if (isWide(cols[i].key)) {
      spans[i] = true;
      gridCol = 0;
      continue;
    }
    // Would the next normal (non-wide) item exist in the same row?
    const nextNormal = cols.slice(i + 1).find(c => !isWide(c.key));
    const isAlone = gridCol === 0 && !nextNormal;
    if (isAlone) {
      spans[i] = true;
      gridCol = 0;
    } else {
      spans[i] = false;
      gridCol = (gridCol + 1) % 2;
      // Wide item after this would reset the column on next iteration
    }
  }
  return spans;
};

// ── Component ────────────────────────────────────────────────────────────────
export function DynamicDetailsDrawer({
  open,
  onClose,
  title,
  columns,
  rowData,
  excludeKeys = [],
  showActions = true,
  extraFooterActions,
  summarySubtitleKey,
}: DynamicDetailsDrawerProps) {
  const { t: tc } = useTranslation("common");
  const { t: td } = useTranslation("drawers");
  const { t: th } = useTranslation("tables");

  // ── Heavy section-building — memoized on rowData + columns ───────────────
  // Must be called before any early return to satisfy Rules of Hooks.
  type GroupEntry = { label: string; labelKey?: string; cols: ColumnDef[] };
  const { statusCol, identifierCol, nameCol, dateCol, groupMap, attachments } = useMemo(() => {
    const empty = { statusCol: undefined, identifierCol: undefined, nameCol: undefined, dateCol: undefined, groupMap: new Map<string, GroupEntry>() };
    if (!rowData) return empty;
    const attachments = extractAttachments(rowData);
    const allExclude = [...UI_KEY_FRAGMENTS, ...excludeKeys];
    const validColumns = columns.filter(col => {
      if (allExclude.some(x => col.key.toLowerCase().includes(x.toLowerCase()))) return false;
      if (isAttachmentMetadataKey(col.key)) return false; // rendered via AttachmentList
      return !isEmpty(rowData[col.key]);
    });

    const statusCol     = validColumns.find(c => isStatusKey(c.key));
    const identifierCol = validColumns.find(c => isIdentifierKey(c.key));
    const nameCol       = validColumns.find(c => isNameKey(c.key));
    const dateCol       = validColumns.find(c => isSummaryDateKey(c.key));
    const summaryKeySet = new Set(
      [statusCol, identifierCol, nameCol, dateCol].filter(Boolean).map(c => c!.key),
    );
    // Also exclude the subtitle key so it's not repeated in section cards
    if (summarySubtitleKey) summaryKeySet.add(summarySubtitleKey);

    const groupMap = new Map<string, GroupEntry>();
    const addToGroup = (groupLabel: string, groupLabelKey: string | undefined, col: ColumnDef) => {
      if (!groupMap.has(groupLabel))
        groupMap.set(groupLabel, { label: groupLabel, labelKey: groupLabelKey, cols: [] });
      groupMap.get(groupLabel)!.cols.push(col);
    };

    for (const col of validColumns) {
      if (summaryKeySet.has(col.key)) continue;
      if (col.groupLabel) {
        addToGroup(col.groupLabel, col.groupLabelKey, col);
      } else {
        const match = AUTO_GROUPS.find(g => g.test(col.key));
        addToGroup(match?.label ?? "Other Information", match?.groupKey ?? "groups.otherInfo", col);
      }
    }

    return { statusCol, identifierCol, nameCol, dateCol, groupMap, attachments };
  // rowData may be null — the memo handles it safely by returning empty defaults
  }, [rowData, columns, excludeKeys]);

  if (!rowData) return null;

  // Resolve translated label — cheap helper defined after hooks
  const getLabel = (col: ColumnDef): string => {
    if (col.labelKey) return th(col.labelKey) || td(col.labelKey) || col.label;
    return col.label;
  };

  const drawerTitle = title || td("recordDetails.title") || "Record Details";

  const defaultActions = showActions ? (
    <>
      <button
        onClick={() => window.print()}
        className="action-btn action-btn--secondary"
        type="button"
      >
        <Printer size={13} strokeWidth={2} aria-hidden="true" />
        <span>{tc("actions.print")}</span>
      </button>
      <button
        className="action-btn action-btn--secondary"
        type="button"
        onClick={() => handleExportDisabled(tc("actions.exportDisabled"))}
      >
        <Download size={13} strokeWidth={2} aria-hidden="true" />
        <span>{tc("actions.export")}</span>
      </button>
    </>
  ) : null;

  const footerContent = (defaultActions || extraFooterActions) ? (
    <>{defaultActions}{extraFooterActions}</>
  ) : undefined;

  const hasSummary = !!(statusCol || identifierCol || nameCol);

  return (
    <ResponsiveOverlay
      open={open}
      onClose={onClose}
      title={drawerTitle}
      footer={footerContent}
      closeLabel={tc("accessibility.closeDrawer")}
      describedBy={hasSummary ? "dynamic-drawer-summary" : undefined}
      className="dynamic-drawer"
    >
      {/* ── Status Summary Block ───────────────────────────────────────── */}
      {(statusCol || identifierCol || nameCol) && (
        <div id="dynamic-drawer-summary" className="drawer-summary">
          <div className="drawer-summary__main">
            {nameCol && (
              <ExpandableText
                value={rowData[nameCol.key]}
                maxChars={120}
                collapsedLines={3}
                mode="block"
                className="drawer-summary__name"
                as="p"
              />
            )}
            {summarySubtitleKey && rowData[summarySubtitleKey] && (
              <ExpandableText
                value={rowData[summarySubtitleKey]}
                maxChars={140}
                collapsedLines={2}
                mode="block"
                className="drawer-summary__subtitle"
                as="p"
              />
            )}
            {identifierCol && (
              <p className="drawer-summary__id">
                <span className="drawer-summary__id-label">{getLabel(identifierCol)}: </span>
                <SafeText value={rowData[identifierCol.key]} mode="break" as="span" />
              </p>
            )}
            {dateCol && (
              <p className="drawer-summary__meta">
                {getLabel(dateCol)}: <SafeText value={rowData[dateCol.key]} mode="break" as="span" />
              </p>
            )}
          </div>
          {statusCol && (
            <div className="drawer-summary__status">
              <StatusBadge value={String(rowData[statusCol.key])} />
            </div>
          )}
        </div>
      )}

      {/* ── Attached Files ────────────────────────────────────────────── */}
      {attachments && attachments.length > 0 && (
        <AttachmentList attachments={attachments} />
      )}

      {/* ── Grouped Sections ──────────────────────────────────────────── */}
      {[...groupMap.values()].map(group => {
        if (group.cols.length === 0) return null;
        const groupLabel = group.labelKey
          ? th(group.labelKey) || td(group.labelKey) || group.label
          : group.label;

        return (
          <div key={group.label} className="detail-section">
            <h3 className="detail-section__head detail-section__head--static">
              {groupLabel}
            </h3>
            <div className="drawer-field-grid">
              {computeSpans(group.cols).map((fullWidth, idx) => {
                const col = group.cols[idx];
                return (
                  <div
                    key={col.key}
                    className={`drawer-field${fullWidth ? " drawer-field--wide" : ""}`}
                  >
                    <span className="drawer-field__label">{getLabel(col)}</span>
                    <div className="drawer-field__value">
                      {isStatusKey(col.key) ? (
                        <StatusBadge value={String(rowData[col.key])} />
                      ) : (
                        <div className="drawer-field__value-row">
                          {isExpandable(col.key)
                            ? <ExpandableText value={rowData[col.key]} maxChars={160} collapsedLines={4} mode="block" />
                            : <SafeText value={rowData[col.key]} mode="break" as="span" />
                          }
                          {isCopyableField(col.key) && (
                            <CopyValueButton value={rowData[col.key]} label={getLabel(col)} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </ResponsiveOverlay>
  );
}
