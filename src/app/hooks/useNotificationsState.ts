import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "../store/notificationsSlice";
import type { Notification } from "../store/notificationsSlice";

export function useNotificationsState() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.notifications.items);
  const unreadCount = items.filter((n) => !n.isRead).length;

  return {
    notifications: items as Notification[],
    unreadCount,
    markRead: (id: string) => dispatch(markNotificationRead(id)),
    markAllRead: () => dispatch(markAllNotificationsRead()),
  };
}
