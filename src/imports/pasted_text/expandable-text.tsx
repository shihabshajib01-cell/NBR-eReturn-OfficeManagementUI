You are working on the NBR eReturn Office Management UI project.

Task:
Run a full system long-text safety audit and implement one reusable display-only long-text solution across the project.

Current confirmed bug:
When a user enters very long text in Create New Role, the Final Review step breaks. The role name and description overflow vertically, collide with the modal layout, and make the content unreadable.

This is not only a Role modal problem. Long text can also break:
- desktop tables
- mobile cards
- detail drawers
- modal headers
- role preview cards
- permission chips
- key-value detail rows
- generated record details drawers

Important concept:
Do NOT restrict user input.
Do NOT truncate inside input fields.
Do NOT add maxLength to AppTextField or AppTextArea.
Users must be able to type and view long text normally while editing.

Only protect VIEW MODE / DISPLAY MODE.

Best solution:
Create a reusable “See more / See less” text component for display-only long text, then use it across all view-only areas.

Target files to inspect:
- src/app/components/roles/CreateEditRoleModal.tsx
- src/app/components/roles/RolePreviewCard.tsx
- src/app/pages/administration-requests/RoleManagementPage.tsx
- src/app/pages/administration-requests/PermissionListPage.tsx
- src/app/components/drawers/DynamicDetailsDrawer.tsx
- src/app/components/tables/CardTable.tsx
- src/app/components/tables/UnifiedMobileCard.tsx
- src/app/components/users/UserComponents.tsx
- src/app/components/modals/AppModal.tsx
- src/app/components/shared/ResponsiveOverlay.tsx
- src/styles/roles.css
- src/styles/drawers.css
- src/styles/tables.css
- src/styles/modals.css
- src/styles/responsive-overlay.css

Step 1: Add reusable display component

Create:
src/app/components/shared/ExpandableText.tsx

Purpose:
Reusable display-only long-text guard.

Component behavior:
- Accept text/value as unknown and safely convert to string.
- If text is empty, render fallback “—”.
- If text length is below threshold, render normal text.
- If text is long, show collapsed version first.
- Collapsed version should use character limit and/or line clamp.
- Show “See more” button after collapsed long text.
- When expanded, show full text with “See less”.
- Preserve normal word wrapping.
- Break very long unbroken strings safely.
- Must not cause horizontal overflow.
- Must be keyboard accessible.
- Must not be used inside input fields.
- Must not mutate the original value.
- Must support title attribute with full text when collapsed.

Suggested props:
- value: unknown
- fallback?: string
- collapsedChars?: number
- maxLines?: number
- className?: string
- textClassName?: string
- buttonClassName?: string
- expandLabel?: string
- collapseLabel?: string
- inline?: boolean
- preserveLineBreaks?: boolean
- disableToggle?: boolean

Default behavior:
- collapsedChars: 180
- maxLines: 3
- expandLabel: “See more”
- collapseLabel: “See less”
- fallback: “—”

Implementation rules:
- Use React useState.
- Do not use dangerouslySetInnerHTML.
- Do not add external libraries.
- Use normal button element for See more / See less.
- Button must have type="button".
- Button click must not trigger parent row/card click. Use e.stopPropagation().
- Add title={fullText} when collapsed.
- Do not show See more if text does not exceed threshold.

Step 2: Add shared CSS

Add to src/styles/typography.css or src/styles/globals.css if the project already keeps shared text utilities there. If not, add to src/styles/drawers.css and import-safe global styles.

Required classes:
- .expandable-text
- .expandable-text__content
- .expandable-text__content--collapsed
- .expandable-text__content--expanded
- .expandable-text__toggle

CSS requirements:
- max-width: 100%
- min-width: 0
- overflow-wrap: anywhere
- word-break: break-word
- line-height: 1.45
- collapsed state uses line-clamp if supported:
  display: -webkit-box
  -webkit-line-clamp: var(--expandable-lines, 3)
  -webkit-box-orient: vertical
  overflow: hidden
- expanded state:
  white-space: pre-wrap only when preserveLineBreaks is true
  overflow visible
- toggle button:
  small
  primary color
  no heavy border
  no layout jump
  margin-top: 4px
  accessible focus-visible style

Do not change global typography scale.
Do not change theme variables.
Do not break font-size switching.

Step 3: Fix Create New Role modal final review

File:
src/app/components/roles/CreateEditRoleModal.tsx

Current broken area:
Step 3 Final Review:
- .crm-review__summary-value renders role name directly
- .crm-review__summary-value--desc renders description directly
- permission labels render directly

Required fix:
Use ExpandableText only in Step 3 display fields.

Role Name:
- Use ExpandableText
- collapsedChars around 120
- maxLines 3

Description:
- Use ExpandableText
- collapsedChars around 180
- maxLines 4
- preserveLineBreaks true

Permission labels:
- For each permission row/chip, do not show unlimited text.
- Use one-line truncation with title, not See more inside every small chip.
- Long permission labels must not stretch the module card.

Do not change:
- Step 1 input fields
- Step 2 permission selection
- selectedPermIds logic
- role save logic
- modal footer
- stepper behavior
- translations
- create/edit role API/data logic

Step 4: Fix RolePreviewCard

File:
src/app/components/roles/RolePreviewCard.tsx

Use ExpandableText for:
- role-preview-card__name
- role-preview-card__description

Rules:
- Name collapsedChars: 80, maxLines: 2
- Description collapsedChars: 140, maxLines: 3
- In compact preview areas, See more is allowed only if it does not break layout.
- If the preview is inside a narrow column, keep the card readable and scrollable.

Also protect:
- role-preview-module__name
- role-preview-module__count

Module names should truncate one line with title, not expand.

Step 5: Fix Role detail drawer

File:
src/app/pages/administration-requests/RoleManagementPage.tsx

Current issue:
Role detail drawer title uses selectedRole.name directly. Very long role names can make the drawer header unusable.

Required fix:
- Change drawer title to stable text:
  “Role Details”
  or existing translation if available.
- Show selected role name inside the drawer body summary area.
- Use ExpandableText for selectedRole.name.
- Use ExpandableText for selectedRole.description.
- Permission chip labels should truncate safely with title.
- Module names should truncate safely with title.

Do not change:
- edit button handler
- duplicate button handler
- delete handler
- footer action grouping
- permission selection data
- drawer open/close logic

Also check the table toolbar:
If RoleManagementPage still has duplicate:
<h2 className="table-card__title">...</h2>
<h2 className="table-card__title">...</h2>
remove the duplicate only. Do not change toolbar design.

Step 6: Fix DynamicDetailsDrawer globally

File:
src/app/components/drawers/DynamicDetailsDrawer.tsx

This is the central detail drawer for generated pages.

Use ExpandableText for:
- drawer-summary__name
- drawer-summary__subtitle
- drawer-summary__id value
- drawer-summary__meta value
- drawer-field__value when not StatusBadge

Rules:
- Summary name: collapsedChars 120, maxLines 3
- Subtitle: collapsedChars 140, maxLines 2
- ID/meta: collapsedChars 100, maxLines 2
- Normal field values: collapsedChars 160, maxLines 3
- Wide field values like description, remarks, address, reason, summary, activity_summary, endpoint, url:
  collapsedChars 220, maxLines 4
  preserveLineBreaks true where appropriate

Update wide-key detection:
WIDE_KEY_PATTERNS must include:
- description
- remarks
- notes
- address
- reason
- message
- details
- summary
- activity_summary
- endpoint
- api_endpoint
- url
- email

Do not use ExpandableText for:
- StatusBadge
- empty values
- action buttons

Do not change:
- grouping logic
- summary logic
- footer actions
- showActions logic
- default Print/Export logic
- ResponsiveOverlay behavior

Step 7: Fix User detail drawer

File:
src/app/components/users/UserComponents.tsx

Use ExpandableText or safe text wrappers for view-only values:
- user name in drawer title should not break header
- designation
- email
- phone
- role
- level
- last active
- role preview description

For detail-row values:
- Use ExpandableText for values that can be long.
- Keep labels stable.
- Do not break the two-column key-value layout.
- Long email or unbroken text must wrap safely without pushing the drawer width.

Do not change:
- user edit
- reset password
- activate/deactivate
- reassign
- export disabled behavior
- print
- delete
- tabs
- role assignment modal logic

Step 8: Fix CardTable correctly

File:
src/app/components/tables/CardTable.tsx
File:
src/styles/tables.css

Important:
Tables should NOT use See more / See less.
Tables need compact truncation only.

Correct desktop table behavior:
- Do not use fixed table-layout.
- Do not force all columns to fixed widths.
- Do not use colgroup fixed widths.
- Do not create large empty columns.
- Long values truncate with ellipsis.
- Full value is available by title hover.
- Short columns remain compact.
- Actions column remains visible.

Keep:
.card-table__table {
  width: max-content;
  min-width: 100%;
  table-layout: auto;
}

For cell values:
- Wrap text with .card-table__cell-text
- Use title full value
- StatusBadge not wrapped
- Action buttons not wrapped

Cell text CSS:
- max-width based on semantic class
- compact max-width around 96px
- normal max-width around min(22vw, 260px)
- long max-width around min(38vw, 520px)
- overflow hidden
- text-overflow ellipsis
- white-space nowrap

Make sure:
- Permission List API endpoint truncates
- Method / Status / Type / Access stay compact
- No huge empty spaces
- No unnecessary horizontal scroll

Do not touch mobile card layout here.

Step 9: Fix UnifiedMobileCard safely

File:
src/app/components/tables/UnifiedMobileCard.tsx
File:
src/styles/tables.css

Mobile cards should not show See more buttons in the list.
Mobile card list must stay compact.

Use safe truncation:
- primary name: 2-line clamp
- meta value: 1-line or 2-line clamp depending on available space
- date/amount footer: 1-line truncation
- title attribute with full value

Do not add “View Details” button.
Do not change card click behavior.
Do not change mobile card mapping.
Details still open by tapping the card.

Step 10: Fix modal and overlay headers globally

Files:
- src/styles/modals.css
- src/styles/responsive-overlay.css
- src/app/components/modals/AppModal.tsx
- src/app/components/shared/ResponsiveOverlay.tsx

Header titles must never stretch or wrap into a broken layout.

Ensure:
.app-modal-header__leading {
  min-width: 0;
}

.app-modal-header__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.responsive-overlay__header {
  min-width: 0;
}

.responsive-overlay__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

Do not add See more in modal/drawer headers.
Headers should use ellipsis only.
Full details should appear inside body using ExpandableText.

Step 11: Fix CSS for existing long-text containers

Update these classes safely:

roles.css:
- .crm-review__summary-item
- .crm-review__summary-value
- .crm-review__summary-value--desc
- .crm-review__module-name
- .crm-review__perm-row
- .permission-chip
- .role-preview-card__name
- .role-preview-card__description
- .role-preview-module__name
- .role-details-drawer__desc

Add:
min-width: 0;
max-width: 100%;
overflow-wrap: anywhere;
word-break: break-word;

For chip/compact labels:
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;

drawers.css:
- .drawer-summary__main
- .drawer-summary__name
- .drawer-summary__subtitle
- .drawer-summary__id
- .drawer-summary__meta
- .drawer-field
- .drawer-field__value
- .detail-row
- .detail-row__val

Add safe min-width and wrapping.

tables.css:
- keep table cells compact
- protect mobile cards
- no See more in table/list views

Step 12: Search project for unsafe direct text rendering

Run a full search for risky display patterns:
- String(rowData[
- String(row[
- selectedRole.name
- selectedRole.description
- roleDescription
- roleName
- user.name
- user.email
- description}
- remarks}
- endpoint}
- address}
- message}
- details}
- .detail-row__val
- .drawer-field__value
- .crm-review__summary-value
- .role-preview-card
- .mobile-table-card
- .permission-chip

For every display-only location:
- Use ExpandableText for long readable content.
- Use truncation with title for table/list/chip/compact content.
- Do nothing inside input fields.

Step 13: Add translations

Add to:
src/app/locales/en/common.json
src/app/locales/bn/common.json

Keys:
- actions.seeMore
- actions.seeLess

English:
- See more
- See less

Bangla:
Use professional UI translation:
- আরও দেখুন
- কম দেখুন

Use existing action namespace if common actions already exists. Do not create duplicate keys if they already exist.

Step 14: Tests

Update/add tests:
- src/test/DynamicDetailsDrawer.test.tsx
- src/test/ResponsiveTable.test.tsx
- add a small ExpandableText test if test setup supports it

Test cases:
1. ExpandableText renders short text without See more.
2. ExpandableText renders long text with See more.
3. Clicking See more shows full text and See less.
4. Clicking See less collapses again.
5. DynamicDetailsDrawer does not overflow with long description.
6. CardTable renders long endpoint with title and truncation class.
7. Mobile card still opens by card click and has no View Details button.

Golden rules:
1. Do not break solved features.
2. Do not limit user input.
3. Do not add maxLength to input fields.
4. Do not truncate inside edit/create input fields.
5. Apply long-text protection only in view/display mode.
6. Do not redesign the UI.
7. Do not change modal/footer/button behavior.
8. Do not change APIs, hooks, registries, mock data, routes, language system, theme system, or project structure.
9. Do not change mobile card click behavior.
10. Do not add View Details buttons to mobile cards.
11. Do not use See more inside desktop tables.
12. Do not use See more inside mobile list cards.
13. Use See more only in readable detail/view areas.
14. Use ellipsis in headers, tables, chips, compact labels, and cards.
15. Keep English/Bangla parity.
16. Keep theme, font, and font-size switching working.
17. Keep desktop and mobile both working.
18. No TypeScript errors.
19. No unused imports.
20. No console errors.

Acceptance criteria:
1. Create New Role modal no longer breaks when role name has 1000+ characters.
2. Create New Role modal no longer breaks when description has 3000+ characters.
3. Step 1 input fields still allow long text normally.
4. Step 3 Final Review shows collapsed long text with See more / See less.
5. RolePreviewCard stays readable with long role name and description.
6. Role detail drawer does not use long role name as broken header text.
7. Role detail drawer body shows long role name/description safely.
8. DynamicDetailsDrawer handles long endpoint, description, remarks, address, reason, and message safely.
9. User detail drawer handles long user name/email/role/designation safely.
10. Desktop tables truncate long values without creating huge empty columns.
11. Mobile cards remain compact and unchanged in behavior.
12. Headers use ellipsis and never break layout.
13. Permission chips and role permission labels do not stretch their containers.
14. Full long text is available in detail/view areas through See more.
15. Full table/list values are available through title hover.
16. No horizontal overflow caused by long unbroken strings.
17. No vertical layout collision in modal body.
18. Role Management, Permission List, User Management, Special Registration, and generated module pages still work.
19. Build passes.
20. Tests pass.