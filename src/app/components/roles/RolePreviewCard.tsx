import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePermissionRegistry } from "../../hooks/usePermissionRegistry";
import { ExpandableText } from "../shared/SafeText";

interface RolePreviewCardProps {
  roleName: string;
  roleDescription: string;
  selectedPermIds: string[];
}

export function RolePreviewCard({ roleName, roleDescription, selectedPermIds }: RolePreviewCardProps) {
  const { t: tr } = useTranslation("role");
  const { permissionGroups, allPermissionIds } = usePermissionRegistry();

  return (
    <div className="role-preview-card">
      <div className="role-preview-card__header">
        <div className="role-preview-card__badge">
          <Shield size={13} strokeWidth={2} className="text-[var(--color-primary)]" />
          <span className="role-preview-card__badge-label">{tr("preview.title")}</span>
        </div>
        <p className="role-preview-card__name">
          <ExpandableText value={roleName || tr("preview.unnamedRole")} collapsedLines={2} maxChars={80} as="span" />
        </p>
        {roleDescription && (
          <p className="role-preview-card__description">
            <ExpandableText value={roleDescription} collapsedLines={3} maxChars={140} as="span" />
          </p>
        )}
      </div>
      <div className="role-preview-card__body">
        <p className="role-preview-card__modules-title">{tr("preview.modules")}</p>
        <div className="role-preview-card__modules-list">
          {permissionGroups.map((g) => {
            const count = g.permissions.filter((p) => selectedPermIds.includes(p.id)).length;
            const pct = g.permissions.length > 0 ? (count / g.permissions.length) * 100 : 0;
            const barVariant = count === g.permissions.length ? "role-preview-module__progress-bar--full"
              : count > 0 ? "role-preview-module__progress-bar--partial" : "";
            return (
              <div key={g.id} className="role-preview-module">
                <div className="role-preview-module__header">
                  <span className={`role-preview-module__name ${count > 0 ? "role-preview-module__name--active" : "role-preview-module__name--inactive"}`}>
                    {g.label}
                  </span>
                  <span className="role-preview-module__count">{count}/{g.permissions.length}</span>
                </div>
                <div className="role-preview-module__progress">
                  <div
                    className={`role-preview-module__progress-bar ${barVariant}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="role-preview-card__footer">
          <span className="role-preview-card__total-label">{tr("preview.totalPermissions")}</span>
          <span className="role-preview-card__total-value">{selectedPermIds.length} / {allPermissionIds.length}</span>
        </div>
      </div>
    </div>
  );
}
