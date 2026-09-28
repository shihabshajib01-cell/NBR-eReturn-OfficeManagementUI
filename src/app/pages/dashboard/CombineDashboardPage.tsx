import { useState, useCallback } from "react";
import { Filter, Printer, FileText, Receipt, Banknote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FilterPanel } from "../../components/filters/FilterPanel";
import { MobileFilterOverlay } from "../../components/filters/MobileFilterOverlay";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { StatCard } from "../../components/cards/StatCard";
import { ViewModeToggle, type ViewMode } from "../../components/shared/ViewModeToggle";
import { useUIState } from "../../hooks/useUI";
import { AY_OPTS } from "../modulePageUtils";
import type { ColDef, FilterDef, MobileCardMapping, TableRow } from "../modulePageUtils";

// Confirmed source data — do not fabricate values for other assessment years
const SOURCE_ROWS: TableRow[] = [
  { submission_type: "Online",  total_submission: "14", tax_paid_173: "0",        total_tax_paid: "4,01,38,53,753" },
  { submission_type: "Offline", total_submission: "16", tax_paid_173: "9,05,696", total_tax_paid: "9,50,441" },
  { submission_type: "Total",   total_submission: "30", tax_paid_173: "9,05,696", total_tax_paid: "4,01,48,04,194" },
];

const COLS: ColDef[] = [
  { type: "col", col: { key: "submission_type", label: "Submission Type",            headerKey: "headers.submissionType" } },
  { type: "col", col: { key: "total_submission", label: "Total Submission",           headerKey: "headers.totalSubmission", mono: true } },
  { type: "col", col: { key: "tax_paid_173",     label: "Tax Paid with Return (173)", headerKey: "headers.taxPaid173",      mono: true } },
  { type: "col", col: { key: "total_tax_paid",   label: "Total Tax Paid",             headerKey: "headers.totalTaxPaid",    mono: true } },
];

const MOBILE_MAPPING: MobileCardMapping = {
  primary: "submission_type",
  identifier: "total_submission",
  meta: ["tax_paid_173", "total_tax_paid"],
};

const FILTERS: FilterDef[] = [
  {
    key: "ay",
    label: "Assessment Year",
    labelKey: "labels.assessmentYear",
    type: "select",
    options: AY_OPTS,
    optionKeys: { "All Years": "options.allYears" },
  },
];

export function CombineDashboardPage() {
  const { isDesktop } = useUIState();
  const { t: translate } = useTranslation("dashboard");
  const { t: tCommon }   = useTranslation("common");
  const { t: tTables }   = useTranslation("tables");

  const [viewMode, setViewMode]     = useState<ViewMode>("table");
  const [showFilter, setShowFilter] = useState(false);
  const [fVals, setFVals]           = useState<Record<string, string>>({});
  const [applied, setApplied]       = useState<Record<string, string>>({});

  const handleFilterToggle = useCallback(() => setShowFilter(s => !s), []);
  const handleFilterChange = useCallback((k: string, v: string) => setFVals(p => ({ ...p, [k]: v })), []);
  const handleFilterApply  = useCallback(() => { setApplied(fVals); setShowFilter(false); }, [fVals]);
  const handleFilterReset  = useCallback(() => { setFVals({}); setApplied({}); }, []);

  // Only the confirmed source values exist; other AY selections yield no data
  const appliedAy = applied["ay"] ?? "";
  const rows = (!appliedAy || appliedAy === "All Years" || appliedAy === "2024-25")
    ? SOURCE_ROWS
    : [];

  // Derive per-category rows for Card View from the single data source
  const onlineRow  = rows.find(r => r.submission_type === "Online");
  const offlineRow = rows.find(r => r.submission_type === "Offline");
  const totalRow   = rows.find(r => r.submission_type === "Total");

  const labelSubmission = tTables("headers.totalSubmission");
  const labelTax173     = tTables("headers.taxPaid173");
  const labelTaxTotal   = tTables("headers.totalTaxPaid");

  const showCardView = viewMode === "card" && isDesktop;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <h1 className="dashboard-page__title">
          {translate("combineDashboard.title")}
        </h1>
        <p className="dashboard-page__subtitle">
          {translate("combineDashboard.subtitle")}
        </p>
      </div>

      <div className="table-card">
        <div className="table-card__toolbar">
          <div className="table-card__title-group">
            <h2 className="table-card__title">
              {translate("combineDashboard.reportTitle")}
            </h2>
          </div>

          <ViewModeToggle
            value={viewMode}
            onChange={setViewMode}
            tableLabel={tCommon("actions.tableView")}
            cardLabel={tCommon("actions.cardView")}
            groupLabel={tCommon("actions.viewMode")}
          />

          <button
            onClick={handleFilterToggle}
            className={`table-card__toolbar-btn${showFilter ? " table-card__toolbar-btn--active" : ""}`}
            aria-label={tCommon("actions.filter")}
            aria-expanded={showFilter}
          >
            <Filter size={13} aria-hidden="true" />
            {tCommon("actions.filter")}
          </button>

          <button
            className="table-card__toolbar-btn table-card__toolbar-btn--print"
            onClick={() => window.print()}
            aria-label={tCommon("actions.print")}
          >
            <Printer size={13} aria-hidden="true" />
            {tCommon("actions.print")}
          </button>
        </div>

        {isDesktop && showFilter && (
          <div className="table-card__filter-panel">
            <FilterPanel
              filters={FILTERS}
              values={fVals}
              onChange={handleFilterChange}
              onApply={handleFilterApply}
              onReset={handleFilterReset}
            />
          </div>
        )}

        {showCardView ? (
          <div className="combine-dashboard-card-view">
            {rows.length === 0 ? (
              <p className="combine-dashboard-card-view__empty">
                {tCommon("common.noRecordsFound")}
              </p>
            ) : (
              <>
                <section className="combine-dashboard__metric-group">
                  <h3 className="combine-dashboard__group-label">{tTables("headers.online")}</h3>
                  <div className="dashboard-kpi-grid">
                    <StatCard icon={FileText} value={String(onlineRow?.total_submission ?? "—")} label={labelSubmission} tone="primary" />
                    <StatCard icon={Receipt}  value={String(onlineRow?.tax_paid_173 ?? "—")}    label={labelTax173}     tone="success" />
                    <StatCard icon={Banknote} value={String(onlineRow?.total_tax_paid ?? "—")}   label={labelTaxTotal}   tone="primary" compactValue />
                  </div>
                </section>

                <section className="combine-dashboard__metric-group">
                  <h3 className="combine-dashboard__group-label">{tTables("headers.offline")}</h3>
                  <div className="dashboard-kpi-grid">
                    <StatCard icon={FileText} value={String(offlineRow?.total_submission ?? "—")} label={labelSubmission} tone="primary" />
                    <StatCard icon={Receipt}  value={String(offlineRow?.tax_paid_173 ?? "—")}     label={labelTax173}     tone="success" />
                    <StatCard icon={Banknote} value={String(offlineRow?.total_tax_paid ?? "—")}    label={labelTaxTotal}   tone="primary" compactValue />
                  </div>
                </section>

                <section className="combine-dashboard__metric-group">
                  <h3 className="combine-dashboard__group-label">{tTables("headers.total")}</h3>
                  <div className="dashboard-kpi-grid">
                    <StatCard icon={FileText} value={String(totalRow?.total_submission ?? "—")} label={labelSubmission} tone="primary" />
                    <StatCard icon={Receipt}  value={String(totalRow?.tax_paid_173 ?? "—")}     label={labelTax173}     tone="success" />
                    <StatCard icon={Banknote} value={String(totalRow?.total_tax_paid ?? "—")}    label={labelTaxTotal}   tone="primary" compactValue />
                  </div>
                </section>
              </>
            )}
          </div>
        ) : (
          <ResponsiveTable
            cols={COLS}
            rows={rows}
            noCard
            mobileCardMapping={MOBILE_MAPPING}
            aria-label={translate("combineDashboard.reportTitle")}
          />
        )}
      </div>

      {!isDesktop && (
        <MobileFilterOverlay
          isOpen={showFilter}
          filters={FILTERS}
          values={fVals}
          onChange={handleFilterChange}
          onApply={handleFilterApply}
          onReset={handleFilterReset}
          onClose={handleFilterToggle}
        />
      )}
    </div>
  );
}
