Deeply inspect the uploaded project and restore the collapsible behaviour for the two Special Registration manual sections.

The previous change incorrectly removed the collapse controls entirely. The correct behaviour is:

* Both sections are expanded when the page first opens.
* Both sections remain independently collapsible.
* Users can collapse or reopen either section.
* Expanding one section must not collapse the other.
* The same behaviour must work on the standalone manual page and inside the User Manual modal.

Do not change the current page width, padding, typography, manual content, action buttons, form, APIs, routes, validation, uploads, modal framework, language switching, or business logic.

## Relevant files

Update only:

* `src/app/components/special-registration/SpecialRegistrationManualContent.tsx`
* `src/styles/special-registration.css`
* Relevant Special Registration manual tests

Do not modify:

* `SpecialRegistrationInstructionsPage.tsx`
* `SpecialRegistrationPublicPage.tsx`
* `SpecialRegistrationForm.tsx`
* Global button styles
* Global modal styles
* Routes or API files

The manual page and form page already use the same `.sr-public__main > .sr-public__card` structure. Preserve that solved width and padding alignment exactly.

## Restore the collapsible section behaviour

In `SpecialRegistrationManualContent.tsx`, restore local state for both manual sections.

Use independent state values:

```tsx
const [sectionOneOpen, setSectionOneOpen] = useState(true);
const [sectionTwoOpen, setSectionTwoOpen] = useState(true);
```

Both values must initially be `true`.

This means both sections are fully expanded when:

* The standalone instructions page loads
* The User Manual modal opens

Do not use a single accordion value. Do not make opening one section close the other.

## Section structure

Restore the existing collapsible form-section pattern used in `SpecialRegistrationForm.tsx`.

Each section must use a full-width button header:

```tsx
<section className="sr-form-section sr-manual-section">
  <button
    type="button"
    className="sr-form-section__toggle sr-manual-section__toggle"
    aria-expanded={sectionOneOpen}
    aria-controls="sr-manual-section-one"
    onClick={() => setSectionOneOpen(open => !open)}
  >
    <span
      id="sr-manual-section-one-heading"
      className="sr-manual-section__title"
    >
      eReturn Special Registration নির্দেশনা-০১
    </span>

    <ChevronDown
      size={18}
      className={`sr-form-section__chevron${
        sectionOneOpen ? " sr-form-section__chevron--open" : ""
      }`}
      aria-hidden="true"
    />
  </button>

  {sectionOneOpen && (
    <div
      id="sr-manual-section-one"
      className="sr-form-section__body sr-manual-section__body"
      role="region"
      aria-labelledby="sr-manual-section-one-heading"
    >
      Complete existing section content
    </div>
  )}
</section>
```

Apply the same structure to section two with separate IDs and state.

Use stable unique IDs. `useId()` may be used so multiple instances can safely exist, including the modal and standalone page.

## Required default state

When the component first renders:

* `eReturn Special Registration নির্দেশনা-০১` must be expanded.
* `eReturn Special Registration নির্দেশনা-০২` must be expanded.
* Both complete instruction bodies must be visible.
* Both `Continue to Registration` buttons must be visible.

Do not default the second section to collapsed.

## Interaction behaviour

Each section must work independently:

* Clicking section one’s header collapses only section one.
* Clicking section two’s header collapses only section two.
* Reopening a section restores its complete content.
* Opening one section must not change the state of the other.
* The whole section header must be clickable.
* The heading text and chevron must be inside the same button.

Do not collapse sections automatically:

* When the user scrolls
* When the language changes
* When another section opens
* At mobile breakpoints
* When the modal body scrolls

## Chevron behaviour

Import `ChevronDown` from `lucide-react`.

Use the existing classes:

* `.sr-form-section__chevron`
* `.sr-form-section__chevron--open`

When expanded:

* The chevron must use the existing rotated open state.

When collapsed:

* The chevron must return to its default direction.

Do not create a new icon or custom SVG.

## Styling

Remove the current static manual header treatment that makes the heading non-interactive.

The following current static approach must no longer control the section header:

```css
.sr-manual-section__header
```

The section header must instead reuse:

* `.sr-form-section__toggle`
* `.sr-form-section__chevron`
* `.sr-form-section__chevron--open`

Add only minimal manual-specific overrides where needed.

Recommended manual-specific styling:

```css
.sr-manual-section__toggle {
  color: inherit;
}

.sr-manual-section__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.5;
}
```

Preserve:

* Existing section border
* Existing section radius
* Existing card shadow
* Existing 48px minimum header height
* Existing divider above the expanded body
* Existing keyboard focus treatment
* Existing desktop and mobile padding
* Existing animation timing
* Existing text width and line height

Do not add a separate divider to the button header. The existing `.sr-form-section__body` border should provide the divider when the body is open.

When collapsed:

* Only the section header should remain visible.
* The card must not contain unnecessary empty space.
* The bottom corners must remain correct.
* The hidden body must not remain keyboard-focusable.

## Preserve current width and padding

Do not change any of these solved layout rules:

```css
.sr-public__main
.sr-public__card
.sr-manual
.sr-form-section
```

The standalone manual page and Special Registration form page must continue to have identical:

* Maximum width
* Left and right alignment
* Desktop page padding
* Mobile page padding
* Top spacing
* Card spacing
* Responsive behaviour

Do not reintroduce `.sr-manual-page__body` or another manual-specific width wrapper.

## Preserve the action buttons

Keep the current `Continue to Registration` buttons exactly as they are:

* Keep the `Globe` icon
* Keep the outlined style
* Keep the full-width layout
* Keep the existing English and Bangla labels
* Keep the current hover and focus states
* Keep navigation to `/special-registration`

The button must be part of the collapsible body. It should disappear when its section is collapsed and return when reopened.

Do not move the button into the section header.

## Modal behaviour

The same `SpecialRegistrationManualContent` component is used inside the modal.

Inside the modal:

* Both sections must initially be expanded.
* Both sections must remain independently collapsible.
* Collapsing sections must not close the modal.
* Clicking the section header must not trigger the modal backdrop.
* Keep the modal body scrollable.
* Keep the header and footer fixed.
* Preserve the existing Close button.
* Preserve Escape and backdrop closing.
* Preserve form values and uploaded files.
* Return focus to the User Manual trigger after the modal closes.

Do not add another state system in `SpecialRegistrationManualModal.tsx`.

## Accessibility

Each section header must:

* Be a native `button`
* Use `type="button"`
* Have `aria-expanded`
* Have `aria-controls`
* Control a matching content-panel ID
* Have a visible keyboard focus state
* Remain at least 48px tall

Each expanded body must:

* Use `role="region"`
* Use `aria-labelledby`
* Reference the matching section-title ID

Do not place a button inside another button.

Do not use clickable `div` elements.

## Preserve the manual text

Do not:

* Rewrite any sentence
* Correct spelling
* Correct punctuation
* Change numbering
* Translate the Bengali manual
* Merge the two sections
* Remove duplicate information
* Change the process line
* Remove any list item

Only restore the collapsible interaction.

## Testing

Update the focused tests to confirm:

1. Both sections are expanded when the standalone page first loads.
2. Both complete section bodies are initially visible.
3. Both Continue to Registration buttons are initially visible.
4. Both section headers have `aria-expanded="true"` initially.
5. Clicking section one collapses only section one.
6. Section two remains expanded when section one is collapsed.
7. Clicking section two collapses only section two.
8. Each section can be reopened independently.
9. Chevron rotation matches each section’s state.
10. The same behaviour works inside the modal.
11. No accordion-style automatic closing occurs.
12. The existing manual page and form page widths remain identical.
13. The existing manual text remains unchanged.
14. Both Continue to Registration buttons still work.
15. Existing Special Registration tests still pass.
16. No horizontal overflow appears on desktop, tablet, or mobile.

Run the full build and test suite. Fix only issues caused by this change.

## Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not remove working features.
* Keep both manual sections expanded by default.
* Keep both sections independently collapsible.
* Do not make them mutually exclusive.
* Do not modify the Special Registration form.
* Do not change the current width or padding.
* Do not change APIs, routes, uploads, validation, or submission logic.
* Do not change the supplied manual text.
* Reuse the existing form-section collapse pattern.
* Test desktop, tablet, mobile, and the modal.
* Keep EN/BN parity.
