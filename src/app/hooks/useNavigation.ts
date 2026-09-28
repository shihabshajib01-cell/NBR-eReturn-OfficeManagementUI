import { useCallback, startTransition } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { useRouteNav } from "./useRouteNav";
import { useUIState } from "./useUI";
import { NAVIGATION } from "../data/navigation";
import {
  toggleSecNavState,
  setMobileDrawerOpen,
  toggleMobileDrawer,
} from "../store/uiSlice";

export function useNavigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { activeMain } = useRouteNav();
  const { isDesktop } = useUIState();

  const handleLogoClick = useCallback(() => {
    startTransition(() => navigate("/dashboard/dashboard-main"));
    dispatch(setMobileDrawerOpen(false));
  }, [navigate, dispatch]);

  const handleMainNavClick = useCallback(
    (id: string) => {
      const navItem = NAVIGATION.find((n) => n.id === id);
      const firstChild = navItem?.children[0];
      startTransition(() => {
        if (firstChild) {
          const firstGrandchild = firstChild.children?.[0];
          if (firstGrandchild) {
            navigate(`/${id}/${firstChild.id}/${firstGrandchild.id}`);
          } else {
            navigate(`/${id}/${firstChild.id}`);
          }
        } else {
          navigate(`/${id}`);
        }
      });
      dispatch(setMobileDrawerOpen(false));
    },
    [navigate, dispatch]
  );

  const handleSubNavClick = useCallback(
    (mainIdOrSubId: string, subId?: string) => {
      const resolvedMain = subId ? mainIdOrSubId : activeMain;
      const resolvedSub = subId ?? mainIdOrSubId;
      const navItem = NAVIGATION.find((n) => n.id === resolvedMain);
      const subItem = navItem?.children.find((c) => c.id === resolvedSub);
      startTransition(() => {
        if (subItem?.children?.length) {
          navigate(`/${resolvedMain}/${resolvedSub}/${subItem.children[0].id}`);
        } else {
          navigate(`/${resolvedMain}/${resolvedSub}`);
        }
      });
      dispatch(setMobileDrawerOpen(false));
    },
    [activeMain, navigate, dispatch]
  );

  const handleThirdNavClick = useCallback(
    (thirdId: string, parentId: string, mainId?: string) => {
      const resolvedMain = mainId || activeMain;
      startTransition(() => navigate(`/${resolvedMain}/${parentId}/${thirdId}`));
    },
    [activeMain, navigate]
  );

  const handleMenuToggle = useCallback(() => {
    if (isDesktop) {
      dispatch(toggleSecNavState());
    } else {
      dispatch(toggleMobileDrawer());
    }
  }, [isDesktop, dispatch]);

  return {
    handleLogoClick,
    handleMainNavClick,
    handleSubNavClick,
    handleThirdNavClick,
    handleMenuToggle,
  };
}
