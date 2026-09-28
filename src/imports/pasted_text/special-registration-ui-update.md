# Master Prompt — Special Registration UI Alignment, Drawer Rebuild, and Admin Edit Flow

Work inside the uploaded **NBR-eReturn-Office Management UI (50)** project.

Fix the Special Registration module so it follows the project’s current table, filter, drawer, modal, form, stepper, button, attachment, responsive, and translation patterns.

Implement only these changes:

1. Make the Special Registration table toolbar and filters match the current Role Management and Permission List design.
2. Rebuild the Special Registration details drawer using the current shared drawer design system.
3. Add an Edit action to pending applications.
4. Open the existing Phase 1 four-step Special Registration form inside the project’s current modal system.
5. Save edits back to the same shared Special Registration repository so the table, drawer, attachments, and Phase 1-to-Phase 2 connection remain intact.

Do not invent a new table, filter panel, drawer, stepper, form, modal, file uploader, attachment viewer, button style, or data source.

---

## Files to inspect before changing anything

Review the current implementation and reuse its existing patterns:

* `src/app/pages/administration-requests/SpecialRegistrationPage.tsx`
* `src/app/components/special-registration/SpecialRegistrationDrawer.tsx`
* `src/app/pages/public/SpecialRegistrationPublicPage.tsx`
* `src/app/pages/administration-requests/RoleManagementPage.tsx`
* `src/app/components/roles/CreateEditRoleModal.tsx`
* `src/app/components/users/UserComponents.tsx`
* `src/app/components/drawers/DynamicDetailsDrawer.tsx`
* `src/app/components/shared/ResponsiveOverlay.tsx`
* `src/app/components/modals/AppModal.tsx`
* `src/app/components/tables/ResponsiveTable.tsx`
* `src/app/components/tables/CardTable.tsx`
* `src/app/components/tables/UnifiedMobileCard.tsx`
* `src/app/components/filters/FilterPanel.tsx`
* `src/app/components/filters/MobileFilterOverlay.tsx`
* `src/app/components/filters/AppliedFilterChips.tsx`
* `src/app/components/forms/AppSearchField.tsx`
* `src/app/components/forms/AppFileUpload.tsx`
* `src/app/components/attachments/AttachmentList.tsx`
* `src/app/components/attachments/AttachmentPreviewModal.tsx`
* `src/app/services/repositories/specialRegistrationRepository.ts`
* `src/app/services/specialRegistrationPublicService.ts`
* `src/styles/globals.css`
* `src/styles/tables.css`
* `src/styles/filters.css`
* `src/styles/drawers.css`
* `src/styles/modals.css`
* `src/styles/roles.css`
* `src/styles/special-registration.css`
* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`

---

# 1. Fix the Special Registration table toolbar and filter UI

## Current problem

The Special Registration page does not follow the project’s current table-toolbar pattern.

It currently:

* Shows search and record count without a table title.
* Shows the desktop filter panel permanently.
* Does not use the current Filter button.
* Displays an incorrect count label such as `7 application no`.
* Manually switches between `CardTable` and `UnifiedMobileCard`.
* Does not follow the same toolbar hierarchy used by Role Management.

## Required toolbar structure

Update `SpecialRegistrationPage.tsx` to follow the same structure used in `RoleManagementPage.tsx`.

The toolbar must contain:

### Left side

* Table title: **All Applications**
* Record-count pill: **7 records**

Use the existing classes:

* `table-card__title-group`
* `table-card__title`
* `table-card__count`

Use the existing common translation for “records”. Do not generate the count label from the Application No. column title.

### Right side

* Existing `AppSearchField`
* Existing Filter button with the `Filter` Lucide icon

Use:

* `table-card__search-wrapper`
* `table-card__toolbar-btn`
* `table-card__toolbar-btn--active`

The Filter button must use `aria-expanded`.

Do not use an inline minimum width on the search wrapper. Follow the existing CSS.

## Desktop filter behaviour

The filter panel must be collapsed by default.

Clicking Filter must toggle the existing `FilterPanel`.

Use the same condition as Role Management:

```tsx
{isDesktop && showFilter && (
  <div className="table-card__filter-panel">
    <FilterPanel ... />
  </div>
)}
```

Do not show the filters permanently.

Keep the current Special Registration filters:

* Request Type
* Status
* Country of Residence
* From Date
* To Date

Keep the current working filtering logic and repository query.

## Mobile filter behaviour

On mobile:

* Keep search and Filter in the same row.
* Use the existing global mobile toolbar layout.
* The Filter button must open `MobileFilterOverlay`.
* The overlay must continue opening from the bottom.
* Do not display the desktop filter panel.
* Do not introduce a second mobile toolbar implementation.

Remove the Special Registration-specific use of `MobileSearchFilter` if the normal `AppSearchField + Filter button` toolbar can follow the same Role Management pattern.

## Applied filters

Continue using `AppliedFilterChips`.

Render it using the same placement and behaviour as Role Management:

```tsx
<AppliedFilterChips
  values={appliedFilters}
  onClear={handleResetFilters}
  inCard
/>
```

Remove the custom inline padding wrapper.

## Responsive table

Replace the manual desktop/mobile rendering in `SpecialRegistrationPage.tsx`.

Remove direct imports and usage of:

* `CardTable`
* `UnifiedMobileCard`

Use the existing `ResponsiveTable` component instead.

Pass:

* Existing column definitions
* Existing rows
* `ROW_VIEW`
* Row-click handler
* Action-click handler
* `noCard`
* Existing Special Registration mobile mapping
* Accessible table label

Use this mapping:

```ts
const SPECIAL_REGISTRATION_MOBILE_MAPPING = {
  primary: "applicantName",
  identifier: "applicationNumber",
  meta: ["requestTypeLabel", "tin", "country"],
  date: "submittedAtLabel",
  status: "statusLabel",
};
```

Rules:

* Desktop keeps the View Details row action.
* Mobile cards open details by tapping the entire card.
* Do not add a mobile View Details button.
* Preserve current mobile card borders, spacing, and status treatment.

## Page summary toggle

Replace hard-coded `Hide Summary` and `Show Summary` text with the existing actions translations already used by Role Management.

Use the current Chevron Up and Chevron Down icon pattern.

Do not change the KPI cards or their calculations.

---

# 2. Rebuild the Special Registration details drawer

## Current problem

The Special Registration drawer uses a custom layout that does not match the current drawer design system.

Visible issues include:

* Labels and values appear joined together, such as `APPLICATION NUMBERSR-NRB...`.
* Information is displayed as loose rows rather than the current card-based sections.
* The summary area does not match Role Management, User Management, or `DynamicDetailsDrawer`.
* Footer actions do not follow the current segmented drawer-action layout.
* The drawer is wider and visually different from other Administration drawers.

## Drawer shell

Continue using `ResponsiveOverlay`.

Use the existing default desktop width or explicitly use:

```tsx
desktopWidth="480px"
```

Keep:

* Existing header
* Existing close button
* Existing focus trap
* Existing responsive mobile overlay
* Existing body scroll
* Existing sticky footer

Do not build a custom drawer shell.

## Summary block

Replace the custom `.sr-drawer__summary*` implementation with the existing generic drawer summary pattern from `DynamicDetailsDrawer`.

Use:

* `drawer-summary`
* `drawer-summary__main`
* `drawer-summary__name`
* `drawer-summary__subtitle`
* `drawer-summary__id`
* `drawer-summary__id-label`
* `drawer-summary__meta`
* `drawer-summary__status`

Display:

* Applicant name
* Request type
* Application number with `CopyValueButton`
* Submission date and time
* Current `StatusBadge`

Status must remain aligned at the upper-right of the summary card.

Use `SafeText` or `ExpandableText` for long applicant names, request labels, application numbers, and dates.

## Information sections

Remove the current local `SectionHeading` and `FieldRow` layout.

Do not continue using:

* `sr-drawer__section-heading`
* `record-drawer__field`
* `record-drawer__field-label`
* `record-drawer__field-value`

Use the existing generic card-based drawer structure:

* `detail-section`
* `detail-section__head`
* `detail-section__head--static`
* `drawer-field-grid`
* `drawer-field`
* `drawer-field--wide`
* `drawer-field__label`
* `drawer-field__value`
* `drawer-field__value-row`

Create these existing-style section cards:

### Request Information

* Application Number
* Request Type
* Submission Date and Time
* Current Status

### Taxpayer Information

* Full Name
* TIN

### Overseas Residence and Contact

* Country of Residence
* Full Overseas Address
* Foreign Mobile or Telephone Number
* Email Address

Make the address and email full-width fields where needed.

### Departure Information

* Last Date of Departure from Bangladesh

### Applicant Declaration

* Declaration text
* Accepted
* Declaration timestamp

The declaration text must use `ExpandableText` and span the full card width.

### Review Information

For pending records:

* Current status
* Not yet reviewed

For processed records:

* Final decision
* Reviewed by
* Reviewer designation
* Review date and time
* Approval note when present
* Rejection reason when present

### Decision History

Keep the existing decision history data and timeline behaviour.

Update the styling so it sits cleanly below the card sections and uses theme tokens.

Do not remove submitted, approved, rejected, or edited history entries.

## Copy actions

Continue using the existing `CopyValueButton` for:

* Application number
* TIN
* Phone
* Email

Place copy controls inside `drawer-field__value-row`.

Do not place copy icons directly against labels.

## Submitted documents

Continue using the existing `AttachmentList`.

Do not create a new document card or attachment viewer.

Keep the four categories:

* NID or Smart ID Copy
* Bio Page of Bangladeshi Passport
* Visa or Residence Page
* Latest Bangladesh Departure Seal

Each category must keep:

* File name
* File metadata
* View
* Open
* Download
* Empty state
* Required or Optional label

The attachment preview must continue opening above the drawer through the existing `AttachmentPreviewModal`.

Do not change file security, object URL handling, downloads, or preview logic.

Use only minimal scoped spacing inside `special-registration.css` around the existing `AttachmentList` cards.

---

# 3. Add the current drawer footer pattern

## Pending application footer

Add three actions:

1. Edit
2. Reject Application
3. Approve Application

Use the project’s existing drawer footer classes:

* `drawer-action-footer`
* `drawer-action-footer__row`
* `drawer-action-footer__divider`
* `action-btn`
* `action-btn--primary-soft`
* `action-btn--danger`
* `action-btn--primary`

Recommended layout:

```tsx
<div className="drawer-action-footer">
  <div className="drawer-action-footer__row drawer-action-footer__row--single">
    Edit
  </div>

  <div className="drawer-action-footer__divider" />

  <div className="drawer-action-footer__row">
    Reject Application
    Approve Application
  </div>
</div>
```

Use:

* `Pencil` icon for Edit
* Existing reject icon if already available, otherwise `XCircle`
* Existing approve icon if already available, otherwise `CheckCircle`

Do not create custom button CSS.

Keep Approve disabled for an incomplete application.

Keep Reject available for an incomplete application.

## Processed application footer

Approved and rejected applications are final and must remain read-only.

For Approved or Rejected records:

* Do not show Approve.
* Do not show Reject.
* Do not show Edit.
* Preserve the existing final status, reviewer information, and history.

This protects the existing approval and rejection audit trail.

---

# 4. Reuse the Phase 1 wizard for admin editing

## Important implementation rule

Do not copy the Phase 1 form JSX into a second modal.

The current public form already contains:

* Four-step stepper
* Request Type
* Applicant Details
* Documents
* Review & Submit
* Validation
* File upload
* Review checklist
* Navigation
* EN/BN translations

Extract the existing implementation into a shared Special Registration wizard and render the same shared code in both places.

A new file is allowed only to extract existing Phase 1 code for reuse. Do not create a different UI.

Suggested location:

`src/app/components/special-registration/SpecialRegistrationWizard.tsx`

Move or export the existing reusable pieces from `SpecialRegistrationPublicPage.tsx`:

* `FormState`
* `FieldErrors`
* `INITIAL_FORM`
* `normalizeTin`
* `validateStep`
* `Stepper`
* `Step1`
* `Step2`
* `Step3`
* `Step4`
* `ReviewRow`
* `ReviewDocRow`
* Request-label helper
* Field-to-payload mapping helpers

The public page must continue rendering the same UI and behaviour after extraction.

Do not move these public-page-only elements into the shared wizard:

* Public header
* NBR logo
* Language control
* Eligibility introduction
* Back to Login
* Public success screen
* Public Fresh Teal theme handling

---

# 5. Create the admin edit modal using the current modal system

Create a focused modal component in the existing Special Registration component folder, for example:

`src/app/components/special-registration/SpecialRegistrationEditModal.tsx`

This is not a new design. It must combine:

* Existing `AppModal`
* Existing Phase 1 wizard
* Existing action buttons
* Existing file uploader
* Existing validation
* Existing translation namespace

Use:

```tsx
<AppModal
  open={open}
  title={...}
  size="xl"
  layer="top"
  onClose={...}
  footer={...}
>
```

The modal title must be:

**Edit Special Registration Application**

Use the existing `Pencil` icon in the header.

## Opening behaviour

Follow the existing Role Management edit pattern.

When Edit is selected from the drawer:

1. Store the selected application as the editing record.
2. Close the details drawer.
3. Open the edit modal.
4. Prefill all wizard steps.

Do not keep the drawer visibly open behind the edit modal.

## Prefilled values

Map the application into the existing Phase 1 form state:

* `requestType` → request type
* `applicantName` → full name
* `tin` → TIN
* `country` → country
* `address` → address
* `phone` → phone
* `departureDate` → departure date
* `email` → email
* NID documents → `nidFiles`
* Passport bio documents → `passportFiles`
* Visa documents → `visaFiles`
* Departure-seal documents → `departureFiles`
* `declarationAccepted` → declaration state

Use the original `File` objects from `SRDocument.file`.

Do not convert files to Base64.

Do not store files in Redux, local storage, or session storage.

## Modal steps

Use the same four Phase 1 steps:

1. Request Type
2. Applicant Details
3. Documents
4. Review & Save

Keep the exact existing Phase 1:

* Stepper visuals
* Form sections
* MUI fields
* Validation messages
* Secure file uploader
* Document checklist
* Responsive behaviour

Do not use the Role Management `crm-stepper` for this form. The requirement is to reuse the Phase 1 Special Registration stepper.

## Declaration in admin edit mode

An officer must not re-declare information on behalf of the applicant.

In admin edit mode:

* Preserve the applicant’s existing declaration value.
* Show the declaration in the Review step as read-only.
* Do not let the officer check or uncheck the declaration.
* Do not change the declaration timestamp.

## Modal footer

Follow the existing Create/Edit Role modal footer behaviour:

Left:

* Cancel

Right:

* Back, when not on Step 1
* Next, before the final step
* Save Changes, on the final step

Use existing:

* `action-btn action-btn--secondary`
* `action-btn action-btn--primary`

Do not create new button components.

Keep the modal footer outside the scrollable step content through the existing `AppModal` footer slot.

On mobile, allow the existing AppModal bottom-sheet behaviour to handle the layout.

---

# 6. Add repository update support

Update:

`src/app/services/repositories/specialRegistrationRepository.ts`

Add one update function for pending applications.

Suggested contract:

```ts
updateApplication(
  id: string,
  payload: SpecialRegistrationUpdatePayload,
  editor: {
    officerId: string;
    officerName: string;
    officerDesignation: string;
  }
): SpecialRegistrationApplication
```

Use `useCurrentUser()` for editor information.

## Update rules

The update must:

* Find the existing application by ID.
* Allow editing only when status is `PENDING_REVIEW`.
* Throw `SRConflictError` if the application has already been approved or rejected.
* Preserve the existing internal ID.
* Preserve the application number.
* Preserve submitted date and time.
* Preserve created date.
* Preserve current status.
* Preserve declaration timestamp.
* Preserve all existing decision history.
* Update `updatedAt`.
* Update only the editable application fields and documents.
* Return the updated application.

Do not create a new application.

Do not call `addApplication`.

Do not generate a new application number.

Do not change KPI totals.

## Document update handling

Reuse the current `SRDocument` structure.

When saving:

* Preserve existing `SRDocument` objects for unchanged File objects.
* Create new IDs only for newly added files.
* Give newly added files the current update timestamp.
* Remove deleted document records.
* Revoke cached object URLs for removed or replaced documents.
* Keep object URLs for unchanged documents.
* Preserve the existing document categories.

Do not weaken `AppFileUpload` validation.

## Edit history

Extend the existing decision history rather than creating a separate audit system.

Add:

```ts
decisionType: "EDITED"
```

For an edit event:

* Previous status: `PENDING_REVIEW`
* New status: `PENDING_REVIEW`
* Officer ID
* Officer name
* Officer designation
* Edit timestamp
* Short note such as “Application information updated”

Render the event in the existing Decision History section.

Do not add an edit event when the officer closes the modal without saving.

---

# 7. Save and refresh behaviour

After a successful edit:

* Close the edit modal.
* Refresh the current Special Registration list through the existing `loadData()`.
* Keep the current search.
* Keep the current applied filters.
* Keep the current page where possible.
* Update the table row immediately.
* Do not change KPI values.
* Show the existing toast style with a translated success message.

If the edited record no longer matches the active filter, allow it to disappear naturally after refresh.

On failure:

* Keep the modal open.
* Preserve entered data.
* Preserve selected files.
* Show a translated error message.
* Re-enable Save Changes.

On conflict:

* Close or disable the modal actions.
* Show that another officer has already processed the application.
* Refresh the table.
* Do not overwrite the final decision.

---

# 8. Translation updates

Reuse the existing `specialRegistration` namespace.

Use existing common and actions translations for:

* Edit
* Filter
* Records
* Cancel
* Back
* Next
* Save Changes
* Hide Summary
* Show Summary

Add only Special Registration-specific keys where required:

* All Applications
* Edit Special Registration Application
* Application updated successfully
* Failed to update application
* Application information updated
* Review & Save
* Processed applications cannot be edited

Add matching keys in:

* `src/app/locales/en/specialRegistration.json`
* `src/app/locales/bn/specialRegistration.json`

Keep EN/BN key parity.

Do not leave hard-coded English inside the table, drawer, modal, footer, history, errors, or toast messages.

---

# 9. CSS cleanup

Update `src/styles/special-registration.css`.

Remove or stop using Special Registration drawer styles that duplicate the shared drawer system, including custom styles for:

* Custom summary card
* Custom section headings
* Loose record field rows
* Custom footer layout that conflicts with current drawer footers

Do not delete styles until confirming they are no longer used.

Continue using Special Registration-specific CSS only for:

* Public page layout
* Existing Phase 1 wizard
* Minimal edit-modal sizing or overflow control
* Minimal attachment-group spacing
* Approval and rejection modal content
* Decision-history timeline where no shared equivalent exists

Do not copy generic styles from:

* `drawers.css`
* `modals.css`
* `tables.css`
* `filters.css`
* `buttons.css`

Reuse their existing class names.

---

# 10. Required tests

Add or update tests for the following.

## Table and filters

* Table toolbar displays All Applications.
* Count displays `N records`.
* Filter panel is closed initially.
* Desktop Filter button opens and closes `FilterPanel`.
* Mobile Filter button opens `MobileFilterOverlay`.
* Search and filter remain in the same mobile row.
* Applied filters continue working.
* `ResponsiveTable` renders desktop rows and mobile cards.
* Mobile cards open the drawer by card click.
* Mobile cards do not show View Details buttons.

## Drawer

* Drawer uses the generic summary block.
* Labels and values do not run together.
* Long address and email values wrap safely.
* Copy actions remain functional.
* Attachment preview opens above the drawer.
* Pending records show Edit, Reject, and Approve.
* Approved records do not show Edit, Reject, or Approve.
* Rejected records do not show Edit, Reject, or Approve.

## Edit modal

* Edit closes the drawer and opens the modal.
* The existing application data is prefilled.
* The existing documents appear in the same Phase 1 upload fields.
* Step navigation uses the Phase 1 stepper.
* Validation matches the public form.
* Cancel makes no changes.
* Save Changes preserves application number and submitted timestamp.
* Save Changes does not create another table row.
* Edited values appear in the table and drawer.
* Existing documents remain previewable.
* Removed documents are removed from the record.
* New files pass the existing security validation.
* Approved or rejected applications cannot be updated.
* One EDITED history event is added after a successful save.

## Regression

Run and preserve:

* Public Phase 1 submission
* Phase 1-to-Phase 2 integration
* Approval
* Rejection
* Attachment preview
* EN/BN locale validation
* Dark Mode
* Mobile layout
* Existing Role Management behaviour
* Existing Permission List behaviour

Run:

* TypeScript build
* Existing test suite
* New Special Registration tests
* Locale validation
* Desktop responsive review
* Mobile responsive review

Fix all TypeScript errors, console errors, broken imports, stale states, missing React keys, and accessibility issues.

# Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not remove working features.
* Do not create another table system.
* Do not create another filter system.
* Do not create another drawer system.
* Do not create another modal design.
* Do not create another Special Registration stepper.
* Extract and reuse the existing Phase 1 wizard.
* Reuse `ResponsiveTable`, `FilterPanel`, `MobileFilterOverlay`, `ResponsiveOverlay`, `AppModal`, `AttachmentList`, and existing action-button classes.
* Do not duplicate the Special Registration data source.
* Do not generate a new application during editing.
* Preserve the original application number, submission time, status, and audit history.
* Do not allow editing after approval or rejection.
* Do not weaken file security or validation.
* Do not place citizen information or files in Redux, local storage, or session storage.
* Preserve the Phase 1-to-Phase 2 connection.
* Preserve desktop and mobile behaviour.
* Preserve Dark Mode and all appearance settings.
* Keep EN/BN language parity.
* Keep the interface clean, consistent, and aligned with the current NBR eReturn Office design system.
