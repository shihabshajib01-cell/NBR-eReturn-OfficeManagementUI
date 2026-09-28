# Master Prompt — Add NID Number, Update Taxpayer Layout, Improve Mobile Passport Options, and Reduce Form Copy

Work inside the uploaded **NBR-eReturn-Office Management UI (54)** project.

Make a focused update to the shared Special Registration form used by:

* Public Special Registration
* Admin Edit Special Registration modal
* Phase 1-to-Phase 2 shared submission flow

Implement only these changes:

1. Add a required NID Number input with digit validation.
2. Change the Taxpayer Information field sequence.
3. Make Passport Type options properly responsive on mobile.
4. Reduce visible citizen-facing text by approximately 30%.
5. Preserve all existing submission, editing, approval, rejection, document upload, country, phone, EN/BN, theme, and responsive behaviour.

Do not create another form, input system, radio component, data source, or validation library.

---

## Inspect these files first

* `src/app/components/special-registration/SpecialRegistrationForm.tsx`
* `src/app/components/special-registration/SpecialRegistrationEditModal.tsx`
* `src/app/components/special-registration/SpecialRegistrationDrawer.tsx`
* `src/app/pages/public/SpecialRegistrationPublicPage.tsx`
* `src/app/pages/administration-requests/SpecialRegistrationPage.tsx`
* `src/app/services/specialRegistrationPublicService.ts`
* `src/app/services/repositories/specialRegistrationRepository.ts`
* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`
* `src/styles/special-registration.css`
* `src/test/sr_phase1_to_phase2.test.ts`
* `src/test/sr_verify.test.ts`
* Existing Special Registration tests

Reuse the existing:

* `AppTextField`
* Shared collapsible form sections
* `SpecialRegistrationForm`
* Repository
* Public submission service
* Admin Edit modal
* Details drawer
* Translation namespace
* Copy action
* MUI radio group
* Theme tokens

---

# 1. Add a required NID Number field

Add a new citizen identity-number field named:

```ts
nidNumber
```

Do not name it `nid`, because that name is already used for NID document attachments:

```ts
attachments.nid
nidFiles
```

The identity number and uploaded NID files must remain separate.

## Update the shared form state

Update `FormState` in:

`src/app/components/special-registration/SpecialRegistrationForm.tsx`

```ts
export interface FormState {
  fullName: string;
  nidNumber: string;
  tin: string;
  passportType: PassportHolderType | "";
  countryCode: CountryCode | "";
  country: string;
  address: string;
  phoneNational: string;
  departureDate: string;
  email: string;
  nidFiles: File[];
  passportFiles: File[];
  visaFiles: File[];
  departureFiles: File[];
  declaration: boolean;
}
```

Add:

```ts
nidNumber: ""
```

to `INITIAL_FORM`.

Add `nidNumber` to:

* `FieldErrors`
* `applicationToFormState`
* `SECTION_FIELDS.taxpayer`
* Public form readiness
* Public submission payload
* Admin Edit prefill
* Admin Edit save payload
* Shared repository
* Seed data
* Internal details drawer
* Completeness check
* Search
* Tests

Update the taxpayer error mapping to:

```ts
taxpayer: ["fullName", "nidNumber", "tin"]
```

---

# 2. Add reusable digit normalization

The project already has `normalizeTin()` for English and Bangla digits.

Do not duplicate the same conversion logic.

Create one shared helper inside `SpecialRegistrationForm.tsx`:

```ts
export function normalizeIdentityDigits(value: string): string {
  const banglaDigits = "০১২৩৪৫৬৭৮৯";

  return value
    .split("")
    .map(character => {
      const index = banglaDigits.indexOf(character);
      return index >= 0 ? String(index) : character;
    })
    .join("")
    .replace(/\D/g, "");
}
```

Keep `normalizeTin()` as a backward-compatible wrapper:

```ts
export function normalizeTin(value: string): string {
  return normalizeIdentityDigits(value);
}
```

Use the same helper for NID:

```ts
export function normalizeNid(value: string): string {
  return normalizeIdentityDigits(value);
}
```

Do not use an HTML number input.

Use a normal text input with:

* `inputMode="numeric"`
* Digit-only normalization
* Bangla numeral support
* Leading-zero preservation
* Paste support

---

# 3. Add NID validation

Use one centralized validation rule.

Add:

```ts
export const VALID_NID_LENGTHS = [10, 13, 17] as const;
```

NID validation must:

* Be required
* Accept digits only after normalization
* Accept 10, 13, or 17 digits
* Reject every other length
* Preserve leading zeroes
* Accept pasted Bangla numerals
* Use a maximum input length of 17

Add validation inside `validateSpecialRegistrationForm()`:

```ts
if (!form.nidNumber) {
  errs.nidNumber = req;
} else if (
  !VALID_NID_LENGTHS.includes(
    form.nidNumber.length as (typeof VALID_NID_LENGTHS)[number]
  )
) {
  errs.nidNumber = t("validation.nidFormat");
}
```

Use a cleaner implementation if TypeScript requires it, but keep the rule centralized.

Do not validate the NID document filename as the NID Number.

Do not infer the number from an uploaded NID image.

## NID field

Use the existing `AppTextField`:

```tsx
<AppTextField
  id="sr-nid-number"
  label={t("applicantDetails.nidNumber")}
  value={form.nidNumber}
  onChange={value => onChange("nidNumber", normalizeNid(value))}
  required
  helper={t("applicantDetails.nidNumberHelper")}
  error={errors.nidNumber}
  maxLength={17}
  inputMode="numeric"
  autoComplete="off"
/>
```

If `AppTextField` does not currently accept `inputMode`, add it as an optional backward-compatible prop. Do not change existing field behaviour.

---

# 4. Update the Taxpayer Information layout

The required desktop sequence is:

### First row

* Full Name, full width

### Second row

* NID Number
* TIN

NID and TIN must appear side by side on desktop.

Update the current Taxpayer Information JSX from one two-column grid into an explicit layout:

```tsx
<div className="sr-taxpayer-layout">
  <div className="sr-taxpayer-layout__full">
    <AppTextField
      id="sr-full-name"
      ...
    />
  </div>

  <div className="sr-form-grid">
    <AppTextField
      id="sr-nid-number"
      ...
    />

    <AppTextField
      id="sr-tin"
      ...
    />
  </div>
</div>
```

Do not place Full Name and TIN in the same row.

## Styling

Add only the required scoped styles:

```css
.sr-taxpayer-layout {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.sr-taxpayer-layout__full {
  width: 100%;
}

.sr-taxpayer-layout .sr-form-grid {
  margin-bottom: 0;
}
```

Do not use empty grid cells, fixed widths, absolute positioning, or inline spacer elements.

## Mobile behaviour

At `max-width: 768px`:

* Full Name remains full width.
* NID and TIN stack vertically.
* Keep 16px spacing.
* Do not force two narrow fields side by side on small phones.
* Do not create horizontal scrolling.

---

# 5. Update the public submission contract

Update:

`src/app/services/specialRegistrationPublicService.ts`

Add `nidNumber` to `SpecialRegPayload`:

```ts
export interface SpecialRegPayload {
  applicantName: string;
  nidNumber: string;
  tin: string;
  passportType: PassportHolderType;
  countryCode: CountryCode;
  country: string;
  address: string;
  phone: string;
  departureDate: string;
  email: string;
  attachments: SpecialRegAttachments;
  declarationAccepted: true;
  submittedAt: string;
}
```

Add it to `FormData`:

```ts
fd.append("nidNumber", payload.nidNumber);
```

Add it to the application object:

```ts
const app: SpecialRegistrationApplication = {
  ...
  applicantName: payload.applicantName,
  nidNumber: payload.nidNumber,
  tin: payload.tin,
  ...
};
```

Do not rename or change:

```ts
payload.attachments.nid
```

That remains the uploaded NID document collection.

---

# 6. Update the public page

Update:

`src/app/pages/public/SpecialRegistrationPublicPage.tsx`

Add NID validation to `isFormReady`:

```ts
VALID_NID_LENGTHS.includes(
  form.nidNumber.length as (typeof VALID_NID_LENGTHS)[number]
)
```

Use a small exported helper if that avoids awkward TypeScript casting.

Add NID to the submission mapping:

```ts
const res = await submitSpecialRegistration({
  applicantName: form.fullName.trim(),
  nidNumber: form.nidNumber,
  tin: form.tin,
  ...
});
```

Do not add NID to the public success screen.

Keep the success screen focused on:

* Application number
* Submission time
* Email
* Status

---

# 7. Update the repository model

Update:

`src/app/services/repositories/specialRegistrationRepository.ts`

Add:

```ts
nidNumber: string;
```

to `SpecialRegistrationApplication`.

Add it to the required `seedApplication()` input.

Add a valid NID Number to every seeded record.

Use realistic test values that are:

* Unique
* Digit-only
* 10, 13, or 17 digits

Do not change existing:

* Application numbers
* Submission dates
* Statuses
* Reviewer data
* Decision history
* Document files

Add `nidNumber` to `SpecialRegistrationUpdatePayload`:

```ts
export interface SpecialRegistrationUpdatePayload {
  applicantName: string;
  nidNumber: string;
  tin: string;
  ...
}
```

Update the edit mutation:

```ts
const updated: SpecialRegistrationApplication = {
  ...app,
  applicantName: payload.applicantName,
  nidNumber: payload.nidNumber,
  tin: payload.tin,
  ...
};
```

Editing must preserve the original application ID, application number, status, submitted date, documents, and history.

---

# 8. Update the admin Edit modal

Update:

`src/app/components/special-registration/SpecialRegistrationEditModal.tsx`

Prefill NID:

```ts
return applicationToFormState({
  applicantName: application.applicantName,
  nidNumber: application.nidNumber,
  tin: application.tin,
  ...
});
```

Add `nidNumber` to the `applicationToFormState()` parameter type and returned form state.

Add NID to the update payload:

```ts
const payload: SpecialRegistrationUpdatePayload = {
  applicantName: form.fullName.trim(),
  nidNumber: form.nidNumber,
  tin: form.tin,
  ...
};
```

The Edit modal must use the same Taxpayer Information layout as the public form.

Do not create a separate admin-only NID field.

---

# 9. Update the internal details drawer

Update:

`src/app/components/special-registration/SpecialRegistrationDrawer.tsx`

Inside **Taxpayer Information**, show:

1. Full Name
2. NID Number
3. TIN
4. Passport Type

Add NID using the existing drawer field and copy-action pattern:

```tsx
<DrawerField label={t("internal.drawer.fields.nidNumber")}>
  <div className="drawer-field__value-row">
    <span>{application.nidNumber}</span>
    <CopyValueButton
      value={application.nidNumber}
      label={t("internal.drawer.copyNid")}
    />
  </div>
</DrawerField>
```

Do not show NID in the main table unless explicitly requested later.

## Completeness check

Update `checkCompleteness()`:

```ts
const nidDigits = app.nidNumber?.replace(/\D/g, "") ?? "";

if (
  !VALID_NID_LENGTHS.includes(
    nidDigits.length as (typeof VALID_NID_LENGTHS)[number]
  )
) {
  missingFields.push(t("internal.drawer.fields.nidNumber"));
}
```

Use a shared `isValidNidLength()` helper if cleaner.

Incomplete or invalid NID must disable approval, just like an invalid TIN.

Reject must remain available.

---

# 10. Add NID to internal search

Update the Special Registration repository list search haystack to include:

```ts
app.nidNumber
```

Update the search placeholder to a shorter version:

**English**

`Search application, NID, TIN or name`

**Bangla**

`আবেদন, এনআইডি, টিআইএন বা নাম খুঁজুন`

Do not add an NID table column or NID filter.

---

# 11. Make Passport Type options properly responsive

The current stylesheet contains Passport Type rules in more than one location, including media queries before the final Passport Type block.

Consolidate Passport Type styling into one clear section in:

`src/styles/special-registration.css`

Do not keep conflicting duplicate definitions.

## Desktop

Above 768px:

```css
.sr-passport-type__options.MuiRadioGroup-root {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
}
```

All three choices must:

* Stay in one row
* Have equal width
* Keep a minimum height of 48px
* Allow labels to wrap safely
* Keep the entire option clickable

## Mobile

At `max-width: 768px`:

```css
.sr-passport-type__options.MuiRadioGroup-root {
  grid-template-columns: 1fr;
  gap: 8px;
}

.sr-passport-type__option.MuiFormControlLabel-root {
  width: 100%;
  min-height: 46px;
  margin: 0;
  padding: 5px 10px 5px 8px;
}

.sr-passport-type__option .MuiFormControlLabel-label {
  font-size: 13px;
  line-height: 1.35;
}
```

The mobile result must be:

* One option per row
* Full-width options
* No clipping
* No overlapping
* No horizontal scrolling
* Minimum 44px touch targets
* Natural Bangla wrapping

Remove the current `max-width: 900px` rule that changes Passport Type to two columns. It creates an uneven third option and is not needed.

Use:

* Three columns on desktop and tablet
* One column on mobile

Do not hide the radio circle.

---

# 12. Shorten visible UI copy by approximately 30%

Reduce word count, not font size.

Do not make important text smaller or less readable.

Update the English and Bangla translations with shorter labels and helper text.

## Intro

Replace:

> This service is for Bangladeshi taxpayers living abroad who cannot use a Bangladesh-registered mobile number to complete eReturn special registration.

With:

> For Bangladeshi taxpayers abroad without a Bangladesh mobile number.

Bangla:

> বাংলাদেশি মোবাইল নম্বর নেই এমন প্রবাসী করদাতাদের জন্য।

Keep the Support email.

## Taxpayer fields

### Full Name

Label:

`Full Name`

Helper:

`As shown on NID or passport.`

Bangla:

`এনআইডি বা পাসপোর্ট অনুযায়ী।`

### NID Number

Label:

`NID Number`

Helper:

`Enter 10, 13 or 17 digits.`

Bangla:

`১০, ১৩ বা ১৭ সংখ্যা লিখুন।`

### TIN

Replace:

`TIN (Taxpayer Identification Number)`

With:

`TIN`

Helper:

`Enter 12 digits.`

Bangla:

`১২ সংখ্যা লিখুন।`

## Passport Type

Keep the group label:

`Passport Type`

Shorten options to:

* Bangladeshi
* Foreign
* Dual

Bangla:

* বাংলাদেশি
* বিদেশি
* দ্বৈত

The field label already provides the passport context, so repeating “Passport” inside every option is unnecessary.

Keep the stored values unchanged:

* `BANGLADESHI`
* `FOREIGN`
* `DUAL`

## Country

Label:

`Country`

Bangla:

`দেশ`

Do not show helper text.

## Phone

Label:

`Phone Number`

Helper:

`Country code added automatically.`

Bangla:

`দেশের কোড স্বয়ংক্রিয়ভাবে যোগ হবে।`

Disabled placeholder:

`Select country first`

Bangla:

`আগে দেশ নির্বাচন করুন`

## Address

Replace:

`Full Address Abroad`

With:

`Overseas Address`

Bangla:

`বিদেশের ঠিকানা`

Do not show helper text.

## Departure date

Replace:

`Last Departure from Bangladesh`

With:

`Last Departure Date`

Bangla:

`সর্বশেষ দেশত্যাগের তারিখ`

Do not show helper text.

## Email

Replace:

`Email Address`

With:

`Email`

Helper:

`Updates will be sent here.`

Bangla:

`আপডেট এখানে পাঠানো হবে।`

## Documents

Section title:

`Documents`

Bangla:

`দলিলপত্র`

Do not change the actual upload requirements.

Use short helpers:

* NID: `Front and back. Up to 2 files.`
* Passport: `Photo and details page.`
* Visa: `If available.`
* Departure: `Page with the latest departure stamp.`

## Declaration

Replace the long declaration with:

> I confirm the information and documents are correct and authorize NBR to verify and process this application.

Bangla:

> তথ্য ও দলিলপত্র সঠিক এবং আবেদন যাচাই ও প্রক্রিয়ার জন্য আমি এনবিআরকে অনুমতি দিচ্ছি।

Keep the same legal meaning and required behaviour.

## Success message

Use:

> Your application is under review. Keep the application number. Updates will be sent by email.

Keep the existing Bangla equivalent concise.

---

# 13. Translation updates

Update both:

* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`

Add matching keys:

```text
applicantDetails.nidNumber
applicantDetails.nidNumberHelper
validation.nidFormat
internal.drawer.fields.nidNumber
internal.drawer.copyNid
```

Suggested validation:

**English**

`NID must contain 10, 13 or 17 digits.`

**Bangla**

`এনআইডি নম্বর ১০, ১৩ বা ১৭ সংখ্যার হতে হবে।`

Keep EN and BN key structures identical.

Remove old long copy only after confirming it is no longer used.

Do not leave hard-coded visible English in the form, modal, drawer, validation, or search placeholder.

---

# 14. Required tests

Add or update tests for:

## NID input

* NID Number appears in Taxpayer Information.
* Full Name appears alone in the first row.
* NID and TIN appear side by side on desktop.
* NID and TIN stack on mobile.
* NID accepts English digits.
* NID accepts Bangla digits and normalizes them.
* NID rejects letters and punctuation.
* NID preserves leading zeroes.
* Valid 10-digit NID passes.
* Valid 13-digit NID passes.
* Valid 17-digit NID passes.
* Invalid lengths fail.
* NID is required.
* NID error automatically expands Taxpayer Information.
* NID reaches the public submission service.
* NID is stored in the shared repository.
* NID appears in the internal details drawer.
* NID is prefilled in the admin Edit modal.
* Editing NID updates the same application.
* NID can be found using internal search.
* Invalid NID blocks approval.

## Passport Type mobile behaviour

* Three options stay in one equal row on desktop.
* The old two-column tablet rule is removed.
* All three options stack on mobile.
* Mobile options remain full width.
* Labels do not clip in English.
* Labels do not clip in Bangla.
* Entire option remains clickable.
* Radio keyboard behaviour remains functional.
* Selected, focus, error, Light Mode, and Dark Mode states remain correct.

## Copy reduction

* Long helper text is replaced with the new concise copy.
* Labels remain understandable without placeholders.
* No font size is reduced below the project’s existing readable sizes.
* EN/BN translation parity passes.

## Regression

Run:

* TypeScript build
* Existing test suite
* NID validation tests
* Public submission tests
* Phase 1-to-Phase 2 integration test
* Admin Edit tests
* Approval and rejection tests
* Country and phone tests
* File-security tests
* Attachment preview tests
* EN/BN locale validation
* Light Mode review
* Dark Mode review
* Desktop review
* Mobile review

Fix all TypeScript errors, stale imports, missing fixture fields, console errors, translation mismatches, layout overflows, and accessibility issues.

# Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not create another Special Registration form.
* Reuse `SpecialRegistrationForm` for public and admin editing.
* Use `nidNumber` for the identity number and keep `nidFiles` for document uploads.
* Do not rename or break NID attachment categories.
* Do not use a number input for NID or TIN.
* Preserve Bangla numeral normalization and leading zeroes.
* Keep NID validation centralized and reusable.
* Do not add NID to the table unless requested.
* Preserve the original application number, submission date, status, files, and decision history during editing.
* Do not allow editing after approval or rejection.
* Do not change country or phone logic.
* Do not weaken upload security.
* Remove conflicting Passport Type CSS instead of adding another override.
* Reduce wording, not readable font sizes.
* Preserve Light Mode, Dark Mode, EN/BN parity, desktop, tablet, and mobile behaviour.
* Keep the form clean, compact, clear, and suitable for general citizens.
