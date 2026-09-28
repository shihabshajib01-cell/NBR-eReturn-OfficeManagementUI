import { GenPage } from "../../../components/pages/GeneratedTablePage";
import type { PageCfg, KpiDef } from "../../modulePageUtils";
import { ledgerRows, TIN_NAME, fc, BASE_FILTERS } from "../../modulePageUtils";
import { ROW_VIEW, VIEW } from "../../../data/modulePageConfigs";

function parseAmt(v: unknown): number {
  if (typeof v !== "string") return 0;
  return parseFloat(v.replace(/[৳,\s]/g, "")) || 0;
}

function fmt(n: number): string {
  if (n >= 10_000_000) return `৳${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `৳${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `৳${(n / 1_000).toFixed(0)}K`;
  return `৳${n}`;
}

export function TaxpayerLedgerPage() {
  const totalDebit = ledgerRows.reduce((s, r) => s + parseAmt(r.debit), 0);
  const totalCredit = ledgerRows.reduce((s, r) => s + parseAmt(r.credit), 0);

  const kpis: KpiDef[] = [
    { label: "Total Transactions", value: String(ledgerRows.length), tone: "primary" },
    { label: "Total Debit", value: fmt(totalDebit), tone: "error" },
    { label: "Total Credit", value: fmt(totalCredit), tone: "success" },
    {
      label: "Net Balance",
      value: fmt(Math.abs(totalDebit - totalCredit)),
      tone: totalDebit > totalCredit ? "warning" : "neutral",
    },
  ];

  const cfg: PageCfg = {
    title: "Taxpayer Ledger",
    titleKey: "taxpayerLedger.title",
    desc: "Review taxpayer payment history, balances, and outstanding dues.",
    descKey: "taxpayerLedger.desc",
    cols: [...TIN_NAME, fc("transaction_date", "Date", { headerKey: "headers.date" }), fc("particulars", "Particulars", { headerKey: "headers.particulars" }), fc("debit", "Debit", { headerKey: "headers.debit" }), fc("credit", "Credit", { headerKey: "headers.credit" }), fc("balance", "Balance", { headerKey: "headers.balance" }), fc("reference", "Reference", { headerKey: "headers.refNo" })],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["particulars", "reference"], date: "transaction_date", amount: "balance" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: VIEW,
    rows: ledgerRows,
    kpis,
  };
  return <GenPage cfg={cfg} />;
}
