You are working on the NBR eReturn Office Management UI project.

Task:
Do a full system long-text safety audit and implement a reusable long-text handling solution across the whole app.

Current confirmed issue:
Long user-entered or dynamic text breaks UI layouts. Example: in Create New Role modal Final Review, if Role Name or Description is too long, the summary grid collapses and text overlaps into other columns. Detail drawers also allow long values to stretch, overlap, or become unreadable.

This is not only a Role modal issue. This must be solved as a shared system pattern.

Main goals:
1. Prevent long text from breaking any layout.
2. Add a reusable “See more / See less” behavior for long readable text.
3. Use truncation only where compact UI needs it.
4. Use wrapping and expandable text in detail views, summaries, drawers, and previews.
5. Keep tables dynamic and content-first.
6. Do not redesign the app.
7. Do not break desktop or mobile.

Target files to inspect:
- src/app/components/roles/CreateEditRoleModal.tsx
- src/app/components/roles/RolePreviewCard.tsx
- src/app/pages/administration-requests/RoleManagementPage.tsx
- src/app/components/drawers/DynamicDetailsDrawer.tsx
- src/app/components/shared/ResponsiveOverlay.tsx
- src/app/components/modals/AppModal.tsx
- src/app/components/tables/CardTable.tsx
- src/app/components/tables/UnifiedMobileCard.tsx
- src/app/components/users/UserComponents.tsx
- src/app/components/users/UserFormModal.tsx
- src/app/pages/administration-requests/PermissionListPage.tsx
- src/styles/roles.css
- src/styles/drawers.css
- src/styles/tables.css
- src/styles/modals.css
- src/styles/users.css
- src/styles/cards.css
- src/styles/navigation.css
- src/styles/globals.css
- src/app/locales/en/common.json
- src/app/locales/bn/common.json

Core solution:
Create reusable text safety components instead of fixing every page manually.

Add new file:
src/app/components/shared/SafeText.tsx

This file should export two components:

1. SafeText
Purpose:
- For compact text that should not break layout.
- Supports truncation, wrapping, title hover, and long-token safety.

Props:
- value: unknown
- fallback?: string
- mode?: "truncate" | "wrap" | "break"
- lines?: 1 | 2 | 3 | 4
- className?: string
- title?: string
- as?: "span" | "p" | "div"

Behavior:
- Convert null/undefined/empty to fallback or "—"
- Use title with full value when truncated
- For mode="truncate", use ellipsis
- For mode="wrap", allow normal wrapping
- For mode="break", use overflow-wrap:anywhere for long URLs, prompt text, endpoint strings, pasted text, email, address, remarks, descriptions
- Never allow text to escape its parent

2. ExpandableText
Purpose:
- For detail views and summaries where users need to read long text.
- Shows collapsed text first.
- Shows “See more” when text exceeds character or line threshold.
- Shows “See less” when expanded.

Props:
- value: unknown
- fallback?: string
- maxChars?: number
- collapsedLines?: 2 | 3 | 4 | 5 | 6
- className?: string
- buttonClassName?: string
- as?: "p" | "div" | "span"
- preserveLineBreaks?: boolean

Behavior:
- If text length is below maxChars, render normal safe text.
- If text length exceeds maxChars, render collapsed preview with “See more”.
- On click, expand full text and show “See less”.
- Button must be keyboard accessible.
- Button must not trigger row click or card click when used inside clickable cards.
- Use translated labels from common namespace:
  - actions.seeMore
  - actions.seeLess

Add translation keys:
src/app/locales/en/common.json:
actions.seeMore = "See more"
actions.seeLess = "See less"

src/app/locales/bn/common.json:
actions.seeMore = "আরও দেখুন"
actions.seeLess = "কম দেখুন"

CSS:
Add shared text safety classes in src/styles/globals.css or a new src/styles/text.css if the project already imports style files centrally.

Required CSS classes:
.safe-text {
  min-width: 0;
  max-width: 100%;
}

.safe-text--truncate {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

.safe-text--wrap {
  display: inline;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: normal;
}

.safe-text--break {
  display: inline;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.safe-text--block {
  display: block;
}

.expandable-text {
  min-width: 0;
  max-width: 100%;
}

.expandable-text__content {
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
  line-height: 1.5;
}

.expandable-text__content--collapsed {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.expandable-text__toggle {
  margin-top: 4px;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.expandable-text__toggle:hover {
  text-decoration: underline;
}

.expandable-text__toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

Important CSS rule:
Add min-width: 0 to flex/grid children that contain dynamic text:
- modal header leading text container
- drawer summary main
- drawer fields
- role review summary items
- role preview header
- user drawer header text container
- mobile card primary info
- table title groups

Do not rely on word-break alone. Long text inside CSS grid/flex needs min-width: 0 on the parent item.

Specific fixes:

1. Create New Role modal
Files:
- src/app/components/roles/CreateEditRoleModal.tsx
- src/styles/roles.css

Problem:
Final Review breaks when role name or description is too long.

Fix:
In Step 3 Final Review:
- Wrap Role Name value with ExpandableText
  - maxChars: 80
  - collapsedLines: 3
  - mode should safely break long tokens
- Wrap Description value with ExpandableText
  - maxChars: 160
  - collapsedLines: 4
- Do not let either value overlap into Status or Perms columns.
- Add min-width: 0 to:
  - .crm-review__summary-grid
  - .crm-review__summary-item
  - .crm-review__summary-value

Update CSS:
.crm-review__summary-grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.crm-review__summary-item {
  min-width: 0;
  overflow: hidden;
}

.crm-review__summary-value {
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}

For Role Name and Description fields:
- Add safe maxLength.
- Role Name max length: 80 characters.
- Description max length: 300 characters.
- Show helper/counter only if the project already has a helper pattern in forms. If no existing pattern, use native maxLength without adding a new visual pattern.
- Do not allow pasted prompt-length text to become a role name.

2. Role Preview Card
Files:
- src/app/components/roles/RolePreviewCard.tsx
- src/styles/roles.css

Problem:
Role name and description can break the preview card, including in Create Role Step 2, User drawer role preview, and Reassign Role modal.

Fix:
- Role name: SafeText mode="break", lines=2 or ExpandableText maxChars=70 collapsedLines=2
- Role description: ExpandableText maxChars=120 collapsedLines=3
- Module names: keep one-line truncation with title hover.
- Add min-width: 0 to role preview header/body.
- Do not make the card wider.
- Do not affect permission progress bars.

3. Role Details Drawer
Files:
- src/app/pages/administration-requests/RoleManagementPage.tsx
- src/styles/roles.css

Problem:
Drawer title, description, module title, and permission chips can overflow.

Fix:
- Drawer title is passed to ResponsiveOverlay. Make ResponsiveOverlay title safe globally.
- Role description should use ExpandableText:
  - maxChars: 180
  - collapsedLines: 4
- Permission module names should use SafeText truncate or break safely.
- Permission chips should use SafeText mode="truncate" with title.
- Meta row must wrap cleanly on small drawer widths.
- Do not change drawer button grouping.

4. DynamicDetailsDrawer
Files:
- src/app/components/drawers/DynamicDetailsDrawer.tsx
- src/styles/drawers.css

Problem:
Drawer summary and field values can contain very long text, URLs, endpoints, addresses, remarks, reasons, descriptions, emails, etc.

Fix:
- Import SafeText and ExpandableText.
- Summary name:
  - Use SafeText mode="break" or ExpandableText if very long.
  - maxChars: 90
  - collapsedLines: 2
- Summary subtitle:
  - SafeText mode="break"
- Identifier and date/meta:
  - SafeText mode="truncate" with title
- Drawer field value:
  - If key is long-text type, use ExpandableText
  - If key is compact value, use SafeText truncate
  - If status key, keep StatusBadge unchanged

Long-text keys:
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
- endpoint
- api_endpoint
- apiEndpoint
- url
- link
- email

Expandable settings:
- descriptions/remarks/reasons/details: maxChars 180, collapsedLines 4
- endpoints/URLs/emails: maxChars 120, collapsedLines 3, break anywhere
- addresses: maxChars 160, collapsedLines 3

Update CSS:
.drawer-field,
.drawer-summary__main,
.drawer-summary__name,
.drawer-summary__subtitle,
.drawer-field__value {
  min-width: 0;
  max-width: 100%;
}

.drawer-field__value {
  overflow-wrap: anywhere;
}

Do not change grouping logic, auto grouping, summary detection, status badge logic, footer action logic, or ResponsiveOverlay API.

5. Permission List drawer
File:
- src/app/pages/administration-requests/PermissionListPage.tsx

Fix:
- API Endpoint must use DynamicDetailsDrawer long-text behavior.
- Endpoint should show collapsed readable text with See more if long.
- It must not stretch the drawer.
- Do not return to the old broken custom perm-detail layout.
- Do not show Print/Download in Permission List drawer.

6. User Detail Drawer
Files:
- src/app/components/users/UserComponents.tsx
- src/styles/users.css
- src/styles/drawers.css

Problem:
User name, email, designation, role name, level, and role preview can overflow.

Fix:
- ResponsiveOverlay title safety should protect drawer title.
- In drawer rows, wrap values with SafeText:
  - email: SafeText mode="break"
  - user role/designation/level: SafeText mode="truncate" with title
- Role preview already fixed through RolePreviewCard.
- ReAssignRoleModal user name/subtitle should be SafeText truncate.
- Do not change drawer footer actions.
- Do not change tabs behavior.

7. User Form Modal role selection preview
File:
- src/app/components/users/UserFormModal.tsx

Fix:
- Selected role description should use ExpandableText maxChars 120 collapsedLines 3.
- Selected role level and permissions count should use SafeText truncate.
- Do not change form validation, save behavior, or role selection behavior.

8. AppModal
Files:
- src/app/components/modals/AppModal.tsx
- src/styles/modals.css

Problem:
Modal title safety exists but modal header leading container may still need min-width handling.

Fix:
- Keep title ellipsis.
- Add title attribute to modal title.
- Ensure .app-modal-header__leading has min-width: 0 and flex: 1.
- Ensure .app-modal-header__title has min-width: 0 and max-width: 100%.
- Do not change modal sizing or footer behavior.

9. ResponsiveOverlay
Files:
- src/app/components/shared/ResponsiveOverlay.tsx
- src/styles/responsive-overlay.css

Problem:
Drawer title can be too long.

Fix:
- Add title attribute to overlay title.
- Use SafeText behavior in title or CSS-based one-line truncation.
- Ensure .responsive-overlay__title:
  - min-width: 0
  - overflow hidden
  - text-overflow ellipsis
  - white-space nowrap
- Header must keep close button visible.
- Do not change drawer open/close, body scroll, footer, focus trap, or portal behavior.

10. Tables
Files:
- src/app/components/tables/CardTable.tsx
- src/styles/tables.css

Do not repeat the previous fixed-width mistake.

Correct table rule:
- Table must be content-first.
- Short columns must stay compact.
- Long columns must truncate only when needed.
- Do not use table-layout: fixed.
- Do not use fixed colgroup widths for every column.
- Use SafeText or existing cell span for text only.

For table cells:
- Long values should truncate with title hover.
- StatusBadge stays unchanged.
- Action buttons stay unchanged.
- Do not add See more inside desktop table cells.
- Full details are available in drawer, not inside table.

Keep:
.card-table__table {
  width: max-content;
  min-width: 100%;
  table-layout: auto;
}

Do not create huge empty column gaps.

11. Mobile cards
Files:
- src/app/components/tables/UnifiedMobileCard.tsx
- src/styles/tables.css

Problem:
Mobile card primary name/meta values can be long.

Fix:
- Primary name: SafeText mode="break" with 2 lines or ExpandableText only if card is not becoming too tall.
- Meta values: SafeText mode="truncate" or mode="break" for email/endpoint/address.
- Do not add View Details button.
- Card click must still open details.
- See more button must stop propagation if used inside card.
- Prefer keeping mobile cards compact.

12. Help drawer, notification dropdown, profile dropdown, navigation
Files to inspect:
- src/app/components/help/HelpDrawer.tsx
- src/app/components/dropdowns/NotificationDropdown.tsx
- src/app/components/dropdowns/UserProfileDropdown.tsx
- src/app/components/navigation/*.tsx
- src/styles/help.css
- src/styles/dropdowns.css
- src/styles/navigation.css
- src/styles/mobile-navigation.css

Fix only if needed:
- Titles should truncate.
- Descriptions should wrap safely.
- Long user names/emails should not break dropdowns.
- Navigation labels should stay one-line truncated.
- Do not redesign navigation/dropdowns/help.

13. Forms and input validation
Long text safety should also start at input level.

For user-entered fields:
- Role Name: maxLength 80
- Role Description: maxLength 300
- Permission Name: maxLength 80
- Permission endpoint/API URL: maxLength 300
- User name: maxLength 80
- Designation: maxLength 80
- Email: maxLength 120
- Remarks/Reason/Description fields: maxLength 300 or 500 depending on field type

Do not add heavy validation libraries.
Do not change backend/API types.
Use existing form components if they support maxLength. If AppTextField/AppTextArea do not support inputProps/maxLength, extend them safely without breaking existing usage.

14. System-wide CSS safety
Add these general safety rules carefully:

Any card/detail/modal/drawer/table text container should have:
- min-width: 0
- max-width: 100%

Long text containers should use:
- overflow-wrap: anywhere
- word-break: break-word

One-line compact labels should use:
- overflow hidden
- text-overflow ellipsis
- white-space nowrap

Do not apply overflow hidden globally to everything. Apply to known text containers only.

High-risk selectors to audit:
- .table-page__title
- .table-page__desc
- .table-card__title
- .table-card__count
- .stat-card__label
- .stat-card__value
- .drawer-summary__name
- .drawer-field__value
- .detail-row__val
- .role-details-drawer__desc
- .permission-chip
- .permission-module-card__title
- .role-preview-card__name
- .role-preview-card__description
- .crm-review__summary-value
- .mobile-table-card__name
- .mobile-table-card__meta-value
- .app-modal-header__title
- .responsive-overlay__title
- .account-dropdown__name
- .notification-dropdown item text
- help drawer titles/descriptions

Golden rules:
1. Do not break solved features.
2. Do not redesign the app.
3. Do not change routes, APIs, hooks, registries, mock data, or navigation.
4. Do not change drawer action grouping.
5. Do not change mobile card click behavior.
6. Do not add View Details buttons to mobile cards.
7. Do not remove table columns.
8. Do not hide data permanently.
9. Use See more/See less for readable long text in detail areas.
10. Use truncation for compact table/list/card UI.
11. Use title hover for truncated desktop table text.
12. Do not use fixed-width table layout.
13. Do not create wide empty table columns.
14. Do not apply random global overflow hidden that hides important content.
15. Use min-width: 0 on grid/flex children that contain text.
16. Long URLs/endpoints must not stretch drawers, cards, or tables.
17. Keep EN/BN translation parity.
18. Keep theme switching.
19. Keep font and font-size switching.
20. Keep desktop and mobile working.
21. No TypeScript errors.
22. No unused imports.
23. No console errors.
24. Build must pass.

Acceptance criteria:
1. Create New Role modal no longer breaks when Role Name or Description is very long.
2. Final Review summary does not overlap columns.
3. Long Role Name and Description show collapsed text with See more / See less.
4. Role Preview Card does not expand or break with long role text.
5. Role Details drawer does not break with long description, role name, module name, or permission chip text.
6. DynamicDetailsDrawer handles long descriptions, remarks, reasons, addresses, emails, endpoints, URLs, and summaries.
7. Permission List drawer handles long API endpoints cleanly.
8. User Details drawer handles long user names, emails, roles, designations, and preview descriptions.
9. AppModal title remains safe.
10. ResponsiveOverlay drawer title remains safe and close button stays visible.
11. Desktop tables keep dynamic width and do not create large empty spaces.
12. Long table text truncates only when needed.
13. Mobile cards stay compact and clickable.
14. See more / See less does not trigger parent row/card click.
15. EN and BN labels work.
16. No layout overflow on desktop, tablet, or mobile.
17. Test with:
   - 200-character role name
   - 800-character description
   - very long API endpoint URL
   - very long email
   - very long address
   - very long permission name
   - Bangla long text
   - continuous text without spaces
18. Build passes successfully.

Final validation:
Manually test these screens:
- Role Management table
- Create New Role modal Step 1, Step 2, Step 3
- Role Details drawer
- Permission List table
- Permission List details drawer
- User Management table
- User Details drawer
- Reassign Role modal
- User Form modal
- Special Registration detail drawer
- Mobile card views
- Mobile drawers/bottom sheets
- Help drawer
- User profile dropdown

Deliver a short report after implementation:
- New shared components added
- Files updated
- Long-text areas protected
- Areas intentionally not changed
- Desktop validation result
- Mobile validation result
- Build result