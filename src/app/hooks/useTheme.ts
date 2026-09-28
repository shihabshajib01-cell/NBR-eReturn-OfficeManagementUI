import { THEMES } from "../data/themes";
import { useSettings } from "./useSettings";
import type { TC } from "../pages/modulePageUtils";

/**
 * Returns the current ThemeConfig (TC) from Redux without any DOM side-effects.
 * Use this in components that need theme colors but don't own the top-level
 * appearance sync (which lives in useAppearance).
 */
export function useTheme(): TC {
  const { themeId } = useSettings();
  return THEMES[themeId] as TC;
}
