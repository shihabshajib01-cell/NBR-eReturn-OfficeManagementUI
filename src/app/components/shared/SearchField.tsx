import { AppSearchField } from "../forms/AppSearchField";

interface SearchFieldProps {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  /** aria-label */
  label: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  clearable?: boolean;
}

export function SearchField({
  value = "",
  onChange,
  placeholder,
  label,
  className = "",
  onFocus,
  onBlur,
  clearable = true,
}: SearchFieldProps) {
  return (
    <AppSearchField
      value={value}
      onChange={(v) => onChange?.(v)}
      placeholder={placeholder}
      label={label}
      className={className}
      onFocus={onFocus}
      onBlur={onBlur}
      clearable={clearable}
      size="compact"
    />
  );
}
