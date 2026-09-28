import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

type LucideIcon = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  icon?: LucideIcon;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  icon: Icon,
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  className = "",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        "app-btn",
        "app-btn--primary",
        `app-btn--${size}`,
        fullWidth ? "app-btn--full" : "",
        loading ? "app-btn--loading" : "",
        className,
      ].filter(Boolean).join(" ")}
    >
      {loading ? (
        <Loader2 size={14} strokeWidth={2} className="app-btn__spinner" aria-hidden="true" />
      ) : Icon ? (
        <Icon size={14} strokeWidth={2} aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}
