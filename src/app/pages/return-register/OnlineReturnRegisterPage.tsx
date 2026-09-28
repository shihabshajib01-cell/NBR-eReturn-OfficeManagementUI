import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import { onlineRetRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../modulePageUtils";
import { ROW_VIEW, VIEW } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function OnlineReturnRegisterPage() {
  const kpis = buildPageKpis(onlineRetRows, {
    totalLabel: "Total Returns",
    statusField: "status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Approved", label: "Approved", tone: "success" },
      { value: "Verified", label: "Verified", tone: "neutral" },
    ],
  });

  const cfg: PageCfg = {
    title: "Online Return Register",
    titleKey: "onlineReturnRegister.title",
    desc: "Track online return submissions by taxpayer, type, year, and payment status.",
    descKey: "onlineReturnRegister.desc",
    cols: [...CIRCLE_TIN_NAME, fc("ay", "Assessment Year", { headerKey: "headers.assessmentYear" }), fc("return_type", "Return Type", { headerKey: "headers.returnType" }), fc("submission_date", "Submission Date", { headerKey: "headers.submissionDate" }), fc("tax_paid", "Tax Paid", { headerKey: "headers.taxPaid" }), BADGE("status", "Status")],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["ay", "return_type", "circle"], status: "status", date: "submission_date", amount: "tax_paid" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: VIEW,
    rows: onlineRetRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
