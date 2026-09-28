import { lazy } from "react";
import { createBrowserRouter, redirect, useParams } from "react-router";
import { AppRoot } from "./layouts/AppRoot";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { SpecialRegistrationPublicPage } from "./pages/public/SpecialRegistrationPublicPage";
import { SpecialRegistrationInstructionsPage } from "./pages/public/SpecialRegistrationInstructionsPage";

// ─── Dashboard pages loaded eagerly (default landing route — lazy causes proxy fetch errors) ──
import { DashboardPage }         from "./pages/dashboard/DashboardPage";
import { PSRDashboardPage }      from "./pages/dashboard/PSRDashboardPage";
import { CombinedDashboardPage } from "./pages/dashboard/CombinedDashboardPage";
import { CombineDashboardPage }  from "./pages/dashboard/CombineDashboardPage";

// ─── Lazy page components ─────────────────────────────────────────────────────
// Suspense is handled by MainContentArea — no per-route wrappers needed.
const ReportViewPage           = lazy(() => import("./pages/report/ReportViewPage").then(m => ({ default: m.ReportViewPage })));
const ReturnViewApprovalPage   = lazy(() => import("./pages/return-register/ReturnViewApprovalPage").then(m => ({ default: m.ReturnViewApprovalPage })));
const OnlineReturnRegisterPage = lazy(() => import("./pages/return-register/OnlineReturnRegisterPage").then(m => ({ default: m.OnlineReturnRegisterPage })));
const OfflineReturnRegisterPage= lazy(() => import("./pages/return-register/OfflineReturnRegisterPage").then(m => ({ default: m.OfflineReturnRegisterPage })));
const OnlineArchivePage        = lazy(() => import("./pages/return-register/OnlineArchivePage").then(m => ({ default: m.OnlineArchivePage })));
const Register4ListPage        = lazy(() => import("./pages/register-stock/Register4ListPage").then(m => ({ default: m.Register4ListPage })));
const StockRegisterPage        = lazy(() => import("./pages/register-stock/StockRegisterPage").then(m => ({ default: m.StockRegisterPage })));
const TaxRegistryPage          = lazy(() => import("./pages/register-stock/TaxRegistryPage").then(m => ({ default: m.TaxRegistryPage })));
const Register5Page            = lazy(() => import("./pages/register-stock/Register5Page").then(m => ({ default: m.Register5Page })));
const PSRApprovalPage          = lazy(() => import("./pages/psr-verification/PSRApprovalPage").then(m => ({ default: m.PSRApprovalPage })));
const PSREditRequestPage       = lazy(() => import("./pages/psr-verification/PSREditRequestPage").then(m => ({ default: m.PSREditRequestPage })));
const DoubleEntryStatusPage    = lazy(() => import("./pages/psr-verification/DoubleEntryStatusPage").then(m => ({ default: m.DoubleEntryStatusPage })));
const DoubleEntryVerificationPage = lazy(() => import("./pages/psr-verification/DoubleEntryVerificationPage").then(m => ({ default: m.DoubleEntryVerificationPage })));
const PSRDormantPage           = lazy(() => import("./pages/psr-verification/PSRDormantPage").then(m => ({ default: m.PSRDormantPage })));
const InvalidListPage          = lazy(() => import("./pages/psr-verification/InvalidListPage").then(m => ({ default: m.InvalidListPage })));
const ApprovalListPage         = lazy(() => import("./pages/psr-verification/ApprovalListPage").then(m => ({ default: m.ApprovalListPage })));
const TransferHistoryPage      = lazy(() => import("./pages/psr-verification/TransferHistoryPage").then(m => ({ default: m.TransferHistoryPage })));
const LitigationCasePage       = lazy(() => import("./pages/case-financial-management/litigation-management/LitigationCasePage").then(m => ({ default: m.LitigationCasePage })));
const AppealPage               = lazy(() => import("./pages/case-financial-management/appeal-register/AppealPage").then(m => ({ default: m.AppealPage })));
const TribunalPage             = lazy(() => import("./pages/case-financial-management/tribunal-register/TribunalPage").then(m => ({ default: m.TribunalPage })));
const DemandRegisterPage       = lazy(() => import("./pages/case-financial-management/demand-payment/DemandRegisterPage").then(m => ({ default: m.DemandRegisterPage })));
const TaxpayerLedgerPage       = lazy(() => import("./pages/case-financial-management/demand-payment/TaxpayerLedgerPage").then(m => ({ default: m.TaxpayerLedgerPage })));
const DemandApprovalPage       = lazy(() => import("./pages/case-financial-management/demand-payment/DemandApprovalPage").then(m => ({ default: m.DemandApprovalPage })));
const RefundAdjustmentPage     = lazy(() => import("./pages/case-financial-management/refund-adjustment/RefundAdjustmentPage").then(m => ({ default: m.RefundAdjustmentPage })));
const CertificateDataEntryPage     = lazy(() => import("./pages/administration-requests/certificate-requests/CertificateDataEntryPage").then(m => ({ default: m.CertificateDataEntryPage })));
const CertificateApprovalRequestPage = lazy(() => import("./pages/administration-requests/certificate-requests/CertificateApprovalRequestPage").then(m => ({ default: m.CertificateApprovalRequestPage })));
const CertificateEditRequestPage   = lazy(() => import("./pages/administration-requests/certificate-requests/CertificateEditRequestPage").then(m => ({ default: m.CertificateEditRequestPage })));
const CertificateDisposalHistoryPage = lazy(() => import("./pages/administration-requests/certificate-requests/CertificateDisposalHistoryPage").then(m => ({ default: m.CertificateDisposalHistoryPage })));
const UserManagementPage       = lazy(() => import("./pages/administration-requests/UserManagementPage").then(m => ({ default: m.UserManagementPage })));
const RoleManagementPage       = lazy(() => import("./pages/administration-requests/RoleManagementPage").then(m => ({ default: m.RoleManagementPage })));
const PermissionListPage       = lazy(() => import("./pages/administration-requests/PermissionListPage").then(m => ({ default: m.PermissionListPage })));
const SpecialRegistrationPage  = lazy(() => import("./pages/administration-requests/SpecialRegistrationPage").then(m => ({ default: m.SpecialRegistrationPage })));
const TimeExtensionPage        = lazy(() => import("./pages/administration-requests/TimeExtensionPage").then(m => ({ default: m.TimeExtensionPage })));
const AuditSelectionPage       = lazy(() => import("./pages/administration-requests/AuditSelectionPage").then(m => ({ default: m.AuditSelectionPage })));

// ─── Param-based route components ────────────────────────────────────────────
// These are stable function components — Suspense is provided by MainContentArea.

function ReportRoute() {
  const { subNav } = useParams<{ subNav: string }>();
  return <ReportViewPage reportId={subNav || ""} />;
}

function LitigationRoute() {
  const { thirdNav } = useParams<{ thirdNav: string }>();
  return <LitigationCasePage caseType={thirdNav || ""} />;
}


function Register5Route()         { return <Register5Page isApproval={false} />; }
function Register5ApprovalRoute() { return <Register5Page isApproval={true} />; }
function AppealViewRoute()        { return <AppealPage isApproval={false} />; }
function AppealApprovalRoute()    { return <AppealPage isApproval={true} />; }
function TribunalViewRoute()      { return <TribunalPage isApproval={false} />; }
function TribunalApprovalRoute()  { return <TribunalPage isApproval={true} />; }

// ─── Preloader — call once after login to warm all route chunks on idle ───────
const routeImporters = [
  () => import("./pages/report/ReportViewPage"),
  () => import("./pages/return-register/ReturnViewApprovalPage"),
  () => import("./pages/return-register/OnlineReturnRegisterPage"),
  () => import("./pages/return-register/OfflineReturnRegisterPage"),
  () => import("./pages/return-register/OnlineArchivePage"),
  () => import("./pages/register-stock/Register4ListPage"),
  () => import("./pages/register-stock/StockRegisterPage"),
  () => import("./pages/register-stock/TaxRegistryPage"),
  () => import("./pages/register-stock/Register5Page"),
  () => import("./pages/psr-verification/PSRApprovalPage"),
  () => import("./pages/psr-verification/PSREditRequestPage"),
  () => import("./pages/psr-verification/DoubleEntryStatusPage"),
  () => import("./pages/psr-verification/DoubleEntryVerificationPage"),
  () => import("./pages/psr-verification/PSRDormantPage"),
  () => import("./pages/psr-verification/InvalidListPage"),
  () => import("./pages/psr-verification/ApprovalListPage"),
  () => import("./pages/psr-verification/TransferHistoryPage"),
  () => import("./pages/case-financial-management/litigation-management/LitigationCasePage"),
  () => import("./pages/case-financial-management/appeal-register/AppealPage"),
  () => import("./pages/case-financial-management/tribunal-register/TribunalPage"),
  () => import("./pages/case-financial-management/demand-payment/DemandRegisterPage"),
  () => import("./pages/case-financial-management/demand-payment/TaxpayerLedgerPage"),
  () => import("./pages/case-financial-management/demand-payment/DemandApprovalPage"),
  () => import("./pages/case-financial-management/refund-adjustment/RefundAdjustmentPage"),
  () => import("./pages/administration-requests/certificate-requests/CertificateDataEntryPage"),
  () => import("./pages/administration-requests/certificate-requests/CertificateApprovalRequestPage"),
  () => import("./pages/administration-requests/certificate-requests/CertificateEditRequestPage"),
  () => import("./pages/administration-requests/certificate-requests/CertificateDisposalHistoryPage"),
  () => import("./pages/administration-requests/UserManagementPage"),
  () => import("./pages/administration-requests/RoleManagementPage"),
  () => import("./pages/administration-requests/PermissionListPage"),
  () => import("./pages/administration-requests/SpecialRegistrationPage"),
  () => import("./pages/administration-requests/TimeExtensionPage"),
  () => import("./pages/administration-requests/AuditSelectionPage"),
];

export function preloadAllRoutes() {
  if (typeof window === "undefined") return;
  const run = typeof requestIdleCallback !== "undefined" ? requestIdleCallback : (cb: () => void) => setTimeout(cb, 100);
  // Stagger in batches so we don't flood the network on login
  const batchSize = 5;
  routeImporters.forEach((importer, i) => {
    const delay = Math.floor(i / batchSize) * 300;
    setTimeout(() => run(() => { importer().catch(() => {}); }), delay);
  });
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  {
    path: "/special-registration/instructions",
    Component: SpecialRegistrationInstructionsPage,
  },
  {
    path: "/special-registration",
    Component: SpecialRegistrationPublicPage,
  },
  {
    path: "/",
    Component: AppRoot,
    children: [
      { index: true, loader: async () => redirect("/dashboard/dashboard-main") },

      // Parent routes — placeholder with secondary nav visible
      { path: "dashboard",       Component: PlaceholderPage },
      { path: "report",          Component: PlaceholderPage },
      { path: "return-register", Component: PlaceholderPage },
      { path: "register-stock",  Component: PlaceholderPage },
      { path: "psr-verification",Component: PlaceholderPage },
      { path: "misfiled-returns",Component: PlaceholderPage },
      { path: "case-financial",  Component: PlaceholderPage },
      { path: "administration",  Component: PlaceholderPage },

      // Dashboard
      { path: "dashboard/dashboard-main",    Component: DashboardPage },
      { path: "dashboard/psr-dashboard",     Component: PSRDashboardPage },
      { path: "dashboard/combined-dashboard",Component: CombinedDashboardPage },
      { path: "dashboard/combine-dashboard", Component: CombineDashboardPage },

      // Report
      { path: "report/:subNav", Component: ReportRoute },

      // Return Register
      { path: "return-register/return-view-approval",    Component: ReturnViewApprovalPage },
      { path: "return-register/online-return-register",  Component: OnlineReturnRegisterPage },
      { path: "return-register/offline-return-register", Component: OfflineReturnRegisterPage },
      { path: "return-register/online-archive",          Component: OnlineArchivePage },

      // Register & Stock
      { path: "register-stock/register-4",          Component: Register4ListPage },
      { path: "register-stock/stock-register",       Component: StockRegisterPage },
      { path: "register-stock/tax-registry",         Component: TaxRegistryPage },
      { path: "register-stock/register-5",           Component: Register5Route },
      { path: "register-stock/register-5-approval",  Component: Register5ApprovalRoute },

      // PSR & Verification
      { path: "psr-verification/psr-approval",             Component: PSRApprovalPage },
      { path: "psr-verification/psr-edit-request",         Component: PSREditRequestPage },
      { path: "psr-verification/double-entry-status",      Component: DoubleEntryStatusPage },
      { path: "psr-verification/double-entry-verification",Component: DoubleEntryVerificationPage },
      { path: "psr-verification/psr-dormant",              Component: PSRDormantPage },

      // Misfiled Returns
      { path: "misfiled-returns/invalid-list",     Component: InvalidListPage },
      { path: "misfiled-returns/approval-list",    Component: ApprovalListPage },
      { path: "misfiled-returns/transfer-history", Component: TransferHistoryPage },

      // Case & Financial — Litigation
      { path: "case-financial/litigation-management/:thirdNav", Component: LitigationRoute },

      // Case & Financial — Appeal Register
      { path: "case-financial/appeal-register/appeal-reg-view", Component: AppealViewRoute },
      { path: "case-financial/appeal-register/appeal-approval",  Component: AppealApprovalRoute },

      // Case & Financial — Tribunal Register
      { path: "case-financial/tribunal-register/tribunal-reg-view", Component: TribunalViewRoute },
      { path: "case-financial/tribunal-register/tribunal-approval",  Component: TribunalApprovalRoute },

      // Case & Financial — Demand & Payment
      { path: "case-financial/demand-payment/demand-entry",      Component: DemandRegisterPage },
      { path: "case-financial/demand-payment/taxpayer-ledger",   Component: TaxpayerLedgerPage },
      { path: "case-financial/demand-payment/demand-approval",   Component: DemandApprovalPage },
      { path: "case-financial/demand-payment/refund-adjustment", Component: RefundAdjustmentPage },

      // Administration — Certificate Requests
      { path: "administration/certificate-req/data-entry-request", Component: CertificateDataEntryPage },
      { path: "administration/certificate-req/approval-request",   Component: CertificateApprovalRequestPage },
      { path: "administration/certificate-req/edit-request",       Component: CertificateEditRequestPage },
      { path: "administration/certificate-req/disposal-history",   Component: CertificateDisposalHistoryPage },

      // Administration
      { path: "administration/user-management",    Component: UserManagementPage },
      { path: "administration/role-management",    Component: RoleManagementPage },
      { path: "administration/permission-list",    Component: PermissionListPage },
      { path: "administration/special-registration",Component: SpecialRegistrationPage },
      { path: "administration/time-extension",     Component: TimeExtensionPage },
      { path: "administration/audit-selection",    Component: AuditSelectionPage },
    ],
  },
], {
  // Keep BrowserRouter aligned with Vite's deployment base ("/" locally,
  // repository subpath on GitHub Pages).
  basename: import.meta.env.BASE_URL,
});
