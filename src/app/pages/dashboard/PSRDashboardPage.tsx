import { Shield, AlertCircle, CheckCircle, XCircle, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatCard } from "../../components/cards/StatCard";
import { DashSection } from "../../components/dashboard/DashSection";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { useSettings } from "../../hooks/useSettings";
import type { ColDef } from "../modulePageUtils";
import { gen, NAMES, CIRCLES_DATA } from "../modulePageUtils";

const CIRCLE_PSR_COLS: ColDef[] = [
  { type: "col", col: { key: "circle", label: "Circle", headerKey: "headers.circle" } },
  { type: "col", col: { key: "total", label: "Total PSR", headerKey: "headers.totalPsr", mono: true } },
  { type: "col", col: { key: "pending", label: "Pending", headerKey: "headers.pending", mono: true } },
  { type: "col", col: { key: "approved", label: "Approved", headerKey: "headers.approved", mono: true } },
  { type: "col", col: { key: "rejected", label: "Rejected", headerKey: "headers.rejected", mono: true } },
  { type: "col", col: { key: "tax", label: "Tax Total", headerKey: "headers.taxTotal", mono: true } },
];

const RECENT_PSR_COLS: ColDef[] = [
  { type: "col", col: { key: "psr_no", label: "PSR No.", headerKey: "headers.psrNo", mono: true } },
  { type: "col", col: { key: "submitted_by", label: "Submitted By", headerKey: "headers.submittedBy" } },
  { type: "col", col: { key: "tax_amount", label: "Amount", headerKey: "headers.amount", mono: true } },
  { type: "col", col: { key: "approval_status", label: "Status", headerKey: "headers.status", badge: true } },
];

export function PSRDashboardPage() {
  const { assessmentYear: ay } = useSettings();
  const { t: translate } = useTranslation("dashboard");
  const { t: translateCommon } = useTranslation("common");

  const circleData = CIRCLES_DATA.map((c, i) => ({
    circle: c, total: 300 + i * 80, pending: 10 + i * 5, approved: 280 + i * 70, rejected: 10 + i * 3, tax: `৳${20 + i * 8}L`,
  }));
  const recentPsr = gen(6, i => ({
    psr_no: `PSR-${7000 + i}`,
    submitted_by: NAMES[i % 10],
    tax_amount: `৳${(i * 40 + 50) * 1000}`,
    approval_status: ["Approved", "Pending", "Rejected"][i % 3],
  }));
  const kpiCards = [
    { label: translate("psr.kpis.totalPsrEntries"), value: "8,421", change: "+5.3%", up: true, icon: Shield, tone: "primary" as const },
    { label: translate("psr.kpis.pendingApproval"), value: "312", change: "+12", up: false, icon: AlertCircle, tone: "warning" as const },
    { label: translate("psr.kpis.approvedToday"), value: "87", change: "+18%", up: true, icon: CheckCircle, tone: "success" as const },
    { label: translate("psr.kpis.rejectedToday"), value: "14", change: "-2", up: true, icon: XCircle, tone: "error" as const },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <h1 className="dashboard-page__title">{translate("psr.title")}</h1>
        <p className="dashboard-page__subtitle">{translate("psr.subtitle")}</p>
      </div>

      <div className="dashboard-kpi-grid dashboard-kpi-grid--1row">
        {kpiCards.map((card, i) => (
          <StatCard key={i} icon={card.icon} value={card.value} label={card.label} trend={card.change} trendUp={card.up} tone={card.tone} />
        ))}
      </div>

      <div className="dashboard-section-grid">
        <DashSection title={translate("psr.sections.circlewisePsrStatus")} icon={Shield} badge={`${translateCommon("common.ayAbbrev")} ${ay}`}>
          <ResponsiveTable cols={CIRCLE_PSR_COLS} rows={circleData} noCard />
        </DashSection>

        <DashSection title={translate("psr.sections.recentPsrEntries")} icon={Activity}>
          <ResponsiveTable cols={RECENT_PSR_COLS} rows={recentPsr} noCard />
        </DashSection>
      </div>
    </div>
  );
}
