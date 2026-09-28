import { useTranslation } from "react-i18next";
import { FileText, ExternalLink, Download } from "lucide-react";
import { AppModal } from "../modals/AppModal";
import type { AttachmentItem } from "./attachmentTypes";

interface AttachmentPreviewModalProps {
  attachment: AttachmentItem | null;
  onClose: () => void;
}

export function AttachmentPreviewModal({ attachment, onClose }: AttachmentPreviewModalProps) {
  const { t: td } = useTranslation("drawers");

  if (!attachment) return null;

  const footer = attachment.objectUrl ? (
    <div style={{ display: "flex", gap: 8 }}>
      <a
        href={attachment.objectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="action-btn action-btn--secondary"
        style={{ textDecoration: "none" }}
      >
        <ExternalLink size={13} strokeWidth={2} />
        {td("attachments.open")}
      </a>
      <a
        href={attachment.objectUrl}
        download={attachment.name}
        className="action-btn action-btn--primary"
        style={{ textDecoration: "none" }}
      >
        <Download size={13} strokeWidth={2} />
        {td("attachments.download")}
      </a>
    </div>
  ) : undefined;

  return (
    <AppModal
      open
      title={attachment.name}
      onClose={onClose}
      size="xl"
      layer="top"
      footer={footer}
    >
      <div className="attachment-preview">
        {attachment.previewKind === "image" && attachment.objectUrl ? (
          <img
            src={attachment.objectUrl}
            alt={td("attachments.imagePreview")}
            className="attachment-preview__image"
          />
        ) : attachment.previewKind === "pdf" && attachment.objectUrl ? (
          <iframe
            src={attachment.objectUrl}
            title={td("attachments.pdfPreview")}
            className="attachment-preview__frame"
          />
        ) : (
          <div className="attachment-preview__empty">
            <FileText size={40} strokeWidth={1.2} aria-hidden="true" />
            <p className="attachment-preview__empty-title">{attachment.name}</p>
            <p className="attachment-preview__empty-desc">
              {attachment.previewKind === "office"
                ? td("attachments.officePreviewUnavailable")
                : !attachment.objectUrl
                  ? td("attachments.metadataOnly")
                  : td("attachments.previewUnavailable")}
            </p>
          </div>
        )}
      </div>
    </AppModal>
  );
}
