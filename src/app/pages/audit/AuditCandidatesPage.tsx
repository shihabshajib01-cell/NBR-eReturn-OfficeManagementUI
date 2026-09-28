import { useMemo, useState } from "react";
import { Download, Filter, Plus, Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { DynamicDetailsDrawer } from "../../components/drawers/DynamicDetailsDrawer";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { FilterPanel } from "../../components/filters/FilterPanel";
import { MobileFilterOverlay } from "../../components/filters/MobileFilterOverlay";
import { AppliedFilterChips } from "../../components/filters/AppliedFilterChips";
import { MobileSearchFilter } from "../../components/shared/MobileSearchFilter";
import { Pagination } from "../../components/shared/Pagination";
import { useUIState } from "../../hooks/useUI";
import { handleExportDisabled } from "../../utils/exportDisabled";
import type { ColDef, FilterDef, TableRow } from "../modulePageUtils";
import { fc } from "../modulePageUtils";
import { getAuditCandidates } from "./auditCandidateStore";
import { AuditExplainerDrawer } from "./AuditExplainerDrawer";
import { resolveAuditExplanation, type AuditExplanation } from "./auditKnowledge";
import { InitiateAuditModal } from "./InitiateAuditPage";

const PER_PAGE = 10;

function unique(rows: TableRow[], field: string): string[] {
  return Array.from(new Set(rows.map((row) => String(row[field] ?? "")).filter(Boolean))).sort((a,b) => a.localeCompare(b));
}

function flattenColumns(cols: ColDef[]) {
  return cols.flatMap((col) => col.type === "col"
    ? [{ key: col.col.key, label: col.col.label }]
    : col.group.cols.map((c) => ({ key: c.key, label: c.label, groupLabel: col.group.label }))
  );
}

interface AuditCandidatesPageProps {
  initialInitiateOpen?: boolean;
}

export function AuditCandidatesPage({ initialInitiateOpen = false }: AuditCandidatesPageProps) {
  const { isDesktop } = useUIState();
  const { t, i18n } = useTranslation("audit");
  const { t: tc } = useTranslation("common");
  const [rows, setRows] = useState<TableRow[]>(() => getAuditCandidates());
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState<TableRow | null>(null);
  const [explanation, setExplanation] = useState<AuditExplanation | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string,string>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string,string>>({});
  const [initiateOpen, setInitiateOpen] = useState(initialInitiateOpen);

  const cols: ColDef[] = [
    fc("candidate_id", t("candidates.columns.candidateId"), { mono:true }),
    fc("taxpayer_name", t("columns.taxpayer")),
    fc("tin", t("columns.tin"), { mono:true }),
    fc("circle", t("columns.circle")),
    fc("selection_track", t("candidates.columns.selectionTrack")),
    fc("coverage_tier", t("columns.coverageTier")),
    fc("risk_level", t("columns.riskLevel")),
    { type:"col", col:{ key:"candidate_status", label:t("candidates.columns.candidateStatus"), badge:true } },
    { type:"col", col:{ key:"audit_status", label:t("candidates.columns.auditStatus"), badge:true } },
    fc("selected_on", t("candidates.columns.selectedOn")),
  ];

  const drawerCols = flattenColumns([
    fc("candidate_id", t("candidates.columns.candidateId")),
    fc("batch_id", t("candidates.columns.batchId")),
    fc("taxpayer_name", t("columns.taxpayer")),
    fc("tin", t("columns.tin")),
    fc("return_id", t("columns.returnId")),
    fc("assessment_year", t("columns.assessmentYear")),
    fc("circle", t("columns.circle")),
    fc("selection_track", t("candidates.columns.selectionTrack")),
    fc("selection_basis", t("candidates.columns.selectionBasis")),
    fc("coverage_tier", t("columns.coverageTier")),
    fc("signals", t("columns.signals")),
    fc("risk_level", t("columns.riskLevel")),
    fc("control_flags", t("columns.controlFlags")),
    { type:"col", col:{ key:"candidate_status", label:t("candidates.columns.candidateStatus"), badge:true } },
    { type:"col", col:{ key:"audit_status", label:t("candidates.columns.auditStatus"), badge:true } },
    fc("selected_on", t("candidates.columns.selectedOn")),
  ]);

  const filters: FilterDef[] = [
    { key:"assessment_year", label:t("columns.assessmentYear"), type:"select", options:["",...unique(rows,"assessment_year")] },
    { key:"circle", label:t("filters.circle"), type:"select", options:["",...unique(rows,"circle")] },
    { key:"selection_track", label:t("candidates.filters.selectionTrack"), type:"select", options:["",...unique(rows,"selection_track")] },
    { key:"coverage_tier", label:t("filters.coverageTier"), type:"select", options:["",...unique(rows,"coverage_tier")] },
    { key:"risk_level", label:t("filters.riskLevel"), type:"select", options:["",...unique(rows,"risk_level")] },
    { key:"candidate_status", label:t("candidates.columns.candidateStatus"), type:"select", options:["",...unique(rows,"candidate_status")] },
    { key:"audit_status", label:t("candidates.columns.auditStatus"), type:"select", options:["",...unique(rows,"audit_status")] },
  ];

  const filtered = useMemo(() => {
    const needle=q.trim().toLowerCase();
    return rows.filter((row) => {
      const searchOk=!needle || Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(needle));
      const filterOk=filters.every((filter) => {
        const selected=appliedFilters[filter.key];
        return !selected || String(row[filter.key] ?? "") === selected;
      });
      return searchOk && filterOk;
    });
  }, [rows,q,appliedFilters]);

  const safePage=Math.min(page,Math.max(1,Math.ceil(filtered.length/PER_PAGE)));
  const pageRows=filtered.slice((safePage-1)*PER_PAGE,safePage*PER_PAGE);
  const hasActiveFilters=Object.values(appliedFilters).some(Boolean);

  const applyFilters=() => {
    setAppliedFilters(Object.fromEntries(Object.entries(filterValues).filter(([,value]) => value)));
    setShowFilter(false);
    setPage(1);
  };
  const resetFilters=() => {
    setFilterValues({});
    setAppliedFilters({});
    setPage(1);
  };

  const explain=(key:string,value:string,row:TableRow) => {
    const lookupKey=key === "audit_status" ? "audit_state" : key;
    const resolved=resolveAuditExplanation(lookupKey,value,row,i18n.resolvedLanguage);
    if(resolved) setExplanation(resolved);
  };

  return (
    <div className="table-page">
      <div className="table-page__header">
        <div>
          <h1 className="table-page__title">{t("candidates.title")}</h1>
          <p className="table-page__desc">{t("candidates.description")}</p>
        </div>
        <div className="table-page__actions">
          <button
            type="button"
            className="action-btn action-btn--primary"
            onClick={() => setInitiateOpen(true)}
          >
            <Plus size={11} strokeWidth={3} aria-hidden="true" />
            {t("candidates.initiateAction")}
          </button>
        </div>
      </div>

      <MobileSearchFilter
        searchValue={q}
        onSearchChange={(value)=>{setQ(value);setPage(1);}}
        onFilterClick={()=>setShowFilter((open)=>!open)}
        placeholder={tc("common.searchPlaceholder")}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="table-card">
        <div className="table-card__toolbar">
          <div className="table-card__title-group">
            <h2 className="table-card__title">{t("candidates.tableTitle")}</h2>
            <span className="table-card__count">{filtered.length} {tc("common.records")}</span>
          </div>

          <div className="table-card__search-wrapper">
            <AppSearchField
              value={q}
              onChange={(value)=>{setQ(value);setPage(1);}}
              label={tc("common.searchPlaceholder")}
              placeholder={tc("common.searchPlaceholder")}
              size="compact"
            />
          </div>

          <button type="button" onClick={()=>setShowFilter((open)=>!open)} className={`table-card__toolbar-btn${showFilter ? " table-card__toolbar-btn--active" : ""}`}>
            <Filter size={13} aria-hidden="true" /> {tc("actions.filter")}
          </button>
          <button type="button" className="table-card__toolbar-btn table-card__toolbar-btn--download" onClick={()=>handleExportDisabled(tc("actions.exportDisabled"))}>
            <Download size={13} aria-hidden="true" /> {tc("actions.export")}
          </button>
          <button type="button" className="table-card__toolbar-btn table-card__toolbar-btn--print" onClick={()=>window.print()}>
            <Printer size={13} aria-hidden="true" /> {tc("actions.print")}
          </button>
        </div>

        {isDesktop && showFilter && (
          <div className="table-card__filter-panel">
            <FilterPanel
              filters={filters}
              values={filterValues}
              onChange={(key,value)=>setFilterValues((prev)=>({...prev,[key]:value}))}
              onApply={applyFilters}
              onReset={resetFilters}
            />
          </div>
        )}

        <AppliedFilterChips values={appliedFilters} onClear={resetFilters} inCard />

        <ResponsiveTable
          cols={cols}
          rows={pageRows}
          onRowClick={setDrawer}
          noCard
          clickableKeys={["circle","coverage_tier","risk_level","audit_status"]}
          onCellClick={explain}
          mobileCardMapping={{primary:"taxpayer_name",identifier:"tin",meta:["circle","selection_track","risk_level"],status:"audit_status",date:"selected_on"}}
          aria-label={t("candidates.tableTitle")}
        />

        <div className="table-card__pagination">
          <Pagination total={filtered.length} page={safePage} perPage={PER_PAGE} onPage={setPage} />
        </div>
      </div>

      <DynamicDetailsDrawer
        open={drawer !== null}
        onClose={()=>setDrawer(null)}
        title={t("candidates.detailsTitle")}
        columns={drawerCols}
        rowData={drawer}
        showActions={false}
      />

      <AuditExplainerDrawer explanation={explanation} onClose={()=>setExplanation(null)} />

      <InitiateAuditModal
        open={initiateOpen}
        onClose={() => setInitiateOpen(false)}
        onConfirmed={() => {
          setRows(getAuditCandidates());
          setPage(1);
        }}
      />

      {!isDesktop && (
        <MobileFilterOverlay
          isOpen={showFilter}
          filters={filters}
          values={filterValues}
          onChange={(key,value)=>setFilterValues((prev)=>({...prev,[key]:value}))}
          onApply={applyFilters}
          onReset={resetFilters}
          onClose={()=>setShowFilter(false)}
        />
      )}
    </div>
  );
}
