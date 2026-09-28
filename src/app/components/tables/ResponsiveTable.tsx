import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CardTable } from "./CardTable";
import { UnifiedMobileCard } from "./UnifiedMobileCard";
import type { ColDef, RowAction, TableRow, MobileCardMapping } from "../../pages/modulePageUtils";

interface ResponsiveTableProps {
  cols: ColDef[];
  rows: TableRow[];
  actions?: RowAction[];
  onRowClick?: (row: TableRow) => void;
  onActionClick?: (actionId: string, row: TableRow) => void;
  noCard?: boolean;
  mobileCardMapping?: MobileCardMapping;
  clickableKeys?: string[];
  onCellClick?: (key: string, value: string, row: TableRow) => void;
  "aria-label"?: string;
}

export const ResponsiveTable = memo(function ResponsiveTable({
  cols,
  rows,
  actions,
  onRowClick,
  onActionClick,
  noCard,
  mobileCardMapping,
  clickableKeys,
  onCellClick,
  "aria-label": ariaLabel,
}: ResponsiveTableProps) {
  const { t: translateCommon } = useTranslation("common");

  const makeCardClick = useCallback(
    (row: TableRow) => onRowClick ? () => onRowClick(row) : undefined,
    [onRowClick]
  );

  // Effective action handler: prefer onActionClick, fall back to onRowClick
  const handleActionClick = useCallback(
    (actionId: string, row: TableRow) => {
      if (onActionClick) {
        onActionClick(actionId, row);
      } else {
        onRowClick?.(row);
      }
    },
    [onActionClick, onRowClick]
  );

  return (
    <>
      {/* Desktop table view */}
      <CardTable
        cols={cols}
        rows={rows}
        actions={actions}
        onRowClick={onRowClick}
        onActionClick={handleActionClick}
        noCard={noCard}
        clickableKeys={clickableKeys}
        onCellClick={onCellClick}
        aria-label={ariaLabel}
      />

      {/* Mobile card view */}
      <div
        className="mobile-table-card-list"
        role="list"
        aria-label={ariaLabel}
      >
        {rows.length === 0 ? (
          <p className="mobile-table-card-list__empty" role="status">
            {translateCommon("common.noRecordsFound")}
          </p>
        ) : (
          rows.map((row, index) => (
            <UnifiedMobileCard
              key={index}
              row={row}
              cols={cols}
              onCardClick={makeCardClick(row)}
              mobileCardMapping={mobileCardMapping}
              clickableKeys={clickableKeys}
              onCellClick={onCellClick}
            />
          ))
        )}
      </div>
    </>
  );
});
