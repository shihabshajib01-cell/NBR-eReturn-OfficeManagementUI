Continue the safe refactor. Do this phase only:

Move shared components out of ModulePages.tsx without changing the UI.

Do not redesign the UI.
Do not change layouts.
Do not change colors.
Do not change spacing.
Do not change table headers.
Do not change navigation labels.
Do not change routes.
Do not change data values.
Do not remove features.
Do not create placeholder pages.
Do not clean inline CSS in this phase.
Do not optimize unrelated files.
Do not rewrite pages from scratch.

Current issue:
src/app/components/ModulePages.tsx is still too large and contains shared reusable components, shared helpers, report/page logic, and route resolving logic in one file.

Goal:
Reduce ModulePages.tsx by moving only reusable/shared components and helpers into proper component, utility, and data files.

Important:
Preserve the exact rendered UI and behavior.

Move these shared components out of ModulePages.tsx:

1. Stat/KPI components
Move to:
src/app/components/cards/

Expected files:
- StatCard.tsx
- KpiRow.tsx

2. Badge components
Move to:
src/app/components/badges/

Expected files:
- StatusBadge.tsx

If another StatusBadge already exists, do not create a duplicate. Merge safely by preserving the current UI behavior.

3. Table components
Move to:
src/app/components/tables/

Expected files:
- CardTable.tsx
- TableToolbar.tsx
- TablePagination.tsx

If Pagination already exists, do not create another Pager component. Use one shared pagination component.

4. Filter components
Move to:
src/app/components/filters/

Expected files:
- FilterPanel.tsx
- AppliedFilterChips.tsx

5. Drawer component
Move to:
src/app/components/drawers/

Expected files:
- RecordDetailsDrawer.tsx

If a drawer component already exists, reuse or merge safely.

6. Modal component
Move to:
src/app/components/modals/

Expected files:
- AppModal.tsx

If a modal component already exists, reuse or merge safely.

7. Form components
Move to:
src/app/components/forms/

Expected files:
- EntryForm.tsx

8. Tabs
Move to:
src/app/components/tabs/

Expected files:
- TabBar.tsx

Create the folder if it does not exist.

9. Generic generated page layout
Move to:
src/app/components/pages/

Expected files:
- GeneratedTablePage.tsx

This should replace the current GenPage component name if GenPage is generic. Keep the exported API stable if other files still import GenPage.

10. Report page component
Move to:
src/app/components/reports/

Expected files:
- ReportPage.tsx

11. Route/page resolver
Move route resolving logic out of ModulePages.tsx.

Move:
- resolveModulePage

To:
src/app/utils/routeHelpers.ts

or, if it depends heavily on route config:
src/app/data/routes.ts

12. Report configs/data
Move report config arrays and mock report data out of ModulePages.tsx.

Move to:
src/app/data/reportConfigs.ts
src/app/data/mockReportData.ts

If these files already exist, append/merge carefully without duplication.

Rules for extraction:
- Keep props exactly compatible.
- Export each extracted component properly.
- Update all imports.
- Do not leave duplicate component definitions in ModulePages.tsx.
- Do not change JSX structure unless needed to preserve imports.
- Do not rename user-facing labels.
- Do not change action buttons.
- Do not change table behavior.
- Do not change drawer behavior.
- Do not change modal behavior.
- Do not change pagination behavior.
- Do not change filter behavior.

Duplicate cleanup rules:
Check for existing duplicates before creating new files.

Avoid duplicates like:
- StatusBadge and SBadge
- Pagination and Pager
- Drawer and RecordDetailsDrawer
- Modal and AppModal
- rgba helper repeated in multiple files
- ReportPage duplicated in multiple places
- table toolbar duplicated in multiple places

If duplicates exist:
- Pick the cleaner shared version.
- Preserve all visual states from the current working UI.
- Update imports to use the shared component.
- Remove unused duplicate definitions only if they are confirmed unused.

Helper function rules:
Move generic helpers to:

src/app/utils/colors.ts
src/app/utils/formatDate.ts
src/app/utils/formatCurrency.ts
src/app/utils/formatNumber.ts
src/app/utils/tableHelpers.ts
src/app/utils/routeHelpers.ts

For rgba():
- Keep only one implementation.
- Put it in src/app/utils/colors.ts
- Replace repeated local rgba helpers with the shared import.

ModulePages.tsx target:
After this phase, ModulePages.tsx should not contain:
- StatCard
- SBadge
- KpiRow
- FilterPanel
- AppliedChips
- CardTable
- Pager
- Drawer
- Modal
- EntryForm
- TabBar
- GenPage
- ReportPage
- report config arrays
- large mock data arrays
- repeated rgba helper

ModulePages.tsx may temporarily remain as:
- a compatibility export file
- a small route composition file
- a small module resolver file

Expected size:
- Ideal: removed completely
- Acceptable: under 150 lines
- Not acceptable: still hundreds of lines

Validation checklist:
After extraction, confirm:

- App builds successfully.
- Dashboard pages still load.
- Report pages still load.
- Return Register pages still load.
- Register & Stock pages still load.
- PSR & Verification pages still load.
- Case & Financial Management pages still load.
- Administration & Requests pages still load.
- User Management still loads.
- Role Management still loads.
- All tables render the same.
- Table filters still work.
- Pagination still works.
- Record details drawer still opens.
- Modals still open.
- Status badges still look the same.
- KPI cards still look the same.
- Dark mode still works.
- Light themes still work.
- No blank pages appear.
- No import/export errors.
- No duplicate shared components remain in ModulePages.tsx.

Do not:
- Do not move page files in this phase.
- Do not change CSS in this phase unless import paths break.
- Do not remove inline styles in this phase.
- Do not refactor App.tsx in this phase unless imports require it.
- Do not rename routes.
- Do not rewrite data.

Final report required:
After completion, report:

1. Files created
2. Files modified
3. Components moved out of ModulePages.tsx
4. Helpers moved out of ModulePages.tsx
5. Data/config moved out of ModulePages.tsx
6. Duplicate components removed or merged
7. What remains inside ModulePages.tsx
8. New ModulePages.tsx line count
9. Build status
10. Any remaining risks
11. Next recommended phase

Stop after this phase.