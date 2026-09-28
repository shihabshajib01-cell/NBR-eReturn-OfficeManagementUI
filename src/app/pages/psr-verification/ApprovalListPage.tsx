import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import { approvalListRows, TIN_NAME, fc, BADGE, BASE_FILTERS } from "../modulePageUtils";
import { ROW_VIEW, STD } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function ApprovalListPage() {
  const kpis = buildPageKpis(approvalListRows, {
    totalLabel: "Total Requests",
    statusField: "approval_status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Approved", label: "Approved", tone: "success" },
      { value: "Rejected", label: "Rejected", tone: "error" },
    ],
  });

  const cfg: PageCfg = {
    title: "Approval List",
    titleKey: "approvalList.title",
    desc: "Track items waiting for approval across PSR workflows.",
    descKey: "approvalList.desc",
    cols: [fc("id", "Ref. No."), ...TIN_NAME, fc("request_type", "Request Type", { headerKey: "headers.requestType" }), fc("requested_by", "Requested By", { headerKey: "headers.requestedBy" }), fc("request_date", "Date", { headerKey: "headers.requestDate" }), fc("priority", "Priority", { headerKey: "headers.priority" }), BADGE("approval_status", "Status")],
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: STD,
    rows: approvalListRows,
    kpis,
    mobileCardMapping: {
      primary: "taxpayer_name",
      identifier: "id",
      meta: ["request_type", "requested_by", "priority"],
      status: "approval_status",
      date: "request_date"
    },
  };
  return <GenPage cfg={cfg} />;
}