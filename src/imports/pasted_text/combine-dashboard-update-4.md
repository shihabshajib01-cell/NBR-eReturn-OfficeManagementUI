Update ONLY the existing `Combine Dashboard` page in the current NBR e-Return Office Management project.

The goal is to correct the current Card View so it follows the existing Dashboard card component language more closely, uses reusable project components wherever possible, preserves the current Table View and report functionality, and works properly across large desktop, small laptop, tablet, and mobile layouts.

Before changing any code, inspect the current project and current `Combine Dashboard` implementation first. This is an existing product with solved work. Do not treat it as a greenfield redesign.

Inspect at minimum:

* `src/app/pages/dashboard/CombineDashboardPage.tsx`
* current Card View implementation
* current Table View implementation
* `src/app/components/cards/StatCard.tsx`
* `src/app/components/cards/KpiRow.tsx`
* `src/app/components/cards/CollapsibleKpiSection.tsx`
* `src/styles/cards.css`
* existing main Dashboard page
* existing PSR Dashboard page
* `src/app/components/tables/ResponsiveTable.tsx`
* `src/app/components/tables/UnifiedMobileCard.tsx`
* `src/app/components/filters/FilterPanel.tsx`
* `src/app/components/filters/MobileFilterOverlay.tsx`
* current table/report toolbar styles
* existing Button components
* existing Lucide icon usage
* theme tokens
* responsive utilities/breakpoints
* EN/BN locale structure

Do not guess. Reuse the actual existing patterns found in the project.

==================================================
CURRENT FUNCTIONALITY TO PROTECT
================================

The current Combine Dashboard already has:

* correct route
* correct Dashboard secondary navigation
* correct active state
* correct breadcrumb
* page title
* page subtitle
* report title
* Table View
* Card View
* Table/Card toggle
* Assessment Year filter
* Print
* correct Online / Offline / Total report data
* shared data source between Table and Card View

All of this must remain working.

Do NOT change the confirmed report values:

Online:

* Total Submission: `14`
* Tax Paid with Return (173): `0`
* Total Tax Paid: `4,01,38,53,753`

Offline:

* Total Submission: `16`
* Tax Paid with Return (173): `9,05,696`
* Total Tax Paid: `9,50,441`

Total:

* Total Submission: `30`
* Tax Paid with Return (173): `9,05,696`
* Total Tax Paid: `4,01,48,04,194`

Do not fabricate any new data.

==================================================
PRIMARY GOAL
============

Replace the current complicated Card View layout with a much simpler structure:

* 3 semantic rows
* Online
* Offline
* Total

Each row contains exactly 3 cards:

1. Total Submission
2. Tax Paid with Return (173)
3. Total Tax Paid

The Card View should look and behave like a natural extension of the existing Dashboard KPI card system.

Do not create a large custom summary card.

Do not use one card with three metrics.

Do not create separate OnlineCard / OfflineCard / TotalCard components.

Use the existing reusable card component architecture wherever possible.

==================================================
TARGET CARD VIEW
================

Desktop concept:

Online

[ 14 ]                    [ 0 ]                         [ 4,01,38,53,753 ]
Total Submission          Tax Paid with Return (173)    Total Tax Paid

Offline

[ 16 ]                    [ 9,05,696 ]                 [ 9,50,441 ]
Total Submission          Tax Paid with Return (173)   Total Tax Paid

Total

[ 30 ]                    [ 9,05,696 ]                 [ 4,01,48,04,194 ]
Total Submission          Tax Paid with Return (173)   Total Tax Paid

Each metric must be its own existing-style dashboard card.

This is 9 cards total, but grouped meaningfully into 3 rows:

Online → 3 related metrics
Offline → 3 related metrics
Total → 3 related metrics

The grouping is part of the information architecture.

==================================================
REUSE THE EXISTING CARD COMPONENT
=================================

The first implementation choice must be to reuse:

`StatCard`

and/or:

`KpiRow`

if those components can support this layout safely.

Preferred architecture:

`CombineDashboardPage`
→ Card View
→ Online section
→ `KpiRow` / 3 × `StatCard`

→ Offline section
→ `KpiRow` / 3 × `StatCard`

→ Total section
→ `KpiRow` / 3 × `StatCard`

Conceptually:

```tsx
<section className="combine-dashboard__metric-group">
  <h3>Online</h3>
  <KpiRow kpis={onlineKpis} />
</section>

<section className="combine-dashboard__metric-group">
  <h3>Offline</h3>
  <KpiRow kpis={offlineKpis} />
</section>

<section className="combine-dashboard__metric-group">
  <h3>Total</h3>
  <KpiRow kpis={totalKpis} />
</section>
```

Do not create a custom multi-metric `SubmissionSummaryCard` if the existing `StatCard` + `KpiRow` pattern can represent this correctly.

If the current project already created a custom `SubmissionSummaryCard` only for the previous version of this page, remove it from this page if it is no longer needed.

Do not delete the file globally if another page uses it.

==================================================
CARD CONTENT
============

Each card must use the existing StatCard visual hierarchy:

* strong value
* label beneath it
* icon container aligned consistently
* existing surface
* existing border
* existing radius
* existing shadow
* existing spacing
* existing typography
* existing tone system

Example:

Total Submission card:

Value:
`14`

Label:
`Total Submission`

Tax Paid with Return card:

Value:
`0`

Label:
`Tax Paid with Return (173)`

Total Tax Paid card:

Value:
`4,01,38,53,753`

Label:
`Total Tax Paid`

Do not add unnecessary:

* descriptions
* subtext
* percentage
* trends
* status badges
* decorative lines
* secondary labels
* custom headers inside the card

Keep the cards as simple as the existing Dashboard cards.

==================================================
CARD TONES / ICONS
==================

Reuse existing project icon and tone patterns.

Do not introduce another icon library.

Use existing Lucide icons already used by the project where possible.

Keep semantic consistency across all three rows.

For example:

Total Submission:

* existing primary/neutral tone
* submission/document/globe-style icon already used by Dashboard

Tax Paid with Return (173):

* existing success tone
* payment/card/tax-related icon already used in the project

Total Tax Paid:

* existing primary/neutral financial/chart icon

The same metric should use the same tone/icon in Online, Offline, and Total rows.

Example:

All `Total Submission` cards use the same icon/tone.

All `Tax Paid with Return (173)` cards use the same icon/tone.

All `Total Tax Paid` cards use the same icon/tone.

This improves vertical scanning.

Do not use different colors merely because the row is Online / Offline / Total.

==================================================
ROW HEADINGS
============

Each group should have a simple heading:

`Online`

`Offline`

`Total`

Use the existing typography scale and section-heading style.

Do not put the row heading inside every card.

Do not add:

* Online Return Submission Summary
* Offline Return Submission Summary
* Combined Summary

unless such text already exists as an established pattern.

Keep the grouping simple.

==================================================
REPORT CONTAINER
================

Keep the existing report structure:

`Online and Offline (Combined Report)`

Keep the existing toolbar:

* Table
* Cards
* Filter
* Print

The toolbar remains part of the report.

Do not add:

* Search
* Download
* pagination
* record count
* export
* More actions

Only the content area changes depending on view mode.

Architecture:

```text
Report Card / table-card
│
├── Toolbar
│    ├── Online and Offline (Combined Report)
│    ├── Table / Cards
│    ├── Filter
│    └── Print
│
├── FilterPanel when open
│
└── Content
     ├── ResponsiveTable when Table View
     └── 3 grouped KPI rows when Card View
```

Do not create another outer card around Card View.

Do not create nested oversized panels.

==================================================
TABLE VIEW
==========

Do not redesign Table View.

Keep the current Table View exactly as it is unless a genuine regression is found.

Columns remain:

* Submission Type
* Total Submission
* Tax Paid with Return (173)
* Total Tax Paid

Rows remain:

* Online
* Offline
* Total

Keep existing:

* values
* number formatting
* Total row treatment
* responsive table behavior

Do not add:

* sorting
* pagination
* search
* row actions

==================================================
ONE DATA SOURCE
===============

This is mandatory.

Do not create separate Card View data.

Use the same filtered/current rows that already power the table.

Architecture:

```text
confirmed report rows
        ↓
assessment year filtering
        ↓
current rows
   ┌───────────────┐
   ↓               ↓
Table View       Card View
ResponsiveTable StatCard groups
```

Do not create:

`TABLE_DATA`
and
`CARD_DATA`

Do not duplicate values manually.

Card View values must always match Table View.

==================================================
VIEW TOGGLE
===========

Keep the current Table / Cards toggle.

Default:
`Table`

Switching view must change presentation only.

Do NOT:

* reload
* navigate
* change route
* reset Assessment Year
* reset filter state
* update Redux
* call unrelated APIs
* change global preferences

Use local state only.

==================================================
FILTER
======

Keep the current filter implementation.

Only filter allowed:

`Assessment Year`

Do not add any other filters.

Desktop:
reuse `FilterPanel`

Mobile:
reuse `MobileFilterOverlay`

Do not create another AY selector for Card View.

Do not permanently show Assessment Year in the card area.

Do not duplicate the selected AY.

Switching between Table and Cards must preserve:

* filter state
* applied Assessment Year
* current report rows

==================================================
PRINT
=====

Keep the existing Print action.

Do not redesign it.

Do not add:

* Download
* PDF
* Excel
* CSV
* Share

Do not create a new print engine.

Use the current implementation.

==================================================
RESPONSIVE DESIGN
=================

Responsive behavior is a major acceptance criterion.

Do not test only large desktop and mobile.

The page must work properly on:

Large desktop:

* 1920 × 1080
* 1536 × 864

Normal laptop:

* 1440 × 900
* 1366 × 768

Small laptop — CRITICAL:

* `1333 × 786`
* 1280 × 800
* 1280 × 720

Tablet:

* 1024 × 768
* 820 × 1180
* 768 × 1024

Mobile:

* 430 × 932
* 390 × 844
* 375 × 812
* 360 × 800
* 320 × 568

Remember: the application has both primary and secondary navigation, so the actual content width is much smaller than the viewport width.

Do not design based only on raw viewport size.

==================================================
LARGE DESKTOP
=============

Card View:

Each row should display 3 cards:

```text
Online
[ Card ] [ Card ] [ Card ]

Offline
[ Card ] [ Card ] [ Card ]

Total
[ Card ] [ Card ] [ Card ]
```

Use the existing 3-column KPI grid behavior if available.

Keep spacing consistent with Dashboard.

Do not make cards oversized.

Do not use fixed widths.

==================================================
SMALL LAPTOP — CRITICAL
=======================

At:

`1366 × 768`
`1333 × 786`
`1280 × 800`
`1280 × 720`

the layout must still remain comfortable.

Target:

```text
Online
[ Card ] [ Card ] [ Card ]

Offline
[ Card ] [ Card ] [ Card ]

Total
[ Card ] [ Card ] [ Card ]
```

as long as all values remain fully readable.

Explicitly check:

* left navigation visible
* secondary navigation visible
* page title visible
* report toolbar visible
* Card View toggle visible
* Filter visible
* Print visible
* all 9 card values readable
* no horizontal page overflow
* no card clipping
* no number truncation
* no huge blank areas
* no excessive vertical spacing

Do not hide the Table/Card toggle on small laptops.

Small laptop is still desktop.

==================================================
LONG FINANCIAL VALUES
=====================

Critical values:

`4,01,38,53,753`

`4,01,48,04,194`

must remain fully readable.

Do NOT use ellipsis.

Do NOT cut digits.

Do NOT hide overflow.

Inspect `StatCard` current value styling.

If global `StatCard` currently has something like:

`white-space: nowrap`
`text-overflow: ellipsis`

do NOT modify it globally if that could affect existing Dashboard cards.

Solve this page safely.

Preferred options:

* page-scoped class/variant
* safe optional prop/variant on StatCard only if backward-compatible
* smaller existing responsive typography step for long financial values
* allow controlled wrapping only if needed

Do not change existing Dashboard appearance.

Any optional StatCard extension must preserve existing default behavior.

==================================================
TABLET
======

Do not blindly force a 3-column grid if content becomes cramped.

Follow existing `KpiRow`/card responsive behavior.

Preferred progression:

Wide desktop / laptop:
3 columns

Narrow tablet:
2 columns if needed

Small tablet/mobile:
1 column

If the existing reusable component already controls this correctly, reuse it.

Do not create separate arbitrary breakpoint logic if unnecessary.

==================================================
MOBILE
======

On mobile, the Card View should remain understandable.

If Table/Card toggle is already intentionally hidden below the project's desktop breakpoint because `ResponsiveTable` becomes a card layout, preserve that architecture.

Do not create two competing mobile card systems.

If Card View remains accessible on mobile, use:

Online

* three cards stacked or responsive according to existing KpiRow behavior

Offline

* three cards stacked

Total

* three cards stacked

No page-level horizontal scrolling.

No tiny cards.

No clipped financial values.

No hidden information.

==================================================
VERTICAL SPACING
================

The current design became too tall in earlier versions.

Keep vertical rhythm compact.

Between row groups:

`Online`
cards
moderate existing section spacing
`Offline`
cards
moderate existing section spacing
`Total`
cards

Do not create:

* oversized row gaps
* huge card min-heights
* large empty areas
* excessive section padding

Use content-driven card height.

At `1333 × 786`, as much of the report as reasonably possible should remain visible without unnecessary scrolling.

==================================================
CARD HEIGHT
===========

Do not add fixed heights.

Reuse current `StatCard` sizing.

Cards within the same row should naturally align.

Long financial numbers must not force awkward overflow.

==================================================
REUSABLE CODE FIRST
===================

Before adding any new code, check whether current reusable components can solve the need.

Priority:

1. `StatCard`
2. `KpiRow`
3. existing dashboard grid styles
4. existing shared card tokens
5. existing icons

Only add a new component if the current reusable architecture genuinely cannot support the requirement.

Avoid creating:

* OnlineCard
* OfflineCard
* TotalCard
* MetricCard
* CombineMetricCard
* CombineStatCard

if `StatCard` already works.

Avoid creating another card CSS system.

==================================================
SAFE STATCARD EXTENSION
=======================

If long financial values require a StatCard change, do not rewrite the component.

Only add a backward-compatible optional prop if needed, for example conceptually:

`valueSize="default" | "compact"`

or:

`allowValueWrap`

Default behavior must remain exactly the same.

All existing StatCard users must remain visually unchanged.

Any new behavior should be used only by Combine Dashboard.

Do not change existing default props.

==================================================
EN / BN
=======

Maintain English/Bangla parity.

Reuse existing translation keys for:

* Online
* Offline
* Total
* Total Submission
* Tax Paid with Return (173)
* Total Tax Paid
* Table
* Cards
* Filter
* Print

Do not duplicate translation keys.

If genuinely missing, add only the required key.

Test row headings and labels in Bangla because Bangla can wrap differently.

Do not allow BN labels to break the card grid.

==================================================
LIGHT / DARK MODE
=================

Reuse existing theme tokens.

Do not hardcode:

* white backgrounds
* custom purple
* custom green
* custom shadows
* new dark mode colors

Cards must inherit the same light/dark behavior as existing Dashboard cards.

Do not modify global theme tokens.

==================================================
ACCESSIBILITY
=============

Preserve:

* keyboard-accessible Table/Card toggle
* visible focus states
* accessible Filter
* accessible Print
* semantic row headings
* readable card values
* sufficient contrast
* icon accessibility behavior consistent with StatCard

Do not use color alone to identify card meaning.

==================================================
DO NOT CHANGE
=============

Do NOT modify:

* main Dashboard
* PSR Dashboard
* Double Entry Dashboard
* navigation
* navigation order
* routes
* breadcrumbs
* header/topbar
* global search
* global Assessment Year
* authentication
* roles
* permissions
* RBAC
* APIs
* services
* Redux architecture
* other report pages
* other tables
* other cards
* forms
* drawers
* modals
* global responsive breakpoints
* theme system
* business logic

Do not fix unrelated issues.

==================================================
FILES
=====

Keep changes minimal.

Primary file:
`src/app/pages/dashboard/CombineDashboardPage.tsx`

Reuse:
`src/app/components/cards/StatCard.tsx`
`src/app/components/cards/KpiRow.tsx`
`src/styles/cards.css`

Only modify `StatCard` or shared card CSS if absolutely required for a safe backward-compatible variant.

Prefer page-scoped styles if possible.

If the previous custom `SubmissionSummaryCard` is unused after this correction:

* remove its usage from Combine Dashboard
* do not delete globally unless confirmed unused throughout the entire project

==================================================
REGRESSION TESTING
==================

TABLE VIEW

* unchanged
* same columns
* same data
* same responsive behavior

CARD VIEW

* exactly 3 row groups
* Online
* Offline
* Total
* exactly 3 cards per row on suitable desktop/laptop widths
* cards use existing Dashboard visual language
* values match Table View
* no duplicated data

TOGGLE

* Table remains default
* switching view preserves filter
* switching view does not alter global state
* switching view does not reload

FILTER

* Assessment Year only
* existing FilterPanel
* existing MobileFilterOverlay
* no duplicate AY selector

PRINT

* existing behavior remains

SMALL LAPTOP
Must explicitly test:

* 1366 × 768
* `1333 × 786`
* 1280 × 800
* 1280 × 720

At these sizes:

* no horizontal overflow
* no clipped financial values
* 3-column rows remain readable where possible
* toolbar remains stable
* cards remain compact
* both Table and Cards remain available
* no unnecessary giant vertical gaps

TABLET

* card grid adapts safely
* no cramped content
* no clipped numbers

MOBILE

* existing responsive architecture preserved
* no unwanted page-level horizontal scrolling
* all data visible
* no tiny unreadable cards

THEME

* light mode
* dark mode

LANGUAGE

* EN
* BN

REGRESSION

* Dashboard unchanged
* PSR Dashboard unchanged
* Double Entry Dashboard unchanged
* StatCard existing usage unchanged
* other report pages unchanged
* APIs unchanged
* routes unchanged
* navigation unchanged

==================================================
GOLDEN RULES
============

* This is an existing product, not a redesign.
* Inspect the project before editing.
* Protect all solved work.
* Respect the exact scope.
* Reuse existing components before creating new ones.
* Use the existing `StatCard`/`KpiRow` architecture whenever possible.
* Do not rebuild working card components.
* Do not create separate Online/Offline/Total components.
* Do not duplicate data.
* Table View and Card View must use the same current rows.
* Do not invent NBR data.
* Do not invent financial values.
* Do not invent business rules.
* Do not change APIs.
* Do not change routes.
* Do not change navigation.
* Do not change permissions.
* Do not modify unrelated files.
* Do not remove working features.
* Do not break responsive behavior.
* Do not break EN/BN.
* Do not break light/dark mode.
* Mobile is not the only responsive target.
* `1333 × 786` small laptop is a mandatory acceptance size.
* Account for both primary and secondary sidebar widths.
* Do not hide overflow to disguise layout problems.
* Fix root causes.
* Do not globally change StatCard appearance just for this page.
* Any shared component extension must be backward-compatible.
* Test all existing dashboard pages after the change.

Final expected Card View:

```text
Online

[ 14                  ] [ 0                         ] [ 4,01,38,53,753 ]
[ Total Submission    ] [ Tax Paid with Return 173] [ Total Tax Paid  ]


Offline

[ 16                  ] [ 9,05,696                  ] [ 9,50,441       ]
[ Total Submission    ] [ Tax Paid with Return 173 ] [ Total Tax Paid ]


Total

[ 30                  ] [ 9,05,696                  ] [ 4,01,48,04,194 ]
[ Total Submission    ] [ Tax Paid with Return 173 ] [ Total Tax Paid ]
```

The finished Card View must feel like it was built from the same component system as the existing Dashboard and PSR Dashboard, not like a separate custom design.
