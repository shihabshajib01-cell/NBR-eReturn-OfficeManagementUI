import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import { invalidRows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../modulePageUtils";
import { ROW_VIEW, STD } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function InvalidListPage() {
  const kpis = buildPageKpis(invalidRows, {
    totalLabel: "Total Invalid",
    statusField: "resolution_status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Resolved", label: "Resolved", tone: "success" },
    ],
  });

  const cfg: PageCfg = {
    title: "Invalid List",
    titleKey: "invalidList.title",
    desc: "Review invalid records and decide the next action.",
    descKey: "invalidList.desc",
    cols: [...CIRCLE_TIN_NAME, fc("invalid_reason", "Reason", { headerKey: "headers.reason" }), fc("detected_date", "Detected Date", { headerKey: "headers.date" }), fc("detected_by", "Detected By", { headerKey: "headers.detectedBy" }), BADGE("resolution_status", "Status")],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["invalid_reason", "detected_by", "circle"], status: "resolution_status", date: "detected_date" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: STD,
    rows: invalidRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
