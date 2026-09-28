import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  setMobileDrawerOpen,
  toggleSecNavState,
  toggleMobileDrawer,
  setIsDesktop,
} from "../store/uiSlice";

export function useUIState() {
  // Returns secNavState, mobileDrawerOpen, isDesktop.
  // Routing state (activeMain/activeSub/activeThird) comes from useRouteNav.
  // Accordion expansion is derived from URL — no expandedSubs state.
  return useSelector((state: RootState) => state.ui);
}

export function useUIDispatch() {
  const dispatch = useDispatch<AppDispatch>();
  return {
    setMobileDrawerOpen: (open: boolean) => dispatch(setMobileDrawerOpen(open)),
    toggleMobileDrawer: () => dispatch(toggleMobileDrawer()),
    toggleSecNavState: () => dispatch(toggleSecNavState()),
    setIsDesktop: (v: boolean) => dispatch(setIsDesktop(v)),
  };
}

// Derived: compute secondary nav width from Redux state
export function useSecNavWidth(): { secNavWidth: string; secNavCompact: boolean } {
  const { secNavState, mobileDrawerOpen, isDesktop } = useUIState();
  const secNavCompact = isDesktop && secNavState === "compact";
  const secNavWidth = mobileDrawerOpen
    ? "240px"
    : isDesktop && secNavState === "compact"
      ? "52px"
      : isDesktop && secNavState === "expanded"
        ? "240px"
        : "0px";
  return { secNavWidth, secNavCompact };
}
