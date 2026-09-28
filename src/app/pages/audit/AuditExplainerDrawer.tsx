import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { ResponsiveOverlay } from "../../components/shared/ResponsiveOverlay";
import type { AuditExplanation } from "./auditKnowledge";

interface AuditExplainerDrawerProps {
  explanation: AuditExplanation | null;
  onClose: () => void;
}

export function AuditExplainerDrawer({ explanation, onClose }: AuditExplainerDrawerProps) {
  const { t: tc } = useTranslation("common");
  if (!explanation) return null;

  return (
    <ResponsiveOverlay
      open
      onClose={onClose}
      title={explanation.title}
      closeLabel={tc("accessibility.closeDrawer")}
      desktopWidth="540px"
      className="audit-explainer-drawer"
    >
      <div className="audit-explainer">
        <div className="audit-explainer__category">
          <Info size={14} strokeWidth={1.8} aria-hidden="true" />
          <span>{explanation.category}</span>
        </div>

        <div className="audit-explainer__block">
          <h3>What it means</h3>
          <p>{explanation.definition}</p>
        </div>

        <div className="audit-explainer__block">
          <h3>What it affects</h3>
          <p>{explanation.effect}</p>
        </div>

        {explanation.sections.map((section, index) => (
          <div className="audit-explainer__section" key={`${section.title}-${index}`}>
            <h3>{section.title}</h3>
            <dl className="audit-explainer__details">
              {section.items.map((item) => (
                <div className="audit-explainer__detail" key={`${item.label}-${item.value}`}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        {explanation.nextStep && (
          <div className="audit-explainer__block">
            <h3>Next step</h3>
            <p>{explanation.nextStep}</p>
          </div>
        )}

        {explanation.important && (
          <div className="audit-explainer__important" role="note">
            <p>{explanation.important}</p>
          </div>
        )}
      </div>
    </ResponsiveOverlay>
  );
}
