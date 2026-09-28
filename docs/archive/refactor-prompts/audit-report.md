You are working on a React + TypeScript frontend project for the Government Office Management UI.

The design is almost final, but the codebase is not production-ready.

Current known problems:

* App.tsx is too large and contains too many things.
* Many pages are inside App.tsx.
* Many reusable components are inside App.tsx.
* Inline CSS and style objects still exist.
* Pages are not separated by navigation hierarchy.
* Components are not separated properly.
* Routing needs cleanup.
* CSS architecture needs cleanup.
* Logo sources are inconsistent.
* Developer handoff documentation is missing.

This task must be done safely.

Do not redesign the UI.
Do not change the visual design.
Do not change page layouts.
Do not rename navigation items.
Do not remove any page, feature, table, modal, drawer, dropdown, theme, or interaction.
Do not change table headers.
Do not change the login/logout flow.
Do not change the approved breadcrumb style.
Do not change the approved design system.
Do not do a large one-shot rewrite.

Main goal:
Refactor the project into a clean, maintainable, developer-ready structure without breaking the current UI.

Critical execution rule:
Work phase by phase.
After each phase, stop and report.
Do not proceed to the next phase unless I approve.

Phase 1 only: Deep audit. Do not modify files.

In Phase 1, inspect the full project and return:

1. Current folder structure
2. Large files with line counts
3. All components currently inside App.tsx
4. All pages currently inside App.tsx
5. All data/config currently inside App.tsx
6. Inline style count by file
7. CSS files currently available
8. Logo files and logo imports currently used
9. Current routing/default route logic
10. Current login/logout routing behavior
11. Current navigation config location
12. Current reusable UI patterns
13. Duplicate components or repeated UI blocks
14. Missing folders
15. Missing documentation
16. Risk areas before refactor
17. Exact safest extraction order

Do not edit anything in Phase 1.
Only report findings and a refactor plan.

Target final architecture:

src/
app/
App.tsx
routes.tsx
routeGuards.ts

assets/
logos/
government-seal-bangladesh.svg
images/
icons/

layouts/
AuthLayout.tsx
AppLayout.tsx
SidebarLayout.tsx
PageLayout.tsx

pages/
auth/
LoginPage.tsx
ForgotPasswordPage.tsx

```
dashboard/
  DashboardPage.tsx
  PSRDashboardPage.tsx
  CombinedDashboardPage.tsx

report/
  OfflineReturnReportPage.tsx
  TaxCategoryReportPage.tsx
  ExpressCertificateDisposalPage.tsx
  UserActivityReportPage.tsx
  LitigationArrearReportPage.tsx
  LitigationWritCaseReportPage.tsx
  LitigationDeptCaseReportPage.tsx
  LitigationTaxpayerCaseReportPage.tsx
  AppealReportPage.tsx
  TribunalReportPage.tsx
  PaymentDemandReportPage.tsx
  RegisterFiveReportPage.tsx

return-register/
  ReturnViewApprovalPage.tsx
  OnlineReturnRegisterPage.tsx
  OfflineReturnRegisterPage.tsx
  OnlineArchivePage.tsx

register-stock/
  RegisterFourListPage.tsx
  StockRegisterPage.tsx
  TaxRegistryPage.tsx
  RegisterFivePage.tsx

psr-verification/
  PSRApprovalPage.tsx
  PSREditRequestPage.tsx
  DoubleEntryStatusPage.tsx
  DoubleEntryVerificationPage.tsx
  PSRDormantPage.tsx
  OutOfJurisdictionPage.tsx
  OtherCirclesEntryPage.tsx
  MisfiledReturnsPage.tsx
  InvalidListPage.tsx
  ApprovalListPage.tsx
  TransferHistoryPage.tsx

case-financial-management/
  litigation-management/
    ArrearApprovalPage.tsx
    WritCaseApprovalPage.tsx
    DeptCaseApprovalPage.tsx
    TaxpayerCaseApprovalPage.tsx

  appeal-register/
    AppealRegisterPage.tsx
    AppealApprovalPage.tsx

  tribunal-register/
    TribunalRegisterPage.tsx
    TribunalApprovalPage.tsx

  demand-payment/
    DemandRegisterPage.tsx
    TaxpayerLedgerPage.tsx
    PaymentApprovalPage.tsx

  refund-adjustment/
    RefundAdjustmentPage.tsx

administration-requests/
  certificate-requests/
    DataEntryRequestPage.tsx
    ApprovalRequestPage.tsx
    EditRequestPage.tsx
    DisposalHistoryPage.tsx

  UserManagementPage.tsx
  RoleManagementPage.tsx
  SpecialRegistrationListPage.tsx
  TimeExtensionPage.tsx
  AuditSelectionPage.tsx
```

components/
navigation/
PrimarySidebar.tsx
SecondarySidebar.tsx
SidebarLogo.tsx
NavItem.tsx
SecondaryNavItem.tsx
Breadcrumbs.tsx
Topbar.tsx

```
auth/
  LoginForm.tsx
  LoginSlider.tsx
  LoginSlide.tsx
  CaptchaBlock.tsx
  ForgotPasswordForm.tsx
  SignOutConfirmModal.tsx

account/
  AccountDropdown.tsx
  AccountMenuItem.tsx
  ProfileSummary.tsx

notifications/
  NotificationDropdown.tsx
  NotificationItem.tsx
  NotificationBadge.tsx
  NotificationEmptyState.tsx

appearance/
  AppearanceDropdown.tsx
  ThemeSelector.tsx
  FontSelector.tsx
  FontSizeSelector.tsx

tables/
  DataTable.tsx
  TableHeader.tsx
  TableToolbar.tsx
  TableSearch.tsx
  TableFilterButton.tsx
  TableExportButton.tsx
  TablePrintButton.tsx
  TablePagination.tsx
  TableStatusCell.tsx
  TableActionsCell.tsx
  EmptyTableState.tsx

filters/
  FilterDrawer.tsx
  FilterPanel.tsx
  FilterGroup.tsx
  DateRangeFilter.tsx
  LocationFilter.tsx
  StatusFilter.tsx
  ResetFilterButton.tsx
  ApplyFilterButton.tsx

drawers/
  DetailDrawer.tsx
  DrawerHeader.tsx
  DrawerSection.tsx
  DrawerActionBar.tsx

modals/
  BaseModal.tsx
  ConfirmModal.tsx
  FormModal.tsx

cards/
  StatCard.tsx
  SummaryCard.tsx
  DashboardTableCard.tsx
  RoleCard.tsx

forms/
  FormField.tsx
  TextInput.tsx
  SelectInput.tsx
  PasswordInput.tsx
  CheckboxInput.tsx
  ToggleSwitch.tsx
  SearchInput.tsx
  DateInput.tsx
  TimeInput.tsx

buttons/
  Button.tsx
  IconButton.tsx
  ActionButton.tsx
  DangerButton.tsx

badges/
  StatusBadge.tsx
  CountBadge.tsx
  TrendBadge.tsx

states/
  EmptyState.tsx
  LoadingState.tsx
  ErrorState.tsx
  LockedState.tsx
```

data/
navigation/
primaryNavigation.ts
secondaryNavigation.ts
routeMap.ts

```
tables/
  dashboardTables.ts
  reportTables.ts
  returnRegisterTables.ts
  registerStockTables.ts
  psrVerificationTables.ts
  caseFinancialTables.ts
  administrationTables.ts

mock/
  users.ts
  roles.ts
  notifications.ts
  reports.ts
  dashboard.ts
```

hooks/
useNavigation.ts
useTheme.ts
useFontSize.ts
useNotifications.ts
useTableState.ts
useDrawer.ts
useModal.ts
useAuth.ts

services/
authService.ts
notificationService.ts
reportService.ts
userService.ts
roleService.ts

styles/
tokens.css
global.css
typography.css
layout.css
navigation.css
tables.css
cards.css
forms.css
buttons.css
badges.css
modals.css
drawers.css
dropdowns.css
animations.css
themes.css
dark-mode.css

utils/
formatDate.ts
formatCurrency.ts
formatNumber.ts
routeHelpers.ts
tableHelpers.ts

docs/
SYSTEM_ARCHITECTURE.md
FILE_STRUCTURE.md
ROUTING_GUIDE.md
COMPONENT_GUIDE.md
DESIGN_SYSTEM_GUIDE.md
TABLE_PATTERN_GUIDE.md
NAVIGATION_GUIDE.md
AUTH_FLOW_GUIDE.md
CONTRIBUTION_GUIDE.md

After Phase 1, wait for my approval.

When I approve, continue phase by phase:

Phase 2:
Create folder structure only.
Do not move logic yet.

Phase 3:
Fix logo asset usage only.
Use one official SVG logo source.
Remove broken external/logo references only after verifying the new SVG works.
Logo click must route to Dashboard > Dashboard.

Phase 4:
Extract layout and navigation components only.

Phase 5:
Extract shared reusable UI components only.

Phase 6:
Extract route-level pages into pages/ based on navigation hierarchy.

Phase 7:
Move navigation config, route map, table schemas, and mock data into data/.

Phase 8:
Move inline CSS and style objects into CSS files.
No inline style should remain except required SVG path colors.

Phase 9:
Centralize routing.
Login must route to Dashboard > Dashboard.
Logout must route to Login.
Logo click must route to Dashboard > Dashboard.
Primary nav click must select the first valid secondary page.
No placeholder module page should appear.

Phase 10:
Create developer documentation.

Phase 11:
Final validation.

Refactor rules:

* Every file should contain one main component.
* App.tsx should become small.
* App.tsx should only handle app providers, routing, and global shell setup.
* Pages should live inside pages/.
* Reusable components should live inside components/.
* Mock data should live inside data/mock/.
* Table schemas should live inside data/tables/.
* Navigation config should live inside data/navigation/.
* CSS should live inside styles/.
* No inline CSS.
* No style objects inside components.
* No repeated table/card/modal/drawer logic.
* No duplicate UI components.
* No placeholder pages.

Routing rules:

* /login opens LoginPage.
* Successful login routes to Dashboard > Dashboard.
* Logout from account dropdown routes to LoginPage.
* Top-left logo click routes to Dashboard > Dashboard.
* Dashboard primary nav opens Dashboard secondary page.
* Report primary nav opens Offline Return Report.
* Return Register primary nav opens Return View Approval.
* Register & Stock primary nav opens Register-4.
* PSR & Verification primary nav opens PSR Approval.
* Case & Financial Management primary nav opens Litigation Management > Arrear Approval.
* Administration & Requests primary nav opens Certificate Req > Data Entry Request.
* Breadcrumbs must show full names without truncation.

Logo rules:

* Use one official logo asset only.
* Use government-seal-bangladesh.svg.
* Do not use external Wikimedia page URL as image source.
* Do not use old PNG placeholder logo.
* Do not leave broken image source anywhere.
* Sidebar logo should be clickable.
* Sidebar logo click routes to Dashboard > Dashboard.

CSS rules:

* Move all inline styles into CSS files.
* Use CSS variables and design tokens.
* Preserve current visual design exactly.
* Do not introduce new colors, shadows, radius, font sizes, or spacing unless already approved.
* Keep all 6 themes working.
* Keep Gmail-inspired dark mode working.
* Keep font selector working.
* Keep font size selector working.
* Keep animation easing working.

Documentation rules:
Create practical documentation for future developers.

Required docs:

1. SYSTEM_ARCHITECTURE.md
2. FILE_STRUCTURE.md
3. ROUTING_GUIDE.md
4. COMPONENT_GUIDE.md
5. DESIGN_SYSTEM_GUIDE.md
6. TABLE_PATTERN_GUIDE.md
7. NAVIGATION_GUIDE.md
8. AUTH_FLOW_GUIDE.md
9. CONTRIBUTION_GUIDE.md

Final validation checklist:

* App builds successfully.
* No visual regression.
* Login works.
* Logout works.
* Dashboard landing works.
* Logo click works.
* Primary and secondary navigation selected states work.
* Breadcrumbs work and do not truncate.
* All pages load.
* No placeholder pages remain.
* Tables render.
* Drawers open.
* Modals open.
* Notifications open.
* Account dropdown opens.
* Appearance dropdown works.
* All themes work.
* Dark mode works.
* Font selector works.
* Font size selector works.
* No inline styles remain.
* App.tsx is cleaned and reduced.
* Every file has one main component.

Output after each phase:

1. Phase completed
2. Files created
3. Files modified
4. What changed
5. Build status
6. Risks or unresolved issues
7. Wait for approval before next phase

Start now with Phase 1 only.
Do not modify any files in Phase 1.
