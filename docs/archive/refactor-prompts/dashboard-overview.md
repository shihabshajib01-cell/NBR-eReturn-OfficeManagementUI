Create all module pages with real table/list workspaces based on the uploaded PDF/screenshots.

This is not an app shell task.
This is not a placeholder generation task.
Do not create empty module screens.
Do not show messages like “This module is part of the application shell.”
Every page listed below must have a real table/list UI, filters, actions, pagination, and page-level layout.

Use the uploaded PDF/screenshots as the source of truth for:
- page purpose
- table header names
- grouped table headers
- table column order
- table/list behavior
- filter patterns
- action patterns

Do not copy the old visual design.
Rebuild the pages using the new modern design system.

Golden Rules:
- Each page must feel like part of one continuous process.
- Never break something that is already working.
- Use one unified design system across all pages and flows.
- Keep icons, font sizes, colors, shadows, spacing, cards, forms, tables, drawers, modals, filters, navigation, and interaction patterns consistent.
- Follow accessibility best practices and WCAG 2.1 AA where possible.
- No clumsy or cluttered UX.
- Every screen must be fully responsive from large desktop to laptop, tablet, and mobile.
- No all-caps text anywhere.
- Every text element must follow the approved typography scale.
- Every reusable item such as tables, forms, buttons, filters, drawers, modals, cards, tabs, accordions, navigation items, badges, pagination, and action menus must look and behave consistently.
- Add, edit, delete, view, approve, reject, print, export, filter, search, pagination, drawer, modal, tooltip, and confirmation actions must follow the same interaction pattern everywhere.
- Build with code-level thinking. Keep every component separate, modular, and editable.
- Changing one component should not break the overall structure.
- Use component variants for default, hover, active, selected, disabled, loading, empty, error, success, and focus states.
- Use design tokens for colors, typography, spacing, radius, shadows, borders, focus rings, and scrollbars.
- Scrollbar design must not use browser default styling. Scrollbar color must change according to the selected theme.
- If any table, filter, drawer, or action pattern is created, make it reusable for future pages.
- Do not invent unnecessary pages.
- Do not remove any existing feature.

Important Output Rule:
For every page listed in this prompt, create the actual page content.
Do not create placeholder content.
Do not leave the page empty.
Each page must include:
- page title
- breadcrumb
- filter/search area
- table/list area
- row actions
- pagination
- export/print actions where relevant
- detail drawer behavior where relevant

Design System:
Use the existing system design:
- light background
- white cards/surfaces
- thin borders
- rounded corners
- subtle shadows
- theme-aware colors
- theme-aware scrollbars
- accessible focus states
- responsive layout
- no all-caps text

Theme System:
All tables and pages must support the existing Appearance themes:
- Indigo Blue
- Government Blue
- Slate Purple
- Plum Executive
- Fresh Teal

Typography:
Use existing responsive typography tokens:
- Page title: text-h1
- Section title: text-h2 or text-h3
- Table header: text-table-header
- Table body: text-table-body
- Caption/helper text: text-caption
- Button: text-button
- Badge: text-badge

Navigation Context:
Use the approved main navigation:
- Dashboard
- Report
- Return Register
- Register & Stock
- PSR & Verification
- Case & Financial Management
- Administration & Requests

Report Page Exception:
For Report only:
- Do not show second-layer navigation.
- Available Reports cards act as report navigation.
- Selecting a report loads the related filters and table below.
- Row details open in a right-side drawer.

Reusable Components To Use Everywhere:
Create and reuse these components:
- PageHeader
- Breadcrumb
- FilterPanel
- SearchField
- SelectField
- DateField
- DataTable
- GroupedTableHeader
- TableHeader
- TableRow
- TableCell
- TableActionCell
- StatusBadge
- Pagination
- EmptyState
- LoadingState
- ErrorState
- TableToolbar
- ExportButton
- PrintButton
- ViewDetailsButton
- DetailDrawer
- Modal
- ConfirmationDialog
- ThemeAwareScrollbar

Global Table Pattern:
Each table page must include:
- toolbar with search/filter/export/print when relevant
- table title
- total record count
- sticky table header
- row hover state
- selected row state
- row action icons with tooltips
- pagination
- horizontal scroll for wide tables
- theme-aware scrollbar
- detail drawer for row-level details

Page Batch 1: Dashboard

1. Dashboard
Create dashboard table/summary layout based on the uploaded screenshot/PDF.
Do not leave blank.
Include summary cards and relevant table/list widgets if visible in the PDF.

2. PSR Dashboard
Create PSR Dashboard content based on uploaded screenshot/PDF.
Do not leave blank.
Use summary cards and table/list widgets if visible.

3. Double Entry Dashboard
Create Double Entry Dashboard content based on uploaded screenshot/PDF.
Use the PDF structure for summary data such as submissions, tax payable, tax paid, and related metrics if visible.

Page Batch 2: Report Workspace

Create the Report Workspace with report cards and selected table states.

Report cards:
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
- Register-5 Report

For each report selection, create the actual table state.

Offline Return Report table:
Use exact grouped table headers from the PDF.
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

Tax Category Report table:
Use exact table headers from PDF.
Visible structure includes:
- Submissions
- Online
- Offline
- Total

Express Cert. Disposal table:
Use exact grouped table headers from PDF.
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

User Activity Report table:
Use exact table headers from PDF.
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

Litigation Arrear table:
Use exact grouped table headers from PDF.
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

Litigation Writ Case table:
Use exact grouped table headers from PDF.
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

Litigation Dept Case table:
Use exact grouped table headers from PDF.
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

Litigation Taxpayer Case table:
Use exact grouped table headers from PDF.
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

Appeal Report table:
Use exact grouped table headers from PDF.
Visible structure includes:
- Circle
- Entry Today
- Entry Upto
Sub-columns include:
- Pending
- Approved
- Rejected
- Total Entry

Tribunal Report table:
Use exact grouped table headers from PDF.
Visible structure includes:
- Circle
- Entry Today
- Entry Upto
Sub-columns include:
- Pending
- Approved
- Rejected
- Total Entry

Register-5 Report table:
Use the exact PDF structure where visible.
If the exact header is unclear, create the table with editable header labels and mark the header note as “Needs PDF verification”.
Do not leave blank.

Page Batch 3: Return Register

Create real table pages for:

1. Return View Approval
Table should include:
- filters
- approval list
- row actions
- approve/reject/view/print actions
- detail drawer

2. Return Register
This is a parent item. Do not use it as an empty page.
It must show the child options:
- Online Return Register
- Offline Return Register

3. Online Return Register
Create actual table/list page.
Use PDF/source table headers where visible.
Include filters, table, pagination, and row actions.

4. Offline Return Register
Create actual table/list page.
Use PDF/source table headers where visible.
Include filters, table, pagination, and row actions.

5. Online Archive
Create actual archive table/list page.
Include filters, table, download/view actions, pagination.

Page Batch 4: Register & Stock

Create real table pages for:

1. Register-4 > List
Create actual Register-4 list table.
Include Entry Form as a primary page action button, not sidebar item.
Use modal for Entry Form.
Do not create separate sidebar item for Entry Form.

2. Stock Register
Create actual stock register table/list.
Include filters, table, pagination, export/download.

3. Tax Registry
Create actual tax registry table/list.
Include filters, search, table, pagination, row details.

4. Register-5
Create actual Register-5 table/list.
Include Register-5 Approval as tab/action inside this page, not a separate main sidebar item.
Use table, approval actions, detail drawer.

Page Batch 5: PSR & Verification

Create real table/list pages for:

1. PSR Approval
Create approval queue table.
Include approve/reject/view actions and detail drawer.

2. PSR Edit Request
Create edit request table.
Include request status, view, approve/reject actions.

3. Double Entry Status
Create status table.
Include filters, status badges, row details.

4. Double Entry Verificaion
Keep this spelling exactly: Double Entry Verificaion.
Create verification table.
Include verify/view actions.

5. PSR Dormant
Create dormant PSR table.
Include filters and row actions.

6. Out of Jurisdiction
Create jurisdiction issue table.
Include resolve/transfer/view actions.

7. Other Circles Entry
Create other circles entry table.
Include filters, transfer/view actions.

8. Misfiled Returns
Create misfiled returns table.
Include resolve/view actions.

9. Invalid List
Create invalid list table.
Include filters, reason/status, row actions.

10. Approval List
Create approval list table.
Include approve/reject/view actions.

11. Transfer History
Create transfer history table.
Include from/to office, date, status, view details.

Important:
PSR Entry and PSR Bulk Entry must be page action buttons inside PSR & Verification workspace, not sidebar items.

Page Batch 6: Case & Financial Management

Create real table/list pages for:

1. Litigation Management
Create table workspace with tabs or segmented control:
- Arrear Approval
- Writ Case Approval
- Dept Case Approval
- Taxpayer Case Approval

Each tab must show an actual table with filters and approval actions.

2. Appeal Register
Create Appeal Register table.
Include Appeal Approval as tab/action inside the page.
Do not make it a separate sidebar item.

3. Tribunal Register
Create Tribunal Register table.
Include Tribunal Approval as tab/action inside the page.
Do not make it a separate sidebar item.

4. Demand And Payment
Create Demand And Payment workspace.
Include:
- Entry as a modal action
- Taxpayer Ledger table/view
- Approval table/action

5. Refund & Adjustment
Create Refund & Adjustment table/list.
Include approval/adjustment actions and detail drawer.

Page Batch 7: Administration & Requests

Create real table/list pages for:

1. Certificate Req
Create Certificate Request workspace with tabs:
- Data Entry Request
- Approval Request
- Edit Request
- Disposal History

Each tab must show a real table/list with filters, row actions, and pagination.

2. User Management
Use the already approved User Management table page.
Keep:
- user table
- Add User modal
- Edit User modal
- Change Role modal
- action menu

3. Role Management
Use the already approved Role Management page.
Keep:
- role list
- Create Role modal
- Edit Role modal
- permission accordion with search and select all

4. Special Registration List
Create actual table/list page.
Include filters, status, row actions.

5. Time Extension
Create actual table/list page.
Include request table, approve/reject actions.

6. Audit Selection
Create actual table/list page.
Include selection table, filters, and actions.

Strict No-Placeholder Rule:
Do not leave these pages empty:
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

Every listed page must show a real modern table workspace.

If exact headers are visible in PDF:
Use the exact headers.

If exact headers are unclear:
Use the closest visible structure, keep labels editable, and add a small note in Figma:
“Needs PDF verification”.

Sample Data Rule:
Use realistic sample rows only to demonstrate layout.
Do not invent legal/tax rules.
Sample data is only for UI layout.

Modal and Drawer Rule:
For add/edit/create/entry actions:
- use modal
- do not create separate navigation pages

For row details:
- use right-side detail drawer on desktop
- use full-screen panel or bottom sheet on mobile

Responsive Rules:
Large desktop:
- use full available width
- avoid empty blank canvas
- show table workspaces clearly

Desktop:
- filters and tables aligned

Tablet:
- filters wrap
- table scrolls horizontally
- drawers overlay

Mobile:
- filters stack
- tables become horizontal scroll or card list
- modals become full-screen
- actions remain accessible

Accessibility:
- visible labels for filters and inputs
- keyboard accessible actions
- focus rings
- readable contrast
- tooltips for icon-only actions
- table headers clear
- status badges include text
- no color-only meaning

Final Output:
Replace all placeholder module screens with real table/list workspaces using the uploaded PDF/screenshots as the source of truth and the new design system as the visual style.