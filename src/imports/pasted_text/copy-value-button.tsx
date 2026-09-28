You are working on the NBR eReturn Office Management UI project, version 37.

Task:
Add two new features safely:

1. Add copy-to-clipboard buttons beside copyable values inside detail drawer contents only.
2. Replace the fake file upload field with a proper reusable file upload UI and file management experience.

Before coding:
Audit these files first:
- src/app/components/drawers/DynamicDetailsDrawer.tsx
- src/app/components/users/UserComponents.tsx
- src/app/pages/administration-requests/RoleManagementPage.tsx
- src/app/pages/administration-requests/PermissionListPage.tsx
- src/app/components/forms/EntryForm.tsx
- src/app/components/forms/AppTextField.tsx
- src/app/components/forms/AppTextArea.tsx
- src/app/components/modals/AppModal.tsx
- src/styles/drawers.css
- src/styles/forms.css
- src/styles/globals.css
- src/app/locales/en/common.json
- src/app/locales/bn/common.json
- src/app/locales/en/actions.json
- src/app/locales/bn/actions.json
- src/app/locales/en/forms.json
- src/app/locales/bn/forms.json

Current project findings:
1. DynamicDetailsDrawer is the central drawer for generated pages.
2. User detail drawer is custom inside UserComponents.tsx.
3. Role detail drawer is custom inside RoleManagementPage.tsx.
4. Permission detail drawer should already be using DynamicDetailsDrawer.
5. EntryForm currently supports field type "file" in config, but EntryForm does not render a real file upload component. It falls back to AppTextField.
6. The project already uses sonner toast through App.tsx and exportDisabled.ts.
7. Do not add a new toast library.

Feature 1:
Copy-to-clipboard in detail drawer contents only.

Create reusable component:
src/app/components/shared/CopyValueButton.tsx

Purpose:
A small icon button that copies a field value to clipboard.

Props:
- value: unknown
- label?: string
- className?: string
- size?: number
- disabled?: boolean

Behavior:
- Safely convert value to string.
- Do not copy empty values, null, undefined, or "—".
- Use navigator.clipboard.writeText when available.
- Add fallback copy method using a hidden textarea and document.execCommand("copy") only if clipboard API is unavailable.
- Use sonner toast:
  - success: “Copied to clipboard”
  - error: “Could not copy”
- Button type must be "button".
- Stop event propagation on click.
- Keyboard accessible.
- Has aria-label:
  - “Copy {{label}}”
  - fallback: “Copy value”
- Use lucide-react Copy icon.
- After successful copy, briefly show Check icon for visual feedback.
- Do not add copy button to tables, mobile cards, chips, buttons, headers, forms, or input fields.

Add translations:
common.json or actions.json, whichever matches existing action structure.

English:
- actions.copy: Copy
- actions.copyValue: Copy value
- actions.copyField: Copy {{field}}
- actions.copiedToClipboard: Copied to clipboard
- actions.copyFailed: Could not copy

Bangla:
- actions.copy: কপি
- actions.copyValue: মান কপি করুন
- actions.copyField: {{field}} কপি করুন
- actions.copiedToClipboard: ক্লিপবোর্ডে কপি হয়েছে
- actions.copyFailed: কপি করা যায়নি

Use existing namespace style. Do not create duplicate keys if they already exist.

Copyable field detection:
Create helper inside DynamicDetailsDrawer or shared util:
isCopyableField(key: string): boolean

Copy button should appear for fields like:
- email
- phone
- mobile
- contact
- tin
- etin
- nid
- employeeId
- employee_id
- user_id
- case_no
- psr_no
- cert_no
- reg_no
- request_no
- tracking_no
- challan_no
- book_no
- ref_no
- endpoint
- api_endpoint
- url
- link
- ip
- address only if short enough, but not required by default

Do not show copy for:
- status
- role
- level
- description
- remarks
- notes
- message
- summary
- details
- amount
- date
- count
- permission chips
- action buttons

DynamicDetailsDrawer implementation:
File:
src/app/components/drawers/DynamicDetailsDrawer.tsx

Inside each drawer field value:
- Keep existing StatusBadge behavior.
- Keep ExpandableText and SafeText behavior.
- Wrap the displayed value and optional copy button in a layout:
  .drawer-field__value-row
- Show CopyValueButton only when:
  - isCopyableField(col.key) is true
  - rowData[col.key] is not empty
- Copy button must copy the full raw value, not the truncated or collapsed visible text.
- Do not add copy button to drawer header title.
- Do not add copy button to summary title/name unless it is an identifier field.
- For identifier summary values, copy button can appear beside the ID value if it is copyable.

User detail drawer implementation:
File:
src/app/components/users/UserComponents.tsx

Update renderDetailRow(label, value, options?).

Add options:
- copyable?: boolean
- copyLabel?: string

For fields:
- Employee ID: copyable true
- Email: copyable true
- Phone: copyable true
- Circle: false
- Zone: false
- Last Active: false
- Role: false
- Level: false
- 2FA Enabled: false

In renderDetailRow:
- Keep dynamic long-row behavior.
- Add CopyValueButton beside the value only when copyable.
- For long rows, copy button should stay aligned near the field label/value header and must not create horizontal scroll.
- Copy button must copy full raw value.

RoleManagementPage:
File:
src/app/pages/administration-requests/RoleManagementPage.tsx

Do not add copy buttons to role permission chips or role names.
Only add copy buttons if the role drawer has useful identifiers in the future.
For now, do not change role drawer copy behavior unless a real copyable field exists.

CSS for copy button:
Add to src/styles/drawers.css or globals.css:

.copy-value-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
}

.copy-value-btn:hover {
  background: var(--color-primary-alpha-6);
  color: var(--color-primary);
  border-color: var(--color-primary-alpha-30);
}

.copy-value-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.drawer-field__value-row,
.detail-row__value-row {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
  max-width: 100%;
}

.drawer-field__value-row > .safe-text,
.drawer-field__value-row > .expandable-text,
.detail-row__value-row > .safe-text,
.detail-row__value-row > .expandable-text {
  min-width: 0;
  flex: 1;
}

.detail-row--long .detail-row__value-row {
  justify-content: flex-start;
}

Do not let the copy button cause drawer horizontal scroll.

Feature 2:
Proper reusable file upload UI.

Create component:
src/app/components/forms/AppFileUpload.tsx

Purpose:
Reusable controlled/uncontrolled file upload field for EntryForm and future forms.

Initial rules:
- Max file size: 2MB per file
- Max file count: 5
- Accepted file types:
  - PDF: .pdf
  - Images: .jpg, .jpeg, .png
  - Word: .doc, .docx
  - Excel: .xls, .xlsx
- Do not allow executable or unsafe files.
- Do not allow duplicate files with same name + size + lastModified.
- Show clear validation errors.

Props:
- id: string
- label: string
- value?: File[]
- onChange?: (files: File[]) => void
- required?: boolean
- helper?: string
- maxFiles?: number
- maxSizeMB?: number
- accept?: string[]
- disabled?: boolean

Default:
- maxFiles = 5
- maxSizeMB = 2
- accept extensions = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".xls", ".xlsx"]

UI requirements:
1. Upload dropzone:
   - icon
   - label: “Click to upload or drag and drop”
   - helper: “PDF, JPG, PNG, DOC, DOCX, XLS, XLSX up to 2MB each. Max 5 files.”
   - button-like visual but accessible
   - hidden input type=file
   - multiple enabled
   - accept attribute from allowed extensions
2. Drag and drop:
   - highlight dropzone on drag over
   - validate dropped files
3. Uploaded file list:
   - file icon
   - file name
   - file size
   - file extension/type
   - status: Ready / Invalid
   - remove X button for each file
4. Remove option:
   - user can remove selected files before submit
   - remove button must be keyboard accessible
   - remove button must not submit form
5. File count state:
   - show “3 of 5 files selected”
   - disable adding more when max reached
6. Error messages:
   - file too large
   - unsupported file type
   - max file count exceeded
   - duplicate file
7. Accessibility:
   - input has id and label
   - errors use aria-live
   - remove button has aria-label “Remove {{filename}}”
8. No backend upload yet:
   - This is frontend selection and validation only.
   - Do not call API.
   - Do not upload to server.
   - Do not create object URLs unless preview is added.
   - Do not add download/export behavior.

EntryForm integration:
File:
src/app/components/forms/EntryForm.tsx

Update FormField type:
- type: "text" | "select" | "textarea" | "date" | "number" | "file"
- maxFiles?: number
- maxSizeMB?: number
- accept?: string[]
- multiple?: boolean

Add local form state for file fields:
- filesByField: Record<string, File[]>

When f.type === "file":
Render AppFileUpload.

Pass:
- id
- label
- required
- helper
- maxFiles={f.maxFiles ?? 5}
- maxSizeMB={f.maxSizeMB ?? 2}
- accept={f.accept}
- value={filesByField[id] ?? []}
- onChange={(files) => setFilesByField(prev => ({ ...prev, [id]: files }))}

Do not make the rest of EntryForm fully controlled unless needed.
Do not break existing generated modals.

GeneratedTablePage integration:
File:
src/app/components/pages/GeneratedTablePage.tsx

The extra button modal already has:
{ label: translateForms("fields.fileUpload"), type: "file", span: true }

Update it to:
{
  label: translateForms("fields.fileUpload"),
  type: "file",
  span: true,
  maxFiles: 5,
  maxSizeMB: 2,
  accept: [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".xls", ".xlsx"],
  helper: translateForms("fileUpload.helper")
}

Add translations in forms.json:

English:
fileUpload.title: File Upload
fileUpload.dropTitle: Click to upload or drag and drop
fileUpload.helper: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX up to 2MB each. Max 5 files.
fileUpload.selectedCount: {{count}} of {{max}} files selected
fileUpload.ready: Ready
fileUpload.invalid: Invalid
fileUpload.remove: Remove {{name}}
fileUpload.errors.tooLarge: {{name}} is larger than {{max}}MB.
fileUpload.errors.unsupported: {{name}} has an unsupported file type.
fileUpload.errors.maxFiles: Maximum {{max}} files allowed.
fileUpload.errors.duplicate: {{name}} is already selected.

Bangla:
fileUpload.title: ফাইল আপলোড
fileUpload.dropTitle: আপলোড করতে ক্লিক করুন অথবা ফাইল টেনে আনুন
fileUpload.helper: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX — প্রতিটি ফাইল সর্বোচ্চ ২MB। সর্বোচ্চ ৫টি ফাইল।
fileUpload.selectedCount: {{max}}টির মধ্যে {{count}}টি ফাইল নির্বাচন করা হয়েছে
fileUpload.ready: প্রস্তুত
fileUpload.invalid: অবৈধ
fileUpload.remove: {{name}} সরান
fileUpload.errors.tooLarge: {{name}} ফাইলটি {{max}}MB-এর বেশি।
fileUpload.errors.unsupported: {{name}} ফাইলের ধরন সমর্থিত নয়।
fileUpload.errors.maxFiles: সর্বোচ্চ {{max}}টি ফাইল নির্বাচন করা যাবে।
fileUpload.errors.duplicate: {{name}} ইতিমধ্যে নির্বাচন করা হয়েছে।

CSS for AppFileUpload:
File:
src/styles/forms.css

Add classes:
- .file-upload
- .file-upload__label
- .file-upload__dropzone
- .file-upload__dropzone--dragging
- .file-upload__dropzone--disabled
- .file-upload__icon
- .file-upload__text
- .file-upload__title
- .file-upload__helper
- .file-upload__input
- .file-upload__meta
- .file-upload__list
- .file-upload__item
- .file-upload__item-icon
- .file-upload__item-main
- .file-upload__item-name
- .file-upload__item-meta
- .file-upload__item-status
- .file-upload__remove
- .file-upload__errors
- .file-upload__error

Visual rules:
- Use existing design tokens.
- Match AppTextField/AppTextArea border radius and spacing.
- Dropzone should have dashed border.
- Dragging state should use primary alpha background.
- File list should be compact and clean.
- Remove button should be a small X icon.
- Long file names must truncate with title.
- No horizontal overflow.
- Mobile layout must stack cleanly.

Do not:
- Add external upload libraries.
- Add backend upload calls.
- Add preview modals.
- Add file download behavior.
- Store file content in localStorage.
- Convert files to base64.
- Allow executable extensions.
- Break existing EntryForm fields.
- Touch unrelated forms.

Golden rules:
1. Do not break solved features.
2. Work only on detail drawer copy functionality and file upload UI.
3. Copy icon must appear only in detail drawer contents.
4. Do not add copy buttons to tables, mobile cards, modals, form inputs, chips, or headers.
5. Copy button must copy the full raw value.
6. Copy button must not cause horizontal scroll.
7. Use existing sonner toast. Do not add another toast library.
8. File upload must be frontend-only for now.
9. Do not call backend APIs.
10. Do not restrict other form input fields.
11. Do not redesign the full form system.
12. Keep desktop and mobile behavior working.
13. Keep EN/BN translation parity.
14. Keep theme, font, and font-size switching working.
15. Keep all existing button handlers unchanged.
16. No TypeScript errors.
17. No unused imports.
18. No console errors.

Acceptance criteria:
1. User detail drawer shows copy icon beside Employee ID, Email, and Phone.
2. Clicking copy copies the full value to clipboard.
3. Success toast appears after copy.
4. Copy icon does not appear in table cells.
5. Copy icon does not appear in form fields.
6. DynamicDetailsDrawer shows copy icon beside TIN, phone, email, endpoint, URL, request number, tracking number, and similar identifiers.
7. Role drawer does not get unnecessary copy icons.
8. Copy button is keyboard accessible.
9. Copy button does not create horizontal scroll.
10. File upload field renders a real upload UI instead of a text field.
11. User can select up to 5 files.
12. Each file must be 2MB or smaller.
13. Unsupported file types are rejected.
14. Duplicate files are rejected.
15. Selected files appear in an uploaded file list.
16. User can remove any selected file with an X/remove button.
17. Long file names truncate safely.
18. Drag and drop works.
19. Mobile file upload UI remains clean.
20. Existing EntryForm text/select/date/number/textarea fields still work.
21. Build passes.