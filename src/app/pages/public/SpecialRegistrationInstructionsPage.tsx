import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import imgNbrLogo from "../../../assets/logos/nbr-logo.png";
import { useLanguage } from "../../hooks/useLanguage";
import { SpecialRegistrationManualContent } from "../../components/special-registration/SpecialRegistrationManualContent";

export function SpecialRegistrationInstructionsPage() {
  const { t } = useTranslation("specialRegistration");
  const navigate = useNavigate();
  const { languageId, setLanguageId } = useLanguage();

  const handleApply = () => {
    navigate("/special-registration");
  };

  return (
    <div
      className="sr-public"
      style={{ backgroundColor: "var(--color-background)", minHeight: "100vh" }}
    >
      {/* Header — identical structure to SpecialRegistrationPublicPage */}
      <header className="sr-public__header">
        <div className="sr-public__header-inner">
          <div className="sr-public__brand">
            <img src={imgNbrLogo} alt="NBR" className="sr-public__logo" />
            <div className="sr-public__brand-text">
              <span className="sr-public__app-name">{t("appName")}</span>
              <span className="sr-public__page-title">{t("manual.instructionsTitle")}</span>
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

      {/* Main — same structure as SpecialRegistrationPublicPage */}
      <main className="sr-public__main">
        <div className="sr-public__card">
          <h1 className="sr-only">{t("manual.instructionsTitle")}</h1>
          <SpecialRegistrationManualContent onApply={handleApply} variant="page" />
        </div>
      </main>
    </div>
  );
}
