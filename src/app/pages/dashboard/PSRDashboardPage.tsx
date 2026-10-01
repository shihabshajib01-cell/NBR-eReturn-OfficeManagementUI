import { useMemo, useState } from "react";
import { Activity, Download, Filter, Printer, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatCard } from "../../components/cards/StatCard";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { AppSelectField } from "../../components/forms/AppSelectField";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { FilterPanel } from "../../components/filters/FilterPanel";
import { MobileFilterOverlay } from "../../components/filters/MobileFilterOverlay";
import { AppliedFilterChips } from "../../components/filters/AppliedFilterChips";
import { useSettings } from "../../hooks/useSettings";
import { useUIState } from "../../hooks/useUI";
import { handleExportDisabled } from "../../utils/exportDisabled";
import type { ColDef, FilterDef, MobileCardMapping } from "../modulePageUtils";

const CIRCLE_PSR_COLS: ColDef[] = [
  { type: "col", col: { key: "serial_no", label: "S/N", headerKey: "headers.serialNo", mono: true, truncate: "none" } },
  { type: "col", col: { key: "zone", label: "Zone", headerKey: "headers.zone", truncate: "none" } },
  { type: "col", col: { key: "total_psr", label: "Total PSR", headerKey: "headers.totalPsr", mono: true, truncate: "none" } },
  { type: "col", col: { key: "double_entry", label: "Double Entry", headerKey: "headers.doubleEntry", mono: true, truncate: "none" } },
  { type: "col", col: { key: "double_entry_percentage", label: "Double Entry Percentage (%)", headerKey: "headers.doubleEntryPercentage", mono: true, truncate: "none" } },
];

const CIRCLE_PSR_MOBILE_MAPPING: MobileCardMapping = {
  primary: "zone",
  identifier: "serial_no",
  meta: ["total_psr", "double_entry", "double_entry_percentage"],
};

const CIRCLE_PSR_DATA = [
  { serial_no: "1", zone: "Large Taxpayers Unit (Tax)", total_psr: "4", double_entry: "0", double_entry_percentage: "0.00" },
  { serial_no: "2", zone: "01, Dhaka", total_psr: "1", double_entry: "0", double_entry_percentage: "0.00" },
  { serial_no: "3", zone: "03, Dhaka", total_psr: "3", double_entry: "0", double_entry_percentage: "0.00" },
  { serial_no: "4", zone: "05, Dhaka", total_psr: "2", double_entry: "0", double_entry_percentage: "0.00" },
  { serial_no: "5", zone: "08, Dhaka", total_psr: "2", double_entry: "0", double_entry_percentage: "0.00" },
  { serial_no: "6", zone: "12, Dhaka", total_psr: "11", double_entry: "0", double_entry_percentage: "0.00" },
  { serial_no: "7", zone: "13, Dhaka", total_psr: "103", double_entry: "11", double_entry_percentage: "10.68" },
  { serial_no: "8", zone: "14, Dhaka", total_psr: "10", double_entry: "7", double_entry_percentage: "70.00" },
];

const PSR_STATUS_OPTIONS = [
  "All",
  "All Individual",
  "All Companies",
  "Any Other Company",
  "Association of Persons",
  "Bangladeshi without NID",
  "Bangladeshi without NID -> Minor / Dependent",
  "Co-Operative Society",
  "Corporation",
  "Cultural/Social/Sports organisation",
  "Foreign Company not registered with RJSC",
  "Foreigner (Non Bangladeshi)",
  "Foreigner (Non Bangladeshi) Minor / Dependent",
  "Foundation",
  "Gratuity Funds",
  "Growth Funds",
  "Hindu Undivided Family",
  "Individual -> Bangladeshi -> Having NID",
  "Individual -> Bangladeshi -> Minor/ Dependent",
  "Load Funds",
  "Local Authority",
  "Mutual Funds",
  "NGO",
  "Non Resident Bangladeshi without NID",
  "Non Resident Bangladeshi without NID -> Minor / Dependent",
  "Not Registered with RJSC",
  "Other Funds",
  "Pension Funds",
  "Political" + " Party",
  "Private Limited Company",
  "Provident Funds",
  "Public Limited Company",
  "Registered with RJSC",
  "Religious / Charitable Institution",
  "Special. Purpose Funds",
  "Super Annuation Funds",
  "Trust",
  "Trust Funds",
  "Welfare Funds",
];

const PSR_FILTERS: FilterDef[] = [
  {
    key: "zone",
    label: "Zone",
    type: "select",
    options: ["All", ...CIRCLE_PSR_DATA.map(row => row.zone)],
  },
  {
    key: "double_entry",
    label: "Double Entry",
    type: "select",
    options: ["All", "Has Double Entry", "No Double Entry"],
  },
];

export function PSRDashboardPage() {
  const { assessmentYear: ay } = useSettings();
  const { isDesktop } = useUIState();
  const { t: translate } = useTranslation("dashboard");
  const { t: translateCommon } = useTranslation("common");
  const { t: translateFilters } = useTranslation("filters");

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  const [dashboardAssessmentYear, setDashboardAssessmentYear] = useState(ay);
  const [dashboardZone, setDashboardZone] = useState("All");
  const [dashboardStatus, setDashboardStatus] = useState("All");
  const [appliedDashboardAssessmentYear, setAppliedDashboardAssessmentYear] = useState(ay);
  const [appliedDashboardZone, setAppliedDashboardZone] = useState("All");
  const [appliedDashboardStatus, setAppliedDashboardStatus] = useState("All");

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return CIRCLE_PSR_DATA.filter(row => {
      const matchesSearch =
        !query ||
        Object.values(row).some(value => String(value).toLowerCase().includes(query));

      const matchesZone =
        (!appliedFilters.zone ||
          appliedFilters.zone === "All" ||
          row.zone === appliedFilters.zone) &&
        (!appliedDashboardZone ||
          appliedDashboardZone === "All" ||
          row.zone === appliedDashboardZone);

      const doubleEntryCount = Number(row.double_entry);
      const matchesDoubleEntry =
        !appliedFilters.double_entry ||
        appliedFilters.double_entry === "All" ||
        (appliedFilters.double_entry === "Has Double Entry" && doubleEntryCount > 0) ||
        (appliedFilters.double_entry === "No Double Entry" && doubleEntryCount === 0);

      return matchesSearch && matchesZone && matchesDoubleEntry;
    });
  }, [search, appliedFilters, appliedDashboardZone]);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filterValues);
    setShowFilter(false);
  };

  const handleResetFilters = () => {
    setFilterValues({});
    setAppliedFilters({});
    setShowFilter(false);
  };

  const handleApplyDashboardFilters = () => {
    setAppliedDashboardAssessmentYear(dashboardAssessmentYear);
    setAppliedDashboardZone(dashboardZone);
    setAppliedDashboardStatus(dashboardStatus);
  };

  const assessmentYearOptions = Array.from(new Set([ay, "2025-26", "2024-25", "2023-24", "2022-23", "2021-22"]));

  void appliedDashboardStatus;

  const kpiCards = [
    { label: translate("psr.kpis.totalPsrEntries"), value: "174", icon: Shield, tone: "primary" as const },
    { label: translate("psr.kpis.totalDoubleEntry"), value: "34", icon: Activity, tone: "success" as const },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <h1 className="dashboard-page__title">{translate("psr.title")}</h1>
        <p className="dashboard-page__subtitle">{translate("psr.subtitle")}</p>
      </div>

      <div className="psr-dashboard__filters" role="group" aria-label={translateFilters("labels.filters")}>
        <AppSelectField
          id="psr-dashboard-assessment-year"
          label={translateFilters("labels.assessmentYear")}
          value={dashboardAssessmentYear}
          onChange={setDashboardAssessmentYear}
          options={assessmentYearOptions}
          compact
        />
        <AppSelectField
          id="psr-dashboard-zone"
          label={translateFilters("labels.zone")}
          value={dashboardZone}
          onChange={setDashboardZone}
          options={["All", ...CIRCLE_PSR_DATA.map(row => row.zone)]}
          compact
        />
        <AppSelectField
          id="psr-dashboard-status"
          label={translateFilters("labels.status")}
          value={dashboardStatus}
          onChange={setDashboardStatus}
          options={PSR_STATUS_OPTIONS}
          compact
        />
        <div className="psr-dashboard__filter-action">
          <PrimaryButton size="sm" onClick={handleApplyDashboardFilters}>
            {translateCommon("actions.apply")}
          </PrimaryButton>
        </div>
      </div>

      <div className="dashboard-kpi-grid dashboard-kpi-grid--1row">
        {kpiCards.map((card, i) => (
          <StatCard key={i} icon={card.icon} value={card.value} label={card.label} tone={card.tone} />
        ))}
      </div>

      <div className="dashboard-content-stack">
        <div className="table-card">
          <div className="table-card__toolbar">
            <div className="table-card__title-group">
              <h2 className="table-card__title">{translate("psr.sections.circlewisePsrStatus")}</h2>
              <span className="table-card__count" aria-live="polite" aria-atomic="true">
                {filteredRows.length} {translateCommon("common.records")}
              </span>
              <span className="dash-section__badge">
                {translateCommon("common.ayAbbrev")} {appliedDashboardAssessmentYear}
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

            <button
              type="button"
              onClick={() => setShowFilter(open => !open)}
              className={`table-card__toolbar-btn${showFilter ? " table-card__toolbar-btn--active" : ""}`}
              aria-expanded={showFilter}
            >
              <Filter size={13} aria-hidden="true" />
              {translateCommon("actions.filter")}
            </button>

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

          {isDesktop && showFilter && (
            <div className="table-card__filter-panel">
              <FilterPanel
                filters={PSR_FILTERS}
                values={filterValues}
                onChange={handleFilterChange}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            </div>
          )}

          <AppliedFilterChips
            values={appliedFilters}
            onClear={handleResetFilters}
            inCard
          />

          <ResponsiveTable
            cols={CIRCLE_PSR_COLS}
            rows={filteredRows}
            mobileCardMapping={CIRCLE_PSR_MOBILE_MAPPING}
            noCard
          />
        </div>
      </div>

      {!isDesktop && (
        <MobileFilterOverlay
          isOpen={showFilter}
          filters={PSR_FILTERS}
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
