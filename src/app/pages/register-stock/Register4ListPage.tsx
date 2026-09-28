import { useTranslation } from "react-i18next";
import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import { reg4Rows, CIRCLE_TIN_NAME, fc, BADGE, BASE_FILTERS } from "../modulePageUtils";
import { ROW_VIEW, VIEW } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function Register4ListPage() {
  const { t: translateActions } = useTranslation("actions");

  const kpis = buildPageKpis(reg4Rows, {
    totalLabel: "Total Records",
    statusField: "status",
    statuses: [
      { value: "Pending", label: "Pending", tone: "warning" },
      { value: "Issued", label: "Issued", tone: "success" },
      { value: "Returned", label: "Returned", tone: "neutral" },
    ],
  });

  const cfg: PageCfg = {
    title: "Register-4 List",
    titleKey: "register4.title",
    desc: "Review Register-4 entries and related form records.",
    descKey: "register4.desc",
    cols: [...CIRCLE_TIN_NAME, fc("book_no", "Book No.", { headerKey: "headers.bookNo" }), fc("from_serial", "From Serial", { headerKey: "headers.fromSerial" }), fc("to_serial", "To Serial", { headerKey: "headers.toSerial" }), fc("quantity", "Qty", { headerKey: "headers.quantity" }), fc("issue_date", "Issue Date", { headerKey: "headers.date" }), BADGE("status", "Status")],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["book_no", "quantity", "circle"], status: "status", date: "issue_date" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: VIEW,
    rows: reg4Rows,
    entryBtn: translateActions("newEntry"),
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
