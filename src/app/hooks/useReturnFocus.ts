import { useEffect } from "react";

/**
 * When `active` transitions true → false, returns focus to whatever element
 * was focused when `active` first became true.
 * Used by drawers, modals, and overlays so keyboard users land back on the
 * trigger element that opened them.
 */
export function useReturnFocus(active: boolean) {
  useEffect(() => {
    if (!active) return;
    // Capture the element that had focus when the overlay opened
    const previousElement = document.activeElement as HTMLElement | null;
    return () => {
      if (previousElement && previousElement !== document.body) {
        requestAnimationFrame(() => {
          try { previousElement.focus({ preventScroll: true }); } catch { /* ignore */ }
        });
      }
    };
  }, [active]);
}
