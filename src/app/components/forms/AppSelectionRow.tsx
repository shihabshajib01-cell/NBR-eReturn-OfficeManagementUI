import { Info } from "lucide-react";
import { useId } from "react";
import { AppCheckbox } from "./AppCheckbox";

interface AppSelectionRowProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description?: string;
  code?: string;
  disabled?: boolean;
  onInfo?: () => void;
  infoLabel?: string;
}

export function AppSelectionRow({
  checked,
  onChange,
  title,
  description,
  code,
  disabled,
  onInfo,
  infoLabel,
}: AppSelectionRowProps) {
  const id = useId();

  return (
    <div className={`app-selection-row${disabled ? " app-selection-row--disabled" : ""}`}>
      <AppCheckbox
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        ariaLabel={title}
      />
      <label htmlFor={id} className="app-selection-row__content">
        {code && <span className="app-selection-row__code">{code}</span>}
        <span className="app-selection-row__title">{title}</span>
        {description && <span className="app-selection-row__description">{description}</span>}
      </label>
      {onInfo && (
        <button
          type="button"
          className="app-icon-btn app-icon-btn--sm app-icon-btn--default"
          onClick={onInfo}
          aria-label={infoLabel ?? `More information about ${title}`}
        >
          <Info size={14} strokeWidth={1.8} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
