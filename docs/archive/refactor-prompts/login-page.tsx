Create a polished, fully responsive login page for the NBR office managment System.

This login page must follow the same design system used in the main application: dashboard, reports, return register, register & stock, PSR & verification, case & financial management, administration, user management, role management, modals, drawers, dropdowns, cards, buttons, typography, and themes.

Do not make the login page look like a separate product.
Do not copy the old login page exactly.
Use the current layout direction, but fix the missing logo, broken captcha, weak UX writing, responsiveness, and design-system consistency.

Main Goal:
Design the official login page for the system.
It should feel secure, modern, government-grade, simple, and easy to use.

Page Layout:
Use a two-column layout on desktop.

Left side:
- Information and announcement slider
- Recent news
- Public notices
- tax awareness messages
- system update messages
- useful guidance for users

Right side:
- Login form
- system identity
- account access actions
- security feedback
- optional user manual link

Desktop Layout:
- Left section: 45% to 50% width
- Right section: 50% to 55% width
- Keep enough spacing between both sections
- Vertically center the main content
- Do not stretch the login card too wide
- Use a clean max-width for the form card

Mobile Layout:
- Stack layout vertically
- Show system logo and login form first
- Move the slider below the login form or make it a compact carousel
- Keep all form fields full width
- Make touch targets large enough
- Do not let the captcha break the layout
- Do not crop text or logos
- Keep the page scrollable if content is long

System Logo and Branding:
The current design is missing the proper system logo.

Add a clear system identity area above the login form.

Include:
- Government/NBR logo
- System logo
- System name: eReturn Office
- Optional short descriptor: NBR office managment System

Logo placement:
- Put the government/NBR logo and system logo in the top identity area
- Keep both visually balanced
- Do not use broken image placeholders
- If logo image is unavailable, use a clean initials-based system mark temporarily
- Never show broken image icons
- Do not place logos randomly outside the layout

Right Side Login Card:
Create a clean login card with the following structure:

1. System identity area
2. Welcome heading
3. Helper text
4. User ID field
5. Password field
6. Remember me checkbox
7. Forgot password link
8. Sign in button
9. User manual link
10. Captcha only after multiple failed attempts
11. Error and security messages when needed

Default Login State:
Captcha must NOT appear in the first/default state.

Default form fields:
- User ID
- Password
- Remember me
- Forgot password
- Sign in button
- User Manual link

Captcha Behavior:
Captcha appears only after multiple failed login attempts.

Rules:
- Do not show captcha by default
- Show captcha after 3 failed attempts
- Show helper message when captcha appears
- Captcha should appear smoothly below the password field
- Captcha must not break the layout
- Captcha image/box must be readable and aligned
- Include refresh captcha button
- Include captcha input field
- Include accessible label and helper text

Captcha State UX:
After 3 failed attempts, show:

Message:
For your security, please complete the captcha to continue.

Captcha section:
- Captcha input
- Captcha image
- Refresh captcha button
- Error message if captcha is wrong

Captcha error message:
The captcha code does not match. Please try again.

Captcha refresh label:
Refresh captcha

Failed Login Logic:
Create these states:

State 1: Default
No captcha. Normal login form.

State 2: Wrong password
Show inline error:
The User ID or password is incorrect. Please try again.

State 3: Captcha required
After repeated failed attempts, show captcha section.

State 4: Captcha error
Show captcha-specific error.

State 5: Account temporarily locked
Show locked account message after too many failed attempts.

Locked account message:
Your account is temporarily locked due to multiple failed sign-in attempts. Please try again later or contact your system administrator.

State 6: Loading
Button shows:
Signing in...

State 7: Empty field validation
Show field-specific messages:
User ID is required.
Password is required.

UX Writing:
Replace weak placeholder and button copy.

Use this final writing:

Main heading:
Welcome back

Helper text:
Sign in to access your office dashboard.

User ID label:
User ID

User ID placeholder:
Enter your User ID

Password label:
Password

Password placeholder:
Enter your password

Remember me:
Remember me

Forgot password:
Forgot password?

Primary button:
Sign in

User Manual button:
User manual

Captcha label:
Captcha verification

Captcha placeholder:
Enter captcha code

Captcha helper:
Complete the captcha after multiple failed attempts.

Wrong credential error:
The User ID or password is incorrect. Please try again.

Captcha trigger message:
For your security, please complete the captcha to continue.

Locked account message:
Your account is temporarily locked due to multiple failed sign-in attempts. Please try again later or contact your system administrator.

Support text:
Need help? Contact your system administrator.

Left Slider UX Writing:
Create 3 sample slides.

Slide 1:
Headline:
File Returns Online

Text:
Submit and review return records securely from one office system.

Slide 2:
Headline:
Track Approvals Faster

Text:
Monitor pending, approved, and rejected items with clear status updates.

Slide 3:
Headline:
Stay Updated

Text:
View important notices, system updates, and tax office announcements.

Do not use long paragraphs.
Do not use all-caps text.
Keep the writing short and useful.

Left Slider Design:
The left slider should include:
- large official-style illustration or image
- headline
- short text
- slide dots
- optional previous/next arrows
- smooth fade or slide animation
- no clutter
- no heavy decoration

The slider should support:
- images
- notices
- announcements
- recent news
- tax awareness content

Design System Colors:
Use only the approved design system colors.

Primary design-system themes:
1. Indigo Blue: #4B5694
2. Government Blue: #2C5EAD
3. Slate Purple: #4A4466
4. Plum Executive: #744577
5. Fresh Teal: #36ADA3
6. Gmail-inspired Dark Mode

For this login page, use the currently selected theme token.
Do not use random blue colors.
Do not use the old hardcoded blue unless it is part of the selected theme.
All buttons, links, focus states, slider accents, captcha refresh button, active dots, and selected states must use theme tokens.

Use semantic colors:
- Success for approved/success messages
- Warning for caution or captcha trigger
- Danger for login errors
- Neutral for helper text and inactive states

Typography:
Use the approved typography system.

Font options:
- Poppins
- Noto Sans
- Google Sans

The page must respond to selected font settings.

Typography hierarchy:
- Main heading: H1/H2 style
- Form labels: label/caption style
- Input text: body style
- Helper text: body/caption style
- Button text: button style

No text should fall outside the approved typography scale.

Font Size Presets:
The login page must respond to global font-size presets:
- Compact
- Standard
- Large

When font size changes, every text in the login page must update:
- heading
- labels
- inputs
- placeholders
- buttons
- errors
- slider text
- footer text
- captcha text

Input Design:
Use the shared input component.

Input states:
- default
- hover
- focus
- error
- disabled
- filled

Password field:
- Include show/hide password icon
- Icon should be inside the input
- Icon must be aligned properly
- Icon must have accessible label

Buttons:
Use shared button components.

Button styles:
- Primary: Sign in
- Secondary/outline: User manual
- Ghost/link: Forgot password
- Icon button: Refresh captcha

Do not create new button styles.

Login Card Style:
Use:
- same radius as design system cards
- same soft border
- same subtle shadow
- same padding scale
- same background surface
- same spacing logic

Do not use heavy shadows.
Do not use oversized card borders.
Do not make the card feel disconnected from the system.

Captcha Design:
Fix the captcha layout.

Captcha section should include:
- input field on the left
- captcha image/code box on the right
- refresh icon button
- clear spacing
- proper alignment
- responsive stacking on mobile

Desktop:
Captcha input and captcha image can sit in one row.

Mobile:
Captcha input, image, and refresh button stack neatly.

Never show broken captcha image.
If captcha image is unavailable, show a clean placeholder captcha code box.

Security and Feedback:
Add helpful feedback states:
- inline validation under fields
- form-level error near the top of the card
- captcha trigger warning
- account locked warning
- loading state

Do not use aggressive red blocks unless critical.
Keep messages calm and clear.

Accessibility:
- All inputs must have visible labels
- Do not rely only on placeholders
- All buttons must be keyboard accessible
- Focus states must be visible
- Contrast must meet WCAG 2.1 AA
- Error messages must be linked to the related input
- Captcha refresh button must have an accessible label
- Login form must work with keyboard navigation
- Touch targets must be at least 44px on mobile

Motion:
Use smooth, subtle animation.

Apply:
- slider transition
- button hover
- input focus
- captcha reveal
- error message reveal
- login card entrance

Motion rules:
- no sudden linear animation
- no bounce
- no flashy effect
- use ease-out / cubic-bezier motion
- respect reduced motion

Recommended motion:
- captcha reveal: fade + slight slide down
- slider: fade or soft horizontal slide
- button hover: subtle background/border transition
- card entrance: soft fade only

Dark Mode:
The login page must support dark mode.

Dark mode should use Gmail-inspired dark style:
- dark surface
- readable text
- soft borders
- muted helper text
- accessible input backgrounds
- visible focus states
- no harsh black background
- no overly bright accent blocks

Golden Rules:
- Do not show captcha by default.
- Captcha appears only after multiple failed attempts.
- Never show broken image placeholders.
- Add proper system logo and identity.
- Use only approved design-system colors.
- Use shared components for inputs, buttons, cards, icons, alerts, and captcha.
- Keep writing clear and human.
- No all-caps text.
- Keep the page fully responsive.
- Keep spacing clean and consistent.
- Keep the design professional and government-ready.
- Do not make the slider too busy.
- Do not create a separate visual style for login.
- Match the existing system typography, radius, border, shadow, and motion.
- Support all themes, dark mode, fonts, and font-size presets.

Final Deliverables:
Create the following screens/states:

1. Desktop login default state
2. Desktop login failed attempt state
3. Desktop login with captcha shown
4. Desktop captcha error state
5. Desktop account locked state
6. Mobile login default state
7. Mobile login with captcha shown
8. Dark mode login state
9. Left slider with 3 sample slides

Final Result:
The login page should feel like the official entry point of the same government office management system. It should be clean, secure, responsive, and aligned with the design system. The captcha must work as a conditional security step, not as a default form field.