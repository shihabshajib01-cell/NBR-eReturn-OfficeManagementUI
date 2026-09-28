You are working on the NBR eReturn Office Management UI project.

Task:
Fix the desktop table truncation system properly. The previous change made the table worse because columns are taking too much empty space. The table is now behaving like fixed-width columns. This is not the required behavior.

Required concept:
Use dynamic, content-first table sizing.

The table should:
1. Let short columns take only the width they need.
2. Let medium columns use natural width.
3. Let long-text columns use available space.
4. Truncate only when the text is longer than the available column space.
5. Never reserve large empty space for short columns.
6. Never stretch Method, Status, Type, Access, Circle, Zone, Count, or Date columns.
7. Keep the Actions column visible and compact.
8. Avoid horizontal scroll unless the table truly cannot fit.

Important:
Do NOT use fixed `colgroup` widths for every column.
Do NOT use `table-layout: fixed`.
Do NOT force columns into equal or clamp-based widths.
Do NOT make every column wide just to support truncation.

Target files:
- src/app/components/tables/CardTable.tsx
- src/app/components/tables/ResponsiveTable.tsx
- src/app/pages/modulePageUtils.ts
- src/styles/tables.css
- src/app/pages/administration-requests/PermissionListPage.tsx only if column metadata is needed

Current problem:
The Permission List table now has too much empty space between columns. The API Endpoint column truncates, but other columns became unnecessarily wide. This creates horizontal scroll and makes the table feel broken.

Correct solution:

1. Revert the bad fixed-width table changes

In src/styles/tables.css:
Remove or undo:
- `table-layout: fixed` from `.card-table__table`
- fixed `colgroup` width behavior if added
- `.card-table__col--xs`
- `.card-table__col--sm`
- `.card-table__col--md`
- `.card-table__col--lg`
- `.card-table__col--xl`
- any clamp width that forces every column to reserve space

The table should return to content-first behavior:

.card-table__table {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

.card-table__wrapper {
  overflow-x: auto;
  max-width: 100%;
}

2. Use truncation wrapper, not fixed column width

In src/app/components/tables/CardTable.tsx:

Wrap each normal text cell value with a span:

<span className={cellTextClass} title={fullValue}>
  {displayValue}
</span>

Do the same for table headers:

<span className="card-table__th-text" title={headerLabel}>
  {headerLabel}
</span>

Do not wrap StatusBadge in truncation.
Do not wrap action buttons in truncation.

3. Add semantic cell classes dynamically

In CardTable.tsx, create a helper based on column key:

Compact columns:
- method
- status
- type
- access
- accessLabel
- typeLabel
- active_status
- approval_status
- count
- users
- roleCount
- permissionCount
- zone
- circle
- ay
- date
- reg_date
- created_at
- updated_at

Class:
card-table__cell-text--compact

Normal columns:
- group
- groupLabel
- service
- serviceName
- role
- level
- name
- label
- taxpayer_name
- permission_name

Class:
card-table__cell-text--normal

Long text columns:
- endpoint
- apiEndpoint
- api_endpoint
- url
- email
- address
- description
- remarks
- reason
- message
- details

Class:
card-table__cell-text--long

Default:
card-table__cell-text--normal

4. CSS behavior

In src/styles/tables.css:

Add:

.card-table__th,
.card-table__td {
  white-space: nowrap;
  vertical-align: middle;
}

.card-table__cell-text,
.card-table__th-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

Compact columns should not reserve extra space:

.card-table__cell-text--compact {
  max-width: 96px;
}

Normal columns should use reasonable width:

.card-table__cell-text--normal {
  max-width: min(22vw, 260px);
}

Long text columns should get more room but not break the table:

.card-table__cell-text--long {
  max-width: min(38vw, 520px);
}

Headers:

.card-table__th-text {
  max-width: inherit;
}

Actions:

.card-table__actions {
  width: 1%;
  white-space: nowrap;
}

.card-table__action-buttons {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

5. Permission List specific expectation

Permission List desktop table should behave like this:

- Permission Name: natural width, no huge empty space
- Group: compact/natural width
- API Endpoint: widest flexible column, truncates only when long
- Method: compact width
- Service: normal width
- Access: compact width
- Status: compact width
- Type: compact width
- Actions: compact width

Do not create a horizontal scrollbar just because short columns are wide.

6. Optional column metadata

If needed, extend FlatCol safely:

src/app/pages/modulePageUtils.ts

Add optional field:

truncate?: "compact" | "normal" | "long" | "none";

Keep all existing usage working.

Then in PermissionListPage.tsx, set:
- Permission Name: normal
- Group: compact or normal
- API Endpoint: long
- Method: compact
- Service: normal
- Access: compact
- Status: compact
- Type: compact

But do not require every page to manually define this. CardTable must still have automatic fallback based on column key.

7. Do not touch mobile

Mobile card layout must remain unchanged.
Do not change UnifiedMobileCard.
Do not change mobile table/card mapping.
Do not add desktop truncation classes to mobile cards.

Golden rules:
1. Do not break solved features.
2. Do not redesign the table.
3. Do not use fixed table layout.
4. Do not use fixed colgroup widths for every column.
5. Do not create large empty table columns.
6. Do not hide columns.
7. Do not remove actions.
8. Do not touch mobile cards.
9. Do not change drawer behavior.
10. Do not change search, filter, pagination, row click, or action click behavior.
11. Do not change routes, APIs, hooks, registries, mock data, language files, or theme files.
12. Keep English/Bangla support working.
13. Keep theme, font, and font-size switching working.
14. No TypeScript errors.
15. No unused imports.
16. No console errors.

Acceptance criteria:
1. Permission List table no longer has large empty gaps between columns.
2. API Endpoint truncates only when needed.
3. Short values like GET, Active, Base, Dashboard do not get oversized columns.
4. Actions column stays visible.
5. No unnecessary horizontal scroll on desktop.
6. Long endpoint/URL values do not push the table outside the page.
7. Full cell value is available through title hover.
8. Role Management table still works.
9. User Management table still works.
10. Generated module tables still work.
11. Dashboard tables still work.
12. Mobile card layout is unchanged.
13. Build passes successfully.