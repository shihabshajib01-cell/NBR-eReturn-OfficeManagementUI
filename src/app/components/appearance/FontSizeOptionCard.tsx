import { Check } from "lucide-react";

type FontSizeId = "compact" | "standard" | "large";

interface FontSizeConfig {
  id: FontSizeId;
  name: string;
  preview: string;
  description: string;
}

interface FontSizeOptionCardProps {
  config: FontSizeConfig;
  selected: boolean;
  onSelect: (id: FontSizeId) => void;
}

const previewSizes: Record<FontSizeId, string> = {
  compact: "16px", standard: "22px", large: "30px",
};

export function FontSizeOptionCard({ config, selected, onSelect }: FontSizeOptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(config.id)}
      aria-pressed={selected}
      aria-label={`Font size: ${config.name}. ${config.description}`}
      className={`w-full text-left rounded-xl transition-all px-[14px] py-3 border-2 border-solid cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2 ${selected ? "border-[var(--color-primary)] bg-[var(--color-primary-alpha-6)]" : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-primary-alpha-12)] hover:bg-[var(--color-primary-alpha-3)]"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${selected ? "bg-[var(--color-primary-alpha-12)]" : "bg-[var(--color-text-secondary-alpha-8)]"}`}
            aria-hidden="true"
          >
            <span
              style={{ fontSize: previewSizes[config.id], fontWeight: 600, lineHeight: 1 }}
              className={selected ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}
            >
              Aa
            </span>
          </div>
          <div className="min-w-0">
            <p className={`text-[13px] font-semibold leading-snug ${selected ? "text-[var(--color-primary)]" : "text-[var(--color-text-primary)]"}`}>{config.name}</p>
            <p className="text-[11px] leading-snug mt-0.5 truncate text-[var(--color-text-secondary)]">{config.description}</p>
          </div>
        </div>
        <div
          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all border-2 ${selected ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "bg-transparent border-[var(--color-border)]"}`}
          aria-hidden="true"
        >
          {selected && <Check size={10} strokeWidth={3} className="text-white" />}
        </div>
      </div>
    </button>
  );
}

export type { FontSizeId, FontSizeConfig };
