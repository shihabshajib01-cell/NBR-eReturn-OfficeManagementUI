import { GenPage } from "../pages/GeneratedTablePage";
import { ROW_VIEW, VIEW, REPORT_CFGS, REPORT_DRAWER_FIELDS } from "../../data/modulePageConfigs";
import type { KpiDef, TableRow } from "../../pages/modulePageUtils";

interface ReportPageProps {
  reportId: string;
}

function sumCol(rows: TableRow[], key: string): number {
  return rows.reduce((acc, r) => acc + (parseInt(String(r[key] ?? "0").replace(/[^\d]/g, ""), 10) || 0), 0);
}

function countWhere(rows: TableRow[], key: string, val: string): number {
  return rows.filter(r => r[key] === val).length;
}

function buildReportKpis(reportId: string, rows: TableRow[]): KpiDef[] {
  switch (reportId) {
    case "offline-return-report":
      return [
        { label: "Total Circles", labelKey: "totalCircles", value: String(rows.length), tone: "primary" },
        { label: "Today Entries", labelKey: "todayEntries", value: String(sumCol(rows, "t_total")), tone: "neutral" },
        { label: "Cumulative Entries", labelKey: "cumulativeEntries", value: String(sumCol(rows, "u_total")), tone: "success" },
      ];

    case "tax-category-report": {
      const dataRows = rows.filter(r => r.category !== "Total");
      const totalRow = rows.find(r => r.category === "Total");
      return [
        { label: "Categories", labelKey: "categories", value: String(dataRows.length), tone: "primary" },
        { label: "Online Submissions", labelKey: "onlineSubmissions", value: totalRow?.online ?? "—", tone: "success" },
        { label: "Offline Submissions", labelKey: "offlineSubmissions", value: totalRow?.offline ?? "—", tone: "neutral" },
        { label: "Grand Total", labelKey: "grandTotal", value: totalRow?.total ?? "—", tone: "warning" },
      ];
    }

    case "express-cert-disposal":
      return [
        { label: "Total Circles", labelKey: "totalCircles", value: String(rows.length), tone: "primary" },
        { label: "Today Pending", labelKey: "todayPending", value: String(sumCol(rows, "t_pending")), tone: "warning" },
        { label: "Today Disposed", labelKey: "todayDisposed", value: String(sumCol(rows, "t_disposed")), tone: "success" },
        { label: "Cumulative Disposed", labelKey: "cumulativeDisposed", value: String(sumCol(rows, "u_disposed")), tone: "neutral" },
      ];

    case "user-activity-report": {
      const active = countWhere(rows, "active_status", "Active");
      const inactive = countWhere(rows, "active_status", "Inactive");
      return [
        { label: "Total Users", labelKey: "totalUsers", value: String(rows.length), tone: "primary" },
        { label: "Active", labelKey: "active", value: String(active), tone: "success" },
        { label: "Inactive", labelKey: "inactive", value: String(inactive), tone: "error" },
        { label: "Total Entry Today", labelKey: "totalEntryToday", value: String(sumCol(rows, "entry_today")), tone: "neutral" },
      ];
    }

    case "litigation-arrear":
    case "litigation-writ-case":
    case "litigation-dept-case":
    case "litigation-taxpayer-case":
      return [
        { label: "Total Circles", labelKey: "totalCircles", value: String(rows.length), tone: "primary" },
        { label: "Today Pending", labelKey: "todayPending", value: String(sumCol(rows, "t_pending")), tone: "warning" },
        { label: "Today Approved", labelKey: "todayApproved", value: String(sumCol(rows, "t_approved")), tone: "success" },
        { label: "Today Total Entries", labelKey: "todayTotalEntries", value: String(sumCol(rows, "t_total")), tone: "neutral" },
      ];

    case "appeal-report":
    case "tribunal-report":
      return [
        { label: "Total Circles", labelKey: "totalCircles", value: String(rows.length), tone: "primary" },
        { label: "Today Pending", labelKey: "todayPending", value: String(sumCol(rows, "t_pending")), tone: "warning" },
        { label: "Today Total", labelKey: "todayTotal", value: String(sumCol(rows, "t_total")), tone: "neutral" },
        { label: "Cumulative Total", labelKey: "cumulativeTotal", value: String(sumCol(rows, "u_total")), tone: "success" },
      ];

    case "payment-demand-report":
      return [
        { label: "Total Records", labelKey: "totalRecords", value: String(rows.length), tone: "primary" },
        { label: "Paid", labelKey: "paid", value: String(countWhere(rows, "payment_status", "Paid")), tone: "success" },
        { label: "Partially Paid", labelKey: "partiallyPaid", value: String(countWhere(rows, "payment_status", "Partially Paid")), tone: "warning" },
        { label: "Unpaid", labelKey: "unpaid", value: String(countWhere(rows, "payment_status", "Unpaid")), tone: "error" },
      ];

    case "register-5-report":
      return [
        { label: "Total Records", labelKey: "totalRecords", value: String(rows.length), tone: "primary" },
        { label: "Pending", labelKey: "pending", value: String(countWhere(rows, "case_status", "Pending")), tone: "warning" },
        { label: "Approved", labelKey: "approved", value: String(countWhere(rows, "case_status", "Approved")), tone: "success" },
        { label: "Rejected", labelKey: "rejected", value: String(countWhere(rows, "case_status", "Rejected")), tone: "error" },
      ];

    default:
      return [{ label: "Total Records", labelKey: "totalRecords", value: String(rows.length), tone: "primary" }];
  }
}

export function ReportPage({ reportId }: ReportPageProps) {
  const cfg = reportId ? REPORT_CFGS[reportId] : null;
  if (!cfg) {
    return (
      <div className="flex-1 flex items-center justify-center text-[14px] text-[var(--color-text-secondary)]">
        Select a report from the navigation
      </div>
    );
  }
  const drawerFields = REPORT_DRAWER_FIELDS[reportId ?? ""] ?? [
    { label: "Circle", key: "circle" },
    { label: "Tax Circle", key: "tax_circle" },
    { label: "TIN", key: "tin" },
    { label: "Taxpayer Name", key: "taxpayer_name" },
    { label: "Category", key: "category" },
    { label: "Assessment Year", key: "ay" },
    { label: "Status", key: "payment_status" },
  ];
  const kpis: KpiDef[] = buildReportKpis(reportId, cfg.rows);

  const titleKeyMap: Record<string, string> = {
    "offline-return-report": "offlineReturnReport.title",
    "tax-category-report": "taxCategoryReport.title",
    "express-cert-disposal": "expressCertDisposal.title",
    "user-activity-report": "userActivityReport.title",
    "litigation-arrear": "litigationArrear.title",
    "litigation-writ-case": "litigationWritCase.title",
    "litigation-dept-case": "litigationDeptCase.title",
    "litigation-taxpayer-case": "litigationTaxpayerCase.title",
    "appeal-report": "appealReport.title",
    "tribunal-report": "tribunalReport.title",
    "payment-demand-report": "paymentDemandReport.title",
    "register-5-report": "register5Report.title",
  };
  const descKeyMap: Record<string, string> = {
    "offline-return-report": "offlineReturnReport.desc",
    "tax-category-report": "taxCategoryReport.desc",
    "express-cert-disposal": "expressCertDisposal.desc",
    "user-activity-report": "userActivityReport.desc",
    "litigation-arrear": "litigationArrear.desc",
    "litigation-writ-case": "litigationWritCase.desc",
    "litigation-dept-case": "litigationDeptCase.desc",
    "litigation-taxpayer-case": "litigationTaxpayerCase.desc",
    "appeal-report": "appealReport.desc",
    "tribunal-report": "tribunalReport.desc",
    "payment-demand-report": "paymentDemandReport.desc",
    "register-5-report": "register5Report.desc",
  };

  return (
    <GenPage
      cfg={{
        title: cfg.title,
        titleKey: titleKeyMap[reportId],
        desc: cfg.desc,
        descKey: descKeyMap[reportId],
        cols: cfg.cols,
        filters: cfg.filters,
        actions: ROW_VIEW,
        drawerActions: VIEW,
        rows: cfg.rows,
        kpis,
      }}
      drawerFields={drawerFields}
    />
  );
}
