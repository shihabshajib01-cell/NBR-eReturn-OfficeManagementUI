Fix User Management and Role Management so they fully match the approved design system.

Do not redesign the full system.
Do not change the primary navigation.
Do not change the secondary navigation names.
Do not move User Management and Role Management back to Settings.
Keep both pages under Administration & Requests.
Only fix layout, table style, cards, actions, spacing, and component consistency.

Main Goal:
User Management and Role Management must look and feel like the same product as Register & Stock, PSR Approval, Return View Approval, Certificate Requests, and other approved table pages.

Golden Rules:
- Follow the existing app shell.
- Follow the existing primary and secondary navigation pattern.
- Keep breadcrumbs below the top bar.
- Keep full breadcrumb names.
- Keep page title and short subheading.
- Use the same table system everywhere.
- Use the same toolbar system everywhere.
- Use the same button system everywhere.
- Use the same StatCard component everywhere.
- Use the same status badge system everywhere.
- Use the same details drawer pattern everywhere.
- Use modals for add, edit, create, delete, confirm, and role permission actions.
- No all-caps text.
- No random page-specific components.
- No custom layout that breaks system consistency.
- Keep everything responsive.
- Follow WCAG 2.1 AA where possible.

User Management Page Fix:
Make User Management follow the approved standard table page layout.

Page structure:
1. Breadcrumb
2. Page header
3. Stat cards
4. Table card with toolbar
5. Pagination
6. Details drawer on row/action click

Page title:
User Management

Subheading:
Manage users, roles, access, and account status across the system.

Top actions:
- Manage Roles
- Export
- Add User

Use approved button styles:
- Primary button for Add User
- Secondary/outline buttons for Manage Roles and Export
- Same height, radius, icon size, and spacing as other pages

Stat cards:
Use the shared StatCard component only.

Cards:
- Total
- Active
- Inactive
- Pending

Each card must use:
- same width logic
- same height
- same icon container
- same padding
- same border
- same shadow
- same typography
- same semantic colors

Do not create a separate user-specific card style.

User table:
Convert the User Management table to the approved table component.

Table card header:
Left:
User Management
12 records

Right:
- Search users
- All Status
- All Zones
- All Levels
- All Roles

Table columns:
- User
- Role / Level
- Circle · Zone
- Status
- Last Active
- Actions

Row style:
- same height as approved table rows
- same border color
- same hover state
- same selected state
- same background
- same font scale
- same spacing

User cell:
Keep avatar, name, employee ID, and email, but make it compact and aligned.

Action column:
Do not use large “View Details” buttons in every row.

Use the approved action pattern:
- one primary compact View icon button
- optional three-dot menu for secondary actions

Preferred:
Actions column should show:
- View icon button

Clicking View opens the right-side User Details drawer.

Secondary actions inside drawer or overflow menu:
- Edit User
- Reset Password
- Deactivate / Activate
- Resend Invite
- Change Role
- View Activity Log

Do not overload the table row with too many buttons.

Add User:
Open Add User in a modal.
Do not create a separate full page.

Edit User:
Open Edit User in a modal.
Use the same modal style as the system.

User Details:
Open in a right-side details drawer.
Drawer should follow the same drawer component used across all tables.

Drawer sections:
- Basic Information
- Role & Access
- Office Assignment
- Account Status
- Recent Activity

Drawer footer actions:
- Edit User
- Reset Password
- Deactivate / Activate

Role Management Page Fix:
Role Management must also follow the approved system, but it can keep a master-detail idea only if it visually matches the system.

Page title:
Role Management

Subheading:
Create roles and assign permissions by module.

Top actions:
- Duplicate Role
- Create Role

Use approved button styles:
- Primary button for Create Role
- Secondary button for Duplicate Role
- Same button size, radius, spacing, and icon style as the full system

Current issue:
The left role list and right permission details feel like a custom settings layout.

Fix approach:
Use a standard management layout that still feels like the design system.

Layout:
- Keep role list on the left only if styled like a standard list/table panel.
- Make the right details area use normal card sections.
- Do not make it look like a different application.

Left role list:
Use a clean list panel with:
- Search roles
- Role cards/list items

Role item style:
- same radius as other table/list items
- same border
- same hover
- same selected state
- compact height
- no oversized custom card design

Each role item should show:
- Role name
- Access level
- Status badge
- User count

Selected role:
Use the same active color and focus ring as secondary navigation/table selected rows.

Right role details:
Use standard cards, not custom blocks.

Sections:
1. Role Summary card
2. Permission Coverage card
3. Permissions by Module card/list

Role Summary card:
Show:
- Role name
- Description
- Access level
- Status
- Users
- Total permissions

Use standard card style.

Permission Coverage:
Use the shared StatCard or compact progress list style.
Do not create a new visual pattern.

Permissions by Module:
Use accordion cards that follow the approved card style.

Each module permission card:
- Module name
- selected count / total count
- progress bar
- permission chips or list
- expand/collapse icon

The accordion must use:
- same border
- same radius
- same padding
- same spacing
- smooth animation
- theme-aware colors

Do not use random teal-heavy blocks.
Do not over-color every permission chip.
Keep it calm and readable.

Create Role:
Open Create Role in a modal.

Modal layout:
- 2-column layout on desktop
- left: role details
- right: permissions
- search permissions box
- select all
- module accordions
- permission counter
- sticky modal footer

Edit Role:
Open Edit Role in the same modal style.
Pre-fill existing role details and permissions.

Delete Role:
Open confirmation modal.
Do not delete immediately.

Duplicate Role:
Open modal with duplicated role data.
Require new role name before saving.

Permission Search:
Search must be functional.
When searching:
- filter permission items
- keep parent module visible if it has matching permissions
- show match count
- show empty state if no permissions match

Actions:
For role list:
- clicking a role loads details on the right
- no page jump
- selected state updates
- breadcrumb stays on Role Management

For empty state:
Only show “Select a Role” when no role is selected.
After selecting a role, show full role details.

Design System Alignment:
Apply the same component tokens used in other pages:

Surface:
- same page background
- same card background
- same table background

Borders:
- same border color
- same 1px border
- no random darker/lighter borders

Radius:
- same card radius
- same button radius
- same input radius
- same badge radius

Shadow:
- same subtle card shadow
- no heavy shadow
- no random glow

Typography:
- page title follows H1/H2 hierarchy
- subheading follows body text style
- table header follows approved table header style
- labels follow caption style
- no custom font size outside the approved scale

Spacing:
- page horizontal padding must match all other modules
- header spacing must match table pages
- card gap must match dashboard/table pages
- toolbar height must match table pages
- row height must match table pages

Buttons:
All buttons must use the shared Button component.

Button variants:
- primary
- secondary
- outline
- ghost
- danger

Do not create page-specific button styles.

Status Badges:
Use the shared StatusBadge component.

Supported statuses:
- Active
- Inactive
- Pending
- Approved
- Rejected

Do not create custom status badge styles for User Management or Role Management.

Tables:
Use the shared DataTable component.

Table rules:
- consistent header
- consistent row height
- consistent hover
- consistent pagination
- consistent empty state
- consistent toolbar
- consistent action column
- consistent responsive behavior

Responsive Rules:
Desktop:
- User Management uses full-width table layout.
- Role Management can use left role list + right details.
- Keep spacing aligned with other modules.

Tablet:
- User Management table becomes horizontally scrollable if needed.
- Role Management left list can stack above details.

Mobile:
- User Management rows can become compact cards.
- Role Management role list opens first, then details view.
- Create/Edit Role modal becomes single-column full-screen sheet.
- No horizontal layout breaking.

Motion:
Use approved smooth motion tokens.

Apply to:
- row hover
- selected state
- details drawer
- modals
- permission accordions
- dropdowns

Do not use sudden linear animation.

Final Result:
User Management and Role Management should no longer feel like separate settings pages.

They should match the same design system used in:
- Dashboard
- Return View Approval
- Register & Stock
- Stock Register
- PSR Approval
- Certificate Requests
- Case & Financial Management

The final output should feel like one unified government office management system.