Update the existing NBR e-Return Office Management project by implementing the content of the new `Combine Dashboard` page using the current design system, existing reusable components, existing responsive behavior, and existing application architecture.

Before changing anything:

* Inspect the current `CombineDashboardPage`.
* Inspect the existing Dashboard page and its reusable dashboard/report components.
* Inspect `DashSection`.
* Inspect `ResponsiveTable`.
* Inspect the existing Assessment Year selector/filter pattern.
* Inspect existing button styles, icon usage, loading states, empty states, error states, mobile table/card behavior, theme tokens, and EN/BN localization structure.
* Reuse the existing system wherever possible.
* Do not create duplicate components if an existing component already solves the same problem.

Scope:
Implement ONLY this report inside `Combine Dashboard`:

`Online and Offline (Combined Report)`

The report must contain only these rows:

* Online
* Offline
* Total

And only these data columns:

* Submission Type
* Total Submission
* Tax Paid with Return (173)
* Total Tax Paid

The page must also contain:

* Assessment Year filter
* Print action

Do not add any other dashboard content.

Required page structure:

```text
Combine Dashboard

Online and Offline (Combined Report)

Assessment Year: [ existing AY selector pattern ]

-------------------------------------------------------------
Submission Type | Total Submission | Tax Paid with Return (173) | Total Tax Paid
-------------------------------------------------------------
Online
Offline
Total
-------------------------------------------------------------

Print
```

Use the project's real design system rather than copying the old legacy report UI.

### Assessment Year filter

Add only ONE filter:

`Assessment Year`

Requirements:

* Reuse the project's existing Assessment Year select/dropdown component or interaction pattern.
* Do not create another custom filter system.
* Do not add search.
* Do not add date range.
* Do not add status filters.
* Do not add Online/Offline filters.
* Do not add taxpayer filters.
* Do not add Apply/Reset controls unless the current project pattern specifically requires them.
* The report should respond to the selected Assessment Year using the existing state/API/data architecture.
* Do not hardcode `2026-2027` into the UI if the project already has selected AY state.
* Do not invent assessment years.
* Do not create new backend logic or endpoints unless an existing confirmed implementation already requires it.
* If the project currently uses mock data for this report, preserve that architecture rather than inventing a backend.

### Report container

Reuse the current report/dashboard section pattern.

Preferred existing component:

`DashSection`

Use it for the main report container if it supports the required content.

Do not create unnecessary components such as:

* `CombinedReportCard`
* `OnlineOfflinePanel`
* `ReportDashboardCard`
* another generic section component

unless the existing component cannot support the requirement.

The section title should be:

`Online and Offline (Combined Report)`

Use the existing typography, spacing, border, radius, surface, and theme tokens.

### Table

Use the project's existing:

`ResponsiveTable`

Do not build a separate custom HTML table unless `ResponsiveTable` genuinely cannot support the required behavior.

Columns:

```text
Submission Type
Total Submission
Tax Paid with Return (173)
Total Tax Paid
```

Rows:

```text
Online
Offline
Total
```

Important:

* The original legacy report has an empty heading for the first column. Fix this UX issue by giving it the explicit heading `Submission Type`.
* Preserve the existing business values exactly from the available project/source data.
* Do not calculate or invent new numbers.
* Do not invent percentages.
* Do not add trend indicators.
* Do not add charts.
* Do not convert these values into KPI cards.
* Do not add sorting unless the existing table component forces it.
* Do not add pagination for a 3-row report.
* Do not add row actions.

### Total row

Make the `Total` row visually easier to distinguish using the current table design system.

Preferred treatment:

* existing strong/summary row style if one exists
* otherwise slightly stronger font weight using existing tokens

Do not introduce a new bright background, status color, or custom visual language.

The emphasis must remain subtle and consistent with the rest of the product.

### Print action

Keep the existing Print functionality/content requirement.

Use the project's existing button component and icon treatment.

The Print control must visually belong to this report.

Do not leave it floating in unrelated empty space like the old system.

Preferred placement:

* inside the report section footer, aligned to the end
* or in the report section header actions if that pattern already exists in the project

Use whichever existing pattern is already used elsewhere.

Do not add:

* Export CSV
* Export Excel
* Download PDF
* Share
* More actions

This task requires only `Print`.

If an existing print implementation exists, reuse it.

Do not create a completely new print engine if the project already has one.

### Do not reproduce legacy UI

The old screen is only a source for the report content and behavior.

Do NOT reproduce:

* old eReturn Office navigation
* old header
* SYSTEM SUPER ADMIN area
* old search field
* old Assessment Year placement
* Government/NBR masthead in the live page content
* patterned background
* old blue table header style
* old heavy panel shadow
* floating Print button
* old spacing or typography

The current Office Management UI remains the visual source of truth.

### Page hierarchy

Use the existing Dashboard page shell.

Expected structure:

```text
Current application shell

Dashboard secondary navigation
→ Combine Dashboard active

Breadcrumb
Home > Dashboard > Combine Dashboard

Page title
Combine Dashboard

Report section
Online and Offline (Combined Report)

Assessment Year filter

Responsive report table

Print
```

Do not redesign the page shell.

### Reusable component requirement

Before creating any new component, search for an existing equivalent.

Reuse:

* existing Dashboard page shell
* `DashSection`
* `ResponsiveTable`
* existing Select/Assessment Year control
* existing Button
* existing icon component
* existing loading indicator
* existing empty state
* existing error state
* existing theme tokens
* existing spacing tokens
* existing typography
* existing responsive utilities

Do not duplicate CSS already available in these components.

If very small page-specific styling is required, keep it scoped to `Combine Dashboard` and use existing CSS variables/tokens.

### Responsive behavior

This must work properly across desktop, tablet, and mobile.

Do not simply shrink the desktop table.

Test at minimum:

* large desktop
* normal desktop/laptop
* tablet
* mobile portrait
* narrow mobile

Desktop:

* Keep the report full-width within the existing content area.
* All columns should remain clearly readable.
* Numeric columns should align consistently.
* Print must remain visually attached to the report.

Tablet:

* Avoid cramped headers.
* Do not allow the whole application page to create unintended horizontal scrolling.
* Preserve all report values.

Mobile:

* Reuse the existing `ResponsiveTable` mobile behavior.
* If the project converts rows to cards, preserve that behavior.
* Each mobile record must still clearly associate all values with its row.

Example mobile information hierarchy:

```text
Online

Total Submission
14

Tax Paid with Return (173)
0

Total Tax Paid
4,01,38,53,753
```

Then:

```text
Offline
...
```

Then:

```text
Total
...
```

Do not hide any report field on mobile.

Do not truncate important financial values in a way that makes them unreadable.

Avoid:

* page-level horizontal overflow
* overlapping values
* clipped column headers
* tiny text
* broken filter width
* inaccessible Print control
* touch targets below the project's existing standard

If the existing responsive table intentionally uses controlled horizontal scrolling instead of card transformation, preserve that existing pattern. Do not invent another responsive behavior.

### Assessment Year on mobile

The AY filter must remain usable on narrow screens.

Requirements:

* label remains understandable
* select remains tappable
* no overflow
* no overlap with report title/actions
* no tiny compressed field

If necessary, allow the section controls to stack using the project's existing responsive form/header pattern.

### Loading state

When Assessment Year changes and data is being retrieved:

* use the existing project loading pattern
* keep the report layout stable where possible
* do not introduce a custom spinner if a shared loading component exists

### Empty state

If the selected Assessment Year has no report data:

* use the existing empty-state pattern
* do not display invented numbers
* do not automatically substitute `0` unless the source data actually returns zero

The user should still be able to change Assessment Year.

### Error state

If report loading fails:

* use the project's existing error treatment
* do not create a new error design
* preserve access to the Assessment Year filter
* preserve any existing retry behavior if the project already supports it

### EN/BN localization

Maintain English/Bangla parity.

Before adding new translation keys:

* search the existing locale files
* reuse existing translations where appropriate
* do not duplicate equivalent labels under different keys

Localize static UI text including, if not already available:

* Combine Dashboard
* Online and Offline (Combined Report)
* Assessment Year
* Submission Type
* Total Submission
* Tax Paid with Return (173)
* Total Tax Paid
* Online
* Offline
* Total
* Print
* empty/error messages if new ones are genuinely required

Do not alter unrelated translations.

### Light and dark mode

The page must inherit the existing theme system.

Do not:

* hardcode light-only colors
* introduce new dark-mode colors
* modify global theme tokens
* change existing Dashboard colors

Use the current surface, border, text, muted text, control, table, and button tokens.

Light mode must remain unchanged outside this page.

Dark mode must remain unchanged outside this page.

### Accessibility

Preserve the project's existing accessibility behavior.

Check:

* table has proper headers
* `Submission Type` is a real table heading
* select has an accessible label
* Print has visible text and accessible name
* keyboard users can reach Assessment Year and Print
* focus states use the existing system
* mobile touch targets remain adequate
* financial values remain readable
* color is not the only method used to distinguish the Total row

### Data and business logic protection

Do not invent:

* new report categories
* new tax calculations
* additional totals
* new Assessment Year rules
* backend endpoints
* permission rules
* role assignments
* tax rates
* status logic

Use only:

* existing project data
* existing API/service architecture
* confirmed source values
* existing state handling

If the backend/API for this exact report is not implemented, preserve the project's current mock/service pattern and clearly isolate the report data source. Do not create fake production behavior.

### Navigation protection

Do not modify the Dashboard secondary navigation except as already implemented for:

```text
Dashboard
PSR Dashboard
Double Entry Dashboard
Combine Dashboard
```

Do not rename:

* Dashboard
* PSR Dashboard
* Double Entry Dashboard
* existing `CombinedDashboardPage`
* existing routes

Do not move navigation items.

Do not fix the existing Double Entry/Combined naming conflict as part of this task.

### Permissions

Do not create or modify permissions as part of this task.

Do not change:

* roles
* RBAC
* route guards
* authentication
* navigation visibility rules

The current permission architecture must remain unchanged.

### Regression protection

After implementation verify:

* Dashboard still works.
* PSR Dashboard still works.
* Double Entry Dashboard still works.
* Combine Dashboard still opens correctly.
* Dashboard primary navigation remains active.
* Combine Dashboard secondary navigation remains active.
* Breadcrumb still works.
* Assessment Year filter works using existing state/data behavior.
* Only Assessment Year is available as a filter.
* Online/Offline/Total report information is preserved.
* Total row remains readable.
* Print remains available.
* No extra filters are introduced.
* No KPI cards are introduced.
* No charts are introduced.
* No unrelated routes change.
* No existing APIs are broken.
* No existing Redux/localStorage state is changed unnecessarily.
* No existing forms, tables, drawers, modals, or modules are changed.
* Desktop layout is stable.
* Tablet layout is stable.
* Mobile layout is usable.
* No unwanted horizontal page scrolling occurs.
* Existing responsive table behavior is preserved.
* EN/BN parity is maintained.
* Light mode remains intact.
* Dark mode remains intact.
* Existing accessibility behavior remains intact.

Golden rules:

* This is an existing product, not a redesign.
* Protect all solved work.
* Respect the exact scope.
* Reuse existing components before creating new ones.
* Reuse existing styles and tokens.
* Do not change unrelated files.
* Do not remove working features.
* Do not break existing APIs, routes, state, permissions, navigation, forms, tables, drawers, modals, themes, or responsive behavior.
* Do not invent business logic.
* Do not invent NBR rules or values.
* Do not rebuild the Dashboard system.
* Do not redesign the navigation.
* Do not alter Double Entry Dashboard.
* Do not add functionality beyond the requested report.
* Mobile must be deliberately checked, not assumed from desktop.
* Preserve EN/BN parity.
* Preserve light/dark mode behavior.
* Find and reuse the existing component architecture instead of implementing visual duplicates.

Final expected result:

`Combine Dashboard` should feel like it was always part of the current e-Return Office Management product: one clean `Online and Offline (Combined Report)` section, one Assessment Year filter, one responsive report table, and one Print action, all built from the existing reusable design system without affecting anything else.
