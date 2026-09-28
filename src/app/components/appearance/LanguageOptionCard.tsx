import { SelectedCheckmark } from "./SelectedCheckmark";

export type LanguageId = "en" | "bn";

export interface LanguageConfig {
  id: LanguageId;
  name: string;
  nativeName: string;
  icon: string;
}

interface LanguageOptionCardProps {
  language: LanguageConfig;
  selected: boolean;
  onSelect: (id: LanguageId) => void;
}

export function LanguageOptionCard({ language, selected, onSelect }: LanguageOptionCardProps) {
  return (
    <button
      onClick={() => onSelect(language.id)}
      aria-pressed={selected}
      aria-label={`Language: ${language.name}`}
      className={`language-option-card ${selected ? "language-option-card--selected" : ""}`}
    >
      <div className="language-option-card__header">
        <div className="language-option-card__icon-wrapper">
          <span className="language-option-card__icon">{language.icon}</span>
          <span className={`language-option-card__title ${selected ? "language-option-card__title--selected" : "language-option-card__title--default"}`}>
            {language.name}
          </span>
        </div>
        <SelectedCheckmark visible={selected} color="var(--color-primary)" />
      </div>
      <span className="language-option-card__subtitle">
        {language.nativeName}
      </span>
    </button>
  );
}
