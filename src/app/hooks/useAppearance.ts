import { useEffect } from "react";
import { THEMES, type ThemeId } from "../data/themes";
import { FONTS, type FontId, type FontSizeId } from "../data/fonts";
import { rgba } from "../utils/colors";
import { useSettings, useSettingsDispatch } from "./useSettings";
import { setTheme, setFont, setFontSize } from "../store/settingsSlice";

/**
 * useAppearance — reads theme/font/fontSize from the centralized Redux store,
 * syncs DOM side-effects (CSS custom properties, font-family, data attributes),
 * and returns the derived ThemeConfig object plus typed setters.
 *
 * All setter calls automatically persist to localStorage via the Redux middleware.
 */
export function useAppearance() {
  const { themeId, fontId, fontSizeId } = useSettings();
  const dispatch = useSettingsDispatch();

  const t = THEMES[themeId];
  const fontFamily = FONTS[fontId].family;
  const textOnPrimary = t.id === "dark-mode" ? "#202124" : "#FFFFFF";

  // Sync font family to document.body
  useEffect(() => {
    document.body.style.fontFamily = fontFamily;
    return () => { document.body.style.fontFamily = ""; };
  }, [fontFamily]);

  // Sync font size to data attribute
  useEffect(() => {
    const root = document.documentElement;
    if (fontSizeId === "standard") {
      root.removeAttribute("data-font-scale");
    } else {
      root.setAttribute("data-font-scale", fontSizeId);
    }
    return () => { root.removeAttribute("data-font-scale"); };
  }, [fontSizeId]);

  // Sync theme colors to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const isDark = themeId === "dark-mode";

    root.setAttribute("data-theme", themeId);

    if (isDark) {
      root.classList.add("theme-dark");
    } else {
      root.classList.remove("theme-dark");
    }

    // Base color tokens
    root.style.setProperty("--color-primary", t.primary);
    root.style.setProperty("--color-primary-dark", t.primaryDark);
    root.style.setProperty("--color-primary-light", t.primaryLight);
    root.style.setProperty("--color-secondary", t.secondary);
    root.style.setProperty("--color-accent", t.accent);
    root.style.setProperty("--color-background", t.background);
    root.style.setProperty("--color-surface", t.surface);
    root.style.setProperty("--color-border", t.border);
    root.style.setProperty("--color-text-primary", t.textPrimary);
    root.style.setProperty("--color-text-secondary", t.textSecondary);
    root.style.setProperty("--color-success", t.success);
    root.style.setProperty("--color-warning", t.warning);
    root.style.setProperty("--color-error", t.error);

    // Derived tokens — dark vs light
    if (isDark) {
      root.style.setProperty("--color-background-subtle", "#242528");
      root.style.setProperty("--color-background-zebra", "#26272A");
      root.style.setProperty("--color-surface-secondary", "#303134");
      root.style.setProperty("--color-surface-hover", "#35363A");
      root.style.setProperty("--color-border-subtle", "rgba(232,234,237,0.08)");
      root.style.setProperty("--color-text-muted", "#9AA0A6");
      root.style.setProperty("--color-text-on-primary", "#202124");
      root.style.setProperty("--color-primary-shadow", "rgba(138,180,248,0.24)");
      root.style.setProperty("--color-primary-alpha-3", "rgba(138,180,248,0.03)");
      root.style.setProperty("--color-primary-alpha-6", "rgba(138,180,248,0.06)");
      root.style.setProperty("--color-primary-alpha-8", "rgba(138,180,248,0.08)");
      root.style.setProperty("--color-primary-alpha-10", "rgba(138,180,248,0.10)");
      root.style.setProperty("--color-primary-alpha-12", "rgba(138,180,248,0.12)");
      root.style.setProperty("--color-text-secondary-alpha-8", "rgba(154,160,166,0.08)");
      root.style.setProperty("--color-text-secondary-alpha-4", "rgba(154,160,166,0.04)");
      root.style.setProperty("--color-text-primary-alpha-2", "rgba(232,234,237,0.02)");
      root.style.setProperty("--color-text-primary-alpha-12", "rgba(232,234,237,0.12)");
      root.style.setProperty("--color-border-alpha-5", "rgba(232,234,237,0.5)");
      root.style.setProperty("--color-secondary-alpha-12", "rgba(138,140,200,0.12)");
      root.style.setProperty("--color-error-alpha-8", "rgba(242,139,130,0.08)");
      root.style.setProperty("--color-error-alpha-10", "rgba(242,139,130,0.10)");
      root.style.setProperty("--color-error-alpha-15", "rgba(242,139,130,0.15)");
      root.style.setProperty("--color-error-alpha-30", "rgba(242,139,130,0.30)");
      root.style.setProperty("--color-warning-alpha-8", "rgba(253,214,99,0.08)");
      root.style.setProperty("--color-warning-alpha-10", "rgba(253,214,99,0.10)");
      root.style.setProperty("--color-warning-alpha-15", "rgba(253,214,99,0.15)");
      root.style.setProperty("--color-warning-alpha-20", "rgba(253,214,99,0.20)");
      root.style.setProperty("--color-warning-alpha-30", "rgba(253,214,99,0.30)");
      root.style.setProperty("--color-primary-alpha-2", "rgba(138,180,248,0.02)");
      root.style.setProperty("--color-primary-alpha-4", "rgba(138,180,248,0.04)");
      root.style.setProperty("--color-text-primary-alpha-3", "rgba(232,234,237,0.03)");
      root.style.setProperty("--color-text-secondary-alpha-8", "rgba(154,160,166,0.08)");
      root.style.setProperty("--color-success-bg", "rgba(129,201,149,0.14)");
      root.style.setProperty("--color-warning-bg", "rgba(253,214,99,0.14)");
      root.style.setProperty("--color-error-bg", "rgba(242,139,130,0.14)");
    } else {
      root.style.setProperty("--color-background-subtle", rgba(t.primary, 0.035));
      root.style.setProperty("--color-background-zebra", rgba(t.textPrimary, 0.015));
      root.style.setProperty("--color-surface-secondary", rgba(t.primary, 0.045));
      root.style.setProperty("--color-surface-hover", rgba(t.primary, 0.06));
      root.style.setProperty("--color-border-subtle", rgba(t.border, 0.55));
      root.style.setProperty("--color-text-muted", rgba(t.textSecondary, 0.75));
      root.style.setProperty("--color-text-on-primary", "#FFFFFF");
      root.style.setProperty("--color-primary-shadow", rgba(t.primary, 0.24));
      root.style.setProperty("--color-primary-alpha-3", rgba(t.primary, 0.03));
      root.style.setProperty("--color-primary-alpha-6", rgba(t.primary, 0.06));
      root.style.setProperty("--color-primary-alpha-10", rgba(t.primary, 0.10));
      root.style.setProperty("--color-primary-alpha-12", rgba(t.primary, 0.12));
      root.style.setProperty("--color-text-secondary-alpha-8", rgba(t.textSecondary, 0.08));
      root.style.setProperty("--color-text-secondary-alpha-4", rgba(t.textSecondary, 0.04));
      root.style.setProperty("--color-text-primary-alpha-2", rgba(t.textPrimary, 0.02));
      root.style.setProperty("--color-text-primary-alpha-12", rgba(t.textPrimary, 0.12));
      root.style.setProperty("--color-border-alpha-5", rgba(t.border, 0.5));
      root.style.setProperty("--color-secondary-alpha-12", rgba(t.secondary, 0.12));
      root.style.setProperty("--color-error-alpha-8", rgba(t.error, 0.08));
      root.style.setProperty("--color-error-alpha-10", rgba(t.error, 0.10));
      root.style.setProperty("--color-error-alpha-15", rgba(t.error, 0.15));
      root.style.setProperty("--color-error-alpha-30", rgba(t.error, 0.30));
      root.style.setProperty("--color-warning-alpha-8", rgba(t.warning, 0.08));
      root.style.setProperty("--color-warning-alpha-10", rgba(t.warning, 0.10));
      root.style.setProperty("--color-warning-alpha-15", rgba(t.warning, 0.15));
      root.style.setProperty("--color-warning-alpha-20", rgba(t.warning, 0.20));
      root.style.setProperty("--color-warning-alpha-30", rgba(t.warning, 0.30));
      root.style.setProperty("--color-primary-alpha-2", rgba(t.primary, 0.02));
      root.style.setProperty("--color-primary-alpha-4", rgba(t.primary, 0.04));
      root.style.setProperty("--color-primary-alpha-8", rgba(t.primary, 0.08));
      root.style.setProperty("--color-text-primary-alpha-3", rgba(t.textPrimary, 0.03));
      root.style.setProperty("--color-success-bg", rgba(t.success, 0.12));
      root.style.setProperty("--color-warning-bg", rgba(t.warning, 0.12));
      root.style.setProperty("--color-error-bg", rgba(t.error, 0.12));
    }

    // Scrollbar tokens
    root.style.setProperty("--scrollbar-track", t.background);
    root.style.setProperty("--scrollbar-thumb", rgba(t.primary, 0.35));
    root.style.setProperty("--scrollbar-thumb-hover", t.primaryDark);

    // Tooltip tokens (always dark regardless of theme for readability)
    root.style.setProperty("--color-tooltip-bg", "#1e293b");
    root.style.setProperty("--color-tooltip-text", "#f8fafc");
  }, [t, themeId]);

  return {
    themeId,
    setThemeId: (id: ThemeId) => dispatch(setTheme(id)),
    fontId,
    setFontId: (id: FontId) => dispatch(setFont(id)),
    fontSizeId,
    setFontSizeId: (id: FontSizeId) => dispatch(setFontSize(id)),
    t,
    fontFamily,
    textOnPrimary,
  };
}
