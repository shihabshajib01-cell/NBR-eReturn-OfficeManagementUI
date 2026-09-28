import type { Ref } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { muiFieldSx } from "./muiFieldSx";

interface AppPhoneFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  // Optional: country prefix adornment
  prefix?: React.ReactNode;
  onBlur?: () => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  autoComplete?: string;
}

export function AppPhoneField({
  id, label, value, onChange, placeholder, helper, error,
  required, disabled, inputRef,
  prefix, onBlur, inputMode, maxLength, autoComplete = "tel",
}: AppPhoneFieldProps) {
  return (
    <TextField
      id={id}
      type="tel"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      helperText={error || helper}
      error={!!error}
      required={required}
      disabled={disabled}
      inputRef={inputRef}
      autoComplete={autoComplete}
      variant="outlined"
      fullWidth
      inputProps={{
        inputMode: inputMode ?? "numeric",
        maxLength,
        "aria-required": required ? "true" : undefined,
        "aria-describedby": (error || helper) ? `${id}-helper` : undefined,
        "aria-invalid": !!error || undefined,
      }}
      InputProps={prefix ? {
        startAdornment: (
          <InputAdornment position="start">
            <span className="sr-phone-prefix" aria-hidden="true">{prefix}</span>
          </InputAdornment>
        ),
      } : undefined}
      FormHelperTextProps={{ id: `${id}-helper` }}
      sx={muiFieldSx}
    />
  );
}
