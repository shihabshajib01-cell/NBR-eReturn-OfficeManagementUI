import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { MoreHorizontal, X } from "lucide-react";
import { useUIState } from "../../hooks/useUI";

type LucideIcon = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

export type RowAction = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
  danger?: boolean;
};

interface RowMoreMenuProps {
  actions: RowAction[];
}

export function RowMoreMenu({ actions }: RowMoreMenuProps) {
  const { t: translate } = useTranslation("common");
  const { isDesktop } = useUIState();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const menuContent = (
    <div className="row-more-menu">
      {actions.map((a) => {
        const ActionIcon = a.icon;
        return (
          <button
            key={a.label}
            type="button"
            onClick={() => {
              a.onClick();
              setOpen(false);
            }}
            className={`row-more-menu__item${a.danger ? " row-more-menu__item--danger" : ""}`}
          >
            <ActionIcon size={13} strokeWidth={2} aria-hidden="true" />
            {a.label}
          </button>
        );
      })}
    </div>
  );

  // Mobile: render as bottom sheet with backdrop
  const mobileMenu = typeof document !== "undefined" ? createPortal(
    <>
      <div
        className="mobile-modal-backdrop"
        onClick={() => setOpen(false)}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15, 23, 42, 0.48)" }}
      />
      <div
        className="mobile-modal-wrapper mobile-modal-confirm"
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201 }}
      >
        <div className="mobile-modal-header" style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--color-border)" }}>
          <h2 className="mobile-modal-title" style={{ fontSize: "var(--fs-h3, 18px)", fontWeight: 600 }}>
            {translate("accessibility.moreActions")}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="mobile-modal-close"
            aria-label="Close actions"
            style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="mobile-modal-body" style={{ padding: "8px 0" }}>
          {menuContent}
        </div>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={translate("accessibility.moreActions")}
        title={translate("accessibility.moreActions")}
        aria-expanded={open}
        className="row-more-btn"
      >
        <MoreHorizontal size={14} strokeWidth={2} aria-hidden="true" />
      </button>
      {open && (isDesktop ? menuContent : mobileMenu)}
    </div>
  );
}
