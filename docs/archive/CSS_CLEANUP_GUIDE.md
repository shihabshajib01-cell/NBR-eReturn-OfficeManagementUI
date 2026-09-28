# CSS Cleanup Guide

## Overview

This guide documents the CSS infrastructure and provides patterns for moving inline styles to CSS classes.

## Current Status

- **Total inline styles identified**: 788 occurrences of `style={{`
- **CSS infrastructure**: ✅ Created
- **Import order**: ✅ Configured

## Files with Most Inline Styles (Priority Order)

1. **RoleManagementPage.tsx** - 122 occurrences
2. **ModulePages.tsx** - 101 occurrences
3. **UserManagementPage.tsx** - 93 occurrences
4. **PermissionComponents.tsx** - 45 occurrences
5. **UserComponents.tsx** - 39 occurrences
6. **LoginForm.tsx** - 35 occurrences
7. **CombinedDashboardPage.tsx** - 33 occurrences

## CSS File Structure

```
src/styles/
├── fonts.css          # Font face definitions
├── tailwind.css       # Tailwind base/utilities
├── theme.css          # Theme variables (colors, etc)
├── tokens.css         # Design tokens (spacing, radius, shadows, timing)
├── typography.css     # Text styles
├── globals.css        # Global resets
├── layout.css         # Flex, grid, positioning utilities
├── navigation.css     # Sidebar, topbar, breadcrumbs
├── tables.css         # Table components
├── cards.css          # Card components
├── forms.css          # Input, select, textarea, checkbox
├── buttons.css        # Button variants
├── badges.css         # Status badges
├── modals.css         # Modal overlays and content
├── drawers.css        # Side drawers
├── dropdowns.css      # Dropdown menus
├── animations.css     # Keyframes and animation utilities
└── index.css          # Import orchestration
```

## Available CSS Variables

### From tokens.css

**Spacing**: `--space-0` through `--space-16`
**Radius**: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`, `--radius-full`
**Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
**Z-index**: `--z-dropdown`, `--z-modal`, `--z-toast`
**Timing**: `--motion-fast`, `--motion-base`, `--motion-medium`, `--motion-slow`
**Easing**: `--ease-standard`, `--ease-enter`, `--ease-exit`

### From theme.css

**Colors**: `--color-primary`, `--color-background`, `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-secondary`, `--color-success`, `--color-warning`, `--color-error`

## Conversion Patterns

### Pattern 1: Flex Layout

**Before**:
```tsx
<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
```

**After**:
```tsx
<div className="flex items-center gap-3">
```

### Pattern 2: Cards

**Before**:
```tsx
<div style={{
  backgroundColor: t.surface,
  border: `1px solid ${t.border}`,
  borderRadius: 16,
  padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
}}>
```

**After**:
```tsx
<div className="card">
```

### Pattern 3: Buttons

**Before**:
```tsx
<button style={{
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  fontSize: "12px",
  fontWeight: 600,
  padding: "7px 14px",
  borderRadius: 8,
  border: "none",
  background: t.primary,
  color: "#fff",
  cursor: "pointer"
}}>
```

**After**:
```tsx
<button className="btn btn-primary">
```

### Pattern 4: Form Inputs

**Before**:
```tsx
<input
  type="text"
  style={{
    width: "100%",
    height: 48,
    padding: "0 14px",
    fontSize: "15px",
    color: t.textPrimary,
    background: t.background,
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    outline: "none"
  }}
/>
```

**After**:
```tsx
<input type="text" className="form-input" />
```

### Pattern 5: Badges

**Before**:
```tsx
<span style={{
  background: rgba(t.success, 0.1),
  color: t.success,
  fontSize: "11px",
  fontWeight: 600,
  padding: "3px 9px",
  borderRadius: 999,
  whiteSpace: "nowrap"
}}>
```

**After**:
```tsx
<span className="badge badge-success">
```

### Pattern 6: Theme-Dependent Colors

**Before**:
```tsx
<div style={{ backgroundColor: t.primary, color: textOnPrimary }}>
```

**After**:
```tsx
<div className="bg-primary text-on-primary">
```

**Then add to theme.css**:
```css
.bg-primary {
  background: var(--color-primary);
}

.text-on-primary {
  color: var(--color-on-primary);
}
```

## Exceptions (Keep as Inline Styles)

1. **Dynamic runtime values** that cannot be pre-computed:
   ```tsx
   style={{ width: `${percentage}%` }}  // OK - dynamic
   style={{ transform: `translateX(${x}px)` }}  // OK - runtime calc
   ```

2. **SVG fill/stroke** attributes within SVG elements:
   ```tsx
   <path fill={t.primary} />  // OK - SVG attribute
   ```

3. **Rare one-off styles** that don't fit any pattern and appear only once.

Add a comment when keeping inline styles:
```tsx
{/* Dynamic width based on progress */}
<div style={{ width: `${progress}%` }} />
```

## Class Naming Convention

Use BEM-style naming for component-specific classes:

```css
.component-name { }
.component-name__element { }
.component-name--modifier { }
```

Examples:
- `.user-card { }`
- `.user-card__header { }`
- `.user-card--active { }`
- `.modal-content { }`
- `.modal-content__body { }`

## Testing Checklist

After moving styles to CSS, verify:

- [ ] UI looks unchanged
- [ ] Theme switching works
- [ ] Dark mode works
- [ ] Font selector works
- [ ] Font-size presets work
- [ ] Responsive behavior works
- [ ] Hover states work
- [ ] Animations work
- [ ] Modals position correctly
- [ ] Drawers slide in correctly
- [ ] Dropdowns position correctly
- [ ] Tables scroll horizontally when needed
- [ ] No console errors

## Workflow

1. **Pick a file** from the priority list
2. **Identify inline styles** (search for `style={{`)
3. **Group similar styles** (all buttons, all cards, etc)
4. **Create CSS classes** in appropriate file
5. **Replace inline styles** with className
6. **Test in browser** - verify no visual changes
7. **Commit** with descriptive message
8. **Move to next file**

## Progress Tracking

Track your progress by running:
```bash
grep -r "style={{" src/app --include="*.tsx" | wc -l
```

Target: Reduce from 788 to < 50 (only legitimate dynamic styles)

## Need Help?

- Check existing CSS files for similar patterns
- Look at `theme.css` for available color variables
- Look at `tokens.css` for spacing/timing values
- Follow the patterns in this guide
