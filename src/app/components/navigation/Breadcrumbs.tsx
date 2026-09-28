import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";

export function Breadcrumbs() {
  const { t: translate } = useTranslation("common");
  const { breadcrumbs } = useBreadcrumbs();

  return (
    <div className="breadcrumb-bar">
      <nav
        aria-label={translate("accessibility.breadcrumbNavigation")}
        className="breadcrumb-nav"
      >
        <ol className="breadcrumb-list">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <li key={idx} className="breadcrumb-item">
                {idx > 0 && (
                  <ChevronRight size={10} className="breadcrumb-separator" aria-hidden="true" />
                )}
                {isLast ? (
                  <span className="breadcrumb-crumb breadcrumb-crumb--current" aria-current="page">
                    {crumb}
                  </span>
                ) : (
                  <span className="breadcrumb-crumb breadcrumb-crumb--ancestor" title={crumb}>
                    {crumb}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
