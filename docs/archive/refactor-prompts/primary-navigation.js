Deep refactor the full frontend project into a clean, scalable, developer-friendly file structure.

Goal:
Every page, component, layout, utility, and reusable UI block must be separated into its own standalone file.

Important rule:
Each file should contain only one main component.

Do not keep multiple components inside one file.
Do not keep page sections, modals, drawers, cards, tables, filters, dropdowns, or buttons inside a large page file.
Break everything into clean, reusable, single-purpose files.

Do not redesign the UI.
Do not change the user flow.
Do not change the navigation names.
Do not change the design system.
Only restructure the codebase into a clean professional architecture.

Project context:
This is a NBR office managment System with the following primary navigation:

1. Dashboard
2. Report
3. Return Register
4. Register & Stock
5. PSR & Verification
6. Case & Financial Management
7. Administration & Requests

The system also includes:

* Login page
* Account dropdown
* Notification dropdown
* Appearance dropdown
* User Management
* Role Management
* Detail drawer
* Table pages
* Filter panels
* Pagination
* Modals
* Cards
* Forms
* Status badges
* Theme system
* Typography presets
* Dark mode
* Government logo

Required architecture:

src/
app/
App.jsx
routes.jsx
routeGuards.jsx

assets/
logos/
GovernmentSealBangladesh.svg
images/
icons/

layouts/
AuthLayout.jsx
AppLayout.jsx
SidebarLayout.jsx
PageLayout.jsx

pages/
auth/
LoginPage.jsx
ForgotPasswordPage.jsx

```
dashboard/
  DashboardPage.jsx
  PSRDashboardPage.jsx
  CombinedDashboardPage.jsx

report/
  OfflineReturnReportPage.jsx
  TaxCategoryReportPage.jsx
  ExpressCertificateDisposalPage.jsx
  UserActivityReportPage.jsx
  LitigationArrearReportPage.jsx
  LitigationWritCaseReportPage.jsx
  LitigationDeptCaseReportPage.jsx
  LitigationTaxpayerCaseReportPage.jsx
  AppealReportPage.jsx
  TribunalReportPage.jsx
  PaymentDemandReportPage.jsx
  RegisterFiveReportPage.jsx

return-register/
  ReturnViewApprovalPage.jsx
  OnlineReturnRegisterPage.jsx
  OfflineReturnRegisterPage.jsx
  OnlineArchivePage.jsx

register-stock/
  RegisterFourListPage.jsx
  StockRegisterPage.jsx
  TaxRegistryPage.jsx
  RegisterFivePage.jsx

psr-verification/
  PSRApprovalPage.jsx
  PSREditRequestPage.jsx
  DoubleEntryStatusPage.jsx
  DoubleEntryVerificationPage.jsx
  PSRDormantPage.jsx
  OutOfJurisdictionPage.jsx
  OtherCirclesEntryPage.jsx
  MisfiledReturnsPage.jsx
  InvalidListPage.jsx
  ApprovalListPage.jsx
  TransferHistoryPage.jsx

case-financial-management/
  litigation-management/
    ArrearApprovalPage.jsx
    WritCaseApprovalPage.jsx
    DeptCaseApprovalPage.jsx
    TaxpayerCaseApprovalPage.jsx

  appeal-register/
    AppealRegisterPage.jsx
    AppealApprovalPage.jsx

  tribunal-register/
    TribunalRegisterPage.jsx
    TribunalApprovalPage.jsx

  demand-payment/
    DemandRegisterPage.jsx
    TaxpayerLedgerPage.jsx
    PaymentApprovalPage.jsx

  refund-adjustment/
    RefundAdjustmentPage.jsx

administration-requests/
  certificate-requests/
    DataEntryRequestPage.jsx
    ApprovalRequestPage.jsx
    EditRequestPage.jsx
    DisposalHistoryPage.jsx

  UserManagementPage.jsx
  RoleManagementPage.jsx
  SpecialRegistrationListPage.jsx
  TimeExtensionPage.jsx
  AuditSelectionPage.jsx
```

components/
navigation/
PrimarySidebar.jsx
SecondarySidebar.jsx
SidebarLogo.jsx
NavItem.jsx
SecondaryNavItem.jsx
Breadcrumbs.jsx
Topbar.jsx

```
auth/
  LoginForm.jsx
  LoginSlider.jsx
  LoginSlide.jsx
  CaptchaBlock.jsx
  ForgotPasswordForm.jsx
  SignOutConfirmModal.jsx

account/
  AccountDropdown.jsx
  AccountMenuItem.jsx
  ProfileSummary.jsx

notifications/
  NotificationDropdown.jsx
  NotificationItem.jsx
  NotificationBadge.jsx
  NotificationEmptyState.jsx

appearance/
  AppearanceDropdown.jsx
  ThemeSelector.jsx
  FontSelector.jsx
  FontSizeSelector.jsx

tables/
  DataTable.jsx
  TableHeader.jsx
  TableToolbar.jsx
  TableSearch.jsx
  TableFilterButton.jsx
  TableExportButton.jsx
  TablePrintButton.jsx
  TablePagination.jsx
  TableStatusCell.jsx
  TableActionsCell.jsx
  EmptyTableState.jsx

filters/
  FilterDrawer.jsx
  FilterPanel.jsx
  FilterGroup.jsx
  DateRangeFilter.jsx
  LocationFilter.jsx
  StatusFilter.jsx
  ResetFilterButton.jsx
  ApplyFilterButton.jsx

drawers/
  DetailDrawer.jsx
  DrawerHeader.jsx
  DrawerSection.jsx
  DrawerActionBar.jsx

modals/
  BaseModal.jsx
  ConfirmModal.jsx
  FormModal.jsx

cards/
  StatCard.jsx
  SummaryCard.jsx
  MetricCard.jsx
  DashboardTableCard.jsx
  RoleCard.jsx

forms/
  FormField.jsx
  TextInput.jsx
  SelectInput.jsx
  PasswordInput.jsx
  CheckboxInput.jsx
  ToggleSwitch.jsx
  SearchInput.jsx
  DateInput.jsx
  TimeInput.jsx

buttons/
  Button.jsx
  IconButton.jsx
  ActionButton.jsx
  DangerButton.jsx

badges/
  StatusBadge.jsx
  CountBadge.jsx
  TrendBadge.jsx

states/
  EmptyState.jsx
  LoadingState.jsx
  ErrorState.jsx
  LockedState.jsx
```

data/
navigation/
primaryNavigation.js
secondaryNavigation.js
routeMap.js

```
tables/
  dashboardTables.js
  reportTables.js
  returnRegisterTables.js
  registerStockTables.js
  psrVerificationTables.js
  caseFinancialTables.js
  administrationTables.js

mock/
  users.js
  roles.js
  notifications.js
  reports.js
  dashboard.js
```

hooks/
useNavigation.js
useTheme.js
useFontSize.js
useNotifications.js
useTableState.js
useDrawer.js
useModal.js
useAuth.js

services/
authService.js
notificationService.js
reportService.js
userService.js
roleService.js

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
formatDate.js
formatCurrency.js
formatNumber.js
routeHelpers.js
tableHelpers.js

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

Refactor rules:

1. Every route-level screen must live inside pages/.
2. Every reusable UI element must live inside components/.
3. Every file must export only one main component.
4. Large pages must be composed from smaller reusable components.
5. Tables must use the shared DataTable component.
6. Pagination must use the shared TablePagination component.
7. Filters must use shared filter components.
8. Drawers must use the shared DetailDrawer component.
9. Modals must use shared modal components.
10. Cards must use shared card components.
11. Buttons must use shared button components.
12. Badges must use shared badge components.
13. Navigation must be driven from navigation config files.
14. Table columns and mock data must be moved into data/table files.
15. No page should contain hardcoded table structures unless absolutely page-specific.
16. No inline CSS or inline style should remain.
17. All CSS must live in CSS files.
18. No repeated UI pattern should be duplicated across pages.

Routing rules:

* After login, route to Dashboard > Dashboard.
* Top-left logo click routes to Dashboard > Dashboard.
* Primary nav click should automatically select the first valid secondary nav item.
* If a module has only one secondary item, do not create unnecessary nested secondary navigation.
* Breadcrumbs must always show the full page name without truncating.
* Breadcrumb format must stay:
  Home > Primary Module > Current Page

Page rules:
Each page file should only:

* import required components
* define page-level data or fetch data
* compose layout
* pass props to reusable components

Each page file should not:

* define multiple components
* contain inline CSS
* contain large mock data arrays
* define table components locally
* define modals locally
* define drawers locally
* contain unrelated logic

Component rules:
Each component file should:

* contain one main component
* accept props clearly
* use CSS classes
* be reusable where possible
* avoid hardcoded page-specific text unless required
* support theme tokens

Documentation requirement:
Create a system documentation set inside docs/.

Required documentation:

1. SYSTEM_ARCHITECTURE.md
   Explain:

* project overview
* routing architecture
* layout architecture
* page/component/data separation
* authentication flow
* theme system
* design system usage

2. FILE_STRUCTURE.md
   Explain:

* folder purpose
* naming convention
* where to place new pages
* where to place new components
* where to place table schemas
* where to place mock data
* where to place CSS

3. ROUTING_GUIDE.md
   Explain:

* primary navigation routes
* secondary navigation routes
* default page for each module
* login redirect
* logout redirect
* logo click route
* breadcrumb behavior

4. COMPONENT_GUIDE.md
   Explain:

* reusable components
* component responsibilities
* prop expectations
* when to create a new component
* when to reuse an existing component

5. DESIGN_SYSTEM_GUIDE.md
   Explain:

* typography
* spacing
* colors
* themes
* dark mode
* buttons
* cards
* tables
* badges
* forms
* modals
* drawers
* animation rules

6. TABLE_PATTERN_GUIDE.md
   Explain:

* standard table layout
* toolbar pattern
* search/filter/export/print pattern
* pagination pattern
* status badges
* action behavior
* detail drawer behavior

7. NAVIGATION_GUIDE.md
   Explain:

* primary sidebar
* secondary sidebar
* default secondary item behavior
* no unnecessary single-item nested navigation
* icon rules
* active state rules

8. AUTH_FLOW_GUIDE.md
   Explain:

* login page
* captcha after failed attempts
* forgot password
* logout from account dropdown
* redirect to login
* post-login dashboard landing

9. CONTRIBUTION_GUIDE.md
   Explain:

* how a developer should add a new page
* how to add a new table
* how to add a new navigation item
* how to add new mock data
* how to follow the design system
* checklist before submitting work

Naming convention:
Use PascalCase for components:

* DataTable.jsx
* StatCard.jsx
* DetailDrawer.jsx

Use kebab-case or module folders for page groups:

* return-register/
* register-stock/
* psr-verification/
* case-financial-management/

Use clear file names:
Good:

* OnlineReturnRegisterPage.jsx
* UserManagementPage.jsx
* TablePagination.jsx

Bad:

* Page1.jsx
* NewComponent.jsx
* Common.jsx
* Test.jsx
* Final.jsx

Golden rules:

* Do not redesign the UI.
* Do not change approved navigation names.
* Do not change approved routes unless needed for structure.
* Do not remove any feature.
* Do not duplicate components.
* Do not keep multiple components in one file.
* Do not keep inline CSS.
* Do not hardcode repeated table patterns.
* Do not create blank placeholder pages.
* Every navigation item must open a real page.
* Every table page must use the shared table design system.
* Every card must use the shared card style.
* Every button must use the shared button system.
* Every modal and drawer must use the shared modal/drawer system.
* Keep the system clean enough for any new developer to understand and continue.

Final output required:
After refactoring, provide:

1. Final folder structure
2. List of all page files
3. List of all reusable components
4. List of moved components
5. List of updated CSS files
6. List of created documentation files
7. Confirmation that every file has one main component
8. Confirmation that pages follow the navigation hierarchy
9. Confirmation that all shared UI patterns use reusable components
10. Any exceptions, if unavoidable
