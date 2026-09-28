# Centralized State Management

**Technology:** Redux Toolkit (`@reduxjs/toolkit` + `react-redux`)  
**Store Location:** `src/app/store/`  
**Added in:** June 2026

---

## Overview

Theme, font, font-size, and language preferences are managed in a single Redux slice (`settingsSlice`). All values are:

- **Centralized** — one source of truth, no prop-threading for settings
- **Persisted** — saved to `localStorage` automatically after every change
- **Immediately reactive** — DOM updates happen synchronously via hooks

---

## Files

```
src/app/store/
├── settingsSlice.ts   # State shape, actions, reducers, localStorage helpers
├── store.ts           # configureStore + persistence middleware
└── index.ts           # Public exports

src/app/hooks/
├── useSettings.ts     # Typed read/write hooks (useSettings, useSettingsActions)
├── useAppearance.ts   # DOM sync for theme/font/fontSize — reads from Redux
└── useLanguage.ts     # i18n sync for language — reads from Redux
```

---

## State Shape

```typescript
interface SettingsState {
  themeId:    ThemeId;    // "indigo-blue" | "gov-blue" | "slate-purple" | "plum-executive" | "fresh-teal" | "dark-mode"
  fontId:     FontId;     // "poppins" | "noto-sans" | "google-sans"
  fontSizeId: FontSizeId; // "compact" | "standard" | "large"
  languageId: LanguageId; // "en" | "bn"
}
```

**Defaults:**
| Setting | Default |
|---------|---------|
| `themeId` | `"fresh-teal"` |
| `fontId` | `"poppins"` |
| `fontSizeId` | `"standard"` |
| `languageId` | `"en"` (reads `i18nextLng` from localStorage on first load) |

---

## Actions

All actions are in `settingsSlice.ts` and exported from `src/app/store/index.ts`:

| Action | Payload | Description |
|--------|---------|-------------|
| `setTheme(id)` | `ThemeId` | Change color theme |
| `setFont(id)` | `FontId` | Change font family |
| `setFontSize(id)` | `FontSizeId` | Change font size preset |
| `setLanguage(id)` | `LanguageId` | Change UI language |
| `resetSettings()` | — | Reset all to defaults |

---

## Using Settings in a Component

### Option A — `useSettings()` (read-only)

```tsx
import { useSettings } from "../hooks/useSettings";

function MyComponent() {
  const { themeId, languageId } = useSettings();
  // ...
}
```

### Option B — `useSettingsActions()` (read + write)

```tsx
import { useSettingsActions } from "../hooks/useSettings";

function AppearanceButton() {
  const { themeId, setTheme, setLanguage } = useSettingsActions();

  return (
    <button onClick={() => setTheme("dark-mode")}>
      Dark Mode
    </button>
  );
}
```

### Option C — Direct dispatch (advanced)

```tsx
import { useSettingsDispatch } from "../hooks/useSettings";
import { setTheme } from "../store/settingsSlice";

function SomeComponent() {
  const dispatch = useSettingsDispatch();
  dispatch(setTheme("gov-blue"));
}
```

---

## How Existing Hooks Integrate

### `useAppearance()`

Reads `themeId`, `fontId`, `fontSizeId` from Redux.  
After each change it syncs three DOM side-effects:

1. **Font family** → `document.body.style.fontFamily`
2. **Font size** → `data-font-scale` attribute on `<html>`
3. **Theme colors** → 20+ CSS custom properties on `<html>` (`--color-primary`, `--color-surface`, etc.)

Components that need the theme object call `useAppearance()` at the top of the tree (App.tsx) and receive the derived `t: ThemeConfig` as a prop. They do **not** need to import Redux directly.

### `useLanguage()`

Reads `languageId` from Redux.  
On change it calls `i18n.changeLanguage(id)`, keeping react-i18next in sync.  
i18next independently persists to `localStorage` under key `i18nextLng`.

---

## localStorage Persistence

Two storage entries are maintained:

| Key | Contents | Managed by |
|-----|----------|------------|
| `gov_ui_settings` | `{ themeId, fontId, fontSizeId, languageId }` | Redux middleware |
| `i18nextLng` | `"en"` \| `"bn"` | i18next-browser-languagedetector |

The Redux middleware (`store.ts`) runs after every `settings/*` action and calls `saveSettings()`. On application start, `loadSettings()` reads `gov_ui_settings` first, then falls back to `i18nextLng` for the language.

---

## Dark Mode Implementation

Dark mode is a **sixth color theme** (`"dark-mode"`) rather than a Tailwind `dark:` prefix. This supports 6 independent themes, not just light/dark.

**Navigation backgrounds** (Topbar, PrimarySidebar, SecondarySidebar) use:
```typescript
const navBg = isDarkMode ? "#171717" : t.surface;
```

**Backup:** `docs/DARK_MODE_BACKUP.md` contains the original palette and rollback instructions.

---

## Adding a New Setting

1. **Add the type** to `SettingsState` in `settingsSlice.ts`
2. **Add the default** to `DEFAULT_SETTINGS`
3. **Add a reducer** in the `reducers` object:
   ```typescript
   setMyNewSetting(state, action: PayloadAction<MyType>) {
     state.myNewSetting = action.payload;
   }
   ```
4. **Export the action** in `store/index.ts`
5. **Add a setter** to `useSettingsActions()` in `hooks/useSettings.ts`
6. **Add DOM sync** in the appropriate hook (`useAppearance.ts` for visual, `useLanguage.ts` for i18n)

No other files need to change. Components call `useSettings()` or `useSettingsActions()` to read/write.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  src/app/App.tsx                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  <Provider store={store}>                            │   │
│  │    <AppContent>                                      │   │
│  │      useAppearance()  ──reads──▶  Redux settings     │   │
│  │      useLanguage()    ──reads──▶  Redux settings     │   │
│  │      ...                                             │   │
│  │    </AppContent>                                     │   │
│  │  </Provider>                                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Redux Store                                                 │
│  ┌──────────────────────────┐                               │
│  │  settingsSlice            │                               │
│  │  { themeId, fontId,       │ ◀── setTheme() / setFont()   │
│  │    fontSizeId, languageId }│ ◀── setFontSize()            │
│  └───────────┬──────────────┘ ◀── setLanguage()             │
│              │                                               │
│              ▼ localStorage middleware                       │
│  localStorage["gov_ui_settings"] = { ... }                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Hooks                                                       │
│                                                              │
│  useAppearance()                                             │
│    reads themeId/fontId/fontSizeId from Redux                │
│    syncs: CSS custom props, body font, data-font-scale attr  │
│    returns: t (ThemeConfig), fontFamily, setters             │
│                                                              │
│  useLanguage()                                               │
│    reads languageId from Redux                               │
│    syncs: i18n.changeLanguage()                              │
│    returns: languageId, setLanguageId                        │
│                                                              │
│  useSettings()          ── read-only selector                │
│  useSettingsDispatch()  ── typed dispatch                    │
│  useSettingsActions()   ── combined read+write               │
└─────────────────────────────────────────────────────────────┘
```

---

## Migration Notes

### Before (local useState in `useAppearance.ts`)
```typescript
const [themeId, setThemeId] = useState<ThemeId>("fresh-teal");
// No localStorage persistence — lost on page reload
```

### After (Redux in `settingsSlice.ts`)
```typescript
const { themeId } = useSettings();          // reads Redux
dispatch(setTheme("dark-mode"));            // persists automatically
// Values survive page reload via localStorage["gov_ui_settings"]
```

### Component contracts unchanged
All 154+ component files continue to receive `t: ThemeConfig` as a prop. No mass refactor needed. The Redux integration is transparent at the hook layer.

---

## Testing

```bash
# Validate locale files still match
pnpm dlx tsx src/app/i18n/validateLocales.ts

# Manual verification
1. Open the app, select a non-default theme (e.g. "Dark Mode")
2. Reload the page → theme should persist
3. Switch to Bangla → reload → language should persist
4. Open DevTools → localStorage["gov_ui_settings"] → should reflect current values
5. Test all 6 themes, 3 fonts, 4 font sizes, 2 languages
```
