import { useCallback, useMemo, useState } from "react";
import { Activity, ArrowLeft, BadgeCheck, Clock, ClipboardList, Download, Filter, Printer } from "lucide-react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { StatCard } from "../../components/cards/StatCard";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { FilterPanel } from "../../components/filters/FilterPanel";
import { MobileFilterOverlay } from "../../components/filters/MobileFilterOverlay";
import { AppliedFilterChips } from "../../components/filters/AppliedFilterChips";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { useSettings } from "../../hooks/useSettings";
import { useUIState } from "../../hooks/useUI";
import { handleExportDisabled } from "../../utils/exportDisabled";
import type { ColDef, FilterDef, MobileCardMapping, TableRow } from "../modulePageUtils";

const ZONE_ROWS: TableRow[] = [
  { serial_no: "1", zone: "Taxes Zone 8, Dhaka", not_initialized: "1", initialized: "0", double_entry_complete: "0", co_ongoing: "0", approved: "0", total_psr: "1" },
  { serial_no: "2", zone: "Taxes zone-13, Dhaka", not_initialized: "2", initialized: "2", double_entry_complete: "0", co_ongoing: "0", approved: "0", total_psr: "4" },
  { serial_no: "3", zone: "Taxes Zone, Gazipur", not_initialized: "3", initialized: "2", double_entry_complete: "0", co_ongoing: "1", approved: "1", total_psr: "7" },
  { serial_no: "4", zone: "Large Taxpayers Unit (Tax)", not_initialized: "1", initialized: "0", double_entry_complete: "0", co_ongoing: "0", approved: "0", total_psr: "1" },
  { serial_no: "5", zone: "Taxes Zone, Rajshahi", not_initialized: "2", initialized: "0", double_entry_complete: "0", co_ongoing: "0", approved: "0", total_psr: "2" },
  { serial_no: "6", zone: "Taxes Zone, Jashore", not_initialized: "2", initialized: "1", double_entry_complete: "0", co_ongoing: "1", approved: "0", total_psr: "4" },
  { serial_no: "7", zone: "Taxes Zone, Kushtia", not_initialized: "1", initialized: "0", double_entry_complete: "0", co_ongoing: "0", approved: "0", total_psr: "1" },
  { serial_no: "8", zone: "Taxes Zone, Faridpur", not_initialized: "1", initialized: "0", double_entry_complete: "0", co_ongoing: "0", approved: "0", total_psr: "1" },
];

const CIRCLE_ROWS_BY_ZONE: Record<string, TableRow[]> = {
  "Taxes Zone 8, Dhaka": [
    { serial_no: "1", circle: "Circle-176", not_initialized: "1", initialized: "0", double_entry_complete: "0", co_ongoing: "0", approved: "0", total_psr: "1" },
  ],
};

const USER_ROWS_BY_CIRCLE: Record<string, TableRow[]> = {
  "Circle-176": [
    { serial_no: "1", user_id: "user1@176Dhaka", name: "Jahid Hasan", draft_entry: "0", saved_entry: "0", entry_complete: "0", co_ongoing: "0", approved_entry: "0", designation: "ডাটা এন্ট্রি অপারেটর", status_code: "Active" },
    { serial_no: "2", user_id: "user2@176Dhaka", name: "Shohel Rana", draft_entry: "0", saved_entry: "0", entry_complete: "0", co_ongoing: "0", approved_entry: "0", designation: "ডাটা এন্ট্রি অপারেটর", status_code: "Active" },
  ],
};

const AGGREGATE_COLS: ColDef[] = [
  { type: "col", col: { key: "serial_no", label: "S/N", headerKey: "headers.serialNo", mono: true, truncate: "none" } },
  { type: "col", col: { key: "zone", label: "Zone", headerKey: "headers.zone", truncate: "none" } },
  { type: "col", col: { key: "not_initialized", label: "Not Initialized", headerKey: "headers.notInitialized", mono: true, truncate: "none" } },
  { type: "col", col: { key: "initialized", label: "Initialized", headerKey: "headers.initialized", mono: true, truncate: "none" } },
  { type: "col", col: { key: "double_entry_complete", label: "Double Entry Complete", headerKey: "headers.doubleEntryComplete", mono: true, truncate: "none" } },
  { type: "col", col: { key: "co_ongoing", label: "CO Ongoing", headerKey: "headers.coOngoing", mono: true, truncate: "none" } },
  { type: "col", col: { key: "approved", label: "Approved", headerKey: "headers.approved", mono: true, truncate: "none" } },
  { type: "col", col: { key: "total_psr", label: "Total PSR", headerKey: "headers.totalPsr", mono: true, truncate: "none" } },
];

const CIRCLE_COLS: ColDef[] = AGGREGATE_COLS.map(def => {
  if (def.type === "col" && def.col.key === "zone") {
    return { type: "col", col: { ...def.col, key: "circle", label: "Circle", headerKey: "headers.circle" } };
  }
  return def;
});

const USER_COLS: ColDef[] = [
  { type: "col", col: { key: "serial_no", label: "S/N", headerKey: "headers.serialNo", mono: true, truncate: "none" } },
  { type: "col", col: { key: "user_id", label: "User ID", headerKey: "headers.userId", truncate: "none" } },
  { type: "col", col: { key: "name", label: "Name", headerKey: "headers.name", truncate: "none" } },
  { type: "col", col: { key: "draft_entry", label: "Draft Entry", headerKey: "headers.draftEntry", mono: true, truncate: "none" } },
  { type: "col", col: { key: "saved_entry", label: "Saved Entry", headerKey: "headers.savedEntry", mono: true, truncate: "none" } },
  { type: "col", col: { key: "entry_complete", label: "Entry Complete", headerKey: "headers.entryComplete", mono: true, truncate: "none" } },
  { type: "col", col: { key: "co_ongoing", label: "CO Ongoing", headerKey: "headers.coOngoing", mono: true, truncate: "none" } },
  { type: "col", col: { key: "approved_entry", label: "Approved Entry", headerKey: "headers.approvedEntry", mono: true, truncate: "none" } },
  { type: "col", col: { key: "designation", label: "Designation", headerKey: "headers.designation", truncate: "none" } },
  { type: "col", col: { key: "status", label: "Status", headerKey: "headers.status", badge: true, truncate: "none" } },
];

const ZONE_MOBILE_MAPPING: MobileCardMapping = {
  primary: "zone",
  identifier: "serial_no",
  meta: ["not_initialized", "initialized", "co_ongoing", "approved", "total_psr"],
};

const CIRCLE_MOBILE_MAPPING: MobileCardMapping = {
  primary: "circle",
  identifier: "serial_no",
  meta: ["not_initialized", "initialized", "co_ongoing", "approved", "total_psr"],
};

const USER_MOBILE_MAPPING: MobileCardMapping = {
  primary: "name",
  identifier: "user_id",
  meta: ["draft_entry", "saved_entry", "entry_complete", "co_ongoing", "approved_entry", "designation"],
  status: "status",
};

function numeric(row: TableRow, key: string) {
  return Number(row[key] ?? 0);
}

function aggregateSummary(rows: TableRow[]) {
  return {
    notInitialized: rows.reduce((sum, row) => sum + numeric(row, "not_initialized"), 0),
    initialized: rows.reduce((sum, row) => sum + numeric(row, "initialized"), 0),
    pending: rows.reduce((sum, row) => sum + numeric(row, "co_ongoing"), 0),
    approved: rows.reduce((sum, row) => sum + numeric(row, "approved"), 0),
  };
}

function rowMatchesAggregateStatus(row: TableRow, status?: string) {
  if (!status || status.startsWith("All")) return true;
  if (status === "Not Initialized") return numeric(row, "not_initialized") > 0;
  if (status === "Initialized") return numeric(row, "initialized") > 0;
  if (status === "Double Entry Complete") return numeric(row, "double_entry_complete") > 0;
  if (status === "CO Ongoing" || status === "Pending") return numeric(row, "co_ongoing") > 0;
  if (status === "Approved") return numeric(row, "approved") > 0;
  return true;
}

export function CombinedDashboardPage() {
  const { assessmentYear } = useSettings();
  const { isDesktop } = useUIState();
  const { t: translate } = useTranslation("dashboard");
  const { t: translateCommon } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedZone = searchParams.get("zone") || "";
  const selectedCircle = searchParams.get("circle") || "";
  const level = selectedCircle ? "user" : selectedZone ? "circle" : "zone";

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  const filters = useMemo<FilterDef[]>(() => [
    {
      key: "assessment_year",
      label: "Assessment Year",
      labelKey: "labels.assessmentYear",
      type: "select",
      options: ["2025-26", "2024-25", "2023-24", "2022-23", "2021-22"],
    },
    {
      key: "tax_zone",
      label: "Zone",
      labelKey: "labels.zone",
      type: "select",
      options: ["All Zones", ...ZONE_ROWS.map(row => String(row.zone))],
      optionKeys: { "All Zones": "options.allZones" },
    },
    {
      key: "status",
      label: "Status",
      labelKey: "labels.status",
      type: "select",
      options: ["All Status", "Not Initialized", "Initialized", "Double Entry Complete", "CO Ongoing", "Approved"],
      optionKeys: {
        "All Status": "options.allStatus",
        "Not Initialized": "options.notInitialized",
        "Initialized": "options.initialized",
        "Double Entry Complete": "options.doubleEntryComplete",
        "CO Ongoing": "options.coOngoing",
        "Approved": "options.approved",
      },
    },
  ], []);

  const sourceRows = useMemo<TableRow[]>(() => {
    if (level === "user") {
      return (USER_ROWS_BY_CIRCLE[selectedCircle] ?? []).map(row => ({
        ...row,
        status: String(row.status_code ?? ""),
      }));
    }
    if (level === "circle") return CIRCLE_ROWS_BY_ZONE[selectedZone] ?? [];
    return ZONE_ROWS;
  }, [level, selectedCircle, selectedZone]);

  const scopeRows = useMemo(() => {
    if (level !== "zone") return sourceRows;

    return sourceRows.filter(row => {
      const zoneFilter = appliedFilters.tax_zone;
      if (zoneFilter && !zoneFilter.startsWith("All") && row.zone !== zoneFilter) return false;

      const statusFilter = appliedFilters.status;
      if (!rowMatchesAggregateStatus(row, statusFilter)) return false;

      // The current verified source is aggregate-only and does not expose
      // per-assessment-year row dimensions. Preserve AY as report context
      // without inventing unsupported row-level values.
      return true;
    });
  }, [sourceRows, appliedFilters, level]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return scopeRows;
    return scopeRows.filter(row =>
      Object.values(row).some(value => String(value ?? "").toLowerCase().includes(query))
    );
  }, [scopeRows, search]);

  const summary = useMemo(() => {
    if (level === "user") {
      const circleRow = (CIRCLE_ROWS_BY_ZONE[selectedZone] ?? []).find(row => row.circle === selectedCircle);
      return circleRow
        ? aggregateSummary([circleRow])
        : { notInitialized: 0, initialized: 0, pending: 0, approved: 0 };
    }

    return aggregateSummary(scopeRows);
  }, [level, scopeRows, selectedCircle, selectedZone]);

  const kpiCards = [
    { label: translate("combined.kpis.notInitialized"), value: String(summary.notInitialized), icon: ClipboardList, tone: "primary" as const },
    { label: translate("combined.kpis.initialized"), value: String(summary.initialized), icon: Activity, tone: "success" as const },
    { label: translate("combined.kpis.pending"), value: String(summary.pending), icon: Clock, tone: "warning" as const },
    { label: translate("combined.kpis.totalApproved"), value: String(summary.approved), icon: BadgeCheck, tone: "neutral" as const },
  ];

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(filterValues);
    setShowFilter(false);
  }, [filterValues]);

  const handleResetFilters = useCallback(() => {
    setFilterValues({});
    setAppliedFilters({});
    setShowFilter(false);
  }, []);

  const resetNestedState = useCallback(() => {
    setSearch("");
    setFilterValues({});
    setAppliedFilters({});
    setShowFilter(false);
  }, []);

  const handleCellClick = useCallback((key: string, value: string) => {
    if (key === "zone") {
      setSearchParams({ zone: value });
      resetNestedState();
      return;
    }

    if (key === "circle" && selectedZone) {
      setSearchParams({ zone: selectedZone, circle: value });
      resetNestedState();
    }
  }, [resetNestedState, selectedZone, setSearchParams]);

  const handleBack = useCallback(() => {
    if (level === "user" && selectedZone) {
      setSearchParams({ zone: selectedZone });
    } else {
      setSearchParams({});
    }
    resetNestedState();
  }, [level, resetNestedState, selectedZone, setSearchParams]);

  const cols = level === "user" ? USER_COLS : level === "circle" ? CIRCLE_COLS : AGGREGATE_COLS;
  const clickableKeys = level === "zone" ? ["zone"] : level === "circle" ? ["circle"] : undefined;
  const mobileCardMapping = level === "user" ? USER_MOBILE_MAPPING : level === "circle" ? CIRCLE_MOBILE_MAPPING : ZONE_MOBILE_MAPPING;

  const sectionTitle =
    level === "user"
      ? translate("combined.sections.userwiseStatus")
      : level === "circle"
        ? translate("combined.sections.circlewiseStatus")
        : translate("combined.sections.zonewiseStatus");

  const subtitle =
    level === "user"
      ? translate("combined.circleSubtitle", { circle: selectedCircle, zone: selectedZone })
      : level === "circle"
        ? translate("combined.zoneSubtitle", { zone: selectedZone })
        : translate("combined.subtitle");

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        {level !== "zone" && (
          <div className="mb-3">
            <SecondaryButton
              size="sm"
              icon={ArrowLeft}
              onClick={handleBack}
            >
              {level === "user"
                ? translate("combined.actions.backToCircles")
                : translate("combined.actions.backToZones")}
            </SecondaryButton>
          </div>
        )}
        <h1 className="dashboard-page__title">{translate("combined.title")}</h1>
        <p className="dashboard-page__subtitle">{subtitle}</p>
      </div>

      <div className="combine-dashboard__metric-group">
        <div className="combine-dashboard__group-label flex items-center gap-2">
          <h2 className="dash-section__title-text">
            {translate("combined.sections.overview")}
          </h2>

          <div className="table-page__actions ml-auto">
            {level === "zone" && (
              <button
                type="button"
                onClick={() => setShowFilter(open => !open)}
                className={`table-card__toolbar-btn${showFilter ? " table-card__toolbar-btn--active" : ""}`}
                aria-expanded={showFilter}
              >
                <Filter size={13} aria-hidden="true" />
                {translateCommon("actions.filter")}
              </button>
            )}

            <button
              type="button"
              className="table-card__toolbar-btn table-card__toolbar-btn--download"
              onClick={() => handleExportDisabled(translateCommon("actions.exportDisabled"))}
            >
              <Download size={13} aria-hidden="true" />
              {translateCommon("actions.export")}
            </button>

            <button
              type="button"
              className="table-card__toolbar-btn table-card__toolbar-btn--print"
              onClick={() => window.print()}
            >
              <Printer size={13} aria-hidden="true" />
              {translateCommon("actions.print")}
            </button>
          </div>
        </div>

        {level === "zone" && isDesktop && showFilter && (
          <div className="card">
            <FilterPanel
              filters={filters}
              values={filterValues}
              onChange={handleFilterChange}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              cardLayout
            />
          </div>
        )}

        {level === "zone" && (
          <AppliedFilterChips values={appliedFilters} onClear={handleResetFilters} />
        )}

        <div className="dashboard-kpi-grid dashboard-kpi-grid--1row">
          {kpiCards.map((card, index) => (
            <StatCard
              key={index}
              icon={card.icon}
              value={card.value}
              label={card.label}
              tone={card.tone}
            />
          ))}
        </div>
      </div>

      <div className="dashboard-content-stack">
        <div className="table-card">
          <div className="table-card__toolbar">
            <div className="table-card__title-group">
              <h2 className="table-card__title">{sectionTitle}</h2>
              <span className="table-card__count" aria-live="polite" aria-atomic="true">
                {filteredRows.length} {translateCommon("common.records")}
              </span>
              <span className="dash-section__badge">
                {translateCommon("common.ayAbbrev")} {level === "zone" && appliedFilters.assessment_year ? appliedFilters.assessment_year : assessmentYear}
              </span>
            </div>

            <div className="table-card__search-wrapper">
              <AppSearchField
                value={search}
                onChange={setSearch}
                placeholder={translateCommon("common.searchPlaceholder")}
                label={translateCommon("common.searchPlaceholder")}
                size="compact"
              />
            </div>
          </div>

          <ResponsiveTable
            cols={cols}
            rows={filteredRows}
            mobileCardMapping={mobileCardMapping}
            clickableKeys={clickableKeys}
            onCellClick={handleCellClick}
            noCard
          />
        </div>
      </div>

      {level === "zone" && !isDesktop && (
        <MobileFilterOverlay
          isOpen={showFilter}
          filters={filters}
          values={filterValues}
          onChange={handleFilterChange}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}
