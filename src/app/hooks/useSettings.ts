/**
 * useSettings — typed, tree-shakeable access to the settings Redux slice.
 *
 * Usage:
 *   const { themeId, fontId, fontSizeId, languageId } = useSettings();
 *   const dispatch = useSettingsDispatch();
 *   dispatch(setTheme("dark-mode"));
 *
 * Or use the combined hook for both read + write in one call:
 *   const { themeId, setTheme, setFont, setFontSize, setLanguage } = useSettingsActions();
 */
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  setTheme,
  setFont,
  setFontSize,
  setLanguage,
  setAssessmentYear,
  resetSettings,
} from "../store/settingsSlice";
import type { SettingsState } from "../store/settingsSlice";
import type { ThemeId } from "../data/themes";
import type { FontId, FontSizeId } from "../data/fonts";
import type { LanguageId } from "../data/languages";

// ── Typed selector ────────────────────────────────────────────────────────────
export function useSettings(): SettingsState {
  return useSelector((state: RootState) => state.settings);
}

// ── Typed dispatcher ──────────────────────────────────────────────────────────
export function useSettingsDispatch(): AppDispatch {
  return useDispatch<AppDispatch>();
}

// ── Combined read + write hook (preferred for component use) ─────────────────
export function useSettingsActions() {
  const settings = useSettings();
  const dispatch = useSettingsDispatch();

  return {
    // Current values
    ...settings,

    // Setters (dispatch wrappers)
    setTheme: (id: ThemeId) => dispatch(setTheme(id)),
    setFont: (id: FontId) => dispatch(setFont(id)),
    setFontSize: (id: FontSizeId) => dispatch(setFontSize(id)),
    setLanguage: (id: LanguageId) => dispatch(setLanguage(id)),
    setAssessmentYear: (year: string) => dispatch(setAssessmentYear(year)),
    resetSettings: () => dispatch(resetSettings()),
  };
}
