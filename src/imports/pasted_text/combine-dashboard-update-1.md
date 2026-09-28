Update only the existing `Combine Dashboard` page in the NBR e-Return Office Management project. The goal is to correct the current implementation so it fully follows the project’s existing reusable report/table/filter architecture instead of using a one-off dashboard layout.

Before changing anything:

* Inspect the current `CombineDashboardPage`.
* Inspect the existing reusable report implementation used by pages such as `Offline Return Report`.
* Inspect these existing reusable components and patterns before writing new code:

  * `src/app/components/pages/GeneratedTablePage.tsx`
  * `src/app/components/filters/FilterPanel.tsx`
  * `src/app/components/filters/MobileFilterOverlay.tsx`
  * `src/app/components/tables/ResponsiveTable.tsx`
  * existing `AppSelectField`
  * existing shared Button components
  * existing report/table toolbar styles in `src/styles/globals.css`
* Inspect the current filter definitions in `src/app/data/modulePageConfigs.ts`.
* Reuse the exact existing report/table/filter patterns wherever possible.
* Do not redesign or rebuild the report system.

The required business content remains only:

`Online and Offline (Combined Report)`

Rows:

* Online
* Offline
* Total

Columns:

* Submission Type
* Total Submission
* Tax Paid with Return (173)
* Total Tax Paid

Actions:

* Filter
* Print

Filter:

* Assessment Year only

Do not add any other report content or functionality.

The current Combine Dashboard implementation has several problems that must be corrected:

1. It uses `DashSection` instead of the established report/table-card pattern.
2. Assessment Year is permanently visible instead of using the existing expandable Filter interaction.
3. Assessment Year is duplicated in multiple places.
4. Print is placed in the bottom-right footer instead of the established report toolbar.
5. The implementation introduced custom/fabricated financial data for multiple assessment years.
6. The local report filter currently changes global application state directly.
7. Mobile filter behavior is inconsistent with other report pages.

Fix these issues without changing unrelated parts of the product.

Required page structure:

```text
Existing application shell
│
├── Dashboard secondary navigation
│    └── Combine Dashboard [active]
│
├── Breadcrumb
│    Home > Dashboard > Combine Dashboard
│
├── Page title
│    Combine Dashboard
│
└── Existing report/table-card pattern
     │
     ├── Toolbar
     │    ├── Online and Offline (Combined Report)
     │    ├── Filter
     │    └── Print
     │
     ├── Desktop FilterPanel
     │    └── Assessment Year only
     │
     ├── MobileFilterOverlay
     │    └── Assessment Year only
     │
     └── ResponsiveTable
          ├── Online
          ├── Offline
          └── Total
```

Use the same visual and interaction pattern already used by existing Report pages.

Reuse the existing `.table-card` structure and related toolbar/filter styles instead of creating new custom report-card styles.

The existing relevant styles include patterns such as:

```text
.table-card
.table-card__toolbar
.table-card__title-group
.table-card__title
.table-card__toolbar-btn
.table-card__toolbar-btn--active
.table-card__toolbar-btn--print
.table-card__filter-panel
```

Reuse them. Do not create another parallel report-card CSS system unless absolutely necessary.

The report toolbar must contain only:

```text
Online and Offline (Combined Report)        [Filter] [Print]
```

Do not include:

* Search
* Download
* record count
* extra actions
* export menu
* More menu

The report only has three summary rows, so those controls are unnecessary.

Filter behavior:

Use the existing reusable `FilterPanel` for desktop.

Use the existing reusable `MobileFilterOverlay` for mobile/narrow layouts.

The filter panel must contain only one field:

```text
Assessment Year
[ select ]
```

Do not include:

* Tax Zone
* Tax Circle
* From Date
* To Date
* status
* submission type
* taxpayer
* search
* any additional filter

If the shared filter system requires Reset/Clear and Apply controls, reuse those existing controls and behavior exactly.

Do not create a new filtering interaction.

Filter definition:

Reuse the project’s existing `FilterDef` structure and existing Assessment Year options if available.

Do not duplicate existing AY option arrays unnecessarily.

If a dedicated filter definition is required, create the smallest possible configuration based on the existing Assessment Year definition, for example conceptually:

```tsx
const COMBINE_DASHBOARD_FILTERS: FilterDef[] = [
  {
    key: "ay",
    label: "Assessment Year",
    labelKey: "labels.assessmentYear",
    type: "select",
    options: EXISTING_AY_OPTIONS,
  },
];
```

Prefer referencing the existing AY options/source rather than duplicating them.

Do not use all of `REPORT_FILTERS`, because this page requires only Assessment Year.

Do not permanently expose the Assessment Year selector above the table.

The correct interaction should be:

```text
Normal state:
Online and Offline (Combined Report)      [Filter] [Print]
-----------------------------------------------------------
TABLE

Filter clicked:
Online and Offline (Combined Report)      [Filter] [Print]
-----------------------------------------------------------
Assessment Year
[ AY 2024-25 ▼ ]

                         [Clear/Reset] [Apply Filters]
-----------------------------------------------------------
TABLE
```

On mobile:

```text
Tap Filter
    ↓
existing MobileFilterOverlay
    ↓
Assessment Year only
    ↓
Apply
```

Do not squeeze an inline desktop filter row into mobile.

Assessment Year duplication:

Remove the extra Assessment Year badge currently displayed inside the report header.

Do not show the same selected AY in:

* global topbar
* report badge
* local permanent selector

The report should have only the normal global application AY context plus the Assessment Year inside the filter interaction when the filter is opened.

If the global topbar AY and local report AY serve different confirmed business purposes, preserve both only if the current project architecture clearly supports that distinction. Do not invent synchronization behavior.

State handling:

Do not automatically dispatch the local report filter directly into global Redux state unless that is already the established behavior for other report filters.

Follow the same local filter-state pattern used in existing reusable report pages:

```text
draft/current filter values
        ↓
Apply Filters
        ↓
applied filter state
        ↓
report data refresh/filter
```

Reuse existing state management patterns.

Do not create a new filter state architecture.

Do not change global Assessment Year behavior unless required by the existing project implementation.

Data integrity:

Remove any fabricated or invented assessment-year report values.

Do not invent:

* submission counts
* financial values
* totals
* tax values
* trends
* percentages
* data for other assessment years

Use only:

* confirmed data already present in the project
* confirmed backend/service data
* the supplied source report values when used as mock/source data
* existing mock-data architecture if this module is not connected to a backend

The supplied source report contains:

```text
Online
Total Submission: 14
Tax Paid with Return (173): 0
Total Tax Paid: 4,01,38,53,753

Offline
Total Submission: 16
Tax Paid with Return (173): 9,05,696
Total Tax Paid: 9,50,441

Total
Total Submission: 30
Tax Paid with Return (173): 9,05,696
Total Tax Paid: 4,01,48,04,194
```

If these are used as current mock/source values, preserve them exactly.

Do not create fake values for AY 2024-25, 2023-24, 2022-23, etc. unless those values already exist in a confirmed project data source.

If no data exists for a selected Assessment Year:

* use the existing empty-state pattern
* do not substitute fabricated values
* do not automatically use another year's values
* do not fake zeroes unless the source actually returns zero

Table:

Use the existing `ResponsiveTable`.

Do not create another custom table.

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

Do not add:

* sort
* pagination
* row actions
* checkboxes
* search
* column settings
* extra headers

The first column must remain explicitly labeled:

`Submission Type`

Do not leave it blank like the legacy system.

Numeric values should follow the existing alignment used by current report tables.

Do not change the number formatting arbitrarily.

If the confirmed source values do not include a currency symbol, do not add one automatically.

Total row:

Keep the `Total` row visually stronger using the current table system.

Preferred:

* existing summary/strong row style if available
* otherwise existing font-weight tokens

Do not introduce:

* new bright background colors
* new status colors
* custom highlight colors

The emphasis must be subtle and consistent with existing reports.

Print:

Move Print into the existing report toolbar beside Filter.

Expected:

```text
Online and Offline (Combined Report)      [Filter] [Print]
```

Use the same existing Print button style and icon used on other Report pages.

Do not create a new custom Print button.

If an existing print handler/helper exists, reuse it.

Do not add:

* Download
* PDF export
* Excel export
* CSV export
* Share

Only Print.

Do not keep Print floating at the bottom-right of the card.

Responsive behavior:

Reuse existing responsive behavior from the report/table system.

Desktop:

* report uses the available content width
* toolbar actions remain aligned correctly
* table stays readable
* filter panel opens using existing desktop layout

Tablet:

* toolbar should wrap only according to existing responsive rules
* no page-level horizontal overflow
* table/filter remain usable
* Print and Filter remain reachable

Mobile:

* use `MobileFilterOverlay`
* do not display the full desktop filter panel inline
* use the existing `ResponsiveTable` mobile behavior
* preserve every field and every value
* no important report data may disappear
* no clipped financial values
* no overlapping controls
* no tiny tap targets
* no unintended page-level horizontal scrolling

If the existing `ResponsiveTable` uses row cards on mobile, preserve that exact behavior.

If it uses controlled horizontal scrolling, preserve that instead.

Do not invent a new mobile table pattern specifically for Combine Dashboard.

Reusable component rule:

Before writing any new UI component, confirm that the same need is not already covered by:

```text
GeneratedTablePage
FilterPanel
MobileFilterOverlay
ResponsiveTable
AppSelectField
PrimaryButton
SecondaryButton
existing report toolbar/button styles
existing loading state
existing empty state
existing error state
```

Do not create:

* CombineFilterPanel
* CombinedReportFilter
* CombineResponsiveTable
* CombinePrintButton
* custom mobile drawer
* custom select component
* custom report toolbar
* duplicate generic table-card component

unless there is a clear technical limitation in the existing reusable component.

If the generic `GeneratedTablePage` cannot be reused directly because this page has only three fixed summary rows and no search/download, reuse its internal patterns/components rather than forcing unnecessary features into the page.

EN/BN localization:

Preserve English/Bangla parity.

Reuse existing translation keys before adding new ones.

Localize only missing static labels required for this page.

Do not modify unrelated translations.

Do not duplicate equivalent labels under multiple locale keys.

Theme behavior:

Preserve existing light and dark mode behavior.

Use existing:

* surface tokens
* border tokens
* text tokens
* muted text
* input/select styles
* table styles
* button styles

Do not hardcode new light or dark colors.

Do not modify global theme tokens.

Accessibility:

Preserve existing accessibility patterns.

Check:

* Filter button has an accessible name
* Print button has visible text and accessible name
* Assessment Year select has a real label
* filter overlay is keyboard/focus accessible
* table headers use correct semantics
* `Submission Type` is a real header
* Total row is not distinguished by color alone
* focus states remain visible
* mobile controls remain tappable

Do not reproduce any legacy UI elements.

Do NOT copy:

* old eReturn Office navigation
* old report page masthead
* Government/NBR heading inside the live page
* patterned background
* legacy table colors
* old shadows
* old floating Print button
* legacy Assessment Year text placement

The legacy screen is only a source for the report data/content.

Do not modify:

* Dashboard page
* PSR Dashboard
* Double Entry Dashboard
* navigation order
* existing routes
* authentication
* permissions
* roles
* RBAC
* existing APIs
* unrelated Redux state
* other report pages
* forms
* tables outside this page
* drawers
* modals
* themes
* global responsive behavior

Do not rename `CombinedDashboardPage` or fix the existing Double Entry/Combined naming conflict as part of this task.

Regression checks:

Verify all of the following after implementation:

* Combine Dashboard route still opens.
* Dashboard primary navigation remains active.
* Combine Dashboard secondary item remains active.
* breadcrumb remains correct.
* existing Dashboard still works.
* PSR Dashboard still works.
* Double Entry Dashboard still works.
* report title is correct.
* only Filter and Print appear in the report toolbar.
* Filter panel is closed by default.
* clicking Filter opens the existing reusable desktop filter panel.
* only Assessment Year appears.
* Reset/Clear and Apply use the existing reusable behavior.
* mobile uses the existing MobileFilterOverlay.
* no extra AY badge remains inside the report.
* no permanently visible AY select remains.
* no Search control appears.
* no Download control appears.
* no pagination appears.
* no KPI cards appear.
* no charts appear.
* no fabricated financial data remains.
* no local filter unexpectedly modifies unrelated global state.
* Online/Offline/Total remain present.
* the four table columns remain present.
* Total row remains visually distinguishable.
* Print remains available and associated with the report.
* desktop works.
* tablet works.
* mobile works.
* no unwanted horizontal page scrolling appears.
* light mode remains intact.
* dark mode remains intact.
* EN/BN parity remains intact.
* no unrelated module is changed.

Golden rules:

* This is an existing product, not a redesign.
* Fix only the Combine Dashboard report implementation.
* Protect all solved work.
* Respect the exact scope.
* Reuse existing components before creating new ones.
* Reuse existing report/table/filter architecture.
* Reuse existing CSS and theme tokens.
* Do not create duplicate generic components.
* Do not change unrelated files.
* Do not remove working features.
* Do not break existing APIs, routes, state, permissions, navigation, forms, tables, drawers, modals, themes, or responsive behavior.
* Do not invent NBR business rules.
* Do not invent financial data.
* Do not invent Assessment Year data.
* Do not rebuild the Dashboard system.
* Do not redesign the Report system.
* Do not alter Double Entry Dashboard.
* Mobile must be explicitly tested.
* Preserve EN/BN parity.
* Preserve light/dark mode.
* Find the root cause and use the existing reusable architecture rather than applying visual patches.

Final expected result:

`Combine Dashboard` should use the same proven report experience already used elsewhere in the NBR e-Return Office Management product:

```text
Combine Dashboard

Online and Offline (Combined Report)       [Filter] [Print]

[Filter closed by default]

Submission Type | Total Submission | Tax Paid with Return (173) | Total Tax Paid
Online
Offline
Total
```

When Filter is opened, it must reuse the existing shared filter system and show only `Assessment Year`. On mobile it must reuse the existing mobile filter overlay. No duplicate AY display, no custom report card, no fabricated data, and no unrelated changes.
