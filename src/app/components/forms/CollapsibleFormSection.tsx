import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { IconComponent } from "../../pages/modulePageUtils";

interface CollapsibleFormSectionProps {
  title: string;
  description?: string;
  icon?: IconComponent;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleFormSection({
  title,
  description,
  icon: Icon,
  children,
  defaultOpen = true,
}: CollapsibleFormSectionProps) {
  return (
    <details className="form-section form-section--collapsible" open={defaultOpen}>
      <summary className="form-section__header form-section__header--collapsible">
        {Icon && (
          <span className="form-section__icon" aria-hidden="true">
            <Icon size={14} strokeWidth={1.8} />
          </span>
        )}
        <div className="form-section__heading">
          <h3 className="form-section__title">{title}</h3>
          {description && <p className="form-section__description">{description}</p>}
        </div>
        <ChevronDown
          className="form-section__chevron"
          size={16}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </summary>
      <div className="form-section__body--stack">
        {children}
      </div>
    </details>
  );
}
