# Component Usage Guide

This guide provides detailed documentation for all reusable components in the NBR office managment System.

## Table of Contents

1. [Navigation Components](#navigation-components)
2. [Button Components](#button-components)
3. [Form Components](#form-components)
4. [Badge Components](#badge-components)
5. [Modal Components](#modal-components)
6. [Dropdown Components](#dropdown-components)
7. [Permission Components](#permission-components)
8. [User Components](#user-components)
9. [Report Components](#report-components)
10. [Shared Components](#shared-components)

---

## Navigation Components

### PrimarySidebar

Main navigation sidebar with module icons.

**Location**: `src/app/components/navigation/PrimarySidebar.tsx`

**Usage**:
```typescript
<PrimarySidebar
  activeMain="dashboard"
  onItemClick={(id) => setActiveMain(id)}
  t={theme}
  compact={false}
/>
```

**Props**:
- `activeMain`: `string` - Currently active main navigation ID
- `onItemClick`: `(id: string) => void` - Callback when nav item clicked
- `t`: `ThemeConfig` - Theme configuration object
- `compact?`: `boolean` - Whether to show compact mode (icon-only)

### SecondarySidebar

Secondary navigation for sub-items and third-level items.

**Location**: `src/app/components/navigation/SecondarySidebar.tsx`

**Usage**:
```typescript
<SecondarySidebar
  mainItem={activeMainNavItem}
  activeSub="dashboard-main"
  activeThird={null}
  expandedSubs={new Set(["reports"])}
  onSubClick={(id) => setActiveSub(id)}
  onThirdClick={(id) => setActiveThird(id)}
  onExpandToggle={(id) => toggleExpanded(id)}
  state="expanded"
  onStateToggle={() => toggleState()}
  t={theme}
/>
```

**Props**:
- `mainItem`: `MainNavDef` - Main navigation item definition
- `activeSub`: `string | null` - Active sub-navigation ID
- `activeThird`: `string | null` - Active third-level navigation ID
- `expandedSubs`: `Set<string>` - Set of expanded sub-navigation IDs
- `onSubClick`: `(id: string) => void` - Sub-navigation click handler
- `onThirdClick`: `(id: string) => void` - Third-level click handler
- `onExpandToggle`: `(id: string) => void` - Toggle expansion handler
- `state`: `"expanded" | "compact"` - Sidebar display state
- `onStateToggle`: `() => void` - Toggle state handler
- `t`: `ThemeConfig` - Theme configuration

### Topbar

Application header with breadcrumbs, assessment year selector, and user menu.

**Location**: `src/app/components/navigation/Topbar.tsx`

**Usage**:
```typescript
<Topbar
  breadcrumbs={breadcrumbItems}
  assessmentYear="2024-25"
  onAssessmentYearChange={(year) => setYear(year)}
  notifications={notificationList}
  onNotificationRead={(id) => markAsRead(id)}
  onNotificationDelete={(id) => deleteNotification(id)}
  onNotificationClearAll={() => clearAllNotifications()}
  onSignOut={() => handleSignOut()}
  isDesktop={true}
  onMobileMenuToggle={() => toggleMobileMenu()}
  t={theme}
/>
```

**Props**: (See component file for full prop list)

### Breadcrumbs

Navigation breadcrumbs trail.

**Location**: `src/app/components/navigation/Breadcrumbs.tsx`

**Usage**:
```typescript
<Breadcrumbs
  items={[
    { label: "Dashboard", onClick: () => navigate("dashboard") },
    { label: "Reports" },
  ]}
  t={theme}
/>
```

---

## Button Components

### PrimaryButton

Primary action button with theme colors.

**Location**: `src/app/components/buttons/PrimaryButton.tsx`

**Usage**:
```typescript
<PrimaryButton
  onClick={() => handleSubmit()}
  icon={Save}
  t={theme}
  disabled={false}
  small={false}
>
  Save Changes
</PrimaryButton>
```

**Props**:
- `children`: `React.ReactNode` - Button text/content
- `onClick?`: `() => void` - Click handler
- `icon?`: `LucideIcon` - Optional icon component
- `t`: `ThemeConfig` - Theme configuration
- `disabled?`: `boolean` - Disabled state
- `small?`: `boolean` - Smaller variant

### SecondaryButton

Secondary action button with border and transparent background.

**Location**: `src/app/components/buttons/SecondaryButton.tsx`

**Usage**: Similar to PrimaryButton

### IconButton

Icon-only button for compact actions.

**Location**: `src/app/components/buttons/IconButton.tsx`

**Usage**:
```typescript
<IconButton
  icon={Edit}
  label="Edit item"
  t={theme}
  onClick={() => handleEdit()}
/>
```

**Props**:
- `icon`: `LucideIcon` - Icon component to display
- `label`: `string` - Accessible label (aria-label)
- `t`: `ThemeConfig` - Theme configuration
- `onClick`: `(e: React.MouseEvent) => void` - Click handler

---

## Form Components

### SInput

Styled text input with theme integration.

**Location**: `src/app/components/forms/SInput.tsx`

**Usage**:
```typescript
<SInput
  id="username"
  value={username}
  onChange={(val) => setUsername(val)}
  placeholder="Enter username"
  required={true}
  error={errors.username}
  t={theme}
/>
```

**Props**:
- `id`: `string` - Input ID
- `value`: `string` - Current value
- `onChange`: `(value: string) => void` - Change handler
- `placeholder?`: `string` - Placeholder text
- `type?`: `string` - Input type (default: "text")
- `required?`: `boolean` - Required field indicator
- `error?`: `string` - Error message to display
- `t`: `ThemeConfig` - Theme configuration

### SSelect

Styled select dropdown.

**Location**: `src/app/components/forms/SSelect.tsx`

**Usage**:
```typescript
<SSelect
  id="role"
  value={selectedRole}
  onChange={(val) => setSelectedRole(val)}
  options={["Admin", "User", "Viewer"]}
  t={theme}
/>
```

**Props**:
- `id`: `string` - Select ID
- `value`: `string` - Current value
- `onChange`: `(value: string) => void` - Change handler
- `options`: `string[]` - Array of option values
- `t`: `ThemeConfig` - Theme configuration

### SToggle

Toggle switch component.

**Location**: `src/app/components/forms/SToggle.tsx`

**Usage**:
```typescript
<SToggle
  id="active-status"
  checked={isActive}
  onChange={(checked) => setIsActive(checked)}
  label="Active"
  t={theme}
/>
```

**Props**:
- `id`: `string` - Toggle ID
- `checked`: `boolean` - Current state
- `onChange`: `(checked: boolean) => void` - Change handler
- `label`: `string` - Label text
- `t`: `ThemeConfig` - Theme configuration

### SFormSection

Form section wrapper with title.

**Location**: `src/app/components/forms/SFormSection.tsx`

**Usage**:
```typescript
<SFormSection title="Personal Information" t={theme}>
  {/* Form fields */}
</SFormSection>
```

---

## Badge Components

### StatusBadge

Status indicator badge with color coding.

**Location**: `src/app/components/badges/StatusBadge.tsx`

**Usage**:
```typescript
<StatusBadge
  value="Approved"
  t={theme}
/>
```

**Props**:
- `value`: `string` - Status value (Approved, Pending, Rejected, etc.)
- `t`: `ThemeConfig` - Theme configuration

**Status Colors**:
- "Approved" / "Active" / "Completed" → Success (green)
- "Pending" / "In Progress" → Warning (yellow)
- "Rejected" / "Failed" / "Inactive" → Error (red)
- Default → Neutral (gray)

### SStatusBadge

Smaller status badge variant.

**Location**: `src/app/components/badges/SStatusBadge.tsx`

**Usage**: Similar to StatusBadge

---

## Modal Components

### SConfirmModal

Confirmation dialog modal.

**Location**: `src/app/components/modals/SConfirmModal.tsx`

**Usage**:
```typescript
<SConfirmModal
  title="Delete User"
  message="Are you sure you want to delete this user? This action cannot be undone."
  onConfirm={() => handleDelete()}
  onCancel={() => setShowModal(false)}
  confirmText="Delete"
  tone="danger"
  t={theme}
/>
```

**Props**:
- `title`: `string` - Modal title
- `message`: `string` - Confirmation message
- `onConfirm`: `() => void` - Confirm action handler
- `onCancel`: `() => void` - Cancel/close handler
- `confirmText?`: `string` - Confirm button text (default: "Confirm")
- `tone?`: `"danger" | "warning" | "info"` - Modal tone
- `t`: `ThemeConfig` - Theme configuration

### SignOutModal

Sign out confirmation modal.

**Location**: `src/app/components/modals/SignOutModal.tsx`

**Usage**:
```typescript
<SignOutModal
  onConfirm={() => handleSignOut()}
  onCancel={() => setShowModal(false)}
  t={theme}
/>
```

---

## Dropdown Components

### NotificationDropdown

Notification center dropdown.

**Location**: `src/app/components/dropdowns/NotificationDropdown.tsx`

**Usage**:
```typescript
<NotificationDropdown
  notifications={notificationList}
  onRead={(id) => markAsRead(id)}
  onDelete={(id) => deleteNotification(id)}
  onClearAll={() => clearAll()}
  t={theme}
/>
```

**Props**:
- `notifications`: `Notification[]` - Array of notifications
- `onRead`: `(id: string) => void` - Mark as read handler
- `onDelete`: `(id: string) => void` - Delete handler
- `onClearAll`: `() => void` - Clear all handler
- `t`: `ThemeConfig` - Theme configuration

**Notification Interface**:
```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  icon?: LucideIcon;
}
```

### UserProfileDropdown

User profile menu dropdown.

**Location**: `src/app/components/dropdowns/UserProfileDropdown.tsx`

**Usage**:
```typescript
<UserProfileDropdown
  userName="John Doe"
  userRole="Administrator"
  onSignOut={() => handleSignOut()}
  t={theme}
/>
```

---

## Permission Components

### PermissionTree

Complete permission selection tree with all groups.

**Location**: `src/app/components/permissions/PermissionComponents.tsx`

**Usage**:
```typescript
<PermissionTree
  selectedIds={selectedPermissions}
  onChange={(ids) => setSelectedPermissions(ids)}
  t={theme}
/>
```

**Props**:
- `selectedIds`: `string[]` - Array of selected permission IDs
- `onChange`: `(ids: string[]) => void` - Selection change handler
- `t`: `ThemeConfig` - Theme configuration

### PermissionsPanel

Searchable permissions panel with select all and reset.

**Location**: `src/app/components/permissions/PermissionComponents.tsx`

**Usage**:
```typescript
<PermissionsPanel
  selectedIds={selectedPermissions}
  onChange={(ids) => setSelectedPermissions(ids)}
  t={theme}
/>
```

**Features**:
- Search/filter permissions
- Select all / reset all
- Visual selection count
- Scrollable accordion

### PermissionGroupComp

Single permission group component with expandable children.

**Location**: `src/app/components/permissions/PermissionComponents.tsx`

**Usage**:
```typescript
<PermissionGroupComp
  group={permissionGroup}
  selectedIds={selectedPermissions}
  onChange={(ids) => setSelectedPermissions(ids)}
  t={theme}
/>
```

### RolePreviewCard

Visual preview card showing role permissions coverage.

**Location**: `src/app/components/permissions/PermissionComponents.tsx`

**Usage**:
```typescript
<RolePreviewCard
  roleName="Administrator"
  roleDescription="Full system access"
  selectedPermIds={rolePermissions}
  t={theme}
/>
```

**Features**:
- Module coverage bars
- Permission count per module
- Total permission count
- Visual progress indicators

---

## User Components

### UserDetailDrawer

Slide-out drawer showing complete user details.

**Location**: `src/app/components/users/UserComponents.tsx`

**Usage**:
```typescript
<UserDetailDrawer
  user={selectedUser}
  onClose={() => setDrawerOpen(false)}
  onEdit={() => handleEdit()}
  onReAssign={() => handleReassign()}
  onToggleStatus={() => handleToggleStatus()}
  onDelete={() => handleDelete()}
  t={theme}
/>
```

**Props**:
- `user`: `SystemUser` - User object
- `onClose`: `() => void` - Close drawer handler
- `onEdit`: `() => void` - Edit user handler
- `onReAssign`: `() => void` - Re-assign role handler
- `onToggleStatus`: `() => void` - Toggle active status handler
- `onDelete`: `() => void` - Delete user handler
- `t`: `ThemeConfig` - Theme configuration

### ReAssignRoleModal

Modal for reassigning user roles with live preview.

**Location**: `src/app/components/users/UserComponents.tsx`

**Usage**:
```typescript
<ReAssignRoleModal
  user={selectedUser}
  onConfirm={(newRole) => handleReassign(newRole)}
  onClose={() => setModalOpen(false)}
  t={theme}
/>
```

**Features**:
- Current role display
- Role dropdown with active roles
- Live role preview with permissions
- Warning for permission changes

---

## Report Components

### ReportFilterPanel

Collapsible filter panel for reports.

**Location**: `src/app/components/reports/ReportComponents.tsx`

**Usage**:
```typescript
<ReportFilterPanel
  fields={filterFields}
  values={filterValues}
  onChange={(key, val) => updateFilter(key, val)}
  onView={() => applyFilters()}
  onClear={() => clearFilters()}
  onPrint={() => printReport()}
  onExport={() => exportReport()}
  open={filterOpen}
  onToggle={() => toggleFilter()}
  t={theme}
/>
```

**Props**:
- `fields`: `FilterField[]` - Array of filter field definitions
- `values`: `Record<string, string>` - Current filter values
- `onChange`: `(key: string, val: string) => void` - Filter change handler
- `onView`: `() => void` - View report handler
- `onClear`: `() => void` - Clear filters handler
- `onPrint`: `() => void` - Print handler
- `onExport`: `() => void` - Export handler
- `open`: `boolean` - Panel open state
- `onToggle`: `() => void` - Toggle panel handler
- `t`: `ThemeConfig` - Theme configuration

### ComplexTable

Advanced table with grouped columns and automatic totals.

**Location**: `src/app/components/reports/ReportComponents.tsx`

**Usage**:
```typescript
<ComplexTable
  config={reportConfig}
  data={reportData}
  onRowView={(row, trigger) => openDrawer(row, trigger)}
  t={theme}
/>
```

**Props**:
- `config`: `ReportConfig` - Table configuration with columns
- `data`: `Record<string, any>[]` - Table data array
- `onRowView`: `(row: Record<string, any>, trigger: HTMLElement) => void` - Row view handler
- `t`: `ThemeConfig` - Theme configuration

**Features**:
- Simple and grouped columns
- Automatic numeric totals
- Sticky header
- Status badge rendering
- Row actions
- Zebra striping
- Responsive scrolling

### DetailDrawer

Drawer for displaying row details.

**Location**: `src/app/components/reports/ReportComponents.tsx`

**Usage**:
```typescript
<DetailDrawer
  row={selectedRow}
  config={reportConfig}
  reportName="Offline Return Report"
  onClose={() => closeDrawer()}
  t={theme}
/>
```

**Props**:
- `row`: `Record<string, any>` - Row data object
- `config`: `ReportConfig` - Report configuration
- `reportName`: `string` - Report display name
- `onClose`: `() => void` - Close drawer handler
- `t`: `ThemeConfig` - Theme configuration

---

## Shared Components

### Pagination

Page navigation component.

**Location**: `src/app/components/shared/Pagination.tsx`

**Usage**:
```typescript
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
  t={theme}
/>
```

### RowMoreMenu

Three-dot menu for table row actions.

**Location**: `src/app/components/shared/RowMoreMenu.tsx`

**Usage**:
```typescript
<RowMoreMenu
  actions={[
    { icon: Edit, label: "Edit", onClick: () => handleEdit() },
    { icon: Trash, label: "Delete", onClick: () => handleDelete(), danger: true },
  ]}
  t={theme}
/>
```

### ReportCard

Report summary card component.

**Location**: `src/app/components/shared/ReportCard.tsx`

**Usage**:
```typescript
<ReportCard
  title="Offline Returns"
  count={245}
  icon={FileText}
  onClick={() => openReport("offline-returns")}
  t={theme}
/>
```

---

## Best Practices

### General Guidelines

1. **Always pass theme**: Every component requires `t: ThemeConfig` prop
2. **Use TypeScript**: Define clear interfaces for all props
3. **Accessibility**: Include ARIA labels and keyboard navigation
4. **Responsive Design**: Use Tailwind responsive prefixes
5. **Consistent Styling**: Use theme colors, never hardcode

### Common Patterns

#### Modal Pattern
```typescript
const [showModal, setShowModal] = useState(false);

// In render
{showModal && (
  <MyModal
    onClose={() => setShowModal(false)}
    t={theme}
  />
)}
```

#### Drawer Pattern
```typescript
const [drawerOpen, setDrawerOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

const openDrawer = (item) => {
  setSelectedItem(item);
  setDrawerOpen(true);
};

const closeDrawer = () => {
  setDrawerOpen(false);
  setTimeout(() => setSelectedItem(null), 200); // After animation
};
```

#### Error Handling Pattern
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const validate = (): boolean => {
  const newErrors: Record<string, string> = {};
  // validation logic
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

## Component Dependencies

### Commonly Used Imports

```typescript
// Lucide Icons
import { Icon1, Icon2 } from "lucide-react";

// Theme
import type { ThemeConfig } from "../data/themes";

// React
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Utilities
function rgba(hex: string, alpha: number): string {
  // ... rgba helper implementation
}
```

### Import Paths

- Data: `../data/` or `../../data/` (depending on depth)
- Components: `../components/` or `./components/` (relative)
- Pages: `../pages/` or `./pages/` (relative)

---

## Further Reading

- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Complete development guide
- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Project refactoring history
- Component source files in `src/app/components/`
