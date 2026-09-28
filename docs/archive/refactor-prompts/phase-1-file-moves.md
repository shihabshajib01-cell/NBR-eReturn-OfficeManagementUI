Continue the safe cleanup of the Government Office Management UI project.

The UI is mostly working now. Do not redesign anything.

This task is only for remaining code structure cleanup, folder cleanup, inline CSS cleanup, duplicate component cleanup, and developer-readiness.

Do not change:

* visual design
* page layouts
* navigation labels
* table headers
* data values
* routes behavior
* login/logout behavior
* theme behavior
* dark mode behavior
* dashboard/card/table designs
* modals/drawers/dropdowns behavior

Do not remove features.
Do not create placeholder pages.
Do not rewrite the whole app.
Do not make unrelated refactors.

Work safely in phases.
After each phase, stop and report.
Do not continue to the next phase unless approved.

Current known issues:

1. These files are still in the wrong root-level page folder:

   * src/app/pages/LoginPage.tsx
   * src/app/pages/UserManagementPage.tsx
   * src/app/pages/RoleManagementPage.tsx

2. Inline CSS is still high, especially in:

   * RoleManagementPage.tsx
   * UserManagementPage.tsx
   * PermissionComponents.tsx
   * ReportComponents.tsx
   * UserComponents.tsx
   * LoginForm.tsx
   * dashboard pages
   * UserProfileDropdown.tsx
   * NotificationDropdown.tsx
   * SecondarySidebar.tsx

3. Duplicate/overlapping components still exist:

   * StatusBadge.tsx and SStatusBadge.tsx
   * Pagination.tsx and TablePagination.tsx
   * ReportComponents.tsx and ReportPage.tsx
   * role/permission components duplicated inside page files and component files

4. UserManagementPage.tsx and RoleManagementPage.tsx are still too large.

5. src/imports/pasted_text may still contain old prompt/reference files and should not remain inside source code.

Main goal:
Make the codebase cleaner and developer-ready without changing the working UI.

Phase 1: Move misplaced page files only

Move:
src/app/pages/LoginPage.tsx
to:
src/app/pages/auth/LoginPage.tsx

Move:
src/app/pages/UserManagementPage.tsx
to:
src/app/pages/administration-requests/UserManagementPage.tsx

Move:
src/app/pages/RoleManagementPage.tsx
to:
src/app/pages/administration-requests/RoleManagementPage.tsx

Update all imports.

Search and update references in:

* src/app/App.tsx
* src/app/AppRouter.tsx
* src/app/routes.tsx
* src/app/utils/routeHelpers.tsx
* src/app/components/settings/SettingsWorkspace.tsx
* any other file importing old paths

Do not leave duplicate old files in root pages folder.

Validation after Phase 1:

* App builds
* Login page opens
* Login routes to Dashboard > Dashboard
* Logout routes to Login
* User Management opens under Administration & Requests
* Role Management opens under Administration & Requests
* Breadcrumbs remain correct
* No blank pages

Stop and report before Phase 2.

Phase 2: Clean inline CSS in RoleManagementPage.tsx only

Target:
src/app/pages/administration-requests/RoleManagementPage.tsx

Remove inline styles:

* style={{ ... }}
* style={...}
* const styles = { ... }
* hardcoded visual values in JSX

Move page-specific role styles into:
src/styles/roles.css

If role styles belong to shared components, place them in:

* cards.css
* forms.css
* buttons.css
* badges.css
* modals.css
* tables.css
* drawers.css

Use semantic class names:

* role-management
* role-management__header
* role-management__actions
* role-management__layout
* role-list-panel
* role-card
* role-card--selected
* role-details-panel
* permission-section
* permission-module-card
* permission-chip
* permission-progress
* permission-progress__bar

Use CSS variables:

* var(--color-background)
* var(--color-surface)
* var(--color-surface-secondary)
* var(--color-surface-hover)
* var(--color-border)
* var(--color-border-subtle)
* var(--color-text-primary)
* var(--color-text-secondary)
* var(--color-text-muted)
* var(--color-primary)
* var(--color-primary-alpha-6)
* var(--color-primary-alpha-10)
* var(--color-success)
* var(--color-warning)
* var(--color-error)
* var(--color-success-bg)
* var(--color-warning-bg)
* var(--color-error-bg)

Allowed exception:
Runtime-calculated progress width may remain as a CSS variable style only, for example:
style={{ "--progress-value": `${permissionPercent}%` } as React.CSSProperties }

Do not keep inline styles for:

* background
* color
* border
* borderRadius
* padding
* margin
* gap
* display
* flex
* grid
* boxShadow
* fontSize
* fontWeight
* transition
* transform if class state can handle it

Validation after Phase 2:

* Role Management page looks unchanged
* Role list works
* Role details work
* Permission cards render
* Create/Edit/Delete/Duplicate actions still work
* Dark mode works
* Light themes work
* App builds

Stop and report before Phase 3.

Phase 3: Clean inline CSS in UserManagementPage.tsx only

Target:
src/app/pages/administration-requests/UserManagementPage.tsx

Move page-specific user styles into:
src/styles/users.css

Use semantic class names:

* user-management
* user-management__header
* user-management__actions
* user-management__stats
* user-toolbar
* user-toolbar__search
* user-toolbar__filters
* user-table
* user-table__user-cell
* user-table__avatar
* user-table__identity
* user-table__name
* user-table__email
* user-table__role
* user-table__actions
* user-details-drawer
* user-form
* user-form__grid
* user-access-summary
* user-account-status

Use CSS variables instead of inline theme object styling.

Validation after Phase 3:

* User Management page looks unchanged
* Stat cards render
* Search and filters work
* User table renders
* Details drawer opens
* Add/Edit User modal works
* Manage Roles action works
* Dark mode works
* Light themes work
* App builds

Stop and report before Phase 4.

Phase 4: Clean inline CSS in remaining high-impact files

Clean inline CSS file-by-file. Do not do a broad rewrite.

Target order:

1. src/app/components/PermissionComponents.tsx
2. src/app/components/ReportComponents.tsx
3. src/app/components/UserComponents.tsx
4. src/app/components/auth/LoginForm.tsx
5. src/app/pages/dashboard/DashboardPage.tsx
6. src/app/pages/dashboard/PSRDashboardPage.tsx
7. src/app/pages/dashboard/CombinedDashboardPage.tsx
8. src/app/components/account/UserProfileDropdown.tsx
9. src/app/components/notifications/NotificationDropdown.tsx
10. src/app/components/navigation/SecondarySidebar.tsx

Move styles into the correct CSS files:

* permissions.css if needed
* reports.css if needed
* users.css
* auth.css if needed
* cards.css
* tables.css
* dropdowns.css
* navigation.css
* forms.css
* buttons.css
* badges.css
* animations.css

Import new CSS files in src/styles/index.css.

Do not change visuals.

Validation after Phase 4:

* App builds
* Dashboard looks unchanged
* Reports look unchanged
* Login looks unchanged
* Notifications dropdown works
* Account dropdown works
* Secondary sidebar works
* Dark mode works
* Light themes work

Stop and report before Phase 5.

Phase 5: Merge duplicate components safely

Audit and merge duplicates only after build is stable.

Check these duplicates:

1. StatusBadge.tsx and SStatusBadge.tsx
2. Pagination.tsx and TablePagination.tsx
3. ReportComponents.tsx and ReportPage.tsx
4. Permission components inside RoleManagementPage.tsx vs PermissionComponents.tsx
5. User components inside UserManagementPage.tsx vs UserComponents.tsx

Rules:

* Pick one shared component.
* Preserve the current working UI.
* Update imports.
* Remove confirmed unused duplicate files only after checking references.
* Do not remove a file if still imported.
* Do not change user-facing labels.
* Do not change table behavior.
* Do not change visual styles.

Expected preferred shared components:

* StatusBadge.tsx
* TablePagination.tsx
* ReportPage.tsx
* PermissionComponents.tsx
* UserComponents.tsx

Validation after Phase 5:

* App builds
* No broken imports
* No duplicate badge/pagination/report components remain
* Tables and badges look unchanged
* Role/User pages still work

Stop and report before Phase 6.

Phase 6: Split large User and Role pages further

Only if Phase 1–5 are stable.

Split RoleManagementPage into:
src/app/components/roles/

* RoleManagementHeader.tsx
* RoleListPanel.tsx
* RoleCard.tsx
* RoleDetailsPanel.tsx
* RoleEmptyState.tsx
* RoleForm.tsx
* CreateRoleModal.tsx
* EditRoleModal.tsx
* DeleteRoleConfirmModal.tsx
* DuplicateRoleModal.tsx

Split UserManagementPage into:
src/app/components/users/

* UserManagementHeader.tsx
* UserStatsGrid.tsx
* UserToolbar.tsx
* UserTable.tsx
* UserTableRow.tsx
* UserDetailsDrawer.tsx
* AddUserModal.tsx
* EditUserModal.tsx
* UserForm.tsx
* UserAccessSetup.tsx
* UserAccountSetup.tsx

Rules:

* Page files should become composition files.
* Do not change visuals.
* Do not change behavior.
* Each file should have one main component.
* Keep props clear.
* Keep feature-specific types close to feature components.

Validation after Phase 6:

* UserManagementPage line count reduced
* RoleManagementPage line count reduced
* App builds
* User and Role workflows still work
* No visual regression

Stop and report before Phase 7.

Phase 7: Move old prompt/archive files out of src

If this folder exists:
src/imports/pasted_text/

Move it to:
docs/archive/

Rules:

* Do not move files still imported by the app.
* If files are only prompts/reports/planning notes, move them out of src.
* src/ should contain only application source code.

Validation after Phase 7:

* App builds
* No import errors
* src no longer contains prompt/archive material

Stop and report before Phase 8.

Phase 8: Final audit and report

Run a final audit and report:

1. App.tsx line count
2. Remaining root-level page files
3. Remaining inline styles by file
4. Remaining duplicate components
5. Remaining large files over 400 lines
6. CSS files imported in index.css
7. Build status
8. Routing status
9. Login/logout status
10. Theme/dark mode status
11. Developer handoff readiness
12. Remaining risks

Final success criteria:

* App builds successfully
* LoginPage is under pages/auth
* UserManagementPage is under pages/administration-requests
* RoleManagementPage is under pages/administration-requests
* ModulePages.tsx does not exist
* App.tsx stays small
* No page imports from old ModulePages
* Inline CSS is mostly removed
* Any remaining inline styles are documented with reasons
* Duplicate components are merged or documented
* src/imports/pasted_text is moved out of source
* Dark mode still works
* All light themes still work
* No visual regression

Global golden rules:

* Do not redesign anything.
* Do not change approved UI.
* Do not change navigation labels.
* Do not change table headers.
* Do not remove features.
* Do not create placeholders.
* Do not suppress errors without fixing the cause.
* Do not use any everywhere just to silence TypeScript.
* Keep the app buildable after every phase.
* Stop and report after every phase.
