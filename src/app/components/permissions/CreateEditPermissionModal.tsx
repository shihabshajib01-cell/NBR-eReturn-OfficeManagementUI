import { useState, useEffect } from "react";
import { KeyRound } from "lucide-react";
import { AppModal } from "../modals/AppModal";
import { AppTextField } from "../forms/AppTextField";
import { AppSelectField } from "../forms/AppSelectField";
import { SToggle } from "../forms/SToggle";
import { usePermissionRegistry, type CustomPermission } from "../../hooks/usePermissionRegistry";

interface Props {
  open: boolean;
  editing: CustomPermission | null;
  /** All flat permissions for duplicate validation */
  existingIds: string[];
  existingEndpoints: { endpoint: string; method: string }[];
  onClose: () => void;
  onSave: (perm: Omit<CustomPermission, "isCustom" | "createdAt" | "updatedAt">) => void;
}

const METHOD_OPTS = ["GET", "POST", "PUT", "DELETE"];
const ACCESS_OPTS = ["PUBLIC", "AUTH", "AUTHORIZE"];

function genId(groupId: string, label: string): string {
  return `${groupId}_${label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}`;
}

export function CreateEditPermissionModal({ open, editing, existingIds, existingEndpoints, onClose, onSave }: Props) {
  const isEdit = !!editing;
  const { permissionGroups } = usePermissionRegistry();

  const groupOpts   = permissionGroups.map((g) => g.label);
  const toGroupId   = (label: string) => permissionGroups.find((g) => g.label === label)?.id ?? "";
  const toGroupLabel = (id: string)   => permissionGroups.find((g) => g.id === id)?.label ?? "";

  const [name, setName]           = useState("");
  const [groupLabel, setGroupLabel] = useState(groupOpts[0] ?? "");
  const [endpoint, setEndpoint]   = useState("");
  const [method, setMethod]       = useState<string>("GET");
  const [service, setService]     = useState("");
  const [access, setAccess]       = useState<string>("PUBLIC");
  const [active, setActive]       = useState(true);

  const [nameErr, setNameErr]         = useState("");
  const [endpointErr, setEndpointErr] = useState("");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.label);
      setGroupLabel(toGroupLabel(editing.groupId));
      setEndpoint(editing.endpoint);
      setMethod(editing.method);
      setService(editing.serviceName);
      setAccess(editing.accessLabel);
      setActive(editing.status === "Active");
    } else {
      setName(""); setGroupLabel(groupOpts[0] ?? ""); setEndpoint("");
      setMethod("GET"); setService(""); setAccess("PUBLIC"); setActive(true);
    }
    setNameErr(""); setEndpointErr("");
  }, [open, editing]);

  const validate = (): boolean => {
    let ok = true;
    const groupId = toGroupId(groupLabel);
    const id = isEdit ? editing!.id : genId(groupId, name.trim());

    if (!name.trim()) { setNameErr("Permission Name is required."); ok = false; }
    else if (!isEdit && existingIds.includes(id)) {
      setNameErr("A permission with this name already exists in the selected group."); ok = false;
    } else { setNameErr(""); }

    if (!endpoint.trim()) { setEndpointErr("API Endpoint is required."); ok = false; }
    else {
      const dup = existingEndpoints.find(
        (e) => e.endpoint === endpoint.trim() && e.method === method && (!isEdit || editing!.endpoint !== endpoint.trim() || editing!.method !== method)
      );
      if (dup) { setEndpointErr(`Endpoint + method combination already exists.`); ok = false; }
      else { setEndpointErr(""); }
    }
    return ok;
  };

  const handleSave = () => {
    if (!validate()) return;
    const groupId = toGroupId(groupLabel);
    const id = isEdit ? editing!.id : genId(groupId, name.trim());
    onSave({
      id,
      label: name.trim(),
      groupId,
      endpoint: endpoint.trim(),
      method: method as CustomPermission["method"],
      serviceName: service.trim(),
      accessLabel: access as CustomPermission["accessLabel"],
      status: active ? "Active" : "Inactive",
    });
    onClose();
  };

  const canSave = name.trim() && endpoint.trim() && service.trim();

  const footer = (
    <div className="crm-footer">
      <button type="button" onClick={onClose} className="action-btn action-btn--secondary">Cancel</button>
      <button
        type="button"
        onClick={handleSave}
        disabled={!canSave}
        className="action-btn action-btn--primary"
        style={!canSave ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
      >
        {isEdit ? "Save Changes" : "Add Permission"}
      </button>
    </div>
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Permission" : "Add New Permission"}
      icon={<KeyRound size={15} strokeWidth={2} />}
      size="md"
      footer={footer}
    >
      <div className="perm-form">
        <div className="perm-form__field">
          <AppTextField
            id="perm-name"
            label="Permission Name"
            value={name}
            onChange={(v) => { setName(v); setNameErr(""); }}
            placeholder="e.g. Audit Dashboard"
            required
            error={nameErr}
          />
        </div>

        <div className="perm-form__field">
          <AppSelectField
            id="perm-group"
            label="Permission Group"
            value={groupLabel}
            onChange={setGroupLabel}
            options={groupOpts}
          />
        </div>

        <div className="perm-form__field">
          <AppTextField
            id="perm-endpoint"
            label="API Endpoint"
            value={endpoint}
            onChange={(v) => { setEndpoint(v); setEndpointErr(""); }}
            placeholder="e.g. /api/v1/audit/dashboard"
            required
            error={endpointErr}
          />
        </div>

        <div className="perm-form__row">
          <div className="perm-form__field perm-form__field--half">
            <AppSelectField
              id="perm-method"
              label="Method"
              value={method}
              onChange={setMethod}
              options={METHOD_OPTS}
            />
          </div>
          <div className="perm-form__field perm-form__field--half">
            <AppSelectField
              id="perm-access"
              label="API Access Label"
              value={access}
              onChange={setAccess}
              options={ACCESS_OPTS}
            />
          </div>
        </div>

        <div className="perm-form__field">
          <AppTextField
            id="perm-service"
            label="Service Name"
            value={service}
            onChange={setService}
            placeholder="e.g. Audit Service"
            required
          />
        </div>

        <div className="perm-form__field">
          <p className="crm-field-label">Status</p>
          <SToggle
            id="perm-status"
            checked={active}
            onChange={setActive}
            label={active ? "Active" : "Inactive"}
          />
        </div>
      </div>
    </AppModal>
  );
}
