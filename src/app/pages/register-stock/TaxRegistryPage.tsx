import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg, FilterDef } from "../modulePageUtils";
import { taxRegRows, CIRCLE_TIN_NAME, fc, BADGE, ZONES, CIRCLES } from "../modulePageUtils";
import { ROW_VIEW, VIEW } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function TaxRegistryPage() {
  const filters: FilterDef[] = [
    { key: "zone", label: "Zone", labelKey: "labels.zone", type: "select", options: ZONES, optionKeys: { "All Zones": "options.allZones" } },
    { key: "circle", label: "Circle", labelKey: "labels.circle", type: "select", options: CIRCLES, optionKeys: { "All Circles": "options.allCircles" } },
    { key: "business_type", label: "Type", labelKey: "labels.type", type: "select", options: ["All Types", "Sole Proprietorship", "Partnership", "Company", "NGO"], optionKeys: { "All Types": "options.allTypes", "Sole Proprietorship": "options.soleProprietorship", "Partnership": "options.partnership", "Company": "options.company", "NGO": "options.ngo" } },
    { key: "status", label: "Status", labelKey: "labels.status", type: "select", options: ["All Status", "Active", "Inactive"], optionKeys: { "All Status": "options.allStatus", "Active": "options.active", "Inactive": "options.inactive" } },
    { key: "from", label: "From Date", labelKey: "labels.fromDate", type: "date" },
    { key: "to", label: "To Date", labelKey: "labels.toDate", type: "date" },
  ];

  const kpis = buildPageKpis(taxRegRows, {
    totalLabel: "Total Taxpayers",
    statusField: "active_status",
    statuses: [
      { value: "Active", label: "Active", tone: "success" },
      { value: "Inactive", label: "Inactive", tone: "neutral" },
    ],
  });

  const cfg: PageCfg = {
    title: "Tax Registry",
    titleKey: "taxRegistry.title",
    desc: "Registered taxpayer directory",
    descKey: "taxRegistry.desc",
    cols: [...CIRCLE_TIN_NAME, fc("registration_no", "Reg. No.", { headerKey: "headers.registrationNo" }), fc("business_type", "Business Type", { headerKey: "headers.businessType" }), fc("registration_date", "Reg. Date", { headerKey: "headers.regDate" }), fc("zone", "Zone", { headerKey: "headers.zone" }), BADGE("active_status", "Status")],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["registration_no", "business_type", "zone"], status: "active_status", date: "registration_date" },
    filters,
    actions: ROW_VIEW,
    drawerActions: VIEW,
    rows: taxRegRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
