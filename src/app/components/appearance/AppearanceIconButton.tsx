import { Palette } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AppearanceIconButtonProps {
  onClick: () => void;
  open: boolean;
}

export function AppearanceIconButton({ onClick, open }: AppearanceIconButtonProps) {
  const { t: translate } = useTranslation("common");
  return (
    <button
      onClick={onClick}
      title={translate("accessibility.appearanceSettings")}
      aria-label={translate("accessibility.appearanceSettings")}
      aria-expanded={open}
      aria-haspopup="dialog"
      className={`topbar__icon-button${open ? " topbar__icon-button--active" : ""} relative flex-shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2`}
    >
      <Palette size={17} strokeWidth={1.75} className="topbar__icon-button-icon" />
    </button>
  );
}
