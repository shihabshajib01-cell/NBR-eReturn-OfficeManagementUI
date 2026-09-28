You are working on the NBR eReturn Office Management UI project.

Task:
Run a full long-text overflow audit and fix every remaining view-mode overflow issue. The current implementation added ExpandableText, but long text can still break modals, drawers, permission chips, detail rows, and drawer content by creating horizontal scroll or layout collision.

Current confirmed bugs:
1. Create New Role final review still breaks when role name/description is very long.
2. User detail drawer breaks when user fields contain long text.
3. Role Details drawer shows horizontal scroll when long text or long permission labels exist.
4. Long permission chips can overflow the drawer.
5. Detail drawer fields can still overflow because parent containers do not enforce min-width: 0 and overflow wrapping.
6. Tables should truncate with ellipsis only, but detail/view areas should use See more / See less.

Important rule:
Do not restrict user input.
Do not add maxLength to form fields.
Do not truncate inside create/edit input fields.
Only protect view/display mode.

Target files:
- src/app/components/shared/SafeText.tsx
- src/app/components/shared/ExpandableText.tsx
- src/app/components/roles/CreateEditRoleModal.tsx
- src/app/components/roles/RolePreviewCard.tsx
- src/app/pages/administration-requests/RoleManagementPage.tsx
- src/app/pages/administration-requests/PermissionListPage.tsx
- src/app/components/users/UserComponents.tsx
- src/app/components/drawers/DynamicDetailsDrawer.tsx
- src/app/components/tables/CardTable.tsx
- src/app/components/tables/UnifiedMobileCard.tsx
- src/app/components/modals/AppModal.tsx
- src/app/components/shared/ResponsiveOverlay.tsx
- src/styles/globals.css
- src/styles/roles.css
- src/styles/drawers.css
- src/styles/users.css
- src/styles/tables.css
- src/styles/modals.css
- src/styles/responsive-overlay.css

Audit finding 1:
ExpandableText exists, but it is not enough by itself. Parent containers still allow overflow.

Fix ExpandableText:
File:
src/app/components/shared/SafeText.tsx

Improve ExpandableText so it is layout-safe by default.

Required behavior:
- Wrapper must always have min-width: 0 and max-width: 100%.
- Text content must use overflow-wrap: anywhere and word-break: break-word.
- Collapsed text must use line clamp.
- Expanded text must still wrap and never create horizontal scroll.
- If used inside narrow places, it must not push the parent width.
- Button click must stop propagation.
- Button must be type="button".
- Do not use dangerouslySetInnerHTML.
- Do not add external libraries.

Add optional prop:
- mode?: "block" | "inline"

Default:
- mode = "block"

If mode is block:
- wrapper class includes expandable-text--block

If mode is inline:
- wrapper class includes expandable-text--inline

Do not use a plain inline span as the default for long text.

Audit finding 2:
Shared CSS does not fully protect long text containers.

Update shared CSS:
File:
src/styles/globals.css

Required CSS:

.expandable-text {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.expandable-text--block {
  display: block;
}

.expandable-text--inline {
  display: inline-block;
  vertical-align: bottom;
}

.expandable-text__content {
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
  line-height: 1.55;
}

.expandable-text__content--collapsed {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.expandable-text__content--expanded {
  display: block;
  overflow: visible;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.safe-text {
  min-width: 0;
  max-width: 100%;
}

.safe-text--truncate {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.safe-text--break,
.safe-text--wrap {
  overflow-wrap: anywhere;
  word-break: break-word;
}

Audit finding 3:
ResponsiveOverlay body can show horizontal scroll.

Fix:
File:
src/styles/responsive-overlay.css

Add to both desktop and mobile body:

.responsive-overlay__body {
  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;
}

Also protect the panel:

.responsive-overlay {
  min-width: 0;
  overflow-x: hidden;
}

Do not remove vertical scrolling.
Do not affect footer sticky behavior.
Do not change drawer width.

Audit finding 4:
AppModal body can show horizontal overflow.

Fix:
File:
src/styles/modals.css

Add:

.app-modal-panel {
  min-width: 0;
  overflow-x: hidden;
}

.app-modal-body {
  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;
}

.app-modal-header__leading {
  min-width: 0;
}

.app-modal-header__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

Do not change modal size presets.
Do not change footer behavior.

Audit finding 5:
Create New Role final review still has overflow risk.

Fix:
File:
src/app/components/roles/CreateEditRoleModal.tsx

For Step 3 Final Review:
- Do not wrap ExpandableText inside inline span wrappers that can break layout.
- Render role name and description in block-safe containers.
- Use ExpandableText with mode="block".
- Role Name:
  maxChars around 90
  collapsedLines 3
- Description:
  maxChars around 180
  collapsedLines 4
  preserveLineBreaks true

Permission rows:
- Do not use ExpandableText inside permission rows.
- Use ellipsis with title for permission labels.
- Long permission labels must not stretch module cards.

Required JSX behavior:
- Role name display uses ExpandableText directly.
- Description display uses ExpandableText directly.
- Permission label span must have title={p.label}.

Do not change:
- stepper logic
- form fields
- selected permissions logic
- save logic
- footer buttons
- modal size
- translations

Audit finding 6:
Create New Role CSS still allows horizontal scroll.

Fix:
File:
src/styles/roles.css

Update:

.crm-step-content {
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0;
}

.crm-body,
.crm-body--review,
.crm-review__summary,
.crm-review__summary-grid,
.crm-review__summary-item,
.crm-review__perms,
.crm-review__module-list,
.crm-review__module {
  min-width: 0;
  max-width: 100%;
}

.crm-review__summary-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
}

.crm-review__summary-value,
.crm-review__summary-value--desc {
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.crm-review__perm-rows {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  min-width: 0;
}

.crm-review__perm-row {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.crm-review__module-header {
  min-width: 0;
}

.crm-review__module-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

On mobile:
.crm-review__perm-rows {
  grid-template-columns: 1fr;
}

Audit finding 7:
Role Details drawer has horizontal scroll caused by permission module cards/chips.

Fix:
File:
src/styles/roles.css

Update:

.role-details-drawer,
.role-details-drawer__name-row,
.role-details-drawer__desc,
.permission-section__modules,
.permission-module-card,
.permission-module-card__header,
.permission-module-card__chips {
  min-width: 0;
  max-width: 100%;
}

.role-details-drawer {
  overflow-x: hidden;
}

.permission-module-card {
  overflow: hidden;
}

.permission-module-card__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.permission-module-card__count {
  flex-shrink: 0;
}

.permission-module-card__chips {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
}

.permission-chip {
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

Also update RoleManagementPage.tsx:
- Add title={p.label} to each permission chip.
- Add title={g.label} to module title.
- Keep role drawer title as “Role Details”.
- Keep role name/description inside body with ExpandableText.
- Do not change footer buttons or handlers.

Audit finding 8:
DynamicDetailsDrawer summary still renders raw strings.

Fix:
File:
src/app/components/drawers/DynamicDetailsDrawer.tsx

Replace direct summary strings with SafeText or ExpandableText.

Current unsafe areas:
- drawer-summary__name
- drawer-summary__subtitle
- drawer-summary__id
- drawer-summary__meta

Required behavior:
- Name: ExpandableText, maxChars 120, collapsedLines 3, mode block
- Subtitle: ExpandableText or SafeText break mode, maxChars 140, collapsedLines 2
- Identifier: SafeText mode break
- Meta: SafeText mode break
- StatusBadge unchanged

Also update WIDE_KEY_PATTERNS:
Include:
- endpoint
- api_endpoint
- apiEndpoint
- url
- link
- email
- description
- remarks
- notes
- address
- reason
- message
- details
- summary
- activity_summary
- last_action

Fields matching those keys should span full drawer width.

For drawer field values:
- Use ExpandableText for long readable values.
- Use SafeText mode="break" for normal values.
- StatusBadge must remain unchanged.
- Empty values must not render.

Do not change:
- grouping logic
- footer actions
- showActions behavior
- default Print/Download behavior
- ResponsiveOverlay API

Audit finding 9:
Drawer field CSS needs stronger protection.

Fix:
File:
src/styles/drawers.css

Update:

.drawer-summary,
.drawer-summary__main,
.drawer-summary__name,
.drawer-summary__subtitle,
.drawer-summary__id,
.drawer-summary__meta,
.detail-section,
.drawer-field-grid,
.drawer-field,
.drawer-field__value {
  min-width: 0;
  max-width: 100%;
}

.drawer-summary,
.detail-section,
.drawer-field {
  overflow-x: hidden;
}

.drawer-summary__name,
.drawer-summary__subtitle,
.drawer-summary__id,
.drawer-summary__meta,
.drawer-field__value {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.drawer-field-grid {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

@media (max-width: 1023px) {
  .drawer-field-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

Audit finding 10:
UserDetailDrawer still renders raw user values.

Fix:
File:
src/app/components/users/UserComponents.tsx

Import:
- SafeText
- ExpandableText

Change ResponsiveOverlay title:
- Do not pass raw user.name if it can be extremely long.
- Use stable title: “User Details” or existing translation if available.
- Show user.name inside the drawer header/card using SafeText or ExpandableText.

In user-detail-drawer__header:
- Add user name inside the body header.
- Use ExpandableText for name with maxChars 90 and collapsedLines 2.
- Use SafeText mode break for designation.
- Keep status badge.

In detail rows:
- Replace raw `{v}` with SafeText or ExpandableText.
- For employeeId, email, phone, circle, zone, lastActive:
  use SafeText mode="break".
- For role and level:
  use SafeText mode="break".
- Do not let detail-row flex layout push labels off-screen.

Do not change:
- tabs
- edit
- reset password
- deactivate
- reassign
- download
- print
- delete
- role preview logic
- role assignment modal logic

Audit finding 11:
User drawer detail row CSS is unsafe.

Fix:
File:
src/styles/drawers.css or src/styles/users.css

Replace fragile flex behavior for detail rows with a grid-safe layout:

.detail-row {
  display: grid;
  grid-template-columns: minmax(96px, auto) minmax(0, 1fr);
  align-items: start;
  gap: 12px;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.detail-row__key {
  min-width: 0;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-row__val {
  min-width: 0;
  max-width: 100%;
  text-align: right;
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media (max-width: 420px) {
  .detail-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .detail-row__key,
  .detail-row__val {
    text-align: left;
    max-width: 100%;
  }
}

Audit finding 12:
Tables should not use See more.

Fix:
File:
src/app/components/tables/CardTable.tsx
File:
src/styles/tables.css

Keep table behavior separate:
- Tables use ellipsis only.
- No See more / See less in tables.
- Full value available through title.
- Do not use table-layout fixed.
- Do not use fixed colgroup widths.
- Do not create large empty columns.
- Keep short columns compact.
- Long endpoint/url/description/email columns truncate.

Required CSS:
.card-table__table {
  width: max-content;
  min-width: 100%;
  table-layout: auto;
}

.card-table__wrapper {
  overflow-x: auto;
  max-width: 100%;
}

.card-table__cell-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-table__cell-text--compact {
  max-width: 96px;
}

.card-table__cell-text--normal {
  max-width: min(22vw, 260px);
}

.card-table__cell-text--long {
  max-width: min(38vw, 520px);
}

Do not add See more to tables.
Do not change mobile card click behavior.

Audit finding 13:
Mobile cards should stay compact.

Fix:
File:
src/app/components/tables/UnifiedMobileCard.tsx
File:
src/styles/tables.css

Use ellipsis/line clamp only:
- primary: max 2 lines
- meta: max 1 or 2 lines
- date/amount/footer: 1 line
- title attribute with full value

Do not add View Details button.
Do not add See more inside mobile cards.
Details must still open by tapping the card.

Audit finding 14:
User role preview and reassign modal can still overflow.

Fix:
File:
src/app/components/roles/RolePreviewCard.tsx
File:
src/styles/roles.css

Use:
- ExpandableText mode block for role name and role description only if inside a detail/preview panel.
- Use ellipsis for module names.
- Add title to module names.
- Ensure role preview card has min-width: 0 and overflow hidden.

CSS:
.role-preview-card,
.role-preview-card__header,
.role-preview-card__body,
.role-preview-module,
.role-preview-module__header {
  min-width: 0;
  max-width: 100%;
}

.role-preview-card {
  overflow: hidden;
}

.role-preview-module__name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

Audit finding 15:
UserFormModal selected role summary uses raw text.

Fix:
File:
src/app/components/users/UserFormModal.tsx

This is a view/preview area inside an edit modal, not an input.

Protect:
- selectedRole.name
- selectedRole.description
- role module tags

Use:
- SafeText truncate for selectedRole.name
- ExpandableText for selectedRole.description if long
- title for role tags
- ellipsis for tags

Do not change form inputs.

Golden rules:
1. Do not break solved features.
2. Do not redesign the UI.
3. Do not restrict user input.
4. Do not add maxLength to inputs.
5. Do not truncate inside edit/create input fields.
6. Apply See more / See less only in view/detail/preview areas.
7. Do not use See more in tables, chips, mobile cards, or headers.
8. Use ellipsis for headers, tables, chips, badges, compact labels, and mobile list cards.
9. Use ExpandableText for detail body values, final review text, drawer summary names, descriptions, remarks, address, reason, endpoint, url, message, notes, and long readable fields.
10. Stop horizontal scroll in modals and drawers by fixing parent containers, not by hiding broken content only.
11. Keep desktop and mobile behavior working.
12. Do not change APIs, routes, hooks, registries, mock data, theme system, or language system.
13. Keep EN/BN translation parity.
14. Keep theme, font, and font-size switching working.
15. Keep all existing button handlers.
16. Keep role, permission, and user management logic unchanged.
17. Do not add View Details buttons to mobile cards.
18. No TypeScript errors.
19. No unused imports.
20. No console errors.

Acceptance criteria:
1. Create New Role final review does not break with 1000+ character role name.
2. Create New Role final review does not break with 3000+ character description.
3. Long text in Step 1 input fields remains fully editable.
4. Step 3 view mode shows collapsed text with See more / See less.
5. Create New Role modal never shows horizontal scroll.
6. Role Details drawer never shows horizontal scroll.
7. Role Details drawer permission chips do not overflow.
8. Role Details drawer long name and description are readable with See more / See less.
9. User detail drawer title does not break.
10. User detail drawer body does not collapse into one unreadable block.
11. User detail rows keep labels visible and values wrapped safely.
12. DynamicDetailsDrawer summary and field values handle long text safely.
13. Permission List drawer handles long endpoint/url/email without horizontal scroll.
14. Tables use ellipsis, not See more.
15. Mobile cards stay compact and open details by tapping the card.
16. Role preview cards do not overflow.
17. User reassign modal does not overflow when role names/descriptions are long.
18. No horizontal scroll appears inside drawer bodies unless a real table is intentionally scrollable.
19. Role Management, Permission List, User Management, Special Registration, generated pages, and mobile views still work.
20. Build and tests pass.