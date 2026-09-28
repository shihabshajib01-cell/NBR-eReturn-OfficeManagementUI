Refactor the Government Office Management UI codebase safely and gradually.

This is a safe refactor task, not a redesign task.

Important:
Do not redesign the UI.
Do not change the visual design.
Do not change navigation names.
Do not remove any page, table, workflow, feature, data, route, modal, drawer, dropdown, theme, or interaction.
Do not rewrite the whole project in one pass.
Do not make large uncontrolled changes.

The design is almost done.
The goal is to clean the code structure safely so the project becomes developer-ready.

Current known problems:
- App.tsx is too large.
- Many components are inside one file.
- Pages are not separated by navigation hierarchy.
- Reusable components are not separated properly.
- Inline CSS and style objects exist.
- CSS architecture needs cleanup.
- Routing needs cleanup.
- Developer documentation is missing.

Main goal:
Refactor the project into a clean, maintainable frontend architecture without breaking the current UI.

Safe execution rule:
Work in phases.
After each phase, keep the app buildable and visually unchanged.
Do not proceed to the next phase if the current phase creates errors.

Required phases:

Phase 1: Audit only
Do not change code in this phase.

Scan the full project and report:
- large files
- components inside App.tsx
- page sections inside App.tsx
- inline CSS/style usage
- repeated components
- repeated table patterns
- repeated card patterns
- repeated modal/drawer/dropdown patterns
- current routing logic
- current navigation config
- logo imports
- CSS files
- missing documentation

Output a refactor plan before touching code.

Phase 2: Create folder structure only
Create the target folders without moving logic yet.

Create:

src/
  app/
  assets/
  layouts/
  pages/
  components/
  data/
  hooks/
  services/
  styles/
  utils/
  docs/

Keep the app running.

Phase 3: Move assets and logo safely
Unify logo usage.

Rules:
- Use one official logo asset only:
  government-seal-bangladesh.svg
- Remove dependency on broken external URLs.
- Remove old temporary logo PNG usage only after verifying the SVG works.
- Sidebar logo must remain visually the same size and position.
- Logo click must route to Dashboard > Dashboard.

Keep app running after this phase.

Phase 4: Extract layout components
Move app shell components into layout/navigation files.

Extract only:
- AppLayout
- AuthLayout
- SidebarLayout
- PageLayout
- PrimarySidebar
- SecondarySidebar
- SidebarLogo
- Topbar
- Breadcrumbs

Do not change visual design.
Do not change navigation behavior.

Keep App.tsx smaller but still functional.

Validate:
- login page opens
- dashboard opens
- sidebar works
- topbar works
- breadcrumb works
- logo click routes to Dashboard > Dashboard

Phase 5: Extract shared reusable components
Move shared UI components into separate files.

Each file must contain only one main component.

Extract:
- Button
- IconButton
- StatusBadge
- CountBadge
- TrendBadge
- StatCard
- DataTable
- TableToolbar
- TablePagination
- FilterPanel
- FilterDrawer
- DetailDrawer
- BaseModal
- ConfirmModal
- AccountDropdown
- NotificationDropdown
- AppearanceDropdown
- EmptyState
- LoadingState
- ErrorState

Do not change the UI.
Only move code into separate files and update imports.

Validate:
- all tables still render
- drawers still open
- modals still open
- dropdowns still open
- buttons and badges look unchanged

Phase 6: Extract pages by navigation hierarchy
Move route-level page components into pages/.

Target page structure:

src/pages/
  auth/
    LoginPage.tsx
    ForgotPasswordPage.tsx

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

Rules:
- Each page file should contain only one main page component.
- Page files should compose reusable components.
- Do not keep reusable tables, cards, modals, or drawers inside page files.
- Do not change the page design.
- Do not create blank pages.

Validate:
- every navigation item opens the correct page
- primary nav click selects first child page
- no placeholder module page appears
- breadcrumbs show full names
- login routes to Dashboard > Dashboard

Phase 7: Move data and configuration
Move data and configuration out of components.

Create:

src/data/
  navigation/
    primaryNavigation.ts
    secondaryNavigation.ts
    routeMap.ts

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

Rules:
- Navigation must be config-driven.
- Table schemas must be config-driven.
- Mock data must not live inside App.tsx.
- Do not change visible labels or table headers.

Validate:
- navigation still works
- tables still show the same columns
- mock data still appears
- no table header changed

Phase 8: CSS cleanup
Remove inline CSS and move styling into CSS files.

Check for:
- style={{ ... }}
- style="..."
- const styles = { ... }
- hardcoded visual values inside components
- repeated className patterns that should become reusable classes

Move styles into:

src/styles/
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

Rules:
- No inline style attributes should remain.
- No visual style objects should remain in components.
- Dynamic visual states should use class toggles.
- Use CSS variables/design tokens.
- Preserve current design exactly.
- Do not introduce new visual styles.

Allowed exception:
- SVG path fill colors may remain inside the official SVG file if required.

Validate:
- app still looks the same
- theme switching works
- dark mode works
- font selector works
- font size selector works
- animations still work
- no inline styles remain except SVG path colors if unavoidable

Phase 9: Routing cleanup
Centralize routes.

Create:
src/app/routes.tsx
src/app/routeGuards.ts

Rules:
- /login opens LoginPage
- after login, route to Dashboard > Dashboard
- logout redirects to /login
- top-left logo routes to Dashboard > Dashboard
- primary navigation click selects first valid secondary page
- no placeholder module page
- no single-item unnecessary secondary navigation
- breadcrumb shows full names

Validate:
- login works
- logout works
- logo click works
- direct route works
- breadcrumbs work
- active nav states work

Phase 10: Documentation
Create practical developer handoff documentation.

Create:

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

Documentation must explain:
- project overview
- folder structure
- routing
- navigation
- page/component/data separation
- design system
- theme system
- table pattern
- drawer pattern
- modal pattern
- auth flow
- how to add a new page
- how to add a new table
- how to add a new navigation item
- how to follow the component system

Phase 11: Final validation
Run a full check.

Confirm:
- app builds successfully
- no page is missing
- no placeholder page remains
- every file has one main component
- App.tsx is small and only controls app providers/routing
- reusable components are separated
- page files follow navigation hierarchy
- CSS is moved into CSS files
- no inline styles remain
- logo works
- login lands on Dashboard > Dashboard
- logout returns to login
- top-left logo routes to Dashboard > Dashboard
- notification dropdown works
- account dropdown works
- appearance dropdown works
- themes work
- dark mode works
- font size presets work
- tables render correctly
- drawers open correctly
- modals open correctly
- breadcrumb names are not truncated

Best-practice rules:
- Keep one main component per file.
- Keep pages route-focused.
- Keep components reusable.
- Keep data outside UI components.
- Keep CSS outside JSX.
- Keep routing centralized.
- Keep navigation config-driven.
- Keep documentation updated.
- Do not duplicate UI logic.
- Do not create temporary files like FinalPage, NewComponent, TestComponent, or Copy.

Golden rules:
- Do not redesign the UI.
- Do not change approved visual design.
- Do not remove features.
- Do not rename navigation.
- Do not change table headers.
- Do not break login/logout.
- Do not break themes.
- Do not break dark mode.
- Do not break responsive behavior.
- Do not make one giant commit if avoidable.
- Keep the app buildable after every phase.
- Stop and report if a phase introduces build errors.

Final output required after each phase:
1. What changed
2. Files created
3. Files modified
4. Build status
5. Any risks or unresolved issues
6. Next recommended phase

Final output required after all phases:
1. Final folder structure
2. List of extracted pages
3. List of extracted components
4. List of extracted data/config files
5. List of CSS files
6. List of documentation files
7. Confirmation that the app builds
8. Confirmation that no inline styles remain
9. Confirmation that App.tsx is cleaned
10. Remaining issues, if any