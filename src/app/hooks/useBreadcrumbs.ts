import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { NAVIGATION } from "../data/navigation";
import { useRouteNav } from "./useRouteNav";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function useBreadcrumbs() {
  const { activeMain, activeSub, activeThird } = useRouteNav();
  const location = useLocation();
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

  const isDoubleEntryRoute =
    activeMainItem.id === "dashboard" && activeSub === "combined-dashboard";

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: translateBreadcrumb("home"),
      to: isDoubleEntryRoute ? "/dashboard/dashboard-main" : undefined,
    },
    {
      label: getNavLabel(activeMainItem.id, undefined, undefined, activeMainItem.label),
      to: isDoubleEntryRoute ? "/dashboard/dashboard-main" : undefined,
    },
  ];

  if (activeSub) {
    const subItem = activeMainItem.children.find((c) => c.id === activeSub);
    if (subItem) {
      const isDoubleEntry = activeMainItem.id === "dashboard" && subItem.id === "combined-dashboard";
      const params = isDoubleEntry ? new URLSearchParams(location.search) : null;
      const zone = params?.get("zone") || "";
      const circle = params?.get("circle") || "";

      breadcrumbs.push({
        label: getNavLabel(activeMainItem.id, subItem.id, undefined, subItem.label),
        to: isDoubleEntry && (zone || circle) ? "/dashboard/combined-dashboard" : undefined,
      });

      if (isDoubleEntry && zone) {
        breadcrumbs.push({
          label: zone,
          to: circle
            ? `/dashboard/combined-dashboard?zone=${encodeURIComponent(zone)}`
            : undefined,
        });
      }

      if (isDoubleEntry && circle) {
        breadcrumbs.push({ label: circle });
      }
    }

    if (activeThird && subItem?.children) {
      const thirdItem = subItem.children.find((c) => c.id === activeThird);
      if (thirdItem) {
        breadcrumbs.push({
          label: getNavLabel(activeMainItem.id, subItem.id, thirdItem.id, thirdItem.label),
        });
      }
    }
  }

  return { breadcrumbs, activeMainItem, getNavLabel };
}
