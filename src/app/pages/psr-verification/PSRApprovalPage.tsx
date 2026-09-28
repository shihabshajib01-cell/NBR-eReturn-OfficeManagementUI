import { useTranslation } from "react-i18next";
import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg, KpiDef } from "../modulePageUtils";
import { psrRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../modulePageUtils";
import { ROW_VIEW, STD } from "../../data/modulePageConfigs";
import { Plus, Upload } from "lucide-react";

export function PSRApprovalPage() {
  const { t: translateDash } = useTranslation("dashboard");
  const { t: translateStatus } = useTranslation("status");
  const { t: translateActions } = useTranslation("actions");

  const kpis: KpiDef[] = [
    { label: translateDash("kpis.totalPsr"), value: String(psrRows.length), tone: "primary" },
    { label: translateStatus("pending"), value: String(psrRows.filter(r => r.approval_status === "Pending").length), tone: "warning" },
    { label: translateStatus("approved"), value: String(psrRows.filter(r => r.approval_status === "Approved").length), tone: "success" },
  ];
  const cfg: PageCfg = {
    title: "PSR Approval",
    titleKey: "psrApproval.title",
    desc: "Review and approve PSR entries",
    descKey: "psrApproval.desc",
    cols: [
      ...CIRCLE_TIN_NAME,
      fc("psr_no", "PSR No.", { headerKey: "headers.psrNo" }),
      fc("submitted_by", "Submitted By", { headerKey: "headers.submittedBy" }),
      fc("submission_date", "Submission Date", { headerKey: "headers.date" }),
      fc("tax_amount", "Tax Amount", { headerKey: "headers.amount" }),
      BADGE("approval_status", "Status"),
    ],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["psr_no", "submitted_by", "circle"], status: "approval_status", date: "submission_date", amount: "tax_amount" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: STD,
    rows: psrRows,
    kpis,
    extraBtns: [
      { id: "psr-entry",      label: translateActions("psrEntry"),     icon: Plus,   tone: "neutral", formKind: "psr-entry" },
      { id: "psr-bulk-entry", label: translateActions("psrBulkEntry"), icon: Upload, tone: "neutral", formKind: "psr-bulk-entry" },
    ],
  };
  return <GenPage cfg={cfg} />;
}
