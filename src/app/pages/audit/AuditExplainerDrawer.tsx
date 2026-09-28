import { useTranslation } from "react-i18next";
import { ResponsiveOverlay } from "../../components/shared/ResponsiveOverlay";
import type { AuditExplanation } from "./auditKnowledge";

interface AuditExplainerDrawerProps {
  explanation: AuditExplanation | null;
  onClose: () => void;
}

export function AuditExplainerDrawer({ explanation, onClose }: AuditExplainerDrawerProps) {
  const { t: tc } = useTranslation("common");
  const { t } = useTranslation("audit");
  if (!explanation) return null;

  const textSection = (title: string, value: string) => (
    <section className="detail-section">
      <h3 className="detail-section__head detail-section__head--static">{title}</h3>
      <div className="drawer-field-grid">
        <div className="drawer-field drawer-field--wide">
          <div className="drawer-field__value">
            <span>{value}</span>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <ResponsiveOverlay
      open
      onClose={onClose}
      title={explanation.title}
      closeLabel={tc("accessibility.closeDrawer")}
      desktopWidth="540px"
    >
      <div className="form-stack">
        {textSection(t("explainer.whatItMeans"), explanation.definition)}
        {textSection(t("explainer.whatItAffects"), explanation.effect)}

        {explanation.sections.map((section, sectionIndex) => (
          <section className="detail-section" key={`${section.title}-${sectionIndex}`}>
            <h3 className="detail-section__head detail-section__head--static">{section.title}</h3>
            <div className="drawer-field-grid">
              {section.items.map((item, itemIndex) => {
                const shouldSpan = section.items.length % 2 === 1 && itemIndex === section.items.length - 1;
                return (
                  <div
                    className={`drawer-field${shouldSpan ? " drawer-field--wide" : ""}`}
                    key={`${item.label}-${item.value}`}
                  >
                    <span className="drawer-field__label">{item.label}</span>
                    <div className="drawer-field__value">
                      <span>{item.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {explanation.nextStep && textSection(t("explainer.nextStep"), explanation.nextStep)}
        {explanation.important && textSection(t("explainer.important"), explanation.important)}
      </div>
    </ResponsiveOverlay>
  );
}
