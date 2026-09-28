import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import { offlineRetRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../modulePageUtils";
import { ROW_VIEW, VIEW } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function OfflineReturnRegisterPage() {
  const kpis = buildPageKpis(offlineRetRows, {
    totalLabel: "Total Returns",
    statusField: "status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Approved", label: "Approved", tone: "success" },
      { value: "Verified", label: "Verified", tone: "neutral" },
    ],
  });

  const cfg: PageCfg = {
    title: "Offline Return Register",
    titleKey: "offlineReturnRegister.title",
    desc: "Track offline return entries by circle, type, year, and payment status.",
    descKey: "offlineReturnRegister.desc",
    cols: [...CIRCLE_TIN_NAME, fc("ay", "Asst. Year", { headerKey: "headers.assessmentYear" }), fc("challan_no", "Challan No.", { headerKey: "headers.challanNo" }), fc("bank_name", "Bank", { headerKey: "headers.bankName" }), fc("submission_date", "Submission Date", { headerKey: "headers.submissionDate" }), fc("tax_paid", "Tax Paid", { headerKey: "headers.taxPaid" }), BADGE("status", "Status")],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["ay", "challan_no", "bank_name"], status: "status", date: "submission_date", amount: "tax_paid" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: VIEW,
    rows: offlineRetRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
