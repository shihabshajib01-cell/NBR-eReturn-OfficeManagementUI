# Master Prompt — Fix Fresh Teal Background, Restore Clear UX Copy, and Make Passport Type Mobile Responsive

Work inside **NBR-eReturn-Office Management UI (56)**. Make only these three fixes.

## 1. Soften the Fresh Teal background

In `src/app/data/themes.ts`, update only `fresh-teal`.

Keep the supplied cyan palette for primary controls, but make the page background subtle like the other themes:

```ts
"fresh-teal": {
  id: "fresh-teal",
  name: "Fresh Teal",
  primary: "#00838F",
  primaryDark: "#006064",
  primaryLight: "#E0F7FA",
  secondary: "#00BCD4",
  accent: "#18FFFF",
  background: "#F7FCFD",
  surface: "#FFFFFF",
  border: "#B2EBF2",
  textPrimary: "#123B3F",
  textSecondary: "#526D70",
  success: "#15803D",
  warning: "#D97706",
  error: "#C62828",
},
```

Update only the matching Fresh Teal fallback variables in `src/styles/theme.css`.

The result should match the visual balance of Indigo Blue, Government Blue, Slate Purple, and Plum Executive:

* Very light neutral page background
* White cards
* Cyan used for buttons, active navigation, links, focus, icons, and selected states
* No large solid cyan page background

Do not change the other themes or Dark Mode.

## 2. Restore meaningful Special Registration copy

Update the EN/BN strings in:

* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`

Use clear citizen-friendly wording. Do not shorten text until it loses meaning.

### Introduction

**English**

> This form is for Bangladeshi taxpayers living abroad who cannot use a Bangladesh-registered mobile number for eReturn special registration.

**Bangla**

> বিদেশে বসবাসরত যেসব বাংলাদেশি করদাতা eReturn বিশেষ নিবন্ধনের জন্য বাংলাদেশে নিবন্ধিত মোবাইল নম্বর ব্যবহার করতে পারছেন না, এই ফর্মটি তাদের জন্য।

### Field copy

* Full Name helper: **Enter your name as shown on your NID or passport.**
* NID helper: **Enter your 10, 13, or 17-digit NID number.**
* TIN helper: **Enter your 12-digit TIN.**
* Passport Type helper: **Select the type of passport you currently hold.**
* Country label: **Country of Residence**
* Phone helper: **Select your country first. The correct country code will be added automatically.**
* Address label: **Current Overseas Address**
* Departure label: **Last Date of Departure from Bangladesh**
* Email helper: **Application updates will be sent to this email address.**

### Documents

Section helper:

> Upload clear and readable copies in PDF, JPG, JPEG, or PNG format. Maximum size is 2 MB per file.

Use meaningful document helpers:

* NID: **Upload the front and back sides. Maximum 2 files.**
* Passport: **Upload the passport page containing your photo and personal details.**
* Visa: **Upload your current visa or residence page, if available.**
* Departure seal: **Upload the passport page showing your latest departure seal from Bangladesh.**

### Declaration

> I confirm that the information and documents provided are correct. I authorize NBR to verify my email against my TIN and process this application.

Add natural Bangla translations for every updated string. Keep EN/BN key parity.

## 3. Fix Passport Type on mobile

Update the Passport Type styles in `src/styles/special-registration.css`.

Find and remove any duplicate or conflicting `.sr-passport-type__options` media rules.

Desktop and tablet above 768px:

```css
.sr-passport-type__options.MuiRadioGroup-root {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
```

Mobile at 768px and below:

```css
@media (max-width: 768px) {
  .sr-passport-type__options.MuiRadioGroup-root {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .sr-passport-type__option.MuiFormControlLabel-root {
    width: 100%;
    min-width: 0;
    min-height: 46px;
    margin: 0;
    padding: 6px 10px;
  }

  .sr-passport-type__option .MuiFormControlLabel-label {
    white-space: normal;
    overflow-wrap: anywhere;
    font-size: 14px;
    line-height: 1.35;
  }
}
```

Mobile requirements:

* One Passport Type option per row
* Full-width clickable options
* No clipped “Bangladeshi” label
* No horizontal scrolling
* English and Bangla labels wrap safely
* Minimum 44px tap target
* Existing selected, focus, error, Light Mode, and Dark Mode states remain unchanged

## Verification

Test:

* Fresh Teal login and dashboard background
* Public Special Registration in Fresh Teal
* Public Special Registration in Dark Mode
* English and Bangla copy
* Passport Type at 320px, 360px, 390px, tablet, and desktop widths
* Existing submission, editing, country, phone, document upload, approval, and rejection flows

## Golden Rules

* Do not break solved issues.
* Change only the Fresh Teal palette values described above.
* Do not change any other theme.
* Do not redesign the Special Registration form.
* Do not change validation, APIs, repository data, or business logic.
* Do not remove useful guidance to reduce text.
* Do not create a new radio component.
* Remove conflicting responsive CSS instead of adding more overrides.
* Preserve EN/BN parity, Dark Mode, desktop, mobile, and all working features.
