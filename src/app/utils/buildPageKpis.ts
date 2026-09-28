import type { KpiDef, TableRow } from "../pages/modulePageUtils";

type Tone = "primary" | "success" | "warning" | "error" | "neutral";

export interface StatusCard {
  value: string;
  label: string;
  tone: Tone;
}

export interface KpiConfig {
  /** Label for the "Total" card (always first) */
  totalLabel: string;
  totalTone?: Tone;
  /** Row field name that holds the status string */
  statusField?: string;
  /** Status values to count and their display config */
  statuses?: StatusCard[];
  /** Row field containing a ৳-prefixed amount string to sum */
  amountField?: string;
  amountLabel?: string;
  amountTone?: Tone;
}

function parseAmount(val: unknown): number {
  if (typeof val !== "string") return 0;
  return parseFloat(val.replace(/[৳,\s]/g, "")) || 0;
}

function formatAmount(n: number): string {
  if (n >= 10_000_000) return `৳${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `৳${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `৳${(n / 1_000).toFixed(0)}K`;
  return `৳${n}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildPageKpis(rows: TableRow[], config: KpiConfig): KpiDef[] {
  const kpis: KpiDef[] = [];

  kpis.push({
    label: config.totalLabel,
    value: String(rows.length),
    tone: config.totalTone ?? "primary",
  });

  if (config.statusField && config.statuses) {
    for (const s of config.statuses) {
      const count = rows.filter((r) => r[config.statusField!] === s.value).length;
      kpis.push({ label: s.label, value: String(count), tone: s.tone });
    }
  }

  if (config.amountField) {
    const total = rows.reduce((sum, r) => sum + parseAmount(r[config.amountField!]), 0);
    kpis.push({
      label: config.amountLabel ?? "Total Amount",
      value: formatAmount(total),
      tone: config.amountTone ?? "neutral",
    });
  }

  return kpis;
}
