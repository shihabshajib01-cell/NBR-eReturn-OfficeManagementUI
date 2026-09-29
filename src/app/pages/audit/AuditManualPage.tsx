import { useMemo, useState } from "react";
import { BookOpen, ChevronRight, Filter, Layers3, ShieldCheck, Workflow } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { AppSelectField } from "../../components/forms/AppSelectField";
import { ResponsiveOverlay } from "../../components/shared/ResponsiveOverlay";
import {
  AUDIT_MANUAL_TOPICS,
  CATEGORY_LABELS,
  TYPE_LABELS,
  localText,
  type AuditManualTopic,
  type LocalizedText,
} from "./auditManualData";

const COPY: Record<string, LocalizedText> = {
  title: { en: "Audit Manual", bn: "অডিট ম্যানুয়াল" },
  description: {
    en: "Searchable operating guide for the Audit module. It explains how selection, data readiness, screening, controls, verification, review, governance and audit history fit together.",
    bn: "Audit module-এর searchable operating guide। Selection, data readiness, screening, control, verification, review, governance ও audit history কীভাবে একসাথে কাজ করে তা এখানে ব্যাখ্যা করা হয়েছে।",
  },
  source: { en: "Framework source: risk framework v7", bn: "Framework source: risk framework v7" },
  search: { en: "Search the audit manual", bn: "অডিট ম্যানুয়াল খুঁজুন" },
  searchPlaceholder: { en: "Search signals, coverage, reconciliation, verification…", bn: "Signal, coverage, reconciliation, verification খুঁজুন…" },
  category: { en: "Category", bn: "ক্যাটাগরি" },
  topicType: { en: "Topic type", bn: "টপিক টাইপ" },
  allCategories: { en: "All categories", bn: "সব ক্যাটাগরি" },
  allTypes: { en: "All topic types", bn: "সব টপিক টাইপ" },
  results: { en: "topics found", bn: "টি topic পাওয়া গেছে" },
  clear: { en: "Clear", bn: "Clear" },
  openTopic: { en: "Open topic", bn: "Topic খুলুন" },
  frameworkSection: { en: "Framework section", bn: "Framework section" },
  codes: { en: "Codes & terms", bn: "Code ও term" },
  guardrail: { en: "Important guardrail", bn: "গুরুত্বপূর্ণ guardrail" },
  details: { en: "Operational guidance", bn: "Operational guidance" },
  related: { en: "Related Audit page", bn: "Related Audit page" },
  noResultsTitle: { en: "No matching manual topic", bn: "Matching manual topic পাওয়া যায়নি" },
  noResultsDesc: { en: "Try a broader search or clear one of the filters.", bn: "Search আরও broad করুন অথবা একটি filter clear করুন।" },
  flowTitle: { en: "Audit journey at a glance", bn: "এক নজরে Audit journey" },
  flowDesc: {
    en: "Use this sequence to understand where a taxpayer moves through the Audit workspace. The framework logic remains separated at every step.",
    bn: "Audit workspace-এ taxpayer কোথায় যায় তা বুঝতে এই sequence ব্যবহার করুন। প্রতিটি ধাপে framework logic আলাদা থাকে।",
  },
  filteredBy: { en: "Filtered library", bn: "Filtered library" },
  close: { en: "Close Audit Manual topic", bn: "Audit Manual topic বন্ধ করুন" },
};

const FLOW: { title: LocalizedText; desc: LocalizedText; category: AuditManualTopic["category"] }[] = [
  {
    title: { en: "1. Candidate selection", bn: "১. Candidate selection" },
    desc: { en: "Population → readiness → criteria → preview → funnel → final batch", bn: "Population → readiness → criteria → preview → funnel → final batch" },
    category: "overview",
  },
  {
    title: { en: "2. Data readiness", bn: "২. Data readiness" },
    desc: { en: "Data Quality first, then Coverage/Data Tier eligibility", bn: "আগে Data Quality, তারপর Coverage/Data Tier eligibility" },
    category: "data",
  },
  {
    title: { en: "3. Screening", bn: "৩. Screening" },
    desc: { en: "A–E signals → deduplication → Risk Level with reason", bn: "A–E signal → deduplication → reason-সহ Risk Level" },
    category: "screening",
  },
  {
    title: { en: "4. Controls", bn: "৪. Controls" },
    desc: { en: "F0–F5 and reconciliation remain on their defined paths", bn: "F0–F5 ও reconciliation নিজ নিজ defined path-এ থাকে" },
    category: "controls",
  },
  {
    title: { en: "5. Verification & review", bn: "৫. Verification ও review" },
    desc: { en: "Signal-level evidence → finding → second review → closure", bn: "Signal-level evidence → finding → second review → closure" },
    category: "workflow",
  },
  {
    title: { en: "6. Governance & history", bn: "৬. Governance ও history" },
    desc: { en: "Versioned rules, decisions, reconciliation and immutable events", bn: "Versioned rule, decision, reconciliation ও immutable event" },
    category: "governance",
  },
];

function topicSearchText(topic: AuditManualTopic, language: string | undefined): string {
  return [
    localText(topic.title, language),
    localText(topic.summary, language),
    ...topic.keywords,
    ...(topic.codes ?? []),
    ...topic.frameworkSections,
    ...topic.details.map((item) => localText(item, language)),
    topic.guardrail ? localText(topic.guardrail, language) : "",
  ].join(" ").toLowerCase();
}

export function AuditManualPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const language = i18n.resolvedLanguage;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [topicType, setTopicType] = useState("");
  const [selected, setSelected] = useState<AuditManualTopic | null>(null);

  const txt = (key: keyof typeof COPY) => localText(COPY[key], language);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return AUDIT_MANUAL_TOPICS
      .filter((topic) => !category || topic.category === category)
      .filter((topic) => !topicType || topic.type === topicType)
      .filter((topic) => !needle || topicSearchText(topic, language).includes(needle))
      .sort((a, b) => a.order - b.order);
  }, [query, category, topicType, language]);

  const hasFilters = Boolean(query || category || topicType);

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setTopicType("");
  };

  const categoryOptions = [
    { value: "", label: txt("allCategories") },
    ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
      value,
      label: localText(label, language),
    })),
  ];

  const typeOptions = [
    { value: "", label: txt("allTypes") },
    ...Object.entries(TYPE_LABELS).map(([value, label]) => ({
      value,
      label: localText(label, language),
    })),
  ];

  return (
    <div className="audit-manual-page">
      <div className="audit-manual-page__header">
        <div>
          <h1 className="audit-manual-page__title">{txt("title")}</h1>
          <p className="audit-manual-page__description">{txt("description")}</p>
        </div>
        <div className="audit-manual-page__source">
          <BookOpen size={16} aria-hidden="true" />
          <p>{txt("source")}</p>
        </div>
      </div>

      <section className="audit-manual-flow" aria-labelledby="audit-manual-flow-title">
        <div className="audit-manual-flow__head">
          <div>
            <h2 id="audit-manual-flow-title">{txt("flowTitle")}</h2>
            <p>{txt("flowDesc")}</p>
          </div>
          <Workflow size={18} aria-hidden="true" />
        </div>
        <div className="audit-manual-flow__grid">
          {FLOW.map((step) => (
            <button
              key={localText(step.title, "en")}
              type="button"
              className={"audit-manual-flow__step" + (category === step.category ? " audit-manual-flow__step--active" : "")}
              onClick={() => setCategory((current) => current === step.category ? "" : step.category)}
            >
              <h3>{localText(step.title, language)}</h3>
              <p>{localText(step.desc, language)}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="audit-manual-library" aria-labelledby="audit-manual-library-title">
        <div className="audit-manual-library__toolbar">
          <div className="audit-manual-library__title">
            <Layers3 size={17} aria-hidden="true" />
            <h2 id="audit-manual-library-title">{txt("filteredBy")}</h2>
            <p>{filtered.length} {txt("results")}</p>
          </div>

          <div className="audit-manual-library__controls">
            <div className="audit-manual-library__search">
              <AppSearchField
                value={query}
                onChange={setQuery}
                label={txt("search")}
                placeholder={txt("searchPlaceholder")}
                size="compact"
              />
            </div>
            <div className="audit-manual-library__filter">
              <Filter size={14} aria-hidden="true" />
              <AppSelectField
                id="audit-manual-category"
                label={txt("category")}
                value={category}
                onChange={setCategory}
                options={categoryOptions}
                compact
              />
            </div>
            <div className="audit-manual-library__filter">
              <AppSelectField
                id="audit-manual-type"
                label={txt("topicType")}
                value={topicType}
                onChange={setTopicType}
                options={typeOptions}
                compact
              />
            </div>
            {hasFilters && (
              <button type="button" className="audit-manual-library__clear" onClick={clearFilters}>
                <p>{txt("clear")}</p>
              </button>
            )}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="audit-manual-grid">
            {filtered.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className="audit-manual-card"
                onClick={() => setSelected(topic)}
                aria-label={localText(topic.title, language)}
              >
                <div className="audit-manual-card__meta">
                  <p className="audit-manual-card__category">{localText(CATEGORY_LABELS[topic.category], language)}</p>
                  <p className="audit-manual-card__type">{localText(TYPE_LABELS[topic.type], language)}</p>
                </div>
                <h3>{localText(topic.title, language)}</h3>
                <p className="audit-manual-card__summary">{localText(topic.summary, language)}</p>
                <div className="audit-manual-card__footer">
                  <p>{txt("frameworkSection")}: {topic.frameworkSections.join(", ")}</p>
                  <div className="audit-manual-card__open">
                    <p>{txt("openTopic")}</p>
                    <ChevronRight size={15} aria-hidden="true" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="audit-manual-empty">
            <BookOpen size={24} aria-hidden="true" />
            <h3>{txt("noResultsTitle")}</h3>
            <p>{txt("noResultsDesc")}</p>
            {hasFilters && (
              <button type="button" className="action-btn action-btn--secondary" onClick={clearFilters}>
                <p>{txt("clear")}</p>
              </button>
            )}
          </div>
        )}
      </section>

      <ResponsiveOverlay
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? localText(selected.title, language) : txt("title")}
        desktopWidth="620px"
        mobileMaxHeight="90vh"
        closeLabel={txt("close")}
        className="audit-manual-drawer"
      >
        {selected && (
          <div className="audit-manual-topic">
            <div className="audit-manual-topic__meta">
              <p className="audit-manual-card__category">{localText(CATEGORY_LABELS[selected.category], language)}</p>
              <p className="audit-manual-card__type">{localText(TYPE_LABELS[selected.type], language)}</p>
              <p>{txt("frameworkSection")}: {selected.frameworkSections.join(", ")}</p>
            </div>

            <p className="audit-manual-topic__summary">{localText(selected.summary, language)}</p>

            {selected.guardrail && (
              <div className="audit-manual-topic__guardrail">
                <ShieldCheck size={18} aria-hidden="true" />
                <div>
                  <h3>{txt("guardrail")}</h3>
                  <p>{localText(selected.guardrail, language)}</p>
                </div>
              </div>
            )}

            <div className="audit-manual-topic__section">
              <h3>{txt("details")}</h3>
              <div className="audit-manual-topic__points">
                {selected.details.map((detail, index) => (
                  <div className="audit-manual-topic__point" key={index}>
                    <p className="audit-manual-topic__point-number">{String(index + 1).padStart(2, "0")}</p>
                    <p>{localText(detail, language)}</p>
                  </div>
                ))}
              </div>
            </div>

            {selected.codes && selected.codes.length > 0 && (
              <div className="audit-manual-topic__section">
                <h3>{txt("codes")}</h3>
                <div className="audit-manual-topic__codes">
                  {selected.codes.map((code) => <p key={code}>{code}</p>)}
                </div>
              </div>
            )}

            {selected.relatedRoute && selected.relatedLabel && (
              <div className="audit-manual-topic__related">
                <div>
                  <h3>{txt("related")}</h3>
                  <p>{localText(selected.relatedLabel, language)}</p>
                </div>
                <button
                  type="button"
                  className="action-btn action-btn--primary"
                  onClick={() => {
                    setSelected(null);
                    navigate(selected.relatedRoute!);
                  }}
                >
                  <p>{localText(selected.relatedLabel, language)}</p>
                  <ChevronRight size={14} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}
      </ResponsiveOverlay>
    </div>
  );
}
