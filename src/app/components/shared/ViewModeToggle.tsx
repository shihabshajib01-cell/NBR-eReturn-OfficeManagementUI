import { List, LayoutGrid } from "lucide-react";

export type ViewMode = "table" | "card";

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  tableLabel: string;
  cardLabel: string;
  groupLabel: string;
}

export function ViewModeToggle({ value, onChange, tableLabel, cardLabel, groupLabel }: ViewModeToggleProps) {
  return (
    <div role="group" aria-label={groupLabel} className="view-mode-toggle">
      <button
        type="button"
        className={`view-mode-toggle__btn${value === "table" ? " view-mode-toggle__btn--active" : ""}`}
        aria-pressed={value === "table"}
        onClick={() => onChange("table")}
        title={tableLabel}
      >
        <List size={13} strokeWidth={2} aria-hidden="true" />
        <span className="view-mode-toggle__label">{tableLabel}</span>
      </button>
      <button
        type="button"
        className={`view-mode-toggle__btn${value === "card" ? " view-mode-toggle__btn--active" : ""}`}
        aria-pressed={value === "card"}
        onClick={() => onChange("card")}
        title={cardLabel}
      >
        <LayoutGrid size={13} strokeWidth={2} aria-hidden="true" />
        <span className="view-mode-toggle__label">{cardLabel}</span>
      </button>
    </div>
  );
}
