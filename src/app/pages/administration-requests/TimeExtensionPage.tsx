import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import { timeExtRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../modulePageUtils";
import { ROW_VIEW, STD } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function TimeExtensionPage() {
  const kpis = buildPageKpis(timeExtRows, {
    totalLabel: "Total Requests",
    statusField: "approval_status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Approved", label: "Approved", tone: "success" },
      { value: "Rejected", label: "Rejected", tone: "error" },
    ],
  });

  const cfg: PageCfg = {
    title: "Time Extension",
    titleKey: "timeExtension.title",
    desc: "Review time extension requests and approval status.",
    descKey: "timeExtension.desc",
    cols: [...CIRCLE_TIN_NAME, fc("request_no", "Request No.", { headerKey: "headers.requestNo" }), fc("extension_type", "Extension Type", { headerKey: "headers.extensionType" }), fc("original_deadline", "Original Deadline", { headerKey: "headers.originalDeadline" }), fc("requested_deadline", "Requested Deadline", { headerKey: "headers.requestedDeadline" }), fc("requested_by", "Requested By", { headerKey: "headers.requestedBy" }), BADGE("approval_status", "Status")],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["request_no", "extension_type", "requested_by"], status: "approval_status", date: "requested_deadline" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: STD,
    rows: timeExtRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
