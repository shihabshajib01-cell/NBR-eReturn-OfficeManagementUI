import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { SidebarLogo } from "./SidebarLogo";
import { NAVIGATION, NAV_DISPLAY_LABEL } from "../../data/navigation";
import { useRouteNav } from "../../hooks/useRouteNav";

type LucideIcon = React.ComponentType<{
  size?: number; strokeWidth?: number; style?: React.CSSProperties; className?: string;
}>;

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  labelKey?: string;
}

interface PrimarySidebarProps {
  onNavClick: (id: string) => void;
  onLogoClick: () => void;
}

// ── NavTooltip ────────────────────────────────────────────────────────────────
function NavTooltip({ label, triggerRect }: { label: string; triggerRect: DOMRect }) {
  if (typeof document === "undefined") return null;
  const top = triggerRect.top + triggerRect.height / 2;
  const left = triggerRect.right + 10;
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        transform: "translateY(-50%)",
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{
        width: 0, height: 0,
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        borderRight: "5px solid var(--color-tooltip-bg, #1e293b)",
        flexShrink: 0,
      }} />
      <div style={{
        backgroundColor: "var(--color-tooltip-bg, #1e293b)",
        color: "var(--color-tooltip-text, #f8fafc)",
        borderRadius: "8px",
        padding: "6px 12px",
        fontSize: "12px",
        fontWeight: 500,
        whiteSpace: "nowrap",
        boxShadow: "0 4px 16px rgba(0,0,0,0.28), 0 1px 4px rgba(0,0,0,0.16)",
        letterSpacing: "0.01em",
        lineHeight: 1.4,
      }}>
        {label}
      </div>
    </div>,
    document.body
  );
}

// ── FirstLayerNavItem ─────────────────────────────────────────────────────────
function FirstLayerNavItem({
  id, label, displayLabel, icon: Icon, active, onClick,
}: {
  id: string; label: string; displayLabel: string; icon: LucideIcon;
  active: boolean; onClick: (id: string) => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tooltipRect, setTooltipRect] = useState<DOMRect | null>(null);

  const showTooltip = (hovered || focused) && !!tooltipRect;

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => onClick(id)}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={[
          "primary-nav-item",
          active ? "primary-nav-item--active" : "",
          hovered || focused ? "primary-nav-item--hovered" : "",
        ].join(" ")}
        onMouseEnter={() => {
          setHovered(true);
          if (btnRef.current) setTooltipRect(btnRef.current.getBoundingClientRect());
        }}
        onMouseLeave={() => { setHovered(false); setTooltipRect(null); }}
        onFocus={() => {
          setFocused(true);
          if (btnRef.current) setTooltipRect(btnRef.current.getBoundingClientRect());
        }}
        onBlur={() => { setFocused(false); setTooltipRect(null); }}
      >
        <div
          className={[
            "primary-nav-item__icon-container",
            active ? "primary-nav-item__icon-container--active" : "",
            !active && (hovered || focused) ? "primary-nav-item__icon-container--hover" : "",
          ].join(" ")}
        >
          <Icon
            size={20}
            strokeWidth={active || hovered || focused ? 2 : 1.75}
            className={[
              "primary-nav-item__icon",
              active ? "primary-nav-item__icon--active" :
              (hovered || focused) ? "primary-nav-item__icon--hover" :
              "primary-nav-item__icon--inactive",
            ].join(" ")}
          />
        </div>
        <span
          className={[
            "primary-nav-item__label",
            active ? "primary-nav-item__label--active" :
            (hovered || focused) ? "primary-nav-item__label--hover" :
            "primary-nav-item__label--inactive",
          ].join(" ")}
        >
          {displayLabel}
        </span>
      </button>
      {showTooltip && tooltipRect && (
        <NavTooltip label={label} triggerRect={tooltipRect} />
      )}
    </>
  );
}

// ── PrimarySidebar ────────────────────────────────────────────────────────────
// Reads activeMain from Redux; navigation config from data imports.
export function PrimarySidebar({ onNavClick, onLogoClick }: PrimarySidebarProps) {
  const { t: translate } = useTranslation("navigation");
  const { t: tc } = useTranslation("common");
  const { activeMain } = useRouteNav();

  const getNavLabel = (item: NavItem): string => {
    if (item.labelKey) return translate(item.labelKey, item.label);
    const key = item.id.replace(/-./g, match => match[1].toUpperCase());
    return translate(`${key}.main`, item.label);
  };

  const getNavDisplayLabel = (item: NavItem): string => {
    const displayFallback = NAV_DISPLAY_LABEL[item.id] || item.label;
    if (item.labelKey) return translate(item.labelKey, displayFallback);
    const key = item.id.replace(/-./g, match => match[1].toUpperCase());
    return translate(`${key}.main`, displayFallback);
  };

  return (
    <div className="primary-sidebar">
      <SidebarLogo onLogoClick={onLogoClick} />
      <nav
        className="primary-nav"
        aria-label={tc("accessibility.primaryNavigation")}
      >
        {NAVIGATION.filter(({ id }) => id !== "settings").map(({ id, label, icon }) => (
          <FirstLayerNavItem
            key={id}
            id={id}
            label={getNavLabel({ id, label, icon })}
            displayLabel={getNavDisplayLabel({ id, label, icon })}
            icon={icon}
            active={activeMain === id}
            onClick={onNavClick}
          />
        ))}
      </nav>
    </div>
  );
}
