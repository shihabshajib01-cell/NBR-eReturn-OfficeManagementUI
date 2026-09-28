import { TextField } from "@mui/material";
import { muiFieldSx, muiFilterSx } from "./muiFieldSx";
import { AppDatePicker } from "./AppDatePicker";

interface AppDateFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** compact=true → size="small" (filters). Default → MUI normal size (forms). */
  compact?: boolean;
  /** customPicker=true → DD/MM/YYYY display with custom calendar, stores YYYY-MM-DD */
  customPicker?: boolean;
  /** maxDate → disable dates after this YYYY-MM-DD value (custom picker only) */
  maxDate?: string;
  /** mobileLabel → shorter label shown on screens ≤768px; full label stays as accessible name */
  mobileLabel?: string;
  /** mobileSheet → open calendar in ResponsiveOverlay bottom sheet on mobile (custom picker only) */
  mobileSheet?: boolean;
}

export function AppDateField({
  id, label, value, onChange, helper, error, required, disabled, compact,
  customPicker, maxDate, mobileLabel, mobileSheet,
}: AppDateFieldProps) {
  if (customPicker) {
    return (
      <AppDatePicker
        id={id}
        label={label}
        mobileLabel={mobileLabel}
        mobileSheet={mobileSheet}
        value={value}
        onChange={onChange}
        helper={helper}
        error={error}
        required={required}
        disabled={disabled}
        maxDate={maxDate}
      />
    );
  }

  return (
    <TextField
      id={id}
      type="date"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      helperText={error || helper}
      error={!!error}
      required={required}
      disabled={disabled}
      variant="outlined"
      size={compact ? "small" : undefined}
      fullWidth
      InputLabelProps={{ shrink: true }}
      inputProps={{
        "aria-required": required ? "true" : undefined,
        "aria-describedby": (error || helper) ? `${id}-helper` : undefined,
        "aria-invalid": !!error || undefined,
        max: maxDate,
      }}
      FormHelperTextProps={{ id: `${id}-helper` }}
      sx={compact ? muiFilterSx : muiFieldSx}
    />
  );
}
