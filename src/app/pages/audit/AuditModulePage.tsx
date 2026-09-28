import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle, BadgeCheck, FileSearch, History, ListChecks, Scale,
  ShieldAlert, Timer, Workflow, Settings2, ArrowLeftRight, Activity,
} from "lucide-react";
import { StatCard } from "../../components/cards/StatCard";
import { DashSection } from "../../components/dashboard/DashSection";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { DynamicDetailsDrawer } from "../../components/drawers/DynamicDetailsDrawer";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { AppSelectField } from "../../components/forms/AppSelectField";
import { Pagination } from "../../components/shared/Pagination";
import type { ColDef, TableRow } from "../modulePageUtils";
import { fc } from "../modulePageUtils";
import {
  AUDIT_TRAIL_ROWS, CONTROL_ROWS, QUEUE_HEALTH_ROWS, RECONCILIATION_ROWS,
  RISK_CASE_ROWS, RISK_DISTRIBUTION_ROWS, ROLE_SCOPE_ROWS, RULE_ROWS,
  SECOND_REVIEW_ROWS,
} from "./auditData";

const PER_PAGE = 10;

type FilterDef = {
  field: string;
  label: string;
  options: { value: string; label: string }[];
};

type AuditTableConfig = {
  title: string;
  description: string;
  note?: string;
  rows: TableRow[];
  columns: ColDef[];
  drawerColumns?: ColDef[];
  filters: FilterDef[];
  mobileCardMapping?: {
    primary?: string;
    identifier?: string;
    meta?: string[];
    status?: string;
    date?: string;
  };
  readOnly?: boolean;
};

function PrototypeNotice() {
  const { t } = useTranslation("audit");
  return (
    <div className="audit-notice" role="note">
      <AlertTriangle size={16} strokeWidth={1.75} aria-hidden="true" />
      <p>{t("prototypeNotice")}</p>
    </div>
  );
}

function flattenColumns(cols: ColDef[]) {
  return cols.flatMap((col) => col.type === "col"
    ? [{ key: col.col.key, label: col.col.label }]
    : col.group.cols.map((c) => ({ key: c.key, label: c.label, groupLabel: col.group.label }))
  );
}

function AuditTablePage({ config }: { config: AuditTableConfig }) {
  const { t } = useTranslation("audit");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState<TableRow | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    () => Object.fromEntries(config.filters.map((f) => [f.field, "all"]))
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return config.rows.filter((row) => {
      const matchesSearch = !needle || Object.values(row).some((v) =>
        String(v ?? "").toLowerCase().includes(needle)
      );
      const matchesFilters = config.filters.every((f) => {
        const selected = filterValues[f.field] ?? "all";
        return selected === "all" || String(row[f.field] ?? "") === selected;
      });
      return matchesSearch && matchesFilters;
    });
  }, [config.rows, config.filters, filterValues, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const drawerCols = flattenColumns(config.drawerColumns ?? config.columns);

  return (
    <div className="table-page audit-page">
      <div className="table-page__header">
        <div>
          <h1 className="table-page__title">{config.title}</h1>
          <p className="table-page__desc">{config.description}</p>
        </div>
        {config.readOnly && <span className="audit-readonly-badge">{t("common.readOnly")}</span>}
      </div>

      <PrototypeNotice />

      {config.note && (
        <div className="audit-context-card">
          <p>{config.note}</p>
        </div>
      )}

      <div className="table-card">
        <div className="table-card__toolbar audit-table-toolbar">
          <div className="table-card__title-group">
            <h2 className="table-card__title">{config.title}</h2>
            <span className="table-card__count">{filtered.length} {t("common.records")}</span>
          </div>
          <div className="audit-search">
            <AppSearchField
              value={q}
              onChange={(value) => { setQ(value); setPage(1); }}
              label={t("common.search")}
              placeholder={t("common.search")}
              size="compact"
            />
          </div>
        </div>

        {config.filters.length > 0 && (
          <div className="audit-filter-row">
            {config.filters.map((filter) => (
              <AppSelectField
                key={filter.field}
                id={`audit-filter-${filter.field}`}
                label={filter.label}
                value={filterValues[filter.field] ?? "all"}
                onChange={(value) => {
                  setFilterValues((prev) => ({ ...prev, [filter.field]: value }));
                  setPage(1);
                }}
                options={filter.options}
                compact
              />
            ))}
          </div>
        )}

        <ResponsiveTable
          cols={config.columns}
          rows={pageRows}
          onRowClick={(row) => setDrawer(row)}
          noCard
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
    </div>
  );
}

function AuditOverviewPage() {
  const { t } = useTranslation("audit");

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

  return (
    <div className="dashboard-page audit-page">
      <div className="dashboard-page__header">
        <h1 className="dashboard-page__title">{t("pages.overview.title")}</h1>
        <p className="dashboard-page__subtitle">{t("pages.overview.description")}</p>
      </div>

      <PrototypeNotice />

      <div className="dashboard-kpi-grid audit-kpi-grid">
        <StatCard icon={ShieldAlert} value="38" label={t("overview.openRiskCases")} subInfo={t("overview.scopedByJurisdiction")} tone="warning" />
        <StatCard icon={FileSearch} value="12" label={t("overview.evidencePending")} subInfo={t("overview.signalLinkedEvidence")} tone="primary" />
        <StatCard icon={BadgeCheck} value="7" label={t("overview.readyForSecondReview")} subInfo={t("overview.rangeOfficerQueue")} tone="primary" />
        <StatCard icon={Timer} value="3" label={t("overview.slaEscalations")} subInfo={t("overview.proposedSlaNote")} tone="warning" />
      </div>

      <div className="audit-overview-grid">
        <DashSection title={t("overview.riskDistribution")} icon={Scale}>
          <ResponsiveTable cols={riskCols} rows={RISK_DISTRIBUTION_ROWS} noCard aria-label={t("overview.riskDistribution")} />
        </DashSection>
        <DashSection title={t("overview.queueHealth")} icon={Activity}>
          <ResponsiveTable cols={queueCols} rows={QUEUE_HEALTH_ROWS} noCard aria-label={t("overview.queueHealth")} />
        </DashSection>
      </div>

      <div className="audit-context-card">
        <h2>{t("overview.riskPrincipleTitle")}</h2>
        <p>{t("overview.riskPrinciple")}</p>
      </div>

      <DashSection title={t("overview.roleScope")} icon={Workflow}>
        <ResponsiveTable cols={roleCols} rows={ROLE_SCOPE_ROWS} noCard aria-label={t("overview.roleScope")} />
      </DashSection>
    </div>
  );
}

export function AuditModulePage() {
  const { subNav = "audit-overview" } = useParams<{ subNav: string }>();
  const { t } = useTranslation("audit");

  const all = (label: string) => ({ value:"all", label });
  const opts = (values: string[]) => [all(t("filters.all")), ...values.map((v) => ({ value:v, label:v }))];

  const riskConfig: AuditTableConfig = {
    title: t("pages.riskCases.title"),
    description: t("pages.riskCases.description"),
    note: t("pages.riskCases.note"),
    rows: RISK_CASE_ROWS,
    columns: [
      fc("case_id", t("columns.caseId"), { mono:true }),
      fc("return_id", t("columns.returnId"), { mono:true }),
      fc("tin", t("columns.tin"), { mono:true }),
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
      { field:"risk_level", label:t("filters.riskLevel"), options:opts(["Low","Medium","High","Very High"]) },
      { field:"coverage_tier", label:t("filters.coverageTier"), options:opts(["DT0","DT1","DT2","DT3"]) },
      { field:"case_status", label:t("filters.status"), options:opts(["Assigned","Verifying","Evidence Pending","Ready for Review","Second Review","Rework Requested","Closed"]) },
    ],
    mobileCardMapping:{ primary:"case_id", identifier:"return_id", meta:["risk_level","coverage_tier"], status:"case_status" },
  };

  const controlConfig: AuditTableConfig = {
    title:t("pages.control.title"),
    description:t("pages.control.description"),
    note:t("pages.control.note"),
    rows:CONTROL_ROWS,
    columns:[
      fc("return_id",t("columns.returnId"),{mono:true}), fc("tin",t("columns.tin"),{mono:true}),
      fc("flag_id",t("columns.flagId"),{mono:true}), fc("coverage_tier",t("columns.coverageTier")),
      fc("check",t("columns.check"),{truncate:"long"}), {type:"col",col:{key:"control_status",label:t("columns.status"),badge:true}},
    ],
    drawerColumns:[
      fc("return_id",t("columns.returnId")),fc("tin",t("columns.tin")),fc("assessment_year",t("columns.assessmentYear")),
      fc("circle",t("columns.circle")),fc("coverage_tier",t("columns.coverageTier")),fc("flag_id",t("columns.flagId")),
      fc("check",t("columns.check")),fc("source",t("columns.source")),fc("dependency",t("columns.dependency")),
      fc("queue",t("columns.queue")),{type:"col",col:{key:"control_status",label:t("columns.status"),badge:true}},
    ],
    filters:[
      {field:"flag_id",label:t("filters.controlFlag"),options:opts(["F0","F1","F2","F3","F4","F5"])},
      {field:"control_status",label:t("filters.status"),options:opts(["Pending","In Progress","Pending Review","Resolved","Under Review"])},
    ],
    mobileCardMapping:{primary:"flag_id",identifier:"return_id",meta:["coverage_tier","queue"],status:"control_status"},
  };

  const reviewConfig: AuditTableConfig = {
    title:t("pages.secondReview.title"),
    description:t("pages.secondReview.description"),
    note:t("pages.secondReview.note"),
    rows:SECOND_REVIEW_ROWS,
    columns:[
      fc("case_id",t("columns.caseId"),{mono:true}),fc("return_id",t("columns.returnId"),{mono:true}),
      fc("risk_level",t("columns.riskLevel")),fc("primary_signal",t("columns.primarySignal")),
      fc("evidence_refs",t("columns.evidenceRefs")),{type:"col",col:{key:"review_status",label:t("columns.status"),badge:true}},
    ],
    drawerColumns:[
      fc("case_id",t("columns.caseId")),fc("return_id",t("columns.returnId")),fc("tin",t("columns.tin")),
      fc("risk_level",t("columns.riskLevel")),fc("primary_signal",t("columns.primarySignal")),
      fc("verification_basis",t("columns.verificationBasis")),fc("evidence_refs",t("columns.evidenceRefs")),
      fc("finding_summary",t("columns.findingSummary")),fc("submitted_by",t("columns.submittedBy")),
      {type:"col",col:{key:"review_status",label:t("columns.status"),badge:true}},fc("permitted_actions",t("columns.permittedActions")),
    ],
    filters:[
      {field:"risk_level",label:t("filters.riskLevel"),options:opts(["High","Very High"])},
      {field:"review_status",label:t("filters.status"),options:opts(["Ready for Review","Second Review","Rework Requested"])},
    ],
    mobileCardMapping:{primary:"case_id",identifier:"return_id",meta:["risk_level","primary_signal"],status:"review_status"},
  };

  const rulesConfig: AuditTableConfig = {
    title:t("pages.rules.title"),
    description:t("pages.rules.description"),
    note:t("pages.rules.note"),
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
      {field:"governance_status",label:t("filters.governanceStatus"),options:opts(["Awaiting Endorsement","Awaiting Approval","Approved","Superseded"])},
      {field:"mode",label:t("filters.mode"),options:opts(["Draft","Shadow","Staged","Live","Superseded"])},
    ],
    mobileCardMapping:{primary:"rule_id",identifier:"version",meta:["rule_family","rollout_scope"],status:"mode"},
  };

  const reconciliationConfig: AuditTableConfig = {
    title:t("pages.reconciliation.title"),
    description:t("pages.reconciliation.description"),
    note:t("pages.reconciliation.note"),
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
      {field:"reconciliation_status",label:t("filters.status"),options:opts(["Matched","Missing Case","Under Review"])},
      {field:"supervisor_view",label:t("filters.viewer"),options:opts(["Range Officer","Commissioner"])},
    ],
    mobileCardMapping:{primary:"scope",identifier:"reconciliation_date",meta:["high_risk_returns","missing_case_count"],status:"reconciliation_status",date:"reconciliation_date"},
  };

  const trailConfig: AuditTableConfig = {
    title:t("pages.trail.title"),
    description:t("pages.trail.description"),
    note:t("pages.trail.note"),
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
      {field:"actor_role",label:t("filters.role"),options:opts(["DCT","Range Officer"])},
      {field:"return_id",label:t("filters.return"),options:opts(["RET-2026-10539"])},
    ],
    mobileCardMapping:{primary:"action",identifier:"event_id",meta:["actor_role","return_id"],date:"timestamp_utc"},
    readOnly:true,
  };

  switch (subNav) {
    case "audit-overview": return <AuditOverviewPage />;
    case "risk-cases": return <AuditTablePage config={riskConfig} />;
    case "control-data-quality": return <AuditTablePage config={controlConfig} />;
    case "second-review": return <AuditTablePage config={reviewConfig} />;
    case "rules-governance": return <AuditTablePage config={rulesConfig} />;
    case "reconciliation": return <AuditTablePage config={reconciliationConfig} />;
    case "audit-trail": return <AuditTablePage config={trailConfig} />;
    default: return <AuditOverviewPage />;
  }
}
