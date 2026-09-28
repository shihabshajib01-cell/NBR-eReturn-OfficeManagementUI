import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { X, RefreshCw, Pencil, Lock, Power, Download, Printer, Trash2 } from "lucide-react";
import { handleExportDisabled } from "../../utils/exportDisabled";
import type { SystemUser } from "../../data/mockData";
import { useRoleRegistry } from "../../hooks/useRoleRegistry";
import { SafeText, ExpandableText } from "../shared/SafeText";
import { CopyValueButton } from "../shared/CopyValueButton";
import { RolePreviewCard } from "../roles/RolePreviewCard";
import { SSelect } from "../forms/SSelect";
import { StatusBadge } from "../badges/StatusBadge";
import { ResponsiveOverlay } from "../shared/ResponsiveOverlay";

export function ReAssignRoleModal({ user, onConfirm, onClose }: {
  user: SystemUser; onConfirm: (newRole: string) => void; onClose: () => void;
}) {
  const { t: translate } = useTranslation("user");
  const [selectedRole, setSelectedRole] = useState(user.role);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { activeRoles, roles } = useRoleRegistry();
  const preview = roles.find((r) => r.name === selectedRole) ?? null;

  useEffect(() => { const t2 = setTimeout(() => closeBtnRef.current?.focus(), 50); return () => clearTimeout(t2); }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div className="mobile-modal-backdrop fixed inset-0 z-[500] flex items-center justify-center p-4 overlay-enter"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="rar-title"
        className="mobile-modal-wrapper rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden modal-enter modal-fieldset"
        onClick={(e) => e.stopPropagation()}>

        <div className="mobile-modal-header modal-form-header">
          <div className="flex items-center gap-2.5">
            <div className="modal-form-header__icon">
              <RefreshCw size={15} strokeWidth={2} />
            </div>
            <div>
              <h2 id="rar-title" className="modal-form-header__title">{translate("reassignRole.title")}</h2>
              <p className="modal-form-header__subtitle">{user.name}</p>
            </div>
          </div>
          <button ref={closeBtnRef} type="button" onClick={onClose}
            aria-label={translate("form.cancel")} className="mobile-modal-close modal-form-header__close">
            <X size={14} />
          </button>
        </div>

        <div className="mobile-modal-body p-5 flex gap-4">
          <div className="flex-1 min-w-0">
            <div className="rar-current-role">
              <p className="filter-label">{translate("reassignRole.currentRole")}</p>
              <p className="detail-row__val" style={{ textAlign: "left" }}><SafeText value={user.role} mode="break" as="span" /></p>
              <p className="modal-form-header__subtitle"><SafeText value={user.level} mode="truncate" as="span" /></p>
            </div>
            <div>
              <SSelect id="rar-role" label={translate("reassignRole.newRole")} value={selectedRole} onChange={setSelectedRole} options={activeRoles.map((r) => r.name)} />
            </div>
            {selectedRole !== user.role && (
              <p className="rar-warning">{translate("reassignRole.warning")}</p>
            )}
          </div>
          {preview && (
            <div className="w-52 flex-shrink-0">
              <RolePreviewCard roleName={preview.name} roleDescription={preview.description} selectedPermIds={preview.permissions} />
            </div>
          )}
        </div>

        <div className="mobile-modal-footer modal-form-footer">
          <button type="button" onClick={onClose} className="mobile-modal-btn mobile-modal-btn--secondary action-btn action-btn--secondary">
            {translate("reassignRole.cancel")}
          </button>
          <button type="button" onClick={() => onConfirm(selectedRole)} disabled={selectedRole === user.role}
            className="mobile-modal-btn mobile-modal-btn--primary action-btn action-btn--primary disabled:opacity-50">
            {translate("reassignRole.confirm")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

type DrawerTab = "info" | "role" | "preview";

export function UserDetailDrawer({ user, onClose, onEdit, onReAssign, onToggleStatus, onDelete }: {
  user: SystemUser; onClose: () => void; onEdit: () => void; onReAssign: () => void;
  onToggleStatus: () => void; onDelete: () => void;
}) {
  const { t: translate } = useTranslation("user");
  const { roles } = useRoleRegistry();
  const userRole = roles.find((r) => r.name === user.role);
  const isActive = user.status === "Active";
  const [activeTab, setActiveTab] = useState<DrawerTab>("info");

  const initials = user.name.split(" ").map((n) => n[0] ?? "").join("").slice(0, 2).toUpperCase();

  // ── Smart detail row helper ────────────────────────────────────────────────
  const isLongValue = (v: string) =>
    v.length > 60 ||
    /[^\s]{28,}/.test(v) ||
    /https?:\/\//.test(v);

  const renderDetailRow = (label: string, value: string, options?: { copyable?: boolean }) => {
    const display = value || "—";
    const long = isLongValue(display);
    const copyable = options?.copyable && display !== "—";
    return (
      <div key={label} className={`detail-row${long ? " detail-row--long" : ""}`}>
        <span className="detail-row__key">{label}</span>
        <span className="detail-row__val">
          <div className="detail-row__value-row">
            {long
              ? <ExpandableText value={display} maxChars={120} collapsedLines={3} mode="block" />
              : <SafeText value={display} mode="break" as="span" />
            }
            {copyable && <CopyValueButton value={value} label={label} />}
          </div>
        </span>
      </div>
    );
  };

  const tabs: { id: DrawerTab; label: string }[] = [
    { id: "info",    label: translate("details.personalInfo", { defaultValue: "Personal Information" }) },
    { id: "role",    label: translate("details.roleAccess", { defaultValue: "Role & Access" }) },
    { id: "preview", label: "Role Preview" },
  ];

  const footerContent = (
    <div className="user-drawer-footer">
      <div className="user-drawer-footer__grid">
        <button type="button" onClick={onEdit} className="action-btn action-btn--primary">
          <Pencil size={13} strokeWidth={2} />{translate("details.edit")}
        </button>
        <button type="button" className="action-btn action-btn--secondary">
          <Lock size={13} strokeWidth={2} />{translate("details.resetPassword")}
        </button>
        <button type="button" onClick={onToggleStatus}
          className={`action-btn ${isActive ? "action-btn--warning" : "action-btn--secondary"}`}>
          <Power size={13} strokeWidth={2} />
          {isActive ? translate("details.deactivate") : translate("details.activate")}
        </button>
        <button type="button" onClick={onReAssign} className="action-btn action-btn--secondary">
          <RefreshCw size={13} strokeWidth={2} />{translate("details.reassign")}
        </button>
        <button type="button" className="action-btn action-btn--secondary" onClick={() => handleExportDisabled()}>
          <Download size={13} strokeWidth={2} />{translate("details.export")}
        </button>
        <button type="button" className="action-btn action-btn--secondary">
          <Printer size={13} strokeWidth={2} />{translate("details.print")}
        </button>
      </div>
      <div className="user-drawer-footer__divider" />
      <button type="button" onClick={onDelete} className="action-btn action-btn--danger action-btn--full">
        <Trash2 size={13} strokeWidth={2} />{translate("details.deleteUser")}
      </button>
    </div>
  );

  return (
    <ResponsiveOverlay
      open={true}
      onClose={onClose}
      title={translate("details.title", { defaultValue: "User Details" })}
      footer={footerContent}
      closeLabel={translate("details.closeDetails", { defaultValue: "Close user details" })}
      className="user-detail-drawer"
      desktopWidth="24rem"
    >
      {/* User Header Info */}
      <div className="user-detail-drawer__header">
        <div className="user-drawer__avatar">{initials}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <ExpandableText value={user.name} maxChars={90} collapsedLines={2} mode="block" className="user-detail-drawer__name" as="p" />
          <SafeText value={user.designation} mode="break" as="p" className="user-detail-drawer__designation" />
          <StatusBadge value={user.status} />
        </div>
      </div>

      {/* Tab bar */}
      <div className="user-drawer__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`user-drawer__tab ${activeTab === tab.id ? "user-drawer__tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="user-detail-drawer__content">
        {activeTab === "info" && (
          <div className="detail-section">
            {renderDetailRow(translate("details.employeeId"), user.employeeId, { copyable: true })}
            {renderDetailRow(translate("details.email"),      user.email,      { copyable: true })}
            {renderDetailRow(translate("details.phone"),      user.phone,      { copyable: true })}
            {renderDetailRow(translate("details.circle"),     user.circle)}
            {renderDetailRow(translate("details.zone"),       user.zone)}
            {renderDetailRow(translate("details.lastActive"), user.lastActive)}
          </div>
        )}

        {activeTab === "role" && (
          <div className="detail-section">
            {renderDetailRow(translate("details.role"),  user.role)}
            {renderDetailRow(translate("details.level"), user.level)}
            {renderDetailRow(
              translate("details.twoFactorEnabled"),
              user.twoFA ? translate("details.yes") : translate("details.no")
            )}
          </div>
        )}

        {activeTab === "preview" && userRole && (
          <RolePreviewCard roleName={userRole.name} roleDescription={userRole.description} selectedPermIds={userRole.permissions} />
        )}

        {activeTab === "preview" && !userRole && (
          <p className="detail-row__key" style={{ padding: "1rem" }}>No role assigned.</p>
        )}
      </div>
    </ResponsiveOverlay>
  );
}
