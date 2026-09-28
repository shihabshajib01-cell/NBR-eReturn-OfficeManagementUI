// Shared file-validation utilities for Special Registration (PDF / JPG / JPEG / PNG only).

export const SR_ACCEPT = [".pdf", ".jpg", ".jpeg", ".png"];
export const SR_MAX_SIZE_MB = 2;

export const SR_FILE_RULES: Record<string, { mime: string[]; magic: number[][] }> = {
  ".pdf":  { mime: ["application/pdf"],  magic: [[0x25, 0x50, 0x44, 0x46]] },
  ".png":  { mime: ["image/png"],        magic: [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]] },
  ".jpg":  { mime: ["image/jpeg"],       magic: [[0xFF, 0xD8, 0xFF]] },
  ".jpeg": { mime: ["image/jpeg"],       magic: [[0xFF, 0xD8, 0xFF]] },
};

export function getExtension(name: string): string {
  const p = name.split(".");
  return p.length > 1 ? "." + p.pop()!.toLowerCase() : "";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function readFileHeader(file: File): Promise<Uint8Array> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(new Uint8Array(r.result as ArrayBuffer));
    r.onerror = rej;
    r.readAsArrayBuffer(file.slice(0, 32));
  });
}

export function hasFileBytes(buf: Uint8Array, sig: number[]): boolean {
  return sig.every((b, i) => buf[i] === b);
}

export function isDangerousSignature(buf: Uint8Array): boolean {
  if (hasFileBytes(buf, [0x4D, 0x5A])) return true; // PE/DOS executable
  if (hasFileBytes(buf, [0x7F, 0x45, 0x4C, 0x46])) return true; // ELF
  if (hasFileBytes(buf, [0xFE, 0xED, 0xFA, 0xCE])) return true; // Mach-O
  if (hasFileBytes(buf, [0xFE, 0xED, 0xFA, 0xCF])) return true;
  if (hasFileBytes(buf, [0xCF, 0xFA, 0xED, 0xFE])) return true;
  const lower = String.fromCharCode(...buf.slice(0, 16)).toLowerCase().trimStart();
  if (lower.startsWith("<!doctype") || lower.startsWith("<html") || lower.startsWith("#!")) return true;
  return false;
}

export async function validateSRFile(
  file: File,
  accept: string[],
  maxSizeMB: number,
  tf: (k: string, opts?: Record<string, unknown>) => string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const ext = getExtension(file.name);
  if (!accept.includes(ext))
    return { ok: false, error: tf("fileUpload.errors.unsupported", { name: file.name }) };
  if (file.size > maxSizeMB * 1024 * 1024)
    return { ok: false, error: tf("fileUpload.errors.tooLarge", { name: file.name, max: maxSizeMB }) };
  const rule = SR_FILE_RULES[ext];
  if (rule && file.type && !rule.mime.includes(file.type) && file.type !== "application/octet-stream")
    return { ok: false, error: tf("fileUpload.errors.mimeMismatch", { name: file.name }) };
  let header: Uint8Array;
  try { header = await readFileHeader(file); }
  catch { return { ok: false, error: tf("fileUpload.errors.readFailed", { name: file.name }) }; }
  if (isDangerousSignature(header))
    return { ok: false, error: tf("fileUpload.errors.dangerous", { name: file.name }) };
  if (rule && !rule.magic.some(sig => hasFileBytes(header, sig)))
    return { ok: false, error: tf("fileUpload.errors.disguised", { name: file.name, type: ext.replace(".", "").toUpperCase() }) };
  return { ok: true };
}
