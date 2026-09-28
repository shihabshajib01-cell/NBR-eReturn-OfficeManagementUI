import { TextField, MenuItem } from "@mui/material";
import { muiFieldSx, muiFilterSx } from "./muiFieldSx";

interface SelectOption {
  value: string;
  label: string;
}

interface AppSelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[] | string[];
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** compact=true → size="small" (filters, topbar). Default → MUI normal size (forms). */
  compact?: boolean;
}

export function AppSelectField({
  id, label, value, onChange, options, helper, error,
  required, disabled, compact,
}: AppSelectFieldProps) {
  const normalized: SelectOption[] = options.map(o =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  return (
    <TextField
      id={id}
      select
      label={label || undefined}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      helperText={error || helper}
      error={!!error}
      required={required}
      disabled={disabled}
      variant="outlined"
      size={compact ? "small" : undefined}
      fullWidth
      inputProps={{
        "aria-required": required ? "true" : undefined,
        "aria-describedby": (error || helper) ? `${id}-helper` : undefined,
        "aria-invalid": !!error || undefined,
        "aria-label": !label ? id : undefined,
      }}
      FormHelperTextProps={{ id: `${id}-helper` }}
      sx={compact ? muiFilterSx : muiFieldSx}
    >
      {normalized.map(o => (
        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
      ))}
    </TextField>
  );
}
