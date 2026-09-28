You are working on the latest React + TypeScript Government Office Management UI project.

The UI is mostly working now, but the codebase is still not clean enough for development handoff.

Your task is to audit and then safely clean the codebase.

Do not redesign the UI.
Do not change the visual design.
Do not change approved layouts.
Do not change navigation labels.
Do not change table headers.
Do not change page content.
Do not remove features.
Do not create placeholder pages.
Do not do a one-shot rewrite.

Work safely in phases.
After each phase, stop and report.
Do not continue to the next phase until I approve.

Current known problems:
1. ModulePages.tsx is still too large and contains many shared components.
2. Inline CSS still exists in many files.
3. Some reusable components are duplicated.
4. Some page files are still in the wrong folder.
5. Routing and navigation IDs may not match.
6. src/imports/pasted_text contains old prompt/report files and should not be inside app source.
7. App.tsx is improved but still should be checked.
8. CSS architecture needs final cleanup.
9. Developer handoff needs cleaner documentation.

Phase 1 only: Deep audit. Do not modify files.

Inspect the project and report:

1. File structure issues
2. App.tsx line count and responsibilities
3. ModulePages.tsx line count and everything still inside it
4. Page files still in the wrong folder
5. Component files that contain more than one main component
6. Inline style count by file
7. Hardcoded color count by file
8. Duplicate components or duplicate UI patterns
9. Duplicate helper functions such as rgba()
10. Routing/navigation mismatch
11. Unused or dead files
12. Old prompt/report files inside src/
13. CSS files and whether they are imported correctly
14. Theme/dark-mode token issues
15. Build/import risks
16. Top 10 risks before cleanup
17. Safest cleanup order

Important:
Do not edit anything in Phase 1.
Only report the findings.

After Phase 1, wait for my approval.

Target final structure:

src/
  app/
    App.tsx
    AppRouter.tsx

    data/
      navigation.ts
      routes.ts
      themes.ts
      fonts.ts
      mockData.ts
      reportConfigs.ts
      constants.ts

    hooks/
      useAuth.ts
      useNavigation.ts
      useAppearance.ts
      useNotifications.ts
      useTableState.ts
      useDrawer.ts
      useModal.ts

    layouts/
      AppShell.tsx
      AuthLayout.tsx
      PageLayout.tsx

    pages/
      auth/
        LoginPage.tsx

      dashboard/
        DashboardPage.tsx
        PSRDashboardPage.tsx
        CombinedDashboardPage.tsx

      report/
        ReportViewPage.tsx

      return-register/
        ReturnViewApprovalPage.tsx
        OnlineReturnRegisterPage.tsx
        OfflineReturnRegisterPage.tsx
        OnlineArchivePage.tsx

      register-stock/
        Register4ListPage.tsx
        StockRegisterPage.tsx
        TaxRegistryPage.tsx
        Register5Page.tsx
        Register5ApprovalPage.tsx

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

    components/
      navigation/
      auth/
      account/
      notifications/
      appearance/
      tables/
      filters/
      drawers/
      modals/
      cards/
      forms/
      buttons/
      badges/
      states/
      reports/
      users/
      roles/
      permissions/

    utils/
      colors.ts
      formatDate.ts
      formatCurrency.ts
      formatNumber.ts
      routeHelpers.ts
      tableHelpers.ts

  assets/
    logos/
    images/

  styles/
    index.css
    tokens.css
    theme.css
    typography.css
    globals.css
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

docs/
  SYSTEM_ARCHITECTURE.md
  FILE_STRUCTURE.md
  ROUTING_GUIDE.md
  COMPONENT_GUIDE.md
  DESIGN_SYSTEM_GUIDE.md
  TABLE_PATTERN_GUIDE.md
  NAVIGATION_GUIDE.md
  AUTH_FLOW_GUIDE.md
  CLEANUP_REPORT.md
  archive/

After the audit, recommend the next safest phase.

Stop after Phase 1.