import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useLocation } from "react-router";

interface HelpContextValue {
  helpOpen: boolean;
  pageKey: string;
  openHelp: () => void;
  closeHelp: () => void;
}

const HelpContext = createContext<HelpContextValue>({
  helpOpen: false,
  pageKey: "dashboard-main",
  openHelp: () => {},
  closeHelp: () => {},
});

function derivePageKey(pathname: string): string {
  // Remove leading slash and split
  const parts = pathname.replace(/^\//, "").split("/").filter(Boolean);
  if (parts.length === 0) return "dashboard-main";
  const last = parts[parts.length - 1];
  // Normalize: dashboard-main is the default dashboard page
  if (last === "dashboard") return "dashboard-main";
  return last;
}

export function HelpProvider({ children }: { children: ReactNode }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const location = useLocation();
  const pageKey = derivePageKey(location.pathname);

  const openHelp = useCallback(() => setHelpOpen(true), []);
  const closeHelp = useCallback(() => setHelpOpen(false), []);

  return (
    <HelpContext.Provider value={{ helpOpen, pageKey, openHelp, closeHelp }}>
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp() {
  return useContext(HelpContext);
}
