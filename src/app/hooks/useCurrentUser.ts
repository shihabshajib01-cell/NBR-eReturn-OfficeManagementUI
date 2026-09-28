import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { setCurrentUser, updateCurrentUser } from "../store/currentUserSlice";
import type { CurrentUser } from "../store/currentUserSlice";

export function useCurrentUser(): CurrentUser {
  return useSelector((state: RootState) => state.currentUser);
}

export function useCurrentUserDispatch() {
  const dispatch = useDispatch<AppDispatch>();
  return {
    setCurrentUser: (user: CurrentUser) => dispatch(setCurrentUser(user)),
    updateCurrentUser: (patch: Partial<CurrentUser>) => dispatch(updateCurrentUser(patch)),
  };
}
