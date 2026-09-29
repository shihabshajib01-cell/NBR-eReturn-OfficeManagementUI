import { Fragment, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  Filter,
  Plus,
  Printer,
  ShieldAlert,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { StatusBadge } from "../../components/badges/StatusBadge";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { FilterPanel } from "../../components/filters/FilterPanel";
import { MobileFilterOverlay } from "../../components/filters/MobileFilterOverlay";
import { AppliedFilterChips } from "../../components/filters/AppliedFilterChips";
import { MobileSearchFilter } from "../../components/shared/MobileSearchFilter";
import { Pagination } from "../../components/shared/Pagination";
import { useUIState } from "../../hooks/useUI";
import { handleExportDisabled } from "../../utils/exportDisabled";
import type { ColDef, FilterDef, TableRow } from "../modulePageUtils";
import { fc } from "../modulePageUtils";
import { ALL_TAXPAYER_ROWS } from "./auditData";
import {
  getAuditCandidates,
  type AuditCandidateRecord,
} from "./auditCandidateStore";
import { AuditExplainerDrawer } from "./AuditExplainerDrawer";
import { resolveAuditExplanation, type AuditExplanation } from "./auditKnowledge";
import { InitiateAuditModal } from "./InitiateAuditPage";

const PER_PAGE = 10;

type ComparisonMetric = {
  key: string;
  labelKey: string;
  values: number[];
  relatedSignals: string[];
};

type ComparisonSection = {
  key: string;
  titleKey: string;
  metrics: ComparisonMetric[];
};

const SIGNAL_LABEL_KEYS: Record<string, string> = {
  "R-A1": "candidates.detail.signalLabels.R-A1",
  "R-A2": "candidates.detail.signalLabels.R-A2",
  "R-A3": "candidates.detail.signalLabels.R-A3",
  "R-B1": "candidates.detail.signalLabels.R-B1",
  "R-B2": "candidates.detail.signalLabels.R-B2",
  "R-C1": "candidates.detail.signalLabels.R-C1",
  "R-C2": "candidates.detail.signalLabels.R-C2",
  "R-C3": "candidates.detail.signalLabels.R-C3",
  "R-C4": "candidates.detail.signalLabels.R-C4",
  "R-D1": "candidates.detail.signalLabels.R-D1",
  "R-D2": "candidates.detail.signalLabels.R-D2",
  "R-D3": "candidates.detail.signalLabels.R-D3",
  "R-E1": "candidates.detail.signalLabels.R-E1",
  "R-E2": "candidates.detail.signalLabels.R-E2",
  "R-E3": "candidates.detail.signalLabels.R-E3",
};

function unique(rows: TableRow[], field: string): string[] {
  return Array.from(
    new Set(rows.map((row) => String(row[field] ?? "")).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));
}

function signalIds(value: unknown): string[] {
  return Array.from(new Set(String(value ?? "").match(/R-[A-E]\d/g) ?? []));
}

function controlFlagIds(value: unknown): string[] {
  return Array.from(new Set(String(value ?? "").match(/F[0-5]/g) ?? []));
}

function getSourceTaxpayer(candidate: AuditCandidateRecord): TableRow | undefined {
  return ALL_TAXPAYER_ROWS.find(
    (row) =>
      String(row.return_id ?? "") === candidate.return_id ||
      String(row.tin ?? "") === candidate.tin,
  );
}

function getCandidateReason(
  candidate: AuditCandidateRecord,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  const basis = candidate.selection_basis.toLowerCase();
  const source = getSourceTaxpayer(candidate);

  if (basis.startsWith("risk-based")) {
    return String(
      source?.reason_code ??
        candidate.selection_basis ??
        t("candidates.detail.reasonFallback"),
    );
  }

  if (basis.startsWith("control")) {
    const flags = controlFlagIds(candidate.control_flags);
    return flags.length
      ? t("candidates.detail.controlReason", { flags: flags.join(", ") })
      : String(source?.reason_code ?? candidate.selection_basis);
  }

  if (basis.startsWith("manual")) {
    return t("candidates.detail.manualReason");
  }

  if (basis.startsWith("population")) {
    return t("candidates.detail.populationReason");
  }

  return String(
    source?.reason_code ??
      candidate.selection_basis ??
      t("candidates.detail.reasonFallback"),
  );
}

function groupBatches(rows: AuditCandidateRecord[]): TableRow[] {
  const batches = new Map<string, AuditCandidateRecord[]>();

  rows.forEach((row) => {
    const list = batches.get(row.batch_id) ?? [];
    list.push(row);
    batches.set(row.batch_id, list);
  });

  return Array.from(batches.entries())
    .map(([batchId, candidates]) => {
      const sample = candidates[0];
      return {
        batch_id: batchId,
        assessment_year: sample.assessment_year,
        selection_track: sample.selection_track,
        candidate_count: candidates.length,
        population_considered: sample.population_considered,
        eligible_after_readiness: sample.eligible_after_readiness,
        matched_criteria: sample.matched_criteria,
        funnel_rule: sample.funnel_rule,
        selected_on: sample.selected_on,
        selection_basis: sample.selection_basis,
      };
    })
    .sort((a, b) => {
      const dateCompare = String(b.selected_on ?? "").localeCompare(
        String(a.selected_on ?? ""),
      );
      if (dateCompare !== 0) return dateCompare;
      return String(b.batch_id ?? "").localeCompare(String(a.batch_id ?? ""));
    });
}

function assessmentYearHistory(year: string): string[] {
  const match = year.match(/^(\d{4})-(\d{2})$/);
  if (!match) return ["2023-24", "2024-25", year];

  const start = Number(match[1]);
  return [start - 2, start - 1, start].map((value) => {
    const next = String((value + 1) % 100).padStart(2, "0");
    return String(value) + "-" + next;
  });
}

function candidateSeed(candidate: AuditCandidateRecord): number {
  const raw =
    candidate.candidate_id +
    candidate.tin +
    candidate.return_id +
    candidate.taxpayer_name;
  return raw.split("").reduce((sum, char, index) => {
    return (sum + char.charCodeAt(0) * (index + 3)) % 9973;
  }, 0);
}

function series(current: number, seed: number, offset = 0): number[] {
  const currentGrowth = 1.07 + ((seed + offset) % 8) / 100;
  const priorGrowth = 1.05 + ((seed + offset * 3) % 7) / 100;
  const middle = Math.round(current / currentGrowth);
  const oldest = Math.round(middle / priorGrowth);
  return [oldest, middle, Math.round(current)];
}

function buildComparison(candidate: AuditCandidateRecord): ComparisonSection[] {
  const seed = candidateSeed(candidate);
  const signals = signalIds(candidate.signals);

  const zeroIncomeCurrent =
    signals.includes("R-A1") || signals.includes("R-D1");

  const employmentCurrent =
    seed % 3 === 0 ? 0 : 360000 + (seed % 16) * 42000;
  const rentalCurrent =
    seed % 4 === 0 ? 0 : 180000 + (seed % 13) * 36000;
  const agricultureCurrent =
    seed % 5 === 0 ? 0 : 240000 + (seed % 11) * 62000;
  const businessCurrent =
    seed % 2 === 0 ? 620000 + (seed % 19) * 74000 : 0;
  const financialCurrent = 22000 + (seed % 17) * 8500;

  const employment = series(employmentCurrent, seed, 1);
  const rental = series(rentalCurrent, seed, 2);
  const agriculture = series(agricultureCurrent, seed, 3);
  const business = series(businessCurrent, seed, 4);
  const financial = series(financialCurrent, seed, 5);

  if (zeroIncomeCurrent) {
    employment[2] = 0;
    rental[2] = 0;
    agriculture[2] = 0;
    business[2] = 0;
    financial[2] = 0;
  }

  if (signals.includes("R-B2")) {
    employment[2] = Math.round(employment[1] * 0.82);
    rental[2] = Math.round(rental[1] * 0.9);
    agriculture[2] = Math.round(agriculture[1] * 0.85);
    business[2] = Math.round(business[1] * 0.78);
    financial[2] = Math.round(financial[1] * 0.92);
  }

  const totalIncome = [0, 1, 2].map(
    (index) =>
      employment[index] +
      rental[index] +
      agriculture[index] +
      business[index] +
      financial[index],
  );

  const grossTax = totalIncome.map((value, index) =>
    Math.round(value * (0.16 + ((seed + index) % 4) / 100)),
  );
  const taxPayable = grossTax.map((value) => Math.round(value * 0.88));
  const tds = taxPayable.map((value) => Math.round(value * 0.22));
  const advanceTax = taxPayable.map((value) => Math.round(value * 0.12));
  const exemptIncome = totalIncome.map((value) => Math.round(value * 0.035));
  const totalTaxPaid = taxPayable.map((value, index) =>
    Math.min(value, tds[index] + advanceTax[index] + Math.round(value * 0.58)),
  );

  if (signals.includes("R-A2")) {
    taxPayable[2] = 0;
    totalTaxPaid[2] = tds[2];
  }

  if (signals.includes("R-A3")) {
    tds[2] = Math.max(tds[2], Math.round(totalIncome[2] * 0.19));
  }

  if (signals.includes("R-D1")) {
    grossTax[2] = 0;
    taxPayable[2] = 0;
    tds[2] = 0;
    advanceTax[2] = 0;
    totalTaxPaid[2] = 0;
  }

  const lifestyle = totalIncome.map((value, index) =>
    Math.round(value * (0.31 + ((seed + index) % 7) / 100)),
  );

  if (signals.includes("R-C4")) {
    lifestyle[2] = Math.round(totalIncome[2] * 0.08);
  }

  const netWealth = series(
    2800000 + (seed % 31) * 145000,
    seed,
    6,
  );
  const liabilities = series(
    280000 + (seed % 13) * 52000,
    seed,
    7,
  );

  if (signals.includes("R-B1") || signals.includes("R-E2")) {
    netWealth[2] = Math.round(netWealth[1] * 1.72);
  }
  if (signals.includes("R-B2")) {
    netWealth[2] = Math.round(netWealth[1] * 1.58);
  }

  const grossWealth = netWealth.map(
    (value, index) => value + liabilities[index],
  );
  const sourceOfFund = totalIncome.map(
    (value, index) => value + exemptIncome[index],
  );
  const fundOutflow = lifestyle.map(
    (value, index) =>
      value + Math.max(0, netWealth[index] - (index > 0 ? netWealth[index - 1] : Math.round(netWealth[index] * 0.9))),
  );
  const difference = sourceOfFund.map(
    (value, index) => value - fundOutflow[index],
  );

  if (signals.includes("R-C1")) {
    difference[2] = -Math.round(Math.max(sourceOfFund[2], 1) * 0.24);
  }
  if (signals.includes("R-C2")) {
    difference[0] = -Math.round(Math.max(sourceOfFund[0], 1) * 0.08);
    difference[1] = -Math.round(Math.max(sourceOfFund[1], 1) * 0.14);
    difference[2] = -Math.round(Math.max(sourceOfFund[2], 1) * 0.2);
  }

  const openingNetWealth = [
    Math.round(netWealth[0] * 0.9),
    netWealth[0],
    netWealth[1],
  ];

  if (signals.includes("R-C3")) {
    openingNetWealth[2] = Math.round(netWealth[1] * 0.66);
  }

  const businessTurnover = business.map((value) =>
    value > 0 ? Math.round(value * (7.2 + (seed % 4) * 0.6)) : 0,
  );
  const businessNetProfit = [...business];

  if (signals.includes("R-E3") && businessTurnover[1] > 0) {
    businessTurnover[2] = Math.round(businessTurnover[1] * 1.85);
  }

  const annualRent = rental.map((value) =>
    value > 0 ? Math.round(value * 2.3) : 0,
  );
  const allowableRentalDeduction = annualRent.map((value) =>
    Math.round(value * 0.32),
  );

  const metrics: ComparisonSection[] = [
    {
      key: "income",
      titleKey: "candidates.detail.sections.income",
      metrics: [
        {
          key: "employmentIncome",
          labelKey: "candidates.detail.metrics.employmentIncome",
          values: employment,
          relatedSignals: ["R-E1", "R-D1", "R-B2"],
        },
        {
          key: "rentalIncome",
          labelKey: "candidates.detail.metrics.rentalIncome",
          values: rental,
          relatedSignals: ["R-B2", "R-D1"],
        },
        {
          key: "agricultureIncome",
          labelKey: "candidates.detail.metrics.agricultureIncome",
          values: agriculture,
          relatedSignals: ["R-B2", "R-D1"],
        },
        {
          key: "businessIncome",
          labelKey: "candidates.detail.metrics.businessIncome",
          values: business,
          relatedSignals: ["R-B2", "R-D1", "R-E3"],
        },
        {
          key: "financialAssetIncome",
          labelKey: "candidates.detail.metrics.financialAssetIncome",
          values: financial,
          relatedSignals: ["R-B2", "R-D1"],
        },
        {
          key: "totalIncome",
          labelKey: "candidates.detail.metrics.totalIncome",
          values: totalIncome,
          relatedSignals: ["R-A1", "R-A2", "R-A3", "R-B2", "R-D1", "R-D2"],
        },
      ],
    },
    {
      key: "tax",
      titleKey: "candidates.detail.sections.tax",
      metrics: [
        {
          key: "grossTax",
          labelKey: "candidates.detail.metrics.grossTax",
          values: grossTax,
          relatedSignals: ["R-A2", "R-D1"],
        },
        {
          key: "taxPayable",
          labelKey: "candidates.detail.metrics.taxPayable",
          values: taxPayable,
          relatedSignals: ["R-A2", "R-D1"],
        },
        {
          key: "tds",
          labelKey: "candidates.detail.metrics.tds",
          values: tds,
          relatedSignals: ["R-A3"],
        },
        {
          key: "advanceTax",
          labelKey: "candidates.detail.metrics.advanceTax",
          values: advanceTax,
          relatedSignals: [],
        },
        {
          key: "totalTaxPaid",
          labelKey: "candidates.detail.metrics.totalTaxPaid",
          values: totalTaxPaid,
          relatedSignals: ["R-A2", "R-D1"],
        },
        {
          key: "exemptIncome",
          labelKey: "candidates.detail.metrics.exemptIncome",
          values: exemptIncome,
          relatedSignals: [],
        },
      ],
    },
    {
      key: "wealth",
      titleKey: "candidates.detail.sections.wealth",
      metrics: [
        {
          key: "sourceOfFund",
          labelKey: "candidates.detail.metrics.sourceOfFund",
          values: sourceOfFund,
          relatedSignals: ["R-C1", "R-C2"],
        },
        {
          key: "openingNetWealth",
          labelKey: "candidates.detail.metrics.openingNetWealth",
          values: openingNetWealth,
          relatedSignals: ["R-C3"],
        },
        {
          key: "netWealth",
          labelKey: "candidates.detail.metrics.netWealth",
          values: netWealth,
          relatedSignals: ["R-A1", "R-B1", "R-B2", "R-E2"],
        },
        {
          key: "grossWealth",
          labelKey: "candidates.detail.metrics.grossWealth",
          values: grossWealth,
          relatedSignals: ["R-B1", "R-B2", "R-E2"],
        },
        {
          key: "liabilities",
          labelKey: "candidates.detail.metrics.liabilities",
          values: liabilities,
          relatedSignals: [],
        },
        {
          key: "lifestyleExpense",
          labelKey: "candidates.detail.metrics.lifestyleExpense",
          values: lifestyle,
          relatedSignals: ["R-C4"],
        },
        {
          key: "fundOutflow",
          labelKey: "candidates.detail.metrics.fundOutflow",
          values: fundOutflow,
          relatedSignals: ["R-C1", "R-C2"],
        },
        {
          key: "difference",
          labelKey: "candidates.detail.metrics.difference",
          values: difference,
          relatedSignals: ["R-C1", "R-C2"],
        },
      ],
    },
    {
      key: "business",
      titleKey: "candidates.detail.sections.business",
      metrics: [
        {
          key: "businessTurnover",
          labelKey: "candidates.detail.metrics.businessTurnover",
          values: businessTurnover,
          relatedSignals: ["R-E3"],
        },
        {
          key: "businessNetProfit",
          labelKey: "candidates.detail.metrics.businessNetProfit",
          values: businessNetProfit,
          relatedSignals: ["R-E3", "R-B2"],
        },
      ],
    },
    {
      key: "property",
      titleKey: "candidates.detail.sections.property",
      metrics: [
        {
          key: "annualRent",
          labelKey: "candidates.detail.metrics.annualRent",
          values: annualRent,
          relatedSignals: [],
        },
        {
          key: "allowableRentalDeduction",
          labelKey: "candidates.detail.metrics.allowableRentalDeduction",
          values: allowableRentalDeduction,
          relatedSignals: [],
        },
        {
          key: "netRentalIncome",
          labelKey: "candidates.detail.metrics.netRentalIncome",
          values: rental,
          relatedSignals: ["R-B2"],
        },
      ],
    },
  ];

  return metrics;
}

function formatMoney(value: number, language: string): string {
  const locale = language?.startsWith("bn") ? "bn-BD" : "en-BD";
  return "৳" + new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

function changePercent(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function formatChange(value: number | null, language: string): string {
  if (value === null || !Number.isFinite(value)) return "—";
  const locale = language?.startsWith("bn") ? "bn-BD" : "en-BD";
  const sign = value > 0 ? "+" : "";
  return (
    sign +
    new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    }).format(value) +
    "%"
  );
}

interface AuditCandidatesPageProps {
  initialInitiateOpen?: boolean;
}

export function AuditCandidatesPage({
  initialInitiateOpen = false,
}: AuditCandidatesPageProps) {
  const { isDesktop } = useUIState();
  const { t, i18n } = useTranslation("audit");
  const { t: tc } = useTranslation("common");

  const [rows, setRows] = useState<AuditCandidateRecord[]>(() =>
    getAuditCandidates(),
  );
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [explanation, setExplanation] = useState<AuditExplanation | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {},
  );
  const [initiateOpen, setInitiateOpen] = useState(initialInitiateOpen);

  const batchRows = useMemo(() => groupBatches(rows), [rows]);

  const selectedBatch = useMemo(
    () =>
      selectedBatchId
        ? batchRows.find(
            (row) => String(row.batch_id ?? "") === selectedBatchId,
          ) ?? null
        : null,
    [batchRows, selectedBatchId],
  );

  const batchCandidates = useMemo(
    () =>
      selectedBatchId
        ? rows.filter((row) => row.batch_id === selectedBatchId)
        : [],
    [rows, selectedBatchId],
  );

  const childRows = useMemo<TableRow[]>(
    () =>
      batchCandidates.map((candidate) => ({
        ...candidate,
        primary_reason: getCandidateReason(candidate, t),
      })),
    [batchCandidates, t, i18n.resolvedLanguage],
  );

  const selectedCandidate = useMemo(
    () =>
      selectedCandidateId
        ? batchCandidates.find(
            (candidate) => candidate.candidate_id === selectedCandidateId,
          ) ?? null
        : null,
    [batchCandidates, selectedCandidateId],
  );

  const sourceTaxpayer = useMemo(
    () => (selectedCandidate ? getSourceTaxpayer(selectedCandidate) : undefined),
    [selectedCandidate],
  );

  const comparison = useMemo(
    () => (selectedCandidate ? buildComparison(selectedCandidate) : []),
    [selectedCandidate],
  );

  const years = useMemo(
    () =>
      selectedCandidate
        ? assessmentYearHistory(selectedCandidate.assessment_year)
        : [],
    [selectedCandidate],
  );

  const currentSignals = useMemo(
    () => (selectedCandidate ? signalIds(selectedCandidate.signals) : []),
    [selectedCandidate],
  );

  const currentControlFlags = useMemo(
    () =>
      selectedCandidate ? controlFlagIds(selectedCandidate.control_flags) : [],
    [selectedCandidate],
  );

  const batchCols: ColDef[] = [
    fc("batch_id", t("candidates.columns.batchId"), { mono: true }),
    fc("assessment_year", t("columns.assessmentYear")),
    fc("selection_track", t("candidates.columns.selectionTrack"), {
      truncate: "normal",
    }),
    fc("candidate_count", t("candidates.columns.candidateCount"), {
      mono: true,
    }),
    fc("population_considered", t("candidates.columns.populationConsidered"), {
      mono: true,
    }),
    fc("funnel_rule", t("candidates.columns.funnelRule"), {
      truncate: "normal",
    }),
    fc("selected_on", t("candidates.columns.selectedOn")),
  ];

  const candidateCols: ColDef[] = [
    fc("taxpayer_name", t("columns.taxpayer")),
    fc("tin", t("columns.tin"), { mono: true }),
    fc("circle", t("columns.circle")),
    fc("risk_level", t("columns.riskLevel")),
    fc("primary_reason", t("candidates.columns.primaryReason"), {
      truncate: "long",
    }),
    fc("signals", t("columns.signals"), { truncate: "normal" }),
    {
      type: "col",
      col: {
        key: "audit_status",
        label: t("candidates.columns.auditStatus"),
        badge: true,
      },
    },
  ];

  const batchFilters: FilterDef[] = [
    {
      key: "assessment_year",
      label: t("columns.assessmentYear"),
      type: "select",
      options: ["", ...unique(batchRows, "assessment_year")],
    },
    {
      key: "selection_track",
      label: t("candidates.filters.selectionTrack"),
      type: "select",
      options: ["", ...unique(batchRows, "selection_track")],
    },
  ];

  const candidateFilters: FilterDef[] = [
    {
      key: "circle",
      label: t("filters.circle"),
      type: "select",
      options: ["", ...unique(childRows, "circle")],
    },
    {
      key: "risk_level",
      label: t("filters.riskLevel"),
      type: "select",
      options: ["", ...unique(childRows, "risk_level")],
    },
    {
      key: "audit_status",
      label: t("candidates.columns.auditStatus"),
      type: "select",
      options: ["", ...unique(childRows, "audit_status")],
    },
  ];

  const tableRows = selectedBatchId ? childRows : batchRows;
  const activeFilters = selectedBatchId ? candidateFilters : batchFilters;
  const activeCols = selectedBatchId ? candidateCols : batchCols;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    return tableRows.filter((row) => {
      const searchOk =
        !needle ||
        Object.values(row).some((value) =>
          String(value ?? "").toLowerCase().includes(needle),
        );
      const filterOk = activeFilters.every((filter) => {
        const selected = appliedFilters[filter.key];
        return !selected || String(row[filter.key] ?? "") === selected;
      });
      return searchOk && filterOk;
    });
  }, [tableRows, activeFilters, appliedFilters, q]);

  const safePage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / PER_PAGE)),
  );
  const pageRows = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE,
  );
  const hasActiveFilters = Object.values(appliedFilters).some(Boolean);

  const resetTableState = () => {
    setQ("");
    setPage(1);
    setShowFilter(false);
    setFilterValues({});
    setAppliedFilters({});
  };

  const applyFilters = () => {
    setAppliedFilters(
      Object.fromEntries(
        Object.entries(filterValues).filter(([, value]) => value),
      ),
    );
    setShowFilter(false);
    setPage(1);
  };

  const resetFilters = () => {
    setFilterValues({});
    setAppliedFilters({});
    setPage(1);
  };

  const openBatch = (row: TableRow) => {
    setSelectedBatchId(String(row.batch_id ?? ""));
    setSelectedCandidateId(null);
    resetTableState();
  };

  const openCandidate = (row: TableRow) => {
    setSelectedCandidateId(String(row.candidate_id ?? ""));
  };

  const backToBatches = () => {
    setSelectedBatchId(null);
    setSelectedCandidateId(null);
    resetTableState();
  };

  const backToCandidates = () => {
    setSelectedCandidateId(null);
  };

  const explain = (key: string, value: string, row: TableRow) => {
    const lookupKey = key === "audit_status" ? "audit_state" : key;
    const resolved = resolveAuditExplanation(
      lookupKey,
      value,
      row,
      i18n.resolvedLanguage,
    );
    if (resolved) setExplanation(resolved);
  };

  if (selectedCandidate && selectedBatch) {
    const selectionReason = getCandidateReason(selectedCandidate, t);
    const candidateDetailItems = [
      {
        label: t("candidates.detail.labels.returnId"),
        value: selectedCandidate.return_id,
      },
      {
        label: t("candidates.detail.labels.dataQuality"),
        value: String(sourceTaxpayer?.data_quality ?? selectedCandidate.data_quality),
      },
      {
        label: t("candidates.detail.labels.coverageTier"),
        value: selectedCandidate.coverage_tier,
      },
      {
        label: t("candidates.detail.labels.selectionTrack"),
        value: selectedCandidate.selection_track,
      },
    ];

    return (
      <div className="table-page">
        <div className="audit-hierarchy-path">
          <button
            type="button"
            className="audit-hierarchy-back"
            onClick={backToCandidates}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            <p>{t("candidates.detail.backToCandidates")}</p>
          </button>
          <div className="audit-hierarchy-path__trail" aria-label={t("candidates.detail.pathLabel")}>
            <p>{t("candidates.title")}</p>
            <ChevronRight size={14} aria-hidden="true" />
            <p>{selectedBatch.batch_id}</p>
            <ChevronRight size={14} aria-hidden="true" />
            <p>{selectedCandidate.taxpayer_name}</p>
          </div>
        </div>

        <div className="audit-candidate-detail__header">
          <div>
            <p className="audit-candidate-detail__eyebrow">
              {t("candidates.detail.title")}
            </p>
            <h1 className="table-page__title">
              {selectedCandidate.taxpayer_name}
            </h1>
            <p className="table-page__desc">
              {selectedCandidate.tin} · {selectedCandidate.circle} ·{" "}
              {selectedCandidate.assessment_year}
            </p>
          </div>
          <div className="audit-candidate-detail__statuses">
            <div className="audit-candidate-detail__risk">
              <p>{t("columns.riskLevel")}</p>
              <strong>{selectedCandidate.risk_level}</strong>
            </div>
            <StatusBadge value={selectedCandidate.audit_status} />
          </div>
        </div>

        <section className="audit-detail-card" aria-labelledby="candidate-summary-title">
          <div className="audit-detail-card__header">
            <h2 id="candidate-summary-title">
              {t("candidates.detail.taxpayerSummary")}
            </h2>
          </div>
          <div className="audit-detail-grid">
            {candidateDetailItems.map((item) => (
              <div className="audit-detail-field" key={item.label}>
                <p className="audit-detail-field__label">{item.label}</p>
                <p className="audit-detail-field__value">{item.value || "—"}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="audit-detail-card audit-selection-evidence"
          aria-labelledby="selection-reason-title"
        >
          <div className="audit-detail-card__header">
            <div>
              <h2 id="selection-reason-title">
                {t("candidates.detail.selectionReason")}
              </h2>
              <p>{t("candidates.detail.selectionReasonHelp")}</p>
            </div>
            <ShieldAlert size={20} aria-hidden="true" />
          </div>

          <div className="audit-selection-reason">
            <p>{selectionReason}</p>
          </div>

          <div className="audit-detail-grid audit-detail-grid--evidence">
            <div className="audit-detail-field">
              <p className="audit-detail-field__label">
                {t("candidates.detail.batchCriteria")}
              </p>
              <p className="audit-detail-field__value">
                {selectedCandidate.selection_basis}
              </p>
            </div>
            <div className="audit-detail-field">
              <p className="audit-detail-field__label">
                {t("candidates.detail.funnelRule")}
              </p>
              <p className="audit-detail-field__value">
                {selectedCandidate.funnel_rule}
              </p>
            </div>
          </div>

          {(currentSignals.length > 0 || currentControlFlags.length > 0) && (
            <div className="audit-evidence-groups">
              {currentSignals.length > 0 && (
                <div className="audit-evidence-group">
                  <p className="audit-detail-field__label">
                    {t("candidates.detail.triggeredSignals")}
                  </p>
                  <div className="audit-evidence-chips">
                    {currentSignals.map((signal) => (
                      <div className="audit-evidence-chip" key={signal}>
                        <p>
                          <strong>{signal}</strong>{" "}
                          {t(SIGNAL_LABEL_KEYS[signal] ?? signal)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentControlFlags.length > 0 && (
                <div className="audit-evidence-group">
                  <p className="audit-detail-field__label">
                    {t("candidates.detail.controlFlags")}
                  </p>
                  <div className="audit-evidence-chips">
                    {currentControlFlags.map((flag) => (
                      <div className="audit-evidence-chip" key={flag}>
                        <p>{flag}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section
          className="audit-detail-card audit-comparison-card"
          aria-labelledby="return-comparison-title"
        >
          <div className="audit-detail-card__header">
            <div>
              <h2 id="return-comparison-title">
                {t("candidates.detail.comparisonTitle")}
              </h2>
              <p>{t("candidates.detail.comparisonDescription")}</p>
            </div>
          </div>

          <div className="audit-comparison-table-wrap">
            <table className="audit-comparison-table">
              <thead>
                <tr>
                  <th scope="col">
                    <p>{t("candidates.detail.returnItem")}</p>
                  </th>
                  {years.map((year) => (
                    <th scope="col" key={year}>
                      <p>{year}</p>
                    </th>
                  ))}
                  <th scope="col">
                    <p>{t("candidates.detail.change1y")}</p>
                  </th>
                  <th scope="col">
                    <p>{t("candidates.detail.change3y")}</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((section) => (
                  <Fragment key={section.key}>
                    <tr className="audit-comparison-table__section-row">
                      <th colSpan={6} scope="rowgroup">
                        <h3>{t(section.titleKey)}</h3>
                      </th>
                    </tr>
                    {section.metrics.map((metric) => {
                      const related = currentSignals.some((signal) =>
                        metric.relatedSignals.includes(signal),
                      );
                      const oneYear = changePercent(
                        metric.values[2],
                        metric.values[1],
                      );
                      const threeYear = changePercent(
                        metric.values[2],
                        metric.values[0],
                      );

                      return (
                        <tr
                          className={
                            related
                              ? "audit-comparison-table__metric-row audit-comparison-table__metric-row--related"
                              : "audit-comparison-table__metric-row"
                          }
                          key={metric.key}
                        >
                          <th scope="row">
                            <p>{t(metric.labelKey)}</p>
                            {related && (
                              <p className="audit-comparison-table__signal-note">
                                {t("candidates.detail.relatedToSelection")}
                              </p>
                            )}
                          </th>
                          {metric.values.map((value, index) => (
                            <td key={years[index]}>
                              <p>{formatMoney(value, i18n.resolvedLanguage ?? "en")}</p>
                            </td>
                          ))}
                          <td>
                            <p>
                              {formatChange(
                                oneYear,
                                i18n.resolvedLanguage ?? "en",
                              )}
                            </p>
                          </td>
                          <td>
                            <p>
                              {formatChange(
                                threeYear,
                                i18n.resolvedLanguage ?? "en",
                              )}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  const tableTitle = selectedBatchId
    ? t("candidates.selectedTableTitle")
    : t("candidates.batchTableTitle");

  const tableDescription = selectedBatchId
    ? t("candidates.selectedTableDescription", {
        batchId: selectedBatch?.batch_id ?? "",
        count: batchCandidates.length,
      })
    : t("candidates.description");

  return (
    <div className="table-page">
      {selectedBatchId && selectedBatch && (
        <div className="audit-hierarchy-path">
          <button
            type="button"
            className="audit-hierarchy-back"
            onClick={backToBatches}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            <p>{t("candidates.backToBatches")}</p>
          </button>
          <div className="audit-hierarchy-path__trail">
            <p>{t("candidates.title")}</p>
            <ChevronRight size={14} aria-hidden="true" />
            <p>{selectedBatch.batch_id}</p>
          </div>
        </div>
      )}

      <div className="table-page__header">
        <div>
          <h1 className="table-page__title">
            {selectedBatchId
              ? t("candidates.selectedTitle")
              : t("candidates.title")}
          </h1>
          <p className="table-page__desc">{tableDescription}</p>
        </div>

        {!selectedBatchId && (
          <div className="table-page__actions">
            <button
              type="button"
              className="action-btn action-btn--primary"
              onClick={() => setInitiateOpen(true)}
            >
              <Plus size={11} strokeWidth={3} aria-hidden="true" />
              {t("candidates.initiateAction")}
            </button>
          </div>
        )}
      </div>

      {selectedBatchId && selectedBatch && (
        <section
          className="audit-batch-context"
          aria-label={t("candidates.batchContext")}
        >
          <div className="audit-batch-context__item">
            <p>{t("candidates.columns.batchId")}</p>
            <strong>{selectedBatch.batch_id}</strong>
          </div>
          <div className="audit-batch-context__item">
            <p>{t("candidates.columns.selectionTrack")}</p>
            <strong>{selectedBatch.selection_track}</strong>
          </div>
          <div className="audit-batch-context__item">
            <p>{t("candidates.columns.candidateCount")}</p>
            <strong>{selectedBatch.candidate_count}</strong>
          </div>
          <div className="audit-batch-context__item audit-batch-context__item--wide">
            <p>{t("candidates.columns.funnelRule")}</p>
            <strong>{selectedBatch.funnel_rule}</strong>
          </div>
        </section>
      )}

      <MobileSearchFilter
        searchValue={q}
        onSearchChange={(value) => {
          setQ(value);
          setPage(1);
        }}
        onFilterClick={() => setShowFilter((open) => !open)}
        placeholder={tc("common.searchPlaceholder")}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="table-card">
        <div className="table-card__toolbar">
          <div className="table-card__title-group">
            <h2 className="table-card__title">{tableTitle}</h2>
            <span className="table-card__count">
              {filtered.length} {tc("common.records")}
            </span>
          </div>

          <div className="table-card__search-wrapper">
            <AppSearchField
              value={q}
              onChange={(value) => {
                setQ(value);
                setPage(1);
              }}
              label={tc("common.searchPlaceholder")}
              placeholder={tc("common.searchPlaceholder")}
              size="compact"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilter((open) => !open)}
            className={
              showFilter
                ? "table-card__toolbar-btn table-card__toolbar-btn--active"
                : "table-card__toolbar-btn"
            }
          >
            <Filter size={13} aria-hidden="true" /> {tc("actions.filter")}
          </button>
          <button
            type="button"
            className="table-card__toolbar-btn table-card__toolbar-btn--download"
            onClick={() => handleExportDisabled(tc("actions.exportDisabled"))}
          >
            <Download size={13} aria-hidden="true" /> {tc("actions.export")}
          </button>
          <button
            type="button"
            className="table-card__toolbar-btn table-card__toolbar-btn--print"
            onClick={() => window.print()}
          >
            <Printer size={13} aria-hidden="true" /> {tc("actions.print")}
          </button>
        </div>

        {isDesktop && showFilter && (
          <div className="table-card__filter-panel">
            <FilterPanel
              filters={activeFilters}
              values={filterValues}
              onChange={(key, value) =>
                setFilterValues((prev) => ({ ...prev, [key]: value }))
              }
              onApply={applyFilters}
              onReset={resetFilters}
            />
          </div>
        )}

        <AppliedFilterChips
          values={appliedFilters}
          onClear={resetFilters}
          inCard
        />

        <ResponsiveTable
          cols={activeCols}
          rows={pageRows}
          onRowClick={selectedBatchId ? openCandidate : openBatch}
          noCard
          clickableKeys={selectedBatchId ? ["circle", "risk_level", "audit_status"] : []}
          onCellClick={explain}
          mobileCardMapping={
            selectedBatchId
              ? {
                  primary: "taxpayer_name",
                  identifier: "tin",
                  meta: ["circle", "risk_level", "signals"],
                  status: "audit_status",
                }
              : {
                  primary: "batch_id",
                  identifier: "assessment_year",
                  meta: ["selection_track", "candidate_count", "funnel_rule"],
                  date: "selected_on",
                }
          }
          aria-label={tableTitle}
        />

        <div className="table-card__pagination">
          <Pagination
            total={filtered.length}
            page={safePage}
            perPage={PER_PAGE}
            onPage={setPage}
          />
        </div>
      </div>

      <AuditExplainerDrawer
        explanation={explanation}
        onClose={() => setExplanation(null)}
      />

      <InitiateAuditModal
        open={initiateOpen}
        onClose={() => setInitiateOpen(false)}
        onConfirmed={() => {
          setRows(getAuditCandidates());
          setSelectedBatchId(null);
          setSelectedCandidateId(null);
          resetTableState();
        }}
      />

      {!isDesktop && (
        <MobileFilterOverlay
          isOpen={showFilter}
          filters={activeFilters}
          values={filterValues}
          onChange={(key, value) =>
            setFilterValues((prev) => ({ ...prev, [key]: value }))
          }
          onApply={applyFilters}
          onReset={resetFilters}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}
