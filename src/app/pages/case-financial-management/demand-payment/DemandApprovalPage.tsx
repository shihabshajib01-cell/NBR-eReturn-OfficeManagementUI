import { GenPage } from "../../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../../modulePageUtils";
import { demandRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../../modulePageUtils";
import { ROW_VIEW, STD } from "../../../data/modulePageConfigs";
import { buildPageKpis } from "../../../utils/buildPageKpis";

export function DemandApprovalPage() {
  const kpis = buildPageKpis(demandRows, {
    totalLabel: "Total Demands",
    statusField: "payment_status",
    statuses: [
      { value: "Paid", label: "Paid", tone: "success" },
      { value: "Partially Paid", label: "Partially Paid", tone: "warning" },
      { value: "Unpaid", label: "Unpaid", tone: "error" },
    ],
    amountField: "paid_amount",
    amountLabel: "Total Paid",
    amountTone: "success",
  });

  const cfg: PageCfg = {
    title: "Approval",
    titleKey: "demandApproval.title",
    desc: "Review demand and payment records awaiting approval.",
    descKey: "demandApproval.desc",
    cols: [...CIRCLE_TIN_NAME, fc("demand_no", "Demand No.", { headerKey: "headers.demandNo" }), fc("demand_date", "Date", { headerKey: "headers.date" }), fc("demand_amount", "Demand Amount", { headerKey: "headers.demandAmount" }), fc("paid_amount", "Paid", { headerKey: "headers.paidAmount" }), fc("outstanding", "Outstanding", { headerKey: "headers.outstanding" }), BADGE("payment_status", "Status")],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["demand_no", "circle", "demand_amount"], status: "payment_status", date: "demand_date", amount: "outstanding" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: STD,
    rows: demandRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
