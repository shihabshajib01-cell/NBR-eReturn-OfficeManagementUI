import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Download, Filter, Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { REPORT_CFGS, ROW_VIEW } from "../../data/modulePageConfigs";
import { TAX_ZONES } from "../../data/taxZones";
import { fc, type ColDef, type FilterDef, type KpiDef, type TableRow } from "../../pages/modulePageUtils";
import { useUIState } from "../../hooks/useUI";
import { handleExportDisabled } from "../../utils/exportDisabled";
import { TabBar } from "../../components/tabs/TabBar";
import { CollapsibleKpiSection } from "../../components/cards/CollapsibleKpiSection";
import { FilterPanel } from "../../components/filters/FilterPanel";
import { AppSelectField } from "../../components/forms/AppSelectField";
import { TaxZoneSelectField } from "../../components/forms/TaxZoneSelectField";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { AppliedFilterChips } from "../../components/filters/AppliedFilterChips";
import { MobileFilterOverlay } from "../../components/filters/MobileFilterOverlay";
import { MobileSearchFilter } from "../../components/shared/MobileSearchFilter";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { Pagination } from "../../components/shared/Pagination";
import { DynamicDetailsDrawer } from "../../components/drawers/DynamicDetailsDrawer";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";

const PER_PAGE = 10;

const USER_TYPES = [
  "DATA ENTRY OPERATOR",
  "CIRCLE INSPECTOR",
  "CIRCLE OFFICER (DCT)",
  "RANGE OFFICER",
  "COMMISSIONER",
  "NBR CHAIRMAN",
  "NBR MEMBER",
  "FIRST SECRETARY",
  "SECOND SECRETARY",
  "SUPER ADMIN",
  "ADMIN",
];

const ASSESSMENT_YEARS = ["2025-26", "2024-25", "2023-24", "2022-23"];

const BARISHAL_CIRCLES = [
  "Circle-01(Companies)",
  "Circle-02(Companies)",
  "Circle-03",
  "Circle-04",
  "Circle-05",
  "Circle-06",
  "Circle-07(Salaries)",
  "Circle-08",
  "Circle-10",
  "Circle-11",
  "Circle-12",
  "Circle-13(Salaries)",
  "Circle-14",
  "Circle-15",
  "Circle-16",
  "Circle-17",
  "Circle-18(Salaries)",
];

const DEFAULT_CIRCLES = Array.from({ length: 18 }, (_, i) => "Circle-" + String(i + 1).padStart(2, "0"));

const ZONAL_NAMES = [
  "Shaikh Shamim Bulbul",
  "Shaon Chowdhury",
  "Ganesh Chandra Mondol",
  "DCT HQ (Admin)",
  "Shadhon Kumar Ray",
  "Md. Monjur Alam",
  "Farid Ahmed",
  "Md. Abdus Sobhan",
  "Moniruzzaman",
  "Quazi Latifur Rahman",
  "Sabina Yasmin",
  "MD. SIRAJUL KARIM",
  "Salina Sultana",
  "Syed Zakir Hossain",
  "Safina Jahan",
  "Shrabani Chakma",
  "Hemal Dewan",
  "Md. Shameemur Rahman",
];

const ZONAL_IDS = [
  "CTBAR", "CTBOG", "CTSRV", "CTCTG01", "CTCTG02", "CTCTG03",
  "CTCTG04", "CTCML", "CTCUMILLA", "CTDHK01", "CTDHK02", "CTDHK03",
  "CTDHK04", "CTDHK05", "CT-ZONE5", "CTDHK06", "CTDHK07", "CTDHK08",
];

const USER_ACTIVITY_COLS: ColDef[] = [
  fc("serial", "S/N", { headerKey: "headers.serialNo", truncate: "compact" }),
  fc("user_id", "User ID", { headerKey: "headers.userId", mobileCard: true }),
  fc("user_name", "User Name", { headerKey: "headers.userName", mobileCard: true, truncate: "normal" }),
  fc("email", "Email", { headerKey: "headers.email", truncate: "long" }),
  fc("phone", "Phone", { headerKey: "headers.phone", truncate: "compact" }),
  fc("last_login", "Last Login", { headerKey: "headers.lastLogin", mobileCard: true }),
  fc("last_pass_change", "Last Pass. Change", { headerKey: "headers.lastPassChange" }),
  fc("active_status", "Active/Released", { headerKey: "headers.activeReleased", badge: true, mobileCard: true }),
  fc("zone", "Zone", { headerKey: "headers.zone", truncate: "normal" }),
  fc("circle", "Circle", { headerKey: "headers.circle", truncate: "normal" }),
  fc("range", "Range", { headerKey: "headers.range", truncate: "compact" }),
  fc("entry_today", "Entry Today", { headerKey: "headers.entryToday", truncate: "compact" }),
  fc("entry_upto", "Entry Up to", { headerKey: "headers.entryUpto", truncate: "compact" }),
];

const ZONAL_COLS: ColDef[] = [
  fc("zone_name", "Zone Name", { headerKey: "headers.zoneName", mobileCard: true, truncate: "normal" }),
  fc("serial", "S/N", { headerKey: "headers.serialNo", truncate: "compact" }),
  fc("user_id", "User ID", { headerKey: "headers.userId", mobileCard: true }),
  fc("designation", "Designation", { headerKey: "headers.designation", mobileCard: true, truncate: "normal" }),
  fc("user_name", "User Name", { headerKey: "headers.userName", mobileCard: true, truncate: "normal" }),
  fc("email", "Email", { headerKey: "headers.email", truncate: "long" }),
  fc("phone", "Phone", { headerKey: "headers.phone", truncate: "compact" }),
  fc("last_login", "Last Login", { headerKey: "headers.lastLogin", mobileCard: true }),
  fc("last_pass_change", "Last Pass. Change", { headerKey: "headers.lastPassChange" }),
  fc("active_status", "Active/Released", { headerKey: "headers.activeReleased", badge: true, mobileCard: true }),
];

const CIRCLE_COLS: ColDef[] = [
  fc("circle", "Circle / Range / Zone", { headerKey: "headers.circleRangeZone", mobileCard: true, truncate: "normal" }),
  fc("serial", "S/N", { headerKey: "headers.serialNo", truncate: "compact" }),
  fc("user_id", "User ID", { headerKey: "headers.userId", mobileCard: true }),
  fc("designation", "Designation", { headerKey: "headers.designation", mobileCard: true, truncate: "normal" }),
  fc("user_name", "User Name", { headerKey: "headers.userName", mobileCard: true, truncate: "normal" }),
  fc("email", "Email", { headerKey: "headers.email", truncate: "long" }),
  fc("phone", "Phone", { headerKey: "headers.phone", truncate: "compact" }),
  fc("last_login", "Last Login", { headerKey: "headers.lastLogin", mobileCard: true }),
  fc("last_pass_change", "Last Pass. Change", { headerKey: "headers.lastPassChange" }),
  fc("active_status", "Active/Released", { headerKey: "headers.activeReleased", badge: true, mobileCard: true }),
  fc("entry_today", "Entry Today", { headerKey: "headers.entryToday", truncate: "compact" }),
  fc("entry_upto", "Entry Up to", { headerKey: "headers.entryUpto", truncate: "compact" }),
];

function circlesForZone(zone: string): string[] {
  return zone === "Taxes Zone, Barishal" ? BARISHAL_CIRCLES : DEFAULT_CIRCLES;
}

function needsZoneCircle(userType: string): boolean {
  return userType === "DATA ENTRY OPERATOR";
}

function rowContains(row: TableRow, query: string): boolean {
  if (!query.trim()) return true;
  const needle = query.trim().toLowerCase();
  return Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(needle));
}

function activeFilterValues(values: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value && !value.startsWith("All"))
  );
}

function flattenDrawerColumns(cols: ColDef[] | undefined) {
  return (cols ?? []).flatMap((col) => {
    if (col.type === "col") {
      return [{
        key: col.col.key,
        label: col.col.label,
        labelKey: col.col.headerKey,
      }];
    }
    return col.group.cols.map((subCol) => ({
      key: subCol.key,
      label: subCol.label,
      labelKey: subCol.headerKey,
      groupLabel: col.group.label,
      groupLabelKey: col.group.groupKey,
    }));
  });
}

export function UserActivityReportPage() {
  const { isDesktop } = useUIState();
  const { t: tc } = useTranslation("common");
  const { t: tp } = useTranslation("pages");
  const { t: tr } = useTranslation("report");

  const baseCfg = REPORT_CFGS["user-activity-report"];

  const [activeTab, setActiveTab] = useState("users");
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [drawerRow, setDrawerRow] = useState<TableRow | null>(null);

  const [activityQuery, setActivityQuery] = useState("");
  const [activityPage, setActivityPage] = useState(1);
  const [activityDraft, setActivityDraft] = useState<Record<string, string>>({
    user_type: "",
    assessment_year: "",
  });
  const [activityApplied, setActivityApplied] = useState<Record<string, string>>({});
  const [activityGenerated, setActivityGenerated] = useState(false);
  const [activitySubmitAttempted, setActivitySubmitAttempted] = useState(false);

  const [orgQuery, setOrgQuery] = useState("");
  const [orgPage, setOrgPage] = useState(1);
  const [orgShowFilter, setOrgShowFilter] = useState(false);
  const [orgDraft, setOrgDraft] = useState<Record<string, string>>({});
  const [orgApplied, setOrgApplied] = useState<Record<string, string>>({});
  const [orgView, setOrgView] = useState<"zonal" | "circle">("zonal");
  const [selectedZone, setSelectedZone] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kpi-collapsed:user-activity-report");
      if (saved !== null) setSummaryOpen(saved !== "false");
    } catch {
      // keep default
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("kpi-collapsed:user-activity-report", String(summaryOpen));
    } catch {
      // ignore storage failures
    }
  }, [summaryOpen]);

  const activityRows = useMemo<TableRow[]>(() => {
    const roleValues = USER_TYPES;
    const years = ASSESSMENT_YEARS;
    return baseCfg.rows.map((row, index) => {
      const zone = TAX_ZONES[index % Math.min(TAX_ZONES.length, 8)];
      const circleList = circlesForZone(zone);
      return {
        ...row,
        serial: String(index + 1),
        user_type: roleValues[index % roleValues.length],
        assessment_year: years[index % years.length],
        zone,
        circle: circleList[index % circleList.length],
        range: "Range " + String((index % 3) + 1),
        active_status: String(row.active_status) === "Inactive" ? "Released" : "Active",
      };
    });
  }, [baseCfg.rows]);

  const handleActivityFilterChange = useCallback((key: string, value: string) => {
    setActivityDraft((previous) => {
      const next = { ...previous, [key]: value };
      if (key === "user_type") {
        if (needsZoneCircle(value)) {
          next.zone = "";
          next.circle = "";
        } else {
          delete next.zone;
          delete next.circle;
        }
      }
      if (key === "zone") {
        next.circle = "";
      }
      return next;
    });
    setActivityApplied({});
    setActivityGenerated(false);
    setActivitySubmitAttempted(false);
    setActivityQuery("");
    setActivityPage(1);
  }, []);

  const activityCriteriaComplete = useMemo(() => {
    const userType = activityDraft.user_type ?? "";
    const assessmentYear = activityDraft.assessment_year ?? "";
    if (!userType || !assessmentYear) return false;
    if (needsZoneCircle(userType)) {
      return Boolean(activityDraft.zone && activityDraft.circle);
    }
    return true;
  }, [activityDraft]);

  const applyActivityFilters = useCallback(() => {
    setActivitySubmitAttempted(true);
    if (!activityCriteriaComplete) return;
    setActivityApplied(activityDraft);
    setActivityGenerated(true);
    setActivityPage(1);
    setActivityQuery("");
  }, [activityDraft, activityCriteriaComplete]);

  const resetActivityFilters = useCallback(() => {
    setActivityDraft({ user_type: "", assessment_year: "" });
    setActivityApplied({});
    setActivityGenerated(false);
    setActivitySubmitAttempted(false);
    setActivityQuery("");
    setActivityPage(1);
  }, []);

  const activityFilteredBySelection = useMemo(() => {
    if (!activityGenerated) return [];
    return activityRows.filter((row) => {
      const userType = activityApplied.user_type;
      const year = activityApplied.assessment_year;
      const zone = activityApplied.zone;
      const circle = activityApplied.circle;

      if (userType && String(row.user_type) !== userType) return false;
      if (year && String(row.assessment_year) !== year) return false;
      if (zone && String(row.zone) !== zone) return false;
      if (circle && String(row.circle) !== circle) return false;
      return true;
    });
  }, [activityRows, activityApplied, activityGenerated]);

  const activityFiltered = useMemo(
    () => activityFilteredBySelection.filter((row) => rowContains(row, activityQuery)),
    [activityFilteredBySelection, activityQuery]
  );

  const activityKpis = useMemo<KpiDef[]>(() => {
    const active = activityFilteredBySelection.filter((row) => row.active_status === "Active").length;
    const released = activityFilteredBySelection.filter((row) => row.active_status === "Released").length;
    const entryToday = activityFilteredBySelection.reduce(
      (sum, row) => sum + (parseInt(String(row.entry_today ?? "0"), 10) || 0),
      0
    );
    return [
      { label: tr("userActivityWorkspace.kpis.totalUsers"), value: String(activityFilteredBySelection.length), tone: "primary" },
      { label: tr("userActivityWorkspace.kpis.active"), value: String(active), tone: "success" },
      { label: tr("userActivityWorkspace.kpis.released"), value: String(released), tone: "error" },
      { label: tr("userActivityWorkspace.kpis.totalEntryToday"), value: String(entryToday), tone: "neutral" },
    ];
  }, [activityFilteredBySelection, tr]);

  const zonalRows = useMemo<TableRow[]>(() => {
    return TAX_ZONES.slice(0, 18).map((zone, index) => {
      const source = activityRows[index % activityRows.length];
      return {
        ...source,
        serial: String(index + 1),
        zone_name: zone,
        zone,
        user_id: ZONAL_IDS[index] ?? "CT-" + String(index + 1).padStart(3, "0"),
        designation: "COMMISSIONER",
        user_name: ZONAL_NAMES[index] ?? String(source.user_name ?? ""),
        assessment_year: "2024-25",
        active_status: index === 8 || index === 14 ? "Released" : "Active",
      };
    });
  }, [activityRows]);

  const circleRows = useMemo<TableRow[]>(() => {
    if (!selectedZone) return [];
    const circles = circlesForZone(selectedZone);
    return activityRows.slice(0, 12).map((source, index) => ({
      ...source,
      serial: String(index + 1),
      zone: selectedZone,
      circle: circles[index % circles.length],
      range: "Range " + String((index % 3) + 1),
      user_id: (index % 2 === 0 ? "IC" : "C") + String(index + 1).padStart(3, "0"),
      designation: [
        "CIRCLE INSPECTOR",
        "CIRCLE OFFICER (DCT)",
        "DATA ENTRY OPERATOR",
        "OFFICE ASSISTANT",
      ][index % 4],
      assessment_year: "2024-25",
      active_status: index % 4 === 0 ? "Released" : "Active",
    }));
  }, [activityRows, selectedZone]);

  const orgFilterDefs = useMemo<FilterDef[]>(() => [
    {
      key: "assessment_year",
      label: tr("userActivityWorkspace.filters.assessmentYear"),
      type: "select",
      options: ASSESSMENT_YEARS,
    },
  ], [tr]);

  const applyOrgFilters = useCallback(() => {
    setOrgApplied(orgDraft);
    setOrgPage(1);
    setOrgShowFilter(false);
  }, [orgDraft]);

  const resetOrgFilters = useCallback(() => {
    setOrgDraft({});
    setOrgApplied({});
    setOrgPage(1);
  }, []);

  const orgSourceRows = orgView === "zonal" ? zonalRows : circleRows;

  const orgFiltered = useMemo(() => {
    const year = orgApplied.assessment_year;
    return orgSourceRows.filter((row) => {
      if (year && year !== "All Years" && String(row.assessment_year) !== year) return false;
      return rowContains(row, orgQuery);
    });
  }, [orgApplied, orgQuery, orgSourceRows]);

  const activityPageRows = useMemo(
    () => activityFiltered.slice((activityPage - 1) * PER_PAGE, activityPage * PER_PAGE),
    [activityFiltered, activityPage]
  );

  const orgPageRows = useMemo(
    () => orgFiltered.slice((orgPage - 1) * PER_PAGE, orgPage * PER_PAGE),
    [orgFiltered, orgPage]
  );

  const drawerColumns = useMemo(() => [
    {
      key: "assessment_year",
      label: tr("userActivityWorkspace.filters.assessmentYear"),
      groupLabel: tr("userActivityWorkspace.groups.reportingScope"),
    },
    {
      key: "zone",
      label: tr("userActivityWorkspace.filters.zone"),
      groupLabel: tr("userActivityWorkspace.groups.reportingScope"),
    },
    {
      key: "range",
      label: tr("userActivityWorkspace.fields.range"),
      groupLabel: tr("userActivityWorkspace.groups.reportingScope"),
    },
    ...flattenDrawerColumns(baseCfg.drawerCols),
  ], [baseCfg.drawerCols, tr]);

  const openCircleReport = useCallback((row: TableRow) => {
    const zone = String(row.zone_name ?? row.zone ?? "");
    if (!zone) return;
    setSelectedZone(zone);
    setOrgView("circle");
    setOrgPage(1);
    setOrgQuery("");
  }, []);

  const backToZonal = useCallback(() => {
    setOrgView("zonal");
    setSelectedZone("");
    setOrgPage(1);
    setOrgQuery("");
  }, []);

  const title = tp("userActivityReport.title") || baseCfg.title;
  const desc = tp("userActivityReport.desc") || baseCfg.desc;
  const tabs = [
    { id: "users", label: tr("userActivityWorkspace.tabs.users") },
    { id: "organization", label: tr("userActivityWorkspace.tabs.organization") },
  ];

  const orgHasFilters = Object.keys(activeFilterValues(orgApplied)).length > 0;

  return (
    <div className="table-page">
      <div className="table-page__header">
        <div>
          <h1 className="table-page__title">{title}</h1>
          <p className="table-page__desc">{desc}</p>
        </div>
        {activeTab === "users" && (
          <div className="table-page__actions">
            <button
              onClick={() => setSummaryOpen((open) => !open)}
              className="table-page__kpi-toggle"
              aria-expanded={summaryOpen}
              aria-controls="kpi-section-panel"
            >
              {summaryOpen ? (
                <><ChevronUp size={13} aria-hidden="true" />{tc("actions.hideSummary")}</>
              ) : (
                <><ChevronDown size={13} aria-hidden="true" />{tc("actions.showSummary")}</>
              )}
            </button>
          </div>
        )}
      </div>

      <TabBar tabs={tabs} active={activeTab} onChange={(id) => {
        setActiveTab(id);
        setDrawerRow(null);
      }} />

      {activeTab === "users" ? (
        <>
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="dash-section__title-text">
                {tr("userActivityWorkspace.criteria.title")}
              </h2>
            </div>

            <div className="card-body">
              <div className="filter-grid">
                <AppSelectField
                  id="user-activity-user-type"
                  label={tr("userActivityWorkspace.filters.userType")}
                  value={activityDraft.user_type ?? ""}
                  onChange={(value) => handleActivityFilterChange("user_type", value)}
                  options={[
                    { value: "", label: tc("common.selectPlaceholder") },
                    ...USER_TYPES.map((value) => ({ value, label: value })),
                  ]}
                  error={activitySubmitAttempted && !activityDraft.user_type
                    ? tr("userActivityWorkspace.validation.required")
                    : undefined}
                  required
                  compact
                />

                <AppSelectField
                  id="user-activity-assessment-year"
                  label={tr("userActivityWorkspace.filters.assessmentYear")}
                  value={activityDraft.assessment_year ?? ""}
                  onChange={(value) => handleActivityFilterChange("assessment_year", value)}
                  options={[
                    { value: "", label: tc("common.selectPlaceholder") },
                    ...ASSESSMENT_YEARS.map((value) => ({ value, label: value })),
                  ]}
                  error={activitySubmitAttempted && !activityDraft.assessment_year
                    ? tr("userActivityWorkspace.validation.required")
                    : undefined}
                  required
                  compact
                />

                {needsZoneCircle(activityDraft.user_type ?? "") && (
                  <TaxZoneSelectField
                    id="user-activity-zone"
                    label={tr("userActivityWorkspace.filters.zone")}
                    value={activityDraft.zone ?? ""}
                    onChange={(value) => handleActivityFilterChange("zone", value)}
                    placeholder={tc("common.selectPlaceholder")}
                    error={activitySubmitAttempted && !activityDraft.zone
                      ? tr("userActivityWorkspace.validation.required")
                      : undefined}
                    required
                    compact
                  />
                )}

                {needsZoneCircle(activityDraft.user_type ?? "") && activityDraft.zone && (
                  <AppSelectField
                    id="user-activity-circle"
                    label={tr("userActivityWorkspace.filters.circle")}
                    value={activityDraft.circle ?? ""}
                    onChange={(value) => handleActivityFilterChange("circle", value)}
                    options={[
                      { value: "", label: tc("common.selectPlaceholder") },
                      ...circlesForZone(activityDraft.zone).map((value) => ({ value, label: value })),
                    ]}
                    error={activitySubmitAttempted && !activityDraft.circle
                      ? tr("userActivityWorkspace.validation.required")
                      : undefined}
                    required
                    compact
                  />
                )}
              </div>
            </div>

            <div className="card-footer filter-actions filter-actions--card">
              <SecondaryButton size="sm" onClick={resetActivityFilters}>
                {tc("actions.reset")}
              </SecondaryButton>
              <PrimaryButton size="sm" onClick={applyActivityFilters}>
                {tr("userActivityWorkspace.actions.generateReport")}
              </PrimaryButton>
            </div>
          </div>

          {activityGenerated && (
            <>
              <CollapsibleKpiSection kpis={activityKpis} open={summaryOpen} />

              <div className="table-card">
                <div className="table-card__toolbar">
                  <div className="table-card__title-group">
                    <h2 className="table-card__title">{tr("userActivityWorkspace.tables.users")}</h2>
                    <span className="table-card__count">{activityFiltered.length} {tc("common.records")}</span>
                  </div>
                  <div className="table-card__search-wrapper">
                    <AppSearchField
                      value={activityQuery}
                      onChange={(value) => {
                        setActivityQuery(value);
                        setActivityPage(1);
                      }}
                      placeholder={tc("common.searchPlaceholder")}
                      label={tc("common.searchPlaceholder")}
                      size="compact"
                    />
                  </div>
                  <button
                    className="table-card__toolbar-btn table-card__toolbar-btn--download"
                    onClick={() => handleExportDisabled(tc("actions.exportDisabled"))}
                  >
                    <Download size={13} aria-hidden="true" /> {tc("actions.export")}
                  </button>
                  <button
                    className="table-card__toolbar-btn table-card__toolbar-btn--print"
                    onClick={() => window.print()}
                  >
                    <Printer size={13} aria-hidden="true" /> {tc("actions.print")}
                  </button>
                </div>

                <ResponsiveTable
                  cols={USER_ACTIVITY_COLS}
                  rows={activityPageRows}
                  actions={ROW_VIEW}
                  onRowClick={setDrawerRow}
                  onActionClick={(_id, row) => setDrawerRow(row)}
                  mobileCardMapping={{
                    primary: "user_name",
                    identifier: "user_id",
                    meta: ["zone", "circle", "designation"],
                    status: "active_status",
                    date: "last_login",
                  }}
                  noCard
                />

                <div className="table-card__pagination">
                  <Pagination
                    page={activityPage}
                    total={activityFiltered.length}
                    perPage={PER_PAGE}
                    onPage={setActivityPage}
                  />
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <MobileSearchFilter
            searchValue={orgQuery}
            onSearchChange={(value) => {
              setOrgQuery(value);
              setOrgPage(1);
            }}
            onFilterClick={() => setOrgShowFilter((open) => !open)}
            placeholder={tc("common.searchPlaceholder")}
            hasActiveFilters={orgHasFilters}
          />

          <div className="table-card">
            <div className="table-card__toolbar">
              <div className="table-card__title-group">
                {orgView === "circle" && (
                  <SecondaryButton size="sm" icon={ArrowLeft} onClick={backToZonal}>
                    {tr("userActivityWorkspace.actions.backToZonal")}
                  </SecondaryButton>
                )}
                <h2 className="table-card__title">
                  {orgView === "zonal"
                    ? tr("userActivityWorkspace.tables.zonal")
                    : tr("userActivityWorkspace.tables.circle") + " · " + selectedZone}
                </h2>
                <span className="table-card__count">{orgFiltered.length} {tc("common.records")}</span>
              </div>
              <div className="table-card__search-wrapper">
                <AppSearchField
                  value={orgQuery}
                  onChange={(value) => {
                    setOrgQuery(value);
                    setOrgPage(1);
                  }}
                  placeholder={tc("common.searchPlaceholder")}
                  label={tc("common.searchPlaceholder")}
                  size="compact"
                />
              </div>
              <button
                onClick={() => setOrgShowFilter((open) => !open)}
                className={"table-card__toolbar-btn" + (orgShowFilter ? " table-card__toolbar-btn--active" : "")}
              >
                <Filter size={13} aria-hidden="true" /> {tc("actions.filter")}
              </button>
              <button
                className="table-card__toolbar-btn table-card__toolbar-btn--download"
                onClick={() => handleExportDisabled(tc("actions.exportDisabled"))}
              >
                <Download size={13} aria-hidden="true" /> {tc("actions.export")}
              </button>
              <button
                className="table-card__toolbar-btn table-card__toolbar-btn--print"
                onClick={() => window.print()}
              >
                <Printer size={13} aria-hidden="true" /> {tc("actions.print")}
              </button>
            </div>

            {isDesktop && orgShowFilter && (
              <div className="table-card__filter-panel">
                <FilterPanel
                  filters={orgFilterDefs}
                  values={orgDraft}
                  onChange={(key, value) => setOrgDraft((previous) => ({ ...previous, [key]: value }))}
                  onApply={applyOrgFilters}
                  onReset={resetOrgFilters}
                />
              </div>
            )}

            <AppliedFilterChips values={orgApplied} onClear={resetOrgFilters} inCard />

            <ResponsiveTable
              cols={orgView === "zonal" ? ZONAL_COLS : CIRCLE_COLS}
              rows={orgPageRows}
              actions={orgView === "circle" ? ROW_VIEW : undefined}
              onRowClick={orgView === "zonal" ? openCircleReport : setDrawerRow}
              onActionClick={orgView === "circle" ? ((_id, row) => setDrawerRow(row)) : undefined}
              clickableKeys={orgView === "zonal" ? ["zone_name"] : undefined}
              onCellClick={orgView === "zonal" ? ((_key, _value, row) => openCircleReport(row)) : undefined}
              mobileCardMapping={orgView === "zonal"
                ? {
                    primary: "zone_name",
                    identifier: "user_id",
                    meta: ["designation", "user_name"],
                    status: "active_status",
                    date: "last_login",
                  }
                : {
                    primary: "user_name",
                    identifier: "user_id",
                    meta: ["circle", "designation", "range"],
                    status: "active_status",
                    date: "last_login",
                  }
              }
              noCard
            />

            <div className="table-card__pagination">
              <Pagination
                page={orgPage}
                total={orgFiltered.length}
                perPage={PER_PAGE}
                onPage={setOrgPage}
              />
            </div>
          </div>

          {!isDesktop && (
            <MobileFilterOverlay
              isOpen={orgShowFilter}
              filters={orgFilterDefs}
              values={orgDraft}
              onChange={(key, value) => setOrgDraft((previous) => ({ ...previous, [key]: value }))}
              onApply={applyOrgFilters}
              onReset={resetOrgFilters}
              onClose={() => setOrgShowFilter(false)}
            />
          )}
        </>
      )}

      <DynamicDetailsDrawer
        open={drawerRow !== null}
        onClose={() => setDrawerRow(null)}
        title={tr("userActivityWorkspace.details.title")}
        columns={drawerColumns}
        rowData={drawerRow}
        showActions
        summarySubtitleKey="designation"
      />
    </div>
  );
}
