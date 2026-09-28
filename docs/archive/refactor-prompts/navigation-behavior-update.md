Fix the primary-to-secondary navigation behavior across the full system.

Do not redesign the UI.
Do not change the approved main navigation names.
Do not remove any feature, page, table, workflow, or breadcrumb.
Do not create placeholder pages.
Only fix navigation logic, default page selection, and unnecessary single-item secondary navigation.

Main Goal:
Make navigation feel direct, predictable, and complete.

When a user clicks any primary navigation item, the system must automatically open the first valid page from that module’s secondary navigation. Users should not land on an empty module workspace unless there is a real reason.

Golden Rules:
- Keep the approved navigation structure.
- Keep all main navigation names unchanged.
- Keep all secondary and third-layer navigation names unchanged unless already approved.
- Do not move navigation into the page body.
- Navigation belongs only in the left navigation area.
- Keep breadcrumbs below the top bar and above the page title.
- Do not create blank placeholder pages.
- Do not show “Select a sub-item from the navigation to continue” if a valid first child page exists.
- Do not show a secondary navigation panel with only one item.
- If a primary module has child pages, open the first child page by default.
- If a primary module has a nested child group, open the first available final page inside that group.
- The selected state must update correctly in primary, secondary, and third-layer navigation.
- Breadcrumbs must show the full selected path.
- Keep the design fully responsive.
- Follow WCAG 2.1 AA where possible.
- No all-caps text.
- Keep all styles token-based.
- Keep the existing theme, font, font size, light palettes, and Gmail-style dark mode behavior.

Primary Navigation Behavior:
When the user clicks a primary navigation item:
- Activate that primary item.
- Load the first valid secondary child page automatically.
- Highlight the matching secondary item.
- If the first secondary item has third-layer children, expand it and select the first valid third-layer child.
- Update breadcrumb based on the selected final page.
- Load the actual page content, table, dashboard, or workspace.
- Do not show an empty state just because the user clicked the parent module.

No Single-Item Secondary Navigation Rule:
Check every primary module and every secondary group.

If a secondary navigation level contains only one single item:
- Do not show that as a lonely navigation item.
- Open the item directly.
- Use the page title and breadcrumb to show context.
- Keep the left navigation clean.

Example:
Wrong:
Primary: Register & Stock
Secondary: Register-4
Third layer: List

If Register-4 only contains one child called “List”, do not force users to click “List”.
Instead:
- Selecting Register-4 should open the Register-4 List page directly.
- Breadcrumb should show:
  Home › Register & Stock › Register-4
  or
  Home › Register & Stock › Register-4 List
  depending on the existing naming logic.
- Do not show “List” as a lonely third-layer item unless there are other sibling items.

Default Selection Rules By Module:

Dashboard:
When clicking Dashboard, open:
Dashboard

Secondary navigation:
- Dashboard
- PSR Dashboard
- Double Entry Dashboard

Default selected item:
Dashboard

Report:
When clicking Report, open:
Offline Return Report

Secondary navigation:
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

Default selected item:
Offline Return Report

Return Register:
When clicking Return Register, open:
Return View Approval

Secondary navigation:
- Return View Approval
- Return Register
  - Online Return Register
  - Offline Return Register
- Online Archive

Default selected item:
Return View Approval

If the user clicks Return Register group:
- Expand it.
- Select Online Return Register by default.

Register & Stock:
When clicking Register & Stock, open:
Register-4

Secondary navigation:
- Register-4
- Stock Register
- Tax Registry
- Register-5

Default selected item:
Register-4

If Register-4 has only one child item called “List”:
- Do not show “List” as a lonely child.
- Open Register-4 List directly when Register-4 is selected.
- Page title can be “Register-4 List”.
- Breadcrumb should not truncate.

If Register-5 has only one child item:
- Do not show a lonely third-layer item.
- Open Register-5 directly or Register-5 Approval directly based on existing workflow.

PSR & Verification:
When clicking PSR & Verification, open:
PSR Approval

Secondary navigation:
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

Default selected item:
PSR Approval

Case & Financial Management:
When clicking Case & Financial Management, open:
Litigation Management › Arrear Approval

Secondary navigation:
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
  - Demand Register
  - Taxpayer Ledger
  - Approval
- Refund & Adjustment

Default selected item:
Litigation Management › Arrear Approval

If any group has only one child:
- Do not show a lonely child unless needed for clarity.
- Clicking the parent group should open that only child directly.

Administration & Requests:
When clicking Administration & Requests, open:
Certificate Req › Data Entry Request

Secondary navigation:
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

Default selected item:
Certificate Req › Data Entry Request

User Management and Role Management:
- These must stay under Administration & Requests.
- Do not keep them under Settings.
- If clicked, load their real pages directly.
- Do not show empty module workspace.

Settings:
Settings should not contain User Management or Role Management.

Settings should only handle global preferences such as:
- Appearance
- Theme
- Font
- Font Size
- Display preferences

If Settings has only one actual settings page:
- Do not create a lonely secondary navigation item.
- Open the Settings / Appearance page directly.

Breadcrumb Rules:
Breadcrumb must always match the selected final page.

Use full names. Do not truncate on desktop.

Examples:
- Home › Dashboard › Dashboard
- Home › Report › Offline Return Report
- Home › Return Register › Return View Approval
- Home › Return Register › Return Register › Online Return Register
- Home › Register & Stock › Register-4
- Home › PSR & Verification › PSR Approval
- Home › Case & Financial Management › Litigation Management › Arrear Approval
- Home › Administration & Requests › Certificate Req › Data Entry Request
- Home › Administration & Requests › User Management
- Home › Administration & Requests › Role Management

Do not show:
- Case & Financial Manag...
- Empty workspace breadcrumb
- Parent module only when a child page is already selected

Empty State Rule:
Only show empty states when:
- there is truly no data
- no role is selected in Role Management
- no search/filter result is found
- the user has not selected a record for details

Do not show empty module workspace after clicking a primary nav item.

Remove generic empty text:
“This module is part of the application shell.”
“Select a sub-item from the navigation to continue.”

Use real page content instead.

Page Loading Rule:
Every primary navigation click should result in a real page:
- dashboard
- table page
- list page
- management page
- settings page
- report page

Not a blank placeholder.

Active State Rule:
When a default child page opens automatically:
- primary nav active state must show selected module
- secondary nav active state must show selected child
- third-layer active state must show selected nested item if applicable
- parent group must expand automatically
- breadcrumb must update
- page title must update
- page content must update

Responsive Rules:
Desktop:
- show first-layer and second-layer navigation.
- auto-select first child page on primary click.
- show full breadcrumbs.

Tablet:
- second-layer navigation may collapse.
- keep default child selection behavior.
- breadcrumb may wrap if needed.

Mobile:
- primary navigation opens as drawer.
- selecting a primary item should still open the first child page.
- secondary navigation can appear as a drawer, dropdown, or compact list.
- avoid single-item secondary navigation.
- current page name must remain visible.

Design System Rules:
Do not change the approved visual system.

Keep:
- same app shell
- same navigation style
- same table system
- same card system
- same drawer system
- same modal system
- same toolbar system
- same status badge system
- same typography scale
- same icons
- same theme tokens
- same custom scrollbar behavior

Accessibility:
- Navigation must be keyboard accessible.
- Expanded/collapsed groups must have proper state.
- Active item must be visually clear.
- Tooltips must remain available for collapsed primary nav.
- Screen readers should understand selected navigation state.
- Do not rely only on color for active state.

Final Result:
The navigation should feel direct and complete.

When a user clicks a primary module, the first valid child page should open automatically.
There should be no unnecessary empty workspace.
There should be no lonely one-item secondary or third-layer navigation.
Breadcrumbs should show the full selected path.
All behavior must stay consistent across Dashboard, Report, Return Register, Register & Stock, PSR & Verification, Case & Financial Management, Administration & Requests, and Settings.