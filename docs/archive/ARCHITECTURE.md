# Architecture Documentation

This document provides a comprehensive overview of the NBR office managment System's architecture, design decisions, and technical implementation.

## System Overview

The NBR office managment System is a single-page application (SPA) built with React and TypeScript. It provides a comprehensive suite of tools for managing government office operations including tax returns, user management, role-based access control, and reporting.

### Core Technologies

- **React 18.3.1**: Component-based UI library
- **TypeScript**: Static type checking
- **Tailwind CSS v4**: Utility-first CSS framework
- **Vite 6.3.5**: Fast build tool and dev server
- **Lucide React**: Icon library

### Key Features

1. **Authentication & Authorization**
   - User login system
   - Role-based access control (RBAC)
   - Granular permission system (70+ permissions)

2. **User & Role Management**
   - CRUD operations for users
   - Dynamic role creation and editing
   - Permission assignment and visualization

3. **Report Generation**
   - Multiple report types (12+ configured reports)
   - Dynamic filtering and sorting
   - Export and print capabilities

4. **Dashboard Analytics**
   - Combined dashboard with KPI cards
   - Real-time data visualization
   - Multiple data source integration

5. **Theming System**
   - 7 pre-configured themes
   - Dark mode support
   - Dynamic theme switching
   - Font family and size customization

## Architectural Patterns

### Component Architecture

The application follows a hierarchical component structure:

```
┌─────────────────────────────────────────────┐
│              App (Root)                     │
│  - State Management                         │
│  - Routing Logic                            │
│  - Theme Orchestration                      │
└─────────────────────────────────────────────┘
              │
              ├──────────────────┬──────────────────┬───────────────┐
              │                  │                  │               │
         ┌────▼────┐       ┌────▼────┐      ┌─────▼─────┐  ┌─────▼──────┐
         │ Layout  │       │  Pages  │      │Components │  │    Data    │
         │Components│       │         │      │           │  │            │
         └─────────┘       └─────────┘      └───────────┘  └────────────┘
              │                  │                  │               │
         Navigation          LoginPage         Buttons          themes.ts
         Topbar              UserMgmt          Forms            fonts.ts
         Breadcrumbs         RoleMgmt          Modals           mockData.ts
                             Dashboard         Reports          permissions.ts
                             Workflow          Badges           navigation.ts
                                              Permissions       constants.ts
                                              Users
```

### Design Patterns

#### 1. Compound Component Pattern

Used in complex UI elements like `PermissionsPanel`:

```typescript
<PermissionsPanel>
  {/* Internal composition of:
      - Search input
      - Select all controls
      - Permission groups
      - Individual permissions
  */}
</PermissionsPanel>
```

#### 2. Render Props Pattern

Used in list rendering and table components:

```typescript
<ComplexTable
  config={config}
  data={data}
  onRowView={(row, trigger) => {
    // Custom row view logic
  }}
  t={theme}
/>
```

#### 3. Portal Pattern

Used for modals and drawers to escape DOM hierarchy:

```typescript
createPortal(
  <Modal>{/* modal content */}</Modal>,
  document.body
);
```

#### 4. Controlled Components Pattern

All form inputs are controlled components:

```typescript
<SInput
  value={formData.name}
  onChange={(val) => setFormData({ ...formData, name: val })}
  t={theme}
/>
```

#### 5. Container/Presenter Pattern

Pages act as containers, components as presenters:

- **Pages**: Handle business logic, state, and data fetching
- **Components**: Handle presentation and UI interactions

## Data Flow Architecture

### Unidirectional Data Flow

```
┌─────────────┐
│   App.tsx   │
│  (State)    │
└──────┬──────┘
       │
       │ Props ↓
       ├──────────────────────────────┐
       │                              │
┌──────▼──────┐              ┌───────▼────────┐
│   Pages     │              │  Layout        │
│  (Logic)    │              │  (Structure)   │
└──────┬──────┘              └───────┬────────┘
       │                              │
       │ Props ↓                      │ Props ↓
       │                              │
┌──────▼──────────────────────────────▼────────┐
│           Components                          │
│         (Presentation)                        │
│                                               │
│  Events ↑  (Callbacks bubble up)              │
└───────────────────────────────────────────────┘
```

### State Management Strategy

**No external state management library** (Redux, MobX, etc.) is used. State is managed using:

1. **Local Component State** (`useState`)
   - UI state (modals, dropdowns, filters)
   - Form inputs
   - Temporary data

2. **Lifted State** (in `App.tsx`)
   - Global app state (theme, font, authentication)
   - Navigation state
   - Active page tracking

3. **Props Drilling**
   - Theme configuration passed down
   - Callback functions for events

### Data Sources

#### Static Configuration
- **Navigation**: `data/navigation.ts`
- **Themes**: `data/themes.ts`
- **Fonts**: `data/fonts.ts`
- **Permissions**: `data/permissions.ts`
- **Constants**: `data/constants.ts`

#### Mock Data (Development)
- **Users**: `data/mockData.ts` → `MOCK_USERS`
- **Roles**: `data/mockData.ts` → `MOCK_ROLES`
- **Reports**: `data/mockData.ts` → `MOCK_DATA`
- **Notifications**: `data/mockData.ts` → `MOCK_NOTIFICATIONS`

#### Report Configurations
- **Report Schemas**: `App.tsx` → `REPORT_CONFIGS`
- Defines columns, filters, and actions for each report type

## Component Organization

### Directory Structure

```
components/
├── navigation/          # Navigation UI
│   ├── PrimarySidebar   - Main nav (modules)
│   ├── SecondarySidebar - Sub nav (pages)
│   ├── Topbar           - Header bar
│   ├── Breadcrumbs      - Navigation trail
│   └── MobileHeader     - Mobile nav
│
├── buttons/             # Button components
│   ├── PrimaryButton    - Primary actions
│   ├── SecondaryButton  - Secondary actions
│   └── IconButton       - Icon-only actions
│
├── forms/               # Form inputs
│   ├── SInput           - Text input
│   ├── SSelect          - Dropdown select
│   ├── SToggle          - Toggle switch
│   └── SFormSection     - Form section wrapper
│
├── modals/              # Modal dialogs
│   ├── SConfirmModal    - Confirmation dialog
│   └── SignOutModal     - Sign out confirmation
│
├── dropdowns/           # Dropdown menus
│   ├── NotificationDropdown - Notifications
│   └── UserProfileDropdown  - User menu
│
├── badges/              # Status indicators
│   ├── StatusBadge      - Status badge
│   └── SStatusBadge     - Small status badge
│
├── permissions/         # Permission UI
│   ├── PermissionTree   - Full permission tree
│   ├── PermissionsPanel - Searchable panel
│   ├── PermissionGroupComp - Single group
│   └── RolePreviewCard  - Role visualization
│
├── users/               # User management UI
│   ├── UserDetailDrawer - User details
│   └── ReAssignRoleModal - Role reassignment
│
├── reports/             # Report display
│   ├── ReportFilterPanel - Filter UI
│   ├── ComplexTable     - Advanced table
│   └── DetailDrawer     - Row details
│
├── appearance/          # Theme settings
│   └── (8 components for appearance management)
│
└── shared/              # Shared utilities
    ├── Pagination       - Page navigation
    ├── RowMoreMenu      - Row action menu
    └── ReportCard       - Report summary card
```

### Component Responsibilities

#### Pages
- **Responsibility**: Business logic, data orchestration, state management
- **Size**: Large (400-800 lines)
- **Dependencies**: Many components, data files
- **Example**: `UserManagementPage` manages user CRUD operations

#### Components
- **Responsibility**: Presentation, user interaction, visual feedback
- **Size**: Small to medium (50-500 lines)
- **Dependencies**: Minimal, focused
- **Example**: `PrimaryButton` handles button rendering

#### Data Files
- **Responsibility**: Static configuration, type definitions, constants
- **Size**: Small to medium (50-300 lines)
- **Dependencies**: None
- **Example**: `themes.ts` defines theme configurations

## Type System

### Type Organization

Types are organized by domain:

```typescript
// Theme Types
data/themes.ts
├── ThemeId
├── ThemeConfig
├── THEMES
└── THEME_ORDER

// User Types
data/mockData.ts
├── UserStatus
├── SystemUser
├── SystemRole
└── mock data arrays

// Permission Types
data/permissions.ts
├── PermissionItem
├── PermGroupDef
├── PERM_GROUPS
└── ALL_PERM_IDS

// Report Types
components/reports/ReportComponents.tsx
├── SimpleCol
├── GroupCol
├── ColDef
├── FilterField
└── ReportConfig
```

### Type Export Strategy

Types are exported at their point of definition and re-exported from `App.tsx` for external use:

```typescript
// In data file
export interface ThemeConfig { /* ... */ }

// In App.tsx
export type { ThemeConfig } from "./data/themes";

// In components
import type { ThemeConfig } from "../data/themes";
// OR
import type { ThemeConfig } from "../App";
```

## Theming System Architecture

### Theme Configuration

Each theme defines a complete color palette:

```typescript
interface ThemeConfig {
  id: ThemeId;
  name: string;
  // Primary colors
  primary: string;
  primaryDark: string;
  primaryLight: string;
  // UI colors
  secondary: string;
  background: string;
  surface: string;
  border: string;
  // Text colors
  textPrimary: string;
  textSecondary: string;
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
}
```

### Theme Application

Themes are applied via inline styles (not CSS classes) for maximum flexibility:

```typescript
<div style={{ 
  backgroundColor: theme.surface,
  color: theme.textPrimary,
  border: `1px solid ${theme.border}`
}}>
```

### Benefits of This Approach

1. **Dynamic**: Themes switch without CSS recompilation
2. **Predictable**: No CSS specificity issues
3. **Type-Safe**: TypeScript validates color usage
4. **Flexible**: Easy to add new themes
5. **No Class Names**: Avoids Tailwind purging issues

## Navigation Architecture

### Three-Level Navigation

```
Main (L1)              Sub (L2)           Third (L3)
├── Dashboard          ├── Main Dashboard
│                      ├── PSR Dashboard
│                      └── Combined
│
├── Report             ├── Offline Return
│                      ├── Tax Category
│                      ├── Express Cert
│                      └── ... (9 more)
│
├── Return Register    ├── View & Approval
│                      ├── Online Register
│                      ├── Offline Register
│                      └── Online Archive
│
├── Register & Stock   ├── Register-4
│                      ├── Entry Form
│                      └── ... (4 more)
│
├── PSR & Verification ├── PSR Entry
│                      ├── PSR Bulk Entry
│                      └── ... (11 more)
│
├── Case & Financial   ├── Litigation Mgmt ──┬── Arrear Approval
│                      │                     ├── Writ Approval
│                      │                     └── ... (2 more)
│                      ├── Appeal Register ───┬── View
│                      │                      └── Approval
│                      ├── Tribunal ──────────┬── View
│                      │                      └── Approval
│                      └── Demand & Payment ──┬── Entry
│                                             ├── Ledger
│                                             └── ... (2 more)
│
├── Administration     ├── Certificate Req ───┬── Data Entry
│                      │                      └── ... (3 more)
│                      ├── User Management
│                      ├── Add/Release User
│                      └── ... (4 more)
│
└── Settings           ├── User Management
                       └── Role Management
```

### Navigation State

```typescript
interface NavigationState {
  activeMain: string;          // L1: "dashboard"
  activeSub: string | null;    // L2: "dashboard-main"
  activeThird: string | null;  // L3: null (or third-level ID)
  expandedSubs: Set<string>;   // Tracks which L2 items are expanded
}
```

## Permission System Architecture

### Permission Structure

Permissions are organized into 7 groups:

1. **Dashboard** (3 permissions)
2. **Report** (9 permissions)
3. **Return Register** (8 permissions)
4. **Register & Stock** (12 permissions)
5. **PSR & Verification** (15 permissions)
6. **Case & Financial Management** (18 permissions)
7. **Administration** (12 permissions)

Total: **77 individual permissions**

### Permission Model

```typescript
interface PermissionItem {
  id: string;    // e.g., "report-offline-return-view"
  label: string; // e.g., "View Offline Return Report"
}

interface PermGroupDef {
  id: string;                    // e.g., "reports"
  label: string;                 // e.g., "Reports"
  permissions: PermissionItem[]; // Array of permissions
}
```

### Role-Permission Association

Roles contain arrays of permission IDs:

```typescript
interface SystemRole {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // ["report-view", "user-create", ...]
  status: "Active" | "Inactive";
  userCount: number;
}
```

### Permission Checking (Future Implementation)

```typescript
function hasPermission(user: SystemUser, permissionId: string): boolean {
  const role = MOCK_ROLES.find(r => r.name === user.role);
  return role?.permissions.includes(permissionId) ?? false;
}
```

## Performance Considerations

### Optimization Strategies

1. **Component Memoization**
   - Use `React.memo()` for expensive components
   - Use `useMemo()` for expensive calculations
   - Use `useCallback()` for stable function references

2. **Lazy Loading**
   - Code splitting for large pages (future enhancement)
   - Dynamic imports for heavy components

3. **Virtual Scrolling**
   - For long lists (future enhancement)
   - Reduces DOM nodes

4. **Debouncing**
   - Search inputs
   - Filter changes

5. **Portal Rendering**
   - Modals and drawers use portals
   - Prevents layout thrashing

### Current Performance Metrics

- **Initial Load**: Fast (Vite dev server)
- **Theme Switching**: Instant (inline styles)
- **Navigation**: Smooth (React rendering)
- **Table Rendering**: Good (up to 100 rows)

## Security Considerations

### Current Implementation

1. **Client-Side Only**: No backend integration yet
2. **Mock Authentication**: Login is simulated
3. **Permission UI**: Visual only, not enforced

### Future Security Enhancements

1. **Backend Integration**
   - JWT tokens for authentication
   - Session management
   - API authentication

2. **Permission Enforcement**
   - Server-side permission checks
   - Route guards
   - API endpoint protection

3. **Input Validation**
   - Form validation
   - XSS prevention
   - SQL injection prevention (when DB added)

4. **HTTPS**
   - SSL/TLS encryption
   - Secure cookie flags

## Scalability Architecture

### Current Scale

- **Users**: Designed for 100-1000 concurrent users
- **Data**: Mock data with 10-100 records per entity
- **Reports**: 12 report types, expandable

### Scaling Strategies

1. **Horizontal Scaling**
   - Multiple app instances behind load balancer
   - Stateless application design

2. **Data Layer**
   - Backend API integration
   - Database for persistence
   - Caching layer (Redis)

3. **Frontend Optimization**
   - Code splitting by route
   - Lazy loading of heavy components
   - Service worker for offline capability

4. **CDN Integration**
   - Static asset serving
   - Edge caching
   - Global distribution

## Testing Strategy (Future)

### Recommended Testing Approach

1. **Unit Tests**
   - Component rendering
   - Utility functions
   - Business logic

2. **Integration Tests**
   - Page flows
   - Form submissions
   - Navigation paths

3. **E2E Tests**
   - Critical user journeys
   - Authentication flow
   - Report generation

4. **Visual Regression Tests**
   - Theme consistency
   - Responsive layouts
   - Cross-browser compatibility

## Deployment Architecture (Future)

### Recommended Deployment

```
┌─────────────┐
│   GitHub    │
│  (Source)   │
└──────┬──────┘
       │
       │ Push
       ▼
┌─────────────┐
│ CI/CD       │
│ (Build)     │
└──────┬──────┘
       │
       │ Deploy
       ▼
┌─────────────┐
│   CDN       │
│  (Static)   │
└──────┬──────┘
       │
       │ Serve
       ▼
┌─────────────┐
│   Users     │
│  (Browsers) │
└─────────────┘
```

## Future Enhancements

### Planned Features

1. **Backend Integration**
   - RESTful API
   - Real-time updates (WebSocket)
   - Data persistence

2. **Advanced Reporting**
   - Chart visualizations
   - Export to Excel/PDF
   - Scheduled reports

3. **Notifications**
   - Real-time push notifications
   - Email notifications
   - SMS integration

4. **Audit Logging**
   - User action tracking
   - System event logging
   - Compliance reporting

5. **Mobile App**
   - React Native companion app
   - Offline mode
   - Push notifications

6. **Internationalization**
   - Multi-language support
   - RTL layout support
   - Localized date/number formats

## Conclusion

This architecture provides a solid foundation for a scalable, maintainable government office management system. The modular component structure, type-safe TypeScript implementation, and flexible theming system make it easy to extend and customize while maintaining code quality.

For implementation details, see:
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)
- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)
