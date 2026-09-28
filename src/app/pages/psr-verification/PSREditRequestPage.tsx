import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import { psrEditRows, TIN_NAME, fc, BADGE, BASE_FILTERS } from "../modulePageUtils";
import { ROW_VIEW, EDIT } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function PSREditRequestPage() {
  const kpis = buildPageKpis(psrEditRows, {
    totalLabel: "Total Requests",
    statusField: "approval_status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Approved", label: "Approved", tone: "success" },
      { value: "Rejected", label: "Rejected", tone: "error" },
    ],
  });

  const cfg: PageCfg = {
    title: "PSR Edit Request",
    titleKey: "psrEditRequest.title",
    desc: "Review requested PSR corrections before approval or rejection.",
    descKey: "psrEditRequest.desc",
    cols: [...TIN_NAME, fc("psr_no", "PSR No."), fc("edit_field", "Field", { headerKey: "headers.editField" }), fc("original_value", "Original", { headerKey: "headers.originalValue" }), fc("new_value", "New Value"), fc("requested_by", "Requested By", { headerKey: "headers.requestedBy" }), fc("request_date", "Date", { headerKey: "headers.requestDate" }), BADGE("approval_status", "Status")],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["psr_no", "edit_field", "requested_by"], status: "approval_status", date: "request_date" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: EDIT,
    rows: psrEditRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
