import { Check } from "lucide-react";

interface SelectedCheckmarkProps {
  visible: boolean;
  color: string;
}

export function SelectedCheckmark({ visible, color }: SelectedCheckmarkProps) {
  if (!visible) return null;
  return <Check size={13} strokeWidth={2.5} style={{ color, flexShrink: 0 }} aria-hidden="true" />;
}
