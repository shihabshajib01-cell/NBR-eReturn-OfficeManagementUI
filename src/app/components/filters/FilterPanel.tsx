import { useTranslation } from "react-i18next";
import type { FilterDef } from "../../pages/modulePageUtils";
import { AppTextField } from "../forms/AppTextField";
import { AppSelectField } from "../forms/AppSelectField";
import { TaxZoneSelectField } from "../forms/TaxZoneSelectField";
import { AppDateField } from "../forms/AppDateField";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface FilterPanelProps {
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (k: string, v: string) => void;
  onApply: () => void;
  onReset: () => void;
  cardLayout?: boolean;
}

export function FilterPanel({ filters, values, onChange, onApply, onReset, cardLayout = false }: FilterPanelProps) {
  const { t: translate } = useTranslation("filters");

  const fields = (
    <div role="group" aria-label={translate("panel.label") || "Filters"} className="filter-grid">
      {filters.map(f => {
        const label = f.labelKey ? translate(f.labelKey) || f.label : f.label;
        const id = `filter-${f.key}`;

        if (f.type === "select") {
          const opts = (f.options ?? []).map(o => ({
            value: o,
            label: f.optionKeys?.[o] ? translate(f.optionKeys[o]) || o : o,
          }));

          if (f.key === "zone") {
            const allOption = (f.options ?? []).find(o => o.startsWith("All"));
            const allLabel = allOption
              ? (f.optionKeys?.[allOption] ? translate(f.optionKeys[allOption]) || allOption : allOption)
              : undefined;

            return (
              <TaxZoneSelectField
                key={f.key}
                id={id}
                label={label}
                value={values[f.key] ?? ""}
                onChange={v => onChange(f.key, v)}
                allOptionValue={allOption}
                allOptionLabel={allLabel}
                compact
              />
            );
          }

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
  );

  const actions = (
    <>
      <SecondaryButton size="sm" onClick={onReset} aria-label={translate("buttons.reset") || "Reset filters"}>
        {translate("buttons.reset")}
      </SecondaryButton>
      <PrimaryButton size="sm" onClick={onApply} aria-label={translate("buttons.applyFilters") || "Apply filters"}>
        {translate("buttons.applyFilters")}
      </PrimaryButton>
    </>
  );

  if (cardLayout) {
    return (
      <>
        <div className="card-header">
          <h3 className="dash-section__title-text">
            {translate("buttons.applyFilters")}
          </h3>
        </div>
        <div className="card-body">
          {fields}
        </div>
        <div className="card-footer filter-actions filter-actions--card">
          {actions}
        </div>
      </>
    );
  }

  return (
    <div>
      {fields}
      <div className="filter-actions">
        {actions}
      </div>
    </div>
  );
}
