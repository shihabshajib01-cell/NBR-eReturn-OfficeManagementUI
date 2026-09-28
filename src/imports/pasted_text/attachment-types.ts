You are working on the NBR eReturn Office Management UI project, version 39.

Task:
Add a proper “View Attached Files” function inside detail drawers for all records that have uploaded files.

Current confirmed state:
1. File upload is handled by:
   - src/app/components/forms/AppFileUpload.tsx
   - src/app/components/forms/EntryForm.tsx
2. File upload rows are created in:
   - src/app/components/pages/GeneratedTablePage.tsx
3. PSR Entry and PSR Bulk Entry already create table rows.
4. New rows currently store:
   - attachment_count
   - attachment_names
   - source_file
5. Detail drawers are rendered through:
   - src/app/components/drawers/DynamicDetailsDrawer.tsx
6. The drawer currently shows uploaded files as plain text only.
7. The user needs to view attached files from the detail drawer.

Important rules:
- This is still frontend-only.
- Do not upload files to a backend.
- Do not store file content in localStorage.
- Do not convert files to base64.
- Do not store raw File objects directly inside table-rendered cells.
- Use temporary object URLs only for current-session viewing.
- Revoke object URLs when no longer needed.
- If a file only has metadata and no object URL, show the file name but disable preview with a clear message.

Feature requirement:
Every detail drawer that has file-related data must show an “Attached Files” section with a clean uploaded file list and view options.

Target files:
- src/app/components/pages/GeneratedTablePage.tsx
- src/app/components/drawers/DynamicDetailsDrawer.tsx
- src/app/components/forms/AppFileUpload.tsx
- src/app/components/forms/EntryForm.tsx
- src/app/pages/modulePageUtils.ts
- src/styles/drawers.css
- src/styles/forms.css
- src/app/locales/en/forms.json
- src/app/locales/bn/forms.json
- src/app/locales/en/actions.json
- src/app/locales/bn/actions.json
- src/app/locales/en/drawers.json
- src/app/locales/bn/drawers.json

Step 1: Add attachment metadata type

Create:
src/app/components/attachments/attachmentTypes.ts

Add:

export type AttachmentPreviewKind = "image" | "pdf" | "office" | "unknown";

export interface AttachmentItem {
  id: string;
  name: string;
  size: number;
  sizeLabel: string;
  type: string;
  extension: string;
  previewKind: AttachmentPreviewKind;
  objectUrl?: string;
  uploadedAt?: string;
}

Add helper:
getAttachmentPreviewKind(fileName: string, mimeType?: string): AttachmentPreviewKind

Rules:
- jpg, jpeg, png => image
- pdf => pdf
- doc, docx, xls, xlsx => office
- others => unknown

Add helper:
formatFileSize(bytes: number): string

Step 2: Store attachment metadata when rows are created

File:
src/app/components/pages/GeneratedTablePage.tsx

Add helper:
createAttachmentItems(files: File[]): AttachmentItem[]

Behavior:
- For each selected file:
  - generate stable id
  - store file.name
  - store file.size
  - store formatted size
  - store file.type
  - store extension
  - store previewKind
  - create objectUrl with URL.createObjectURL(file)
  - store uploadedAt as today/current ISO time

Do not store the raw File object.
Do not convert to base64.

Update createPsrEntryRow:
- Add `attachments: createAttachmentItems(files)`
- Keep existing:
  - attachment_count
  - attachment_names
  - remarks

Update createPsrBulkRows:
- For each file row:
  - Add `attachments: createAttachmentItems([file])`
  - Keep:
    - source_file
    - attachment_count
    - attachment_names

Update createGenericRow:
- For file fields:
  - Store `${key}_count`
  - Store `${key}_names`
  - Also store `${key}` as AttachmentItem[]
  - Example: key `attachments` stores real attachment metadata array in `attachments`

Step 3: Update TableRow type safely

File:
src/app/pages/modulePageUtils.ts

Current TableCellValue is too strict for attachment arrays.

Update safely:

import type { AttachmentItem } from "../components/attachments/attachmentTypes";

export type TableCellValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | AttachmentItem[];

Make sure desktop tables and mobile cards do not try to render attachment arrays as `[object Object]`.

Step 4: Protect table rendering from attachment arrays

File:
src/app/components/tables/CardTable.tsx
File:
src/app/components/tables/UnifiedMobileCard.tsx

If a cell value is an array:
- If array contains attachment objects:
  - render a compact text like “3 files”
  - title should be the file names
- Do not render `[object Object]`
- Do not add file viewer to tables
- Do not add “View” buttons in table cells
- Detail drawer is the only place to view files

Step 5: Add attachment viewer component

Create:
src/app/components/attachments/AttachmentList.tsx

Props:
interface AttachmentListProps {
  attachments: AttachmentItem[];
  title?: string;
  emptyText?: string;
}

UI:
- Section title: “Attached Files”
- Show count: “3 files”
- Each file row:
  - file icon based on type
  - file name
  - file size
  - file type/extension
  - uploaded date if available
  - actions:
    - View
    - Open
    - Download only if objectUrl exists
- Long file names must truncate with title.
- No horizontal overflow.
- Mobile layout must stack cleanly.

View behavior:
- Image files:
  - open an in-app preview modal
  - show image preview
- PDF files:
  - open an in-app preview modal using iframe/object
  - fallback to “Open in new tab” if iframe fails
- Office files:
  - show preview unavailable message
  - provide “Open file” if objectUrl exists
  - provide “Download” if objectUrl exists
- Metadata-only files:
  - show file name and size/type if available
  - disable View/Open
  - show note: “Preview unavailable for this file”

Create:
src/app/components/attachments/AttachmentPreviewModal.tsx

Use existing AppModal if suitable:
- src/app/components/modals/AppModal.tsx

Do not create a separate modal system.

Preview modal:
- title = file name
- image preview uses img
- PDF preview uses iframe or object
- office/unknown shows message
- footer can have Close and Open/Download if objectUrl exists

Important:
Do not use external preview libraries.
Do not use Google Docs viewer.
Do not upload files anywhere.

Step 6: Extract attachments inside DynamicDetailsDrawer

File:
src/app/components/drawers/DynamicDetailsDrawer.tsx

Add helper:
extractAttachments(rowData: TableRow): AttachmentItem[]

Detection:
1. If rowData.attachments is AttachmentItem[], use it.
2. Also support keys ending with:
   - _attachments
   - attachment_files
   - uploaded_files
   - files
3. If only attachment_names/source_file exists as string:
   - create metadata-only AttachmentItem objects with no objectUrl
   - split comma-separated attachment_names
   - source_file creates one metadata-only item if no attachments array exists

Add helper:
isAttachmentMetadataKey(key: string): boolean

Should return true for:
- attachments
- attachment_count
- attachment_names
- source_file
- uploaded_files
- file_names
- file_count
- file_upload
- document_names

Behavior:
- Render AttachmentList once in the drawer when attachments exist.
- Place it after the summary card and before normal grouped sections.
- Exclude attachment metadata keys from normal field rendering to avoid duplicate plain text sections.
- Do not hide remarks.
- Do not hide normal fields.

Update validColumns filter:
- Exclude attachment metadata keys from normal grouped fields only if AttachmentList will render them.
- If metadata exists but cannot be parsed, still show it safely in AttachmentList.

Step 7: Add attachment group labels and translations

forms.json or drawers.json:

English:
attachments.title: Attached Files
attachments.fileCount: {{count}} files
attachments.singleFile: 1 file
attachments.view: View
attachments.open: Open
attachments.download: Download
attachments.previewUnavailable: Preview unavailable for this file
attachments.metadataOnly: File preview is not available because only file metadata is stored.
attachments.noFiles: No files attached
attachments.imagePreview: Image preview
attachments.pdfPreview: PDF preview
attachments.officePreviewUnavailable: Office document preview is not available in this static frontend.

Bangla:
attachments.title: সংযুক্ত ফাইল
attachments.fileCount: {{count}}টি ফাইল
attachments.singleFile: ১টি ফাইল
attachments.view: দেখুন
attachments.open: খুলুন
attachments.download: ডাউনলোড
attachments.previewUnavailable: এই ফাইলের প্রিভিউ পাওয়া যাচ্ছে না
attachments.metadataOnly: শুধু ফাইলের তথ্য সংরক্ষিত আছে, তাই প্রিভিউ দেখানো যাচ্ছে না।
attachments.noFiles: কোনো ফাইল সংযুক্ত নেই
attachments.imagePreview: ছবির প্রিভিউ
attachments.pdfPreview: PDF প্রিভিউ
attachments.officePreviewUnavailable: এই static frontend-এ Office ডকুমেন্ট প্রিভিউ দেখানো যাচ্ছে না।

Use the project’s existing namespace pattern. Do not create duplicate keys.

Step 8: CSS

File:
src/styles/drawers.css
or create:
src/styles/attachments.css
and import it in src/styles/index.css

Add classes:
- .attachment-list
- .attachment-list__header
- .attachment-list__title
- .attachment-list__count
- .attachment-list__items
- .attachment-item
- .attachment-item__icon
- .attachment-item__main
- .attachment-item__name
- .attachment-item__meta
- .attachment-item__actions
- .attachment-item__action
- .attachment-preview
- .attachment-preview__frame
- .attachment-preview__image
- .attachment-preview__empty

Design rules:
- Match existing drawer card style.
- Use existing border, radius, spacing, and color tokens.
- File rows must be compact.
- Long file names must truncate.
- Actions must not wrap awkwardly.
- On mobile, actions can wrap below the file name.
- No horizontal scroll inside drawer.

Step 9: Revoke object URLs safely

File:
src/app/components/pages/GeneratedTablePage.tsx

Because rows store temporary object URLs:
- Add cleanup on unmount.
- Revoke object URLs created for rows when component unmounts.
- Do not revoke immediately after row creation, because drawer preview needs them.
- Helper:
  revokeRowAttachmentUrls(rows: TableRow[])

Use useEffect cleanup:
useEffect(() => {
  return () => {
    revokeRowAttachmentUrls(rowsRef.current);
  };
}, []);

Use a ref to keep latest rows:
const rowsRef = useRef(rows);
useEffect(() => { rowsRef.current = rows; }, [rows]);

Do not revoke URLs from original mock rows because they do not have objectUrl.

Step 10: PSR drawer expected behavior

When user creates PSR Entry with 2 uploaded files:
- Row appears in PSR Approval table.
- Opening detail drawer shows:
  - Attached Files section
  - both files listed
  - file names
  - size
  - type
  - View/Open buttons depending on file type
- Image and PDF can be previewed.
- DOC/DOCX/XLS/XLSX show preview unavailable but still show metadata and open/download if objectUrl exists.

When user creates PSR Bulk Entry with 3 files:
- 3 rows appear in the table.
- Each row detail drawer shows one attached file.

Step 11: Generic generated pages

If any other GeneratedTablePage form uses file type:
- It must automatically store attachment metadata.
- Detail drawer must automatically show Attached Files.
- Do not add page-specific code unless required.

Step 12: Tests

Add/update tests if setup supports it:
- AttachmentList renders file names.
- DynamicDetailsDrawer renders Attached Files when rowData.attachments exists.
- DynamicDetailsDrawer does not render raw `[object Object]`.
- CardTable renders attachment array as “N files”.
- PSR row creation stores attachment metadata, not raw File objects.
- Metadata-only attachment_names still renders an attachment list.

Golden rules:
1. Do not break solved features.
2. Do not redesign the drawer.
3. Add attachment viewing only inside detail drawer content.
4. Do not add attachment viewers to tables or mobile cards.
5. Do not store raw File objects in table row cells.
6. Do not store files in localStorage.
7. Do not convert files to base64.
8. Use object URLs only for current-session preview.
9. Revoke object URLs safely.
10. Do not call backend APIs.
11. Do not upload files to a server.
12. Keep existing file validation rules and disguised-file blocking.
13. Keep max file size 2MB.
14. Keep max file count 5.
15. Keep allowed extensions unchanged.
16. Keep remarks field working.
17. Keep copy-to-clipboard working.
18. Keep desktop and mobile drawer behavior working.
19. Keep EN/BN translation parity.
20. Keep theme, font, and font-size switching working.
21. No TypeScript errors.
22. No unused imports.
23. No console errors.

Acceptance criteria:
1. Uploaded files appear in the detail drawer.
2. Detail drawer shows an “Attached Files” section.
3. Multiple files are listed separately.
4. Long file names truncate safely.
5. Image attachments can be previewed.
6. PDF attachments can be previewed or opened.
7. Office files show preview unavailable but still show file metadata.
8. Metadata-only files show a clear preview unavailable note.
9. Tables do not show `[object Object]`.
10. Tables do not get file preview buttons.
11. Mobile cards do not get file preview buttons.
12. PSR Entry attachments show in drawer.
13. PSR Bulk Entry attachments show in drawer.
14. Any future GeneratedTablePage file field automatically works.
15. No horizontal scroll appears in the drawer because of file names.
16. Build passes.