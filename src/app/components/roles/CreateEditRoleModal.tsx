import { useState, useEffect, Fragment } from "react";
import { Shield, AlertCircle, Check, Lock, ShieldOff } from "lucide-react";
import { ExpandableText } from "../shared/SafeText";
import { useTranslation } from "react-i18next";
import { AppTextField } from "../forms/AppTextField";
import { AppTextArea } from "../forms/AppTextArea";
import { SToggle } from "../forms/SToggle";
import { StatusBadge } from "../badges/StatusBadge";
import { type SystemRole } from "../../data/mockData";
import { SETTINGS_ACCESS_LEVELS } from "../../data/constants";
import { usePermissionRegistry } from "../../hooks/usePermissionRegistry";
import { PermissionsPanel } from "./PermissionsPanel";
import { RolePreviewCard } from "./RolePreviewCard";
import { AppModal } from "../modals/AppModal";

interface CreateEditRoleModalProps {
  open: boolean;
  roleId: string | null;
  roles: SystemRole[];
  onClose: () => void;
  onSave: (role: SystemRole) => void;
}

const STEP_LABELS = ["Role Details", "Permissions", "Final Review"] as const;

export function CreateEditRoleModal({
  open,
  roleId,
  roles,
  onClose,
  onSave,
}: CreateEditRoleModalProps) {
  const { t: tr } = useTranslation("role");
  const { t: ta } = useTranslation("actions");
  const { allPermissionIds, permissionGroups } = usePermissionRegistry();

  // ── State ────────────────────────────────────────────────────────────────
  const [step, setStep]                       = useState(0);
  const [name, setName]                       = useState("");
  const [description, setDescription]         = useState("");
  const [status, setStatus]                   = useState<"Active" | "Inactive">("Active");
  const [selectedPermIds, setSelectedPermIds] = useState<string[]>([]);
  // level kept for SystemRole type-safety — never exposed in the UI
  const [level, setLevel]                     = useState(SETTINGS_ACCESS_LEVELS[0]);

  useEffect(() => {
    if (!open) return;
    const role = roleId ? (roles.find((r) => r.id === roleId) ?? null) : null;
    setStep(0);
    setName(role?.name ?? "");
    setDescription(role?.description ?? "");
    setStatus(role?.status ?? "Active");
    setSelectedPermIds(role?.permissions ?? []);
    setLevel(role?.level ?? SETTINGS_ACCESS_LEVELS[0]);
  }, [open, roleId, roles]);

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!name.trim()) return;
    const existingRole = roleId ? roles.find((r) => r.id === roleId) : undefined;
    onSave({
      id: roleId ?? `r${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      level,
      status,
      usersCount: existingRole?.usersCount ?? 0,
      permissions: selectedPermIds,
    });
    onClose();
  };

  const canNext = name.trim().length > 0;

  // ── Footer ────────────────────────────────────────────────────────────────
  const footer = (
    <div className="crm-footer">
      <button type="button" onClick={onClose} className="action-btn action-btn--secondary">
        {ta("cancel")}
      </button>
      <div className="crm-footer__right">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="action-btn action-btn--secondary"
          >
            {ta("back")}
          </button>
        )}
        {step < STEP_LABELS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && !canNext}
            className="action-btn action-btn--primary"
          >
            {ta("next")}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={!canNext}
            className="action-btn action-btn--primary"
          >
            {roleId ? ta("saveChanges") : tr("form.createRole")}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={roleId ? tr("form.editRole") : tr("form.createRole")}
      icon={<Shield size={15} strokeWidth={2} />}
      size="xl"
      footer={footer}
    >
      {/* ── Unified wizard wrapper — gives stable height across all steps ── */}
      <div className="crm-modal-flow">

        {/* ── Stepper — connectors are siblings of nodes, not wrappers ── */}
        <div className="crm-stepper" role="list">
          {STEP_LABELS.map((label, i) => {
            const done   = i < step;
            const active = i === step;
            const future = i > step;
            return (
              <Fragment key={i}>
                {i > 0 && (
                  <div
                    className={`crm-stepper__connector${done ? " crm-stepper__connector--done" : ""}`}
                    aria-hidden="true"
                  />
                )}
                <button
                  type="button"
                  role="listitem"
                  disabled={future}
                  onClick={() => done && setStep(i)}
                  className={[
                    "crm-stepper__node",
                    active ? "crm-stepper__node--active" : "",
                    done   ? "crm-stepper__node--done"   : "",
                    future ? "crm-stepper__node--future" : "",
                  ].filter(Boolean).join(" ")}
                  aria-current={active ? "step" : undefined}
                >
                  <span
                    className={[
                      "crm-stepper__dot",
                      active ? "crm-stepper__dot--active" : "",
                      done   ? "crm-stepper__dot--done"   : "",
                    ].filter(Boolean).join(" ")}
                    aria-hidden="true"
                  >
                    {done ? <Check size={11} strokeWidth={3} /> : i + 1}
                  </span>
                  <span
                    className={[
                      "crm-stepper__label",
                      active ? "crm-stepper__label--active" : "",
                      done   ? "crm-stepper__label--done"   : "",
                    ].filter(Boolean).join(" ")}
                  >
                    {label}
                  </span>
                </button>
              </Fragment>
            );
          })}
        </div>

        {/* ── Step content area ─────────────────────────────────────────── */}
        <div className="crm-step-content">

          {/* ══ STEP 1 — Role Details ═══════════════════════════════════ */}
          {step === 0 && (
            <div className="crm-body crm-body--center">
              <div className="crm-body__inner">
                <h3 className="crm-section-title">{tr("form.roleDetails")}</h3>

                <div className="crm-field">
                  <AppTextField
                    id="role-name"
                    label={tr("form.roleName")}
                    value={name}
                    onChange={setName}
                    placeholder={tr("form.roleNamePlaceholder")}
                    required
                  />
                </div>

                <div className="crm-field">
                  <AppTextArea
                    id="role-desc"
                    label={tr("form.description")}
                    value={description}
                    onChange={setDescription}
                    placeholder={tr("form.descriptionPlaceholder")}
                    rows={4}
                  />
                </div>

                <div className="crm-field">
                  <p className="crm-field-label">{tr("form.roleStatus")}</p>
                  <SToggle
                    id="role-status"
                    checked={status === "Active"}
                    onChange={(v) => setStatus(v ? "Active" : "Inactive")}
                    label={status === "Active" ? tr("form.active") : tr("form.inactive")}
                  />
                </div>

                <div className="crm-info-box">
                  <AlertCircle size={14} className="crm-info-box__icon" aria-hidden="true" />
                  <p className="crm-info-box__text">{tr("form.infoText")}</p>
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 2 — Permissions + Live Preview ═════════════════════ */}
          {step === 1 && (
            <div className="crm-body crm-body--columns">
              {/* Left: permission selector */}
              <div className="crm-perm-col">
                <div className="crm-perm-col__header">
                  <h3 className="crm-section-title">{tr("permissions.title")}</h3>
                  <p className="crm-perm-col__subtitle">{tr("permissions.subtitle")}</p>
                </div>
                <div className="crm-perm-col__body">
                  <PermissionsPanel
                    selectedIds={selectedPermIds}
                    onChange={setSelectedPermIds}
                  />
                </div>
              </div>

              {/* Right: live preview — no heading, card provides its own */}
              <div className="crm-preview-col">
                <RolePreviewCard
                  roleName={name}
                  roleDescription={description}
                  selectedPermIds={selectedPermIds}
                />
              </div>
            </div>
          )}

          {/* ══ STEP 3 — Final Review ════════════════════════════════════ */}
          {step === 2 && (
            <div className="crm-body crm-body--review">

              {/* Role summary card */}
              <div className="crm-review__summary">
                <div className="crm-review__summary-grid">
                  <div className="crm-review__summary-item">
                    <span className="crm-review__summary-label">{tr("table.roleName")}</span>
                    <div className="crm-review__summary-value">
                      <ExpandableText value={name || "—"} maxChars={90} collapsedLines={3} mode="block" />
                    </div>
                  </div>
                  <div className="crm-review__summary-item">
                    <span className="crm-review__summary-label">{tr("form.description")}</span>
                    <div className={description ? "crm-review__summary-value crm-review__summary-value--desc" : "crm-review__summary-value crm-review__summary-value--empty"}>
                      <ExpandableText
                        value={description || tr("management.noDescriptionProvided")}
                        maxChars={180}
                        collapsedLines={4}
                        preserveLineBreaks={!!description}
                        mode="block"
                      />
                    </div>
                  </div>
                  <div className="crm-review__summary-item">
                    <span className="crm-review__summary-label">{tr("form.roleStatus")}</span>
                    <span className="crm-review__summary-value">
                      <StatusBadge value={status} />
                    </span>
                  </div>
                  <div className="crm-review__summary-item">
                    <span className="crm-review__summary-label">{tr("table.permissions")}</span>
                    <span className="crm-review__summary-value crm-review__summary-value--count">
                      <strong>{selectedPermIds.length}</strong>
                      <span className="crm-review__summary-value--total"> / {allPermissionIds.length}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Permissions by module */}
              <div className="crm-review__perms">
                <div className="crm-review__perms-heading">
                  <Lock size={13} strokeWidth={2} aria-hidden="true" />
                  <span>{tr("management.permissionsByModule")}</span>
                </div>

                {selectedPermIds.length === 0 ? (
                  /* ── Empty state — intentional, not broken ── */
                  <div className="crm-review__empty-card">
                    <ShieldOff size={28} strokeWidth={1.5} className="crm-review__empty-card__icon" aria-hidden="true" />
                    <p className="crm-review__empty-card__title">No permissions selected</p>
                    <p className="crm-review__empty-card__desc">
                      This role will be created without any access permissions. You can edit it later to assign permissions.
                    </p>
                  </div>
                ) : (
                  <div className="crm-review__module-list">
                    {permissionGroups.map((g) => {
                      const granted = g.permissions.filter((p) => selectedPermIds.includes(p.id));
                      if (granted.length === 0) return null;
                      return (
                        <div key={g.id} className="crm-review__module">
                          <div className="crm-review__module-header">
                            <span className="crm-review__module-name">{g.label}</span>
                            <span className="crm-review__module-badge">
                              {granted.length} / {g.permissions.length}
                            </span>
                          </div>
                          <div className="crm-review__perm-rows">
                            {granted.map((p) => (
                              <span key={p.id} className="crm-review__perm-row" title={p.label}>{p.label}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>{/* end crm-step-content */}
      </div>{/* end crm-modal-flow */}
    </AppModal>
  );
}
