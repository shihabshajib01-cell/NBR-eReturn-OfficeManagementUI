Update ONLY the existing `Combine Dashboard` page in the current NBR e-Return Office Management project.

The current Table/Card toggle works, the data is correct, and the general structure is already in place. Do NOT rebuild the page. This task is a targeted UX/UI and responsive correction of the current Card View so it feels like a natural sibling of the existing `Dashboard` and `PSR Dashboard`.

Before changing anything, inspect the current implementation and compare it directly with the existing Dashboard and PSR Dashboard at code level.

Inspect at minimum:

* `src/app/pages/dashboard/CombineDashboardPage.tsx`
* current `SubmissionSummaryCard` implementation
* `src/app/components/cards/StatCard.tsx`
* `src/app/components/cards/KpiRow.tsx`
* `src/styles/cards.css`
* existing Dashboard page
* existing PSR Dashboard page
* `ResponsiveTable`
* `UnifiedMobileCard`
* existing report toolbar
* `FilterPanel`
* `MobileFilterOverlay`
* existing responsive utilities/breakpoints
* typography/spacing/theme tokens

Do not guess. Reuse the actual existing project patterns.

==================================================
CURRENT STATE TO PROTECT
========================

The current Combine Dashboard already has:

* correct navigation
* correct breadcrumb
* correct report title
* Table View
* Card View
* Table/Card toggle
* Assessment Year filter
* Print
* correct Online/Offline/Total data
* shared data source between Table and Card View

Keep all of these.

Do NOT change the confirmed values:

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

Do not fabricate data.

==================================================
MAIN PROBLEM
============

The current Card View works technically, but it does not yet feel visually consistent with the existing Dashboard and PSR Dashboard.

Problems to correct:

1. Card View feels like custom cards placed inside a report card.
2. Card values do not use the same strong information hierarchy as existing Dashboard KPI cards.
3. Online and Offline currently present all three values with equal emphasis.
4. Cards stretch too much on wide screens.
5. The Total card contains too much empty space.
6. The new card CSS duplicates existing StatCard/card-surface styling instead of fully reusing shared tokens/patterns.
7. Combine Dashboard lacks the page-level subtitle used by the other Dashboard pages.
8. Responsive behavior must be explicitly designed for small laptops, not only desktop/tablet/mobile.
9. At resolutions around `1333 × 786`, the page must remain compact, readable, and usable without clipped content or unnecessary scrolling.

Fix these issues without changing the underlying functionality.

==================================================
PAGE HEADER
===========

Match the existing Dashboard/PSR Dashboard page hierarchy.

Use:

`Combine Dashboard`

Add a short supporting description directly under the page title:

`View online and offline submission and tax totals for the selected assessment year.`

Use the same subtitle component/style, spacing, font size, and muted text token already used by Dashboard and PSR Dashboard.

Do not create a custom subtitle style.

==================================================
REPORT TOOLBAR
==============

Keep:

`Online and Offline (Combined Report)`

Keep:

* Table
* Cards
* Filter
* Print

Do not add:

* Search
* Download
* Export
* pagination
* more actions

Maintain the existing report toolbar architecture.

Visually distinguish the two groups:

Presentation control:
`[ Table | Cards ]`

Report actions:
`[ Filter ] [ Print ]`

Use spacing/grouping from existing toolbar patterns rather than introducing decorative dividers unless one already exists.

At narrow desktop widths, toolbar controls may wrap only if genuinely necessary.

Never allow:

* report title overlap
* button overlap
* clipped controls
* horizontal page overflow

==================================================
CARD VIEW INFORMATION HIERARCHY
===============================

Do NOT treat the three metrics inside Online and Offline as three equal table cells.

Make each card meaningful.

For Online and Offline:

Primary KPI:
`Total Submission`

Secondary metrics:

* `Tax Paid with Return (173)`
* `Total Tax Paid`

Expected hierarchy:

Online                                             [icon]

14
Total Submission

0                         4,01,38,53,753
Tax Paid with Return      Total Tax Paid
(173)

And:

Offline                                            [icon]

16
Total Submission

9,05,696                  9,50,441
Tax Paid with Return      Total Tax Paid
(173)

This should follow the visual hierarchy of existing `StatCard`:

* main value clearly prominent
* label directly associated with value
* secondary information quieter
* icon aligned using existing icon-container treatment

Do not make the main value excessively large.

Use the project's existing typography scale.

==================================================
TOTAL SUMMARY
=============

Keep Total as a full-width summary because it represents:

Online + Offline → Total

But make it more compact.

Expected structure:

Total                                             [icon]

30                     9,05,696                    4,01,48,04,194
Total Submission       Tax Paid with Return       Total Tax Paid
(173)

Use a compact horizontal summary strip on desktop.

Do not create large empty vertical space.

Do not make the Total card promotional or flashy.

Use only subtle stronger emphasis through existing:

* font weights
* border tokens
* icon tone
* surface tokens

No gradients.
No new colors.
No bright backgrounds.

==================================================
REUSE EXISTING CARD DESIGN
==========================

Inspect `StatCard` and current shared card CSS.

Do NOT modify `StatCard` globally just to solve this page.

However, do not duplicate its surface styles unnecessarily.

The current `SubmissionSummaryCard` should reuse as much as possible from the existing card foundation:

* surface token
* border token
* border radius
* shadow
* icon container pattern
* typography
* semantic tone classes
* card padding token
* spacing scale

If common card surface styles already exist, use them.

If necessary, refactor only the minimum safe shared styling so both components consume the same card foundation.

Do not make global visual changes to existing Dashboard cards.

Existing Dashboard and PSR Dashboard must look exactly the same after this change.

==================================================
CARD COMPONENT
==============

Keep one reusable component for:

* Online
* Offline
* Total

Do not create separate OnlineCard / OfflineCard / TotalCard components.

Use variants/props.

Conceptually:

`SubmissionSummaryCard`

Props may include:

* title
* icon
* tone
* totalSubmission
* taxPaid173
* totalTaxPaid
* variant: `"default" | "summary"`

Do not duplicate source data.

Both Table View and Card View must continue to use the same current filtered rows.

==================================================
DESKTOP CARD GRID
=================

On sufficiently wide desktop:

Online | Offline

Total spans both columns.

Use a responsive grid based on available CONTENT width, not blindly on viewport width.

Remember that the application has:

* primary navigation
* secondary navigation
* page padding

Therefore a `1333px` viewport does NOT provide `1333px` of usable dashboard content.

Design against the actual content container.

Avoid fixed card widths.

Use:

* CSS Grid
* `minmax(0, 1fr)`
* existing gap tokens
* `min-width: 0`

==================================================
CRITICAL RESPONSIVE REQUIREMENT:
SMALL LAPTOPS
=============

Do not test only:

* large desktop
* tablet
* mobile

Small laptops are a first-class requirement.

Explicitly test at:

* `1536 × 864`
* `1440 × 900`
* `1366 × 768`
* `1333 × 786`  ← CRITICAL
* `1280 × 800`
* `1280 × 720`

At `1333 × 786`, verify the page with both left navigation columns visible.

The Card View must:

* fit naturally in the available content width
* keep Online and Offline readable
* keep Total readable
* preserve Table/Card toggle
* preserve Filter
* preserve Print
* avoid toolbar collision
* avoid clipped monetary values
* avoid oversized card padding
* avoid huge blank areas
* avoid page-level horizontal scrolling
* avoid unnecessary vertical scrolling caused purely by excessive spacing

The most important content should be visible within a typical laptop viewport without requiring excessive scrolling.

==================================================
SMALL-LAPTOP ADAPTATION
=======================

Do not simply use the same large-desktop dimensions.

At narrow desktop/small-laptop widths:

Reduce only through existing responsive tokens/patterns:

* card gap
* internal spacing
* card padding where existing system allows
* toolbar spacing
* metric gaps

Do NOT reduce:

* readable font sizes below system standards
* touch/click target sizes
* financial value legibility

For Online and Offline cards, if three-column internal metric layouts become cramped, use the meaningful hierarchy:

Primary:
Total Submission

Secondary row:
Tax Paid with Return (173) | Total Tax Paid

This is preferred over squeezing all three metrics into three equal columns.

At small-laptop width, conceptually:

Online                                  [icon]

14
Total Submission

9,05,696                  9,50,441
Tax Paid with Return      Total Tax Paid
(173)

This keeps the cards compact and readable.

==================================================
RESPONSIVE GRID FALLBACK
========================

Do not force Online and Offline to remain side-by-side when the ACTUAL available content area is too narrow.

If required by the existing breakpoint system, safely fall back:

Wide desktop:
`Online | Offline`
`Total  | spans both`

Narrow desktop/small laptop:
prefer `Online | Offline` when content still fits.

If it does not fit safely:
`Online`
`Offline`
`Total`

Choose based on actual content readability, not an arbitrary desire to maintain two columns.

Do not modify global application breakpoints just for this page.

Use page/component-scoped responsive rules if necessary.

==================================================
VERTICAL RESPONSIVENESS
=======================

Also consider viewport HEIGHT.

A `1333 × 786` laptop has limited vertical space.

Avoid excessive vertical spacing between:

* breadcrumb
* page title
* subtitle
* report container
* card rows

Reuse existing dashboard vertical rhythm.

Do not introduce:

* giant section margins
* oversized card heights
* fixed min-heights that create blank space

Cards should be content-driven.

Avoid hardcoded heights.

==================================================
TABLE VIEW RESPONSIVENESS
=========================

Do not change the current Table View unless a genuine responsive bug is found.

Continue using:

`ResponsiveTable`

On desktop/small laptop:

* table should remain readable
* financial values must not clip
* no page-level horizontal scrolling

On narrow devices:

* preserve existing ResponsiveTable mobile behavior
* do not rebuild the table system

==================================================
TABLE/CARD TOGGLE RESPONSIVENESS
================================

At desktop and small-laptop widths, keep the Table/Card toggle available.

`1333 × 786` must support both Table and Card View.

Do not hide the toggle merely because the screen is a smaller laptop.

For tablet/mobile, inspect existing responsive behavior.

If the existing ResponsiveTable already converts to mobile cards and the two view modes become functionally redundant, it is acceptable to hide the toggle at the established mobile/tablet breakpoint.

Do not create confusing behavior where:

* user selects Table
* UI still looks identical to Card

Follow the existing responsive architecture.

==================================================
FILTER RESPONSIVENESS
=====================

Filter must remain Assessment Year only.

Desktop/small laptop:
reuse existing `FilterPanel`.

Mobile:
reuse existing `MobileFilterOverlay`.

At `1333 × 786`:

* Filter button remains visible
* opened filter panel fits within report
* Assessment Year field does not stretch unnecessarily
* Apply/Clear actions remain aligned
* no horizontal overflow
* opening filter should not break Card View layout

Do not create a second filtering system.

==================================================
MOBILE/TABLET
=============

Continue to explicitly verify:

* 1024 × 768
* 820 × 1180
* 768 × 1024
* 430 × 932
* 390 × 844
* 375 × 812
* 360 × 800
* 320 × 568

On mobile:

* preserve existing mobile navigation
* preserve MobileFilterOverlay
* preserve existing card/table responsive architecture
* no clipped values
* no page-level horizontal scroll
* no tiny controls
* all metrics remain visible

Do not simply shrink desktop cards.

==================================================
LONG FINANCIAL VALUES
=====================

Values such as:

`4,01,38,53,753`
`4,01,48,04,194`

must remain fully readable.

Do not use ellipsis.

Do not cut digits.

Use appropriate:

* `min-width: 0`
* wrapping strategy if genuinely required
* existing number typography
* sensible grid/flex sizing

Do not shrink numbers to an unreadable size just to preserve a column.

==================================================
PAGE WIDTH / OVERFLOW
=====================

Explicitly inspect:

* `.dashboard-page`
* report container
* card grid
* summary card
* toolbar
* navigation widths
* content padding

Make sure no child uses a fixed/min width that creates horizontal overflow at small-laptop sizes.

Check common causes:

* `min-width` on toolbar groups
* fixed metric widths
* long labels
* long financial numbers
* card grid minimums
* icon/button groups
* report title + controls competing on one line

Fix root causes, not with arbitrary `overflow: hidden`.

Do not hide clipped content.

==================================================
EN/BN RESPONSIVENESS
====================

Test responsive behavior in both EN and BN.

Bangla labels may be longer/wrap differently.

Do not assume English widths.

Ensure at `1333 × 786` and mobile:

* headings remain readable
* toolbar remains stable
* metric labels may wrap safely
* cards do not overflow

Preserve existing translation architecture.

==================================================
LIGHT / DARK MODE
=================

Verify Card View at:

* light mode
* dark mode

Especially at:

* `1333 × 786`
* mobile

Do not hardcode new colors.

Use existing theme tokens.

Do not modify global themes.

==================================================
ACCESSIBILITY
=============

Keep:

* proper heading hierarchy
* keyboard-accessible Table/Card toggle
* `aria-pressed` or equivalent selected state
* visible focus
* accessible Filter
* accessible Print
* semantic metric labels
* sufficient contrast
* usable controls at all breakpoints

Do not rely only on color for active state.

==================================================
DO NOT CHANGE
=============

Do NOT change:

* main Dashboard design
* Dashboard `StatCard` appearance
* PSR Dashboard design
* Double Entry Dashboard
* navigation
* breadcrumbs
* routes
* APIs
* Redux architecture
* global Assessment Year behavior
* permissions
* roles
* authentication
* other reports
* global responsive breakpoints
* other tables
* other cards
* forms
* drawers
* modals

Do not fix unrelated issues.

==================================================
REGRESSION TESTS
================

After implementation test:

FUNCTIONAL

* Table View still works
* Card View still works
* toggle changes presentation only
* Filter state survives changing views
* Print still works
* Assessment Year remains the only filter
* data remains identical between Table and Card View

VISUAL CONSISTENCY

* cards feel like the same family as Dashboard cards
* icon containers match existing dashboard language
* typography hierarchy matches the product
* no duplicated custom card visual language
* page subtitle matches Dashboard/PSR pattern

CARD HIERARCHY

* Online lead metric = Total Submission
* Offline lead metric = Total Submission
* tax metrics remain secondary
* Total remains a clear combined summary

RESPONSIVE — LARGE DESKTOP

* 1920 × 1080
* 1536 × 864

RESPONSIVE — SMALL LAPTOP, MUST TEST

* 1440 × 900
* 1366 × 768
* `1333 × 786`
* 1280 × 800
* 1280 × 720

At all small-laptop sizes:

* no horizontal page overflow
* no clipped numbers
* toolbar controls remain usable
* Online/Offline cards do not become overly wide or cramped
* Total card is compact
* no unnecessary huge blank areas
* no excessive vertical scrolling
* both Table and Card modes remain available

RESPONSIVE — TABLET/MOBILE

* 1024 × 768
* 768 × 1024
* 390 × 844
* 360 × 800
* 320 × 568

THEMES

* light mode
* dark mode

LANGUAGE

* EN
* BN

REGRESSION

* Dashboard unchanged
* PSR Dashboard unchanged
* Double Entry Dashboard unchanged
* other report pages unchanged
* StatCard unchanged visually
* existing filters unchanged globally
* existing tables unchanged globally

==================================================
GOLDEN RULES
============

* This is an existing product, not a redesign.
* Do not rebuild solved areas.
* Fix only the Combine Dashboard Card View and its responsive behavior.
* Reuse existing code before creating new code.
* Reuse existing card visual language.
* Do not globally modify StatCard just to solve this page.
* One source of data powers both Table and Card View.
* Do not fabricate NBR data.
* Do not invent business logic.
* Do not change APIs.
* Do not change routes.
* Do not change permissions.
* Do not change navigation.
* Do not change unrelated pages.
* Preserve Filter and Print.
* Preserve EN/BN.
* Preserve light/dark mode.
* Desktop does NOT mean only large monitors.
* `1333 × 786` small-laptop behavior is a mandatory acceptance criterion.
* Responsive QA must cover viewport width AND viewport height.
* Account for both primary and secondary navigation widths when evaluating available content space.
* Do not solve overflow by hiding content.
* Fix layout root causes.
* Protect all existing functionality and solved work.

Final target:

The Combine Dashboard Card View should look and behave like it was built alongside the existing Dashboard and PSR Dashboard from the beginning.

It should preserve the current report functionality while presenting Online, Offline, and Total as meaningful dashboard summaries, with a strong hierarchy, compact use of space, and reliable behavior from large desktop through `1333 × 786` small laptops, tablets, and mobile devices.
