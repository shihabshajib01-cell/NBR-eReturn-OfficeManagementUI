```text
Update ONLY the existing `Combine Dashboard` page in the NBR e-Return Office Management project.

The goal is to add a meaningful Card View for the existing Online and Offline Combined Report while keeping the current Table View intact.

This is NOT a redesign of the application.

Use the supplied card-view reference image as the visual direction, but implement it using the project’s EXISTING design system, reusable components, CSS variables, responsive behavior, icons, typography, spacing, borders, shadows, themes, and data.

==================================================
1. INSPECT THE EXISTING PROJECT FIRST
==================================================

Before changing any code, inspect these existing files/components:

Card system:
- `src/app/components/cards/StatCard.tsx`
- `src/app/components/cards/KpiRow.tsx`
- `src/app/components/cards/CollapsibleKpiSection.tsx`
- `src/styles/cards.css`

Table system:
- `src/app/components/tables/ResponsiveTable.tsx`
- `src/app/components/tables/CardTable.tsx`
- `src/app/components/tables/UnifiedMobileCard.tsx`
- `src/styles/tables.css`

Current Combine Dashboard:
- `src/app/pages/dashboard/CombineDashboardPage.tsx`

Existing report/filter system:
- `src/app/components/filters/FilterPanel.tsx`
- `src/app/components/filters/MobileFilterOverlay.tsx`
- existing `.table-card` and toolbar styles in `src/styles/globals.css`

Shared tokens/styles:
- `src/styles/tokens.css`
- `src/styles/theme.css`
- `src/styles/buttons.css`

Also inspect:
- current EN/BN translation keys
- current `useUIState()` responsive behavior
- existing Lucide icon usage

Do not create another design system.

==================================================
2. IMPORTANT FINDING FROM CURRENT CODE
==================================================

The current reusable `StatCard` is designed for:

- one value
- one label
- optional secondary information
- one icon

It should NOT be forced to display all three metrics of Online / Offline / Total.

Do NOT create nine `StatCard`s.

Do NOT modify `StatCard.tsx` in a way that could affect Dashboard, PSR Dashboard, User Management, or other existing pages.

Instead, reuse the SAME visual language and design tokens from `StatCard` and `.card`, but create one small reusable multi-metric card component specifically for this data structure.

Recommended new reusable component:

`src/app/components/cards/SubmissionSummaryCard.tsx`

Only create this component if there is no existing equivalent after inspecting the project.

==================================================
3. KEEP THE CURRENT TABLE VIEW UNCHANGED
==================================================

The existing Table View is already correct.

It currently displays:

Columns:
- Submission Type
- Total Submission
- Tax Paid with Return (173)
- Total Tax Paid

Rows:
- Online
- Offline
- Total

Keep this exact Table View.

Do not redesign it.

Do not change:
- table columns
- values
- filter behavior
- Print action
- Total row treatment
- data formatting

Existing confirmed data:

Online
- Total Submission: 14
- Tax Paid with Return (173): 0
- Total Tax Paid: 4,01,38,53,753

Offline
- Total Submission: 16
- Tax Paid with Return (173): 9,05,696
- Total Tax Paid: 9,50,441

Total
- Total Submission: 30
- Tax Paid with Return (173): 9,05,696
- Total Tax Paid: 4,01,48,04,194

These values are the source of truth for the current mock/source state.

Do not invent other values.

==================================================
4. ADD TABLE / CARD VIEW TOGGLE
==================================================

Add a compact view-mode toggle to the existing report toolbar.

Current toolbar:

Online and Offline (Combined Report)          [Filter] [Print]

Updated desktop toolbar:

Online and Offline (Combined Report)    [Table | Cards] [Filter] [Print]

Use Lucide icons consistent with the existing project.

Suggested:
- Table View → `List` or existing table/list icon
- Card View → `LayoutGrid` / `Grid2X2`

Do not add text-heavy oversized controls.

The toggle should visually behave like a compact segmented control.

Search the project for an existing segmented/toggle component first.

If none exists, create the minimum reusable component needed, for example:

`src/app/components/shared/ViewModeToggle.tsx`

It should accept something conceptually like:

- current value
- onChange
- available modes

Do not over-engineer it.

Accessibility:
- use real buttons
- use `aria-pressed` or equivalent accessible state
- provide an accessible group label such as `View mode`
- selected state must not rely on color alone
- preserve visible keyboard focus

Default:

`Table View`

==================================================
5. VIEW STATE MUST BE LOCAL ONLY
==================================================

Use local UI state such as:

`"table" | "card"`

Conceptually:

const [viewMode, setViewMode] =
  useState<"table" | "card">("table");

Do NOT:
- add Redux state
- add localStorage
- add API state
- change global user settings
- create a new route

This is a presentation preference for this page only.

Switching views must NOT:
- reload the page
- reset filters
- change assessment year
- change data
- trigger a new API unnecessarily

==================================================
6. ONE DATA SOURCE FOR BOTH VIEWS
==================================================

This is critical.

DO NOT duplicate data for Card View.

The existing `SOURCE_ROWS` / current filtered `rows` must feed BOTH views.

Architecture:

SOURCE / FILTERED ROWS
        |
        +---- Table View
        |       |
        |       `--> ResponsiveTable
        |
        `---- Card View
                |
                `--> SubmissionSummaryCard

There must never be separate:

`TABLE_DATA`
and
`CARD_DATA`

Both views must always display the exact same filtered values.

==================================================
7. CARD VIEW INFORMATION ARCHITECTURE
==================================================

Card View must NOT simply convert every table cell into a separate box.

Create three meaningful summaries:

1. Online
2. Offline
3. Total

Desktop visual hierarchy:

[ Online card ]    [ Offline card ]

[             Total summary card             ]

Online and Offline are the two comparable categories.

Total is the combined result and should therefore occupy the full row.

This relationship is intentional:

Online + Offline
        ↓
      Total

Do not arrange all three as unrelated identical dashboard cards if sufficient desktop width exists.

==================================================
8. REUSABLE `SubmissionSummaryCard`
==================================================

Create one reusable component and render it three times.

Conceptual API:

<SubmissionSummaryCard
  title="Online"
  icon={Globe}
  tone="primary"
  totalSubmission="14"
  taxPaid173="0"
  totalTaxPaid="4,01,38,53,753"
/>

<SubmissionSummaryCard
  title="Offline"
  icon={FileText}
  tone="success"
  totalSubmission="16"
  taxPaid173="9,05,696"
  totalTaxPaid="9,50,441"
/>

<SubmissionSummaryCard
  title="Total"
  icon={BarChart2}
  tone="primary"
  variant="summary"
  totalSubmission="30"
  taxPaid173="9,05,696"
  totalTaxPaid="4,01,48,04,194"
/>

Exact icon choice may use the nearest existing Lucide icon already used in the project.

Do not introduce another icon library.

==================================================
9. MATCH THE EXISTING DASHBOARD CARD STYLE
==================================================

The Card View must visually belong to the same system as the existing Dashboard KPI cards shown in the provided reference.

Reuse the same visual principles from `StatCard`:

- `var(--color-surface)`
- `var(--color-border)`
- existing radius tokens / current 14–16px card radius
- subtle existing shadow
- existing typography scale
- existing primary/success tone system
- existing 48px icon container treatment
- existing theme variables
- existing spacing rhythm

Reference from current StatCard:

- white/current surface
- subtle border
- subtle shadow
- 48 × 48 icon container
- tinted icon background
- restrained semantic accent
- strong numeric typography
- muted metric labels

Do NOT hardcode a new visual palette.

Do NOT copy colors directly from the generated image if existing project tokens already provide them.

==================================================
10. CARD CONTENT STRUCTURE
==================================================

Each Online / Offline card should follow this structure:

------------------------------------------------
Online                                      [icon]

-----------------------------------------------

Total Submission
14

Tax Paid with Return (173)
0

Total Tax Paid
4,01,38,53,753
------------------------------------------------

On normal desktop width, the three metrics should sit in a clean three-column internal layout:

| Total Submission | Tax Paid with Return (173) | Total Tax Paid |

Values should be more prominent than labels.

Use existing font sizes/weights rather than creating large hero-number typography.

The card should be compact and suitable for an administrative government system.

Do NOT make it flashy.

==================================================
11. TOTAL CARD
==================================================

The Total card should be visually stronger but still restrained.

Desktop:

-----------------------------------------------------------
Total                                                [icon]

Total Submission     Tax Paid with Return (173)     Total Tax Paid

30                   9,05,696                       4,01,48,04,194
-----------------------------------------------------------

The Total card spans the full grid width.

Use only subtle distinction, for example:

- slightly stronger font weight
- existing primary border/tint token
- existing primary icon tone

Do NOT:
- use a bright filled background
- introduce gradients
- introduce a new color
- make it look like a promotional card

==================================================
12. CARD GRID
==================================================

Create a responsive card grid using existing spacing values.

Desktop ≥ 1024px:

2 columns

Online | Offline

Total spans both columns

Conceptually:

.summary-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: existing spacing token;
}

.summary-card--total {
  grid-column: 1 / -1;
}

Do not hardcode unnecessary fixed widths.

Cards must stretch naturally inside the existing report container.

==================================================
13. REPORT CONTAINER MUST REMAIN THE SAME
==================================================

Do not remove the existing `.table-card`.

The toolbar, filter panel, and content still belong to the same report.

Architecture:

.table-card
|
+-- .table-card__toolbar
|      |
|      +-- report title
|      +-- Table/Card toggle
|      +-- Filter
|      `-- Print
|
+-- FilterPanel when open
|
`-- content
       |
       +-- ResponsiveTable when Table View
       |
       `-- summary card grid when Card View

Do NOT create a second outer report panel for Card View.

==================================================
14. FILTER MUST WORK IDENTICALLY IN BOTH VIEWS
==================================================

The existing Assessment Year filter must remain unchanged.

Only Assessment Year remains available.

Do not add any new filters.

Existing behavior:

Filter
  ↓
Assessment Year
  ↓
Apply
  ↓
filtered `rows`

Then those SAME `rows` feed whichever view is selected.

Example:

Assessment Year filter applied
        |
        +---- Table View
        |
        `---- Card View

Changing view must not reset:
- `fVals`
- `applied`
- filter panel state unnecessarily
- current data

==================================================
15. KEEP EXISTING FILTER COMPONENTS
==================================================

Continue using:

Desktop:
`FilterPanel`

Mobile:
`MobileFilterOverlay`

Do not create:
- CardFilter
- SummaryFilter
- CardViewFilter
- another Assessment Year selector

Do not permanently expose Assessment Year on the page again.

==================================================
16. PRINT
==================================================

Keep the existing Print button and existing print logic.

Do not add:
- Download
- CSV
- Excel
- PDF export
- Share

Do NOT redesign Print as part of this task.

Do not create a new print engine.

==================================================
17. RESPONSIVE BEHAVIOR — VERY IMPORTANT
==================================================

Do not simply shrink the desktop Card View.

Inspect the project’s existing responsive behavior first.

The project already has:

`ResponsiveTable`
        ↓
desktop → CardTable
mobile/tablet < 1024 → UnifiedMobileCard

Protect this architecture.

--------------------------------
DESKTOP ≥ 1024px
--------------------------------

Show:
- Table/Card toggle
- Filter
- Print

Table View:
- existing ResponsiveTable desktop table

Card View:
- Online + Offline side-by-side
- Total full width

--------------------------------
TABLET / MOBILE < 1024px
--------------------------------

Do NOT create competing mobile view systems.

The existing `ResponsiveTable` already changes to mobile cards below 1024px.

Therefore:

- hide the desktop Table/Card toggle below the existing desktop breakpoint if the two modes would become visually redundant
- preserve the established responsive report behavior
- do not force a desktop table onto mobile

For the Table View mobile representation, improve the existing `ResponsiveTable` mapping for this specific dataset by using the existing `mobileCardMapping` support.

Use conceptually:

mobileCardMapping={{
  primary: "submission_type",
  meta: [
    "total_submission",
    "tax_paid_173",
    "total_tax_paid"
  ]
}}

This ensures the reusable `UnifiedMobileCard` displays:

Online
- Total Submission
- Tax Paid with Return (173)
- Total Tax Paid

instead of trying to guess the card hierarchy.

Do NOT rewrite `UnifiedMobileCard`.

Do NOT create a separate Combine Dashboard mobile card system if the existing component can represent the data correctly.

==================================================
18. NARROW CARD RESPONSIVENESS
==================================================

If the new `SubmissionSummaryCard` is ever rendered in a narrow container:

Internal 3-column metrics should gracefully become:

Tablet/narrow:
2 columns where appropriate

Mobile:
1 column

Never allow:

- metric labels to overlap
- financial values to clip
- page-level horizontal scrolling
- values to become unreadably small
- cards to use fixed widths

Long values such as:

`4,01,38,53,753`

must remain fully readable.

Use:
- `min-width: 0`
- wrapping where appropriate
- tabular numeric formatting if already used in the project

Do not arbitrarily truncate financial values with ellipsis.

==================================================
19. EN/BN
==================================================

Maintain English/Bangla parity.

Before adding keys, search existing locale files.

Reuse the same translation keys already used by the table for:

- Submission Type
- Total Submission
- Tax Paid with Return (173)
- Total Tax Paid

Reuse existing labels for:
- Online
- Offline
- Total
- Filter
- Print

Add only genuinely missing keys for:
- Table View
- Card View
- View mode

Do not duplicate existing translations.

==================================================
20. DARK MODE / THEMES
==================================================

Do not hardcode:

#ffffff
custom blue
custom green
custom shadows
custom dark-mode values

Use existing project tokens.

The new cards must automatically work in:
- light mode
- dark mode
- current appearance/font scaling options

Do not modify global theme tokens.

==================================================
21. ACCESSIBILITY
==================================================

Check:

View toggle:
- keyboard accessible
- selected mode programmatically exposed
- selected mode visually clear
- accessible label

Cards:
- semantic heading for Online / Offline / Total
- metric labels remain associated with metric values
- values remain readable at large font scale
- icon is decorative unless it adds meaning

Responsive:
- 44px-class touch targets where applicable
- no hidden essential information
- no hover-only interaction

==================================================
22. EMPTY DATA
==================================================

If filtered `rows` contains no confirmed data:

Table View:
- preserve the existing ResponsiveTable empty behavior

Card View:
- reuse an existing project empty-state pattern if available
- do not display three empty cards
- do not display fabricated zero values
- do not substitute another assessment year

==================================================
23. DO NOT CHANGE THESE AREAS
==================================================

Do NOT modify:

- main Dashboard
- Dashboard StatCard behavior
- PSR Dashboard
- Double Entry Dashboard
- navigation order
- routes
- breadcrumbs
- authentication
- permissions
- roles
- RBAC
- APIs
- global Assessment Year behavior
- other reports
- other tables
- other cards
- drawers
- modals
- global responsive breakpoints
- existing mobile navigation
- existing filter architecture
- business logic

Do not fix unrelated issues.

==================================================
24. FILE SCOPE
==================================================

Keep code changes minimal.

Expected files may include:

Existing:
`src/app/pages/dashboard/CombineDashboardPage.tsx`

New only if required:
`src/app/components/cards/SubmissionSummaryCard.tsx`

Possibly new only if no equivalent exists:
`src/app/components/shared/ViewModeToggle.tsx`

Styles:
prefer extending:
`src/styles/cards.css`

Use existing:
`src/styles/globals.css`
`src/styles/buttons.css`
`src/styles/tables.css`
without rewriting them.

Locale files:
only required missing labels.

Do not create unnecessary new files.

==================================================
25. VISUAL TARGET
==================================================

Recreate the supplied card-view reference using the ACTUAL current NBR project shell.

Do not recreate the incorrect navigation/header shown in any generated concept image.

The real project UI remains the source of truth for:

- sidebar
- secondary navigation
- topbar
- breadcrumb
- page width
- page title
- toolbar
- spacing
- colors
- typography

Only the report content gains a second Card View.

The intended desktop result is approximately:

Combine Dashboard

┌────────────────────────────────────────────────────────────────────┐
│ Online and Offline (Combined Report)  [Table|Cards] [Filter][Print]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ ┌────────────────────────────┐ ┌────────────────────────────┐       │
│ │ Online               [icon]│ │ Offline              [icon]│       │
│ │                            │ │                            │       │
│ │ 14       0       4,01...   │ │ 16    9,05,696   9,50,441│       │
│ │ Submission  Tax173  TaxPaid│ │ Submission Tax173 TaxPaid │       │
│ └────────────────────────────┘ └────────────────────────────┘       │
│                                                                    │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ Total                                                  [icon]│   │
│ │                                                              │   │
│ │ 30                9,05,696                4,01,48,04,194     │   │
│ │ Total Submission  Tax Paid with Return     Total Tax Paid    │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

Keep it clean, restrained, administrative, and consistent with the existing Dashboard KPI card style.

==================================================
26. REGRESSION TESTS
==================================================

After implementation verify:

TABLE VIEW
- still renders exactly as before
- existing values unchanged
- existing Total row unchanged

CARD VIEW
- Online card uses Online row
- Offline card uses Offline row
- Total card uses Total row
- no duplicated data source
- values exactly match Table View

TOGGLE
- defaults to Table
- changes presentation only
- does not reload
- does not reset filters
- does not alter global state
- keyboard accessible

FILTER
- still contains Assessment Year only
- works with both views
- mobile overlay still works
- filter state survives switching views

PRINT
- still available
- existing behavior remains intact

RESPONSIVE
- desktop card layout is 2 + 1 full-width summary
- no layout overflow
- tablet remains usable
- mobile preserves current ResponsiveTable/UnifiedMobileCard architecture
- `mobileCardMapping` gives the Combine Dashboard rows meaningful mobile hierarchy
- no clipped monetary values
- no page-level horizontal scrolling

THEMES
- light mode works
- dark mode works

LOCALIZATION
- EN works
- BN works

REGRESSION
- Dashboard unchanged
- PSR Dashboard unchanged
- Double Entry Dashboard unchanged
- other report pages unchanged
- StatCard unchanged
- ResponsiveTable unchanged globally
- filters unchanged globally

==================================================
GOLDEN RULES
==================================================

- This is an existing product, not a greenfield redesign.
- Protect all solved work.
- Respect the exact scope.
- Reuse existing components before creating new ones.
- Reuse the existing card visual system.
- Do not force `StatCard` into a use case it was not designed for.
- Do not modify `StatCard` globally just to solve this page.
- Create at most the minimum reusable component needed for the new multi-metric card pattern.
- One source of data must power both Table and Card View.
- Do not fabricate NBR data.
- Do not invent financial values.
- Do not invent assessment-year data.
- Do not change APIs.
- Do not change business logic.
- Do not change routes.
- Do not change permissions.
- Do not change navigation.
- Do not change unrelated pages.
- Preserve current Filter and Print functionality.
- Preserve the existing mobile architecture.
- Preserve EN/BN parity.
- Preserve light/dark mode.
- Test desktop, tablet, and mobile.
- Find and reuse existing code instead of visually duplicating it.
```
