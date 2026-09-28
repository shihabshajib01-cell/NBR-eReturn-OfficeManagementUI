import { useState, useEffect, useCallback } from "react";
import { MOCK_USERS, type SystemUser } from "../data/mockData";

export const USER_STORAGE_KEY = "nbr.userRegistry.customUsers";
export const USER_EVENT = "nbr:users-updated";

function loadCustom(): SystemUser[] {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SystemUser[]) : [];
  } catch {
    return [];
  }
}

function saveCustom(users: SystemUser[]): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent(USER_EVENT));
  } catch { /* ignore */ }
}

/** Merge MOCK_USERS with custom overrides/additions.
 *  Custom entries override base entries with the same id.
 *  New custom entries are prepended. */
function mergeUsers(custom: SystemUser[]): SystemUser[] {
  const customById = new Map(custom.map((u) => [u.id, u]));
  const merged = MOCK_USERS.map((u) => customById.get(u.id) ?? u);
  const baseIds = new Set(MOCK_USERS.map((u) => u.id));
  const newUsers = custom.filter((u) => !baseIds.has(u.id));
  return [...newUsers, ...merged];
}

export function useUserRegistry() {
  const [custom, setCustom] = useState<SystemUser[]>(loadCustom);

  useEffect(() => {
    const sync = () => setCustom(loadCustom());
    window.addEventListener("storage", sync);
    window.addEventListener(USER_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(USER_EVENT, sync);
    };
  }, []);

  const users: SystemUser[] = mergeUsers(custom);

  const saveUser = useCallback((user: SystemUser) => {
    const existing = loadCustom();
    const idx = existing.findIndex((u) => u.id === user.id);
    const updated = idx >= 0
      ? existing.map((u) => (u.id === user.id ? user : u))
      : [...existing, user];
    setCustom(updated);
    saveCustom(updated);
  }, []);

  const deleteUser = useCallback((id: string) => {
    const updated = loadCustom().filter((u) => u.id !== id);
    setCustom(updated);
    saveCustom(updated);
  }, []);

  const updateUserField = useCallback(
    (id: string, patch: Partial<SystemUser>) => {
      const all = mergeUsers(loadCustom());
      const target = all.find((u) => u.id === id);
      if (!target) return;
      const updated_user = { ...target, ...patch };
      const existing = loadCustom();
      const idx = existing.findIndex((u) => u.id === id);
      const updated = idx >= 0
        ? existing.map((u) => (u.id === id ? updated_user : u))
        : [...existing, updated_user];
      setCustom(updated);
      saveCustom(updated);
    },
    []
  );

  return { users, saveUser, deleteUser, updateUserField };
}
