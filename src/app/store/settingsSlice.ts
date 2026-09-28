import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ThemeId } from "../data/themes";
import type { FontId, FontSizeId } from "../data/fonts";
import type { LanguageId } from "../data/languages";

// ── Storage keys ────────────────────────────────────────────────────────────
const STORAGE_KEY = "gov_ui_settings";

// ── Types ────────────────────────────────────────────────────────────────────
export interface SettingsState {
  themeId: ThemeId;
  fontId: FontId;
  fontSizeId: FontSizeId;
  languageId: LanguageId;
  assessmentYear: string;
}

// ── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS: SettingsState = {
  themeId: "indigo-blue",
  fontId: "inter",
  fontSizeId: "standard",
  languageId: "en",
  assessmentYear: "2024-25",
};

// ── Persistence helpers ───────────────────────────────────────────────────────

function loadSettings(): SettingsState {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return resolveInitialSettings();
    const parsed = JSON.parse(raw) as Partial<SettingsState>;
    return {
      themeId: parsed.themeId ?? DEFAULT_SETTINGS.themeId,
      fontId: parsed.fontId ?? DEFAULT_SETTINGS.fontId,
      fontSizeId: parsed.fontSizeId ?? DEFAULT_SETTINGS.fontSizeId,
      languageId: parsed.languageId ?? resolveLanguage(),
      assessmentYear: parsed.assessmentYear ?? DEFAULT_SETTINGS.assessmentYear,
    };
  } catch {
    return resolveInitialSettings();
  }
}

function resolveLanguage(): LanguageId {
  try {
    const stored = typeof window !== "undefined" ? localStorage.getItem("i18nextLng") : null;
    return stored === "en" || stored === "bn" ? stored : DEFAULT_SETTINGS.languageId;
  } catch {
    return DEFAULT_SETTINGS.languageId;
  }
}

function resolveInitialSettings(): SettingsState {
  return { ...DEFAULT_SETTINGS, languageId: resolveLanguage() };
}

export function saveSettings(state: SettingsState): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // Ignore write errors (private browsing mode, storage full, etc.)
  }
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const settingsSlice = createSlice({
  name: "settings",
  initialState: loadSettings,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeId>) {
      state.themeId = action.payload;
    },
    setFont(state, action: PayloadAction<FontId>) {
      state.fontId = action.payload;
    },
    setFontSize(state, action: PayloadAction<FontSizeId>) {
      state.fontSizeId = action.payload;
    },
    setLanguage(state, action: PayloadAction<LanguageId>) {
      state.languageId = action.payload;
    },
    setAssessmentYear(state, action: PayloadAction<string>) {
      state.assessmentYear = action.payload;
    },
    resetSettings() {
      return DEFAULT_SETTINGS;
    },
  },
});

export const { setTheme, setFont, setFontSize, setLanguage, setAssessmentYear, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
