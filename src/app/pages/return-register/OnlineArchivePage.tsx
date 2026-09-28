import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import { archiveRows, CIRCLE_TIN_NAME, fc, BASE_FILTERS } from "../modulePageUtils";
import { ROW_VIEW, VIEW } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function OnlineArchivePage() {
  const normalCount = archiveRows.filter((r) => r.return_type === "Normal").length;
  const kpis = buildPageKpis(archiveRows, {
    totalLabel: "Total Archives",
  });
  kpis.push(
    { label: "Normal", value: String(normalCount), tone: "success" },
    { label: "82BB", value: String(archiveRows.length - normalCount), tone: "neutral" },
  );

  const cfg: PageCfg = {
    title: "Online Archive",
    titleKey: "onlineArchive.title",
    desc: "Search and review archived online return records.",
    descKey: "onlineArchive.desc",
    cols: [...CIRCLE_TIN_NAME, fc("ay", "Asst. Year", { headerKey: "headers.assessmentYear" }), fc("return_type", "Return Type", { headerKey: "headers.returnType" }), fc("archive_date", "Archive Date", { headerKey: "headers.date" }), fc("archived_by", "Archived By", { headerKey: "headers.archivedBy" }), fc("file_size", "File Size", { headerKey: "headers.fileSize" })],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["ay", "return_type", "archived_by"], date: "archive_date" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: VIEW,
    rows: archiveRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
