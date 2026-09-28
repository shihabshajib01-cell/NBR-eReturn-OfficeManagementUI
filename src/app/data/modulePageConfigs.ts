import { Eye, Download, Printer, CheckCircle, XCircle, Pencil, Send, RotateCcw, UserCheck } from "lucide-react";
import type { ColDef, FlatCol, RowAction, FilterDef, TableRow } from "../pages/modulePageUtils";
import { fc, BADGE, ZONES, CIRCLES, AY_OPTS, CIRCLES_DATA, NAMES } from "../pages/modulePageUtils";

// ─── Constants ────────────────────────────────────────────────────────────────
export const ST_OPTS = ["All Status", "Pending", "Approved", "Rejected"];
export const TINS = [
  "1234567890",
  "9876543210",
  "5551234567",
  "7778889990",
  "3334445556",
  "1112223334",
  "6667778889",
  "2223334445",
  "8889990001",
  "4445556667",
];

// ─── Mock Data Generators ─────────────────────────────────────────────────────
export function gen(n: number, extra: (i: number) => TableRow = () => ({})): TableRow[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `REF-${1000 + i}`,
    tin: TINS[i % 10],
    taxpayer_name: NAMES[i % 10],
    circle: CIRCLES_DATA[i % 8],
    ay: "2024-25",
    status: ["Pending", "Approved", "Rejected"][i % 3],
    date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
    ...extra(i),
  }));
}

export function mkReportRow(i: number, extra: TableRow = {}): TableRow {
  return {
    circle: CIRCLES_DATA[i % 8],
    t_pending: String(5 + i),
    t_approved: String(20 + i * 2),
    t_rejected: String(2 + (i % 3)),
    t_total: String(27 + i * 3),
    t_revenue: `৳${10 + i * 5}L`,
    u_pending: String(50 + i * 3),
    u_approved: String(200 + i * 10),
    u_rejected: String(15 + i * 2),
    u_total: String(265 + i * 13),
    u_revenue: `৳${100 + i * 20}L`,
    ...extra,
  };
}

// ─── Action Sets ──────────────────────────────────────────────────────────────
export const ROW_VIEW: RowAction[] = [{ id: "view", label: "View Details", labelKey: "actions.viewDetails", icon: Eye }];

export const STD: RowAction[] = [
  { id: "download", label: "Download Record", labelKey: "Download", icon: Download },
  { id: "print", label: "Print Record", labelKey: "Print", icon: Printer },
  { id: "approve", label: "Approve Record", labelKey: "Approve", icon: CheckCircle, color: "#22c55e" },
  { id: "reject", label: "Reject Record", labelKey: "Reject", icon: XCircle, color: "#ef4444" },
];

export const VIEW: RowAction[] = [
  { id: "download", label: "Download Record", labelKey: "Download", icon: Download },
  { id: "print", label: "Print Record", labelKey: "Print", icon: Printer },
];

export const EDIT: RowAction[] = [
  { id: "edit", label: "Edit", labelKey: "Edit", icon: Pencil },
  { id: "download", label: "Download Record", labelKey: "Download", icon: Download },
  { id: "approve", label: "Approve Record", labelKey: "Approve", icon: CheckCircle, color: "#22c55e" },
  { id: "reject", label: "Reject Record", labelKey: "Reject", icon: XCircle, color: "#ef4444" },
];

export const VERIFY: RowAction[] = [
  { id: "verify", label: "Verify Record", labelKey: "actions.verifyRecord", icon: CheckCircle },
  { id: "download", label: "Download Record", labelKey: "Download", icon: Download },
  { id: "print", label: "Print Record", labelKey: "Print", icon: Printer },
];

export const RESOLVE_TRANSFER: RowAction[] = [
  { id: "resolve", label: "Resolve", labelKey: "actions.resolve", icon: CheckCircle },
  { id: "transfer", label: "Transfer", labelKey: "actions.transfer", icon: Send },
  { id: "download", label: "Download Record", labelKey: "Download", icon: Download },
];

export const RESOLVE: RowAction[] = [
  { id: "resolve", label: "Resolve", labelKey: "actions.resolve", icon: RotateCcw },
  { id: "download", label: "Download Record", labelKey: "Download", icon: Download },
];

export const TRANSFER: RowAction[] = [
  { id: "transfer", label: "Transfer", labelKey: "actions.transfer", icon: Send },
  { id: "download", label: "Download Record", labelKey: "Download", icon: Download },
];

export const ASSIGN: RowAction[] = [
  { id: "download", label: "Download Record", labelKey: "Download", icon: Download },
  { id: "print", label: "Print Record", labelKey: "Print", icon: Printer },
  { id: "assign", label: "Assign Officer", labelKey: "Assign Officer", icon: UserCheck },
];

// ─── Filter Definitions ───────────────────────────────────────────────────────
export const REPORT_FILTERS: FilterDef[] = [
  { key: "ay", label: "Assessment Year", labelKey: "labels.assessmentYear", type: "select", options: AY_OPTS },
  { key: "zone", label: "Tax Zone", labelKey: "labels.taxZone", type: "select", options: ZONES },
  { key: "circle", label: "Tax Circle", labelKey: "labels.taxCircle", type: "select", options: CIRCLES },
  { key: "from", label: "From Date", labelKey: "labels.fromDate", type: "date" },
  { key: "to", label: "To Date", labelKey: "labels.toDate", type: "date" },
];

export const REPORT_FILTERS_STATUS: FilterDef[] = [
  ...REPORT_FILTERS,
  { key: "status", label: "Status", labelKey: "labels.status", type: "select", options: ST_OPTS },
];

// ─── Column Helpers ───────────────────────────────────────────────────────────
const fg = (label: string, cols: FlatCol[], groupKey?: string): ColDef => ({ type: "group", group: { label, groupKey, cols } });

const litEntryGroup = (label: string): ColDef => {
  const isToday = label === "Entry Today";
  const p = isToday ? "t" : "u";
  return fg(label, [
    { key: `${p}_pending`, label: "Pending", headerKey: "headers.pending" },
    { key: `${p}_approved`, label: "Approved", headerKey: "headers.approved" },
    { key: `${p}_rejected`, label: "Rejected", headerKey: "headers.rejected" },
    { key: `${p}_total`, label: "Total Entry", headerKey: "headers.totalEntry" },
    { key: `${p}_revenue`, label: "Total Related Revenue", headerKey: "headers.totalRelatedRevenue" },
  ], isToday ? "groups.entryToday" : "groups.entryUpto");
};

const appealGroup = (label: string): ColDef => {
  const isToday = label === "Entry Today";
  const p = isToday ? "t" : "u";
  return fg(label, [
    { key: `${p}_pending`, label: "Pending", headerKey: "headers.pending" },
    { key: `${p}_approved`, label: "Approved", headerKey: "headers.approved" },
    { key: `${p}_rejected`, label: "Rejected", headerKey: "headers.rejected" },
    { key: `${p}_total`, label: "Total Entry", headerKey: "headers.totalEntry" },
  ], isToday ? "groups.entryToday" : "groups.entryUpto");
};

// ─── Mock Report Data ─────────────────────────────────────────────────────────
const LIT_ROWS = CIRCLES_DATA.map((_, i) => mkReportRow(i));

// ─── Report Configurations ────────────────────────────────────────────────────
export interface ReportCfg {
  title: string;
  desc: string;
  cols: ColDef[];
  filters: FilterDef[];
  rows: TableRow[];
}

export const REPORT_CFGS: Record<string, ReportCfg> = {
  "offline-return-report": {
    title: "Offline Return Report",
    desc: "Review offline return entries by circle, type, payment, and submission status.",
    filters: REPORT_FILTERS,
    cols: [
      fc("circle", "Circle", { headerKey: "headers.circle" }),
      fg("Return Entry Today", [
        { key: "t_82bb", label: "82BB", headerKey: "headers.return82bb" },
        { key: "t_82c2", label: "82C(2)", headerKey: "headers.return82c2" },
        { key: "t_212", label: "212", headerKey: "headers.return212" },
        { key: "t_normal", label: "Normal", headerKey: "headers.returnNormal" },
        { key: "t_total", label: "Total Entry", headerKey: "headers.totalEntry" },
        { key: "t_tds", label: "Tax Paid With Return (TDS)", headerKey: "headers.taxPaidWithReturnTds" },
        { key: "t_tax_paid", label: "Total Tax Paid", headerKey: "headers.totalTaxPaid" },
      ], "groups.returnEntryToday"),
      fg("Return Entry Upto", [
        { key: "u_82bb", label: "82BB", headerKey: "headers.return82bb" },
        { key: "u_82c2", label: "82C(2)", headerKey: "headers.return82c2" },
        { key: "u_212", label: "212", headerKey: "headers.return212" },
        { key: "u_normal", label: "Normal", headerKey: "headers.returnNormal" },
        { key: "u_total", label: "Total Entry", headerKey: "headers.totalEntry" },
        { key: "u_tds", label: "Tax Paid With Return (TDS)", headerKey: "headers.taxPaidWithReturnTds" },
        { key: "u_tax_paid", label: "Total Tax Paid", headerKey: "headers.totalTaxPaid" },
      ], "groups.returnEntryUpto"),
    ],
    rows: CIRCLES_DATA.map((_, i) => ({
      circle: CIRCLES_DATA[i],
      t_82bb: String(10 + i),
      t_82c2: String(8 + i),
      t_212: String(5 + i),
      t_normal: String(30 + i * 2),
      t_total: String(53 + i * 4),
      t_tds: `৳${(5 + i) * 10000}`,
      t_tax_paid: `৳${(8 + i) * 10000}`,
      u_82bb: String(100 + i * 5),
      u_82c2: String(80 + i * 4),
      u_212: String(50 + i * 3),
      u_normal: String(300 + i * 20),
      u_total: String(530 + i * 32),
      u_tds: `৳${(50 + i * 5) * 10000}`,
      u_tax_paid: `৳${(80 + i * 8) * 10000}`,
    })),
  },
  "tax-category-report": {
    title: "Tax Category Report",
    desc: "Track return submissions by income category, source, and channel.",
    filters: REPORT_FILTERS,
    cols: [
      fc("category", "Category", { headerKey: "headers.category" }),
      fg("Submissions", [
        { key: "online", label: "Online", headerKey: "headers.online" },
        { key: "offline", label: "Offline", headerKey: "headers.offline" },
        { key: "total", label: "Total", headerKey: "headers.total" },
      ], "groups.submissions"),
    ],
    rows: [
      { category: "82BB (Individual)", online: "12,450", offline: "3,210", total: "15,660" },
      { category: "82C(2) (Company)", online: "4,820", offline: "1,130", total: "5,950" },
      { category: "212 (Partnership)", online: "2,100", offline: "780", total: "2,880" },
      { category: "Normal Return", online: "8,900", offline: "5,400", total: "14,300" },
      { category: "Amended Return", online: "320", offline: "140", total: "460" },
      { category: "Revised Return", online: "210", offline: "90", total: "300" },
      { category: "Total", online: "28,800", offline: "10,750", total: "39,550" },
    ],
  },
  "express-cert-disposal": {
    title: "Express Cert. Disposal",
    desc: "Review express certificate requests, disposal status, and pending items.",
    filters: REPORT_FILTERS,
    cols: [
      fc("tax_circle", "Tax Circle", { headerKey: "headers.taxCircle" }),
      fg("Today", [
        { key: "t_pending", label: "Pending", headerKey: "headers.pending" },
        { key: "t_approved", label: "Approved", headerKey: "headers.approved" },
        { key: "t_rejected", label: "Rejected", headerKey: "headers.rejected" },
        { key: "t_total_req", label: "Total Request", headerKey: "headers.totalRequest" },
        { key: "t_disposed", label: "Total Disposed", headerKey: "headers.totalDisposed" },
      ], "groups.today"),
      fg("Upto", [
        { key: "u_pending", label: "Pending", headerKey: "headers.pending" },
        { key: "u_approved", label: "Approved", headerKey: "headers.approved" },
        { key: "u_rejected", label: "Rejected", headerKey: "headers.rejected" },
        { key: "u_total_req", label: "Total Request", headerKey: "headers.totalRequest" },
        { key: "u_disposed", label: "Total Disposed", headerKey: "headers.totalDisposed" },
      ], "groups.upto"),
    ],
    rows: CIRCLES_DATA.map((c, i) => ({
      tax_circle: c,
      t_pending: String(3 + i),
      t_approved: String(12 + i * 2),
      t_rejected: String(1 + (i % 2)),
      t_total_req: String(16 + i * 3),
      t_disposed: String(13 + i * 2),
      u_pending: String(30 + i * 3),
      u_approved: String(120 + i * 10),
      u_rejected: String(10 + i),
      u_total_req: String(160 + i * 14),
      u_disposed: String(130 + i * 11),
    })),
  },
  "user-activity-report": {
    title: "User Activity Report",
    desc: "Monitor user actions, login activity, and system usage records.",
    filters: [
      { key: "zone",   label: "Zone",          labelKey: "labels.zone",         type: "select", options: ZONES,   optionKeys: { "All Zones": "options.allZones" } },
      { key: "circle", label: "Circle",         labelKey: "labels.circle",       type: "select", options: CIRCLES, optionKeys: { "All Circles": "options.allCircles" } },
      { key: "status", label: "Active Status",  type: "select", options: ["All Status", "Active", "Inactive"] },
      { key: "from",   label: "From Date",      labelKey: "labels.fromDate",     type: "date" },
      { key: "to",     label: "To Date",        labelKey: "labels.toDate",       type: "date" },
    ],
    // ── Table columns (readable, not overloaded) ──────────────────────────
    cols: [
      fc("circle",         "Circle",          { headerKey: "headers.circle",        mobileCard: false }),
      fc("user_id",        "User ID",         { headerKey: "headers.userId",        mobileCard: true }),
      fc("user_name",      "User Name",       { headerKey: "headers.userName",      mobileCard: true }),
      fc("designation",    "Designation",     { headerKey: "headers.designation",   mobileCard: true }),
      fc("email",          "Email",           { headerKey: "headers.email" }),
      fc("last_login",     "Last Login",      { headerKey: "headers.lastLogin",     mobileCard: true }),
      fc("login_location", "Login Location",  { headerKey: "headers.loginLocation", mobileCard: true }),
      { type: "col", col: { key: "active_status", label: "Active Status", badge: true, headerKey: "headers.activeStatus", mobileCard: true } },
      fc("entry_today",    "Entry Today",     { headerKey: "headers.entryToday" }),
      fc("entry_upto",     "Entry Up to",     { headerKey: "headers.entryUpto" }),
    ],
    // ── Drawer columns — 6 grouped sections ─────────────────────────────
    drawerCols: [
      { type: "group", group: { label: "User Identity", groupKey: "groups.userIdentity", cols: [
        { key: "circle",      label: "Circle",      headerKey: "headers.circle" },
        { key: "user_id",     label: "User ID",     headerKey: "headers.userId" },
        { key: "designation", label: "Designation", headerKey: "headers.designation" },
        { key: "user_name",   label: "User Name",   headerKey: "headers.userName" },
        { key: "email",       label: "Email",       headerKey: "headers.email" },
        { key: "phone",       label: "Phone",       headerKey: "headers.phone" },
      ]}},
      { type: "group", group: { label: "Login Details", groupKey: "groups.loginDetails", cols: [
        { key: "last_login",           label: "Last Login",            headerKey: "headers.lastLogin" },
        { key: "login_location",       label: "Login Location",        headerKey: "headers.loginLocation" },
        { key: "login_ip",             label: "Login IP",              headerKey: "headers.loginIp" },
        { key: "device_browser",       label: "Device / Browser",      headerKey: "headers.deviceBrowser" },
        { key: "login_status",         label: "Login Status",          headerKey: "headers.loginStatus" },
        { key: "session_duration",     label: "Session Duration",      headerKey: "headers.sessionDuration" },
        { key: "failed_login_attempts",label: "Failed Login Attempts", headerKey: "headers.failedLoginAttempts" },
      ]}},
      { type: "group", group: { label: "System Activity", groupKey: "groups.systemActivity", cols: [
        { key: "last_activity_time",  label: "Last Activity Time",   headerKey: "headers.lastActivityTime" },
        { key: "total_actions_today", label: "Total Actions Today",  headerKey: "headers.totalActionsToday" },
        { key: "entry_today",         label: "Entry Today",          headerKey: "headers.entryToday" },
        { key: "entry_upto",          label: "Entry Up to",          headerKey: "headers.entryUpto" },
        { key: "records_created",     label: "Records Created",      headerKey: "headers.recordsCreated" },
        { key: "records_updated",     label: "Records Updated",      headerKey: "headers.recordsUpdated" },
        { key: "records_approved",    label: "Records Approved",     headerKey: "headers.recordsApproved" },
        { key: "records_rejected",    label: "Records Rejected",     headerKey: "headers.recordsRejected" },
      ]}},
      { type: "group", group: { label: "Output Activity", groupKey: "groups.outputActivity", cols: [
        { key: "reports_downloaded", label: "Reports Downloaded", headerKey: "headers.reportsDownloaded" },
        { key: "prints_taken",       label: "Prints Taken",       headerKey: "headers.printsTaken" },
      ]}},
      { type: "group", group: { label: "Security Activity", groupKey: "groups.securityActivity", cols: [
        { key: "last_pass_change",      label: "Last Password Change",  headerKey: "headers.lastPassChange" },
        { key: "password_change_count", label: "Password Change Count", headerKey: "headers.passwordChangeCount" },
      ]}},
      { type: "group", group: { label: "Latest Action", groupKey: "groups.latestAction", cols: [
        { key: "last_action",      label: "Last Action",      headerKey: "headers.lastAction" },
        { key: "activity_summary", label: "Activity Summary", headerKey: "headers.activitySummary" },
      ]}},
    ],
    rows: (() => {
      const USER_NAMES = [
        "Md. Rafiqul Islam", "Nasrin Akhter", "A.K.M. Hossain", "Fatema Begum", "Md. Kamal Uddin",
        "Shahnaz Parvin", "Md. Jahangir Alam", "Rubina Khanam", "Md. Anisur Rahman", "Taslima Begum",
        "Md. Shafiqul Islam", "Hosne Ara", "Md. Aminul Haque", "Laila Arjumand", "Md. Rezaul Karim",
        "Morsheda Khatun",
      ];
      const DESIGS = ["Circle Officer", "Inspector", "Superintendent", "Joint Commissioner", "Additional Commissioner"];
      const LOCATIONS = ["Dhaka Main Office", "Circle Office 1", "Remote – VPN", "Circle Office 2", "Home – VPN"];
      const IPS = ["192.168.1.101", "192.168.1.102", "10.0.0.55", "192.168.2.10", "172.16.0.34"];
      const DEVICES = [
        "Chrome 124 / Windows 11", "Firefox 125 / Windows 10",
        "Edge 123 / Windows 11",   "Chrome / Android 14",
        "Safari / iOS 17",
      ];
      const LOGIN_STATUSES = ["Active", "Active", "Active", "Idle", "Logged Out", "Session Expired", "Active"];
      const LAST_ACTIONS = [
        "Approved return for TIN-1234567890",
        "Rejected return – incomplete documents",
        "Viewed payment demand report",
        "Updated taxpayer record (TIN-9876543210)",
        "Downloaded litigation arrear report",
        "Approved express certificate request",
        "Generated Register-5 report",
        "Verified appeal submission",
      ];
      const SUMMARIES = [
        "27 actions today; 15 returns approved, 5 rejected, 7 reports viewed.",
        "12 actions; attended 3 taxpayer cases, downloaded 2 reports.",
        "Idle since 11:30 AM; 8 records updated earlier.",
        "No activity recorded for today's session.",
        "43 actions; bulk approval of 30 returns, 3 reports generated.",
        "Session expired after inactivity; 6 entries made before logout.",
        "19 actions; mixed approvals and rejections with 4 prints taken.",
        "Active session; 5 appeals verified, 2 demands reviewed.",
      ];
      return Array.from({ length: 16 }, (_, i) => {
        const loginH = 8 + (i % 4);
        const loginM = (i * 7) % 60;
        const actH   = loginH + 1 + (i % 3);
        const actM   = (loginM + 25) % 60;
        const durMin = 15 + i * 11;
        const durH   = Math.floor(durMin / 60);
        const durR   = durMin % 60;
        return {
          circle:                CIRCLES_DATA[i % 8],
          user_id:               `USR-${1000 + i}`,
          designation:           DESIGS[i % 5],
          user_name:             USER_NAMES[i],
          email:                 `${USER_NAMES[i].toLowerCase().replace(/[^a-z]/g, "").slice(0, 8)}${i + 1}@taxbd.gov.bd`,
          phone:                 `017${String(10000000 + i * 1111111).slice(0, 8)}`,
          last_login:            `2026-06-${String(14 - (i % 7)).padStart(2, "0")} ${String(loginH).padStart(2, "0")}:${String(loginM).padStart(2, "0")}`,
          last_pass_change:      `2026-0${(i % 5) + 1}-01`,
          active_status:         i % 7 === 6 ? "Inactive" : "Active",
          entry_today:           String(5 + i * 2),
          entry_upto:            String(200 + i * 30),
          login_location:        LOCATIONS[i % 5],
          login_ip:              IPS[i % 5],
          device_browser:        DEVICES[i % 5],
          login_status:          LOGIN_STATUSES[i % 7],
          session_duration:      LOGIN_STATUSES[i % 7] === "Logged Out" ? "—" : `${durH}h ${String(durR).padStart(2, "0")}m`,
          last_activity_time:    `2026-06-${String(14 - (i % 7)).padStart(2, "0")} ${String(actH).padStart(2, "0")}:${String(actM).padStart(2, "0")}`,
          total_actions_today:   String(3 + i * 3),
          records_created:       String(1 + (i % 5)),
          records_updated:       String(i % 4),
          records_approved:      String(2 + (i % 8)),
          records_rejected:      String(i % 3),
          reports_downloaded:    String(i % 4),
          prints_taken:          String(i % 6),
          password_change_count: String(1 + (i % 5)),
          failed_login_attempts: String(i % 4),
          last_action:           LAST_ACTIONS[i % 8],
          activity_summary:      SUMMARIES[i % 8],
        };
      });
    })(),
  },
  "litigation-arrear": {
    title: "Litigation Arrear",
    desc: "Review arrear case entries, approvals, rejections, and related revenue.",
    filters: REPORT_FILTERS_STATUS,
    cols: [fc("circle", "Circle"), litEntryGroup("Entry Today"), litEntryGroup("Entry Upto")],
    rows: LIT_ROWS,
  },
  "litigation-writ-case": {
    title: "Litigation Writ Case",
    desc: "Track writ case records by circle, court, status, and revenue.",
    filters: REPORT_FILTERS_STATUS,
    cols: [fc("circle", "Circle"), litEntryGroup("Entry Today"), litEntryGroup("Entry Upto")],
    rows: LIT_ROWS,
  },
  "litigation-dept-case": {
    title: "Litigation Dept Case",
    desc: "Review department case records and approval status by circle.",
    filters: REPORT_FILTERS_STATUS,
    cols: [fc("circle", "Circle"), litEntryGroup("Entry Today"), litEntryGroup("Entry Upto")],
    rows: LIT_ROWS,
  },
  "litigation-taxpayer-case": {
    title: "Litigation Taxpayer Case",
    desc: "Track taxpayer case records, hearings, status, and related revenue.",
    filters: REPORT_FILTERS_STATUS,
    cols: [fc("circle", "Circle"), litEntryGroup("Entry Today"), litEntryGroup("Entry Upto")],
    rows: LIT_ROWS,
  },
  "appeal-report": {
    title: "Appeal Report",
    desc: "Review appeal records by taxpayer, ground, hearing date, and status.",
    filters: REPORT_FILTERS_STATUS,
    cols: [fc("circle", "Circle"), appealGroup("Entry Today"), appealGroup("Entry Upto")],
    rows: LIT_ROWS,
  },
  "tribunal-report": {
    title: "Tribunal Report",
    desc: "Track tribunal cases by bench, case type, date, and decision status.",
    filters: REPORT_FILTERS_STATUS,
    cols: [fc("circle", "Circle"), appealGroup("Entry Today"), appealGroup("Entry Upto")],
    rows: LIT_ROWS,
  },
  "payment-demand-report": {
    title: "Payment & Demand Report",
    desc: "Review demand notices, taxpayer ledgers, payments, and outstanding amounts.",
    filters: REPORT_FILTERS_STATUS,
    cols: [
      fc("circle", "Circle", { headerKey: "headers.circle" }),
      fc("tin", "TIN", { headerKey: "headers.tin" }),
      fc("taxpayer_name", "Taxpayer Name", { headerKey: "headers.taxpayerName" }),
      fc("ay", "Asst. Year", { headerKey: "headers.assessmentYear" }),
      fg("Demand", [
        { key: "original_demand", label: "Original (BDT)", headerKey: "headers.originalDemand" },
        { key: "penalty", label: "Penalty (BDT)", headerKey: "headers.penalty" },
        { key: "total_demand", label: "Total (BDT)", headerKey: "headers.totalDemand" },
      ], "groups.demand"),
      fg("Payment", [
        { key: "payment_amount", label: "Paid (BDT)", headerKey: "headers.paidAmountBdt" },
        { key: "outstanding", label: "Outstanding (BDT)", headerKey: "headers.outstandingBdt" },
      ], "groups.payment"),
      BADGE("payment_status", "Status"),
    ],
    rows: gen(20, i => ({
      ay: "2024-25",
      original_demand: `৳${(i * 100 + 200) * 1000}`,
      penalty: `৳${(i * 10 + 20) * 1000}`,
      total_demand: `৳${(i * 110 + 220) * 1000}`,
      payment_amount: `৳${(i * 80 + 100) * 1000}`,
      outstanding: `৳${(i * 30 + 120) * 1000}`,
      payment_status: ["Paid", "Unpaid", "Partially Paid"][i % 3],
    })),
  },
  "register-5-report": {
    title: "Register-5 Report",
    desc: "Track Register-5 records, approval status, and related entries.",
    filters: REPORT_FILTERS_STATUS,
    cols: [
      fc("circle", "Circle", { headerKey: "headers.circle" }),
      fc("tin", "TIN", { headerKey: "headers.tin" }),
      fc("taxpayer_name", "Taxpayer Name", { headerKey: "headers.taxpayerName" }),
      fc("case_no", "Case No.", { headerKey: "headers.caseNo" }),
      fc("case_type", "Case Type", { headerKey: "headers.caseType" }),
      fc("amount", "Amount", { headerKey: "headers.amount" }),
      fc("assessment_date", "Assessment Date", { headerKey: "headers.assessmentDate" }),
      BADGE("case_status", "Status"),
    ],
    rows: gen(20, i => ({
      case_no: `R5-${3000 + i}`,
      case_type: ["Assessment", "Penalty", "Appeal"][i % 3],
      amount: `৳${(i * 50 + 100) * 1000}`,
      assessment_date: `2026-0${(i % 9) + 1}-01`,
      case_status: ["Pending", "Approved", "Rejected"][i % 3],
    })),
  },
};

// ─── Drawer Field Definitions ─────────────────────────────────────────────────
export const REPORT_DRAWER_FIELDS: Record<string, { label: string; key: string }[]> = {
  "user-activity-report": [
    { label: "User ID", key: "user_id" },
    { label: "User Name", key: "user_name" },
    { label: "Circle", key: "circle" },
    { label: "Designation", key: "designation" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Last Login", key: "last_login" },
    { label: "Last Password Change", key: "last_pass_change" },
    { label: "Active Status", key: "active_status" },
    { label: "Entry Today", key: "entry_today" },
    { label: "Entry Upto", key: "entry_upto" },
  ],
};
