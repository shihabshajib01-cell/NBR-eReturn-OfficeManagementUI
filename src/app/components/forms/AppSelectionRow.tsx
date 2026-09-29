import { Info } from "lucide-react";
import { useId } from "react";
import { AppCheckbox } from "./AppCheckbox";

interface AppSelectionRowProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  title: string;
  description?: string;
  code?: string;
  disabled?: boolean;
  onInfo?: () => void;
  infoLabel?: string;
  selectionControl?: boolean;
}

export function AppSelectionRow({
  checked = false,
  onChange = () => {},
  title,
  description,
  code,
  disabled,
  onInfo,
  infoLabel,
  selectionControl = true,
}: AppSelectionRowProps) {
  const id = useId();

  const content = (
    <>
      {code && <span className="app-selection-row__code">{code}</span>}
      <span className="app-selection-row__title">{title}</span>
      {description && <span className="app-selection-row__description">{description}</span>}
    </>
  );

  return (
    <div className={`app-selection-row${disabled ? " app-selection-row--disabled" : ""}${!selectionControl ? " app-selection-row--static" : ""}`}>
      {selectionControl && (
        <AppCheckbox
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          ariaLabel={title}
        />
      )}
      {selectionControl ? (
        <label htmlFor={id} className="app-selection-row__content">
          {content}
        </label>
      ) : (
        <div className="app-selection-row__content">
          {content}
        </div>
      )}
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
