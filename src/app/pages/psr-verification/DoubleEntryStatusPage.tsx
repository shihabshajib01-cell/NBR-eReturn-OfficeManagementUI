import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import { deStatusRows, TIN_NAME, fc, BADGE, BASE_FILTERS } from "../modulePageUtils";
import { ROW_VIEW, VIEW } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function DoubleEntryStatusPage() {
  const kpis = buildPageKpis(deStatusRows, {
    totalLabel: "Total Entries",
    statusField: "match_status",
    statuses: [
      { value: "Matched", label: "Matched", tone: "success" },
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Mismatched", label: "Mismatched", tone: "error" },
    ],
  });

  const cfg: PageCfg = {
    title: "Double Entry Status",
    titleKey: "doubleEntryStatus.title",
    desc: "Identify duplicate entries and review their current status.",
    descKey: "doubleEntryStatus.desc",
    cols: [...TIN_NAME, fc("entry_no", "Entry No.", { headerKey: "headers.entryNo" }), fc("entry_type", "Type", { headerKey: "headers.type" }), fc("first_entry_by", "First Entry By", { headerKey: "headers.firstEntryBy" }), fc("second_entry_by", "Second Entry By", { headerKey: "headers.secondEntryBy" }), fc("entry_date", "Date"), BADGE("match_status", "Match Status")],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["entry_no", "entry_type", "first_entry_by"], status: "match_status", date: "entry_date" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: VIEW,
    rows: deStatusRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
