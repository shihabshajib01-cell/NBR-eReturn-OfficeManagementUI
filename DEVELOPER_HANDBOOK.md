# Government Office Management UI — Developer Handbook

> Version: 2.0 | Stack: React 18 · Redux Toolkit · i18next · Tailwind CSS v4 · TypeScript

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [File Structure](#2-file-structure)
3. [Redux State Architecture](#3-redux-state-architecture)
4. [Component Library](#4-component-library)
5. [Color System & Themes](#5-color-system--themes)
6. [Typography & Font Scaling](#6-typography--font-scaling)
7. [Grid System, Spacing & Padding](#7-grid-system-spacing--padding)
8. [Navigation Architecture](#8-navigation-architecture)
9. [Translation & Internationalisation](#9-translation--internationalisation)
10. [Authentication Flow](#10-authentication-flow)
11. [Responsive Design Rules](#11-responsive-design-rules)
12. [Hover / Active / Focus State Rules](#12-hover--active--focus-state-rules)
13. [Drawer & Modal Buttons](#13-drawer--modal-buttons)
14. [Golden Rules Checklist](#14-golden-rules-checklist)

---

## 1. Project Overview

This is a **Bengali Tax Administration UI** (National Board of Revenue, Bangladesh). The system provides:

- Multi-level authenticated navigation (primary icon strip → secondary panel → third-level)
- 40+ table-driven pages across 8 workflow modules
- Full English ↔ Bangla language switching
- 6 colour themes with real-time CSS variable injection
- 4 font families with 3 font-size tiers (compact / standard / large)
- Redux-managed global state — zero prop drilling for auth, theme, font, language

---

## 2. File Structure

```
src/
├── app/
│   ├── App.tsx                    # Root — Redux Provider + AppContent
│   ├── i18n/
│   │   ├── config.ts              # i18next initialisation (24 namespaces)
│   │   └── validateLocales.ts     # Key-parity checker (run with npx tsx)
│   ├── locales/
│   │   ├── en/                    # 22 English JSON files
│   │   └── bn/                    # 22 Bangla JSON files
│   ├── store/
│   │   ├── store.ts               # configureStore + localStorage middleware
│   │   ├── index.ts               # Central export point
│   │   ├── authSlice.ts           # isAuthenticated, userId → persisted
│   │   ├── settingsSlice.ts       # themeId, fontId, fontSizeId, languageId
│   │   ├── currentUserSlice.ts    # User profile (name, role, circle, zone)
│   │   ├── notificationsSlice.ts  # Notification items
│   │   └── uiSlice.ts             # Nav state, mobile drawer, isDesktop
│   ├── hooks/
│   │   ├── useAuth.ts             # isAuthenticated, login, logout (Redux)
│   │   ├── useAppearance.ts       # Theme/font DOM side-effects (single call site)
│   │   ├── useLanguage.ts         # Redux ↔ i18next language sync
│   │   ├── useNavigation.ts       # URL ↔ Redux nav sync + all nav handlers
│   │   ├── useSettings.ts         # Read/write settings slice
│   │   ├── useCurrentUser.ts      # Read/write currentUser slice
│   │   ├── useUI.ts               # Read UIState, useSecNavWidth
│   │   ├── useBreadcrumbs.ts      # Derives breadcrumb trail from nav state
│   │   ├── useNotifications.ts    # Notifications + navigate-on-click
│   │   ├── useNotificationsState.ts # Pure state getter
│   │   └── useTheme.ts            # Returns current ThemeConfig (no side-effects)
│   ├── data/
│   │   ├── themes.ts              # 6 theme configs + THEMES + THEME_ORDER
│   │   ├── fonts.ts               # 4 fonts, 3 font-size scales, all tokens
│   │   ├── languages.ts           # en / bn config
│   │   ├── navigation.ts          # 3-level nav tree + ASSESSMENT_YEARS
│   │   ├── mockData.ts            # Seed data for all 40+ pages
│   │   └── permissions.ts         # Permission group definitions
│   ├── layouts/
│   │   ├── AppShell.tsx           # Authenticated shell (no auth props)
│   │   ├── AuthGate.tsx           # Reads Redux auth; shows Login or children
│   │   ├── SidebarShell.tsx       # primary + secondary nav wrapper
│   │   ├── MainShell.tsx          # topbar + breadcrumbs + content
│   │   ├── MainContentArea.tsx    # Resolves active page from Redux nav state
│   │   └── MobileBackdrop.tsx     # Mobile overlay backdrop
│   ├── pages/                     # 40+ page components (organised by module)
│   │   ├── auth/LoginPage.tsx
│   │   ├── dashboard/
│   │   ├── report/
│   │   ├── return-register/
│   │   ├── register-stock/
│   │   ├── case-financial-management/
│   │   ├── psr-verification/
│   │   └── administration-requests/
│   └── components/
│       ├── appearance/            # Theme/font/language picker UI
│       ├── auth/                  # LoginForm, LoginBrandPanel, slides
│       ├── badges/                # StatusBadge
│       ├── buttons/               # PrimaryButton, SecondaryButton, IconButton
│       ├── cards/                 # KpiRow, StatCard
│       ├── dashboard/             # DashSection, DashTable
│       ├── drawers/               # RecordDetailsDrawer
│       ├── dropdowns/             # NotificationDropdown, UserProfileDropdown
│       ├── filters/               # FilterPanel, AppliedFilterChips
│       ├── forms/                 # EntryForm, SFormSection, SInput, SSelect
│       ├── modals/                # AppModal, SConfirmModal, SignOutModal
│       ├── navigation/            # PrimarySidebar, SecondarySidebar, Topbar, Breadcrumbs
│       ├── pages/                 # GeneratedTablePage, WorkflowTablePage, TabbedPage
│       ├── reports/               # ReportPage, ReportComponents
│       ├── shared/                # Pagination, ReportCard, RowMoreMenu
│       ├── tables/                # CardTable
│       └── ui/                    # shadcn/ui primitives (60+ files)
└── styles/
    ├── index.css                  # Import hub
    ├── globals.css                # Resets + utility classes
    ├── typography.css             # Font scale tokens (compact/standard/large) + overrides
    ├── layout.css                 # App shell grid, mobile sidebar behaviour
    ├── navigation.css             # Primary sidebar, secondary sidebar, topbar, breadcrumbs
    ├── buttons.css                # Primary/secondary/icon button variants
    ├── forms.css                  # Inputs, selects, labels, validation
    ├── tables.css                 # Table structure, hover, sticky headers
    ├── modals.css                 # Modal overlay + dialog
    ├── drawers.css                # Record drawer, user drawer, action buttons
    ├── cards.css                  # Card variants + KPI cards
    ├── badges.css                 # Status badge colours
    ├── dropdowns.css              # Dropdown menus
    ├── appearance.css             # Appearance settings panel
    ├── roles.css                  # Role/permission UI
    ├── users.css                  # User list + profile dropdown
    ├── animations.css             # Keyframes
    └── fonts.css                  # @font-face imports
```

---

## 3. Redux State Architecture

### Store slices

| Slice | Key | Type | Persisted |
|---|---|---|---|
| `auth` | `isAuthenticated` | `boolean` | ✅ localStorage `gov_ui_auth` |
| `auth` | `userId` | `string \| null` | ✅ |
| `settings` | `themeId` | `ThemeId` | ✅ localStorage `gov_ui_settings` |
| `settings` | `fontId` | `FontId` | ✅ |
| `settings` | `fontSizeId` | `FontSizeId` | ✅ |
| `settings` | `languageId` | `LanguageId` | ✅ |
| `settings` | `assessmentYear` | `string` | ✅ |
| `currentUser` | full profile | `CurrentUser` | ❌ (reset on reload) |
| `notifications` | `items` | `Notification[]` | ❌ |
| `ui` | `activeMain / activeSub / activeThird` | `string` | ❌ (derived from URL) |
| `ui` | `expandedSubs` | `string[]` | ❌ |
| `ui` | `secNavState` | `"expanded" \| "compact"` | ❌ |
| `ui` | `mobileDrawerOpen` | `boolean` | ❌ |
| `ui` | `isDesktop` | `boolean` | ❌ |

### Key hooks

```tsx
// Auth
const { isAuthenticated, login, logout } = useAuth();

// Appearance (call once in AppContent — sets DOM side-effects)
const { themeId, fontId, fontSizeId, setThemeId, setFontId, setFontSizeId, fontFamily } = useAppearance();

// Language (Redux ↔ i18next sync)
const { languageId, setLanguageId } = useLanguage();

// Settings read/write
const { themeId, fontId, setTheme, setFont } = useSettingsActions();

// Current user
const user = useCurrentUser(); // { name, designation, circle, zone, ... }

// Navigation
const { activeMain, activeSub, handleMainNavClick, handleSubNavClick } = useNavigation();

// UI state
const { mobileDrawerOpen, isDesktop, secNavState } = useUIState();
const { secNavWidth, secNavCompact } = useSecNavWidth();
```

### No prop drilling rule

**Never pass these values as props.** Always read from the hook:
- `themeId`, `fontId`, `fontSizeId`, `languageId`
- `isAuthenticated`, user details
- `activeMain`, `activeSub`, `activeThird`, `mobileDrawerOpen`

---

## 4. Component Library

### Navigation

| Component | Location | Reads from |
|---|---|---|
| `PrimarySidebar` | `components/navigation/` | Redux `ui.activeMain` |
| `SecondarySidebar` | `components/navigation/` | Redux `ui.activeSub/activeThird/expandedSubs` |
| `Topbar` | `components/navigation/` | Redux `settings`, `currentUser`, `notifications` |
| `Breadcrumbs` | `components/navigation/` | Redux `ui` + navigation data |
| `SidebarShell` | `layouts/` | Orchestrates primary + secondary |
| `MainShell` | `layouts/` | Orchestrates topbar + breadcrumbs + content |

### Page Templates

```tsx
// Standard table-driven page
<GeneratedTablePage cfg={pageCfg} drawerFields={fields} />

// Workflow page (with approval states)
<WorkflowTablePage cfg={pageCfg} />

// Tabbed page
<TabbedPage tabs={tabs} />
```

`PageCfg` interface (`modulePageUtils.ts`):
```typescript
interface PageCfg {
  title: string;        // Fallback title
  titleKey?: string;    // i18n key from "pages" namespace
  desc: string;
  descKey?: string;
  cols: ColDef[];       // Table column definitions
  rows: Row[];          // Mock data rows
  filters: FilterDef[]; // Filter panel config
  actions: RowAction[]; // Row action buttons
  drawerActions?: RowAction[]; // Detail drawer buttons
  kpis?: KpiDef[];      // KPI row cards
  entryBtn?: string;    // Label for "New Entry" button (shows entry modal)
  extraBtns?: { label: string; icon: LucideIcon }[];
}
```

### Form Components

```tsx
<SInput label="TIN" type="text" required />
<SSelect label="Circle" options={CIRCLES} />
<SToggle label="Active" />
<SFormSection title="Taxpayer Details">
  <SInput label="Name" />
</SFormSection>
```

### Shared Components

```tsx
<StatusBadge value="pending" />        // colour-coded by status string
<Pagination page={1} total={100} perPage={10} onPage={setPage} />
<AppliedFilterChips values={applied} onClear={clearAll} />
<RecordDetailsDrawer row={row} onClose={close} title="..." fields={fields} actions={drawerActions} />
```

---

## 5. Color System & Themes

### Available Themes

| ID | Name | Primary |
|---|---|---|
| `indigo-blue` | Indigo Blue | `#4B5694` (default) |
| `gov-blue` | Government Blue | `#2C5EAD` |
| `slate-purple` | Slate Purple | `#4A4466` |
| `plum-executive` | Plum Executive | `#744577` |
| `fresh-teal` | Fresh Teal | `#36ADA3` |
| `dark-mode` | Dark Mode | `#8AB4F8` |

### CSS Custom Properties (injected by `useAppearance`)

All components use only CSS variables — **never hardcode hex colours**.

```css
/* Core palette */
--color-primary            /* main brand colour */
--color-primary-dark       /* hover/pressed state */
--color-primary-light      /* tint surface */
--color-secondary
--color-accent

/* Surfaces */
--color-background         /* page background */
--color-surface            /* card/panel surface */
--color-background-subtle  /* secondary background */
--color-surface-secondary  /* secondary card surface */
--color-surface-hover      /* table row hover */

/* Text */
--color-text-primary
--color-text-secondary
--color-text-muted
--color-text-on-primary    /* white on primary (dark: near-black) */

/* Borders */
--color-border
--color-border-subtle

/* Status */
--color-success  --color-success-bg
--color-warning  --color-warning-bg  --color-warning-alpha-*
--color-error    --color-error-bg    --color-error-alpha-*

/* Alpha variants (for backgrounds, overlays) */
--color-primary-alpha-3   /* 3% opacity */
--color-primary-alpha-6
--color-primary-alpha-8
--color-primary-alpha-10
--color-primary-alpha-12
--color-primary-shadow     /* box-shadow colour */

/* Scrollbars */
--scrollbar-track
--scrollbar-thumb
--scrollbar-thumb-hover

/* Tooltips (always dark) */
--color-tooltip-bg   /* #1e293b */
--color-tooltip-text /* #f8fafc */
```

### Switching theme

```tsx
const { setThemeId } = useAppearance();
setThemeId("fresh-teal");
// → Redux dispatch → middleware saves to localStorage → useAppearance effect runs → all CSS vars updated
```

---

## 6. Typography & Font Scaling

### Font Families

| ID | Stack |
|---|---|
| `inter` (default) | Inter, 'Noto Sans Bengali', 'Noto Sans', sans-serif |
| `poppins` | Poppins, 'Noto Sans Bengali', 'Noto Sans', sans-serif |
| `noto-sans` | 'Noto Sans', 'Noto Sans Bengali', sans-serif |
| `google-sans` | 'DM Sans', 'Google Sans', 'Noto Sans Bengali', 'Noto Sans', sans-serif |

Font family is applied to `document.body` by `useAppearance`. All Bangla text renders via the Noto Sans Bengali fallback.

### Font Size Tiers

Activated by `document.documentElement.setAttribute("data-font-scale", id)`.
`"standard"` removes the attribute (uses `:root` defaults).

| Token | Compact | Standard | Large |
|---|---|---|---|
| `--fs-h1` | 32px | 40px | 48px |
| `--fs-h2` | 24px | 28px | 32px |
| `--fs-h3` | 18px | 22px | 26px |
| `--fs-body-lg` | 16px | 18px | 20px |
| `--fs-body-md` | 14px | 16px | 18px |
| `--fs-body-sm` | 13px | 14px | 16px |
| `--fs-label-md` | 13px | 14px | 16px |
| `--fs-button` | 14px | 16px | 18px |
| `--fs-input` | 14px | 16px | 18px |
| `--fs-table-header` | 12px | 14px | 16px |
| `--fs-table-body` | 13px | 14px | 16px |
| `--fs-nav-primary` | 10px | 11px | 12px |
| `--fs-nav-sub` | 13px | 14px | 16px |

### Applying font scale

```css
/* Semantic elements override automatically via typography.css: */
:root[data-font-scale] h1 { font-size: var(--fs-h1) !important; }
:root[data-font-scale] button { font-size: var(--fs-button) !important; }
:root[data-font-scale] td { font-size: var(--fs-table-body) !important; }

/* Named classes also respond: */
:root[data-font-scale] .typ-body-md { font-size: var(--fs-body-md) !important; }
:root[data-font-scale] .primary-nav-item__label { font-size: var(--fs-nav-primary) !important; }
```

Use `.typ-*` classes on custom elements rather than hardcoded Tailwind `text-[Npx]` classes.

### Spacing scale (responds to font size)

| Token | Compact | Standard | Large |
|---|---|---|---|
| `--space-xs` | 3px | 4px | 5px |
| `--space-sm` | 6px | 8px | 10px |
| `--space-md` | 10px | 12px | 15px |
| `--space-lg` | 14px | 16px | 20px |
| `--table-row-height` | 42px | 48px | 54px |
| `--card-padding` | 16px | 20px | 24px |
| `--button-padding-x` | 14px | 16px | 18px |

---

## 7. Grid System, Spacing & Padding

### 8-pixel base grid

All spacing increments must be multiples of 8px (or 4px for tight contexts).

```
4px  → micro gaps (icon to label)
8px  → compact padding, tight spacing
12px → standard inner padding  
16px → standard gap between elements
20px → card internal padding
24px → section separation
32px → major section break
48px → page-level spacing
```

### Sidebar widths

| Component | Width |
|---|---|
| Primary sidebar (icon strip) | 80px |
| Secondary sidebar (expanded) | 240px |
| Secondary sidebar (compact) | 52px |
| Secondary sidebar (hidden/mobile) | 0px |

### Content area spacing

```css
/* Table card: the standard content container */
.table-card { }            /* border-radius: 12px; box-shadow: ... */
.table-card__toolbar { }   /* padding: 12px 16px; gap: 8px */
.table-page__header { }    /* padding: 20px 20px 0; */
```

### Responsive breakpoints

| Breakpoint | Behaviour |
|---|---|
| `≥ 1024px` (desktop) | Sidebar permanent, full two-column layout |
| `< 1024px` (mobile/tablet) | Sidebar becomes slide-in drawer, backdrop overlay |
| `≤ 768px` (tablet) | Typography scale reduced |
| `≤ 480px` (mobile) | Typography scale further reduced, all font scales adjusted |

---

## 8. Navigation Architecture

### Three layers

```
Layer 1: PrimarySidebar (80px icon strip)
  └── Layer 2: SecondarySidebar (240px or 52px compact)
        └── Layer 3: Third-level items (indented under sub)
```

### URL ↔ Redux sync

Navigation state is derived from URL parameters and pushed back on change:

```
?nav=dashboard&sub=dashboard-main&third=null
```

`useNavigation` hook registers a `popstate` listener so browser back/forward works correctly.

### Navigation data structure

```typescript
// src/app/data/navigation.ts
const NAVIGATION: MainNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    labelKey: "dashboard.main",  // i18n key in "navigation" namespace
    icon: LayoutDashboard,
    children: [
      {
        id: "dashboard-main",
        label: "Dashboard",
        labelKey: "dashboard.dashboard",
        children: []  // no third level
      },
      {
        id: "psr-dashboard",
        label: "PSR Dashboard",
        labelKey: "dashboard.psrDashboard",
        children: [
          { id: "psr-overview", label: "Overview", labelKey: "dashboard.psrOverview" }
          // third level items
        ]
      }
    ]
  }
];
```

### Adding a new page

1. Add entry to `NAVIGATION` in `navigation.ts`
2. Add translation keys to `en/navigation.json` and `bn/navigation.json`
3. Create page component in `src/app/pages/{module}/MyPage.tsx`
4. Register in `MainContentArea.tsx` routing switch

---

## 9. Translation & Internationalisation

### Namespaces (22 total)

| Namespace | Purpose |
|---|---|
| `common` | App name, shared actions, status labels, accessibility strings |
| `actions` | Button labels (approve, reject, export, print, etc.) |
| `navigation` | All nav labels (main, sub, third level) |
| `auth` | Login page, slides, form labels |
| `appearance` | Appearance panel (theme, font, language labels) |
| `filters` | Filter panel labels and placeholders |
| `tables` | Column headers, field labels, pagination |
| `drawers` | Record drawer field labels |
| `forms` | Form field labels |
| `modals` | Modal titles and messages |
| `breadcrumbs` | Breadcrumb separator and home labels |
| `dashboard` | Dashboard-specific labels and KPIs |
| `report` | Report page labels |
| `pages` | Page titles and descriptions |
| `status` | Status badge display strings |
| `kpi` | KPI card labels |
| `notifications` | Notification messages |
| `emptyStates` | Empty state messages |
| `errors` | Error messages |
| `permissions` | Permission group names |
| `role` | Role management labels |
| `user` | User management labels |

### Usage in components

```tsx
const { t: translate } = useTranslation("actions");
const { t: tc } = useTranslation("common");

// Simple key
translate("approve")              // "Approve" / "অনুমোদন করুন"

// Nested key
tc("common.records")              // "records" / "রেকর্ড"

// With interpolation
tc("accessibility.page", { number: 3 }) // "Page 3"
```

### Language switching

```tsx
const { languageId, setLanguageId } = useLanguage();
setLanguageId("bn");  // Updates Redux + i18next + localStorage simultaneously
```

### Adding a translation key

1. Add to `src/app/locales/en/{namespace}.json`
2. Add matching key to `src/app/locales/bn/{namespace}.json`
3. Verify parity: `npx tsx src/app/i18n/validateLocales.ts`

### Professional Bangla conventions

- Use formal register (আপনি, করুন, করতে)
- Do not translate: PSR, TIN, NBR, AY (keep as acronyms)
- Numbers: Use Bengali numerals in Bangla mode where appropriate
- Avoid word-for-word loan translations — use domain-standard terms (e.g. "রিটার্ন" for "return" in tax context)

---

## 10. Authentication Flow

### Current implementation (mock/demo)

```
User clicks "Sign In" in LoginForm
  → dispatch(login({ userId }))          // authSlice
  → middleware saves to localStorage     // gov_ui_auth
  → AuthGate re-renders (isAuthenticated = true)
  → AppShell renders
```

### Replacing with real API

```typescript
// In LoginForm.tsx, replace the setTimeout mock:
const handleSignIn = async () => {
  setIsLoading(true);
  try {
    const response = await api.post("/auth/login", { userId, password });
    dispatch(login({ userId: response.data.userId }));
    // optionally dispatch(setCurrentUser(response.data.user))
  } catch (err) {
    setError("Invalid credentials");
  } finally {
    setIsLoading(false);
  }
};
```

### Session expiry

Add a `sessionExpiry: number | null` field to `AuthState` and check it on app load:

```typescript
// In authSlice loadAuth():
if (parsed.sessionExpiry && Date.now() > parsed.sessionExpiry) {
  return { isAuthenticated: false, userId: null };
}
```

---

## 11. Responsive Design Rules

### Mobile behaviour (`< 1024px`)

- Sidebar slides in from the left (CSS transform)
- MobileBackdrop (semi-transparent overlay) appears behind sidebar
- Menu toggle button in Topbar opens/closes sidebar
- Redux `ui.mobileDrawerOpen` controls visibility

### Mobile nav checklist

- ✅ Sidebar closes on any navigation click
- ✅ Sidebar closes when backdrop is tapped
- ✅ No layout shift on open/close (sidebar is `position: fixed`)
- ✅ `isDesktop` synced to Redux in App.tsx via `window.resize` listener

### Content responsiveness

All page content uses `overflow-x: auto` on table wrappers. KPI cards use `auto-fill` grid so they wrap naturally. Forms use a 2-column grid that collapses to 1 column below 640px.

---

## 12. Hover / Active / Focus State Rules

### Golden rule: Hover = Active (both layers)

For all navigation items:
- **Hover** → solid primary fill, white icon/label (identical to active)
- **Active** → solid primary fill, white icon/label
- This ensures discoverability: users see the same feedback when hovering as when the item is selected

### Primary sidebar (layer 1)

| State | Icon container | Icon | Label |
|---|---|---|---|
| Inactive | transparent | `--color-text-secondary` | `--color-text-secondary`, weight 400 |
| Hover | `--color-primary` + shadow | `--color-text-on-primary` | `--color-primary`, weight 600 |
| Active | `--color-primary` + shadow | `--color-text-on-primary` | `--color-primary`, weight 600 |
| Focus-visible | + 2px outline in `--color-primary` | — | — |

### Secondary sidebar (layer 2)

| State | Background | Text |
|---|---|---|
| Inactive | transparent | `--color-text-secondary` |
| Hover | `--color-primary` | `--color-text-on-primary` |
| Active | `--color-primary` | `--color-text-on-primary`, weight 600 |
| Parent-of-active | `--color-primary-alpha-6` | `--color-primary`, weight 500 |

### Buttons

| Variant | Default | Hover | Focus |
|---|---|---|---|
| Primary | `--color-primary` bg | `--color-primary-dark` | 3px `--color-primary` outline |
| Secondary | `--color-primary-alpha-6` bg | `--color-primary-alpha-10` | 3px outline |
| Danger | `--color-error-alpha-10` bg | `--color-error-alpha-15` | 3px `--color-error` outline |

---

## 13. Drawer & Modal Buttons

### RecordDetailsDrawer footer buttons

Buttons are driven by `RowAction[]` from `PageCfg.drawerActions`. Variants are auto-assigned:

| Action ID | Variant | Visual |
|---|---|---|
| `approve`, `verify` | `--primary` | Solid primary background |
| `reject`, `delete` | `--danger` | Error-tinted background |
| Everything else | `--secondary` | Primary-alpha tinted |

```tsx
// In modulePageUtils.ts, define drawerActions:
drawerActions: [
  { id: "approve", label: "Approve", labelKey: "approve", icon: CheckCircle },
  { id: "reject",  label: "Reject",  labelKey: "reject",  icon: XCircle },
  { id: "download", label: "Download", labelKey: "download", icon: Download },
  { id: "print",   label: "Print",   labelKey: "print",   icon: Printer },
]
```

Labels are translated via `useTranslation("actions")` — the key maps to `actions.json`.

### CSS classes

```css
.record-drawer__action-btn            /* base: flex, 12px, weight 600, 8px radius */
.record-drawer__action-btn--primary   /* solid primary */
.record-drawer__action-btn--secondary /* primary-alpha-6 bg */
.record-drawer__action-btn--danger    /* error-tinted */
```

---

## 14. Golden Rules Checklist

### Before committing code

- [ ] **No prop drilling** for themeId, fontId, fontSizeId, languageId, isAuthenticated, or any UI nav state
- [ ] **All text** uses `useTranslation` — no hardcoded English strings visible to users
- [ ] **All colours** use `var(--color-*)` tokens — no hardcoded hex values
- [ ] **Spacing** uses 8px increments; use `--space-*` tokens or Tailwind multiples of 4
- [ ] **Font sizes** use `var(--fs-*)` tokens (not `text-[Npx]` Tailwind classes) for all semantic text
- [ ] **Hover/Active states** are visually identical across all nav items
- [ ] **Mobile nav** closes on navigation, closes on backdrop tap
- [ ] **Focus rings** visible on all interactive elements (`focus-visible` only, not `focus`)
- [ ] Both EN and BN translation keys added for any new string
- [ ] `npx tsx src/app/i18n/validateLocales.ts` passes with no mismatches
- [ ] `data-font-scale` attribute does NOT need to be set for standard scale (remove it)
- [ ] No `console.log` or debug statements in committed code

### Component authoring rules

```
1. Read global state via hooks — not via props passed from parent
2. Use semantic HTML: <nav>, <main>, <aside>, <h1>–<h3>, <button>, <label>
3. Do not create new CSS classes for one-off overrides — extend existing .css files
4. All buttons need aria-label if icon-only
5. Modals and drawers need role="dialog" aria-modal="true" aria-labelledby
6. Table headers need scope="col" 
7. All images need meaningful alt text
8. Avoid z-index values above 9999 (tooltip layer)
```

---

*Generated by the Government Office Management UI system audit — June 2026*
