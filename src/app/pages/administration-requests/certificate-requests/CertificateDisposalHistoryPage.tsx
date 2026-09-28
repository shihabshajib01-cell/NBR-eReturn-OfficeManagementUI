import { GenPage } from "../../../components/pages/GeneratedTablePage";
import type { PageCfg, KpiDef } from "../../modulePageUtils";
import { certDisposalRows, TIN_NAME, fc, BADGE, BASE_FILTERS } from "../../modulePageUtils";
import { ROW_VIEW, VIEW } from "../../../data/modulePageConfigs";

export function CertificateDisposalHistoryPage() {
  const methods = certDisposalRows.reduce<Record<string, number>>((acc, r) => {
    const m = String(r.disposal_method || "Other");
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});
  const topMethod = Object.entries(methods).sort((a, b) => b[1] - a[1])[0];

  const kpis: KpiDef[] = [
    { label: "Total Disposals", value: String(certDisposalRows.length), tone: "primary" },
    { label: "Disposed", value: String(certDisposalRows.filter((r) => r.disposal_status === "Disposed").length), tone: "success" },
    { label: "Top Method", value: topMethod ? topMethod[0] : "—", tone: "neutral" },
  ];

  const cfg: PageCfg = {
    title: "Disposal History",
    titleKey: "disposalHistory.title",
    desc: "Track completed certificate request disposals.",
    descKey: "disposalHistory.desc",
    cols: [...TIN_NAME, fc("request_no", "Request No.", { headerKey: "headers.requestNo" }), fc("cert_type", "Cert. Type", { headerKey: "headers.certType" }), fc("issued_to", "Issued To"), fc("disposal_date", "Disposal Date"), fc("disposal_method", "Method"), BADGE("disposal_status", "Status")],
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: VIEW,
    rows: certDisposalRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
