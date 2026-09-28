Create a complete table/list workspace system for the government office management application.

This is not a placeholder screen task.
Do not create empty module pages.
Do not show messages like “This module is part of the application shell.”
Every page listed in this prompt must have real page content with a table/list workspace, filters, actions, pagination, and relevant summary cards.

Use the uploaded PDF/screenshots as the source of truth for:
- page names
- table headers
- grouped table headers
- table column order
- workflow meaning
- filter patterns
- action patterns
- approval/list/report logic

Do not copy the old visual design from the PDF.
Use the PDF only for structure and data logic.
Use the new modern design system for the UI.

Master Golden Rules:
- Each page must feel like part of one continuous process.
- Never break something that is already working.
- Use one unified design system across all pages, modules, and flows.
- Keep icons, font sizes, colors, shadows, spacing, cards, forms, tables, drawers, modals, filters, navigation, breadcrumbs, badges, buttons, and interaction patterns consistent.
- Follow accessibility best practices and WCAG 2.1 AA where possible.
- No clumsy or cluttered UX.
- Every screen must be fully responsive from large desktop to laptop, tablet, and mobile.
- No all-caps text anywhere.
- Every text element must follow the approved responsive typography scale.
- Every reusable item such as tables, forms, buttons, filters, drawers, modals, cards, tabs, accordions, navigation items, badges, pagination, and action menus must look and behave consistently.
- Add, edit, delete, view, approve, reject, print, export, filter, search, pagination, drawer, modal, tooltip, and confirmation actions must follow the same interaction pattern everywhere.
- Build with code-level thinking. Keep every component separate, modular, and editable.
- Changing one component should not break the overall structure.
- Use component variants for default, hover, active, selected, disabled, loading, empty, error, success, and focus states.
- Use design tokens for colors, typography, spacing, radius, shadows, borders, focus rings, and scrollbars.
- Scrollbar design must not use browser default styling. Scrollbar color must change according to the selected theme.
- Reuse existing components and tokens as much as possible.
- Do not invent unnecessary pages or features.
- Do not remove any existing feature.
- Do not create unrelated charts, promotional cards, or decorative content.

Approved App Shell:
Keep the existing app shell:
- first-layer navigation
- second-layer navigation where applicable
- top bar
- global search
- assessment year dropdown
- notification and utility icons
- user profile area
- appearance settings panel
- theme selector
- font selector
- font size selector

Approved Main Navigation:
Keep these 7 main navigation items:
- Dashboard
- Report
- Return Register
- Register & Stock
- PSR & Verification
- Case & Financial Management
- Administration & Requests

Do not rename these main navigation items.
Do not remove any main navigation item.

Approved Breadcrumb Rule:
Keep the existing breadcrumb style exactly as shown in the current system.

Breadcrumb pattern:
Home › Module › Current Page

Examples:
- Home › Report › Report Workspace
- Home › Dashboard › PSR Dashboard
- Home › Return Register › Return Register › Online Return Register
- Home › Register & Stock › Register-4 › List
- Home › PSR & Verification › PSR Approval

Breadcrumb rules:
- Keep breadcrumbs below the top bar and above the page title.
- Use the existing visual style.
- Use small chevron separators.
- Previous breadcrumb levels should be lighter.
- Current page should be stronger/bold.
- Do not redesign breadcrumbs.
- Do not move breadcrumbs into the sidebar.
- Do not remove breadcrumbs from any page.
- Do not replace breadcrumbs with tabs.

Approved Table Page Pattern:
Every table/list page must follow this structure:

1. Breadcrumb
2. Page header
3. Page title
4. Short page description
5. Search field on the right
6. Export button
7. Filter button
8. Summary cards, when useful
9. Applied filter summary card, only after filters are applied
10. Table/list workspace
11. Pagination
12. Row actions
13. Detail drawer for row-level details

Use the table-page style from the provided reference:
- light grey page background
- white rounded cards
- soft borders
- card-style table rows
- clean table header row
- sortable column labels
- spacious row design
- no heavy grid borders
- modern list-table style
- subtle spacing between rows
- theme-aware action color
- clean filter panel

Do not leave any listed page blank.

Standard Table Page Components:
Create reusable components:
- PageHeader
- Breadcrumb
- PageActionBar
- SearchField
- ExportButton
- FilterButton
- SummaryCard
- AppliedFilterSummary
- FilterPanel
- FilterSection
- FilterChip
- DataTable
- CardTableRow
- TableHeader
- GroupedTableHeader
- TableCell
- TableActionCell
- SortIcon
- StatusBadge
- Pagination
- DetailDrawer
- ConfirmationModal
- EmptyState
- LoadingState
- ErrorState
- ThemeAwareScrollbar

Table Visual Style:
- Use card-style rows instead of old heavy grid tables.
- Header row can be a separate white rounded container.
- Rows should be white cards with subtle gap.
- Keep enough space for multi-line cell content.
- Use soft row hover.
- Use selected row state where needed.
- Use sticky headers for long tables.
- Use horizontal scroll for wide tables.
- Use theme-aware scrollbar.
- Use readable typography and no all-caps text.

Table Behavior:
Every table/list page should support:
- search
- filter
- export
- print where relevant
- row actions
- detail drawer
- pagination
- total record count
- sorting where useful
- applied filter chips after filtering

Action Pattern:
Use consistent action patterns:
- View opens right-side detail drawer.
- Add/Create/Entry opens modal.
- Edit opens modal.
- Approve/Reject opens confirmation modal.
- Delete opens confirmation modal.
- Export uses button.
- Filter opens filter panel/drawer.
- Clear Result clears applied filters.

Do not make Add/Create/Entry items sidebar navigation items.

Filter Panel Pattern:
Use the reference filter design.

Filter panel should support:
- quick time presets where relevant
- filter by assessment year
- filter by zone
- filter by circle
- filter by status
- filter by date range
- filter by type
- filter by TIN or user where relevant
- reset filter
- apply filter

Filter panel desktop behavior:
- opens as an expanded card or drawer below the page header/table toolbar

Mobile behavior:
- opens as full-screen sheet or bottom sheet

Applied Filter Summary:
After filter is applied, show a card:
“Now showing filtered results based on following(s)”

Show selected filters as chips:
- AY 2024-25
- Circle-1
- Pending
- Date range
- Status
- Clear Result

Report Page Exception:
For the Report page only:
- Do not show second-layer navigation.
- Available Reports cards act as the report navigation.
- Report Workspace has one page with 3 states:
  1. Empty state
  2. Selected report with filters and table
  3. Detail drawer open

Report Workspace page title:
Report Workspace

Subtitle:
Select a report to configure filters and view results for AY 2024-25.

Available Reports:
- Offline Return Report
- Tax Category Report
- Express Cert. Disposal
- User Activity Report
- Litigation Arrear
- Litigation Writ Case
- Litigation Dept Case
- Litigation Taxpayer Case
- Appeal Report
- Tribunal Report
- Payment & Demand Report
- Register-5 Report

When no report is selected:
Show empty state:
“Select a report to view details”
“Choose any report from above to load filters and results here.”

When a report is selected:
Show:
- report title
- summary cards
- search/export/filter actions
- filter panel
- applied filter chips if active
- table/list workspace
- pagination
- detail drawer on row view

Use PDF table headers exactly for report tables where visible.

PDF-Based Report Tables:
Use the uploaded PDF/screenshots as source of truth.

Offline Return Report:
Use exact grouped table headers from PDF.
Visible structure includes:
- Circle
- Return Entry Today
- Return Entry Upto
Sub-columns include:
- 82BB
- 82C(2)
- 212
- Normal
- Total Entry
- Tax Paid With Return (TDS)
- Total Tax Paid

Tax Category Report:
Use exact headers from PDF.
Visible structure includes:
- Submissions
- Online
- Offline
- Total

Express Cert. Disposal:
Use exact grouped headers from PDF.
Visible structure includes:
- Tax Circle
- Today
- Upto
Sub-columns include:
- Pending
- Approved
- Rejected
- Total Request
- Total Disposed

User Activity Report:
Use exact headers from PDF.
Visible columns include:
- Circle
- User ID
- Designation
- User Name
- Email
- Phone
- Last Login
- Last Pass. Change
- Active Status
- Entry Today
- Entry Upto

Litigation Arrear:
Use exact grouped headers from PDF.
Visible structure includes:
- Circle
- Entry Today
- Entry Upto
Sub-columns include:
- Pending
- Approved
- Rejected
- Total Entry
- Total Related Revenue

Litigation Writ Case:
Use exact grouped headers from PDF.
Visible structure includes:
- Circle
- Entry Today
- Entry Upto
Sub-columns include:
- Pending
- Approved
- Rejected
- Total Entry
- Total Related Revenue

Litigation Dept Case:
Use exact grouped headers from PDF.
Visible structure includes:
- Circle
- Entry Today
- Entry Upto
Sub-columns include:
- Pending
- Approved
- Rejected
- Total Entry
- Total Related Revenue

Litigation Taxpayer Case:
Use exact grouped headers from PDF.
Visible structure includes:
- Circle
- Entry Today
- Entry Upto
Sub-columns include:
- Pending
- Approved
- Rejected
- Total Entry
- Total Related Revenue

Appeal Report:
Use exact grouped headers from PDF.
Visible structure includes:
- Circle
- Entry Today
- Entry Upto
Sub-columns include:
- Pending
- Approved
- Rejected
- Total Entry

Tribunal Report:
Use exact grouped headers from PDF.
Visible structure includes:
- Circle
- Entry Today
- Entry Upto
Sub-columns include:
- Pending
- Approved
- Rejected
- Total Entry

Payment & Demand Report:
Use the exact table structure from PDF where visible.
If exact headers are unclear, create editable header labels and add note:
“Needs PDF verification.”

Register-5 Report:
Use exact table structure from PDF where visible.
If exact headers are unclear, create editable header labels and add note:
“Needs PDF verification.”

Page Batch 1: Dashboard

Create real content for:
- Dashboard
- PSR Dashboard
- Double Entry Dashboard

Do not leave these pages empty.

Each dashboard should include:
- breadcrumb
- page title
- short description
- summary cards
- table/list widgets where visible in PDF
- export/filter actions where relevant

Page Batch 2: Return Register

Create real table/list pages for:

Return View Approval:
- approval list table
- filters
- summary cards
- approve/reject/view actions
- detail drawer

Return Register parent:
- do not show an empty placeholder
- show child navigation and default table state if needed

Online Return Register:
- real table/list page
- filters
- summary cards
- row actions
- pagination

Offline Return Register:
- real table/list page
- filters
- summary cards
- row actions
- pagination

Online Archive:
- real archive table/list page
- filters
- download/view actions
- pagination

Page Batch 3: Register & Stock

Create real table/list pages for:

Register-4 > List:
- real table/list page
- Entry Form as primary action button
- Entry Form opens modal
- no separate sidebar item for Entry Form

Stock Register:
- real stock table/list page
- filters
- summary cards
- export/download actions
- pagination

Tax Registry:
- real tax registry table/list page
- search
- filters
- row details
- pagination

Register-5:
- real Register-5 table/list page
- Register-5 Approval as tab/action inside page
- approval actions
- detail drawer

Page Batch 4: PSR & Verification

Create real table/list pages for:

PSR Approval:
- approval queue table
- approve/reject/view actions
- detail drawer

PSR Edit Request:
- edit request table
- request status
- approve/reject/view actions

Double Entry Status:
- status table
- filters
- status badges
- row details

Double Entry Verificaion:
Keep this spelling exactly: Double Entry Verificaion.
- verification table
- verify/view actions

PSR Dormant:
- dormant PSR table
- filters
- row actions

Out of Jurisdiction:
- issue table
- resolve/transfer/view actions

Other Circles Entry:
- other circles entry table
- filters
- transfer/view actions

Misfiled Returns:
- misfiled returns table
- resolve/view actions

Invalid List:
- invalid list table
- filters
- reason/status
- row actions

Approval List:
- approval table
- approve/reject/view actions

Transfer History:
- transfer history table
- from office
- to office
- date
- status
- view details

PSR Entry and PSR Bulk Entry:
- must be page action buttons inside relevant PSR workspace
- do not show as sidebar items
- open as modal or upload modal

Page Batch 5: Case & Financial Management

Create real table/list pages for:

Litigation Management:
Use tabs or segmented control:
- Arrear Approval
- Writ Case Approval
- Dept Case Approval
- Taxpayer Case Approval

Each tab must show a real table with filters, actions, and pagination.

Appeal Register:
- real Appeal Register table
- Appeal Approval as tab/action inside page
- no separate sidebar item for Appeal Approval

Tribunal Register:
- real Tribunal Register table
- Tribunal Approval as tab/action inside page
- no separate sidebar item for Tribunal Approval

Demand And Payment:
- real workspace
- Entry as modal action
- Taxpayer Ledger table/view
- Approval table/action

Refund & Adjustment:
- real table/list page
- approval/adjustment actions
- detail drawer

Page Batch 6: Administration & Requests

Create real table/list pages for:

Certificate Req:
Use tabs:
- Data Entry Request
- Approval Request
- Edit Request
- Disposal History

Each tab must show a real table/list with filters, row actions, and pagination.

User Management:
Use the already approved User Management pattern:
- user table
- Add User modal
- Edit User modal
- Change Role modal
- action menu

Role Management:
Use the already approved Role Management pattern:
- role list
- Create Role modal
- Edit Role modal
- permission accordion with search and select all

Special Registration List:
- real table/list page
- filters
- status
- row actions

Time Extension:
- real table/list page
- request table
- approve/reject actions

Audit Selection:
- real table/list page
- selection table
- filters
- actions

Strict No-Placeholder Rule:
Do not leave any of these pages empty:
- Dashboard
- PSR Dashboard
- Double Entry Dashboard
- Return View Approval
- Online Return Register
- Offline Return Register
- Online Archive
- Register-4 List
- Stock Register
- Tax Registry
- Register-5
- PSR Approval
- PSR Edit Request
- Double Entry Status
- Double Entry Verificaion
- PSR Dormant
- Out of Jurisdiction
- Other Circles Entry
- Misfiled Returns
- Invalid List
- Approval List
- Transfer History
- Litigation Management
- Appeal Register
- Tribunal Register
- Demand And Payment
- Refund & Adjustment
- Certificate Req
- Special Registration List
- Time Extension
- Audit Selection

Every listed page must show a real table/list workspace.

If exact PDF table headers are visible:
Use the exact headers.

If exact headers are unclear:
Use closest visible structure, keep labels editable, and add note:
“Needs PDF verification.”

Sample Data Rule:
Use realistic sample rows only to demonstrate layout.
Do not invent legal or tax rules.
Sample data is only for UI layout.

Theme System:
All pages must respond to the selected Appearance theme:
- Indigo Blue
- Government Blue
- Slate Purple
- Plum Executive
- Fresh Teal

Theme colors should apply to:
- navigation active states
- buttons
- table header accents
- filter chips
- selected rows
- badges
- pagination
- focus rings
- scrollbars

Typography:
Use the existing font selector:
- Poppins
- Noto Sans
- Google Sans

Use the existing font size selector:
- Compact
- Standard
- Large

Font size changes must apply globally.

Responsive Rules:
Large desktop:
- use available width wisely
- avoid blank canvas
- table workspace should feel complete

Desktop:
- filters and table aligned
- summary cards in one row where possible

Tablet:
- filters wrap
- table scrolls horizontally
- drawers overlay

Mobile:
- filters stack
- tables become horizontal scroll or card list
- modals become full screen
- drawer becomes full screen or bottom sheet

Accessibility:
- visible labels for all filters and inputs
- keyboard accessible actions
- visible focus rings
- readable contrast
- tooltips for icon-only actions
- table headers clear
- status badges include readable text
- no color-only meaning

Final Output:
Replace all placeholder module screens with real table/list workspaces using:
1. uploaded PDF/screenshots for table structure and headers,
2. current breadcrumb style exactly as approved,
3. new modern table-page design pattern,
4. existing design system, theme system, typography, responsiveness, accessibility, and golden rules.