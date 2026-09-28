import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { LanguageId } from "../data/languages";
import { useSettings, useSettingsDispatch } from "./useSettings";
import { setLanguage } from "../store/settingsSlice";

/**
 * useLanguage — reads language from the centralized Redux store,
 * keeps i18next in sync, and returns a typed setter that updates
 * both Redux and i18next (which persists to localStorage via i18next-browser-languagedetector).
 */
export function useLanguage() {
  const { languageId } = useSettings();
  const dispatch = useSettingsDispatch();
  const { i18n } = useTranslation();

  // Sync i18n whenever languageId changes in Redux
  useEffect(() => {
    if (i18n.language !== languageId) {
      i18n.changeLanguage(languageId);
    }
  }, [languageId, i18n]);

  const setLanguageId = (id: LanguageId) => {
    dispatch(setLanguage(id));
    i18n.changeLanguage(id);
  };

  return {
    languageId,
    setLanguageId,
  };
}
