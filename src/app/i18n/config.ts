import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "../locales/en/common.json";
import enNavigation from "../locales/en/navigation.json";
import enAuth from "../locales/en/auth.json";
import enUser from "../locales/en/user.json";
import enRole from "../locales/en/role.json";
import enReport from "../locales/en/report.json";
import enDashboard from "../locales/en/dashboard.json";
import enActions from "../locales/en/actions.json";
import enAppearance from "../locales/en/appearance.json";
import enBreadcrumbs from "../locales/en/breadcrumbs.json";
import enDrawers from "../locales/en/drawers.json";
import enEmptyStates from "../locales/en/emptyStates.json";
import enErrors from "../locales/en/errors.json";
import enFilters from "../locales/en/filters.json";
import enForms from "../locales/en/forms.json";
import enModals from "../locales/en/modals.json";
import enNotifications from "../locales/en/notifications.json";
import enStatus from "../locales/en/status.json";
import enTables from "../locales/en/tables.json";
import enPages from "../locales/en/pages.json";
import enKpi from "../locales/en/kpi.json";
import enHelp from "../locales/en/help.json";
import enPermissions from "../locales/en/permissions.json";
import enSpecialRegistration from "../locales/en/specialRegistration.json";

import bnCommon from "../locales/bn/common.json";
import bnNavigation from "../locales/bn/navigation.json";
import bnAuth from "../locales/bn/auth.json";
import bnUser from "../locales/bn/user.json";
import bnRole from "../locales/bn/role.json";
import bnReport from "../locales/bn/report.json";
import bnDashboard from "../locales/bn/dashboard.json";
import bnActions from "../locales/bn/actions.json";
import bnAppearance from "../locales/bn/appearance.json";
import bnBreadcrumbs from "../locales/bn/breadcrumbs.json";
import bnDrawers from "../locales/bn/drawers.json";
import bnEmptyStates from "../locales/bn/emptyStates.json";
import bnErrors from "../locales/bn/errors.json";
import bnFilters from "../locales/bn/filters.json";
import bnForms from "../locales/bn/forms.json";
import bnModals from "../locales/bn/modals.json";
import bnNotifications from "../locales/bn/notifications.json";
import bnStatus from "../locales/bn/status.json";
import bnTables from "../locales/bn/tables.json";
import bnPages from "../locales/bn/pages.json";
import bnKpi from "../locales/bn/kpi.json";
import bnHelp from "../locales/bn/help.json";
import bnPermissions from "../locales/bn/permissions.json";
import bnSpecialRegistration from "../locales/bn/specialRegistration.json";

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    auth: enAuth,
    user: enUser,
    role: enRole,
    report: enReport,
    dashboard: enDashboard,
    actions: enActions,
    appearance: enAppearance,
    breadcrumbs: enBreadcrumbs,
    drawers: enDrawers,
    emptyStates: enEmptyStates,
    errors: enErrors,
    filters: enFilters,
    forms: enForms,
    modals: enModals,
    notifications: enNotifications,
    status: enStatus,
    tables: enTables,
    pages: enPages,
    kpi: enKpi,
    help: enHelp,
    permissions: enPermissions,
    specialRegistration: enSpecialRegistration,
  },
  bn: {
    common: bnCommon,
    navigation: bnNavigation,
    auth: bnAuth,
    user: bnUser,
    role: bnRole,
    report: bnReport,
    dashboard: bnDashboard,
    actions: bnActions,
    appearance: bnAppearance,
    breadcrumbs: bnBreadcrumbs,
    drawers: bnDrawers,
    emptyStates: bnEmptyStates,
    errors: bnErrors,
    filters: bnFilters,
    forms: bnForms,
    modals: bnModals,
    notifications: bnNotifications,
    status: bnStatus,
    tables: bnTables,
    pages: bnPages,
    kpi: bnKpi,
    help: bnHelp,
    permissions: bnPermissions,
    specialRegistration: bnSpecialRegistration,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    defaultNS: "common",
    ns: [
      "common",
      "navigation",
      "auth",
      "user",
      "role",
      "report",
      "dashboard",
      "actions",
      "appearance",
      "breadcrumbs",
      "drawers",
      "emptyStates",
      "errors",
      "filters",
      "forms",
      "modals",
      "notifications",
      "status",
      "tables",
      "pages",
      "kpi",
      "help",
      "permissions",
      "specialRegistration",
    ],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

// Keep html[lang] in sync with the active language for screen readers
const LANG_MAP: Record<string, string> = { en: "en", bn: "bn" };
const syncLang = (lng: string) => {
  const tag = LANG_MAP[lng] ?? lng.split("-")[0];
  if (document.documentElement.lang !== tag) {
    document.documentElement.lang = tag;
  }
};
i18n.on("languageChanged", syncLang);
// Set initial lang synchronously (i18n.language is available after init)
i18n.isInitialized ? syncLang(i18n.language) : i18n.on("initialized", () => syncLang(i18n.language));

export default i18n;