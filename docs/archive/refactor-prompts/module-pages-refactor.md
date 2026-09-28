Continue the safe refactor. Do this phase only: break down ModulePages.tsx.

Do not redesign the UI.
Do not change the visual design.
Do not change navigation names.
Do not change routes.
Do not change table headers.
Do not change data values.
Do not change CSS yet.
Do not extract inline styles in this phase.
Do not refactor LoginPage, UserManagementPage, RoleManagementPage, or App.tsx in this phase unless import/export updates are required.
Do not create placeholder pages.
Do not remove any feature.

Current issue:
src/app/components/ModulePages.tsx is still too large and has become a second monolith. It contains multiple route-level pages and module page logic in one file.

Goal:
Move every route-level page/component currently inside ModulePages.tsx into the correct page folder based on the existing navigation hierarchy.

Rules:
- Each page file must contain only one main page component.
- Keep the UI exactly the same.
- Keep the current table layouts exactly the same.
- Keep all buttons, filters, drawers, pagination, status badges, and action behavior working.
- Update imports and exports carefully.
- Keep the app buildable after this phase.
- ModulePages.tsx should be removed if no longer needed, or reduced to an index/export-only file.
- Do not leave duplicate page components in ModulePages.tsx and page folders.
- Do not move shared table/card/button components yet unless required to make the page imports work.

Create/use this page structure:

src/app/pages/dashboard/
  DashboardPage.tsx
  PSRDashboardPage.tsx
  CombinedDashboardPage.tsx

src/app/pages/report/
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

src/app/pages/return-register/
  ReturnViewApprovalPage.tsx
  OnlineReturnRegisterPage.tsx
  OfflineReturnRegisterPage.tsx
  OnlineArchivePage.tsx

src/app/pages/register-stock/
  RegisterFourListPage.tsx
  StockRegisterPage.tsx
  TaxRegistryPage.tsx
  RegisterFivePage.tsx

src/app/pages/psr-verification/
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

src/app/pages/case-financial-management/litigation-management/
  ArrearApprovalPage.tsx
  WritCaseApprovalPage.tsx
  DeptCaseApprovalPage.tsx
  TaxpayerCaseApprovalPage.tsx

src/app/pages/case-financial-management/appeal-register/
  AppealRegisterPage.tsx
  AppealApprovalPage.tsx

src/app/pages/case-financial-management/tribunal-register/
  TribunalRegisterPage.tsx
  TribunalApprovalPage.tsx

src/app/pages/case-financial-management/demand-payment/
  DemandRegisterPage.tsx
  TaxpayerLedgerPage.tsx
  PaymentApprovalPage.tsx

src/app/pages/case-financial-management/refund-adjustment/
  RefundAdjustmentPage.tsx

src/app/pages/administration-requests/certificate-requests/
  DataEntryRequestPage.tsx
  ApprovalRequestPage.tsx
  EditRequestPage.tsx
  DisposalHistoryPage.tsx

src/app/pages/administration-requests/
  SpecialRegistrationListPage.tsx
  TimeExtensionPage.tsx
  AuditSelectionPage.tsx

Important:
UserManagementPage.tsx and RoleManagementPage.tsx already exist. Do not rewrite them in this phase. Only update imports/routes if needed.

Execution steps:
1. Open ModulePages.tsx.
2. Identify every exported or internal page-level component.
3. Move each page-level component into the matching folder above.
4. Preserve all JSX, props, logic, mock references, and behavior.
5. Create index.ts files only if helpful for cleaner imports.
6. Update App.tsx or route imports only where needed.
7. Remove moved page code from ModulePages.tsx.
8. If ModulePages.tsx is still required, leave it as a small compatibility export file only.
9. Run build/typecheck.
10. Fix only import/export errors caused by this move.

Do not:
- change design
- change CSS
- rename pages
- rename navigation labels
- simplify tables
- remove actions
- replace components with placeholders
- add new visual patterns
- do unrelated cleanup

Validation checklist:
- App builds successfully.
- Sidebar still works.
- Primary navigation still works.
- Secondary navigation still works.
- Breadcrumbs still work.
- Dashboard pages still load.
- Report pages still load.
- Return Register pages still load.
- Register & Stock pages still load.
- PSR & Verification pages still load.
- Case & Financial Management pages still load.
- Administration & Requests pages still load.
- No blank placeholder pages appear.
- No duplicate page components remain in ModulePages.tsx.
- ModulePages.tsx is now removed or reduced to a very small export-only file.

After completion, report:
1. Files created
2. Files modified
3. Components/pages moved out of ModulePages.tsx
4. What remains inside ModulePages.tsx
5. Whether the app builds
6. Any broken imports fixed
7. Any remaining risks
8. Next recommended phase

Stop after this phase.