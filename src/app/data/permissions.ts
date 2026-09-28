export interface PermissionItem {
  id: string;
  label: string;
  labelKey?: string;
  // Extended optional fields — existing code is unaffected
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  serviceName?: string;
  accessLabel?: "PUBLIC" | "AUTH" | "AUTHORIZE";
  status?: "Active" | "Inactive";
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface PermGroupDef { id: string; label: string; labelKey?: string; permissions: PermissionItem[]; }

export const PERM_GROUPS: PermGroupDef[] = [
  { id: "dashboard", label: "Dashboard", labelKey: "permissions.groups.dashboard", permissions: [
    { id: "dash_view",     label: "View Dashboard",              labelKey: "permissions.items.viewDashboard",       endpoint: "/api/v1/dashboard",        method: "GET",  serviceName: "Dashboard Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "dash_psr",      label: "View PSR Dashboard",          labelKey: "permissions.items.viewPsrDashboard",    endpoint: "/api/v1/dashboard/psr",     method: "GET",  serviceName: "Dashboard Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "dash_combined", label: "View Double Entry Dashboard",  labelKey: "permissions.items.viewCombinedDashboard", endpoint: "/api/v1/dashboard/combined", method: "GET", serviceName: "Dashboard Service",      accessLabel: "AUTHORIZE", status: "Active" },
  ] },
  { id: "report", label: "Report", labelKey: "permissions.groups.report", permissions: [
    { id: "rep_offline",   label: "View Offline Return Report",  labelKey: "permissions.items.viewOfflineReturnReport",  endpoint: "/api/v1/reports/offline-return",    method: "GET",  serviceName: "Report Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "rep_taxcat",    label: "View Tax Category Report",    labelKey: "permissions.items.viewTaxCategoryReport",    endpoint: "/api/v1/reports/tax-category",      method: "GET",  serviceName: "Report Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "rep_express",   label: "View Express Cert. Disposal", labelKey: "permissions.items.viewExpressCertDisposal",  endpoint: "/api/v1/reports/express-cert",      method: "GET",  serviceName: "Certificate Service", accessLabel: "AUTHORIZE", status: "Active" },
    { id: "rep_activity",  label: "View User Activity Report",   labelKey: "permissions.items.viewUserActivityReport",   endpoint: "/api/v1/reports/user-activity",     method: "GET",  serviceName: "Report Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "rep_litigation",label: "View Litigation Reports",     labelKey: "permissions.items.viewLitigationReports",    endpoint: "/api/v1/reports/litigation",        method: "GET",  serviceName: "Litigation Service", accessLabel: "AUTHORIZE", status: "Active" },
    { id: "rep_appeal",    label: "View Appeal Report",          labelKey: "permissions.items.viewAppealReport",         endpoint: "/api/v1/reports/appeal",           method: "GET",  serviceName: "Appeal Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "rep_tribunal",  label: "View Tribunal Report",        labelKey: "permissions.items.viewTribunalReport",       endpoint: "/api/v1/reports/tribunal",         method: "GET",  serviceName: "Tribunal Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "rep_reg5",      label: "View Register-5 Report",      labelKey: "permissions.items.viewRegister5Report",      endpoint: "/api/v1/reports/register-5",       method: "GET",  serviceName: "Register Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "rep_print",     label: "Print Report",                labelKey: "permissions.items.printReport",              endpoint: "/api/v1/reports/print",            method: "POST", serviceName: "Report Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "rep_export",    label: "Export Report",               labelKey: "permissions.items.exportReport",             endpoint: "/api/v1/reports/export",           method: "POST", serviceName: "Report Service",    accessLabel: "AUTHORIZE", status: "Active" },
  ] },
  { id: "return-register", label: "Return Register", labelKey: "permissions.groups.returnRegister", permissions: [
    { id: "ret_view",     label: "View Return Register",         labelKey: "permissions.items.viewReturnRegister",        endpoint: "/api/v1/returns",                 method: "GET",  serviceName: "Return Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "ret_online",   label: "View Online Return Register",  labelKey: "permissions.items.viewOnlineReturnRegister",  endpoint: "/api/v1/returns/online",          method: "GET",  serviceName: "Return Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "ret_offline",  label: "View Offline Return Register", labelKey: "permissions.items.viewOfflineReturnRegister", endpoint: "/api/v1/returns/offline",         method: "GET",  serviceName: "Return Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "ret_archive",  label: "View Online Archive",          labelKey: "permissions.items.viewOnlineArchive",         endpoint: "/api/v1/returns/archive",         method: "GET",  serviceName: "Return Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "ret_approval", label: "Approve Return View Request",  labelKey: "permissions.items.approveReturnViewRequest",  endpoint: "/api/v1/returns/approve",         method: "POST", serviceName: "Return Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "ret_print",    label: "Print Return",                 labelKey: "permissions.items.printReturn",               endpoint: "/api/v1/returns/print",           method: "POST", serviceName: "Return Service",    accessLabel: "AUTHORIZE", status: "Active" },
  ] },
  { id: "register-stock", label: "Register & Stock", labelKey: "permissions.groups.registerStock", permissions: [
    { id: "reg_view4", label: "View Register-4",    labelKey: "permissions.items.viewRegister4",    endpoint: "/api/v1/register/reg4",      method: "GET",  serviceName: "Register Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "reg_entry", label: "Entry Form",          labelKey: "permissions.items.entryForm",        endpoint: "/api/v1/register/entry",     method: "POST", serviceName: "Register Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "reg_stock", label: "View Stock Register", labelKey: "permissions.items.viewStockRegister", endpoint: "/api/v1/register/stock",    method: "GET",  serviceName: "Register Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "reg_tax",   label: "View Tax Registry",   labelKey: "permissions.items.viewTaxRegistry",  endpoint: "/api/v1/register/tax",       method: "GET",  serviceName: "Tax Service",       accessLabel: "AUTH",      status: "Active" },
    { id: "reg_view5", label: "View Register-5",     labelKey: "permissions.items.viewRegister5",    endpoint: "/api/v1/register/reg5",      method: "GET",  serviceName: "Register Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "reg_reg5",  label: "Register-5 Approval", labelKey: "permissions.items.register5Approval", endpoint: "/api/v1/register/reg5/approve", method: "POST", serviceName: "Register Service", accessLabel: "AUTHORIZE", status: "Active" },
  ] },
  { id: "psr-verification", label: "PSR & Verification", labelKey: "permissions.groups.psrVerification", permissions: [
    { id: "psr_entry",          label: "PSR Entry",                  labelKey: "permissions.items.psrEntry",             endpoint: "/api/v1/psr/entry",              method: "POST", serviceName: "PSR Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "psr_bulk",           label: "PSR Bulk Entry",             labelKey: "permissions.items.psrBulkEntry",         endpoint: "/api/v1/psr/bulk",               method: "POST", serviceName: "PSR Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "psr_approve",        label: "PSR Approval",               labelKey: "permissions.items.psrApproval",          endpoint: "/api/v1/psr/approve",            method: "POST", serviceName: "PSR Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "psr_edit",           label: "PSR Edit Request",           labelKey: "permissions.items.psrEditRequest",       endpoint: "/api/v1/psr/edit",               method: "PUT",  serviceName: "PSR Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "psr_double_status",  label: "Double Entry Status",        labelKey: "permissions.items.doubleEntryStatus",    endpoint: "/api/v1/psr/double-entry/status", method: "GET", serviceName: "PSR Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "psr_double_verify",  label: "Double Entry Verification",  labelKey: "permissions.items.doubleEntryVerification", endpoint: "/api/v1/psr/double-entry/verify", method: "POST", serviceName: "PSR Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "psr_dormant",        label: "PSR Dormant",                labelKey: "permissions.items.psrDormant",           endpoint: "/api/v1/psr/dormant",            method: "GET",  serviceName: "PSR Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "psr_jurisdiction",   label: "Out of Jurisdiction",        labelKey: "permissions.items.outOfJurisdiction",    endpoint: "/api/v1/psr/jurisdiction",       method: "GET",  serviceName: "PSR Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "psr_other_circles",  label: "Other Circles Entry",        labelKey: "permissions.items.otherCirclesEntry",    endpoint: "/api/v1/psr/other-circles",      method: "POST", serviceName: "PSR Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "psr_misfiled",       label: "Misfiled Returns",           labelKey: "permissions.items.misfiledReturns",      endpoint: "/api/v1/psr/misfiled",           method: "GET",  serviceName: "PSR Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "psr_invalid",        label: "Invalid List",               labelKey: "permissions.items.invalidList",          endpoint: "/api/v1/psr/invalid",            method: "GET",  serviceName: "PSR Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "psr_approval_list",  label: "Approval List",              labelKey: "permissions.items.approvalList",         endpoint: "/api/v1/psr/approval-list",      method: "GET",  serviceName: "PSR Service",       accessLabel: "AUTHORIZE", status: "Active" },
    { id: "psr_transfer",       label: "Transfer History",           labelKey: "permissions.items.transferHistory",      endpoint: "/api/v1/psr/transfer-history",   method: "GET",  serviceName: "PSR Service",       accessLabel: "AUTHORIZE", status: "Active" },
  ] },
  { id: "case-financial", label: "Case & Financial Management", labelKey: "permissions.groups.caseFinancial", permissions: [
    { id: "case_litigation",       label: "Litigation Management",  labelKey: "permissions.items.litigationManagement",  endpoint: "/api/v1/case/litigation",          method: "GET",  serviceName: "Case Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_arrear",           label: "Arrear Approval",        labelKey: "permissions.items.arrearApproval",        endpoint: "/api/v1/case/arrear/approve",      method: "POST", serviceName: "Case Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_writ",             label: "Writ Case Approval",     labelKey: "permissions.items.writCaseApproval",      endpoint: "/api/v1/case/writ/approve",        method: "POST", serviceName: "Case Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_dept",             label: "Dept Case Approval",     labelKey: "permissions.items.deptCaseApproval",      endpoint: "/api/v1/case/dept/approve",        method: "POST", serviceName: "Case Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_taxpayer_case",    label: "Taxpayer Case Approval", labelKey: "permissions.items.taxpayerCaseApproval",  endpoint: "/api/v1/case/taxpayer/approve",    method: "POST", serviceName: "Case Service",    accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_appeal",           label: "Appeal Register",        labelKey: "permissions.items.appealRegister",        endpoint: "/api/v1/case/appeal",              method: "GET",  serviceName: "Appeal Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_appeal_approve",   label: "Appeal Approval",        labelKey: "permissions.items.appealApproval",        endpoint: "/api/v1/case/appeal/approve",      method: "POST", serviceName: "Appeal Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_tribunal",         label: "Tribunal Register",      labelKey: "permissions.items.tribunalRegister",      endpoint: "/api/v1/case/tribunal",            method: "GET",  serviceName: "Tribunal Service", accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_tribunal_approve", label: "Tribunal Approval",      labelKey: "permissions.items.tribunalApproval",      endpoint: "/api/v1/case/tribunal/approve",    method: "POST", serviceName: "Tribunal Service", accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_demand",           label: "Demand And Payment",     labelKey: "permissions.items.demandAndPayment",      endpoint: "/api/v1/case/demand",              method: "GET",  serviceName: "Financial Service", accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_entry",            label: "Entry",                  labelKey: "permissions.items.entry",                 endpoint: "/api/v1/case/entry",               method: "POST", serviceName: "Financial Service", accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_ledger",           label: "Taxpayer Ledger",        labelKey: "permissions.items.taxpayerLedger",        endpoint: "/api/v1/case/ledger",              method: "GET",  serviceName: "Financial Service", accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_approve",          label: "Approval",               labelKey: "permissions.items.approval",              endpoint: "/api/v1/case/approve",             method: "POST", serviceName: "Financial Service", accessLabel: "AUTHORIZE", status: "Active" },
    { id: "case_refund",           label: "Refund & Adjustment",    labelKey: "permissions.items.refundAdjustment",      endpoint: "/api/v1/case/refund",              method: "POST", serviceName: "Financial Service", accessLabel: "AUTHORIZE", status: "Active" },
  ] },
  { id: "administration", label: "Administration & Requests", labelKey: "permissions.groups.administration", permissions: [
    { id: "admin_cert",        label: "Certificate Requests",       labelKey: "permissions.items.certificateRequests",     endpoint: "/api/v1/admin/certificates",        method: "GET",  serviceName: "Admin Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "admin_data_entry",  label: "Data Entry Request",         labelKey: "permissions.items.dataEntryRequest",        endpoint: "/api/v1/admin/data-entry",          method: "POST", serviceName: "Admin Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "admin_approval",    label: "Approval Request",           labelKey: "permissions.items.approvalRequest",         endpoint: "/api/v1/admin/approval",            method: "POST", serviceName: "Admin Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "admin_edit",        label: "Edit Request",               labelKey: "permissions.items.editRequest",             endpoint: "/api/v1/admin/edit",                method: "PUT",  serviceName: "Admin Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "admin_disposal",    label: "Disposal History",           labelKey: "permissions.items.disposalHistory",         endpoint: "/api/v1/admin/disposal-history",    method: "GET",  serviceName: "Admin Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "admin_users",       label: "User Management",            labelKey: "permissions.items.userManagement",          endpoint: "/api/v1/admin/users",               method: "GET",  serviceName: "User Service",   accessLabel: "AUTHORIZE", status: "Active" },
    { id: "admin_users_add",   label: "Add / Release User",         labelKey: "permissions.items.addReleaseUser",          endpoint: "/api/v1/admin/users",               method: "POST", serviceName: "User Service",   accessLabel: "AUTHORIZE", status: "Active" },
    { id: "admin_users_reassign", label: "Re-Assign User",         labelKey: "permissions.items.reassignUser",            endpoint: "/api/v1/admin/users/reassign",      method: "PUT",  serviceName: "User Service",   accessLabel: "AUTHORIZE", status: "Active" },
    { id: "admin_special_reg", label: "Special Registration List",  labelKey: "permissions.items.specialRegistrationList", endpoint: "/api/v1/admin/special-registration", method: "GET", serviceName: "Admin Service",  accessLabel: "AUTH",      status: "Active" },
    { id: "admin_extension",   label: "Time Extension",             labelKey: "permissions.items.timeExtension",           endpoint: "/api/v1/admin/time-extension",      method: "POST", serviceName: "Admin Service",  accessLabel: "AUTHORIZE", status: "Active" },
    { id: "admin_audit",       label: "Audit Selection",            labelKey: "permissions.items.auditSelection",          endpoint: "/api/v1/admin/audit-selection",     method: "POST", serviceName: "Audit Service",  accessLabel: "AUTHORIZE", status: "Active" },
  ] },
];

export const ALL_PERM_IDS = PERM_GROUPS.flatMap((g) => g.permissions.map((p) => p.id));
