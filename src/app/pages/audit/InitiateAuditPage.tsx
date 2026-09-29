import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2, ClipboardList, Database, FileSearch, ListChecks, Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppSearchField } from "../../components/forms/AppSearchField";
import { AppSelectField } from "../../components/forms/AppSelectField";
import { AppNumberField } from "../../components/forms/AppNumberField";
import { AppTextArea } from "../../components/forms/AppTextArea";
import { AppChoiceCard } from "../../components/forms/AppChoiceCard";
import { AppSelectionRow } from "../../components/forms/AppSelectionRow";
import { FormSection } from "../../components/forms/FormSection";
import { AppStepper } from "../../components/shared/AppStepper";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { AppModal } from "../../components/modals/AppModal";
import type { TableRow } from "../modulePageUtils";
import { ALL_TAXPAYER_ROWS } from "./auditData";
import { AuditExplainerDrawer } from "./AuditExplainerDrawer";
import { resolveAuditExplanation, type AuditExplanation } from "./auditKnowledge";
import { addAuditCandidates } from "./auditCandidateStore";

const TRACK_STEPS = {
  population: ["setup", "population", "readiness", "preview", "funnel", "review"],
  risk: ["setup", "population", "readiness", "riskCriteria", "preview", "funnel", "review"],
  control: ["setup", "population", "readiness", "controlCriteria", "preview", "funnel", "review"],
  manual: ["setup", "population", "readiness", "manualSelection", "preview", "funnel", "review"],
} as const;

type TrackId = keyof typeof TRACK_STEPS;

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

interface InitiateAuditModalProps {
  open: boolean;
  onClose: () => void;
  onConfirmed: () => void;
}

export function InitiateAuditModal({ open, onClose, onConfirmed }: InitiateAuditModalProps) {
  const { t, i18n } = useTranslation("audit");

  const assessmentYears = unique("assessment_year");
  const circlesAvailable = unique("circle");
  const dataQualityAvailable = unique("data_quality");
  const coverageAvailable = unique("coverage_tier");

  const [step, setStep] = useState(0);
  const [maxCompletedStep, setMaxCompletedStep] = useState(-1);
  const [assessmentYear, setAssessmentYear] = useState(assessmentYears[0] ?? "2025-26");
  const [track, setTrack] = useState<TrackId>("risk");
  const [scopeMode, setScopeMode] = useState("all");
  const [circles, setCircles] = useState<string[]>([]);
  const [circleSearch, setCircleSearch] = useState("");
  const [dataQualitySearch, setDataQualitySearch] = useState("");
  const [coverageSearch, setCoverageSearch] = useState("");
  const [dataQuality, setDataQuality] = useState<string[]>(dataQualityAvailable);
  const [coverageTiers, setCoverageTiers] = useState<string[]>(coverageAvailable);
  const [riskLevels, setRiskLevels] = useState<string[]>([]);
  const [signals, setSignals] = useState<string[]>([]);
  const [controlFlags, setControlFlags] = useState<string[]>([]);
  const [manualReturnIds, setManualReturnIds] = useState<string[]>([]);
  const [manualSearch, setManualSearch] = useState("");
  const [riskLevelSearch, setRiskLevelSearch] = useState("");
  const [riskSignalSearch, setRiskSignalSearch] = useState("");
  const [funnelMode, setFunnelMode] = useState("all");
  const [funnelPercentage, setFunnelPercentage] = useState("10");
  const [funnelFixedCount, setFunnelFixedCount] = useState("200");
  const [funnelMinimum, setFunnelMinimum] = useState("200");
  const [funnelMaximum, setFunnelMaximum] = useState("2000");
  const [exclusions, setExclusions] = useState<Record<string,string>>({});
  const [explanation, setExplanation] = useState<AuditExplanation | null>(null);

  const activeSteps = TRACK_STEPS[track];
  const activeStepId = activeSteps[step] ?? activeSteps[activeSteps.length - 1];

  const baseYearRows = useMemo(
    () => ALL_TAXPAYER_ROWS.filter((row) => String(row.assessment_year) === assessmentYear),
    [assessmentYear],
  );

  const populationRows = useMemo(() => {
    if (scopeMode === "all") return baseYearRows;
    return baseYearRows.filter((row) => circles.includes(String(row.circle)));
  }, [baseYearRows, scopeMode, circles]);

  const filteredCircles = useMemo(() => {
    const needle = circleSearch.trim().toLowerCase();
    if (!needle) return circlesAvailable;
    return circlesAvailable.filter((circle) => circle.toLowerCase().includes(needle));
  }, [circleSearch, circlesAvailable]);

  const filteredDataQuality = useMemo(() => {
    const needle = dataQualitySearch.trim().toLowerCase();
    if (!needle) return dataQualityAvailable;
    return dataQualityAvailable.filter((quality) => quality.toLowerCase().includes(needle));
  }, [dataQualitySearch, dataQualityAvailable]);

  const filteredCoverageTiers = useMemo(() => {
    const needle = coverageSearch.trim().toLowerCase();
    if (!needle) return coverageAvailable;
    return coverageAvailable.filter((tier) => tier.toLowerCase().includes(needle));
  }, [coverageSearch, coverageAvailable]);

  const readinessRows = useMemo(() => populationRows.filter((row) =>
    dataQuality.includes(String(row.data_quality)) &&
    coverageTiers.includes(String(row.coverage_tier))
  ), [populationRows, dataQuality, coverageTiers]);

  const matchedRows = useMemo(() => readinessRows.filter((row) => {
    if (track === "population") return true;

    if (track === "risk") {
      if (riskLevels.length === 0 && signals.length === 0) return false;
      const riskOk = riskLevels.length === 0 || riskLevels.includes(String(row.risk_level));
      const rowSignals = signalIds(row.signals);
      const signalOk = signals.length === 0
        ? true
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
  }), [readinessRows, track, riskLevels, signals, controlFlags, manualReturnIds]);

  const previewRows = useMemo(
    () => matchedRows.filter((row) => !(String(row.return_id) in exclusions)),
    [matchedRows, exclusions],
  );

  const previewExclusionsValid = useMemo(
    () => matchedRows.every((row) => {
      const id=String(row.return_id);
      return !(id in exclusions) || exclusions[id].trim().length > 0;
    }),
    [matchedRows, exclusions],
  );

  const funnelTargetCount = useMemo(() => {
    const available = previewRows.length;
    if (available === 0 || funnelMode === "all") return available;

    const percentage = Number(funnelPercentage);
    const fixedCount = Number(funnelFixedCount);
    const minimum = Number(funnelMinimum);
    const maximum = Number(funnelMaximum);

    if (funnelMode === "percentage") {
      const target = Number.isFinite(percentage) ? Math.ceil(available * percentage / 100) : 0;
      return Math.min(available, Math.max(0, target));
    }

    if (funnelMode === "fixed") {
      const target = Number.isFinite(fixedCount) ? Math.floor(fixedCount) : 0;
      return Math.min(available, Math.max(0, target));
    }

    const base = Number.isFinite(percentage) ? Math.ceil(available * percentage / 100) : 0;
    const minValue = Number.isFinite(minimum) ? Math.max(0, Math.floor(minimum)) : 0;
    const maxValue = Number.isFinite(maximum) ? Math.max(0, Math.floor(maximum)) : available;
    const bounded = Math.min(Math.max(base, minValue), maxValue);
    return Math.min(available, Math.max(0, bounded));
  }, [previewRows.length, funnelMode, funnelPercentage, funnelFixedCount, funnelMinimum, funnelMaximum]);

  const funnelRows = useMemo(
    () => previewRows.slice(0, funnelTargetCount),
    [previewRows, funnelTargetCount],
  );

  const finalRows = funnelRows;

  const manualRows = useMemo(() => {
    const needle = manualSearch.trim().toLowerCase();
    return readinessRows.filter((row) => !needle || [
      row.taxpayer_name, row.tin, row.return_id, row.circle,
    ].some((value) => String(value ?? "").toLowerCase().includes(needle)));
  }, [readinessRows, manualSearch]);

  const filteredRiskLevels = useMemo(() => {
    const needle = riskLevelSearch.trim().toLowerCase();
    if (!needle) return RISK_LEVELS;
    return RISK_LEVELS.filter((level) => level.toLowerCase().includes(needle));
  }, [riskLevelSearch]);

  const filteredSignalOptions = useMemo(() => {
    const needle = riskSignalSearch.trim().toLowerCase();
    if (!needle) return SIGNAL_OPTIONS;
    return SIGNAL_OPTIONS.filter(([id, label]) =>
      id.toLowerCase().includes(needle) || label.toLowerCase().includes(needle)
    );
  }, [riskSignalSearch]);

  const stepValid = useMemo(() => {
    switch (activeStepId) {
      case "setup":
        return !!assessmentYear && !!track;
      case "population":
        return scopeMode === "all" || circles.length > 0;
      case "readiness":
        return dataQuality.length > 0 && coverageTiers.length > 0;
      case "riskCriteria":
        return riskLevels.length > 0 || signals.length > 0;
      case "controlCriteria":
        return controlFlags.length > 0;
      case "manualSelection":
        return manualReturnIds.length > 0;
      case "funnel": {
        if (previewRows.length === 0) return false;
        const percentage = Number(funnelPercentage);
        const fixedCount = Number(funnelFixedCount);
        const minimum = Number(funnelMinimum);
        const maximum = Number(funnelMaximum);
        if (funnelMode === "all") return true;
        if (funnelMode === "percentage") return percentage > 0 && percentage <= 100;
        if (funnelMode === "fixed") return fixedCount > 0;
        return percentage > 0 && percentage <= 100 && minimum >= 0 && maximum > 0 && maximum >= minimum;
      }
      case "preview":
        return matchedRows.length > 0 && previewRows.length > 0 && previewExclusionsValid;
      case "review":
        return finalRows.length > 0;
      default:
        return false;
    }
  }, [activeStepId, assessmentYear, track, scopeMode, circles, dataQuality, coverageTiers, riskLevels, signals, controlFlags, manualReturnIds, matchedRows.length, previewRows.length, previewExclusionsValid, funnelMode, funnelPercentage, funnelFixedCount, funnelMinimum, funnelMaximum, finalRows]);


  const explain = (key: string, value: string, row: TableRow) => {
    const resolved = resolveAuditExplanation(key, value, row, i18n.resolvedLanguage);
    if (resolved) setExplanation(resolved);
  };

  const handleTrackSelect = (value: string) => {
    const nextTrack = value as TrackId;
    if (nextTrack === track) return;

    setTrack(nextTrack);
    setStep(0);
    setMaxCompletedStep(-1);
    setRiskLevels([]);
    setSignals([]);
    setControlFlags([]);
    setManualReturnIds([]);
    setManualSearch("");
    setRiskLevelSearch("");
    setRiskSignalSearch("");
    setFunnelMode("all");
    setFunnelPercentage("10");
    setFunnelFixedCount("200");
    setFunnelMinimum("200");
    setFunnelMaximum("2000");
    setExclusions({});
  };

  const funnelBasis = useMemo(() => {
    if (funnelMode === "all") return t("initiate.funnel.modes.all.title");
    if (funnelMode === "percentage") return t("initiate.funnel.basis.percentage", { percentage:funnelPercentage });
    if (funnelMode === "fixed") return t("initiate.funnel.basis.fixed", { count:funnelFixedCount });
    return t("initiate.funnel.basis.limited", {
      percentage:funnelPercentage,
      minimum:funnelMinimum,
      maximum:funnelMaximum,
    });
  }, [funnelMode, funnelPercentage, funnelFixedCount, funnelMinimum, funnelMaximum, t]);

  const selectionBasis = useMemo(() => {
    const scope = scopeMode === "all" ? t("initiate.summary.allCircles") : circles.join(", ");
    if (track === "population") return `Population selection · ${scope} · ${funnelBasis}`;
    if (track === "risk") {
      const parts = [
        riskLevels.length ? `Risk: ${riskLevels.join(", ")}` : "",
        signals.length ? `Signals: ${signals.join(", ")}` : "",
      ].filter(Boolean).join(" · ");
      return `Risk-based · ${scope} · ${parts} · ${funnelBasis}`;
    }
    if (track === "control") return `Control / Data Quality · ${scope} · ${controlFlags.join(", ")} · ${funnelBasis}`;
    return `Manual selection · ${scope} · ${funnelBasis}`;
  }, [scopeMode, circles, track, riskLevels, signals, controlFlags, funnelBasis, t]);

  const confirmCandidates = () => {
    if (!finalRows.length) return;
    addAuditCandidates(finalRows, {
      assessmentYear,
      track: TRACKS.find((item) => item.id === track)?.id ?? track,
      selectionBasis,
    });
    toast.success(t("initiate.toast.candidatesConfirmed", { count: finalRows.length }));
    onConfirmed();
    onClose();
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

  const populationStepIndex = activeSteps.indexOf("population");
  const readinessStepIndex = activeSteps.indexOf("readiness");
  const criteriaStepIndex = activeSteps.findIndex((id) =>
    id === "riskCriteria" || id === "controlCriteria" || id === "manualSelection"
  );
  const matchedStepIndex = criteriaStepIndex >= 0 ? criteriaStepIndex : readinessStepIndex;
  const previewStepIndex = activeSteps.indexOf("preview");
  const funnelStepIndex = activeSteps.indexOf("funnel");

  const impactValue = (requiredCompletedStep: number, value: number): number | string =>
    requiredCompletedStep >= 0 && maxCompletedStep >= requiredCompletedStep ? value : "—";

  const selectionImpactPanel = (
    <FormSection
      title={t("initiate.impact.title")}
      description={t("initiate.impact.description")}
    >
      <dl className="form-summary-list form-summary-list--compact">
        {[
          {
            label:t("initiate.summary.population"),
            value:impactValue(populationStepIndex, populationRows.length),
            help:t("initiate.impact.populationHelp"),
          },
          {
            label:t("initiate.summary.eligibleAfterReadiness"),
            value:impactValue(readinessStepIndex, readinessRows.length),
            help:t("initiate.impact.eligibleHelp"),
          },
          {
            label:t("initiate.summary.excludedByReadiness"),
            value:impactValue(readinessStepIndex, populationRows.length-readinessRows.length),
            help:t("initiate.impact.excludedHelp"),
          },
          {
            label:t("initiate.summary.matchedCriteria"),
            value:impactValue(matchedStepIndex, matchedRows.length),
            help:t("initiate.impact.matchedHelp"),
          },
          {
            label:t("initiate.summary.afterPreview"),
            value:impactValue(previewStepIndex, previewRows.length),
            help:t("initiate.impact.previewHelp"),
          },
          {
            label:t("initiate.summary.finalCandidates"),
            value:impactValue(funnelStepIndex, finalRows.length),
            help:t("initiate.impact.finalHelp"),
          },
        ].map(({ label, value, help }) => (
          <div className="form-summary-list__row" key={label}>
            <dt className="form-summary-list__label">
              {label}
              <p className="form-helper">{help}</p>
            </dt>
            <dd className="form-summary-list__value">{value}</dd>
          </div>
        ))}
      </dl>
    </FormSection>
  );

  const stepperSteps = activeSteps.map((id) => ({
    id,
    label: t(`initiate.stepLabels.${id}`),
  }));

  const renderStep = () => {
    if (activeStepId === "setup") {
      return (
        <div className="form-stack">
          <FormSection
            title={t("initiate.steps.setup.title")}
            description={t("initiate.steps.setup.desc")}
            icon={ClipboardList}
          >
            <div className="entry-form__grid">
              <AppSelectField
                id="audit-assessment-year"
                label={t("initiate.fields.assessmentYear")}
                value={assessmentYear}
                onChange={setAssessmentYear}
                options={assessmentYears}
                required
              />
            </div>
          </FormSection>

          <FormSection title={t("initiate.fields.selectionTrack")} icon={FileSearch}>
            <div className="app-choice-grid">
              {TRACKS.map((item) => (
                <AppChoiceCard
                  key={item.id}
                  name="audit-track"
                  value={item.id}
                  title={t(item.titleKey)}
                  description={t(item.descKey)}
                  selected={track === item.id}
                  onSelect={handleTrackSelect}
                />
              ))}
            </div>
          </FormSection>
        </div>
      );
    }

    if (activeStepId === "population") {
      return (
        <div className="form-stack">
          <FormSection
            title={t("initiate.steps.population.title")}
            description={t("initiate.steps.population.desc")}
            icon={Users}
          >
            <div className="app-choice-grid">
              <AppChoiceCard
                name="circle-scope"
                value="all"
                title={t("initiate.scope.all.title")}
                description={t("initiate.scope.all.desc")}
                selected={scopeMode === "all"}
                onSelect={setScopeMode}
              />
              <AppChoiceCard
                name="circle-scope"
                value="selected"
                title={t("initiate.scope.selected.title")}
                description={t("initiate.scope.selected.desc")}
                selected={scopeMode === "selected"}
                onSelect={setScopeMode}
              />
            </div>
          </FormSection>

          {scopeMode === "selected" && (
            <FormSection title={t("initiate.fields.selectCircles")} icon={ListChecks}>
              <div className="form-section__toolbar">
                <div className="form-section__toolbar-search">
                  <AppSearchField
                    value={circleSearch}
                    onChange={setCircleSearch}
                    label={t("initiate.fields.searchCircles")}
                    placeholder={t("initiate.fields.searchCircles")}
                    size="compact"
                  />
                </div>
                <div className="form-section__toolbar-actions">
                  {circles.length < circlesAvailable.length && (
                    <SecondaryButton size="sm" onClick={() => setCircles(circlesAvailable)}>
                      {t("initiate.actions.selectAll")}
                    </SecondaryButton>
                  )}
                  {circles.length > 0 && (
                    <SecondaryButton size="sm" onClick={() => setCircles([])}>
                      {t("initiate.actions.clear")}
                    </SecondaryButton>
                  )}
                </div>
              </div>

              {filteredCircles.length > 0 ? (
                <div className="app-selection-grid">
                  {filteredCircles.map((circle) => (
                    <AppSelectionRow
                      key={circle}
                      title={circle}
                      checked={circles.includes(circle)}
                      onChange={() => setCircles(toggle(circles, circle))}
                      onInfo={() => explain("circle", circle, { circle })}
                      infoLabel={t("initiate.explain", { value: circle })}
                    />
                  ))}
                </div>
              ) : (
                <p className="form-helper">{t("initiate.validation.noCirclesFound")}</p>
              )}
            </FormSection>
          )}
        </div>
      );
    }

    if (activeStepId === "readiness") {
      return (
        <div className="form-stack">
          <FormSection
            title={t("initiate.steps.readiness.title")}
            description={t("initiate.steps.readiness.desc")}
            icon={Database}
          >
            <div className="form-section-grid">
              <section className="form-subsection form-subsection--boxed">
                <div className="form-subsection__heading">
                  <h4 className="form-subsection__title">{t("initiate.fields.dataQuality")}</h4>
                  <p className="form-subsection__description">{t("initiate.readiness.dataQualityHelp")}</p>
                </div>
                <div className="form-section__toolbar">
                  <div className="form-section__toolbar-search">
                    <AppSearchField
                      value={dataQualitySearch}
                      onChange={setDataQualitySearch}
                      label={t("initiate.fields.searchDataQuality")}
                      placeholder={t("initiate.fields.searchDataQuality")}
                      size="compact"
                    />
                  </div>
                  <div className="form-section__toolbar-actions">
                    {dataQuality.length < dataQualityAvailable.length && (
                      <SecondaryButton size="sm" onClick={() => setDataQuality(dataQualityAvailable)}>
                        {t("initiate.actions.selectAll")}
                      </SecondaryButton>
                    )}
                    {dataQuality.length > 0 && (
                      <SecondaryButton size="sm" onClick={() => setDataQuality([])}>
                        {t("initiate.actions.clear")}
                      </SecondaryButton>
                    )}
                  </div>
                </div>
                <div className="app-selection-stack">
                  {filteredDataQuality.map((quality) => (
                    <AppSelectionRow
                      key={quality}
                      title={quality}
                      checked={dataQuality.includes(quality)}
                      onChange={() => setDataQuality(toggle(dataQuality, quality))}
                      onInfo={() => explain("data_quality", quality, { data_quality:quality })}
                      infoLabel={t("initiate.explain", { value: quality })}
                    />
                  ))}
                </div>
              </section>

              <section className="form-subsection form-subsection--boxed">
                <div className="form-subsection__heading">
                  <h4 className="form-subsection__title">{t("initiate.fields.coverageTier")}</h4>
                  <p className="form-subsection__description">{t("initiate.readiness.coverageHelp")}</p>
                </div>
                <div className="form-section__toolbar">
                  <div className="form-section__toolbar-search">
                    <AppSearchField
                      value={coverageSearch}
                      onChange={setCoverageSearch}
                      label={t("initiate.fields.searchCoverageTier")}
                      placeholder={t("initiate.fields.searchCoverageTier")}
                      size="compact"
                    />
                  </div>
                  <div className="form-section__toolbar-actions">
                    {coverageTiers.length < coverageAvailable.length && (
                      <SecondaryButton size="sm" onClick={() => setCoverageTiers(coverageAvailable)}>
                        {t("initiate.actions.selectAll")}
                      </SecondaryButton>
                    )}
                    {coverageTiers.length > 0 && (
                      <SecondaryButton size="sm" onClick={() => setCoverageTiers([])}>
                        {t("initiate.actions.clear")}
                      </SecondaryButton>
                    )}
                  </div>
                </div>
                <div className="app-selection-stack">
                  {filteredCoverageTiers.map((tier) => (
                    <AppSelectionRow
                      key={tier}
                      title={tier}
                      checked={coverageTiers.includes(tier)}
                      onChange={() => setCoverageTiers(toggle(coverageTiers, tier))}
                      onInfo={() => explain("coverage_tier", tier, { coverage_tier:tier })}
                      infoLabel={t("initiate.explain", { value: tier })}
                    />
                  ))}
                </div>
              </section>
            </div>
          </FormSection>
        </div>
      );
    }

    if (activeStepId === "riskCriteria") {
      return (
        <div className="form-stack">
          <FormSection
            title={t("initiate.steps.riskCriteria.title")}
            description={t("initiate.steps.riskCriteria.desc")}
            icon={FileSearch}
          >
            <div className="form-stack">
              <section className="form-subsection">
                <div className="form-subsection__heading">
                  <h4 className="form-subsection__title">{t("initiate.fields.riskLevel")}</h4>
                </div>
                <div className="form-section__toolbar">
                  <div className="form-section__toolbar-search">
                    <AppSearchField
                      value={riskLevelSearch}
                      onChange={setRiskLevelSearch}
                      label={t("initiate.fields.searchRiskLevel")}
                      placeholder={t("initiate.fields.searchRiskLevel")}
                      size="compact"
                    />
                  </div>
                  <div className="form-section__toolbar-actions">
                    {riskLevels.length < RISK_LEVELS.length && (
                      <SecondaryButton size="sm" onClick={() => setRiskLevels([...RISK_LEVELS])}>
                        {t("initiate.actions.selectAll")}
                      </SecondaryButton>
                    )}
                    {riskLevels.length > 0 && (
                      <SecondaryButton size="sm" onClick={() => setRiskLevels([])}>
                        {t("initiate.actions.clear")}
                      </SecondaryButton>
                    )}
                  </div>
                </div>
                {filteredRiskLevels.length > 0 ? (
                  <div className="app-selection-grid">
                    {filteredRiskLevels.map((level) => (
                      <AppSelectionRow
                        key={level}
                        title={level}
                        checked={riskLevels.includes(level)}
                        onChange={() => setRiskLevels(toggle(riskLevels, level))}
                        onInfo={() => explain("risk_level", level, { risk_level:level })}
                        infoLabel={t("initiate.explain", { value: level })}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="form-helper">{t("initiate.validation.noResults")}</p>
                )}
              </section>

              <section className="form-subsection">
                <div className="form-subsection__heading">
                  <h4 className="form-subsection__title">{t("initiate.fields.riskSignals")}</h4>
                  <p className="form-subsection__description">{t("initiate.riskSignals.help")}</p>
                </div>
                <div className="form-section__toolbar">
                  <div className="form-section__toolbar-search">
                    <AppSearchField
                      value={riskSignalSearch}
                      onChange={setRiskSignalSearch}
                      label={t("initiate.riskSignals.searchLabel")}
                      placeholder={t("initiate.riskSignals.searchPlaceholder")}
                      size="compact"
                    />
                  </div>
                  <div className="form-section__toolbar-actions">
                    {signals.length < SIGNAL_OPTIONS.length && (
                      <SecondaryButton size="sm" onClick={() => setSignals(SIGNAL_OPTIONS.map(([id]) => id))}>
                        {t("initiate.actions.selectAll")}
                      </SecondaryButton>
                    )}
                    {signals.length > 0 && (
                      <SecondaryButton size="sm" onClick={() => setSignals([])}>
                        {t("initiate.actions.clear")}
                      </SecondaryButton>
                    )}
                  </div>
                </div>
                <p className="form-helper">
                  {t("initiate.riskSignals.selectedCount", { count: signals.length })}
                </p>
                {filteredSignalOptions.length > 0 ? (
                  <div className="app-selection-grid">
                    {filteredSignalOptions.map(([id,label]) => (
                      <AppSelectionRow
                        key={id}
                        code={id}
                        title={label}
                        checked={signals.includes(id)}
                        onChange={() => setSignals(toggle(signals, id))}
                        onInfo={() => explain("rule_id", id, { rule_id:id })}
                        infoLabel={t("initiate.explain", { value: id })}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="form-helper">{t("initiate.riskSignals.noResults")}</p>
                )}
              </section>


            </div>
          </FormSection>
        </div>
      );
    }

    if (activeStepId === "controlCriteria") {
      return (
        <div className="form-stack">
          <FormSection
            title={t("initiate.steps.controlCriteria.title")}
            description={t("initiate.steps.controlCriteria.desc")}
            icon={FileSearch}
          >
            <section className="form-subsection">
              <div className="form-subsection__heading">
                <h4 className="form-subsection__title">{t("initiate.fields.controlFlags")}</h4>
                <p className="form-subsection__description">{t("initiate.controlCriteria.note")}</p>
              </div>
              <div className="app-selection-grid">
                {FLAG_OPTIONS.map(([id,label]) => (
                  <AppSelectionRow
                    key={id}
                    code={id}
                    title={label}
                    checked={controlFlags.includes(id)}
                    onChange={() => setControlFlags(toggle(controlFlags, id))}
                    onInfo={() => explain("flag_id", id, { flag_id:id })}
                    infoLabel={t("initiate.explain", { value: id })}
                  />
                ))}
              </div>
            </section>
          </FormSection>
        </div>
      );
    }

    if (activeStepId === "manualSelection") {
      return (
        <div className="form-stack">
          <FormSection
            title={t("initiate.steps.manualSelection.title")}
            description={t("initiate.steps.manualSelection.desc")}
            icon={FileSearch}
          >
            <section className="form-subsection">
              <div className="form-subsection__heading">
                <h4 className="form-subsection__title">{t("initiate.fields.manualTaxpayers")}</h4>
              </div>
              <AppSearchField
                value={manualSearch}
                onChange={setManualSearch}
                label={t("initiate.fields.searchTaxpayer")}
                placeholder={t("initiate.fields.searchTaxpayer")}
                size="standard"
              />
              <div className="app-selection-stack">
                {manualRows.map((row) => {
                  const returnId=String(row.return_id);
                  return (
                    <AppSelectionRow
                      key={returnId}
                      title={String(row.taxpayer_name)}
                      description={`${String(row.tin)} · ${returnId} · ${String(row.circle)}`}
                      checked={manualReturnIds.includes(returnId)}
                      onChange={() => setManualReturnIds(toggle(manualReturnIds, returnId))}
                    />
                  );
                })}
              </div>
            </section>
          </FormSection>
        </div>
      );
    }

    if (activeStepId === "funnel") {
      return (
        <div className="form-stack">
          <FormSection
            title={t("initiate.steps.funnel.title")}
            description={t("initiate.steps.funnel.desc")}
            icon={Users}
          >
            <div className="app-choice-grid">
              {[
                ["all", "initiate.funnel.modes.all.title", "initiate.funnel.modes.all.desc"],
                ["percentage", "initiate.funnel.modes.percentage.title", "initiate.funnel.modes.percentage.desc"],
                ["fixed", "initiate.funnel.modes.fixed.title", "initiate.funnel.modes.fixed.desc"],
                ["limited", "initiate.funnel.modes.limited.title", "initiate.funnel.modes.limited.desc"],
              ].map(([value,titleKey,descKey]) => (
                <AppChoiceCard
                  key={value}
                  name="funnel-mode"
                  value={value}
                  title={t(titleKey)}
                  description={t(descKey)}
                  selected={funnelMode === value}
                  onSelect={setFunnelMode}
                />
              ))}
            </div>

            {funnelMode !== "all" && (
              <section className="form-subsection">
                <div className="entry-form__grid">
                  {(funnelMode === "percentage" || funnelMode === "limited") && (
                    <AppNumberField
                      id="audit-funnel-percentage"
                      label={t("initiate.funnel.fields.percentage")}
                      value={funnelPercentage}
                      onChange={setFunnelPercentage}
                      min={1}
                      max={100}
                      step={1}
                      required
                      helper={t("initiate.funnel.helpers.percentage")}
                    />
                  )}
                  {funnelMode === "fixed" && (
                    <AppNumberField
                      id="audit-funnel-fixed"
                      label={t("initiate.funnel.fields.fixedCount")}
                      value={funnelFixedCount}
                      onChange={setFunnelFixedCount}
                      min={1}
                      step={1}
                      required
                    />
                  )}
                  {funnelMode === "limited" && (
                    <>
                      <AppNumberField
                        id="audit-funnel-minimum"
                        label={t("initiate.funnel.fields.minimum")}
                        value={funnelMinimum}
                        onChange={setFunnelMinimum}
                        min={0}
                        step={1}
                        required
                      />
                      <AppNumberField
                        id="audit-funnel-maximum"
                        label={t("initiate.funnel.fields.maximum")}
                        value={funnelMaximum}
                        onChange={setFunnelMaximum}
                        min={1}
                        step={1}
                        required
                      />
                    </>
                  )}
                </div>
              </section>
            )}

            <section className="form-subsection">
              <dl className="form-summary-list">
                <div className="form-summary-list__row">
                  <dt className="form-summary-list__label">{t("initiate.summary.afterPreview")}</dt>
                  <dd className="form-summary-list__value">{previewRows.length}</dd>
                </div>
                <div className="form-summary-list__row">
                  <dt className="form-summary-list__label">{t("initiate.summary.finalCandidates")}</dt>
                  <dd className="form-summary-list__value">{finalRows.length}</dd>
                </div>
              </dl>
              <p className="form-helper">{t("initiate.funnel.orderingNote")}</p>
            </section>
          </FormSection>
        </div>
      );
    }

    if (activeStepId === "preview") {
      return (
        <div className="form-stack">
          <FormSection
            title={t("initiate.steps.preview.title")}
            description={t("initiate.steps.preview.desc")}
            icon={ListChecks}
          >
            <section className="form-subsection">
              <div className="form-subsection__heading">
                <h4 className="form-subsection__title">
                  {t("initiate.previewSummary.initialList", { count:matchedRows.length })}
                </h4>
                <p className="form-subsection__description">{t("initiate.adjustments.desc")}</p>
              </div>
              <div className="app-selection-stack">
                {matchedRows.map((row) => {
                  const id=String(row.return_id);
                  const included=!(id in exclusions);
                  const meta=[
                    String(row.tin),
                    String(row.circle),
                    String(row.coverage_tier),
                    String(row.signals),
                    String(row.risk_level),
                    String(row.control_flags),
                  ].filter((value) => value && value !== "—").join(" · ");
                  return (
                    <div className="form-stack" key={id}>
                      <AppSelectionRow
                        title={String(row.taxpayer_name)}
                        description={meta}
                        checked={included}
                        onChange={(checked) => setExcluded(row, checked)}
                        onInfo={() => explain("candidate_record", String(row.taxpayer_name), row)}
                        infoLabel={t("initiate.previewInfo", { value: String(row.taxpayer_name) })}
                      />
                      {!included && (
                        <AppTextArea
                          id={`exclude-${id}`}
                          label={t("initiate.adjustments.reason")}
                          value={exclusions[id] ?? ""}
                          onChange={(value) => setExclusions((prev) => ({...prev,[id]:value}))}
                          placeholder={t("initiate.adjustments.reasonPlaceholder")}
                          rows={2}
                          required
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="form-helper">
                {t("initiate.previewSummary.keptCount", { count:previewRows.length })}
              </p>
            </section>
          </FormSection>
        </div>
      );
    }

    return (
      <div className="form-stack">
        <FormSection
          title={t("initiate.steps.review.title")}
          description={t("initiate.steps.review.desc")}
          icon={CheckCircle2}
        >
          <div className="form-section-grid">
            <section className="form-subsection">
              <div className="form-subsection__heading">
                <h4 className="form-subsection__title">{t("initiate.review.scope")}</h4>
              </div>
              <dl className="form-summary-list">
                <div className="form-summary-list__row">
                  <dt className="form-summary-list__label">{t("initiate.fields.assessmentYear")}</dt>
                  <dd className="form-summary-list__value">{assessmentYear}</dd>
                </div>
                <div className="form-summary-list__row">
                  <dt className="form-summary-list__label">{t("initiate.fields.selectionTrack")}</dt>
                  <dd className="form-summary-list__value">{t(TRACKS.find((item)=>item.id===track)?.titleKey ?? "initiate.tracks.risk.title")}</dd>
                </div>
                <div className="form-summary-list__row">
                  <dt className="form-summary-list__label">{t("initiate.fields.circleScope")}</dt>
                  <dd className="form-summary-list__value">{scopeMode === "all" ? t("initiate.summary.allCircles") : circles.join(", ")}</dd>
                </div>
              </dl>
            </section>

            <section className="form-subsection">
              <div className="form-subsection__heading">
                <h4 className="form-subsection__title">{t("initiate.review.criteria")}</h4>
              </div>
              <dl className="form-summary-list">
                <div className="form-summary-list__row">
                  <dt className="form-summary-list__label">{t("initiate.fields.dataQuality")}</dt>
                  <dd className="form-summary-list__value">{dataQuality.join(", ")}</dd>
                </div>
                <div className="form-summary-list__row">
                  <dt className="form-summary-list__label">{t("initiate.fields.coverageTier")}</dt>
                  <dd className="form-summary-list__value">{coverageTiers.join(", ")}</dd>
                </div>
                {track === "risk" && (
                  <>
                    <div className="form-summary-list__row">
                      <dt className="form-summary-list__label">{t("initiate.fields.riskLevel")}</dt>
                      <dd className="form-summary-list__value">{riskLevels.join(", ") || "—"}</dd>
                    </div>
                    <div className="form-summary-list__row">
                      <dt className="form-summary-list__label">{t("initiate.fields.riskSignals")}</dt>
                      <dd className="form-summary-list__value">{signals.join(", ") || "—"}</dd>
                    </div>
                  </>
                )}
                {track === "control" && (
                  <div className="form-summary-list__row">
                    <dt className="form-summary-list__label">{t("initiate.fields.controlFlags")}</dt>
                    <dd className="form-summary-list__value">{controlFlags.join(", ")}</dd>
                  </div>
                )}
                <div className="form-summary-list__row">
                  <dt className="form-summary-list__label">{t("initiate.review.funnelRule")}</dt>
                  <dd className="form-summary-list__value">{funnelBasis}</dd>
                </div>
              </dl>
            </section>
          </div>

          <section className="form-subsection">
            <div className="form-subsection__heading">
              <h4 className="form-subsection__title">
                {t("initiate.review.finalList", { count:finalRows.length })}
              </h4>
              <p className="form-subsection__description">{t("initiate.review.finalListHelp")}</p>
            </div>
            <div className="app-selection-stack">
              {finalRows.map((row) => {
                const id=String(row.return_id);
                const meta=[
                  String(row.tin),
                  String(row.circle),
                  String(row.coverage_tier),
                  String(row.signals),
                  String(row.risk_level),
                  String(row.control_flags),
                ].filter((value) => value && value !== "—").join(" · ");
                return (
                  <AppSelectionRow
                    key={id}
                    title={String(row.taxpayer_name)}
                    description={meta}
                    checked
                    disabled
                    onChange={() => {}}
                    onInfo={() => explain("candidate_record", String(row.taxpayer_name), row)}
                    infoLabel={t("initiate.previewInfo", { value: String(row.taxpayer_name) })}
                  />
                );
              })}
            </div>
            <p className="form-helper">{t("initiate.review.confirmDesc")}</p>
          </section>
        </FormSection>
      </div>
    );
  };

  const modalFooter = (
    <>
      {step > 0 && (
        <SecondaryButton size="sm" onClick={() => setStep((value) => Math.max(0,value-1))}>
          {t("initiate.actions.back")}
        </SecondaryButton>
      )}
      {step < activeSteps.length - 1 ? (
        <PrimaryButton
          size="sm"
          disabled={!stepValid}
          onClick={() => {
            setMaxCompletedStep((value) => Math.max(value, step));
            setStep((value) => Math.min(activeSteps.length-1,value+1));
          }}
        >
          {t("initiate.actions.continue")}
        </PrimaryButton>
      ) : (
        <PrimaryButton size="sm" disabled={!stepValid} onClick={confirmCandidates}>
          {t("initiate.actions.confirmCandidates")}
        </PrimaryButton>
      )}
    </>
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={t("initiate.title")}
      icon={<ClipboardList size={17} strokeWidth={1.8} />}
      size="xxxl"
      footer={modalFooter}
      describedBy="initiate-audit-description"
    >
      <div className="form-stack">
        <p id="initiate-audit-description" className="form-helper">
          {t("initiate.description")}
        </p>

        <AppStepper
          steps={stepperSteps}
          currentStep={step}
          onStepChange={setStep}
          ariaLabel={t("initiate.progressLabel")}
        />

        <div className="app-wizard-layout">
          <div className="app-wizard-main">
            {renderStep()}

            {!stepValid && (
              <p className="form-error" role="status">{t("initiate.validation.completeStep")}</p>
            )}
          </div>

          <aside className="app-wizard-aside" aria-label={t("initiate.impact.title")}>
            {selectionImpactPanel}
          </aside>
        </div>

        <AuditExplainerDrawer explanation={explanation} onClose={() => setExplanation(null)} />
      </div>
    </AppModal>
  );
}
