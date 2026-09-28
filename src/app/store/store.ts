import { configureStore, type Middleware } from "@reduxjs/toolkit";
import settingsReducer, { saveSettings } from "./settingsSlice";
import authReducer, { saveAuth } from "./authSlice";
import currentUserReducer from "./currentUserSlice";
import notificationsReducer from "./notificationsSlice";
import uiReducer from "./uiSlice";

// ── localStorage persistence middleware ──────────────────────────────────────
const localStorageMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  const type =
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    typeof (action as { type: unknown }).type === "string"
      ? (action as { type: string }).type
      : "";

  if (type.startsWith("settings/")) {
    saveSettings(storeAPI.getState().settings);
  }
  if (type.startsWith("auth/")) {
    saveAuth(storeAPI.getState().auth);
  }
  return result;
};

// ── Store ─────────────────────────────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    currentUser: currentUserReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
