import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg, FilterDef } from "../modulePageUtils";
import { auditRows, CIRCLE_TIN_NAME, fc, BADGE, ZONES, CIRCLES, AY_OPTS } from "../modulePageUtils";
import { ROW_VIEW, ASSIGN } from "../../data/modulePageConfigs";
import { buildPageKpis } from "../../utils/buildPageKpis";

export function AuditSelectionPage() {
  const filters: FilterDef[] = [
    { key: "zone", label: "Zone", labelKey: "labels.zone", type: "select", options: ZONES, optionKeys: { "All Zones": "options.allZones" } },
    { key: "circle", label: "Circle", labelKey: "labels.circle", type: "select", options: CIRCLES, optionKeys: { "All Circles": "options.allCircles" } },
    { key: "ay", label: "Audit AY", labelKey: "labels.assessmentYear", type: "select", options: AY_OPTS, optionKeys: { "All Years": "options.allYears" } },
    { key: "method", label: "Method", labelKey: "labels.type", type: "select", options: ["All Methods", "Risk-Based", "Random", "Special Order", "Profile-Based"], optionKeys: { "All Methods": "options.allMethods", "Risk-Based": "options.riskBased", "Random": "options.random", "Special Order": "options.specialOrder", "Profile-Based": "options.profileBased" } },
    { key: "status", label: "Status", labelKey: "labels.status", type: "select", options: ["All Status", "Selected", "In Progress", "Completed", "Cancelled"], optionKeys: { "All Status": "options.allStatus", "Selected": "options.selected", "In Progress": "options.inProgress", "Completed": "options.completed", "Cancelled": "options.cancelled" } },
  ];

  const kpis = buildPageKpis(auditRows, {
    totalLabel: "Total Selected",
    statusField: "audit_status",
    statuses: [
      { value: "Selected", label: "Selected", tone: "primary" },
      { value: "In Progress", label: "In Progress", tone: "warning" },
      { value: "Completed", label: "Completed", tone: "success" },
      { value: "Cancelled", label: "Cancelled", tone: "error" },
    ],
  });

  const cfg: PageCfg = {
    title: "Audit Selection",
    titleKey: "auditSelection.title",
    desc: "Manage audit selection and assignment",
    descKey: "auditSelection.desc",
    cols: [...CIRCLE_TIN_NAME, fc("selection_no", "Selection No.", { headerKey: "headers.selectionNo" }), fc("selection_method", "Method", { headerKey: "headers.selectionMethod" }), fc("ay_for_audit", "Audit AY", { headerKey: "headers.auditYear" }), fc("selected_date", "Selected Date", { headerKey: "headers.selectedDate" }), fc("audit_officer", "Audit Officer", { headerKey: "headers.auditOfficer" }), BADGE("audit_status", "Status")],
    filters,
    actions: ROW_VIEW,
    drawerActions: ASSIGN,
    rows: auditRows,
    kpis,
    mobileCardMapping: {
      primary: "taxpayer_name",
      identifier: "selection_no",
      meta: ["circle", "selection_method", "ay_for_audit"],
      status: "audit_status",
      date: "selected_date"
    },
  };

  return <GenPage cfg={cfg} />;
}