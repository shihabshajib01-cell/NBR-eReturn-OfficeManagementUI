import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus, Shield, Lock, Users } from "lucide-react";
import { type SystemUser, type SystemRole, type UserStatus } from "../../data/mockData";
import { SETTINGS_ACCESS_LEVELS, USER_CIRCLES_LIST, USER_ZONES_LIST, USER_DESIGNATIONS_LIST } from "../../data/constants";
import { SafeText, ExpandableText } from "../shared/SafeText";
import { usePermissionRegistry } from "../../hooks/usePermissionRegistry";
import { SToggle } from "../forms/SToggle";
import { AppTextField } from "../forms/AppTextField";
import { AppSelectField } from "../forms/AppSelectField";
import { AppPhoneField } from "../forms/AppPhoneField";
import { AppModal } from "../modals/AppModal";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface UserFormModalProps {
  open: boolean;
  userId: string | null;
  users: SystemUser[];
  roles: SystemRole[];
  onClose: () => void;
  onSave: (u: SystemUser) => void;
  onNavigateToRoleManagement: () => void;
}

export function UserFormModal({ open, userId, users, roles, onClose, onSave, onNavigateToRoleManagement }: UserFormModalProps) {
  const { t: translate } = useTranslation("user");
  const { permissionGroups } = usePermissionRegistry();
  const existing = userId ? (users.find((u) => u.id === userId) ?? null) : null;
  const [name, setName] = useState("");
  const [employeeId, setEmpId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState(USER_DESIGNATIONS_LIST[3]);
  const [circle, setCircle] = useState(USER_CIRCLES_LIST[0]);
  const [zone, setZone] = useState(USER_ZONES_LIST[0]);
  const [level, setLevel] = useState(SETTINGS_ACCESS_LEVELS[3]);
  const [role, setRole] = useState(roles[4]?.name ?? roles[0]?.name ?? "");
  const [status, setStatus] = useState<UserStatus>("Active");
  const [sendInvite, setSendInvite] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(existing?.name ?? ""); setEmpId(existing?.employeeId ?? "");
      setEmail(existing?.email ?? ""); setPhone(existing?.phone ?? "");
      setDesignation(existing?.designation ?? USER_DESIGNATIONS_LIST[3]);
      setCircle(existing?.circle ?? USER_CIRCLES_LIST[0]);
      setZone(existing?.zone ?? USER_ZONES_LIST[0]);
      setLevel(existing?.level ?? SETTINGS_ACCESS_LEVELS[3]);
      setRole(existing?.role ?? roles[4]?.name ?? roles[0]?.name ?? "");
      setStatus(existing?.status ?? "Active");
      setSendInvite(existing?.sendInvite ?? true);
      setTwoFA(existing?.twoFA ?? false);
      requestAnimationFrame(() => firstFieldRef.current?.focus());
    }
  }, [open, userId]);

  const selectedRole = roles.find((r) => r.name === role) ?? roles[0];
  const activeRoleNames = roles.filter((r) => r.status === "Active").map((r) => r.name);
  const modulesWithAccess = selectedRole
    ? permissionGroups.filter((g) => g.permissions.some((p) => selectedRole.permissions.includes(p.id)))
    : [];

  const handleSave = () => {
    const saved: SystemUser = {
      id: existing?.id ?? `u-${Date.now()}`,
      name, employeeId, email, phone, designation, circle, zone, level, role,
      status, sendInvite, twoFA,
      accountActive: status === "Active",
      lastActive: existing?.lastActive ?? "Just now",
    };
    onSave(saved);
    onClose();
  };

  const footer = (
    <>
      <SecondaryButton onClick={onClose}>
        {translate("form.cancel")}
      </SecondaryButton>
      <PrimaryButton onClick={handleSave}>
        {existing ? translate("form.saveChanges") : translate("form.saveUser")}
      </PrimaryButton>
    </>
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={existing ? translate("form.editUser") : translate("form.addUser")}
      icon={<UserPlus size={15} strokeWidth={2} />}
      size="xl"
      footer={footer}
    >
      <div className="flex flex-col gap-4">
        {/* 1. Basic Information */}
        <fieldset className="modal-fieldset">
          <legend className="sr-only">{translate("form.basicInformation")}</legend>
          <div className="modal-fieldset__head">
            <div className="modal-fieldset__head-icon"><Users size={11} strokeWidth={2} /></div>
            <h3 className="modal-fieldset__head-label">{translate("form.basicInformation")}</h3>
          </div>
          <div className="modal-fieldset__body">
            <div className="modal-fieldset__grid">
              <AppTextField
                id="ufm-name"
                label={translate("form.fullName")}
                value={name}
                onChange={setName}
                required
                inputRef={firstFieldRef}
                autoComplete="off"
              />
              <AppTextField
                id="ufm-empid"
                label={translate("form.employeeId")}
                value={employeeId}
                onChange={setEmpId}
                helper="Used for internal tracking"
                required
                autoComplete="off"
              />
              <AppTextField
                id="ufm-email"
                label={translate("form.email")}
                value={email}
                onChange={setEmail}
                required
                autoComplete="off"
              />
              <AppPhoneField
                id="ufm-phone"
                label={translate("form.phone")}
                value={phone}
                onChange={setPhone}
                placeholder="+880-XXXX-XXXXXX"
              />
              <AppSelectField
                id="ufm-desig"
                label={translate("form.designation")}
                value={designation}
                onChange={setDesignation}
                options={USER_DESIGNATIONS_LIST}
                required
              />
              <AppSelectField
                id="ufm-zone"
                label={translate("form.zone")}
                value={zone}
                onChange={setZone}
                options={USER_ZONES_LIST}
                required
                helper="Assigned tax administration zone"
              />
              <div className="modal-fieldset__full">
                <AppSelectField
                  id="ufm-circle"
                  label={translate("form.circle")}
                  value={circle}
                  onChange={setCircle}
                  options={USER_CIRCLES_LIST}
                  required
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* 2. Access Setup */}
        <fieldset className="modal-fieldset">
          <legend className="sr-only">{translate("form.accessSetup")}</legend>
          <div className="modal-fieldset__head">
            <div className="modal-fieldset__head-icon"><Shield size={11} strokeWidth={2} /></div>
            <h3 className="modal-fieldset__head-label">{translate("form.accessSetup")}</h3>
          </div>
          <div className="modal-fieldset__body">
            <div className="modal-fieldset__grid">
              <AppSelectField
                id="ufm-level"
                label={translate("form.level")}
                value={level}
                onChange={setLevel}
                options={SETTINGS_ACCESS_LEVELS}
                required
                helper="Determines system access permissions"
              />
              <AppSelectField
                id="ufm-role"
                label={translate("form.role")}
                value={role}
                onChange={setRole}
                options={activeRoleNames}
                required
                helper="Determines system access permissions"
              />
              {selectedRole && (
                <div className="modal-fieldset__full role-summary">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <SafeText value={selectedRole.name} mode="truncate" as="span" className="text-[13px] font-semibold text-[var(--color-primary)]" />
                      <span className="modal-form-header__subtitle">{selectedRole.level}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="modal-form-header__subtitle">{selectedRole.permissions.length} {translate("form.permissionsCount")}</span>
                      <button
                        type="button"
                        onClick={() => { onClose(); onNavigateToRoleManagement(); }}
                        className="text-[12px] font-semibold outline-none rounded focus-visible:outline-2 focus-visible:outline-offset-2 text-[var(--color-primary)]"
                      >
                        {translate("form.viewPermissions")}
                      </button>
                    </div>
                  </div>
                  {selectedRole.description && (
                    <div className="text-[12px] mb-2 leading-snug text-[var(--color-text-secondary)]">
                      <ExpandableText value={selectedRole.description} maxChars={120} collapsedLines={3} mode="block" />
                    </div>
                  )}
                  <div className="role-summary__tags">
                    {modulesWithAccess.length > 0 ? modulesWithAccess.map((g) => (
                      <span key={g.id} className="role-tag">{g.label}</span>
                    )) : (
                      <span className="modal-form-header__subtitle">{translate("form.noModulesAssigned")}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* 3. Account Setup */}
        <fieldset className="modal-fieldset">
          <legend className="sr-only">{translate("form.accountSetup")}</legend>
          <div className="modal-fieldset__head">
            <div className="modal-fieldset__head-icon"><Lock size={11} strokeWidth={2} /></div>
            <h3 className="modal-fieldset__head-label">{translate("form.accountSetup")}</h3>
          </div>
          <div className="modal-fieldset__body">
            <div className="modal-fieldset__grid">
              <AppSelectField
                id="ufm-status"
                label={translate("form.status")}
                value={status}
                onChange={(v) => setStatus(v as UserStatus)}
                options={["Active", "Inactive", "Pending"]}
                required
              />
              <div className="modal-fieldset__full flex flex-col gap-3 pt-1">
                <SToggle id="ufm-invite" checked={sendInvite} onChange={setSendInvite} label={translate("form.sendInvitation")} />
                <SToggle id="ufm-2fa" checked={twoFA} onChange={setTwoFA} label={translate("form.twoFactorAuth")} />
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </AppModal>
  );
}
