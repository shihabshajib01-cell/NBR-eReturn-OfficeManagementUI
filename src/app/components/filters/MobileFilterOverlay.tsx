import { useTranslation } from "react-i18next";
import type { FilterDef } from "../../pages/modulePageUtils";
import { AppTextField } from "../forms/AppTextField";
import { AppSelectField } from "../forms/AppSelectField";
import { TaxZoneSelectField } from "../forms/TaxZoneSelectField";
import { AppDateField } from "../forms/AppDateField";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { ResponsiveOverlay } from "../shared/ResponsiveOverlay";

interface MobileFilterOverlayProps {
  isOpen: boolean;
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (k: string, v: string) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

export function MobileFilterOverlay({
  isOpen, filters, values, onChange, onApply, onReset, onClose,
}: MobileFilterOverlayProps) {
  const { t: translate } = useTranslation("filters");

  const activeCount = Object.values(values).filter(v => v && v !== "").length;
  const title = activeCount > 0
    ? `${translate("title")} · ${activeCount} ${translate("activeFilters")}`
    : translate("title");

  const footer = (
    <div className="mobile-filter-overlay__footer">
      <PrimaryButton size="lg" fullWidth onClick={onApply}>
        {translate("buttons.applyFilters")}
      </PrimaryButton>
      {activeCount > 0 && (
        <SecondaryButton size="lg" fullWidth onClick={onReset}>
          {translate("buttons.reset")}
        </SecondaryButton>
      )}
    </div>
  );

  return (
    <ResponsiveOverlay
      open={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      closeLabel={translate("buttons.close")}
      className="mobile-filter-overlay"
    >
      <div className="mobile-filter-overlay__fields">
        {filters.map(f => {
          const label = f.labelKey ? translate(f.labelKey) || f.label : f.label;
          const id = `mobile-filter-${f.key}`;

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
                <div key={f.key} className="mobile-filter-overlay__field-group">
                  <TaxZoneSelectField
                    id={id}
                    label={label}
                    value={values[f.key] ?? ""}
                    onChange={v => onChange(f.key, v)}
                    allOptionValue={allOption}
                    allOptionLabel={allLabel}
                  />
                </div>
              );
            }

            return (
              <div key={f.key} className="mobile-filter-overlay__field-group">
                <AppSelectField id={id} label={label} value={values[f.key] ?? ""} onChange={v => onChange(f.key, v)} options={opts} />
              </div>
            );
          }

          if (f.type === "date") {
            return (
              <div key={f.key} className="mobile-filter-overlay__field-group">
                <AppDateField id={id} label={label} value={values[f.key] ?? ""} onChange={v => onChange(f.key, v)} />
              </div>
            );
          }

          return (
            <div key={f.key} className="mobile-filter-overlay__field-group">
              <AppTextField id={id} label={label} value={values[f.key] ?? ""} onChange={v => onChange(f.key, v)} />
            </div>
          );
        })}
      </div>
    </ResponsiveOverlay>
  );
}