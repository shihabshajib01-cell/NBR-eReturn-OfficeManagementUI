import { useCallback, startTransition } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import type { AppDispatch } from "../store/store";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "../store/notificationsSlice";
import { useNotificationsState } from "./useNotificationsState";
import type { Notification } from "../store/notificationsSlice";

// Re-export for backwards compat
export type { Notification };

export function useNotifications(
  _onNavigate?: (destination: { main: string; sub?: string; third?: string }) => void
) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useNotificationsState();

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      dispatch(markNotificationRead(notification.id));
      const { main, sub, third } = notification.destination;
      const path = third ? `/${main}/${sub}/${third}` : sub ? `/${main}/${sub}` : `/${main}`;
      startTransition(() => navigate(path));
    },
    [dispatch, navigate]
  );

  const handleMarkAllRead = useCallback(() => {
    dispatch(markAllNotificationsRead());
  }, [dispatch]);

  return {
    notifications,
    unreadCount,
    handleNotificationClick,
    handleMarkAllRead,
  };
}
