# Master Prompt — Add NID Number Field with Digit Validation

Work inside the uploaded **NBR-eReturn-Office Management UI (54)** project.

Add a required **NID Number** input inside the existing **Taxpayer Information** section of the shared Special Registration form.

The same field must work across the complete connected flow:

* Public Special Registration form
* Public submission service
* Shared Special Registration repository
* Internal Special Registration list search
* Application Details drawer
* Admin Edit Application modal
* Application completeness check
* Approval eligibility
* EN/BN language support

Do not confuse the new NID Number input with the existing **NID or Smart ID Copy** document uploader. Both must remain separate:

* `nidNumber` = entered numeric NID value
* `nidFiles` = uploaded NID or Smart ID document files

Do not create another form, input component, data source, or validation system.

---

## Inspect these files first

* `src/app/components/special-registration/SpecialRegistrationForm.tsx`
* `src/app/components/special-registration/SpecialRegistrationEditModal.tsx`
* `src/app/components/special-registration/SpecialRegistrationDrawer.tsx`
* `src/app/pages/public/SpecialRegistrationPublicPage.tsx`
* `src/app/pages/administration-requests/SpecialRegistrationPage.tsx`
* `src/app/components/forms/AppTextField.tsx`
* `src/app/services/specialRegistrationPublicService.ts`
* `src/app/services/repositories/specialRegistrationRepository.ts`
* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`
* `src/styles/special-registration.css`
* Existing Special Registration tests

Reuse the existing `AppTextField`, field styles, translation namespace, drawer fields, copy action, validation flow, repository, and admin edit logic.

---

# 1. Add NID Number to the shared form state

Update `FormState` in:

`src/app/components/special-registration/SpecialRegistrationForm.tsx`

Add:

```ts
nidNumber: string;
```

Keep it separate from:

```ts
nidFiles: File[];
```

Update `INITIAL_FORM`:

```ts
export const INITIAL_FORM: FormState = {
  fullName: "",
  tin: "",
  nidNumber: "",
  passportType: "",
  countryCode: "",
  country: "",
  address: "",
  phoneNational: "",
  departureDate: "",
  email: "",
  nidFiles: [],
  passportFiles: [],
  visaFiles: [],
  departureFiles: [],
  declaration: false,
};
```

Because `FieldErrors` already uses `keyof FormState`, the new field should automatically become a supported validation-error key.

Update the taxpayer section mapping:

```ts
const SECTION_FIELDS = {
  taxpayer: ["fullName", "tin", "nidNumber"],
  overseas: [
    "passportType",
    "countryCode",
    "phoneNational",
    "address",
    "departureDate",
    "email",
  ],
  documents: ["nidFiles", "passportFiles", "departureFiles"],
};
```

This ensures the Taxpayer Information section automatically expands when NID validation fails.

---

# 2. Use one shared digit normalizer

The current form has `normalizeTin`, which converts Bangla numerals to English digits and removes non-digit characters.

Refactor this into a generic reusable function:

```ts
export function normalizeDigits(value: string): string {
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

Keep the current `normalizeTin` export as a wrapper so existing imports do not break:

```ts
export function normalizeTin(value: string): string {
  return normalizeDigits(value);
}
```

Add:

```ts
export function normalizeNid(value: string): string {
  return normalizeDigits(value);
}
```

Do not duplicate Bangla-digit conversion logic.

The NID field must:

* Accept English digits
* Accept Bangla digits
* Convert Bangla digits to English digits
* Remove letters
* Remove spaces
* Remove hyphens
* Remove punctuation
* Preserve leading zeroes
* Store digits only

Do not use an HTML number input.

---

# 3. Add centralized NID-length validation

Add a centralized accepted-length constant:

```ts
export const ACCEPTED_NID_LENGTHS = [10, 13, 17] as const;
```

Keep the rule centralized so it can be replaced later by the production backend requirement.

Add validation inside `validateSpecialRegistrationForm`:

```ts
if (!form.nidNumber) {
  errs.nidNumber = req;
} else if (
  !ACCEPTED_NID_LENGTHS.includes(
    form.nidNumber.length as (typeof ACCEPTED_NID_LENGTHS)[number]
  )
) {
  errs.nidNumber = t("validation.nidFormat");
}
```

A clearer implementation without unsafe casting is also acceptable:

```ts
if (!form.nidNumber) {
  errs.nidNumber = req;
} else if (![10, 13, 17].includes(form.nidNumber.length)) {
  errs.nidNumber = t("validation.nidFormat");
}
```

Do not accept partially valid values during submission.

Do not silently pad, trim, or add birth-year digits.

Do not validate the NID against TIN because no such backend rule currently exists.

---

# 4. Add the NID input to Taxpayer Information

Update the first collapsible section inside `SpecialRegistrationForm.tsx`.

Use this field order:

1. Full Name
2. TIN
3. NID Number

For a clean desktop layout:

* Full Name spans the full section width.
* TIN and NID Number appear in the next two-column row.
* On mobile, all fields stack in one column.

Use the existing `AppTextField`.

Suggested structure:

```tsx
<div className="sr-form-grid sr-taxpayer-grid">
  <div className="sr-form-grid__full">
    <AppTextField
      id="sr-full-name"
      label={t("applicantDetails.fullName")}
      value={form.fullName}
      onChange={value => onChange("fullName", value)}
      required
      helper={t("applicantDetails.fullNameHelper")}
      error={errors.fullName}
      maxLength={120}
      autoComplete="name"
    />
  </div>

  <AppTextField
    id="sr-tin"
    label={t("applicantDetails.tin")}
    value={form.tin}
    onChange={value => onChange("tin", normalizeTin(value))}
    required
    helper={t("applicantDetails.tinHelper")}
    error={errors.tin}
    maxLength={12}
    inputMode="numeric"
    autoComplete="off"
  />

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
</div>
```

Do not use `AppNumberField`.

Do not display spinner controls.

Do not put NID inside the Overseas Details section.

---

# 5. Extend AppTextField safely

The current Special Registration form already passes `maxLength` to `AppTextField`, but the shared component interface must explicitly support it.

Update:

`src/app/components/forms/AppTextField.tsx`

Add backward-compatible optional props:

```ts
interface AppTextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  inputRef?: Ref<HTMLInputElement>;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  compact?: boolean;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}
```

Pass them through the existing `inputProps`:

```tsx
inputProps={{
  readOnly,
  maxLength,
  inputMode,
  "aria-required": required ? "true" : undefined,
  "aria-describedby": error || helper ? `${id}-helper` : undefined,
  "aria-invalid": !!error || undefined,
}}
```

Do not change existing field styling, label behaviour, height, focus ring, helper text, or disabled state.

Every existing use of `AppTextField` must continue working without modification.

---

# 6. Update the Taxpayer Information layout

Add only the minimum scoped CSS required.

Update:

`src/styles/special-registration.css`

```css
.sr-form-grid__full {
  grid-column: 1 / -1;
  min-width: 0;
}
```

The existing mobile breakpoint should naturally place every field in one column.

Also confirm:

```css
@media (max-width: 768px) {
  .sr-form-grid__full {
    grid-column: auto;
  }
}
```

Do not create another card or nested section around the NID field.

Keep the existing spacing:

* 18px between rows
* 4px between fields and helper/error text
* No overlap between NID helper text and the next section
* No horizontal overflow

---

# 7. Update application-to-form mapping

Update `applicationToFormState`:

```ts
export function applicationToFormState(params: {
  applicantName: string;
  tin: string;
  nidNumber: string;
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
}): FormState {
  return {
    fullName: params.applicantName,
    tin: params.tin,
    nidNumber: params.nidNumber,
    passportType: params.passportType,
    countryCode: params.countryCode,
    country: params.country,
    address: params.address,
    phoneNational: params.phoneNational,
    departureDate: params.departureDate,
    email: params.email,
    nidFiles: params.nidFiles,
    passportFiles: params.passportFiles,
    visaFiles: params.visaFiles,
    departureFiles: params.departureFiles,
    declaration: true,
  };
}
```

Do not map uploaded NID files into `nidNumber`.

---

# 8. Update public form readiness and submission

Update:

`src/app/pages/public/SpecialRegistrationPublicPage.tsx`

Add NID validation to `isFormReady`:

```ts
const isNidLengthValid = [10, 13, 17].includes(form.nidNumber.length);
```

Then include:

```ts
form.nidNumber.length > 0 &&
isNidLengthValid &&
```

Do not rely only on `isFormReady`. Keep the full shared validator as the final submission check.

Add NID to the public submission payload:

```ts
const result = await submitSpecialRegistration({
  applicantName: form.fullName.trim(),
  tin: form.tin,
  nidNumber: form.nidNumber,
  passportType: form.passportType,
  countryCode: form.countryCode,
  country: form.country.trim(),
  address: form.address.trim(),
  phone: e164Phone,
  departureDate: form.departureDate,
  email: form.email.trim().toLowerCase(),
  attachments: {
    nid: form.nidFiles,
    passport: form.passportFiles,
    visa: form.visaFiles,
    departure: form.departureFiles,
  },
  declarationAccepted: true,
  submittedAt,
});
```

Do not display the NID Number on the public success screen.

Do not store it in local storage or session storage.

---

# 9. Update the public service contract

Update:

`src/app/services/specialRegistrationPublicService.ts`

Add to `SpecialRegPayload`:

```ts
nidNumber: string;
```

Add it to `FormData`:

```ts
fd.append("nidNumber", payload.nidNumber);
```

Add it to the shared application object:

```ts
const application: SpecialRegistrationApplication = {
  id,
  applicationNumber,
  applicantName: payload.applicantName,
  tin: payload.tin,
  nidNumber: payload.nidNumber,
  passportType: payload.passportType,
  countryCode: payload.countryCode,
  country: payload.country,
  address: payload.address,
  phone: payload.phone,
  departureDate: payload.departureDate,
  email: payload.email,
  // preserve all current fields
};
```

Do not alter:

* Application-number generation
* Pending Review status
* Categorized file mapping
* Submission timestamp
* Declaration
* Decision history
* Phase 1-to-Phase 2 repository connection

---

# 10. Update the shared repository

Update:

`src/app/services/repositories/specialRegistrationRepository.ts`

Add:

```ts
nidNumber: string;
```

to:

```ts
export interface SpecialRegistrationApplication
```

Add it to the required seed input:

```ts
function seedApplication(
  overrides: Partial<SpecialRegistrationApplication> & {
    seqIndex: number;
    daysAgo: number;
    applicantName: string;
    tin: string;
    nidNumber: string;
    // preserve current required fields
  }
)
```

Add a valid NID Number to every existing seeded application.

Use realistic numeric mock values with accepted lengths. Do not reuse the same NID for every record.

Do not change existing:

* Application numbers
* Applicant names
* TIN values
* Statuses
* Submission dates
* Review information
* Attachments
* Decision history

Add NID Number to the search haystack:

```ts
const haystack = [
  app.applicationNumber,
  app.tin,
  app.nidNumber,
  app.applicantName,
  app.email,
  app.phone,
  app.country,
]
  .join(" ")
  .toLowerCase();
```

Do not add an NID table column in this task.

---

# 11. Update admin editing

Update:

`src/app/components/special-registration/SpecialRegistrationEditModal.tsx`

When mapping an application into form state, include:

```ts
nidNumber: application.nidNumber,
```

When creating `SpecialRegistrationUpdatePayload`, include:

```ts
nidNumber: form.nidNumber,
```

Update `SpecialRegistrationUpdatePayload` in the repository:

```ts
export interface SpecialRegistrationUpdatePayload {
  applicantName: string;
  tin: string;
  nidNumber: string;
  passportType: PassportHolderType;
  countryCode: CountryCode;
  country: string;
  address: string;
  phone: string;
  departureDate: string;
  email: string;
  nidFiles: File[];
  passportFiles: File[];
  visaFiles: File[];
  departureFiles: File[];
}
```

Update `updateApplication`:

```ts
const updated: SpecialRegistrationApplication = {
  ...app,
  applicantName: payload.applicantName,
  tin: payload.tin,
  nidNumber: payload.nidNumber,
  passportType: payload.passportType,
  // preserve the current update logic
};
```

Keep:

* Same application ID
* Same application number
* Same submission date
* Same status
* Same declaration timestamp
* Existing documents
* Existing decision history
* One new EDITED history event

Do not allow editing after approval or rejection.

---

# 12. Show NID Number in the details drawer

Update:

`src/app/components/special-registration/SpecialRegistrationDrawer.tsx`

Inside **Taxpayer Information**, use this order:

1. Full Name
2. TIN
3. NID Number
4. Passport Type

Add:

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

Reuse the current `DrawerField` and `CopyValueButton`.

Do not create a custom NID display card.

Do not display the NID document name as the NID Number.

---

# 13. Update completeness and approval checks

Find the current application completeness calculation inside:

`SpecialRegistrationDrawer.tsx`

Add NID Number to the required-field check.

If `application.nidNumber` is missing or has an invalid length:

* Show NID Number in the missing-fields list.
* Display the existing Incomplete Application warning.
* Disable Approve.
* Keep Reject available.
* Keep Edit available while the application remains Pending Review.

Do not duplicate the complete public form validator inside the drawer.

Create or reuse a small shared NID validity helper:

```ts
export function isValidNidLength(value: string): boolean {
  return [10, 13, 17].includes(value.length);
}
```

Use the same helper in:

* Public validation
* Admin Edit validation
* Completeness check

Do not let the public form and admin approval use different NID rules.

---

# 14. Update search copy

Because NID Number becomes searchable, update the internal search placeholder.

English:

> Search by application no., TIN, NID, name, email, phone or country…

Bangla:

> আবেদন নম্বর, টিআইএন, এনআইডি, নাম, ইমেইল, ফোন বা দেশ দিয়ে খুঁজুন…

Do not add another filter for NID.

Do not add another table column unless the client requests it separately.

---

# 15. Translation updates

Update both:

* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`

Add matching keys.

## English

```json
{
  "applicantDetails": {
    "nidNumber": "NID Number",
    "nidNumberHelper": "Enter 10, 13 or 17 digits."
  },
  "validation": {
    "nidFormat": "NID Number must contain 10, 13 or 17 digits."
  },
  "internal": {
    "searchPlaceholder": "Search by application no., TIN, NID, name, email, phone or country…",
    "drawer": {
      "copyNid": "Copy NID Number",
      "fields": {
        "nidNumber": "NID Number"
      }
    }
  }
}
```

## Bangla

```json
{
  "applicantDetails": {
    "nidNumber": "এনআইডি নম্বর",
    "nidNumberHelper": "১০, ১৩ অথবা ১৭ সংখ্যার নম্বর লিখুন।"
  },
  "validation": {
    "nidFormat": "এনআইডি নম্বরটি ১০, ১৩ অথবা ১৭ সংখ্যার হতে হবে।"
  },
  "internal": {
    "searchPlaceholder": "আবেদন নম্বর, টিআইএন, এনআইডি, নাম, ইমেইল, ফোন বা দেশ দিয়ে খুঁজুন…",
    "drawer": {
      "copyNid": "এনআইডি নম্বর কপি করুন",
      "fields": {
        "nidNumber": "এনআইডি নম্বর"
      }
    }
  }
}
```

Merge these keys into the current structure. Do not replace unrelated translations.

Keep EN and BN key structures identical.

---

# 16. Accessibility and privacy

The NID field must:

* Have a persistent visible label.
* Use `inputMode="numeric"`.
* Preserve leading zeroes.
* Have `aria-required="true"`.
* Use `aria-invalid` when validation fails.
* Connect helper and error text with `aria-describedby`.
* Receive focus when it is the first invalid field.
* Work with English and Bangla digits.
* Remain readable in Light Mode and Dark Mode.

Do not use:

* `type="number"`
* Password masking
* Automatic formatting with spaces
* Local storage
* Session storage
* URL parameters
* Console logging
* Analytics payloads containing NID

The internal drawer may display the full NID Number because it is an authenticated officer view. Do not add it to the general table.

---

# 17. Required tests

Add or update tests for:

1. NID Number appears inside Taxpayer Information.
2. Full Name spans the full desktop row.
3. TIN and NID appear side by side on desktop.
4. All three fields stack correctly on mobile.
5. NID Number is required.
6. English digits are accepted.
7. Bangla digits normalize to English digits.
8. Letters are removed.
9. Spaces and hyphens are removed.
10. Leading zeroes are preserved.
11. A 10-digit value is accepted.
12. A 13-digit value is accepted.
13. A 17-digit value is accepted.
14. Other lengths are rejected.
15. The field limits input to 17 digits.
16. NID validation expands the collapsed Taxpayer Information section.
17. The first invalid NID field receives focus when appropriate.
18. Public submission includes `nidNumber`.
19. FormData includes `nidNumber`.
20. The same NID Number reaches the shared repository.
21. The submitted application still appears in the internal table.
22. Internal search can find an application by NID Number.
23. The drawer displays and copies the NID Number.
24. Admin Edit preloads the NID Number.
25. Admin Edit updates the same application.
26. Editing does not create another record.
27. Missing NID blocks approval.
28. NID or Smart ID document upload continues working independently.
29. File-security tests remain unchanged.
30. Approval, rejection, attachment preview, Dark Mode, mobile layout, and EN/BN locale validation continue passing.

Run:

* TypeScript build
* Existing test suite
* Special Registration tests
* Phase 1-to-Phase 2 integration test
* Admin Edit tests
* Approval and rejection tests
* File-security tests
* Locale validation
* Desktop responsive review
* Mobile responsive review

Fix all TypeScript errors, unused imports, stale fixtures, missing mock fields, translation mismatches, and accessibility issues.

# Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not create another Special Registration form.
* Reuse the existing `SpecialRegistrationForm`.
* Reuse `AppTextField`.
* Keep `nidNumber` and `nidFiles` separate.
* Do not use a number input.
* Preserve leading zeroes.
* Normalize Bangla digits using the existing digit-normalization pattern.
* Keep NID validation centralized.
* Do not add NID as a table column in this task.
* Do not store NID data in local storage, session storage, URLs, logs, or analytics.
* Preserve the public-to-admin application connection.
* Preserve application number, status, submission date, attachments, declaration, and history during editing.
* Do not allow editing after approval or rejection.
* Do not weaken file-upload validation or security.
* Preserve country selection and phone validation.
* Preserve Light Mode and Dark Mode.
* Preserve desktop and mobile behaviour.
* Keep EN/BN language parity.
