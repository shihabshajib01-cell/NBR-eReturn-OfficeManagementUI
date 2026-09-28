````text
Deeply inspect the uploaded project before making changes. Fix only the Special Registration user manual sections, the manual page width, the manual action buttons, and the User Manual trigger button.

Do not modify the Special Registration form fields, layout, APIs, validation, uploads, country selector, submission flow, routes, language switching, success state, or business logic.

Current relevant files:

- src/app/components/special-registration/SpecialRegistrationManualContent.tsx
- src/app/components/special-registration/SpecialRegistrationManualModal.tsx
- src/app/pages/public/SpecialRegistrationInstructionsPage.tsx
- src/app/pages/public/SpecialRegistrationPublicPage.tsx
- src/styles/special-registration.css
- Relevant Special Registration tests

## 1. Make both manual segments collapsible

Convert these two manual cards into independent collapsible sections:

- eReturn Special Registration নির্দেশনা-০১
- eReturn Special Registration নির্দেশনা-০২

Reuse the exact interaction and visual pattern already used by the Special Registration form sections in `SpecialRegistrationForm.tsx`.

Each manual section must have:

- A full-width clickable header
- The section title on the left
- A `ChevronDown` icon on the right
- Chevron rotation when expanded
- A divider between the header and expanded content
- `aria-expanded`
- `aria-controls`
- A labelled content region
- A minimum 48px header tap target
- Visible keyboard focus
- The complete existing manual content inside the collapsible body
- The registration CTA inside the expanded body

Default state:

- নির্দেশনা-০১ expanded
- নির্দেশনা-০২ collapsed

The sections must work independently. Opening one section must not automatically close the other.

Use the same collapsible behaviour on:

- The standalone instructions page
- The User Manual modal

Keep the state local to `SpecialRegistrationManualContent`. Do not use Redux, local storage, APIs, or global state.

Do not add collapsible behaviour to every paragraph or subsection. Only the two main instruction segments should be collapsible.

Do not modify or export the existing internal `CollapsibleFormSection` from `SpecialRegistrationForm.tsx`. Reuse its DOM structure, class pattern, spacing, chevron behaviour, and accessibility approach without changing the working form component.

Suggested structure:

```tsx
<section className="sr-form-section sr-manual-section">
  <button
    type="button"
    className="sr-form-section__toggle sr-manual-section__toggle"
    aria-expanded={isOpen}
    aria-controls={panelId}
  >
    <span className="sr-manual-section__title">{title}</span>

    <ChevronDown
      className={`sr-form-section__chevron${
        isOpen ? " sr-form-section__chevron--open" : ""
      }`}
    />
  </button>

  {isOpen && (
    <div
      id={panelId}
      className="sr-form-section__body sr-manual-section__body"
      role="region"
      aria-labelledby={headingId}
    >
      {content}
    </div>
  )}
</section>
````

Do not create another accordion library or install a new dependency.

## 2. Match the manual page width with the form page

The Special Registration form uses:

```css
.sr-public__card {
  max-width: 1000px;
}
```

The manual page currently uses an `880px` container, which makes the two pages visually inconsistent.

Change the manual page container to exactly the same content width:

```css
.sr-manual-page__body {
  max-width: 1000px;
  margin: 0 auto;
}
```

Desktop:

* Use the same horizontal alignment as `.sr-public__card`
* Do not add a second unnecessary 24px horizontal padding inside the existing `.sr-public__main`
* Keep approximately 16px top spacing and 48px bottom spacing

Mobile:

* The current `.sr-public__main` becomes edge-to-edge
* Give the manual page `12px` horizontal padding
* Keep the same card width and alignment as the mobile form cards
* Do not create horizontal scrolling

The header logo, title, language switch, sticky behaviour, and maximum header width must remain unchanged.

## 3. Reuse the form-section card design

The manual sections must look like the existing collapsible form sections, not like separate custom document cards.

Reuse:

* `var(--color-surface)`
* `var(--color-border)`
* Existing 12px desktop radius
* Existing mobile radius
* Existing subtle shadow
* Existing collapsible header spacing
* Existing divider
* Existing responsive padding
* Existing chevron styling

Remove the current manual-card padding from the outside of the section. The section header must sit inside the card, followed by the collapsible body.

Desktop body spacing:

* Approximately `20px 0 24px`
* Keep readable manual text width
* Do not make the text unnecessarily narrow inside the 1000px container

Mobile body spacing:

* Approximately `12px 18px 18px`
* Body text remains at least 14px
* Bengali line height remains comfortable

The modal may use slightly tighter spacing, but it must use the same collapsible component and visual hierarchy.

## 4. Use the same outlined icon-button pattern as “Special Registration for NRB”

The reference is the existing login-page button:

* Primary-colour text
* Primary-colour outline
* Transparent background
* Icon on the left
* Label beside the icon
* Subtle primary hover background
* Existing radius
* Strong visible focus state

Do not copy the `login-public-access__btn` class directly into unrelated markup. Reuse the same design tokens and interaction pattern through the existing button system or a small reusable modifier class.

### Continue to Registration buttons

Replace the current filled purple CTA appearance.

Use an outlined icon-and-label button matching the login-page Special Registration button.

Button content:

* Icon: existing Lucide `Globe` icon
* English: `Continue to Registration`
* Bangla: `নিবন্ধন ফর্মে যান`

Behaviour:

* Keep one CTA inside each expanded instruction section
* Navigate to the existing `/special-registration` route on the standalone manual page
* Inside the modal, close the modal and return to the existing form
* Do not reset form data

Layout:

* Full width inside the manual section, matching the login-page Special Registration button
* Minimum height: 44px
* Icon and label centred
* Approximately 8px gap
* Transparent background
* Primary border and text
* Primary-tinted hover background
* No filled purple background
* No arrow-only presentation

Use the same icon size and stroke weight as the login-page Special Registration button.

### User Manual button on the form page

Keep the User Manual button beside the language switch, but update its visual treatment to the same outlined public-action style.

Use:

* `BookOpen` icon
* English: `User Manual`
* Bangla: `ব্যবহার নির্দেশিকা`
* Primary-colour outline and text
* Transparent background
* Primary-tinted hover state
* 44px minimum height
* Existing radius and focus treatment

Desktop and tablet:

* Show the BookOpen icon and label
* Use auto width
* Keep it beside the language switch
* Do not allow the header to wrap or overflow

Small mobile widths:

* Hide only the visible label when space is limited
* Keep a 44px × 44px icon button
* Preserve `aria-label`
* Preserve `title`
* Do not hide or modify the language switch

The Continue to Registration buttons and User Manual trigger should clearly belong to the same public-action button family.

## 5. Preserve the manual content exactly

Do not:

* Rewrite text
* Correct spelling
* Correct punctuation
* Translate the Bengali manual
* Merge the two versions
* Remove repeated information
* Change numbering
* Change the malformed process line
* Remove any checklist or instruction item

Only change presentation and interaction.

Keep native semantic lists:

* `ol`
* `ul`
* `li`

Do not generate list symbols through CSS text content.

## 6. Modal behaviour

Continue using the existing `AppModal`.

Do not redesign the global modal system.

Inside the modal:

* Show the same two collapsible manual sections
* নির্দেশনা-০১ expanded by default
* নির্দেশনা-০২ collapsed by default
* Keep the modal body scrollable
* Keep the modal header and footer fixed
* Keep the existing BookOpen modal icon
* Keep the existing localized modal title
* Keep the existing compact secondary Close button
* Do not convert the footer Close button into a large full-width desktop button
* Do not add another Apply button to the modal footer

Opening and closing the modal must preserve:

* Entered form values
* Uploaded files
* Passport selection
* Country selection
* Phone number
* Validation errors
* Expanded form sections
* Form scroll position

After the modal closes, return focus to the User Manual trigger.

## 7. Responsive requirements

Desktop:

* Manual and form containers both use exactly `1000px` maximum width
* Independent collapsible manual sections
* Full-width outlined registration CTA inside each expanded section
* Auto-width User Manual button in the page header

Tablet:

* Preserve the same section hierarchy
* Reduce spacing without making the text cramped
* Prevent the header controls from overlapping

Mobile:

* 12px page-side spacing
* Collapsible section headers remain at least 48px tall
* Continue buttons remain full width
* User Manual trigger may become icon-only
* Language switch remains visible
* No clipped Bengali text
* No horizontal overflow
* No clipped process line
* Minimum 44px tap targets

## 8. Testing

Add or update focused tests confirming:

1. The manual page uses the same `1000px` content width as the form page.
2. Both instruction segments render as collapsible sections.
3. নির্দেশনা-০১ is expanded initially.
4. নির্দেশনা-০২ is collapsed initially.
5. Each section can open and close independently.
6. The chevron state follows `aria-expanded`.
7. Collapsed section content is not visible.
8. Manual collapsible behaviour also works inside the modal.
9. Continue to Registration uses a Globe icon.
10. Continue to Registration uses the outlined public-action style.
11. Both Continue buttons still open `/special-registration`.
12. The User Manual trigger uses a BookOpen icon and the outlined public-action style.
13. The mobile User Manual button retains its accessible label when the visible text is hidden.
14. Opening and closing the modal preserves all form data and uploaded files.
15. The exact manual body text remains unchanged.
16. Desktop, tablet, and mobile have no horizontal overflow.
17. Existing Special Registration tests still pass.

Run the build and full test suite after implementation. Fix only errors caused by this task.

## Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not remove working features.
* Do not modify the Special Registration form.
* Do not change APIs, routes, validation, uploads, or submission logic.
* Do not change the supplied manual text.
* Reuse the existing collapsible form-section pattern.
* Reuse existing icons, tokens, buttons, spacing, and responsive behaviour.
* Keep the manual and form containers exactly the same width.
* Test desktop, tablet, and mobile.
* Keep EN/BN interface parity.

```
```
