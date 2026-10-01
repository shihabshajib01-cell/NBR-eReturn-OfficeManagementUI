import { Shield, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatCard } from "../../components/cards/StatCard";
import { DashSection } from "../../components/dashboard/DashSection";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { useSettings } from "../../hooks/useSettings";
import type { ColDef, MobileCardMapping } from "../modulePageUtils";

const CIRCLE_PSR_COLS: ColDef[] = [
  { type: "col", col: { key: "serial_no", label: "S/N", headerKey: "headers.serialNo", mono: true } },
  { type: "col", col: { key: "zone", label: "Zone", headerKey: "headers.zone" } },
  { type: "col", col: { key: "total_psr", label: "Total PSR", headerKey: "headers.totalPsr", mono: true } },
  { type: "col", col: { key: "double_entry", label: "Double Entry", headerKey: "headers.doubleEntry", mono: true } },
  { type: "col", col: { key: "double_entry_percentage", label: "Double Entry Percentage (%)", headerKey: "headers.doubleEntryPercentage", mono: true } },
];

const CIRCLE_PSR_MOBILE_MAPPING: MobileCardMapping = {
  primary: "zone",
  identifier: "serial_no",
  meta: ["total_psr", "double_entry", "double_entry_percentage"],
};

const CIRCLE_PSR_DATA = [
  { serial_no: "1", zone: "Large Taxpayers Unit (Tax)", total_psr: "4", double_entry: "0", double_entry_percentage: "0.00" },
  { serial_no: "2", zone: "01, Dhaka", total_psr: "1", double_entry: "0", double_entry_percentage: "0.00" },
  { serial_no: "3", zone: "03, Dhaka", total_psr: "3", double_entry: "0", double_entry_percentage: "0.00" },
  { serial_no: "4", zone: "05, Dhaka", total_psr: "2", double_entry: "0", double_entry_percentage: "0.00" },
  { serial_no: "5", zone: "08, Dhaka", total_psr: "2", double_entry: "0", double_entry_percentage: "0.00" },
  { serial_no: "6", zone: "12, Dhaka", total_psr: "11", double_entry: "0", double_entry_percentage: "0.00" },
  { serial_no: "7", zone: "13, Dhaka", total_psr: "103", double_entry: "11", double_entry_percentage: "10.68" },
  { serial_no: "8", zone: "14, Dhaka", total_psr: "10", double_entry: "7", double_entry_percentage: "70.00" },
];

export function PSRDashboardPage() {
  const { assessmentYear: ay } = useSettings();
  const { t: translate } = useTranslation("dashboard");
  const { t: translateCommon } = useTranslation("common");

  const kpiCards = [
    { label: translate("psr.kpis.totalPsrEntries"), value: "174", icon: Shield, tone: "primary" as const },
    { label: translate("psr.kpis.totalDoubleEntry"), value: "34", icon: Activity, tone: "success" as const },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <h1 className="dashboard-page__title">{translate("psr.title")}</h1>
        <p className="dashboard-page__subtitle">{translate("psr.subtitle")}</p>
      </div>

      <div className="dashboard-kpi-grid dashboard-kpi-grid--1row">
        {kpiCards.map((card, i) => (
          <StatCard key={i} icon={card.icon} value={card.value} label={card.label} tone={card.tone} />
        ))}
      </div>

      <div className="dashboard-content-stack">
        <DashSection title={translate("psr.sections.circlewisePsrStatus")} icon={Shield} badge={`${translateCommon("common.ayAbbrev")} ${ay}`}>
          <ResponsiveTable
            cols={CIRCLE_PSR_COLS}
            rows={CIRCLE_PSR_DATA}
            mobileCardMapping={CIRCLE_PSR_MOBILE_MAPPING}
            noCard
          />
        </DashSection>
      </div>
    </div>
  );
}
