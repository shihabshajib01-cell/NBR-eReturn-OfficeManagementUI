import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AppliedFilterChipsProps {
  values: Record<string, string>;
  onClear: () => void;
  inCard?: boolean;
}

export function AppliedFilterChips({ values, onClear, inCard }: AppliedFilterChipsProps) {
  const { t: translateFilters } = useTranslation("filters");
  const active = Object.entries(values).filter(([, v]) => v && !v.startsWith("All"));
  if (!active.length) return null;

  return (
    <div className={`applied-chips${inCard ? " applied-chips--in-card" : ""}`}>
      <span className="applied-chips__label">{translateFilters("filteredBy")}</span>
      {active.map(([k, v]) => (
        <span key={k} className="applied-chips__tag">{v}</span>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="applied-chips__clear"
        aria-label={translateFilters("buttons.reset")}
      >
        <X size={12} aria-hidden="true" />
        {translateFilters("buttons.reset")}
      </button>
    </div>
  );
}
