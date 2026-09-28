```text
Update ONLY the central FONT TOKEN SYSTEM of the existing NBR e-Return Office Management project.

This is a typography-token consolidation and responsive-token task only.

DO NOT fix, replace, migrate, or touch hard-coded `font-size` declarations in individual components/pages in this phase.

The goal is to create one predictable central typography token system that supports:

1. Large Desktop
2. Laptop / Small Laptop
3. Tablet
4. Mobile

and continues to support:

- Compact font scale
- Standard font scale
- Large font scale
- EN
- BN
- Light mode
- Dark mode

All font-size values in the token system MUST use EVEN NUMBERS ONLY.

Examples:

11px → 10px
13px → 12px
15px → 14px
17px → 16px
19px → 18px
21px → 20px

Never introduce an odd-number font size into the central typography token system.

==================================================
1. INSPECT FIRST
==================================================

Before modifying anything, inspect the existing project.

At minimum inspect:

- `src/styles/typography.css`
- all existing `--fs-*` typography variables
- all existing `--typ-*` typography variables
- existing `data-font-scale` handling
- Compact / Standard / Large typography definitions
- current typography media queries
- existing breakpoint structure
- `src/app/data/fonts.ts`
- existing Appearance / Font Size settings
- any code that changes `data-font-scale`
- any component that directly consumes `--fs-*`
- any component that directly consumes `--typ-*`

Also search the project for:

`var(--fs-`

and:

`var(--typ-`

to understand which token families are actually being consumed.

Do not guess.

==================================================
2. EXACT SCOPE
==================================================

This task covers ONLY:

- central typography font-size tokens
- responsive typography token values
- Compact / Standard / Large token values
- compatibility aliases between existing token systems
- fixing token-level breakpoint/specificity problems

This task does NOT cover:

- hard-coded `font-size: 14px`
- hard-coded `font-size: 13px`
- hard-coded `font-size: 28px`
- inline `fontSize`
- Tailwind `text-[...]`
- component-specific font-size cleanup
- StatCard hard-coded font size
- MUI hard-coded font sizes
- Special Registration hard-coded typography
- Role/Permission hard-coded typography
- dropdown hard-coded typography
- form hard-coded typography

Leave those untouched for now.

There will be a separate hard-coded typography migration phase later.

==================================================
3. CANONICAL TOKEN FAMILY
==================================================

Make the existing:

`--fs-*`

family the canonical runtime typography system.

Examples:

--fs-h1
--fs-h2
--fs-h3

--fs-body-lg
--fs-body-md
--fs-body-sm

--fs-label-md
--fs-label-sm

--fs-button
--fs-input

--fs-table-header
--fs-table-body

--fs-caption
--fs-badge
--fs-tooltip

--fs-nav-primary
--fs-nav-main
--fs-nav-sub

--fs-breadcrumb

--fs-topbar-name
--fs-topbar-role

Do not create another competing font-size token family.

==================================================
4. LEGACY `--typ-*` TOKENS
==================================================

The project currently also contains a second typography family such as:

--typ-h1-size
--typ-h2-size
--typ-h3-size
--typ-body-md-size
--typ-button-size
--typ-input-size
--typ-table-header-size
etc.

Do NOT immediately delete these tokens because existing components may depend on them.

Instead, convert legacy `--typ-*` font-size variables into compatibility aliases that point to the canonical `--fs-*` values wherever their semantic role matches.

Conceptually:

--typ-h1-size: var(--fs-h1);
--typ-h2-size: var(--fs-h2);
--typ-h3-size: var(--fs-h3);

--typ-body-md-size: var(--fs-body-md);
--typ-button-size: var(--fs-button);
--typ-input-size: var(--fs-input);

--typ-table-header-size: var(--fs-table-header);
--typ-table-body-size: var(--fs-table-body);

Do not maintain two independent numeric scales.

After this change:

`--fs-*`
must be the source of truth.

`--typ-*`
must only provide backward compatibility.

Do not remove a legacy token unless a full-project search confirms that nothing consumes it.

==================================================
5. DO NOT TOUCH `fonts.ts` BLINDLY
==================================================

Inspect:

`src/app/data/fonts.ts`

If its font-size token definitions are NOT used at runtime:

- do not make them the new source of truth
- do not build a fourth typography system around them
- leave them untouched in this phase unless removing/changing them is completely safe and required

If they ARE actively consumed:

- do not allow them to remain an independent conflicting scale
- align them with the canonical CSS token strategy without duplicating numeric definitions unnecessarily

The CSS `--fs-*` system remains the runtime source of truth.

==================================================
6. FOUR RESPONSIVE TYPOGRAPHY RANGES
==================================================

Implement exactly four typography ranges.

Use:

LARGE DESKTOP
`> 1440px`

LAPTOP / SMALL LAPTOP
`1025px – 1440px`

TABLET
`481px – 1024px`

MOBILE
`≤ 480px`

Important:

Do not change the application's global layout breakpoints.

These ranges apply only to typography tokens.

Do not add page-specific `1333px`, `1366px`, or `1280px` media queries.

The Laptop range must naturally cover:

- 1440 × 900
- 1366 × 768
- 1333 × 786
- 1280 × 800
- 1280 × 720

==================================================
7. BREAKPOINT IMPLEMENTATION
==================================================

Avoid overlapping/specificity ambiguity.

Use an explicit structure where each responsive range defines:

- Standard
- Compact
- Large

within that range.

For example conceptually:

Default:
Large Desktop Standard

:root[data-font-scale="compact"]
Large Desktop Compact

:root[data-font-scale="large"]
Large Desktop Large

Then:

@media (min-width: 1025px) and (max-width: 1440px)

inside that media query explicitly define:

:root
:root[data-font-scale="standard"]
:root[data-font-scale="compact"]
:root[data-font-scale="large"]

Then:

@media (min-width: 481px) and (max-width: 1024px)

explicitly define all three scales.

Then:

@media (max-width: 480px)

explicitly define all three scales.

Do NOT rely on a generic:

:root

tablet declaration to override a more specific:

:root[data-font-scale="large"]

desktop declaration.

Fix the current specificity issue at token level.

==================================================
8. STANDARD SCALE — EXACT VALUES
==================================================

Use these values for STANDARD mode.

--------------------------------------------------
LARGE DESKTOP > 1440px
--------------------------------------------------

--fs-h1: 40px;
--fs-h2: 28px;
--fs-h3: 22px;

--fs-body-lg: 18px;
--fs-body-md: 16px;
--fs-body-sm: 14px;

--fs-label-md: 14px;
--fs-label-sm: 12px;

--fs-button: 16px;
--fs-input: 16px;

--fs-table-header: 14px;
--fs-table-body: 14px;

--fs-caption: 12px;
--fs-badge: 12px;
--fs-tooltip: 12px;

--fs-nav-primary: 12px;
--fs-nav-main: 14px;
--fs-nav-sub: 14px;

--fs-breadcrumb: 12px;

--fs-topbar-name: 14px;
--fs-topbar-role: 12px;

Also create:

--fs-stat-value: 28px;

Do NOT wire `--fs-stat-value` into existing hard-coded StatCard CSS in this phase.

It is being established now as the future semantic token.

--------------------------------------------------
LAPTOP / SMALL LAPTOP 1025–1440px
--------------------------------------------------

--fs-h1: 36px;
--fs-h2: 26px;
--fs-h3: 20px;

--fs-body-lg: 16px;
--fs-body-md: 16px;
--fs-body-sm: 14px;

--fs-label-md: 14px;
--fs-label-sm: 12px;

--fs-button: 14px;
--fs-input: 16px;

--fs-table-header: 14px;
--fs-table-body: 14px;

--fs-caption: 12px;
--fs-badge: 12px;
--fs-tooltip: 12px;

--fs-nav-primary: 12px;
--fs-nav-main: 14px;
--fs-nav-sub: 14px;

--fs-breadcrumb: 12px;

--fs-topbar-name: 14px;
--fs-topbar-role: 12px;

--fs-stat-value: 26px;

--------------------------------------------------
TABLET 481–1024px
--------------------------------------------------

--fs-h1: 32px;
--fs-h2: 24px;
--fs-h3: 18px;

--fs-body-lg: 16px;
--fs-body-md: 16px;
--fs-body-sm: 14px;

--fs-label-md: 14px;
--fs-label-sm: 12px;

--fs-button: 14px;
--fs-input: 16px;

--fs-table-header: 14px;
--fs-table-body: 14px;

--fs-caption: 12px;
--fs-badge: 12px;
--fs-tooltip: 12px;

--fs-nav-primary: 12px;
--fs-nav-main: 14px;
--fs-nav-sub: 14px;

--fs-breadcrumb: 12px;

--fs-topbar-name: 14px;
--fs-topbar-role: 12px;

--fs-stat-value: 24px;

--------------------------------------------------
MOBILE ≤ 480px
--------------------------------------------------

--fs-h1: 28px;
--fs-h2: 22px;
--fs-h3: 18px;

--fs-body-lg: 16px;
--fs-body-md: 16px;
--fs-body-sm: 14px;

--fs-label-md: 14px;
--fs-label-sm: 12px;

--fs-button: 14px;
--fs-input: 16px;

--fs-table-header: 14px;
--fs-table-body: 14px;

--fs-caption: 12px;
--fs-badge: 12px;
--fs-tooltip: 12px;

--fs-nav-primary: 12px;
--fs-nav-main: 14px;
--fs-nav-sub: 14px;

--fs-breadcrumb: 12px;

--fs-topbar-name: 14px;
--fs-topbar-role: 12px;

--fs-stat-value: 24px;

==================================================
9. COMPACT SCALE — EXACT VALUES
==================================================

Compact mode should increase density, but must still remain readable.

Never make editable inputs smaller than 16px.

--------------------------------------------------
LARGE DESKTOP COMPACT
--------------------------------------------------

--fs-h1: 36px;
--fs-h2: 26px;
--fs-h3: 20px;

--fs-body-lg: 16px;
--fs-body-md: 14px;
--fs-body-sm: 12px;

--fs-label-md: 12px;
--fs-label-sm: 12px;

--fs-button: 14px;
--fs-input: 16px;

--fs-table-header: 12px;
--fs-table-body: 12px;

--fs-caption: 12px;
--fs-badge: 12px;
--fs-tooltip: 12px;

--fs-nav-primary: 12px;
--fs-nav-main: 12px;
--fs-nav-sub: 12px;

--fs-breadcrumb: 12px;

--fs-topbar-name: 12px;
--fs-topbar-role: 12px;

--fs-stat-value: 26px;

--------------------------------------------------
LAPTOP / SMALL LAPTOP COMPACT
--------------------------------------------------

--fs-h1: 34px;
--fs-h2: 24px;
--fs-h3: 18px;

--fs-body-lg: 16px;
--fs-body-md: 14px;
--fs-body-sm: 12px;

--fs-label-md: 12px;
--fs-label-sm: 12px;

--fs-button: 14px;
--fs-input: 16px;

--fs-table-header: 12px;
--fs-table-body: 12px;

--fs-caption: 12px;
--fs-badge: 12px;
--fs-tooltip: 12px;

--fs-nav-primary: 12px;
--fs-nav-main: 12px;
--fs-nav-sub: 12px;

--fs-breadcrumb: 12px;

--fs-topbar-name: 12px;
--fs-topbar-role: 12px;

--fs-stat-value: 24px;

--------------------------------------------------
TABLET COMPACT
--------------------------------------------------

--fs-h1: 30px;
--fs-h2: 22px;
--fs-h3: 18px;

--fs-body-lg: 16px;
--fs-body-md: 14px;
--fs-body-sm: 12px;

--fs-label-md: 12px;
--fs-label-sm: 12px;

--fs-button: 14px;
--fs-input: 16px;

--fs-table-header: 12px;
--fs-table-body: 12px;

--fs-caption: 12px;
--fs-badge: 12px;
--fs-tooltip: 12px;

--fs-nav-primary: 12px;
--fs-nav-main: 12px;
--fs-nav-sub: 12px;

--fs-breadcrumb: 12px;

--fs-topbar-name: 12px;
--fs-topbar-role: 12px;

--fs-stat-value: 22px;

--------------------------------------------------
MOBILE COMPACT
--------------------------------------------------

--fs-h1: 28px;
--fs-h2: 20px;
--fs-h3: 18px;

--fs-body-lg: 16px;
--fs-body-md: 14px;
--fs-body-sm: 12px;

--fs-label-md: 12px;
--fs-label-sm: 12px;

--fs-button: 14px;
--fs-input: 16px;

--fs-table-header: 12px;
--fs-table-body: 12px;

--fs-caption: 12px;
--fs-badge: 12px;
--fs-tooltip: 12px;

--fs-nav-primary: 12px;

Keep touch-oriented mobile navigation readable:

--fs-nav-main: 14px;
--fs-nav-sub: 14px;

--fs-breadcrumb: 12px;

--fs-topbar-name: 12px;
--fs-topbar-role: 12px;

--fs-stat-value: 22px;

==================================================
10. LARGE SCALE — EXACT VALUES
==================================================

Large mode is an accessibility/readability preference.

Do not simply scale everything with arbitrary percentages.

Use these explicit even-number values.

--------------------------------------------------
LARGE DESKTOP LARGE
--------------------------------------------------

--fs-h1: 44px;
--fs-h2: 32px;
--fs-h3: 24px;

--fs-body-lg: 20px;
--fs-body-md: 18px;
--fs-body-sm: 16px;

--fs-label-md: 16px;
--fs-label-sm: 14px;

--fs-button: 18px;
--fs-input: 18px;

--fs-table-header: 16px;
--fs-table-body: 16px;

--fs-caption: 14px;
--fs-badge: 14px;
--fs-tooltip: 14px;

--fs-nav-primary: 14px;
--fs-nav-main: 16px;
--fs-nav-sub: 16px;

--fs-breadcrumb: 14px;

--fs-topbar-name: 16px;
--fs-topbar-role: 14px;

--fs-stat-value: 32px;

--------------------------------------------------
LAPTOP / SMALL LAPTOP LARGE
--------------------------------------------------

--fs-h1: 40px;
--fs-h2: 28px;
--fs-h3: 22px;

--fs-body-lg: 18px;
--fs-body-md: 18px;
--fs-body-sm: 16px;

--fs-label-md: 16px;
--fs-label-sm: 14px;

--fs-button: 16px;
--fs-input: 18px;

--fs-table-header: 16px;
--fs-table-body: 16px;

--fs-caption: 14px;
--fs-badge: 14px;
--fs-tooltip: 14px;

--fs-nav-primary: 14px;
--fs-nav-main: 16px;
--fs-nav-sub: 16px;

--fs-breadcrumb: 14px;

--fs-topbar-name: 16px;
--fs-topbar-role: 14px;

--fs-stat-value: 30px;

--------------------------------------------------
TABLET LARGE
--------------------------------------------------

--fs-h1: 36px;
--fs-h2: 26px;
--fs-h3: 20px;

--fs-body-lg: 18px;
--fs-body-md: 18px;
--fs-body-sm: 16px;

--fs-label-md: 16px;
--fs-label-sm: 14px;

--fs-button: 16px;
--fs-input: 18px;

--fs-table-header: 16px;
--fs-table-body: 16px;

--fs-caption: 14px;
--fs-badge: 14px;
--fs-tooltip: 14px;

--fs-nav-primary: 14px;
--fs-nav-main: 16px;
--fs-nav-sub: 16px;

--fs-breadcrumb: 14px;

--fs-topbar-name: 16px;
--fs-topbar-role: 14px;

--fs-stat-value: 28px;

--------------------------------------------------
MOBILE LARGE
--------------------------------------------------

--fs-h1: 32px;
--fs-h2: 24px;
--fs-h3: 20px;

--fs-body-lg: 18px;
--fs-body-md: 18px;
--fs-body-sm: 16px;

--fs-label-md: 16px;
--fs-label-sm: 14px;

--fs-button: 16px;
--fs-input: 18px;

--fs-table-header: 16px;
--fs-table-body: 16px;

--fs-caption: 14px;
--fs-badge: 14px;
--fs-tooltip: 14px;

--fs-nav-primary: 14px;
--fs-nav-main: 16px;
--fs-nav-sub: 16px;

--fs-breadcrumb: 14px;

--fs-topbar-name: 16px;
--fs-topbar-role: 14px;

--fs-stat-value: 28px;

==================================================
11. INPUT SIZE RULE
==================================================

Editable form controls are special.

Never allow:

--fs-input

to go below:

16px

in ANY device range or Compact mode.

This is intentional.

Do not set mobile inputs to:

14px
12px

Keeping actual form controls at 16px avoids unwanted mobile browser zoom and protects form usability.

Large mode may use:

18px

==================================================
12. EVEN NUMBER RULE — MANDATORY
==================================================

Every font-size value created or changed in this token phase must be even.

Allowed examples:

10px
12px
14px
16px
18px
20px
22px
24px
26px
28px
30px
32px
34px
36px
40px
44px

Not allowed:

11px
13px
15px
17px
19px
21px
23px
25px
27px
29px
31px

Before finishing, search the central typography token definitions and verify that no odd-number font-size remains in the canonical token system.

Do NOT change odd hard-coded component font sizes in this phase.

Example:

If `roles.css` contains:

font-size: 11px;

leave it untouched for now.

This phase is TOKEN ONLY.

==================================================
13. KEEP LINE HEIGHTS SAFE
==================================================

Do not arbitrarily redesign line-height values.

Inspect current semantic line-height tokens.

Preserve existing line-height behavior unless a token-level adjustment is necessary to prevent clipping in Compact/Large modes.

Do not introduce fixed pixel heights that depend on text size.

Do not create typography clipping.

==================================================
14. SPACING / COMPONENT DENSITY
==================================================

Do not redesign component spacing in this phase.

If Compact / Standard / Large currently control related spacing tokens such as:

- card padding
- table row height
- input padding
- modal padding
- drawer padding

preserve those existing mechanisms.

Do not change their visual values unless absolutely required to prevent a regression caused by the typography-token change.

This task is focused on FONT SIZE TOKENS.

==================================================
15. DO NOT MIGRATE HARD-CODED FONT SIZES
==================================================

This is a strict scope boundary.

Do NOT edit declarations such as:

font-size: 11px;
font-size: 13px;
font-size: 14px;
font-size: 22px;
font-size: 28px;

outside the central token definitions.

Do NOT replace them with:

var(--fs-...)

yet.

Do NOT clean up:

- `special-registration.css`
- `roles.css`
- `dropdowns.css`
- `forms.css`
- `cards.css`
- MUI local font sizes
- inline React fontSize
- arbitrary Tailwind text sizes

unless a line is itself part of the central token system.

Hard-coded font migration will happen in a later phase.

==================================================
16. DO NOT CHANGE COMPONENT DESIGN
==================================================

Do not change:

- Dashboard layout
- Dashboard cards
- Combine Dashboard
- PSR Dashboard
- Double Entry Dashboard
- tables
- forms
- drawers
- modals
- navigation
- topbar
- filters
- Special Registration
- Role Management
- User Management
- Permission UI

The only visible changes allowed are those that naturally result from existing components already consuming the central typography tokens.

Do not patch individual pages to compensate.

==================================================
17. RESPONSIVE VALIDATION
==================================================

Validate the token system at:

LARGE DESKTOP:
- 1920 × 1080
- 1536 × 864

LAPTOP / SMALL LAPTOP:
- 1440 × 900
- 1366 × 768
- 1333 × 786
- 1280 × 800
- 1280 × 720

TABLET:
- 1024 × 768
- 820 × 1180
- 768 × 1024

MOBILE:
- 480 × 900
- 430 × 932
- 390 × 844
- 375 × 812
- 360 × 800
- 320 × 568

Test:

- Standard
- Compact
- Large

At minimum, explicitly test `1333 × 786` because small-laptop typography is one of the reasons for adding the fourth device range.

==================================================
18. EN / BN
==================================================

Test typography-token behavior in:

- English
- Bangla

Do not create separate Bangla font sizes.

EN and BN must consume the same semantic token system.

Check that larger or more vertically dense Bangla glyphs do not clip at:

- headings
- buttons
- navigation
- tables
- labels
- topbar

Do not change translations.

==================================================
19. LIGHT / DARK MODE
==================================================

Typography sizes must be independent of theme.

Verify:

- light mode
- dark mode

Do not place font-size values inside color/theme-specific selectors unless that architecture already requires it.

Changing theme must not change typography scale.

==================================================
20. APPEARANCE / FONT SIZE SETTING
==================================================

The existing Appearance setting must continue to work:

Compact
Standard
Large

Expected behavior:

Standard selected
→ Standard values for current device range

Compact selected
→ Compact values for current device range

Large selected
→ Large values for current device range

Example at 1333 × 786:

Standard:
Laptop Standard tokens

Compact:
Laptop Compact tokens

Large:
Laptop Large tokens

Changing device width must not reset the selected font scale.

Changing font scale must not change theme.

Changing theme must not reset font scale.

==================================================
21. SPECIFICITY REGRESSION PROTECTION
==================================================

Fix the current token-level issue where generic tablet/mobile `:root` values may fail to override more specific:

:root[data-font-scale="compact"]

or:

:root[data-font-scale="large"]

desktop definitions.

Every responsive range must explicitly define each font-scale mode.

Do not depend on accidental CSS cascade behavior.

Verify in browser computed styles.

==================================================
22. UNDEFINED TYPOGRAPHY TOKEN PROTECTION
==================================================

Audit central typography variables for undefined aliases.

If the central typography system references variables such as:

--font-size-sm
--font-size-xs

but those variables do not exist:

do NOT invent another parallel family.

Map any token-level aliases to an existing canonical `--fs-*` semantic token where safe.

Do not edit individual component declarations using those undefined variables in this phase unless required to prevent token-system failure.

==================================================
23. NO GLOBAL SEARCH-AND-REPLACE
==================================================

Do not run a blind replacement of:

13px → 12px
15px → 14px

through the entire project.

The even-number rule applies in THIS PHASE only to central font tokens.

Hard-coded component values must remain untouched.

==================================================
24. EXPECTED SOURCE OF TRUTH
==================================================

After this phase, architecture should be:

`src/styles/typography.css`
        ↓
canonical `--fs-*` values
        ↓
4 responsive device ranges
        ↓
Compact / Standard / Large
        ↓
legacy `--typ-*` compatibility aliases
        ↓
existing token-consuming components

Not:

three independent font token systems
+
component-specific token definitions
+
conflicting responsive overrides

==================================================
25. REGRESSION CHECKS
==================================================

Verify:

TOKEN SYSTEM
- one canonical numeric token family
- `--fs-*` is source of truth
- legacy `--typ-*` aliases still work
- no token consumer becomes undefined
- no odd-number values in canonical font-size tokens
- no breakpoint specificity conflict

DEVICE RANGES
- Large Desktop works
- Laptop works
- Tablet works
- Mobile works

SMALL LAPTOP
- 1333 × 786 correctly receives Laptop tokens
- it does NOT receive Large Desktop tokens
- it does NOT receive Tablet tokens

FONT SCALE
- Compact works at all 4 device ranges
- Standard works at all 4 device ranges
- Large works at all 4 device ranges

INPUT
- never below 16px
- Large may use 18px

LANGUAGE
- EN works
- BN works

THEME
- light works
- dark works

REGRESSION
- no routes changed
- no navigation changed
- no APIs changed
- no Redux behavior changed
- no business logic changed
- no hard-coded component typography changed
- no unrelated CSS changed

==================================================
26. GOLDEN RULES
==================================================

- This is an existing product, not a redesign.
- Inspect before editing.
- Protect solved work.
- Respect exact scope.
- This phase is FONT TOKENS ONLY.
- Do not touch hard-coded component font sizes.
- `--fs-*` becomes the canonical runtime typography system.
- Do not maintain two independent typography scales.
- Preserve legacy aliases safely.
- Use exactly 4 typography device ranges.
- Small laptop is a first-class device category.
- `1333 × 786` is a mandatory acceptance size.
- Preserve Compact / Standard / Large.
- Every central font-size value must be EVEN.
- Never introduce 11px, 13px, 15px, 17px, 19px, etc. into central tokens.
- Inputs must never be below 16px.
- Do not change global layout breakpoints.
- Do not add page-specific typography breakpoints.
- Do not migrate hard-coded CSS yet.
- Do not redesign components.
- Do not change APIs.
- Do not change navigation.
- Do not change routes.
- Do not change permissions.
- Do not change business logic.
- Preserve EN/BN.
- Preserve light/dark mode.
- Fix token cascade/specificity at the root rather than patching pages.
- Test computed font sizes, not only visual appearance.

FINAL EXPECTED RESULT:

The project should have one predictable central font token system where:

Large Desktop
Laptop / Small Laptop
Tablet
Mobile

each has explicit:

Compact
Standard
Large

font-size definitions.

All central font sizes use even numbers.

Existing components that already consume typography tokens automatically inherit the correct values.

Hard-coded font sizes elsewhere in the application remain untouched for the next migration phase.
```
