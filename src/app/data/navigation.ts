import {
  LayoutDashboard, BarChart2, FileCheck, Package, ShieldCheck, Briefcase, Settings2,
  Tag, FileX, Activity, Scale, ScrollText, Building2, ArrowUpCircle, Landmark,
  List, ClipboardList,
  Layers, ShieldAlert, FileText, FileCheckIcon, FileWarning, FileSearch,
  BookOpen, Archive, CloudUpload, HardDrive, BadgeCheck, FilePen,
  CopyCheck, MapPinOff, Network, FolderX, Ban, ListChecks,
  ArrowLeftRight, Receipt, CreditCard, KeyRound, Rows3,
  Notebook, BadgeInfo, Globe, History, FileStack, FolderOpen,
} from "lucide-react";

// LucideIcon type for navigation
type LucideIcon = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}>;

// Navigation structure types
export interface ThirdNavDef {
  id: string;
  label: string;
  labelKey?: string;
  icon?: LucideIcon;
}

export interface SubNavDef {
  id: string;
  label: string;
  labelKey?: string;
  icon?: LucideIcon;
  children?: ThirdNavDef[];
}

export interface MainNavDef {
  id: string;
  label: string;
  labelKey?: string;
  icon: LucideIcon;
  children: SubNavDef[];
}

export const NAVIGATION: MainNavDef[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    labelKey: "navigation.dashboard.main",
    icon: LayoutDashboard,
    children: [
      { id: "dashboard-main", label: "Dashboard", labelKey: "navigation.dashboard.dashboard", icon: LayoutDashboard },
      { id: "psr-dashboard", label: "PSR Dashboard", labelKey: "navigation.dashboard.psrDashboard", icon: ShieldAlert },
      { id: "combined-dashboard", label: "Double Entry Dashboard", labelKey: "navigation.dashboard.combinedDashboard", icon: Layers },
      { id: "combine-dashboard", label: "Combine Dashboard", labelKey: "navigation.dashboard.combineDashboard", icon: Network },
    ],
  },
  {
    id: "report",
    label: "Report",
    labelKey: "navigation.report.main",
    icon: BarChart2,
    children: [
      { id: "offline-return-report", label: "Offline Return Report", labelKey: "navigation.report.offlineReturnReport", icon: FileText },
      { id: "tax-category-report", label: "Tax Category Report", labelKey: "navigation.report.taxCategoryReport", icon: Tag },
      { id: "express-cert-disposal", label: "Express Cert. Disposal", labelKey: "navigation.report.expressCertDisposal", icon: FileCheckIcon },
      { id: "user-activity-report", label: "User Activity Report", labelKey: "navigation.report.userActivityReport", icon: Activity },
      { id: "litigation-arrear", label: "Litigation Arrear", labelKey: "navigation.report.litigationArrear", icon: Scale },
      { id: "litigation-writ-case", label: "Litigation Writ Case", labelKey: "navigation.report.litigationWritCase", icon: FileWarning },
      { id: "litigation-dept-case", label: "Litigation Dept Case", labelKey: "navigation.report.litigationDeptCase", icon: Building2 },
      { id: "litigation-taxpayer-case", label: "Litigation Taxpayer Case", labelKey: "navigation.report.litigationTaxpayerCase", icon: FileSearch },
      { id: "appeal-report", label: "Appeal Report", labelKey: "navigation.report.appealReport", icon: ArrowUpCircle },
      { id: "tribunal-report", label: "Tribunal Report", labelKey: "navigation.report.tribunalReport", icon: Landmark },
      { id: "payment-demand-report", label: "Payment & Demand Report", labelKey: "navigation.report.paymentDemandReport", icon: Briefcase },
      { id: "register-5-report", label: "Register-5 Report", labelKey: "navigation.report.register5Report", icon: List },
    ],
  },
  {
    id: "return-register",
    label: "Return Register",
    labelKey: "navigation.returnRegister.main",
    icon: FileCheck,
    children: [
      { id: "return-view-approval", label: "Return View & Approval", labelKey: "navigation.returnRegister.returnViewApproval", icon: BookOpen },
      { id: "online-return-register", label: "Online Return Register", labelKey: "navigation.returnRegister.onlineReturnRegister", icon: Archive },
      { id: "offline-return-register", label: "Offline Return Register", labelKey: "navigation.returnRegister.offlineReturnRegister", icon: FileText },
      { id: "online-archive", label: "Online Archive", labelKey: "navigation.returnRegister.onlineArchive", icon: CloudUpload },
    ],
  },
  {
    id: "register-stock",
    label: "Register & Stock",
    labelKey: "navigation.registerStock.main",
    icon: Package,
    children: [
      { id: "register-4", label: "Register-4", labelKey: "navigation.registerStock.register4", icon: HardDrive },
      { id: "stock-register", label: "Stock Register", labelKey: "navigation.registerStock.stockRegister", icon: Package },
      { id: "tax-registry", label: "Tax Registry", labelKey: "navigation.registerStock.taxRegistry", icon: BadgeCheck },
      { id: "register-5", label: "Register-5", labelKey: "navigation.registerStock.register5", icon: CopyCheck },
      { id: "register-5-approval", label: "Register-5 Approval", labelKey: "navigation.registerStock.register5Approval", icon: FileCheck },
    ],
  },
  {
    id: "psr-verification",
    label: "PSR & Verification",
    labelKey: "navigation.psrVerification.main",
    icon: ShieldCheck,
    children: [
      { id: "psr-approval", label: "PSR Approval", labelKey: "navigation.psrVerification.psrApproval", icon: BadgeCheck },
      { id: "psr-edit-request", label: "PSR Edit Request", labelKey: "navigation.psrVerification.psrEditRequest", icon: FilePen },
      { id: "double-entry-status", label: "Double Entry Status", labelKey: "navigation.psrVerification.doubleEntryStatus", icon: CopyCheck },
      { id: "double-entry-verification", label: "Double Entry Verification", labelKey: "navigation.psrVerification.doubleEntryVerification", icon: ShieldCheck },
      { id: "psr-dormant", label: "PSR Dormant", labelKey: "navigation.psrVerification.psrDormant", icon: MapPinOff },
    ],
  },
  {
    id: "misfiled-returns",
    label: "Misfiled Returns",
    labelKey: "navigation.misfiledReturns.main",
    icon: FolderX,
    children: [
      { id: "invalid-list", label: "Invalid List", labelKey: "navigation.misfiledReturns.invalidList", icon: Ban },
      { id: "approval-list", label: "Approval List", labelKey: "navigation.misfiledReturns.approvalList", icon: ListChecks },
      { id: "transfer-history", label: "Transfer History", labelKey: "navigation.misfiledReturns.transferHistory", icon: ArrowLeftRight },
    ],
  },
  {
    id: "case-financial",
    label: "Case & Financial Management",
    labelKey: "navigation.caseFinancial.main",
    icon: Briefcase,
    children: [
      {
        id: "litigation-management",
        label: "Litigation Management",
        labelKey: "navigation.caseFinancial.litigationManagement",
        icon: Scale,
        children: [
          { id: "litigation-arrear-approval", label: "Arrear Approval", labelKey: "navigation.caseFinancial.arrearApproval", icon: Receipt },
          { id: "litigation-writ-approval", label: "Writ Case Approval", labelKey: "navigation.caseFinancial.writCaseApproval", icon: FileWarning },
          { id: "litigation-dept-approval", label: "Dept Case Approval", labelKey: "navigation.caseFinancial.deptCaseApproval", icon: FileSearch },
          { id: "litigation-taxpayer-approval", label: "Taxpayer Case Approval", labelKey: "navigation.caseFinancial.taxpayerCaseApproval", icon: FileText },
        ],
      },
      {
        id: "appeal-register",
        label: "Appeal Register",
        labelKey: "navigation.caseFinancial.appealRegister",
        icon: ArrowUpCircle,
        children: [
          { id: "appeal-reg-view", label: "Appeal Register View", labelKey: "navigation.caseFinancial.appealRegisterView", icon: BookOpen },
          { id: "appeal-approval", label: "Appeal Approval", labelKey: "navigation.caseFinancial.appealApproval", icon: BadgeCheck },
        ],
      },
      {
        id: "tribunal-register",
        label: "Tribunal Register",
        labelKey: "navigation.caseFinancial.tribunalRegister",
        icon: Landmark,
        children: [
          { id: "tribunal-reg-view", label: "Tribunal Register View", labelKey: "navigation.caseFinancial.tribunalRegisterView", icon: BookOpen },
          { id: "tribunal-approval", label: "Tribunal Approval", labelKey: "navigation.caseFinancial.tribunalApproval", icon: BadgeCheck },
        ],
      },
      {
        id: "demand-payment",
        label: "Demand & Payment",
        labelKey: "navigation.caseFinancial.demandPayment",
        icon: CreditCard,
        children: [
          { id: "demand-entry", label: "Entry", labelKey: "navigation.caseFinancial.entry", icon: FilePen },
          { id: "taxpayer-ledger", label: "Taxpayer Ledger", labelKey: "navigation.caseFinancial.taxpayerLedger", icon: Receipt },
          { id: "demand-approval", label: "Approval", labelKey: "navigation.caseFinancial.approval", icon: BadgeCheck },
          { id: "refund-adjustment", label: "Refund & Adjustment", labelKey: "navigation.caseFinancial.refundAdjustment", icon: ArrowLeftRight },
        ],
      },
    ],
  },
  {
    id: "audit",
    label: "Audit",
    labelKey: "navigation.audit.main",
    icon: FileSearch,
    children: [
      { id: "audit-overview", label: "Audit Overview", labelKey: "navigation.audit.auditOverview", icon: LayoutDashboard },
      { id: "initiate-audit", label: "Initiate Audit", labelKey: "navigation.audit.initiateAudit", icon: ClipboardList },
      { id: "audit-candidates", label: "Audit Candidates", labelKey: "navigation.audit.auditCandidates", icon: BadgeCheck },
      { id: "all-taxpayers", label: "All Taxpayers", labelKey: "navigation.audit.allTaxpayers", icon: FileText },
      { id: "risk-cases", label: "Risk Cases", labelKey: "navigation.audit.riskCases", icon: ShieldAlert },
      { id: "control-data-quality", label: "Control & Data Quality", labelKey: "navigation.audit.controlDataQuality", icon: FileWarning },
      { id: "second-review", label: "Second Review", labelKey: "navigation.audit.secondReview", icon: BadgeCheck },
      { id: "rules-governance", label: "Rules & Governance", labelKey: "navigation.audit.rulesGovernance", icon: Settings2 },
      { id: "reconciliation", label: "Reconciliation", labelKey: "navigation.audit.reconciliation", icon: ArrowLeftRight },
      { id: "audit-trail", label: "Audit Trail", labelKey: "navigation.audit.auditTrail", icon: History },
    ],
  },
  {
    id: "administration",
    label: "Administration & Requests",
    labelKey: "navigation.administration.main",
    icon: Settings2,
    children: [
      {
        id: "certificate-req",
        label: "Certificate Requests",
        labelKey: "navigation.administration.certificateRequests",
        icon: FileCheck,
        children: [
          { id: "data-entry-request", label: "Data Entry Request", labelKey: "navigation.administration.dataEntryRequest", icon: FilePen },
          { id: "approval-request", label: "Approval Request", labelKey: "navigation.administration.approvalRequest", icon: BadgeCheck },
          { id: "edit-request", label: "Edit Request", labelKey: "navigation.administration.editRequest", icon: FilePen },
          { id: "disposal-history", label: "Disposal History", labelKey: "navigation.administration.disposalHistory", icon: History },
        ],
      },
      { id: "user-management", label: "User Management", labelKey: "navigation.administration.userManagement", icon: KeyRound },
      { id: "role-management", label: "Role Management", labelKey: "navigation.administration.roleManagement", icon: ShieldCheck },
      { id: "permission-list", label: "Permission List", labelKey: "navigation.administration.permissionList", icon: ListChecks },
      { id: "special-registration", label: "Special Registration List", labelKey: "navigation.administration.specialRegistrationList", icon: Notebook },
      { id: "time-extension", label: "Time Extension", labelKey: "navigation.administration.timeExtension", icon: History },
      { id: "audit-selection", label: "Audit Selection", labelKey: "navigation.administration.auditSelection", icon: BadgeInfo },
    ],
  },
];

export const REPORT_META: Record<string, { icon: LucideIcon; category: string }> = {
  "offline-return-report": { icon: ClipboardList, category: "Returns" },
  "tax-category-report": { icon: Tag, category: "Tax" },
  "express-cert-disposal": { icon: FileX, category: "Certificate" },
  "user-activity-report": { icon: Activity, category: "Activity" },
  "litigation-arrear": { icon: Scale, category: "Litigation" },
  "litigation-writ-case": { icon: ScrollText, category: "Litigation" },
  "litigation-dept-case": { icon: Building2, category: "Litigation" },
  "litigation-taxpayer-case": { icon: ClipboardList, category: "Litigation" },
  "appeal-report": { icon: ArrowUpCircle, category: "Appeals" },
  "tribunal-report": { icon: Landmark, category: "Tribunal" },
  "payment-demand-report": { icon: Briefcase, category: "Financial" },
  "register-5-report": { icon: List, category: "Register" },
};

export const ASSESSMENT_YEARS = ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"];

export const TAX_CIRCLES = [
  "Circle-1",
  "Circle-1",
  "Circle-1",
  "Circle-1",
  "Circle-1",
  "Circle-1",
  "Circle-1",
  "Circle-1",
];

export const NAV_DISPLAY_LABEL: Record<string, string> = {
  dashboard: "Dashboard",
  report: "Report",
  "return-register": "Return Reg.",
  "register-stock": "Reg. & Stock",
  "psr-verification": "PSR & Verif.",
  "misfiled-returns": "Misfiled",
  "case-financial": "Case & Fin.",
  audit: "Audit",
  administration: "Admin & Req.",
};