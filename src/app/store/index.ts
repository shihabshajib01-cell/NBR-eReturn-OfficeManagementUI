// Central export point for the Redux store.
// Import from here rather than from individual store files.
export { store } from "./store";
export type { RootState, AppDispatch } from "./store";

export { login, logout } from "./authSlice";
export type { AuthState } from "./authSlice";

export {
  setTheme,
  setFont,
  setFontSize,
  setLanguage,
  setAssessmentYear,
  resetSettings,
} from "./settingsSlice";
export type { SettingsState } from "./settingsSlice";

export { setCurrentUser, updateCurrentUser } from "./currentUserSlice";
export type { CurrentUser } from "./currentUserSlice";

export {
  markNotificationRead,
  markAllNotificationsRead,
  setNotifications,
} from "./notificationsSlice";
export type {
  Notification,
  NotificationType,
  NotificationPriority,
} from "./notificationsSlice";

export {
  setSecNavState,
  toggleSecNavState,
  setMobileDrawerOpen,
  toggleMobileDrawer,
  setIsDesktop,
} from "./uiSlice";
export type { UIState } from "./uiSlice";
