Refine the motion and interaction behavior across the full government office management UI.

Do not redesign the UI.
Do not change layouts, navigation, tables, cards, modals, drawers, dropdowns, or themes.
Only improve the animation and transition behavior so interactions feel smoother, calmer, and more professional.

Main Goal:
Replace sudden, linear, harsh transitions with smooth, subtle, theme-consistent motion.

Golden Rules:
- Motion must feel calm, fast, and professional.
- Do not use flashy animation.
- Do not use bounce, elastic, overshoot, or playful effects.
- Do not make the system feel slow.
- Use easing instead of linear transitions.
- Keep all motion subtle and functional.
- Motion should help users understand state changes.
- Follow WCAG accessibility expectations.
- Respect reduced motion settings.
- If the user has reduced motion enabled, remove large movement and use simple opacity changes.
- Keep motion consistent across the full system.
- Do not create different animation styles for different pages.
- Motion should apply to light themes and dark mode.

Global Motion Tokens:
Create reusable motion tokens and apply them everywhere.

Use these timing values:
- micro interaction: 120ms–160ms
- hover/focus state: 120ms–180ms
- dropdown open/close: 160ms–220ms
- modal open/close: 200ms–260ms
- drawer open/close: 240ms–320ms
- page/content transition: 180ms–240ms
- table row hover: 120ms–160ms
- accordion expand/collapse: 220ms–280ms
- toast/notification: 200ms–260ms

Use easing:
- standard ease: cubic-bezier(0.2, 0, 0, 1)
- enter ease: cubic-bezier(0, 0, 0.2, 1)
- exit ease: cubic-bezier(0.4, 0, 1, 1)
- emphasized ease for drawers/modals: cubic-bezier(0.2, 0, 0, 1)

Do not use linear transitions.

Hover Effects:
Improve all hover states.

Apply to:
- navigation items
- table rows
- buttons
- cards
- dropdown items
- notification items
- account menu items
- icon buttons

Hover should use:
- subtle background change
- slight border-color change if needed
- no sudden jump
- no layout shift
- no aggressive shadow
- transition: background-color, border-color, color, box-shadow, transform
- duration: 120ms–180ms
- easing: cubic-bezier(0.2, 0, 0, 1)

Navigation Motion:
Primary, secondary, and third-layer navigation active states should transition smoothly.

Use:
- smooth background fill transition
- smooth icon color transition
- smooth text color transition
- smooth active indicator movement if present
- accordion expand/collapse for nested nav groups

Do not:
- make active states appear suddenly
- make navigation jump
- animate width aggressively

Dropdown Motion:
Apply to:
- notification dropdown
- account dropdown
- appearance dropdown
- filter dropdown
- select menus

Open animation:
- opacity: 0 to 1
- transform: translateY(-4px) to translateY(0)
- duration: 160ms–220ms
- easing: cubic-bezier(0.2, 0, 0, 1)

Close animation:
- opacity: 1 to 0
- transform: translateY(0) to translateY(-4px)
- duration: 120ms–160ms
- easing: cubic-bezier(0.4, 0, 1, 1)

Dropdowns must not pop suddenly.

Modal Motion:
Apply to all modals:
- Add User
- Edit User
- Create Role
- Edit Role
- Filter modal
- Confirm Approval
- Confirm Rejection
- Delete confirmation
- Sign out confirmation

Open animation:
- overlay fades in
- modal fades in
- modal scales from 0.98 to 1
- modal moves from translateY(8px) to translateY(0)
- duration: 200ms–260ms
- easing: cubic-bezier(0.2, 0, 0, 1)

Close animation:
- overlay fades out
- modal fades out
- modal scales from 1 to 0.98
- duration: 160ms–200ms
- easing: cubic-bezier(0.4, 0, 1, 1)

Do not use large sliding motion for modals.

Details Drawer Motion:
Apply to all right-side record details drawers.

Open animation:
- drawer slides from right to left
- opacity 0 to 1
- overlay fades in
- duration: 240ms–320ms
- easing: cubic-bezier(0.2, 0, 0, 1)

Close animation:
- drawer slides back to the right
- opacity 1 to 0
- overlay fades out
- duration: 180ms–240ms
- easing: cubic-bezier(0.4, 0, 1, 1)

Drawer content:
- content should fade in slightly after drawer opens
- no sudden content flash
- keep sticky footer stable

Table Motion:
Apply subtle table interactions.

Table row hover:
- background transition only
- duration: 120ms–160ms
- no row jump
- no scale effect

Opening details:
- row can show subtle selected state
- details drawer opens smoothly
- selected row remains highlighted while drawer is open

Pagination:
- active page state should transition smoothly
- table content can fade lightly when changing pages
- avoid full page flicker

Filter Motion:
Filter dropdown or panel should:
- open smoothly
- close smoothly
- show applied chips with subtle fade/slide
- avoid sudden layout jump

Applied filter chips:
- fade in
- small translateY from 2px to 0
- duration: 120ms–160ms

Accordion Motion:
Apply to:
- secondary navigation groups
- permission groups
- filter groups
- role permission accordions

Accordion behavior:
- animate height smoothly
- fade content in
- rotate chevron smoothly
- duration: 220ms–280ms
- easing: cubic-bezier(0.2, 0, 0, 1)

Do not let accordion content jump or overlap.

Notification Motion:
Notification dropdown should open smoothly.
Unread badge should update gently.

New notification:
- small unread dot appears with fade
- optional one-time soft pulse
- no continuous animation
- no distracting movement

Notification item hover:
- subtle background transition
- no scale jump

Account Dropdown Motion:
Use the same dropdown motion as notification.

Profile trigger:
- subtle hover border/background transition
- dropdown arrow rotates smoothly when open
- duration: 160ms–200ms

Appearance Panel Motion:
Appearance panel should:
- open smoothly
- close smoothly
- theme cards should show smooth selected state
- font size selection should update without flicker

Theme Change Motion:
When changing theme:
- apply theme instantly enough to feel responsive
- avoid harsh full-screen flash
- transition only safe properties such as background-color, border-color, color
- duration: 180ms–240ms

Do not animate layout during theme change.

Button Motion:
All buttons should use:
- smooth background transition
- smooth border transition
- smooth text/icon color transition
- subtle pressed state

Pressed state:
- transform: scale(0.98)
- duration: 80ms–120ms

Do not use exaggerated button movement.

Card Motion:
Cards should use subtle hover only where clickable.

Clickable cards:
- border color changes softly
- shadow slightly increases
- optional transform: translateY(-1px)
- duration: 160ms–200ms

Non-clickable cards:
- no hover movement
- keep stable

Tooltip Motion:
Tooltips should:
- fade in
- slight translateY
- duration: 120ms–160ms
- no delay longer than needed
- close quickly

Loading Motion:
Use calm skeleton loading for:
- tables
- cards
- notification dropdown
- drawers

Skeleton should be subtle.
Do not use aggressive shimmer.
Use theme-aware skeleton colors.

Reduced Motion:
Implement reduced motion support.

If prefers-reduced-motion is enabled:
- remove slide animations
- remove scale animations
- remove pulse animations
- keep simple opacity transitions only
- keep duration under 100ms where possible

Technical CSS Direction:
Use reusable motion tokens.

Example tokens:
--motion-fast: 120ms;
--motion-base: 180ms;
--motion-medium: 240ms;
--motion-slow: 320ms;

--ease-standard: cubic-bezier(0.2, 0, 0, 1);
--ease-enter: cubic-bezier(0, 0, 0.2, 1);
--ease-exit: cubic-bezier(0.4, 0, 1, 1);

Apply transitions only to:
- opacity
- transform
- background-color
- border-color
- color
- box-shadow

Avoid animating:
- width
- height where possible
- left/top positioning
- large layout properties
- table column sizes

Final Result:
The full system should feel smoother, more polished, and more intentional.

Hover effects, dropdowns, modals, drawers, accordions, filters, notifications, account menu, table interactions, and theme changes should no longer feel sudden or linear.

Motion should feel subtle, fast, clean, accessible, and consistent with a professional government-grade system.