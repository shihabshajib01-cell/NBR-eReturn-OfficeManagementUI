Update the entire system so that all secondary navigation items use relevant, meaningful icons.

Important:
Do not redesign the whole application.
Do not change the first-layer navigation.
Do not change the top bar.
Do not change the breadcrumb structure.
Do not change page hierarchy.
Do not change module names.
Only improve the secondary navigation by adding meaningful icons to every secondary navigation item, while keeping the current design language.

Main Goal:
Every secondary navigation item across all modules must have a relevant icon, just like the good example in the last image.
The icon must help users quickly understand the purpose of the nav item.
The icon must not feel random, repeated unnecessarily, or decorative only.

Design Direction:
- Use one unified icon style across the whole system.
- Use clean, lightweight outlined icons.
- Icons should visually match the existing system style.
- Icons must feel professional, enterprise-friendly, and government-appropriate.
- Icons should improve usability and scanning.
- Icons must be aligned consistently.
- Keep icon size, stroke weight, spacing, and color consistent.
- Secondary nav items must look more informative and usable after adding icons.

Secondary Navigation Rules:
- Every secondary nav item must have an icon on the left.
- Parent items with nested children may also have an expand/collapse chevron on the right.
- Child items under expandable groups must also have their own meaningful icons.
- Active item: icon + label should be visually emphasized using the selected theme.
- Inactive item: icon + label should remain neutral but clearly visible.
- Hover state: show subtle background tint.
- Focus state: accessible focus ring.
- Collapsed state: if the second layer ever collapses, show icon-only with tooltip.
- Expanded state: show icon + label.

Do Not:
- Do not leave any secondary nav item without an icon.
- Do not use the same icon for unrelated items.
- Do not use icons that are too abstract.
- Do not make icons too decorative or playful.
- Do not use filled bulky icons.
- Do not break spacing or alignment.
- Do not change text labels.

Use meaningful icon mapping like below:

1) Dashboard module
- Dashboard → layout-dashboard / grid
- PSR Dashboard → shield-dashboard / analytics-shield
- Double Entry Dashboard → layers / combine-panels

2) Report module
- Offline Return Report → file-text / file-bar-chart
- Tax Category Report → tags / category
- Express Cert. Disposal → certificate / file-check
- User Activity Report → activity / pulse-line
- Litigation Arrear → scale / legal-balance
- Litigation Writ Case → file-warning / file-search
- Litigation Dept Case → building-file / briefcase-file
- Litigation Taxpayer Case → user-file / user-search
- Appeal Report → arrow-up-circle / file-up
- Tribunal Report → courthouse / bank-building
- Payment & Demand Report → wallet / receipt / hand-coins
- Register-5 Report → list / clipboard-list

3) Return Register module
- Return View Approval → eye-check / inspection
- Return Register (parent) → file-stack / folder-open
- Online Return Register → cloud-file / file-up
- Offline Return Register → hard-drive-file / file-down
- Online Archive → archive / archive-box

4) Register & Stock module
- Register-4 → book-open / register-book
- List → list-bullets / rows
- Stock Register → package / boxes
- Tax Registry → receipt / stamp / file-badge
- Register-5 → notebook / record-book

5) PSR & Verification module
- PSR Approval → badge-check / file-check
- PSR Edit Request → file-edit / pencil-file
- Double Entry Status → copy-check / duplicate
- Double Entry Verification → shield-check / checklist
- PSR Dormant → moon / pause-circle / inactive-file
- Out of Jurisdiction → map-pin-off / globe-ban
- Other Circles Entry → network / route / linked-nodes
- Misfiled Returns → folder-warning / file-alert
- Invalid List → ban / x-circle / invalid-file
- Approval List → list-check / checklist
- Transfer History → history / arrow-left-right

6) Case & Financial Management module
- Litigation Management → scale / legal
- Appeal Register → file-reply / appeal-arrow
- Tribunal Register → courthouse / institution
- Demand And Payment → receipt / hand-coins / credit-card
- Refund & Adjustment → rotate-ccw / refund / sliders-horizontal

7) Administration & Requests module
- Certificate Req → certificate / ribbon-badge / stamp
- User Management → users / user-cog
- Special Registration List → star-file / sparkles-list / id-card
- Time Extension → clock-3 / calendar-clock
- Audit Selection → search-check / shield-search / clipboard-search

8) Settings module
- User Management → users / user-cog
- Role Management → shield-user / key-round / badge-check

Visual Behavior:
- Keep current secondary navigation structure.
- Keep current spacing rhythm.
- Keep current card/surface styling.
- Add icon containers only if needed.
- Use icon + text alignment similar to the last image example.
- If a nav item is active, icon can turn white or theme-accent depending on the selected style.
- If the nav item is inactive, icon should use neutral gray/green-tinted neutral.
- Parent items and child items should still be visually distinguishable.

Accessibility:
- Every icon must support clarity, not replace text meaning.
- Maintain text labels at all times in expanded mode.
- Ensure good contrast for icon and text.
- Maintain accessible touch targets and click targets.
- Keep icons readable on laptop, tablet, and mobile.
- Do not rely on color alone to indicate active state.

Typography:
- Keep the approved typography hierarchy.
- Do not change font family or system text scale.
- Icon addition must not break text wrapping.
- Long labels may wrap cleanly or truncate only where necessary, but icon alignment must stay intact.

Responsiveness:
- Desktop: show icon + full label.
- Tablet: show icon + label with tight spacing.
- Mobile: show icon + label inside the secondary navigation panel or drawer.
- Collapsed variations must still show icons clearly.

Final Outcome:
Revise all secondary navigation items so each one has a relevant, meaningful icon consistent with the design system, visually similar in quality to the last image, while preserving the existing module structure, layout, breadcrumbs, and overall navigation behavior.