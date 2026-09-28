import { ColorSwatchGroup } from "./ColorSwatchGroup";
import { SelectedCheckmark } from "./SelectedCheckmark";

type ThemeId = "indigo-blue" | "gov-blue" | "slate-purple" | "plum-executive" | "fresh-teal" | "dark-mode";

interface ThemeConfig {
  id: ThemeId;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  border: string;
  textPrimary: string;
}

interface ThemeOptionCardProps {
  theme: ThemeConfig;
  selected: boolean;
  onSelect: (id: ThemeId) => void;
}

function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ThemeOptionCard({ theme, selected, onSelect }: ThemeOptionCardProps) {
  return (
    <button
      onClick={() => onSelect(theme.id)}
      aria-pressed={selected}
      aria-label={`Color theme: ${theme.name}`}
      className="flex flex-col gap-2.5 p-3 rounded-xl text-left transition-all duration-100 w-full"
      style={{
        border: `1.5px solid ${selected ? theme.primary : "var(--color-border)"}`,
        backgroundColor: selected ? rgba(theme.primary, 0.06) : "var(--color-surface)",
        boxShadow: selected ? `0 0 0 3px ${rgba(theme.primary, 0.1)}` : "none",
        outline: "none",
      }}
      onFocus={(e) => { e.currentTarget.style.outline = `2px solid ${theme.primary}`; e.currentTarget.style.outlineOffset = "2px"; }}
      onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
      onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.borderColor = rgba(theme.primary, 0.4); e.currentTarget.style.backgroundColor = rgba(theme.primary, 0.03); } }}
      onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.backgroundColor = "var(--color-surface)"; } }}
    >
      <div className="flex items-center justify-between w-full">
        <ColorSwatchGroup colors={[theme.primary, theme.secondary, theme.accent]} />
        <SelectedCheckmark visible={selected} color={theme.primary} />
      </div>
      <span
        className={`text-[12px] leading-[1.3] ${selected ? 'font-semibold' : 'font-medium'}`}
        style={{ color: selected ? theme.primary : "var(--color-text-primary)" }}
      >
        {theme.name}
      </span>
    </button>
  );
}

// Export types for use in other components
export type { ThemeId, ThemeConfig };
