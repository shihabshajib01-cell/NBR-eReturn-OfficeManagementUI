# Master Prompt — Shorter Public Form Copy, Passport Type, Searchable Country Selector, and Country-Based Phone Validation

Work inside the uploaded **NBR-eReturn-Office Management UI (52)** project.

Modify the existing shared Special Registration form used by:

* The public Special Registration page
* The admin Edit Special Registration modal
* The Phase 1-to-Phase 2 shared repository flow

Implement only these changes:

1. Shorten the citizen-facing UI text.
2. Add a required Passport Type selection.
3. Replace the free-text country field with a searchable country selector containing all supported countries, flags, and calling codes.
4. Make the phone field depend on the selected country.
5. Validate phone-number length and format using the selected country.
6. Preserve the current collapsible sections, file uploader, document security, submission, editing, approval, rejection, drawer, EN/BN support, responsive layout, and Dark Mode.

Do not redesign the form or create another Special Registration flow.

---

## Inspect these files first

Review the current implementation before changing anything:

* `src/app/components/special-registration/SpecialRegistrationForm.tsx`
* `src/app/components/special-registration/SpecialRegistrationEditModal.tsx`
* `src/app/components/special-registration/SpecialRegistrationDrawer.tsx`
* `src/app/pages/public/SpecialRegistrationPublicPage.tsx`
* `src/app/pages/administration-requests/SpecialRegistrationPage.tsx`
* `src/app/components/forms/AppPhoneField.tsx`
* `src/app/components/forms/AppSelectField.tsx`
* `src/app/components/forms/AppTextField.tsx`
* `src/app/components/forms/muiFieldSx.ts`
* `src/app/services/specialRegistrationPublicService.ts`
* `src/app/services/repositories/specialRegistrationRepository.ts`
* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`
* `src/styles/special-registration.css`
* Existing Special Registration and file-security tests

The current project does not contain a searchable country field or country-specific phone-number validation. Add only the smallest reusable additions required for these two functions.

---

# 1. Shorten the public UI writing

Reduce instructional text across the public Special Registration form.

Do not remove information required to complete the application. Remove repeated explanations and replace long helper text with short, direct copy.

## Introductory notice

Replace the current long introduction with:

**English**

> This form is for Bangladeshi taxpayers abroad who cannot use a Bangladesh-registered mobile number.

**Bangla**

> বিদেশে থাকা যেসব বাংলাদেশি করদাতা বাংলাদেশে নিবন্ধিত মোবাইল নম্বর ব্যবহার করতে পারছেন না, এই ফর্মটি তাদের জন্য।

Keep the existing Support email line unchanged.

## Section titles

Use:

* Taxpayer Information
* Overseas Details
* Documents

Bangla:

* করদাতার তথ্য
* বিদেশের তথ্য
* দলিলপত্র

Do not rename internal drawer sections unless specified later in this prompt.

## Field labels and helper text

### Full Name

Label:

* Full Name
* পূর্ণ নাম

Helper:

* As shown on your NID or passport.
* এনআইডি বা পাসপোর্ট অনুযায়ী।

### TIN

Label:

* TIN
* টিআইএন

Helper:

* Enter 12 digits.
* ১২ সংখ্যার টিআইএন লিখুন।

Do not remove the existing 12-digit validation or Bangla-number normalization.

### Passport Type

Label:

* Passport Type
* পাসপোর্টের ধরন

Do not add helper text.

### Country

Label:

* Country of Residence
* বসবাসের দেশ

Do not add helper text below the field.

### Phone

Label:

* Phone Number
* ফোন নম্বর

Helper after a country is selected:

* Country code is added automatically.
* দেশের কোড স্বয়ংক্রিয়ভাবে যোগ হবে।

Before a country is selected, show the disabled placeholder:

* Select a country first
* আগে দেশ নির্বাচন করুন

### Address

Label:

* Overseas Address
* বিদেশের ঠিকানা

Remove the current address helper text.

### Departure Date

Label:

* Last Departure Date
* সর্বশেষ বাংলাদেশ ত্যাগের তারিখ

Remove the current departure-date helper text.

### Email

Label:

* Email
* ইমেইল

Helper:

* We’ll send updates here.
* আপডেট এই ইমেইলে পাঠানো হবে।

## Document copy

Section helper:

* PDF, JPG or PNG. Maximum 2 MB each.
* PDF, JPG বা PNG। প্রতিটি সর্বোচ্চ ২ MB।

### NID

Label:

* NID or Smart ID Copy
* এনআইডি বা স্মার্ট কার্ডের কপি

Helper:

* Front and back. Up to 2 files.
* সামনে ও পেছনে। সর্বোচ্চ ২টি ফাইল।

### Passport

Replace **Bio Page of Bangladeshi Passport** with a passport-neutral label because the form will now support Bangladeshi, foreign, and dual passport holders.

Label:

* Passport Bio Page
* পাসপোর্টের বায়ো পেজ

Helper:

* Photo and details page. 1 file.
* ছবি ও তথ্যের পৃষ্ঠা। ১টি ফাইল।

Keep the existing internal category:

`PASSPORT_BIO_PAGE`

Do not create separate document categories for each passport type.

### Visa or residence document

Label:

* Visa or Residence Page
* ভিসা বা রেসিডেন্স পেজ

Keep the existing Optional badge.

Helper:

* If available. 1 file.
* থাকলে দিন। ১টি ফাইল।

### Departure stamp

Label:

* Latest Bangladesh Departure Stamp
* সর্বশেষ বাংলাদেশ ত্যাগের সিল

Helper:

* Upload the passport page with the latest stamp. 1 file.
* সর্বশেষ সিল থাকা পাসপোর্ট পৃষ্ঠা দিন। ১টি ফাইল।

## Declaration

Replace the current declaration with:

**English**

> I confirm that the information and documents are correct and authorize NBR to verify my email against my TIN and process this application.

**Bangla**

> আমি নিশ্চিত করছি যে তথ্য ও দলিলপত্র সঠিক এবং টিআইএনের বিপরীতে আমার ইমেইল যাচাই ও আবেদন প্রক্রিয়ার জন্য এনবিআরকে অনুমতি দিচ্ছি।

Keep the declaration required for public submission and read-only in the admin Edit modal.

## Success message

Replace the current long success message with:

**English**

> Your application is under review. Keep the application number. Updates will be sent by email.

**Bangla**

> আপনার আবেদন পর্যালোচনাধীন। আবেদন নম্বরটি সংরক্ষণ করুন। আপডেট ইমেইলে পাঠানো হবে।

Do not change the success-screen layout or application-number copy action.

---

# 2. Add Passport Type

Add a required Passport Type field at the beginning of the **Overseas Details** section.

The section order must become:

1. Passport Type
2. Country of Residence and Phone Number
3. Overseas Address
4. Last Departure Date and Email

## Stable values

Add a shared type:

```ts
export type PassportHolderType =
  | "BANGLADESHI"
  | "FOREIGN"
  | "DUAL";
```

Do not store translated labels in the application data.

## Visible options

English:

* Bangladeshi passport holder
* Foreign passport holder
* Dual passport holder

Bangla:

* বাংলাদেশি পাসপোর্টধারী
* বিদেশি পাসপোর্টধারী
* দ্বৈত পাসপোর্টধারী

## UI implementation

Use the existing MUI installation:

* `FormControl`
* `FormLabel`
* `RadioGroup`
* `FormControlLabel`
* `Radio`
* `FormHelperText`

Do not install another radio or form library.

Do not create large selectable cards. Use a clean, compact radio group that follows the current field styling.

Desktop:

* Display the three options in one row when space allows.
* Allow wrapping without overlapping.

Mobile:

* Stack the options vertically.
* Keep each option at least 44px high.

Use existing theme tokens for:

* Text
* Border
* Selected radio
* Error
* Focus

Add only small scoped classes inside `special-registration.css`, such as:

* `.sr-passport-type`
* `.sr-passport-type__options`

Do not create another global form system.

## State and validation

Update `FormState`:

```ts
passportType: PassportHolderType | "";
```

Add it to:

* `INITIAL_FORM`
* `FieldErrors`
* `SECTION_FIELDS.overseas`
* `applicationToFormState`
* Public readiness checks
* Shared validation
* Admin edit prefill
* Public payload
* Admin update payload

Passport Type is required.

Use the normal required error:

* Select a passport type.
* পাসপোর্টের ধরন নির্বাচন করুন।

When the field has an error:

* Expand Overseas Details automatically.
* Focus the first radio.
* Show the error below the group.
* Use `aria-invalid` and `aria-describedby`.

---

# 3. Add country and phone metadata support

The current project only uses a free-text country field and a generic `AppPhoneField`. It does not contain a complete country dataset or country-specific phone validation.

Add one focused dependency:

```text
libphonenumber-js
```

Use the stricter metadata build from:

```ts
libphonenumber-js/max
```

Do not add another phone library, country library, flag package, or remote API.

Update `package.json` through the project’s existing package-management workflow.

Use this library for:

* Supported country codes
* International calling codes
* Country-specific number-length checks
* Phone parsing
* Final validity checks
* E.164 conversion

---

# 4. Create one centralized country utility

Create:

`src/app/data/countryOptions.ts`

Do not manually maintain a large duplicated country list.

Generate options using:

* `getCountries()`
* `getCountryCallingCode()`
* `Intl.DisplayNames`

Use a structure similar to:

```ts
export interface CountryOption {
  iso2: CountryCode;
  localizedName: string;
  englishName: string;
  dialCode: string;
  flag: string;
}
```

## Country names

Use:

```ts
new Intl.DisplayNames([language], { type: "region" })
```

Generate:

* Localized name using the current EN/BN language
* English name as a search fallback
* ISO two-letter code
* International calling code

If `Intl.DisplayNames` is unavailable or returns an empty value, fall back to:

1. English name
2. ISO two-letter code

Do not save a translated country name as the main backend identifier.

## Country flags

Generate a Unicode flag from the ISO two-letter code.

Do not download flag images or add remote asset URLs.

Set the flag element to `aria-hidden="true"`. The accessible option name must still contain the country name and calling code.

## Sorting

Sort options alphabetically using the current language:

```ts
new Intl.Collator(language)
```

Recalculate the visible labels when the application language changes.

## Search data

Country search must match:

* Localized country name
* English country name
* ISO two-letter code
* Calling code with or without `+`

Examples:

* `Bangladesh`
* `বাংলাদেশ`
* `BD`
* `880`
* `+880`

---

# 5. Add a reusable searchable country field

Create:

`src/app/components/forms/AppCountryAutocomplete.tsx`

This is the only new form component allowed for this task because the current `AppSelectField` does not support search, flags, or rich option rendering.

Build it with the existing MUI components:

* `Autocomplete`
* `TextField`
* Existing `muiFieldSx`

Do not create a custom dropdown from raw divs.

## Props

Use a focused interface similar to:

```ts
interface AppCountryAutocompleteProps {
  id: string;
  label: string;
  value: CountryCode | "";
  language: "en" | "bn";
  onChange: (country: CountryOption | null) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  disablePortal?: boolean;
}
```

## Selected field

Show:

* Country flag
* Localized country name

Do not show the entire calling code inside the selected field unless space allows without crowding.

## Dropdown options

Each option must show:

* Flag on the left
* Country name
* Calling code aligned on the right

Example:

`🇧🇩 Bangladesh    +880`

Use the same list treatment, surface, border, focus, and text colors as existing MUI menus.

## Search behaviour

* Search as the user types.
* Match localized name, English name, ISO code, and calling code.
* Keep keyboard arrow navigation.
* Enter selects the highlighted country.
* Escape closes the menu.
* Screen readers must announce country name and calling code.

## Popup behaviour

The shared form is used inside `AppModal`, which has its own focus trap.

For the admin Edit modal:

* Keep the autocomplete list inside the modal focus boundary.
* Pass `disablePortal={isAdminMode}`.
* Ensure the dropdown is not clipped.
* Keep the list height limited and scrollable.

For the public page:

* Normal MUI portal behaviour may remain enabled.

Do not add arbitrary high z-index values.

---

# 6. Replace the current country text field

Inside `SpecialRegistrationForm.tsx`, remove the current:

```tsx
<AppTextField id="sr-country" ... />
```

Replace it with `AppCountryAutocomplete`.

Add these form-state values:

```ts
countryCode: CountryCode | "";
country: string;
```

Use:

* `countryCode` as the stable selected value
* `country` as the canonical English country name required by the current table, search, and backend-ready payload

When a country is selected:

1. Set `countryCode` to the ISO two-letter code.
2. Set `country` to the canonical English name.
3. Clear the current country error.
4. Update the phone prefix immediately.
5. Revalidate the existing phone digits if the user has already entered a number.

When the selection is cleared:

* Clear `countryCode`
* Clear `country`
* Disable the phone input
* Keep entered phone digits temporarily
* Show validation only when the user submits or leaves the field

Do not silently select Bangladesh or any other default country.

All supported countries, including Bangladesh, must remain available.

---

# 7. Make AppPhoneField support a country prefix

Extend the existing:

`src/app/components/forms/AppPhoneField.tsx`

Do not replace it.

Add optional, backward-compatible props such as:

```ts
prefix?: React.ReactNode;
onBlur?: () => void;
inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
maxLength?: number;
autoComplete?: string;
```

All existing uses of `AppPhoneField` must continue working without changes.

Use MUI `InputAdornment` for the prefix.

The Special Registration phone field prefix must show:

* Selected country flag
* Calling code

Example:

`🇧🇩 +880 | [phone number]`

Do not put `+880` inside the editable value.

The prefix must be read-only.

## Input behaviour

Store only the national part of the number inside the public form state.

Rename the current form field from:

```ts
phone
```

to:

```ts
phoneNational
```

Use:

* `type="tel"`
* `inputMode="numeric"`
* `autoComplete="tel-national"`

Accept English and Bangla numerals.

Create or reuse a generic digit normalizer so:

* `০১৭...` becomes `017...`
* Spaces, hyphens, brackets, and other formatting characters are removed before validation
* The stored form value contains digits only

Do not use an HTML number input.

Do not remove leading zeroes.

## Pasted international numbers

When the user pastes a number beginning with `+`:

1. Parse it with `libphonenumber-js`.
2. If the parsed country matches the selected country, store only its national number.
3. If it belongs to a different country, keep the selected country unchanged and show a country mismatch error.
4. Do not silently switch the country.

## Country changes

If the user changes the selected country after entering a number:

* Preserve the entered national digits.
* Update the prefix.
* Revalidate the number using the new country.
* Do not silently clear the phone number.

---

# 8. Add country-based phone validation

Create a small shared utility, such as:

`src/app/utils/phoneNumber.ts`

Reuse it in:

* Public submission validation
* Admin Edit validation
* Payload conversion
* Application-to-form mapping

Use:

* `validatePhoneNumberLength`
* `parsePhoneNumberFromString`
* `getCountryCallingCode`

## Validation order

### No country selected

Return:

* Select a country first.
* আগে দেশ নির্বাচন করুন।

### Empty number

Use the existing required error.

### Too short

Return:

* Phone number is too short for the selected country.
* নির্বাচিত দেশের জন্য ফোন নম্বরটি খুব ছোট।

### Too long

Return:

* Phone number is too long for the selected country.
* নির্বাচিত দেশের জন্য ফোন নম্বরটি খুব বড়।

### Invalid length

Return:

* Enter a valid phone-number length for the selected country.
* নির্বাচিত দেশের জন্য সঠিক দৈর্ঘ্যের ফোন নম্বর লিখুন।

### Invalid number pattern

Return:

* Enter a valid phone number for the selected country.
* নির্বাচিত দেশের জন্য সঠিক ফোন নম্বর লিখুন।

Do not hard-code one digit length for every country.

For Bangladesh, selecting Bangladesh must:

* Show `+880`
* Validate the national number using Bangladesh metadata

For the United States or Canada:

* Show `+1`
* Validate using the selected country’s metadata

Countries sharing the same calling code must still be validated using the selected ISO country code.

## Validation timing

Validate:

* On blur
* On full form submission
* When the selected country changes and the phone field already contains digits

Do not display an error while the user is entering the first few digits unless the field has already been blurred or the form has been submitted.

---

# 9. Convert the phone number to E.164 before saving

The form should contain national digits only.

The repository and backend-ready payload must contain the canonical international number.

Create a helper such as:

```ts
toE164Phone(
  phoneNational: string,
  countryCode: CountryCode
): string
```

Use `parsePhoneNumberFromString`.

Example:

```text
Country: Bangladesh
National input: 01712345678
Saved value: +8801712345678
```

Do not manually concatenate strings when the phone parser can produce the E.164 value.

---

# 10. Update the shared form state

Update `FormState` in:

`SpecialRegistrationForm.tsx`

Use:

```ts
export interface FormState {
  fullName: string;
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

Update:

* `INITIAL_FORM`
* `FieldErrors`
* `SECTION_FIELDS`
* `applicationToFormState`
* `validateSpecialRegistrationForm`
* Public `isFormReady`
* Public submit mapping
* Admin edit mapping
* Admin Save mapping

The Overseas section error mapping must include:

```ts
[
  "passportType",
  "countryCode",
  "phoneNational",
  "address",
  "departureDate",
  "email"
]
```

Do not keep a second stale `phone` form field.

---

# 11. Update the public service contract

Update:

`src/app/services/specialRegistrationPublicService.ts`

Add to `SpecialRegPayload`:

```ts
passportType: PassportHolderType;
countryCode: CountryCode;
country: string;
phone: string; // E.164
```

The public page must convert `phoneNational` to E.164 before calling the service.

Add these fields to `FormData`:

```text
passportType
countryCode
country
phone
```

Keep:

* Existing application-number generation
* Existing submission timestamp
* Existing categorized files
* Existing pending status
* Existing shared repository insertion
* Existing duplicate-submit protection

Do not change the Phase 1-to-Phase 2 connection.

---

# 12. Update the repository and mock records

Update:

`src/app/services/repositories/specialRegistrationRepository.ts`

Add to `SpecialRegistrationApplication`:

```ts
passportType: PassportHolderType;
countryCode: CountryCode;
```

Keep:

```ts
country: string;
phone: string;
```

Where:

* `country` is the canonical English country name
* `phone` is the canonical E.164 number

Add the same fields to:

* `SpecialRegistrationUpdatePayload`
* `seedApplication`
* `updateApplication`
* Public submission object creation
* Test fixtures

Update every current seed record with the correct ISO code.

Examples:

* United Arab Emirates → `AE`
* United Kingdom → `GB`
* Canada → `CA`
* Australia → `AU`
* United States → `US`
* Germany → `DE`
* Malaysia → `MY`

Assign realistic passport-type values across seeded records.

Do not remove or recreate the existing records.

Do not change:

* Application number
* Submission date
* Status
* Review information
* Decision history
* Documents

Search should continue matching:

* Country name
* Phone number

Also allow the ISO code to be part of the search haystack.

---

# 13. Update the admin Edit modal

Update:

`SpecialRegistrationEditModal.tsx`

The modal already reuses `SpecialRegistrationForm`. Keep that shared implementation.

When opening the modal:

* Prefill Passport Type
* Prefill Country Code
* Resolve the country option
* Parse the application’s E.164 phone number
* Place only its national number in `phoneNational`
* Preserve all existing files and declaration state

When saving:

* Validate Passport Type
* Validate Country
* Validate country-specific phone number
* Convert the national phone number to E.164
* Update the existing application

Do not:

* Create another application
* Generate another application number
* Change the submission timestamp
* Change status
* Reset decision history
* Allow editing after approval or rejection

If an old record does not contain a country code, use a one-time safe mapping from its existing canonical country name. Do not guess from the phone number unless the country name cannot be mapped.

---

# 14. Update the internal details drawer

Update:

`SpecialRegistrationDrawer.tsx`

Add Passport Type to the **Taxpayer Information** section.

Display the translated label based on the stable value:

* `BANGLADESHI`
* `FOREIGN`
* `DUAL`

Add translation keys under:

```text
internal.drawer.fields.passportType
internal.passportTypes.BANGLADESHI
internal.passportTypes.FOREIGN
internal.passportTypes.DUAL
```

Keep Country and Phone inside **Overseas Residence and Contact**.

Continue displaying the phone number in E.164 format.

Keep the existing Copy action.

Replace the document title:

**Bio Page of Bangladeshi Passport**

with:

**Passport Bio Page**

Apply the same label in English and Bangla.

Do not add Passport Type to:

* The table
* KPI cards
* Search toolbar
* Filter panel

Do not change the existing drawer layout.

---

# 15. Country selector styling

Add only scoped styling required by `AppCountryAutocomplete`.

Use existing tokens.

Suggested classes:

* `.app-country-option`
* `.app-country-option__flag`
* `.app-country-option__name`
* `.app-country-option__dial-code`
* `.app-country-value`
* `.app-country-value__flag`

Requirements:

* Flag width remains consistent.
* Country name truncates safely.
* Calling code remains visible on the right.
* Dropdown has a sensible maximum height.
* Long country names do not create horizontal scrolling.
* Dark Mode uses the current surface, text, hover, selected, and border colors.
* Mobile options retain at least a 44px tap target.

Do not add custom shadows or colors that conflict with MUI menus.

---

# 16. Phone prefix styling

Add only minimal styling for the phone prefix.

The prefix should:

* Use secondary text color
* Have a small gap between flag and calling code
* Remain readable in Dark Mode
* Not look like editable input text
* Not compress the phone input excessively
* Stay aligned vertically with the entered number

Do not create a separate phone field layout outside the existing MUI input.

---

# 17. Translation updates

Update both:

* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`

Add matching keys for:

* Passport Type
* Three passport options
* Country search
* No country found
* Country-first phone placeholder
* Automatic calling-code helper
* Phone too short
* Phone too long
* Invalid phone length
* Invalid phone number
* Phone-country mismatch
* Passport Type validation
* Passport Type drawer value

Remove old helper copy only when it is no longer rendered.

Keep EN and BN key structures exactly equal.

Do not hard-code visible English in:

* Country selector
* Radio group
* Phone errors
* Drawer
* Admin Edit modal
* Public page

---

# 18. Accessibility

## Passport Type

* Use a real `fieldset` or MUI `FormControl`.
* Use one visible group label.
* Give each radio a translated accessible name.
* Connect error text with `aria-describedby`.
* Focus the first radio when validation fails.

## Country selector

* Keep normal autocomplete keyboard behaviour.
* Announce country name and calling code.
* Keep flag decorative.
* Ensure “No countries found” is translated.
* Keep the dropdown usable in the admin modal focus trap.

## Phone field

* Prefix must not be announced as editable content.
* Include the calling code in the accessible field description.
* Use `aria-invalid` for errors.
* Do not communicate validity through color alone.

---

# 19. Required tests

Add or update focused tests.

## Passport Type

* Three options are visible.
* The field is required.
* Selection is preserved when sections collapse.
* Public submission stores the selected stable value.
* Admin edit preloads the value.
* Drawer displays the translated value.
* Approved and rejected records remain non-editable.

## Country selector

* The free-text country field is removed.
* The selector contains more than 200 supported country or territory codes.
* Bangladesh is present.
* Search works using `Bangladesh`.
* Search works using `বাংলাদেশ`.
* Search works using `BD`.
* Search works using `+880`.
* Flags appear before names.
* Calling codes appear in options.
* Keyboard selection works.
* EN/BN switching updates visible country names.
* The admin modal dropdown is not clipped and remains keyboard accessible.

## Phone behaviour

* Phone input is disabled before country selection.
* Selecting Bangladesh shows `+880`.
* Selecting Germany shows `+49`.
* Selecting Malaysia shows `+60`.
* Bangla digits normalize correctly.
* Too-short numbers show the correct error.
* Too-long numbers show the correct error.
* Invalid number patterns are blocked.
* A valid national number submits as E.164.
* Pasting a matching international number stores the national part.
* Pasting a number from another country shows a mismatch error.
* Changing country updates the prefix and revalidates the number.
* Existing `AppPhoneField` usage elsewhere remains unchanged.

## Connection and regression

* Public submission still creates one Pending Review application.
* Passport Type and Country Code reach the shared repository.
* The same application appears in the internal table.
* Country continues displaying correctly.
* Phone displays in E.164 format in the drawer.
* Admin Edit preserves the application number and submission time.
* Admin Edit updates Passport Type, Country, and Phone.
* Approval and rejection continue working.
* Attachments continue reaching Phase 2.
* File-security tests continue passing.
* EN/BN locale validation passes.
* Light Mode and Dark Mode remain correct.
* Desktop and mobile layouts have no horizontal overflow.

Run:

* TypeScript build
* Existing test suite
* New country and phone tests
* File-security tests
* Phase 1-to-Phase 2 integration test
* Approval and rejection tests
* Admin Edit tests
* Locale validation
* Desktop responsive review
* Mobile responsive review

Fix every TypeScript error, stale import, unused field, invalid React key, console error, focus issue, and translation mismatch.

# Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not create another Special Registration form.
* Reuse the current shared `SpecialRegistrationForm`.
* Do not replace the current MUI form system.
* Add only one focused country autocomplete component because no equivalent exists.
* Extend `AppPhoneField` through optional backward-compatible props.
* Do not add multiple country or phone libraries.
* Do not use a remote country or flag API.
* Do not maintain a second manual country list.
* Do not hard-code phone lengths by country.
* Use `libphonenumber-js` for country-specific phone validation.
* Store stable passport and country codes, not translated labels.
* Store phone numbers in E.164 format.
* Do not silently change the selected country.
* Do not silently clear an entered phone number when the country changes.
* Do not weaken file validation or upload security.
* Do not change document categories or submission file handling.
* Preserve the Phase 1-to-Phase 2 connection.
* Preserve application numbers, submission dates, statuses, attachments, and history during editing.
* Do not allow editing after approval or rejection.
* Preserve EN/BN parity.
* Preserve Light Mode and Dark Mode.
* Preserve desktop and mobile behaviour.
* Keep the form short, clean, clear, and suitable for general citizens.
