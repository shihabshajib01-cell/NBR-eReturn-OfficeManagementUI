import { GenPage } from "../../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../../modulePageUtils";
import { tribunalRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../../modulePageUtils";
import { ROW_VIEW, VIEW, STD } from "../../../data/modulePageConfigs";
import { buildPageKpis } from "../../../utils/buildPageKpis";

export function TribunalPage({ isApproval }: { isApproval?: boolean }) {
  const kpis = buildPageKpis(tribunalRows, {
    totalLabel: "Total Cases",
    statusField: "tribunal_status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Decided", label: "Decided", tone: "success" },
      { value: "Adjourned", label: "Adjourned", tone: "neutral" },
    ],
    amountField: "amount",
    amountLabel: "Total Amount",
    amountTone: "primary",
  });

  const cfg: PageCfg = {
    title: isApproval ? "Tribunal Approval" : "Tribunal Register",
    titleKey: isApproval ? "tribunalApproval.title" : "tribunalRegView.title",
    desc: isApproval ? "Review and approve tribunal case submissions" : "All registered tribunal cases",
    descKey: isApproval ? "tribunalApproval.desc" : "tribunalRegView.desc",
    cols: [...CIRCLE_TIN_NAME, fc("tribunal_no", "Tribunal No.", { headerKey: "headers.tribunalNo" }), fc("tribunal_date", "Date", { headerKey: "headers.date" }), fc("bench", "Bench", { headerKey: "headers.bench" }), fc("case_type", "Case Type", { headerKey: "headers.caseType" }), fc("amount", "Amount", { headerKey: "headers.amount" }), BADGE("tribunal_status", "Status")],
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: isApproval ? STD : VIEW,
    rows: tribunalRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
