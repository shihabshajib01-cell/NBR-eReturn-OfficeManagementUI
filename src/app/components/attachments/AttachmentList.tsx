import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Image, FileCheck, Eye, ExternalLink, Download, Paperclip } from "lucide-react";
import type { AttachmentItem } from "./attachmentTypes";
import { AttachmentPreviewModal } from "./AttachmentPreviewModal";

interface AttachmentListProps {
  attachments: AttachmentItem[];
  title?: string;
  emptyText?: string;
}

function FileIcon({ kind }: { kind: AttachmentItem["previewKind"] }) {
  if (kind === "image") return <Image size={16} strokeWidth={1.5} aria-hidden="true" />;
  if (kind === "pdf")   return <FileCheck size={16} strokeWidth={1.5} aria-hidden="true" />;
  return <FileText size={16} strokeWidth={1.5} aria-hidden="true" />;
}

export function AttachmentList({ attachments, title, emptyText }: AttachmentListProps) {
  const { t: td } = useTranslation("drawers");
  const [preview, setPreview] = useState<AttachmentItem | null>(null);

  const sectionTitle = title ?? td("attachments.title");
  const countLabel = attachments.length === 1
    ? td("attachments.singleFile")
    : td("attachments.fileCount", { count: String(attachments.length) });

  const canView     = (att: AttachmentItem) => att.objectUrl && att.previewKind !== "office";
  const hasActions  = (att: AttachmentItem) => att.objectUrl != null;
  const isOffice    = (att: AttachmentItem) => att.previewKind === "office";
  const isMetaOnly  = (att: AttachmentItem) => !att.objectUrl;

  return (
    <div className="attachment-list">
      <div className="attachment-list__header">
        <div className="attachment-list__title-row">
          <Paperclip size={14} strokeWidth={2} aria-hidden="true" />
          <span className="attachment-list__title">{sectionTitle}</span>
        </div>
        {attachments.length > 0 && (
          <span className="attachment-list__count">{countLabel}</span>
        )}
      </div>

      {attachments.length === 0 ? (
        <p className="attachment-list__empty">{emptyText ?? td("attachments.noFiles")}</p>
      ) : (
        <ul className="attachment-list__items" aria-label={sectionTitle}>
          {attachments.map((att) => (
            <li key={att.id} className="attachment-item">
              {/* ── Card body: icon + name + meta ── */}
              <div className="attachment-item__body">
                <span className="attachment-item__icon">
                  <FileIcon kind={att.previewKind} />
                </span>
                <div className="attachment-item__main">
                  <span className="attachment-item__name" title={att.name}>
                    {att.name}
                  </span>
                  <span className="attachment-item__meta">
                    {att.sizeLabel}
                    {att.extension && ` · ${att.extension.replace(".", "").toUpperCase()}`}
                    {att.uploadedAt && ` · ${new Date(att.uploadedAt).toLocaleDateString()}`}
                  </span>
                  {isMetaOnly(att) && (
                    <span className="attachment-item__note">
                      {td("attachments.metadataOnly")}
                    </span>
                  )}
                  {isOffice(att) && att.objectUrl && (
                    <span className="attachment-item__note">
                      {td("attachments.officePreviewUnavailable")}
                    </span>
                  )}
                </div>
              </div>

              {/* ── Card footer: actions ── */}
              {hasActions(att) && (
                <div className="attachment-item__footer">
                  {canView(att) && (
                    <button
                      type="button"
                      className="attachment-item__action"
                      onClick={() => setPreview(att)}
                      aria-label={`${td("attachments.view")} ${att.name}`}
                    >
                      <Eye size={12} strokeWidth={2} aria-hidden="true" />
                      <span>{td("attachments.view")}</span>
                    </button>
                  )}
                  <a
                    href={att.objectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-item__action"
                    aria-label={`${td("attachments.open")} ${att.name}`}
                  >
                    <ExternalLink size={12} strokeWidth={2} aria-hidden="true" />
                    <span>{td("attachments.open")}</span>
                  </a>
                  <a
                    href={att.objectUrl}
                    download={att.name}
                    className="attachment-item__action attachment-item__action--primary"
                    aria-label={`${td("attachments.download")} ${att.name}`}
                  >
                    <Download size={12} strokeWidth={2} aria-hidden="true" />
                    <span>{td("attachments.download")}</span>
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <AttachmentPreviewModal attachment={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
