Fix only the broken layout and interaction issues in the current User Management screen and Add User modal. Do not redesign the whole UI. Do not change colors, theme system, font selector, navigation names, table columns, or page logic.

Golden Rules:
- Never break something that is already working.
- Use one unified component system.
- No all-caps text.
- No overlapping UI elements.
- No floating fields.
- No broken spacing.
- No tooltip in the wrong place.
- Every reusable component must be modular and editable.
- Keep WCAG 2.1 AA accessibility where possible.
- Use theme-aware custom scrollbars.
- Keep the design clean and responsive.

Critical Fix 1: Add User Modal Layout
The current modal has overlapping fields. Fix it completely.

Modal structure must be:
- Fixed modal header
- Scrollable modal body
- Fixed modal footer

The modal body must use vertical auto-layout with proper section gaps.
No section can overlap another section.

Use this exact layout order:

1. Basic Information section
2. Access Setup section
3. Account Setup section

Each section must be a separate reusable component:
- FormSection
- SectionHeader
- FormGrid
- FormField

Basic Information section:
Use a 2-column grid on desktop.

Row 1:
- Full Name
- Employee ID

Row 2:
- Email
- Phone

Row 3:
- Designation
- Zone

Row 4:
- Circle

Important:
The Circle field must stay inside the Basic Information section.
The Circle field must not overlap or float over Access Setup.
The Basic Information section height must grow naturally to contain all fields.

Access Setup section:
Start only after Basic Information is fully complete.
Use a 2-column grid:

Row 1:
- Level
- Role

Below the fields, show Role Summary as a compact card:
- selected role
- selected level
- total permissions
- included modules
- View permissions link

Account Setup section:
Start only after Access Setup is fully complete.
Fields:
- Status
- Send invite email to user
- Require Two-Factor Authentication (2FA)

Modal footer:
- Cancel
- Save User

Footer must always remain visible.
The body should scroll behind it if content is taller than the modal.

Critical Fix 2: Modal Sizing
Use a large but controlled modal.

Desktop:
- Modal width: 720px to 840px
- Max height: 88vh
- Header fixed
- Body scrollable
- Footer fixed

Tablet:
- Modal width: 90vw
- Body scrollable

Mobile:
- Modal becomes full-screen
- Fields stack into one column
- Footer is sticky at bottom

Critical Fix 3: Remove Wrong Tooltip Behavior
The tooltip “User Management” is appearing inside the page/table area. This is wrong.

Fix tooltip logic:
- Second-layer navigation tooltip must appear only when hovering or focusing a collapsed second-layer navigation icon.
- Do not show second-layer navigation tooltip when hovering table rows, buttons, action icons, or empty page areas.
- Table action icons may have their own tooltips:
  - View
  - Edit
  - More actions
But they must not show “User Management”.

Critical Fix 4: Second-layer Navigation Icons
Apply icons to all second-layer navigation items and keep behavior consistent.

Expanded second-layer nav:
- show icon + label

Collapsed second-layer nav:
- show icon only
- show tooltip on hover/focus

For Settings:
- User Management: users icon
- Role Management: shield/key icon

Do not show any portal identity block inside second-layer navigation.

Critical Fix 5: Table Action Tooltip
Table action icons must use their own correct tooltip labels.

For User Management table:
- eye icon tooltip: View user
- pencil icon tooltip: Edit user
- more icon tooltip: More actions

Do not show navigation tooltips inside table actions.

Critical Fix 6: Auto-layout Discipline
Apply proper auto-layout constraints:
- Every form section must hug content height.
- Form sections must have consistent vertical spacing.
- Fields must not use absolute positioning.
- Modal body must not use fixed heights that cause overlap.
- Use spacing tokens consistently.
- Avoid nested scroll areas unless necessary.

Spacing:
- Section gap: 16px to 20px
- Field gap: 16px
- Section padding: 16px to 20px
- Modal body padding: 24px
- Modal header/footer padding: 20px to 24px

Critical Fix 7: Accessibility
- Every input must have a visible label.
- Required fields must show required indicator.
- Modal close button must be keyboard accessible.
- Focus should move into modal when opened.
- Esc closes modal.
- Closing modal returns focus to Add User button.
- Tooltips must appear on hover and focus.
- No tooltip should block form fields.

Do Not Change:
- Do not change the main navigation items.
- Do not change User Management table columns.
- Do not change Report page logic.
- Do not remove theme chooser.
- Do not remove font chooser.
- Do not add Role Group.
- Do not create new unrelated pages.

Final result:
The Add User modal must have no overlapping fields, no floating Circle field, no broken section spacing, a fixed header, scrollable body, fixed footer, correct tooltip behavior, and clean second-layer navigation icons.