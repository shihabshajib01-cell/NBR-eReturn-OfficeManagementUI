import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { type PermGroupDef } from "../../data/permissions";
import { AppCheckbox } from "../forms/AppCheckbox";

interface PermissionGroupProps {
  group: PermGroupDef;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function PermissionGroup({ group, selectedIds, onChange }: PermissionGroupProps) {
  const [open, setOpen] = useState(false);
  const groupIds = group.permissions.map((p) => p.id);
  const selectedInGroup = groupIds.filter((id) => selectedIds.includes(id));
  const allGroupSelected = selectedInGroup.length === groupIds.length;
  const someGroupSelected = selectedInGroup.length > 0 && !allGroupSelected;

  const toggleGroup = (v: boolean) => {
    onChange(v
      ? [...selectedIds, ...groupIds.filter((id) => !selectedIds.includes(id))]
      : selectedIds.filter((id) => !groupIds.includes(id))
    );
  };
  const togglePerm = (permId: string, v: boolean) => {
    onChange(v ? [...selectedIds, permId] : selectedIds.filter((id) => id !== permId));
  };

  const hasSome = selectedInGroup.length > 0;

  return (
    <div className={`permission-group${hasSome ? " permission-group--has-selections" : ""}`}>
      <div className={`permission-group__header${open ? " permission-group__header--expanded" : ""}`}>
        <AppCheckbox
          id={`grp-${group.id}`}
          checked={allGroupSelected}
          indeterminate={someGroupSelected}
          onChange={toggleGroup}
          ariaLabel={`Select all ${group.label} permissions`}
          onClick={(e) => e.stopPropagation()}
        />
        <button
          type="button"
          className="permission-group__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={`pg-${group.id}`}
        >
          <span className="permission-group__label">{group.label}</span>
          <div className="permission-group__count-wrapper">
            <span className={`permission-group__count ${hasSome ? "permission-group__count--has-selections" : "permission-group__count--none"}`}>
              {selectedInGroup.length}/{groupIds.length}
            </span>
            <span className={`permission-group__chevron ${open ? "permission-group__chevron--expanded" : "permission-group__chevron--collapsed"}`}>
              <ChevronDown size={12} strokeWidth={2} className="text-[var(--color-text-secondary)]" />
            </span>
          </div>
        </button>
      </div>

      {open && (
        <div id={`pg-${group.id}`} role="region" aria-label={`${group.label} permissions`}>
          {group.permissions.map((perm) => {
            const checked = selectedIds.includes(perm.id);
            return (
              <label key={perm.id} className={`permission-item${checked ? " permission-item--checked" : ""}`}>
                <AppCheckbox
                  id={`perm-${perm.id}`}
                  checked={checked}
                  onChange={(v) => togglePerm(perm.id, v)}
                />
                <span className="permission-item__label">{perm.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
