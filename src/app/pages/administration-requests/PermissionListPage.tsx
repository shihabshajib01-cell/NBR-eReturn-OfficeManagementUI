import { useState, useMemo } from "react";
import { Plus, ChevronUp, ChevronDown, Filter, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { CollapsibleKpiSection } from "../../components/cards/CollapsibleKpiSection";
import { Pagination } from "../../components/shared/Pagination";
import { SConfirmModal } from "../../components/modals/SConfirmModal";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { FilterPanel } from "../../components/filters/FilterPanel";
import { MobileFilterOverlay } from "../../components/filters/MobileFilterOverlay";
import { AppliedFilterChips } from "../../components/filters/AppliedFilterChips";
import { useUIState } from "../../hooks/useUI";
import { usePermissionRegistry, type CustomPermission } from "../../hooks/usePermissionRegistry";
import { DynamicDetailsDrawer } from "../../components/drawers/DynamicDetailsDrawer";
import { CreateEditPermissionModal } from "../../components/permissions/CreateEditPermissionModal";
import { ROW_VIEW } from "../../data/modulePageConfigs";
import type { ColDef, FilterDef, KpiDef, TableRow } from "../modulePageUtils";
import { fc, BADGE } from "../modulePageUtils";

const PER_PAGE = 10;

// ── Column config — headerKeys match en/tables.json headers.* ─────────────────
const PERM_COLS: ColDef[] = [
  fc("label",       "Permission Name", { headerKey: "headers.permissionName" }),
  fc("groupLabel",  "Group",           { headerKey: "headers.group" }),
  fc("endpoint",    "API Endpoint",    { headerKey: "headers.endpoint" }),
  fc("method",      "Method",          { headerKey: "headers.method" }),
  fc("serviceName", "Service",         { headerKey: "headers.service" }),
  fc("accessLabel", "Access",          { headerKey: "headers.access" }),
  BADGE("status",   "Status"),
  fc("typeLabel",   "Type",            { headerKey: "headers.type" }),
];

const MOBILE_MAPPING = {
  primary: "label",
  identifier: "endpoint",
  meta: ["groupLabel", "method", "accessLabel", "typeLabel"],
  status: "status",
};

// ── Drawer column definitions — use "name" so DynamicDetailsDrawer summary fires
const DRAWER_COLUMNS = [
  { key: "name",           label: "Permission Name",  groupLabel: "Basic Information", groupLabelKey: "groups.basicInfo" },
  { key: "permission_group", label: "Permission Group", groupLabel: "Basic Information", groupLabelKey: "groups.basicInfo" },
  { key: "status",         label: "Status",           groupLabel: "Basic Information", groupLabelKey: "groups.basicInfo" },
  { key: "type",           label: "Type",             groupLabel: "Basic Information", groupLabelKey: "groups.basicInfo" },
  { key: "endpoint",       label: "API Endpoint",     groupLabel: "API Information",   groupLabelKey: "groups.apiInfo" },
  { key: "method",         label: "Method",           groupLabel: "API Information",   groupLabelKey: "groups.apiInfo" },
  { key: "service_name",   label: "Service Name",     groupLabel: "API Information",   groupLabelKey: "groups.apiInfo" },
  { key: "access_label",   label: "API Access Label", groupLabel: "API Information",   groupLabelKey: "groups.apiInfo" },
  { key: "created_at",     label: "Created At",       groupLabel: "Audit Information", groupLabelKey: "groups.auditInfo" },
  { key: "updated_at",     label: "Updated At",       groupLabel: "Audit Information", groupLabelKey: "groups.auditInfo" },
];

// BASE_EXCLUDE removed — DynamicDetailsDrawer's own isEmpty() already hides "—" values

export function PermissionListPage() {
  const { t: translateCommon } = useTranslation("common");
  const { t: translateActions } = useTranslation("actions");
  const { t: tp } = useTranslation("permissions");

  const {
    flatPermissions, permissionGroups, allPermissionIds,
    addPermission, updatePermission, deleteCustomPermission, updateBasePermission,
  } = usePermissionRegistry();
  const { isDesktop } = useUIState();

  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);
  const [kpiOpen, setKpiOpen]       = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [fVals, setFVals]           = useState<Record<string, string>>({});
  const [applied, setApplied]       = useState<Record<string, string>>({});
  const [addOpen, setAddOpen]       = useState(false);
  const [editPerm, setEditPerm]     = useState<CustomPermission | null>(null);
  const [viewRow, setViewRow]       = useState<TableRow | null>(null);
  const [deleteId, setDeleteId]     = useState<string | null>(null);

  // ── Filter definitions ───────────────────────────────────────────────────
  const filters: FilterDef[] = useMemo(() => [
    { key: "group",  label: "Group",  type: "select", options: ["All Groups", ...permissionGroups.map((g) => g.label)] },
    { key: "method", label: "Method", type: "select", options: ["All", "GET", "POST", "PUT", "DELETE"] },
    { key: "access", label: "Access", type: "select", options: ["All", "PUBLIC", "AUTH", "AUTHORIZE"] },
    { key: "status", label: "Status", type: "select", options: ["All", "Active", "Inactive"] },
    { key: "type",   label: "Type",   type: "select", options: ["All", "Base", "Custom"] },
  ], [permissionGroups]);

  // ── Table rows: custom first (newest first), then base ───────────────────
  const rows: TableRow[] = useMemo(() =>
    flatPermissions.map((p) => ({
      id:          p.id,
      label:       p.label,
      groupId:     p.groupId,
      groupLabel:  p.groupLabel,
      endpoint:    p.endpoint    ?? "—",
      method:      p.method      ?? "—",
      serviceName: p.serviceName ?? "—",
      accessLabel: p.accessLabel ?? "—",
      status:      p.status      ?? "Active",
      isCustom:    p.isCustom ? "true" : "false",
      typeLabel:   p.isCustom ? "Custom" : "Base",
      createdAt:   p.createdAt   ?? "",
      updatedAt:   p.updatedAt   ?? "",
    })),
    [flatPermissions]
  );

  // ── Search + filter ───────────────────────────────────────────────────────
  const q = search.toLowerCase();
  const filtered = useMemo(() => rows.filter((r) => {
    const matchSearch = q === "" ||
      String(r.label).toLowerCase().includes(q) ||
      String(r.groupLabel).toLowerCase().includes(q) ||
      String(r.endpoint).toLowerCase().includes(q) ||
      String(r.method).toLowerCase().includes(q) ||
      String(r.serviceName).toLowerCase().includes(q) ||
      String(r.accessLabel).toLowerCase().includes(q) ||
      String(r.status).toLowerCase().includes(q) ||
      String(r.typeLabel).toLowerCase().includes(q);

    const matchGroup  = !applied.group  || applied.group  === "All Groups" || r.groupLabel === applied.group;
    const matchMethod = !applied.method || applied.method === "All"        || r.method     === applied.method;
    const matchAccess = !applied.access || applied.access === "All"        || r.accessLabel === applied.access;
    const matchStatus = !applied.status || applied.status === "All"        || r.status     === applied.status;
    const matchType   = !applied.type   || applied.type   === "All"        || r.typeLabel  === applied.type;

    return matchSearch && matchGroup && matchMethod && matchAccess && matchStatus && matchType;
  }), [rows, q, applied]);

  const paged = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const kpis: KpiDef[] = useMemo(() => [
    { label: tp("page.totalPermissions"), value: String(allPermissionIds.length),                                              tone: "primary" },
    { label: tp("page.permissionGroups"), value: String(permissionGroups.length),                                              tone: "neutral" },
    { label: tp("page.publicApis"),       value: String(flatPermissions.filter((p) => p.accessLabel === "PUBLIC").length),    tone: "success" },
    { label: tp("page.authorizedApis"),   value: String(flatPermissions.filter((p) => p.accessLabel === "AUTHORIZE").length), tone: "warning" },
  ], [allPermissionIds.length, permissionGroups.length, flatPermissions]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const isCustomRow = (row: TableRow) => row.isCustom === "true";

  const toCustomPerm = (row: TableRow): CustomPermission => ({
    id:          String(row.id),
    label:       String(row.label),
    groupId:     String(row.groupId),
    endpoint:    String(row.endpoint),
    method:      String(row.method) as CustomPermission["method"],
    serviceName: String(row.serviceName),
    accessLabel: String(row.accessLabel) as CustomPermission["accessLabel"],
    status:      String(row.status) as CustomPermission["status"],
    isCustom:    true,
    createdAt:   String(row.createdAt),
    updatedAt:   String(row.updatedAt),
  });

  const handleDelete = (id: string) => {
    deleteCustomPermission(id);
    setDeleteId(null);
    setViewRow(null);
    setPage(1);
  };

  // Build drawer-friendly row: "name" triggers summary card, "summary_subtitle" renders under name
  const drawerRow = viewRow ? {
    id:               viewRow.id,
    name:             viewRow.label,
    summary_subtitle: `${viewRow.groupLabel} · ${viewRow.typeLabel}`,
    permission_group: viewRow.groupLabel,
    status:           viewRow.status,
    type:             viewRow.typeLabel,
    endpoint:         viewRow.endpoint !== "—" ? viewRow.endpoint : undefined,
    method:           viewRow.method !== "—" ? viewRow.method : undefined,
    service_name:     viewRow.serviceName !== "—" ? viewRow.serviceName : undefined,
    access_label:     viewRow.accessLabel !== "—" ? viewRow.accessLabel : undefined,
    created_at:       viewRow.createdAt || "System default",
    updated_at:       viewRow.updatedAt || "System default",
    isCustom:         viewRow.isCustom,
  } : null;

  const existingIds = flatPermissions.map((p) => p.id);
  const existingEndpoints = flatPermissions
    .filter((p) => p.endpoint && p.method)
    .map((p) => ({ endpoint: p.endpoint!, method: p.method! }));

  // ── Footer: Edit / Delete segmented ──────────────────────────────────────────
  const drawerExtraActions = viewRow ? (
    <div className="drawer-action-footer">
      <div className="drawer-action-footer__row drawer-action-footer__row--single">
        <button
          type="button"
          className="action-btn action-btn--primary-soft"
          title={isCustomRow(viewRow) ? undefined : "Base permission metadata is read-only."}
          onClick={() => {
            if (isCustomRow(viewRow)) {
              setEditPerm(toCustomPerm(viewRow));
            } else {
              setEditPerm({
                id: String(viewRow.id), label: String(viewRow.label),
                groupId: String(viewRow.groupId),
                endpoint: viewRow.endpoint !== "—" ? String(viewRow.endpoint) : "",
                method: (viewRow.method !== "—" ? viewRow.method : "GET") as CustomPermission["method"],
                serviceName: viewRow.serviceName !== "—" ? String(viewRow.serviceName) : "",
                accessLabel: (viewRow.accessLabel !== "—" ? viewRow.accessLabel : "PUBLIC") as CustomPermission["accessLabel"],
                status: (viewRow.status as CustomPermission["status"]) ?? "Active",
                isCustom: true,
                createdAt: "", updatedAt: "",
              });
            }
            setViewRow(null);
          }}
        >
          <Pencil size={13} strokeWidth={2} aria-hidden="true" />
          <span>{translateActions("edit")}</span>
        </button>
      </div>
      <div className="drawer-action-footer__divider" />
      <div className="drawer-action-footer__row drawer-action-footer__row--single">
        <button
          type="button"
          className="action-btn action-btn--danger"
          disabled={!isCustomRow(viewRow)}
          title={!isCustomRow(viewRow) ? "Base permissions cannot be deleted." : undefined}
          onClick={() => { if (isCustomRow(viewRow)) { setDeleteId(String(viewRow.id)); setViewRow(null); } }}
        >
          <Trash2 size={13} strokeWidth={2} aria-hidden="true" />
          <span>{translateActions("delete")}</span>
        </button>
      </div>
    </div>
  ) : undefined;

  return (
    <div className="table-page">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="table-page__header">
        <div>
          <h1 className="table-page__title">{tp("page.title")}</h1>
          <p className="table-page__desc">{tp("page.subtitle")}</p>
        </div>
        <div className="table-page__actions">
          <button
            type="button"
            onClick={() => setKpiOpen((o) => !o)}
            className="table-page__kpi-toggle"
            aria-expanded={kpiOpen}
          >
            {kpiOpen
              ? <><ChevronUp size={13} strokeWidth={2} aria-hidden="true" />{translateActions("hideSummary")}</>
              : <><ChevronDown size={13} strokeWidth={2} aria-hidden="true" />{translateActions("showSummary")}</>}
          </button>
          <button type="button" onClick={() => setAddOpen(true)} className="action-btn action-btn--primary">
            <Plus size={11} strokeWidth={3} />{tp("page.addButton")}
          </button>
        </div>
      </div>

      {/* ── KPIs ───────────────────────────────────────────────── */}
      <CollapsibleKpiSection kpis={kpis} open={kpiOpen} />

      {/* ── Table card ─────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-card__toolbar">
          <div className="table-card__title-group">
            <h2 className="table-card__title">{tp("page.allPermissions")}</h2>
            <span className="table-card__count" aria-live="polite">{filtered.length} records</span>
          </div>
          <div className="table-card__search-wrapper">
            <AppSearchField
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder={tp("page.searchPlaceholder")}
              label={tp("page.searchPlaceholder")}
              size="compact"
            />
          </div>
          {/* Phase 2 — filter button matches User Management style */}
          <button
            type="button"
            aria-expanded={showFilter}
            onClick={() => setShowFilter((s) => !s)}
            className={`table-card__toolbar-btn${showFilter ? " table-card__toolbar-btn--active" : ""}`}
          >
            <Filter size={13} aria-hidden="true" />
            {translateCommon("actions.filter")}
          </button>
        </div>

        {isDesktop && showFilter && (
          <div className="table-card__filter-panel">
            <FilterPanel
              filters={filters}
              values={fVals}
              onChange={(k, v) => setFVals((p) => ({ ...p, [k]: v }))}
              onApply={() => { setApplied(fVals); setShowFilter(false); setPage(1); }}
              onReset={() => { setFVals({}); setApplied({}); setPage(1); }}
            />
          </div>
        )}

        <AppliedFilterChips values={applied} onClear={() => { setFVals({}); setApplied({}); setPage(1); }} inCard />

        {/* Phase 3 — ROW_VIEW for consistent action column */}
        <ResponsiveTable
          cols={PERM_COLS}
          rows={paged}
          actions={ROW_VIEW}
          onRowClick={(row) => setViewRow(row)}
          onActionClick={(_id, row) => setViewRow(row)}
          mobileCardMapping={MOBILE_MAPPING}
          noCard
        />

        <div className="table-card__pagination">
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onPage={setPage} />
        </div>
      </div>

      {/* ── Permission detail drawer ─────────────────────────────── */}
      <DynamicDetailsDrawer
        open={viewRow !== null}
        onClose={() => setViewRow(null)}
        title="Record Details"
        columns={DRAWER_COLUMNS}
        rowData={drawerRow}
        summarySubtitleKey="summary_subtitle"
        showActions={false}
        extraFooterActions={drawerExtraActions}
      />

      {/* ── Add / Edit permission modal ─────────────────────────── */}
      <CreateEditPermissionModal
        open={addOpen || editPerm !== null}
        editing={editPerm}
        existingIds={existingIds}
        existingEndpoints={existingEndpoints}
        onClose={() => { setAddOpen(false); setEditPerm(null); }}
        onSave={(perm) => {
          if (editPerm) {
            const isBaseEdit = !flatPermissions.find((p) => p.id === perm.id)?.isCustom;
            if (isBaseEdit) {
              updateBasePermission(perm.id, {
                endpoint: perm.endpoint, method: perm.method,
                serviceName: perm.serviceName, accessLabel: perm.accessLabel,
                status: perm.status,
              });
            } else {
              updatePermission(perm.id, {
                label: perm.label, groupId: perm.groupId,
                endpoint: perm.endpoint, method: perm.method,
                serviceName: perm.serviceName, accessLabel: perm.accessLabel,
                status: perm.status,
              });
            }
          } else {
            addPermission(perm);
          }
          setPage(1);
        }}
      />

      {/* ── Delete confirm — SConfirmModal ──────────────────────── */}
      {deleteId && (
        <SConfirmModal
          title="Delete Permission"
          message={`Are you sure you want to delete "${flatPermissions.find((p) => p.id === deleteId)?.label}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => handleDelete(deleteId)}
          onClose={() => setDeleteId(null)}
          danger
        />
      )}

      {!isDesktop && (
        <MobileFilterOverlay
          isOpen={showFilter}
          filters={filters}
          values={fVals}
          onChange={(k, v) => setFVals((p) => ({ ...p, [k]: v }))}
          onApply={() => { setApplied(fVals); setShowFilter(false); setPage(1); }}
          onReset={() => { setFVals({}); setApplied({}); setPage(1); }}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}
