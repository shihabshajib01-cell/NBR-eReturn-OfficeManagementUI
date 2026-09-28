import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import {
  reg5Rows,
  CIRCLE_TIN_NAME,
  fc,
  BADGE,
  BASE_FILTERS,
} from "../modulePageUtils";
import { ROW_VIEW, STD } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function Register5Page({ isApproval }: { isApproval?: boolean }) {
  const kpis = buildPageKpis(reg5Rows, {
    totalLabel: "Total Cases",
    statusField: "approval_status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Approved", label: "Approved", tone: "success" },
      { value: "Rejected", label: "Rejected", tone: "error" },
    ],
    amountField: "amount",
    amountLabel: "Total Amount",
    amountTone: "neutral",
  });

  const cfg: PageCfg = {
    title: isApproval ? "Register-5 Approval" : "Register-5 List",
    titleKey: isApproval ? "register5Approval.title" : "register5.title",
    desc: isApproval ? "Review and approve Register-5 cases" : "Register-5 case records",
    descKey: isApproval ? "register5Approval.desc" : "register5.desc",
    cols: [...CIRCLE_TIN_NAME, fc("case_no", "Case No.", { headerKey: "headers.caseNo" }), fc("case_type", "Case Type", { headerKey: "headers.caseType" }), fc("amount", "Amount", { headerKey: "headers.amount" }), fc("assigned_to", "Assigned To"), fc("due_date", "Due Date"), BADGE("approval_status", "Status")],
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: isApproval ? STD : undefined,
    rows: reg5Rows,
    kpis,
  };

  return <GenPage cfg={cfg} />;
}
