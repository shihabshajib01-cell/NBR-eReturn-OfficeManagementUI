import { useTranslation } from "react-i18next";
import type { FilterDef } from "../../pages/modulePageUtils";
import { AppTextField } from "../forms/AppTextField";
import { AppSelectField } from "../forms/AppSelectField";
import { AppDateField } from "../forms/AppDateField";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface FilterPanelProps {
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (k: string, v: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export function FilterPanel({ filters, values, onChange, onApply, onReset }: FilterPanelProps) {
  const { t: translate } = useTranslation("filters");

  return (
    <div>
      <div role="group" aria-label={translate("panel.label") || "Filters"} className="filter-grid">
        {filters.map(f => {
          const label = f.labelKey ? translate(f.labelKey) || f.label : f.label;
          const id = `filter-${f.key}`;

          if (f.type === "select") {
            const opts = (f.options ?? []).map(o => ({
              value: o,
              label: f.optionKeys?.[o] ? translate(f.optionKeys[o]) || o : o,
            }));
            return (
              <AppSelectField
                key={f.key}
                id={id}
                label={label}
                value={values[f.key] ?? ""}
                onChange={v => onChange(f.key, v)}
                options={opts}
                compact
              />
            );
          }

          if (f.type === "date") {
            return (
              <AppDateField
                key={f.key}
                id={id}
                label={label}
                value={values[f.key] ?? ""}
                onChange={v => onChange(f.key, v)}
                compact
              />
            );
          }

          return (
            <AppTextField
              key={f.key}
              id={id}
              label={label}
              value={values[f.key] ?? ""}
              onChange={v => onChange(f.key, v)}
              compact
            />
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
        <SecondaryButton size="sm" onClick={onReset} aria-label={translate("buttons.reset") || "Reset filters"}>
          {translate("buttons.reset")}
        </SecondaryButton>
        <PrimaryButton size="sm" onClick={onApply} aria-label={translate("buttons.applyFilters") || "Apply filters"}>
          {translate("buttons.applyFilters")}
        </PrimaryButton>
      </div>
    </div>
  );
}
