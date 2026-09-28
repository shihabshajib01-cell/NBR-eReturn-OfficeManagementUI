import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { MOCK_NOTIFICATIONS } from "../data/mockData";
import type { Notification, NotificationType, NotificationPriority } from "../data/mockData";

// Re-export notification types for convenience
export type { Notification, NotificationType, NotificationPriority };

// ── State ─────────────────────────────────────────────────────────────────────
interface NotificationsState {
  items: Notification[];
}

const initialState: NotificationsState = {
  items: MOCK_NOTIFICATIONS as Notification[],
};

// ── Slice ─────────────────────────────────────────────────────────────────────
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markNotificationRead(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.isRead = true;
    },
    markAllNotificationsRead(state) {
      state.items.forEach((n) => { n.isRead = true; });
    },
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload;
    },
  },
});

export const {
  markNotificationRead,
  markAllNotificationsRead,
  setNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
