import { useState, useEffect, useCallback } from "react";
import { MOCK_ROLES, type SystemRole } from "../data/mockData";

export const ROLE_STORAGE_KEY = "nbr.roleRegistry.customRoles";
export const ROLE_EVENT = "nbr:roles-updated";

// ── localStorage helpers ──────────────────────────────────────────────────────
function loadCustom(): SystemRole[] {
  try {
    const raw = localStorage.getItem(ROLE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SystemRole[]) : [];
  } catch {
    return [];
  }
}

function saveCustom(roles: SystemRole[]): void {
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(roles));
    window.dispatchEvent(new CustomEvent(ROLE_EVENT));
  } catch { /* ignore */ }
}

/** Merge MOCK_ROLES with custom overrides/additions.
 *  Custom entries override base entries with the same id.
 *  New custom entries are prepended (newest first among customs). */
function mergeRoles(custom: SystemRole[]): SystemRole[] {
  const customById = new Map(custom.map((r) => [r.id, r]));
  // Apply overrides to base roles (preserving base order)
  const merged = MOCK_ROLES.map((r) => customById.get(r.id) ?? r);
  // Prepend pure-new custom roles (not in MOCK_ROLES)
  const baseIds = new Set(MOCK_ROLES.map((r) => r.id));
  const newRoles = custom.filter((r) => !baseIds.has(r.id));
  return [...newRoles, ...merged];
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useRoleRegistry() {
  const [custom, setCustom] = useState<SystemRole[]>(loadCustom);

  useEffect(() => {
    const sync = () => setCustom(loadCustom());
    window.addEventListener("storage", sync);
    window.addEventListener(ROLE_EVENT, sync);

    // When a custom permission is deleted, strip that permission ID from every role
    const onPermDeleted = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      if (!id) return;
      const existing = loadCustom();
      const updated = existing.map((r) => ({
        ...r,
        permissions: r.permissions.filter((pid) => pid !== id),
      }));
      // Also need to strip from base-roles-in-local-state — save them all
      const allMerged = mergeRoles(loadCustom());
      const patchedAll = allMerged.map((r) => ({
        ...r,
        permissions: r.permissions.filter((pid) => pid !== id),
      }));
      // Only persist roles that differ from MOCK_ROLES or are custom
      const toSave = patchedAll.filter((r) => {
        const base = MOCK_ROLES.find((m) => m.id === r.id);
        if (!base) return true; // new custom
        return JSON.stringify(r.permissions) !== JSON.stringify(base.permissions);
      });
      setCustom(toSave);
      saveCustom(toSave);
    };
    window.addEventListener("nbr:permission-deleted", onPermDeleted);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(ROLE_EVENT, sync);
      window.removeEventListener("nbr:permission-deleted", onPermDeleted);
    };
  }, []);

  const roles: SystemRole[] = mergeRoles(custom);
  const activeRoles: SystemRole[] = roles.filter((r) => r.status === "Active");

  const addRole = useCallback((role: SystemRole) => {
    const existing = loadCustom();
    const updated = [...existing, role];
    setCustom(updated);
    saveCustom(updated);
  }, []);

  const updateRole = useCallback((role: SystemRole) => {
    const existing = loadCustom();
    const idx = existing.findIndex((r) => r.id === role.id);
    const updated = idx >= 0
      ? existing.map((r) => (r.id === role.id ? role : r))
      : [...existing, role];
    setCustom(updated);
    saveCustom(updated);
  }, []);

  const deleteRole = useCallback((id: string) => {
    const updated = loadCustom().filter((r) => r.id !== id);
    setCustom(updated);
    saveCustom(updated);
  }, []);

  const duplicateRole = useCallback((source: SystemRole): SystemRole => {
    const clone: SystemRole = {
      ...source,
      id: `r${Date.now()}`,
      name: `${source.name} (Copy)`,
      usersCount: 0,
    };
    const existing = loadCustom();
    const updated = [...existing, clone];
    setCustom(updated);
    saveCustom(updated);
    return clone;
  }, []);

  const removePermissionFromRoles = useCallback((permissionId: string) => {
    const allMerged = mergeRoles(loadCustom());
    const toSave = allMerged
      .map((r) => ({ ...r, permissions: r.permissions.filter((pid) => pid !== permissionId) }))
      .filter((r) => {
        const base = MOCK_ROLES.find((m) => m.id === r.id);
        if (!base) return true;
        return JSON.stringify(r.permissions) !== JSON.stringify(base.permissions);
      });
    setCustom(toSave);
    saveCustom(toSave);
  }, []);

  return {
    roles,
    activeRoles,
    addRole,
    updateRole,
    deleteRole,
    duplicateRole,
    removePermissionFromRoles,
  };
}
