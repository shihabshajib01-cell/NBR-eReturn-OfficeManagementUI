Design a complete login experience for the NBR office managment System.

This login page must match the existing product design system used across Dashboard, Report, Return Register, Register & Stock, PSR & Verification, Case & Financial Management, Administration & Requests, User Management, Role Management, notification dropdown, account dropdown, modals, drawers, tables, cards, and appearance settings.

Do not make the login page look like a separate product.
It must feel like the official entry point of the same system.

Core layout:
Create a fully responsive 2-column login page.

Desktop layout:
- Left side: information/news slider
- Right side: login form
- Left side width: 45% to 50%
- Right side width: 50% to 55%
- Keep both sections vertically balanced
- Use generous whitespace
- Keep the page clean, official, and modern

Mobile layout:
- Stack content vertically
- Login form should come first or remain easy to reach
- Slider can move below the login form or become compact
- Avoid long scrolling before login
- Keep inputs large enough for touch

Left slider section:
Create a visual news/information carousel.

Purpose:
The left side should show useful recent information, not just decoration.

Slider content types:
- recent notices
- tax filing reminders
- online return updates
- system maintenance notices
- security reminders
- user guidance
- government service announcements

Each slide should include:
- large image or official-style illustration
- short headline
- short paragraph
- optional date or label
- slide dots
- previous/next controls if needed

Use 3 sample slides:
1. Online Return Submission
2. Secure Office Access
3. Important Service Notice

Left slider visual direction:
- clean institutional illustration
- soft background
- light pattern or subtle graphic detail
- do not use busy visuals
- do not use loud gradients
- do not use marketing-heavy design
- keep it calm and official

Right login section:
Create a login card or form panel.

Login form must include:
- NBR / office branding area
- system name
- welcome heading
- short subheading
- User ID or email field
- password field
- show/hide password icon
- remember me checkbox
- forgot password link
- sign in button
- optional user manual button
- optional language switcher
- support/help text at the bottom

Captcha behavior:
Captcha must not appear by default.

Create two form states:
1. Normal login state without captcha
2. Captcha-required state after multiple failed attempts

Captcha state:
After multiple failed attempts, show:
- captcha image/code area
- captcha input field
- refresh captcha button
- short helper message
- error message if captcha is wrong

Important:
Captcha should appear smoothly below the password field.
It should not shift the whole page aggressively.
It should feel like part of the same form.

Login interaction flow:
Create the interaction logic clearly.

1. User opens login page
2. User enters any User ID/email and any password
3. User clicks Sign in
4. Show a short loading state
5. Navigate into the main system/dashboard

For prototype/demo purpose:
- Do not require real authentication
- Any typed/random input should allow login after clicking Sign in
- But still design validation states for real implementation later

Logout flow:
The system already has an account/profile dropdown in the top-right header.

Add this behavior:
- In the account dropdown, clicking Sign Out opens a confirmation modal
- If user confirms Sign Out, log the user out
- Redirect the user to the login page
- Clear active session state in the prototype
- Login page becomes the default unauthenticated screen

Sign out confirmation modal:
Title:
Sign out?

Message:
You will need to sign in again to access your account.

Buttons:
Cancel
Sign Out

Do not sign out immediately without confirmation.

Required login page states:
Create the following states:
- Default login state
- Input focus state
- Password visible state
- Empty field validation state
- Wrong User ID/password state
- Failed attempt warning state
- Captcha required state
- Wrong captcha state
- Loading/signing in state
- Account locked state
- Forgot password helper state
- Mobile responsive state

Use the exact UX writing below:

Login heading:
Welcome back

Login subheading:
Sign in to access your office workspace.

User ID label:
User ID or email

User ID placeholder:
Enter your User ID or email

Password label:
Password

Password placeholder:
Enter your password

Remember me:
Remember me

Forgot password:
Forgot password?

User manual button:
User Manual

Sign in button:
Sign in

Loading button:
Signing in...

Default helper text:
Use your assigned office account to continue.

Empty User ID error:
Enter your User ID or email.

Empty password error:
Enter your password.

Wrong credentials error:
The User ID or password does not match our records.

Failed attempt message:
Sign-in failed. Please check your details and try again.

Multiple failed attempts message:
For your security, captcha is now required.

Captcha label:
Captcha

Captcha placeholder:
Enter the captcha code

Captcha helper text:
Enter the code shown in the image to continue.

Wrong captcha error:
The captcha code is incorrect. Please try again.

Captcha refresh label:
Refresh captcha

Account locked title:
Account temporarily locked

Account locked message:
Too many failed attempts. Please try again later or contact your administrator.

Account locked button:
Back to sign in

Forgot password heading:
Reset your password

Forgot password helper text:
Enter your User ID or email. We will send password reset instructions if the account exists.

Forgot password field placeholder:
Enter your User ID or email

Forgot password submit button:
Send reset instructions

Forgot password success message:
If this account exists, reset instructions have been sent.

Forgot password back link:
Back to sign in

Design system rules:
Use the same design system as the main application.

Typography:
- Use selected system font
- Support Poppins, Noto Sans, and Google Sans
- Follow the global typography scale
- No all-caps text
- Keep headings strong but not oversized
- Keep form labels readable

Color:
Support all existing themes:
1. Indigo Blue
2. Government Blue
3. Slate Purple
4. Plum Executive
5. Fresh Teal
6. Gmail-inspired Dark Mode

Use theme tokens only.
Do not hardcode random colors.
The login page must change with the selected theme where applicable.

Component consistency:
Use the same:
- button style
- input style
- checkbox style
- icon style
- border radius
- card shadow
- spacing
- focus state
- error state
- modal style
- animation style

Input rules:
- clear labels
- visible focus state
- error message below field
- show/hide password icon
- same height as system inputs
- same radius as system inputs

Button rules:
- primary button for Sign in
- secondary/ghost style for User Manual and Back actions
- danger style only for Sign Out confirmation
- same radius, height, icon size, and hover style as the system

Motion:
Use smooth easing.
Do not use sudden linear animation.

Apply motion to:
- slider transition
- input focus
- password visibility toggle
- captcha reveal
- modal open/close
- sign-in loading state
- sign-out redirect

Use calm timing:
- hover: 120–180ms
- dropdown/modal: 200–260ms
- captcha reveal: 180–240ms
- slider transition: 300–450ms

Accessibility:
- Fully keyboard accessible
- Strong contrast
- Clear focus ring
- Labels must not be replaced by placeholder only
- Error messages must be readable
- Captcha must include refresh control
- Touch targets must work on mobile
- Follow WCAG 2.1 AA where possible

Golden rules:
- Keep the login page consistent with the existing system
- Do not redesign the full product
- Do not use all-caps text
- Do not create random component styles
- Do not make the left slider too busy
- Do not show captcha by default
- Captcha appears only after multiple failed attempts
- Sign Out from the account dropdown must redirect to login page
- Login button should take the user into the system for prototype/demo
- Use reusable components
- Use theme tokens
- Use smooth motion
- Keep the design professional, calm, and government-ready

Final outcome:
The login page should feel like the secure front door of the same government office management system.
It should be clean, trusted, responsive, accessible, and connected to the real login/logout flow.