import { useEffect, useState, startTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { setIsDesktop } from "../store/uiSlice";
import { useAppearance } from "../hooks/useAppearance";
import { LoginPage } from "../pages/auth/LoginPage";
import { AppShell } from "./AppShell";
import { HelpProvider } from "../context/HelpContext";
import { HelpDrawer } from "../components/help/HelpDrawer";

/**
 * Root route component — handles appearance side-effects, isDesktop sync,
 * and authentication gate. Renders AppShell (with <Outlet>) when authenticated.
 * HelpProvider wraps both login and app so the help drawer is available everywhere.
 */
export function AppRoot() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  // Defer the shell swap so lazy route components suspend inside a transition
  const [showShell, setShowShell] = useState(isAuthenticated);
  useEffect(() => {
    startTransition(() => setShowShell(isAuthenticated));
  }, [isAuthenticated]);

  useAppearance();

  useEffect(() => {
    const sync = () => dispatch(setIsDesktop(window.innerWidth >= 1024));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [dispatch]);

  return (
    <HelpProvider>
      {showShell ? <AppShell /> : <LoginPage />}
      <HelpDrawer />
    </HelpProvider>
  );
}
