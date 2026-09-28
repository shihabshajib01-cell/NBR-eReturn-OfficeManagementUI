````text
Deeply inspect the uploaded project and restore the collapsible functionality for the two Special Registration manual sections.

Work only on the manual-section interaction. Do not redesign the page or change anything that is already working.

## Current issue

The collapsible functionality was removed from:

`src/app/components/special-registration/SpecialRegistrationManualContent.tsx`

Both manual sections are now permanently expanded with static `.sr-manual-section__header` elements.

Restore the previous collapsible behaviour for:

- `eReturn Special Registration নির্দেশনা-০১`
- `eReturn Special Registration নির্দেশনা-০২`

The functionality must work on both:

- The standalone Special Registration Instructions page
- The User Manual modal

Because both locations already use `SpecialRegistrationManualContent`, implement the behaviour once inside that shared component.

## Required default state

When the manual opens:

- নির্দেশনা-০১ must be expanded
- নির্দেশনা-০২ must be collapsed

The two sections must work independently:

- Opening one must not automatically close the other
- Both can be open at the same time
- Both can be closed at the same time

Do not create an accordion that forces only one section to remain open.

## Restore the existing form-section pattern

Reuse the exact collapsible interaction already used inside:

`src/app/components/special-registration/SpecialRegistrationForm.tsx`

Do not modify or export the working `CollapsibleFormSection` from that file.

Update `SpecialRegistrationManualContent.tsx` to:

- Import `useState` from React
- Import `ChevronDown` from `lucide-react`
- Add independent state for both sections
- Replace each static header `<div>` with a semantic `<button>`
- Conditionally render each section body
- Rotate the chevron when the section is expanded
- Keep the registration CTA inside the expanded body

Use this structure:

```tsx
const [sectionOneOpen, setSectionOneOpen] = useState(true);
const [sectionTwoOpen, setSectionTwoOpen] = useState(false);
````

Each section should follow this pattern:

```tsx
<section className="sr-form-section sr-manual-section">
  <button
    type="button"
    className="sr-form-section__toggle sr-manual-section__toggle"
    onClick={() => setSectionOneOpen(previous => !previous)}
    aria-expanded={sectionOneOpen}
    aria-controls="sr-manual-section-one-body"
  >
    <span
      id="sr-manual-section-one-heading"
      className="sr-manual-section__title"
    >
      eReturn Special Registration নির্দেশনা-০১
    </span>

    <ChevronDown
      size={16}
      aria-hidden="true"
      className={`sr-form-section__chevron${
        sectionOneOpen ? " sr-form-section__chevron--open" : ""
      }`}
    />
  </button>

  {sectionOneOpen && (
    <div
      id="sr-manual-section-one-body"
      className="sr-form-section__body sr-manual-section__body"
      role="region"
      aria-labelledby="sr-manual-section-one-heading"
    >
      Existing section content
    </div>
  )}
</section>
```

Use unique IDs for the second section.

## Interaction requirements

The complete section header must be clickable, including:

* Section title
* Empty header space
* Chevron icon

The header must have:

* Pointer cursor
* Minimum 48px height
* Existing keyboard focus style
* `aria-expanded`
* `aria-controls`
* A properly labelled content region

The chevron must:

* Point downward when collapsed
* Rotate using the existing `.sr-form-section__chevron--open` class when expanded
* Use the same size, colour and animation as the form-section chevrons

Do not add a separate Expand or Collapse button.

Do not add new icons, animations, dependencies or component libraries.

## Styling

Remove the current static-header-only styling that makes the headings non-interactive:

* `.sr-manual-section__header`
* Any styles that were introduced only for the permanently expanded version

Reuse these existing classes wherever possible:

* `.sr-form-section`
* `.sr-form-section__toggle`
* `.sr-form-section__chevron`
* `.sr-form-section__chevron--open`
* `.sr-form-section__body`

Keep `.sr-manual-section__title` only for the manual-specific title size and colour.

The manual section titles should remain visually stronger than regular form-section labels, but the interaction, spacing, border, divider and chevron must match the existing form-section pattern.

Desktop:

* Keep the existing `0 24px` section container padding
* Keep the 48px minimum header height
* Keep the current body spacing
* Collapsed sections must show only the compact header

Mobile:

* Use the existing `.sr-form-section__toggle` padding of `14px 18px`
* Use the existing manual body padding of `12px 18px 18px`
* Maintain a minimum 48px tap target
* Prevent title and chevron overlap
* Allow long Bengali headings to wrap safely
* Keep the chevron fixed on the right

## Preserve the corrected page layout

Do not change the current manual-page width or padding.

The manual page and Special Registration form page already use the same structure:

```tsx
<main className="sr-public__main">
  <div className="sr-public__card">
```

Preserve this exactly.

Both pages must continue to have identical:

* `1000px` maximum width
* Desktop horizontal spacing
* Mobile horizontal spacing
* Left and right alignment
* Responsive breakpoints
* Card gap

Do not restore `.sr-manual-page__body`.

Do not add another width or padding wrapper.

## Preserve all buttons

Do not change the current buttons.

Keep:

* The outlined `Continue to Registration` buttons
* The `Globe` icons
* Full-width registration-button layout
* Current hover, focus, border and text styles
* The outlined `User Manual` header button
* The `BookOpen` icon
* Current English and Bangla button labels
* Navigation to `/special-registration`

The Continue to Registration button must remain inside its related section body and disappear when that section is collapsed.

## Preserve the modal

Do not change the modal design or modal framework.

Keep:

* Existing `AppModal`
* Existing size
* Existing BookOpen icon
* Existing localized title
* Existing scrollable body
* Existing fixed footer
* Existing compact Close button
* Escape and backdrop closing
* Scroll locking
* Focus restoration
* Form-state preservation

Only restore the two collapsible manual sections inside the modal.

Each time the modal is newly opened, its shared manual content should start with:

* Section 01 expanded
* Section 02 collapsed

Opening, closing or toggling manual sections must not reset any Special Registration form data.

## Preserve all content

Do not change any manual text.

Do not:

* Rewrite text
* Correct spelling
* Correct punctuation
* Translate content
* Change numbering
* Merge the two instruction versions
* Remove repeated content
* Change the process line
* Remove any paragraph or list item

Only restore the collapsible interaction.

## Testing

Add or update focused tests confirming:

1. Section 01 is expanded initially.
2. Section 02 is collapsed initially.
3. Clicking Section 01 closes and reopens it.
4. Clicking Section 02 opens and closes it.
5. Both sections work independently.
6. Both sections can remain expanded together.
7. Both sections can remain collapsed together.
8. `aria-expanded` reflects the current state.
9. Each toggle has the correct `aria-controls`.
10. The chevron rotates only when its section is open.
11. Collapsed content is not rendered or visible.
12. The Continue to Registration button is hidden when its section is collapsed.
13. The same functionality works inside the User Manual modal.
14. The manual and form page width and padding remain identical.
15. Existing button styles remain unchanged.
16. Existing manual text remains unchanged.
17. No horizontal overflow appears on desktop, tablet or mobile.
18. Existing Special Registration tests continue to pass.

Run the full build and test suite. Fix only issues caused by restoring this functionality.

## Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not remove working features.
* Do not modify the Special Registration form.
* Do not change APIs, routes, validation, uploads or submission logic.
* Do not change the manual text.
* Preserve the current matching page width and padding.
* Preserve the current icon-based button designs.
* Reuse the existing form-section collapse pattern.
* Test the standalone page and modal.
* Test desktop, tablet and mobile.
* Keep EN/BN parity.

```
```
