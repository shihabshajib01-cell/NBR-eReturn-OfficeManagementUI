import { useTranslation } from "react-i18next";
import { GenPage } from "../../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../../modulePageUtils";
import { demandRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../../modulePageUtils";
import { ROW_VIEW, VIEW } from "../../../data/modulePageConfigs";
import { buildPageKpis } from "../../../utils/buildPageKpis";

export function DemandRegisterPage() {
  const { t: translateActions } = useTranslation("actions");

  const kpis = buildPageKpis(demandRows, {
    totalLabel: "Total Demands",
    statusField: "payment_status",
    statuses: [
      { value: "Paid", label: "Paid", tone: "success" },
      { value: "Partially Paid", label: "Partially Paid", tone: "warning" },
      { value: "Unpaid", label: "Unpaid", tone: "error" },
    ],
    amountField: "demand_amount",
    amountLabel: "Total Demand",
    amountTone: "neutral",
  });

  const cfg: PageCfg = {
    title: "Demand Register",
    titleKey: "demandRegister.title",
    desc: "Review demand notices by taxpayer, date, amount, and status.",
    descKey: "demandRegister.desc",
    cols: [...CIRCLE_TIN_NAME, fc("demand_no", "Demand No.", { headerKey: "headers.demandNo" }), fc("demand_date", "Date", { headerKey: "headers.date" }), fc("demand_amount", "Demand Amount", { headerKey: "headers.demandAmount" }), fc("paid_amount", "Paid", { headerKey: "headers.paidAmount" }), fc("outstanding", "Outstanding", { headerKey: "headers.outstanding" }), BADGE("payment_status", "Status")],
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: VIEW,
    rows: demandRows,
    entryBtn: translateActions("newEntry"),
    kpis,
    mobileCardMapping: {
      primary: "taxpayer_name",
      identifier: "demand_no",
      meta: ["circle", "demand_date"],
      status: "payment_status",
      amount: "demand_amount"
    },
  };
  return <GenPage cfg={cfg} />;
}