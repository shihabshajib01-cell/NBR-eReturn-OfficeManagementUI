Update ONLY the existing `Combine Dashboard` Card View in the current NBR e-Return Office Management project.

The Card View structure is now conceptually correct:

* Online
* Offline
* Total

Each segment contains exactly 3 reusable KPI cards:

1. Total Submission
2. Tax Paid with Return (173)
3. Total Tax Paid

The remaining task is to fix the layout, spacing, visual grouping, and small-laptop responsiveness so the three segments are clearly separated, compact, and consistent with the existing Dashboard card system.

Do NOT redesign the cards again.

Before changing code:

* inspect the current `CombineDashboardPage`
* inspect the current Card View implementation
* inspect `StatCard`
* inspect `KpiRow`
* inspect `cards.css`
* inspect the current Dashboard and PSR Dashboard spacing
* inspect current report container styles
* inspect current responsive breakpoints
* inspect current EN/BN behavior
* inspect current light/dark theme tokens

Reuse existing components and styles wherever possible.

The current card structure and values are correct. Protect them.

Confirmed values:

Online

* Total Submission: `14`
* Tax Paid with Return (173): `0`
* Total Tax Paid: `4,01,38,53,753`

Offline

* Total Submission: `16`
* Tax Paid with Return (173): `9,05,696`
* Total Tax Paid: `9,50,441`

Total

* Total Submission: `30`
* Tax Paid with Return (173): `9,05,696`
* Total Tax Paid: `4,01,48,04,194`

Do not invent or change any data.

==================================================
PRIMARY GOAL
============

Keep exactly 3 Card View segments:

`Online`

`Offline`

`Total`

Each segment contains one row of 3 existing-style cards.

The final hierarchy should be:

```text
Online
[ card ][ card ][ card ]

Offline
[ card ][ card ][ card ]

Total
[ card ][ card ][ card ]
```

The three segments must be clearly separated from each other, but without creating excessive vertical height.

The visual separation should feel intentional and clean.

==================================================
SEGMENT SEPARATION
==================

This is important.

Online, Offline, and Total must read as three separate logical groups.

Do NOT rely only on large empty gaps.

Use a compact segment container or section treatment based on existing project styles.

Preferred structure:

```text
Online
────────────────────────────────
[ card ][ card ][ card ]

Offline
────────────────────────────────
[ card ][ card ][ card ]

Total
────────────────────────────────
[ card ][ card ][ card ]
```

But do not use heavy full-width borders if the product has a softer section pattern.

Better options, in order of preference:

1. small section heading + subtle divider using existing border token
2. small section heading + subtle tinted background strip if already used elsewhere
3. small section heading + consistent spacing only if visually clear enough

Do not:

* create thick colored dividers
* create nested large cards around each segment
* create accordion sections
* use bright background blocks
* use new colors

The separation must be visible but restrained.

==================================================
SEGMENT HEADING
===============

Each segment heading should be:

`Online`

`Offline`

`Total`

Use the existing section-heading typography.

The heading must align with the card grid.

Do not place the heading flush against the outer report edge if the cards have inner padding.

The left edge of the heading should align visually with the left edge of the first card.

Do not add long subtitles beneath these headings.

Do not add:

* Online Summary
* Offline Summary
* Combined Total Summary

Keep the labels simple.

==================================================
REMOVE EXCESSIVE VERTICAL SPACING
=================================

The current implementation is too tall because multiple margins/gaps stack together.

Inspect and correct the root cause.

Likely sources include:

* wrapper `gap`
* metric group `gap`
* `dashboard-kpi-grid` margin-bottom
* heading padding
* divider spacing
* report-content padding

Do not simply reduce one random margin.

Calculate the stacked spacing and simplify it.

Target compact rhythm:

```text
segment heading
small gap
cards
moderate gap
next segment heading
small gap
cards
```

Do not allow:

* heading → large gap → cards
* cards → large gap → divider → large gap → heading

Keep the vertical rhythm consistent.

==================================================
DO NOT CHANGE STATCARD DESIGN
=============================

The reusable cards themselves are now correct.

Do not redesign them again.

Use the existing `StatCard` visual system:

* surface
* border
* radius
* shadow
* icon container
* value typography
* label typography
* spacing

Do not create another custom card component.

Do not create:

* CombineStatCard
* SegmentCard
* ReportMetricCard
* OnlineCard
* OfflineCard
* TotalCard

Use `StatCard` / `KpiRow`.

==================================================
RESTORE NORMAL STATCARD VALUE TYPOGRAPHY
========================================

Do not globally reduce all Combine Dashboard card values.

The normal values:

* 14
* 0
* 16
* 30
* 9,05,696
* 9,50,441

should use the standard `StatCard` value styling.

Do not override all values to `22px` or another smaller size.

Use the existing Dashboard hierarchy.

If the normal StatCard uses approximately:

`28px / 700`

preserve that by default.

==================================================
LONG FINANCIAL VALUES
=====================

Only these long values need special attention:

`4,01,38,53,753`

`4,01,48,04,194`

Do not reduce every card just because these two values are long.

Handle only long values safely.

Preferred options:

* optional backward-compatible StatCard prop such as `compactValue`
* page-scoped modifier class
* safe responsive font-size reduction for long values only

Do NOT:

* truncate with ellipsis
* hide overflow
* cut digits
* wrap awkwardly over multiple random lines
* modify all StatCards globally

The long values must remain completely readable at:

* 1366 × 768
* 1333 × 786
* 1280 × 800
* 1280 × 720

==================================================
REPORT CONTAINER
================

Keep the existing report wrapper and toolbar.

Keep:

`Online and Offline (Combined Report)`

Toolbar:

`[Table | Cards] [Filter] [Print]`

Do not add:

* Search
* Download
* record count
* pagination
* export
* More

The Card View content should remain inside the existing report container.

Do not add extra outer cards around the three segments.

==================================================
TABLE VIEW
==========

Do not modify Table View.

It must remain exactly as it currently works.

Keep:

* same columns
* same rows
* same values
* same Total treatment
* same responsive behavior
* same Filter
* same Print

==================================================
ONE DATA SOURCE
===============

Table View and Card View must continue to use the same filtered/current data source.

Do not duplicate data.

Architecture:

```text
current filtered rows
        ↓
   ┌─────────────┐
   ↓             ↓
Table View     Card View
```

Do not create separate hardcoded data for cards.

==================================================
RESPONSIVE BEHAVIOR
===================

This task must explicitly support:

Large desktop:

* 1920 × 1080
* 1536 × 864

Normal laptop:

* 1440 × 900
* 1366 × 768

Small laptop:

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

Small laptop is a mandatory acceptance target.

Do not assume desktop means a large monitor.

==================================================
SMALL LAPTOP REQUIREMENT
========================

At `1333 × 786`, with both primary and secondary navigation visible:

The page must show:

* page title
* page subtitle
* report toolbar
* Online row
* Offline row
* Total row

without excessive unnecessary vertical scrolling.

It is acceptable if the bottom of the final row is close to the fold, but the layout must not waste space.

Requirements:

* 3 cards per segment remain side-by-side if they fit
* no horizontal page overflow
* no clipped values
* no card overlap
* no toolbar overlap
* no huge section gaps
* no oversized card heights
* no unnecessary bottom margins
* no accidental duplicate padding

Do not hide content to make it fit.

Fix spacing properly.

==================================================
DESKTOP CARD GRID
=================

For desktop and small laptop, use:

```text
3 equal columns
```

for each segment.

Use:

* `repeat(3, minmax(0, 1fr))`
* existing gap token
* `min-width: 0`

Do not use fixed widths.

Do not create separate grid implementations for Online, Offline, and Total.

Use the same reusable grid pattern for all three.

==================================================
TABLET
======

If 3 columns become cramped, use the existing reusable responsive behavior.

Preferred fallback:

* 2 columns where appropriate
* 1 column on narrow layouts

Do not shrink text excessively just to keep 3 columns.

Do not alter global breakpoints.

Use existing KpiRow/card responsive patterns where possible.

==================================================
MOBILE
======

Do not simply shrink desktop.

Preserve existing mobile architecture.

If the Table/Card toggle is hidden on mobile because `ResponsiveTable` already becomes cards, keep that behavior if it is already intentional.

If Card View remains available, stack the metric cards according to existing KpiRow behavior.

No:

* page-level horizontal scrolling
* clipped financial values
* tiny text
* broken section headings
* oversized gaps

==================================================
SEGMENT RESPONSIVENESS
======================

The segment separation must remain visible at every breakpoint.

Desktop:

```text
Online
[3 cards]

Offline
[3 cards]

Total
[3 cards]
```

Tablet/mobile:

```text
Online
[cards reflow]

Offline
[cards reflow]

Total
[cards reflow]
```

The heading must stay visually attached to its own card group.

Do not allow a heading to appear at the bottom of one screen with its cards separated far below.

Use controlled spacing and natural document flow.

==================================================
FILTER
======

Keep the existing Assessment Year filter only.

Do not add more filters.

Desktop:
reuse `FilterPanel`

Mobile:
reuse `MobileFilterOverlay`

Switching Table/Card views must preserve:

* open/closed filter state where appropriate
* selected Assessment Year
* applied filter
* current data

Do not create another filter for Card View.

==================================================
PRINT
=====

Keep the current Print behavior.

Do not add:

* download
* PDF
* Excel
* CSV
* share

Do not create a new print system.

==================================================
EN / BN
=======

Keep EN/BN parity.

Reuse existing translation keys for:

* Online
* Offline
* Total
* Total Submission
* Tax Paid with Return (173)
* Total Tax Paid

Do not duplicate keys.

Test segment headings in BN.

Make sure longer BN labels do not:

* overflow cards
* break the segment layout
* create horizontal scroll

==================================================
LIGHT / DARK MODE
=================

Use existing theme tokens.

Do not hardcode:

* new surface colors
* custom divider colors
* custom shadows
* dark mode overrides

Segment separators should use existing border/muted tokens.

Do not alter global themes.

==================================================
ACCESSIBILITY
=============

Keep:

* semantic section headings for Online / Offline / Total
* keyboard-accessible view toggle
* visible focus
* accessible Filter
* accessible Print
* readable card values
* sufficient contrast

If using dividers, they should be decorative only and not add redundant screen-reader noise.

==================================================
DO NOT CHANGE
=============

Do NOT modify:

* main Dashboard
* PSR Dashboard
* Double Entry Dashboard
* navigation
* routes
* breadcrumbs
* topbar
* authentication
* permissions
* roles
* APIs
* services
* Redux architecture
* global Assessment Year behavior
* other reports
* other tables
* other card layouts
* forms
* drawers
* modals
* global breakpoints
* theme system

Do not fix unrelated issues.

==================================================
EXPECTED FILE SCOPE
===================

Primary:
`src/app/pages/dashboard/CombineDashboardPage.tsx`

Possibly:
page-scoped CSS or existing card CSS only if required.

Reuse:

* `StatCard`
* `KpiRow`
* existing grid
* existing spacing tokens
* existing theme tokens

Avoid new generic components.

If the previous custom `SubmissionSummaryCard` is no longer used by this page:

* remove its usage
* do not delete globally unless confirmed unused elsewhere

==================================================
REGRESSION TESTS
================

Card View:

* exactly 3 segments
* Online
* Offline
* Total
* exactly 3 cards in each segment on suitable desktop widths
* cards use existing StatCard design
* no custom multi-metric card
* segment separation is visually clear
* segment separation is compact
* no excessive vertical gaps
* no unnecessary divider clutter
* headings align with card grid

Values:

* all values unchanged
* no fabricated data
* no truncation

Long financial values:

* fully readable at 1333 × 786
* no ellipsis
* no clipping

Table View:

* unchanged

Toggle:

* works
* preserves filters
* changes presentation only

Filter:

* Assessment Year only
* existing behavior unchanged

Print:

* unchanged

Small laptop:
Must explicitly verify:

* 1366 × 768
* `1333 × 786`
* 1280 × 800
* 1280 × 720

At these sizes:

* Online clearly visible
* Offline clearly visible
* Total clearly visible
* three groups separated properly
* no excessive blank space
* no page-level horizontal overflow
* toolbar remains usable
* no clipped values
* no giant gaps
* no fixed-height cards

Tablet/mobile:

* card/grid reflows safely
* section headings remain attached to their cards
* no overflow
* no hidden values

Theme:

* light mode works
* dark mode works

Language:

* EN works
* BN works

Regression:

* Dashboard unchanged
* PSR Dashboard unchanged
* Double Entry Dashboard unchanged
* other report pages unchanged
* StatCard default appearance unchanged globally

==================================================
GOLDEN RULES
============

* This is an existing product, not a redesign.
* Inspect the project before editing.
* Fix only the Combine Dashboard Card View layout.
* Protect solved functionality.
* Keep Table View unchanged.
* Keep Filter unchanged.
* Keep Print unchanged.
* Keep data unchanged.
* Reuse `StatCard`.
* Reuse `KpiRow`.
* Reuse existing design tokens.
* Do not create another card system.
* Do not redesign card internals again.
* Do not fabricate NBR data.
* Do not invent business logic.
* Do not change APIs.
* Do not change routes.
* Do not change navigation.
* Do not change permissions.
* Do not change unrelated files.
* Do not hide overflow to mask problems.
* Fix the actual spacing/layout root cause.
* Segment separation must be clear but compact.
* Online, Offline, and Total must look like three distinct groups.
* Small laptop `1333 × 786` is a mandatory acceptance size.
* Test width and height, not width only.
* Preserve EN/BN.
* Preserve light/dark mode.
* Preserve responsive behavior.

Final target:

```text
Online
────────────────────────────────
[ 14 ] [ 0 ] [ 4,01,38,53,753 ]

Offline
────────────────────────────────
[ 16 ] [ 9,05,696 ] [ 9,50,441 ]

Total
────────────────────────────────
[ 30 ] [ 9,05,696 ] [ 4,01,48,04,194 ]
```

The three segments must be easy to distinguish at a glance, while the overall Card View stays compact enough to work properly on small laptops.
