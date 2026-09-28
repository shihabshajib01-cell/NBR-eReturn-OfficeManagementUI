import { useState } from "react";
import { createPortal } from "react-dom";
import {
  BellDot, BadgeCheck, CheckCircle, UserCheck, FilePen, Receipt,
  UserCog, Shield, Info, X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type {
  Notification,
  NotificationType,
  NotificationPriority,
} from "../../store/notificationsSlice";
import { useUIState } from "../../hooks/useUI";

type LucideIcon = React.ComponentType<{
  size?: number; strokeWidth?: number; className?: string;
}>;

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
  onNotificationClick: (notification: Notification) => void;
  onMarkAllRead: () => void;
  forceBottomSheet?: boolean;
}

function getNotificationIcon(type: NotificationType): LucideIcon {
  switch (type) {
    case "approval": return BadgeCheck;
    case "status": return CheckCircle;
    case "assignment": return UserCheck;
    case "correction": return FilePen;
    case "payment": return Receipt;
    case "user-role": return UserCog;
    case "security": return Shield;
    case "system": return Info;
  }
}

export function NotificationDropdown({
  notifications, onClose, onNotificationClick, onMarkAllRead, forceBottomSheet = false,
}: NotificationDropdownProps) {
  const { t: translate } = useTranslation("notifications");
  const { isDesktop } = useUIState();
  const isMobile = forceBottomSheet || !isDesktop;
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.isRead;
    if (activeFilter === "approvals") return n.type === "approval";
    if (activeFilter === "assigned") return n.type === "assignment";
    if (activeFilter === "security") return n.type === "security";
    return true;
  });

  const filters = [
    { id: "all", label: translate("filters.all") },
    { id: "unread", label: translate("filters.unread") },
    { id: "approvals", label: translate("filters.approvals") },
    { id: "assigned", label: translate("filters.assigned") },
    { id: "security", label: translate("filters.security") },
  ];

  const dropdownContent = (
    <div
      className={isMobile ? "notification-dropdown notification-dropdown--bottom-sheet" : "notification-dropdown dropdown-enter"}
      style={isMobile ? undefined : { width: "min(420px, calc(100vw - 32px))", maxHeight: "calc(100vh - 120px)" }}
    >
      {/* Header */}
      <div className="notification-dropdown__header">
        <div className="notification-dropdown__header-left">
          <h3 className="notification-dropdown__title">{translate("title")}</h3>
          {unreadCount > 0 && (
            <span className="notification-dropdown__unread-badge">
              {unreadCount} {translate("new")}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} className="notification-dropdown__mark-read">
              {translate("markAllAsRead")}
            </button>
          )}
          {isMobile && (
            <button
              onClick={onClose}
              className="mobile-modal-close"
              aria-label="Close notifications"
              style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={20} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="notification-dropdown__filters">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`notification-dropdown__filter-chip${activeFilter === filter.id ? " notification-dropdown__filter-chip--active" : ""}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="notification-dropdown__list">
        {filteredNotifications.length === 0 ? (
          <div className="notification-dropdown__empty">
            <div className="notification-dropdown__empty-icon">
              <BellDot size={20} strokeWidth={1.75} />
            </div>
            <h4 className="notification-dropdown__empty-title">{translate("empty.title")}</h4>
            <p className="notification-dropdown__empty-text">{translate("allCaughtUp")}</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <button
                key={notification.id}
                onClick={() => onNotificationClick(notification)}
                className={`notification-dropdown__item${notification.isRead ? "" : " notification-dropdown__item--unread"}`}
              >
                <div className="notification-dropdown__item-icon">
                  <Icon size={16} strokeWidth={1.75} />
                </div>
                <div className="notification-dropdown__item-content">
                  <div className="notification-dropdown__item-header">
                    <h4 className={`notification-dropdown__item-title${notification.isRead ? "" : " notification-dropdown__item-title--unread"}`}>
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <span className="notification-dropdown__item-unread-dot" aria-hidden="true" />
                    )}
                  </div>
                  <p className="notification-dropdown__item-message">{notification.message}</p>
                  <div className="notification-dropdown__item-meta">
                    <span>{notification.module}</span>
                    <span aria-hidden="true">·</span>
                    <span>{notification.time}</span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="notification-dropdown__footer">
          <button onClick={onClose} className="notification-dropdown__see-all">
            {translate("seeAll")}
          </button>
        </div>
      )}
    </div>
  );

  // On mobile, render in portal with backdrop; on desktop, render inline
  if (isMobile && typeof document !== "undefined") {
    return createPortal(
      <>
        <div
          className="mobile-modal-backdrop"
          onClick={onClose}
          aria-hidden="true"
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15, 23, 42, 0.48)" }}
        />
        {dropdownContent}
      </>,
      document.body
    );
  }

  return dropdownContent;
}

// Re-export types from the canonical source for backwards compat
export type { Notification, NotificationType, NotificationPriority } from "../../store/notificationsSlice";
