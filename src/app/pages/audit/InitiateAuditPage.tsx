import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Check, Info, Search } from "lucide-react";
import { toast } from "sonner";
import { AppCheckbox } from "../../components/forms/AppCheckbox";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { AppSelectField } from "../../components/forms/AppSelectField";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { ResponsiveTable } from "../../components/tables/ResponsiveTable";
import type { ColDef, TableRow } from "../modulePageUtils";
import { fc } from "../modulePageUtils";
import { ALL_TAXPAYER_ROWS } from "./auditData";
import { AuditExplainerDrawer } from "./AuditExplainerDrawer";
import { resolveAuditExplanation, type AuditExplanation } from "./auditKnowledge";
import {
  addAuditCandidates, clearAuditDraft, loadAuditDraft, saveAuditDraft,
  type AuditDraft,
} from "./auditCandidateStore";

const STEPS = [
  "setup", "population", "readiness", "criteria", "preview", "review",
] as const;

const TRACKS = [
  { id:"population", titleKey:"initiate.tracks.population.title", descKey:"initiate.tracks.population.desc" },
  { id:"risk", titleKey:"initiate.tracks.risk.title", descKey:"initiate.tracks.risk.desc" },
  { id:"control", titleKey:"initiate.tracks.control.title", descKey:"initiate.tracks.control.desc" },
  { id:"manual", titleKey:"initiate.tracks.manual.title", descKey:"initiate.tracks.manual.desc" },
] as const;

const SIGNAL_OPTIONS = [
  ["R-A1","Zero income + declared asset"], ["R-A2","Income declared, tax payable zero"], ["R-A3","TDS-implied income floor"],
  ["R-B1","Large asset growth"], ["R-B2","Income falls while assets grow"],
  ["R-C1","Reconciliation gap"], ["R-C2","Multi-year cumulative gap"], ["R-C3","Opening wealth continuity break"], ["R-C4","Implausibly low expenditure"],
  ["R-D1","Persistent zero income / zero tax"], ["R-D2","Alternating declaration pattern"], ["R-D3","Amendment after trigger"],
  ["R-E1","Payroll / third-party income mismatch"], ["R-E2","Asset registry mismatch"], ["R-E3","VAT turnover mismatch"],
] as const;

const FLAG_OPTIONS = [
  ["F0","Form arithmetic consistency"], ["F1","Return ↔ wealth-statement consistency"],
  ["F2","Surcharge consistency control"], ["F3","Business drawing / capital consistency"],
  ["F4","Investment reflection control"], ["F5","Required-statement control"],
] as const;

const RISK_LEVELS = ["Low","Medium","High","Very High"] as const;

function unique(field: string): string[] {
  return Array.from(new Set(
    ALL_TAXPAYER_ROWS.map((row) => String(row[field] ?? "")).filter(Boolean)
  )).sort((a,b) => a.localeCompare(b));
}

function toggle(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function signalIds(value: unknown): string[] {
  return Array.from(new Set(String(value ?? "").match(/R-[A-E]\d/g) ?? []));
}

function flagIds(value: unknown): string[] {
  return Array.from(new Set(String(value ?? "").match(/F[0-5]/g) ?? []));
}

export function InitiateAuditPage() {
  const { t, i18n } = useTranslation("audit");
  const navigate = useNavigate();
  const restored = loadAuditDraft();

  const assessmentYears = unique("assessment_year");
  const circlesAvailable = unique("circle");
  const dataQualityAvailable = unique("data_quality");
  const coverageAvailable = unique("coverage_tier");

  const [step, setStep] = useState(restored?.step ?? 0);
  const [assessmentYear, setAssessmentYear] = useState(restored?.assessmentYear ?? assessmentYears[0] ?? "2025-26");
  const [track, setTrack] = useState(restored?.track ?? "risk");
  const [scopeMode, setScopeMode] = useState(restored?.scopeMode ?? "all");
  const [circles, setCircles] = useState<string[]>(restored?.circles ?? []);
  const [dataQuality, setDataQuality] = useState<string[]>(restored?.dataQuality?.length ? restored.dataQuality : dataQualityAvailable);
  const [coverageTiers, setCoverageTiers] = useState<string[]>(restored?.coverageTiers?.length ? restored.coverageTiers : coverageAvailable);
  const [riskLevels, setRiskLevels] = useState<string[]>(restored?.riskLevels ?? []);
  const [signals, setSignals] = useState<string[]>(restored?.signals ?? []);
  const [controlFlags, setControlFlags] = useState<string[]>(restored?.controlFlags ?? []);
  const [matchMode, setMatchMode] = useState(restored?.matchMode ?? "any");
  const [manualReturnIds, setManualReturnIds] = useState<string[]>(restored?.manualReturnIds ?? []);
  const [manualSearch, setManualSearch] = useState("");
  const [exclusions, setExclusions] = useState<Record<string,string>>(restored?.exclusions ?? {});
  const [explanation, setExplanation] = useState<AuditExplanation | null>(null);

  const baseYearRows = useMemo(
    () => ALL_TAXPAYER_ROWS.filter((row) => String(row.assessment_year) === assessmentYear),
    [assessmentYear],
  );

  const populationRows = useMemo(() => {
    if (scopeMode === "all") return baseYearRows;
    return baseYearRows.filter((row) => circles.includes(String(row.circle)));
  }, [baseYearRows, scopeMode, circles]);

  const readinessRows = useMemo(() => populationRows.filter((row) =>
    dataQuality.includes(String(row.data_quality)) &&
    coverageTiers.includes(String(row.coverage_tier))
  ), [populationRows, dataQuality, coverageTiers]);

  const matchedRows = useMemo(() => readinessRows.filter((row) => {
    if (track === "population") return true;

    if (track === "risk") {
      const riskOk = riskLevels.length === 0 || riskLevels.includes(String(row.risk_level));
      const rowSignals = signalIds(row.signals);
      const signalOk = signals.length === 0
        ? true
        : matchMode === "all"
          ? signals.every((id) => rowSignals.includes(id))
          : signals.some((id) => rowSignals.includes(id));
      return riskOk && signalOk;
    }

    if (track === "control") {
      const rowFlags = flagIds(row.control_flags);
      return controlFlags.some((id) => rowFlags.includes(id));
    }

    if (track === "manual") {
      return manualReturnIds.includes(String(row.return_id));
    }

    return false;
  }), [readinessRows, track, riskLevels, signals, matchMode, controlFlags, manualReturnIds]);

  const finalRows = useMemo(
    () => matchedRows.filter((row) => !(String(row.return_id) in exclusions)),
    [matchedRows, exclusions],
  );

  const manualRows = useMemo(() => {
    const needle = manualSearch.trim().toLowerCase();
    return readinessRows.filter((row) => !needle || [
      row.taxpayer_name, row.tin, row.return_id, row.circle,
    ].some((value) => String(value ?? "").toLowerCase().includes(needle)));
  }, [readinessRows, manualSearch]);

  const stepValid = useMemo(() => {
    switch (step) {
      case 0: return !!assessmentYear && !!track;
      case 1: return scopeMode === "all" || circles.length > 0;
      case 2: return dataQuality.length > 0 && coverageTiers.length > 0;
      case 3:
        if (track === "population") return true;
        if (track === "risk") return riskLevels.length > 0 || signals.length > 0;
        if (track === "control") return controlFlags.length > 0;
        if (track === "manual") return manualReturnIds.length > 0;
        return false;
      case 4:
        return finalRows.length > 0 &&
          Object.values(exclusions).every((reason) => reason.trim().length > 0);
      default: return finalRows.length > 0;
    }
  }, [step, assessmentYear, track, scopeMode, circles, dataQuality, coverageTiers, riskLevels, signals, controlFlags, manualReturnIds, finalRows, exclusions]);

  const previewCols: ColDef[] = [
    fc("taxpayer_name", t("columns.taxpayer")),
    fc("tin", t("columns.tin"), { mono:true }),
    fc("circle", t("columns.circle")),
    fc("coverage_tier", t("columns.coverageTier")),
    fc("signals", t("columns.signals"), { truncate:"normal" }),
    fc("risk_level", t("columns.riskLevel")),
    fc("control_flags", t("columns.controlFlags")),
  ];

  const explain = (key: string, value: string, row: TableRow) => {
    const resolved = resolveAuditExplanation(key, value, row, i18n.resolvedLanguage);
    if (resolved) setExplanation(resolved);
  };

  const draft: AuditDraft = {
    step, assessmentYear, track, scopeMode, circles, dataQuality, coverageTiers,
    riskLevels, signals, controlFlags, matchMode, manualReturnIds, exclusions,
  };

  const saveDraft = () => {
    saveAuditDraft(draft);
    toast.success(t("initiate.toast.draftSaved"));
  };

  const selectionBasis = useMemo(() => {
    const scope = scopeMode === "all" ? t("initiate.summary.allCircles") : circles.join(", ");
    if (track === "population") return `Population selection · ${scope}`;
    if (track === "risk") {
      const parts = [
        riskLevels.length ? `Risk: ${riskLevels.join(", ")}` : "",
        signals.length ? `Signals: ${signals.join(", ")} (${matchMode})` : "",
      ].filter(Boolean).join(" · ");
      return `Risk-based · ${scope} · ${parts}`;
    }
    if (track === "control") return `Control / Data Quality · ${scope} · ${controlFlags.join(", ")}`;
    return `Manual selection · ${scope}`;
  }, [scopeMode, circles, track, riskLevels, signals, matchMode, controlFlags, t]);

  const confirmCandidates = () => {
    if (!finalRows.length) return;
    addAuditCandidates(finalRows, {
      assessmentYear,
      track: TRACKS.find((item) => item.id === track)?.id ?? track,
      selectionBasis,
    });
    clearAuditDraft();
    toast.success(t("initiate.toast.candidatesConfirmed", { count: finalRows.length }));
    navigate("/audit/audit-candidates");
  };

  const setExcluded = (row: TableRow, include: boolean) => {
    const id = String(row.return_id);
    setExclusions((prev) => {
      const next = { ...prev };
      if (include) delete next[id];
      else if (!(id in next)) next[id] = "";
      return next;
    });
  };

  const renderInfoButton = (field: string, value: string, row: TableRow) => (
    <button
      type="button"
      className="audit-initiate__info-btn"
      aria-label={t("initiate.explain", { value })}
      onClick={() => explain(field, value, row)}
    >
      <Info size={14} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );

  const renderStep = () => {
    if (step === 0) {
      return (
        <>
          <div className="audit-initiate__section-heading">
            <h2>{t("initiate.steps.setup.title")}</h2>
            <p>{t("initiate.steps.setup.desc")}</p>
          </div>
          <div className="audit-initiate__form-grid">
            <AppSelectField
              id="audit-assessment-year"
              label={t("initiate.fields.assessmentYear")}
              value={assessmentYear}
              onChange={setAssessmentYear}
              options={assessmentYears}
              required
            />
          </div>
          <fieldset className="audit-initiate__fieldset">
            <legend>{t("initiate.fields.selectionTrack")}</legend>
            <div className="audit-initiate__option-grid">
              {TRACKS.map((item) => (
                <label key={item.id} className={`audit-initiate__option-card${track === item.id ? " audit-initiate__option-card--selected" : ""}`}>
                  <input
                    type="radio"
                    name="audit-track"
                    value={item.id}
                    checked={track === item.id}
                    onChange={() => setTrack(item.id)}
                  />
                  <span className="audit-initiate__option-copy">
                    <strong>{t(item.titleKey)}</strong>
                    <span>{t(item.descKey)}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <div className="audit-initiate__section-heading">
            <h2>{t("initiate.steps.population.title")}</h2>
            <p>{t("initiate.steps.population.desc")}</p>
          </div>
          <fieldset className="audit-initiate__fieldset">
            <legend>{t("initiate.fields.circleScope")}</legend>
            <div className="audit-initiate__option-grid audit-initiate__option-grid--2">
              {[
                ["all", t("initiate.scope.all.title"), t("initiate.scope.all.desc")],
                ["selected", t("initiate.scope.selected.title"), t("initiate.scope.selected.desc")],
              ].map(([id,title,desc]) => (
                <label key={id} className={`audit-initiate__option-card${scopeMode === id ? " audit-initiate__option-card--selected" : ""}`}>
                  <input type="radio" name="circle-scope" checked={scopeMode === id} onChange={() => setScopeMode(id)} />
                  <span className="audit-initiate__option-copy"><strong>{title}</strong><span>{desc}</span></span>
                </label>
              ))}
            </div>
          </fieldset>

          {scopeMode === "selected" && (
            <div className="audit-initiate__selection-panel">
              <div className="audit-initiate__selection-head">
                <h3>{t("initiate.fields.selectCircles")}</h3>
                <div>
                  <button type="button" onClick={() => setCircles(circlesAvailable)}>{t("initiate.actions.selectAll")}</button>
                  <button type="button" onClick={() => setCircles([])}>{t("initiate.actions.clear")}</button>
                </div>
              </div>
              <div className="audit-initiate__checkbox-grid">
                {circlesAvailable.map((circle) => (
                  <div className="audit-initiate__check-row" key={circle}>
                    <AppCheckbox
                      label={circle}
                      checked={circles.includes(circle)}
                      onChange={() => setCircles(toggle(circles, circle))}
                    />
                    {renderInfoButton("circle", circle, { circle })}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="audit-initiate__population-summary">
            <span>{t("initiate.summary.population")}</span>
            <strong>{populationRows.length}</strong>
            <span>{t("initiate.summary.returns")}</span>
          </div>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <div className="audit-initiate__section-heading">
            <h2>{t("initiate.steps.readiness.title")}</h2>
            <p>{t("initiate.steps.readiness.desc")}</p>
          </div>

          <div className="audit-initiate__two-col">
            <div className="audit-initiate__selection-panel">
              <div className="audit-initiate__selection-head">
                <h3>{t("initiate.fields.dataQuality")}</h3>
              </div>
              <div className="audit-initiate__checkbox-stack">
                {dataQualityAvailable.map((quality) => (
                  <div className="audit-initiate__check-row" key={quality}>
                    <AppCheckbox
                      label={quality}
                      checked={dataQuality.includes(quality)}
                      onChange={() => setDataQuality(toggle(dataQuality, quality))}
                    />
                    {renderInfoButton("data_quality", quality, { data_quality:quality })}
                  </div>
                ))}
              </div>
            </div>

            <div className="audit-initiate__selection-panel">
              <div className="audit-initiate__selection-head">
                <h3>{t("initiate.fields.coverageTier")}</h3>
              </div>
              <div className="audit-initiate__checkbox-stack">
                {coverageAvailable.map((tier) => (
                  <div className="audit-initiate__check-row" key={tier}>
                    <AppCheckbox
                      label={tier}
                      checked={coverageTiers.includes(tier)}
                      onChange={() => setCoverageTiers(toggle(coverageTiers, tier))}
                    />
                    {renderInfoButton("coverage_tier", tier, { coverage_tier:tier })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="audit-initiate__metric-row">
            <div><span>{t("initiate.summary.population")}</span><strong>{populationRows.length}</strong></div>
            <div><span>{t("initiate.summary.eligibleAfterReadiness")}</span><strong>{readinessRows.length}</strong></div>
            <div><span>{t("initiate.summary.excludedByReadiness")}</span><strong>{populationRows.length - readinessRows.length}</strong></div>
          </div>
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <div className="audit-initiate__section-heading">
            <h2>{t("initiate.steps.criteria.title")}</h2>
            <p>{t("initiate.steps.criteria.desc")}</p>
          </div>

          {track === "population" && (
            <div className="audit-context-card">
              <h2>{t("initiate.populationCriteria.title")}</h2>
              <p>{t("initiate.populationCriteria.desc")}</p>
            </div>
          )}

          {track === "risk" && (
            <div className="audit-initiate__criteria-stack">
              <div className="audit-initiate__selection-panel">
                <div className="audit-initiate__selection-head"><h3>{t("initiate.fields.riskLevel")}</h3></div>
                <div className="audit-initiate__checkbox-grid">
                  {RISK_LEVELS.map((level) => (
                    <div className="audit-initiate__check-row" key={level}>
                      <AppCheckbox label={level} checked={riskLevels.includes(level)} onChange={() => setRiskLevels(toggle(riskLevels, level))} />
                      {renderInfoButton("risk_level", level, { risk_level:level })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="audit-initiate__selection-panel">
                <div className="audit-initiate__selection-head"><h3>{t("initiate.fields.riskSignals")}</h3></div>
                <div className="audit-initiate__rule-list">
                  {SIGNAL_OPTIONS.map(([id,label]) => (
                    <div className="audit-initiate__rule-row" key={id}>
                      <AppCheckbox
                        checked={signals.includes(id)}
                        onChange={() => setSignals(toggle(signals, id))}
                        ariaLabel={`${id} ${label}`}
                      />
                      <button type="button" className="audit-initiate__rule-copy" onClick={() => explain("rule_id", id, { rule_id:id })}>
                        <strong>{id}</strong><span>{label}</span>
                      </button>
                      {renderInfoButton("rule_id", id, { rule_id:id })}
                    </div>
                  ))}
                </div>
                {signals.length > 1 && (
                  <fieldset className="audit-initiate__inline-radio">
                    <legend>{t("initiate.fields.matchLogic")}</legend>
                    <label><input type="radio" name="match-mode" checked={matchMode === "any"} onChange={() => setMatchMode("any")} />{t("initiate.match.any")}</label>
                    <label><input type="radio" name="match-mode" checked={matchMode === "all"} onChange={() => setMatchMode("all")} />{t("initiate.match.all")}</label>
                  </fieldset>
                )}
              </div>
            </div>
          )}

          {track === "control" && (
            <div className="audit-initiate__selection-panel">
              <div className="audit-initiate__selection-head"><h3>{t("initiate.fields.controlFlags")}</h3></div>
              <div className="audit-initiate__rule-list">
                {FLAG_OPTIONS.map(([id,label]) => (
                  <div className="audit-initiate__rule-row" key={id}>
                    <AppCheckbox
                      checked={controlFlags.includes(id)}
                      onChange={() => setControlFlags(toggle(controlFlags, id))}
                      ariaLabel={`${id} ${label}`}
                    />
                    <button type="button" className="audit-initiate__rule-copy" onClick={() => explain("flag_id", id, { flag_id:id })}>
                      <strong>{id}</strong><span>{label}</span>
                    </button>
                    {renderInfoButton("flag_id", id, { flag_id:id })}
                  </div>
                ))}
              </div>
              <div className="audit-context-card audit-initiate__inline-note">
                <p>{t("initiate.controlCriteria.note")}</p>
              </div>
            </div>
          )}

          {track === "manual" && (
            <div className="audit-initiate__selection-panel">
              <div className="audit-initiate__selection-head"><h3>{t("initiate.fields.manualTaxpayers")}</h3></div>
              <AppSearchField
                value={manualSearch}
                onChange={setManualSearch}
                label={t("initiate.fields.searchTaxpayer")}
                placeholder={t("initiate.fields.searchTaxpayer")}
                size="standard"
              />
              <div className="audit-initiate__manual-list">
                {manualRows.map((row) => {
                  const returnId=String(row.return_id);
                  return (
                    <label className="audit-initiate__manual-row" key={returnId}>
                      <AppCheckbox
                        checked={manualReturnIds.includes(returnId)}
                        onChange={() => setManualReturnIds(toggle(manualReturnIds, returnId))}
                        ariaLabel={`${row.taxpayer_name} ${returnId}`}
                      />
                      <span><strong>{String(row.taxpayer_name)}</strong><small>{String(row.tin)} · {returnId} · {String(row.circle)}</small></span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="audit-initiate__population-summary">
            <span>{t("initiate.summary.matchedCriteria")}</span>
            <strong>{matchedRows.length}</strong>
            <span>{t("initiate.summary.candidates")}</span>
          </div>
        </>
      );
    }

    if (step === 4) {
      return (
        <>
          <div className="audit-initiate__section-heading">
            <h2>{t("initiate.steps.preview.title")}</h2>
            <p>{t("initiate.steps.preview.desc")}</p>
          </div>

          <div className="audit-initiate__metric-row">
            <div><span>{t("initiate.summary.population")}</span><strong>{populationRows.length}</strong></div>
            <div><span>{t("initiate.summary.eligibleAfterReadiness")}</span><strong>{readinessRows.length}</strong></div>
            <div><span>{t("initiate.summary.matchedCriteria")}</span><strong>{matchedRows.length}</strong></div>
            <div><span>{t("initiate.summary.finalCandidates")}</span><strong>{finalRows.length}</strong></div>
          </div>

          <div className="table-card audit-initiate__preview-table">
            <ResponsiveTable
              cols={previewCols}
              rows={matchedRows}
              noCard
              clickableKeys={["circle","coverage_tier","signals","risk_level","control_flags"]}
              onCellClick={explain}
              mobileCardMapping={{primary:"taxpayer_name",identifier:"tin",meta:["circle","coverage_tier","risk_level"]}}
              aria-label={t("initiate.steps.preview.title")}
            />
          </div>

          <div className="audit-initiate__selection-panel">
            <div className="audit-initiate__selection-head">
              <h3>{t("initiate.adjustments.title")}</h3>
              <p>{t("initiate.adjustments.desc")}</p>
            </div>
            <div className="audit-initiate__adjustments">
              {matchedRows.map((row) => {
                const id=String(row.return_id);
                const included=!(id in exclusions);
                return (
                  <div className="audit-initiate__adjustment-row" key={id}>
                    <div className="audit-initiate__adjustment-main">
                      <AppCheckbox
                        label={t("initiate.adjustments.include")}
                        checked={included}
                        onChange={(checked) => setExcluded(row, checked)}
                      />
                      <span><strong>{String(row.taxpayer_name)}</strong><small>{id} · {String(row.circle)}</small></span>
                    </div>
                    {!included && (
                      <div className="audit-initiate__exclusion-reason">
                        <label htmlFor={`exclude-${id}`}>{t("initiate.adjustments.reason")}</label>
                        <textarea
                          id={`exclude-${id}`}
                          className="form-textarea"
                          value={exclusions[id] ?? ""}
                          onChange={(e) => setExclusions((prev) => ({...prev,[id]:e.target.value}))}
                          placeholder={t("initiate.adjustments.reasonPlaceholder")}
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="audit-initiate__section-heading">
          <h2>{t("initiate.steps.review.title")}</h2>
          <p>{t("initiate.steps.review.desc")}</p>
        </div>

        <div className="audit-initiate__review-grid">
          <section>
            <h3>{t("initiate.review.scope")}</h3>
            <dl>
              <div><dt>{t("initiate.fields.assessmentYear")}</dt><dd>{assessmentYear}</dd></div>
              <div><dt>{t("initiate.fields.selectionTrack")}</dt><dd>{t(TRACKS.find((item)=>item.id===track)?.titleKey ?? "initiate.tracks.risk.title")}</dd></div>
              <div><dt>{t("initiate.fields.circleScope")}</dt><dd>{scopeMode === "all" ? t("initiate.summary.allCircles") : circles.join(", ")}</dd></div>
            </dl>
          </section>

          <section>
            <h3>{t("initiate.review.criteria")}</h3>
            <dl>
              <div><dt>{t("initiate.fields.dataQuality")}</dt><dd>{dataQuality.join(", ")}</dd></div>
              <div><dt>{t("initiate.fields.coverageTier")}</dt><dd>{coverageTiers.join(", ")}</dd></div>
              {track === "risk" && <div><dt>{t("initiate.fields.riskLevel")}</dt><dd>{riskLevels.join(", ") || "—"}</dd></div>}
              {track === "risk" && <div><dt>{t("initiate.fields.riskSignals")}</dt><dd>{signals.join(", ") || "—"}</dd></div>}
              {track === "control" && <div><dt>{t("initiate.fields.controlFlags")}</dt><dd>{controlFlags.join(", ")}</dd></div>}
              {track === "manual" && <div><dt>{t("initiate.fields.manualTaxpayers")}</dt><dd>{manualReturnIds.length}</dd></div>}
            </dl>
          </section>

          <section className="audit-initiate__review-outcome">
            <h3>{t("initiate.review.outcome")}</h3>
            <strong>{finalRows.length}</strong>
            <p>{t("initiate.review.candidateCount")}</p>
          </section>
        </div>

        <div className="audit-context-card">
          <h2>{t("initiate.review.confirmTitle")}</h2>
          <p>{t("initiate.review.confirmDesc")}</p>
        </div>
      </>
    );
  };

  return (
    <div className="table-page audit-page audit-initiate-page">
      <div className="table-page__header">
        <div>
          <h1 className="table-page__title">{t("initiate.title")}</h1>
          <p className="table-page__desc">{t("initiate.description")}</p>
        </div>
      </div>

      <nav className="audit-stepper" aria-label={t("initiate.progressLabel")}>
        <ol>
          {STEPS.map((id,index) => (
            <li key={id} className={[
              index === step ? "audit-stepper__item--current" : "",
              index < step ? "audit-stepper__item--done" : "",
            ].filter(Boolean).join(" ")}>
              <button
                type="button"
                onClick={() => index <= step && setStep(index)}
                disabled={index > step}
                aria-current={index === step ? "step" : undefined}
              >
                <span className="audit-stepper__number">{index < step ? <Check size={13} aria-hidden="true" /> : index + 1}</span>
                <span>{t(`initiate.stepLabels.${id}`)}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="audit-initiate__card">
        {renderStep()}

        {!stepValid && (
          <p className="audit-initiate__validation" role="status">{t("initiate.validation.completeStep")}</p>
        )}

        <div className="audit-initiate__footer">
          <div>
            <SecondaryButton onClick={saveDraft}>{t("initiate.actions.saveDraft")}</SecondaryButton>
          </div>
          <div className="audit-initiate__footer-right">
            {step > 0 && <SecondaryButton onClick={() => setStep((value) => Math.max(0,value-1))}>{t("initiate.actions.back")}</SecondaryButton>}
            {step < STEPS.length - 1 ? (
              <PrimaryButton disabled={!stepValid} onClick={() => setStep((value) => Math.min(STEPS.length-1,value+1))}>
                {t("initiate.actions.continue")}
              </PrimaryButton>
            ) : (
              <PrimaryButton disabled={!stepValid} onClick={confirmCandidates}>
                {t("initiate.actions.confirmCandidates")}
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>

      <AuditExplainerDrawer explanation={explanation} onClose={() => setExplanation(null)} />
    </div>
  );
}
