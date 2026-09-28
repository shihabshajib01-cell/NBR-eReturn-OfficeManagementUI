Continue the final cleanup of the Government Office Management UI project.

The UI is mostly working. This is not a redesign task.

Main goal:
Clean the remaining code structure issues and prepare the project for developer handoff without changing the current working UI.

Do not change:

* visual design
* layouts
* navigation labels
* routes behavior
* table headers
* data values
* login/logout behavior
* logo behavior
* theme behavior
* dark mode behavior
* card/table/modal/drawer/dropdown design
* user-facing text unless required to fix a typo

Do not:

* redesign anything
* create placeholder pages
* remove features
* suppress errors without fixing the cause
* use `any` everywhere just to silence TypeScript
* rewrite the whole app
* do unrelated refactors

Work phase by phase.
After each phase, stop and report.
Do not continue to the next phase until approved.

Current known issues:

1. Inline CSS still exists in several files.
2. UserManagementPage.tsx is still too large.
3. Some reusable components may be duplicated.
4. WorkflowTablePage.tsx needs review.
5. Final build and route QA are still needed.

Global CSS cleanup rule:
Move inline styles into existing or new CSS files under:

src/styles/

Use the most relevant file:

* users.css
* roles.css
* permissions.css
* reports.css
* tables.css
* cards.css
* forms.css
* buttons.css
* badges.css
* modals.css
* drawers.css
* dropdowns.css
* navigation.css
* layout.css
* animations.css

If a new CSS file is created, import it in:

src/styles/index.css

Do not change the UI while moving styles.

Use CSS variables wherever possible:

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

Avoid inline styles for:

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
* transform where class state can handle it

Allowed exception:
Runtime-calculated values may remain only if necessary, such as progress width:

style={{ "--progress-value": `${value}%` } as React.CSSProperties }

If any inline style remains, document:

* file name
* reason
* why it is safe

Phase 1: Clean inline CSS in UserManagementPage.tsx

Target:
src/app/pages/administration-requests/UserManagementPage.tsx

Task:
Remove inline styles from this file only.

Move user-management-specific styles to:
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

Do not split the page yet.
Do not change behavior.

Validation after Phase 1:

* App builds
* User Management page opens
* Breadcrumb is correct
* Stat cards look unchanged
* Search/filter controls work
* User table renders
* Details drawer opens
* Add/Edit User modal works
* Manage Roles action works
* Light themes work
* Dark mode works
* No visual regression

Stop and report:

1. Files modified
2. Inline styles removed
3. Remaining inline styles in UserManagementPage.tsx
4. Build status
5. Risks

Phase 2: Clean inline CSS in RoleManagementPage.tsx

Target:
src/app/pages/administration-requests/RoleManagementPage.tsx

Task:
Remove inline styles from this file only.

Move role-management-specific styles to:
src/styles/roles.css

Use semantic class names:

* role-management
* role-management__header
* role-management__actions
* role-management__layout
* role-list-panel
* role-card
* role-card--selected
* role-card__title
* role-card__meta
* role-details-panel
* role-details-panel__header
* role-summary-grid
* permission-section
* permission-module-card
* permission-chip
* permission-progress
* permission-progress__bar

Do not split the page yet.
Do not change behavior.

Validation after Phase 2:

* App builds
* Role Management page opens
* Role list works
* Role details work
* Create/Edit/Delete/Duplicate actions work
* Permission cards render
* Permission chips render
* Light themes work
* Dark mode works
* No visual regression

Stop and report:

1. Files modified
2. Inline styles removed
3. Remaining inline styles in RoleManagementPage.tsx
4. Build status
5. Risks

Phase 3: Clean inline CSS in PermissionComponents.tsx, ReportComponents.tsx, and UserComponents.tsx

Targets:

* src/app/components/PermissionComponents.tsx
* src/app/components/reports/ReportComponents.tsx
* src/app/components/UserComponents.tsx

If actual paths differ, find the existing files with these names and update them there.

Task:
Remove inline styles from these files.

Move styles into:

* src/styles/permissions.css for permission-related components
* src/styles/reports.css for report-related components
* src/styles/users.css for user-related components

If users.css already exists, update it.

Use semantic class names:
Permission components:

* permission-card
* permission-card__header
* permission-card__body
* permission-chip
* permission-chip--selected
* permission-group
* permission-group__header
* permission-search

Report components:

* report-workspace
* report-toolbar
* report-card
* report-table
* report-filter-panel
* report-applied-filters
* report-drawer

User components:

* user-card
* user-profile-summary
* user-access-panel
* user-activity-list
* user-form-section

Do not change component behavior.
Do not change table design.
Do not change report filters.
Do not change permission labels.

Validation after Phase 3:

* App builds
* Report pages still load
* Permission components still render
* User components still render
* Report filters still work
* Drawers still open
* Modals still open
* Light themes work
* Dark mode works
* No visual regression

Stop and report:

1. Files modified
2. CSS files created/updated
3. Inline styles removed
4. Remaining inline styles in these files
5. Build status
6. Risks

Phase 4: Split UserManagementPage.tsx further

Target:
src/app/pages/administration-requests/UserManagementPage.tsx

Goal:
Make UserManagementPage.tsx a clean page-composition file.

Do not change UI.
Do not change behavior.
Do not change CSS.
Do not change routes.
Do not change table headers.
Do not change data.

Create or reuse components under:

src/app/components/users/

Suggested components:

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
* UserStatusBadge.tsx

Rules:

* Each file should contain one main component.
* Keep props clear.
* Keep feature-specific types close to the feature.
* Do not over-abstract.
* Do not duplicate existing components.
* Reuse shared components where already available.
* UserManagementPage.tsx should only compose sections and manage page-level state.

Expected result:
UserManagementPage.tsx should be much smaller, ideally under 220 lines.

Validation after Phase 4:

* App builds
* User Management page opens
* User table renders
* Search/filter works
* Add User modal opens
* Edit User modal opens
* Details drawer opens
* Manage Roles works
* Export button remains
* Light themes work
* Dark mode works
* No visual regression

Stop and report:

1. Files created
2. Files modified
3. Components extracted
4. New UserManagementPage.tsx line count
5. Build status
6. Risks

Phase 5: Audit duplicate components and remove confirmed unused ones

Task:
Audit duplicate or overlapping components.

Check:

* StatusBadge.tsx and SStatusBadge.tsx
* Pagination.tsx and TablePagination.tsx
* ReportComponents.tsx and ReportPage.tsx
* Permission components duplicated between page files and component files
* User components duplicated between page files and component files
* any duplicate button/card/table/drawer/modal components

Rules:

* Do not remove anything until references are checked.
* Pick one shared component only when safe.
* Preserve current UI and behavior.
* Update imports carefully.
* Remove only confirmed unused duplicates.
* If two components look similar but behave differently, do not merge yet. Document the difference.
* Do not break table pagination, report pages, badges, drawers, or modals.

Preferred shared components:

* StatusBadge.tsx
* TablePagination.tsx
* ReportPage.tsx
* PermissionComponents.tsx
* UserComponents.tsx

Validation after Phase 5:

* App builds
* No broken imports
* Tables still paginate
* Badges still render
* Reports still load
* User and Role pages still work
* No visual regression

Stop and report:

1. Duplicate components found
2. Components merged
3. Components removed
4. Imports updated
5. Duplicates kept with reason
6. Build status
7. Risks

Phase 6: Review WorkflowTablePage.tsx

Target:
src/app/pages/WorkflowTablePage.tsx

Task:
Decide whether this file is:

1. a real route page
2. a reusable page component
3. an unused temporary file

Do not delete immediately without checking references.

Steps:

1. Search all imports/references to WorkflowTablePage.tsx.

2. If it is used as a reusable table page component, move it to:
   src/app/components/pages/WorkflowTablePage.tsx
   or rename to:
   src/app/components/pages/WorkflowTableView.tsx

3. If it is a real route page, move it to the correct module folder.

4. If it is unused, remove it only after confirming no imports/references exist.

5. Update imports if moved.

6. Do not change the UI.

Validation after Phase 6:

* App builds
* No broken imports
* No blank pages
* Workflow table behavior, if used, still works
* No route is lost

Stop and report:

1. Whether WorkflowTablePage.tsx is used
2. Decision made
3. Files moved/removed
4. Imports updated
5. Build status
6. Risks

Phase 7: Final build and route QA

Run final validation.

Check:

* build command result
* TypeScript errors
* import/export errors
* console errors if available
* route behavior
* visual smoke test

Required route QA:

* /login opens Login page
* login routes to Dashboard > Dashboard
* logout routes to Login
* logo click routes to Dashboard > Dashboard

Navigation QA:

* Dashboard > Dashboard
* Dashboard > PSR Dashboard
* Dashboard > Double Entry Dashboard
* Report > Offline Return Report
* Report > Tax Category Report
* Report > Payment & Demand Report
* Return Register > Return View Approval
* Return Register > Online Return Register
* Return Register > Offline Return Register
* Register & Stock > Register-4
* Register & Stock > Stock Register
* Register & Stock > Tax Registry
* Register & Stock > Register-5
* PSR & Verification > PSR Approval
* PSR & Verification > PSR Edit Request
* Case & Financial Management > Litigation Management > Arrear Approval
* Case & Financial Management > Appeal Register > Appeal Approval
* Case & Financial Management > Demand And Payment > Demand Entry
* Administration & Requests > Certificate Req > Data Entry Request
* Administration & Requests > User Management
* Administration & Requests > Role Management

UI QA:

* Sidebar vertical layout works
* Secondary navigation works
* Breadcrumbs show full names
* Tables render
* Pagination works
* Filters work
* Details drawer opens
* Modals open
* Account dropdown works
* Notification dropdown works
* Appearance dropdown works
* Theme switching works
* Gmail-style dark mode works
* Font selector works
* Font size presets work
* No page content goes under sidebar
* No blank placeholder pages appear

Final audit:
Report:

1. Build status
2. Remaining inline styles by file
3. Remaining large files over 400 lines
4. Remaining duplicate components
5. Remaining unused files
6. Route QA result
7. Theme/dark-mode QA result
8. Developer handoff readiness
9. Remaining risks
10. Recommended final cleanup, if any

Global final success criteria:

* App builds successfully
* UserManagementPage is smaller and componentized
* RoleManagementPage is cleaned
* Main high-impact inline styles are removed
* Duplicate components are reduced or documented
* WorkflowTablePage is resolved
* Routes work
* Themes work
* No visual regression
* Codebase is ready for developer handoff or close to it
