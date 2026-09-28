import { TextField } from "@mui/material";
import { muiFieldSx, muiFilterSx } from "./muiFieldSx";

interface AppNumberFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  min?: number;
  max?: number;
  step?: number;
  /** compact=true → size="small" (filters). Default → MUI normal size (forms). */
  compact?: boolean;
}

export function AppNumberField({
  id, label, value, onChange, placeholder, helper, error,
  required, disabled, readOnly, min, max, step, compact,
}: AppNumberFieldProps) {
  return (
    <TextField
      id={id}
      type="number"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      helperText={error || helper}
      error={!!error}
      required={required}
      disabled={disabled}
      variant="outlined"
      size={compact ? "small" : undefined}
      fullWidth
      inputProps={{
        readOnly,
        min,
        max,
        step,
        "aria-required": required ? "true" : undefined,
        "aria-describedby": (error || helper) ? `${id}-helper` : undefined,
        "aria-invalid": !!error || undefined,
      }}
      FormHelperTextProps={{ id: `${id}-helper` }}
      sx={{
        ...(compact ? muiFilterSx : muiFieldSx),
        "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
        "& input[type=number]": { MozAppearance: "textfield" },
      }}
    />
  );
}
