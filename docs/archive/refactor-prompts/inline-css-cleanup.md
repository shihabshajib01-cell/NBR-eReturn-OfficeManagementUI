Continue the safe refactor. Do this phase only:

Inline CSS cleanup.

Do not redesign the UI.
Do not change the visual design.
Do not change page layout.
Do not change navigation labels.
Do not change routes.
Do not change table headers.
Do not change data values.
Do not move components or pages in this phase.
Do not rename components.
Do not remove features.
Do not create placeholder pages.

Main goal:
Remove inline CSS and style objects from React/TypeScript files and move them into proper CSS files, while keeping the UI visually unchanged.

Current problem:
Many files still contain inline styles such as:

- style={{ ... }}
- style={...}
- const styles = { ... }
- const cardStyle = { ... }
- hardcoded visual values inside JSX
- repeated inline colors, padding, margin, border, radius, shadow, font size, display, flex, grid, transform, and transition styles

Scope:
Search the full project for inline styles inside:

src/app/
src/components/
src/pages/
src/styles/

Pay special attention to:
- src/app/pages/RoleManagementPage.tsx
- src/app/pages/UserManagementPage.tsx
- src/app/components/ReportComponents.tsx
- src/app/components/PermissionComponents.tsx
- src/app/components/UserComponents.tsx
- src/app/components/auth/LoginForm.tsx
- src/app/pages/dashboard/DashboardPage.tsx
- src/app/pages/dashboard/PSRDashboardPage.tsx
- src/app/pages/dashboard/CombinedDashboardPage.tsx
- any remaining ModulePages.tsx, if it still exists

CSS destination:
Move inline styles into the most relevant CSS file:

src/styles/
  layout.css
  navigation.css
  cards.css
  tables.css
  forms.css
  buttons.css
  badges.css
  modals.css
  drawers.css
  dropdowns.css
  animations.css
  typography.css
  theme.css
  tokens.css
  globals.css

If a style belongs to:
- card or KPI component → cards.css
- table or toolbar → tables.css
- form/input/select/search → forms.css
- button/icon button/action → buttons.css
- modal/confirmation → modals.css
- drawer/details panel → drawers.css
- dropdown/account/notification/appearance → dropdowns.css
- navigation/sidebar/topbar/breadcrumb → navigation.css
- page shell/layout/grid → layout.css
- status/count/trend badge → badges.css
- hover/motion/transition → animations.css

Import rule:
Make sure every created/updated CSS file is imported in:

src/styles/index.css

Use this order if the files exist:

@import './fonts.css';
@import './tailwind.css';
@import './theme.css';
@import './tokens.css';
@import './typography.css';
@import './globals.css';
@import './layout.css';
@import './navigation.css';
@import './tables.css';
@import './cards.css';
@import './forms.css';
@import './buttons.css';
@import './badges.css';
@import './modals.css';
@import './drawers.css';
@import './dropdowns.css';
@import './animations.css';

Rules:
1. Replace inline style props with semantic class names.
2. Use CSS variables/design tokens wherever possible.
3. Preserve the exact current UI.
4. Do not introduce new colors, spacing, shadows, radius, or font sizes unless they already exist in approved tokens.
5. Keep all 6 themes working.
6. Keep Gmail-inspired dark mode working.
7. Keep font selector working.
8. Keep font-size selector working.
9. Keep smooth animation behavior working.
10. Keep responsive behavior unchanged.
11. Keep table horizontal scrolling unchanged.
12. Keep modal/drawer positioning unchanged.
13. Keep dropdown positioning unchanged.
14. Keep sidebar layout unchanged.

Preferred conversion pattern:

Before:
<div style={{ display: "flex", alignItems: "center", gap: 12 }}>

After:
<div className="user-toolbar__actions">

CSS:
.user-toolbar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

Before:
<div style={{ backgroundColor: t.surface, color: t.textPrimary }}>

After:
<div className="surface-card">

CSS:
.surface-card {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

Before:
<button style={{ backgroundColor: t.primary, color: "#fff" }}>

After:
<button className="btn btn--primary">

CSS:
.btn--primary {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
}

Theme rules:
- Do not use theme object values directly inside style props for visual styling.
- Use CSS variables instead.
- If a component needs selected theme styling, apply a class and let CSS variables handle the color.
- Dark mode must not require separate inline styles.

Class naming rules:
Use readable semantic class names.

Good examples:
- page-toolbar
- page-toolbar__actions
- stat-card
- stat-card__icon
- stat-card__value
- stat-card__label
- data-table
- data-table__header
- data-table__row
- user-table
- user-details-drawer
- role-management
- role-list-panel
- permission-card
- notification-dropdown
- account-dropdown
- appearance-panel

Avoid:
- box1
- styleA
- tempClass
- newFix
- random-card
- divWrapper
- final-style

Dynamic state rules:
Use class toggles instead of inline styles.

Examples:
- is-active
- is-selected
- is-open
- is-collapsed
- is-expanded
- is-disabled
- is-loading
- is-error
- is-success
- is-warning
- is-danger
- has-unread
- theme-dark

Example:
className={`nav-item ${active ? "is-active" : ""}`}

Instead of:
style={{ backgroundColor: active ? t.primary : "transparent" }}

Allowed exceptions:
Only keep inline style when truly necessary for runtime-calculated values that cannot be represented by CSS classes, such as:
- dynamic chart width/height generated from data
- dynamic transform based on mouse position
- SVG path fill/stroke inside actual SVG file
- rare runtime-calculated progress width if no CSS variable/class is practical

If any inline style must remain:
- keep it minimal
- add a short comment explaining why
- list it in the final report

Do not keep inline styles for:
- background
- color
- border
- borderRadius
- boxShadow
- padding
- margin
- gap
- fontSize
- fontWeight
- display
- flex
- grid
- width/height if static
- transition
- transform if simple open/close state can be handled with classes

SVG/logo rule:
- The official government seal SVG may keep path fill values inside the SVG file.
- Logo wrapper size, padding, border, radius, background, and placement must be CSS classes, not inline styles.

Validation checklist:
After cleanup, verify:

- App builds successfully.
- Sidebar remains fixed and vertical.
- Main content does not go under sidebar.
- Login page looks unchanged.
- Dashboard pages look unchanged.
- Report pages look unchanged.
- Return Register pages look unchanged.
- Register & Stock pages look unchanged.
- PSR & Verification pages look unchanged.
- Case & Financial Management pages look unchanged.
- Administration & Requests pages look unchanged.
- User Management looks unchanged.
- Role Management looks unchanged.
- Tables render correctly.
- Table actions still work.
- Detail drawers still open.
- Modals still open.
- Notification dropdown still opens.
- Account dropdown still opens.
- Appearance dropdown still opens.
- Theme switching works.
- Dark mode works.
- Font selector works.
- Font size presets work.
- Breadcrumbs still show full names.
- Login routes to Dashboard > Dashboard.
- Logout routes to Login.
- Logo click routes to Dashboard > Dashboard.
- No blank pages appear.

Final search requirement:
After moving styles, search for:

- style={{
- style={
- const styles
- Style =
- backgroundColor:
- borderColor:
- boxShadow:
- fontSize:
- padding:
- margin:
- borderRadius:
- transform:
- transition:

Report the remaining matches.

Final report required:
After completion, report:

1. Files modified
2. CSS files created
3. CSS files updated
4. Inline styles removed count
5. Remaining inline styles count
6. Remaining inline styles with reasons
7. Hardcoded colors replaced
8. Theme variable changes, if any
9. Build status
10. Visual risk areas
11. Next recommended phase

Stop after this phase.