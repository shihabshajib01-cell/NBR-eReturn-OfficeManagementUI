You are working on the NBR eReturn Office Management UI project.

Task:
Add a proper dynamic desktop table truncation system for every table, without fixing pages one by one.

Current project structure:
- Desktop tables render through:
  src/app/components/tables/ResponsiveTable.tsx
  src/app/components/tables/CardTable.tsx

- Most pages pass columns through:
  src/app/pages/modulePageUtils.ts
  type FlatCol / ColDef / fc()

- Main table styles are in:
  src/styles/tables.css

Problem:
Long table cell values are breaking table width. Example: Permission List API Endpoint column can show a long Figma URL and pushes other columns/actions away.

Current cause:
- CardTable.tsx renders cell values directly:
  String(row[col.key] ?? "—")
- tables.css uses:
  .card-table__td { white-space: nowrap; }
- There is no reusable truncation wrapper, no column width strategy, and no responsive desktop sizing.

Required solution:
Create a central dynamic truncation system inside CardTable, not page-by-page.

1. Update column type safely
File:
src/app/pages/modulePageUtils.ts

Extend FlatCol with optional sizing metadata:

- size?: "xs" | "sm" | "md" | "lg" | "xl" | "fluid"
- noTruncate?: boolean

Keep existing fields unchanged:
key, label, headerKey, badge, mono, mobileCard

Do not break existing fc() usage. Existing column configs must continue working.

2. Update CardTable rendering
File:
src/app/components/tables/CardTable.tsx

Add a helper to resolve column size.

Suggested logic:
- badge/status columns => xs
- method/type/level/zone/circle/ay/date/count columns => sm
- id/tin/request_no/case_no/reg_no/employeeId => sm or md
- name/label/user/taxpayer/role/service columns => lg
- endpoint/url/api/email/description/remarks/address/reason/particulars/message columns => xl
- fallback => md
- if col.size exists, use it
- if col.noTruncate is true, do not force truncation

Add a <colgroup> before thead:
- one <col> per flat column
- add class based on resolved size:
  card-table__col card-table__col--xs
  card-table__col card-table__col--sm
  card-table__col card-table__col--md
  card-table__col card-table__col--lg
  card-table__col card-table__col--xl
  card-table__col card-table__col--fluid
- add card-table__col--actions when actions exist

Wrap every non-badge cell value with:
<span className="card-table__cell-text" title={fullValue}>
  {displayValue}
</span>

For header labels, wrap text with:
<span className="card-table__th-text" title={headerLabel}>
  {headerLabel}
</span>

Rules:
- StatusBadge must not be truncated.
- Action buttons must not be truncated.
- Empty value “—” can render normally.
- Cell title should show the full value on hover.
- Keep existing row click, keyboard behavior, hover behavior, and action click behavior unchanged.

3. Update table CSS
File:
src/styles/tables.css

Update only CardTable desktop styles.

Required CSS behavior:
- Desktop table should keep all columns visible when possible.
- If text is longer than available column width, truncate with ellipsis.
- If screen/table width is enough, the same text should show fully.
- Do not force truncation when there is no overflow.
- Avoid horizontal overflow caused by long text.
- Actions column must stay visible and aligned.

Add/adjust:

.card-table__table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.card-table__td,
.card-table__th {
  min-width: 0;
  overflow: hidden;
}

.card-table__cell-text,
.card-table__th-text {
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-table__td--no-truncate .card-table__cell-text,
.card-table__th--no-truncate .card-table__th-text {
  overflow: visible;
  text-overflow: clip;
}

Column width classes:
- xs: compact columns like status/method/type/count
- sm: TIN, ID, date, circle, zone
- md: normal text
- lg: name, label, service, role
- xl: endpoint, email, description, remarks
- fluid: flexible fallback

Use responsive desktop widths with clamp(), for example:
- xs: clamp(64px, 6vw, 92px)
- sm: clamp(90px, 8vw, 130px)
- md: clamp(120px, 11vw, 180px)
- lg: clamp(150px, 16vw, 260px)
- xl: clamp(180px, 24vw, 420px)
- actions: clamp(110px, 10vw, 150px)

At wider screens, allow xl/lg columns more space.
At smaller desktop widths, keep compact columns smaller and truncate long text.

Do not change mobile card layout. Mobile cards already have their own truncation rules.

4. Permission List specific check
File:
src/app/pages/administration-requests/PermissionListPage.tsx

Do not redesign the page.

Optional column size overrides:
- label => lg
- groupLabel => md
- endpoint => xl
- method => xs
- serviceName => lg
- accessLabel => sm
- status => xs
- typeLabel => xs

Use the new FlatCol size option only if needed.

The Permission List table must show:
- API Endpoint truncated when too long
- Method, Access, Status, Type still visible
- Actions column still visible
- No broken horizontal push

5. Apply globally
Because Role Management, Permission List, User Management, dashboard tables, and generated module pages all use ResponsiveTable/CardTable, the fix must work globally.

Do not manually add CSS to only Permission List.
Do not create separate table components.
Do not add one-off truncation spans inside page files.

Golden rules:
1. Do not break solved features.
2. Do not redesign the table.
3. Do not touch mobile card behavior.
4. Do not change drawer behavior.
5. Do not change search, filter, pagination, row click, or action click behavior.
6. Do not change routes, APIs, hooks, registries, mock data, language files, or theme files.
7. Do not remove columns.
8. Do not hide the Actions column.
9. Do not use fixed hardcoded widths for only one screen size.
10. Use a reusable dynamic solution.
11. Keep English/Bangla support working.
12. Keep theme, font, and font-size switching working.
13. No TypeScript errors.
14. No unused imports.
15. No console errors.

Acceptance criteria:
1. Permission List API Endpoint no longer stretches the table.
2. Long URLs truncate with ellipsis.
3. Full value is available through title/hover.
4. If the column has enough available width, text shows without ellipsis.
5. Actions column remains visible.
6. Status badges remain readable.
7. Header labels do not break layout.
8. Role Management table still works.
9. User Management table still works.
10. Generated module tables still work.
11. Dashboard tables still work.
12. Mobile card layout is unchanged.
13. No horizontal overflow caused by long text on desktop.
14. Build passes successfully.