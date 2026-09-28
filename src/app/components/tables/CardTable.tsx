import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "../badges/StatusBadge";
import type { ColDef, FlatCol, RowAction, TableRow } from "../../pages/modulePageUtils";
import { isAttachmentArray } from "../attachments/attachmentTypes";

interface CardTableProps {
  cols: ColDef[];
  rows: TableRow[];
  actions?: RowAction[];
  onRowClick?: (row: TableRow) => void;
  onActionClick?: (actionId: string, row: TableRow) => void;
  noCard?: boolean;
  "aria-label"?: string;
}

// ── Resolve truncation class from column key or explicit override ─────────────
const COMPACT_KEYS = new Set([
  "method", "status", "type", "typeLabel", "access", "accessLabel",
  "active_status", "approval_status", "payment_status", "transfer_status",
  "dormant_status", "match_status", "refund_status", "verif_status", "resolution_status",
  "count", "users", "users_count", "permissions_count",
  "zone", "circle", "ay", "date", "created_at", "updated_at",
  "reg_date", "registration_date", "issue_date", "quantity", "qty",
]);
const LONG_KEYS = new Set([
  "endpoint", "api_endpoint", "apiEndpoint", "url", "link",
  "email", "address", "description", "remarks", "reason",
  "message", "details", "summary", "activity_summary", "last_action",
]);

function cellTextClass(col: FlatCol): string {
  if (col.truncate === "none")    return "";
  if (col.truncate === "compact") return "card-table__cell-text card-table__cell-text--compact";
  if (col.truncate === "long")    return "card-table__cell-text card-table__cell-text--long";
  if (col.truncate === "normal")  return "card-table__cell-text card-table__cell-text--normal";
  if (COMPACT_KEYS.has(col.key)) return "card-table__cell-text card-table__cell-text--compact";
  if (LONG_KEYS.has(col.key))    return "card-table__cell-text card-table__cell-text--long";
  return "card-table__cell-text card-table__cell-text--normal";
}

export function CardTable({ cols, rows, actions, onRowClick, onActionClick, noCard, "aria-label": ariaLabel }: CardTableProps) {
  const { t: translateTables } = useTranslation("tables");
  const { t: translateEmptyStates } = useTranslation("emptyStates");
  const { t: translateUser } = useTranslation("user");
  const [hovered, setHovered] = useState<number | null>(null);

  const flat: FlatCol[] = cols.flatMap(c => c.type === "col" ? [c.col] : c.group.cols);
  const hasGroups = cols.some(c => c.type === "group");

  const translateHeader = (headerKey: string | undefined, fallback: string): string => {
    if (!headerKey) return fallback;
    const translated = headerKey.startsWith("userTable.")
      ? translateUser(headerKey)
      : translateTables(headerKey);
    return (!translated || translated === headerKey) ? fallback : translated;
  };

  const rowId = (row: TableRow): string =>
    String(row[flat[0]?.key] ?? "").trim() || String(row["id"] ?? "");

  return (
    <div className={`card-table${noCard ? "" : " card-table--bordered"}`}>
      <div className="card-table__wrapper">
        <table className="card-table__table" aria-label={ariaLabel}>
          <thead>
            {hasGroups && (
              <tr className="card-table__header-group">
                {cols.map((c, ci) =>
                  c.type === "col" ? (
                    <th key={ci} rowSpan={2} scope="col" className="card-table__th card-table__th--secondary">
                      <span className="card-table__th-text" title={translateHeader(c.col.headerKey, c.col.label)}>
                        {translateHeader(c.col.headerKey, c.col.label)}
                      </span>
                    </th>
                  ) : (
                    <th key={ci} colSpan={c.group.cols.length} scope="colgroup" className="card-table__th card-table__th--group">
                      {c.group.groupKey ? translateTables(c.group.groupKey) || c.group.label : c.group.label}
                    </th>
                  )
                )}
                {actions && (
                  <th rowSpan={2} scope="col" className="card-table__th card-table__th--secondary" style={{ textAlign: "center" }}>
                    {translateTables("headers.actions")}
                  </th>
                )}
              </tr>
            )}
            <tr className="card-table__header-standard">
              {hasGroups
                ? cols.flatMap((c, ci) =>
                    c.type === "col"
                      ? []
                      : c.group.cols.map((sc, sci) => (
                          <th key={`${ci}-${sci}`} scope="col" className="card-table__th card-table__th--sub">
                            <span className="card-table__th-text" title={translateHeader(sc.headerKey, sc.label)}>
                              {translateHeader(sc.headerKey, sc.label)}
                            </span>
                          </th>
                        ))
                  )
                : flat.map((col, ci) => (
                    <th key={ci} scope="col" className="card-table__th card-table__th--secondary">
                      <span className="card-table__th-text" title={translateHeader(col.headerKey, col.label)}>
                        {translateHeader(col.headerKey, col.label)}
                      </span>
                    </th>
                  ))}
              {!hasGroups && actions && (
                <th scope="col" className="card-table__th card-table__th--secondary" style={{ textAlign: "center" }}>
                  {translateTables("headers.actions")}
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={flat.length + (actions ? 1 : 0)} className="card-table__empty">
                  {translateEmptyStates("noRecordsDescription")}
                </td>
              </tr>
            ) : (
              rows.map((row, ri) => (
                <tr
                  key={ri}
                  tabIndex={onRowClick ? 0 : undefined}
                  onMouseEnter={() => setHovered(ri)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={onRowClick ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  } : undefined}
                  className={[
                    "card-table__row",
                    ri % 2 === 1 ? "card-table__row--striped" : "",
                    onRowClick ? "card-table__row--clickable" : "",
                    hovered === ri ? "card-table__row--hovered" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {flat.map((col, ci) => {
                    const rawVal = row[col.key];
                    const displayVal = rawVal === null || rawVal === undefined
                      ? "—"
                      : isAttachmentArray(rawVal)
                        ? `${rawVal.length} file${rawVal.length !== 1 ? "s" : ""}`
                        : String(rawVal);
                    const cls = cellTextClass(col);
                    return (
                      <td
                        key={ci}
                        className={[
                          "card-table__td",
                          hasGroups && ci > 0 ? "card-table__td--right" : "card-table__td--left",
                          col.mono ? "card-table__td--mono" : "",
                          col.truncate === "none" ? "card-table__td--no-truncate" : "",
                        ].filter(Boolean).join(" ")}
                      >
                        {col.badge ? (
                          <StatusBadge value={displayVal} />
                        ) : displayVal === "—" ? (
                          <span className="card-table__td--muted">—</span>
                        ) : (
                          <span className={cls} title={displayVal}>
                            {displayVal}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  {actions && actions.length > 0 && (
                    <td className="card-table__actions">
                      <div className="card-table__action-buttons">
                        {actions.map((action) => (
                          <button
                            key={action.id}
                            type="button"
                            aria-label={`${action.label} — ${rowId(row)}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onActionClick) onActionClick(action.id, row);
                              else onRowClick?.(row);
                            }}
                            className="card-table__action-btn card-table__action-btn--seemore"
                          >
                            <MoreHorizontal size={13} strokeWidth={2} aria-hidden="true" />
                            <span aria-hidden="true">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
