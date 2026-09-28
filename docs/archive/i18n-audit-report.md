# i18n Audit Report
**Date**: 2026-06-03  
**Scope**: Full project i18n readiness audit  
**Goal**: Identify all hardcoded UI text for English/Bangla translation

---

## Executive Summary

**Total Hardcoded UI Texts Found**: ~850+ instances  
**Files Requiring Translation**: 87 files  
**Existing Locale Files**: 14 (7 EN + 7 BN)  
**Coverage Status**: ~35% complete

### Current Locale Files
✓ `en/navigation.json` (84 entries)  
✓ `en/common.json` (80 entries)  
✓ `en/dashboard.json` (27 entries)  
✓ `en/report.json` (42 entries)  
✓ `en/user.json` (141 entries)  
✓ `en/role.json` (66 entries)  
✓ `en/auth.json` (45 entries)  
+ 7 corresponding `bn/*.json` files

---

## 1. HARDCODED UI TEXT BY CATEGORY

### A. Dashboard Pages (3 files, ~120 instances)

#### **DashboardPage.tsx**
| Line | Current Text | Context | Translation Key | Group | Translate? |
|------|-------------|---------|-----------------|-------|------------|
| 51 | "Dashboard" | Page title | `dashboard.main.title` | dashboard | YES |
| 52-53 | "View key return, approval..." | Page subtitle | `dashboard.main.subtitle` | dashboard | YES |
| 42 | "Total Returns Filed" | KPI card label | `dashboard.kpis.totalReturnsFiled` | dashboard | YES |
| 43 | "Pending Approvals" | KPI card label | `dashboard.kpis.pendingApprovals` | dashboard | YES |
| 44 | "Tax Collected (BDT)" | KPI card label | `dashboard.kpis.taxCollectedBdt` | dashboard | YES |
| 45 | "Active Users" | KPI card label | `dashboard.kpis.activeUsers` | dashboard | YES |
| 73 | "Recent Submissions" | Section title | `dashboard.sections.recentSubmissions` | dashboard | YES |
| 87 | "Circle-wise Summary" | Section title | `dashboard.sections.circlewiseSummary` | dashboard | YES |
| 75 | "TIN" | Table header | `tables.headers.tin` | tables | YES |
| 75 | "Taxpayer Name" | Table header | `tables.headers.taxpayerName` | tables | YES |
| 75 | "Type" | Table header | `tables.headers.type` | tables | YES |
| 75 | "Status" | Table header | `tables.headers.status` | tables | YES |
| 89 | "Circle" | Table header | `tables.headers.circle` | tables | YES |
| 89 | "Total" | Table header | `tables.headers.total` | tables | YES |
| 89 | "Pending" | Table header | `tables.headers.pending` | tables | YES |
| 89 | "Approved" | Table header | `tables.headers.approved` | tables | YES |
| 89 | "Tax Collected" | Table header | `tables.headers.taxCollected` | tables | YES |

#### **PSRDashboardPage.tsx**
| Line | Current Text | Context | Translation Key | Group | Translate? |
|------|-------------|---------|-----------------|-------|------------|
| 52 | "PSR Dashboard" | Page title | `dashboard.psr.title` | dashboard | YES |
| 53-54 | "Track PSR entries..." | Page subtitle | `dashboard.psr.subtitle` | dashboard | YES |
| 43 | "Total PSR Entries" | KPI label | `dashboard.psr.kpis.totalPsrEntries` | dashboard | YES |
| 44 | "Pending Approval" | KPI label | `dashboard.psr.kpis.pendingApproval` | dashboard | YES |
| 45 | "Approved Today" | KPI label | `dashboard.psr.kpis.approvedToday` | dashboard | YES |
| 46 | "Rejected Today" | KPI label | `dashboard.psr.kpis.rejectedToday` | dashboard | YES |
| 74 | "Circle-wise PSR Status" | Section title | `dashboard.psr.sections.circlewisePsrStatus` | dashboard | YES |
| 90 | "Recent PSR Entries" | Section title | `dashboard.psr.sections.recentPsrEntries` | dashboard | YES |
| 76 | "Total PSR" | Table header | `tables.headers.totalPsr` | tables | YES |
| 76 | "Tax Total" | Table header | `tables.headers.taxTotal` | tables | YES |
| 92 | "PSR No." | Table header | `tables.headers.psrNo` | tables | YES |
| 92 | "Submitted By" | Table header | `tables.headers.submittedBy` | tables | YES |
| 92 | "Amount" | Table header | `tables.headers.amount` | tables | YES |

#### **CombinedDashboardPage.tsx**
| Line | Current Text | Context | Translation Key | Group | Translate? |
|------|-------------|---------|-----------------|-------|------------|
| 23 | "Double Entry Dashboard" | Page title | `dashboard.combined.title` | dashboard | YES |
| 24-25 | "Overview of all report categories..." | Subtitle | `dashboard.combined.subtitle` | dashboard | YES |
| 10 | "Total Returns Filed" | KPI label | `dashboard.combined.kpis.totalReturnsFiled` | dashboard | YES |
| 11 | "Pending Approvals" | KPI label | `dashboard.combined.kpis.pendingApprovals` | dashboard | YES |
| 12 | "Total Tax Collected" | KPI label | `dashboard.combined.kpis.totalTaxCollected` | dashboard | YES |
| 13 | "Active Users" | KPI label | `dashboard.combined.kpis.activeUsers` | dashboard | YES |
| 45 | "Offline Returns (Today)" | Section title | `dashboard.combined.sections.offlineReturnsToday` | dashboard | YES |
| 61 | "Litigation Arrear (Today)" | Section title | `dashboard.combined.sections.litigationArrearToday` | dashboard | YES |
| 79 | "Tax Category Submissions" | Section title | `dashboard.combined.sections.taxCategorySubmissions` | dashboard | YES |

---

### B. Report Configurations (~180 instances)

#### **reportConfigs.ts** - Report Titles & Column Labels
| Line | Current Text | Context | Translation Key | Group | Translate? |
|------|-------------|---------|-----------------|-------|------------|
| 5 | "All Zones" | Filter option | `filters.options.allZones` | filters | YES |
| 6 | "All Circles" | Filter option | `filters.options.allCircles` | filters | YES |
| 7 | "All Status" | Filter option | `filters.options.allStatus` | filters | YES |
| 11 | "Tax Zone" | Filter label | `filters.labels.taxZone` | filters | YES |
| 12 | "Tax Circle" | Filter label | `filters.labels.taxCircle` | filters | YES |
| 13 | "From Date" | Filter label | `filters.labels.fromDate` | filters | YES |
| 14 | "To Date" | Filter label | `filters.labels.toDate` | filters | YES |
| 20 | "Status" | Filter label | `filters.labels.status` | filters | YES |
| 27 | "Circle" | Column label | `tables.headers.circle` | tables | YES |
| 29 | "Entry Today" | Group label | `tables.groups.entryToday` | tables | YES |
| 30 | "Pending" | Column label | `tables.headers.pending` | tables | YES |
| 31 | "Approved" | Column label | `tables.headers.approved` | tables | YES |
| 32 | "Rejected" | Column label | `tables.headers.rejected` | tables | YES |
| 33 | "Total Entry" | Column label | `tables.headers.totalEntry` | tables | YES |
| 34 | "Total Related Revenue" | Column label | `tables.headers.totalRelatedRevenue` | tables | YES |
| 38 | "Entry Upto" | Group label | `tables.groups.entryUpto` | tables | YES |
| 76 | "Return Entry Today" | Group label | `tables.groups.returnEntryToday` | tables | YES |
| 77-80 | "82BB", "82C(2)", "212", "Normal" | Return type labels | `tables.headers.return82bb`, etc. | tables | YES |
| 82 | "Tax Paid With Return (TDS)" | Column label | `tables.headers.taxPaidWithReturnTds` | tables | YES |
| 83 | "Total Tax Paid" | Column label | `tables.headers.totalTaxPaid` | tables | YES |
| 107 | "Category" | Column label | `tables.headers.category` | tables | YES |
| 109 | "Submissions" | Group label | `tables.groups.submissions` | tables | YES |
| 110-112 | "Online", "Offline", "Total" | Column labels | `tables.headers.online`, etc. | tables | YES |

#### **modulePageConfigs.ts** - Page Config Labels
| Line | Current Text | Context | Translation Key | Group | Translate? |
|------|-------------|---------|-----------------|-------|------------|
| 52 | "View Details" | Row action | `actions.viewDetails` | actions | YES |
| 58 | "Download" | Drawer action | `actions.download` | actions | YES |
| 59 | "Print" | Drawer action | `actions.print` | actions | YES |
| 60 | "Approve" | Drawer action | `actions.approve` | actions | YES |
| 61 | "Reject" | Drawer action | `actions.reject` | actions | YES |
| 67 | "Edit" | Drawer action | `actions.edit` | actions | YES |
| 76 | "Assessment Year" | Filter label | `filters.labels.assessmentYear` | filters | YES |

---

### C. Components (~250 instances)

#### **GeneratedTablePage.tsx**
| Line | Current Text | Context | Translation Key | Group | Translate? |
|------|-------------|---------|-----------------|-------|------------|
| 16 | "Reference No." | Drawer field label | `tables.fields.referenceNo` | tables | YES |
| 17 | "TIN" | Drawer field label | `tables.fields.tin` | tables | YES |
| 18 | "Taxpayer Name" | Drawer field label | `tables.fields.taxpayerName` | tables | YES |
| 19 | "Circle" | Drawer field label | `tables.fields.circle` | tables | YES |
| 20 | "Assessment Year" | Drawer field label | `tables.fields.assessmentYear` | tables | YES |
| 21 | "Status" | Drawer field label | `tables.fields.status` | tables | YES |
| 22 | "Date" | Drawer field label | `tables.fields.date` | tables | YES |
| 133 | "records" | Record count label | `common.records` | common | YES |
| 151 | "Search…" | Search placeholder | `common.searchPlaceholder` | common | YES |
| 164 | "Filters" | Filter button label | `actions.filters` | actions | YES |
| 175 | "Export" | Export button label | `actions.export` | actions | YES |
| 186 | "Print" | Print button label | `actions.print` | actions | YES |

#### **UserProfileDropdown.tsx**
| Line | Current Text | Context | Translation Key | Group | Translate? |
|------|-------------|---------|-----------------|-------|------------|
| 33 | "View Profile" | Menu item | `user.profile.viewProfile` | users | YES |
| 34 | "Account Settings" | Menu item | `user.profile.accountSettings` | users | YES |
| 35 | "Activity Log" | Menu item | `user.profile.activityLog` | users | YES |
| 39 | "Change Password" | Menu item | `user.profile.changePassword` | users | YES |
| 40 | "Manage 2FA" | Menu item | `user.profile.manage2fa` | users | YES |
| 41 | "Login & Device Activity" | Menu item | `user.profile.loginDeviceActivity` | users | YES |
| 69 | "Rafiqul Islam" | User name | N/A | N/A | NO (mock data) |
| 71-72 | "Commissioner" | User role | N/A | N/A | NO (mock data) |
| 74 | "rafiqul.islam@gov.bd" | Email | N/A | N/A | NO (mock data) |
| 88 | "Employee ID" | Summary label | `user.profile.employeeId` | users | YES |
| 92 | "Role" | Summary label | `user.profile.role` | users | YES |
| 96 | "Zone / Circle" | Summary label | `user.profile.zoneCircle` | users | YES |
| 100 | "Last Login" | Summary label | `user.profile.lastLogin` | users | YES |
| 134 | "Security" | Section title | `user.profile.security` | users | YES |
| 168 | "Sign Out" | Button label | `actions.signOut` | actions | YES |

#### **NotificationDropdown.tsx**
| Line | Current Text | Context | Translation Key | Group | Translate? |
|------|-------------|---------|-----------------|-------|------------|
| 85 | "All" | Filter label | `notifications.filters.all` | notifications | YES |
| 86 | "Unread" | Filter label | `notifications.filters.unread` | notifications | YES |
| 87 | "Approvals" | Filter label | `notifications.filters.approvals` | notifications | YES |
| 88 | "Assigned" | Filter label | `notifications.filters.assigned` | notifications | YES |
| 89 | "Security" | Filter label | `notifications.filters.security` | notifications | YES |

#### **FilterPanel.tsx**
| Current Text | Context | Translation Key | Group | Translate? |
|-------------|---------|-----------------|-------|------------|
| "Apply Filters" | Button label | `actions.applyFilters` | actions | YES |
| "Clear All" | Button label | `actions.clearAll` | actions | YES |
| "Select…" | Dropdown placeholder | `common.selectPlaceholder` | common | YES |

#### **RecordDetailsDrawer.tsx**
| Current Text | Context | Translation Key | Group | Translate? |
|-------------|---------|-----------------|-------|------------|
| "Record Details" | Drawer title | `drawers.recordDetails.title` | drawers | YES |
| "Details" | Tab label | `drawers.recordDetails.tabs.details` | drawers | YES |
| "Activity" | Tab label | `drawers.recordDetails.tabs.activity` | drawers | YES |
| "Documents" | Tab label | `drawers.recordDetails.tabs.documents` | drawers | YES |

---

### D. Page-Specific Titles & Descriptions (~90 instances)

Each page file (41 total) contains:
- Page title (e.g., "PSR Approval", "Tax Registry", "Return View & Approval")
- Page description/subtitle
- KPI labels
- Custom table headers
- Custom filter labels

**Example from PSRApprovalPage.tsx**:
```typescript
title: "PSR Approval"
desc: "Review and approve PSR submissions from all circles."
```

**Recommended Pattern**:
- Move to `en/navigation.json` (already partially done)
- Add descriptions: `navigation.{section}.{page}.description`

---

### E. Form & Modal Text (~80 instances)

#### **UserFormModal.tsx**
| Current Text | Translation Key | Group | Translate? |
|-------------|-----------------|-------|------------|
| "Add User" | `user.form.addUser` | users | YES |
| "Edit User" | `user.form.editUser` | users | YES |
| "Create a user account..." | `user.form.addUserSubtitle` | users | YES |
| "Basic Information" | `user.form.basicInformation` | users | YES |
| "Full Name" | `user.form.fullName` | users | YES |
| "Employee ID" | `user.form.employeeId` | users | YES |
| "Email" | `user.form.email` | users | YES |
| "Phone" | `user.form.phone` | users | YES |
| "Access Setup" | `user.form.accessSetup` | users | YES |
| "Account Setup" | `user.form.accountSetup` | users | YES |
| "Save Changes" | `actions.saveChanges` | actions | YES |

#### **CreateEditRoleModal.tsx**
| Current Text | Translation Key | Group | Translate? |
|-------------|-----------------|-------|------------|
| "Create New Role" | `role.form.createRole` | roles | YES |
| "Edit Role" | `role.form.editRole` | roles | YES |
| "Role Name" | `role.form.roleName` | roles | YES |
| "Description" | `role.form.description` | roles | YES |
| "Assign Permissions" | `role.form.assignPermissions` | roles | YES |
| "Save Role" | `actions.saveRole` | actions | YES |

#### **SignOutModal.tsx**
| Current Text | Translation Key | Group | Translate? |
|-------------|-----------------|-------|------------|
| "Sign Out" | `auth.logout.title` | auth | YES |
| "Are you sure you want to sign out?" | `auth.logout.message` | auth | YES |
| "Sign Out" | `auth.logout.confirm` | auth | YES |
| "Cancel" | `actions.cancel` | actions | YES |

#### **EntryForm.tsx**
| Current Text | Translation Key | Group | Translate? |
|-------------|-----------------|-------|------------|
| "TIN" | `forms.fields.tin` | forms | YES |
| "Taxpayer Name" | `forms.fields.taxpayerName` | forms | YES |
| "Assessment Year" | `forms.fields.assessmentYear` | forms | YES |
| "Amount" | `forms.fields.amount` | forms | YES |
| "Remarks" | `forms.fields.remarks` | forms | YES |
| "Submit" | `actions.submit` | actions | YES |

---

### F. Empty States & Error Messages (~30 instances)

#### **ReportPage.tsx**
| Line | Current Text | Context | Translation Key | Group | Translate? |
|------|-------------|---------|-----------------|-------|------------|
| 26 | "Select a report from the navigation" | Empty state | `emptyStates.selectReport` | emptyStates | YES |

#### **UserManagementPage.tsx**
| Current Text | Translation Key | Group | Translate? |
|-------------|-----------------|-------|------------|
| "No users match your criteria." | `emptyStates.noUsersFound` | emptyStates | YES |

#### **RoleManagementPage.tsx**
| Current Text | Translation Key | Group | Translate? |
|-------------|-----------------|-------|------------|
| "No role selected" | `emptyStates.noRoleSelected` | emptyStates | YES |
| "Select a role from the list to view..." | `emptyStates.selectRoleToView` | emptyStates | YES |

---

## 2. MISSING LOCALE KEYS

### Critical Missing Keys (High Priority)

#### **Dashboard Group** (30+ keys missing)
```json
"dashboard": {
  "main": {
    "title": "Dashboard",  // EXISTS
    "subtitle": "View key return, approval..."  // MISSING
  },
  "kpis": {
    "totalReturnsFiled": "Total Returns Filed",  // MISSING
    "pendingApprovals": "Pending Approvals",  // MISSING
    "taxCollectedBdt": "Tax Collected (BDT)",  // MISSING
    "activeUsers": "Active Users"  // MISSING
  },
  "sections": {
    "recentSubmissions": "Recent Submissions",  // MISSING
    "circlewiseSummary": "Circle-wise Summary"  // MISSING
  }
}
```

#### **Tables Group** (40+ keys missing)
```json
"tables": {
  "headers": {
    "tin": "TIN",  // MISSING
    "taxpayerName": "Taxpayer Name",  // MISSING
    "circle": "Circle",  // MISSING
    "total": "Total",  // MISSING
    "pending": "Pending",  // MISSING
    "approved": "Approved",  // MISSING
    "rejected": "Rejected",  // MISSING
    "amount": "Amount",  // MISSING
    "psrNo": "PSR No.",  // MISSING
    "submittedBy": "Submitted By",  // MISSING
    "taxTotal": "Tax Total",  // MISSING
    "totalEntry": "Total Entry",  // MISSING
    "totalRelatedRevenue": "Total Related Revenue",  // MISSING
    "return82bb": "82BB",  // MISSING
    "return82c2": "82C(2)",  // MISSING
    "return212": "212",  // MISSING
    "returnNormal": "Normal"  // MISSING
  },
  "groups": {
    "entryToday": "Entry Today",  // MISSING
    "entryUpto": "Entry Upto",  // MISSING
    "returnEntryToday": "Return Entry Today",  // MISSING
    "submissions": "Submissions"  // MISSING
  },
  "fields": {
    "referenceNo": "Reference No.",  // MISSING
    "assessmentYear": "Assessment Year"  // MISSING
  }
}
```

#### **Filters Group** (15+ keys missing)
```json
"filters": {
  "labels": {
    "taxZone": "Tax Zone",  // MISSING
    "taxCircle": "Tax Circle",  // MISSING
    "fromDate": "From Date",  // MISSING
    "toDate": "To Date",  // MISSING
    "assessmentYear": "Assessment Year"  // MISSING
  },
  "options": {
    "allZones": "All Zones",  // MISSING
    "allCircles": "All Circles",  // MISSING
    "allStatus": "All Status"  // MISSING
  }
}
```

#### **Drawers Group** (10+ keys missing)
```json
"drawers": {
  "recordDetails": {
    "title": "Record Details",  // MISSING
    "tabs": {
      "details": "Details",  // MISSING
      "activity": "Activity",  // MISSING
      "documents": "Documents"  // MISSING
    }
  }
}
```

#### **Empty States Group** (5+ keys missing)
```json
"emptyStates": {
  "selectReport": "Select a report from the navigation",  // MISSING
  "noUsersFound": "No users match your criteria.",  // MISSING
  "noRoleSelected": "No role selected",  // MISSING
  "selectRoleToView": "Select a role from the list to view..."  // MISSING
}
```

#### **Forms Group** (20+ keys missing)
```json
"forms": {
  "fields": {
    "tin": "TIN",  // MISSING
    "taxpayerName": "Taxpayer Name",  // MISSING
    "assessmentYear": "Assessment Year",  // MISSING
    "amount": "Amount",  // MISSING
    "remarks": "Remarks"  // MISSING
  }
}
```

---

## 3. DUPLICATE / REPEATED TEXT

### High-Frequency Duplicates (Consolidate to Single Key)

| Text | Occurrences | Files | Recommended Key |
|------|-------------|-------|-----------------|
| "TIN" | 47× | 28 files | `tables.headers.tin` |
| "Taxpayer Name" | 42× | 26 files | `tables.headers.taxpayerName` |
| "Circle" | 38× | 24 files | `tables.headers.circle` |
| "Status" | 35× | 22 files | `tables.headers.status` |
| "Assessment Year" | 31× | 19 files | `common.assessmentYear` |
| "Total" | 28× | 18 files | `tables.headers.total` |
| "Pending" | 26× | 17 files | `status.pending` or `tables.headers.pending` |
| "Approved" | 24× | 16 files | `status.approved` or `tables.headers.approved` |
| "Rejected" | 23× | 15 files | `status.rejected` or `tables.headers.rejected` |
| "View Details" | 36× | 36 files | `actions.viewDetails` (EXISTS) |
| "Download" | 22× | 18 files | `actions.download` (EXISTS) |
| "Print" | 21× | 17 files | `actions.print` (EXISTS) |
| "Approve" | 19× | 15 files | `actions.approve` |
| "Reject" | 18× | 14 files | `actions.reject` |
| "Edit" | 17× | 13 files | `actions.edit` (EXISTS) |
| "Entry Today" | 12× | 8 files | `tables.groups.entryToday` |
| "Entry Upto" | 12× | 8 files | `tables.groups.entryUpto` |
| "Tax Zone" | 11× | 9 files | `filters.labels.taxZone` |
| "Tax Circle" | 11× | 9 files | `filters.labels.taxCircle` |
| "From Date" | 10× | 8 files | `filters.labels.fromDate` |
| "To Date" | 10× | 8 files | `filters.labels.toDate` |

**Note**: These duplicates should use a single translation key across all occurrences.

---

## 4. TEXT THAT SHOULD NOT BE TRANSLATED

### Mock Data Values (Keep as-is)

#### **Taxpayer Names** (NAMES constant)
- "Rahman Enterprise"
- "Karim & Sons"
- "Haque Traders"
- "Matin Corp."
- "Siddiqui Ltd."
- "Ahmed Group"
- "Khan Trading"
- "Begum Exports"
- "Islam Imports"
- "Chowdhury & Co."

#### **TIN Numbers**
- "TIN-10000", "TIN-10001", etc.
- "1234567890", "9876543210", etc.

#### **User Names** (Profile dropdown)
- "Rafiqul Islam"
- "EMP-2024-1847"
- "rafiqul.islam@gov.bd"
- "Commissioner"

#### **Circle/Zone IDs**
- "Circle-1" through "Circle-8"
- "Zone-1" through "Zone-4"

#### **Assessment Years**
- "2024-25", "2023-24", "2022-23", "2021-22"
- "All Years"

#### **Reference Numbers**
- "REF-1000", "PSR-7000", etc.

#### **Case Numbers**
- "LIT-2024-001", "APP-2024-042", etc.

#### **Amounts & Currency Values**
- "৳4.2 Cr", "৳20L", "৳50,000"

#### **Dates & Timestamps**
- "2026-05-28", "Today, 9:42 AM"

#### **Technical Constants**
- "82BB", "82C(2)", "212" (return type codes)

---

## 5. RECOMMENDED KEY STRUCTURE

### Proposed Locale File Organization

```
src/app/locales/
├── en/
│   ├── common.json          [EXPAND: +30 keys]
│   ├── navigation.json      [EXISTS: 84 keys] ✓
│   ├── dashboard.json       [EXPAND: +50 keys]
│   ├── tables.json          [NEW: ~80 keys]
│   ├── filters.json         [NEW: ~25 keys]
│   ├── actions.json         [NEW: ~30 keys]
│   ├── status.json          [NEW: ~15 keys]
│   ├── drawers.json         [NEW: ~20 keys]
│   ├── modals.json          [NEW: ~25 keys]
│   ├── forms.json           [NEW: ~35 keys]
│   ├── emptyStates.json     [NEW: ~10 keys]
│   ├── notifications.json   [NEW: ~15 keys]
│   ├── breadcrumbs.json     [NEW: ~20 keys]
│   ├── report.json          [EXPAND: +40 keys]
│   ├── user.json            [EXISTS: 141 keys] ✓
│   ├── role.json            [EXISTS: 66 keys] ✓
│   └── auth.json            [EXISTS: 45 keys] ✓
└── bn/ [mirror structure]
```

### Key Naming Convention

**Pattern**: `{namespace}.{category}.{subcategory}.{key}`

**Examples**:
```typescript
// Dashboard
"dashboard.main.title"
"dashboard.main.subtitle"
"dashboard.kpis.totalReturnsFiled"
"dashboard.sections.recentSubmissions"

// Tables
"tables.headers.tin"
"tables.headers.taxpayerName"
"tables.groups.entryToday"
"tables.fields.referenceNo"

// Filters
"filters.labels.taxZone"
"filters.options.allZones"

// Actions
"actions.viewDetails"
"actions.approve"
"actions.reject"

// Status
"status.pending"
"status.approved"
"status.rejected"

// Drawers
"drawers.recordDetails.title"
"drawers.recordDetails.tabs.details"

// Empty States
"emptyStates.selectReport"
"emptyStates.noUsersFound"
```

---

## 6. RECOMMENDED REPLACEMENT ORDER

### Phase 1: Core UI Components (Highest Impact)
**Target**: ~200 keys, 15 files  
**Estimated Effort**: 6-8 hours

1. **Create new locale files**:
   - `tables.json` (80 keys)
   - `filters.json` (25 keys)
   - `actions.json` (30 keys)
   - `status.json` (15 keys)
   - `drawers.json` (20 keys)
   - `emptyStates.json` (10 keys)
   - Mirror in `bn/`

2. **Update components**:
   - `GeneratedTablePage.tsx` (24 instances)
   - `CardTable.tsx` (8 instances)
   - `FilterPanel.tsx` (12 instances)
   - `RecordDetailsDrawer.tsx` (15 instances)
   - `StatusBadge.tsx` (6 instances)

3. **Update configs**:
   - `modulePageConfigs.ts` (60 instances)
   - `reportConfigs.ts` (80 instances)

**Validation**: Run app, check tables, filters, drawers in all pages.

---

### Phase 2: Dashboard Pages (High Visibility)
**Target**: ~120 keys, 3 files  
**Estimated Effort**: 3-4 hours

1. **Expand `dashboard.json`**: Add 50+ keys for subtitles, KPIs, sections

2. **Update dashboard pages**:
   - `DashboardPage.tsx` (40 instances)
   - `PSRDashboardPage.tsx` (40 instances)
   - `CombinedDashboardPage.tsx` (40 instances)

**Validation**: Check all three dashboards in EN/BN, verify KPI labels, section titles.

---

### Phase 3: User & Role Management (Already 60% Complete)
**Target**: ~40 keys, 5 files  
**Estimated Effort**: 2-3 hours

1. **Expand `user.json`**: Add missing profile dropdown labels (10 keys)

2. **Update components**:
   - `UserProfileDropdown.tsx` (20 instances)
   - `UserFormModal.tsx` (already mostly done)
   - `RoleManagementPage.tsx` (already mostly done)

**Validation**: Test user dropdown, user form, role management.

---

### Phase 4: Forms & Modals
**Target**: ~80 keys, 8 files  
**Estimated Effort**: 4-5 hours

1. **Create `forms.json`** (35 keys) and **`modals.json`** (25 keys)

2. **Update components**:
   - `EntryForm.tsx` (15 instances)
   - `SignOutModal.tsx` (4 instances)
   - `AppModal.tsx` (8 instances)
   - `CreateEditRoleModal.tsx` (12 instances)

**Validation**: Test all modals, form validation messages.

---

### Phase 5: Page-Specific Content
**Target**: ~150 keys, 41 files  
**Estimated Effort**: 6-8 hours

1. **Expand `navigation.json`**: Add `.description` keys for all 41 pages

2. **Update all page files** (one-by-one):
   - Move hardcoded `title` and `desc` to `t("navigation.{section}.{page}.title")`
   - Move KPI labels to appropriate locale files

**Validation**: Click through all navigation items, verify titles/descriptions.

---

### Phase 6: Notifications & Dropdowns
**Target**: ~40 keys, 3 files  
**Estimated Effort**: 2-3 hours

1. **Create `notifications.json`** (15 keys)

2. **Update components**:
   - `NotificationDropdown.tsx` (15 instances)
   - `Topbar.tsx` (8 instances)

**Validation**: Test notification dropdown, filter tabs.

---

### Phase 7: Edge Cases & Cleanup
**Target**: ~50 keys, remaining files  
**Estimated Effort**: 3-4 hours

1. **Final sweep**: Grep for remaining hardcoded strings
2. **Update utility functions**: Date formatting, number formatting
3. **Add missing `bn/` translations**: Work with native speaker
4. **Add RTL support** (if needed)
5. **Update CLAUDE.md**: Document i18n patterns

**Validation**: Full app smoke test in EN/BN, check for missing keys.

---

## 7. IMPLEMENTATION GUIDELINES

### A. Using Translation Hooks

**Current approach** (should be standard):
```typescript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t("dashboard.main.title")}</h1>;
}
```

### B. Parameterized Translations

For dynamic values:
```json
{
  "user.form.editUserSubtitle": "Editing {{name}}",
  "report.showingResults": "Showing {{from}} to {{to}} of {{total}} results"
}
```

```typescript
t("user.form.editUserSubtitle", { name: user.name })
t("report.showingResults", { from: 1, to: 10, total: 100 })
```

### C. Pluralization

```json
{
  "user.resultsCount_one": "{{count}} result",
  "user.resultsCount_other": "{{count}} results"
}
```

```typescript
t("user.resultsCount", { count: users.length })
```

### D. Array Data Translation

For dropdowns/selects with fixed options:
```typescript
// ❌ BAD: Hardcoded array
const STATUS_OPTS = ["All Status", "Pending", "Approved", "Rejected"];

// ✅ GOOD: Translated array
const STATUS_OPTS = [
  t("filters.options.allStatus"),
  t("status.pending"),
  t("status.approved"),
  t("status.rejected"),
];
```

### E. Table Headers Translation

```typescript
// ❌ BAD: Hardcoded headers
headers={["TIN", "Taxpayer Name", "Circle", "Status"]}

// ✅ GOOD: Translated headers
headers={[
  t("tables.headers.tin"),
  t("tables.headers.taxpayerName"),
  t("tables.headers.circle"),
  t("tables.headers.status"),
]}
```

---

## 8. ESTIMATED TOTAL EFFORT

| Phase | Keys | Files | Hours | Priority |
|-------|------|-------|-------|----------|
| **Phase 1**: Core Components | ~200 | 15 | 6-8h | **HIGH** |
| **Phase 2**: Dashboard Pages | ~120 | 3 | 3-4h | **HIGH** |
| **Phase 3**: User/Role Mgmt | ~40 | 5 | 2-3h | **MEDIUM** |
| **Phase 4**: Forms & Modals | ~80 | 8 | 4-5h | **MEDIUM** |
| **Phase 5**: Page Content | ~150 | 41 | 6-8h | **MEDIUM** |
| **Phase 6**: Notifications | ~40 | 3 | 2-3h | **LOW** |
| **Phase 7**: Cleanup | ~50 | 10 | 3-4h | **LOW** |
| **TOTAL** | **~680** | **85** | **26-35h** | — |

**With Bangla translation**: Add 50% (13-18 hours) for native speaker work  
**With testing**: Add 25% (7-9 hours) for validation  

**Grand Total**: 46-62 hours (~1.5-2 weeks for one developer)

---

## 9. RISKS & CONSIDERATIONS

### A. Context Loss
- Some UI text depends on context (e.g., "Entry Today" vs "Return Entry Today")
- **Mitigation**: Use descriptive keys, avoid over-consolidation

### B. Bangla Character Rendering
- Ensure font supports Bengali script (currently using Poppins/Inter)
- **Mitigation**: Add Bangla-friendly font family for `bn` locale

### C. Text Length Variance
- Bangla translations may be longer/shorter than English
- **Mitigation**: Use flexible layouts, avoid fixed widths

### D. Date/Number Formatting
- Need locale-aware formatters for dates, numbers, currency
- **Mitigation**: Use `date-fns` locale, Intl.NumberFormat

### E. Testing Coverage
- Need systematic testing in both languages
- **Mitigation**: Create i18n testing checklist per phase

---

## 10. NEXT STEPS

### Immediate Actions (This Week)

1. **Review & Approve** this audit report with stakeholders
2. **Set up i18n infrastructure**:
   - Create new locale files: `tables.json`, `filters.json`, `actions.json`, `status.json`, `drawers.json`, `emptyStates.json`
   - Mirror structure in `bn/`
3. **Establish translation workflow**:
   - Identify Bangla translator/reviewer
   - Set up translation key approval process
4. **Start Phase 1**: Core Components (highest ROI)

### Short-Term (Next 2 Weeks)

1. Complete Phases 1-3 (Core Components, Dashboard, User/Role)
2. Test EN/BN switching in completed sections
3. Update CLAUDE.md with i18n patterns

### Medium-Term (Next Month)

1. Complete Phases 4-7
2. Full app i18n validation
3. Performance testing (locale bundle size)
4. Accessibility audit (screen reader support for both languages)

---

## APPENDIX: Files Requiring Translation

### Dashboard Pages (3)
- `src/app/pages/dashboard/DashboardPage.tsx`
- `src/app/pages/dashboard/PSRDashboardPage.tsx`
- `src/app/pages/dashboard/CombinedDashboardPage.tsx`

### Module Pages (38)
- `src/app/pages/return-register/*.tsx` (6 files)
- `src/app/pages/register-stock/*.tsx` (5 files)
- `src/app/pages/psr-verification/*.tsx` (11 files)
- `src/app/pages/case-financial-management/**/*.tsx` (7 files)
- `src/app/pages/administration-requests/*.tsx` (6 files)
- `src/app/pages/administration-requests/certificate-requests/*.tsx` (4 files)

### Components (30)
- `src/app/components/pages/GeneratedTablePage.tsx`
- `src/app/components/reports/ReportPage.tsx`
- `src/app/components/tables/CardTable.tsx`
- `src/app/components/filters/FilterPanel.tsx`
- `src/app/components/drawers/RecordDetailsDrawer.tsx`
- `src/app/components/modals/*.tsx` (4 files)
- `src/app/components/forms/EntryForm.tsx`
- `src/app/components/dropdowns/*.tsx` (2 files)
- `src/app/components/users/*.tsx` (3 files)
- `src/app/components/roles/*.tsx` (2 files)
- Other utility components (~12 files)

### Data/Config Files (5)
- `src/app/data/modulePageConfigs.ts`
- `src/app/data/reportConfigs.ts`
- `src/app/data/navigation.ts`
- `src/app/data/permissions.ts`
- `src/app/pages/modulePageUtils.ts`

### Total: 87 files requiring translation changes

---

**End of Report**
