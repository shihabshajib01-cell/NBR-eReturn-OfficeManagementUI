import { useState, useEffect, useCallback } from "react";
import { PERM_GROUPS, type PermGroupDef, type PermissionItem } from "../data/permissions";

export const PERM_STORAGE_KEY = "nbr.permissionRegistry.customPermissions";
export const BASE_OVERRIDE_KEY = "nbr.permissionRegistry.baseOverrides";
export const PERM_EVENT = "nbr:permissions-updated";

export interface BaseOverride {
  id: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  serviceName?: string;
  accessLabel?: "PUBLIC" | "AUTH" | "AUTHORIZE";
  status?: "Active" | "Inactive";
  updatedAt: string;
}

export interface CustomPermission {
  id: string;
  label: string;
  groupId: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  serviceName: string;
  accessLabel: "PUBLIC" | "AUTH" | "AUTHORIZE";
  status: "Active" | "Inactive";
  isCustom: true;
  createdAt: string;
  updatedAt: string;
}

export type FlatPermission = PermissionItem & { groupId: string; groupLabel: string };

// ── localStorage helpers ──────────────────────────────────────────────────────
function loadBaseOverrides(): BaseOverride[] {
  try {
    const raw = localStorage.getItem(BASE_OVERRIDE_KEY);
    return raw ? (JSON.parse(raw) as BaseOverride[]) : [];
  } catch { return []; }
}

function saveBaseOverrides(overrides: BaseOverride[]): void {
  try {
    localStorage.setItem(BASE_OVERRIDE_KEY, JSON.stringify(overrides));
    window.dispatchEvent(new CustomEvent(PERM_EVENT));
  } catch { /* ignore */ }
}

function loadCustom(): CustomPermission[] {
  try {
    const raw = localStorage.getItem(PERM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomPermission[]) : [];
  } catch {
    return [];
  }
}

function saveCustom(perms: CustomPermission[]): void {
  try {
    localStorage.setItem(PERM_STORAGE_KEY, JSON.stringify(perms));
    window.dispatchEvent(new CustomEvent(PERM_EVENT));
  } catch { /* ignore storage errors */ }
}

// ── Merge: custom (newest first) prepended to each group, base after ─────────
function mergeGroups(custom: CustomPermission[], baseOverrides: BaseOverride[] = []): PermGroupDef[] {
  // Sort custom descending by createdAt
  const sorted = [...custom].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const overrideMap = new Map(baseOverrides.map((o) => [o.id, o]));

  return PERM_GROUPS.map((g) => {
    const extras = sorted
      .filter((c) => c.groupId === g.id)
      .map<PermissionItem>((c) => ({
        id: c.id, label: c.label, endpoint: c.endpoint, method: c.method,
        serviceName: c.serviceName, accessLabel: c.accessLabel,
        status: c.status, isCustom: true, createdAt: c.createdAt, updatedAt: c.updatedAt,
      }));

    // Apply base overrides to existing base permissions
    const baseMerged = g.permissions.map((p) => {
      const ov = overrideMap.get(p.id);
      return ov ? { ...p, ...ov } : p;
    });

    return { ...g, permissions: extras.length > 0 ? [...extras, ...baseMerged] : baseMerged };
  });
}

// ── flat list: custom (newest first) then base ────────────────────────────────
function buildFlat(groups: PermGroupDef[]): FlatPermission[] {
  const custom: FlatPermission[] = [];
  const base: FlatPermission[] = [];
  for (const g of groups) {
    for (const p of g.permissions) {
      const fp: FlatPermission = { ...p, groupId: g.id, groupLabel: g.label };
      if (p.isCustom) custom.push(fp);
      else base.push(fp);
    }
  }
  return [...custom, ...base];
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function usePermissionRegistry() {
  const [custom, setCustom] = useState<CustomPermission[]>(loadCustom);
  const [baseOverrides, setBaseOverrides] = useState<BaseOverride[]>(loadBaseOverrides);

  useEffect(() => {
    const sync = () => { setCustom(loadCustom()); setBaseOverrides(loadBaseOverrides()); };
    window.addEventListener("storage", sync);
    window.addEventListener(PERM_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(PERM_EVENT, sync);
    };
  }, []);

  const permissionGroups: PermGroupDef[] = mergeGroups(custom, baseOverrides);
  const allPermissionIds: string[] = permissionGroups.flatMap((g) =>
    g.permissions.map((p) => p.id)
  );
  const flatPermissions: FlatPermission[] = buildFlat(permissionGroups);

  const addPermission = useCallback(
    (perm: Omit<CustomPermission, "isCustom" | "createdAt" | "updatedAt">) => {
      const existing = loadCustom();
      const allBase = PERM_GROUPS.flatMap((g) => g.permissions.map((p) => p.id));
      let id = perm.id;
      if (existing.some((c) => c.id === id) || allBase.includes(id)) {
        id = `${id}_${Date.now()}`;
      }
      const now = new Date().toISOString();
      const next: CustomPermission = { ...perm, id, isCustom: true, createdAt: now, updatedAt: now };
      const updated = [...existing, next];
      setCustom(updated);
      saveCustom(updated);
    },
    []
  );

  const updatePermission = useCallback(
    (id: string, patch: Partial<Omit<CustomPermission, "id" | "isCustom" | "createdAt">>) => {
      const existing = loadCustom();
      const updated = existing.map((c) =>
        c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c
      );
      setCustom(updated);
      saveCustom(updated);
    },
    []
  );

  // Delete custom permission AND fire role-update event so roles remove it
  const deleteCustomPermission = useCallback((id: string) => {
    const updated = loadCustom().filter((c) => c.id !== id);
    setCustom(updated);
    saveCustom(updated);
    // Signal the role registry to strip this permission ID from all roles
    window.dispatchEvent(new CustomEvent("nbr:permission-deleted", { detail: { id } }));
  }, []);

  const updateBasePermission = useCallback(
    (id: string, patch: Omit<BaseOverride, "id" | "updatedAt">) => {
      const existing = loadBaseOverrides();
      const idx = existing.findIndex((o) => o.id === id);
      const entry: BaseOverride = { ...patch, id, updatedAt: new Date().toISOString() };
      const updated = idx >= 0 ? existing.map((o) => o.id === id ? entry : o) : [...existing, entry];
      setBaseOverrides(updated);
      saveBaseOverrides(updated);
    },
    []
  );

  return {
    permissionGroups,
    allPermissionIds,
    flatPermissions,
    customPermissions: custom,
    baseOverrides,
    addPermission,
    updatePermission,
    deleteCustomPermission,
    updateBasePermission,
  };
}
