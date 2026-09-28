Continue the safe refactor. Do this phase only:

Fix build errors, import errors, export errors, and broken route/component references.

Do not redesign the UI.
Do not change the visual design.
Do not change page layouts.
Do not change navigation names.
Do not change table headers.
Do not change data values.
Do not move more components unless required to fix imports.
Do not do CSS cleanup in this phase.
Do not rename files unless required to match imports.
Do not remove features.
Do not create placeholder pages.

Main goal:
Make the project build and run successfully after the recent refactor.

Scope:
Check and fix:
- broken imports
- wrong relative paths
- missing exports
- duplicate exports
- default export vs named export mismatch
- missing component files
- incorrect page imports
- incorrect data/config imports
- broken CSS imports
- broken logo imports
- route mapping errors
- TypeScript type errors caused by moved files
- unused imports that break lint/build
- circular imports if they cause build failure

Execution steps:

1. Run the project build/typecheck.
Use the available project command:
- npm run build
or
- npm run typecheck
or
- npm run dev only if build script is unavailable

2. Read the full error output.
Do not guess.

3. Fix errors one by one.
Start with the first root error, then rerun build/typecheck.

4. Prefer minimal fixes.
Only update imports, exports, paths, and missing references.

5. Do not change component logic unless the build error requires it.

6. Do not replace real pages with placeholders.

Import/export rules:
- If a component file exports default, import it as default.
- If a component file exports named export, import it with braces.
- Do not mix default/named exports randomly.
- Prefer one main component per file.
- Keep page files as default exports if the current route system expects default exports.
- Keep shared components consistent.

Path rules:
- Fix relative paths after files were moved.
- Use existing alias paths only if already configured.
- Do not introduce a new path alias unless the project already supports it.
- Do not create duplicate component files just to satisfy imports.
- Update index.ts barrel exports only if they already exist or are clearly useful.

Routing rules:
Do not change route behavior.

Keep:
- /login opens LoginPage
- successful login routes to Dashboard > Dashboard
- logout routes to LoginPage
- top-left logo click routes to Dashboard > Dashboard
- primary navigation click selects the first valid secondary page
- no placeholder module pages

Logo rules:
Fix logo import if broken.

Use one source only:
- /assets/bangladesh-seal.svg
or the existing official local SVG asset

Do not use:
- external Wikimedia page URL
- old PNG placeholder
- broken import path

CSS import rules:
Make sure the global CSS entry imports required existing CSS files.

Expected import order if files exist:

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
@import './dark-mode.css';

Only import files that actually exist.

Validation checklist:
After fixing errors, confirm:

- App builds successfully
- No TypeScript import/export errors
- Login page opens
- Login button routes to Dashboard > Dashboard
- Logout routes to LoginPage
- Logo click routes to Dashboard > Dashboard
- Sidebar renders vertically
- Primary navigation works
- Secondary navigation works
- Breadcrumbs render full names
- Dashboard page loads
- Report pages load
- Return Register pages load
- Register & Stock pages load
- PSR & Verification pages load
- Case & Financial Management pages load
- Administration & Requests pages load
- User Management page loads
- Role Management page loads
- Notification dropdown opens
- Account dropdown opens
- Appearance dropdown opens
- Modals open
- Drawers open
- Tables render
- No blank placeholder pages appear

Do not:
- do not redesign anything
- do not refactor more than needed
- do not remove files unless they are confirmed dead duplicates
- do not create fake placeholder components
- do not suppress errors without fixing the cause
- do not use `any` everywhere just to silence TypeScript
- do not comment out broken imports unless the imported feature is truly unused

Final report required:
After completion, report:

1. Build command run
2. Initial build/import errors found
3. Files modified
4. Imports/exports fixed
5. Routes fixed, if any
6. CSS imports fixed, if any
7. Logo import fixed, if any
8. Final build status
9. Remaining warnings, if any
10. Next recommended phase

Stop after this phase.