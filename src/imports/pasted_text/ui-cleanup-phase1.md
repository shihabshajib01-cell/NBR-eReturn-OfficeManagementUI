# Master Prompt — Phase 1 UI Cleanup: Input State, Spacing, and Review Document Checklist

Work inside the uploaded **NBR-eReturn-Office Management UI (48)** project.

This is a small cleanup task for the existing **Public Special Registration for NRB** flow. Do not redesign the page, rebuild the form, change the four-step process, or modify Phase 2.

Inspect the current implementation before changing anything, especially:

* `src/app/pages/public/SpecialRegistrationPublicPage.tsx`
* `src/styles/special-registration.css`
* `src/app/components/forms/AppTextField.tsx`
* `src/app/components/forms/AppTextArea.tsx`
* `src/app/components/forms/AppPhoneField.tsx`
* `src/app/components/forms/AppDateField.tsx`
* `src/app/components/forms/muiFieldSx.ts`
* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`
* Existing Phase 1 tests

Reuse the current MUI fields, form sections, stepper, icons, buttons, translations, upload components, validation, and submission logic.

Implement only the following three changes.

---

## 1. Fix the incorrect input background after entering data

### Current problem

After the user types or the browser autofills a value, some MUI input fields display an incorrect blue-grey filled background with light or white text.

This makes the field look selected, disabled, or visually broken.

The normal expected state is:

* White or theme-controlled surface background
* Normal primary text color
* Existing outlined border
* Existing primary focus border and focus ring
* No filled blue-grey background

### Required fix

Fix browser autofill styling for the public Special Registration page.

Apply a scoped fix inside the Special Registration public page. Do not globally override every form in the project unless the existing shared form system already has an equivalent safe fix.

Target autofilled states such as:

* `input:-webkit-autofill`
* `input:-webkit-autofill:hover`
* `input:-webkit-autofill:focus`
* `input:-webkit-autofill:active`

Inside `.sr-public`, force autofilled MUI inputs to use:

* `var(--color-surface)` as the visual background
* `var(--color-text-primary)` as the text color
* The existing caret color
* The current MUI border and focus treatment

Use a safe inset box-shadow technique where required by Chromium or Safari autofill behaviour.

Do not remove browser autofill functionality. Only correct its visual appearance.

The fix must work for:

* Full Name
* TIN
* Country
* Phone
* Email
* Date fields where applicable
* Light and dark appearance settings
* Focused and unfocused autofilled states

Do not use a hard-coded white background because the project supports appearance and theme changes.

Do not change input height, label movement, border radius, typography, helper text, or validation behaviour.

---

## 2. Fix the form spacing issues

### Current problems

The Applicant Details step currently has inconsistent vertical spacing.

The main visible issue is inside **Overseas Residence and Contact Information**:

* The helper text below the address textarea sits too close to the Last Departure Date and Email fields.
* In some viewport sizes, the helper text visually overlaps or collides with the next field labels.
* Spacing between field groups is inconsistent.
* There is excessive empty space between the final form section and the bottom action divider.
* Some spacing is controlled by both the step container and the action bar, creating unnecessary vertical gaps.

### Required spacing behaviour

Use a consistent spacing rhythm based on the project’s existing values.

Keep:

* 16px between related field rows
* 18–20px between a full-width textarea and the next field row
* 16px between form sections
* 20–24px between the final content block and the action divider
* At least 4px between a field and its helper or error text

Do not solve the overlap by using absolute positioning, fixed heights, negative margins, or hiding helper text.

### Applicant Details section

Fix the layout so the order remains:

1. Country and Phone
2. Full Address
3. Departure Date and Email

The helper text under Full Address must finish before the next row begins.

The safest fix is to update the existing Special Registration layout selectors so the MUI `FormControl` containing the textarea receives proper spacing before the following `.sr-form-grid`.

The current selector intended for this spacing only targets `.form-field`, but these fields are MUI `TextField` components and render as `.MuiFormControl-root`. Correct the scoped selector rather than creating a new form component.

Keep the desktop two-column layout.

On mobile:

* All fields remain one column.
* Maintain 16px between fields.
* Helper and error text must never overlap the next field.
* No horizontal scrolling.

### Bottom action spacing

Review the combined spacing from:

* `.sr-step-body`
* `.sr-action-bar`
* Form section margins
* Declaration margins
* Review section margins

Use one clear owner for the spacing above the action divider.

Reduce the current excessive blank area while keeping the Back, Next, and Submit actions visually separate from the form content.

Do not make the buttons sticky or change their placement.

### Review page spacing

Keep all Review & Submit sections visually consistent:

* 14–16px between review sections
* Compact section headers
* Consistent content padding
* 16px between Submitted Documents and the declaration
* 20–24px between the declaration or error message and the action divider

Do not increase the overall page width or add new cards.

---

## 3. Replace document file details with a clean checklist

### Current problem

In **Review & Submit → Submitted Documents**, the interface currently displays:

* Generated file names
* File sizes
* File formats
* Required badges
* Optional badges

The generated names are technical and distracting. Citizens only need confirmation that each required document has been attached.

### Required design

Replace the current file-detail presentation with a simple document checklist.

Keep the existing **Submitted Documents** section header and **Edit** action.

Show one compact row for each document category:

1. NID or Smart ID Card Copy
2. Bio Page of Bangladeshi Passport
3. Visa or Residence Page of Current Country
4. Passport Page with Latest Bangladesh Departure Seal

### Uploaded document state

When a document category contains at least one validated file, show:

* Existing success check icon, preferably `CheckCircle2`
* Document label
* A short translated status such as **Attached**

Example:

`✓ NID or Smart ID Card Copy — Attached`

The check icon must use the project’s existing success color.

For NID or Smart ID, show only one checklist row even when the citizen uploaded both front and back images.

Do not show:

* File name
* Generated UUID name
* File extension
* MIME type
* File size
* Number of files
* Preview action
* Download action
* Technical validation information
* Required badge beside successfully attached documents

### Optional document state

The Visa or Residence Page remains optional.

When it was uploaded, show the normal success checklist state.

When it was not uploaded, show a neutral state such as:

`Visa or Residence Page of Current Country — Not provided (Optional)`

Use a neutral icon or muted treatment. Do not show an error or warning color for an omitted optional document.

### Defensive missing state

Users should not normally reach Review & Submit without required documents because Step 3 already validates them.

However, retain a defensive UI state.

If a required document is unexpectedly missing:

* Show a visible error icon
* Show **Missing**
* Do not show a success tick
* Keep Submit disabled through the existing validation
* Keep the Edit action available so the citizen can return to Documents

### Implementation

Update the existing `ReviewDocRow` inside:

`SpecialRegistrationPublicPage.tsx`

Do not create a separate checklist component unless the existing component becomes difficult to read.

The component should determine its state using the existing `files` array:

* `files.length > 0` means attached
* `files.length === 0 && required` means missing
* `files.length === 0 && !required` means optional and not provided

Keep the original `File` objects unchanged in form state.

This is only a visual cleanup of the Review & Submit page.

Do not change:

* Step 3 uploader
* File validation
* MIME checks
* Magic-number checks
* Disguised-file protection
* Maximum size
* Maximum file count
* Submission payload
* Shared repository
* Phase 1-to-Phase 2 connection
* Admin attachment preview
* Backend-ready `FormData`

The full files must still be submitted and remain available in the internal Special Registration details drawer.

### Checklist styling

Update the existing document-review CSS classes rather than creating a different card style.

The checklist should use:

* One row per category
* 44px minimum row height where the row is interactive; otherwise use compact readable padding
* 10–12px gap between icon and label
* 1px subtle separator between rows, except after the final row
* 13–14px document text
* Success color only for confirmed attachments
* Muted color for optional not-provided state
* Error color only for a missing required document

Remove unused CSS for:

* `.sr-review-doc-row__files`
* `.sr-review-doc-row__file`
* `.sr-review-doc-row__filename`
* `.sr-review-doc-row__filemeta`

Only remove those rules after confirming they are not used elsewhere.

---

## Translation updates

Reuse the existing `specialRegistration` translation namespace.

Add matching English and Bangla keys for checklist states, such as:

* `review.documentAttached`
* `review.documentMissing`
* `review.documentNotProvidedOptional`

Suggested English:

* Attached
* Missing
* Not provided (Optional)

Use natural Bangla translations suitable for general citizens.

Do not leave hard-coded English in `ReviewDocRow`.

Keep EN and BN key structures identical and run the existing locale validation.

---

## Accessibility

* Give checklist icons `aria-hidden="true"` when the adjacent text communicates the status.
* Ensure each row’s accessible text includes the document name and status.
* Do not communicate attachment state through color alone.
* Keep the Edit button keyboard accessible.
* Preserve visible focus states.
* Keep the declaration and Submit validation unchanged.
* Ensure browser autofill still works after the visual fix.

---

## Required verification

Test the following:

1. Manually type into every Applicant Details field.
2. Use browser autofill for name and email.
3. Confirm filled fields retain the normal surface background and readable text.
4. Confirm focused fields still show the existing focus ring.
5. Confirm helper text under Full Address does not overlap the next row.
6. Confirm validation errors do not overlap nearby fields.
7. Confirm spacing remains correct with long English helper text.
8. Confirm spacing remains correct with long Bangla helper text.
9. Confirm desktop keeps the existing two-column layout.
10. Confirm mobile uses one column without horizontal overflow.
11. Confirm Submitted Documents shows checklist rows only.
12. Confirm file names, sizes, and types are hidden from the public review screen.
13. Confirm the optional Visa document displays correctly when present and absent.
14. Confirm a missing required document does not receive a success tick.
15. Confirm the real files are still included in the submission payload.
16. Confirm the submitted application and its attachments still appear in Phase 2.
17. Run the existing Phase 1-to-Phase 2 integration test.
18. Run TypeScript build, tests, and locale validation.

## Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not redesign the public Special Registration page.
* Do not modify the four-step flow.
* Do not change Phase 2.
* Do not change the shared Special Registration data model.
* Do not remove or replace the existing MUI form components.
* Do not create a new input, textarea, uploader, card, button, or checklist system when the current components can be reused.
* Scope the autofill visual fix to the public Special Registration page.
* Do not weaken file validation or security.
* Do not remove files from form state or the submission payload.
* Hide file details only from the citizen-facing Review & Submit presentation.
* Preserve EN/BN language parity.
* Preserve desktop and mobile responsive behaviour.
* Keep the UI clean, simple, readable, and suitable for general citizens.
