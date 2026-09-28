import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppTextField } from "./AppTextField";
import { AppSelectField } from "./AppSelectField";
import { AppDateField } from "./AppDateField";
import { AppTextArea } from "./AppTextArea";
import { AppFileUpload } from "./AppFileUpload";
import { AppNumberField } from "./AppNumberField";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

export type EntryFieldType = "text" | "select" | "textarea" | "date" | "number" | "file";
export type EntryFormValue = string | File[];

export type FormField = {
  key?: string;
  label: string;
  type: EntryFieldType;
  options?: string[];
  span?: boolean;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string[];
  multiple?: boolean;
  defaultValue?: string;
};

interface EntryFormProps {
  fields: FormField[];
  onClose: () => void;
  onSubmit?: (values: Record<string, EntryFormValue>) => void;
  submitLabel?: string;
}

function fieldId(f: FormField, i: number): string {
  return f.key ?? `entry-field-${i}`;
}

export function EntryForm({ fields, onClose, onSubmit, submitLabel }: EntryFormProps) {
  const { t: translate } = useTranslation("common");
  const { t: translateActions } = useTranslation("actions");

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((f, i) => {
      if (f.type !== "file") init[fieldId(f, i)] = f.defaultValue ?? "";
    });
    return init;
  });
  const [filesByField, setFilesByField] = useState<Record<string, File[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setStr = (id: string, v: string) =>
    setValues(p => ({ ...p, [id]: v }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    fields.forEach((f, i) => {
      const id = fieldId(f, i);
      if (!f.required) return;
      if (f.type === "file") {
        if (!filesByField[id]?.length)
          errs[id] = translateActions("uploadRequired", { defaultValue: "Please upload at least one file" });
      } else {
        if (!values[id]?.trim())
          errs[id] = translateActions("formRequired", { defaultValue: "Please fill in required fields" });
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const allValues: Record<string, EntryFormValue> = { ...values };
    fields.forEach((f, i) => {
      const id = fieldId(f, i);
      if (f.type === "file") allValues[id] = filesByField[id] ?? [];
    });

    onSubmit?.(allValues);
    onClose();
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="entry-form__grid">
        {fields.map((f, i) => {
          const id = fieldId(f, i);
          const cls = f.span ? "entry-form__field entry-form__field--span" : "entry-form__field";

          return (
            <div key={i} className={cls}>
              {f.type === "select" ? (
                <AppSelectField
                  id={id}
                  label={f.label}
                  value={values[id] ?? ""}
                  onChange={v => setStr(id, v)}
                  options={f.options ?? []}
                  required={f.required}
                  helper={f.helper}
                  error={errors[id]}
                />
              ) : f.type === "textarea" ? (
                <AppTextArea
                  id={id}
                  label={f.label}
                  value={values[id] ?? ""}
                  onChange={(v) => {
                    setStr(id, v);
                    if (errors[id]) setErrors(prev => { const n = { ...prev }; delete n[id]; return n; });
                  }}
                  placeholder={f.placeholder}
                  required={f.required}
                  helper={f.helper}
                  error={errors[id]}
                  rows={4}
                />
              ) : f.type === "date" ? (
                <AppDateField
                  id={id}
                  label={f.label}
                  value={values[id] ?? ""}
                  onChange={v => setStr(id, v)}
                  required={f.required}
                  helper={f.helper}
                  error={errors[id]}
                />
              ) : f.type === "number" ? (
                <AppNumberField
                  id={id}
                  label={f.label}
                  value={values[id] ?? ""}
                  onChange={v => setStr(id, v)}
                  placeholder={f.placeholder}
                  required={f.required}
                  helper={f.helper}
                  error={errors[id]}
                />
              ) : f.type === "file" ? (
                <AppFileUpload
                  id={id}
                  label={f.label}
                  value={filesByField[id] ?? []}
                  onChange={files => {
                    setFilesByField(prev => ({ ...prev, [id]: files }));
                    if (errors[id]) setErrors(p => { const n = { ...p }; delete n[id]; return n; });
                  }}
                  required={f.required}
                  helper={errors[id] ?? f.helper}
                  maxFiles={f.maxFiles ?? 5}
                  maxSizeMB={f.maxSizeMB ?? 2}
                  accept={f.accept}
                />
              ) : (
                <AppTextField
                  id={id}
                  label={f.label}
                  value={values[id] ?? ""}
                  onChange={v => setStr(id, v)}
                  placeholder={f.placeholder}
                  required={f.required}
                  helper={f.helper}
                  error={errors[id]}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="entry-form__footer">
        <SecondaryButton type="button" onClick={onClose}>
          {translate("actions.cancel")}
        </SecondaryButton>
        <PrimaryButton type="submit">
          {submitLabel ?? translate("actions.submit")}
        </PrimaryButton>
      </div>
    </form>
  );
}
