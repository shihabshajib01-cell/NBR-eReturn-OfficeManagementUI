import { ClipboardList, AlertCircle, Briefcase, Users, Scale, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MOCK_DATA } from "../../data/mockData";
import { useSettings } from "../../hooks/useSettings";
import { StatCard } from "../../components/cards/StatCard";
import { DashSection } from "../../components/dashboard/DashSection";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import type { ColDef } from "../modulePageUtils";

const OFFLINE_COLS: ColDef[] = [
  { type: "col", col: { key: "circle", label: "Circle", headerKey: "headers.circle" } },
  { type: "col", col: { key: "t_82bb", label: "82BB", headerKey: "headers.return82bb", mono: true } },
  { type: "col", col: { key: "t_82c2", label: "82C(2)", headerKey: "headers.return82c2", mono: true } },
  { type: "col", col: { key: "t_212", label: "212", headerKey: "headers.return212", mono: true } },
  { type: "col", col: { key: "t_normal", label: "Normal", headerKey: "headers.returnNormal", mono: true } },
  { type: "col", col: { key: "t_total", label: "Total", headerKey: "headers.total", mono: true } },
];

const LITIGATION_COLS: ColDef[] = [
  { type: "col", col: { key: "circle", label: "Circle", headerKey: "headers.circle" } },
  { type: "col", col: { key: "t_pending", label: "Pending", headerKey: "headers.pending", mono: true } },
  { type: "col", col: { key: "t_approved", label: "Approved", headerKey: "headers.approved", mono: true } },
  { type: "col", col: { key: "t_rejected", label: "Rejected", headerKey: "headers.rejected", mono: true } },
  { type: "col", col: { key: "t_total", label: "Total", headerKey: "headers.total", mono: true } },
  { type: "col", col: { key: "t_revenue", label: "Revenue (BDT)", headerKey: "headers.revenueBdt", mono: true } },
];

const TAX_CAT_COLS: ColDef[] = [
  { type: "col", col: { key: "category", label: "Category", headerKey: "headers.category" } },
  { type: "col", col: { key: "online_fmt", label: "Online", headerKey: "headers.online", mono: true } },
  { type: "col", col: { key: "offline_fmt", label: "Offline", headerKey: "headers.offline", mono: true } },
  { type: "col", col: { key: "total_fmt", label: "Total", headerKey: "headers.total", mono: true } },
];

export function CombinedDashboardPage() {
  const { assessmentYear } = useSettings();
  const { t: translate } = useTranslation("dashboard");
  const { t: translateCommon } = useTranslation("common");

  const summaryCards = [
    { label: translate("combined.kpis.totalReturnsFiled"), value: "22,023", change: "+8.2%", up: true, icon: ClipboardList, tone: "primary" as const },
    { label: translate("combined.kpis.pendingApprovals"), value: "1,284", change: "-3.1%", up: false, icon: AlertCircle, tone: "warning" as const },
    { label: translate("combined.kpis.totalTaxCollected"), value: "৳ 4,21,80,000", change: "+12.4%", up: true, icon: Briefcase, tone: "success" as const },
    { label: translate("combined.kpis.activeUsers"), value: "148", change: "+2", up: true, icon: Users, tone: "neutral" as const },
  ];

  const offlineData = (MOCK_DATA["offline-return-report"] ?? []).slice(0, 5);
  const litData = (MOCK_DATA["litigation-arrear"] ?? []).slice(0, 5);
  const taxCatData = (MOCK_DATA["tax-category-report"] ?? []).slice(0, 5).map(row => ({
    ...row,
    online_fmt: row.online?.toLocaleString(),
    offline_fmt: row.offline?.toLocaleString(),
    total_fmt: row.total?.toLocaleString(),
  }));

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <h1 className="dashboard-page__title">{translate("combined.title")}</h1>
        <p className="dashboard-page__subtitle">{translate("combined.subtitle", { assessmentYear })}</p>
      </div>

      <div className="dashboard-kpi-grid dashboard-kpi-grid--1row">
        {summaryCards.map((card, i) => (
          <StatCard key={i} icon={card.icon} value={card.value} label={card.label} trend={card.change} trendUp={card.up} tone={card.tone} />
        ))}
      </div>

      <div className="dashboard-section-grid">
        <DashSection title={translate("combined.sections.offlineReturnsToday")} icon={ClipboardList} badge={`${translateCommon("common.ayAbbrev")} ${assessmentYear}`}>
          <ResponsiveTable cols={OFFLINE_COLS} rows={offlineData} noCard />
        </DashSection>

        <DashSection title={translate("combined.sections.litigationArrearToday")} icon={Scale} badge={`${translateCommon("common.ayAbbrev")} ${assessmentYear}`}>
          <ResponsiveTable cols={LITIGATION_COLS} rows={litData} noCard />
        </DashSection>
      </div>

      <div className="mt-4">
        <DashSection title={translate("combined.sections.taxCategorySubmissions")} icon={Tag}>
          <ResponsiveTable cols={TAX_CAT_COLS} rows={taxCatData} noCard />
        </DashSection>
      </div>
    </div>
  );
}
