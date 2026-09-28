interface MobileBackdropProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Mobile drawer backdrop overlay
 * Displays when mobile sidebar is open, closes drawer on click
 */
export function MobileBackdrop({ isOpen, onClose }: MobileBackdropProps) {
  if (!isOpen) return null;

  return (
    <div
      className="app-mobile-backdrop"
      onClick={onClose}
      aria-hidden="true"
    />
  );
}
