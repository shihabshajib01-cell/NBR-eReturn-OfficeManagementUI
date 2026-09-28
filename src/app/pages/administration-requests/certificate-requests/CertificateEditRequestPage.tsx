import { GenPage } from "../../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../../modulePageUtils";
import { certEditRows, TIN_NAME, fc, BADGE, BASE_FILTERS } from "../../modulePageUtils";
import { ROW_VIEW, EDIT } from "../../../data/modulePageConfigs";
import { buildPageKpis } from "../../../utils/buildPageKpis";

export function CertificateEditRequestPage() {
  const kpis = buildPageKpis(certEditRows, {
    totalLabel: "Total Requests",
    statusField: "edit_status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Approved", label: "Approved", tone: "success" },
      { value: "Rejected", label: "Rejected", tone: "error" },
    ],
  });

  const cfg: PageCfg = {
    title: "Edit Request",
    titleKey: "editRequest.title",
    desc: "Review requested certificate changes before approval.",
    descKey: "editRequest.desc",
    cols: [...TIN_NAME, fc("request_no", "Request No.", { headerKey: "headers.requestNo" }), fc("cert_type", "Certificate Type", { headerKey: "headers.certType" }), fc("edit_field", "Field", { headerKey: "headers.editField" }), fc("original_value", "Original", { headerKey: "headers.originalValue" }), fc("requested_value", "Requested", { headerKey: "headers.requestedValue" }), BADGE("edit_status", "Status")],
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: EDIT,
    rows: certEditRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
