import { createPortal } from "react-dom";
import { Palette, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ThemeOptionCard, type ThemeId, type ThemeConfig } from "./ThemeOptionCard";
import { FontOptionCard, type FontId, type FontConfig } from "./FontOptionCard";
import { FontSizeOptionCard, type FontSizeId, type FontSizeConfig } from "./FontSizeOptionCard";
import { LanguageOptionCard, type LanguageId, type LanguageConfig } from "./LanguageOptionCard";
import { useSettings } from "../../hooks/useSettings";
import { useAppearance } from "../../hooks/useAppearance";
import { useLanguage } from "../../hooks/useLanguage";
import { THEMES, THEME_ORDER } from "../../data/themes";
import { FONTS, FONT_ORDER, FONT_SIZES, FONT_SIZE_ORDER } from "../../data/fonts";
import { LANGUAGES, LANGUAGE_ORDER } from "../../data/languages";

interface AppearanceSettingsPanelProps {
  onClose: () => void;
  isMobile: boolean;
}

export function AppearanceSettingsPanel({ onClose, isMobile }: AppearanceSettingsPanelProps) {
  const { t: translate } = useTranslation("appearance");
  const { themeId, fontId, fontSizeId, languageId } = useSettings();
  const { setThemeId, setFontId, setFontSizeId } = useAppearance();
  const { setLanguageId } = useLanguage();

  const panelContent = (
    <div
      role="dialog"
      aria-label={translate("appearance")}
      className={`${isMobile ? "mobile-modal-wrapper mobile-modal-drawer" : ""} appearance-panel ${isMobile ? "appearance-panel--mobile" : "appearance-panel--desktop"}`}
    >
      {/* Fixed header */}
      <div className={`${isMobile ? "mobile-modal-header" : ""} appearance-panel__header`}>
        <div className="flex items-center gap-2.5">
          <div className="modal-form-header__icon">
            <Palette size={14} strokeWidth={2} />
          </div>
          <span className="text-[14px] font-semibold text-[var(--color-text-primary)]">
            {translate("appearance")}
          </span>
        </div>
        <button
          onClick={onClose}
          className={`${isMobile ? "mobile-modal-close" : ""} modal-form-header__close`}
          aria-label={translate("closePanel")}
        >
          <X size={13} strokeWidth={2} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className={`${isMobile ? "mobile-modal-body" : ""} appearance-panel__body px-5 py-4 space-y-6`}>
        {/* Section 1: Language */}
        <div>
          <div className="appearance-panel__section-divider">
            <h3 className="appearance-panel__section-label">{translate("language")}</h3>
            <div className="appearance-panel__divider-line" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {LANGUAGE_ORDER.map((lid) => (
              <LanguageOptionCard key={lid} language={LANGUAGES[lid]} selected={languageId === lid} onSelect={setLanguageId} />
            ))}
          </div>
        </div>

        {/* Section 2: Color Theme */}
        <div>
          <div className="appearance-panel__section-divider">
            <h3 className="appearance-panel__section-label">{translate("colorTheme")}</h3>
            <div className="appearance-panel__divider-line" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {THEME_ORDER.map((tid) => (
              <ThemeOptionCard key={tid} theme={THEMES[tid]} selected={themeId === tid} onSelect={setThemeId} />
            ))}
          </div>
        </div>

        {/* Section 3: Font */}
        <div>
          <div className="appearance-panel__section-divider">
            <h3 className="appearance-panel__section-label">{translate("font")}</h3>
            <div className="appearance-panel__divider-line" />
          </div>
          <div className="flex flex-col gap-2">
            {FONT_ORDER.map((fid) => (
              <FontOptionCard key={fid} font={FONTS[fid]} selected={fontId === fid} onSelect={setFontId} />
            ))}
          </div>
        </div>

        {/* Section 4: Font Size */}
        <div>
          <div className="appearance-panel__section-divider">
            <h3 className="appearance-panel__section-label">{translate("fontSize")}</h3>
            <div className="appearance-panel__divider-line" />
          </div>
          <div className="flex flex-col gap-2">
            {FONT_SIZE_ORDER.map((fsid) => (
              <FontSizeOptionCard key={fsid} config={FONT_SIZES[fsid]} selected={fontSizeId === fsid} onSelect={setFontSizeId} />
            ))}
          </div>
        </div>

        <div className="pt-1 pb-1">
          <p className="text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
            {translate("changesApply")}
          </p>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return typeof document !== "undefined"
      ? createPortal(
          <>
            <div
              className="mobile-modal-backdrop fixed inset-0"
              style={{ backgroundColor: "rgba(0,0,0,0.42)", zIndex: 200 }}
              onClick={onClose}
              aria-hidden="true"
            />
            {panelContent}
          </>,
          document.body
        )
      : null;
  }

  return panelContent;
}
