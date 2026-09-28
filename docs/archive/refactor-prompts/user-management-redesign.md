Refine and relocate the User Management and Role Management pages.

Important:
Do not rebuild the whole UI.
Do not change the main app shell.
Do not change the first-layer navigation.
Do not change the top bar.
Do not change the breadcrumb style.
Do not change the theme, font, or font size selector.
Do not remove any existing user/role functionality.
Do not create placeholder pages.
This is a controlled correction task.

Main Goal:
Move User Management and Role Management out of Settings and place them under Administration & Requests, then redesign both pages so they fully match the existing design system.

Current Problem:
User Management and Role Management were created under Settings.
This is not the correct information architecture.

Settings should only contain global/system appearance or configuration controls.
User and role operations belong under Administration & Requests.

Correct Navigation Placement:
In the first-layer navigation, keep:
- Administration & Requests

Inside the second-layer navigation for Administration & Requests, use:

- Certificate Req
  - Data Entry Request
  - Approval Request
  - Edit Request
  - Disposal History
- User Management
- Role Management
- Special Registration List
- Time Extension
- Audit Selection

Remove User Management and Role Management from the Settings section.

Settings Navigation:
Settings should not show:
- User Management
- Role Management

Settings should only keep global settings-related items if needed.

Breadcrumb Rule:
Keep the existing breadcrumb style exactly.

For User Management:
Home › Administration & Requests › User Management

For Role Management:
Home › Administration & Requests › Role Management

Do not show:
Home › Settings › User Management
Home › Settings › Role Management

Page Design Rule:
Both pages must look and feel like the rest of the current application.

Use the same:
- page layout
- breadcrumb style
- page title style
- subtitle style
- card system
- table system
- toolbar system
- modal system
- drawer system
- button system
- badge system
- pagination system
- icon style
- spacing
- typography
- theme behavior

Golden Rules:
- Each page must feel like part of one continuous process.
- Never break something that is already working.
- Use one unified design system across all pages, modules, and flows.
- Keep navigation in the left navigation area only.
- Do not place navigation tabs inside the page body.
- Keep breadcrumbs below the top bar and above the page title.
- No all-caps text anywhere.
- No cluttered UX.
- Every screen must be responsive from large desktop to laptop, tablet, and mobile.
- Follow WCAG 2.1 AA accessibility where possible.
- Use readable contrast, visible focus states, keyboard-friendly controls, and clear hierarchy.
- All reusable components must look, feel, and behave the same everywhere.
- All design decisions must be token-based.
- Do not hardcode colors, spacing, shadows, borders, radius, or typography.
- Scrollbar design must follow the selected theme.
- Dark mode must follow the Gmail-inspired charcoal palette.
- Font size changes must apply globally across these pages too.
- Use meaningful icons.
- Keep actions predictable and consistent.

User Management Page Requirements:
Create a clean table/list workspace for managing system users.

Page title:
User Management

Subtitle:
Manage system users, roles, and access permissions

Top actions:
- Manage Roles
- Export
- Add User

Action rules:
- Add User opens modal.
- Manage Roles navigates to Role Management under Administration & Requests.
- Export uses the same export button style as other table pages.

Summary cards:
Use the same KPI card system as the rest of the application.
Cards must have equal width and consistent styling.

Cards:
- Total
- Active
- Inactive
- Pending

Card rules:
- Same radius
- Same border
- Same shadow
- Same padding
- Same icon placement
- Same number style
- Same label style
- Same responsive grid behavior

Toolbar:
Use the shared table toolbar pattern:
- Search users
- All Status
- All Zones
- All Levels
- All Roles
- Results count

Table:
Use the approved reusable table system.

Columns:
- User
- Role / Level
- Circle · Zone
- Status
- Last Active
- Actions

Table rules:
- Clean card/table container
- Soft borders
- Consistent row height
- Consistent header style
- No heavy grid
- Good spacing
- Theme-aware hover state
- Theme-aware scrollbar
- Responsive behavior

Row Action Rule:
In each user row, show only one primary action:
- View Details

Do not show many repeated action icons in every row.

Additional actions should move into the User Details drawer:
- Edit User
- Reset Password
- Activate / Deactivate
- Delete
- Resend Invite
- Print
- Export user details
- View audit history

User Details Drawer:
Create or reuse the standard Record Details Drawer.

Drawer should include:
- user name
- employee ID
- email
- phone
- role
- access level
- zone
- circle
- status
- last active
- created date
- invite status
- permission summary
- audit/history section where useful

Drawer footer actions:
Show only relevant actions based on user status.

Add User Modal:
Add User must open in a modal, not a new page.

Modal layout:
Use a clean 2-column modal layout on desktop.
On mobile, stack into one column.

Sections:
1. Basic Information
   - Full Name
   - Employee ID
   - Email
   - Phone
   - Designation
   - Zone
   - Circle

2. Access Setup
   - Level
   - Role
   - Permission summary
   - Manage Roles link

3. Account Setup
   - Status
   - Send invite email to user
   - Require Two-Factor Authentication

Modal behavior:
- Sticky footer
- Cancel button
- Save User button
- Required fields marked clearly
- Validation states
- Focus states
- Keyboard accessible

Edit User:
Edit User must use the same Add User modal component in edit mode.
Do not create a different design for edit.

Role Management Page Requirements:
Create a clean role and permission management workspace under Administration & Requests.

Page title:
Role Management

Subtitle:
Create roles and manage permissions

Top actions:
- Duplicate Role
- Create Role

Action rules:
- Create Role opens modal.
- Edit Role opens modal.
- Delete opens confirmation modal.
- Duplicate Role opens confirmation or duplicate modal.
- No add/edit role flow should happen as a separate random page unless already approved.

Role Management Layout:
Use a two-panel workspace only if it stays clean and consistent.

Left panel:
- Search roles
- Role list
- Role card items

Right panel:
- Selected role details
- Permission overview
- Actions

If no role is selected:
Use the reusable empty-state component.

Empty state:
Title:
Select a Role

Description:
Choose a role from the list to view its details and permissions, or create a new one.

Button:
Create New Role

Role List Rules:
Each role item must use the same card/list item style:
- role name
- access level
- users count
- status badge
- selected state
- hover state
- focus state

Role Details View:
When a role is selected, show:
- role name
- status badge
- description
- access level
- user count
- total permissions
- permission coverage by module
- actions

Actions:
- Edit Role
- Duplicate Role
- Delete

Permission View:
Use a clean permission summary design.
Do not use overly loud progress bars.
Do not create visually heavy permission blocks.

Permission module cards should show:
- module name
- selected permission count
- total permission count
- selected permissions as small chips
- optional expand/collapse

Keep permission chips readable and calm.
Do not flood the page with overly bright teal chips.

Create Role Modal:
Create Role must open in a modal.

Modal layout:
Use 2 columns on desktop.

Left column:
Role Details
- Role Name
- Description
- Access Level
- Status

Right column:
Permissions
- Search permissions
- Select all
- Reset
- Permission groups by module
- Partial select state
- Selected count

Permission Search:
The permission search box must be functional in design behavior.
When a user searches, matching permissions should be highlighted or filtered.
Keep the permission group hierarchy clear.

Permission Accordion Rules:
- Accordions should not jump or behave weirdly.
- Opening one group should not break layout.
- Group headers should stay aligned.
- Select all must support checked, unchecked, and partial state.
- Permission count must update visually.
- Accordion content must remain inside the modal area.
- Use internal scrolling only where needed.

Edit Role:
Edit Role must use the same Create Role modal component in edit mode.
Do not create a different layout.

Delete Role:
Delete must open confirmation modal.
Confirmation modal should explain impact:
- role name
- number of users assigned
- warning that users may need reassignment if role is deleted

Do not delete immediately from the table or list.

Role Assignment Connection:
User Management and Role Management must stay connected.

In Add User / Edit User:
- Role dropdown should use roles created in Role Management.
- Role preview should show selected role summary.
- Manage Roles should navigate to Role Management.

In Role Management:
- Show how many users are assigned to each role.
- If a role has users assigned, deletion should require confirmation or reassignment.

Design System Requirements:
Apply the approved design system to both pages.

Cards:
- consistent width
- consistent radius
- consistent border
- consistent shadow
- consistent padding

Tables:
- same table container
- same row style
- same header style
- same toolbar
- same pagination
- one row action by default

Buttons:
- same primary/secondary/ghost/danger button style
- same icon alignment
- same hover/focus/disabled states

Badges:
- same status badge system
- Active, Inactive, Pending must follow shared badge tokens

Modals:
- same modal radius
- same overlay
- same header/footer
- same form spacing
- same validation style

Drawers:
- same drawer width
- same sticky footer
- same section structure
- same close behavior

Icons:
- use meaningful icons
- outlined icon style
- same size and stroke
- same active/inactive behavior

Typography:
Use the approved responsive typography scale.

Desktop:
- H1: 36px–48px
- H2: 24px–32px
- Body: 16px–18px
- Buttons / Inputs: 16px
- Captions / Footnotes: 12px–14px

Mobile:
- H1: 24px–30px
- H2: 20px–24px
- Body: 14px–16px
- Buttons / Inputs: 14px–16px
- Captions / Footnotes: 12px–14px

No all-caps text.

Theme Rules:
Both pages must support all 6 color themes:
1. Indigo Blue — #4B5694
2. Government Blue — #2C5EAD
3. Slate Purple — #4A4466
4. Plum Executive — #744577
5. Fresh Teal — #36ADA3
6. Dark Mode

Dark Mode:
Use the Gmail-inspired charcoal dark mode, not the loud blue version.

Dark mode tokens:
- app background: #202124
- sidebar background: #171717
- surface: #282A2D
- surface 2: #2D2F31
- elevated surface: #35363A
- hover: #3C4043
- border: #3C4043
- text primary: #E8EAED
- text secondary: #BDC1C6
- text muted: #9AA0A6
- primary accent: #8AB4F8
- primary hover: #AECBFA
- primary soft: rgba(138,180,248,0.14)

Appearance Panel:
Do not change the Appearance panel except to ensure these pages respond to:
- selected color theme
- selected font
- selected font size
- dark mode

Responsive Behavior:
Desktop:
- left navigation visible
- User Management table uses full workspace
- Role Management may use two-panel layout

Tablet:
- second-layer navigation may collapse
- tables scroll horizontally
- modals adapt to narrower width

Mobile:
- navigation becomes drawer
- tables become horizontal scroll or card-list
- modals become full-screen
- details drawer becomes full-screen
- buttons remain touch-friendly

Accessibility:
- Follow WCAG 2.1 AA where possible.
- Icon-only buttons need tooltips and accessible labels.
- Modals must trap focus.
- Drawers must support keyboard close.
- Forms need labels, required states, validation messages.
- Status should not rely only on color.
- Text must remain readable at 200% zoom.

Do Not:
- Do not keep User Management and Role Management under Settings.
- Do not show these pages as placeholders under Administration & Requests.
- Do not duplicate User Management in both Settings and Administration & Requests.
- Do not use page-body tabs for navigation.
- Do not show multiple row action icons by default.
- Do not create a new visual style just for these pages.
- Do not make role permissions visually loud or oversized.
- Do not remove role assignment from Add User.
- Do not break existing Add User, Create Role, Edit Role, or permission selection flows.

Final Result:
User Management and Role Management should now live under Administration & Requests and feel like native parts of the system.

They must use the same:
- navigation pattern
- breadcrumb pattern
- card system
- table system
- toolbar system
- modal system
- drawer system
- action behavior
- typography
- icons
- themes
- dark mode
- responsiveness
- accessibility

The final experience should feel clean, consistent, reusable, and government-grade.