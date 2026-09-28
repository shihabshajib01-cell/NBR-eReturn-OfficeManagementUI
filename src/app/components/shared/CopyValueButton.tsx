import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface CopyValueButtonProps {
  value: unknown;
  label?: string;
  className?: string;
  size?: number;
  disabled?: boolean;
}

async function copyWithClipboardApi(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function copyWithTextareaFallback(text: string): boolean {
  const prev = document.activeElement as HTMLElement | null;
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0";
  document.body.appendChild(ta);
  try {
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(ta);
    prev?.focus();
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    const ok = await copyWithClipboardApi(text);
    if (ok) return true;
  }
  return copyWithTextareaFallback(text);
}

export function CopyValueButton({ value, label, className = "", size = 13, disabled }: CopyValueButtonProps) {
  const { t: ta } = useTranslation("actions");
  const [copied, setCopied] = useState(false);

  const text = (value === null || value === undefined || value === "" || value === "—")
    ? null
    : String(value);

  const ariaLabel = label
    ? ta("copyField", { field: label, defaultValue: `Copy ${label}` })
    : ta("copyValue", { defaultValue: "Copy value" });

  const stopProp = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast.success(ta("copiedToClipboard", { defaultValue: "Copied to clipboard" }));
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error(ta("copyFailed", { defaultValue: "Could not copy" }));
    }
  }, [text, ta]);

  if (!text || disabled) return null;

  return (
    <button
      type="button"
      className={`copy-value-btn${className ? ` ${className}` : ""}`}
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={handleClick}
      onMouseDown={stopProp}
      onPointerDown={stopProp}
    >
      {copied
        ? <Check size={size} strokeWidth={2.5} aria-hidden="true" />
        : <Copy size={size} strokeWidth={2} aria-hidden="true" />
      }
    </button>
  );
}

// Keys that should get a copy button in detail drawers
const COPYABLE_KEYS = new Set([
  "email", "phone", "mobile", "contact",
  "tin", "etin", "nid",
  "employeeId", "employee_id", "user_id",
  "case_no", "psr_no", "cert_no", "reg_no", "request_no",
  "tracking_no", "challan_no", "book_no", "ref_no",
  "endpoint", "api_endpoint", "url", "link", "ip",
]);

export function isCopyableField(key: string): boolean {
  const k = key.toLowerCase();
  return COPYABLE_KEYS.has(key) ||
    k.includes("email") || k.includes("phone") || k.includes("tin") ||
    k.includes("endpoint") || k.includes("url") || k.includes("_no") ||
    k.includes("tracking") || k.includes("challan") || k.includes("ref_no");
}
