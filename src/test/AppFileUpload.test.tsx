import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string, opts?: Record<string, string>) => {
      if (opts?.name) return `${k}:${opts.name}`;
      return k;
    },
  }),
}));

// Import after mocking
import { AppFileUpload } from "../app/components/forms/AppFileUpload";

// ── helpers ───────────────────────────────────────────────────────────────────

function makeFile(name: string, bytes: number[], type = "application/octet-stream"): File {
  const buf = new Uint8Array(bytes).buffer;
  return new File([buf], name, { type });
}

const PNG_SIG  = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
const MZ_SIG   = [0x4D, 0x5A, 0x90, 0x00]; // Windows PE
const JPEG_SIG = [0xFF, 0xD8, 0xFF, 0xE0];
const PDF_SIG  = [0x25, 0x50, 0x44, 0x46]; // %PDF
// ZIP (PK) header — no word/ marker → should fail DOCX office check
const PK_SIG   = [0x50, 0x4B, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00];

function renderUpload(onChange = vi.fn()) {
  return render(
    <AppFileUpload id="test-upload" label="Upload" onChange={onChange} />
  );
}

function dropFile(file: File) {
  const dropzone = screen.getByRole("button");
  fireEvent.drop(dropzone, {
    dataTransfer: { files: [file] },
    preventDefault: vi.fn(),
  });
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("AppFileUpload security validation", () => {
  it("accepts a real PNG file", async () => {
    const onChange = vi.fn();
    renderUpload(onChange);
    const file = makeFile("valid.png", [...PNG_SIG, ...Array(512).fill(0)], "image/png");
    dropFile(file);
    await waitFor(() => expect(onChange).toHaveBeenCalled(), { timeout: 3000 });
    const [accepted] = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(accepted.some((f: File) => f.name === "valid.png")).toBe(true);
  });

  it("rejects an EXE renamed to .png (MZ header)", async () => {
    const onChange = vi.fn();
    renderUpload(onChange);
    const file = makeFile("fake.png", [...MZ_SIG, ...Array(512).fill(0)], "image/png");
    dropFile(file);
    await waitFor(
      () => screen.queryByText(/fileUpload.errors.dangerous:fake.png/) !== null ||
            screen.queryByText(/fileUpload.errors.disguised:fake.png/) !== null,
      { timeout: 3000 }
    );
    // onChange should NOT have been called with this file accepted
    const calls = onChange.mock.calls;
    const accepted = calls.length > 0 ? (calls[calls.length - 1][0] as File[]) : [];
    expect(accepted.every((f: File) => f.name !== "fake.png")).toBe(true);
  });

  it("rejects a shell script renamed to .jpg (#! header)", async () => {
    const onChange = vi.fn();
    renderUpload(onChange);
    const shebang = Array.from("#!/bin/bash\n").map(c => c.charCodeAt(0));
    const file = makeFile("fake.jpg", shebang, "image/jpeg");
    dropFile(file);
    await waitFor(
      () => screen.queryByText(/fileUpload.errors.dangerous:fake.jpg/) !== null ||
            screen.queryByText(/fileUpload.errors.disguised:fake.jpg/) !== null,
      { timeout: 3000 }
    );
    const calls = onChange.mock.calls;
    const accepted = calls.length > 0 ? (calls[calls.length - 1][0] as File[]) : [];
    expect(accepted.every((f: File) => f.name !== "fake.jpg")).toBe(true);
  });

  it("rejects a bare ZIP renamed to .docx (missing word/ marker)", async () => {
    const onChange = vi.fn();
    renderUpload(onChange);
    // Just PK header, no [Content_Types].xml or word/
    const file = makeFile(
      "fake.docx",
      [...PK_SIG, ...Array(64).fill(0)],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    dropFile(file);
    await waitFor(
      () =>
        screen.queryByText(/fileUpload.errors.invalidOfficeFile:fake.docx/) !== null ||
        screen.queryByText(/fileUpload.errors.disguised:fake.docx/) !== null,
      { timeout: 3000 }
    );
    const calls = onChange.mock.calls;
    const accepted = calls.length > 0 ? (calls[calls.length - 1][0] as File[]) : [];
    expect(accepted.every((f: File) => f.name !== "fake.docx")).toBe(true);
  });

  it("rejects a file with mismatched MIME type (PNG bytes but wrong MIME)", async () => {
    const onChange = vi.fn();
    renderUpload(onChange);
    // Extension is .png but MIME says it's a spreadsheet
    const file = makeFile("trick.png", [...PNG_SIG, ...Array(64).fill(0)], "application/vnd.ms-excel");
    dropFile(file);
    await waitFor(
      () => screen.queryByText(/fileUpload.errors.mimeMismatch:trick.png/) !== null ||
            onChange.mock.calls.some(c => (c[0] as File[]).some((f: File) => f.name === "trick.png")),
      { timeout: 3000 }
    );
    const calls = onChange.mock.calls;
    const accepted = calls.length > 0 ? (calls[calls.length - 1][0] as File[]) : [];
    expect(accepted.every((f: File) => f.name !== "trick.png")).toBe(true);
  });
});
