import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Globe,
  MailCheck,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import imgNbrLogo from "../../../assets/logos/nbr-logo.png";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { CopyValueButton } from "../../components/shared/CopyValueButton";
import { useLanguage } from "../../hooks/useLanguage";
import {
  submitSpecialRegistration,
  type SpecialRegResult,
} from "../../services/specialRegistrationPublicService";
import {
  SpecialRegistrationForm,
  INITIAL_FORM,
  validateSpecialRegistrationForm,
  type FormState,
  type FieldErrors,
} from "../../components/special-registration/SpecialRegistrationForm";
import type { CountryOption } from "../../data/countryOptions";
import { toE164Phone } from "../../utils/phoneNumber";
import { SpecialRegistrationManualModal } from "../../components/special-registration/SpecialRegistrationManualModal";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-BD", {
      dateStyle: "long",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

// ── Success State ─────────────────────────────────────────────────────────────

interface SuccessStateProps {
  result: SpecialRegResult;
  t: (k: string) => string;
  onBackToLogin: () => void;
  onSubmitAnother: () => void;
}

function SuccessState({
  result,
  t,
  onBackToLogin,
  onSubmitAnother,
}: SuccessStateProps) {
  return (
    <div className="sr-success" aria-live="polite">
      <div className="sr-success__icon-wrap" aria-hidden="true">
        <CheckCircle2 size={44} strokeWidth={1.5} className="sr-success__icon" />
      </div>

      <h2 className="sr-success__heading">{t("success.heading")}</h2>
      <p className="sr-success__subheading">{t("success.subheading", { defaultValue: "Your application has been received and is under review." })}</p>

      <div className="sr-success__card">
        <div className="sr-success__card-head">
          <span className="sr-success__app-number-label">{t("success.applicationNumber")}</span>
          <div className="sr-success__app-number-value">
            <code className="sr-success__app-number-code">{result.applicationNumber}</code>
            <CopyValueButton value={result.applicationNumber} label={t("success.applicationNumber")} />
          </div>
        </div>

        <div className="sr-success__detail-row">
          <span className="sr-success__detail-label">{t("success.submittedAt")}</span>
          <span className="sr-success__detail-value">{formatDateTime(result.submittedAt)}</span>
        </div>
        <div className="sr-success__detail-row">
          <span className="sr-success__detail-label">{t("success.email")}</span>
          <span className="sr-success__detail-value">{result.email}</span>
        </div>
        <div className="sr-success__detail-row">
          <span className="sr-success__detail-label">{t("success.statusLabel", { defaultValue: "Status" })}</span>
          <span className="sr-success__status-badge">{t("success.status")}</span>
        </div>
      </div>

      <div className="sr-success__note">
        <MailCheck size={15} className="sr-success__note-icon" aria-hidden="true" />
        <p className="sr-success__note-text">{t("success.message")}</p>
      </div>

      <div className="sr-success__actions">
        <PrimaryButton onClick={onSubmitAnother} fullWidth>
          {t("success.submitAnother")}
        </PrimaryButton>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function SpecialRegistrationPublicPage() {
  const { t } = useTranslation("specialRegistration");
  const navigate = useNavigate();
  const { languageId, setLanguageId } = useLanguage();

  const [form, setForm]                 = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors]             = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState("");
  const [result, setResult]             = useState<SpecialRegResult | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);
  const [manualOpen, setManualOpen]     = useState(false);

  const pageTopRef    = useRef<HTMLDivElement>(null);
  const manualBtnRef  = useRef<HTMLButtonElement>(null);

  const isFormReady =
    form.fullName.trim().length > 0 &&
    form.nidNumber.length >= 10 &&
    form.tin.trim().length === 12 &&
    form.passportType.length > 0 &&
    form.countryCode.length > 0 &&
    form.country.trim().length > 0 &&
    form.address.trim().length > 0 &&
    form.phoneNational.trim().length > 0 &&
    form.departureDate.length > 0 &&
    form.email.trim().length > 0 &&
    form.nidFiles.length > 0 &&
    form.passportFiles.length > 0 &&
    form.departureFiles.length > 0 &&
    form.declaration;

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

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      pageTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    const errs = validateSpecialRegistrationForm(form, t, { requireDeclaration: true });
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error after sections auto-expand
      setTimeout(() => {
        const firstErr = document.querySelector<HTMLElement>(
          "[aria-invalid='true'], .sr-field-error",
        );
        firstErr?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const submittedAt = new Date().toISOString();
      const e164 = toE164Phone(form.phoneNational, form.countryCode || undefined);
      const res = await submitSpecialRegistration({
        applicantName: form.fullName.trim(),
        nidNumber: form.nidNumber,
        tin: form.tin,
        passportType: form.passportType as import("../../components/special-registration/SpecialRegistrationForm").PassportHolderType,
        countryCode: form.countryCode as import("../../data/countryOptions").CountryCode,
        country: form.country.trim(),
        address: form.address.trim(),
        phone: e164 ?? form.phoneNational.trim(),
        departureDate: form.departureDate,
        email: form.email.trim().toLowerCase(),
        attachments: {
          nid: form.nidFiles,
          passport: form.passportFiles,
          visa: form.visaFiles,
          departure: form.departureFiles,
        },
        declarationAccepted: true,
        submittedAt,
      });
      setResult(res);
      toast.success(t("success.heading"));
      scrollToTop();
    } catch {
      setSubmitError(t("review.submitError"));
      toast.error(t("review.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  }, [form, t, scrollToTop]);

  // ── Submit another ────────────────────────────────────────────────────────

  const handleSubmitAnother = useCallback(() => {
    setResult(null);
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitError("");
    setFormResetKey(k => k + 1);
    scrollToTop();
  }, [scrollToTop]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="sr-public"
      style={{ backgroundColor: "var(--color-background)", minHeight: "100vh" }}
    >
      {/* Header */}
      <header className="sr-public__header">
        <div className="sr-public__header-inner">
          <div className="sr-public__brand">
            <img src={imgNbrLogo} alt="NBR" className="sr-public__logo" />
            <div className="sr-public__brand-text">
              <span className="sr-public__app-name">{t("appName")}</span>
              <span className="sr-public__page-title">{t("pageTitle")}</span>
            </div>
          </div>

          <div className="sr-public__header-actions">
            <div className="sr-lang-switch" role="group" aria-label="Language / ভাষা">
              <button
                type="button"
                className={`sr-lang-switch__btn${languageId === "en" ? " sr-lang-switch__btn--active" : ""}`}
                onClick={() => setLanguageId("en")}
                aria-pressed={languageId === "en"}
              >
                EN
              </button>
              <span className="sr-lang-switch__sep" aria-hidden="true">/</span>
              <button
                type="button"
                className={`sr-lang-switch__btn${languageId === "bn" ? " sr-lang-switch__btn--active" : ""}`}
                onClick={() => setLanguageId("bn")}
                aria-pressed={languageId === "bn"}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Manual modal */}
      <SpecialRegistrationManualModal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
      />

      {/* Main */}
      <main className="sr-public__main">
        <div className="sr-public__card" ref={pageTopRef}>
          {/* Visually-hidden h1 for assistive technology */}
          <h1 className="sr-only">{t("pageTitle")}</h1>

          {result ? (
            <SuccessState
              result={result}
              t={t}
              onBackToLogin={() => navigate("/")}
              onSubmitAnother={handleSubmitAnother}
            />
          ) : (
            <>
              {/* Page action row */}
              <div className="sr-page-actions">
                <button
                  type="button"
                  className="sr-page-actions__back"
                  onClick={() => navigate(-1)}
                  aria-label={t("backToLogin")}
                >
                  <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
                  {t("backToLogin")}
                </button>
                <button
                  ref={manualBtnRef}
                  type="button"
                  className="sr-public-action-btn sr-manual-trigger"
                  onClick={() => setManualOpen(true)}
                  aria-label={t("manual.userManual")}
                  title={t("manual.userManual")}
                >
                  <BookOpen size={16} strokeWidth={1.8} aria-hidden="true" />
                  <span className="sr-manual-trigger__label">{t("manual.userManual")}</span>
                </button>
              </div>

              {/* Eligibility intro */}
              <div className="sr-intro">
                <Globe size={18} className="sr-intro__icon" aria-hidden="true" />
                <div>
                  <p className="sr-intro__text">{t("intro.description")}</p>
                  <p className="sr-intro__support">
                    <span className="sr-intro__support-label">{t("intro.supportLabel")}:</span>{" "}
                    <a
                      href={`mailto:${t("intro.supportEmail")}`}
                      className="sr-intro__support-email"
                    >
                      {t("intro.supportEmail")}
                    </a>
                  </p>
                </div>
              </div>

              {/* Form */}
              <SpecialRegistrationForm
                form={form}
                errors={errors}
                onChange={handleFieldChange}
                onFilesChange={(field, files) => handleFieldChange(field, files)}
                onDeclarationChange={val => handleFieldChange("declaration", val)}
                onCountryChange={handleCountryChange}
                submitError={submitError}
                resetKey={formResetKey}
                language={languageId === "bn" ? "bn" : "en"}
                t={t}
              />

              {/* Action bar */}
              <div className="sr-action-bar">
                <div />
                <div className="sr-action-bar__right">
                  <PrimaryButton
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={isSubmitting || !isFormReady}
                  >
                    {isSubmitting ? t("review.submitting") : t("review.submitButton")}
                  </PrimaryButton>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
