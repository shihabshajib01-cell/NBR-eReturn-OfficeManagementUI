Deeply inspect the uploaded project and make only the two changes described below.

Do not modify the Special Registration form fields, validation, uploads, buttons, APIs, routes, submission flow, modal framework, language switch, header design, manual text, or business logic.

Relevant files:

* `src/app/components/special-registration/SpecialRegistrationManualContent.tsx`
* `src/app/pages/public/SpecialRegistrationInstructionsPage.tsx`
* `src/styles/special-registration.css`
* Relevant Special Registration manual tests

The current implementation uses separate open/closed state for the two manual sections and gives the instructions page an additional `.sr-manual-page__body` wrapper with its own width and padding. Remove these differences.

## 1. Keep both manual sections expanded at all times

Both manual sections must always remain fully visible:

* `eReturn Special Registration নির্দেশনা-০১`
* `eReturn Special Registration নির্দেশনা-০২`

Apply this change in both locations:

* Standalone User Manual page
* User Manual modal

Update `SpecialRegistrationManualContent.tsx`:

* Remove `useState`
* Remove `s1Open` and `s2Open`
* Remove all collapse and expand handlers
* Remove `ChevronDown`
* Remove clickable section-header buttons
* Remove `aria-expanded`
* Remove `aria-controls`
* Remove conditional rendering around the section bodies
* Render both complete section bodies all the time

The section headings must no longer look interactive.

Use a static semantic structure:

```tsx
<section className="sr-form-section sr-manual-section">
  <div className="sr-manual-section__header">
    <h2 className="sr-manual-section__title">
      Section title
    </h2>
  </div>

  <div className="sr-form-section__body sr-manual-section__body">
    Complete section content
  </div>
</section>
```

The static heading area must visually match the header area of the existing Special Registration form sections:

* Same height
* Same horizontal padding
* Same title alignment
* Same divider
* Same typography family
* Same card border and radius
* No chevron
* No hover state
* No pointer cursor
* No focus state because it is no longer interactive

Do not create an accordion, disclosure interaction, or automatic collapsing behaviour at any screen size.

## 2. Make the manual page container identical to the form page

The Special Registration form currently uses this exact structure:

```tsx
<main className="sr-public__main">
  <div className="sr-public__card">
    ...
  </div>
</main>
```

Use the same structure on `SpecialRegistrationInstructionsPage.tsx`:

```tsx
<main className="sr-public__main">
  <div className="sr-public__card">
    <h1 className="sr-only">
      {t("manual.instructionsTitle")}
    </h1>

    <SpecialRegistrationManualContent
      onApply={handleApply}
      variant="page"
    />
  </div>
</main>
```

Remove the `.sr-manual-page__body` wrapper completely.

Do not create another manual-specific outer width or page-padding wrapper.

The form page and manual page must both inherit their layout from:

* `.sr-public__main`
* `.sr-public__card`

This must make the following properties identical:

* Maximum content width
* Left alignment
* Right alignment
* Desktop horizontal padding
* Desktop top and bottom spacing
* Mobile horizontal padding
* Mobile top spacing
* Mobile bottom spacing
* Card-to-card gap
* Responsive breakpoints

The manual page must use the same existing `1000px` maximum width as the Special Registration form page.

Delete the `.sr-manual-page__body` CSS rules, including its mobile media-query rules, after the wrapper is removed.

Do not duplicate the `.sr-public__card` CSS into a new manual class.

## Manual section spacing

Use the same outer section spacing as the form page:

```css
.sr-manual {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
```

This must match the gap used by `.sr-public__card` and `.sr-form`.

Do not keep the current separate `16px` manual-page gap.

The static section header should match the form-section header spacing:

Desktop:

* Parent card horizontal padding remains `24px`
* Header uses approximately `14px 0`
* Minimum height remains approximately `48px`
* Body uses the same divider and horizontal alignment as the form-section body

Mobile:

* Section card uses the same mobile radius and border as the form sections
* Header uses `14px 18px`
* Body uses `12px 18px 18px`
* Do not apply another nested horizontal padding
* Do not create double padding

The first manual card must begin at exactly the same horizontal and vertical position where the form page intro card begins.

## Preserve the current registration buttons

Keep the current outlined, icon-based `Continue to Registration` buttons unchanged:

* Keep the `Globe` icon
* Keep the existing outlined public-action style
* Keep full-width behaviour
* Keep the current English and Bangla labels
* Keep navigation to `/special-registration`
* Keep the button inside each manual section

Do not redesign the User Manual header button in this task. It is already using the requested outlined icon-based pattern.

## Modal behaviour

The modal must also display both sections fully expanded at all times.

Preserve:

* Existing `AppModal`
* Existing modal size
* Existing modal header
* Existing BookOpen icon
* Existing Close button
* Existing scrollable body
* Existing fixed footer
* Escape and backdrop closing
* Scroll locking
* Focus restoration
* Form-state preservation

Do not add collapse controls inside the modal.

The modal can keep its existing modal-specific spacing, but both complete sections must remain visible in the scrollable body.

## Preserve all manual content

Do not:

* Rewrite the manual
* Correct spelling
* Correct punctuation
* Change numbering
* Translate the Bengali content
* Merge the two sections
* Remove repeated content
* Change the malformed process line
* Remove any list item
* Change the CTA behaviour

Only remove the collapse behaviour and align the page container.

## Testing

Update the focused tests to confirm:

1. Both manual sections are visible when the page first loads.
2. Both manual sections remain visible at all times.
3. No chevron icons are rendered in the manual section headers.
4. No collapse or expand buttons are rendered.
5. No manual section uses `aria-expanded`.
6. Both complete sections are visible inside the modal.
7. The manual page uses the same `.sr-public__main > .sr-public__card` structure as the form page.
8. `.sr-manual-page__body` is no longer used.
9. The form and manual page both use the existing `1000px` maximum width.
10. Desktop and mobile page padding is identical between the form and manual pages.
11. Both Continue to Registration buttons still work.
12. Existing manual text remains unchanged.
13. Existing Special Registration tests still pass.
14. No horizontal overflow appears on desktop, tablet, or mobile.

Run the full build and test suite. Fix only errors caused by this task.

## Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not remove working features.
* Do not modify the Special Registration form.
* Do not change APIs, routes, validation, uploads, or submission logic.
* Do not change the supplied manual text.
* Keep both manual sections permanently expanded.
* Use the exact same outer container, width, padding, and responsive behaviour as the form page.
* Reuse existing components and styles.
* Test desktop, tablet, and mobile.
* Keep EN/BN parity.
