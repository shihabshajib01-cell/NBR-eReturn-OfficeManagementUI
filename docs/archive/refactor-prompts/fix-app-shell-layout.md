Fix the broken app shell layout caused by the latest refactor.

Do not redesign the UI.
Do not change the visual design.
Do not change navigation names.
Do not change routes.
Do not change page content.
Do not change table headers.
Do not refactor unrelated components.
Do not move pages or components in this phase.
Do not change card/table designs in this phase.
Do not touch data values.

Problem:
The latest live UI is broken. The left navigation is overlapping the page content. Dashboard cards and content start under the sidebar. Some pages appear broken because the app shell layout is not reserving sidebar space.

Likely root cause:
The shell layout currently depends on Tailwind utility classes and responsive classes such as lg:relative, lg:translate-x-0, fixed, inset-y-0, flex, h-screen, overflow-hidden, etc. After refactor/CSS cleanup, those classes are not reliably controlling the desktop shell layout.

Goal:
Replace the fragile app-shell Tailwind layout classes with explicit semantic CSS classes so the sidebar, secondary navigation, topbar, breadcrumbs, and main content always align correctly.

Scope:
Fix only the app shell layout.

Primary files to check:
- src/app/App.tsx
- src/styles/layout.css
- src/styles/navigation.css
- src/styles/index.css

Do not rewrite PrimarySidebar or SecondarySidebar unless absolutely required.
Do not change page-level components.

Required behavior:

Desktop layout:
- The app must use a horizontal shell layout.
- Primary sidebar must stay on the far left.
- Primary sidebar width must remain 80px.
- Secondary sidebar must appear beside primary sidebar.
- Secondary sidebar width must be:
  - 240px when expanded
  - 52px when compact
  - 0px when hidden
- Main content must start after the sidebar area.
- Main content must never go behind the sidebar.
- Topbar must align with the main content area.
- Breadcrumb bar must align with the main content area.
- Page content must align under the breadcrumb area.
- Dashboard cards must start inside the content area, not under the sidebar.

Mobile/tablet layout:
- Sidebar may behave like a drawer.
- Mobile drawer overlay must appear only when opened.
- Main content should not be permanently pushed by hidden mobile sidebar.
- Menu button should open/close the drawer.
- Drawer should slide smoothly.
- Backdrop should close the drawer.

Implementation instruction:

1. In App.tsx, replace the fragile shell className strings with semantic classes.

Use a structure like:

<div className="app-shell" style={{ fontFamily }}>
  <a className="skip-link" href="#main-content">
    Skip to main content
  </a>

  {mobileDrawerOpen && (
    <div className="app-mobile-backdrop" onClick={...} />
  )}

  <aside
    className={[
      "app-sidebar-shell",
      mobileDrawerOpen ? "app-sidebar-shell--open" : "",
    ].join(" ")}
  >
    <PrimarySidebar ... />
    <SecondarySidebar ... />
  </aside>

  <div className="app-main-shell">
    <Topbar ... />
    <Breadcrumbs ... />

    <main id="main-content" className="app-page-content">
      ...
    </main>
  </div>
</div>

2. Add explicit CSS in src/styles/layout.css.

Add or update these classes:

.app-shell {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
  background: var(--color-background);
  color: var(--color-text-primary);
}

.app-sidebar-shell {
  flex: 0 0 auto;
  height: 100vh;
  display: flex;
  position: relative;
  z-index: 50;
  background: var(--color-surface);
}

.app-main-shell {
  flex: 1 1 auto;
  min-width: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-page-content {
  flex: 1 1 auto;
  min-width: 0;
  overflow: auto;
  outline: none;
}

.app-page-content--workspace {
  display: flex;
  overflow: hidden;
}

.app-mobile-backdrop {
  display: none;
}

.skip-link {
  position: fixed;
  top: -48px;
  left: 8px;
  z-index: 10000;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  text-decoration: none;
  white-space: nowrap;
  transition: top 150ms ease;
}

.skip-link:focus {
  top: 8px;
}

@media (max-width: 1023px) {
  .app-sidebar-shell {
    position: fixed;
    inset: 0 auto 0 0;
    transform: translateX(-100%);
    transition: transform 200ms ease;
  }

  .app-sidebar-shell--open {
    transform: translateX(0);
  }

  .app-mobile-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(15, 23, 42, 0.48);
  }

  .app-main-shell {
    width: 100vw;
  }
}

@media (min-width: 1024px) {
  .app-sidebar-shell {
    position: relative;
    transform: none;
  }

  .app-main-shell {
    width: auto;
  }
}

3. Remove or replace these fragile class strings from App.tsx:
- flex h-screen overflow-hidden
- fixed inset-y-0 left-0 flex z-50 flex-shrink-0
- transform transition-transform duration-200 ease-in-out
- translate-x-0
- -translate-x-full
- lg:relative
- lg:inset-auto
- lg:translate-x-0
- lg:z-auto
- flex-1 flex flex-col overflow-hidden min-w-0

Use semantic classes instead.

4. Keep the existing PrimarySidebar and SecondarySidebar visual design.
Do not change:
- icons
- labels
- active states
- hover states
- compact/expanded behavior
- colors
- spacing
- logo position

5. Make sure CSS import order is correct in src/styles/index.css.

Required order:

@import './fonts.css';
@import './tailwind.css';
@import './theme.css';
@import './tokens.css';
@import './typography.css';
@import './globals.css';
@import './layout.css';
@import './navigation.css';
@import './tables.css';
@import './cards.css';
@import './forms.css';
@import './buttons.css';
@import './badges.css';
@import './modals.css';
@import './drawers.css';
@import './dropdowns.css';
@import './animations.css';

6. Do not rely on Tailwind responsive classes for the app shell.
Tailwind utility classes may remain inside smaller components for now, but the main shell layout must work through explicit CSS classes.

7. Verify these pages after the fix:
- Dashboard > Dashboard
- Dashboard > PSR Dashboard
- Dashboard > Double Entry Dashboard
- Report > Offline Return Report
- Return Register > Return View Approval
- Register & Stock > Register-4
- PSR & Verification > PSR Approval
- Case & Financial Management > Litigation Management
- Administration & Requests > User Management
- Administration & Requests > Role Management

Validation checklist:
- App builds successfully.
- Sidebar is vertical.
- Primary sidebar is 80px wide.
- Secondary sidebar appears beside the primary sidebar.
- Main content starts after the sidebar, not under it.
- Topbar starts after the sidebar, not under it.
- Breadcrumb starts after the sidebar, not under it.
- Dashboard cards are fully visible.
- Tables are fully visible.
- No page content is hidden behind navigation.
- Mobile drawer still opens and closes.
- Login page still works.
- Logout still routes to login.
- Logo click still routes to Dashboard > Dashboard.
- Notification dropdown works.
- Account dropdown works.
- Appearance dropdown works.
- Theme switching works.
- Dark mode still works.
- No blank pages appear.

Do not:
- Do not redesign cards.
- Do not redesign tables.
- Do not touch page data.
- Do not move more files.
- Do not refactor ModulePages.tsx in this phase.
- Do not clean all inline CSS in this phase.
- Do not create placeholder pages.

Final report:
After completion, report:
1. Files changed
2. App shell classes added
3. Tailwind shell classes removed from App.tsx
4. Desktop layout status
5. Mobile drawer status
6. Build status
7. Any remaining broken pages
8. Next recommended fix