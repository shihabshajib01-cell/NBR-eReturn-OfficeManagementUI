import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BookOpen, ChevronDown, Filter, Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import { DynamicDetailsDrawer } from "../../components/drawers/DynamicDetailsDrawer";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { FilterPanel } from "../../components/filters/FilterPanel";
import { MobileFilterOverlay } from "../../components/filters/MobileFilterOverlay";
import { AppliedFilterChips } from "../../components/filters/AppliedFilterChips";
import { MobileSearchFilter } from "../../components/shared/MobileSearchFilter";
import { useUIState } from "../../hooks/useUI";
import type { ColDef, FilterDef, TableRow } from "../modulePageUtils";
import { fc } from "../modulePageUtils";
import { AUDIT_MANUAL_CORE_SECTIONS } from "./auditManualCoreData";
import { AUDIT_MANUAL_RULE_SECTIONS, AUDIT_MANUAL_SUPPLEMENT_BLOCKS } from "./auditManualRulesData";
import { AUDIT_MANUAL_TEST_SECTIONS, AUDIT_MANUAL_TEST_SUPPLEMENT_BLOCKS } from "./auditManualTestData";
import { AUDIT_MANUAL_DEMO_SECTIONS, AUDIT_MANUAL_DEMO_SUPPLEMENTS } from "./auditManualDemoData";
import {
  manualText,
  mt,
  type ManualArea,
  type ManualBlock,
  type ManualSection,
  type ManualText,
} from "./auditManualTypes";

const AREA_LABELS: Record<ManualArea, ManualText> = {
  overview: mt("Overview", "ওভারভিউ"),
  data: mt("Data & coverage", "ডেটা ও কভারেজ"),
  analysis: mt("Analytical lenses", "বিশ্লেষণী লেন্স"),
  screening: mt("Risk screening", "রিস্ক স্ক্রিনিং"),
  controls: mt("Controls & reconciliation", "কন্ট্রোল ও রিকনসিলিয়েশন"),
  workflow: mt("Verification & workflow", "ভেরিফিকেশন ও ওয়ার্কফ্লো"),
  governance: mt("Governance & architecture", "গভর্ন্যান্স ও আর্কিটেকচার"),
  testing: mt("Tests & assurance", "টেস্ট ও অ্যাস্যুরেন্স"),
  demo: mt("Illustrative data", "নমুনা ডেটা"),
};

const SOURCE_LABELS: Record<string, ManualText> = {
  "Source metadata": mt("Source metadata", "সোর্স মেটাডেটা"),
  "Dashboard / Operate": mt("Dashboard / Operate", "ড্যাশবোর্ড / অপারেট"),
  Analyze: mt("Analyze", "বিশ্লেষণ"),
  Reference: mt("Reference", "রেফারেন্স"),
  Management: mt("Management", "ম্যানেজমেন্ট"),
  "Illustrative data": mt("Illustrative data", "নমুনা ডেটা"),
};

const COPY = {
  title: mt("Audit Manual", "অডিট ম্যানুয়াল"),
  description: mt(
    "Complete searchable reference for the Audit framework. It preserves the source logic, tables, formulas, examples, tests, unresolved dependencies and demo data while presenting them in the existing NBR Audit design system.",
    "Audit framework-এর সম্পূর্ণ searchable reference। Source-এর logic, table, formula, example, test, unresolved dependency ও demo data অক্ষত রেখে বিদ্যমান NBR Audit design system-এ সহজভাবে সাজানো হয়েছে।"
  ),
  libraryTitle: mt("Audit framework library", "অডিট ফ্রেমওয়ার্ক লাইব্রেরি"),
  sections: mt("sections", "section"),
  search: mt("Search the Audit Manual", "অডিট ম্যানুয়াল খুঁজুন"),
  searchPlaceholder: mt("Search rule, signal, formula, section, test case, dependency…", "Rule, signal, formula, section, test case, dependency খুঁজুন…"),
  area: mt("Content area", "কনটেন্ট এরিয়া"),
  sourceView: mt("Source view", "সোর্স ভিউ"),
  allAreas: mt("All content areas", "সব কনটেন্ট এরিয়া"),
  allViews: mt("All source views", "সব সোর্স ভিউ"),
  expandAll: mt("Expand all", "সব খুলুন"),
  collapseAll: mt("Collapse all", "সব বন্ধ করুন"),
  print: mt("Print", "প্রিন্ট"),
  noResults: mt("No matching framework section found.", "Matching framework section পাওয়া যায়নি।"),
  noResultsHelp: mt("Try a broader search or clear the active filters.", "Search আরও broad করুন অথবা active filter clear করুন।"),
  rowDetails: mt("Reference row details", "Reference row details"),
  sourceLabel: mt("Source location", "Source location"),
  callout: mt("Important", "গুরুত্বপূর্ণ"),
  formula: mt("Formula / logic", "Formula / logic"),
  list: mt("Reference points", "Reference point"),
  matrixLegend: mt("Legend", "Legend"),
  sideNote: mt("Side path / note", "Side path / note"),
};

const SECTION_ORDER = [
  "source-metadata", "dashboard-operate",
  "s01", "s02", "s03", "s04", "s05", "s06", "s07", "s08", "s09",
  "s10", "s11", "s12", "s13", "s14", "s15", "s16", "s17", "s18", "s19",
  "demo-data",
];

function buildSections(): ManualSection[] {
  const byId = new Map<string, ManualSection>();
  [
    ...AUDIT_MANUAL_CORE_SECTIONS,
    ...AUDIT_MANUAL_RULE_SECTIONS,
    ...AUDIT_MANUAL_TEST_SECTIONS,
    ...AUDIT_MANUAL_DEMO_SECTIONS,
  ].forEach((section) => {
    byId.set(section.id, { ...section, blocks: [...section.blocks] });
  });

  const supplements = { ...AUDIT_MANUAL_SUPPLEMENT_BLOCKS, ...AUDIT_MANUAL_TEST_SUPPLEMENT_BLOCKS, ...AUDIT_MANUAL_DEMO_SUPPLEMENTS };
  Object.entries(supplements).forEach(([id, blocks]) => {
    const section = byId.get(id);
    if (section) section.blocks.push(...blocks);
  });

  return SECTION_ORDER.map((id) => byId.get(id)).filter(Boolean) as ManualSection[];
}

const ALL_SECTIONS = buildSections();

function allText(value: ManualText): string {
  return `${value.en} ${value.bn}`;
}

function blockSearchText(block: ManualBlock): string {
  if (block.kind === "text" || block.kind === "callout") {
    return [block.title ? allText(block.title) : "", allText(block.text)].join(" ");
  }
  if (block.kind === "list") {
    return [block.title ? allText(block.title) : "", ...block.items.map(allText)].join(" ");
  }
  if (block.kind === "formula") {
    return [
      block.title ? allText(block.title) : "",
      ...block.lines.map(allText),
      block.note ? allText(block.note) : "",
    ].join(" ");
  }
  if (block.kind === "table") {
    return [
      block.title ? allText(block.title) : "",
      ...block.columns.map(allText),
      ...block.rows.flat().map(allText),
      block.note ? allText(block.note) : "",
    ].join(" ");
  }
  if (block.kind === "matrix") {
    return [
      allText(block.title),
      ...block.modeLabels.map(allText),
      ...block.rowLabels,
      ...block.columnLabels,
      ...block.values.flat(2),
      ...Object.values(block.legend).map(allText),
      block.note ? allText(block.note) : "",
    ].join(" ");
  }
  return [
    block.title ? allText(block.title) : "",
    ...block.steps.flatMap((step) => [allText(step.label), step.note ? allText(step.note) : ""]),
    block.sideNote ? allText(block.sideNote) : "",
  ].join(" ");
}

function sectionSearchText(section: ManualSection): string {
  return [
    section.number,
    allText(section.title),
    section.description ? allText(section.description) : "",
    allText(AREA_LABELS[section.area]),
    section.sourceOrder ?? "",
    ...section.keywords,
    ...section.blocks.map(blockSearchText),
  ].join(" ").toLowerCase();
}

function ManualDataTable({
  title,
  columns,
  rows,
  language,
}: {
  title: string;
  columns: ManualText[];
  rows: ManualText[][];
  language?: string;
}) {
  const [selected, setSelected] = useState<TableRow | null>(null);

  const cols: ColDef[] = columns.map((column, index) =>
    fc(index === 0 ? "name" : `field_${index}`, manualText(column, language), { truncate: "none" })
  );

  const tableRows: TableRow[] = rows.map((row, rowIndex) => {
    const output: TableRow = { __row: String(rowIndex + 1) };
    row.forEach((cell, index) => {
      output[index === 0 ? "name" : `field_${index}`] = manualText(cell, language);
    });
    return output;
  });

  const drawerCols = columns.map((column, index) => ({
    key: index === 0 ? "name" : `field_${index}`,
    label: manualText(column, language),
  }));

  const meta = columns.slice(1, 6).map((_, index) => `field_${index + 1}`);

  return (
    <>
      <ResponsiveTable
        cols={cols}
        rows={tableRows}
        noCard
        onRowClick={setSelected}
        mobileCardMapping={{ primary: "name", meta }}
        aria-label={title}
      />
      <DynamicDetailsDrawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={title || manualText(COPY.rowDetails, language)}
        columns={drawerCols}
        rowData={selected}
        showActions={false}
      />
    </>
  );
}

function BlockHeading({ children }: { children: ReactNode }) {
  return (
    <div className="form-subsection__heading">
      <h4 className="form-subsection__title">{children}</h4>
    </div>
  );
}

function ManualBlockView({ block, language }: { block: ManualBlock; language?: string }) {
  if (block.kind === "text") {
    return (
      <div className="form-subsection">
        {block.title && <BlockHeading>{manualText(block.title, language)}</BlockHeading>}
        <p className="form-subsection__description">{manualText(block.text, language)}</p>
      </div>
    );
  }

  if (block.kind === "callout") {
    return (
      <div className="form-subsection form-subsection--boxed">
        <BlockHeading>{block.title ? manualText(block.title, language) : manualText(COPY.callout, language)}</BlockHeading>
        <p className="form-subsection__description">{manualText(block.text, language)}</p>
      </div>
    );
  }

  if (block.kind === "list") {
    return (
      <div className="form-subsection">
        <BlockHeading>{block.title ? manualText(block.title, language) : manualText(COPY.list, language)}</BlockHeading>
        <div className="form-summary-list">
          {block.items.map((item, index) => (
            <div className="form-summary-list__row" key={index}>
              <p className="form-summary-list__label">{String(index + 1).padStart(2, "0")}</p>
              <p className="form-summary-list__value">{manualText(item, language)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.kind === "formula") {
    return (
      <div className="form-subsection">
        <BlockHeading>{block.title ? manualText(block.title, language) : manualText(COPY.formula, language)}</BlockHeading>
        <div className="form-summary-list">
          {block.lines.map((line, index) => (
            <div className="form-summary-list__row" key={index}>
              <p className="form-summary-list__label">{String(index + 1).padStart(2, "0")}</p>
              <p className="form-summary-list__value">{manualText(line, language)}</p>
            </div>
          ))}
        </div>
        {block.note && <p className="form-subsection__description">{manualText(block.note, language)}</p>}
      </div>
    );
  }

  if (block.kind === "table") {
    const title = block.title ? manualText(block.title, language) : manualText(COPY.rowDetails, language);
    return (
      <div className="form-subsection">
        {block.title && <BlockHeading>{title}</BlockHeading>}
        <ManualDataTable title={title} columns={block.columns} rows={block.rows} language={language} />
        {block.note && <p className="form-subsection__description">{manualText(block.note, language)}</p>}
      </div>
    );
  }

  if (block.kind === "matrix") {
    return (
      <div className="form-subsection">
        <BlockHeading>{manualText(block.title, language)}</BlockHeading>
        {block.modeLabels.map((mode, modeIndex) => {
          const columns = [mt("", ""), ...block.columnLabels.map((label) => sameText(label))];
          const rows = block.rowLabels.map((rowLabel, rowIndex) => [
            sameText(rowLabel),
            ...block.values[modeIndex][rowIndex].map((value) => sameText(value)),
          ]);
          return (
            <div className="form-subsection" key={modeIndex}>
              <p className="form-subsection__description">{manualText(mode, language)}</p>
              <ManualDataTable
                title={manualText(mode, language)}
                columns={columns}
                rows={rows}
                language={language}
              />
            </div>
          );
        })}
        <div className="form-summary-list form-summary-list--compact">
          {Object.entries(block.legend).map(([code, label]) => (
            <div className="form-summary-list__row" key={code}>
              <p className="form-summary-list__label">{code}</p>
              <p className="form-summary-list__value">{manualText(label, language)}</p>
            </div>
          ))}
        </div>
        {block.note && <p className="form-subsection__description">{manualText(block.note, language)}</p>}
      </div>
    );
  }

  return (
    <div className="form-subsection">
      {block.title && <BlockHeading>{manualText(block.title, language)}</BlockHeading>}
      <div className="form-summary-list">
        {block.steps.map((step, index) => (
          <div className="form-summary-list__row" key={index}>
            <p className="form-summary-list__label">{String(index + 1).padStart(2, "0")}</p>
            <p className="form-summary-list__value">
              {manualText(step.label, language)}
              {step.note ? ` — ${manualText(step.note, language)}` : ""}
            </p>
          </div>
        ))}
      </div>
      {block.sideNote && (
        <div className="form-subsection form-subsection--boxed">
          <BlockHeading>{manualText(COPY.sideNote, language)}</BlockHeading>
          <p className="form-subsection__description">{manualText(block.sideNote, language)}</p>
        </div>
      )}
    </div>
  );
}

function sameText(value: string): ManualText {
  return { en: value, bn: value };
}

function ManualSectionPanel({
  section,
  language,
  open,
  onToggle,
}: {
  section: ManualSection;
  language?: string;
  open: boolean;
  onToggle: (open: boolean) => void;
}) {
  const source = section.sourceOrder
    ? manualText(SOURCE_LABELS[section.sourceOrder] ?? mt(section.sourceOrder, section.sourceOrder), language)
    : "";
  const area = manualText(AREA_LABELS[section.area], language);
  const description = [
    section.description ? manualText(section.description, language) : "",
    [area, source].filter(Boolean).join(" · "),
  ].filter(Boolean).join(" — ");

  return (
    <details
      className="form-section form-section--collapsible"
      open={open}
      onToggle={(event) => onToggle(event.currentTarget.open)}
    >
      <summary className="form-section__header form-section__header--collapsible">
        <span className="form-section__icon" aria-hidden="true">
          <BookOpen size={14} strokeWidth={1.8} />
        </span>
        <div className="form-section__heading">
          <h3 className="form-section__title">
            {section.number} · {manualText(section.title, language)}
          </h3>
          <p className="form-section__description">{description}</p>
        </div>
        <ChevronDown className="form-section__chevron" size={16} strokeWidth={1.8} aria-hidden="true" />
      </summary>
      <div className="form-section__body--stack">
        {section.blocks.map((block, index) => (
          <ManualBlockView key={index} block={block} language={language} />
        ))}
      </div>
    </details>
  );
}

export function AuditManualPage() {
  const { isDesktop } = useUIState();
  const { i18n } = useTranslation();
  const { t: tc } = useTranslation("common");
  const language = i18n.resolvedLanguage;

  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(["source-metadata", "s01"])
  );

  const txt = (value: ManualText) => manualText(value, language);

  const areaOptions = useMemo(
    () => ["", ...Object.values(AREA_LABELS).map((label) => manualText(label, language))],
    [language]
  );
  const sourceOptions = useMemo(
    () => ["", ...Object.values(SOURCE_LABELS).map((label) => manualText(label, language))],
    [language]
  );

  const filters: FilterDef[] = [
    { key: "area", label: txt(COPY.area), type: "select", options: areaOptions },
    { key: "source", label: txt(COPY.sourceView), type: "select", options: sourceOptions },
  ];

  const filteredSections = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return ALL_SECTIONS.filter((section) => {
      const areaLabel = manualText(AREA_LABELS[section.area], language);
      const sourceLabel = section.sourceOrder
        ? manualText(SOURCE_LABELS[section.sourceOrder] ?? mt(section.sourceOrder, section.sourceOrder), language)
        : "";
      const areaOk = !appliedFilters.area || appliedFilters.area === areaLabel;
      const sourceOk = !appliedFilters.source || appliedFilters.source === sourceLabel;
      const queryOk = !needle || sectionSearchText(section).includes(needle);
      return areaOk && sourceOk && queryOk;
    });
  }, [query, appliedFilters, language]);

  const hasActiveFilters = Object.values(appliedFilters).some(Boolean);

  useEffect(() => {
    if (query.trim() || hasActiveFilters) {
      setOpenSections(new Set(filteredSections.map((section) => section.id)));
    }
  }, [query, hasActiveFilters, filteredSections]);

  const applyFilters = () => {
    setAppliedFilters(Object.fromEntries(Object.entries(filterValues).filter(([, value]) => value)));
    setShowFilter(false);
  };

  const resetFilters = () => {
    setFilterValues({});
    setAppliedFilters({});
    setShowFilter(false);
  };

  useEffect(() => {
    setFilterValues({});
    setAppliedFilters({});
    setShowFilter(false);
  }, [language]);

  const expandAll = () => setOpenSections(new Set(filteredSections.map((section) => section.id)));
  const collapseAll = () => setOpenSections(new Set());

  return (
    <div className="table-page">
      <div className="table-page__header">
        <div>
          <h1 className="table-page__title">{txt(COPY.title)}</h1>
          <p className="table-page__desc">{txt(COPY.description)}</p>
        </div>
      </div>

      <MobileSearchFilter
        searchValue={query}
        onSearchChange={setQuery}
        onFilterClick={() => setShowFilter((open) => !open)}
        placeholder={txt(COPY.searchPlaceholder)}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="table-card">
        <div className="table-card__toolbar">
          <div className="table-card__title-group">
            <h2 className="table-card__title">{txt(COPY.libraryTitle)}</h2>
            <span className="table-card__count">
              {filteredSections.length} {txt(COPY.sections)}
            </span>
          </div>

          <div className="table-card__search-wrapper">
            <AppSearchField
              value={query}
              onChange={setQuery}
              label={txt(COPY.search)}
              placeholder={txt(COPY.searchPlaceholder)}
              size="compact"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilter((open) => !open)}
            className={`table-card__toolbar-btn${showFilter ? " table-card__toolbar-btn--active" : ""}`}
          >
            <Filter size={13} aria-hidden="true" /> {tc("actions.filter")}
          </button>

          <button type="button" className="table-card__toolbar-btn audit-manual-desktop-only" onClick={expandAll}>
            {txt(COPY.expandAll)}
          </button>
          <button type="button" className="table-card__toolbar-btn audit-manual-desktop-only" onClick={collapseAll}>
            {txt(COPY.collapseAll)}
          </button>
          <button
            type="button"
            className="table-card__toolbar-btn table-card__toolbar-btn--print"
            onClick={() => window.print()}
          >
            <Printer size={13} aria-hidden="true" /> {txt(COPY.print)}
          </button>
        </div>

        {isDesktop && showFilter && (
          <div className="table-card__filter-panel">
            <FilterPanel
              filters={filters}
              values={filterValues}
              onChange={(key, value) => setFilterValues((prev) => ({ ...prev, [key]: value }))}
              onApply={applyFilters}
              onReset={resetFilters}
            />
          </div>
        )}

        <AppliedFilterChips values={appliedFilters} onClear={resetFilters} inCard />

        <div className="audit-manual-section-stack">
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <ManualSectionPanel
                key={section.id}
                section={section}
                language={language}
                open={openSections.has(section.id)}
                onToggle={(isOpen) => {
                  setOpenSections((current) => {
                    const next = new Set(current);
                    if (isOpen) next.add(section.id);
                    else next.delete(section.id);
                    return next;
                  });
                }}
              />
            ))
          ) : (
            <div className="audit-manual-empty-state">
              <h3>{txt(COPY.noResults)}</h3>
              <p>{txt(COPY.noResultsHelp)}</p>
            </div>
          )}
        </div>
      </div>

      {!isDesktop && (
        <MobileFilterOverlay
          isOpen={showFilter}
          filters={filters}
          values={filterValues}
          onChange={(key, value) => setFilterValues((prev) => ({ ...prev, [key]: value }))}
          onApply={applyFilters}
          onReset={resetFilters}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}
