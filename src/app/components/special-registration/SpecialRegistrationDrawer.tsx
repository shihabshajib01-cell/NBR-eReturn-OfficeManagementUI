import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Check, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveOverlay } from "../shared/ResponsiveOverlay";
import { StatusBadge } from "../badges/StatusBadge";
import { CopyValueButton } from "../shared/CopyValueButton";
import { AttachmentList } from "../attachments/AttachmentList";
import { AppModal } from "../modals/AppModal";
import { AppTextArea } from "../forms/AppTextArea";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { DangerButton } from "../buttons/DangerButton";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  getDocumentsByCategory,
  type SpecialRegistrationApplication,
} from "../../services/repositories/specialRegistrationRepository";

interface DrawerProps {
  application: SpecialRegistrationApplication;
  onClose: () => void;
  onEdit: () => void;
  onApprove: (
    appId: string,
    payload: { officerId: string; officerName: string; officerDesignation: string; approvalNote?: string }
  ) => Promise<void>;
  onReject: (
    appId: string,
    payload: { officerId: string; officerName: string; officerDesignation: string; rejectionReason: string }
  ) => Promise<void>;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// ── Completeness check ────────────────────────────────────────────────────────

interface CompletenessResult {
  complete: boolean;
  missingFields: string[];
  missingDocuments: string[];
}

function checkCompleteness(
  app: SpecialRegistrationApplication,
  t: (key: string) => string
): CompletenessResult {
  const missingFields: string[] = [];
  const missingDocuments: string[] = [];

  if (!app.applicantName)  missingFields.push(t("internal.drawer.fields.fullName"));
  const nidDigits = app.nidNumber?.replace(/\D/g, "") ?? "";
  if (![10, 13, 17].includes(nidDigits.length)) missingFields.push(t("internal.drawer.fields.nidNumber"));
  if (!app.tin || app.tin.replace(/\D/g, "").length !== 12) missingFields.push(t("internal.drawer.fields.tin"));
  if (!app.passportType)   missingFields.push(t("drawer.passportTypeLabel"));
  if (!app.country)        missingFields.push(t("internal.drawer.fields.country"));
  if (!app.address)        missingFields.push(t("internal.drawer.fields.address"));
  if (!app.phone)          missingFields.push(t("internal.drawer.fields.phone"));
  if (!app.email)          missingFields.push(t("internal.drawer.fields.email"));
  if (!app.departureDate)  missingFields.push(t("internal.drawer.fields.departureDate"));
  if (!app.declarationAccepted) missingFields.push(t("internal.drawer.fields.declarationAccepted"));

  const hasNid      = app.documents.some(d => d.category === "NID_OR_SMART_ID");
  const hasPassport = app.documents.some(d => d.category === "PASSPORT_BIO_PAGE");
  const hasDeparture= app.documents.some(d => d.category === "LATEST_DEPARTURE_SEAL");

  if (!hasNid)       missingDocuments.push(t("internal.drawer.documents.nid"));
  if (!hasPassport)  missingDocuments.push(t("internal.drawer.documents.passport"));
  if (!hasDeparture) missingDocuments.push(t("internal.drawer.documents.departure"));

  return {
    complete: missingFields.length === 0 && missingDocuments.length === 0,
    missingFields,
    missingDocuments,
  };
}

// ── Section component ─────────────────────────────────────────────────────────

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div className="detail-section">
      <div className="detail-section__head detail-section__head--static">
        {title}
      </div>
      <div className="detail-section__body">
        {children}
      </div>
    </div>
  );
}

// ── Field component ───────────────────────────────────────────────────────────

interface DrawerFieldProps {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}

function DrawerField({ label, wide, children }: DrawerFieldProps) {
  return (
    <div className={`drawer-field${wide ? " drawer-field--wide" : ""}`}>
      <span className="drawer-field__label">{label}</span>
      <span className="drawer-field__value">{children}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SpecialRegistrationDrawer({ application, onClose, onEdit, onApprove, onReject }: DrawerProps) {
  const { t } = useTranslation("specialRegistration");
  const currentUser = useCurrentUser();

  const [approveOpen, setApproveOpen]   = useState(false);
  const [approvalNote, setApprovalNote] = useState("");
  const [approvingBusy, setApprovingBusy] = useState(false);

  const [rejectOpen, setRejectOpen]         = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError]   = useState("");
  const [rejectingBusy, setRejectingBusy]     = useState(false);

  const isPending  = application.status === "PENDING_REVIEW";
  const isApproved = application.status === "APPROVED";
  const isRejected = application.status === "REJECTED";

  const completeness = isPending
    ? checkCompleteness(application, t)
    : { complete: true, missingFields: [], missingDocuments: [] };

  // ── Document helpers ──────────────────────────────────────────────────────
  const nidAttachments       = getDocumentsByCategory(application, "NID_OR_SMART_ID");
  const passportAttachments  = getDocumentsByCategory(application, "PASSPORT_BIO_PAGE");
  const visaAttachments      = getDocumentsByCategory(application, "VISA_OR_RESIDENCE_PAGE");
  const departureAttachments = getDocumentsByCategory(application, "LATEST_DEPARTURE_SEAL");

  // ── Approve handlers ──────────────────────────────────────────────────────
  const handleApproveConfirm = useCallback(async () => {
    setApprovingBusy(true);
    try {
      await onApprove(application.id, {
        officerId:           currentUser.employeeId,
        officerName:         currentUser.name,
        officerDesignation:  currentUser.designation,
        approvalNote:        approvalNote.trim() || undefined,
      });
      setApproveOpen(false);
      setApprovalNote("");
    } catch {
      toast.error(t("internal.approve.errorToast"));
    } finally {
      setApprovingBusy(false);
    }
  }, [application.id, approvalNote, currentUser, onApprove, t]);

  // ── Reject handlers ───────────────────────────────────────────────────────
  const handleRejectChange = useCallback((v: string) => {
    setRejectionReason(v);
    if (rejectionError) setRejectionError("");
  }, [rejectionError]);

  const handleRejectConfirm = useCallback(async () => {
    const trimmed = rejectionReason.trim();
    if (!trimmed) { setRejectionError(t("internal.reject.reasonRequired")); return; }
    if (trimmed.length < 10) { setRejectionError(t("internal.reject.reasonTooShort")); return; }

    setRejectingBusy(true);
    try {
      await onReject(application.id, {
        officerId:           currentUser.employeeId,
        officerName:         currentUser.name,
        officerDesignation:  currentUser.designation,
        rejectionReason:     trimmed,
      });
      setRejectOpen(false);
      setRejectionReason("");
      setRejectionError("");
    } catch {
      toast.error(t("internal.reject.errorToast"));
    } finally {
      setRejectingBusy(false);
    }
  }, [application.id, rejectionReason, currentUser, onReject, t]);

  const statusDisplay = application.status === "PENDING_REVIEW" ? "pending review"
                      : application.status === "APPROVED" ? "approved"
                      : "rejected";

  // ── Footer ────────────────────────────────────────────────────────────────
  const footer = isPending ? (
    <div className="drawer-action-footer">
      <div className="drawer-action-footer__row drawer-action-footer__row--single">
        <button
          type="button"
          className="action-btn action-btn--primary-soft"
          onClick={onEdit}
          disabled={approvingBusy || rejectingBusy}
        >
          <Pencil size={13} strokeWidth={2} aria-hidden="true" />
          {t("internal.editTitle").split(" ")[0]}
        </button>
      </div>
      <div className="drawer-action-footer__divider" />
      <div className="drawer-action-footer__row">
        <button
          type="button"
          className="action-btn action-btn--danger"
          onClick={() => setRejectOpen(true)}
          disabled={approvingBusy || rejectingBusy}
        >
          {t("internal.reject.modalTitle")}
        </button>
        <button
          type="button"
          className="action-btn action-btn--primary"
          onClick={() => setApproveOpen(true)}
          disabled={!completeness.complete || approvingBusy || rejectingBusy}
        >
          {t("internal.approve.modalTitle")}
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <ResponsiveOverlay
        open
        onClose={onClose}
        title={t("internal.drawer.title")}
        footer={footer}
        desktopWidth="480px"
        describedBy="sr-drawer-desc"
      >
        <div id="sr-drawer-desc">

          {/* Summary block */}
          <div className="drawer-summary">
            <div className="drawer-summary__main">
              <p className="drawer-summary__name">{application.applicantName}</p>
              <p className="drawer-summary__id">
                <span className="drawer-summary__id-label">{t("internal.drawer.fields.applicationNo")}: </span>
                {application.applicationNumber}
                <CopyValueButton value={application.applicationNumber} label={t("internal.drawer.copyAppNo")} />
              </p>
              <p className="drawer-summary__meta">{formatDate(application.submittedAt)}</p>
            </div>
            <div className="drawer-summary__status">
              <StatusBadge value={statusDisplay} />
            </div>
          </div>

          {/* Incomplete warning */}
          {isPending && !completeness.complete && (
            <div className="sr-drawer__incomplete" role="alert">
              <div className="sr-drawer__incomplete-header">
                <AlertTriangle size={16} aria-hidden="true" />
                <strong>{t("internal.drawer.incomplete.warning")}</strong>
              </div>
              <p>{t("internal.drawer.incomplete.description")}</p>
              {completeness.missingFields.length > 0 && (
                <div>
                  <p className="sr-drawer__incomplete-sub">{t("internal.drawer.incomplete.missingFields")}:</p>
                  <ul>{completeness.missingFields.map(f => <li key={f}>{f}</li>)}</ul>
                </div>
              )}
              {completeness.missingDocuments.length > 0 && (
                <div>
                  <p className="sr-drawer__incomplete-sub">{t("internal.drawer.incomplete.missingDocuments")}:</p>
                  <ul>{completeness.missingDocuments.map(d => <li key={d}>{d}</li>)}</ul>
                </div>
              )}
            </div>
          )}

          {/* Section 1: Application Information */}
          <DetailSection title={t("internal.drawer.sections.applicationInfo")}>
            <div className="drawer-field-grid">
              <DrawerField label={t("internal.drawer.fields.applicationNo")}>
                <div className="drawer-field__value-row">
                  <span>{application.applicationNumber}</span>
                  <CopyValueButton value={application.applicationNumber} />
                </div>
              </DrawerField>
              <DrawerField label={t("internal.drawer.fields.submittedAt")}>
                {formatDate(application.submittedAt)}
              </DrawerField>
              <DrawerField label={t("internal.drawer.fields.status")}>
                <StatusBadge value={statusDisplay} />
              </DrawerField>
            </div>
          </DetailSection>

          {/* Section 2: Taxpayer Information */}
          <DetailSection title={t("internal.drawer.sections.taxpayerInfo")}>
            <div className="drawer-field-grid">
              <DrawerField label={t("internal.drawer.fields.fullName")}>
                {application.applicantName}
              </DrawerField>
              <DrawerField label={t("internal.drawer.fields.nidNumber")}>
                <div className="drawer-field__value-row">
                  <span>{application.nidNumber}</span>
                  <CopyValueButton value={application.nidNumber} label={t("internal.drawer.copyNid")} />
                </div>
              </DrawerField>
              <DrawerField label={t("internal.drawer.fields.tin")}>
                <div className="drawer-field__value-row">
                  <span>{application.tin}</span>
                  <CopyValueButton value={application.tin} label={t("internal.drawer.copyTin")} />
                </div>
              </DrawerField>
              {application.passportType && (
                <DrawerField label={t("drawer.passportTypeLabel")}>
                  {application.passportType === "BANGLADESHI" ? t("passportType.bangladeshi")
                    : application.passportType === "FOREIGN" ? t("passportType.foreign")
                    : t("passportType.dual")}
                </DrawerField>
              )}
            </div>
          </DetailSection>

          {/* Section 3: Overseas Residence and Contact */}
          <DetailSection title={t("internal.drawer.sections.overseasContact")}>
            <div className="drawer-field-grid">
              <DrawerField label={t("internal.drawer.fields.country")}>
                {application.country}
              </DrawerField>
              <DrawerField label={t("internal.drawer.fields.phone")}>
                <div className="drawer-field__value-row">
                  <span>{application.phone}</span>
                  <CopyValueButton value={application.phone} label={t("internal.drawer.copyPhone")} />
                </div>
              </DrawerField>
              <DrawerField label={t("internal.drawer.fields.address")} wide>
                {application.address}
              </DrawerField>
              <DrawerField label={t("internal.drawer.fields.email")} wide>
                <div className="drawer-field__value-row">
                  <span>{application.email}</span>
                  <CopyValueButton value={application.email} label={t("internal.drawer.copyEmail")} />
                </div>
              </DrawerField>
            </div>
          </DetailSection>

          {/* Section 4: Departure */}
          <DetailSection title={t("internal.drawer.sections.departureInfo")}>
            <div className="drawer-field-grid">
              <DrawerField label={t("internal.drawer.fields.departureDate")} wide>
                {application.departureDate || "—"}
              </DrawerField>
            </div>
          </DetailSection>

          {/* Section 5: Documents */}
          <DetailSection title={t("internal.drawer.sections.documents")}>
            <div className="sr-drawer__doc-list">
              <AttachmentList
                attachments={nidAttachments}
                title={`${t("internal.drawer.documents.nid")} · ${t("internal.drawer.documents.required")}`}
                emptyText={t("internal.drawer.documents.noFile")}
              />
              <AttachmentList
                attachments={passportAttachments}
                title={`${t("internal.drawer.documents.passport")} · ${t("internal.drawer.documents.required")}`}
                emptyText={t("internal.drawer.documents.noFile")}
              />
              <AttachmentList
                attachments={visaAttachments}
                title={`${t("internal.drawer.documents.visa")} · ${t("internal.drawer.documents.optional")}`}
                emptyText={t("internal.drawer.documents.noFile")}
              />
              <AttachmentList
                attachments={departureAttachments}
                title={`${t("internal.drawer.documents.departure")} · ${t("internal.drawer.documents.required")}`}
                emptyText={t("internal.drawer.documents.noFile")}
              />
            </div>
          </DetailSection>

          {/* Section 6: Declaration */}
          <DetailSection title={t("internal.drawer.sections.declaration")}>
            <div className="drawer-field-grid">
              <DrawerField label={t("internal.drawer.fields.declarationText")} wide>
                {t("review.declaration")}
              </DrawerField>
              <DrawerField label={t("internal.drawer.fields.declarationAccepted")}>
                {application.declarationAccepted ? (
                  <span className="sr-drawer__accepted">
                    <Check size={14} aria-hidden="true" />
                    {t("internal.drawer.fields.yes")}
                  </span>
                ) : "—"}
              </DrawerField>
              {application.declarationTimestamp && (
                <DrawerField label={t("internal.drawer.fields.declarationTimestamp")}>
                  {formatDate(application.declarationTimestamp)}
                </DrawerField>
              )}
            </div>
          </DetailSection>

          {/* Section 7: Review Information */}
          <DetailSection title={t("internal.drawer.sections.reviewInfo")}>
            {isPending ? (
              <div className="drawer-field-grid">
                <DrawerField label={t("internal.drawer.review.finalDecision")} wide>
                  <span style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>
                    {t("internal.drawer.review.notYetReviewed")}
                  </span>
                </DrawerField>
              </div>
            ) : (
              <div className="drawer-field-grid">
                <DrawerField label={t("internal.drawer.fields.status")}>
                  <StatusBadge value={statusDisplay} />
                </DrawerField>
                <DrawerField label={t("internal.drawer.review.reviewedBy")}>
                  {application.reviewedByName || "—"}
                </DrawerField>
                <DrawerField label={t("internal.drawer.review.designation")}>
                  {application.reviewedByDesignation || "—"}
                </DrawerField>
                <DrawerField label={t("internal.drawer.review.reviewedAt")}>
                  {formatDate(application.reviewedAt || "")}
                </DrawerField>
                {isApproved && application.approvalNote && (
                  <DrawerField label={t("internal.drawer.review.approvalNote")} wide>
                    {application.approvalNote}
                  </DrawerField>
                )}
                {isRejected && application.rejectionReason && (
                  <DrawerField label={t("internal.drawer.review.rejectionReason")} wide>
                    {application.rejectionReason}
                  </DrawerField>
                )}
              </div>
            )}
          </DetailSection>

          {/* Section 8: Decision History */}
          <DetailSection title={t("internal.drawer.sections.decisionHistory")}>
            <div className="sr-drawer__history">
              {application.decisionHistory.map((item, i) => (
                <div key={i} className="sr-drawer__history-item">
                  <div className="sr-drawer__history-event">
                    {item.decisionType === "SUBMITTED" && t("internal.drawer.history.submitted")}
                    {item.decisionType === "APPROVED"  && t("internal.drawer.history.approved")}
                    {item.decisionType === "REJECTED"  && t("internal.drawer.history.rejected")}
                    {item.decisionType === "EDITED"    && t("internal.drawer.history.edited")}
                  </div>
                  <div className="sr-drawer__history-meta">
                    <span>{item.officerName}</span>
                    {item.officerDesignation !== "Applicant" && (
                      <span className="sr-drawer__history-designation"> · {item.officerDesignation}</span>
                    )}
                  </div>
                  <div className="sr-drawer__history-date">{formatDate(item.timestamp)}</div>
                  {item.note && (
                    <div className="sr-drawer__history-note">{item.note}</div>
                  )}
                </div>
              ))}
            </div>
          </DetailSection>

        </div>
      </ResponsiveOverlay>

      {/* Approve modal */}
      <AppModal
        open={approveOpen}
        title={t("internal.approve.modalTitle")}
        onClose={() => !approvingBusy && setApproveOpen(false)}
        layer="top"
        size="md"
        footer={
          <div className="sr-modal-footer">
            <SecondaryButton onClick={() => setApproveOpen(false)} disabled={approvingBusy}>
              {t("internal.approve.cancel")}
            </SecondaryButton>
            <PrimaryButton
              onClick={handleApproveConfirm}
              loading={approvingBusy}
              disabled={approvingBusy}
            >
              {approvingBusy ? t("internal.approve.processing") : t("internal.approve.confirmButton")}
            </PrimaryButton>
          </div>
        }
      >
        <div className="sr-modal-body">
          <div className="sr-modal-info-row">
            <span className="sr-modal-info-label">{t("internal.approve.applicant")}</span>
            <span className="sr-modal-info-value">{application.applicantName}</span>
          </div>
          <div className="sr-modal-info-row">
            <span className="sr-modal-info-label">{t("internal.approve.applicationNo")}</span>
            <span className="sr-modal-info-value">{application.applicationNumber}</span>
          </div>
          <div className="sr-modal-info-row">
            <span className="sr-modal-info-label">{t("internal.approve.email")}</span>
            <span className="sr-modal-info-value">{application.email}</span>
          </div>
          <p className="sr-modal-effect">
            {t("internal.approve.effect")}
          </p>
          <AppTextArea
            id="approve-note"
            label={t("internal.approve.noteLabel")}
            value={approvalNote}
            onChange={setApprovalNote}
            placeholder={t("internal.approve.notePlaceholder")}
            rows={3}
            disabled={approvingBusy}
          />
        </div>
      </AppModal>

      {/* Reject modal */}
      <AppModal
        open={rejectOpen}
        title={t("internal.reject.modalTitle")}
        onClose={() => !rejectingBusy && setRejectOpen(false)}
        layer="top"
        size="md"
        footer={
          <div className="sr-modal-footer">
            <SecondaryButton onClick={() => setRejectOpen(false)} disabled={rejectingBusy}>
              {t("internal.reject.cancel")}
            </SecondaryButton>
            <DangerButton
              onClick={handleRejectConfirm}
              loading={rejectingBusy}
              disabled={rejectingBusy || rejectionReason.trim().length < 10}
            >
              {rejectingBusy ? t("internal.reject.processing") : t("internal.reject.confirmButton")}
            </DangerButton>
          </div>
        }
      >
        <div className="sr-modal-body">
          <div className="sr-modal-info-row">
            <span className="sr-modal-info-label">{t("internal.reject.applicant")}</span>
            <span className="sr-modal-info-value">{application.applicantName}</span>
          </div>
          <div className="sr-modal-info-row">
            <span className="sr-modal-info-label">{t("internal.reject.applicationNo")}</span>
            <span className="sr-modal-info-value">{application.applicationNumber}</span>
          </div>
          <p className="sr-modal-char-count" aria-live="polite">
            {rejectionReason.trim().length}/500
          </p>
          <AppTextArea
            id="reject-reason"
            label={t("internal.reject.reasonLabel")}
            value={rejectionReason}
            onChange={handleRejectChange}
            placeholder={t("internal.reject.reasonPlaceholder")}
            helper={t("internal.reject.reasonHelper")}
            error={rejectionError}
            required
            rows={4}
            disabled={rejectingBusy}
          />
        </div>
      </AppModal>
    </>
  );
}
