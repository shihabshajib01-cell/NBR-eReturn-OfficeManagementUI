import { useRef, type Ref, type RefObject } from "react";
import { InputBase } from "@mui/material";
import { Search, X } from "lucide-react";

interface AppSearchFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
  onFocus?: () => void;
  onBlur?: () => void;
  size?: "compact" | "standard";
  clearable?: boolean;
}

const HEIGHT = { compact: "36px", standard: "48px" };
const FONT = { compact: "13px", standard: "14px" };
const PAD = { compact: "0 10px 0 32px", standard: "0 12px 0 40px" };
const ICON = { compact: 13, standard: 15 };
const ICON_LEFT = { compact: "10px", standard: "12px" };

export function AppSearchField({
  value,
  onChange,
  placeholder,
  label,
  className = "",
  inputRef: externalRef,
  onFocus,
  onBlur,
  size = "compact",
  clearable = true,
}: AppSearchFieldProps) {
  const internalRef = useRef<HTMLInputElement>(null);
  const ref = (externalRef ?? internalRef) as RefObject<HTMLInputElement>;

  const handleClear = () => {
    onChange("");
    ref.current?.focus();
  };

  return (
    <div
      className={className}
      style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}
    >
      <Search
        size={ICON[size]}
        strokeWidth={2}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: ICON_LEFT[size],
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--color-text-secondary)",
          opacity: 0.65,
          pointerEvents: "none",
          flexShrink: 0,
          zIndex: 1,
        }}
      />

      <InputBase
        inputRef={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder ?? label}
        inputProps={{
          "aria-label": label,
          type: "search",
          autoComplete: "off",
          spellCheck: false,
        }}
        sx={{
          width: "100%",
          height: HEIGHT[size],
          fontSize: FONT[size],
          color: "var(--color-text-primary)",
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
          padding: value && clearable ? `0 32px 0 ${size === "compact" ? "32px" : "40px"}` : PAD[size],
          transition: "border-color 150ms var(--ease-standard), box-shadow 150ms var(--ease-standard)",
          "& input": {
            padding: 0,
            "&::placeholder": { color: "var(--color-text-secondary)", opacity: 0.65 },
            "&::-webkit-search-cancel-button": { display: "none" },
          },
          "&.Mui-focused": {
            borderColor: "var(--color-primary)",
            borderWidth: "1.5px",
            boxShadow: "0 0 0 3px var(--color-primary-alpha-10)",
          },
          "&:hover:not(.Mui-focused)": {
            borderColor: "var(--color-text-primary)",
          },
        }}
      />

      {clearable && value && (
        <button
          type="button"
          onClick={handleClear}
          tabIndex={-1}
          aria-label="Clear search"
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
            padding: "2px",
            borderRadius: "50%",
            opacity: 0.7,
          }}
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
