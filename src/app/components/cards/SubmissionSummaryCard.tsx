import type { IconComponent } from "../../pages/modulePageUtils";

interface SubmissionSummaryCardProps {
  title: string;
  icon: IconComponent;
  tone?: "primary" | "success";
  variant?: "default" | "summary";
  totalSubmission: string;
  taxPaid173: string;
  totalTaxPaid: string;
  labelTotalSubmission: string;
  labelTaxPaid173: string;
  labelTotalTaxPaid: string;
}

export function SubmissionSummaryCard({
  title,
  icon: Icon,
  tone = "primary",
  variant = "default",
  totalSubmission,
  taxPaid173,
  totalTaxPaid,
  labelTotalSubmission,
  labelTaxPaid173,
  labelTotalTaxPaid,
}: SubmissionSummaryCardProps) {
  const isSummary = variant === "summary";
  return (
    <article
      className={[
        "submission-summary-card",
        `submission-summary-card--${tone}`,
        isSummary ? "submission-summary-card--summary" : "",
      ].filter(Boolean).join(" ")}
      aria-label={title}
    >
      <header className="submission-summary-card__header">
        <h3 className="submission-summary-card__title">{title}</h3>
        <div className="submission-summary-card__icon" aria-hidden="true">
          <Icon size={22} strokeWidth={1.75} />
        </div>
      </header>

      {isSummary ? (
        /* Total — compact horizontal 3-col strip */
        <div className="submission-summary-card__metrics">
          <div className="submission-summary-card__metric">
            <p className="submission-summary-card__value">{totalSubmission}</p>
            <p className="submission-summary-card__metric-label">{labelTotalSubmission}</p>
          </div>
          <div className="submission-summary-card__metric">
            <p className="submission-summary-card__value">{taxPaid173}</p>
            <p className="submission-summary-card__metric-label">{labelTaxPaid173}</p>
          </div>
          <div className="submission-summary-card__metric">
            <p className="submission-summary-card__value">{totalTaxPaid}</p>
            <p className="submission-summary-card__metric-label">{labelTotalTaxPaid}</p>
          </div>
        </div>
      ) : (
        /* Online / Offline — prominent primary KPI, quieter secondary row */
        <>
          <div className="submission-summary-card__primary">
            <p className="submission-summary-card__primary-value">{totalSubmission}</p>
            <p className="submission-summary-card__primary-label">{labelTotalSubmission}</p>
          </div>
          <div className="submission-summary-card__secondary">
            <div className="submission-summary-card__metric">
              <p className="submission-summary-card__value">{taxPaid173}</p>
              <p className="submission-summary-card__metric-label">{labelTaxPaid173}</p>
            </div>
            <div className="submission-summary-card__metric">
              <p className="submission-summary-card__value">{totalTaxPaid}</p>
              <p className="submission-summary-card__metric-label">{labelTotalTaxPaid}</p>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
