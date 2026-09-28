import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { useUIState } from "../hooks/useUI";
import { useSecNavWidth } from "../hooks/useUI";
import { setMobileDrawerOpen } from "../store/uiSlice";
import { NAVIGATION } from "../data/navigation";
import { PrimarySidebar } from "../components/navigation/PrimarySidebar";
import { SecondarySidebar } from "../components/navigation/SecondarySidebar";
import { MobileNavigationDrawer } from "../components/navigation/MobileNavigationDrawer";
import { NAV_DISPLAY_LABEL } from "../data/navigation";

interface SidebarShellProps {
  onLogoClick: () => void;
  onMainNavClick: (id: string) => void;
  onSubNavClick: (mainIdOrSubId: string, subId?: string) => void;
  onThirdNavClick: (thirdId: string, parentId: string, mainId?: string) => void;
}

/**
 * Sidebar shell — reads all navigation state from Redux.
 * Only navigation handler callbacks are received from parent.
 * PrimarySidebar and SecondarySidebar read active state from Redux directly.
 */
export function SidebarShell({
  onLogoClick,
  onMainNavClick,
  onSubNavClick,
  onThirdNavClick,
}: SidebarShellProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { mobileDrawerOpen } = useUIState();

  return (
    <>
      {/* Desktop Sidebar — Primary + Secondary side by side */}
      <aside className="app-sidebar-shell app-sidebar-shell--desktop">
        <PrimarySidebar
          onNavClick={onMainNavClick}
          onLogoClick={onLogoClick}
        />
        <SecondarySidebar
          onSubNavClick={onSubNavClick}
          onThirdNavClick={onThirdNavClick}
          onMobileClose={() => dispatch(setMobileDrawerOpen(false))}
        />
      </aside>

      {/* Mobile Sidebar — Unified Navigation Drawer */}
      <aside
        className={[
          "app-sidebar-shell",
          "app-sidebar-shell--mobile",
          mobileDrawerOpen ? "app-sidebar-shell--open" : "",
        ].join(" ")}
      >
        <MobileNavigationDrawer
          onLogoClick={onLogoClick}
          onMainNavClick={onMainNavClick}
          onSubNavClick={onSubNavClick}
          onThirdNavClick={onThirdNavClick}
          onClose={() => dispatch(setMobileDrawerOpen(false))}
        />
      </aside>
    </>
  );
}
