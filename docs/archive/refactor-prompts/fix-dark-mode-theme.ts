Fix dark mode theme consistency across the full system.

Do not redesign the UI.
Do not change layouts.
Do not change navigation names.
Do not change routes.
Do not change table headers.
Do not refactor components.
Do not move files.
Do not change the light themes.
Do not create a new theme.
Do not remove existing theme options.

Problem:
Dark mode is only partially applied. Some components use the selected theme object directly, but many CSS files use CSS variables such as --color-background, --color-surface, --color-text-primary, and --color-border. These variables are not being fully updated when the dark-mode theme is selected.

Current issue seen in UI:
- Main page background stays too light in dark mode.
- Cards and tables become dark, but the page canvas remains light.
- Page title/subtitle has poor contrast.
- Sidebar/topbar and content feel visually disconnected.
- Dark mode looks louder than Gmail dark mode.
- The system should look like Gmail dark mode: calm, readable, low-glare, and consistent.

Main goal:
Make dark mode apply consistently across the entire app using CSS variables, without changing the approved light themes.

Files to inspect and fix:
- src/app/hooks/useAppearance.ts
- src/app/data/themes.ts
- src/styles/theme.css
- src/styles/tokens.css
- src/styles/layout.css
- src/styles/navigation.css
- src/styles/cards.css
- src/styles/tables.css
- src/styles/dropdowns.css
- src/styles/forms.css
- src/styles/buttons.css
- src/styles/badges.css
- src/styles/modals.css
- src/styles/drawers.css

Root fix:
Update useAppearance.ts so every selected theme writes the complete design-token set into document.documentElement.

When themeId changes, sync these CSS variables:

--color-primary
--color-primary-dark
--color-primary-light
--color-secondary
--color-accent
--color-background
--color-surface
--color-surface-secondary
--color-surface-hover
--color-border
--color-border-subtle
--color-text-primary
--color-text-secondary
--color-text-muted
--color-text-on-primary
--color-success
--color-warning
--color-error
--color-success-bg
--color-warning-bg
--color-error-bg
--color-primary-alpha-3
--color-primary-alpha-6
--color-primary-alpha-10
--color-primary-shadow
--color-background-subtle
--color-background-zebra
--scrollbar-track
--scrollbar-thumb
--scrollbar-thumb-hover

For each theme, these variables must be derived from the active theme object, not hardcoded separately in components.

Also set an attribute on the document root:

document.documentElement.setAttribute("data-theme", themeId);

When themeId is dark-mode, also add:

document.documentElement.classList.add("theme-dark");

When themeId is not dark-mode, remove:

document.documentElement.classList.remove("theme-dark");

Do not rely on the existing .dark class unless it is already used by shadcn/ui. If needed, add it only for compatibility, but the main system must use data-theme/theme-dark CSS variables.

Dark mode palette adjustment:
Update only the dark-mode theme values in src/app/data/themes.ts to make them calmer and closer to Gmail dark mode.

Use this Gmail-inspired dark palette:

dark-mode:
- primary: #8AB4F8
- primaryDark: #669DF6
- primaryLight: rgba(138,180,248,0.12)
- secondary: #AECBFA
- accent: #FDD663
- background: #202124
- surface: #2B2C2F
- border: #3C4043
- textPrimary: #E8EAED
- textSecondary: #BDC1C6
- success: #81C995
- warning: #FDD663
- error: #F28B82

Important dark mode derived variables:
- --color-background: #202124
- --color-background-subtle: #242528
- --color-background-zebra: #26272A
- --color-surface: #2B2C2F
- --color-surface-secondary: #303134
- --color-surface-hover: #35363A
- --color-border: #3C4043
- --color-border-subtle: rgba(232,234,237,0.08)
- --color-text-primary: #E8EAED
- --color-text-secondary: #BDC1C6
- --color-text-muted: #9AA0A6
- --color-text-on-primary: #202124
- --color-primary-shadow: rgba(138,180,248,0.24)
- --color-primary-alpha-3: rgba(138,180,248,0.03)
- --color-primary-alpha-6: rgba(138,180,248,0.06)
- --color-primary-alpha-10: rgba(138,180,248,0.10)
- --color-success-bg: rgba(129,201,149,0.14)
- --color-warning-bg: rgba(253,214,99,0.14)
- --color-error-bg: rgba(242,139,130,0.14)

Light theme behavior:
For non-dark themes, derive variables from the active theme:
- --color-background = t.background
- --color-background-subtle = rgba(t.primary, 0.035)
- --color-background-zebra = rgba(t.textPrimary, 0.015)
- --color-surface = t.surface
- --color-surface-secondary = rgba(t.primary, 0.045)
- --color-surface-hover = rgba(t.primary, 0.06)
- --color-border = t.border
- --color-border-subtle = rgba(t.border, 0.55)
- --color-text-primary = t.textPrimary
- --color-text-secondary = t.textSecondary
- --color-text-muted = rgba(t.textSecondary, 0.75)
- --color-text-on-primary = #FFFFFF
- --color-primary-shadow = rgba(t.primary, 0.24)
- --color-primary-alpha-3 = rgba(t.primary, 0.03)
- --color-primary-alpha-6 = rgba(t.primary, 0.06)
- --color-primary-alpha-10 = rgba(t.primary, 0.10)
- --color-success-bg = rgba(t.success, 0.12)
- --color-warning-bg = rgba(t.warning, 0.12)
- --color-error-bg = rgba(t.error, 0.12)

CSS cleanup rules:
1. Do not use white backgrounds in dark mode.
2. Replace hardcoded #fff, #ffffff, white, and light backgrounds in CSS with variables where they affect shared UI.
3. Keep the logo container white only if needed for government seal visibility.
4. Do not make the whole system pure black.
5. Use Gmail-like dark grey surfaces.
6. Keep borders subtle but visible.
7. Keep text readable.
8. Keep primary blue restrained, not neon.
9. Do not change the light mode look.

Specific CSS fixes:
In layout.css:
- .app-shell must use var(--color-background)
- .app-page-content must inherit the background or use var(--color-background)
- .app-main-shell must use var(--color-background)

In navigation.css:
- sidebar, topbar, secondary nav, breadcrumb bar must use theme variables
- avoid hardcoded #171717 except if replaced with var(--color-surface)
- active states must use var(--color-primary)
- inactive labels must use var(--color-text-secondary)

In cards.css:
- .card and .stat-card must use var(--color-surface)
- borders must use var(--color-border)
- labels must use var(--color-text-secondary)
- values must use var(--color-text-primary)

In tables.css:
- table container must use var(--color-surface)
- table header must use var(--color-background-subtle)
- zebra rows must use var(--color-background-zebra)
- table borders must use var(--color-border-subtle)
- table text must use var(--color-text-primary)

In dropdowns/modals/drawers:
- background must use var(--color-surface)
- text must use var(--color-text-primary)
- secondary text must use var(--color-text-secondary)
- borders must use var(--color-border)

Status badge rules:
- success badge uses --color-success and --color-success-bg
- warning badge uses --color-warning and --color-warning-bg
- error badge uses --color-error and --color-error-bg
- badge backgrounds must not become too bright in dark mode

Important:
Do not manually override each dashboard component with special dark mode styles. Fix the token system so the full app follows the selected theme consistently.

Validation checklist:
After the fix, confirm:

- Dark mode page background is dark grey, not light.
- Dashboard heading and subtitle are readable.
- Cards, tables, sidebars, topbar, dropdowns, modals, and drawers all follow the same dark theme.
- Dashboard cards no longer look disconnected from the page canvas.
- Tables are readable.
- Table rows have subtle separation.
- Active navigation remains clear.
- Primary blue is readable but not too loud.
- Light themes still look unchanged.
- Fresh Teal still works.
- Indigo Blue still works.
- Government Blue still works.
- Slate Purple still works.
- Plum Executive still works.
- Font selector still works.
- Font size selector still works.
- Notification dropdown still works.
- Account dropdown still works.
- Appearance dropdown still works.
- Login page still works.
- Logo still renders correctly.
- App builds successfully.

Do not:
- Do not redesign dashboard cards.
- Do not change the dashboard layout.
- Do not change table columns.
- Do not move components.
- Do not refactor pages.
- Do not remove existing themes.
- Do not add random dark colors directly into components.
- Do not use inline styles for dark mode fixes.

Final report:
After completion, report:
1. Files changed
2. CSS variables added or updated
3. Dark mode theme values updated
4. Hardcoded colors replaced
5. Components affected
6. Build status
7. Dark mode validation result
8. Any remaining dark mode issues