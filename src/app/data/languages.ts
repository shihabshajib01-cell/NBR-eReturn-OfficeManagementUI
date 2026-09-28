import type { LanguageId, LanguageConfig } from "../components/appearance/LanguageOptionCard";

export const LANGUAGES: Record<LanguageId, LanguageConfig> = {
  en: {
    id: "en",
    name: "English",
    nativeName: "English",
    icon: "🇬🇧",
  },
  bn: {
    id: "bn",
    name: "Bangla",
    nativeName: "বাংলা",
    icon: "🇧🇩",
  },
};

export const LANGUAGE_ORDER: LanguageId[] = ["en", "bn"];

export { type LanguageId, type LanguageConfig };
