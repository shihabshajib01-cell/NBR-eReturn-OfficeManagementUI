import { useTranslation } from "react-i18next";
import { NAVIGATION } from "../data/navigation";
import { useRouteNav } from "./useRouteNav";

export function useBreadcrumbs() {
  const { activeMain, activeSub, activeThird } = useRouteNav();
  const { t: translateNav } = useTranslation("navigation");
  const { t: translateBreadcrumb } = useTranslation("breadcrumbs");

  const activeMainItem = NAVIGATION.find((n) => n.id === activeMain) ?? NAVIGATION[0];

  function getNavLabel(mainId: string, subId?: string, thirdId?: string, fallback?: string): string {
    const mainKey = mainId.replace(/-./g, (m) => m[1].toUpperCase());
    if (thirdId) {
      const thirdKey = thirdId.replace(/-./g, (m) => m[1].toUpperCase());
      return translateNav(`${mainKey}.${thirdKey}`, fallback || thirdId);
    }
    if (subId) {
      const subKey = subId.replace(/-./g, (m) => m[1].toUpperCase());
      return translateNav(`${mainKey}.${subKey}`, fallback || subId);
    }
    return translateNav(`${mainKey}.main`, fallback || mainId);
  }

  const breadcrumbs: string[] = [
    translateBreadcrumb("home"),
    getNavLabel(activeMainItem.id, undefined, undefined, activeMainItem.label),
  ];

  if (activeSub) {
    const subItem = activeMainItem.children.find((c) => c.id === activeSub);
    if (subItem) {
      breadcrumbs.push(getNavLabel(activeMainItem.id, subItem.id, undefined, subItem.label));
    }
    if (activeThird && subItem?.children) {
      const thirdItem = subItem.children.find((c) => c.id === activeThird);
      if (thirdItem) {
        breadcrumbs.push(getNavLabel(activeMainItem.id, subItem.id, thirdItem.id, thirdItem.label));
      }
    }
  }

  return { breadcrumbs, activeMainItem, getNavLabel };
}
