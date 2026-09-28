import { GenPage } from "../../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../../modulePageUtils";
import { certDataRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../../modulePageUtils";
import { ROW_VIEW, STD } from "../../../data/modulePageConfigs";
import { buildPageKpis } from "../../../utils/buildPageKpis";

export function CertificateApprovalRequestPage() {
  const kpis = buildPageKpis(certDataRows, {
    totalLabel: "Total Requests",
    statusField: "approval_status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Approved", label: "Approved", tone: "success" },
      { value: "Rejected", label: "Rejected", tone: "error" },
      { value: "Issued", label: "Issued", tone: "neutral" },
    ],
  });

  const cfg: PageCfg = {
    title: "Approval Request",
    titleKey: "approvalRequest.title",
    desc: "Review certificate requests awaiting approval.",
    descKey: "approvalRequest.desc",
    cols: [...CIRCLE_TIN_NAME, fc("request_no", "Request No.", { headerKey: "headers.requestNo" }), fc("cert_type", "Certificate Type", { headerKey: "headers.certType" }), fc("requested_by", "Requested By", { headerKey: "headers.requestedBy" }), fc("request_date", "Request Date", { headerKey: "headers.requestDate" }), BADGE("approval_status", "Status")],
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: STD,
    rows: certDataRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
