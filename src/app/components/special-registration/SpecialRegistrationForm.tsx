import { useState, useEffect, useRef } from "react";
import {
  FormControl, FormLabel, RadioGroup,
  FormControlLabel, Radio, FormHelperText,
} from "@mui/material";
import { ChevronDown, Check, AlertTriangle } from "lucide-react";
import { AppTextField } from "../forms/AppTextField";
import { AppDateField } from "../forms/AppDateField";
import { AppPhoneField } from "../forms/AppPhoneField";
import { AppTextArea } from "../forms/AppTextArea";
import { AppCheckbox } from "../forms/AppCheckbox";
import { AppCountryAutocomplete } from "../forms/AppCountryAutocomplete";
import { SRDocumentRow } from "./SRDocumentRow";
import { type CountryCode, type CountryOption } from "../../data/countryOptions";
import { getCountryCallingCode } from "libphonenumber-js/max";
import {
  validatePhoneForCountry,
  normalizePhoneDigits,
  parsePastedPhone,
  getPhoneLengthRule,
} from "../../utils/phoneNumber";

// ── Constants ─────────────────────────────────────────────────────────────────

export const PUBLIC_ACCEPT = [".pdf", ".jpg", ".jpeg", ".png"];
export const MAX_MB = 2;

// ── Passport type ─────────────────────────────────────────────────────────────

export type PassportHolderType = "BANGLADESHI" | "FOREIGN";

// ── TIN normalization ─────────────────────────────────────────────────────────

export function normalizeIdentityDigits(value: string): string {
  const banglaDigits = "০১২৩৪৫৬৭৮৯";
  return value
    .split("")
    .map(character => {
      const index = banglaDigits.indexOf(character);
      return index >= 0 ? String(index) : character;
    })
    .join("")
    .replace(/\D/g, "");
}

export function normalizeTin(value: string): string {
  return normalizeIdentityDigits(value);
}

export function normalizeNid(value: string): string {
  return normalizeIdentityDigits(value);
}

export const VALID_NID_LENGTHS = [10, 13, 17] as const;

export function isValidNidLength(value: string): boolean {
  return (VALID_NID_LENGTHS as readonly number[]).includes(value.length);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Form state ────────────────────────────────────────────────────────────────

export interface FormState {
  fullName: string;
  nidNumber: string;
  tin: string;
  passportType: PassportHolderType | "";
  countryCode: CountryCode | "";
  country: string;
  address: string;
  phoneNational: string;
  departureDate: string;
  email: string;
  nidFiles: File[];
  passportFiles: File[];
  visaFiles: File[];
  departureFiles: File[];
  declaration: boolean;
}

export const INITIAL_FORM: FormState = {
  fullName: "",
  nidNumber: "",
  tin: "",
  passportType: "",
  countryCode: "",
  country: "",
  address: "",
  phoneNational: "",
  departureDate: "",
  email: "",
  nidFiles: [],
  passportFiles: [],
  visaFiles: [],
  departureFiles: [],
  declaration: false,
};

export type FieldErrors = Partial<Record<keyof FormState, string>>;

// ── Shared validator ──────────────────────────────────────────────────────────

export function validateSpecialRegistrationForm(
  form: FormState,
  t: (k: string, opts?: Record<string, unknown>) => string,
  options: { requireDeclaration: boolean },
): FieldErrors {
  const errs: FieldErrors = {};
  const req = t("validation.required");

  if (!form.fullName.trim()) errs.fullName = req;
  else if (form.fullName.trim().length > 120) errs.fullName = t("validation.nameMaxLength");

  if (!form.nidNumber) {
    errs.nidNumber = req;
  } else if (!isValidNidLength(form.nidNumber)) {
    errs.nidNumber = t("validation.nidFormat");
  }

  if (!form.tin) errs.tin = req;
  else if (form.tin.length !== 12) errs.tin = t("validation.tinFormat");

  if (!form.passportType) errs.passportType = t("validation.passportTypeRequired");

  if (!form.countryCode) {
    errs.countryCode = req;
  } else if (form.countryCode === "BD") {
    errs.countryCode = t("validation.countryBDExcluded");
  }

  // Phone validation
  const phoneResult = validatePhoneForCountry(
    form.phoneNational,
    form.countryCode,
    t,
    form.country,
    form.countryCode ? `+${getCountryCallingCode(form.countryCode as import("libphonenumber-js/max").CountryCode)}` : undefined,
  );
  if (!phoneResult.ok) errs.phoneNational = phoneResult.error;

  if (!form.address.trim()) errs.address = req;

  if (!form.departureDate) {
    errs.departureDate = req;
  } else if (form.departureDate > todayDateString()) {
    errs.departureDate = t("validation.departureFuture");
  }

  const emailTrimmed = form.email.trim();
  if (!emailTrimmed) {
    errs.email = req;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
    errs.email = t("validation.emailFormat");
  }

  if (form.nidFiles.length === 0)       errs.nidFiles       = t("validation.documentRequired");
  if (form.passportFiles.length === 0)  errs.passportFiles  = t("validation.documentRequired");
  if (form.departureFiles.length === 0) errs.departureFiles = t("validation.documentRequired");

  if (options.requireDeclaration && !form.declaration) {
    errs.declaration = t("validation.declarationRequired");
  }

  return errs;
}

// ── applicationToFormState ────────────────────────────────────────────────────

export function applicationToFormState(params: {
  applicantName: string;
  nidNumber: string;
  tin: string;
  passportType: PassportHolderType | "";
  countryCode: CountryCode | "";
  country: string;
  address: string;
  phoneNational: string;
  departureDate: string;
  email: string;
  nidFiles: File[];
  passportFiles: File[];
  visaFiles: File[];
  departureFiles: File[];
}): FormState {
  return {
    fullName:       params.applicantName,
    nidNumber:      params.nidNumber,
    tin:            params.tin,
    passportType:   params.passportType,
    countryCode:    params.countryCode,
    country:        params.country,
    address:        params.address,
    phoneNational:  params.phoneNational,
    departureDate:  params.departureDate,
    email:          params.email,
    nidFiles:       params.nidFiles,
    passportFiles:  params.passportFiles,
    visaFiles:      params.visaFiles,
    departureFiles: params.departureFiles,
    declaration:    true,
  };
}

// ── Section → field mapping for auto-expand on error ─────────────────────────

const SECTION_FIELDS: Record<string, (keyof FormState)[]> = {
  taxpayer:  ["fullName", "nidNumber", "tin"],
  overseas:  ["passportType", "countryCode", "phoneNational", "address", "departureDate", "email"],
  documents: ["nidFiles", "passportFiles", "departureFiles"],
};

// ── CollapsibleFormSection ────────────────────────────────────────────────────

interface CollapsibleFormSectionProps {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleFormSection({ id, title, open, onToggle, children }: CollapsibleFormSectionProps) {
  return (
    <div className="sr-form-section">
      <button
        type="button"
        className="sr-form-section__toggle"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-body`}
      >
        <span className="sr-form-section__title">{title}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`sr-form-section__chevron${open ? " sr-form-section__chevron--open" : ""}`}
        />
      </button>
      {open && (
        <div id={`${id}-body`} className="sr-form-section__body" role="region" aria-label={title}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface SpecialRegistrationFormProps {
  form: FormState;
  errors: FieldErrors;
  onChange: (field: keyof FormState, value: string | boolean | File[]) => void;
  onFilesChange: (
    field: "nidFiles" | "passportFiles" | "visaFiles" | "departureFiles",
    files: File[]
  ) => void;
  onDeclarationChange: (value: boolean) => void;
  onCountryChange: (country: CountryOption | null) => void;
  submitError?: string;
  isAdminMode?: boolean;
  resetKey?: string | number;
  language?: "en" | "bn";
  t: (key: string) => string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SpecialRegistrationForm({
  form,
  errors,
  onChange,
  onFilesChange,
  onDeclarationChange,
  onCountryChange,
  submitError,
  isAdminMode,
  resetKey,
  language = "en",
  t,
}: SpecialRegistrationFormProps) {
  type SectionKey = "taxpayer" | "overseas" | "documents";

  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    taxpayer: true, overseas: true, documents: true,
  });

  const passportTypeFirstRadioRef = useRef<HTMLInputElement>(null);

  // Clear stale Bangladesh selection on public-form mount (BD is excluded from SR)
  useEffect(() => {
    if (!isAdminMode && form.countryCode === "BD") {
      onCountryChange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-expand sections that contain errors; focus first radio on passportType error
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    setOpen(prev => {
      const next = { ...prev };
      for (const [section, fields] of Object.entries(SECTION_FIELDS)) {
        if (fields.some(f => errors[f as keyof FormState])) {
          next[section as SectionKey] = true;
        }
      }
      return next;
    });
    if (errors.passportType) {
      setTimeout(() => passportTypeFirstRadioRef.current?.focus(), 80);
    }
  }, [errors]);

  // Reopen all sections when resetKey changes (Submit Another)
  useEffect(() => {
    if (resetKey === undefined) return;
    setOpen({ taxpayer: true, overseas: true, documents: true });
  }, [resetKey]);

  const toggle = (key: SectionKey) =>
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  // Build phone prefix
  const phonePrefix = form.countryCode ? (
    <>{form.countryCode ? `${getFlag(form.countryCode)} +${getDialCode(form.countryCode)}` : ""}</>
  ) : null;

  const [phoneLengthError, setPhoneLengthError] = useState<string>("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  const revalidatePhone = (national: string, countryCode: string, countryNameOverride?: string) => {
    const name = countryNameOverride ?? form.country;
    const dial = countryCode ? `+${getDialCode(countryCode)}` : undefined;
    const result = validatePhoneForCountry(national, countryCode as CountryCode, t, name, dial);
    setPhoneLengthError(result.ok ? "" : result.error);
  };

  // Handle phone input — normalize digits, handle paste with international numbers
  const handlePhoneChange = (raw: string) => {
    let normalized: string;
    if (raw.startsWith("+") && form.countryCode) {
      const { nationalNumber, countryMatch } = parsePastedPhone(raw, form.countryCode as CountryCode);
      normalized = countryMatch ? nationalNumber : normalizePhoneDigits(raw);
    } else {
      normalized = normalizePhoneDigits(raw);
    }

    // Block input beyond country required length
    const rule = form.countryCode ? getPhoneLengthRule(form.countryCode as CountryCode) : null;
    if (rule && normalized.length > rule.requiredDigits) {
      setPhoneLengthError(t("validation.phoneExactError", {
        country: form.country,
        requiredDigits: rule.requiredDigits,
        dialCode: `+${getDialCode(form.countryCode)}`,
        enteredDigits: normalized.length,
      }));
      return; // keep previous value
    }

    onChange("phoneNational", normalized);
    if (phoneTouched) {
      revalidatePhone(normalized, form.countryCode);
    }
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    revalidatePhone(form.phoneNational, form.countryCode);
  };

  const passportOptions: { value: PassportHolderType; labelKey: string }[] = [
    { value: "BANGLADESHI", labelKey: "applicantDetails.passportBangladeshi" },
    { value: "FOREIGN",     labelKey: "applicantDetails.passportForeign" },
  ];

  const passportErrorId = "sr-passport-type-error";

  return (
    <div className="sr-form">

      {/* ── Section 1: Taxpayer Information ─────────────────────────────── */}
      <CollapsibleFormSection
        id="sr-taxpayer"
        title={t("applicantDetails.sectionTaxpayer")}
        open={open.taxpayer}
        onToggle={() => toggle("taxpayer")}
      >
        <div className="sr-taxpayer-layout">
          <div className="sr-taxpayer-layout__full">
            <AppTextField
              id="sr-full-name"
              label={t("applicantDetails.fullName")}
              value={form.fullName}
              onChange={val => onChange("fullName", val)}
              required
              helper={t("applicantDetails.fullNameHelper")}
              error={errors.fullName}
              maxLength={120}
            />
          </div>
          <div className="sr-form-grid">
            <AppTextField
              id="sr-nid-number"
              label={t("applicantDetails.nidNumber")}
              value={form.nidNumber}
              onChange={val => onChange("nidNumber", normalizeNid(val))}
              required
              error={errors.nidNumber}
              maxLength={17}
              inputMode="numeric"
              autoComplete="off"
            />
            <AppTextField
              id="sr-tin"
              label={t("applicantDetails.tin")}
              value={form.tin}
              onChange={val => onChange("tin", normalizeTin(val))}
              required
              helper={t("applicantDetails.tinHelper")}
              error={errors.tin}
              maxLength={12}
              inputMode="numeric"
            />
          </div>
        </div>
      </CollapsibleFormSection>

      {/* ── Section 2: Overseas Details ──────────────────────────────────── */}
      <CollapsibleFormSection
        id="sr-overseas"
        title={t("applicantDetails.sectionOverseas")}
        open={open.overseas}
        onToggle={() => toggle("overseas")}
      >
        <div className="sr-overseas-layout">
          {/* Passport Type */}
          <div className="sr-passport-type">
            <FormControl
              component="fieldset"
              fullWidth
              error={!!errors.passportType}
              required
              className={`sr-passport-type__control${errors.passportType ? " sr-passport-type__control--error" : ""}`}
              aria-describedby={errors.passportType ? passportErrorId : undefined}
            >
              <FormLabel component="legend" className="sr-passport-type__label">
                {t("applicantDetails.passportType")}
              </FormLabel>
              <RadioGroup
                name="passportType"
                value={form.passportType}
                onChange={(_, val) => onChange("passportType", val as PassportHolderType)}
                className="sr-passport-type__options"
              >
                {passportOptions.map((opt, idx) => {
                  const selected = form.passportType === opt.value;
                  return (
                    <FormControlLabel
                      key={opt.value}
                      value={opt.value}
                      className={`sr-passport-type__option${selected ? " sr-passport-type__option--selected" : ""}`}
                      control={
                        <Radio
                          size="small"
                          inputRef={idx === 0 ? passportTypeFirstRadioRef : undefined}
                          inputProps={{
                            "aria-invalid": !!errors.passportType || undefined,
                          } as React.InputHTMLAttributes<HTMLInputElement>}
                        />
                      }
                      label={t(opt.labelKey)}
                    />
                  );
                })}
              </RadioGroup>
              {errors.passportType && (
                <FormHelperText id={passportErrorId}>{errors.passportType}</FormHelperText>
              )}
            </FormControl>
          </div>

          {/* Divider between passport type and country/phone */}
          <div className="sr-overseas-divider" role="separator" aria-hidden="true" />

          {/* Country + Phone */}
          <div className="sr-form-grid">
            <AppCountryAutocomplete
              id="sr-country"
              label={t("applicantDetails.country")}
              value={form.countryCode}
              language={language}
              onChange={country => {
                onCountryChange(country);
                if (phoneTouched && form.phoneNational) {
                  revalidatePhone(form.phoneNational, country?.iso2 ?? "", country?.englishName ?? "");
                } else {
                  setPhoneLengthError("");
                }
              }}
              required
              error={errors.countryCode}
              disablePortal={isAdminMode}
              placeholder={t("applicantDetails.countrySearch")}
              noOptionsText={t("applicantDetails.countryNoResults")}
              mobileSheet={!isAdminMode}
              excludedCountryCodes={["BD"]}
            />
            <AppPhoneField
              id="sr-phone"
              label={t("applicantDetails.phone")}
              value={form.phoneNational}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              required
              helper={form.countryCode ? t("applicantDetails.phoneHelper") : undefined}
              placeholder={!form.countryCode ? t("applicantDetails.phoneNoCountry") : undefined}
              error={errors.phoneNational || phoneLengthError}
              disabled={!form.countryCode}
              prefix={phonePrefix}
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={form.countryCode ? (getPhoneLengthRule(form.countryCode as CountryCode)?.requiredDigits ?? undefined) : undefined}
            />
          </div>

          {/* Address */}
          <div className="sr-overseas-layout__wide-field">
            <AppTextArea
              id="sr-address"
              label={t("applicantDetails.address")}
              value={form.address}
              onChange={val => onChange("address", val)}
              required
              error={errors.address}
              maxLength={500}
              rows={3}
            />
          </div>

          {/* Departure Date + Email */}
          <div className="sr-form-grid">
            <AppDateField
              id="sr-departure-date"
              label={t("applicantDetails.departureDate")}
              mobileLabel={t("applicantDetails.departureDateMobile")}
              value={form.departureDate}
              onChange={val => onChange("departureDate", val)}
              required
              error={errors.departureDate}
              customPicker
              mobileSheet
              maxDate={new Date().toISOString().slice(0, 10)}
            />
            <AppTextField
              id="sr-email"
              label={t("applicantDetails.email")}
              value={form.email}
              onChange={val => onChange("email", val)}
              required
              helper={t("applicantDetails.emailHelper")}
              error={errors.email}
              autoComplete="email"
            />
          </div>
        </div>
      </CollapsibleFormSection>

      {/* ── Section 3: Documents ────────────────────────────────────────── */}
      <CollapsibleFormSection
        id="sr-documents"
        title={t("documents.sectionTitle")}
        open={open.documents}
        onToggle={() => toggle("documents")}
      >
        <div className="sr-doc-list">
          <SRDocumentRow
            id="sr-nid"
            label={t("documents.nid.label")}
            value={form.nidFiles}
            onChange={files => onFilesChange("nidFiles", files)}
            required
            helper={t("documents.nid.helper")}
            maxFiles={2}
            accept={PUBLIC_ACCEPT}
            maxSizeMB={MAX_MB}
            error={errors.nidFiles}
            sampleCategory="nid"
          />
          <SRDocumentRow
            id="sr-passport"
            label={t("documents.passport.label")}
            value={form.passportFiles}
            onChange={files => onFilesChange("passportFiles", files)}
            required
            helper={t("documents.passport.helper")}
            maxFiles={1}
            accept={PUBLIC_ACCEPT}
            maxSizeMB={MAX_MB}
            error={errors.passportFiles}
            sampleCategory="passport"
          />
          <SRDocumentRow
            id="sr-visa"
            label={t("documents.visa.label")}
            value={form.visaFiles}
            onChange={files => onFilesChange("visaFiles", files)}
            optional
            optionalBadge={t("documents.visa.optionalBadge")}
            helper={t("documents.visa.helper")}
            maxFiles={1}
            accept={PUBLIC_ACCEPT}
            maxSizeMB={MAX_MB}
            sampleCategory="visa"
          />
          <SRDocumentRow
            id="sr-departure"
            label={t("documents.departure.label")}
            value={form.departureFiles}
            onChange={files => onFilesChange("departureFiles", files)}
            required
            helper={t("documents.departure.helper")}
            maxFiles={1}
            accept={PUBLIC_ACCEPT}
            maxSizeMB={MAX_MB}
            error={errors.departureFiles}
            sampleCategory="departure"
          />
        </div>
      </CollapsibleFormSection>

      {/* ── Declaration ─────────────────────────────────────────────────── */}
      <div className="sr-declaration-section">
        {isAdminMode ? (
          <div className="sr-declaration-readonly">
            <Check size={15} aria-hidden="true" className="sr-declaration-readonly__icon" />
            <span className="sr-declaration-readonly__text">{t("review.declaration")}</span>
          </div>
        ) : (
          <>
            <AppCheckbox
              id="sr-declaration-checkbox"
              label={t("review.declaration")}
              checked={form.declaration}
              onChange={onDeclarationChange}
            />
            {errors.declaration && (
              <p className="sr-field-error" role="alert">{errors.declaration}</p>
            )}
          </>
        )}
      </div>

      {/* ── Submit error ─────────────────────────────────────────────────── */}
      {submitError && (
        <div className="sr-submit-error" role="alert">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      )}
    </div>
  );
}

// ── Internal helpers for phone prefix ────────────────────────────────────────

function getFlag(iso2: string): string {
  return [...iso2.toUpperCase()]
    .map(c => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

function getDialCode(iso2: string): string {
  try {
    return getCountryCallingCode(iso2 as CountryCode);
  } catch {
    return "";
  }
}
