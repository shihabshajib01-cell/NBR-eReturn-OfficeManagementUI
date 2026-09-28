import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import {
  transferRows,
  TIN_NAME,
  fc,
  BADGE,
  BASE_FILTERS,
} from "../modulePageUtils";
import { ROW_VIEW, VIEW } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function TransferHistoryPage() {
  const kpis = buildPageKpis(transferRows, {
    totalLabel: "Total Transfers",
    statusField: "transfer_status",
    statuses: [
      { value: "Transferred", label: "Transferred", tone: "success" },
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Cancelled", label: "Cancelled", tone: "error" },
    ],
  });

  const cfg: PageCfg = {
    title: "Transfer History",
    titleKey: "transferHistory.title",
    desc: "Review PSR transfer records and movement history.",
    descKey: "transferHistory.desc",
    cols: [...TIN_NAME, fc("from_circle", "From Circle", { headerKey: "headers.fromCircle" }), fc("to_circle", "To Circle", { headerKey: "headers.toCircle" }), fc("transfer_date", "Transfer Date", { headerKey: "headers.date" }), fc("transferred_by", "By", { headerKey: "headers.transferredBy" }), fc("reason", "Reason", { headerKey: "headers.reason" }), BADGE("transfer_status", "Status")],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["from_circle", "to_circle", "transferred_by"], status: "transfer_status", date: "transfer_date" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: VIEW,
    rows: transferRows,
    kpis,
  };

  return <GenPage cfg={cfg} />;
}
