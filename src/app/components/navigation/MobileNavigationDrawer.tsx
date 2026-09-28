import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NAVIGATION } from "../../data/navigation";
import { useRouteNav } from "../../hooks/useRouteNav";
import { SidebarLogo } from "./SidebarLogo";

type LucideIcon = React.ComponentType<{
  size?: number; strokeWidth?: number; style?: React.CSSProperties; className?: string;
}>;

interface SubNavDef {
  id: string;
  label: string;
  labelKey?: string;
  icon?: LucideIcon;
  children?: { id: string; label: string; labelKey?: string; icon?: LucideIcon }[];
}

interface MobileNavigationDrawerProps {
  onLogoClick: () => void;
  onMainNavClick: (id: string) => void;
  onSubNavClick: (mainId: string, subId: string) => void;
  onThirdNavClick: (thirdId: string, parentId: string, mainId: string) => void;
  onClose: () => void;
}

// Active state and accordion expansion derived entirely from URL via useRouteNav.
export function MobileNavigationDrawer({
  onLogoClick,
  onMainNavClick,
  onSubNavClick,
  onThirdNavClick,
  onClose,
}: MobileNavigationDrawerProps) {
  const { t: translate } = useTranslation("navigation");
  const { activeMain, activeSub, activeThird } = useRouteNav();

  const [expandedMain, setExpandedMain] = useState<string | null>(activeMain);
  const [expandedSub, setExpandedSub] = useState<string | null>(activeSub);

  const getMainLabel = (item: typeof NAVIGATION[0]): string => {
    if (item.labelKey) return translate(item.labelKey, item.label);
    const key = item.id.replace(/-./g, (match) => match[1].toUpperCase());
    return translate(`${key}.main`, item.label);
  };

  const getSubLabel = (parentId: string, childId: string, labelKey: string | undefined, fallback: string): string => {
    if (labelKey) return translate(labelKey, fallback);
    const parentKey = parentId.replace(/-./g, (m) => m[1].toUpperCase());
    const childKey = childId.replace(/-./g, (m) => m[1].toUpperCase());
    return translate(`${parentKey}.${childKey}`, fallback);
  };

  const isSubExpanded = (subItem: SubNavDef): boolean => {
    if (activeSub === subItem.id) return true;
    if (subItem.children) return subItem.children.some(c => c.id === activeThird);
    return false;
  };

  const handleMainItemClick = (mainItem: typeof NAVIGATION[0]) => {
    const hasChildren = mainItem.children && mainItem.children.length > 0;
    if (hasChildren) {
      setExpandedMain(prev => prev === mainItem.id ? null : mainItem.id);
    } else {
      onMainNavClick(mainItem.id);
      onClose();
    }
  };

  const handleSubItemClick = (mainId: string, subItem: SubNavDef) => {
    const hasChildren = subItem.children && subItem.children.length > 0;
    if (hasChildren) {
      setExpandedSub(prev => prev === subItem.id ? null : subItem.id);
    } else {
      onSubNavClick(mainId, subItem.id);
      onClose();
    }
  };

  const handleThirdItemClick = (thirdId: string, parentId: string, mainId: string) => {
    onThirdNavClick(thirdId, parentId, mainId);
    onClose();
  };

  return (
    <div className="mobile-nav-drawer">
      {/* Logo / Header */}
      <div className="mobile-nav-drawer__header">
        <SidebarLogo onLogoClick={onLogoClick} />
      </div>

      {/* Navigation List */}
      <nav className="mobile-nav-drawer__nav" aria-label="Mobile Navigation">
        {NAVIGATION.filter(({ id }) => id !== "settings").map((mainItem) => {
          const MainIcon = mainItem.icon;
          const isMainActive = activeMain === mainItem.id;
          const hasChildren = mainItem.children && mainItem.children.length > 0;
          const isExpanded = expandedMain === mainItem.id;
          const submenuId = `mobile-nav-sub-${mainItem.id}`;

          return (
            <div key={mainItem.id} className="mobile-nav-drawer__section">
              {/* 1st Layer - Main Navigation Item */}
              <button
                onClick={() => handleMainItemClick(mainItem)}
                className={[
                  "mobile-nav-drawer__main-item",
                  isMainActive ? "mobile-nav-drawer__main-item--active" : "",
                ].join(" ")}
                aria-expanded={hasChildren ? isExpanded : undefined}
                aria-controls={hasChildren ? submenuId : undefined}
                aria-current={isMainActive ? "page" : undefined}
              >
                <div className="mobile-nav-drawer__main-item-content">
                  <MainIcon
                    size={20}
                    strokeWidth={isMainActive ? 2.5 : 1.75}
                    className="mobile-nav-drawer__main-item-icon"
                    aria-hidden="true"
                  />
                  <span className="mobile-nav-drawer__main-item-label">
                    {getMainLabel(mainItem)}
                  </span>
                </div>
                {hasChildren && (
                  <ChevronRight
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={[
                      "mobile-nav-drawer__chevron",
                      isExpanded ? "mobile-nav-drawer__chevron--expanded" : "",
                    ].join(" ")}
                  />
                )}
              </button>

              {/* 2nd Layer - Submenu Items */}
              {isExpanded && hasChildren && (
                <div id={submenuId} className="mobile-nav-drawer__submenu">
                  {mainItem.children.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const hasSubChildren = subItem.children && subItem.children.length > 0;
                    const subExpanded = expandedSub === subItem.id;
                    const thirdMenuId = `mobile-nav-third-${mainItem.id}-${subItem.id}`;

                    const isSubActive = hasSubChildren
                      ? subItem.children!.some((c) => c.id === activeThird)
                      : activeSub === subItem.id;

                    return (
                      <div key={subItem.id} className="mobile-nav-drawer__sub-section">
                        <button
                          onClick={() => handleSubItemClick(mainItem.id, subItem)}
                          className={[
                            "mobile-nav-drawer__sub-item",
                            isSubActive ? "mobile-nav-drawer__sub-item--active" : "",
                          ].join(" ")}
                          aria-expanded={hasSubChildren ? subExpanded : undefined}
                          aria-controls={hasSubChildren ? thirdMenuId : undefined}
                          aria-current={isSubActive ? "page" : undefined}
                        >
                          <div className="mobile-nav-drawer__sub-item-content">
                            {SubIcon && (
                              <SubIcon
                                size={16}
                                strokeWidth={isSubActive ? 2.5 : 1.75}
                                className="mobile-nav-drawer__sub-item-icon"
                                aria-hidden="true"
                              />
                            )}
                            <span className="mobile-nav-drawer__sub-item-label">
                              {getSubLabel(mainItem.id, subItem.id, subItem.labelKey, subItem.label)}
                            </span>
                          </div>
                          {hasSubChildren && (
                            <ChevronDown
                              size={14}
                              strokeWidth={2}
                              aria-hidden="true"
                              className={[
                                "mobile-nav-drawer__sub-chevron",
                                subExpanded ? "mobile-nav-drawer__sub-chevron--expanded" : "",
                              ].join(" ")}
                            />
                          )}
                        </button>

                        {/* 3rd Layer */}
                        {hasSubChildren && subExpanded && (
                          <div id={thirdMenuId} className="mobile-nav-drawer__third-menu">
                            {subItem.children!.map((thirdItem) => {
                              const ThirdIcon = thirdItem.icon;
                              const isThirdActive = activeThird === thirdItem.id;

                              return (
                                <button
                                  key={thirdItem.id}
                                  onClick={() => handleThirdItemClick(thirdItem.id, subItem.id, mainItem.id)}
                                  className={[
                                    "mobile-nav-drawer__third-item",
                                    isThirdActive ? "mobile-nav-drawer__third-item--active" : "",
                                  ].join(" ")}
                                  aria-current={isThirdActive ? "page" : undefined}
                                >
                                  {ThirdIcon ? (
                                    <ThirdIcon
                                      size={14}
                                      strokeWidth={isThirdActive ? 2.5 : 1.75}
                                      className="mobile-nav-drawer__third-item-icon"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <span className="mobile-nav-drawer__third-item-dot" aria-hidden="true" />
                                  )}
                                  <span className="mobile-nav-drawer__third-item-label">
                                    {getSubLabel(mainItem.id, thirdItem.id, thirdItem.labelKey, thirdItem.label)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
