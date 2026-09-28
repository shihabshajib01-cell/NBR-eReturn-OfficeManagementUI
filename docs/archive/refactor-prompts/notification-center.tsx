Create a fully functional notification dropdown for the government office management UI.

Do not redesign the full UI.
Do not change the app shell structure.
Do not change the top bar layout except for improving the notification behavior.
Do not add the removed “?” help icon again.
Do not add the removed bottom-left user avatar again.
Only improve the notification icon, notification dropdown, and notification destination behavior.

Main Goal:
Turn the notification icon into a real workflow notification center that helps officers find and act on important updates.

Notification Icon Behavior:
The notification icon must visually react based on notification state.

States:
1. No new notifications
   - normal icon state
   - no red dot
   - no count badge
   - tooltip: Notifications

2. New notifications
   - show red unread dot or small count badge
   - use subtle animation only once when new notification arrives
   - tooltip: New notifications

3. Many unread notifications
   - show count badge
   - if count is above 99, show 99+

Do not make the notification icon too loud.
Keep it clean and professional.

Notification Dropdown Behavior:
Clicking the notification icon opens a dropdown from the top-right header.

Dropdown rules:
- Position under the notification icon.
- Align to the right edge of the header.
- Width: around 380px–440px on desktop.
- On small screens, use full-width or bottom-sheet style.
- Height should be dynamic.
- If there are few notifications, dropdown height should stay small.
- If there are many notifications, dropdown can grow.
- Maximum height should be calculated from viewport height, such as max-height: calc(100vh - topbar height - safe margin).
- After max height, use internal scrolling.
- Do not let the dropdown overflow outside the screen.
- Do not scroll the whole page when scrolling notifications.
- Use theme-aware custom scrollbar.

Dropdown Header:
Include:
- Title: Notifications
- unread count badge if available
- Mark all as read action
- close action only if needed on mobile

Example:
Notifications · 5 new

Notification Filters:
Add simple filter chips or tabs:
- All
- Unread
- Approvals
- Assigned
- Security

Keep filters compact.
Do not add too many tabs.

Notification List:
Each notification item should include:
- icon based on notification type
- title
- short message
- module name
- time
- unread/read state
- priority/status indicator if needed

Unread notification style:
- slightly stronger background
- small unread dot
- bold or stronger title

Read notification style:
- normal background
- no unread dot
- softer text

Notification Item Layout:
Use a clean reusable notification item component.

Structure:
- left: type icon
- center: title, message, module/time
- right: unread dot or status badge
- row hover state
- keyboard focus state

Notification Types:
Support these notification categories:

Approvals:
- Return approval pending
- PSR approval pending
- Certificate approval pending
- Appeal approval pending
- Tribunal approval pending
- Demand/payment approval pending
- Register-5 approval pending

Status Updates:
- Record approved
- Record rejected
- Record verified
- Record issued
- Record transferred
- Record marked invalid
- Record moved to dormant

Assignments:
- New case assigned
- Return assigned for review
- Certificate request assigned
- PSR record assigned
- Audit item assigned

Corrections:
- PSR edit request submitted
- Certificate edit request submitted
- Misfiled return detected
- Double entry needs verification
- Invalid record requires action

Payments:
- New demand created
- Payment received
- Outstanding amount pending
- Refund request submitted
- Ledger updated

User and Role:
- New user created
- User invite sent
- User activated or deactivated
- Role changed
- Permission updated
- Two-factor authentication required

Security:
- New login detected
- Failed login attempt
- Password reset requested
- Permission changed
- Suspicious activity detected

System:
- Report export completed
- Scheduled report ready
- Import failed
- Backup completed
- Maintenance notice

Destination Rule:
Every notification must have a destination.

Clicking a notification should:
- mark it as read
- close the dropdown
- navigate to the related module/page
- open the related record if possible
- open the details drawer if the notification is record-specific
- highlight the related record or selected state where useful

Examples:
Return approval pending:
Navigate to:
Home › Return Register › Return View Approval
Then open the related return details drawer.

PSR edit request submitted:
Navigate to:
Home › PSR & Verification › PSR Edit Request
Then open the related PSR record drawer.

Arrear case pending approval:
Navigate to:
Home › Case & Financial Management › Litigation Management › Arrear Approval
Then open the related case drawer.

Certificate approval pending:
Navigate to:
Home › Administration & Requests › Certificate Req › Approval Request
Then open the related certificate request drawer.

Role changed:
Navigate to:
Home › Administration & Requests › Role Management
Then open related role details.

New user created:
Navigate to:
Home › Administration & Requests › User Management
Then open user details drawer.

Report export completed:
Navigate to related report page and show export/download status.

Notification Actions:
For simple notifications:
- clicking the row opens destination

For approval notifications:
Optional quick actions can appear inside the notification row only if space allows:
- Review
- Approve
- Reject

But default should be:
- Review

Avoid too many action buttons inside the dropdown.
Main action should happen on the destination page or drawer.

Footer:
At the bottom of the dropdown, add:

Button:
See all notifications

Behavior:
- opens full Notification Center page or drawer
- shows all notifications with filters, search, status, and pagination

Use exact label:
See all notifications

Empty State:
If there are no notifications, show a small empty state:

Title:
No notifications

Message:
You are all caught up.

Do not use generic placeholder text.

Loading State:
Show skeleton notification rows while loading.

Error State:
If notifications fail to load, show:

Title:
Unable to load notifications

Message:
Please try again.

Button:
Retry

Notification Center Page:
If “See all notifications” opens a full page, use this structure:

Page title:
Notifications

Subtitle:
Review system alerts, assignments, approvals, and status updates.

Toolbar:
- Search notifications
- All types
- All status
- Date range
- Mark all as read

List/table:
- Notification
- Type
- Module
- Status
- Time
- Action

Action:
- View

Clicking View follows the same destination rule.

Read / Unread Management:
Support:
- mark single notification as read after click
- mark all as read
- unread count update
- filter by unread
- preserve read state after navigation

Priority Rules:
Use clear but calm priority levels:
- High
- Medium
- Low

Do not overuse high priority.
Only urgent approvals, security events, and failed system jobs should appear as high priority.

Visual Design:
Use the same design system.

Dropdown must follow:
- same radius
- same border
- same shadow
- same typography
- same icon style
- same hover state
- same focus state
- same theme tokens
- same scrollbar behavior

Light mode:
- clean white/surface background
- subtle border
- soft shadow
- readable text

Dark mode:
Use Gmail-inspired dark theme:
- charcoal surface
- muted border
- soft hover state
- no neon
- no loud blue

Accessibility:
- Notification icon must be keyboard accessible.
- Dropdown must be keyboard navigable.
- Escape key closes dropdown.
- Clicking outside closes dropdown.
- Screen reader label: Notifications
- Badge count should be announced.
- Unread status should be announced.
- Notification rows should have accessible labels.
- Focus should return to notification icon after closing.
- Do not rely only on color for unread or priority state.

Responsive Rules:
Desktop:
- dropdown opens under notification icon
- max height based on viewport
- internal scroll after max height

Tablet:
- dropdown can be wider or centered if needed
- still attached to top-right interaction

Mobile:
- use full-width panel or bottom sheet
- large touch targets
- sticky header and footer
- internal scroll list

Golden Rules:
- Keep the current app shell.
- Keep the current navigation pattern.
- Keep the top-right user profile.
- Do not add duplicate user avatar in sidebar.
- Do not bring back the “?” help icon.
- Notifications must be actionable, not decorative.
- Every notification must have a destination.
- No notification should lead to an empty page.
- Use the correct breadcrumb and selected navigation state after clicking a notification.
- Do not create fake navigation inside the dropdown.
- Keep the UI clean and calm.
- No all-caps text.
- Keep all styles token-based.
- Follow the selected theme, font, and font size.
- Follow WCAG 2.1 AA where possible.

Final Result:
The notification icon should open a polished, responsive, fully functional notification dropdown.

The dropdown should:
- show unread state
- adjust height based on notification count
- scroll after max height
- support filters
- support mark all as read
- include See all notifications
- route each notification to the correct page, record, drawer, or workflow
- match the full design system
- work in light themes and Gmail-style dark mode