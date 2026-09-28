import { KpiRow } from "./KpiRow";
import type { KpiDef } from "../../pages/modulePageUtils";

interface CollapsibleKpiSectionProps {
  kpis: KpiDef[];
  open: boolean;
}

export function CollapsibleKpiSection({ kpis, open }: CollapsibleKpiSectionProps) {
  return (
    <div
      id="kpi-section-panel"
      className={`kpi-section__panel${open ? " kpi-section__panel--open" : ""}`}
      aria-hidden={!open}
    >
      <div className="kpi-section__body">
        <KpiRow kpis={kpis} />
      </div>
    </div>
  );
}
