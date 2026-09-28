Continue the safe refactor. Do this phase only:

Reduce App.tsx further.

Do not redesign the UI.
Do not change the visual design.
Do not change routes unless required to move routing setup out of App.tsx.
Do not change navigation names.
Do not change page content.
Do not change table headers.
Do not change CSS in this phase unless only needed to fix a broken import.
Do not move inline styles in this phase.
Do not split unrelated page files in this phase.
Do not remove any feature.

Current issue:
src/app/App.tsx is still too large and contains app logic that should live in separate files.

Goal:
Make App.tsx small, clean, and focused only on app-level composition.

Final App.tsx should only:
- import global styles if needed
- initialize app providers
- initialize auth/session state if still needed at app level
- render routes or AppRouter
- render authenticated app layout when logged in
- render login/auth layout when logged out

App.tsx should not contain:
- page JSX
- table JSX
- navigation data arrays
- mock data arrays
- report config arrays
- notification mock data
- role/user mock data
- theme palette arrays
- dropdown component definitions
- modal component definitions
- drawer component definitions
- card/table/button definitions
- large helper functions
- route-page mapping logic mixed with JSX
- inline CSS/style objects

Target structure:

src/app/
  App.tsx
  AppRouter.tsx
  routes.tsx
  routeGuards.ts
  appConfig.ts

src/app/state/
  AuthProvider.tsx
  ThemeProvider.tsx
  NavigationProvider.tsx
  AppStateProvider.tsx

src/app/data/
  appNavigation.ts
  appRoutes.ts
  appThemes.ts

If these folders already exist elsewhere, use the existing structure and do not duplicate.

Phase scope:
Only move app-level logic out of App.tsx.
Do not refactor page internals.

Recommended extraction:

1. Routing
Move route/page mapping into:
src/app/routes.tsx
or
src/app/AppRouter.tsx

Routes must preserve current behavior:
- /login opens LoginPage
- successful login routes to Dashboard > Dashboard
- logout routes to LoginPage
- top-left logo routes to Dashboard > Dashboard
- primary nav click selects first valid secondary page
- no placeholder module page appears

2. Navigation configuration
Move navigation arrays/config out of App.tsx into:
src/app/data/appNavigation.ts
or existing navigation data file.

Keep:
- primary navigation labels unchanged
- secondary navigation labels unchanged
- icons unchanged
- route keys unchanged
- active-state behavior unchanged

3. Theme configuration
Move theme palette data out of App.tsx into:
src/app/data/appThemes.ts

Keep all 6 themes:
- Indigo Blue
- Government Blue
- Slate Purple
- Plum Executive
- Fresh Teal
- Gmail-inspired Dark Mode

Do not change token values.

4. Auth/session state
If App.tsx contains auth state, move reusable logic into:
src/app/state/AuthProvider.tsx
or
src/app/hooks/useAuth.ts

Keep prototype behavior:
- typing any random login values and clicking Sign in routes to Dashboard > Dashboard
- logout from account dropdown routes to LoginPage
- session state clears on logout

5. Navigation state
If App.tsx contains active primary/secondary navigation logic, move it into:
src/app/state/NavigationProvider.tsx
or
src/app/hooks/useNavigation.ts

Keep:
- active primary nav
- active secondary nav
- expanded groups
- breadcrumb updates
- default first-child selection
- no single-item unnecessary navigation behavior

6. Theme/font/font-size state
If App.tsx contains theme/font/font-size state, move it into:
src/app/state/ThemeProvider.tsx
or existing theme hook.

Keep:
- theme switching
- dark mode
- font selector
- font size selector
- appearance dropdown behavior

7. Mock data
If App.tsx still contains mock data arrays, move them into:
src/app/data/
or
src/app/data/mock/

Examples:
- notifications
- users
- roles
- reports
- dashboard metrics
- table rows

Do not change displayed values.

8. App shell composition
If App.tsx contains large layout JSX, move it into:
src/app/layouts/AppShell.tsx
or existing layout file.

App.tsx should render:
<AppProviders>
  <AppRouter />
</AppProviders>

or similarly small composition.

Rules:
- Keep all imports correct.
- Do not leave duplicate config/data in App.tsx.
- Do not break any page import.
- Do not move visual component internals in this phase.
- Do not modify CSS except import paths if required.
- Do not remove comments unless obsolete.
- Keep TypeScript types intact.
- Move types with the config if they belong together.
- Shared types may go into:
  src/app/types.ts
  or
  src/types/

Validation checklist:
After reducing App.tsx, verify:
- App builds successfully.
- Login page opens.
- Login redirects to Dashboard > Dashboard.
- Logout redirects to LoginPage.
- Logo click routes to Dashboard > Dashboard.
- Primary navigation works.
- Secondary navigation works.
- Default first child selection works.
- Breadcrumbs show full names.
- Dashboard page loads.
- Report pages load.
- Return Register pages load.
- Register & Stock pages load.
- PSR & Verification pages load.
- Case & Financial Management pages load.
- Administration & Requests pages load.
- User Management page loads.
- Role Management page loads.
- Notification dropdown opens.
- Account dropdown opens.
- Appearance dropdown opens.
- Theme switching works.
- Dark mode works.
- Font selector works.
- Font size selector works.
- Modals and drawers still open.
- No page becomes blank.
- No console errors.

Expected final App.tsx:
- ideally under 150 lines
- acceptable under 250 lines if providers are still simple
- no page-level JSX
- no large data arrays
- no inline style objects
- no internal component definitions

After completion, report:
1. Files created
2. Files modified
3. Logic moved out of App.tsx
4. What remains in App.tsx
5. New App.tsx line count
6. Build status
7. Any broken imports fixed
8. Any remaining risks
9. Next recommended phase

Stop after this phase.