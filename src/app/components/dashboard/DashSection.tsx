import type { ReactNode } from "react";
import type { IconComponent } from "../../pages/modulePageUtils";

interface DashSectionProps {
  title: string;
  icon: IconComponent;
  badge?: string;
  children: ReactNode;
}

export function DashSection({ title, icon: Icon, badge, children }: DashSectionProps) {
  return (
    <div className="dash-section">
      <div className="dash-section__header">
        <div className="dash-section__title">
          <Icon size={15} strokeWidth={1.75} />
          <h2 className="dash-section__title-text">
            {title}
          </h2>
        </div>
        {badge && (
          <span className="dash-section__badge">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
