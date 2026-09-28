import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// MUI needs a real-ish environment — stub just enough
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual<typeof import("@mui/material")>("@mui/material");
  return { ...actual };
});

import { EntryForm } from "../app/components/forms/EntryForm";

const FIELDS = [
  { label: "Remarks", type: "textarea" as const, key: "remarks", span: true },
];

describe("EntryForm textarea", () => {
  it("renders the Remarks textarea", () => {
    render(<EntryForm fields={FIELDS} onClose={() => {}} />);
    expect(screen.getByLabelText("Remarks")).toBeInTheDocument();
  });

  it("accepts typed text in Remarks field", () => {
    render(<EntryForm fields={FIELDS} onClose={() => {}} />);
    const textarea = screen.getByLabelText("Remarks");
    fireEvent.change(textarea, { target: { value: "Test remark text" } });
    expect(textarea).toHaveValue("Test remark text");
  });

  it("includes remarks value in submitted data", () => {
    const onSubmit = vi.fn();
    render(<EntryForm fields={FIELDS} onClose={() => {}} onSubmit={onSubmit} />);
    const textarea = screen.getByLabelText("Remarks");
    fireEvent.change(textarea, { target: { value: "My remark" } });
    fireEvent.click(screen.getByText("actions.submit"));
    expect(onSubmit).toHaveBeenCalledOnce();
    const [submitted] = onSubmit.mock.calls[0];
    expect(submitted.remarks).toBe("My remark");
  });
});
