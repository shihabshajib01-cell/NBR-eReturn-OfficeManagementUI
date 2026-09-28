import { useTranslation } from "react-i18next";
import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { KpiDef, PageCfg } from "../modulePageUtils";
import {
  returnApprRows,
  CIRCLE_TIN_NAME,
  fc,
  BADGE,
  BASE_FILTERS,
} from "../modulePageUtils";
import { ROW_VIEW, STD } from "../../data/modulePageConfigs";

export function ReturnViewApprovalPage() {
  const { t: translateDash } = useTranslation("dashboard");
  const { t: translateStatus } = useTranslation("status");

  const kpis: KpiDef[] = [
    { label: translateDash("kpis.totalRequests"), value: String(returnApprRows.length), tone: "primary" },
    { label: translateStatus("pending"), value: String(returnApprRows.filter(r => r.approval_status === "Pending").length), tone: "warning" },
    { label: translateStatus("approved"), value: String(returnApprRows.filter(r => r.approval_status === "Approved").length), tone: "success" },
    { label: translateStatus("rejected"), value: String(returnApprRows.filter(r => r.approval_status === "Rejected").length), tone: "error" },
  ];

  const cfg: PageCfg = {
    title: "Return View Approval",
    titleKey: "returnViewApproval.title",
    desc: "Review submitted returns before approval, correction, or further processing.",
    descKey: "returnViewApproval.desc",
    cols: [
      ...CIRCLE_TIN_NAME,
      fc("ay", "Asst. Year", { headerKey: "headers.assessmentYear" }),
      fc("return_type", "Return Type", { headerKey: "headers.type" }),
      fc("request_by", "Request By", { headerKey: "headers.submittedBy" }),
      fc("request_date", "Request Date", { headerKey: "headers.date" }),
      BADGE("approval_status", "Status"),
    ],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["ay", "return_type", "request_by"], status: "approval_status", date: "request_date" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: STD,
    rows: returnApprRows,
    kpis,
  };

  return <GenPage cfg={cfg} />;
}
