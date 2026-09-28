Continue the safe refactor. Do this phase only:

Move inline styles and style objects into CSS files.

Do not redesign the UI.
Do not change the visual design.
Do not change layouts.
Do not change routes.
Do not change navigation names.
Do not change table headers.
Do not change page content.
Do not change data values.
Do not refactor page/component structure in this phase.
Do not move components in this phase.
Do not rename components.
Do not create new visual patterns.
Do not remove features.

Current issue:
The project still has many inline styles and style objects inside React/TypeScript files.

Goal:
Remove inline CSS from JSX and move all visual styling into CSS files while preserving the exact current UI.

Scope:
Search the full src/ folder for:
- style={{ ... }}
- style={...}
- const styles = { ... }
- const somethingStyle = { ... }
- hardcoded visual values inside JSX
- repeated className patterns that should be moved into CSS classes

Important:
This is CSS cleanup only.
Do not extract components.
Do not restructure pages.
Do not rewrite logic.
Do not change the rendered UI.

CSS file structure:
Use the existing styles folder.

Move styles into the most relevant files:

src/styles/
  tokens.css
  global.css
  typography.css
  layout.css
  navigation.css
  tables.css
  cards.css
  forms.css
  buttons.css
  badges.css
  modals.css
  drawers.css
  dropdowns.css
  animations.css
  themes.css
  dark-mode.css

If a required CSS file does not exist, create it.
Then import it in src/styles/index.css.

Required import order in src/styles/index.css:

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
@import './dark-mode.css';

Only include files that exist. If a file is created, import it.

Rules for moving inline styles:
1. Replace inline style objects with semantic class names.
2. Use existing design tokens and CSS variables.
3. Do not hardcode new colors.
4. Do not hardcode new spacing if an existing token exists.
5. Do not change approved colors, shadows, radius, typography, spacing, or layout.
6. Keep theme switching working.
7. Keep dark mode working.
8. Keep font selector working.
9. Keep font-size presets working.
10. Keep responsive behavior working.
11. Keep animation easing working.
12. Keep dropdown positioning working.
13. Keep modal and drawer positioning working.
14. Keep table horizontal scrolling working.
15. Keep sidebar layout working.

Allowed exceptions:
- SVG path fill/stroke values may remain inside SVG files.
- Dynamic width/height/position values required for runtime calculation may stay only if they cannot be safely represented with classes.
- If a dynamic style must remain, add a short comment explaining why.
- Do not leave simple colors, margins, padding, border, radius, shadow, typography, background, display, flex, grid, or transition as inline styles.

Preferred pattern:
Instead of:

<div style={{ display: "flex", gap: 12, alignItems: "center" }}>

Use:

<div className="user-toolbar__actions">

And add CSS:

.user-toolbar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

Instead of:

<div style={{ backgroundColor: theme.primary, color: "#fff" }}>

Use:

<div className="theme-active-card">

And add CSS using variables:

.theme-active-card {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

Theme rules:
- Do not break existing color palettes.
- Do not remove any existing theme class.
- Do not remove any existing CSS variable.
- If inline styles currently depend on theme values, replace them with CSS variables.
- Theme changes must still apply across the full system.

Dark mode rules:
- Keep Gmail-inspired dark mode.
- Do not make dark mode louder.
- Use existing dark tokens.
- Tables, cards, dropdowns, modals, drawers, inputs, buttons, and sidebars must remain readable in dark mode.

Typography rules:
- Keep the approved typography scale.
- Do not add random font sizes.
- Font-size preset selection must still affect all text.
- Use CSS variables for font size where needed.

Files to check carefully:
- App.tsx
- ModulePages.tsx
- LoginPage.tsx
- UserManagementPage.tsx
- RoleManagementPage.tsx
- PermissionComponents.tsx
- UserComponents.tsx
- Dashboard pages
- Report pages
- Navigation components
- Dropdown components
- Modal components
- Drawer components
- Table components

Validation checklist:
After cleanup, confirm:
- App builds successfully.
- UI looks unchanged.
- Sidebar is still vertical.
- Logo renders correctly.
- Login page looks unchanged.
- Dashboard pages look unchanged.
- Report tables look unchanged.
- User Management looks unchanged.
- Role Management looks unchanged.
- Modals open correctly.
- Drawers open correctly.
- Dropdowns open correctly.
- Notifications dropdown works.
- Account dropdown works.
- Appearance dropdown works.
- Theme switching works.
- Dark mode works.
- Font selector works.
- Font-size presets work.
- Table horizontal scroll still works.
- Breadcrumbs still show full names.
- No page becomes blank.
- No console errors.

Final search requirement:
After changes, run a search for:
- style={{
- style={
- const styles
- Style =
- backgroundColor:
- borderColor:
- boxShadow:
- margin:
- padding:
- fontSize:
- transform:

Report remaining results.

For remaining inline styles, list:
1. File name
2. Line/component
3. Reason it could not be moved
4. Whether it is safe to keep

Expected result:
- Most inline styles should be removed.
- CSS should be organized into the styles folder.
- Components should use className instead of style.
- The visual design should remain exactly the same.

After completion, report:
1. Files modified
2. CSS files created
3. CSS files updated
4. Inline styles removed count
5. Remaining inline styles count
6. Remaining inline styles with reasons
7. Build status
8. Any visual risks
9. Next recommended phase

Stop after this phase.