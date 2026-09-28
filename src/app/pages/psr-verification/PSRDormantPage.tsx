import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import { dormantRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../modulePageUtils";
import { ROW_VIEW, VIEW } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function PSRDormantPage() {
  const avgYears =
    dormantRows.length > 0
      ? (dormantRows.reduce((s, r) => s + (Number(r.years_dormant) || 0), 0) / dormantRows.length).toFixed(1)
      : "0";

  const kpis = buildPageKpis(dormantRows, {
    totalLabel: "Total Dormant",
    statusField: "dormant_status",
    statuses: [{ value: "Dormant", label: "Active Dormant", tone: "error" }],
  });
  kpis.push({ label: "Avg. Years Dormant", value: avgYears, tone: "warning" });

  const cfg: PageCfg = {
    title: "PSR Dormant",
    titleKey: "psrDormant.title",
    desc: "Review dormant PSR records that need attention.",
    descKey: "psrDormant.desc",
    cols: [...CIRCLE_TIN_NAME, fc("last_return", "Last Return", { headerKey: "headers.lastReturn" }), fc("years_dormant", "Years Dormant", { headerKey: "headers.yearsDormant" }), fc("business_type", "Business Type", { headerKey: "headers.businessType" }), BADGE("dormant_status", "Status")],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["business_type", "years_dormant", "circle"], status: "dormant_status", date: "last_return" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: VIEW,
    rows: dormantRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
