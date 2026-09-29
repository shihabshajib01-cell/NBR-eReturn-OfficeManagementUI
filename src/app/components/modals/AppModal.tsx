import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useReturnFocus } from "../../hooks/useReturnFocus";

export interface AppModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Footer slot — render your action buttons here */
  footer?: React.ReactNode;
  /** Width preset */
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  /** Icon shown in the header beside the title */
  icon?: React.ReactNode;
  /** ID of element that describes the dialog content (aria-describedby) */
  describedBy?: string;
  /** "top" raises z-index above drawers (use for modals opened from inside a drawer) */
  layer?: "default" | "top";
}

const SIZE_CLASS: Record<string, string> = {
  sm: "app-modal--sm",
  md: "app-modal--md",
  lg: "app-modal--lg",
  xl: "app-modal--xl",
  xxl: "app-modal--xxl",
};

export function AppModal({
  open,
  title,
  onClose,
  children,
  footer,
  size = "md",
  icon,
  describedBy,
  layer = "default",
}: AppModalProps) {
  const { t: translate } = useTranslation("common");
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open);
  useReturnFocus(open);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Auto-focus close button
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => closeRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className={["app-modal-backdrop overlay-enter", layer === "top" ? "app-modal-backdrop--top" : ""].filter(Boolean).join(" ")}
      onClick={onClose}
      role="presentation"
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
        aria-describedby={describedBy}
        className={["app-modal-panel modal-enter", SIZE_CLASS[size]].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="app-modal-header">
          <div className="app-modal-header__leading">
            {icon && <span className="app-modal-header__icon" aria-hidden="true">{icon}</span>}
            <h2 id="app-modal-title" className="app-modal-header__title">{title}</h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="app-modal-close"
            type="button"
            aria-label={translate("accessibility.closeModal")}
          >
            <X size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="app-modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="app-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
