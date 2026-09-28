import { useState } from "react";
import { useTranslation } from "react-i18next";
import nbrLogo from "../../../assets/logos/nbr-logo.png";

interface SidebarLogoProps {
  onLogoClick: () => void;
}

export function SidebarLogo({ onLogoClick }: SidebarLogoProps) {
  const { t: translate } = useTranslation("common");
  const [logoHovered, setLogoHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onLogoClick}
      onMouseEnter={() => setLogoHovered(true)}
      onMouseLeave={() => setLogoHovered(false)}
      className="sidebar-logo"
      aria-label={translate("accessibility.goToDashboard")}
      title={translate("accessibility.goToDashboard")}
    >
      <img
        src={nbrLogo}
        alt="NBR Logo"
        className="sidebar-logo__image"
      />
    </button>
  );
}
