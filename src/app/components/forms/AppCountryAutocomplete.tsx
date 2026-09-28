import { useMemo, useState, useRef, useEffect } from "react";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import { Search, ChevronDown, Check } from "lucide-react";
import { muiFieldSx } from "./muiFieldSx";
import { buildCountryOptions, type CountryCode, type CountryOption } from "../../data/countryOptions";
import { ResponsiveOverlay } from "../shared/ResponsiveOverlay";

interface AppCountryAutocompleteProps {
  id: string;
  label: string;
  value: CountryCode | "";
  language: "en" | "bn";
  onChange: (country: CountryOption | null) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  disablePortal?: boolean;
  placeholder?: string;
  noOptionsText?: string;
  /** Enable mobile bottom-sheet picker. Desktop keeps MUI Autocomplete. */
  mobileSheet?: boolean;
  /** Country ISO2 codes to exclude from selection and search. */
  excludedCountryCodes?: CountryCode[];
}

export function AppCountryAutocomplete({
  id,
  label,
  value,
  language,
  onChange,
  error,
  required,
  disabled,
  disablePortal = false,
  placeholder,
  noOptionsText = "—",
  mobileSheet,
  excludedCountryCodes,
}: AppCountryAutocompleteProps) {
  const allOptions = useMemo(() => buildCountryOptions(language), [language]);

  const options = useMemo(() => {
    if (!excludedCountryCodes?.length) return allOptions;
    const set = new Set(excludedCountryCodes);
    return allOptions.filter(o => !set.has(o.iso2 as CountryCode));
  }, [allOptions, excludedCountryCodes]);

  const selected = useMemo(
    () => options.find(o => o.iso2 === value) ?? null,
    [options, value],
  );

  const [inputValue, setInputValue] = useState("");

  // Mobile detection (1023px matches ResponsiveOverlay breakpoint)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 1023px)").matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSearch, setSheetSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sheetOpen) {
      setSheetSearch("");
      const timer = setTimeout(() => searchRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [sheetOpen]);

  const filteredSheet = useMemo(() => {
    const norm = sheetSearch.trim().toLowerCase().replace(/^\+/, "");
    if (!norm) return options;
    return options.filter(opt =>
      opt.localizedName.toLowerCase().includes(norm) ||
      opt.englishName.toLowerCase().includes(norm) ||
      opt.iso2.toLowerCase() === norm ||
      opt.dialCode.replace(/^\+/, "").startsWith(norm),
    );
  }, [options, sheetSearch]);

  const showMobileSheet = mobileSheet && isMobile;

  if (showMobileSheet) {
    return (
      <>
        {/* Trigger field — read-only, opens the sheet */}
        <TextField
          id={id}
          label={label}
          value={selected ? selected.localizedName : ""}
          onClick={() => !disabled && setSheetOpen(true)}
          required={required}
          error={!!error}
          helperText={error}
          disabled={disabled}
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: !!selected || sheetOpen || undefined }}
          inputProps={{
            readOnly: true,
            "aria-required": required ? "true" : undefined,
            "aria-invalid": !!error || undefined,
            "aria-describedby": error ? `${id}-helper` : undefined,
            "aria-haspopup": "dialog",
            "aria-expanded": sheetOpen,
            style: { cursor: disabled ? "not-allowed" : "pointer" },
          }}
          InputProps={{
            startAdornment: selected ? (
              <span className="app-country-value">
                <span className="app-country-value__flag" aria-hidden="true">{selected.flag}</span>
              </span>
            ) : (
              <InputAdornment position="start" className="app-country-search-icon">
                <Search size={16} aria-hidden="true" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" style={{ pointerEvents: "none" }}>
                <ChevronDown size={16} color="var(--color-text-secondary)" />
              </InputAdornment>
            ),
          }}
          FormHelperTextProps={{ id: `${id}-helper` }}
          sx={muiFieldSx}
        />

        <ResponsiveOverlay
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title={label}
          closeLabel="Close"
          mobileMaxHeight="90dvh"
          className="app-country-sheet"
        >
          {/* Search */}
          <div className="app-country-sheet__search-wrap">
            <TextField
              inputRef={searchRef}
              size="small"
              placeholder={placeholder ?? "Search…"}
              value={sheetSearch}
              onChange={e => setSheetSearch(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={15} aria-hidden="true" />
                  </InputAdornment>
                ),
              }}
              sx={muiFieldSx}
            />
          </div>

          {/* Country list */}
          <ul
            className="app-country-sheet__list"
            role="listbox"
            aria-label={label}
          >
            {filteredSheet.length === 0 ? (
              <li className="app-country-sheet__empty">{noOptionsText}</li>
            ) : (
              filteredSheet.map(opt => {
                const isSel = opt.iso2 === value;
                return (
                  <li
                    key={opt.iso2}
                    role="option"
                    aria-selected={isSel}
                    className={`app-country-sheet__item${isSel ? " app-country-sheet__item--selected" : ""}`}
                    onClick={() => {
                      onChange(opt);
                      setSheetOpen(false);
                    }}
                  >
                    <span className="app-country-sheet__flag" aria-hidden="true">{opt.flag}</span>
                    <span className="app-country-sheet__name">{opt.localizedName}</span>
                    <span className="app-country-sheet__dial">{opt.dialCode}</span>
                    {isSel && (
                      <Check size={16} strokeWidth={2.5} className="app-country-sheet__check" aria-hidden="true" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </ResponsiveOverlay>
      </>
    );
  }

  // Desktop: existing MUI Autocomplete with excluded-country filter applied
  return (
    <Autocomplete<CountryOption>
      id={id}
      options={options}
      value={selected}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      disabled={disabled}
      disablePortal={disablePortal}
      autoHighlight
      openOnFocus
      selectOnFocus
      clearOnBlur={false}
      getOptionLabel={opt => opt.localizedName}
      isOptionEqualToValue={(opt, val) => opt.iso2 === val.iso2}
      filterOptions={(opts, { inputValue: q }) => {
        const norm = q.trim().toLowerCase().replace(/^\+/, "");
        if (!norm) return opts;
        return opts.filter(opt =>
          opt.localizedName.toLowerCase().includes(norm) ||
          opt.englishName.toLowerCase().includes(norm) ||
          opt.iso2.toLowerCase() === norm ||
          opt.dialCode.replace(/^\+/, "").startsWith(norm)
        );
      }}
      onChange={(_, newVal) => {
        onChange(newVal);
        setInputValue(newVal ? newVal.localizedName : "");
      }}
      noOptionsText={noOptionsText}
      ListboxProps={{ style: { maxHeight: 280 } }}
      renderOption={(props, opt) => {
        const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
        return (
          <li key={key} {...rest}>
            <span className="app-country-option">
              <span className="app-country-option__flag" aria-hidden="true">{opt.flag}</span>
              <span className="app-country-option__name">{opt.localizedName}</span>
              <span className="app-country-option__dial-code">{opt.dialCode}</span>
            </span>
          </li>
        );
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={!!error}
          helperText={error}
          variant="outlined"
          placeholder={!selected ? placeholder : undefined}
          inputProps={{
            ...params.inputProps,
            "aria-required": required ? "true" : undefined,
            "aria-invalid": !!error || undefined,
            "aria-describedby": error ? `${id}-helper` : undefined,
          }}
          FormHelperTextProps={{ id: `${id}-helper` }}
          InputProps={{
            ...params.InputProps,
            startAdornment: selected ? (
              <>
                <span className="app-country-value">
                  <span className="app-country-value__flag" aria-hidden="true">{selected.flag}</span>
                </span>
                {params.InputProps.startAdornment}
              </>
            ) : (
              <>
                <InputAdornment position="start" className="app-country-search-icon">
                  <Search size={16} aria-hidden="true" />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
          sx={muiFieldSx}
        />
      )}
    />
  );
}
