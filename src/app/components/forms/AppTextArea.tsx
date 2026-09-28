import { TextField } from "@mui/material";
import { muiFieldSx } from "./muiFieldSx";

interface AppTextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export function AppTextArea({
  id, label, value, onChange, placeholder, helper, error,
  required, disabled, rows = 3,
}: AppTextAreaProps) {
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      helperText={error || helper}
      error={!!error}
      required={required}
      disabled={disabled}
      multiline
      minRows={rows}
      maxRows={8}
      variant="outlined"
      fullWidth
      inputProps={{
        "aria-required": required ? "true" : undefined,
        "aria-describedby": (error || helper) ? `${id}-helper` : undefined,
        "aria-invalid": !!error || undefined,
      }}
      FormHelperTextProps={{ id: `${id}-helper` }}
      sx={muiFieldSx}
    />
  );
}
