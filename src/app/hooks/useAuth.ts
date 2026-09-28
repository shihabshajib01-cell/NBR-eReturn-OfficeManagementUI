import { startTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { login, logout } from "../store/authSlice";

/**
 * useAuth — reads authentication state from the Redux store and provides
 * typed login/logout dispatchers.  No local state; all changes persist
 * to localStorage via the store middleware.
 */
export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const userId = useSelector((s: RootState) => s.auth.userId);

  return {
    isAuthenticated,
    userId,
    login: (uid?: string) => startTransition(() => dispatch(login({ userId: uid }))),
    logout: () => startTransition(() => dispatch(logout())),
  };
}
