import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  X, Search, ChevronDown, BookOpen, PlayCircle,
  Map, Calendar, Download, Crown, ShieldCheck, UserCheck,
  Package, Settings, Keyboard, Sparkles, Info, HelpCircle,
} from "lucide-react";
import { AppSearchField } from "../forms/AppSearchField";
import { useHelp } from "../../context/HelpContext";
import { useUIState } from "../../hooks/useUI";
import {
  PAGE_GUIDES, ROLE_GUIDES, MODULE_DOCS, WHATS_NEW, QUICK_ACTIONS,
  searchHelpContent,
  type SearchResult,
  type PageGuide,
} from "../../data/helpContent";

// ─── Icon maps ────────────────────────────────────────────────────────────────

const ROLE_ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Crown, ShieldCheck, UserCheck, Search, Keyboard, Package, Settings,
};

const QUICK_ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  PlayCircle, Map, Calendar, Download,
};

// ─── Accordion ───────────────────────────────────────────────────────────────

function Accordion({
  title,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="help-accordion">
      <button
        className="help-accordion__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="help-accordion__title">{title}</span>
        {badge && <span className="help-accordion__badge">{badge}</span>}
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`help-accordion__chevron ${open ? "help-accordion__chevron--open" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && <div className="help-accordion__body">{children}</div>}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ label }: { label: string }) {
  return <span className="help-status-badge">{label}</span>;
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="help-faq-item">
      <button className="help-faq-item__question" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <HelpCircle size={13} strokeWidth={2} className="help-faq-item__icon" aria-hidden="true" />
        <span>{q}</span>
        <ChevronDown
          size={12}
          strokeWidth={2}
          className={`help-faq-item__chevron ${open ? "help-faq-item__chevron--open" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && <p className="help-faq-item__answer">{a}</p>}
    </div>
  );
}

// ─── Page Guide section ───────────────────────────────────────────────────────

function PageGuideSection({ guide }: { guide: PageGuide }) {
  const { t } = useTranslation("help");
  return (
    <div className="help-page-guide">
      <p className="help-page-guide__overview">{guide.overview}</p>

      <Accordion title={t("pageGuide.workflow")} defaultOpen={true}>
        <ol className="help-steps">
          {guide.workflow.map((step, i) => (
            <li key={i} className="help-steps__item">
              <span className="help-steps__num">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Accordion>

      <Accordion title={t("pageGuide.actions")}>
        <div className="help-tags">
          {guide.actions.map((action, i) => (
            <span key={i} className="help-tag">{action}</span>
          ))}
        </div>
      </Accordion>

      {guide.statuses && guide.statuses.length > 0 && (
        <Accordion title={t("pageGuide.statuses")}>
          <div className="help-status-list">
            {guide.statuses.map((s, i) => (
              <div key={i} className="help-status-list__item">
                <StatusBadge label={s.label} />
                <span className="help-status-list__meaning">{s.meaning}</span>
              </div>
            ))}
          </div>
        </Accordion>
      )}

      {guide.commonErrors && guide.commonErrors.length > 0 && (
        <Accordion title={t("pageGuide.commonMistakes")}>
          <ul className="help-list help-list--warn">
            {guide.commonErrors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </Accordion>
      )}

      {guide.bestPractices && guide.bestPractices.length > 0 && (
        <Accordion title={t("pageGuide.bestPractices")}>
          <ul className="help-list help-list--tip">
            {guide.bestPractices.map((bp, i) => <li key={i}>{bp}</li>)}
          </ul>
        </Accordion>
      )}

      <Accordion title={t("pageGuide.faqs", { count: guide.faqs.length })}>
        <div className="help-faqs">
          {guide.faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </Accordion>
    </div>
  );
}

// ─── Quick Actions section ────────────────────────────────────────────────────

function QuickActionsSection() {
  return (
    <div className="help-quick-grid">
      {QUICK_ACTIONS.map((qa) => (
        <Accordion key={qa.title} title={qa.title}>
          <p className="help-section__desc">{qa.description}</p>
          <ol className="help-steps">
            {qa.content.map((step, i) => (
              <li key={i} className="help-steps__item">
                <span className="help-steps__num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Accordion>
      ))}
    </div>
  );
}

// ─── Roles section ────────────────────────────────────────────────────────────

function RolesSection() {
  const { t } = useTranslation("help");
  return (
    <div className="help-roles">
      {ROLE_GUIDES.map((role) => (
        <Accordion key={role.role} title={role.role}>
          <div className="help-role-detail">
            <div className="help-role-detail__block">
              <p className="help-role-detail__label">{t("roleGuide.responsibilities")}</p>
              <ul className="help-list">
                {role.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
            <div className="help-role-detail__block">
              <p className="help-role-detail__label">{t("roleGuide.actions")}</p>
              <ul className="help-list">
                {role.actions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
            <div className="help-role-detail__block">
              <p className="help-role-detail__label">{t("roleGuide.modules")}</p>
              <div className="help-tags">
                {role.modules.map((m, i) => <span key={i} className="help-tag">{m}</span>)}
              </div>
            </div>
            <div className="help-role-detail__block">
              <p className="help-role-detail__label">{t("roleGuide.approvalFlow")}</p>
              <p className="help-role-detail__text">{role.approvalFlow}</p>
            </div>
            <div className="help-role-detail__block">
              <p className="help-role-detail__label">{t("roleGuide.escalationFlow")}</p>
              <p className="help-role-detail__text">{role.escalationFlow}</p>
            </div>
          </div>
        </Accordion>
      ))}
    </div>
  );
}

// ─── Modules section ──────────────────────────────────────────────────────────

function ModulesSection() {
  const { t } = useTranslation("help");
  return (
    <div className="help-modules">
      {MODULE_DOCS.map((mod) => (
        <Accordion key={mod.module} title={mod.module}>
          <div className="help-module-detail">
            <p className="help-module-detail__purpose">{mod.purpose}</p>

            <div className="help-role-detail__block">
              <p className="help-role-detail__label">{t("moduleDoc.workflow")}</p>
              <ol className="help-steps">
                {mod.workflow.map((step, i) => (
                  <li key={i} className="help-steps__item">
                    <span className="help-steps__num">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {mod.statusMeanings.length > 0 && (
              <div className="help-role-detail__block">
                <p className="help-role-detail__label">{t("moduleDoc.statusMeanings")}</p>
                <div className="help-status-list">
                  {mod.statusMeanings.map((s, i) => (
                    <div key={i} className="help-status-list__item">
                      <StatusBadge label={s.label} />
                      <span className="help-status-list__meaning">{s.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="help-role-detail__block">
              <p className="help-role-detail__label">{t("moduleDoc.actions")}</p>
              <div className="help-tags">
                {mod.actions.map((a, i) => <span key={i} className="help-tag">{a}</span>)}
              </div>
            </div>

            <div className="help-role-detail__block">
              <p className="help-role-detail__label">{t("moduleDoc.commonErrors")}</p>
              <ul className="help-list help-list--warn">
                {mod.commonErrors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>

            <div className="help-role-detail__block">
              <p className="help-role-detail__label">{t("moduleDoc.bestPractices")}</p>
              <ul className="help-list help-list--tip">
                {mod.bestPractices.map((bp, i) => <li key={i}>{bp}</li>)}
              </ul>
            </div>

            <div className="help-role-detail__block">
              <p className="help-role-detail__label">{t("moduleDoc.relatedModules")}</p>
              <div className="help-tags">
                {mod.relatedModules.map((r, i) => <span key={i} className="help-tag help-tag--muted">{r}</span>)}
              </div>
            </div>
          </div>
        </Accordion>
      ))}
    </div>
  );
}

// ─── What's New section ───────────────────────────────────────────────────────

function WhatsNewSection() {
  const { t } = useTranslation("help");
  return (
    <div className="help-whats-new">
      {WHATS_NEW.map((entry) => (
        <div key={entry.version} className="help-release">
          <div className="help-release__header">
            <span className="help-release__version">v{entry.version}</span>
            <span className="help-release__date">{entry.releaseDate}</span>
          </div>

          {entry.features.length > 0 && (
            <div className="help-release__block">
              <p className="help-release__label help-release__label--feature">{t("releaseNotes.newFeatures")}</p>
              <ul className="help-list help-list--tip">
                {entry.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          {entry.uiChanges.length > 0 && (
            <div className="help-release__block">
              <p className="help-release__label help-release__label--ui">{t("releaseNotes.uiChanges")}</p>
              <ul className="help-list">
                {entry.uiChanges.map((u, i) => <li key={i}>{u}</li>)}
              </ul>
            </div>
          )}

          {entry.fixes.length > 0 && (
            <div className="help-release__block">
              <p className="help-release__label help-release__label--fix">{t("releaseNotes.bugFixes")}</p>
              <ul className="help-list">
                {entry.fixes.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          {entry.systemUpdates.length > 0 && (
            <div className="help-release__block">
              <p className="help-release__label">{t("releaseNotes.systemUpdates")}</p>
              <ul className="help-list">
                {entry.systemUpdates.map((u, i) => <li key={i}>{u}</li>)}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Search Results section ───────────────────────────────────────────────────

function SearchResults({ results, query }: { results: SearchResult[]; query: string }) {
  const { t } = useTranslation("help");

  if (results.length === 0) {
    return (
      <div className="help-search-empty">
        <Search size={28} strokeWidth={1.5} className="help-search-empty__icon" aria-hidden="true" />
        <p className="help-search-empty__text">
          {t("search.noResults", { query })}
        </p>
        <p className="help-search-empty__hint">{t("search.noResultsHint")}</p>
      </div>
    );
  }

  return (
    <div className="help-search-results">
      <p className="help-search-results__count">
        {t("search.resultCount", { count: results.length })}
      </p>
      {results.map((r, i) => (
        <div key={i} className="help-search-result">
          <span className={`help-search-result__type help-search-result__type--${r.type}`}>
            {t(`search.resultTypes.${r.type}`)}
          </span>
          <p className="help-search-result__title">{r.title}</p>
          <p className="help-search-result__excerpt">{r.excerpt}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main HelpDrawer ──────────────────────────────────────────────────────────

export function HelpDrawer() {
  const { helpOpen, pageKey, closeHelp } = useHelp();
  const { isDesktop } = useUIState();
  const { t } = useTranslation("help");
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const guide = PAGE_GUIDES[pageKey];
  const searchResults = searchHelpContent(searchQuery);

  useEffect(() => {
    if (helpOpen) {
      setSearchQuery("");
      const timer = setTimeout(() => closeRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }
  }, [helpOpen]);

  useEffect(() => {
    if (!helpOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [helpOpen]);

  useEffect(() => {
    if (!helpOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); closeHelp(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [helpOpen, closeHelp]);

  if (!helpOpen) return null;

  const content = (
    <>
      {/* Backdrop */}
      <div className="help-drawer__backdrop" onClick={closeHelp} aria-hidden="true" />

      {/* Drawer panel */}
      <div
        className={`help-drawer ${isDesktop ? "help-drawer--desktop" : "help-drawer--mobile"}`}
        role="dialog"
        aria-modal="true"
        aria-label={t("aria.dialog")}
      >
        {/* Header */}
        <div className="help-drawer__header">
          <div className="help-drawer__header-top">
            <div className="help-drawer__header-leading">
              <div className="help-drawer__header-icon" aria-hidden="true">
                <BookOpen size={16} strokeWidth={2} />
              </div>
              <div>
                <p className="help-drawer__header-title">{t("title")}</p>
                {guide && (
                  <p className="help-drawer__header-subtitle">{guide.title}</p>
                )}
              </div>
            </div>
            <button
              ref={closeRef}
              onClick={closeHelp}
              className="help-drawer__close"
              aria-label={t("aria.close")}
              type="button"
            >
              <X size={15} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          {/* Search */}
          <div className="help-drawer__search-wrapper">
            <AppSearchField
              inputRef={searchRef}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("search.placeholder")}
              label={t("aria.searchInput")}
              size="compact"
              clearable
            />
          </div>
        </div>

        {/* Body */}
        <div className="help-drawer__body">
          {searchQuery.trim().length >= 2 ? (
            <SearchResults results={searchResults} query={searchQuery.trim()} />
          ) : (
            <>
              {/* Section 1: Quick Actions */}
              <section className="help-section">
                <div className="help-section__heading">
                  <PlayCircle size={14} strokeWidth={2} className="help-section__heading-icon" aria-hidden="true" />
                  <h3 className="help-section__title">{t("sections.quickActions")}</h3>
                </div>
                <QuickActionsSection />
              </section>

              {/* Section 2: Current Page Guide */}
              {guide ? (
                <section className="help-section">
                  <div className="help-section__heading">
                    <Info size={14} strokeWidth={2} className="help-section__heading-icon" aria-hidden="true" />
                    <h3 className="help-section__title">{t("sections.currentPageGuide")}</h3>
                    <span className="help-section__page-pill">{guide.title}</span>
                  </div>
                  <PageGuideSection guide={guide} />
                </section>
              ) : (
                <section className="help-section">
                  <div className="help-section__heading">
                    <Info size={14} strokeWidth={2} className="help-section__heading-icon" aria-hidden="true" />
                    <h3 className="help-section__title">{t("sections.pageGuide")}</h3>
                  </div>
                  <div className="help-page-guide">
                    <p className="help-page-guide__overview">{t("sections.pageGuideContext")}</p>
                  </div>
                </section>
              )}

              {/* Section 3: Role-Based Guides */}
              <section className="help-section">
                <div className="help-section__heading">
                  <UserCheck size={14} strokeWidth={2} className="help-section__heading-icon" aria-hidden="true" />
                  <h3 className="help-section__title">{t("sections.roleBasedGuides")}</h3>
                </div>
                <RolesSection />
              </section>

              {/* Section 4: Module Documentation */}
              <section className="help-section">
                <div className="help-section__heading">
                  <BookOpen size={14} strokeWidth={2} className="help-section__heading-icon" aria-hidden="true" />
                  <h3 className="help-section__title">{t("sections.moduleDocumentation")}</h3>
                </div>
                <ModulesSection />
              </section>

              {/* Section 5: What's New */}
              <section className="help-section help-section--last">
                <div className="help-section__heading">
                  <Sparkles size={14} strokeWidth={2} className="help-section__heading-icon" aria-hidden="true" />
                  <h3 className="help-section__title">{t("sections.whatsNew")}</h3>
                </div>
                <WhatsNewSection />
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : null;
}
