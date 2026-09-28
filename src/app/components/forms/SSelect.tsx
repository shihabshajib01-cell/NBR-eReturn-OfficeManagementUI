import { TextField, MenuItem } from "@mui/material";
import { muiFieldSx } from "./muiFieldSx";

interface SSelectProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label?: string;
}

export function SSelect({ id, value, onChange, options, label }: SSelectProps) {
  return (
    <TextField
      id={id}
      select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label={label}
      variant="outlined"
      fullWidth
      InputLabelProps={{ shrink: true }}
      sx={muiFieldSx}
    >
      {options.map((o) => (
        <MenuItem key={o} value={o}>{o}</MenuItem>
      ))}
    </TextField>
  );
}
