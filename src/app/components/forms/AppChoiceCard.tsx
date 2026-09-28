import { Check } from "lucide-react";
import { useId } from "react";

interface AppChoiceCardProps {
  name: string;
  value: string;
  title: string;
  description?: string;
  selected: boolean;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function AppChoiceCard({
  name,
  value,
  title,
  description,
  selected,
  onSelect,
  disabled,
}: AppChoiceCardProps) {
  const generatedId = useId();
  const id = `${name}-${generatedId}`;

  return (
    <label
      htmlFor={id}
      className={[
        "app-choice-card",
        selected ? "app-choice-card--selected" : "",
        disabled ? "app-choice-card--disabled" : "",
      ].filter(Boolean).join(" ")}
    >
      <input
        id={id}
        className="app-choice-card__input"
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        disabled={disabled}
      />
      <span className="app-choice-card__content">
        <strong className="app-choice-card__title">{title}</strong>
        {description && <span className="app-choice-card__description">{description}</span>}
      </span>
      <span className="app-choice-card__check" aria-hidden="true">
        {selected && <Check size={11} strokeWidth={3} />}
      </span>
    </label>
  );
}
