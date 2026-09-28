# Master Prompt — Phase 2: Special Registration Review and Approval

Work inside the uploaded **NBR-eReturn-Office Management UI (46)** project and the completed **Phase 1: Public Special Registration for NRB** implementation.

Implement **Phase 2 only**: connect public submissions to the authenticated NBR Office system, rebuild the internal Special Registration page around the new NRB application data, and add the complete review, approval, and rejection process.

Before changing anything, inspect the current Phase 1 implementation and the existing project structure. Reuse the exact public application types, request values, submission service, attachment rules, translation keys, design tokens, and reusable components already added in Phase 1.

Do not create a second Special Registration data model, a second mock database, a second uploader, or another unrelated approval pattern.

---

## Primary outcome

The two phases must work as one connected workflow:

1. A citizen opens the public Special Registration page.
2. The citizen completes the form and uploads the required documents.
3. The citizen submits the application.
4. The application receives a generated application number and `Pending Review` status.
5. The submitted application is added to the shared Special Registration data source.
6. An NBR officer signs in.
7. The officer opens:

`Administration & Requests → Special Registration List`

8. The new public application appears as the newest table record.
9. The application number shown to the citizen must match the application number shown in the internal table and details drawer.
10. The officer reviews all submitted information and attachments.
11. The officer approves or rejects the application.
12. The table, KPI cards, details drawer, status, decision history, and reviewer information update immediately.

There must be no manual duplication between Phase 1 and Phase 2.

---

## Phase 2 scope

Implement only:

* The shared connection between Phase 1 public submission and the internal Special Registration module.
* The updated internal Special Registration list.
* Real search, filtering, sorting, pagination, loading, error, and empty states.
* A complete Special Registration details drawer.
* Categorized attachment viewing.
* Approval confirmation and processing.
* Rejection reason collection and processing.
* Decision history and reviewer information.
* EN/BN language parity.
* Desktop and mobile behaviour.
* Mock service and repository behaviour for the current static project.
* Developer-ready API contracts for future backend integration.

Do not modify the public form design, field sequence, validation rules, document requirements, login-page link, or success page unless a small change is required to connect Phase 1 to the shared service.

Do not change unrelated pages, tables, modules, navigation, permissions, dashboards, APIs, or business logic.

---

## Existing project areas to inspect and reuse

Review these existing files and their current behaviour before implementation:

* `src/app/pages/administration-requests/SpecialRegistrationPage.tsx`
* `src/app/components/pages/GeneratedTablePage.tsx`
* `src/app/components/tables/ResponsiveTable.tsx`
* `src/app/components/tables/CardTable.tsx`
* `src/app/components/tables/UnifiedMobileCard.tsx`
* `src/app/components/cards/CollapsibleKpiSection.tsx`
* `src/app/components/cards/KpiRow.tsx`
* `src/app/components/cards/StatCard.tsx`
* `src/app/components/forms/AppSearchField.tsx`
* `src/app/components/forms/AppSelectField.tsx`
* `src/app/components/forms/AppDateField.tsx`
* `src/app/components/forms/AppTextArea.tsx`
* `src/app/components/filters/FilterPanel.tsx`
* `src/app/components/filters/MobileFilterOverlay.tsx`
* `src/app/components/filters/AppliedFilterChips.tsx`
* `src/app/components/shared/MobileSearchFilter.tsx`
* `src/app/components/shared/Pagination.tsx`
* `src/app/components/shared/ResponsiveOverlay.tsx`
* `src/app/components/shared/CopyValueButton.tsx`
* `src/app/components/drawers/DynamicDetailsDrawer.tsx`
* `src/app/components/attachments/AttachmentList.tsx`
* `src/app/components/attachments/AttachmentPreviewModal.tsx`
* `src/app/components/attachments/attachmentTypes.ts`
* `src/app/components/modals/AppModal.tsx`
* `src/app/components/modals/SConfirmModal.tsx`
* `src/app/components/buttons/PrimaryButton.tsx`
* `src/app/components/buttons/SecondaryButton.tsx`
* `src/app/components/buttons/DangerButton.tsx`
* `src/app/components/badges/StatusBadge.tsx`
* `src/app/hooks/useCurrentUser.ts`
* `src/app/services/types/administration.ts`
* `src/app/services/endpoints/administration.ts`
* `src/app/services/mappers/administration.ts`
* `src/app/pages/modulePageUtils.ts`
* `src/app/data/modulePageConfigs.ts`
* The Phase 1 public Special Registration types, service, repository, mock data, and locale files
* Existing table, drawer, modal, attachment, button, form, and responsive CSS

Reuse these components and styles. Do not create another table system, drawer system, modal system, status badge, filter overlay, attachment preview, pagination system, or button set.

---

## Important current-project limitation

The current `SpecialRegistrationPage.tsx` uses generic mock registration records with fields such as:

* NGO
* Trust
* Society
* Foundation
* Active
* Inactive
* Suspended
* Circle
* Zone

These records do not match the NRB public Special Registration workflow and must be replaced within this module.

The current `GeneratedTablePage` also has limitations for this workflow:

* It initializes from static `cfg.rows`.
* Its applied filters do not currently affect the displayed data.
* `drawerActions` are declared in configuration but are not connected to working approval and rejection actions.
* The generic drawer does not provide the complete categorized application and review workflow needed here.

Do not make risky global changes to `GeneratedTablePage` that could affect every table in the project.

Replace the current Special Registration page with a dedicated implementation that reuses the existing table, filter, KPI, drawer, modal, attachment, and button components.

Keep `GeneratedTablePage` unchanged unless a small, fully backward-compatible shared fix is required and tested across all existing pages.

---

# Shared data connection between Phase 1 and Phase 2

## One source of truth

Phase 1 public submission and Phase 2 internal review must use the same service and data source.

Do not keep:

* One public submission array
* Another admin table array
* A separate copy in `specialRegRows`
* Hard-coded table rows unrelated to submitted applications

Use one shared Special Registration repository or service source.

If Phase 1 already created a repository or mock service, extend that implementation. Do not create a parallel repository.

An appropriate structure may be:

`src/app/services/repositories/specialRegistrationRepository.ts`

or the equivalent existing Phase 1 location.

The shared repository must support:

* Seeding realistic Special Registration applications
* Adding a new public application
* Listing applications
* Retrieving one application by ID
* Approving an application
* Rejecting an application
* Updating the decision history
* Returning current KPI totals
* Resetting mock data during tests

## Static prototype behaviour

The current project is a frontend prototype without a production backend.

For the mock implementation:

* Keep submitted applications in a module-level in-memory repository.
* Do not put passport files, NID files, TIN, address, phone, or email in Redux.
* Do not save citizen data or files in `localStorage`.
* Do not save citizen data or files in `sessionStorage`.
* Do not create Base64 copies of uploaded identity documents.
* Do not duplicate File objects in several stores.

This in-memory repository must preserve a submitted public application while the user moves from:

`Public form → Success page → Login → Internal Special Registration page`

within the same running application session.

A hard browser refresh may reset prototype data. Production persistence will later be handled by the backend API.

## Public submission integration

Update the Phase 1 submission service only where needed so that a successful public submission:

1. Creates one complete application record.
2. Generates one unique application number.
3. Assigns `PENDING_REVIEW`.
4. Stores the original submission timestamp.
5. Stores the categorized uploaded files in the in-memory repository.
6. Returns the same application number and submission timestamp to the Phase 1 success screen.
7. Makes the record available through the Phase 2 list endpoint.

Do not generate one number for the citizen and another number for the internal table.

Do not add the application twice when the Submit button is clicked repeatedly.

---

# Shared Special Registration data model

Use the existing Phase 1 type where possible. Extend it rather than creating a conflicting second type.

Use stable internal enum values similar to:

```ts
type SpecialRegistrationRequestType =
  | "NEW_SPECIAL_REGISTRATION"
  | "PASSWORD_RESET_EMAIL_VERIFICATION";

type SpecialRegistrationStatus =
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED";

type SpecialRegistrationDocumentCategory =
  | "NID_OR_SMART_ID"
  | "PASSPORT_BIO_PAGE"
  | "VISA_OR_RESIDENCE_PAGE"
  | "LATEST_DEPARTURE_SEAL";
```

The complete application must support:

* Internal ID
* Application number
* Request type
* Applicant full name
* TIN
* Country of residence
* Overseas address
* Foreign phone number
* Last date of departure from Bangladesh
* Email address
* Categorized documents
* Declaration acceptance
* Submission date and time
* Current status
* Reviewed by user ID
* Reviewed by officer name
* Reviewer designation
* Review date and time
* Approval note
* Rejection reason
* Decision history
* Created date
* Last updated date

Each decision-history item must support:

* Decision type
* Previous status
* New status
* Officer ID
* Officer name
* Officer designation
* Timestamp
* Note or rejection reason

Do not store translated labels as the underlying value. Translate request types and statuses only at the UI layer.

---

# Mock and production service contracts

Extend the existing administration service layer with functions equivalent to:

```ts
submitPublicSpecialRegistration(formData)
getSpecialRegistrations(params)
getSpecialRegistrationById(id)
approveSpecialRegistration(id, payload)
rejectSpecialRegistration(id, payload)
```

The exact names may follow the completed Phase 1 naming pattern.

## List query parameters

Extend the Special Registration query type without breaking the shared generic `QueryParams`.

Support:

* Page
* Items per page
* Search
* Request type
* Status
* Country
* From submission date
* To submission date
* Sort direction

Search must cover:

* Application number
* TIN
* Applicant name
* Email address
* Foreign phone number
* Country of residence

## Approval payload

The approval request must contain:

* Application ID
* Expected current status
* Reviewer ID
* Reviewer name
* Reviewer designation
* Review timestamp
* Optional internal approval note

## Rejection payload

The rejection request must contain:

* Application ID
* Expected current status
* Reviewer ID
* Reviewer name
* Reviewer designation
* Review timestamp
* Required rejection reason

## Conflict protection

The repository and future API contract must reject a decision when the current status is no longer `PENDING_REVIEW`.

Treat this as a conflict state, equivalent to HTTP `409`.

When a conflict occurs:

* Do not overwrite the newer decision.
* Close or disable the action modal.
* Refresh the selected application.
* Show a clear message that another officer has already processed the application.

---

# Internal Special Registration page

Keep the existing route and menu item:

`/administration/special-registration`

Keep the existing Administration & Requests navigation structure unchanged.

Update the page title to:

**Special Registration Applications**

Use the description:

**Review and process NRB registration and email-verification applications.**

Provide a natural Bangla translation.

---

## Loading the connected data

When the internal page opens:

* Fetch the applications through the shared Special Registration service.
* Do not directly import `specialRegRows`.
* Sort applications by submission timestamp, newest first.
* Show the latest public submission as the first record when no filter is active.
* Use the project’s existing loading treatment.
* Do not flash the old NGO, Trust, Society, or Foundation records.
* Keep previous data visible during a refresh when possible.
* Show a retry state if loading fails.

After an approval or rejection:

* Refresh or safely update the application list.
* Refresh KPI values.
* Update the open details drawer.
* Keep the current search and filters.
* Keep the user on the same page where possible.
* Correct the page number if the current filtered page becomes empty.

---

# KPI summary

Replace the old KPI cards with:

1. **Total Applications**
2. **Pending Review**
3. **Approved**
4. **Rejected**

Use the existing `CollapsibleKpiSection`, `KpiRow`, and `StatCard` patterns.

Reuse the existing status colors:

* Total Applications: primary
* Pending Review: warning or the project’s existing pending tone
* Approved: success
* Rejected: error

Do not hard-code KPI values.

The KPI values must be calculated from the same current application data source used by the table.

When a pending application is approved:

* Pending decreases by 1.
* Approved increases by 1.
* Total remains unchanged.

When a pending application is rejected:

* Pending decreases by 1.
* Rejected increases by 1.
* Total remains unchanged.

Keep the current Hide Summary and Show Summary behaviour unchanged.

---

# Desktop table

Reuse the existing responsive table components and current table-card styling.

Use these columns:

1. Application No.
2. Request Type
3. TIN
4. Applicant Name
5. Residing Country
6. Email
7. Submitted On
8. Status
9. Actions

Use the existing row action pattern:

**View Details**

Do not place Approve and Reject buttons directly in every table row. Keep decision actions inside the details drawer so the officer reviews the application before making a decision.

## Table formatting

* Application numbers must not wrap in the middle.
* TIN must remain readable and copyable from the drawer.
* Long applicant names, countries, and email addresses must use the existing truncation behaviour.
* Show full values through the existing accessible title, expansion, or details pattern.
* Show request types as readable translated labels.
* Use `StatusBadge` for statuses.
* Display submission date and time in a consistent readable format.
* Use the original ISO timestamp internally.
* Do not convert the date differently in the table and drawer.

## Sorting

Default sort:

* Submission timestamp descending
* Newest application first

Do not add a new complex sorting interface unless the existing table supports it. The default sort is required.

---

# Search and filters

## Search

Use the existing `AppSearchField` on desktop and `MobileSearchFilter` on mobile.

Search must work across:

* Application number
* TIN
* Applicant name
* Email address
* Foreign phone number
* Country of residence

Search must:

* Be case-insensitive
* Trim leading and trailing spaces
* Normalize Bangla numerals for TIN matching where Phase 1 already supports this
* Reset pagination to page 1
* Update the displayed count
* Work together with active filters

## Filters

Provide:

* Request Type
* Status
* Country of Residence
* From Submission Date
* To Submission Date

Request Type options:

* All Request Types
* New eReturn Special Registration
* Email Verification for Password Reset

Status options:

* All Statuses
* Pending Review
* Approved
* Rejected

Country filtering may use a text filter if the project does not already have a reusable country selector. Do not create a new country component only for this page.

## Filter behaviour

* Filters must affect the displayed rows.
* Filters must work together rather than replacing one another.
* Applied filter chips must reflect the current values.
* Removing one chip must remove only that filter.
* Reset must clear every filter.
* Reset must return to page 1.
* Date range must use submission date.
* Do not apply a future From Date after the To Date.
* Show a clear validation message for an invalid date range.

Desktop filters must use the existing `FilterPanel`.

Mobile filters must use the existing `MobileFilterOverlay` and open from the bottom.

Do not use the generic filtering logic that currently stores filters without applying them.

---

# Empty, loading, and error states

## Initial loading

Show the existing page loader or skeleton treatment while the application data is loading.

## No applications

Show a clean empty state:

**No special registration applications have been submitted yet.**

Do not show an empty table with meaningless rows.

## No search or filter results

Show:

**No applications match your search or filters.**

Provide a clear Reset Filters action when filters are active.

## Load failure

Show:

* A clear inline error
* Retry action
* Existing toast feedback as secondary support

Do not replace the full application shell with an error page.

---

# Mobile card behaviour

Reuse `UnifiedMobileCard` and the existing mobile table pattern.

Use this mapping:

* Primary: Applicant Name
* Identifier: Application Number
* Meta:

  * Request Type
  * TIN
  * Residing Country
* Date: Submitted On
* Status: Application Status

Rules:

* The entire card opens the details view.
* Do not add a separate View Details button.
* Preserve the existing mobile card border and spacing patterns.
* Keep search and filter in the same row.
* Filters must open from the bottom.
* Use no horizontal table scrolling on mobile.
* Long email addresses and names must not break the layout.
* Status must remain visible without opening the details drawer.

---

# Special Registration details drawer

Create a dedicated Special Registration details drawer or wrapper using the existing drawer building blocks.

Reuse:

* `ResponsiveOverlay`
* Existing drawer header and footer styling
* `StatusBadge`
* `CopyValueButton`
* `SafeText`
* `ExpandableText`
* `AttachmentList`
* `AttachmentPreviewModal`
* Existing Primary, Secondary, and Danger buttons

Do not create a new drawer visual language.

Do not force this workflow into `DynamicDetailsDrawer` if doing so would require risky changes affecting every module.

A small optional extension to an existing shared component is acceptable only when it is fully backward-compatible.

## Drawer summary

At the top, show:

* Applicant name
* Application number
* Request type
* Current status
* Submission date and time

The application number must have the existing copy action.

## Drawer content groups

Use these sections in this order:

### 1. Request Information

* Application Number
* Request Type
* Submission Date and Time
* Current Status

### 2. Taxpayer Information

* Full Name
* TIN

TIN must include the existing copy action.

### 3. Overseas Residence and Contact

* Country of Residence
* Full Overseas Address
* Foreign Mobile or Telephone Number
* Email Address

Email and phone may use the existing copy action.

### 4. Departure Information

* Last Date of Departure from Bangladesh

### 5. Submitted Documents

Show four clearly labelled document categories:

* NID or Smart ID Copy
* Bio Page of Bangladeshi Passport
* Visa or Residence Page of Current Country
* Passport Page with Latest Bangladesh Departure Seal

Do not merge every document into one unidentified file list.

For NID or Smart ID, support the one or two files submitted in Phase 1.

Each document must display:

* Document category
* File name
* File type
* File size
* Uploaded date
* Required or Optional label
* View
* Open
* Download

Reuse the current `AttachmentList` card and footer action pattern.

If a small optional `categoryLabel` or grouped-sections prop is needed in `AttachmentList`, add it without changing current behaviour for existing attachment lists.

The attachment preview modal must appear above the details drawer using the existing top modal layer. It must never render behind the drawer.

### 6. Applicant Declaration

Show:

* Declaration text
* Accepted: Yes
* Declaration timestamp when available

Do not show the declaration as an editable checkbox in the admin view.

### 7. Review Information

For Pending applications, show:

* Status: Pending Review
* Not yet reviewed

For processed applications, show:

* Final decision
* Reviewed by
* Reviewer designation
* Review date and time
* Approval note, when provided
* Rejection reason, when rejected

### 8. Decision History

Show a chronological history of:

* Application submitted
* Application approved or rejected
* Officer name
* Date and time
* Notes or reason

Do not display fake history entries unrelated to the application.

---

# Application completeness check

Before allowing approval, verify the application still contains:

* Request type
* Applicant name
* Valid TIN
* Country of residence
* Overseas address
* Foreign phone
* Email address
* Last departure date
* NID or Smart ID document
* Passport bio page
* Latest departure-seal page
* Accepted declaration

The Visa or Residence Page remains optional.

If required information or documents are missing:

* Keep the application open for review.
* Show a visible **Incomplete Application** warning.
* Identify each missing field or document.
* Disable Approve.
* Keep Reject available.
* Do not silently approve an incomplete application.

Do not repeat the full Phase 1 validation implementation inside the drawer. Use shared validation utilities where possible.

---

# Drawer footer actions

## Pending application

Show:

* Secondary: Print or the existing record-print action, only if already supported
* Secondary: Download or existing disabled-export action, only if currently present and required
* Danger: Reject
* Primary: Approve

Approve and Reject must be visually prominent and clearly separated.

Do not show Edit unless the client specifically requests that officers edit citizen-submitted data.

## Approved application

Do not show Approve or Reject again.

Show the final Approved status and review information.

Keep only appropriate read-only actions already supported by the project.

## Rejected application

Do not show Approve or Reject again.

Show the rejection reason and review information.

Keep only appropriate read-only actions already supported by the project.

## Mobile footer

* Keep decision actions in the sticky drawer footer.
* Use full-width buttons when necessary.
* Minimum button height: 44px.
* Do not hide actions below the mobile safe area.
* Reject and Approve may share a row only when both remain easy to tap.
* Prevent horizontal overflow.

---

# Approval process

Approve is available only when:

* Application status is `PENDING_REVIEW`
* Required information is present
* Required documents are present
* Declaration is accepted
* No decision request is already running

Selecting Approve must open a confirmation modal using the existing `AppModal` or an extended `SConfirmModal`.

## Approval confirmation content

Show:

* Heading: Approve Application
* Applicant name
* Application number
* Request type
* Email address
* A short explanation of what approval will trigger
* Optional internal approval note

For New eReturn Special Registration:

> After approval, the applicant can receive the registration instruction or OTP through the verified email address.

For Password Reset Email Verification:

> After approval, the applicant can receive the password-reset verification instruction or OTP through the verified email address.

Do not claim that an email was sent unless the service response confirms it.

## Approval confirmation actions

* Cancel
* Confirm Approval

Use:

* `SecondaryButton` for Cancel
* `PrimaryButton` for Confirm Approval

## Approval processing

While approving:

* Disable modal close where needed to prevent accidental duplicate processing.
* Disable both decision buttons.
* Show the existing loading spinner.
* Ignore repeated clicks.
* Do not close the drawer before the request completes.

On success:

* Change status to `APPROVED`.
* Store reviewer information from `useCurrentUser()`.
* Store review date and time.
* Store optional approval note.
* Add a decision-history item.
* Update the drawer.
* Update the table row.
* Update KPI counts.
* Remove Approve and Reject actions.
* Show a success toast.

For the mock service, record the next backend action without pretending to send a real OTP or email.

The future production API may return a notification status such as:

* Queued
* Sent
* Failed

Display it only when provided by the service.

On approval failure:

* Keep the confirmation modal or drawer state recoverable.
* Show a clear error.
* Re-enable actions.
* Preserve the approval note.
* Do not change the application status.

---

# Rejection process

Reject is available only when the application is `PENDING_REVIEW`.

Selecting Reject must open a rejection modal using the existing modal and form components.

## Rejection modal content

Show:

* Heading: Reject Application
* Applicant name
* Application number
* Request type
* Required Rejection Reason field

Use `AppTextArea`.

Rejection reason rules:

* Required
* Trim surrounding spaces
* Minimum 10 meaningful characters
* Maximum 500 characters
* Do not accept whitespace-only text
* Show the character limit
* Focus the reason field when the modal opens

Do not create a new textarea component.

## Rejection actions

* Cancel
* Confirm Rejection

Use:

* `SecondaryButton` for Cancel
* `DangerButton` for Confirm Rejection

Keep Confirm Rejection disabled until the reason is valid.

## Rejection processing

While rejecting:

* Disable modal actions.
* Show the existing loading state.
* Ignore repeated clicks.
* Prevent duplicate decisions.

On success:

* Change status to `REJECTED`.
* Save the rejection reason.
* Save reviewer information from `useCurrentUser()`.
* Save review date and time.
* Add a decision-history item.
* Update the drawer.
* Update the table.
* Update KPI values.
* Remove Approve and Reject actions.
* Show a success toast.

On failure:

* Preserve the entered rejection reason.
* Re-enable actions.
* Keep the status unchanged.
* Show a clear error.

---

# Current-user and reviewer data

Use the existing `useCurrentUser()` hook.

Do not hard-code:

* Rafiqul Islam
* Circle Officer
* Employee ID
* Reviewer email

Store the current user’s:

* ID
* Name
* Designation

Do not modify the current-user Redux slice for this workflow.

---

# Status labels and badge behaviour

Use internal values:

* `PENDING_REVIEW`
* `APPROVED`
* `REJECTED`

Display translated labels:

* Pending Review
* Approved
* Rejected

Ensure `StatusBadge` supports the new Pending Review value without breaking existing status badges elsewhere.

Use the existing project tones:

* Pending Review: warning
* Approved: success
* Rejected: error

Do not use Active, Inactive, or Suspended in this module.

---

# Attachments and file security

Phase 2 must display the exact files accepted by the Phase 1 uploader.

Do not add another upload field to the admin drawer.

Do not allow officers to replace public documents in this phase.

Preserve the Phase 1 security rules:

* Extension allow list
* MIME validation
* Magic-number validation
* Renamed executable detection
* Disguised file blocking
* File-size limit
* Duplicate-file detection
* Required-file validation

For the prototype repository:

* Store the original validated `File` objects only in the shared in-memory repository.
* Do not place File objects in Redux.
* Do not rely on temporary preview URLs created by the public form.
* Create admin preview URLs safely from the stored File objects when mapping attachments for display.
* Reuse URLs where safe during the application session.
* Revoke created object URLs when the repository is reset, replaced, or the application is destroyed.
* Do not revoke an attachment URL immediately after public submission if the admin still needs to preview the file.

For the production contract:

* Use secure backend document IDs and authorized download URLs.
* Do not expose server filesystem paths.
* Do not trust frontend MIME validation as the final security check.

---

# EN/BN language support

Reuse the Phase 1 `specialRegistration` namespace if it already exists.

Do not create another conflicting namespace.

Add matching EN and BN keys for:

* Internal page title and description
* Table headers
* KPI labels
* Request types
* Status labels
* Search placeholder
* Filters
* Empty states
* Loading states
* Retry messages
* Drawer title
* Drawer sections
* Document categories
* Required and optional labels
* Incomplete-application warnings
* Approve modal
* Approval note
* Reject modal
* Rejection reason
* Validation errors
* Decision history
* Reviewer information
* Success messages
* Conflict messages
* API errors

Do not leave hard-coded English inside the page, drawer, modals, or service error mapping.

Keep the EN and BN key structure exactly equal.

Use natural Bangla suitable for NBR officers. Do not use mechanical transliteration.

Run the existing locale validation.

---

# Responsive behaviour

## Desktop

* Keep the current Administration & Requests shell unchanged.
* Keep the primary sidebar, secondary sidebar, top navigation, breadcrumbs, and assessment-year control unchanged.
* Keep the existing page and table widths.
* Use the existing table-card spacing and borders.
* Open the details drawer from the right using the current drawer width pattern.
* Keep the modal above the drawer.

## Tablet and mobile

* Keep search and filter in the same row.
* Use the existing mobile card view.
* Open filters from the bottom.
* Open record details using the current responsive overlay behaviour.
* Do not show a separate View Details button.
* Stack information into readable sections.
* Keep documents easy to view and download.
* Keep Approve and Reject accessible in the sticky footer.
* Prevent the mobile keyboard from covering rejection-reason input or modal actions.
* Respect safe-area spacing.
* Test long Bangla text, long applicant names, long email addresses, long country names, and long document filenames.
* Do not create horizontal scrolling.

Do not alter desktop layouts outside the Special Registration module.

---

# Accessibility

* Use one page `h1`.
* Maintain logical heading order inside the drawer and modals.
* Give the search field an accessible label.
* Announce loading, empty, failure, and decision-success states.
* Use `aria-live` for record count and status changes where appropriate.
* Keep visible focus states.
* Restore focus to the action that opened a modal.
* Trap focus inside open modals and drawers using the existing hooks.
* Support Escape closing according to existing modal behaviour.
* Do not allow backdrop clicks to submit a decision.
* Connect rejection validation with `aria-describedby`.
* Use `aria-invalid` for an invalid reason.
* Do not rely on color alone for statuses or errors.
* Keep all mobile tap targets at least 44×44px.

---

# Required connection test

Add an integration test that proves the complete Phase 1 to Phase 2 connection:

1. Open the public Special Registration page without authentication.
2. Complete a valid public application.
3. Attach all required files.
4. Submit the application.
5. Capture the generated application number.
6. Return to login.
7. Sign in.
8. Open the internal Special Registration page.
9. Confirm the new application appears as the first row.
10. Confirm its application number matches the public success page.
11. Confirm its status is Pending Review.
12. Open its details drawer.
13. Confirm all entered fields are displayed.
14. Confirm every categorized attachment is available.
15. Approve or reject the application.
16. Confirm the row, drawer, KPI cards, reviewer information, and decision history update.

There must be no direct test-only insertion into the admin table. The record must arrive through the same public submission service used by the real Phase 1 form.

---

# Additional tests

Add focused tests for:

* Internal page loads from the shared service
* Old NGO, Trust, Society, and Foundation records are removed
* New public submissions appear newest first
* No duplicate record is created from repeated submit clicks
* Search by application number
* Search by TIN
* Search by applicant name
* Search by email
* Request-type filtering
* Status filtering
* Country filtering
* Date-range filtering
* Combined search and filtering
* Filter reset
* Pagination after filtering
* KPI calculations
* Pending application drawer actions
* Approved application read-only state
* Rejected application read-only state
* Required-document completeness check
* Optional visa document does not block approval
* Missing required document blocks approval
* Approval records the current officer
* Rejection requires a valid reason
* Approval updates table, drawer, and KPI cards
* Rejection updates table, drawer, and KPI cards
* Duplicate decision is blocked
* Conflict response refreshes the record
* Attachment preview opens above the drawer
* Mobile cards open details on card click
* No mobile View Details button
* Mobile filters open from the bottom
* EN/BN key parity
* No sensitive data is written to local or session storage

Run:

* TypeScript build
* Existing test suite
* New Phase 2 tests
* Phase 1 regression tests
* Locale validation
* Desktop responsive review
* Mobile responsive review

Fix every TypeScript error, console error, missing React key, stale state issue, inaccessible control, and broken import before completion.

---

# Definition of done

Phase 2 is complete only when:

* A Phase 1 public submission automatically appears in the authenticated internal Special Registration list.
* The same application number is used in both phases.
* The internal page no longer uses the old generic Special Registration records.
* Search and filters genuinely work.
* The details drawer shows every submitted field and categorized attachment.
* Attachments can be viewed above the drawer.
* Pending applications can be approved or rejected.
* Rejection requires a reason.
* Approval and rejection record the current officer and timestamp.
* Processed applications cannot be processed again.
* KPI cards update correctly.
* Desktop and mobile views follow existing project patterns.
* EN and BN remain equal.
* No sensitive citizen data is stored in browser persistence.
* No unrelated project feature is changed or broken.

# Golden Rules

* Do not break solved issues.
* Do not change unrelated files.
* Do not remove working features.
* Do not redesign the public Phase 1 form.
* Do not create a second Special Registration data source.
* Do not create another table, drawer, modal, uploader, attachment viewer, status badge, or button system.
* Reuse existing components and styles.
* Keep the public submission and internal approval flow connected through one shared service.
* Do not use `specialRegRows` as the live source of truth.
* Do not store citizen data or identity documents in local storage or session storage.
* Do not place File objects in Redux.
* Do not weaken existing file-security validation.
* Do not add Approve and Reject buttons directly to every table row.
* Do not allow repeat approval or rejection.
* Do not change unrelated desktop or mobile layouts.
* Preserve existing navigation, authentication, appearance settings, and language switching.
* Keep EN/BN language parity.
* Test the full Phase 1-to-Phase 2 workflow.
* Keep the interface clean, simple, readable, and consistent with the existing NBR eReturn Office system.
