import { GenPage } from "../../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../../modulePageUtils";
import { litRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../../modulePageUtils";
import { ROW_VIEW, STD } from "../../../data/modulePageConfigs";
import { buildPageKpis } from "../../../utils/buildPageKpis";

export function LitigationCasePage({ caseType }: { caseType?: string }) {
  const typeMap: Record<string, string> = { "arrear-approval": "Arrear", "writ-case-approval": "Writ", "dept-case-approval": "Dept", "taxpayer-case-approval": "Taxpayer" };
  const labelMap: Record<string, string> = { "arrear-approval": "Arrear Approval", "writ-case-approval": "Writ Case Approval", "dept-case-approval": "Dept Case Approval", "taxpayer-case-approval": "Taxpayer Case Approval" };
  const titleKeyMap: Record<string, string> = { "arrear-approval": "litigationArrearApproval", "writ-case-approval": "litigationWritApproval", "dept-case-approval": "litigationDeptApproval", "taxpayer-case-approval": "litigationTaxpayerApproval" };
  const third = caseType && typeMap[caseType] ? caseType : "arrear-approval";
  const rows = litRows(typeMap[third]);

  const kpis = buildPageKpis(rows, {
    totalLabel: "Total Cases",
    statusField: "case_status",
    statuses: [
      { value: "Active", label: "Active", tone: "primary" },
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Approved", label: "Approved", tone: "success" },
      { value: "Rejected", label: "Rejected", tone: "error" },
    ],
    amountField: "amount",
    amountLabel: "Total Amount",
    amountTone: "neutral",
  });

  const cfg: PageCfg = {
    title: labelMap[third],
    titleKey: `${titleKeyMap[third]}.title`,
    desc: `Manage ${labelMap[third].toLowerCase()} cases`,
    descKey: `${titleKeyMap[third]}.desc`,
    cols: [...CIRCLE_TIN_NAME, fc("case_no", "Case No.", { headerKey: "headers.caseNo" }), fc("case_date", "Case Date", { headerKey: "headers.caseDate" }), fc("court", "Court / Bench", { headerKey: "headers.court" }), fc("amount", "Amount", { headerKey: "headers.amount" }), BADGE("case_status", "Status")],
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: STD,
    rows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
