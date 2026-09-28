import { memo, useMemo, useCallback } from "react";
import { StatusBadge } from "../badges/StatusBadge";
import type { ColDef, RowAction, TableRow, TableCellValue } from "../../pages/modulePageUtils";
import { isAttachmentArray } from "../attachments/attachmentTypes";
import { useTranslation } from "react-i18next";

// Support both report columns and standard columns
type ReportCol =
  | { type: "simple"; key: string; label: string }
  | { type: "group"; label: string; children: { key: string; label: string }[] };

interface UnifiedMobileCardProps {
  row: TableRow;
  cols?: ColDef[];
  columns?: ReportCol[];
  onCardClick?: () => void;
  hasActions?: boolean;
  onView?: (row: TableRow, trigger: HTMLElement) => void;
  actions?: RowAction[];
  onActionClick?: (actionId: string) => void;
  clickableKeys?: string[];
  onCellClick?: (key: string, value: string, row: TableRow) => void;
  mobileCardMapping?: {
    primary?: string;
    identifier?: string;
    meta?: string[];
    status?: string;
    date?: string;
    amount?: string;
  };
}

interface FieldData {
  key: string;
  label: string;
  value: TableCellValue;
}

const hasValue = (val: unknown): boolean => {
  if (val === null || val === undefined || val === "" || val === "—") return false;
  if (isAttachmentArray(val)) return false; // skip attachment arrays in mobile cards
  return true;
};

export const UnifiedMobileCard = memo(function UnifiedMobileCard({
  row,
  cols,
  columns,
  onCardClick,
  actions,
  onActionClick,
  clickableKeys,
  onCellClick,
  mobileCardMapping,
}: UnifiedMobileCardProps) {
  const { t: translateActions } = useTranslation("actions");
  const { t: translateTables }  = useTranslation("tables");

  // Resolve translated label from headerKey, falling back to static label
  const resolveLabel = useCallback((label: string, headerKey?: string): string => {
    if (!headerKey) return label;
    const translated = translateTables(headerKey);
    return translated && translated !== headerKey ? translated : label;
  }, [translateTables]);

  const combinedFields = useMemo<FieldData[]>(() => {
    const allFields: FieldData[] = (cols ?? []).flatMap(col => {
      if (col.type === "col") {
        return [{ key: col.col.key, label: resolveLabel(col.col.label, col.col.headerKey), value: row[col.col.key] }];
      }
      return col.group.cols.map(c => ({ key: c.key, label: resolveLabel(c.label, c.headerKey), value: row[c.key] }));
    }).filter(f => hasValue(f.value));

    const reportFields: FieldData[] = (columns ?? []).flatMap(col => {
      if (col.type === "simple") {
        return [{ key: col.key, label: col.label, value: row[col.key] }];
      }
      return col.children.map(c => ({ key: c.key, label: c.label, value: row[c.key] }));
    }).filter(f => hasValue(f.value));

    return [...allFields, ...reportFields];
  }, [cols, columns, row, resolveLabel]);

  const findField = useCallback((
    patterns: string[],
    exclude: (FieldData | undefined)[] = []
  ): FieldData | undefined => {
    const excl = new Set(exclude.filter(Boolean).map(f => f!.key));
    return combinedFields.find(f =>
      !excl.has(f.key) &&
      patterns.some(p => f.key === p || f.key.includes(p))
    );
  }, [combinedFields]);

  const { nameField, identifierField, metaFields, statusField, dateField, amountField } =
    useMemo(() => {
      let nameField: FieldData | undefined;
      let identifierField: FieldData | undefined;
      let metaFields: FieldData[] = [];
      let statusField: FieldData | undefined;
      let dateField: FieldData | undefined;
      let amountField: FieldData | undefined;

      if (mobileCardMapping) {
        if (mobileCardMapping.primary)
          nameField = combinedFields.find(f => f.key === mobileCardMapping.primary);
        if (mobileCardMapping.identifier)
          identifierField = combinedFields.find(f => f.key === mobileCardMapping.identifier);
        if (mobileCardMapping.meta?.length)
          metaFields = mobileCardMapping.meta
            .map(key => combinedFields.find(f => f.key === key))
            .filter(Boolean) as FieldData[];
        if (mobileCardMapping.status)
          statusField = combinedFields.find(f => f.key === mobileCardMapping.status);
        if (mobileCardMapping.date)
          dateField = combinedFields.find(f => f.key === mobileCardMapping.date);
        if (mobileCardMapping.amount)
          amountField = combinedFields.find(f => f.key === mobileCardMapping.amount);
      }

      if (!nameField) {
        nameField = findField([
          "taxpayer_name", "business_name", "name", "user_name", "recipient", "category",
          "requested_by", "submitted_by", "issued_to", "audit_officer", "transferred_by",
          "applicant_name", "requester_name", "officer_name", "employee_name",
        ]);
      }
      if (!identifierField) {
        identifierField = findField([
          "tin", "user_id", "employee_id", "psr_no", "case_no", "cert_no", "demand_no",
          "refund_no", "appeal_no", "tribunal_no", "entry_no", "book_no", "selection_no",
          "request_no", "reg_no", "ref_no", "challan_no", "registration_no", "tracking_no",
          "certificate_no", "register_no", "id",
        ], [nameField]);
      }
      if (metaFields.length === 0) {
        const ayField = findField(["ay", "assessment_year", "ay_for_audit", "year", "period"], [nameField, identifierField]);
        const contextField = findField([
          "circle", "return_type", "case_type", "cert_type", "request_type", "type",
          "extension_type", "selection_method", "book_type", "appeal_ground",
          "business_type", "reg_type", "transfer_status", "bank_name", "bench",
          "designation", "role", "level", "zone", "priority", "method", "category_type",
        ], [nameField, identifierField, ayField]);
        const extraField = findField([
          "officer", "assigned_to", "requested_by", "submitted_by", "issued_to",
          "court", "hearing_date", "original_deadline", "due_date", "bench",
        ], [nameField, identifierField, ayField, contextField]);
        metaFields = [ayField, contextField, extraField].filter(Boolean) as FieldData[];
      }
      if (!statusField)
        statusField = combinedFields.find(f => f.key === "status" || f.key.endsWith("_status"));
      if (!dateField) {
        dateField = findField([
          "submission_date", "request_date", "case_date", "issue_date",
          "demand_date", "refund_date", "appeal_date", "tribunal_date",
          "entry_date", "transfer_date", "selected_date", "disposal_date",
          "reg_date", "registration_date", "archive_date", "detected_date",
          "misfiled_date", "reported_date", "last_updated", "last_active",
          "transaction_date", "original_deadline", "hearing_date", "last_login",
          "created_date", "payment_date", "date",
        ], [statusField, amountField]);
      }
      if (!amountField) {
        amountField = findField([
          "amount", "total_amount", "tax_paid", "revenue", "demand", "payment",
          "tax_amount", "refund_amount", "demand_amount", "paid_amount",
          "outstanding", "debit", "credit", "balance",
        ], [statusField, dateField]);
      }

      return { nameField, identifierField, metaFields, statusField, dateField, amountField };
    }, [combinedFields, mobileCardMapping, findField]);

  const renderFieldValue = useCallback((field: FieldData, kind: "text" | "status" = "text") => {
    const value = String(field.value);
    const content = kind === "status" ? <StatusBadge value={value} /> : value;
    if (!clickableKeys?.includes(field.key) || !onCellClick) return content;
    return (
      <button
        type="button"
        className={`mobile-table-card__field-link${kind === "status" ? " mobile-table-card__field-link--badge" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onCellClick(field.key, value, row);
        }}
        aria-label={`Explain ${field.label}: ${value}`}
      >
        {content}
      </button>
    );
  }, [clickableKeys, onCellClick, row]);

  const metaRows = useMemo(
    () => [identifierField, ...metaFields].filter(Boolean).slice(0, 5) as FieldData[],
    [identifierField, metaFields]
  );

  const primaryName = nameField ?? identifierField;
  const displayMeta = nameField ? metaRows : metaRows.filter(f => f !== identifierField);
  const footerRight = dateField ?? amountField;
  const hasFooter = !!(statusField || footerRight);

  const cardLabel = [primaryName?.value, identifierField?.value]
    .filter(Boolean).join(" — ") || undefined;

  const handleCardKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (onCardClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onCardClick();
    }
  }, [onCardClick]);

  return (
    <article
      role="listitem"
      className="mobile-table-card"
      aria-label={cardLabel}
      onClick={onCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={onCardClick ? 0 : undefined}
    >
      <div className="mobile-table-card__header">
        <div className="mobile-table-card__primary-info">
          {primaryName && (
            <p className="mobile-table-card__name">
              {renderFieldValue(primaryName)}
            </p>
          )}
          {displayMeta.length > 0 && (
            <dl className="mobile-table-card__meta">
              {displayMeta.map(f => (
                <div key={f.key} className="mobile-table-card__meta-item">
                  <dt className="mobile-table-card__meta-label">{f.label}:</dt>
                  <dd className="mobile-table-card__meta-value">{renderFieldValue(f)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {hasFooter && (
        <>
          <div className="mobile-table-card__divider" aria-hidden="true" />
          <div className="mobile-table-card__footer">
            <div className="mobile-table-card__status">
              {statusField && renderFieldValue(statusField, "status")}
            </div>
            {footerRight && (
              <span className="mobile-table-card__date">
                <span className="sr-only">{footerRight.label}: </span>
                {renderFieldValue(footerRight)}
              </span>
            )}
          </div>
        </>
      )}

      {actions && actions.length > 0 && onActionClick && (
        <>
          <div className="mobile-table-card__divider" aria-hidden="true" />
          <div className="mobile-table-card__actions-row">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="mobile-table-card__action-btn"
                onClick={(e) => { e.stopPropagation(); onActionClick(action.id); }}
              >
                {action.id === "view" ? translateActions("viewDetails") : action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </article>
  );
});
