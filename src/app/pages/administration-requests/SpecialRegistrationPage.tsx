import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  BarChart2, AlertCircle, CheckCircle, XCircle,
  RefreshCw, ChevronUp, ChevronDown, Filter,
} from "lucide-react";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { CollapsibleKpiSection } from "../../components/cards/CollapsibleKpiSection";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { FilterPanel } from "../../components/filters/FilterPanel";
import { MobileFilterOverlay } from "../../components/filters/MobileFilterOverlay";
import { AppliedFilterChips } from "../../components/filters/AppliedFilterChips";
import { Pagination } from "../../components/shared/Pagination";
import { useUIState } from "../../hooks/useUI";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import type { ColDef, FilterDef, KpiDef, TableRow } from "../modulePageUtils";
import { fc, BADGE } from "../modulePageUtils";
import { ROW_VIEW } from "../../data/modulePageConfigs";
import {
  getApplications,
  getKpiTotals,
  approveApplication,
  rejectApplication,
  updateApplication,
  getApplicationById,
  SRConflictError,
  type SpecialRegistrationApplication,
  type SRKpiTotals,
  type SpecialRegistrationUpdatePayload,
} from "../../services/repositories/specialRegistrationRepository";
import { SpecialRegistrationDrawer } from "../../components/special-registration/SpecialRegistrationDrawer";
import { SpecialRegistrationEditModal } from "../../components/special-registration/SpecialRegistrationEditModal";

const PER_PAGE = 15;

const SPECIAL_REGISTRATION_MOBILE_MAPPING = {
  primary:    "applicantName",
  identifier: "applicationNumber",
  meta:       ["tin", "country", "email"],
  date:       "submittedAtLabel",
  status:     "statusLabel",
};

type FilterValues = {
  status: string;
  country: string;
  fromDate: string;
  toDate: string;
};

const EMPTY_FILTERS: FilterValues = {
  status: "", country: "", fromDate: "", toDate: "",
};

function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function statusToDisplayValue(status: string): string {
  switch (status) {
    case "PENDING_REVIEW": return "pending review";
    case "APPROVED":       return "approved";
    case "REJECTED":       return "rejected";
    default:               return status.toLowerCase();
  }
}

export function SpecialRegistrationPage() {
  const { t }                = useTranslation("specialRegistration");
  const { t: ta }            = useTranslation("actions");
  const { t: tc }            = useTranslation("common");
  const { isDesktop }        = useUIState();
  const currentUser          = useCurrentUser();

  // ── Data state ────────────────────────────────────────────────────────────
  const [applications, setApplications] = useState<SpecialRegistrationApplication[]>([]);
  const [total, setTotal]               = useState(0);
  const [kpis, setKpis]                 = useState<SRKpiTotals>({ total: 0, pendingReview: 0, approved: 0, rejected: 0 });
  const [loading, setLoading]           = useState(true);
  const [loadError, setLoadError]       = useState(false);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [search, setSearch]                   = useState("");
  const [filterValues, setFilterValues]       = useState<FilterValues>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters]   = useState<FilterValues>(EMPTY_FILTERS);
  const [showFilter, setShowFilter]           = useState(false);
  const [kpiOpen, setKpiOpen]                 = useState(true);
  const [page, setPage]                       = useState(1);

  // ── Drawer / modal state ──────────────────────────────────────────────────
  const [selectedApp, setSelectedApp] = useState<SpecialRegistrationApplication | null>(null);
  const [editingApp, setEditingApp]   = useState<SpecialRegistrationApplication | null>(null);

  // ── Load data ─────────────────────────────────────────────────────────────
  const loadData = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    try {
      const result = getApplications({
        page,
        perPage: PER_PAGE,
        search,
        status:   appliedFilters.status   || undefined,
        country:  appliedFilters.country  || undefined,
        fromDate: appliedFilters.fromDate || undefined,
        toDate:   appliedFilters.toDate   || undefined,
      });
      setApplications(result.items);
      setTotal(result.total);
      setKpis(getKpiTotals());
    } catch {
      setLoadError(true);
      toast.error(t("internal.loadError"));
    } finally {
      setLoading(false);
    }
  }, [page, search, appliedFilters, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  // ── Filters ───────────────────────────────────────────────────────────────
  const handleFilterChange = useCallback((k: string, v: string) => {
    setFilterValues(prev => ({ ...prev, [k]: v }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({ ...filterValues });
    setPage(1);
    setShowFilter(false);
  }, [filterValues]);

  const handleResetFilters = useCallback(() => {
    setFilterValues(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPage(1);
    setShowFilter(false);
  }, []);

  const hasActiveFilters = Object.values(appliedFilters).some(v => !!v);

  // ── Decision callbacks ────────────────────────────────────────────────────
  const handleApprove = useCallback(async (
    appId: string,
    payload: { officerId: string; officerName: string; officerDesignation: string; approvalNote?: string }
  ) => {
    try {
      const updated = approveApplication(appId, payload);
      setApplications(prev => prev.map(a => a.id === appId ? updated : a));
      setSelectedApp(updated);
      setKpis(getKpiTotals());
    } catch (err) {
      if (err instanceof SRConflictError) {
        toast.error(t("internal.approve.conflictToast"));
        loadData();
        return;
      }
      throw err;
    }
  }, [t, loadData]);

  const handleReject = useCallback(async (
    appId: string,
    payload: { officerId: string; officerName: string; officerDesignation: string; rejectionReason: string }
  ) => {
    try {
      const updated = rejectApplication(appId, payload);
      setApplications(prev => prev.map(a => a.id === appId ? updated : a));
      setSelectedApp(updated);
      setKpis(getKpiTotals());
    } catch (err) {
      if (err instanceof SRConflictError) {
        toast.error(t("internal.reject.conflictToast"));
        loadData();
        return;
      }
      throw err;
    }
  }, [t, loadData]);

  // ── Edit handlers ─────────────────────────────────────────────────────────
  const handleEditOpen = useCallback(() => {
    setEditingApp(selectedApp);
    setSelectedApp(null);
  }, [selectedApp]);

  const handleEditSave = useCallback(async (
    appId: string,
    payload: SpecialRegistrationUpdatePayload,
    editorPayload: { editorId: string; editorName: string; editorDesignation: string }
  ) => {
    updateApplication(appId, payload, editorPayload);
    loadData();
    toast.success(t("internal.updateSuccess"));
    const updated = getApplicationById(appId);
    if (updated) setSelectedApp(updated);
    setEditingApp(null);
  }, [loadData, t]);

  // ── KPI defs ──────────────────────────────────────────────────────────────
  const kpiDefs: KpiDef[] = [
    { label: t("internal.kpi.total"),    value: String(kpis.total),         tone: "primary",  icon: BarChart2 },
    { label: t("internal.kpi.pending"),  value: String(kpis.pendingReview), tone: "warning",  icon: AlertCircle },
    { label: t("internal.kpi.approved"), value: String(kpis.approved),      tone: "success",  icon: CheckCircle },
    { label: t("internal.kpi.rejected"), value: String(kpis.rejected),      tone: "error",    icon: XCircle },
  ];

  // ── Column defs ───────────────────────────────────────────────────────────
  const cols: ColDef[] = [
    fc("applicationNumber", t("internal.table.applicationNo"),  { truncate: "compact" }),
    fc("tin",               t("internal.table.tin"),            { truncate: "compact" }),
    fc("applicantName",     t("internal.table.applicantName"),  { truncate: "normal"  }),
    fc("country",           t("internal.table.country"),        { truncate: "normal"  }),
    fc("email",             t("internal.table.email"),          { truncate: "long"    }),
    fc("submittedAtLabel",  t("internal.table.submittedOn"),    { truncate: "compact" }),
    BADGE("statusLabel",    t("internal.table.status")),
  ];

  // ── Filter defs ───────────────────────────────────────────────────────────
  const filterDefs: FilterDef[] = [
    {
      key: "status", label: t("internal.filters.status"), type: "select",
      options: ["", "PENDING_REVIEW", "APPROVED", "REJECTED"],
      optionKeys: {
        "": t("internal.filters.allStatuses"),
        "PENDING_REVIEW": t("internal.filters.pendingReview"),
        "APPROVED": t("internal.filters.approved"),
        "REJECTED": t("internal.filters.rejected"),
      },
    },
    { key: "country",   label: t("internal.filters.country"),  type: "text" },
    { key: "fromDate",  label: t("internal.filters.fromDate"), type: "date" },
    { key: "toDate",    label: t("internal.filters.toDate"),   type: "date" },
  ];

  // ── Row mapper ────────────────────────────────────────────────────────────
  const rows: TableRow[] = applications.map(app => ({
    _id: app.id,
    applicationNumber: app.applicationNumber,
    tin:               app.tin,
    applicantName:     app.applicantName,
    country:           app.country,
    email:             app.email,
    submittedAtLabel:  formatDate(app.submittedAt),
    statusLabel:       statusToDisplayValue(app.status),
  }));

  const handleRowClick = useCallback((row: TableRow) => {
    const app = applications.find(a => a.id === (row._id as string));
    if (app) setSelectedApp(app);
  }, [applications]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="table-page">
      {/* Page header */}
      <div className="table-page__header">
        <div>
          <h1 className="table-page__title">{t("internal.pageTitle")}</h1>
          <p className="table-page__desc">{t("internal.pageDesc")}</p>
        </div>
        <div className="table-page__actions">
          <button
            type="button"
            className="table-page__kpi-toggle"
            onClick={() => setKpiOpen(o => !o)}
            aria-expanded={kpiOpen}
            aria-controls="kpi-section-panel"
          >
            {kpiOpen
              ? <><ChevronUp   size={13} strokeWidth={2} aria-hidden="true" />{ta("hideSummary")}</>
              : <><ChevronDown size={13} strokeWidth={2} aria-hidden="true" />{ta("showSummary")}</>
            }
          </button>
        </div>
      </div>

      {/* KPI panel */}
      <CollapsibleKpiSection kpis={kpiDefs} open={kpiOpen} />

      {/* Table card */}
      <div className="table-card">
        <div className="table-card__toolbar">
          <div className="table-card__title-group">
            <h2 className="table-card__title">{t("internal.allApplications")}</h2>
            <span className="table-card__count" aria-live="polite" aria-atomic="true">
              {total} {tc("common.records")}
            </span>
          </div>
          <div className="table-card__search-wrapper">
            <AppSearchField
              value={search}
              onChange={handleSearchChange}
              placeholder={t("internal.searchPlaceholder")}
              label={t("internal.searchPlaceholder")}
              size="compact"
            />
          </div>
          <button
            type="button"
            aria-expanded={showFilter}
            onClick={() => setShowFilter(s => !s)}
            className={`table-card__toolbar-btn${showFilter ? " table-card__toolbar-btn--active" : ""}`}
          >
            <Filter size={13} aria-hidden="true" />
            {tc("actions.filter")}
          </button>
        </div>

        {isDesktop && showFilter && (
          <div className="table-card__filter-panel">
            <FilterPanel
              filters={filterDefs}
              values={filterValues}
              onChange={handleFilterChange}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />
          </div>
        )}

        <AppliedFilterChips values={appliedFilters} onClear={handleResetFilters} inCard />

        {/* Content */}
        {loadError ? (
          <div className="table-card__empty-state" role="alert">
            <AlertCircle size={20} aria-hidden="true" />
            <p>{t("internal.loadError")}</p>
            <button type="button" className="table-card__toolbar-btn" onClick={loadData}>
              <RefreshCw size={14} aria-hidden="true" />
              {t("internal.retry")}
            </button>
          </div>
        ) : loading ? (
          <div className="table-card__empty-state" aria-live="polite" aria-busy="true">
            <p>{t("internal.loading")}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="table-card__empty-state" role="status">
            {hasActiveFilters || search ? (
              <>
                <p>{t("internal.noResults")}</p>
                <button type="button" className="table-card__toolbar-btn" onClick={handleResetFilters}>
                  {t("internal.clearFilters")}
                </button>
              </>
            ) : (
              <p>{t("internal.noApplications")}</p>
            )}
          </div>
        ) : (
          <ResponsiveTable
            cols={cols}
            rows={rows}
            actions={ROW_VIEW}
            onRowClick={handleRowClick}
            onActionClick={(_id, row) => handleRowClick(row)}
            mobileCardMapping={SPECIAL_REGISTRATION_MOBILE_MAPPING}
            aria-label={t("internal.pageTitle")}
          />
        )}

        {/* Pagination */}
        {!loading && !loadError && total > PER_PAGE && (
          <div className="table-card__pagination">
            <Pagination total={total} page={page} perPage={PER_PAGE} onPage={setPage} />
          </div>
        )}
      </div>

      {/* Mobile filter overlay */}
      <MobileFilterOverlay
        isOpen={showFilter}
        filters={filterDefs}
        values={filterValues}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        onClose={() => setShowFilter(false)}
      />

      {/* Details drawer */}
      {selectedApp && (
        <SpecialRegistrationDrawer
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onEdit={handleEditOpen}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Edit modal */}
      {editingApp && (
        <SpecialRegistrationEditModal
          open
          application={editingApp}
          onClose={() => setEditingApp(null)}
          onSave={handleEditSave}
          editor={{
            editorId:          currentUser.employeeId,
            editorName:        currentUser.name,
            editorDesignation: currentUser.designation,
          }}
        />
      )}
    </div>
  );
}
