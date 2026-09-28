import { useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useUIState } from "../../hooks/useUI";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useReturnFocus } from "../../hooks/useReturnFocus";

interface ResponsiveOverlayProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Desktop drawer width (default: 480px) */
  desktopWidth?: string;
  /** Mobile max height (default: 90vh) */
  mobileMaxHeight?: string;
  /** Show close button in header (default: true) */
  showCloseButton?: boolean;
  /** Additional CSS class for wrapper */
  className?: string;
  /** Close button aria label */
  closeLabel?: string;
  /** ID of element that describes the dialog content (aria-describedby) */
  describedBy?: string;
}

export function ResponsiveOverlay({
  open,
  onClose,
  title,
  children,
  footer,
  desktopWidth = "480px",
  mobileMaxHeight = "90vh",
  showCloseButton = true,
  className = "",
  closeLabel = "Close",
  describedBy,
}: ResponsiveOverlayProps) {
  const { isDesktop } = useUIState();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open);
  useReturnFocus(open);

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

  // Auto-focus close button on open
  useEffect(() => {
    if (open && closeButtonRef.current) {
      const timer = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const content = (
    <>
      {/* Backdrop */}
      <div
        className="responsive-overlay__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Overlay Panel */}
      <div
        ref={panelRef}
        className={`responsive-overlay ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "responsive-overlay-title" : undefined}
        aria-describedby={describedBy}
        style={{
          "--overlay-desktop-width": desktopWidth,
          "--overlay-mobile-max-height": mobileMaxHeight,
        } as React.CSSProperties}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="responsive-overlay__header">
            {title && (
              <h2 id="responsive-overlay-title" className="responsive-overlay__title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="responsive-overlay__close"
                aria-label={closeLabel}
                type="button"
              >
                <X size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="responsive-overlay__body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="responsive-overlay__footer">
            {footer}
          </div>
        )}
      </div>
    </>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : null;
}
