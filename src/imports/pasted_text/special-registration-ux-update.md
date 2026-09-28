Update only the UX writing of the existing public “Special Registration for NRB” page. Use the developed version’s wording as the reference. Do not redesign the page or change its working behavior.

Primary files to update:
- src/app/locales/en/specialRegistration.json
- src/app/locales/bn/specialRegistration.json

Use the existing translation system. Do not hardcode visible text inside TSX components.

Scope

Only update the public Special Registration page copy, including:
- Header product name
- Form labels
- Document names
- Document helper text
- Related English and Bangla translations

Do not change:
- Page layout, spacing, typography, colors, cards, inputs, header structure, or responsive behavior
- Form fields or their order
- APIs, submission flow, validation, data models, file categories, or stored document types
- Required and optional rules
- Maximum file counts
- File upload validation
- Country selector or phone-number behavior
- Internal application list, table, drawer, approve/reject flow, or unrelated pages
- Existing language-switching functionality

English copy

Header:
- Change “eReturn Office” to “eReturn”
- Keep “Special Registration for NRB”

Introductory message:
- This form is for Bangladeshi taxpayers living abroad who cannot use a Bangladesh-registered mobile number for eReturn special registration.
- Support: ereturn@etaxnbr.gov.bd

Section headings:
- Taxpayer Information
- Overseas Details
- Documents

Taxpayer Information fields:
- Full Name (as shown on your TIN Certificate)
- Enter Your NID Number
- Enter your 12-digit TIN

Overseas Details:
- Passport Type
- Bangladeshi
- Foreign
- Residing Country
- Search country, code, or calling code
- Phone Number used in residing country
- Current Overseas Address
- Last Date of Departure from Bangladesh
- Enter Your Email Address

Update the four existing document uploader rows as follows:

1. NID document
Label:
Copy of NID/Smart ID

Helper text:
Upload clear JPG, PNG or PDF files. Maximum file size: 2 MB each. Maximum 2 files.

Keep the current maximum of two files. Do not change it to one file.

2. Passport document
Label:
Copy of Bio-page of passport

Helper text:
Upload the passport page containing the holder’s photo and personal details. Maximum file size: 2 MB.

3. Visa or residence document
Label:
Copy of Visa page of residing country

Helper text:
Upload the current visa or residence page, if available. Maximum file size: 2 MB.

Keep this document optional. Keep the existing “Optional” badge and current validation behavior.

4. Departure document
Label:
Copy of Passport page with latest departure seal as proof of departure from Bangladesh

Helper text:
Upload the passport page containing the latest Bangladesh departure seal. Maximum file size: 2 MB.

Shared document actions:
- View sample
- Choose file

Declaration:
I confirm that the information and documents provided are correct. I authorize NBR to verify my email against my TIN and process this application.

Primary action:
Submit Application

Important document-scope rule

The developed reference contains a separate “Copy of first page of passport” upload row, but the current project has only four document types and no separate data field or API category for it.

Do not add a fifth uploader in this task. Do not rename an unrelated document to pretend that the separate uploader exists. Adding that document requires a separate functional change covering the form state, validation, API payload, repository, internal drawer, edit flow, sample viewer, and submitted-document model.

Bangla parity

Update the matching Bangla public-page strings with these translations:

Header product name:
eReturn

Document 1 label:
এনআইডি/স্মার্ট আইডির কপি

Document 1 helper:
স্পষ্ট JPG, PNG বা PDF ফাইল আপলোড করুন। প্রতিটি ফাইলের সর্বোচ্চ আকার ২ MB। সর্বোচ্চ ২টি ফাইল আপলোড করা যাবে।

Document 2 label:
পাসপোর্টের বায়ো-পেজের কপি

Document 2 helper:
ধারকের ছবি ও ব্যক্তিগত তথ্যসহ পাসপোর্টের পৃষ্ঠাটি আপলোড করুন। ফাইলের সর্বোচ্চ আকার ২ MB।

Document 3 label:
বসবাসের দেশের ভিসা পৃষ্ঠার কপি

Document 3 helper:
বর্তমান ভিসা বা রেসিডেন্স পেজ থাকলে আপলোড করুন। ফাইলের সর্বোচ্চ আকার ২ MB।

Keep the existing Bangla optional badge:
ঐচ্ছিক

Document 4 label:
বাংলাদেশ ত্যাগের প্রমাণ হিসেবে সর্বশেষ প্রস্থান সিলযুক্ত পাসপোর্ট পৃষ্ঠার কপি

Document 4 helper:
বাংলাদেশ থেকে সর্বশেষ প্রস্থানের সিলযুক্ত পাসপোর্ট পৃষ্ঠাটি আপলোড করুন। ফাইলের সর্বোচ্চ আকার ২ MB।

Implementation requirements

- Update only the relevant localization keys.
- Preserve the current key names so existing components continue working.
- Do not duplicate translation strings inside components.
- Keep apostrophes and punctuation consistent.
- Use sentence case.
- Make sure long document labels wrap normally without changing component dimensions or styling.
- Verify that both EN and বাংলা display the correct matching content.
- Check that no missing translation key or raw key name appears in the UI.
- Run the existing build and tests after the copy update.

Golden Rules

- Do not break solved issues.
- Do not change unrelated files.
- Do not remove working features.
- Do not redesign the page.
- Do not change document upload logic or validation.
- Reuse the existing components and styles.
- Test desktop and mobile responsive behavior.
- Keep EN/BN language parity.