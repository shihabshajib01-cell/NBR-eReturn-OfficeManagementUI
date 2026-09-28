import { GenPage } from "../../../components/pages/GeneratedTablePage";
import type { PageCfg, KpiDef } from "../../modulePageUtils";
import {
  refundRows,
  CIRCLE_TIN_NAME,
  fc,
  BADGE,
  BASE_FILTERS,
} from "../../modulePageUtils";
import { ROW_VIEW, STD } from "../../../data/modulePageConfigs";

export function RefundAdjustmentPage() {
  const kpis: KpiDef[] = [
    { label: "Total Requests", labelKey: "totalRequests", value: String(refundRows.length), tone: "primary" },
    { label: "Pending", labelKey: "pending", value: String(refundRows.filter(r => r.refund_status === "Pending").length), tone: "warning" },
    { label: "Approved", labelKey: "approved", value: String(refundRows.filter(r => r.refund_status === "Approved").length), tone: "success" },
    { label: "Disbursed", labelKey: "disbursed", value: String(refundRows.filter(r => r.refund_status === "Disbursed").length), tone: "neutral" },
  ];

  const cfg: PageCfg = {
    title: "Refund & Adjustment",
    titleKey: "refundAdjustment.title",
    desc: "Manage refund requests and tax adjustments",
    descKey: "refundAdjustment.desc",
    cols: [...CIRCLE_TIN_NAME, fc("refund_no", "Refund No.", { headerKey: "headers.refundNo" }), fc("refund_type", "Type", { headerKey: "headers.refundType" }), fc("refund_amount", "Amount", { headerKey: "headers.amount" }), fc("request_date", "Request Date", { headerKey: "headers.requestDate" }), BADGE("refund_status", "Status")],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["refund_no", "refund_type", "circle"], status: "refund_status", date: "request_date", amount: "refund_amount" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: STD,
    rows: refundRows,
    kpis,
  };

  return <GenPage cfg={cfg} />;
}
