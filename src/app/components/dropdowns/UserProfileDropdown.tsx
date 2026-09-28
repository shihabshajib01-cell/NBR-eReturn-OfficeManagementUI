import { User, Settings, History, Lock, Smartphone, ShieldCheck as ShieldCheckIcon, LogOut, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { logout } from "../../store/authSlice";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useUIState } from "../../hooks/useUI";

interface UserProfileDropdownProps {
  onClose: () => void;
  onSignOut?: () => void;
}

export function UserProfileDropdown({ onClose: _onClose }: UserProfileDropdownProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useCurrentUser();
  const { t: translate } = useTranslation("user");
  const { t: translateActions } = useTranslation("actions");
  const { isDesktop } = useUIState();

  const menuItems = [
    { id: "view-profile", label: translate("profile.viewProfile"), icon: User },
    { id: "account-settings", label: translate("profile.accountSettings"), icon: Settings },
    { id: "activity-log", label: translate("profile.activityLog"), icon: History },
  ];

  const securityItems = [
    { id: "change-password", label: translate("profile.changePassword"), icon: Lock },
    { id: "manage-2fa", label: translate("profile.manage2FA"), icon: Smartphone },
    { id: "login-activity", label: translate("profile.loginDeviceActivity"), icon: ShieldCheckIcon },
  ];

  const dropdownContent = (
    <div
      className="account-dropdown dropdown-enter"
      style={{ width: "min(380px, calc(100vw - 32px))" }}
    >
      {/* Header — User Identity */}
      <div className="account-dropdown__header">
        {!isDesktop && (
          <button
            onClick={_onClose}
            className="mobile-modal-close"
            aria-label="Close profile"
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1
            }}
          >
            <X size={20} strokeWidth={2} />
          </button>
        )}
        <div className="account-dropdown__header-content">
          <div className="account-dropdown__avatar" aria-hidden="true">
            <span className="account-dropdown__avatar-text">{currentUser.shortName}</span>
          </div>
          <div className="account-dropdown__info">
            <h3 className="account-dropdown__name">{currentUser.name}</h3>
            <p className="account-dropdown__role">{currentUser.designation}</p>
            <p className="account-dropdown__email">{currentUser.email}</p>
          </div>
        </div>
      </div>

      {/* Account Summary */}
      <div className="account-dropdown__summary">
        <div className="account-dropdown__summary-grid">
          <div>
            <span className="account-dropdown__summary-item-label">{translate("profile.employeeId")}</span>
            <p className="account-dropdown__summary-item-value">{currentUser.employeeId}</p>
          </div>
          <div>
            <span className="account-dropdown__summary-item-label">{translate("profile.role")}</span>
            <p className="account-dropdown__summary-item-value">{currentUser.designation}</p>
          </div>
          <div>
            <span className="account-dropdown__summary-item-label">{translate("profile.zoneCircle")}</span>
            <p className="account-dropdown__summary-item-value">{currentUser.zone} · {currentUser.circle}</p>
          </div>
          <div>
            <span className="account-dropdown__summary-item-label">{translate("profile.lastLogin")}</span>
            <p className="account-dropdown__summary-item-value">{translate("profile.today")}, 9:42 AM</p>
          </div>
        </div>
      </div>

      {/* Main Content — Scrollable */}
      <div className="account-dropdown__content">
        {/* Quick Actions */}
        <div className="account-dropdown__menu-section">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className="account-dropdown__menu-item">
                <Icon size={18} strokeWidth={1.75} className="account-dropdown__menu-item-icon" aria-hidden="true" />
                <span className="account-dropdown__menu-item-label">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Security Section */}
        <div className="account-dropdown__menu-section">
          <div className="account-dropdown__section-header">
            <h4 className="account-dropdown__section-title">{translate("profile.security")}</h4>
          </div>
          {securityItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className="account-dropdown__menu-item">
                <Icon size={18} strokeWidth={1.75} className="account-dropdown__menu-item-icon" aria-hidden="true" />
                <span className="account-dropdown__menu-item-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer — Sign Out */}
      <div className="account-dropdown__footer">
        <button
          onClick={() => {
            _onClose();
            dispatch(logout());
          }}
          className="account-dropdown__signout-button"
        >
          <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
          <span>{translateActions("signOut")}</span>
        </button>
      </div>
    </div>
  );

  // On mobile, render in portal with backdrop; on desktop, render inline
  if (!isDesktop && typeof document !== "undefined") {
    return createPortal(
      <>
        <div
          className="mobile-modal-backdrop"
          onClick={_onClose}
          aria-hidden="true"
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15, 23, 42, 0.48)" }}
        />
        {/* Stop mousedown from reaching document so click-outside handler doesn't close the dropdown before click fires */}
        <div onMouseDown={(e) => e.stopPropagation()}>
          {dropdownContent}
        </div>
      </>,
      document.body
    );
  }

  return dropdownContent;
}
