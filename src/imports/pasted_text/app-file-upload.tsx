You are working on the NBR eReturn Office Management UI project, version 39.

Task:
Harden the file upload validation system and fix the Remarks textarea input issue.

Before coding, audit these files:
- src/app/components/forms/AppFileUpload.tsx
- src/app/components/forms/EntryForm.tsx
- src/app/components/forms/AppTextArea.tsx
- src/app/components/pages/GeneratedTablePage.tsx
- src/app/pages/psr-verification/PSRApprovalPage.tsx
- src/styles/forms.css
- src/app/locales/en/forms.json
- src/app/locales/bn/forms.json
- src/app/locales/en/actions.json
- src/app/locales/bn/actions.json

Current confirmed issue:
AppFileUpload only checks:
- extension
- file size
- file count
- duplicate file

This is not enough. A user can rename a dangerous file like:
example.exe → example.png
and the current validator may allow it.

Required file security improvement:
Add layered frontend validation:
1. Extension check
2. Browser MIME type check
3. File magic number / signature check
4. Dangerous file signature blocker
5. Office document internal marker check for DOCX/XLSX
6. Clear user-friendly error messages

Important:
This is frontend validation only. Backend must still validate files again before accepting real uploads. Do not claim frontend validation is enough for production security.

Target component:
src/app/components/forms/AppFileUpload.tsx

Keep existing rules:
- max file size: 2MB
- max file count: 5
- allowed file types:
  .pdf
  .jpg
  .jpeg
  .png
  .doc
  .docx
  .xls
  .xlsx

Do not add backend upload.
Do not convert files to base64.
Do not store file content in localStorage.
Do not add external libraries.
Do not remove the file remove/cross button.
Do not redesign the upload UI.

Implementation plan:

1. Replace simple extension-only validation

Current helper:
ext(name)

Keep extension helper, but add these helpers:

- getExtension(fileName: string): string
- readFileHeader(file: File, bytes?: number): Promise<Uint8Array>
- readFileBuffer(file: File): Promise<ArrayBuffer>
- hasBytes(bytes: Uint8Array, signature: number[], offset?: number): boolean
- hasAsciiPrefix(bytes: Uint8Array, text: string): boolean
- includesAscii(buffer: ArrayBuffer, text: string): boolean
- isDangerousSignature(bytes: Uint8Array): boolean
- validateMimeForExtension(file: File, extension: string): boolean
- validateMagicSignature(file: File, extension: string): Promise<boolean>

2. Add allowed MIME map

Use this structure:

const ALLOWED_FILE_RULES = {
  ".pdf": {
    mime: ["application/pdf"],
    magic: [[0x25, 0x50, 0x44, 0x46]]
  },
  ".png": {
    mime: ["image/png"],
    magic: [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]]
  },
  ".jpg": {
    mime: ["image/jpeg"],
    magic: [[0xFF, 0xD8, 0xFF]]
  },
  ".jpeg": {
    mime: ["image/jpeg"],
    magic: [[0xFF, 0xD8, 0xFF]]
  },
  ".doc": {
    mime: ["application/msword"],
    magic: [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]]
  },
  ".xls": {
    mime: ["application/vnd.ms-excel"],
    magic: [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]]
  },
  ".docx": {
    mime: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    magic: [[0x50, 0x4B, 0x03, 0x04]]
  },
  ".xlsx": {
    mime: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    magic: [[0x50, 0x4B, 0x03, 0x04]]
  }
};

MIME rule:
- If file.type is empty, do not fail immediately.
- If file.type exists and does not match the allowed MIME list, reject.
- Allow common browser fallback MIME only when magic signature is valid:
  - application/octet-stream
  - application/zip for docx/xlsx only
  - application/x-ole-storage for old doc/xls only

3. Add dangerous signature blocker

Before allowed type validation, block files with dangerous signatures.

Block:
- Windows executable: MZ header
  - bytes: 0x4D, 0x5A
- ELF executable:
  - bytes: 0x7F, 0x45, 0x4C, 0x46
- Mach-O executable:
  - 0xFE, 0xED, 0xFA, 0xCE
  - 0xFE, 0xED, 0xFA, 0xCF
  - 0xCF, 0xFA, 0xED, 0xFE
  - 0xCE, 0xFA, 0xED, 0xFE
- Shell script:
  - ASCII "#!"
- HTML file:
  - starts with <!doctype html
  - starts with <html
- JavaScript-like file:
  - starts with common text/script patterns if renamed as allowed file

If dangerous signature is found:
Reject the file even if extension is allowed.

4. Validate real content signature

For each file:
- Check extension is allowed.
- Check file size.
- Check duplicate.
- Read first 16 or 32 bytes.
- Block dangerous signatures.
- Match allowed magic number.

Examples:
- .png must start with PNG signature.
- .jpg/.jpeg must start with JPEG signature.
- .pdf must start with %PDF.
- .doc/.xls must start with OLE compound document signature.
- .docx/.xlsx must start with ZIP signature.

5. Validate DOCX/XLSX internal markers

Because DOCX and XLSX are ZIP-based, a normal ZIP renamed to .docx should not pass.

For max 2MB files, read the full ArrayBuffer.

DOCX must contain:
- [Content_Types].xml
- word/

XLSX must contain:
- [Content_Types].xml
- xl/

If those markers are missing:
Reject the file.

Do not add JSZip or any external package. Use TextDecoder or byte-to-string scanning.

6. Make validateAndAdd async

In AppFileUpload.tsx:

- Change validateAndAdd to async.
- Change handleInputChange to async.
- Change handleDrop to async.
- Add validating state:
  const [validating, setValidating] = useState(false);

While validating:
- disable dropzone
- optionally show “Checking files...”
- prevent duplicate clicks

Validation should process files one by one.

Pseudo behavior:

async function validateFile(file: File): Promise<{ ok: true } | { ok: false; error: string }> {
  check extension
  check size
  check MIME
  read header
  block dangerous signature
  check allowed magic
  if docx/xlsx read buffer and check internal markers
  return result
}

7. Improve errors

Add translation keys in forms.json.

English:
fileUpload.checking: Checking files...
fileUpload.errors.disguised: {{name}} does not match its file type. Please upload a valid {{type}} file.
fileUpload.errors.dangerous: {{name}} appears to be an unsafe executable or script file.
fileUpload.errors.mimeMismatch: {{name}} has a mismatched file type.
fileUpload.errors.invalidOfficeFile: {{name}} is not a valid Office document.
fileUpload.errors.readFailed: Could not read {{name}}. Please try another file.

Bangla:
fileUpload.checking: ফাইল যাচাই করা হচ্ছে...
fileUpload.errors.disguised: {{name}} ফাইলটির ধরন সঠিক নয়। অনুগ্রহ করে বৈধ {{type}} ফাইল আপলোড করুন।
fileUpload.errors.dangerous: {{name}} ফাইলটি নিরাপদ নয় বা executable/script ফাইল হতে পারে।
fileUpload.errors.mimeMismatch: {{name}} ফাইলের ধরন মিলছে না।
fileUpload.errors.invalidOfficeFile: {{name}} বৈধ Office ডকুমেন্ট নয়।
fileUpload.errors.readFailed: {{name}} পড়া যায়নি। অনুগ্রহ করে অন্য ফাইল ব্যবহার করুন।

Keep existing error keys:
- tooLarge
- unsupported
- maxFiles
- duplicate

8. Fix Remarks textarea input issue

Files:
- src/app/components/forms/EntryForm.tsx
- src/app/components/forms/AppTextArea.tsx

Current issue:
Remarks textarea can appear, but user cannot input reliably / field handling is incomplete.

Required fixes:

In EntryForm.tsx:
- Make textarea handling match other fields.
- Pass error={errors[id]} to AppTextArea.
- Clear validation error when user types.

Change textarea block to this behavior:

<AppTextArea
  id={id}
  label={f.label}
  value={values[id] ?? ""}
  onChange={(v) => {
    setStr(id, v);
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }}
  placeholder={f.placeholder}
  required={f.required}
  helper={f.helper}
  error={errors[id]}
  rows={4}
/>

In AppTextArea.tsx:
- Keep it controlled.
- Make sure onChange receives e.target.value.
- Add name={id}.
- Add minRows or rows safely.
- Do not disable textarea.
- Do not add maxLength.
- Do not block typing.
- Keep fullWidth.

If MUI multiline typing still fails, replace rows with minRows:
- multiline
- minRows={rows}
- maxRows={8}

Do not change AppTextField, AppSelectField, AppDateField, or AppNumberField unless required.

9. Add tests

Add or update tests if test setup supports it:

- AppFileUpload rejects renamed executable:
  create File with MZ header and name "fake.png"
  expect error dangerous/disguised

- AppFileUpload accepts real PNG:
  file starts with PNG signature
  name "valid.png"

- AppFileUpload rejects normal ZIP renamed as DOCX:
  starts with PK but missing word/ marker

- EntryForm textarea works:
  render EntryForm with remarks textarea
  type text
  submit
  expect values.remarks equals typed text

Golden rules:
1. Do not break solved features.
2. Do not redesign the upload UI.
3. Do not change max file count: 5.
4. Do not change max file size: 2MB.
5. Do not add backend upload.
6. Do not add external libraries.
7. Do not store file contents in rows.
8. Do not convert files to base64.
9. Do not rely only on file extension.
10. Do not rely only on MIME type.
11. Use extension + MIME + magic signature validation.
12. Block disguised executable/script files.
13. Keep file remove/cross option working.
14. Keep selected file list working.
15. Keep PSR Entry and PSR Bulk Entry row creation working.
16. Fix Remarks textarea without changing other form behavior.
17. Keep EN/BN translation parity.
18. Keep theme, font, and font-size switching working.
19. No TypeScript errors.
20. No unused imports.
21. No console errors.

Acceptance criteria:
1. A real PNG file uploads successfully.
2. A real PDF file uploads successfully.
3. A real JPG/JPEG file uploads successfully.
4. A valid DOCX with word/ marker uploads successfully.
5. A valid XLSX with xl/ marker uploads successfully.
6. A .exe renamed to .png is rejected.
7. A .exe renamed to .pdf is rejected.
8. A shell script renamed to .jpg is rejected.
9. An HTML file renamed to .pdf is rejected.
10. A normal ZIP renamed to .docx is rejected.
11. A file with mismatched MIME type is rejected.
12. File larger than 2MB is rejected.
13. More than 5 files are rejected.
14. Duplicate file is rejected.
15. User can remove selected files.
16. Remarks textarea accepts typing.
17. Remarks value is included in the submitted row.
18. PSR Entry still creates one table row.
19. PSR Bulk Entry still creates one row per file.
20. Build and tests pass.