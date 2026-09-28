import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import "./i18n/config";
import { store } from "./store";
import { router } from "./routes";

// Re-export types for external components
export type { ThemeId, ThemeConfig } from "./data/themes";
export type { FontId, FontSizeId } from "./data/fonts";
export type { UserStatus, SystemUser, SystemRole, Notification, NotificationType, NotificationPriority } from "./data/mockData";
export type { PermissionItem, PermGroupDef } from "./data/permissions";

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster position="bottom-center" richColors />
    </Provider>
  );
}
