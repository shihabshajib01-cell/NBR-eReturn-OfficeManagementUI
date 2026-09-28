Continue the safe refactor. Do this phase only:

Clean inline CSS in UserManagementPage.tsx only.

Do not redesign the UI.
Do not change the visual design.
Do not change layout.
Do not change routes.
Do not change navigation labels.
Do not change user data.
Do not change role data.
Do not change table headers.
Do not move UserManagementPage.tsx in this phase.
Do not split components in this phase.
Do not touch RoleManagementPage.tsx, LoginPage.tsx, App.tsx, or unrelated files.
Do not create placeholder components.
Do not remove any feature.

Target file:
src/app/pages/UserManagementPage.tsx

Main goal:
Remove inline styles from UserManagementPage.tsx and move them into the correct CSS files while keeping the page visually exactly the same.

Search inside UserManagementPage.tsx for:
- style={{ ... }}
- style={...}
- const styles = { ... }
- hardcoded visual values inside JSX
- repeated color, spacing, border, shadow, radius, font size, display, grid, flex, transform, and transition styles

Move these styles into CSS files.

Preferred CSS destination:
src/styles/users.css

If users.css does not exist, create it.

Then import it in:
src/styles/index.css

Add it after cards/forms/tables and before roles/modals if possible:

@import './users.css';

If user styles clearly belong to shared components, place them in:
- cards.css for stat/card styles
- tables.css for user table and toolbar styles
- forms.css for search, select, input, and form styles
- buttons.css for buttons
- badges.css for user status badges
- drawers.css for user detail drawer
- modals.css for add/edit user modal styles

But for page-specific User Management layout, use:
src/styles/users.css

Class naming:
Use semantic class names.

Examples:
- user-management
- user-management__header
- user-management__actions
- user-management__stats
- user-toolbar
- user-toolbar__search
- user-toolbar__filters
- user-table
- user-table__user-cell
- user-table__avatar
- user-table__identity
- user-table__name
- user-table__email
- user-table__role
- user-table__actions
- user-details-drawer
- user-details-drawer__section
- user-form
- user-form__grid
- user-form__section
- user-access-summary
- user-account-status

Dynamic state rules:
Use class toggles instead of inline styles.

Example:
className={`user-row ${selected ? "user-row--selected" : ""}`}

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

Do not hardcode dark mode colors inside UserManagementPage.tsx.

Dark mode rules:
The page must still work in Gmail-inspired dark mode.
Do not use white backgrounds in CSS except where the design system specifically requires it.
Use theme variables instead.

Before:
<div style={{ background: t.surface, border: `1px solid ${t.border}` }}>

After:
<div className="user-management-card">

CSS:
.user-management-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

Before:
<div style={{ color: t.textSecondary }}>

After:
<div className="user-table__email">

CSS:
.user-table__email {
  color: var(--color-text-secondary);
}

Before:
<div style={{ backgroundColor: user.status === "Active" ? t.success : t.warning }}>

After:
<StatusBadge status={user.status} />

or:
<span className={`user-status user-status--${user.status.toLowerCase()}`}>
  {user.status}
</span>

CSS:
.user-status--active {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.user-status--pending {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

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

Allowed exception:
Only keep inline style when truly runtime-calculated and not practical with classes.
If any inline style remains:
- keep it minimal
- add a short comment explaining why
- list it in the final report

User Management behavior must remain:
- Page remains under Administration & Requests > User Management.
- Breadcrumb remains full and unchanged.
- Page title/subtitle remain unchanged.
- Stat cards still render.
- Search users still works.
- Status/zone/level/role filters still render.
- User table still renders.
- View Details action still opens the details drawer.
- Add User modal still opens.
- Edit User modal still opens if present.
- Manage Roles action still works.
- Export action remains.
- Status badges still render correctly.
- Theme switching still works.
- Dark mode still works.

Validation checklist:
After cleanup, confirm:

- App builds successfully.
- User Management page opens.
- Breadcrumb remains correct.
- Page title/subtitle remain unchanged.
- Stat cards look unchanged.
- Toolbar looks unchanged.
- Search/filter controls look unchanged.
- User table layout remains unchanged.
- User avatar/name/email cell remains unchanged.
- Role/level cell remains unchanged.
- Circle/zone cell remains unchanged.
- Status badges look unchanged.
- Details drawer still opens.
- Add User modal still opens.
- Edit User modal still opens.
- Buttons still work.
- Dark mode still looks correct.
- Light themes still look unchanged.
- No console errors.
- No visual regression.

Final search requirement:
After changes, search UserManagementPage.tsx for:

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
3. Inline styles removed from UserManagementPage.tsx
4. Remaining inline styles in UserManagementPage.tsx, if any
5. Reason for any remaining inline style
6. Build status
7. Visual risk areas
8. Next recommended phase

Stop after this phase.