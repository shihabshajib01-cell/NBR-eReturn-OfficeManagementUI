import { TAX_ZONES } from "../../data/taxZones";
import { AppSelectField } from "./AppSelectField";

interface TaxZoneSelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  allOptionValue?: string;
  allOptionLabel?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  compact?: boolean;
}

export function TaxZoneSelectField({
  id,
  label,
  value,
  onChange,
  allOptionValue,
  allOptionLabel,
  helper,
  error,
  required,
  disabled,
  compact,
}: TaxZoneSelectFieldProps) {
  const legacyValue =
    value &&
    value !== allOptionValue &&
    !TAX_ZONES.includes(value)
      ? [{ value, label: value }]
      : [];

  const options = [
    ...(allOptionValue
      ? [{ value: allOptionValue, label: allOptionLabel ?? allOptionValue }]
      : []),
    ...legacyValue,
    ...TAX_ZONES.map(zone => ({ value: zone, label: zone })),
  ];

  return (
    <AppSelectField
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      helper={helper}
      error={error}
      required={required}
      disabled={disabled}
      compact={compact}
    />
  );
}
