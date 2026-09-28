Fix all summary/stat cards across the full system and make them use one reusable card component.

Do not redesign the full UI.
Do not change navigation, breadcrumbs, tables, modals, drawers, or page structure.
Only standardize all dashboard cards, stat cards, KPI cards, count cards, and summary cards.

Main Goal:
Every card in the system must look and behave like one consistent design system component.

Use One Final Card Style:
Use the dashboard KPI card style as the base.

Card Structure:
- Top-left: icon inside a soft rounded icon container
- Top-right: optional trend badge or status badge
- Middle: main value
- Bottom: short label
- No mixed layouts
- No random card widths
- No icon-only cards
- No number-only cards without labels

Card Size Rules:
Desktop:
- Use equal-width cards within the same row.
- 4 cards per row when space allows.
- Each card height: 120px–136px.
- Minimum width: 220px.
- Gap: 16px–20px.

Tablet:
- 2 cards per row.
- Same card height and spacing logic.

Mobile:
- 1 card per row.
- Full width.
- Keep icon, value, and label readable.

Card Visual Style:
- Background: system surface color
- Border: 1px solid theme border color
- Radius: 14px–16px
- Shadow: very soft and consistent
- Padding: 20px–24px
- No heavy shadow
- No random glow
- No different radius per page
- No stretched empty cards

Icon Style:
- Icon size: 20px–22px
- Icon container: 44px–48px
- Icon container radius: 12px
- Use soft tinted background from the selected theme
- Use meaningful icon per metric
- Keep all icons from the same icon set
- Do not mix filled, outline, and emoji-style icons

Value Style:
- Font weight: 700
- Desktop size: 28px–32px
- Mobile size: 24px–28px
- Use theme text-primary color
- Important positive values can use success color
- Warning values can use warning color
- Negative/rejected values can use danger color
- Do not overuse colored values

Label Style:
- Font size: 14px–16px
- Font weight: 500
- Color: text-secondary
- Use sentence case
- Keep labels short

Examples:
- Total Returns Filed
- Pending Approvals
- Tax Collected
- Active Users
- Total PSR Entries
- Approved Today
- Rejected Today
- Total Requests
- Total Items
- Total Received
- Total Issued
- Total Closing

Trend Badge:
Use only when the metric has growth/change information.

Badge style:
- Small pill
- Top-right position
- Soft background
- Text size: 12px–13px
- Font weight: 600

Examples:
+8.2%
-3.1%
+12.4%
+2

Do not show trend badges if there is no real trend data.

Color Rules:
Use semantic colors only:
- Primary: theme accent
- Success: approved, verified, paid, positive
- Warning: pending, under review, partially paid
- Danger: rejected, failed, unpaid
- Neutral: inactive, total, archived

Do not use random colors per card.
Do not use loud saturated blocks.
Do not make the full card background colored unless it is an active navigation card.

Spacing Rules:
- Cards must align to the same grid as tables and page content.
- Do not use different left/right margins across pages.
- Card rows must align with the table container below.
- Card gaps must be consistent across every module.

Apply This Card Style To:
- Dashboard KPI cards
- PSR Dashboard cards
- Double Entry Dashboard cards
- Return View Approval cards
- Register & Stock cards
- Stock Register cards
- PSR Approval cards
- User Management cards
- Role Management summary cards
- Certificate Request cards
- Litigation cards
- Demand and Payment cards
- Report summary cards
- Any future summary/stat card

Do Not Allow:
- Some cards with icons and some without
- Some cards with huge width and some narrow
- Different shadows on different pages
- Different border styles
- Different icon containers
- Different value alignment
- Random card heights
- Card text centered on one page and left-aligned on another

Final Card Component:
Create one reusable component:

StatCard

Props:
- icon
- value
- label
- trend
- tone
- loading
- onClick
- className

Use the same StatCard component everywhere.
Do not create page-specific stat card styles.

Interaction:
If card is clickable:
- subtle hover border color
- soft shadow increase
- optional translateY(-1px)
- smooth transition

If card is not clickable:
- no hover movement
- keep it stable

Animation:
Use smooth easing:
- duration: 160ms–200ms
- easing: cubic-bezier(0.2, 0, 0, 1)

Accessibility:
- Maintain WCAG 2.1 AA contrast.
- Do not rely only on color.
- Use clear labels.
- Icon must support the text, not replace it.
- Touch target must be usable on mobile.

Golden Rules:
- One card style for the full system.
- One reusable StatCard component.
- Same width logic.
- Same icon logic.
- Same padding.
- Same radius.
- Same border.
- Same shadow.
- Same typography.
- Same semantic color rules.
- Same responsive behavior.
- No all-caps text.
- No random card styles per page.
- Keep the system calm, clean, and government-grade.

Final Result:
All summary cards across the system should look like one family. The user should feel that Dashboard, PSR Dashboard, Return Register, Register & Stock, PSR Approval, User Management, and every other module are part of the same product.