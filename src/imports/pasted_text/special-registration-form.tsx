# Master Prompt — Remove Stepper and Request Type, Convert Special Registration to a Collapsible Single-Page Form

Work inside the uploaded **NBR-eReturn-Office Management UI (51)** project.

Modify the existing Public Special Registration and admin Edit Application flows based on the latest client requirements:

1. Remove the entire stepper flow.
2. Remove Request Type and both request-type options.
3. Remove the Review & Submit screen.
4. Display the form as one clean page with collapsible sections.
5. Make the document upload areas more compact.
6. Preserve the complete Phase 1-to-Phase 2 connection, validation, file security, approval, rejection, editing, EN/BN support, Dark Mode, and responsive behaviour.

Do not build a second form. Refactor and reuse the current shared Special Registration implementation.

---

## Files to inspect and update

Review the current code before changing anything:

* `src/app/components/special-registration/SpecialRegistrationWizard.tsx`
* `src/app/components/special-registration/SpecialRegistrationEditModal.tsx`
* `src/app/components/special-registration/SpecialRegistrationDrawer.tsx`
* `src/app/pages/public/SpecialRegistrationPublicPage.tsx`
* `src/app/pages/administration-requests/SpecialRegistrationPage.tsx`
* `src/app/components/forms/AppFileUpload.tsx`
* `src/app/services/specialRegistrationPublicService.ts`
* `src/app/services/repositories/specialRegistrationRepository.ts`
* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`
* `src/styles/special-registration.css`
* `src/styles/forms.css`
* Existing Phase 1 and Phase 2 tests

Reuse all existing MUI fields, file uploader, buttons, modal, drawer, attachment viewer, theme tokens, validation rules, repository, and service structure.

---

# 1. Remove the stepper completely

Remove the four-step workflow from both:

* Public Special Registration page
* Admin Edit Special Registration modal

Remove:

* `TOTAL_STEPS`
* `Step`
* `Stepper`
* `StepperProps`
* `step`
* `completedSteps`
* `stepLabels`
* `stepMobileLabel`
* `onGoTo`
* `handleNext`
* `handleBack`
* `handleEditStep`
* Step-specific Back and Next buttons
* Step-specific validation
* Step-specific scrolling
* Step 1, Step 2, Step 3, and Step 4 rendering conditions
* All `sr-stepper*` CSS after confirming it is unused

Do not leave an empty stepper area at the top of the form.

The page structure should become:

1. Eligibility and support notice
2. Collapsible Taxpayer Information section
3. Collapsible Overseas Residence and Contact section
4. Collapsible Required Documents section
5. Collapsible Declaration section
6. Submit Application action

There must be no Next, Back, step number, completed-step icon, or “Step X of Y” text.

Keep the existing **Back to Login** action above the card.

---

# 2. Refactor the shared wizard into one shared form

The current `SpecialRegistrationWizard.tsx` is already shared by the public page and admin edit modal.

Refactor it instead of creating another form.

Rename:

`SpecialRegistrationWizard.tsx`

to:

`SpecialRegistrationForm.tsx`

Rename the exported component:

`SpecialRegistrationWizard`

to:

`SpecialRegistrationForm`

Update all imports and remove the old file. Do not keep both versions.

The new shared component should accept only the props required for a single-page form:

```ts
interface SpecialRegistrationFormProps {
  form: FormState;
  errors: FieldErrors;
  onChange: (
    field: keyof FormState,
    value: string | boolean | File[]
  ) => void;
  onFilesChange: (
    field:
      | "nidFiles"
      | "passportFiles"
      | "visaFiles"
      | "departureFiles",
    files: File[]
  ) => void;
  onDeclarationChange: (value: boolean) => void;
  submitError?: string;
  isAdminMode?: boolean;
  t: (key: string) => string;
}
```

Do not duplicate field JSX between the public page and edit modal.

---

# 3. Remove Request Type completely

The client no longer wants:

* New eReturn Special Registration
* Email Verification for Password Reset
* Request Type selection
* Request Type table column
* Request Type filter
* Request Type drawer value
* Request Type success-page value
* Request Type approval or rejection information

This should be removed end-to-end, not only hidden visually.

## Shared form state

Remove `requestType` from:

* `FormState`
* `INITIAL_FORM`
* `FieldErrors`
* `applicationToFormState`
* Validation
* Payload mapping

Remove:

* `Step1`
* `getRequestLabel`
* Request Type options
* Request Type information boxes
* Request Type translations

## Public service

Update:

`src/app/services/specialRegistrationPublicService.ts`

Remove:

* `SpecialRegRequestType`
* `requestType` from `SpecialRegPayload`
* `requestType` from `SpecialRegResult`
* `requestType` from `FormData`
* `requestType` from the created application

The application should now represent one service only:

**Special Registration for NRB**

Do not replace Request Type with another hidden dropdown.

## Repository

Update:

`src/app/services/repositories/specialRegistrationRepository.ts`

Remove `requestType` from:

* `SpecialRegistrationApplication`
* `SRListParams`
* `SpecialRegistrationUpdatePayload`
* Seed helpers
* Seed records
* Search and filtering logic
* Update logic

Convert all seeded records into normal Special Registration applications.

Do not keep password-reset seed records with hidden request-type values.

## Public copy

Update the introduction so it no longer mentions password recovery.

Use wording similar to:

> This service is for Bangladeshi taxpayers living abroad who cannot use a Bangladesh-registered mobile number to complete eReturn special registration.

Update the declaration so it no longer says “selected eReturn service.”

Use:

> I declare that the information and documents provided are true and correct. I request the National Board of Revenue to verify my email address with my TIN and process my eReturn special registration application.

Provide a natural Bangla translation.

---

# 4. Use collapsible form sections

Convert the existing form sections into accessible expandable and collapsible sections.

Do not import a new accordion library.

Reuse the interaction pattern already used in:

* `PermissionGroup.tsx`
* `HelpDrawer.tsx`

Use the existing `ChevronDown` icon and theme tokens.

A small local `CollapsibleFormSection` helper may be placed inside `SpecialRegistrationForm.tsx`. Do not create a new global design system or separate accordion package.

## Section structure

Create these four sections:

### 1. Taxpayer Information

Fields:

* Full Name
* TIN

### 2. Overseas Residence and Contact Information

Fields:

* Current Country of Residence
* Foreign Mobile or Telephone Number
* Full Address in the Country of Residence
* Last Date of Departure from Bangladesh
* Email Address

### 3. Required Documents

Uploads:

* NID or Smart ID Card Copy
* Bio Page of Bangladeshi Passport
* Visa or Residence Page of Current Country
* Passport Page with Latest Bangladesh Departure Seal

### 4. Declaration

Public mode:

* Existing editable declaration checkbox

Admin edit mode:

* Existing declaration shown as read-only
* Officer cannot change the applicant’s declaration
* Preserve the original declaration timestamp

## Default state

All four sections should be expanded when the form initially opens.

This lets citizens see the full form without needing to discover hidden fields.

Users may collapse any section manually.

When the public form is reset using **Submit Another Application**, reopen all sections.

When the admin edit modal opens for another application, reopen all sections.

## Accordion header

Each section header must include:

* Section title
* Chevron icon on the right
* Entire header as a keyboard-accessible button

Use:

* `aria-expanded`
* `aria-controls`
* Unique content IDs
* Existing visible focus treatment

Rotate the Chevron Down icon using CSS when expanded.

Do not use plus and minus icons.

## Collapsed behaviour

Collapsing a section must:

* Keep all entered values
* Keep uploaded files
* Keep validation errors
* Keep declaration state
* Not reset any form data
* Not trigger validation
* Not submit the form

## Validation behaviour

When Submit or Save is selected:

1. Validate the complete form.
2. Identify which sections contain errors.
3. Automatically expand every section containing an error.
4. Scroll to and focus the first invalid field.
5. Keep all other entered data and files unchanged.

Do not require the user to manually find a validation error inside a collapsed section.

---

# 5. Replace step validation with one shared form validator

Remove `validateStep`.

Create one shared validation function inside the shared Special Registration form module, such as:

```ts
validateSpecialRegistrationForm(
  form: FormState,
  t: TranslationFunction,
  options: {
    requireDeclaration: boolean;
  }
): FieldErrors
```

Reuse this validator in:

* Public application submission
* Admin application editing

Keep the current validation rules:

* Full Name is required
* Maximum 120 characters
* TIN is exactly 12 digits
* Bangla numerals continue to normalize to English digits
* Country is required
* Address is required
* Phone is required
* Departure date is required
* Departure date cannot be in the future
* Email is required and valid
* NID or Smart ID is required
* Passport bio page is required
* Latest departure-seal page is required
* Visa or residence document remains optional
* Public declaration is required

For admin mode:

* Do not require an officer to recheck the declaration
* Validate that the existing application declaration was accepted
* Keep the declaration read-only

Do not weaken any validation.

---

# 6. Remove Review & Submit

Remove the complete Review & Submit screen.

Remove:

* `Step4`
* `ReviewRow`
* `ReviewDocRow`
* Review section cards
* Edit section links
* Document checklist review
* Review page title and subtitle
* Review-specific step navigation
* `requestLabel`
* `step4Heading`
* Review & Save step from the admin modal

Remove unused CSS after confirming it has no other use:

* `.sr-review-section`
* `.sr-review-section__header`
* `.sr-review-section__title`
* `.sr-review-edit`
* `.sr-review-grid`
* `.sr-review-row`
* `.sr-review-row__label`
* `.sr-review-row__value`
* `.sr-review-docs`
* `.sr-review-doc-row*`

Do not remove the applicant declaration.

Do not remove the final submission confirmation screen.

## Public action area

At the bottom of the single-page form, show only:

* Primary: **Submit Application**

Keep the existing `PrimaryButton`.

Do not show Back or Next buttons.

Keep the action aligned to the right on desktop.

On mobile, make the Submit Application button full width.

## Admin edit modal footer

Remove modal Back and Next controls.

The edit modal footer should contain:

Left:

* Cancel

Right:

* Save Changes

Use the existing action button classes and modal footer.

Do not place Save Changes inside the scrolling form body.

---

# 7. Make document upload areas smaller

The current upload drop zones are too tall.

Do not redesign `AppFileUpload`.

Do not change the default uploader size for the entire project.

Apply a compact size only inside the shared Special Registration form using the existing `.sr-uploads` wrapper.

Update `special-registration.css` with scoped styles similar to:

```css
.sr-uploads .file-upload__dropzone {
  padding: 14px 16px;
  gap: 6px;
  min-height: 88px;
}

.sr-uploads .file-upload__icon {
  width: 22px;
  height: 22px;
}

.sr-uploads .file-upload__text {
  gap: 2px;
}
```

On mobile:

```css
.sr-uploads .file-upload__dropzone {
  padding: 12px;
  min-height: 80px;
}
```

Keep:

* Drag and drop
* Click to upload
* Upload icon
* Helper text
* Selected file list
* Ready status
* File removal
* File count
* Validation messages

Do not make the selected-file rows smaller than readable tap targets.

Do not hide file names from the upload section. Users still need to confirm which file they selected.

---

# 8. Keep all existing upload security

Do not change or weaken `AppFileUpload`.

Preserve:

* Extension allow list
* MIME validation
* Magic-number validation
* Renamed executable detection
* PE/MZ blocking
* ELF blocking
* Mach-O blocking
* Shell-script blocking
* Disguised HTML blocking
* Office-file signature checks
* Duplicate detection
* File-count limits
* File-size limits
* Async validation
* Read failure handling
* Per-file errors

Special Registration must continue accepting only:

* PDF
* JPG
* JPEG
* PNG

Maximum:

* 2 MB per file

Limits:

* NID or Smart ID: maximum 2 files
* Passport bio page: maximum 1 file
* Visa or residence page: maximum 1 optional file
* Departure-seal page: maximum 1 file

The same uploaded files must continue appearing in the internal application drawer.

---

# 9. Update the public page

Update:

`SpecialRegistrationPublicPage.tsx`

Remove:

* Step state
* Completed-step state
* Step navigation callbacks
* Step labels
* Request label
* Back and Next form controls
* Request Type payload mapping

The page should render:

```tsx
<SpecialRegistrationForm
  form={form}
  errors={errors}
  onChange={handleFieldChange}
  onFilesChange={...}
  onDeclarationChange={...}
  submitError={submitError}
  t={t}
/>
```

Use one `handleSubmit`.

Before submission:

* Validate the complete form
* Expand sections with errors
* Focus the first invalid field
* Prevent duplicate submission
* Keep all current loading and error behaviour

After successful submission, keep the existing success screen.

Remove Request Type from the success screen.

Success details should show:

* Application Number
* Submitted Date and Time
* Email Address
* Status: Pending Review

Keep:

* Copy application number
* Back to Login
* Submit Another Application

---

# 10. Update the admin edit modal

Update:

`SpecialRegistrationEditModal.tsx`

Remove:

* Step state
* Completed steps
* Request label
* Step labels
* Next
* Back
* Review & Save
* Request Type payload
* Step-specific validation

Use the same `SpecialRegistrationForm` used on the public page.

When Edit opens:

* Prefill all applicant fields
* Prefill all existing uploaded files
* Show all collapsible sections expanded
* Show declaration read-only
* Preserve application number
* Preserve submission timestamp
* Preserve current Pending Review status
* Preserve existing decision history

When Save Changes is selected:

1. Validate the whole form.
2. Expand any section containing errors.
3. Keep the modal open when validation fails.
4. Update the same application record.
5. Do not create a second application.
6. Do not change KPI totals.
7. Add the existing EDITED history event.
8. Close the modal after success.
9. Refresh the table and drawer.

Keep approved and rejected applications read-only.

---

# 11. Update the internal Special Registration list

Because Request Type is removed, update:

`SpecialRegistrationPage.tsx`

## Remove Request Type filter

Remove:

* `requestType` from `FilterValues`
* `requestType` from `EMPTY_FILTERS`
* Request Type query parameter
* Request Type filter definition
* Request Type applied chip
* Request Type translation usage

Keep filters:

* Status
* Country of Residence
* From Date
* To Date

## Remove Request Type table column

Use this sequence:

1. Application No.
2. TIN
3. Applicant Name
4. Residing Country
5. Email
6. Submitted On
7. Status
8. Actions

## Mobile mapping

Update the mobile mapping to:

```ts
const SPECIAL_REGISTRATION_MOBILE_MAPPING = {
  primary: "applicantName",
  identifier: "applicationNumber",
  meta: ["tin", "country", "email"],
  date: "submittedAtLabel",
  status: "statusLabel",
};
```

Do not add a View Details button to mobile cards.

The entire mobile card must continue opening the drawer.

---

# 12. Update the application drawer

Update:

`SpecialRegistrationDrawer.tsx`

Remove Request Type from:

* Summary subtitle
* Application information section
* Approval modal
* Rejection modal
* Any completeness checks
* Any decision description

Rename the current **Request Information** section to:

**Application Information**

Show:

* Application Number
* Submission Date and Time
* Current Status

Keep all other sections unchanged:

* Taxpayer Information
* Overseas Residence and Contact
* Departure Information
* Submitted Documents
* Applicant Declaration
* Review Information
* Decision History

## Approval copy

Remove conditional approval messages for registration versus password reset.

Use one generic message:

> After approval, the applicant may receive registration instructions or an OTP through the verified email address.

Do not claim an email or OTP was sent unless confirmed by the service.

## Rejection modal

Remove Request Type from the rejection summary.

Keep:

* Applicant name
* Application number
* Required rejection reason
* Existing validation
* Existing loading and conflict handling

---

# 13. Collapsible section styling

Reuse the current `.sr-form-section` card appearance.

Add only the required collapsible styles:

* `.sr-form-section__header`
* `.sr-form-section__toggle`
* `.sr-form-section__title`
* `.sr-form-section__chevron`
* `.sr-form-section__chevron--open`
* `.sr-form-section__body`

The header should:

* Use the existing section background
* Remain compact
* Have a minimum 44px touch target
* Use the existing border and radius
* Use theme text colors
* Work in Light and Dark Mode

When collapsed:

* Hide only the body
* Keep the header visible
* Keep the full card border
* Do not leave unnecessary empty padding

When expanded:

* Add a subtle divider between header and content
* Use existing section padding for the body

Do not copy Help Drawer colors or Permission Group checkbox styling.

Reuse only their interaction behaviour.

---

# 14. Translation cleanup

Update both:

* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`

Remove unused keys for:

* `steps`
* `requestType`
* Review page title and subtitle
* Request Type review section
* Request Type success field
* Request Type table column
* Request Type filter
* Request Type drawer field
* Request Type approval and rejection values
* `reviewAndSave`
* Back and Next navigation when no longer used

Keep or rename the submission-related keys under a clearer structure if needed.

Add matching EN/BN keys for:

* Application Information
* Expand section
* Collapse section
* Submit Application
* Save Changes

Ensure accordion accessible labels are translated, for example:

* Expand Taxpayer Information
* Collapse Taxpayer Information

Use natural Bangla.

Keep EN and BN key structures identical.

Run locale validation.

---

# 15. Accessibility

* Use one visible or screen-reader `h1`.
* Use logical heading order for collapsible section titles.
* Accordion headers must be real buttons.
* Use `aria-expanded`.
* Use `aria-controls`.
* Use unique region IDs.
* Use `role="region"` for expanded section content where appropriate.
* Keep keyboard focus visible.
* Do not communicate expanded state through icon rotation alone.
* Auto-expand sections containing validation errors.
* Announce submission errors through the existing alert region.
* Keep Submit Application and Save Changes accessible during keyboard navigation.
* Preserve 44px mobile tap targets.

---

# 16. Required tests

Update or add tests for:

## Public form

* No stepper is displayed.
* No Request Type field is displayed.
* No Back or Next form buttons are displayed.
* No Review & Submit screen exists.
* All four sections are displayed.
* All four sections are expanded initially.
* Each section can expand and collapse.
* Collapsing a section does not clear values.
* Collapsing Documents does not remove files.
* Public declaration remains editable.
* Submit validates the complete form.
* Sections containing errors automatically expand.
* The first invalid field receives focus.
* Valid submission creates one Pending Review application.
* Success screen does not show Request Type.
* Submit Another Application resets data and reopens sections.

## File upload

* Compact Special Registration upload styling is applied.
* Other project uploaders retain their existing size.
* Required document validation remains active.
* Optional visa document remains optional.
* Existing security tests continue passing.
* Renamed executables remain blocked.
* Files continue reaching the Phase 2 drawer.

## Admin edit

* Edit modal has no stepper.
* Edit modal has no Request Type.
* Edit modal uses the same collapsible form as the public page.
* Existing values and files are prefilled.
* Declaration is read-only.
* Cancel does not update the record.
* Save validates all sections.
* Save updates the existing application.
* Save does not create a new application.
* Application number and submission time remain unchanged.
* One EDITED history event is added.

## Internal list and drawer

* Request Type column is removed.
* Request Type filter is removed.
* Request Type is removed from mobile cards.
* Request Type is removed from the drawer.
* Request Type is removed from approval and rejection modals.
* Search, status, country, and date filters continue working.
* Approval and rejection continue working.
* Phase 1 submission still appears in the Phase 2 table.

## Regression

Run:

* TypeScript build
* Existing test suite
* File security tests
* Phase 1-to-Phase 2 integration test
* Approval tests
* Rejection tests
* Edit tests
* Attachment preview tests
* EN/BN locale validation
* Light Mode review
* Dark Mode review
* Desktop responsive review
* Mobile responsive review

Fix all TypeScript errors, broken imports, unused variables, stale state, console errors, missing keys, and accessibility issues.

# Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not create another Special Registration form.
* Do not keep the old stepper and new collapsible form together.
* Do not keep a hidden Request Type field or stale Request Type filter.
* Reuse the existing form fields, file uploader, modal, drawer, buttons, repository, and service layer.
* Keep the public and admin edit forms connected through the same shared component.
* Do not weaken file validation or file security.
* Do not remove files from the submission payload.
* Do not break the Phase 1-to-Phase 2 connection.
* Do not generate a new application during editing.
* Preserve application number, submission time, status, declaration, attachments, and audit history.
* Do not allow editing after approval or rejection.
* Preserve desktop and mobile behaviour.
* Preserve Light Mode and Dark Mode.
* Keep EN/BN language parity.
* Keep the form clean, simple, compact, and understandable for general citizens.
