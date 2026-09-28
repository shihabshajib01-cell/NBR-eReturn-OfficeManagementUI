import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { LoginPage } from "../pages/auth/LoginPage";

/**
 * AuthGate — reads isAuthenticated directly from Redux.
 * No prop drilling; the login action is dispatched inside LoginPage.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
