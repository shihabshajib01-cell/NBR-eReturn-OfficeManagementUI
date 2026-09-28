import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { preloadAllRoutes } from "../routes";
import { useTranslation } from "react-i18next";
import type { AppDispatch } from "../store/store";
import { logout } from "../store/authSlice";
import { useSettings } from "../hooks/useSettings";
import { FONTS } from "../data/fonts";
import { useNavigation } from "../hooks/useNavigation";
import { useUIState, useUIDispatch } from "../hooks/useUI";
import { SignOutModal } from "../components/modals/SignOutModal";
import { MuiProvider } from "../components/ui/MuiProvider";
import { SidebarShell } from "./SidebarShell";
import { MainShell } from "./MainShell";
import { MobileBackdrop } from "./MobileBackdrop";
export function AppShell() {
  const [signOutOpen, setSignOutOpen] = useState(false);
  const { t: translate } = useTranslation("common");
  const dispatch = useDispatch<AppDispatch>();

  const { fontId } = useSettings();
  const fontFamily = FONTS[fontId].family;
  const { mobileDrawerOpen } = useUIState();
  const { setMobileDrawerOpen } = useUIDispatch();

  const {
    handleLogoClick,
    handleMainNavClick,
    handleSubNavClick,
    handleThirdNavClick,
    handleMenuToggle,
  } = useNavigation();

  // Warm all route chunks in the background so first-click navigation is instant
  useEffect(() => { preloadAllRoutes(); }, []);

  const handleConfirmSignOut = () => {
    setSignOutOpen(false);
    dispatch(logout());
  };

  return (
    <MuiProvider>
    <div className="app-shell" style={{ fontFamily }}>
      <a href="#main-content" className="skip-link">
        {translate("accessibility.skipToMainContent")}
      </a>

      <MobileBackdrop
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      <SidebarShell
        onLogoClick={handleLogoClick}
        onMainNavClick={handleMainNavClick}
        onSubNavClick={handleSubNavClick}
        onThirdNavClick={handleThirdNavClick}
      />

      <MainShell
        onMenuToggle={handleMenuToggle}
        onSignOut={() => setSignOutOpen(true)}
      />

      {signOutOpen && (
        <SignOutModal
          onConfirm={handleConfirmSignOut}
          onCancel={() => setSignOutOpen(false)}
        />
      )}
    </div>
    </MuiProvider>
  );
}
