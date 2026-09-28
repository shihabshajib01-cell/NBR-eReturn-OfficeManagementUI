import { toast } from "sonner";

/**
 * Replaces all export/download file-generation logic.
 * Shows an informational toast; never creates or downloads a file.
 */
export function handleExportDisabled(message?: string): void {
  toast.info(message ?? "Download/export is currently disabled.");
}
