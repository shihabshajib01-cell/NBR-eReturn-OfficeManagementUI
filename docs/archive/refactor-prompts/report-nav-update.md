Update the Report module navigation and page structure.

Important:
Do not redesign the whole system. Keep the existing app shell, first-layer navigation, top bar, breadcrumb style, theme system, font selector, font size selector, table design system, modal/drawer behavior, and working flows.

Main Change:
The Report module must now use second-layer navigation like the rest of the system.

Remove the old Report page logic where report cards act as the main report navigation.
Do not use “Available Reports” cards as report navigation anymore.

Golden Rules:
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
- Do not create placeholder pages.
- Do not show empty messages like “This module is part of the application shell.”

Approved Breadcrumb Rule:
Keep the existing breadcrumb style exactly as currently used.

Breadcrumb pattern:
Home › Module › Current Page

Examples:
- Home › Report › Offline Return Report
- Home › Report › Tax Category Report
- Home › Report › User Activity Report

Breadcrumb rules:
- Keep breadcrumbs below the top bar and above the page title.
- Previous levels should be lighter.
- Current page should be stronger/bold.
- Use small chevron separators.
- Do not redesign, remove, or reposition breadcrumbs.

Report Navigation Update:
When the user clicks Report in the first-layer navigation, show a second-layer navigation panel for report items.

Second-layer Report navigation items:
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

Second-layer navigation behavior:
- Use the same second-layer navigation component as other modules.
- Expanded state: show icon + label.
- Collapsed state: show icon only.
- Show tooltip on hover/focus when collapsed.
- Active item uses selected theme primary color.
- Inactive items use neutral text/icon color.
- Hover state uses selected theme primary light tint.
- Focus ring uses selected theme primary color.
- Keep icons consistent with the existing icon style.

Suggested icons:
- Offline Return Report: file-list icon
- Tax Category Report: tag icon
- Express Cert. Disposal: certificate/file-check icon
- User Activity Report: activity/user icon
- Litigation Arrear: scale/gavel icon
- Litigation Writ Case: document-case icon
- Litigation Dept Case: building/document icon
- Litigation Taxpayer Case: user-case icon
- Appeal Report: appeal/arrow-up icon
- Tribunal Report: courthouse icon
- Payment & Demand Report: wallet/receipt icon
- Register-5 Report: list/report icon

Report Landing Behavior:
Do not show the old Available Reports card grid.

When the Report module is opened, use one of these acceptable behaviors:
Option A, preferred:
- Automatically open the first report: Offline Return Report

Option B:
- Show a clean Report Workspace page with a short instruction and second-layer navigation visible, but do not show report cards.

Preferred final behavior:
Set “Offline Return Report” as the default selected report.

Report Page Template:
Each second-layer report item must open a real table/list workspace.

Each report page must include:
- Breadcrumb
- Page title
- Short description
- Search field
- Export button
- Filter button
- Summary cards where useful
- Applied filter summary when filters are active
- PDF-based table/list
- Pagination
- Row actions
- Detail drawer for row view

Do not leave report pages empty.

Table Design:
Use the approved modern table/list style:
- light grey page background
- white rounded cards
- soft borders
- card-style table rows
- clean table header row
- sortable column labels where useful
- spacing between rows
- no heavy grid borders
- theme-aware action color
- horizontal scroll for wide tables
- theme-aware custom scrollbar

PDF Table Header Rule:
Use the uploaded PDF/screenshots as the source of truth for report table headers and grouped headers.

Do not invent report columns.
Do not rename report headers.
If exact headers are unclear, keep them editable and add a note:
“Needs PDF verification.”

Report Table Requirements:

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
Use exact PDF structure where visible.
If unclear, create editable headers and add note:
“Needs PDF verification.”

Register-5 Report:
Use exact PDF structure where visible.
If unclear, create editable headers and add note:
“Needs PDF verification.”

Filter Pattern:
Each report page should use a reusable filter panel.

Common report filters:
- Assessment Year
- Zone
- Circle
- Date Range
- Status, only where relevant
- Report Type, only where relevant

Filter behavior:
- Filter button opens filter panel or drawer.
- Apply Filter updates table state.
- Reset Filter clears filter fields.
- After applying filters, show applied filter chips.

Applied Filter Summary:
After filters are applied, show:
“Now showing filtered results based on following(s)”

Show selected filters as chips:
- AY 2024-25
- Zone
- Circle
- Status
- Date Range
- Clear Result

Actions:
- Export button should remain visible in page header/action area.
- Print action can be inside table toolbar if relevant.
- View row action opens detail drawer.
- Do not open a new page for row details.

Responsive Rules:
Large desktop:
- Use full available width wisely.
- Avoid blank canvas.
- Show second-layer navigation and table workspace clearly.

Desktop:
- Keep second-layer navigation expanded.
- Keep filters and table aligned.

Tablet:
- Second-layer navigation can collapse.
- Filters wrap.
- Table scrolls horizontally.

Mobile:
- Navigation becomes drawer.
- Filters become bottom sheet or full-screen sheet.
- Tables become horizontally scrollable or card-list.
- Detail drawer becomes full-screen panel.

Do Not Change:
- Do not change the 7 main navigation items.
- Do not change the top bar.
- Do not change the approved breadcrumb style.
- Do not remove theme selector.
- Do not remove font selector.
- Do not remove font size selector.
- Do not change Settings, User Management, or Role Management.
- Do not create report-card navigation for Report anymore.
- Do not create placeholder report pages.

Final Output:
Update the Report module so it uses second-layer navigation like other modules. Remove Available Reports card-navigation. Each report item in the second-layer navigation must open a real PDF-based table/list workspace using the approved breadcrumb style, modern table design, filters, actions, pagination, detail drawer, theme system, typography, responsiveness, accessibility, and golden rules.