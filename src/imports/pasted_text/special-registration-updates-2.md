# Master Prompt — Special Registration UI, Upload Security, Date Picker, Samples, Typography, and Theme Cleanup

Work inside **NBR-eReturn-Office Management UI (62)**. Implement only the changes below. Reuse the existing Special Registration form, shared fields, modal, uploader patterns, theme system, translations, and attachment preview.

## Files to inspect

* `src/app/components/special-registration/SpecialRegistrationForm.tsx`
* `src/app/components/special-registration/SRDocumentRow.tsx`
* `src/app/components/forms/AppFileUpload.tsx`
* `src/app/components/forms/AppDateField.tsx`
* `src/app/components/attachments/AttachmentPreviewModal.tsx`
* `src/app/pages/public/SpecialRegistrationPublicPage.tsx`
* `src/app/data/themes.ts`
* `src/app/store/settingsSlice.ts`
* `src/styles/special-registration.css`
* `src/styles/theme.css`
* EN/BN `specialRegistration.json`
* Existing Special Registration and file-security tests

## 1. Change the phone label

Replace:

**Phone Number (Country code added automatically)**

With:

**Phone Number used in residing country**

Bangla:

**বসবাসের দেশে ব্যবহৃত ফোন নম্বর**

Keep the selected country flag and calling-code prefix unchanged.

## 2. Allow only PDF, JPG, JPEG, and PNG

Special Registration must accept only:

```ts
[".pdf", ".jpg", ".jpeg", ".png"]
```

Do not allow DOC, DOCX, XLS, XLSX, SVG, ZIP, HTML, scripts, executables, or any other format.

Extract the duplicated validation from `AppFileUpload.tsx` and `SRDocumentRow.tsx` into one shared utility, such as:

`src/app/utils/fileValidation.ts`

Both components must reuse the same checks:

* Exact extension allowlist
* MIME-to-extension match
* File magic-number validation
* PDF `%PDF` header and valid end marker
* PNG signature and end marker
* JPEG start and end signatures
* Renamed or disguised file detection
* Double-extension and suspicious executable-extension blocking
* Windows PE/MZ blocking
* ELF blocking
* Mach-O blocking
* Shell-script blocking
* HTML and SVG blocking
* File-size validation
* File-count validation
* Duplicate detection
* File-read failure handling

The native `accept` attribute is only a picker hint. Always validate the actual file content after selection or drag-and-drop.

Keep the current 2 MB limit and existing per-document file counts.

## 3. Increase Special Registration typography by 20%

Increase text size only inside the public Special Registration experience.

Scope the change under:

```css
.sr-public
```

Increase by approximately 20%:

* Header title
* Introductory notice
* Section titles
* Input labels and values
* Placeholders
* Helper and validation text
* Passport options
* Document labels and guidance
* Upload buttons
* Declaration
* Submit button
* Success screen

Do not change global project typography or the user’s font-size setting.

Do not enlarge icons, card dimensions, or spacing by 20%. Adjust wrapping and mobile spacing only where required to support the larger text.

## 4. Add a custom date picker

Extend the existing `AppDateField`; do not replace every project date field.

Add optional props such as:

```ts
customPicker?: boolean;
displayFormat?: "DD/MM/YYYY";
maxDate?: string;
```

Use the custom mode only for the Special Registration **Last Date of Departure from Bangladesh** field.

Required behaviour:

* Display format: `DD/MM/YYYY`
* Keep the internal stored value as `YYYY-MM-DD`
* Open from the existing calendar icon
* Use existing MUI components and theme tokens
* Include previous/next month navigation
* Allow month and year selection
* Show weekday headings and a date grid
* Disable future dates
* Selected date must be clearly visible
* Close after selection
* Work by keyboard
* Work inside the admin Edit modal
* Work on desktop and mobile
* Keep EN/BN support

Do not use browser-dependent date formatting.

## 5. Add sample documents

Add a small **View sample** action to every document row:

* NID or Smart ID Copy
* Passport Bio Page
* Visa or Residence Page
* Passport Page with Latest Departure Seal

Reuse:

* `AppModal`
* `AttachmentPreviewModal`
* Existing attachment types and preview styles

Use the attached sample-document images and map them to the correct categories:

* NID front and back
* Passport bio-page examples
* Visa or residence-page examples
* Passport departure-seal examples

Create a clear sample mapping file, such as:

`src/app/data/specialRegistrationSamples.ts`

Requirements:

* Samples are view-only
* Samples must never be added to the user’s uploaded files
* Do not show Download for samples
* Support multiple samples for a category
* Use readable sample names, not screenshot filenames
* Mask or replace personal data if any supplied sample contains real information
* On mobile, show the sample action below the helper text without crowding the Choose File button

Add matching EN/BN labels:

* View sample
* Sample document
* Previous sample
* Next sample
* Close sample

## 6. Add separation below Passport Type

Inside `SpecialRegistrationForm.tsx`, add a divider between Passport Type and the Country/Phone row:

```tsx
<div
  className="sr-overseas-divider"
  role="separator"
  aria-hidden="true"
/>
```

Style it using:

```css
.sr-overseas-divider {
  width: 100%;
  border-top: 1px solid var(--color-border-subtle);
  margin: 2px 0;
}
```

Keep enough spacing above and below it. Do not add another card or heading.

## 7. Tone down Fresh Teal

Update only `fresh-teal` in `src/app/data/themes.ts`:

```ts
"fresh-teal": {
  id: "fresh-teal",
  name: "Fresh Teal",
  primary: "#3F7F85",
  primaryDark: "#2D666B",
  primaryLight: "#EFF6F7",
  secondary: "#7FAEB2",
  accent: "#A8D2D5",
  background: "#F8FAFB",
  surface: "#FFFFFF",
  border: "#DEE7E9",
  textPrimary: "#243438",
  textSecondary: "#68777B",
  success: "#2F7D46",
  warning: "#D97706",
  error: "#C62828",
},
```

The updated theme must have:

* A near-neutral page background
* White cards
* Soft grey-teal borders
* Muted teal selected and active states
* No bright cyan page areas
* No green-looking borders
* Accessible white text on primary buttons

Do not change any other theme.

## 8. Use Indigo Blue as the default public-page theme

The Redux default is already `indigo-blue`. Preserve it.

Update the static fallback values in `src/styles/theme.css` from Fresh Teal to the existing Indigo Blue values so the public page does not flash or initially render in teal before Redux settings load.

Do not force a theme with `setTheme()` when the page mounts.

Do not overwrite a saved user preference.

Behaviour:

* First-time or no-preference public users see Indigo Blue
* Saved Dark Mode remains Dark Mode
* Saved explicit theme preferences continue to work
* Returning to the office dashboard does not unexpectedly change theme

## Translation updates

Add or update matching EN/BN keys for:

* Phone Number used in residing country
* Date-picker labels
* View sample
* Sample navigation
* File-type restriction message
* Unsupported or disguised file messages

Keep EN/BN key structures identical.

## Verification

Test:

* Only PDF, JPG, JPEG, and PNG pass
* Renamed EXE, HTML, SVG, ZIP, Office files, scripts, and fake images are blocked
* Valid PDF and images still upload
* Sample documents open without entering form state
* Date displays as `DD/MM/YYYY`
* Stored date remains `YYYY-MM-DD`
* Future dates cannot be selected
* Typography is approximately 20% larger only on the public Special Registration page
* Passport Type divider works on desktop and mobile
* Fresh Teal is softer across login, dashboard, tables, drawers, and modals
* New public users start with Indigo Blue
* Dark Mode still works
* Phase 1 submission, admin editing, attachment viewing, approval, and rejection remain functional

## Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not create another Special Registration form.
* Reuse existing components and theme tokens.
* Do not weaken existing file-security checks.
* Do not rely only on file extensions or browser MIME values.
* Do not allow any format outside PDF, JPG, JPEG, and PNG.
* Do not change uploaded-file payloads or Phase 1-to-Phase 2 connectivity.
* Do not change the internal ISO date value.
* Do not use real unmasked personal data in sample documents.
* Do not change other color themes.
* Do not overwrite saved appearance preferences.
* Preserve EN/BN, Dark Mode, desktop, mobile, admin editing, approval, rejection, and all working features.
