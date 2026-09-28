import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  secNavState: "expanded" | "compact";
  mobileDrawerOpen: boolean;
  isDesktop: boolean;
}

const initialState: UIState = {
  secNavState: "expanded",
  mobileDrawerOpen: false,
  isDesktop: typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSecNavState(state, action: PayloadAction<"expanded" | "compact">) {
      state.secNavState = action.payload;
    },
    toggleSecNavState(state) {
      state.secNavState = state.secNavState === "expanded" ? "compact" : "expanded";
    },
    setMobileDrawerOpen(state, action: PayloadAction<boolean>) {
      state.mobileDrawerOpen = action.payload;
    },
    toggleMobileDrawer(state) {
      state.mobileDrawerOpen = !state.mobileDrawerOpen;
    },
    setIsDesktop(state, action: PayloadAction<boolean>) {
      state.isDesktop = action.payload;
    },
  },
});

export const {
  setSecNavState,
  toggleSecNavState,
  setMobileDrawerOpen,
  toggleMobileDrawer,
  setIsDesktop,
} = uiSlice.actions;

export default uiSlice.reducer;
