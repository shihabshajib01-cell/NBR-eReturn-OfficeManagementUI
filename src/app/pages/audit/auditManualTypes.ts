export interface ManualText { en: string; bn: string; }
export const mt = (en: string, bn: string = en): ManualText => ({ en, bn });
export const manualText = (value: ManualText, language?: string) =>
  language?.toLowerCase().startsWith("bn") ? value.bn : value.en;

export type ManualArea = "overview" | "data" | "analysis" | "screening" | "controls" | "workflow" | "governance" | "testing" | "demo";
export type ManualBlock =
  | { kind: "text"; title?: ManualText; text: ManualText }
  | { kind: "callout"; tone?: "info" | "warning" | "critical"; title?: ManualText; text: ManualText }
  | { kind: "list"; title?: ManualText; items: ManualText[] }
  | { kind: "formula"; title?: ManualText; lines: ManualText[]; note?: ManualText }
  | { kind: "table"; title?: ManualText; columns: ManualText[]; rows: ManualText[][]; note?: ManualText }
  | { kind: "matrix"; title: ManualText; modeLabels: ManualText[]; rowLabels: string[]; columnLabels: string[]; values: string[][][]; legend: Record<string, ManualText>; note?: ManualText }
  | { kind: "flow"; title?: ManualText; steps: { label: ManualText; note?: ManualText }[]; sideNote?: ManualText };

export interface ManualSection {
  id: string;
  number: string;
  title: ManualText;
  description?: ManualText;
  area: ManualArea;
  keywords: string[];
  blocks: ManualBlock[];
  sourceOrder?: string;
}
