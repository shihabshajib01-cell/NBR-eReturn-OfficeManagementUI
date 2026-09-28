import type { KeyboardEvent } from "react";
import type { IconComponent } from "../../pages/modulePageUtils";

interface StatCardProps {
  icon: IconComponent;
  value: string;
  label: string;
  subInfo?: string;
  trend?: string;
  trendUp?: boolean;
  tone?: "primary" | "success" | "warning" | "error" | "neutral";
  loading?: boolean;
  onClick?: () => void;
  compactValue?: boolean;
}

export function StatCard({ icon: Icon, value, label, subInfo, tone = "primary", loading, onClick, compactValue }: StatCardProps) {
  const isClickable = !!onClick;
  const displayValue = loading ? "—" : value;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isClickable && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`${label}: ${displayValue}${subInfo ? `, ${subInfo}` : ""}`}
      className={`stat-card stat-card--${tone}${isClickable ? " stat-card--clickable" : ""}${compactValue ? " stat-card--compact-value" : ""}`}
    >
      <div className="stat-card__body">
        <div className="stat-card__content">
          <p className="stat-card__value" aria-hidden="true">{displayValue}</p>
          <p className="stat-card__label" aria-hidden="true">{label}</p>
          {subInfo && <p className="stat-card__sub-info" aria-hidden="true">{subInfo}</p>}
        </div>

        <div className="stat-card__icon-container" aria-hidden="true">
          <Icon size={22} strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
