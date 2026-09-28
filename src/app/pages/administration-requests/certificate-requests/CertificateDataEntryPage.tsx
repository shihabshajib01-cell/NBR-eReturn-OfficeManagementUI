import { useTranslation } from "react-i18next";
import { GenPage } from "../../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../../modulePageUtils";
import { certDataRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../../modulePageUtils";
import { ROW_VIEW, STD } from "../../../data/modulePageConfigs";
import { buildPageKpis } from "../../../utils/buildPageKpis";

export function CertificateDataEntryPage() {
  const { t: translateActions } = useTranslation("actions");

  const kpis = buildPageKpis(certDataRows, {
    totalLabel: "Total Entries",
    statusField: "approval_status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Approved", label: "Approved", tone: "success" },
      { value: "Rejected", label: "Rejected", tone: "error" },
      { value: "Issued", label: "Issued", tone: "neutral" },
    ],
  });

  const cfg: PageCfg = {
    title: "Data Entry Request",
    titleKey: "dataEntryRequest.title",
    desc: "Review certificate data entry requests submitted for processing.",
    descKey: "dataEntryRequest.desc",
    cols: [...CIRCLE_TIN_NAME, fc("request_no", "Request No.", { headerKey: "headers.requestNo" }), fc("cert_type", "Type", { headerKey: "headers.certificateType" }), fc("requested_by", "Requested By", { headerKey: "headers.requestedBy" }), fc("request_date", "Request Date", { headerKey: "headers.requestDate" }), BADGE("approval_status", "Status")],
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: STD,
    rows: certDataRows,
    kpis,
    mobileCardMapping: {
      primary: "taxpayer_name",
      identifier: "request_no",
      meta: ["circle", "cert_type", "requested_by"],
      status: "approval_status",
      date: "request_date"
    },
  };
  return <GenPage cfg={cfg} />;
}