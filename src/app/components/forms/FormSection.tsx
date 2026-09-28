import type { ReactNode } from "react";
import type { IconComponent } from "../../pages/modulePageUtils";

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: IconComponent;
  children?: ReactNode;
  variant?: "grid" | "stack";
}

export function FormSection({
  title,
  description,
  icon: Icon,
  children,
  variant = "stack",
}: FormSectionProps) {
  return (
    <section className="form-section">
      <header className="form-section__header">
        {Icon && (
          <span className="form-section__icon" aria-hidden="true">
            <Icon size={14} strokeWidth={1.8} />
          </span>
        )}
        <div className="form-section__heading">
          <h3 className="form-section__title">{title}</h3>
          {description && <p className="form-section__description">{description}</p>}
        </div>
      </header>
      {children !== undefined && children !== null && (
        <div className={`form-section__body--${variant}`}>
          {children}
        </div>
      )}
    </section>
  );
}
