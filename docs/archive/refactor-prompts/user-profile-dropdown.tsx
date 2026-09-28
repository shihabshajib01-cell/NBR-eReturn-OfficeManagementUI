Create a fully functional account/profile dropdown for the top-right user profile area.

Do not redesign the full UI.
Do not change the app shell.
Do not change the left navigation.
Do not add the removed bottom-left user avatar again.
Do not bring back the removed “?” help icon.
Only improve the top-right user profile dropdown.

Main Goal:
When the user clicks the top-right profile area, open a clean account dropdown that shows profile information, account actions, security options, and user preferences in a design consistent with the full system.

Trigger Area:
Use the existing top-right user profile button.

Current trigger includes:
- user avatar / initials
- user name
- designation
- dropdown arrow

Keep this trigger.
Make it clickable.
Add hover, active, and focus states.

Dropdown Position:
- Open under the top-right profile trigger.
- Align to the right edge of the header.
- Width: 360px–420px on desktop.
- On mobile, use a full-width panel or bottom sheet.
- Do not overflow outside the viewport.
- Use max-height based on viewport.
- If content exceeds height, use internal scroll.
- Use theme-aware custom scrollbar.

Dropdown Header:
Show the main user identity clearly.

Include:
- large circular profile picture or initials avatar
- user name
- designation
- office / department if available
- email address
- status badge if useful, such as Active

Example:
Rafiqul Islam  
Commissioner  
Dhaka North · Circle-1  
rafiqul@gov.bd

Profile Picture:
- Show profile image if available.
- If no image exists, show initials avatar.
- Keep avatar style consistent with the design system.
- Use selected theme accent for initials avatar.
- Do not duplicate the profile avatar in the left sidebar.

Account Summary Section:
Show compact account information.

Fields:
- Employee ID
- Role
- Access Level
- Zone
- Circle
- Last Login

Keep it short.
Do not make this section feel like a full user details drawer.

Main Actions:
Add clear account-related actions.

Actions:
- View Profile
- Account Settings
- Change Password
- Security Settings
- Activity Log
- Sign Out

Optional actions:
- Switch Account
- Manage 2FA
- Download Activity Report

Use only actions that make sense for this system.

Action Behavior:
- View Profile opens the user’s own profile/details drawer or page.
- Account Settings opens account preference settings.
- Change Password opens a secure password modal.
- Security Settings opens security options such as 2FA and login activity.
- Activity Log opens recent account activity.
- Sign Out opens confirmation before logging out.

Do not sign out immediately without confirmation.

Dropdown Layout:
Use this structure:

1. Header identity block
2. Account summary
3. Quick actions
4. Security section
5. Footer actions

Suggested layout:

Header:
- avatar
- name
- designation
- email

Account summary:
- Employee ID
- Role
- Zone / Circle
- Last Login

Quick actions:
- View Profile
- Account Settings
- Activity Log

Security:
- Change Password
- Manage 2FA
- Login & Device Activity

Footer:
- Sign Out

Sign Out Behavior:
Use a confirmation modal.

Title:
Sign out?

Message:
You will need to sign in again to access your account.

Buttons:
- Cancel
- Sign Out

Do not use aggressive wording.

Design System Rules:
The dropdown must follow the existing design system.

Use:
- same radius
- same border
- same shadow
- same typography
- same icon style
- same spacing
- same button style
- same hover state
- same focus state
- same theme tokens
- same dark mode behavior

Light mode:
- clean surface background
- soft border
- subtle shadow
- calm accent color

Dark mode:
Use the Gmail-inspired charcoal dark mode:
- app background: #202124
- surface: #282A2D
- elevated surface: #35363A
- border: #3C4043
- text primary: #E8EAED
- text secondary: #BDC1C6
- muted text: #9AA0A6
- primary accent: #8AB4F8

Theme Support:
The dropdown must respond to all 6 themes:
1. Indigo Blue — #4B5694
2. Government Blue — #2C5EAD
3. Slate Purple — #4A4466
4. Plum Executive — #744577
5. Fresh Teal — #36ADA3
6. Gmail-inspired Dark Mode

Font Support:
The dropdown must respond to the selected font:
- Poppins
- Noto Sans
- Google Sans

Font Size Support:
The dropdown must respond to global font size presets:
- Compact
- Standard
- Large

Accessibility:
- Profile trigger must be keyboard accessible.
- Enter or Space opens the dropdown.
- Escape closes the dropdown.
- Clicking outside closes the dropdown.
- Focus must stay inside the dropdown while open.
- Focus returns to profile trigger after close.
- Each action must have clear accessible labels.
- Icons cannot be the only meaning.
- Maintain WCAG 2.1 AA contrast.
- Touch targets must be large enough on mobile.

Responsive Behavior:
Desktop:
- dropdown opens under top-right profile area.
- right aligned.
- compact but readable.

Tablet:
- dropdown can be wider if needed.
- keep all actions touch-friendly.

Mobile:
- use full-width panel or bottom sheet.
- sticky header if content is long.
- sign out stays visible near the bottom.

Golden Rules:
- Keep the current app shell.
- Keep the top-right user profile as the only user identity entry point.
- Do not add user avatar back to the left sidebar.
- Do not bring back the “?” help icon.
- Keep the dropdown consistent with the selected theme.
- Keep the dropdown calm, professional, and government-grade.
- Do not use flashy animation.
- Do not use all-caps text.
- Do not add unnecessary account clutter.
- Every action must have a clear purpose.
- Do not create page-specific content inside the account dropdown.
- Do not mix notification items into the account dropdown.
- Use reusable dropdown, menu item, avatar, badge, and modal components.

Final Result:
The top-right user profile should open a polished account dropdown similar in structure to Google’s account menu, but fully adapted to this government office management UI.

It should show:
- profile picture or initials
- user name
- designation
- email
- role and office summary
- account actions
- security actions
- sign out confirmation

The dropdown must feel native to the full system and work across all themes, font choices, font-size presets, and responsive screen sizes.