import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
}

// ── Persistence ───────────────────────────────────────────────────────────────
const AUTH_KEY = "gov_ui_auth";

function loadAuth(): AuthState {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(AUTH_KEY) : null;
    if (!raw) return { isAuthenticated: false, userId: null };
    const parsed = JSON.parse(raw) as Partial<AuthState>;
    return {
      isAuthenticated: parsed.isAuthenticated ?? false,
      userId: parsed.userId ?? null,
    };
  } catch {
    return { isAuthenticated: false, userId: null };
  }
}

export function saveAuth(state: AuthState): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(state));
    }
  } catch {
    // Ignore storage errors
  }
}

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: loadAuth,
  reducers: {
    login(state, action: PayloadAction<{ userId?: string }>) {
      state.isAuthenticated = true;
      state.userId = action.payload.userId ?? null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userId = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
