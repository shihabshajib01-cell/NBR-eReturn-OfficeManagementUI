# Developer Guide

Welcome to the NBR office managment System development guide. This document will help you understand the project structure, architecture, and development workflow.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Architecture](#architecture)
5. [Working with Components](#working-with-components)
6. [Working with Data](#working-with-data)
7. [Theming and Styling](#theming-and-styling)
8. [Common Development Tasks](#common-development-tasks)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Project Overview

This is a comprehensive NBR office managment System built with React, TypeScript, and Tailwind CSS. The system handles:

- Tax return management
- User and role management with granular permissions
- Report generation and viewing
- Litigation and appeal tracking
- Dashboard analytics
- Multi-theme support with 6 themes + dark mode

### Technology Stack

- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **Lucide React** - Icon library
- **Vite** - Build tool

## Project Structure

```
src/app/
├── data/                          # Configuration and mock data
│   ├── themes.ts                  # Theme definitions (6 themes + dark mode)
│   ├── fonts.ts                   # Font configurations
│   ├── constants.ts               # Application constants
│   ├── mockData.ts                # Mock users, roles, reports, notifications
│   ├── permissions.ts             # Permission groups and definitions
│   └── navigation.ts              # Navigation structure
│
├── pages/                         # Page components
│   ├── LoginPage.tsx              # Authentication page
│   ├── UserManagementPage.tsx     # User CRUD operations
│   ├── RoleManagementPage.tsx     # Role and permission management
│   ├── WorkflowTablePage.tsx      # Generic workflow table page
│   └── CombinedDashboardPage.tsx  # Dashboard overview
│
├── components/                    # Reusable components
│   ├── navigation/                # Navigation components (sidebar, topbar, breadcrumbs)
│   ├── dropdowns/                 # Dropdown menus (notifications, user profile)
│   ├── buttons/                   # Button components (primary, secondary, icon)
│   ├── badges/                    # Status and info badges
│   ├── appearance/                # Theme and appearance settings
│   ├── modals/                    # Modal dialogs
│   ├── forms/                     # Form inputs and components
│   ├── shared/                    # Shared utility components
│   ├── permissions/               # Permission UI components
│   ├── users/                     # User management components
│   └── reports/                   # Report display components
│
├── styles/                        # Global styles
│   ├── theme.css                  # Theme tokens and CSS variables
│   └── fonts.css                  # Font imports
│
└── App.tsx                        # Main application component (1,168 lines)
```

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server (if available)
# Note: Check package.json for available scripts
pnpm run dev
```

### First Time Setup

1. **Understand the Authentication Flow**: The app starts with `LoginPage`. After authentication, users are routed to the dashboard.

2. **Explore the Navigation**: The app uses a 3-level navigation system:
   - Main navigation (left sidebar)
   - Secondary navigation (middle sidebar)
   - Third-level navigation (nested items)

3. **Check the Mock Data**: All data is currently mocked in `src/app/data/mockData.ts`. This includes users, roles, reports, and notifications.

## Architecture

### Component Hierarchy

```
App
├── LoginPage (when not authenticated)
└── Main Layout (when authenticated)
    ├── Topbar
    │   ├── Assessment Year Selector
    │   ├── Breadcrumbs
    │   ├── NotificationDropdown
    │   └── UserProfileDropdown
    ├── PrimarySidebar (main navigation)
    ├── SecondarySidebar (sub-navigation)
    └── Content Area
        ├── CombinedDashboardPage
        ├── UserManagementPage
        ├── RoleManagementPage
        ├── WorkflowTablePage
        └── ReportWorkspace
            ├── ReportFilterPanel
            ├── ComplexTable
            └── DetailDrawer
```

### State Management

The app uses React's built-in state management (useState, useContext) without external libraries:

- **Theme State**: Managed in App.tsx, propagated via props
- **Authentication State**: Managed in App.tsx
- **Navigation State**: Managed in App.tsx with active page tracking
- **Local Component State**: Each component manages its own UI state

### Data Flow

1. **Configuration** → Imported from `data/` files
2. **Mock Data** → Imported from `data/mockData.ts`
3. **Props** → Passed down from App.tsx
4. **Events** → Callback props bubble up to parent components

## Working with Components

### Creating a New Page Component

1. Create a new file in `src/app/pages/`:

```typescript
// src/app/pages/MyNewPage.tsx
import type { ThemeConfig } from "../data/themes";

export function MyNewPage({ t }: { t: ThemeConfig }) {
  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6">
      <h1 style={{ color: t.textPrimary }}>My New Page</h1>
      {/* Your content here */}
    </div>
  );
}
```

2. Import in App.tsx:

```typescript
import { MyNewPage } from "./pages/MyNewPage";
```

3. Add routing logic in App.tsx main component

### Creating a New Reusable Component

1. Choose the appropriate directory based on component purpose
2. Create the component file:

```typescript
// src/app/components/shared/MyComponent.tsx
import type { ThemeConfig } from "../../data/themes";

export function MyComponent({ t, ...props }: { t: ThemeConfig; /* other props */ }) {
  return (
    <div style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}>
      {/* Component content */}
    </div>
  );
}
```

3. Export from the component file
4. Import where needed

### Using the rgba() Utility

Many components include an `rgba()` helper for alpha transparency:

```typescript
function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Usage
style={{ backgroundColor: rgba(t.primary, 0.1) }}
```

## Working with Data

### Adding Mock Data

Edit `src/app/data/mockData.ts`:

```typescript
export const MOCK_USERS: SystemUser[] = [
  {
    id: "new-user-id",
    name: "New User",
    employeeId: "EMP-001",
    // ... other fields
  },
  // ... existing users
];
```

### Adding a New Permission

Edit `src/app/data/permissions.ts`:

```typescript
export const PERM_GROUPS: PermGroupDef[] = [
  {
    id: "new-module",
    label: "New Module",
    permissions: [
      { id: "new-module-view", label: "View New Module" },
      { id: "new-module-create", label: "Create in New Module" },
      { id: "new-module-edit", label: "Edit in New Module" },
      { id: "new-module-delete", label: "Delete from New Module" },
    ],
  },
  // ... existing groups
];
```

### Adding a New Report Configuration

Edit `REPORT_CONFIGS` in `src/app/App.tsx`:

```typescript
export const REPORT_CONFIGS: Record<string, ReportConfig> = {
  "my-new-report": {
    hasActions: true,
    filterFields: BASE_FILTERS,
    columns: [
      { type: "simple", key: "column1", label: "Column 1" },
      { type: "simple", key: "column2", label: "Column 2" },
    ],
  },
  // ... existing configs
};
```

## Theming and Styling

### Theme System

The app supports 7 themes defined in `src/app/data/themes.ts`:

1. **indigo-blue** - Default professional theme
2. **gov-blue** - Government blue theme
3. **slate-purple** - Purple accent theme
4. **plum-executive** - Executive plum theme
5. **fresh-teal** - Teal accent theme
6. **neutral-gray** - Neutral gray theme
7. **dark-mode** - Dark theme

### Using Theme Colors

Always use theme colors from the `ThemeConfig` object:

```typescript
function MyComponent({ t }: { t: ThemeConfig }) {
  return (
    <div style={{ 
      color: t.textPrimary,           // Primary text
      backgroundColor: t.surface,      // Surface background
      border: `1px solid ${t.border}`, // Border
    }}>
      <button style={{ 
        backgroundColor: t.primary,    // Primary action color
        color: t.id === "dark-mode" ? "#202124" : "#FFFFFF"
      }}>
        Click Me
      </button>
    </div>
  );
}
```

### Available Theme Properties

- `primary`, `primaryDark`, `primaryLight` - Primary brand color
- `secondary` - Secondary accent color
- `background` - Page background
- `surface` - Card/panel background
- `textPrimary`, `textSecondary` - Text colors
- `border` - Border color
- `success`, `warning`, `error`, `info` - Status colors

### Font System

The app supports 3 font families and 3 size presets:

**Fonts** (defined in `src/app/data/fonts.ts`):
- Poppins (default)
- Noto Sans
- Google Sans

**Sizes**:
- Compact - Smaller typography
- Standard - Default size
- Large - Larger typography

### Responsive Design

Use Tailwind's responsive prefixes:

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

## Common Development Tasks

### Adding a New Navigation Item

1. Edit `src/app/data/navigation.ts`:

```typescript
export const NAVIGATION: MainNavDef[] = [
  {
    id: "my-module",
    label: "My Module",
    icon: MyIcon,
    children: [
      { id: "my-page", label: "My Page", icon: PageIcon },
    ],
  },
  // ... existing navigation
];
```

2. Add corresponding page component
3. Update routing logic in App.tsx

### Creating a Modal Dialog

Use `createPortal` for proper modal rendering:

```typescript
import { createPortal } from "react-dom";

export function MyModal({ onClose, t }: { onClose: () => void; t: ThemeConfig }) {
  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4"
         style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
         onClick={onClose}>
      <div style={{ backgroundColor: t.surface }}
           onClick={(e) => e.stopPropagation()}>
        {/* Modal content */}
      </div>
    </div>,
    document.body
  );
}
```

### Adding Form Validation

```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.name) newErrors.name = "Name is required";
  if (!formData.email) newErrors.email = "Email is required";
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (validateForm()) {
    // Proceed with submission
  }
};
```

## Best Practices

### Component Design

1. **Single Responsibility**: Each component should do one thing well
2. **Prop Types**: Always define TypeScript interfaces for props
3. **Theme Compatibility**: Use theme colors, never hardcode colors
4. **Accessibility**: Include ARIA labels and keyboard navigation

### Code Organization

1. **Imports**: Group imports by source (React, external libs, internal components)
2. **Constants**: Define magic numbers/strings as constants
3. **Helper Functions**: Extract reusable logic into helper functions
4. **Comments**: Document complex logic, but prefer self-documenting code

### Performance

1. **Memoization**: Use `useMemo` for expensive calculations
2. **Callbacks**: Use `useCallback` for functions passed as props
3. **Lists**: Always provide `key` prop in lists
4. **Lazy Loading**: Consider code-splitting for large components

### Type Safety

1. **Avoid `any`**: Use specific types or `unknown`
2. **Interfaces over Types**: Prefer interfaces for object shapes
3. **Type Exports**: Export types from data files for reuse
4. **Strict Mode**: Keep TypeScript strict mode enabled

## Troubleshooting

### Common Issues

**Issue**: Theme colors not updating
- **Solution**: Ensure theme state is passed down correctly as `t` prop

**Issue**: Modal not appearing on top
- **Solution**: Check z-index values, ensure modal uses `createPortal`

**Issue**: Icons not displaying
- **Solution**: Verify lucide-react import and icon name

**Issue**: Responsive layout breaking
- **Solution**: Check Tailwind responsive prefixes (sm:, md:, lg:)

### Development Tools

- **React DevTools**: Inspect component hierarchy and props
- **TypeScript**: Check types with `tsc --noEmit`
- **Tailwind Intellisense**: VS Code extension for class autocomplete

### Getting Help

1. Check this guide first
2. Review similar existing components
3. Check component implementation in respective files
4. Review refactoring documentation (PHASE_*_COMPLETE.md files)

## Further Reading

- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Complete refactoring history
- [PHASE_*_COMPLETE.md](.) - Individual phase documentation
- [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) - Component usage guide
- React Documentation: https://react.dev
- Tailwind CSS Documentation: https://tailwindcss.com
- TypeScript Documentation: https://www.typescriptlang.org
