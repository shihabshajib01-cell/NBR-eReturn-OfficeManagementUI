import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FileEdit } from "lucide-react";
import { AppModal } from "../modals/AppModal";
import {
  SpecialRegistrationForm,
  applicationToFormState,
  validateSpecialRegistrationForm,
  type FormState,
  type FieldErrors,
  type PassportHolderType,
} from "./SpecialRegistrationForm";
import {
  SRConflictError,
  type SpecialRegistrationApplication,
  type SpecialRegistrationUpdatePayload,
} from "../../services/repositories/specialRegistrationRepository";
import type { CountryOption, CountryCode } from "../../data/countryOptions";
import { toE164Phone, nationalFromE164 } from "../../utils/phoneNumber";
import { useLanguage } from "../../hooks/useLanguage";

interface EditModalProps {
  open: boolean;
  application: SpecialRegistrationApplication;
  onClose: () => void;
  onSave: (
    appId: string,
    payload: SpecialRegistrationUpdatePayload,
    editor: { editorId: string; editorName: string; editorDesignation: string }
  ) => Promise<void>;
  editor: { editorId: string; editorName: string; editorDesignation: string };
}

function appToFormState(application: SpecialRegistrationApplication): FormState {
  const countryCode = (application.countryCode || "") as CountryCode | "";
  const phoneNational = countryCode
    ? (nationalFromE164(application.phone, countryCode) ?? application.phone)
    : application.phone;
  return applicationToFormState({
    applicantName:  application.applicantName,
    nidNumber:      application.nidNumber,
    tin:            application.tin,
    passportType:   (application.passportType || "") as PassportHolderType | "",
    countryCode,
    country:        application.country,
    address:        application.address,
    phoneNational,
    departureDate:  application.departureDate,
    email:          application.email,
    nidFiles:       application.documents.filter(d => d.category === "NID_OR_SMART_ID").map(d => d.file),
    passportFiles:  application.documents.filter(d => d.category === "PASSPORT_BIO_PAGE").map(d => d.file),
    visaFiles:      application.documents.filter(d => d.category === "VISA_OR_RESIDENCE_PAGE").map(d => d.file),
    departureFiles: application.documents.filter(d => d.category === "LATEST_DEPARTURE_SEAL").map(d => d.file),
  });
}

export function SpecialRegistrationEditModal({
  open,
  application,
  onClose,
  onSave,
  editor,
}: EditModalProps) {
  const { t } = useTranslation("specialRegistration");
  const { t: ta } = useTranslation("actions");
  const { languageId } = useLanguage();

  const [form, setForm]           = useState<FormState>(() => appToFormState(application));
  const [errors, setErrors]       = useState<FieldErrors>({});
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState("");
  const [resetKey, setResetKey]   = useState(0);

  const bodyRef = useRef<HTMLDivElement>(null);

  // Re-initialize form when application changes or modal opens
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setSaveError("");
    setResetKey(k => k + 1);
    setForm(appToFormState(application));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, application.id]);

  // ── Form field changes ────────────────────────────────────────────────────

  const handleFieldChange = useCallback(
    (field: keyof FormState, value: string | boolean | File[]) => {
      setForm(prev => ({ ...prev, [field]: value }));
      setErrors(prev => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleCountryChange = useCallback((country: CountryOption | null) => {
    setForm(prev => ({
      ...prev,
      countryCode: country?.iso2 ?? "",
      country: country?.englishName ?? "",
      phoneNational: "",
    }));
    setErrors(prev => {
      const next = { ...prev };
      delete next.countryCode;
      delete next.phoneNational;
      return next;
    });
  }, []);

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    const errs = validateSpecialRegistrationForm(form, t, { requireDeclaration: false });
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTimeout(() => {
        bodyRef.current?.querySelector<HTMLElement>("[aria-invalid='true'], .sr-field-error")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
      return;
    }

    setSaving(true);
    setSaveError("");

    try {
      const e164 = toE164Phone(form.phoneNational, form.countryCode || undefined);
      const payload: SpecialRegistrationUpdatePayload = {
        applicantName:  form.fullName.trim(),
        nidNumber:      form.nidNumber,
        tin:            form.tin,
        passportType:   form.passportType as PassportHolderType,
        countryCode:    form.countryCode as CountryCode,
        country:        form.country.trim(),
        address:        form.address.trim(),
        phone:          e164 ?? form.phoneNational.trim(),
        departureDate:  form.departureDate,
        email:          form.email.trim().toLowerCase(),
        nidFiles:       form.nidFiles,
        passportFiles:  form.passportFiles,
        visaFiles:      form.visaFiles,
        departureFiles: form.departureFiles,
      };
      await onSave(application.id, payload, editor);
      onClose();
    } catch (err) {
      if (err instanceof SRConflictError) {
        setSaveError(t("internal.conflictEdit"));
      } else {
        setSaveError(t("internal.updateError"));
      }
    } finally {
      setSaving(false);
    }
  }, [form, application.id, editor, onSave, onClose, t]);

  // ── Footer ────────────────────────────────────────────────────────────────

  const footer = (
    <div className="modal-form-footer">
      <button type="button" className="action-btn action-btn--secondary" onClick={onClose} disabled={saving}>
        {ta("cancel")}
      </button>
      <div style={{ flex: 1 }} />
      <button
        type="button"
        className="action-btn action-btn--primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "…" : ta("save")}
      </button>
    </div>
  );

  return (
    <AppModal
      open={open}
      title={t("internal.editTitle")}
      onClose={() => !saving && onClose()}
      size="xl"
      layer="top"
      icon={<FileEdit size={16} />}
      footer={footer}
    >
      <div ref={bodyRef} style={{ overflowY: "auto", maxHeight: "65vh" }}>
        {saveError && (
          <div className="sr-submit-error" role="alert" style={{ margin: "0 0 12px" }}>
            <span>{saveError}</span>
          </div>
        )}
        <SpecialRegistrationForm
          form={form}
          errors={errors}
          onChange={handleFieldChange}
          onFilesChange={(field, files) => handleFieldChange(field, files)}
          onDeclarationChange={val => handleFieldChange("declaration", val)}
          onCountryChange={handleCountryChange}
          isAdminMode
          resetKey={resetKey}
          language={languageId === "bn" ? "bn" : "en"}
          t={t}
        />
      </div>
    </AppModal>
  );
}
