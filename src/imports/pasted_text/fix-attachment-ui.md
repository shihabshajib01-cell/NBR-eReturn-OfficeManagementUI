You are working on the NBR eReturn Office Management UI project, version 40.

Task:
Fix the Attached Files UI and preview modal layering.

Before coding, audit:
- src/app/components/attachments/AttachmentList.tsx
- src/app/components/attachments/AttachmentPreviewModal.tsx
- src/app/components/modals/AppModal.tsx
- src/styles/attachments.css
- src/styles/modals.css
- src/styles/responsive-overlay.css
- src/styles/tokens.css

Current confirmed issues:
1. Attached Files section works, but the item layout can be improved.
2. View, Open, and Download actions are currently squeezed inside the same row as the file name.
3. These actions should be moved into a clear card footer area.
4. Attachment preview modal opens behind the detail drawer.
5. The reason is z-index conflict:
   - ResponsiveOverlay drawer uses z-index 201
   - AppModal uses var(--z-modal)
   - --z-modal is 100
6. Because of this, AttachmentPreviewModal is rendered but visually appears under the drawer.

Required fix 1: Improve Attached Files card layout

File:
src/app/components/attachments/AttachmentList.tsx

Change each attachment item layout from one cramped row into a small card:

Structure:
- attachment-item
  - attachment-item__body
    - attachment-item__icon
    - attachment-item__main
      - attachment-item__name
      - attachment-item__meta
      - attachment-item__note only when preview is unavailable
  - attachment-item__footer
    - View
    - Open
    - Download

Rules:
- File icon, name, size, extension, and uploaded date stay in the card body.
- View/Open/Download actions move to the card footer.
- Footer should only render when there are actions or a preview unavailable message.
- Long file names must truncate with title.
- Footer actions should align cleanly on desktop.
- On mobile, footer actions should stack or wrap cleanly.
- Do not add preview buttons to tables or mobile cards.
- Keep attachment viewer only inside detail drawer content.

Button behavior:
- View:
  - appears for image and PDF files when objectUrl exists
  - opens in-app preview modal
- Open:
  - appears when objectUrl exists
  - opens file in a new tab
- Download:
  - appears when objectUrl exists
  - downloads the file
- Office files:
  - do not show View
  - show Open and Download when objectUrl exists
  - show preview unavailable note
- Metadata-only files:
  - show preview unavailable note
  - no broken buttons

Required fix 2: Fix preview modal layering

Best solution:
Make AppModal support a higher layer for nested modals opened from drawers.

File:
src/app/components/modals/AppModal.tsx

Add optional prop:

layer?: "default" | "top";

Behavior:
- default keeps current modal behavior.
- top adds class:
  app-modal-backdrop--top

Use:
<AppModal layer="top" ...>

Only use this for AttachmentPreviewModal for now.

File:
src/app/components/attachments/AttachmentPreviewModal.tsx

Pass:
layer="top"

Do not change normal modals globally unless required.

File:
src/styles/modals.css

Add:

.app-modal-backdrop--top {
  z-index: 500;
}

This must be higher than:
- responsive overlay backdrop: 200
- responsive overlay drawer: 201
- toast layer if existing toast still appears above or near it

If toast is using z-index 200, do not lower it. If needed, keep preview modal at 500 and toast at existing layer unless toast gets hidden.

Important:
Do not solve this by lowering the drawer z-index.
Do not remove ResponsiveOverlay z-index.
Do not create a second modal system.
Do not render the preview inside the drawer body.
Use portal modal above the drawer.

Required fix 3: Improve preview modal sizing

File:
src/app/components/attachments/AttachmentPreviewModal.tsx

Use AppModal size:
- size="xl" for PDF preview
- size="lg" for image preview
- size="md" for unavailable preview

Or keep size="xl" for all attachment previews if simpler.

Preview content:
- PDF iframe should use most of the modal body height.
- Image preview should fit inside modal without overflow.
- Long file name in modal title must truncate.
- Footer buttons should be aligned right.

Do not add external PDF/image libraries.
Do not use Google Docs viewer.
Do not upload files anywhere.

Required fix 4: Update attachment CSS

File:
src/styles/attachments.css

Update item layout:

.attachment-item {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.attachment-item__body {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  min-width: 0;
}

.attachment-item__main {
  flex: 1;
  min-width: 0;
}

.attachment-item__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 14px 10px;
  border-top: 1px solid var(--color-border-subtle, var(--color-border));
  background: var(--color-background-subtle);
}

.attachment-item__action {
  min-height: 32px;
}

.attachment-item__no-preview {
  display: block;
  padding: 0 14px 10px 40px;
  font-size: 11px;
  color: var(--color-text-secondary);
  font-style: italic;
}

On mobile:
@media (max-width: 640px) {
  .attachment-item__footer {
    justify-content: stretch;
    flex-wrap: wrap;
  }

  .attachment-item__action {
    flex: 1;
    justify-content: center;
  }
}

Preview modal CSS:
- .attachment-preview should not be too small
- .attachment-preview__frame should use height: min(70vh, 680px)
- .attachment-preview__image should use max-height: min(70vh, 680px)
- no horizontal overflow

Required fix 5: Keep drawer behavior unchanged

Do not change:
- DynamicDetailsDrawer attachment extraction
- PSR row creation
- file upload validation
- file upload max size
- file upload max count
- file upload accepted extensions
- copy-to-clipboard
- detail drawer footer buttons
- table rendering
- mobile card rendering

Golden rules:
1. Do not break solved features.
2. Do not redesign the full drawer.
3. Only improve Attached Files UI and preview modal layering.
4. View/Open/Download actions must become card footer actions.
5. Preview modal must appear above the detail drawer.
6. Do not lower drawer z-index.
7. Do not create a new modal system.
8. Use AppModal with a top layer.
9. Do not add file preview buttons to tables or mobile cards.
10. Do not change file upload validation.
11. Do not change backend behavior.
12. Do not store files in localStorage.
13. Do not convert files to base64.
14. Keep desktop and mobile working.
15. Keep EN/BN translation parity.
16. Keep theme, font, and font-size switching working.
17. No TypeScript errors.
18. No unused imports.
19. No console errors.

Acceptance criteria:
1. Attached Files section still appears in detail drawer.
2. File name, size, type, and date appear in the card body.
3. View/Open/Download appear in a separate card footer.
4. Footer actions look clean on desktop.
5. Footer actions wrap or stack cleanly on mobile.
6. Clicking View opens the preview modal above the detail drawer.
7. Preview modal is no longer hidden behind the drawer.
8. PDF preview uses proper modal height.
9. Image preview fits inside the modal.
10. Office files show preview unavailable and still offer Open/Download when possible.
11. Metadata-only files show preview unavailable without broken actions.
12. Drawer remains open behind the preview modal.
13. Closing preview returns user to the same detail drawer.
14. Tables and mobile cards are unchanged.
15. Build passes.