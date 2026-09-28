import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg, KpiDef, FilterDef, TableRow } from "../modulePageUtils";
import { stockRows, fc, ZONES, CIRCLES } from "../modulePageUtils";
import { ROW_VIEW, VIEW } from "../../data/modulePageConfigs";

function sumField(rows: TableRow[], field: string): number {
  return rows.reduce((s, r) => s + (Number(r[field]) || 0), 0);
}

export function StockRegisterPage() {
  const filters: FilterDef[] = [
    { key: "zone", label: "Zone", labelKey: "labels.zone", type: "select", options: ZONES, optionKeys: { "All Zones": "options.allZones" } },
    { key: "circle", label: "Circle", labelKey: "labels.circle", type: "select", options: CIRCLES, optionKeys: { "All Circles": "options.allCircles" } },
    { key: "book_type", label: "Book Type", labelKey: "labels.type", type: "select", options: ["All Types", "82BB", "82C(2)", "212", "Normal"], optionKeys: { "All Types": "options.allTypes" } },
    { key: "from", label: "From Date", labelKey: "labels.fromDate", type: "date" },
    { key: "to", label: "To Date", labelKey: "labels.toDate", type: "date" },
  ];

  const totalReceived = sumField(stockRows, "received");
  const totalIssued = sumField(stockRows, "issued");
  const totalClosing = sumField(stockRows, "closing_stock");

  const kpis: KpiDef[] = [
    { label: "Total Items", labelKey: "totalItems", value: String(stockRows.length), tone: "primary" },
    { label: "Total Received", labelKey: "totalReceived", value: String(totalReceived), tone: "success" },
    { label: "Total Issued", labelKey: "totalIssued", value: String(totalIssued), tone: "warning" },
    { label: "Total Closing", labelKey: "totalClosing", value: String(totalClosing), tone: "neutral" },
  ];

  const cfg: PageCfg = {
    title: "Stock Register",
    titleKey: "stockRegister.title",
    desc: "Book stock levels by type and circle",
    descKey: "stockRegister.desc",
    cols: [fc("circle", "Circle", { headerKey: "headers.circle" }), fc("book_type", "Book Type", { headerKey: "headers.bookType" }), fc("opening_stock", "Opening Stock", { headerKey: "headers.openingStock" }), fc("received", "Received", { headerKey: "headers.received" }), fc("issued", "Issued", { headerKey: "headers.issuedQty" }), fc("closing_stock", "Closing Stock", { headerKey: "headers.closingStock" }), fc("last_updated", "Last Updated", { headerKey: "headers.lastUpdated" })],
    mobileCardMapping: { primary: "circle", identifier: "book_type", meta: ["closing_stock", "received", "issued"], date: "last_updated" },
    filters,
    actions: ROW_VIEW,
    drawerActions: VIEW,
    rows: stockRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
