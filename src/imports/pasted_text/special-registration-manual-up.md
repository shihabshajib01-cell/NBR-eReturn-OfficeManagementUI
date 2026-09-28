Audit the current Special Registration user manual implementation in the uploaded project and fix only the user manual page, its buttons, the form-page User Manual trigger, and the user manual modal.

Do not redesign or modify the Special Registration form itself. Do not change its fields, validation, uploaded files, country selector, language switching, API calls, routes, submission flow, success state, or business logic.

## Current problems found

The present implementation has these issues:

1. `SpecialRegistrationInstructionsPage.tsx` presents the manual as a long block of raw text on the page background. It has weak grouping, excessive line length, poor scanning, and too much empty space.
2. The page title is shown in both the sticky header and the page body, creating unnecessary repetition.
3. Both `Apply` buttons use the default `PrimaryButton` medium size. The project’s `.app-btn--md` style applies `width: 100%`, which creates oversized full-width buttons that do not fit this use case.
4. The label `Apply` is vague. The user is not submitting an application from the manual page; the button takes them to the registration form.
5. The form-page `User Manual` button uses the custom `.sr-manual-trigger-btn` style instead of the existing unified `.app-btn` button system.
6. The modal directly reuses the desktop page layout without a modal-specific content density, making the modal feel crowded and visually unfinished.
7. The modal footer contains one oversized full-width tonal button. It does not match other modal footer actions in the project.
8. Unordered-list bullets are rendering as corrupted characters such as `â€¢`. This comes from the custom CSS-generated bullet character.
9. The manual lacks a clear visual relationship with the existing Special Registration form cards.
10. Desktop and mobile need separate spacing and action-button behaviour.

## Exact scope

Update only these related files:

* `src/app/components/special-registration/SpecialRegistrationManualContent.tsx`
* `src/app/components/special-registration/SpecialRegistrationManualModal.tsx`
* `src/app/pages/public/SpecialRegistrationInstructionsPage.tsx`
* `src/app/pages/public/SpecialRegistrationPublicPage.tsx`
* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`
* `src/styles/special-registration.css`
* Relevant Special Registration manual tests

Do not modify the global button system in `src/styles/buttons.css`.

Do not modify the global modal system in `AppModal.tsx` or `src/styles/modals.css` unless an additive, backward-compatible prop is absolutely required. Solve the visual problems locally wherever possible.

## User manual page redesign

Keep the existing public header, logo, language switch, sticky behaviour, background, typography system, and responsive structure.

Remove the visible duplicate page heading from the body. Keep one visually hidden `h1` for accessibility because the sticky header already displays the page name.

The manual content area should:

* Use a maximum width of approximately `880px`
* Remain centred
* Use `24px` desktop side padding
* Use `12px` mobile side padding
* Have `16px` spacing between the two manual sections
* Avoid horizontal scrolling
* Use the existing background and surface tokens

Present each instruction version as a separate card matching the existing Special Registration form-section design:

* `var(--color-surface)` background
* `1px solid var(--color-border)`
* `var(--radius-lg)` or the same `12px` radius used by `.sr-form-section`
* Existing subtle card shadow
* `24px–28px` desktop padding
* `16px` mobile padding
* No gradients
* No strong decorative borders
* No new colour system

Do not merge the two instruction versions. Do not remove repeated information.

## Manual typography

Use the existing typography and font-scale tokens.

Recommended hierarchy:

* Section heading: `18px`, weight `700`, line height around `1.5`
* Subsection heading: `15px–16px`, weight `600` or `700`
* Paragraphs and lists: `15px`, line height around `1.75`
* Mobile body copy: `14px`, line height around `1.7`

Keep readable spacing:

* `12px–16px` after paragraphs
* `16px–20px` before subsection headings
* `6px–8px` between list items

Limit paragraph and list line length to approximately `75–80ch` where possible.

Do not rewrite, summarize, correct, translate, merge, or remove the existing manual body content.

## Fix the list rendering

Remove the custom pseudo-element bullet implementation that uses:

```css
content: "•";
```

This is currently producing corrupted `â€¢` characters.

Use native semantic list markers:

* Ordered lists: `list-style-type: decimal`
* Unordered lists: `list-style-type: disc`
* Use normal left padding
* Style `::marker` only for colour and font weight
* Do not generate list symbols through CSS text content

Keep all lists as semantic `ol`, `ul`, and `li` elements.

The special process line must remain exact, but style it as a restrained information strip:

* Subtle background using an existing background token
* `1px` border
* `8px` radius
* Optional `3px` primary-colour left border
* Comfortable padding
* Normal wrapping
* No clipping or horizontal overflow

## Replace the generic Apply buttons

Change the manual CTA label from `Apply` to a clear navigation label.

English:

`Continue to Registration`

Bangla:

`নিবন্ধন ফর্মে যান`

Update only the surrounding UI translation. Do not treat this label as part of the supplied manual document.

Use the existing `PrimaryButton` component with:

* `size="lg"`
* `ArrowRight` icon
* Auto width on desktop
* Minimum 44px height
* Right alignment inside the section action row
* No full-width desktop button
* Full width only on mobile widths below `640px`

Each section must retain its own CTA and continue navigating to:

`/special-registration`

Do not modify the route.

## Fix the form-page User Manual button

Remove the custom visual button implementation from `.sr-manual-trigger-btn`.

Use the existing unified button classes:

```text
app-btn
app-btn--ghost
app-btn--lg
```

Keep only a small manual-specific class for responsive layout if necessary. Do not recreate border, hover, colour, radius, typography, or focus styling that already exists in `buttons.css`.

The button must include:

* Existing `BookOpen` Lucide icon
* English label: `User Manual`
* Bangla label: `ব্যবহার নির্দেশিকা`
* 44px minimum height
* Existing ghost-button border and hover states
* Existing focus-visible state

Desktop and tablet:

* Show icon and text
* Keep the button beside the language switch
* Do not allow the header to wrap or overflow

Small mobile widths:

* Show the icon-only version when space is limited
* Keep a `44px × 44px` tap target
* Preserve `aria-label` and `title`
* Keep the language switch unchanged

Do not change any other header element.

## User manual modal redesign

Continue using the existing `AppModal`.

Change the manual modal to:

* `size="lg"` instead of an unnecessarily wide `xl`
* Use the existing `BookOpen` icon in the modal header
* Use the localized modal title:

  * English: `Special Registration Instructions`
  * Bangla: `বিশেষ নিবন্ধন নির্দেশিকা`
* Keep the existing close icon
* Keep the body vertically scrollable
* Keep the header and footer fixed
* Keep the backdrop, Escape closing, scroll locking, focus trapping, and focus restoration behaviour

Add a manual-specific wrapper such as:

```text
sr-manual-modal
sr-manual-modal__content
sr-manual-modal__footer-actions
```

Do not create a second modal framework.

### Modal content treatment

Update `SpecialRegistrationManualContent` to accept a presentation variant:

```ts
variant?: "page" | "modal"
```

Use the same text and semantic structure in both locations.

For `variant="modal"`:

* Reduce card padding slightly
* Use `12px` spacing between sections
* Avoid excessive nested shadows
* Keep section borders subtle
* Use slightly tighter paragraph spacing
* Keep all content readable
* Do not shrink the Bengali text excessively
* Do not add another visible page-level title inside the body
* Keep both section CTA buttons compact and right-aligned on desktop
* Make the CTA buttons full width only on mobile

The modal body should not appear as unformatted text directly against the modal surface.

## Modal footer button

The footer is for closing the informational modal. Use one compact secondary action aligned to the right.

Use:

```tsx
<SecondaryButton size="lg" onClick={onClose}>
  {t("manual.close")}
</SecondaryButton>
```

English:

`Close`

Bangla:

`বন্ধ করুন`

Wrap the button in a manual-specific footer action container so it stays auto-width on desktop and does not inherit the current full-width appearance.

Desktop:

* Auto-width button
* Right aligned
* Normal modal-footer spacing

Mobile:

* It may use the full available width
* Minimum 44px height
* Keep the existing bottom-sheet footer safe-area spacing

Do not style the footer button with a custom colour or unrelated background.

## Preserve form state

Opening and closing the manual modal must preserve:

* Entered form values
* Uploaded files
* Selected passport type
* Selected country
* Phone number
* Expanded and collapsed sections
* Validation messages
* Current page scroll position

Clicking either manual CTA inside the modal must close the modal and return the user to the existing form without resetting anything.

After closing the modal, return keyboard focus to the User Manual button.

## Responsive behaviour

Desktop:

* Centred reading column
* Two separate section cards
* Compact right-aligned CTAs
* Modal width around `800px`
* Compact footer action

Tablet:

* Preserve card layout
* Reduce horizontal padding
* Keep text comfortable to read
* Prevent header controls from overlapping

Mobile:

* Page padding `12px`
* Card padding `16px`
* Full-width section CTA buttons
* Icon-only User Manual trigger where required
* Existing modal bottom-sheet behaviour
* No horizontal overflow
* No clipped process line
* Minimum 44px tap targets

## Testing

Add or update focused tests confirming:

1. The instruction page contains both manual sections.
2. The visible duplicate body page title has been removed.
3. The CTA label is `Continue to Registration` in English.
4. The Bangla CTA label is `নিবন্ধন ফর্মে যান`.
5. Both CTA buttons still open `/special-registration`.
6. The CTA buttons are not full width on desktop.
7. The User Manual trigger uses the unified app button classes.
8. The modal uses the existing `AppModal`.
9. The modal header includes the manual icon and localized title.
10. The modal footer button is compact on desktop.
11. No corrupted `â€¢` text appears.
12. Native unordered-list markers are used.
13. Closing the modal preserves form data and uploaded files.
14. Desktop, tablet, and mobile layouts have no horizontal overflow.
15. Existing Special Registration tests still pass.

Run the full build and test suite after the changes. Fix only issues caused by this task.

## Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not remove working features.
* Do not modify the Special Registration form.
* Do not change APIs, validation, routes, submission logic, or stored data.
* Do not rewrite or remove the supplied manual body text.
* Do not change the global button system to solve a local manual issue.
* Do not create a new modal system.
* Reuse existing components, tokens, typography, colours, spacing, and responsive patterns.
* Test desktop, tablet, and mobile.
* Keep EN/BN interface parity.
