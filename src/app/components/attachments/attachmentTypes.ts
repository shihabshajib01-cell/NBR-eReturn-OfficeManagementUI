export type AttachmentPreviewKind = "image" | "pdf" | "office" | "unknown";

export interface AttachmentItem {
  id: string;
  name: string;
  size: number;
  sizeLabel: string;
  type: string;
  extension: string;
  previewKind: AttachmentPreviewKind;
  objectUrl?: string;
  uploadedAt?: string;
}

export function getAttachmentPreviewKind(
  fileName: string,
  mimeType?: string
): AttachmentPreviewKind {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "xls", "xlsx"].includes(ext)) return "office";
  if (mimeType?.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  return "unknown";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isAttachmentArray(val: unknown): val is AttachmentItem[] {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof (val[0] as AttachmentItem)?.name === "string" &&
    typeof (val[0] as AttachmentItem)?.extension === "string"
  );
}
