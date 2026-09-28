# Config i18n Migration Plan

## Overview
Convert data config files from hardcoded English labels to translation keys for full EN/BN support.

## Strategy: Dual-Field Approach
- Keep existing `label` fields as fallbacks
- Add new `labelKey` / `titleKey` / `headerKey` fields
- Components render: `t(config.labelKey) || config.label`
- Safe, gradual migration with zero breakage

---

## Phase A: High-Impact Action Labels ✅ TARGET

### Files to Update:
1. `src/app/data/modulePageConfigs.ts`:
   - ROW_VIEW actions
   - STD actions  
   - VIEW actions
   - EDIT actions

### Translation Keys to Add:
```json
// actions.json (already exists, verify keys)
{
  "viewDetails": "View Details",
  "download": "Download",
  "print": "Print",
  "approve": "Approve",
  "reject": "Reject",
  "edit": "Edit"
}
```

### Component Updates:
- Components rendering actions already use `actions.json` keys
- Verify action rendering in:
  - `RecordDetailsDrawer.tsx` (drawer footer actions)
  - Action buttons across pages

---

## Phase B: Filter Labels ✅ TARGET

### Files to Update:
1. `src/app/data/modulePageConfigs.ts`:
   - REPORT_FILTERS
   - REPORT_FILTERS_STATUS

### Translation Keys Structure:
```json
// filters.json (already exists)
{
  "labels": {
    "assessmentYear": "Assessment Year",
    "taxZone": "Tax Zone",
    "taxCircle": "Tax Circle",
    "fromDate": "From Date",
    "toDate": "To Date",
    "status": "Status"
  }
}
```

### Component Updates:
- `FilterPanel.tsx` - render filter labels using `t(filter.labelKey)`

---

## Phase C: Table Column Headers 🔄 PARTIAL

### Files to Update:
1. `src/app/data/modulePageConfigs.ts`:
   - Column definitions in REPORT_CFGS
   - Group labels

### Translation Keys Structure:
```json
// tables.json (already exists)
{
  "headers": {
    "circle": "Circle",
    "pending": "Pending",
    "approved": "Approved",
    "rejected": "Rejected",
    "total": "Total",
    "taxPaidWithReturnTds": "Tax Paid With Return (TDS)",
    // ... etc
  },
  "groups": {
    "returnEntryToday": "Return Entry Today",
    "returnEntryUpto": "Return Entry Upto",
    "submissions": "Submissions",
    "entryToday": "Entry Today",
    "entryUpto": "Entry Upto"
  }
}
```

### Component Updates:
- `CardTable.tsx` - render column headers using `t(col.headerKey)`
- `DashTable.tsx` - already receives rendered strings (no change needed)

---

## Phase D: Report Titles & Descriptions 🔄 DEFER

### Files to Update:
1. `src/app/data/modulePageConfigs.ts` - REPORT_CFGS

### Translation Keys Structure:
```json
// reports.json (expand existing)
{
  "offlineReturnReport": {
    "title": "Offline Return Report",
    "description": "Review offline return entries..."
  },
  "taxCategoryReport": {
    "title": "Tax Category Report",
    "description": "Track return submissions..."
  }
  // ... etc
}
```

### Component Updates:
- `ReportPage.tsx` - render using `t(reportConfig.titleKey)`
- `GeneratedTablePage.tsx` - render titles/subtitles using translation keys

---

## Implementation Order

**NOW (This session)**:
1. ✅ Add `labelKey` to action definitions (Phase A)
2. ✅ Add `labelKey` to filter definitions (Phase B)
3. ✅ Update FilterPanel to use `labelKey`
4. ✅ Verify existing action rendering works
5. ✅ Test EN/BN switching

**LATER (Future sessions)**:
6. Add `headerKey` to all column definitions
7. Update table rendering components
8. Add `titleKey`/`descKey` to report configs
9. Update report page components
10. Full validation and cleanup

---

## Translation Key Naming Convention

| Config Type | Field Name | Translation Key Pattern |
|-------------|------------|------------------------|
| Action | `labelKey` | `actions.{actionId}` |
| Filter | `labelKey` | `filters.labels.{filterKey}` |
| Column Header | `headerKey` | `tables.headers.{columnKey}` |
| Group Label | `groupKey` | `tables.groups.{groupKey}` |
| Report Title | `titleKey` | `reports.{reportId}.title` |
| Report Desc | `descKey` | `reports.{reportId}.description` |

---

## Component Rendering Pattern

**Before**:
```typescript
<button>{action.label}</button>
```

**After**:
```typescript
const { t } = useTranslation();
<button>{t(action.labelKey) || action.label}</button>
```

**Fallback ensures**: If translation key is missing or not yet added, original label displays.

---

## Risk Mitigation

1. **Keep existing labels**: Don't remove until verified working
2. **Fallback rendering**: `t(key) || fallback` prevents blank labels
3. **Incremental rollout**: Update one config type at a time
4. **Validation after each phase**: Test EN/BN switching works

---

## Success Criteria

- ✅ All action labels support EN/BN
- ✅ All filter labels support EN/BN
- ✅ No blank labels in UI
- ✅ No missing translation warnings
- ✅ Existing functionality unchanged
- ✅ Theme/dark mode still works
