import { Suspense } from "react";
import { Outlet } from "react-router";
import { PageLoader } from "../components/shared/PageLoader";

export function MainContentArea() {
  return (
    <main id="main-content" tabIndex={-1} className="app-page-content app-page-content--workspace">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
  );
}
