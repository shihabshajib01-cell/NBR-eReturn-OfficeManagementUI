import { useState, useRef, startTransition } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {
  Users, UserCheck, UserX, AlertCircle, Shield, Download, UserPlus,
  Filter, ChevronDown
} from "lucide-react";
import { handleExportDisabled } from "../../utils/exportDisabled";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { StatCard } from "../../components/cards/StatCard";
import { SConfirmModal } from "../../components/modals/SConfirmModal";
import { type SystemUser } from "../../data/mockData";
import { useRoleRegistry } from "../../hooks/useRoleRegistry";
import { useUserRegistry } from "../../hooks/useUserRegistry";
import { USER_ZONES_LIST, SETTINGS_ACCESS_LEVELS } from "../../data/constants";
import { UserDetailDrawer, ReAssignRoleModal } from "../../components/users/UserComponents";
import { UserFormModal } from "../../components/users/UserFormModal";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { Pagination } from "../../components/shared/Pagination";
import { FilterPanel } from "../../components/filters/FilterPanel";
import { MobileFilterOverlay } from "../../components/filters/MobileFilterOverlay";
import { AppliedFilterChips } from "../../components/filters/AppliedFilterChips";
import { useUIState } from "../../hooks/useUI";
import type { ColDef, FilterDef } from "../modulePageUtils";
import { fc, BADGE } from "../modulePageUtils";
import { ROW_VIEW } from "../../data/modulePageConfigs";

interface UserManagementPageProps {
  onManageRoles?: () => void;
}

export function UserManagementPage({ onManageRoles }: UserManagementPageProps) {
  const navigate = useNavigate();
  const handleManageRoles = onManageRoles ?? (() => startTransition(() => navigate("/administration/role-management")));
  const { t: translate } = useTranslation("user");
  const { t: translateStatus } = useTranslation("status");
  const { t: translateCommon } = useTranslation("common");
  const { roles } = useRoleRegistry();
  const { isDesktop } = useUIState();
  const { users, saveUser, deleteUser, updateUserField } = useUserRegistry();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [fVals, setFVals] = useState<Record<string, string>>({});
  const [applied, setApplied] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [drawerUser, setDrawerUser] = useState<SystemUser | null>(null);
  const [reAssignUser, setReAssignUser] = useState<SystemUser | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [confirmToggleId, setConfirmToggleId] = useState<string | null>(null);
  const addUserBtnRef = useRef<HTMLButtonElement>(null);
  const PER = 10;

  // Column definitions for the table
  const cols: ColDef[] = [
    fc("employeeId", "Employee ID", { headerKey: "userTable.employeeId" }),
    fc("name", "Name", { headerKey: "userTable.user" }),
    fc("email", "Email", { headerKey: "userTable.email" }),
    fc("role", "Role", { headerKey: "userTable.role" }),
    fc("level", "Level", { headerKey: "userTable.level" }),
    fc("circle", "Circle", { headerKey: "userTable.circle" }),
    fc("zone", "Zone", { headerKey: "userTable.zone" }),
    BADGE("status", "Status"),
    fc("lastActive", "Last Activity", { headerKey: "userTable.lastActivity" }),
  ];

  // Filter definitions
  const filters: FilterDef[] = [
    { key: "status", label: "Status", labelKey: "labels.filterByStatus", type: "select", options: ["All", "Active", "Inactive", "Pending"] },
    { key: "zone", label: "Zone", labelKey: "labels.filterByZone", type: "select", options: ["All", ...USER_ZONES_LIST] },
    { key: "level", label: "Level", labelKey: "labels.filterByLevel", type: "select", options: ["All", ...SETTINGS_ACCESS_LEVELS] },
    { key: "role", label: "Role", labelKey: "labels.filterByRole", type: "select", options: ["All", ...roles.map(r => r.name)] },
  ];

  const closeUserModal = () => {
    setAddUserOpen(false);
    setEditUserId(null);
    requestAnimationFrame(() => addUserBtnRef.current?.focus());
  };

  const handleSaveUser = (saved: SystemUser) => {
    saveUser(saved);
  };

  // Filter logic
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch = q === "" || u.name.toLowerCase().includes(q) || u.employeeId.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesStatus = !applied.status || applied.status === "All" || u.status === applied.status;
    const matchesZone = !applied.zone || applied.zone === "All" || u.zone === applied.zone;
    const matchesLevel = !applied.level || applied.level === "All" || u.level === applied.level;
    const matchesRole = !applied.role || applied.role === "All" || u.role === applied.role;
    return matchesSearch && matchesStatus && matchesZone && matchesLevel && matchesRole;
  });

  const pageUsers = filtered.slice((page - 1) * PER, page * PER);

  // Convert users to row format
  const rows = pageUsers.map(u => ({
    id: u.id,
    employeeId: u.employeeId,
    name: u.name,
    email: u.email,
    role: u.role,
    level: u.level,
    circle: u.circle,
    zone: u.zone,
    status: u.status,
    lastActive: u.lastActive,
    _original: u, // Keep original user object for actions
  }));

  const stats = [
    { label: translate("management.totalUsers"), value: users.length, Icon: Users, tone: "primary" as const },
    { label: translate("management.activeUsers"), value: users.filter((u) => u.status === "Active").length, Icon: UserCheck, tone: "success" as const },
    { label: translate("management.inactiveUsers"), value: users.filter((u) => u.status === "Inactive").length, Icon: UserX, tone: "neutral" as const },
    { label: translate("management.pendingUsers"), value: users.filter((u) => u.status === "Pending").length, Icon: AlertCircle, tone: "warning" as const },
  ];

  return (
    <div className="user-management">
      <div className="user-management__header">
        <div className="user-management__header-row">
          <div>
            <h1 className="user-management__title">{translate("management.title")}</h1>
            <p className="user-management__subtitle">{translate("management.subtitle")}</p>
          </div>
          <div className="user-management__actions">
            <button
              type="button"
              onClick={handleManageRoles}
              className="action-btn action-btn action-btn--secondary"
            >
              <Shield size={13} strokeWidth={2} />
              {translate("form.manageRoles")}
            </button>
            <button
              type="button"
              className="action-btn action-btn action-btn--secondary"
              onClick={() => handleExportDisabled(translateCommon("actions.exportDisabled"))}
            >
              <Download size={13} strokeWidth={2} />
              {translate("management.exportUsers")}
            </button>
            <button
              ref={addUserBtnRef}
              type="button"
              onClick={() => setAddUserOpen(true)}
              className="action-btn action-btn--primary"
            >
              <UserPlus size={13} strokeWidth={2} />
              {translate("management.addUser")}
            </button>
          </div>
        </div>
      </div>

      <div className="user-management__stats">
        {stats.map(({ label, value, Icon, tone }) => (
          <StatCard key={label} icon={Icon} value={String(value)} label={label} tone={tone} />
        ))}
      </div>

      <div className="table-card">
        {/* Toolbar */}
        <div className="table-card__toolbar">
          <div className="table-card__title-group">
            <h2 className="table-card__title">{translate("management.title")}</h2>
            <span className="table-card__count">
              {filtered.length} {translateCommon("common.records")}
            </span>
          </div>
          <div className="table-card__search-wrapper">
            <AppSearchField
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder={translate("management.searchPlaceholder")}
              label={translate("management.searchPlaceholder")}
              size="compact"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`table-card__toolbar-btn${showFilter ? " table-card__toolbar-btn--active" : ""}`}
          >
            <Filter size={13} aria-hidden="true" /> {translateCommon("actions.filter")}
          </button>
          <button className="table-card__toolbar-btn table-card__toolbar-btn--download" onClick={() => handleExportDisabled(translateCommon("actions.exportDisabled"))}>
            <Download size={13} aria-hidden="true" /> {translate("management.exportUsers")}
          </button>
        </div>

        {isDesktop && showFilter && (
          <div className="table-card__filter-panel">
            <FilterPanel
              filters={filters}
              values={fVals}
              onChange={(k, v) => setFVals(p => ({ ...p, [k]: v }))}
              onApply={() => { setApplied(fVals); setShowFilter(false); setPage(1); }}
              onReset={() => { setFVals({}); setApplied({}); setPage(1); }}
            />
          </div>
        )}

        <AppliedFilterChips values={applied} onClear={() => { setFVals({}); setApplied({}); setPage(1); }} inCard />

        <ResponsiveTable
          cols={cols}
          rows={rows}
          actions={ROW_VIEW}
          onRowClick={(row) => {
            const user = users.find(u => u.id === row.id);
            if (user) setDrawerUser(user);
          }}
          mobileCardMapping={{
            primary: "name",
            identifier: "employeeId",
            meta: ["role", "circle", "zone"],
            status: "status",
            date: "lastActive"
          }}
          noCard
        />

        <div className="table-card__pagination">
          <Pagination page={page} total={filtered.length} perPage={PER} onPage={setPage} />
        </div>
      </div>

      {confirmDelete && (() => {
        const userName = users.find((u) => u.id === confirmDelete)?.name || "";
        return (
          <SConfirmModal
            title={translate("modals.deleteUser.title")}
            message={translate("modals.deleteUser.message", { name: userName })}
            confirmLabel={translate("modals.deleteUser.confirm")}
            onConfirm={() => { deleteUser(confirmDelete!); setConfirmDelete(null); }}
            onClose={() => setConfirmDelete(null)}
            danger
          />
        );
      })()}
      {drawerUser && (
        <UserDetailDrawer
          user={drawerUser}
          onClose={() => setDrawerUser(null)}
          onEdit={() => { const id = drawerUser.id; setDrawerUser(null); setEditUserId(id); }}
          onReAssign={() => { setReAssignUser(drawerUser); setDrawerUser(null); }}
          onToggleStatus={() => { const id = drawerUser.id; setDrawerUser(null); setConfirmToggleId(id); }}
          onDelete={() => { const id = drawerUser.id; setDrawerUser(null); setConfirmDelete(id); }}
        />
      )}
      {reAssignUser && (
        <ReAssignRoleModal
          user={reAssignUser}
          onConfirm={(newRole) => {
            updateUserField(reAssignUser.id, { role: newRole });
            setReAssignUser(null);
          }}
          onClose={() => setReAssignUser(null)}
        />
      )}
      {confirmToggleId && (() => {
        const tu = users.find((u) => u.id === confirmToggleId);
        return tu ? (
          <SConfirmModal
            title={tu.status === "Active" ? translate("modals.deactivateUser.title") : translate("modals.activateUser.title")}
            message={tu.status === "Active" ? translate("modals.deactivateUser.message", { name: tu.name }) : translate("modals.activateUser.message", { name: tu.name })}
            confirmLabel={tu.status === "Active" ? translate("modals.deactivateUser.confirm") : translate("modals.activateUser.confirm")}
            onConfirm={() => { updateUserField(confirmToggleId!, { status: tu.status === "Active" ? "Inactive" : "Active" }); setConfirmToggleId(null); }}
            onClose={() => setConfirmToggleId(null)}
            danger={tu.status === "Active"}
          />
        ) : null;
      })()}
      <UserFormModal
        open={addUserOpen || editUserId !== null}
        userId={editUserId}
        users={users}
        roles={roles}
        onClose={closeUserModal}
        onSave={handleSaveUser}
        onNavigateToRoleManagement={handleManageRoles}
      />

      {!isDesktop && (
        <MobileFilterOverlay
          isOpen={showFilter}
          filters={filters}
          values={fVals}
          onChange={(k, v) => setFVals(p => ({ ...p, [k]: v }))}
          onApply={() => { setApplied(fVals); setShowFilter(false); setPage(1); }}
          onReset={() => { setFVals({}); setApplied({}); setPage(1); }}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}