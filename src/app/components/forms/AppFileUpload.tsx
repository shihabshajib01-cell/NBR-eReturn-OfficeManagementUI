import { useRef, useState, useCallback } from "react";
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const DEFAULT_ACCEPT = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".xls", ".xlsx"];
const DEFAULT_MAX_FILES = 5;
const DEFAULT_MAX_MB = 2;

// ── Allowed file rules ────────────────────────────────────────────────────────
const ALLOWED_FILE_RULES: Record<string, { mime: string[]; magic: number[][] }> = {
  ".pdf":  { mime: ["application/pdf"], magic: [[0x25, 0x50, 0x44, 0x46]] },
  ".png":  { mime: ["image/png"],       magic: [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]] },
  ".jpg":  { mime: ["image/jpeg"],      magic: [[0xFF, 0xD8, 0xFF]] },
  ".jpeg": { mime: ["image/jpeg"],      magic: [[0xFF, 0xD8, 0xFF]] },
  ".doc":  { mime: ["application/msword", "application/x-ole-storage"], magic: [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]] },
  ".xls":  { mime: ["application/vnd.ms-excel", "application/x-ole-storage"], magic: [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]] },
  ".docx": { mime: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/zip", "application/octet-stream"], magic: [[0x50, 0x4B, 0x03, 0x04]] },
  ".xlsx": { mime: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",       "application/zip", "application/octet-stream"], magic: [[0x50, 0x4B, 0x03, 0x04]] },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? "." + parts.pop()!.toLowerCase() : "";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileHeader(file: File, bytes = 32): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = reject;
    reader.readAsArrayBuffer(file.slice(0, bytes));
  });
}

function readFileBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function hasBytes(buf: Uint8Array, sig: number[], offset = 0): boolean {
  return sig.every((b, i) => buf[offset + i] === b);
}

function hasAsciiPrefix(buf: Uint8Array, text: string): boolean {
  for (let i = 0; i < text.length; i++) {
    if (buf[i] !== text.charCodeAt(i)) return false;
  }
  return true;
}

function includesAscii(buffer: ArrayBuffer, text: string): boolean {
  const view = new Uint8Array(buffer);
  const target = Array.from(text).map(c => c.charCodeAt(0));
  outer: for (let i = 0; i <= view.length - target.length; i++) {
    for (let j = 0; j < target.length; j++) {
      if (view[i + j] !== target[j]) continue outer;
    }
    return true;
  }
  return false;
}

function isDangerousSignature(buf: Uint8Array): boolean {
  // Windows PE / MS-DOS executable: MZ
  if (hasBytes(buf, [0x4D, 0x5A])) return true;
  // ELF executable
  if (hasBytes(buf, [0x7F, 0x45, 0x4C, 0x46])) return true;
  // Mach-O executables
  if (hasBytes(buf, [0xFE, 0xED, 0xFA, 0xCE])) return true;
  if (hasBytes(buf, [0xFE, 0xED, 0xFA, 0xCF])) return true;
  if (hasBytes(buf, [0xCF, 0xFA, 0xED, 0xFE])) return true;
  if (hasBytes(buf, [0xCE, 0xFA, 0xED, 0xFE])) return true;
  // Shell script (#!)
  if (hasAsciiPrefix(buf, "#!")) return true;
  // HTML
  const lower = String.fromCharCode(...buf.slice(0, 16)).toLowerCase().trimStart();
  if (lower.startsWith("<!doctype") || lower.startsWith("<html")) return true;
  return false;
}

function validateMimeForExtension(file: File, extension: string): boolean {
  if (!file.type) return true; // browser didn't detect MIME — let magic check decide
  const rule = ALLOWED_FILE_RULES[extension];
  if (!rule) return false;
  return rule.mime.includes(file.type) || file.type === "application/octet-stream";
}

async function validateMagicSignature(file: File, extension: string): Promise<boolean> {
  const rule = ALLOWED_FILE_RULES[extension];
  if (!rule) return false;
  const buf = await readFileHeader(file, 32);
  return rule.magic.some(sig => hasBytes(buf, sig));
}

async function validateOfficeMarkers(file: File, extension: string): Promise<boolean> {
  const buffer = await readFileBuffer(file);
  if (extension === ".docx") {
    return includesAscii(buffer, "[Content_Types].xml") && includesAscii(buffer, "word/");
  }
  if (extension === ".xlsx") {
    return includesAscii(buffer, "[Content_Types].xml") && includesAscii(buffer, "xl/");
  }
  return true;
}

// ── Per-file async validator ───────────────────────────────────────────────────
async function validateFile(
  file: File,
  accept: string[],
  maxSizeMB: number,
  tf: (k: string, opts?: Record<string, unknown>) => string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const extension = getExtension(file.name);

  if (!accept.includes(extension)) {
    return { ok: false, error: tf("fileUpload.errors.unsupported", { name: file.name }) };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return { ok: false, error: tf("fileUpload.errors.tooLarge", { name: file.name, max: maxSizeMB }) };
  }

  // MIME check
  if (!validateMimeForExtension(file, extension)) {
    return { ok: false, error: tf("fileUpload.errors.mimeMismatch", { name: file.name }) };
  }

  let header: Uint8Array;
  try {
    header = await readFileHeader(file, 32);
  } catch {
    return { ok: false, error: tf("fileUpload.errors.readFailed", { name: file.name }) };
  }

  // Block dangerous signatures before any allowed-type check
  if (isDangerousSignature(header)) {
    return { ok: false, error: tf("fileUpload.errors.dangerous", { name: file.name }) };
  }

  // Magic number check
  let magicOk: boolean;
  try {
    magicOk = await validateMagicSignature(file, extension);
  } catch {
    return { ok: false, error: tf("fileUpload.errors.readFailed", { name: file.name }) };
  }

  if (!magicOk) {
    return { ok: false, error: tf("fileUpload.errors.disguised", { name: file.name, type: extension.replace(".", "").toUpperCase() }) };
  }

  // Deep DOCX/XLSX internal marker check
  if (extension === ".docx" || extension === ".xlsx") {
    let markersOk: boolean;
    try {
      markersOk = await validateOfficeMarkers(file, extension);
    } catch {
      return { ok: false, error: tf("fileUpload.errors.readFailed", { name: file.name }) };
    }
    if (!markersOk) {
      return { ok: false, error: tf("fileUpload.errors.invalidOfficeFile", { name: file.name }) };
    }
  }

  return { ok: true };
}

// ── Component ─────────────────────────────────────────────────────────────────
interface AppFileUploadProps {
  id: string;
  label: string;
  value?: File[];
  onChange?: (files: File[]) => void;
  required?: boolean;
  helper?: string;
  error?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string[];
  disabled?: boolean;
}

export function AppFileUpload({
  id,
  label,
  value = [],
  onChange,
  required,
  helper,
  error,
  maxFiles = DEFAULT_MAX_FILES,
  maxSizeMB = DEFAULT_MAX_MB,
  accept = DEFAULT_ACCEPT,
  disabled,
}: AppFileUploadProps) {
  const { t: tf } = useTranslation("forms");
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [validating, setValidating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateAndAdd = useCallback(async (incoming: File[]) => {
    setValidating(true);
    setErrors([]);
    const newErrors: string[] = [];
    const existing = value;
    const toAdd: File[] = [];

    for (const f of incoming) {
      if (existing.length + toAdd.length >= maxFiles) {
        newErrors.push(tf("fileUpload.errors.maxFiles", { max: maxFiles }));
        break;
      }

      const dup = existing.some(e => e.name === f.name && e.size === f.size && e.lastModified === f.lastModified);
      if (dup) {
        newErrors.push(tf("fileUpload.errors.duplicate", { name: f.name }));
        continue;
      }

      const result = await validateFile(f, accept, maxSizeMB, tf as (k: string, opts?: Record<string, unknown>) => string);
      if (!result.ok) {
        newErrors.push(result.error);
        continue;
      }

      toAdd.push(f);
    }

    setErrors(newErrors);
    if (toAdd.length > 0) onChange?.([...existing, ...toAdd]);
    setValidating(false);
  }, [value, maxFiles, maxSizeMB, accept, onChange, tf]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await validateAndAdd(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled && !validating && e.dataTransfer.files) {
      await validateAndAdd(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (idx: number) => {
    onChange?.(value.filter((_, i) => i !== idx));
    setErrors([]);
  };

  const isLocked = disabled || validating;
  const atMax = value.length >= maxFiles;

  return (
    <div className="file-upload">
      <label htmlFor={id} className="file-upload__label">
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>

      <div
        className={[
          "file-upload__dropzone",
          dragging ? "file-upload__dropzone--dragging" : "",
          (isLocked || atMax) ? "file-upload__dropzone--disabled" : "",
        ].filter(Boolean).join(" ")}
        onClick={() => !isLocked && !atMax && inputRef.current?.click()}
        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !isLocked && !atMax) inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); if (!isLocked && !atMax) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={isLocked || atMax ? -1 : 0}
        aria-disabled={isLocked || atMax}
        aria-busy={validating}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple={maxFiles !== 1}
          accept={accept.join(",")}
          disabled={isLocked || atMax}
          onChange={handleInputChange}
          className="file-upload__input"
          aria-label={label}
        />
        {validating
          ? <Loader2 size={28} strokeWidth={1.5} className="file-upload__icon file-upload__icon--spin" aria-hidden="true" />
          : <UploadCloud size={28} strokeWidth={1.5} className="file-upload__icon" aria-hidden="true" />
        }
        <div className="file-upload__text">
          <span className="file-upload__title">
            {validating
              ? tf("fileUpload.checking", { defaultValue: "Checking files..." })
              : tf("fileUpload.dropTitle", { defaultValue: "Click to upload or drag and drop" })}
          </span>
          <span className="file-upload__helper">
            {helper ?? tf("fileUpload.helper")}
          </span>
        </div>
      </div>

      {value.length > 0 && (
        <p className="file-upload__meta">
          {tf("fileUpload.selectedCount", { count: value.length, max: maxFiles })}
        </p>
      )}

      {value.length > 0 && (
        <ul className="file-upload__list" aria-label="Selected files">
          {value.map((f, i) => (
            <li key={`${f.name}-${i}`} className="file-upload__item">
              <FileText size={16} strokeWidth={1.5} className="file-upload__item-icon" aria-hidden="true" />
              <div className="file-upload__item-main">
                <span className="file-upload__item-name" title={f.name}>{f.name}</span>
                <span className="file-upload__item-meta">
                  {formatSize(f.size)} · {getExtension(f.name).toUpperCase().replace(".", "")}
                </span>
              </div>
              <span className="file-upload__item-status">
                <CheckCircle size={13} strokeWidth={2} aria-hidden="true" />
                {tf("fileUpload.ready", { defaultValue: "Ready" })}
              </span>
              <button
                type="button"
                className="file-upload__remove"
                aria-label={tf("fileUpload.remove", { name: f.name })}
                onClick={() => removeFile(i)}
              >
                <X size={14} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="file-upload__error-external" role="alert">
          <AlertCircle size={13} strokeWidth={2} aria-hidden="true" /> {error}
        </p>
      )}

      {errors.length > 0 && (
        <ul className="file-upload__errors" aria-live="polite">
          {errors.map((e, i) => (
            <li key={i} className="file-upload__error">
              <AlertCircle size={13} strokeWidth={2} aria-hidden="true" /> {e}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
