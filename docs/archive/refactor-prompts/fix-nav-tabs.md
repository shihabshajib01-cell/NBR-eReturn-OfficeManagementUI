Fix the generated table/list pages so they follow the approved navigation system.

Do not redesign the full UI. Keep the current app shell, top bar, breadcrumb style, theme system, typography, font selector, font size selector, table components, modals, drawers, and working flows.

Main Problem:
Some pages placed navigation items as tabs inside the page content. This is wrong.

Examples of wrong page-level tabs:
- Arrear Approval, Writ Case Approval, Dept Case Approval, Taxpayer Case Approval shown as tabs inside Litigation Management page
- Appeal Register and Appeal Approval shown as page tabs
- Tribunal Register and Tribunal Approval shown as page tabs
- Demand Register, Taxpayer Ledger, Approval shown as page tabs
- Data Entry Request, Approval Request, Edit Request, Disposal History shown as page tabs

Fix:
Move all navigation-like tabs into the left second-layer or third-layer navigation.
The main content area should only show the selected page’s table/list workspace.

Golden Rules:
- Each page must feel like part of one continuous process.
- Never break something that is already working.
- Use one unified design system across all pages and flows.
- Keep icons, font sizes, colors, shadows, spacing, cards, forms, tables, drawers, modals, filters, navigation, breadcrumbs, badges, buttons, and interaction patterns consistent.
- Follow accessibility best practices and WCAG 2.1 AA where possible.
- No clumsy or cluttered UX.
- Every screen must be fully responsive from large desktop to laptop, tablet, and mobile.
- No all-caps text anywhere.
- Every text element must follow the approved responsive typography scale.
- Every reusable item must look and behave consistently.
- Add, edit, delete, view, approve, reject, print, export, filter, search, pagination, drawer, modal, tooltip, and confirmation actions must follow the same interaction pattern everywhere.
- Build with code-level thinking. Keep every component separate, modular, and editable.
- Changing one component should not break the overall structure.
- Use design tokens for colors, typography, spacing, radius, shadows, borders, focus rings, and scrollbars.
- Keep theme-aware custom scrollbars.
- Do not create placeholder pages.
- Do not duplicate navigation inside the page body.

Approved Navigation Rule:
Use the left navigation only for navigation.

First-layer navigation:
- Dashboard
- Report
- Return Register
- Register & Stock
- PSR & Verification
- Case & Financial Management
- Administration & Requests

Second-layer navigation:
Shows the main child pages under each selected first-layer module.

Third-layer navigation:
Use nested items under a second-layer item only when absolutely necessary.

Do not create page-body tabs for navigation items.

Approved Breadcrumb Rule:
Keep the current breadcrumb style exactly.

Pattern:
Home › Module › Parent Page › Current Page

Examples:
- Home › Case & Financial Management › Litigation Management › Arrear Approval
- Home › Case & Financial Management › Appeal Register › Appeal Approval
- Home › Administration & Requests › Certificate Req › Data Entry Request
- Home › Return Register › Return Register › Online Return Register

Breadcrumb must stay below top bar and above page title.

Correct Navigation Structure:

Case & Financial Management:
- Litigation Management
  - Arrear Approval
  - Writ Case Approval
  - Dept Case Approval
  - Taxpayer Case Approval
- Appeal Register
  - Appeal Approval
- Tribunal Register
  - Tribunal Approval
- Demand And Payment
  - Taxpayer Ledger
  - Approval
- Refund & Adjustment

Administration & Requests:
- Certificate Req
  - Data Entry Request
  - Approval Request
  - Edit Request
  - Disposal History
- User Management
- Role Management
- Special Registration List
- Time Extension
- Audit Selection

Return Register:
- Return View Approval
- Return Register
  - Online Return Register
  - Offline Return Register
- Online Archive

Register & Stock:
- Register-4
  - List
- Stock Register
- Tax Registry
- Register-5
  - Register-5 Approval, if needed as nested item or page action

PSR & Verification:
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

Report:
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

Main Content Rule:
When a third-layer item is selected, the main page content should show only that selected page.

Example:
If selected:
Case & Financial Management > Litigation Management > Arrear Approval

Main content should show:
- Breadcrumb
- Page title: Arrear Approval
- Short description
- Search
- Filter
- Export
- Print
- Summary cards if useful
- Table/list workspace
- Pagination
- Row actions
- Detail drawer

Do not show tabs for Writ Case Approval, Dept Case Approval, or Taxpayer Case Approval inside the page body.

Page Title Rule:
The page title should match the current selected page, not only the parent module.

Correct:
- Arrear Approval
- Appeal Approval
- Tribunal Approval
- Taxpayer Ledger
- Data Entry Request

Avoid:
- Showing “Litigation Management” as the page title while Arrear Approval is selected
- Showing “Appeal Register” while Appeal Approval is selected
- Showing “Certificate Requests” while Data Entry Request is selected, unless the selected child title is clearly shown as the main section

Table Page Pattern:
Every selected page must use the approved table/list page design:
- breadcrumb
- page title
- short description
- search/export/filter actions
- summary cards where useful
- applied filter chips after filtering
- modern table/list workspace
- pagination
- row actions
- detail drawer

Table Style:
Use the approved modern table system:
- white rounded table container
- clean table header
- card-style or clean row style
- soft borders
- no heavy old grid
- readable spacing
- theme-aware hover state
- theme-aware scrollbar
- row actions with tooltips

Action Placement Rule:
Keep actions inside the relevant page:
- Add/Create/Entry opens modal
- Edit opens modal
- Approve/Reject opens confirmation modal
- View opens detail drawer
- Export/Print stay in page toolbar
- Do not add action items as navigation unless they are real destination pages

Do Not:
- Do not create page-level navigation tabs for items already in left navigation.
- Do not duplicate the same navigation in both left panel and page body.
- Do not keep parent module title when child page is selected.
- Do not leave pages empty.
- Do not change the main navigation names.
- Do not remove any feature.
- Do not change breadcrumb style.
- Do not remove theme, font, or font size selectors.

Final Result:
All generated pages must follow the approved navigation pattern:
left first-layer navigation, left second-layer/third-layer navigation, breadcrumb at top, and main content showing only the selected page’s table/list workspace. No duplicate navigation tabs inside page content.