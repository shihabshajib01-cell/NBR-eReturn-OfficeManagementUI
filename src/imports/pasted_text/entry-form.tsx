You are working on the NBR eReturn Office Management UI project, version 38.

Task:
Make the pages/buttons that use file upload functional. When the user submits a creation/upload form, the new entry must appear in that page’s table immediately.

Before coding, audit these files:
- src/app/components/pages/GeneratedTablePage.tsx
- src/app/components/forms/EntryForm.tsx
- src/app/components/forms/AppFileUpload.tsx
- src/app/pages/psr-verification/PSRApprovalPage.tsx
- src/app/pages/modulePageUtils.ts
- src/app/data/modulePageConfigs.ts
- src/app/components/drawers/DynamicDetailsDrawer.tsx
- src/app/locales/en/forms.json
- src/app/locales/bn/forms.json
- src/app/locales/en/actions.json
- src/app/locales/bn/actions.json

Current confirmed structure:
1. AppFileUpload already exists.
2. EntryForm supports field type "file".
3. GeneratedTablePage renders extra button modals with file upload field.
4. PSRApprovalPage currently has two extra buttons:
   - PSR Entry
   - PSR Bulk Entry
5. EntryForm fields are currently not functional because values are hardcoded as empty strings.
6. GeneratedTablePage currently renders `cfg.rows` directly, so the table cannot receive new entries.
7. Extra button submit currently closes the modal but does not create any table row.

Main goal:
Make creation/upload forms functional in the static frontend.

Important:
This is frontend-only for now.
Do not call backend APIs.
Do not upload files to a server.
Do not store file contents in localStorage.
Do not convert files to base64.
Only store safe file metadata in the created table row.

Required fix 1: Make EntryForm controlled

File:
src/app/components/forms/EntryForm.tsx

Update FormField type:

type EntryFieldType = "text" | "select" | "textarea" | "date" | "number" | "file";

type EntryFormValue = string | File[];

type FormField = {
  key: string;
  label: string;
  type: EntryFieldType;
  options?: string[];
  span?: boolean;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string[];
  multiple?: boolean;
  defaultValue?: string;
};

Update EntryFormProps:

interface EntryFormProps {
  fields: FormField[];
  onClose: () => void;
  onSubmit?: (values: Record<string, EntryFormValue>) => void;
  submitLabel?: string;
}

Behavior:
- Store all field values in local state.
- Text/select/date/number/textarea values must update correctly.
- File fields must store File[].
- On submit, pass the full values object to onSubmit.
- Then close the modal only after successful submit.
- Required fields should be checked before closing.
- Show a small validation error for missing required fields.
- Do not add maxLength.
- Do not restrict text input beyond required validation.

Do not break:
- AppTextField
- AppTextArea
- AppSelectField
- AppDateField
- AppNumberField
- AppFileUpload

Required fix 2: Keep AppFileUpload as frontend-only file selector

File:
src/app/components/forms/AppFileUpload.tsx

Keep:
- max file size: 2MB
- max files: 5
- allowed extensions:
  .pdf, .jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx
- duplicate file rejection
- remove/cross button
- selected file list
- drag/drop behavior

Improve only if needed:
- Make sure invalid files are not added.
- Make sure selected file list remains in EntryForm values.
- Make sure remove updates EntryForm state.
- Make sure long file names truncate safely.
- Make sure mobile layout stays clean.

Do not add backend upload.

Required fix 3: Add local table row state in GeneratedTablePage

File:
src/app/components/pages/GeneratedTablePage.tsx

Currently:
- filtered uses cfg.rows
- table renders pageRows from cfg.rows
- new modal submit does not update rows

Change:
- Add local state:

const [rows, setRows] = useState<TableRow[]>(() => cfg.rows);

- If cfg.rows changes, sync state safely:

useEffect(() => {
  setRows(cfg.rows);
}, [cfg.rows]);

- filtered must use rows, not cfg.rows.
- pagination must use filtered based on rows.
- table must use pageRows from rows.

Do not mutate cfg.rows directly.

Required fix 4: Add stable modal identity for extra buttons

File:
src/app/pages/modulePageUtils.ts

Update PageCfg extra button type.

Current:
extraBtns?: { label: string; icon: IconComponent; color?: string }[];

Change safely to:

extraBtns?: {
  id: string;
  label: string;
  icon: IconComponent;
  color?: string;
  tone?: "primary" | "neutral" | "warning";
  formKind?: "psr-entry" | "psr-bulk-entry" | "generic-upload";
}[];

Keep backward compatibility if possible.

File:
src/app/components/pages/GeneratedTablePage.tsx

Do not use translated label as modal ID.
Use:
- modal state as `{ type: "entry" } | { type: "extra"; id: string } | null`
or
- modal string with stable ids like `extra:${b.id}`

Do not rely on button label because label changes with language.

Required fix 5: Configure PSRApprovalPage buttons properly

File:
src/app/pages/psr-verification/PSRApprovalPage.tsx

Update extra buttons:

extraBtns: [
  {
    id: "psr-entry",
    label: translateActions("psrEntry"),
    icon: Plus,
    tone: "neutral",
    formKind: "psr-entry"
  },
  {
    id: "psr-bulk-entry",
    label: translateActions("psrBulkEntry"),
    icon: Upload,
    tone: "neutral",
    formKind: "psr-bulk-entry"
  }
]

Do not remove these buttons.
Do not change page route.
Do not change table design.

Required fix 6: Build correct forms for PSR Entry and PSR Bulk Entry

File:
src/app/components/pages/GeneratedTablePage.tsx

Create helper:

function getExtraButtonFields(button): FormField[]

For PSR Entry:
Fields:
- tin: text, required
- taxpayer_name: text, required
- ay: select, required, options AY_OPTS excluding or including existing style
- circle: select, required, options CIRCLES
- zone: select, required, options ZONES
- psr_no: text, optional, helper: auto-generated if blank
- submitted_by: text, required
- submission_date: date, required, defaultValue today
- tax_amount: number, required
- attachments: file, optional, maxFiles 5, maxSizeMB 2
- remarks: textarea, span true

For PSR Bulk Entry:
Fields:
- assessment_year: select, required
- circle: select, required
- zone: select, required
- attachments: file, required, maxFiles 5, maxSizeMB 2
- remarks: textarea, span true

PSR Bulk Entry behavior:
- If user uploads multiple files, create one table row per file.
- Each created row should have:
  - generated id
  - generated tin if missing
  - taxpayer_name from file name or “Bulk Uploaded Taxpayer”
  - ay from form
  - circle from form
  - zone from form
  - generated psr_no
  - submitted_by as “Bulk Upload”
  - submission_date as today
  - tax_amount as “৳0”
  - approval_status as “Pending”
  - source_file as file.name
  - attachment_count as “1 file”
  - attachment_names as file.name
  - remarks from form

PSR Entry behavior:
- Create one table row.
- If psr_no is blank, generate the next PSR number.
- approval_status should default to “Pending”.
- attachment_count should reflect selected files.
- attachment_names should be comma-separated file names.
- Do not store File objects in the table row.
- Only store metadata strings.

Required fix 7: Add row creation helpers

File:
src/app/components/pages/GeneratedTablePage.tsx

Add helpers:

- getTodayISO()
- getNextNumericId(rows)
- getNextCode(rows, key, prefix)
- getFileSummary(files)
- getFileNames(files)
- createPsrEntryRow(values, rows)
- createPsrBulkRows(values, rows)

Expected generated PSR number:
- Find existing `psr_no` values like PSR-7000.
- Generate next available number.
- If no PSR exists, start from PSR-9000 or continue from current max + 1.

Expected row:
{
  id: next id,
  tin,
  taxpayer_name,
  ay,
  circle,
  zone,
  psr_no,
  submitted_by,
  submission_date,
  tax_amount,
  approval_status: "Pending",
  attachment_count,
  attachment_names,
  remarks
}

Required fix 8: Submit handler

File:
src/app/components/pages/GeneratedTablePage.tsx

When regular entry modal submits:
- Create a generic row matching the current page columns.
- Add it to rows state.
- New row should appear at the top of the table.
- Reset to page 1.
- Close modal.
- Show success toast if sonner is already available.

When PSR Entry submits:
- Create one PSR row.
- Add to top of PSR table.
- Reset to page 1.
- Close modal.
- Show success toast.

When PSR Bulk Entry submits:
- Create one row per uploaded file.
- Add all new rows to top of PSR table.
- Reset to page 1.
- Close modal.
- Show success toast:
  “5 entries created”
or translated equivalent.

Do not close modal if required file upload is missing.

Use existing sonner toast.
Do not add a new toast library.

Required fix 9: Show upload metadata in drawer, not necessarily in table

File:
src/app/pages/psr-verification/PSRApprovalPage.tsx

Add drawerCols if needed so uploaded file metadata appears in the detail drawer.

Drawer should show:
Basic Information:
- tin
- taxpayer_name
- ay
- circle
- zone
- psr_no
- approval_status

Submission Information:
- submitted_by
- submission_date
- tax_amount

Attachment Information:
- attachment_count
- attachment_names
- source_file if available
- remarks

Do not add too many new columns to the desktop table.
The table should stay clean.

Required fix 10: Generic entry button pages

Pages with entryBtn:
- Demand Register
- Register-4 List

These should also become minimally functional because they use GeneratedTablePage entry modal.

For generic entry:
- Use current EntryForm fields.
- Create a new row using form values.
- Map field keys to matching table row keys.
- If some fields do not match current page columns, still keep them in rowData for drawer if useful.
- Add the row to the top of the table.
- Reset page to 1.
- Do not break existing mock rows.

Important:
The main focus is PSR Entry and PSR Bulk Entry because they are the pages with file upload option. Generic entry support should not break anything.

Required fix 11: Update translations

Add or reuse keys.

actions.json:
English:
- entryCreated: Entry created successfully
- entriesCreated: {{count}} entries created successfully
- uploadRequired: Please upload at least one file
- formRequired: Please fill in required fields

Bangla:
- entryCreated: এন্ট্রি সফলভাবে তৈরি হয়েছে
- entriesCreated: {{count}}টি এন্ট্রি সফলভাবে তৈরি হয়েছে
- uploadRequired: অন্তত একটি ফাইল আপলোড করুন
- formRequired: অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন

forms.json:
Add helpers if needed:
- fileUpload.bulkHelper
- fields.submittedBy
- fields.submissionDate
- fields.psrNo
- fields.taxAmount
- fields.attachments
- fields.remarks

Do not create duplicate keys if they already exist.

Golden rules:
1. Do not break solved features.
2. Do not redesign the table, modal, drawer, or file upload UI.
3. Do not touch unrelated pages.
4. Make only existing upload-related buttons functional.
5. Do not call backend APIs.
6. Do not upload files to server.
7. Do not store File objects inside table rows.
8. Store only safe file metadata in rows.
9. Do not convert files to base64.
10. Keep max file size 2MB.
11. Keep max file count 5.
12. Keep allowed extensions limited to PDF, JPG, JPEG, PNG, DOC, DOCX, XLS, XLSX.
13. Do not remove file remove/cross option.
14. New entries must appear in the table immediately after submit.
15. New entries should appear at the top of the table.
16. Reset pagination to page 1 after creation.
17. Keep desktop and mobile table behavior working.
18. Keep detail drawer behavior working.
19. Keep copy-to-clipboard behavior working.
20. Keep EN/BN language parity.
21. Keep theme, font, and font-size switching working.
22. No TypeScript errors.
23. No unused imports.
24. No console errors.

Acceptance criteria:
1. PSR Entry button opens a functional form.
2. Filling PSR Entry and submitting creates one new row in the PSR Approval table.
3. PSR Bulk Entry button opens a functional upload form.
4. Uploading 3 files and submitting creates 3 new rows in the PSR Approval table.
5. Uploaded file names are visible in the created row’s detail drawer.
6. File count is visible in the created row’s detail drawer.
7. Unsupported files are rejected.
8. Files larger than 2MB are rejected.
9. More than 5 files cannot be selected.
10. Files can be removed before submit.
11. Required file upload blocks submit if empty.
12. New rows appear at the top of the table.
13. Pagination resets to page 1 after creation.
14. Search can find the newly created rows.
15. Detail drawer opens for newly created rows.
16. Existing mock rows remain unchanged.
17. Demand Register New Entry still opens and can create a row.
18. Register-4 New Entry still opens and can create a row.
19. Mobile view still works.
20. Build passes.