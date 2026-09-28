import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Activity, BadgeCheck, Download, FileSearch, Filter, Printer, Scale, ShieldAlert,
  Timer, Workflow,
} from "lucide-react";
import { StatCard } from "../../components/cards/StatCard";
import { StatusBadge } from "../../components/badges/StatusBadge";
import { DashSection } from "../../components/dashboard/DashSection";
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
import {
  ALL_TAXPAYER_ROWS, AUDIT_TRAIL_ROWS, CONTROL_ROWS, QUEUE_HEALTH_ROWS,
  RECONCILIATION_ROWS, RISK_CASE_ROWS, RISK_DISTRIBUTION_ROWS, ROLE_SCOPE_ROWS,
  RULE_ROWS, SECOND_REVIEW_ROWS,
} from "./auditData";
import { AuditExplainerDrawer } from "./AuditExplainerDrawer";
import { resolveAuditExplanation, type AuditExplanation } from "./auditKnowledge";
import { AuditCandidatesPage } from "./AuditCandidatesPage";

const PER_PAGE = 10;

type AuditTableConfig = {
  title: string;
  description: string;
  rows: TableRow[];
  columns: ColDef[];
  drawerColumns?: ColDef[];
  filters: FilterDef[];
  clickableKeys?: string[];
  mobileCardMapping?: {
    primary?: string;
    identifier?: string;
    meta?: string[];
    status?: string;
    date?: string;
  };
  readOnly?: boolean;
};

function flattenColumns(cols: ColDef[]) {
  return cols.flatMap((col) => col.type === "col"
    ? [{ key: col.col.key, label: col.col.label }]
    : col.group.cols.map((c) => ({ key: c.key, label: c.label, groupLabel: col.group.label }))
  );
}

function uniqueValues(rows: TableRow[], field: string): string[] {
  return Array.from(new Set(
    rows.map(row => String(row[field] ?? "").trim()).filter(Boolean)
  )).sort((a, b) => a.localeCompare(b));
}

function AuditTablePage({ config }: { config: AuditTableConfig }) {
  const { isDesktop } = useUIState();
  const { t, i18n } = useTranslation("audit");
  const { t: translateCommon } = useTranslation("common");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState<TableRow | null>(null);
  const [explanation, setExplanation] = useState<AuditExplanation | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return config.rows.filter((row) => {
      const matchesSearch = !needle || Object.values(row).some((v) =>
        String(v ?? "").toLowerCase().includes(needle)
      );
      const matchesFilters = config.filters.every((filter) => {
        const selected = appliedFilters[filter.key];
        return !selected || String(row[filter.key] ?? "") === selected;
      });
      return matchesSearch && matchesFilters;
    });
  }, [config.rows, config.filters, appliedFilters, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const drawerCols = flattenColumns(config.drawerColumns ?? config.columns);
  const hasActiveFilters = Object.values(appliedFilters).some(Boolean);

  const handleCellExplain = (key: string, value: string, row: TableRow) => {
    const resolved = resolveAuditExplanation(key, value, row, i18n.resolvedLanguage);
    if (resolved) setExplanation(resolved);
  };

  const handleSearchChange = (value: string) => {
    setQ(value);
    setPage(1);
  };

  const handleFilterToggle = () => setShowFilter((open) => !open);
  const handleFilterChange = (key: string, value: string) =>
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  const handleFilterApply = () => {
    setAppliedFilters(Object.fromEntries(Object.entries(filterValues).filter(([, value]) => value)));
    setShowFilter(false);
    setPage(1);
  };
  const handleFilterReset = () => {
    setFilterValues({});
    setAppliedFilters({});
    setPage(1);
  };

  return (
    <div className="table-page">
      <div className="table-page__header">
        <div>
          <h1 className="table-page__title">{config.title}</h1>
          <p className="table-page__desc">{config.description}</p>
        </div>
        {config.readOnly && <StatusBadge value="Read only" />}
      </div>

      <MobileSearchFilter
        searchValue={q}
        onSearchChange={handleSearchChange}
        onFilterClick={handleFilterToggle}
        placeholder={translateCommon("common.searchPlaceholder")}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="table-card">
        <div className="table-card__toolbar">
          <div className="table-card__title-group">
            <h2 className="table-card__title">{config.title}</h2>
            <span className="table-card__count" aria-live="polite" aria-atomic="true">
              {filtered.length} {translateCommon("common.records")}
            </span>
          </div>

          <div className="table-card__search-wrapper">
            <AppSearchField
              value={q}
              onChange={handleSearchChange}
              placeholder={translateCommon("common.searchPlaceholder")}
              label={translateCommon("common.searchPlaceholder")}
              size="compact"
            />
          </div>

          {config.filters.length > 0 && (
            <button
              type="button"
              onClick={handleFilterToggle}
              className={`table-card__toolbar-btn${showFilter ? " table-card__toolbar-btn--active" : ""}`}
            >
              <Filter size={13} aria-hidden="true" /> {translateCommon("actions.filter")}
            </button>
          )}

          <button
            type="button"
            className="table-card__toolbar-btn table-card__toolbar-btn--download"
            onClick={() => handleExportDisabled(translateCommon("actions.exportDisabled"))}
          >
            <Download size={13} aria-hidden="true" /> {translateCommon("actions.export")}
          </button>

          <button
            type="button"
            className="table-card__toolbar-btn table-card__toolbar-btn--print"
            onClick={() => window.print()}
          >
            <Printer size={13} aria-hidden="true" /> {translateCommon("actions.print")}
          </button>
        </div>

        {isDesktop && showFilter && config.filters.length > 0 && (
          <div className="table-card__filter-panel">
            <FilterPanel
              filters={config.filters}
              values={filterValues}
              onChange={handleFilterChange}
              onApply={handleFilterApply}
              onReset={handleFilterReset}
            />
          </div>
        )}

        <AppliedFilterChips values={appliedFilters} onClear={handleFilterReset} inCard />

        <ResponsiveTable
          cols={config.columns}
          rows={pageRows}
          onRowClick={(row) => setDrawer(row)}
          noCard
          clickableKeys={config.clickableKeys}
          onCellClick={handleCellExplain}
          mobileCardMapping={config.mobileCardMapping}
          aria-label={config.title}
        />

        <div className="table-card__pagination">
          <Pagination
            total={filtered.length}
            page={safePage}
            perPage={PER_PAGE}
            onPage={setPage}
          />
        </div>
      </div>

      <DynamicDetailsDrawer
        open={drawer !== null}
        onClose={() => setDrawer(null)}
        title={config.readOnly ? t("common.readOnlyDetails") : t("common.recordDetails")}
        columns={drawerCols}
        rowData={drawer}
        showActions={false}
      />

      <AuditExplainerDrawer explanation={explanation} onClose={() => setExplanation(null)} />

      {!isDesktop && config.filters.length > 0 && (
        <MobileFilterOverlay
          isOpen={showFilter}
          filters={config.filters}
          values={filterValues}
          onChange={handleFilterChange}
          onApply={handleFilterApply}
          onReset={handleFilterReset}
          onClose={handleFilterToggle}
        />
      )}
    </div>
  );
}

function AuditOverviewPage() {
  const { t, i18n } = useTranslation("audit");
  const [explanation, setExplanation] = useState<AuditExplanation | null>(null);

  const riskCols: ColDef[] = [
    fc("risk_level", t("columns.riskLevel")),
    fc("case_count", t("columns.caseCount"), { mono: true }),
    fc("handling", t("columns.reviewHandling")),
  ];
  const queueCols: ColDef[] = [
    fc("queue", t("columns.queue")),
    fc("open_items", t("columns.openItems"), { mono: true }),
    fc("waiting_on", t("columns.waitingOn")),
    { type:"col", col:{ key:"queue_status", label:t("columns.status"), badge:true } },
  ];
  const roleCols: ColDef[] = [
    fc("role", t("columns.role")),
    fc("jurisdiction", t("columns.jurisdiction")),
    fc("primary_audit_work", t("columns.primaryAuditWork"), { truncate:"long" }),
    fc("data_access", t("columns.dataAccess"), { truncate:"long" }),
  ];

  const explain = (key: string, value: string, row: TableRow) => {
    const resolved = resolveAuditExplanation(key, value, row, i18n.resolvedLanguage);
    if (resolved) setExplanation(resolved);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <h1 className="dashboard-page__title">{t("pages.overview.title")}</h1>
        <p className="dashboard-page__subtitle">{t("pages.overview.description")}</p>
      </div>

      <div className="dashboard-kpi-grid dashboard-kpi-grid--1row">
        <StatCard icon={ShieldAlert} value="38" label={t("overview.openRiskCases")} subInfo={t("overview.globalScope")} tone="warning" />
        <StatCard icon={FileSearch} value="12" label={t("overview.evidencePending")} subInfo={t("overview.signalLinkedEvidence")} tone="primary" />
        <StatCard icon={BadgeCheck} value="7" label={t("overview.readyForSecondReview")} subInfo={t("overview.rangeOfficerQueue")} tone="primary" />
        <StatCard icon={Timer} value="3" label={t("overview.slaEscalations")} subInfo={t("overview.proposedSlaNote")} tone="warning" />
      </div>

      <div className="dashboard-section-grid">
        <DashSection title={t("overview.riskDistribution")} icon={Scale}>
          <ResponsiveTable
            cols={riskCols}
            rows={RISK_DISTRIBUTION_ROWS}
            noCard
            clickableKeys={["risk_level"]}
            onCellClick={explain}
            aria-label={t("overview.riskDistribution")}
          />
        </DashSection>
        <DashSection title={t("overview.queueHealth")} icon={Activity}>
          <ResponsiveTable
            cols={queueCols}
            rows={QUEUE_HEALTH_ROWS}
            noCard
            clickableKeys={["queue_status"]}
            onCellClick={explain}
            aria-label={t("overview.queueHealth")}
          />
        </DashSection>
      </div>

      <DashSection title={t("overview.roleScope")} icon={Workflow}>
        <ResponsiveTable cols={roleCols} rows={ROLE_SCOPE_ROWS} noCard aria-label={t("overview.roleScope")} />
      </DashSection>

      <AuditExplainerDrawer explanation={explanation} onClose={() => setExplanation(null)} />
    </div>
  );
}

export function AuditModulePage() {
  const { subNav = "audit-overview" } = useParams<{ subNav: string }>();
  const { t } = useTranslation("audit");

  const opts = (values: string[]) => values;

  const taxpayerConfig: AuditTableConfig = {
    title: t("pages.allTaxpayers.title"),
    description: t("pages.allTaxpayers.description"),
    rows: ALL_TAXPAYER_ROWS,
    columns: [
      fc("taxpayer_name", t("columns.taxpayer")),
      fc("tin", t("columns.tin"), { mono:true }),
      fc("circle", t("columns.circle")),
      fc("assessment_year", t("columns.assessmentYear")),
      { type:"col", col:{ key:"data_quality", label:t("columns.dataQuality"), badge:true } },
      fc("coverage_tier", t("columns.coverageTier")),
      fc("signals", t("columns.signals"), { truncate:"normal" }),
      fc("risk_level", t("columns.riskLevel")),
      fc("control_flags", t("columns.controlFlags")),
      { type:"col", col:{ key:"audit_state", label:t("columns.auditState"), badge:true } },
    ],
    drawerColumns: [
      fc("taxpayer_name", t("columns.taxpayer")), fc("tin", t("columns.tin")), fc("return_id", t("columns.returnId")),
      fc("assessment_year", t("columns.assessmentYear")), fc("return_version", t("columns.returnVersion")),
      fc("circle", t("columns.circle")), { type:"col", col:{ key:"data_quality", label:t("columns.dataQuality"), badge:true } },
      fc("coverage_tier", t("columns.coverageTier")), fc("available_data", t("columns.availableData")),
      fc("signals", t("columns.signals")), fc("risk_level", t("columns.riskLevel")),
      fc("control_flags", t("columns.controlFlags")), { type:"col", col:{ key:"audit_state", label:t("columns.auditState"), badge:true } },
      fc("reason_code", t("columns.reason")),
    ],
    filters: [
      { key:"circle", label:t("filters.circle"), type:"select", options:opts(uniqueValues(ALL_TAXPAYER_ROWS,"circle")) },
      { key:"assessment_year", label:t("filters.assessmentYear"), type:"select", options:opts(uniqueValues(ALL_TAXPAYER_ROWS,"assessment_year")) },
      { key:"data_quality", label:t("filters.dataQuality"), type:"select", options:opts(uniqueValues(ALL_TAXPAYER_ROWS,"data_quality")) },
      { key:"coverage_tier", label:t("filters.coverageTier"), type:"select", options:opts(uniqueValues(ALL_TAXPAYER_ROWS,"coverage_tier")) },
      { key:"risk_level", label:t("filters.riskLevel"), type:"select", options:opts(uniqueValues(ALL_TAXPAYER_ROWS,"risk_level")) },
      { key:"audit_state", label:t("filters.auditState"), type:"select", options:opts(uniqueValues(ALL_TAXPAYER_ROWS,"audit_state")) },
    ],
    clickableKeys:["circle","data_quality","coverage_tier","signals","risk_level","control_flags","audit_state","return_version"],
    mobileCardMapping:{ primary:"taxpayer_name", identifier:"tin", meta:["circle","coverage_tier","risk_level","control_flags"], status:"audit_state" },
  };

  const riskConfig: AuditTableConfig = {
    title: t("pages.riskCases.title"),
    description: t("pages.riskCases.description"),
    rows: RISK_CASE_ROWS,
    columns: [
      fc("case_id", t("columns.caseId"), { mono:true }),
      fc("return_id", t("columns.returnId"), { mono:true }),
      fc("tin", t("columns.tin"), { mono:true }),
      fc("circle", t("columns.circle")),
      fc("coverage_tier", t("columns.coverageTier")),
      fc("risk_level", t("columns.riskLevel")),
      { type:"col", col:{ key:"case_status", label:t("columns.status"), badge:true } },
      fc("sla", t("columns.sla")),
    ],
    drawerColumns: [
      fc("case_id", t("columns.caseId")), fc("return_id", t("columns.returnId")), fc("tin", t("columns.tin")),
      fc("assessment_year", t("columns.assessmentYear")), fc("return_version", t("columns.returnVersion")),
      fc("circle", t("columns.circle")), fc("coverage_tier", t("columns.coverageTier")), fc("risk_level", t("columns.riskLevel")),
      fc("signals", t("columns.signals")), fc("verification_summary", t("columns.verification")),
      { type:"col", col:{ key:"evidence_status", label:t("columns.evidenceStatus"), badge:true } },
      fc("evidence_refs", t("columns.evidenceRefs")), { type:"col", col:{ key:"finding_status", label:t("columns.findingStatus"), badge:true } },
      fc("reason_code", t("columns.reason")), fc("sla", t("columns.sla")),
      { type:"col", col:{ key:"case_status", label:t("columns.status"), badge:true } }, fc("assigned_to", t("columns.assignedTo")),
    ],
    filters: [
      { key:"circle", label:t("filters.circle"), type:"select", options:opts(uniqueValues(RISK_CASE_ROWS,"circle")) },
      { key:"risk_level", label:t("filters.riskLevel"), type:"select", options:opts(["Low","Medium","High","Very High"]) },
      { key:"coverage_tier", label:t("filters.coverageTier"), type:"select", options:opts(["DT0","DT1","DT1+H","DT2","DT3"]) },
      { key:"case_status", label:t("filters.status"), type:"select", options:opts(["Assigned","Verifying","Evidence Pending","Ready for Review","Second Review","Rework Requested","Closed"]) },
    ],
    clickableKeys:["circle","coverage_tier","risk_level","case_status","sla"],
    mobileCardMapping:{ primary:"case_id", identifier:"return_id", meta:["circle","risk_level","coverage_tier"], status:"case_status" },
  };

  const controlConfig: AuditTableConfig = {
    title:t("pages.control.title"),
    description:t("pages.control.description"),
    rows:CONTROL_ROWS,
    columns:[
      fc("return_id",t("columns.returnId"),{mono:true}), fc("tin",t("columns.tin"),{mono:true}),
      fc("circle",t("columns.circle")), fc("flag_id",t("columns.flagId"),{mono:true}), fc("coverage_tier",t("columns.coverageTier")),
      fc("check",t("columns.check"),{truncate:"long"}), {type:"col",col:{key:"control_status",label:t("columns.status"),badge:true}},
    ],
    drawerColumns:[
      fc("return_id",t("columns.returnId")),fc("tin",t("columns.tin")),fc("assessment_year",t("columns.assessmentYear")),
      fc("circle",t("columns.circle")),fc("coverage_tier",t("columns.coverageTier")),fc("flag_id",t("columns.flagId")),
      fc("check",t("columns.check")),fc("source",t("columns.source")),fc("dependency",t("columns.dependency")),
      fc("queue",t("columns.queue")),{type:"col",col:{key:"control_status",label:t("columns.status"),badge:true}},
    ],
    filters:[
      { key:"circle", label:t("filters.circle"), type:"select", options:opts(uniqueValues(CONTROL_ROWS,"circle")) },
      { key:"flag_id", label:t("filters.controlFlag"), type:"select", options:opts(["F0","F1","F2","F3","F4","F5"]) },
      { key:"control_status", label:t("filters.status"), type:"select", options:opts(["Pending","In Progress","Pending Review","Resolved","Under Review"]) },
    ],
    clickableKeys:["circle","flag_id","coverage_tier","control_status"],
    mobileCardMapping:{primary:"flag_id",identifier:"return_id",meta:["circle","coverage_tier","queue"],status:"control_status"},
  };

  const reviewConfig: AuditTableConfig = {
    title:t("pages.secondReview.title"),
    description:t("pages.secondReview.description"),
    rows:SECOND_REVIEW_ROWS,
    columns:[
      fc("case_id",t("columns.caseId"),{mono:true}),fc("return_id",t("columns.returnId"),{mono:true}),
      fc("circle",t("columns.circle")),fc("risk_level",t("columns.riskLevel")),fc("primary_signal",t("columns.primarySignal")),
      fc("evidence_refs",t("columns.evidenceRefs")),{type:"col",col:{key:"review_status",label:t("columns.status"),badge:true}},
    ],
    drawerColumns:[
      fc("case_id",t("columns.caseId")),fc("return_id",t("columns.returnId")),fc("tin",t("columns.tin")),fc("circle",t("columns.circle")),
      fc("risk_level",t("columns.riskLevel")),fc("primary_signal",t("columns.primarySignal")),
      fc("verification_basis",t("columns.verificationBasis")),fc("evidence_refs",t("columns.evidenceRefs")),
      fc("finding_summary",t("columns.findingSummary")),fc("submitted_by",t("columns.submittedBy")),
      {type:"col",col:{key:"review_status",label:t("columns.status"),badge:true}},fc("permitted_actions",t("columns.permittedActions")),
    ],
    filters:[
      { key:"circle", label:t("filters.circle"), type:"select", options:opts(uniqueValues(SECOND_REVIEW_ROWS,"circle")) },
      { key:"risk_level", label:t("filters.riskLevel"), type:"select", options:opts(["High","Very High"]) },
      { key:"review_status", label:t("filters.status"), type:"select", options:opts(["Ready for Review","Second Review","Rework Requested"]) },
    ],
    clickableKeys:["circle","risk_level","primary_signal","review_status"],
    mobileCardMapping:{primary:"case_id",identifier:"return_id",meta:["circle","risk_level","primary_signal"],status:"review_status"},
  };

  const rulesConfig: AuditTableConfig = {
    title:t("pages.rules.title"),
    description:t("pages.rules.description"),
    rows:RULE_ROWS,
    columns:[
      fc("rule_id",t("columns.ruleId"),{mono:true}),fc("version",t("columns.version"),{mono:true}),
      fc("rule_family",t("columns.ruleFamily")), {type:"col",col:{key:"dry_run_status",label:t("columns.dryRun"),badge:true}},
      {type:"col",col:{key:"governance_status",label:t("columns.governanceStatus"),badge:true}},
      {type:"col",col:{key:"mode",label:t("columns.mode"),badge:true}},fc("rollout_scope",t("columns.rolloutScope")),
    ],
    drawerColumns:[
      fc("rule_id",t("columns.ruleId")),fc("version",t("columns.version")),fc("rule_family",t("columns.ruleFamily")),
      fc("author_role",t("columns.authorRole")),fc("plain_language_condition",t("columns.plainLanguageCondition")),
      {type:"col",col:{key:"dry_run_status",label:t("columns.dryRun"),badge:true}},
      {type:"col",col:{key:"governance_status",label:t("columns.governanceStatus"),badge:true}},
      {type:"col",col:{key:"mode",label:t("columns.mode"),badge:true}},fc("rollout_scope",t("columns.rolloutScope")),
      fc("version_note",t("columns.versionNote")),
    ],
    filters:[
      { key:"governance_status", label:t("filters.governanceStatus"), type:"select", options:opts(["Awaiting Endorsement","Awaiting Approval","Approved","Superseded"]) },
      { key:"mode", label:t("filters.mode"), type:"select", options:opts(["Draft","Shadow","Staged","Live","Superseded"]) },
    ],
    clickableKeys:["rule_id","version","dry_run_status","governance_status","mode"],
    mobileCardMapping:{primary:"rule_id",identifier:"version",meta:["rule_family","rollout_scope"],status:"mode"},
  };

  const reconciliationConfig: AuditTableConfig = {
    title:t("pages.reconciliation.title"),
    description:t("pages.reconciliation.description"),
    rows:RECONCILIATION_ROWS,
    columns:[
      fc("reconciliation_date",t("columns.date")),fc("scope",t("columns.scope")),
      fc("high_risk_returns",t("columns.highRiskReturns"),{mono:true}),fc("matching_cases",t("columns.matchingCases"),{mono:true}),
      fc("missing_case_count",t("columns.missingCases"),{mono:true}),
      {type:"col",col:{key:"reconciliation_status",label:t("columns.status"),badge:true}},
    ],
    drawerColumns:[
      fc("reconciliation_date",t("columns.date")),fc("scope",t("columns.scope")),
      fc("high_risk_returns",t("columns.highRiskReturns")),fc("matching_cases",t("columns.matchingCases")),
      fc("missing_case_count",t("columns.missingCases")),
      {type:"col",col:{key:"reconciliation_status",label:t("columns.status"),badge:true}},
      fc("supervisor_view",t("columns.supervisorView")),
    ],
    filters:[
      { key:"reconciliation_status", label:t("filters.status"), type:"select", options:opts(["Matched","Missing Case","Under Review"]) },
      { key:"supervisor_view", label:t("filters.viewer"), type:"select", options:opts(["Range Officer","Commissioner"]) },
    ],
    clickableKeys:["scope","reconciliation_status"],
    mobileCardMapping:{primary:"scope",identifier:"reconciliation_date",meta:["high_risk_returns","missing_case_count"],status:"reconciliation_status",date:"reconciliation_date"},
  };

  const trailConfig: AuditTableConfig = {
    title:t("pages.trail.title"),
    description:t("pages.trail.description"),
    rows:AUDIT_TRAIL_ROWS,
    columns:[
      fc("timestamp_utc",t("columns.timestampUtc")),fc("event_id",t("columns.eventId"),{mono:true}),
      fc("return_id",t("columns.returnId"),{mono:true}),fc("actor_role",t("columns.actorRole")),
      fc("action",t("columns.action"),{truncate:"long"}),fc("return_version",t("columns.returnVersion")),
    ],
    drawerColumns:[
      fc("event_id",t("columns.eventId")),fc("timestamp_utc",t("columns.timestampUtc")),fc("return_id",t("columns.returnId")),
      fc("return_version",t("columns.returnVersion")),fc("actor_id",t("columns.actorId")),fc("actor_role",t("columns.actorRole")),
      fc("action",t("columns.action")),fc("data_state",t("columns.dataState")),fc("assessment",t("columns.assessment")),
      fc("human_record",t("columns.humanRecord")),fc("access_record",t("columns.accessRecord")),
      fc("classification_version",t("columns.classificationVersion")),fc("rule_config_version",t("columns.ruleConfigVersion")),
    ],
    filters:[
      { key:"actor_role", label:t("filters.role"), type:"select", options:opts(["DCT","Range Officer"]) },
      { key:"return_id", label:t("filters.return"), type:"select", options:opts(["RET-2026-10539"]) },
    ],
    clickableKeys:["return_version"],
    mobileCardMapping:{primary:"action",identifier:"event_id",meta:["actor_role","return_id"],date:"timestamp_utc"},
    readOnly:true,
  };

  switch (subNav) {
    case "audit-overview": return <AuditOverviewPage />;
    case "initiate-audit": return <AuditCandidatesPage initialInitiateOpen />;
    case "audit-candidates": return <AuditCandidatesPage />;
    case "all-taxpayers": return <AuditTablePage config={taxpayerConfig} />;
    case "risk-cases": return <AuditTablePage config={riskConfig} />;
    case "control-data-quality": return <AuditTablePage config={controlConfig} />;
    case "second-review": return <AuditTablePage config={reviewConfig} />;
    case "rules-governance": return <AuditTablePage config={rulesConfig} />;
    case "reconciliation": return <AuditTablePage config={reconciliationConfig} />;
    case "audit-trail": return <AuditTablePage config={trailConfig} />;
    default: return <AuditOverviewPage />;
  }
}
