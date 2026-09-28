You are working on the NBR eReturn Office Management UI project, version 36.

Task:
Fix the remaining long-text issues across detail drawers, especially User Management detail drawer. Also fix the broken drawer title showing `details.userDetails`.

Before changing code:
Audit the related files first:
- src/app/components/users/UserComponents.tsx
- src/app/components/shared/SafeText.tsx
- src/app/components/shared/ResponsiveOverlay.tsx
- src/app/components/drawers/DynamicDetailsDrawer.tsx
- src/app/pages/administration-requests/RoleManagementPage.tsx
- src/styles/drawers.css
- src/styles/responsive-overlay.css
- src/styles/globals.css
- src/styles/roles.css
- src/styles/tables.css
- src/app/locales/en/user.json
- src/app/locales/bn/user.json
- src/app/locales/en/drawers.json
- src/app/locales/bn/drawers.json

Current confirmed issues:
1. User detail drawer title shows `details.userDetails`.
2. UserComponents.tsx is using the wrong translation key:
   title={translate("details.userDetails") || "User Details"}
3. This fallback does not work because i18next returns the key string when the key is missing.
4. Correct key inside user.json is:
   details.title
5. User detail rows break when a value is very long.
6. Long values are squeezed into the right column.
7. Long values should not be shown inside a cramped label/value row.
8. Detail drawers should never show horizontal scroll because of long text.
9. Tables should keep ellipsis only. Do not add See more to tables.

Required fix 1: Fix User drawer title

File:
src/app/components/users/UserComponents.tsx

Replace:
title={translate("details.userDetails") || "User Details"}

With:
title={translate("details.title", { defaultValue: "User Details" })}

Also fix close label safely:
closeLabel={translate("details.closeDetails", { defaultValue: "Close user details" })}

Do not use `t(key) || fallback` anywhere for translations. Use i18next defaultValue.

Search and fix similar risky fallback patterns:
- `translate("...") || "..."`
- `tr("...") || "..."`
- `tc("...") || "..."`
Only fix obvious title/label fallback bugs. Do not rewrite the full translation system.

Required fix 2: Add dynamic detail row rendering in UserComponents

File:
src/app/components/users/UserComponents.tsx

Create a helper inside UserDetailDrawer:

- getText(value): string
- isLongDetailValue(value): boolean
  - true if string length > 60
  - true if text contains long unbroken strings over 28 characters
  - true if value contains URL-like text
  - true if value contains long prompt/test text

Create renderDetailRow(label, value, options?)

Behavior:
- For normal values:
  use normal `.detail-row`
  label left
  value right
  SafeText mode="break"
- For long values:
  use `.detail-row detail-row--long`
  label on top
  value full width below
  use ExpandableText
  maxChars: 120
  collapsedLines: 3
  mode="block"

Important:
Use ExpandableText only when value is actually long.
Do not force every row into See more mode.
Do not show See more for short values.

Example behavior:
- Employee ID: normal row if `EMP-001`
- Employee ID: full-width expandable row if user enters 500+ characters
- Email: normal row if short
- Email: safe wrapped/full row if long or unbroken
- Role/Level: normal unless long

Required fix 3: Update User detail drawer body

File:
src/app/components/users/UserComponents.tsx

In Personal Information tab, replace manual map rendering with renderDetailRow.

Fields:
- Employee ID
- Email
- Phone
- Circle
- Zone
- Last Active

In Role & Access tab, replace manual map rendering with renderDetailRow.

Fields:
- Role
- Level
- 2FA Enabled

Use stable labels from existing user namespace.

Do not change:
- tabs
- activeTab state
- edit button
- reset password button
- deactivate button
- reassign button
- download button
- print button
- delete button
- footer layout
- user data shape
- role preview tab
- reassign modal logic

Required fix 4: Fix User drawer header card

File:
src/app/components/users/UserComponents.tsx

Header card should show:
- Avatar
- User name
- Designation
- Status

For user name:
- Use ExpandableText only if long
- maxChars around 70
- collapsedLines 2
- mode block
- keep text left aligned
- do not let it center or push the avatar

Designation:
- Use SafeText mode break
- keep it left aligned
- no See more unless it is extremely long

CSS must keep the header card readable:
- avatar must not shrink
- text area must have min-width: 0
- no horizontal overflow

Required fix 5: Fix detail row CSS

File:
src/styles/drawers.css

Update detail row CSS:

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

.detail-row__val .safe-text,
.detail-row__val .expandable-text {
  max-width: 100%;
}

.detail-row--long {
  grid-template-columns: minmax(0, 1fr);
  gap: 6px;
}

.detail-row--long .detail-row__key {
  max-width: 100%;
}

.detail-row--long .detail-row__val {
  text-align: left;
  width: 100%;
}

.detail-row--long .expandable-text {
  width: 100%;
}

@media (max-width: 420px) {
  .detail-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }

  .detail-row__key,
  .detail-row__val {
    text-align: left;
    max-width: 100%;
  }
}

Required fix 6: Strengthen drawer overflow protection

Files:
- src/styles/responsive-overlay.css
- src/styles/drawers.css

Make sure drawer panel/body never creates horizontal scroll from text:

.responsive-overlay {
  min-width: 0;
  overflow-x: hidden;
}

.responsive-overlay__body {
  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;
}

.user-detail-drawer,
.user-detail-drawer__header,
.user-detail-drawer__content,
.detail-section,
.detail-row,
.detail-row__val {
  min-width: 0;
  max-width: 100%;
}

Do not remove vertical scrolling.
Do not change drawer width.
Do not change sticky footer behavior.

Required fix 7: Fix SafeText / ExpandableText if needed

File:
src/app/components/shared/SafeText.tsx
File:
src/styles/globals.css

SafeText and ExpandableText must support layout-safe rendering.

Rules:
- SafeText with mode="break" must allow long unbroken strings to wrap.
- ExpandableText expanded state must still wrap.
- Neither component may create horizontal overflow.
- Toggle button click must stop parent row/card click.
- Toggle button must be type="button".

CSS must include:
- min-width: 0
- max-width: 100%
- overflow-wrap: anywhere
- word-break: break-word

Do not use dangerouslySetInnerHTML.
Do not add external packages.

Required fix 8: Audit other detail drawers

Files:
- src/app/components/drawers/DynamicDetailsDrawer.tsx
- src/app/pages/administration-requests/RoleManagementPage.tsx
- src/app/pages/administration-requests/PermissionListPage.tsx

Check:
- drawer title must be stable and translated correctly
- long title content should not be used as drawer header title
- long record names should appear inside body using ExpandableText
- long descriptions/endpoints/remarks/address/reason/message should use ExpandableText
- long chips should use ellipsis with title
- no detail drawer should show horizontal scroll because of text

Do not add See more inside:
- drawer title
- table cells
- action buttons
- chips
- status badges
- mobile cards

Required fix 9: Keep table behavior separate

Files:
- src/app/components/tables/CardTable.tsx
- src/styles/tables.css

Do not redo the table system again unless broken.

Table rules:
- tables use ellipsis only
- no See more in tables
- long values use title hover
- no fixed colgroup widths
- no table-layout fixed
- no huge empty columns
- short columns stay compact
- actions column stays visible

Golden rules:
1. Do not break solved features.
2. Do not redesign the UI.
3. Do not restrict user input.
4. Do not add maxLength to form fields.
5. Do not truncate inside create/edit input fields.
6. See more / See less is only for view/detail/preview body content.
7. Use ellipsis for drawer titles, table cells, chips, badges, compact labels, and mobile cards.
8. Fix parent container overflow, not only the text component.
9. Do not change APIs, hooks, routes, registries, mock data, theme system, or project structure.
10. Keep EN/BN translation parity.
11. Keep theme, font, and font-size switching working.
12. Keep mobile and desktop both working.
13. Keep all existing button handlers unchanged.
14. Do not add View Details buttons to mobile cards.
15. No TypeScript errors.
16. No unused imports.
17. No console errors.

Acceptance criteria:
1. User detail drawer title shows “User Details”, not `details.userDetails`.
2. Bangla drawer title also works.
3. Long user name does not break the drawer header card.
4. Long Employee ID does not squeeze into the right column.
5. Long detail values automatically become full-width rows.
6. Long detail values show See more / See less only when needed.
7. Normal values stay in normal compact label/value rows.
8. User detail drawer has no horizontal scroll.
9. Role detail drawer has no horizontal scroll.
10. Permission detail drawer has no horizontal scroll.
11. DynamicDetailsDrawer handles long values safely.
12. Tables still use ellipsis only.
13. Mobile cards still open details by tapping the card.
14. All drawer footer buttons still work.
15. Build passes.