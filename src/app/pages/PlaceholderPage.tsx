import { useTranslation } from "react-i18next";
import { useRouteNav } from "../hooks/useRouteNav";
import { NAVIGATION } from "../data/navigation";

/**
 * PlaceholderPage - Shown when a main nav item is selected but no specific child page
 * Prompts the user to select a page from the secondary sidebar
 */
export function PlaceholderPage() {
  const { t: translate } = useTranslation("navigation");
  const { t: translateCommon } = useTranslation("common");
  const { activeMain } = useRouteNav();

  const activeMainItem = NAVIGATION.find((n) => n.id === activeMain);
  const mainLabel = activeMainItem?.label || "Section";

  return (
    <div className="placeholder-page">
      <div className="placeholder-page__content">
        <div className="placeholder-page__icon">
          {activeMainItem?.icon && (() => {
            const Icon = activeMainItem.icon;
            return <Icon size={48} strokeWidth={1.5} className="placeholder-page__icon-svg" />;
          })()}
        </div>
        <h1 className="placeholder-page__title">
          {mainLabel}
        </h1>
        <p className="placeholder-page__message">
          {translateCommon("navigation.selectPageFromSidebar", "Please select a page from the sidebar to continue.")}
        </p>
      </div>
    </div>
  );
}
