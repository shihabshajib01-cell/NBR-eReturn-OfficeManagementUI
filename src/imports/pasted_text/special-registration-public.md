# Master Prompt — Phase 1: Public Special Registration for NRB

Work inside the uploaded **NBR-eReturn-Office Management UI (46)** project. Implement **Phase 1 only**: a clean, public Special Registration application flow for Bangladeshi taxpayers living abroad.

Before changing anything, inspect the existing project structure, routing, authentication, login page, shared form components, button system, responsive styles, translation system, service layer, and file-upload implementation. Reuse the existing components and visual patterns. Do not redesign the application or create parallel components when a suitable component already exists.

## Phase 1 scope

Implement only:

1. A public, unauthenticated Special Registration page.
2. A Special Registration entry button below the existing login card.
3. The complete public form, document upload, review, submission, error, loading, and success states.
4. EN/BN translations for the full public workflow.
5. A mock service-layer submission contract that can be connected to the Phase 2 approval module later.

Do not modify the current internal `SpecialRegistrationPage.tsx`, its table, KPIs, drawer, filters, statuses, or approval workflow in this phase.

---

## Existing project patterns that must be reused

Study and reuse the following before implementation:

* `src/app/pages/auth/LoginPage.tsx`
* `src/app/components/auth/LoginForm.tsx`
* `src/app/components/forms/AppTextField.tsx`
* `src/app/components/forms/AppSelectField.tsx`
* `src/app/components/forms/AppDateField.tsx`
* `src/app/components/forms/AppPhoneField.tsx`
* `src/app/components/forms/AppTextArea.tsx`
* `src/app/components/forms/AppCheckbox.tsx`
* `src/app/components/forms/AppFileUpload.tsx`
* `src/app/components/buttons/PrimaryButton.tsx`
* `src/app/components/buttons/SecondaryButton.tsx`
* `src/app/components/shared/CopyValueButton.tsx`
* The form-section styles in `src/styles/forms.css`
* The existing stepper behaviour and visual pattern in `CreateEditRoleModal.tsx`
* Existing colors, typography, spacing, radii, shadows, focus states, animations, and CSS variables
* Existing Redux settings, `useAppearance`, `useLanguage`, i18next configuration, and EN/BN locale validation
* Existing administration service types and endpoint patterns
* Existing `AppFileUpload` tests and security checks

Do not copy the old staging page’s patterned background or outdated visual style. The new page must look like a public extension of the current eReturn Office login experience.

---

## Public route and authentication behaviour

Create a public route:

`/special-registration`

This route must:

* Work without authentication.
* Be registered as a top-level public route outside the authenticated `AppRoot` children.
* Never display the office dashboard shell, primary sidebar, secondary sidebar, top navigation, breadcrumbs, assessment year, notifications, or officer profile.
* Remain accessible whether the current Redux authentication state is logged in or logged out.
* Use the existing application appearance settings and CSS variables.
* Load without changing the current authentication logic or breaking existing routes.

Do not place the public page inside `AppRoot`, because unauthenticated users are currently redirected to the login interface by that layout.

Create the page in an appropriate public-page location, such as:

`src/app/pages/public/SpecialRegistrationPublicPage.tsx`

Keep supporting components inside a clear special-registration folder only when splitting the page improves readability.

---

## Login-page entry point

Add a public access section directly below the existing login card.

Use the existing `SecondaryButton` component with a suitable existing Lucide icon. Do not create another custom login button style.

Button label:

**Special Registration for NRB**

Supporting text:

**Apply using your email if you live abroad and cannot use a Bangladesh-registered mobile number.**

Behaviour:

* Clicking the button navigates to `/special-registration`.
* Keep the existing sign-in form, Forgot Password, Help & User Guide, branding, illustration slider, and authentication logic unchanged.
* Do not place the new button between the login fields or inside the sign-in action area.
* On desktop, keep it aligned with the login card width.
* On mobile, make it full width with a minimum 44px tap target.
* Keep the spacing compact so it is visually connected to the login card.

---

## Public page design

Create a centered, simple public form page using the current login-page visual language.

### Header

Show:

* The existing NBR logo from `src/assets/logos/nbr-logo.png`
* Product name: **eReturn Office**
* Page title: **Special Registration for NRB**
* A compact **English / বাংলা** language switch using the existing language state
* A clear **Back to Login** action

Do not add a new logo, illustration, dashboard navigation, marketing banner, or large decorative area.

### Introduction

Show a short eligibility notice:

> This service is for Bangladeshi taxpayers living abroad who cannot use a Bangladesh-registered mobile number for eReturn registration or password recovery.

Also show the official support email as secondary help text:

`ereturn@etaxnbr.gov.bd`

Keep the guidance short. Do not copy the full email samples from the old manual into the page.

### Main container

* Use one centered form card.
* Desktop maximum width: approximately 960–1040px.
* Use the project’s existing surface, border, radius, and shadow tokens.
* Keep content width readable.
* Use two-column field layouts only where appropriate on desktop.
* Use one column on mobile.
* Do not create excessive nested cards.
* Use existing `.form-section` styling for grouped content.

---

## Form flow

Use a clear four-step flow:

1. **Request Type**
2. **Applicant Details**
3. **Documents**
4. **Review & Submit**

Reuse the visual and interaction pattern of the existing role-management stepper. Do not modify or break the Role Management modal. Do not introduce a different stepper style.

Stepper behaviour:

* Current step is clearly highlighted.
* Completed steps show the existing completed-state treatment.
* Users may return to completed steps.
* Future steps remain disabled until previous steps are valid.
* Preserve all entered values while moving between steps.
* On mobile, hide long step labels when necessary and show clear text such as `Step 2 of 4`.
* On every step change, move focus to the step heading and scroll the content to the top.
* Use the existing Primary and Secondary button components for Back, Next, and Submit.
* Validate the current step before allowing Next.
* When validation fails, focus and scroll to the first invalid field.

---

## Step 1: Request type

Use the existing `AppSelectField`.

Required options:

1. **New eReturn Special Registration**
2. **Email Verification for Password Reset**

Use stable internal values such as:

* `NEW_SPECIAL_REGISTRATION`
* `PASSWORD_RESET_EMAIL_VERIFICATION`

After selection, show a short contextual information box.

For new registration:

> Select this option if you live abroad, cannot receive an OTP on a Bangladesh mobile number, and need to register for eReturn using your email address.

For password reset:

> Select this option if you previously registered for eReturn but cannot receive a Bangladesh mobile OTP and need email verification to reset your password.

Do not show fields from later steps on this screen.

---

## Step 2: Applicant details

Collect the following information:

### Taxpayer information

* Full Name
* TIN

### Overseas residence and contact information

* Current Country of Residence
* Full Address in the Country of Residence
* Foreign Mobile or Telephone Number
* Last Date of Departure from Bangladesh
* Email Address

Reuse:

* `AppTextField`
* `AppTextArea`
* `AppPhoneField`
* `AppDateField`

Do not create custom HTML inputs.

### Field behaviour and validation

**Full Name**

* Required.
* Trim leading and trailing spaces.
* Allow Bangla and English characters.
* Do not use a restrictive English-only name regex.
* Maximum 120 characters.

**TIN**

* Required.
* Accept only 12 numeric digits after normalization.
* Accept pasted English or Bangla numerals and normalize Bangla numerals to English digits.
* Do not use a number input because it may remove leading zeroes.
* Show a clear inline error for incomplete or invalid TIN values.
* Keep the validation rule centralized so it can be replaced by the final API rule later.

**Current Country of Residence**

* Required.
* Use the existing `AppTextField` with country-name autocomplete.
* Do not create a new country selector component in this phase.

**Foreign Address**

* Required.
* Use `AppTextArea`.
* Maximum 500 characters.
* Preserve normal punctuation and line breaks.

**Foreign Mobile or Telephone Number**

* Required.
* Use `AppPhoneField`.
* Allow international country codes, spaces, brackets, and hyphens.
* Do not enforce a Bangladesh mobile-number format.

**Last Departure Date**

* Required.
* Must not be a future date.
* Use `AppDateField`.

**Email Address**

* Required.
* Trim spaces and normalize to lowercase for the payload.
* Use normal email-format validation.
* Show the entered email prominently in the review step because all further communication will use it.

Use clear labels and short helper text. Do not rely on placeholders as labels.

---

## Step 3: Required documents

Create four clearly labelled document groups using the existing `AppFileUpload` component.

### 1. NID or Smart ID Copy

* Required.
* Allow one PDF or up to two image files for front and back.
* `maxFiles={2}`

### 2. Bio Page of Bangladeshi Passport

* Required.
* `maxFiles={1}`

### 3. Visa or Residence Page of Current Country

* Optional.
* Clearly display “Optional”.
* `maxFiles={1}`

### 4. Passport Page with Latest Bangladesh Departure Seal

* Required.
* `maxFiles={1}`

### Allowed formats

For this public workflow, allow only:

* PDF
* JPG
* JPEG
* PNG

Maximum size:

* 2MB per file, using the project’s current file-size rule.

Do not allow DOC, DOCX, XLS, XLSX, ZIP, executable, script, or other formats for identity documents.

### File-upload security

Reuse the existing `AppFileUpload` implementation. Do not replace it or create a second uploader.

Preserve every existing security check:

* Extension allow-list validation
* Browser MIME-type validation
* File magic-number validation
* Detection of extension and content mismatch
* Detection of renamed or disguised executable files
* Blocking Windows PE/MZ executables
* Blocking ELF files
* Blocking Mach-O files
* Blocking shell scripts
* Blocking HTML files disguised as documents
* Duplicate-file detection
* Maximum file-count validation
* Maximum file-size validation
* File-read failure handling
* Async validation/loading state
* Clear per-file errors
* File name, file size, file type, ready state, and remove action

A file renamed from `.exe` to `.png`, `.jpg`, or `.pdf` must remain blocked.

Do not weaken the global uploader’s existing rules.

Make only these safe, backward-compatible improvements when required:

* Add an optional external `error` prop so the public form can show “This document is required”.
* When `maxFiles` is 1, do not allow multi-select in the native file picker.
* Preserve current behaviour for every existing uploader that does not use the new optional props.
* Keep the current uploader UI, selected-file row, status, and remove interaction unchanged.

The frontend checks are not a replacement for backend validation. Keep the submission contract ready for server-side MIME, signature, malware, and size validation.

---

## Step 4: Review and submit

Show a read-only summary grouped into:

* Request Type
* Taxpayer Information
* Overseas Residence and Contact Information
* Submitted Documents

Each group must have a small **Edit** action that returns the user to the relevant completed step.

For documents, show:

* Document category
* File name
* File type
* File size
* Required or optional status

Do not display local object URLs or technical validation details.

### Declaration

Add a required `AppCheckbox` with this meaning:

> I declare that the information and documents provided are true and correct. I request the National Board of Revenue to verify my email address with my TIN and process the selected eReturn service.

Provide an accurate Bangla translation.

The Submit button must remain disabled until:

* All required fields are valid
* All required documents are attached
* File validation has completed
* The declaration is accepted
* No submission request is already in progress

---

## Submission behaviour

Add the submission through the existing administration service-layer pattern. Do not place fake API logic directly inside the page component.

Create an appropriate public application type containing:

* Request type
* Applicant name
* TIN
* Country of residence
* Overseas address
* Foreign phone number
* Last departure date
* Email address
* Categorized attachments
* Declaration acceptance
* Submission timestamp

Use `FormData` so real files can later be sent to the backend.

For the current static project, the mock endpoint should return:

* Application number
* Submitted date and time
* Status: `Pending`
* Request type
* Applicant email

Use a clear configurable mock number format, such as:

`SR-NRB-YYYYMMDD-####`

Do not save TIN, passport files, NID files, address, phone, or email in `localStorage`.

Prevent duplicate submission:

* Disable all navigation and submit actions while sending.
* Show the existing loading treatment on the Submit button.
* Ignore additional clicks while the request is in progress.

### Failed submission

On API failure:

* Keep all entered data and selected files.
* Show a persistent inline error above the action area.
* Use the existing toast system only as supporting feedback.
* Provide a Retry action.
* Do not send the user back to Step 1.

---

## Successful submission state

Replace the form with a simple success screen in the same card.

Show:

* Success icon using the existing success color
* Heading: **Application Submitted**
* Generated application number
* Copy action using the existing `CopyValueButton`
* Request type
* Submission date and time
* Email address
* Status badge or text: **Pending Review**

Confirmation message:

> Your application has been received by the National Board of Revenue. Keep the application number for future reference. Further instructions will be sent to your email after review.

Actions:

* Primary: **Back to Login**
* Secondary: **Submit Another Application**

When submitting another application:

* Clear all form values, files, errors, declaration state, and success data.
* Return to Step 1.
* Revoke any temporary file object URLs.
* Do not retain the previous citizen’s personal data.

---

## EN/BN language support

Add a dedicated matching locale namespace for this workflow, such as:

* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`

Register both files in `src/app/i18n/config.ts`.

Translate every visible item:

* Page headings
* Request types
* Explanations
* Step labels
* Field labels
* Helper text
* Required and optional labels
* File instructions
* Validation errors
* Buttons
* Declaration
* Loading states
* API errors
* Success confirmation
* Application status

Do not leave hard-coded English strings in the public form.

Bangla must be natural and understandable for general citizens, not direct mechanical transliteration.

Run the existing locale validation and ensure the EN/BN key structures match exactly.

---

## Responsive behaviour

### Desktop

* Center the page.
* Use a maximum width of approximately 960–1040px.
* Use two columns for compatible applicant fields.
* Keep address and document upload sections full width.
* Keep the stepper and action area aligned with the form card.

### Tablet and mobile

* Use one column.
* Use 16px page padding.
* Stack the logo, title, language control, and Back to Login action cleanly.
* Do not allow horizontal scrolling.
* Make upload zones full width.
* Make buttons at least 44px high.
* Back and Next may share one row only when both remain comfortably tappable.
* Stack action buttons on narrow screens.
* Keep error messages directly below their fields.
* Ensure the mobile keyboard does not cover the current input or action controls.
* Test long Bangla labels, long email addresses, long file names, and validation messages.
* Preserve safe-area spacing at the bottom of mobile devices.

---

## Accessibility and usability

* Use one visible `h1`.
* Give every input a persistent label.
* Mark required fields programmatically and visually.
* Connect helper and error text through `aria-describedby`.
* Use `aria-invalid` for invalid fields.
* Announce step changes and submission results.
* Keep visible keyboard focus using existing project focus styles.
* Do not use color alone to communicate error, completion, or required status.
* Maintain logical keyboard and screen-reader order.
* Ensure the stepper, language control, upload area, Edit actions, and navigation buttons work by keyboard.
* Use at least 44×44px touch targets for primary mobile interactions.
* Do not use tiny body text for important instructions.
* Do not ask citizens to understand internal NBR terms without short explanations.

---

## Testing and verification

Add focused tests for:

* Public route works without authentication
* Existing authenticated routes remain unchanged
* Login-page Special Registration button opens the public page
* Step navigation and value preservation
* Current-step validation
* TIN validation and Bangla numeral normalization
* Email validation
* Future departure-date rejection
* Required document validation
* Optional visa document behaviour
* Declaration requirement
* Submit loading and duplicate-submit prevention
* Failed submission preserves data
* Successful submission displays the application number
* Submit Another Application clears all data
* EN/BN key parity
* Mobile layout has no horizontal overflow

Extend the existing `AppFileUpload` tests without removing current test coverage. Confirm that renamed executable files, mismatched MIME types, invalid signatures, duplicates, oversized files, and unsupported formats remain blocked.

Run:

* Project build
* Existing test suite
* New Phase 1 tests
* Locale validation
* Desktop responsive review
* Mobile responsive review

Fix all TypeScript errors, console errors, missing React keys, inaccessible controls, and broken imports before completion.

## Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not remove working features.
* Do not modify the internal Special Registration approval page in Phase 1.
* Do not change existing authentication or office-dashboard behaviour.
* Reuse existing components, form fields, buttons, styles, tokens, and file-security logic.
* Do not create a second uploader or parallel form design system.
* Do not weaken MIME, magic-number, disguised-file, executable, duplicate, size, or extension validation.
* Preserve desktop and mobile login behaviour.
* Keep all citizen data out of local storage.
* Keep EN/BN language parity.
* Test responsive behaviour.
* Keep the interface clean, simple, readable, and suitable for general citizens.
