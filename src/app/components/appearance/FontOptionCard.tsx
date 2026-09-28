import { FontPreviewText } from "./FontPreviewText";
import { SelectedCheckmark } from "./SelectedCheckmark";

type FontId = "poppins" | "noto-sans" | "google-sans";

interface FontConfig {
  id: FontId;
  name: string;
  family: string;
  preview: string;
}

interface FontOptionCardProps {
  font: FontConfig;
  selected: boolean;
  onSelect: (id: FontId) => void;
}

export function FontOptionCard({ font, selected, onSelect }: FontOptionCardProps) {
  return (
    <button
      onClick={() => onSelect(font.id)}
      aria-pressed={selected}
      aria-label={`Font: ${font.name}`}
      className={`w-full flex items-start justify-between px-3 py-3 rounded-xl text-left transition-all duration-100 border-[1.5px] border-solid focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2 ${selected ? "border-[var(--color-primary)] bg-[var(--color-primary-alpha-6)]" : "border-[var(--color-border)] bg-transparent hover:border-[var(--color-primary-alpha-12)] hover:bg-[var(--color-primary-alpha-3)]"}`}
    >
      <div className="min-w-0">
        <p style={{ fontFamily: font.family, lineHeight: 1.3 }} className={`text-[13px] ${selected ? "font-semibold text-[var(--color-primary)]" : "font-medium text-[var(--color-text-primary)]"}`}>
          {font.name}
        </p>
        <FontPreviewText text={font.preview} fontFamily={font.family} color="var(--color-text-secondary)" />
      </div>
      <SelectedCheckmark visible={selected} color="var(--color-primary)" />
    </button>
  );
}

export type { FontId, FontConfig };
