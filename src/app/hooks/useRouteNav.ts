import { useMemo } from "react";
import { useLocation } from "react-router";

/**
 * Derives activeMain, activeSub, activeThird from the current URL path.
 * URL pattern: /:mainNav/:subNav?/:thirdNav?
 */
export function useRouteNav() {
  const { pathname } = useLocation();

  return useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    return {
      activeMain: parts[0] || "dashboard",
      activeSub: parts[1] || null,
      activeThird: parts[2] || null,
    };
  }, [pathname]);
}
