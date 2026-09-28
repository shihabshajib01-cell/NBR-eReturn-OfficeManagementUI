Fix the current Settings > User Management screen and Add User modal. Do not redesign the full system. Keep the existing app shell, navigation, theme system, font selector, color palette, and working flows.

Golden Rules:
- Each page must feel like part of one continuous process.
- Never break something that is already working.
- Use one unified design system across all pages and flows.
- Keep icons, font sizes, colors, shadows, spacing, cards, forms, tables, drawers, modals, filters, and interaction patterns consistent.
- Follow accessibility best practices and WCAG 2.1 AA where possible.
- No clumsy or cluttered UX.
- Every screen must be fully responsive from large desktop to mobile.
- No all-caps text.
- Every reusable item such as tables, forms, buttons, filters, drawers, modals, cards, tabs, accordions, navigation items, badges, and action menus must look and behave consistently.
- Add, edit, delete, view, activate, deactivate, export, filter, search, pagination, modal, tooltip, and confirmation actions must follow the same interaction pattern everywhere.
- Build with code-level thinking. Keep every component separate, modular, and editable.
- Changing one component should not break the overall structure.
- Keep theme-aware custom scrollbar styling.
- Reuse existing components and tokens as much as possible.

Main Goal:
Make User Management and Add User modal cleaner, more balanced, responsive, and usable. Fix the modal overflow issue and remove unnecessary second-layer navigation identity content.

Fix 1: Second-layer Settings navigation
- Remove the portal identity block from the second-layer navigation:
  - Remove “Tax Office Portal”
  - Remove “eReturn Management System”
- Keep only the actual second-layer navigation items:
  - User Management
  - Role Management
- Add relevant icons:
  - User Management: user-group icon
  - Role Management: shield/key/permission icon
- Expanded state: icon + label
- Collapsed state: icon only
- Tooltip on hover/focus with full label
- Keep active state theme-aware and accessible.

Fix 2: User Management page layout
- Use available width better.
- Reduce the large empty right-side space.
- Keep a clean max-width only if it feels intentional, otherwise let content expand.
- Align page header, stats, filters, table, and pagination to the same content width.
- Keep page title:
  User Management
- Keep subtitle:
  Manage system users, roles, and access permissions

Fix 3: Header actions
- Keep these actions:
  - Manage Roles
  - Export
  - Add User
- Add User must be the primary button.
- Manage Roles and Export must be secondary buttons.
- Align actions cleanly to the right of the page title area.
- Use reusable button components.

Fix 4: Summary cards
- Keep four summary cards:
  - Total
  - Active
  - Inactive
  - Pending
- Make them equal width and aligned with the table.
- Use subtle theme-aware icons and borders.
- Do not make them too tall.
- On desktop, show 4 cards in one row.
- On tablet, show 2 columns.
- On mobile, show 1 column or compact 2-column if space allows.

Fix 5: Filter row
- Keep:
  - Search users
  - All Status
  - All Zones
  - All Levels
  - All Roles
  - results count
- Search input should be wider than dropdowns.
- All fields must have equal height.
- Keep spacing consistent.
- On mobile, filters stack vertically.

Fix 6: User table
- Keep columns:
  - User
  - Role / Level
  - Circle - Zone
  - Status
  - Last Active
  - Actions
- Improve table width and spacing.
- Make rows easier to scan.
- Keep avatars, user name, employee ID, and email readable.
- Keep role as main text and level as secondary text.
- Keep circle as main text and zone as secondary text.
- Status badge must be reusable and theme-aware.
- Row hover state must be visible but soft.
- Pagination must align with the table width.
- Action icons need proper spacing, tooltip, and focus state.
- If there are too many actions, use a compact “More actions” menu for less-used actions.

Fix 7: Add User modal overflow
- Fix the modal height problem.
- Modal must not cut off content.
- Use this structure:
  - Fixed modal header
  - Scrollable modal body
  - Fixed modal footer
- Modal body should scroll smoothly with custom theme-aware scrollbar.
- Footer buttons must always remain visible.
- Do not let the Account Setup section get hidden behind the footer.

Fix 8: Add User modal layout
- Keep modal title:
  Add User
- Subtitle:
  Create a user account and assign access
- Use a clean form with three reusable sections:
  1. Basic Information
  2. Access Setup
  3. Account Setup
- Keep field labels visible. Do not rely on placeholder only.
- Required fields should show a simple required indicator.
- Keep fields aligned in a clean 2-column grid on desktop.
- On mobile, fields stack into 1 column.

Basic Information fields:
- Full Name
- Employee ID
- Email
- Phone
- Designation
- Zone
- Circle

Access Setup fields:
- Level
- Role
- Manage Roles link

Account Setup fields:
- Status
- Send invite email to user
- Two-factor authentication, if available

Fix 9: Role summary inside Add User modal
- The role summary should not be cut off.
- Make it compact and readable.
- Show:
  - Selected role
  - Selected level
  - Total permissions
  - Included modules
  - View permissions
- If space is limited, place Role Summary below Access Setup instead of squeezing it on the right.
- On desktop, it can be a right-side compact card only if the modal has enough width.
- On tablet/mobile, it must stack below the Access Setup section.

Fix 10: Modal buttons
- Footer actions:
  - Cancel
  - Save User
- Save User is primary.
- Cancel is secondary.
- Buttons should be aligned right on desktop.
- Buttons should be full-width or stacked on mobile.

Fix 11: Theme and scrollbar
- Keep theme chooser intact.
- Keep font chooser intact.
- All colors must respond to selected theme.
- Replace harsh/default scrollbar with custom theme-aware scrollbar.
- Scrollbar thumb uses selected theme primary.
- Scrollbar track uses selected theme primary light or background.
- Scrollbar hover uses primary dark.

Fix 12: Accessibility
- All inputs need visible labels.
- Buttons and icon actions need focus states.
- Icon-only actions need tooltips.
- Modal must support keyboard navigation.
- When Add User modal opens, focus moves to the modal title or first field.
- Esc closes modal.
- Closing modal returns focus to Add User button.
- Modal background overlay must not reduce readability.
- Ensure contrast meets WCAG 2.1 AA where possible.

Do Not Change:
- Do not change main navigation item names.
- Do not remove User Management or Role Management.
- Do not change Report page logic.
- Do not add Role Group.
- Do not create extra pages.
- Do not redesign the whole system.
- Do not remove theme chooser or font chooser.

Final Result:
A cleaner User Management page and Add User modal where:
- second-layer navigation is simpler
- table uses available width better
- actions are clearer
- modal content no longer gets cut off
- modal has fixed header, scrollable body, fixed footer
- every component remains reusable, theme-aware, responsive, and accessible.