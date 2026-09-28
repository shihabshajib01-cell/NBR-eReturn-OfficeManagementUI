Continue the safe refactor. Do this phase only:

Split:
1. LoginPage.tsx
2. UserManagementPage.tsx
3. RoleManagementPage.tsx

Do not redesign the UI.
Do not change the visual design.
Do not change navigation names.
Do not change routes.
Do not change table headers.
Do not change data values.
Do not change CSS yet.
Do not remove inline styles in this phase.
Do not refactor App.tsx in this phase unless import/export updates are required.
Do not touch unrelated pages.
Do not create placeholder pages.
Do not remove any feature.

Current issue:
These files are still too large:
- src/app/pages/LoginPage.tsx
- src/app/pages/UserManagementPage.tsx
- src/app/pages/RoleManagementPage.tsx

Goal:
Split each large page into smaller, readable, reusable components while keeping the page behavior and visual design exactly the same.

Rules:
- Each file should contain only one main component.
- Page files should become page-composition files only.
- Child components should move into matching component folders.
- Do not change UI layout.
- Do not change text.
- Do not change colors.
- Do not change spacing.
- Do not change interactions.
- Do not change route behavior.
- Keep the app buildable after this phase.

Create/use these folders:

src/app/components/auth/
src/app/components/users/
src/app/components/roles/
src/app/components/permissions/
src/app/components/forms/
src/app/components/modals/
src/app/components/drawers/
src/app/components/cards/
src/app/components/tables/
src/app/components/states/

Part 1: Split LoginPage.tsx

Target page file:
src/app/pages/LoginPage.tsx

The page should only compose login components and manage page-level login state.

Extract components into:

src/app/components/auth/
  LoginBrandPanel.tsx
  LoginSlider.tsx
  LoginSlide.tsx
  LoginForm.tsx
  CaptchaBlock.tsx
  ForgotPasswordLink.tsx
  LoginErrorMessage.tsx
  LockedAccountMessage.tsx
  LoginFooter.tsx

Login behavior rules:
- Login page must still show the left news/information slider.
- Login page must still show the right login form.
- Captcha should appear after multiple failed attempts.
- Error messages must remain.
- Failed attempt messages must remain.
- Locked account messages must remain.
- Forgot password helper text must remain.
- Clicking login after typing any random values must route to Dashboard > Dashboard.
- Logout from account dropdown must still route back to LoginPage.
- Do not add real authentication validation.
- Do not require real email/password matching.

Part 2: Split UserManagementPage.tsx

Target page file:
src/app/pages/administration-requests/UserManagementPage.tsx

The page should only compose user management sections and manage page-level state.

Extract components into:

src/app/components/users/
  UserManagementHeader.tsx
  UserStatsGrid.tsx
  UserStatsCard.tsx
  UserToolbar.tsx
  UserSearch.tsx
  UserFilters.tsx
  UserTable.tsx
  UserTableRow.tsx
  UserDetailsDrawer.tsx
  AddUserModal.tsx
  EditUserModal.tsx
  UserForm.tsx
  UserAccessSetup.tsx
  UserAccountSetup.tsx
  UserStatusBadge.tsx

User Management behavior rules:
- Page must remain under Administration & Requests > User Management.
- Existing breadcrumb must remain full and not truncated.
- Existing stats cards must stay visually consistent with the system.
- Existing search/filter controls must remain.
- Existing user table must remain.
- Existing “View Details” action must remain.
- Details drawer must still open.
- Add User modal must still open.
- Edit User modal must still open if present.
- Manage Roles button must still navigate/open the correct role management flow.
- Export button must remain.
- Add User button must remain.
- Do not move this back to Settings.
- Do not change the secondary navigation.

Part 3: Split RoleManagementPage.tsx

Target page file:
src/app/pages/administration-requests/RoleManagementPage.tsx

The page should only compose role management sections and manage page-level state.

Extract components into:

src/app/components/roles/
  RoleManagementHeader.tsx
  RoleSearchPanel.tsx
  RoleListPanel.tsx
  RoleCard.tsx
  RoleDetailsPanel.tsx
  RoleDetailsHeader.tsx
  RoleEmptyState.tsx
  CreateRoleModal.tsx
  EditRoleModal.tsx
  DuplicateRoleModal.tsx
  DeleteRoleConfirmModal.tsx
  RoleForm.tsx

src/app/components/permissions/
  PermissionSummary.tsx
  PermissionModuleCard.tsx
  PermissionProgressBar.tsx
  PermissionChip.tsx
  PermissionSearch.tsx
  PermissionGroup.tsx

Role Management behavior rules:
- Page must remain under Administration & Requests > Role Management.
- Existing breadcrumb must remain full and not truncated.
- Role list must remain on the left.
- Role details must remain on the right.
- Empty state must still show when no role is selected.
- Create Role button must remain.
- Duplicate Role button must remain if present.
- Edit Role action must remain.
- Delete Role action must remain.
- Permission module cards must remain.
- Permission chips must remain.
- Permission counts must remain.
- Search roles must remain.
- Do not change permission labels.
- Do not change role names.
- Do not change users count.
- Do not change selected role behavior.

Shared extraction rules:
- If a component is only used by LoginPage, keep it in components/auth.
- If a component is only used by UserManagementPage, keep it in components/users.
- If a component is only used by RoleManagementPage, keep it in components/roles.
- If a component is reusable across pages, place it in the relevant shared folder.
- Do not over-abstract.
- Do not create generic components if they make the code harder to understand.
- Do not duplicate code unnecessarily.

Import/export rules:
- Update all imports correctly.
- Create index.ts files only if helpful.
- Do not leave stale imports.
- Do not leave duplicated components in the original page files.
- Do not leave dead code.
- Keep TypeScript types close to the feature if they are feature-specific.
- Move shared types into a types file only if needed.

Validation checklist:
- App builds successfully.
- Login page opens.
- Login button routes to Dashboard > Dashboard.
- Logout routes to LoginPage.
- Captcha behavior still works.
- Login errors still appear.
- User Management page opens.
- User table renders.
- User filters render.
- Add User modal opens.
- User details drawer opens.
- Role Management page opens.
- Role list renders.
- Role details render.
- Role empty state works.
- Create Role modal opens.
- Permission cards render.
- No visual regression.
- No page becomes blank.
- No placeholder component appears.
- No console import errors.
- No duplicate large page logic remains in the page files.

Expected final page file sizes:
- LoginPage.tsx should be a small composition file.
- UserManagementPage.tsx should be a small composition file.
- RoleManagementPage.tsx should be a small composition file.

Do not attempt CSS cleanup in this phase.
Do not attempt full design-system cleanup in this phase.
Do not touch unrelated files unless required for imports.

After completion, report:
1. Files created
2. Files modified
3. Components extracted from LoginPage.tsx
4. Components extracted from UserManagementPage.tsx
5. Components extracted from RoleManagementPage.tsx
6. Remaining code inside each page file
7. Whether the app builds
8. Any broken imports fixed
9. Any remaining risks
10. Next recommended phase

Stop after this phase.