import { useRef, useState, useCallback } from "react";
import { FileText, CheckCircle2, AlertCircle, Loader2, Paperclip, X, Upload, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getExtension,
  formatFileSize,
  validateSRFile,
} from "../../utils/fileValidation";
import { SRSampleModal } from "./SRSampleModal";
import { SRSampleCategory } from "../../data/specialRegistrationSamples";

// ── Component ─────────────────────────────────────────────────────────────────

interface SRDocumentRowProps {
  id: string;
  label: string;
  value: File[];
  onChange: (files: File[]) => void;
  required?: boolean;
  optional?: boolean;
  optionalBadge?: string;
  helper: string;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string[];
  error?: string;
  disabled?: boolean;
  sampleCategory?: SRSampleCategory;
}

export function SRDocumentRow({
  id,
  value = [],
  onChange,
  required,
  optional,
  optionalBadge,
  helper,
  maxFiles = 1,
  maxSizeMB = 2,
  accept = [".pdf", ".jpg", ".jpeg", ".png"],
  error,
  disabled,
  sampleCategory,
  label,
}: SRDocumentRowProps) {
  const { t: tf } = useTranslation("forms");
  const { t: ts } = useTranslation("specialRegistration");
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [validating, setValidating] = useState(false);
  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const [sampleOpen, setSampleOpen] = useState(false);

  const validateAndAdd = useCallback(async (incoming: File[]) => {
    setValidating(true);
    setLocalErrors([]);
    const newErrors: string[] = [];
    const toAdd: File[] = [];
    for (const f of incoming) {
      if (value.length + toAdd.length >= maxFiles) {
        newErrors.push(tf("fileUpload.errors.maxFiles", { max: maxFiles }));
        break;
      }
      const dup = value.some(e => e.name === f.name && e.size === f.size && e.lastModified === f.lastModified);
      if (dup) { newErrors.push(tf("fileUpload.errors.duplicate", { name: f.name })); continue; }
      const result = await validateSRFile(f, accept, maxSizeMB, tf as (k: string, opts?: Record<string, unknown>) => string);
      if (!result.ok) { newErrors.push(result.error); continue; }
      toAdd.push(f);
    }
    setLocalErrors(newErrors);
    if (toAdd.length > 0) onChange([...value, ...toAdd]);
    setValidating(false);
  }, [value, maxFiles, maxSizeMB, accept, onChange, tf]);

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await validateAndAdd(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled && !validating && e.dataTransfer.files)
      await validateAndAdd(Array.from(e.dataTransfer.files));
  };

  const removeFile = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
    setLocalErrors([]);
  };

  const atMax = value.length >= maxFiles;
  const isLocked = disabled || validating;
  const hasFiles = value.length > 0;
  const hasError = !!error || localErrors.length > 0;

  // Shared actions — rendered in both desktop (sr-doc-row__actions) and mobile (sr-doc-row__mobile-actions)
  const renderActions = () => (
    <>
      {sampleCategory && (
        <button
          type="button"
          className="sr-doc-row__sample-btn"
          onClick={() => setSampleOpen(true)}
          aria-label={`${ts("documents.viewSample")} — ${label}`}
        >
          <Eye size={12} strokeWidth={2} aria-hidden="true" />
          {ts("documents.viewSample")}
        </button>
      )}
      {!atMax && (
        <button
          type="button"
          className="sr-doc-row__btn"
          onClick={() => !isLocked && inputRef.current?.click()}
          disabled={isLocked}
          aria-label={hasFiles ? `Add more files to ${label}` : `Upload ${label}`}
        >
          {validating
            ? <Loader2 size={14} strokeWidth={2} className="sr-doc-row__icon--spin" />
            : <Upload size={14} strokeWidth={2} />
          }
          {validating ? "Checking…" : hasFiles ? "Add more" : "Choose file"}
        </button>
      )}
    </>
  );

  const showMobileActions = sampleCategory || !atMax;

  return (
    <>
      <div
        className={[
          "sr-doc-row",
          dragging ? "sr-doc-row--drag" : "",
          hasError ? "sr-doc-row--error" : "",
          hasFiles ? "sr-doc-row--filled" : "",
          isLocked ? "sr-doc-row--locked" : "",
        ].filter(Boolean).join(" ")}
        onDragOver={e => { e.preventDefault(); if (!isLocked && !atMax) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple={maxFiles > 1}
          accept={accept.join(",")}
          disabled={isLocked || atMax}
          onChange={handleInput}
          className="sr-doc-row__input"
          aria-label={label}
        />

        {/* Status icon */}
        <div className="sr-doc-row__icon" aria-hidden="true">
          {validating
            ? <Loader2 size={18} strokeWidth={1.8} className="sr-doc-row__icon--spin" />
            : hasFiles
              ? <CheckCircle2 size={18} strokeWidth={2} className="sr-doc-row__icon--ok" />
              : <Paperclip size={18} strokeWidth={1.8} className="sr-doc-row__icon--idle" />
          }
        </div>

        <div className="sr-doc-row__content">

          {/* Top row: text (left) + desktop actions (right, hidden on mobile) */}
          <div className="sr-doc-row__top">
            <div className="sr-doc-row__text">
              <div className="sr-doc-row__label-row">
                <label htmlFor={!hasFiles ? id : undefined} className="sr-doc-row__label">
                  {label}
                  {required && <span className="sr-doc-row__required" aria-label="required"> *</span>}
                </label>
                {optional && optionalBadge && (
                  <span className="sr-doc-row__optional-badge">{optionalBadge}</span>
                )}
              </div>
              <p className="sr-doc-row__helper">{helper}</p>
            </div>

            {/* Desktop only — hidden via CSS on mobile */}
            <div className="sr-doc-row__actions" aria-hidden={undefined}>
              {renderActions()}
            </div>
          </div>

          {/* Uploaded file list */}
          {hasFiles && (
            <ul className="sr-doc-row__files" aria-label="Attached files">
              {value.map((f, i) => (
                <li key={`${f.name}-${i}`} className="sr-doc-row__file">
                  <FileText size={13} strokeWidth={1.8} aria-hidden="true" className="sr-doc-row__file-icon" />
                  <span className="sr-doc-row__file-name" title={f.name}>{f.name}</span>
                  <span className="sr-doc-row__file-meta">
                    {formatFileSize(f.size)} · {getExtension(f.name).toUpperCase().replace(".", "")}
                  </span>
                  <button
                    type="button"
                    className="sr-doc-row__remove"
                    aria-label={tf("fileUpload.remove", { name: f.name })}
                    onClick={() => removeFile(i)}
                    disabled={isLocked}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Mobile actions — shown via CSS on mobile, hidden on desktop */}
          {showMobileActions && (
            <div className={[
              "sr-doc-row__mobile-actions",
              atMax ? "sr-doc-row__mobile-actions--single" : "",
            ].filter(Boolean).join(" ")}>
              {renderActions()}
            </div>
          )}

          {/* Validation errors — always below everything */}
          {(error || localErrors.length > 0) && (
            <div className="sr-doc-row__errors" role="alert">
              {error && (
                <p className="sr-doc-row__error">
                  <AlertCircle size={12} strokeWidth={2} aria-hidden="true" /> {error}
                </p>
              )}
              {localErrors.map((e, i) => (
                <p key={i} className="sr-doc-row__error">
                  <AlertCircle size={12} strokeWidth={2} aria-hidden="true" /> {e}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {sampleOpen && sampleCategory && (
        <SRSampleModal category={sampleCategory} onClose={() => setSampleOpen(false)} />
      )}
    </>
  );
}
