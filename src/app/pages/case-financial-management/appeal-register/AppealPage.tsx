import { GenPage } from "../../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../../modulePageUtils";
import { appealRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../../modulePageUtils";
import { ROW_VIEW, VIEW, STD } from "../../../data/modulePageConfigs";
import { buildPageKpis } from "../../../utils/buildPageKpis";

export function AppealPage({ isApproval }: { isApproval?: boolean }) {
  const kpis = buildPageKpis(appealRows, {
    totalLabel: "Total Appeals",
    statusField: "appeal_status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Approved", label: "Approved", tone: "success" },
      { value: "Rejected", label: "Rejected", tone: "error" },
      { value: "Under Review", label: "Under Review", tone: "neutral" },
    ],
    amountField: "amount",
    amountLabel: "Total Amount",
    amountTone: "primary",
  });

  const cfg: PageCfg = {
    title: isApproval ? "Appeal Approval" : "Appeal Register",
    titleKey: isApproval ? "appealApproval.title" : "appealRegView.title",
    desc: isApproval ? "Review and approve appeal submissions" : "All registered appeal cases",
    descKey: isApproval ? "appealApproval.desc" : "appealRegView.desc",
    cols: [...CIRCLE_TIN_NAME, fc("appeal_no", "Appeal No.", { headerKey: "headers.appealNo" }), fc("appeal_date", "Appeal Date", { headerKey: "headers.appealDate" }), fc("hearing_date", "Hearing Date", { headerKey: "headers.hearingDate" }), fc("appeal_ground", "Ground", { headerKey: "headers.appealGround" }), fc("amount", "Amount", { headerKey: "headers.amount" }), BADGE("appeal_status", "Status")],
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: isApproval ? STD : VIEW,
    rows: appealRows,
    kpis,
    mobileCardMapping: {
      primary: "taxpayer_name",
      identifier: "appeal_no",
      meta: ["circle", "appeal_ground", "hearing_date"],
      status: "appeal_status",
      amount: "amount"
    },
  };
  return <GenPage cfg={cfg} />;
}