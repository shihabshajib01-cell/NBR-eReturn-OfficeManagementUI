# NBR office managment System

A comprehensive, modern web application for managing government office operations including tax returns, user management, role-based access control, and reporting.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development (check package.json for available scripts)
pnpm run dev
```

## 📋 Features

- **Authentication & Authorization**: Secure login with role-based access control
- **User Management**: Complete CRUD operations for users with role assignment
- **Role Management**: Dynamic role creation with granular permission assignment (77 permissions)
- **Report Generation**: 12+ report types with dynamic filtering and export capabilities
- **Dashboard Analytics**: Combined dashboard with KPI cards and data visualizations
- **Theming System**: 7 pre-configured themes including dark mode
- **Responsive Design**: Full mobile and desktop support
- **Type Safety**: 100% TypeScript coverage

## 🏗️ Technology Stack

- **React 18.3.1** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Vite 6.3.5** - Fast build tool
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
src/app/
├── data/                    # Configuration & mock data
│   ├── themes.ts           # 7 themes + dark mode
│   ├── fonts.ts            # Font configurations
│   ├── constants.ts        # App constants
│   ├── mockData.ts         # Mock users, roles, reports
│   ├── permissions.ts      # 77 permissions in 7 groups
│   └── navigation.ts       # 3-level navigation
│
├── pages/                  # Page components
│   ├── LoginPage.tsx
│   ├── UserManagementPage.tsx
│   ├── RoleManagementPage.tsx
│   ├── WorkflowTablePage.tsx
│   └── CombinedDashboardPage.tsx
│
├── components/             # 38 reusable components
│   ├── navigation/        # Sidebar, topbar, breadcrumbs
│   ├── buttons/           # Primary, secondary, icon buttons
│   ├── forms/             # Inputs, selects, toggles
│   ├── modals/            # Confirmation dialogs
│   ├── dropdowns/         # Notifications, user menu
│   ├── permissions/       # Permission UI components
│   ├── users/             # User management UI
│   ├── reports/           # Report display components
│   └── shared/            # Pagination, badges, etc.
│
└── App.tsx                # Main application (1,168 lines)
```

## 📚 Documentation

- **[Developer Guide](./DEVELOPER_GUIDE.md)** - Complete development guide with tutorials
- **[Component Guide](./COMPONENT_GUIDE.md)** - Detailed component API documentation
- **[Architecture](./ARCHITECTURE.md)** - System architecture and design patterns
- **[Refactoring Summary](./REFACTORING_SUMMARY.md)** - Complete refactoring history

## 🎨 Theming

The application supports 7 themes with easy switching:

1. **Indigo Blue** - Default professional theme
2. **Gov Blue** - Government blue theme
3. **Slate Purple** - Purple accent theme
4. **Plum Executive** - Executive plum theme
5. **Fresh Teal** - Teal accent theme
6. **Neutral Gray** - Neutral gray theme
7. **Dark Mode** - Dark theme

**Font Options**:
- Poppins (default)
- Noto Sans
- Google Sans

**Size Options**:
- Compact
- Standard (default)
- Large

## 🔐 Permission System

77 granular permissions organized in 7 groups:

- **Dashboard** (3 permissions)
- **Report** (9 permissions)
- **Return Register** (8 permissions)
- **Register & Stock** (12 permissions)
- **PSR & Verification** (15 permissions)
- **Case & Financial Management** (18 permissions)
- **Administration** (12 permissions)

## 📊 Project Metrics

### Code Organization
- **Total Reduction**: 82.2% (6,579 → 1,168 lines in App.tsx)
- **Extracted Components**: 38 components
- **Extracted Pages**: 5 pages
- **Data Files**: 6 files
- **Type Safety**: 100% TypeScript

### Documentation
- **Documentation Files**: 13 files
- **Total Documentation**: 4,000+ lines
- **Coverage**: Complete

## 🛠️ Development

### Adding a New Page

1. Create page file in `src/app/pages/MyPage.tsx`
2. Import ThemeConfig type and props
3. Export page component
4. Import in App.tsx and add routing

See [Developer Guide](./DEVELOPER_GUIDE.md) for detailed instructions.

### Adding a New Component

1. Choose appropriate directory in `src/app/components/`
2. Create component file
3. Define props interface with ThemeConfig
4. Export component
5. Import where needed

See [Component Guide](./COMPONENT_GUIDE.md) for examples.

### Working with Themes

Always use theme colors from the `ThemeConfig` object:

```typescript
function MyComponent({ t }: { t: ThemeConfig }) {
  return (
    <div style={{ 
      backgroundColor: t.surface,
      color: t.textPrimary,
      border: `1px solid ${t.border}`
    }}>
      <button style={{ backgroundColor: t.primary }}>
        Action
      </button>
    </div>
  );
}
```

## 📦 Component Highlights

### Report Components
- **ComplexTable**: Advanced table with grouped columns and totals
- **ReportFilterPanel**: Dynamic filter panel with multiple field types
- **DetailDrawer**: Slide-out drawer for row details

### Permission Components
- **PermissionsPanel**: Searchable permission tree with select all
- **RolePreviewCard**: Visual role preview with module coverage
- **PermissionTree**: Complete permission hierarchy

### User Components
- **UserDetailDrawer**: Comprehensive user details with actions
- **ReAssignRoleModal**: Role reassignment with live preview

## 🏆 Refactoring Journey

This project underwent a comprehensive 11-phase refactoring:

| Phase | Description | Reduction |
|-------|-------------|-----------|
| 4 | Navigation Components | - |
| 5 | Shared UI Components | - |
| 6 | Page Components | 1,666 lines (35.9%) |
| 7 | Data & Configuration | 658 lines (22.1%) |
| 8 | Permission & User Components | 556 lines (24.0%) |
| 9 | Report Components | 437 lines (24.8%) |
| 10 | Dashboard Page | 159 lines (12.0%) |
| 11 | Documentation | Complete |
| **Total** | **All Phases** | **5,411 lines (82.2%)** |

See [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) for complete history.

## 🎯 Best Practices

1. **Always use TypeScript** - Full type safety throughout
2. **Theme everything** - Never hardcode colors
3. **Component composition** - Build complex UI from simple components
4. **Props drilling** - Explicit prop passing for clarity
5. **Controlled components** - All form inputs are controlled
6. **Portal modals** - Use createPortal for proper modal rendering
7. **Responsive design** - Mobile-first with Tailwind breakpoints

## 📈 Future Enhancements

### Planned Features
- Backend API integration
- Real-time updates (WebSocket)
- Advanced chart visualizations
- Export to Excel/PDF
- Email/SMS notifications
- Audit logging
- Mobile app (React Native)
- Internationalization (i18n)

### Technical Improvements
- Unit test suite
- E2E test coverage
- Performance monitoring
- Error boundary implementation
- Service worker for offline mode
- Code splitting and lazy loading

## 🤝 Contributing

1. Read the [Developer Guide](./DEVELOPER_GUIDE.md)
2. Review [Component Guide](./COMPONENT_GUIDE.md) for component patterns
3. Follow existing code style and conventions
4. Write TypeScript with proper types
5. Test all theme compatibility
6. Document new components

## 📄 License

[License information to be added]

## 👥 Team

[Team information to be added]

## 📞 Support

[Support information to be added]

---

## 📖 Quick Links

- [Developer Guide](./DEVELOPER_GUIDE.md) - Start here for development
- [Component Guide](./COMPONENT_GUIDE.md) - Component API reference
- [Architecture](./ARCHITECTURE.md) - System design and patterns
- [Refactoring History](./REFACTORING_SUMMARY.md) - Project evolution

**Status**: ✅ All refactoring phases complete. System ready for production development.

**Version**: 1.0.0 (Post-Refactoring)

**Last Updated**: 2026-06-02
