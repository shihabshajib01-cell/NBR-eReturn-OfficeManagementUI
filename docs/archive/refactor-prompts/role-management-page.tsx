Continue the safe refactor. Do this phase only:

Clean inline CSS in RoleManagementPage.tsx only.

Do not redesign the UI.
Do not change the visual design.
Do not change layout.
Do not change routes.
Do not change navigation labels.
Do not change role data.
Do not change permission labels.
Do not move RoleManagementPage.tsx in this phase.
Do not split components in this phase.
Do not touch UserManagementPage.tsx, LoginPage.tsx, App.tsx, or unrelated files.
Do not create placeholder components.
Do not remove any feature.

Target file:
src/app/pages/RoleManagementPage.tsx

Main goal:
Remove inline styles from RoleManagementPage.tsx and move them into the correct CSS files while keeping the page visually exactly the same.

Search inside RoleManagementPage.tsx for:
- style={{ ... }}
- style={...}
- const styles = { ... }
- hardcoded visual values inside JSX
- repeated color, spacing, border, shadow, radius, font size, display, grid, flex, transform, and transition styles

Move these styles into CSS files.

Preferred CSS destination:
src/styles/roles.css

If roles.css does not exist, create it.

Then import it in:
src/styles/index.css

Add it after cards/forms/tables and before modals if possible:

@import './roles.css';

If role styles clearly belong to shared components, place them in:
- cards.css for card styles
- forms.css for input/search/select styles
- buttons.css for buttons
- badges.css for badges
- modals.css for modal styles
- tables.css for table/list styles

But for page-specific role management layout, use:
src/styles/roles.css

Class naming:
Use semantic class names.

Examples:
- role-management
- role-management__header
- role-management__actions
- role-management__layout
- role-list-panel
- role-list-panel__header
- role-list-panel__search
- role-card
- role-card--selected
- role-card__title
- role-card__meta
- role-details-panel
- role-details-panel__header
- role-summary-grid
- permission-section
- permission-module-card
- permission-module-card__header
- permission-chip
- permission-progress
- permission-progress__bar

Dynamic state rules:
Use class toggles instead of inline styles.

Example:
className={`role-card ${selected ? "role-card--selected" : ""}`}

Instead of:
style={{ backgroundColor: selected ? t.primaryLight : t.surface }}

Theme rules:
Replace direct theme color styling with CSS variables.

Use:
- var(--color-background)
- var(--color-surface)
- var(--color-surface-secondary)
- var(--color-surface-hover)
- var(--color-border)
- var(--color-border-subtle)
- var(--color-text-primary)
- var(--color-text-secondary)
- var(--color-text-muted)
- var(--color-primary)
- var(--color-primary-light)
- var(--color-primary-alpha-6)
- var(--color-primary-alpha-10)
- var(--color-success)
- var(--color-warning)
- var(--color-error)
- var(--color-success-bg)
- var(--color-warning-bg)
- var(--color-error-bg)

Do not hardcode dark mode colors inside RoleManagementPage.tsx.

Dark mode rules:
The page must still work in Gmail-inspired dark mode.
Do not use white backgrounds in CSS except where the design system specifically requires it.
Use theme variables instead.

Before:
<div style={{ background: t.surface, border: `1px solid ${t.border}` }}>

After:
<div className="role-details-panel">

CSS:
.role-details-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

Before:
<div style={{ color: t.textSecondary }}>

After:
<div className="role-card__meta">

CSS:
.role-card__meta {
  color: var(--color-text-secondary);
}

Before:
<div style={{ width: `${permissionPercent}%` }}>

Preferred:
Use a CSS variable only if needed:

<div
  className="permission-progress__bar"
  style={{ "--progress-value": `${permissionPercent}%` } as React.CSSProperties}
/>

CSS:
.permission-progress__bar {
  width: var(--progress-value);
}

Allowed exception:
A CSS variable style for runtime-calculated progress width may remain if needed.
Keep it minimal and document it in the final report.

Do not keep inline styles for:
- background
- color
- border
- borderRadius
- padding
- margin
- gap
- display
- flex
- grid
- boxShadow
- fontSize
- fontWeight
- transition
- transform if it can be represented with class state

Role Management behavior must remain:
- Role list still appears on the left.
- Role details still appear on the right.
- Search roles still works.
- Selecting a role still updates the details panel.
- Empty state still works.
- Create Role modal still opens.
- Edit Role action still works.
- Delete Role confirmation still works.
- Duplicate Role action still works.
- Permission cards still render.
- Permission chips still render.
- Permission progress still renders.
- Permission counts still remain.
- Theme switching still works.
- Dark mode still works.

Validation checklist:
After cleanup, confirm:

- App builds successfully.
- Role Management page opens.
- Breadcrumb remains correct.
- Page title/subtitle remain unchanged.
- Role list layout remains unchanged.
- Role details layout remains unchanged.
- Permission module cards look unchanged.
- Permission chips look unchanged.
- Modals still open.
- Buttons still work.
- Selected role state still works.
- Dark mode still looks correct.
- Light themes still look unchanged.
- No console errors.
- No visual regression.

Final search requirement:
After changes, search RoleManagementPage.tsx for:

- style={{
- style={
- backgroundColor:
- borderColor:
- boxShadow:
- fontSize:
- padding:
- margin:
- borderRadius:
- transform:
- transition:

Report remaining matches.

Final report:
After completion, report:

1. Files modified
2. CSS file created or updated
3. Inline styles removed from RoleManagementPage.tsx
4. Remaining inline styles in RoleManagementPage.tsx, if any
5. Reason for any remaining inline style
6. Build status
7. Visual risk areas
8. Next recommended phase

Stop after this phase.