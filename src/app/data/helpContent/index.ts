export interface FAQ {
  q: string;
  a: string;
}

export interface StatusDef {
  label: string;
  meaning: string;
}

export interface PageGuide {
  title: string;
  overview: string;
  workflow: string[];
  actions: string[];
  statuses?: StatusDef[];
  commonErrors?: string[];
  bestPractices?: string[];
  faqs: FAQ[];
  relatedPages?: string[];
}

export interface RoleGuide {
  role: string;
  icon: string;
  responsibilities: string[];
  actions: string[];
  modules: string[];
  approvalFlow: string;
  escalationFlow: string;
}

export interface ModuleDoc {
  module: string;
  purpose: string;
  workflow: string[];
  dataSources: string[];
  approvalLogic: string;
  statusMeanings: StatusDef[];
  actions: string[];
  commonErrors: string[];
  bestPractices: string[];
  relatedModules: string[];
}

export interface WhatsNewEntry {
  version: string;
  releaseDate: string;
  features: string[];
  fixes: string[];
  uiChanges: string[];
  systemUpdates: string[];
}

// ─────────────────────────────────────────────────────────────────
// PAGE GUIDES
// ─────────────────────────────────────────────────────────────────

export const PAGE_GUIDES: Record<string, PageGuide> = {
  "dashboard-main": {
    title: "Dashboard",
    overview:
      "The main Dashboard provides a real-time overview of tax circle operations. It summarizes return submissions, pending approvals, PSR status, and key performance metrics for the current assessment year.",
    workflow: [
      "Log in — the Dashboard loads automatically with current assessment year data.",
      "Review summary cards to identify pending items requiring your attention.",
      "Click any card or chart element to drill down into the related module.",
      "Use the Assessment Year selector in the topbar to switch reporting periods.",
      "Monitor notifications bell for system alerts and approval requests.",
    ],
    actions: ["View summary statistics", "Navigate to modules via cards", "Switch assessment year", "Export dashboard data"],
    statuses: [
      { label: "Pending", meaning: "Records awaiting action or approval." },
      { label: "Approved", meaning: "Records that have been reviewed and approved." },
      { label: "Rejected", meaning: "Records declined at the approval stage." },
      { label: "Active", meaning: "Taxpayers or records currently in the system." },
    ],
    faqs: [
      { q: "Why do my numbers differ from the report?", a: "The dashboard reflects live data for the selected assessment year. Reports may use cached or filtered data. Ensure the same assessment year is selected in both views." },
      { q: "How do I change the assessment year?", a: "Use the Assessment Year dropdown in the topbar (top left). This setting applies globally to all modules." },
      { q: "Can I export dashboard data?", a: "Individual module pages have export functionality. The dashboard itself displays summary KPIs only." },
      { q: "Why is my dashboard showing no data?", a: "Confirm the correct assessment year is selected and that your account has been assigned to the correct tax circle." },
      { q: "How often does the dashboard refresh?", a: "Dashboard data refreshes when the page is loaded or when you navigate back to it." },
    ],
    relatedPages: ["psr-dashboard", "combined-dashboard"],
  },

  "psr-dashboard": {
    title: "PSR Dashboard",
    overview:
      "The PSR Dashboard focuses specifically on Personal Submission Records. It provides a breakdown of PSR status across all taxpayers in the circle — pending, approved, dormant, and invalid entries.",
    workflow: [
      "Review the PSR status summary at the top of the page.",
      "Use status filters to isolate specific categories (Pending, Dormant, Invalid).",
      "Click any record to view details in the side drawer.",
      "Navigate directly to PSR Approval or Edit Request from the action buttons.",
    ],
    actions: ["View PSR statistics", "Filter by status", "Navigate to PSR Approval", "View individual PSR records"],
    statuses: [
      { label: "Pending", meaning: "PSR submitted but not yet approved." },
      { label: "Approved", meaning: "PSR reviewed and approved by authorized officer." },
      { label: "Dormant", meaning: "Taxpayer has not submitted returns for the defined period." },
      { label: "Invalid", meaning: "PSR entry contains data errors or fails validation rules." },
    ],
    faqs: [
      { q: "What is a PSR?", a: "PSR stands for Personal Submission Record. It tracks whether each taxpayer in the circle has submitted their tax return for the assessment year." },
      { q: "What is a dormant taxpayer?", a: "A dormant taxpayer is one who has not submitted a return for two or more consecutive assessment years." },
      { q: "How do I approve a PSR?", a: "Go to PSR & Verification > PSR Approval. Select the record and use the Approve action button." },
      { q: "Why is a record showing as Invalid?", a: "Invalid records have data inconsistencies — e.g., TIN mismatch, missing data, or duplicate entries. Review the Common Errors listed in the Invalid List page." },
      { q: "Can I see PSR data for a different circle?", a: "No. Each user can only view data for circles they are assigned to by the administrator." },
    ],
    relatedPages: ["psr-approval", "psr-dormant", "invalid-list"],
  },

  "combined-dashboard": {
    title: "Double Entry Dashboard",
    overview:
      "The Double Entry Dashboard monitors the dual-entry verification system that ensures every return submission is entered and verified by two separate operators, reducing data entry errors.",
    workflow: [
      "Review the verification status summary — how many records are awaiting second entry.",
      "Use the status breakdown to identify bottlenecks in the double-entry pipeline.",
      "Navigate to Double Entry Verification to process pending items.",
    ],
    actions: ["View double-entry statistics", "Monitor verification backlog", "Navigate to verification page"],
    statuses: [
      { label: "Pending First Entry", meaning: "Record received but not yet entered by first operator." },
      { label: "Pending Second Entry", meaning: "First entry complete, awaiting second operator verification." },
      { label: "Verified", meaning: "Both entries match and record is confirmed." },
      { label: "Discrepancy", meaning: "Two entries do not match; requires supervisor review." },
    ],
    faqs: [
      { q: "What is double-entry verification?", a: "Two separate operators enter the same data independently. The system compares both entries to ensure accuracy before approving the record." },
      { q: "What happens when entries don't match?", a: "A discrepancy alert is created. A supervisor or senior officer must review and determine the correct value." },
      { q: "Can the same person do both entries?", a: "No. The system enforces that the second entry must be made by a different user account." },
    ],
    relatedPages: ["double-entry-status", "double-entry-verification"],
  },

  // ─── REPORTS ────────────────────────────────────────────────────────────────

  "offline-return-report": {
    title: "Offline Return Report",
    overview:
      "Displays a consolidated report of all offline (paper-based) tax returns received by the circle for the selected assessment year.",
    workflow: [
      "Select the assessment year from the topbar.",
      "Apply filters (Tax Zone, Tax Circle, Date Range) to narrow results.",
      "Review the data table — each row represents a taxpayer's offline return record.",
      "Use the Export button to download the report as an Excel file.",
    ],
    actions: ["Filter by zone, circle, date", "View return details", "Export to Excel"],
    statuses: [
      { label: "Submitted", meaning: "Physical return received and recorded in system." },
      { label: "Pending", meaning: "Received but not yet fully processed." },
      { label: "Verified", meaning: "Return details confirmed and validated." },
    ],
    faqs: [
      { q: "What is an offline return?", a: "An offline return is a paper tax return submitted physically at the tax office, as opposed to online submissions through the e-filing portal." },
      { q: "How do I export this report?", a: "Click the Download/Export button in the top right of the table. The file will be saved as an Excel (.xlsx) file." },
      { q: "Why are some entries missing?", a: "Ensure the correct assessment year is selected. Also confirm that returns have been entered into the system by data entry operators." },
      { q: "Can I filter by a specific taxpayer's TIN?", a: "Use the search functionality in the table to find a specific TIN or taxpayer name." },
      { q: "How do I view the full details of a return?", a: "Click the View/Details icon on the row to open the record details drawer." },
    ],
    relatedPages: ["online-return-register", "return-view-approval"],
  },

  "tax-category-report": {
    title: "Tax Category Report",
    overview:
      "Provides a breakdown of tax returns and assessments categorized by tax type (income tax, wealth statement, etc.) for the selected assessment year and circle.",
    workflow: [
      "Select filters for assessment year, zone, and circle.",
      "The table shows submission counts and amounts by category.",
      "Export to Excel for further analysis.",
    ],
    actions: ["Filter by category, zone, circle", "View category breakdown", "Export to Excel"],
    faqs: [
      { q: "What categories are included?", a: "Categories include individual income tax, company returns, wealth statement, and other applicable tax categories defined by NBR." },
      { q: "Why does my total not match the dashboard?", a: "Confirm the same assessment year and circle filters are applied." },
      { q: "Can I see historical data?", a: "Yes — select a previous assessment year from the topbar dropdown." },
      { q: "How is each category calculated?", a: "Figures come from return submissions recorded in the Return Register system." },
      { q: "Who can access this report?", a: "Circle Officers, Tax Commissioners, and Auditors assigned to the circle." },
    ],
    relatedPages: ["offline-return-report", "dashboard-main"],
  },

  "express-cert-disposal": {
    title: "Express Certificate Disposal Report",
    overview:
      "Tracks the lifecycle of tax clearance certificates from issuance to disposal, providing an audit trail for the certificate management process.",
    workflow: [
      "Apply date range and status filters.",
      "Review the disposal timeline for each certificate batch.",
      "Export records as needed for audit purposes.",
    ],
    actions: ["Filter by date, status", "View certificate details", "Export to Excel"],
    faqs: [
      { q: "What is a certificate disposal?", a: "Disposal refers to the formal recording that blank or used certificate books have been accounted for, preventing unauthorized use." },
      { q: "How do I track a specific certificate number?", a: "Use the search bar to search by certificate number or batch reference." },
      { q: "Who authorizes disposals?", a: "Certificate disposals must be approved by the Tax Commissioner or designated officer." },
      { q: "What if a certificate is reported missing?", a: "This should be escalated immediately to the Tax Commissioner. Document the incident in the Administration module." },
      { q: "Can I re-print a disposal record?", a: "Yes — use the Print/Download action on the record row." },
    ],
    relatedPages: ["data-entry-request", "disposal-history"],
  },

  "user-activity-report": {
    title: "User Activity Report",
    overview:
      "Provides a complete audit log of all user actions within the system — logins, record modifications, approvals, exports, and data entry operations.",
    workflow: [
      "Select a user, date range, or action type to filter the activity log.",
      "Review the activity table — each row shows user, action, module, timestamp.",
      "Export the log for compliance or audit purposes.",
    ],
    actions: ["Filter by user, date, action", "View activity details", "Export log to Excel"],
    faqs: [
      { q: "Who can view the User Activity Report?", a: "Only Tax Commissioners and Admin Users have access to this report." },
      { q: "How long is activity data retained?", a: "Activity data is retained for the current and previous two assessment years by default." },
      { q: "Can I track who exported data?", a: "Yes — all export actions are logged with user, timestamp, and file details." },
      { q: "What does 'Failed Login' mean in the log?", a: "It records unsuccessful login attempts, which is important for security monitoring." },
      { q: "Can activity data be deleted?", a: "No — activity logs are immutable for audit and compliance purposes." },
    ],
    relatedPages: ["dashboard-main"],
  },

  // ─── RETURN REGISTER ────────────────────────────────────────────────────────

  "return-view-approval": {
    title: "Return View & Approval",
    overview:
      "This page allows authorized officers to review submitted tax returns and either approve or return them for correction. It is the primary workflow for return authorization.",
    workflow: [
      "Review the list of returns awaiting approval.",
      "Click a record to open the details drawer and review all submitted information.",
      "Verify taxpayer details, return amount, and supporting documents.",
      "Click Approve to authorize the return, or Return to Taxpayer with a reason note.",
    ],
    actions: ["View return details", "Approve return", "Return for correction", "Filter by status/date", "Export list"],
    statuses: [
      { label: "Pending Approval", meaning: "Return submitted by taxpayer, awaiting officer review." },
      { label: "Approved", meaning: "Return reviewed and authorized by officer." },
      { label: "Returned", meaning: "Return sent back to taxpayer for correction." },
      { label: "Rejected", meaning: "Return formally rejected; taxpayer must re-submit." },
    ],
    commonErrors: [
      "Approving without reviewing attached documents.",
      "Not providing a reason when returning a submission.",
      "Approving records outside your assigned circle.",
    ],
    bestPractices: [
      "Always open the full details drawer before approving.",
      "Record clear, actionable notes when returning a submission.",
      "Process approvals in chronological order to avoid backlog.",
    ],
    faqs: [
      { q: "What is the difference between Returned and Rejected?", a: "'Returned' means the taxpayer can correct and re-submit. 'Rejected' is a final decision — the taxpayer must formally appeal to re-submit." },
      { q: "Can I undo an approval?", a: "No. Once approved, a return cannot be reversed by the approving officer. Contact the Tax Commissioner if an error was made." },
      { q: "How long do I have to process a pending return?", a: "Per NBR guidelines, pending returns should be processed within 30 working days of receipt." },
      { q: "Can I approve returns in bulk?", a: "No. Each return must be reviewed individually to ensure compliance." },
      { q: "What if I notice a discrepancy in the return data?", a: "Use the 'Return for Correction' action with a detailed note explaining the discrepancy." },
    ],
    relatedPages: ["online-return-register", "offline-return-register"],
  },

  "online-return-register": {
    title: "Online Return Register",
    overview:
      "The Online Return Register displays all tax returns submitted through the NBR e-filing portal for the selected assessment year, grouped by the current circle.",
    workflow: [
      "Filter by assessment year, status, or date range.",
      "Browse the table of submitted online returns.",
      "Click a row to view full return details in the side drawer.",
      "Returns requiring approval appear in Return View & Approval.",
    ],
    actions: ["Filter returns", "View return details", "Export register", "Navigate to approval"],
    statuses: [
      { label: "Submitted", meaning: "Return submitted by taxpayer via e-filing portal." },
      { label: "Under Review", meaning: "Officer has opened the return for review." },
      { label: "Approved", meaning: "Return formally approved." },
      { label: "Returned", meaning: "Sent back for correction." },
    ],
    faqs: [
      { q: "What is the difference between Online and Offline Return Register?", a: "Online returns are submitted digitally through the e-filing portal. Offline returns are paper forms submitted physically at the tax office." },
      { q: "Can I see returns from other circles?", a: "No. The register only shows returns for your assigned circle(s)." },
      { q: "How do I find a specific TIN?", a: "Use the search field in the table to search by TIN or taxpayer name." },
      { q: "Why is a return missing from the register?", a: "Confirm the taxpayer submitted through the official e-filing portal. Submissions from unauthorized channels will not appear." },
      { q: "How do I export the full register?", a: "Click the Download button in the top right. The full filtered list will be exported as Excel." },
    ],
    relatedPages: ["return-view-approval", "offline-return-register"],
  },

  "offline-return-register": {
    title: "Offline Return Register",
    overview:
      "Records all paper-based tax returns physically received at the circle office. Data entry operators enter these returns into the system after physical receipt.",
    workflow: [
      "Data entry operators scan and enter paper return details.",
      "Submitted entries appear in this register for officer review.",
      "Filter by date, status, or taxpayer to find specific records.",
      "Export as needed for reporting purposes.",
    ],
    actions: ["View return details", "Filter records", "Export register"],
    statuses: [
      { label: "Entered", meaning: "Data entered by operator, not yet verified." },
      { label: "Verified", meaning: "Data entry verified and confirmed." },
      { label: "Approved", meaning: "Return approved by reviewing officer." },
    ],
    faqs: [
      { q: "Who enters offline returns into the system?", a: "Data Entry Operators are responsible for entering paper return data." },
      { q: "What if data was entered incorrectly?", a: "The data entry operator can edit the record until it is approved. After approval, contact the Tax Commissioner for corrections." },
      { q: "How is the offline return verified?", a: "The supervisor or circle officer compares the entered data against the physical form." },
      { q: "Can offline returns be approved from this page?", a: "Approval is done in the Return View & Approval page, not in this register." },
      { q: "How long should physical returns be retained?", a: "Per NBR guidelines, physical tax returns must be retained for a minimum of six assessment years." },
    ],
    relatedPages: ["return-view-approval", "online-return-register"],
  },

  "online-archive": {
    title: "Online Archive",
    overview:
      "The Online Archive stores completed, closed, or archived online tax return records from previous assessment years. It provides read-only access to historical submission data.",
    workflow: [
      "Select the historical assessment year from the topbar.",
      "Browse or search the archive using TIN or taxpayer name.",
      "Click a record to view archived details.",
      "Export archived records as needed.",
    ],
    actions: ["Search archive", "View historical records", "Export archive data"],
    faqs: [
      { q: "Can I modify archived records?", a: "No. Archived records are read-only. They cannot be edited or deleted." },
      { q: "How far back does the archive go?", a: "The archive contains records from all previous assessment years loaded into the system." },
      { q: "Why is a recent return showing in the archive?", a: "Completed and closed returns from the current year may be moved to archive after final processing." },
      { q: "Can I restore an archived record to active status?", a: "Contact the Tax Commissioner or Admin User to restore records." },
      { q: "Who can access the archive?", a: "All authorized users can view the archive. Only Admin Users can manage archival settings." },
    ],
    relatedPages: ["online-return-register"],
  },

  // ─── REGISTER & STOCK ────────────────────────────────────────────────────────

  "register-4": {
    title: "Register-4 List",
    overview:
      "Register-4 is the official NBR register that lists all taxpayers within a tax circle, their TINs, and their return submission status for the assessment year.",
    workflow: [
      "Filter by assessment year and circle to load the register.",
      "Review the taxpayer list — green/active rows indicate submitted returns.",
      "Use the search function to find a specific TIN or taxpayer name.",
      "Export the register for submission to the Commissioner's office.",
    ],
    actions: ["Filter by year/circle", "Search taxpayers", "View taxpayer details", "Export Register-4"],
    statuses: [
      { label: "Active", meaning: "Taxpayer is active and expected to file a return." },
      { label: "Submitted", meaning: "Taxpayer has submitted a return for this year." },
      { label: "Dormant", meaning: "Taxpayer has not submitted returns for multiple years." },
      { label: "Inactive", meaning: "Taxpayer has been formally deactivated." },
    ],
    faqs: [
      { q: "What is Register-4?", a: "Register-4 is an official NBR record listing all registered taxpayers within a tax circle and their return filing status." },
      { q: "Why is a taxpayer missing from Register-4?", a: "The taxpayer may not be assigned to your circle, or their TIN may be inactive. Check with the Tax Registry module." },
      { q: "Can I add new taxpayers to Register-4?", a: "New taxpayer registrations are managed through the Tax Registry module." },
      { q: "How do I generate the official Register-4 for the Commissioner?", a: "Click Export to download the official Excel format. Verify data before submission." },
      { q: "What is the difference between Dormant and Inactive?", a: "Dormant means the taxpayer exists but has not filed recently. Inactive means the taxpayer has been formally deregistered." },
    ],
    relatedPages: ["stock-register", "tax-registry"],
  },

  "stock-register": {
    title: "Stock Register",
    overview:
      "The Stock Register tracks the inventory of official tax forms, certificates, and documents issued to and used by the circle office.",
    workflow: [
      "Review current stock levels for each document type.",
      "Record issued quantities when distributing forms to officers.",
      "Record returned items when collecting unused forms.",
      "Export the register for auditing purposes.",
    ],
    actions: ["View stock levels", "Record issuance", "Record returns", "Export stock register"],
    statuses: [
      { label: "In Stock", meaning: "Available quantity above minimum threshold." },
      { label: "Low Stock", meaning: "Available quantity below the defined minimum." },
      { label: "Out of Stock", meaning: "No items remaining in stock." },
      { label: "Issued", meaning: "Items distributed to an officer or unit." },
    ],
    faqs: [
      { q: "What items are tracked in the Stock Register?", a: "Tax certificates, official forms, blank return books, and other official documents issued by NBR." },
      { q: "Who can issue items from stock?", a: "Only the Stock Manager and authorized Admin Users can record issuances." },
      { q: "What happens when stock runs out?", a: "The system alerts the Stock Manager. A requisition must be raised to the Commissioner's office for replenishment." },
      { q: "How do I correct a wrong entry?", a: "Contact the Admin User — stock entries cannot be self-corrected to maintain audit integrity." },
      { q: "Is stock tracked per officer or per unit?", a: "Stock is tracked per officer for accountability of issued materials." },
    ],
    relatedPages: ["register-4", "data-entry-request"],
  },

  "tax-registry": {
    title: "Tax Registry",
    overview:
      "The Tax Registry is the master database of all registered taxpayers within the circle, containing TIN, name, address, category, and registration status.",
    workflow: [
      "Search for a taxpayer by TIN, name, or address.",
      "Review taxpayer profile including registration date and category.",
      "Update address or category information as authorized.",
      "Add new taxpayer registrations through the Add form.",
    ],
    actions: ["Search taxpayer", "View taxpayer profile", "Add new registration", "Update taxpayer data", "Export registry"],
    statuses: [
      { label: "Active", meaning: "Taxpayer in good standing, expected to file." },
      { label: "Dormant", meaning: "Inactive for multiple assessment years." },
      { label: "Deregistered", meaning: "Formally removed from the registry." },
      { label: "Special", meaning: "Registered under special category rules." },
    ],
    faqs: [
      { q: "Who can add new taxpayers?", a: "Circle Officers and Data Entry Operators can register new taxpayers. Approval may be required depending on settings." },
      { q: "Can I delete a taxpayer record?", a: "No — deactivation is used instead of deletion to maintain historical records." },
      { q: "How do I transfer a taxpayer to another circle?", a: "Use the Transfer History page under PSR & Verification." },
      { q: "What is a Special Registration?", a: "Special registrations cover entities with non-standard filing requirements, such as non-resident taxpayers or special economic zone entities." },
      { q: "Why can't I find a TIN in the registry?", a: "The TIN may belong to a different circle, or may have been deregistered. Check with the Commissioner's office." },
    ],
    relatedPages: ["register-4", "special-registration"],
  },

  "register-5": {
    title: "Register-5",
    overview:
      "Register-5 is the official demand register that records all tax demand notices issued to taxpayers within the circle for the assessment year.",
    workflow: [
      "Review pending demand entries requiring officer sign-off.",
      "Verify demand amounts against assessment records.",
      "Approve or flag entries for correction.",
      "Export the finalized register for Commissioner submission.",
    ],
    actions: ["Review demand entries", "Approve entries", "Flag for correction", "Export Register-5"],
    statuses: [
      { label: "Draft", meaning: "Entry created but not yet submitted for approval." },
      { label: "Pending Approval", meaning: "Entry submitted, awaiting officer authorization." },
      { label: "Approved", meaning: "Demand entry authorized and locked." },
      { label: "Rejected", meaning: "Entry declined; requires correction and resubmission." },
    ],
    faqs: [
      { q: "What is Register-5?", a: "Register-5 is the official NBR register of tax demand notices, tracking amounts assessed and outstanding for each taxpayer." },
      { q: "Who approves Register-5 entries?", a: "Entries are approved by the Circle Officer or Tax Commissioner, depending on demand amount thresholds." },
      { q: "Can I edit an approved entry?", a: "No. Approved entries are locked. Contact the Tax Commissioner for corrections." },
      { q: "What is the difference between Register-5 and the Demand Register?", a: "Register-5 is the official physical/digital ledger. The Demand Register (in Case & Financial Management) handles the full lifecycle of demand issuance, collection, and disputes." },
      { q: "How often should Register-5 be updated?", a: "Register-5 entries should be updated within 30 days of an assessment decision." },
    ],
    relatedPages: ["demand-entry", "register-4"],
  },

  // ─── PSR & VERIFICATION ──────────────────────────────────────────────────────

  "psr-approval": {
    title: "PSR Approval",
    overview:
      "The PSR Approval page is the central workflow for reviewing and approving Personal Submission Records. Officers review each PSR for completeness and accuracy before granting approval.",
    workflow: [
      "Review the list of PSRs pending your approval.",
      "Click a record to open the full details in the side drawer.",
      "Verify taxpayer details, submission date, and supporting information.",
      "Click Approve to confirm, or Reject with a documented reason.",
      "Approved PSRs are locked and counted in the assessment year totals.",
    ],
    actions: ["View PSR details", "Approve PSR", "Reject PSR", "Request edit", "Filter by status/date"],
    statuses: [
      { label: "Pending", meaning: "PSR submitted, awaiting approval." },
      { label: "Approved", meaning: "PSR reviewed and approved by officer." },
      { label: "Rejected", meaning: "PSR declined — taxpayer must resubmit." },
      { label: "Edit Requested", meaning: "Officer has requested a correction to the PSR." },
    ],
    commonErrors: [
      "Approving a PSR without verifying the TIN against Register-4.",
      "Rejecting without providing a clear documented reason.",
      "Approving records outside the current assessment year scope.",
    ],
    bestPractices: [
      "Always cross-reference the TIN with the Tax Registry before approving.",
      "Batch approvals of similar records to improve processing efficiency.",
      "Document all rejections thoroughly for audit trail purposes.",
    ],
    faqs: [
      { q: "What does PSR stand for?", a: "PSR stands for Personal Submission Record — the record confirming a taxpayer has submitted their return." },
      { q: "What if I accidentally approve the wrong record?", a: "Contact the Tax Commissioner immediately. Approved PSRs cannot be reversed without Commissioner authorization." },
      { q: "How many PSRs can I approve per day?", a: "There is no system limit. Process based on workload and accuracy, not speed." },
      { q: "What happens after PSR approval?", a: "The record is locked and counted in the assessment year totals. It also triggers downstream processes in reporting." },
      { q: "Who can approve PSRs?", a: "Circle Officers and Tax Commissioners. Deputy Commissioners may also have approval rights depending on configuration." },
    ],
    relatedPages: ["psr-edit-request", "psr-dashboard", "approval-list"],
  },

  "psr-edit-request": {
    title: "PSR Edit Request",
    overview:
      "When an officer identifies an error in an approved or submitted PSR, an Edit Request must be formally raised. This page manages the lifecycle of such requests.",
    workflow: [
      "Identify the PSR requiring correction.",
      "Click 'Request Edit' on the PSR detail view.",
      "Provide a clear description of the required change and supporting justification.",
      "Submit for supervisor review and approval.",
      "Once approved, the PSR is unlocked for editing.",
    ],
    actions: ["View edit requests", "Submit new edit request", "Approve/reject edit request", "Track request status"],
    statuses: [
      { label: "Pending", meaning: "Edit request submitted, awaiting supervisor decision." },
      { label: "Approved", meaning: "Edit request approved; PSR unlocked for correction." },
      { label: "Rejected", meaning: "Edit request denied; original PSR remains unchanged." },
      { label: "Completed", meaning: "Edit was made and PSR re-approved." },
    ],
    faqs: [
      { q: "Who can approve PSR edit requests?", a: "Only the Tax Commissioner or designated supervisor can approve edit requests." },
      { q: "How long does an edit request take?", a: "Standard SLA is 5 working days. Urgent requests should be escalated directly to the Commissioner." },
      { q: "Can I withdraw an edit request?", a: "Yes — you can cancel a pending edit request before it is reviewed." },
      { q: "What information must be included in an edit request?", a: "The specific field(s) to be changed, the current incorrect value, the correct value, and supporting justification." },
      { q: "What if my edit request is rejected?", a: "Contact your supervisor. If you believe the rejection is incorrect, escalate to the Tax Commissioner with documentation." },
    ],
    relatedPages: ["psr-approval", "psr-dashboard"],
  },

  "double-entry-status": {
    title: "Double Entry Status",
    overview:
      "Shows the current verification status of all records in the double-entry system. Supervisors use this page to monitor the pipeline and identify discrepancies.",
    workflow: [
      "Review the status table — each row shows a record and its dual-entry state.",
      "Filter by status to find discrepancies or pending second entries.",
      "Click a discrepancy record to view both entries side by side.",
      "Assign resolution tasks to operators if needed.",
    ],
    actions: ["View entry status", "Filter by discrepancy", "View comparison view", "Export status report"],
    statuses: [
      { label: "Awaiting Entry", meaning: "Record received; no entries made yet." },
      { label: "First Entry Done", meaning: "One operator has entered data; awaiting second entry." },
      { label: "Verified", meaning: "Both entries match — record confirmed." },
      { label: "Discrepancy", meaning: "Entries don't match — supervisor review needed." },
    ],
    faqs: [
      { q: "What is a discrepancy?", a: "A discrepancy means the two independent entries for the same record have different values in one or more fields." },
      { q: "How do I resolve a discrepancy?", a: "Go to the Double Entry Verification page to view both entries side by side and determine the correct value." },
      { q: "How long can a record stay in 'First Entry Done' status?", a: "Per process guidelines, the second entry should be completed within 2 working days." },
      { q: "Who can perform the second entry?", a: "Any operator except the one who performed the first entry." },
      { q: "Can I view which operator made each entry?", a: "Yes — the details drawer shows the operator name and timestamp for each entry." },
    ],
    relatedPages: ["double-entry-verification", "combined-dashboard"],
  },

  "double-entry-verification": {
    title: "Double Entry Verification",
    overview:
      "The verification workspace where operators complete the second data entry for records and supervisors resolve discrepancies between entries.",
    workflow: [
      "Select a record awaiting second entry from the queue.",
      "Enter the data from the source document independently.",
      "Submit your entry — the system automatically compares it with the first entry.",
      "If entries match, the record is marked Verified.",
      "If they don't match, a supervisor is notified to resolve the discrepancy.",
    ],
    actions: ["Complete second entry", "Resolve discrepancy", "View entry comparison", "Export verified records"],
    faqs: [
      { q: "Can I see the first entry while doing the second entry?", a: "No — the second entry is hidden from the first entry to ensure independence. You only see both after submitting." },
      { q: "What happens after I resolve a discrepancy?", a: "The correct value is locked in and the record is marked Verified. The resolution is logged in the audit trail." },
      { q: "Do I need to enter all fields again?", a: "Yes — the second entry is completely independent to ensure accuracy." },
      { q: "What if I make a mistake in my entry?", a: "Contact your supervisor before submitting. After submission, corrections require supervisor intervention." },
      { q: "Can I see statistics on my entry accuracy?", a: "Supervisors can view per-operator accuracy stats in the User Activity Report." },
    ],
    relatedPages: ["double-entry-status", "combined-dashboard"],
  },

  "psr-dormant": {
    title: "PSR Dormant List",
    overview:
      "Lists all taxpayers in the circle who have been flagged as dormant — meaning they have not filed a return for the defined number of consecutive assessment years.",
    workflow: [
      "Review the list of dormant taxpayers.",
      "Investigate each case to determine if dormancy is legitimate or an oversight.",
      "Issue formal dormancy notices as required by NBR guidelines.",
      "Update status when a dormant taxpayer resumes filing.",
    ],
    actions: ["View dormant taxpayers", "Filter by duration", "Issue dormancy notice", "Update status", "Export list"],
    statuses: [
      { label: "Dormant", meaning: "Taxpayer has not filed for 2+ consecutive years." },
      { label: "Notice Issued", meaning: "Formal dormancy notice sent to taxpayer." },
      { label: "Reactivated", meaning: "Taxpayer has resumed filing and been reactivated." },
    ],
    faqs: [
      { q: "How many years of non-filing makes a taxpayer dormant?", a: "Per NBR policy, non-filing for 2 or more consecutive assessment years triggers dormant status." },
      { q: "What action must I take on dormant taxpayers?", a: "A formal notice must be issued, and the case may be referred to the legal unit if the taxpayer does not respond." },
      { q: "Can a dormant taxpayer re-file?", a: "Yes — dormant taxpayers can be reactivated by submitting returns for missed years. Contact the Tax Commissioner for guidance." },
      { q: "How do I remove a taxpayer from the dormant list?", a: "Once a valid return is submitted and approved, the system updates the status automatically." },
      { q: "Are there penalties for dormant taxpayers?", a: "Yes — penalties per NBR rules apply. The Demand Register should be updated accordingly." },
    ],
    relatedPages: ["psr-dashboard", "psr-approval", "invalid-list"],
  },

  // ─── MISFILED RETURNS ────────────────────────────────────────────────────────

  "invalid-list": {
    title: "Invalid List",
    overview:
      "Lists all PSR entries or return submissions that have failed system validation rules — e.g., TIN mismatches, duplicate entries, or missing required data.",
    workflow: [
      "Review invalid entries and understand the flagged error.",
      "Investigate the source document or original submission.",
      "Correct the underlying data if within your authority.",
      "Escalate to Tax Commissioner for entries requiring formal correction.",
    ],
    actions: ["View invalid entries", "View error details", "Correct data entry", "Escalate to Commissioner", "Export invalid list"],
    statuses: [
      { label: "Invalid", meaning: "Entry flagged by system validation rules." },
      { label: "Under Review", meaning: "Being investigated by an officer." },
      { label: "Corrected", meaning: "Error resolved and entry updated." },
      { label: "Escalated", meaning: "Referred to Commissioner or legal for resolution." },
    ],
    faqs: [
      { q: "What causes a record to be flagged as Invalid?", a: "Common causes: duplicate TIN, TIN not found in Registry, missing mandatory fields, date outside assessment year range, or submission from an unregistered source." },
      { q: "Can I delete an invalid entry?", a: "No — entries cannot be deleted. They must be corrected or escalated." },
      { q: "What if the error is in the source document?", a: "The error must be escalated to the Tax Commissioner. The taxpayer may need to be contacted to provide a corrected submission." },
      { q: "Who is responsible for resolving invalid entries?", a: "The supervising Circle Officer is responsible for resolution within 15 working days." },
      { q: "How do I prevent invalid entries?", a: "Ensure Data Entry Operators validate TINs against the Tax Registry before submitting. Use the validation step in the entry form." },
    ],
    relatedPages: ["approval-list", "psr-dormant"],
  },

  "approval-list": {
    title: "Approval List (Misfiled)",
    overview:
      "Manages returns that have been identified as misfiled — submitted to the wrong circle or under an incorrect TIN. This page handles the formal approval workflow for corrections.",
    workflow: [
      "Review misfiled returns requiring formal action.",
      "Verify the correct circle or TIN for each record.",
      "Approve the transfer to the correct circle, or reject with reason.",
      "Track the correction through to completion.",
    ],
    actions: ["View misfiled records", "Approve correction", "Reject correction", "Track transfer status"],
    statuses: [
      { label: "Pending", meaning: "Misfiled return identified, awaiting approval for correction." },
      { label: "Approved", meaning: "Correction approved — record being transferred." },
      { label: "Rejected", meaning: "Correction request denied." },
      { label: "Transferred", meaning: "Record successfully moved to correct circle." },
    ],
    faqs: [
      { q: "What is a misfiled return?", a: "A return submitted under the wrong TIN or routed to the wrong tax circle." },
      { q: "Who can approve misfiled corrections?", a: "Circle Officers and Tax Commissioners with jurisdiction over both the source and destination circles." },
      { q: "What happens to the original record after transfer?", a: "The original record is marked as transferred and an audit log entry is created. The receiving circle takes ownership." },
      { q: "Can I transfer returns to a circle I don't manage?", a: "You can initiate the transfer. The receiving circle's Commissioner must also approve it." },
      { q: "How long does a misfiled correction take?", a: "Standard processing is 10 working days from identification to completion." },
    ],
    relatedPages: ["invalid-list", "transfer-history"],
  },

  "transfer-history": {
    title: "Transfer History",
    overview:
      "A complete audit log of all taxpayer and return transfers that have occurred between circles, including misfiled return corrections and taxpayer circle reassignments.",
    workflow: [
      "Search for a specific TIN or transfer date.",
      "Review the transfer log — source circle, destination circle, approving officer, date.",
      "Export transfer records for reporting or audit purposes.",
    ],
    actions: ["Search transfers", "View transfer details", "Export history"],
    faqs: [
      { q: "How far back does transfer history go?", a: "All transfers since the system went live are recorded. No data is purged." },
      { q: "Can I reverse a transfer?", a: "A reverse transfer must be approved by both circles' Commissioners. Use the Approval List to initiate." },
      { q: "Why is a transfer not appearing in history?", a: "Transfers appear only after final approval. Pending transfers are in the Approval List." },
      { q: "Can I export transfer history for a specific period?", a: "Yes — use the date range filter before exporting." },
      { q: "Who can view transfer history?", a: "All authorized users can view history. Only Tax Commissioners can initiate transfers." },
    ],
    relatedPages: ["approval-list", "tax-registry"],
  },

  // ─── CASE & FINANCIAL ────────────────────────────────────────────────────────

  "arrear-case": {
    title: "Litigation Arrear Case",
    overview:
      "Manages tax arrear cases where outstanding tax demands have not been paid and have been escalated to the litigation unit for formal collection proceedings.",
    workflow: [
      "Review the list of open arrear cases for your circle.",
      "Open a case to view taxpayer details, demand amount, and case history.",
      "Update case status as proceedings advance.",
      "Record hearings, outcomes, and next steps.",
    ],
    actions: ["View case list", "Open case details", "Update case status", "Record hearing outcome", "Export case list"],
    statuses: [
      { label: "Open", meaning: "Case is active and proceedings are ongoing." },
      { label: "Hearing Scheduled", meaning: "A court or administrative hearing has been set." },
      { label: "Judgment Pending", meaning: "Hearing concluded; awaiting formal judgment." },
      { label: "Resolved", meaning: "Case concluded — payment received or written off." },
      { label: "Appealed", meaning: "Taxpayer has filed an appeal against the decision." },
    ],
    faqs: [
      { q: "What triggers an arrear case?", a: "When a demand notice is not paid within the statutory period, the case is escalated to the litigation unit." },
      { q: "Who handles arrear cases?", a: "The Tax Commissioner and legal unit officers manage litigation cases." },
      { q: "Can I add notes to a case?", a: "Yes — use the Notes/Comments section in the case detail drawer." },
      { q: "What happens when a case is resolved?", a: "The case is closed, payment is recorded in the Demand Register, and the taxpayer's liability is updated." },
      { q: "How do I find a specific case?", a: "Search by TIN, case number, or taxpayer name in the search bar." },
    ],
    relatedPages: ["demand-entry", "appeal-reg-view"],
  },

  "writ-case": {
    title: "Litigation Writ Case",
    overview:
      "Manages writ petition cases filed by taxpayers in court challenging tax assessments or demands.",
    workflow: [
      "Review active writ cases and their current court status.",
      "Record court dates, hearings, and interim orders.",
      "Update case status based on court proceedings.",
      "Coordinate with legal counsel and the Commissioner's office.",
    ],
    actions: ["View writ cases", "Record hearing details", "Update status", "Export case list"],
    statuses: [
      { label: "Active", meaning: "Case filed and pending court decision." },
      { label: "Stay Order", meaning: "Court has issued a temporary stay on the demand." },
      { label: "Judgment", meaning: "Court has issued a final judgment." },
      { label: "Dismissed", meaning: "Writ petition dismissed by the court." },
      { label: "Settled", meaning: "Case resolved through settlement." },
    ],
    faqs: [
      { q: "What is a writ case?", a: "A writ petition is filed by a taxpayer in High Court or Supreme Court challenging a tax assessment or demanding review of an administrative decision." },
      { q: "What is a stay order?", a: "A stay order is a court directive that temporarily suspends a tax demand until the case is decided." },
      { q: "Should I continue collection actions during a stay?", a: "No. Collection activities must stop immediately upon receiving a stay order. Contact the Commissioner." },
      { q: "Who updates writ case records?", a: "The legal unit officer assigned to the case, under the Tax Commissioner's supervision." },
      { q: "How do I know a new writ case has been filed?", a: "The system generates an alert when a new writ case is entered for your circle." },
    ],
    relatedPages: ["arrear-case", "dept-case"],
  },

  "dept-case": {
    title: "Litigation Department Case",
    overview: "Tracks cases where the NBR or tax department is the appellant — i.e., the department is challenging a lower court or administrative decision.",
    workflow: [
      "Review active departmental cases.",
      "Record appeal proceedings and court dates.",
      "Track case progress through the appellate hierarchy.",
    ],
    actions: ["View departmental cases", "Record proceedings", "Update status", "Export list"],
    faqs: [
      { q: "What is a departmental litigation case?", a: "These are cases where the tax department has filed an appeal against a decision favorable to the taxpayer — typically a tribunal or lower court order." },
      { q: "Who authorizes filing a departmental appeal?", a: "Only the Tax Commissioner can authorize filing departmental appeals." },
      { q: "What is the appeal timeline?", a: "Departmental appeals must be filed within 60 days of the order being challenged." },
      { q: "How do I track a case through multiple courts?", a: "Each court stage is recorded as a separate hearing entry with outcome notes." },
      { q: "Can I view related taxpayer cases alongside this?", a: "Yes — the related TIN's taxpayer case is linked in the case details." },
    ],
    relatedPages: ["taxpayer-case", "writ-case"],
  },

  "taxpayer-case": {
    title: "Litigation Taxpayer Case",
    overview: "Tracks all litigation cases initiated by taxpayers — appeals, objections, and formal disputes against assessments.",
    workflow: [
      "Review taxpayer-initiated cases for your circle.",
      "Track case progress and required response deadlines.",
      "Coordinate departmental responses with legal unit.",
      "Update case status and outcomes.",
    ],
    actions: ["View taxpayer cases", "Record responses", "Update status", "Set hearing reminders"],
    faqs: [
      { q: "What types of cases appear here?", a: "Objections to assessments, appeals to the Commissioner, appeals to the Appellate Tribunal, and High Court writ petitions filed by taxpayers." },
      { q: "What is the response deadline for an objection?", a: "The department must respond to formal objections within 30 days per NBR regulations." },
      { q: "How do I handle multiple cases for the same taxpayer?", a: "Each case is tracked separately. The taxpayer's TIN links all cases in the details view." },
      { q: "What happens if we miss a response deadline?", a: "Missing a deadline can result in an ex-parte order against the department. Always set hearing reminders." },
      { q: "Can I attach documents to a case?", a: "Document management for case attachments is planned for a future release." },
    ],
    relatedPages: ["dept-case", "demand-entry"],
  },

  "appeal-reg-view": {
    title: "Appeal Register",
    overview: "The Appeal Register records all formal tax appeals filed with the Commissioner of Taxes, tracking the appeal from filing to final decision.",
    workflow: [
      "Review the list of active appeals.",
      "Open an appeal to view taxpayer details, grounds for appeal, and hearing schedule.",
      "Record hearing dates, officer notes, and interim decisions.",
      "Update the final outcome when the appeal is decided.",
    ],
    actions: ["View appeal list", "Open appeal details", "Record hearing", "Update decision", "Export register"],
    statuses: [
      { label: "Filed", meaning: "Appeal received and registered." },
      { label: "Under Hearing", meaning: "Appeal hearing is in progress." },
      { label: "Decision Pending", meaning: "Hearing concluded; decision being formulated." },
      { label: "Decided", meaning: "Final decision issued." },
      { label: "Withdrawn", meaning: "Taxpayer has withdrawn the appeal." },
    ],
    faqs: [
      { q: "Who can hear an appeal?", a: "The Commissioner of Taxes or a designated Deputy Commissioner authorized to hear appeals." },
      { q: "What is the time limit for filing an appeal?", a: "Appeals must be filed within 45 days of the assessment order, unless an extension is granted." },
      { q: "Can a decision be further appealed?", a: "Yes — appeal decisions can be taken to the Appellate Tribunal. Use the Tribunal Register for further proceedings." },
      { q: "How do I view the original assessment that was appealed?", a: "The appeal details drawer links to the original assessment records." },
      { q: "What if an appeal involves multiple assessment years?", a: "Each year's appeal is registered separately but linked by TIN." },
    ],
    relatedPages: ["appeal-approval", "tribunal-reg-view"],
  },

  "appeal-approval": {
    title: "Appeal Approval",
    overview: "Workflow for reviewing and formally approving the drafted decisions for tax appeals before they are communicated to taxpayers.",
    workflow: [
      "Review drafted appeal decisions awaiting approval.",
      "Open the decision draft to verify reasoning and legal basis.",
      "Approve the decision to authorize formal communication.",
      "Rejected drafts are returned to the drafting officer for revision.",
    ],
    actions: ["Review decision drafts", "Approve decision", "Return for revision", "Export approved decisions"],
    faqs: [
      { q: "Who approves appeal decisions?", a: "Only the Tax Commissioner or designated authority can approve and sign off appeal decisions." },
      { q: "What checks should be done before approving?", a: "Verify: legal basis cited, assessment year, TIN accuracy, demand amount, and that the decision follows precedent." },
      { q: "Can I approve a decision with reservations?", a: "No — you should return it for revision with your comments rather than approving with reservations." },
      { q: "How is the taxpayer notified?", a: "The system generates a formal order document upon approval. Physical delivery is handled by the office." },
      { q: "What is the timeline for issuing an appeal decision?", a: "Decisions should be issued within 60 days of the final hearing." },
    ],
    relatedPages: ["appeal-reg-view", "tribunal-reg-view"],
  },

  "tribunal-reg-view": {
    title: "Tribunal Register",
    overview: "Records cases referred to the Taxes Appellate Tribunal — the second level of appeal above the Commissioner of Taxes.",
    workflow: [
      "Review cases referred to the Tribunal.",
      "Record Tribunal hearing dates and proceedings.",
      "Update case status based on Tribunal orders.",
      "Coordinate with the legal unit on tribunal submissions.",
    ],
    actions: ["View tribunal cases", "Record proceedings", "Update status", "Export register"],
    statuses: [
      { label: "Referred", meaning: "Case submitted to Tribunal registry." },
      { label: "Hearing Set", meaning: "Tribunal hearing date confirmed." },
      { label: "Under Hearing", meaning: "Proceedings ongoing." },
      { label: "Order Issued", meaning: "Tribunal has issued an order." },
      { label: "Appealed to High Court", meaning: "Case further appealed to High Court Division." },
    ],
    faqs: [
      { q: "What is the Taxes Appellate Tribunal?", a: "It is an independent tribunal that hears tax appeals from decisions made by Commissioners of Taxes." },
      { q: "What is the time limit for filing with the Tribunal?", a: "Appeals must be filed within 60 days of the Commissioner's decision." },
      { q: "Can Tribunal orders be further appealed?", a: "Yes — Tribunal orders can be appealed to the High Court Division." },
      { q: "Who represents the department at the Tribunal?", a: "Departmental lawyers, supported by the Tax Commissioner and legal unit officers." },
      { q: "What documents are needed for a Tribunal filing?", a: "Original assessment order, Commissioner's appeal decision, grounds of appeal, and relevant return records." },
    ],
    relatedPages: ["tribunal-approval", "appeal-reg-view"],
  },

  "demand-entry": {
    title: "Demand Register (Entry)",
    overview: "Used to record and manage tax demand notices issued to taxpayers for outstanding tax liabilities.",
    workflow: [
      "Create a new demand entry for a taxpayer with outstanding liability.",
      "Enter demand amount, assessment year, and demand type.",
      "Submit for supervisor approval.",
      "Track payment status against each demand.",
    ],
    actions: ["Create demand entry", "Edit pending entry", "Submit for approval", "View demand history", "Export register"],
    statuses: [
      { label: "Draft", meaning: "Entry being prepared, not yet submitted." },
      { label: "Pending Approval", meaning: "Submitted, awaiting authorization." },
      { label: "Active", meaning: "Approved demand notice outstanding." },
      { label: "Partially Paid", meaning: "Some payment received but balance remains." },
      { label: "Settled", meaning: "Full payment received or formally written off." },
    ],
    faqs: [
      { q: "What is a tax demand notice?", a: "A formal notice issued by the tax authority requiring a taxpayer to pay an assessed but unpaid tax liability." },
      { q: "Who can create demand entries?", a: "Circle Officers and Data Entry Operators, with final approval by the Tax Commissioner." },
      { q: "Can I record a partial payment?", a: "Yes — use the payment recording feature in the Taxpayer Ledger module." },
      { q: "What happens if a demand is disputed?", a: "The taxpayer must file an appeal. The demand is not suspended unless a court orders a stay." },
      { q: "How do I link a demand to a litigation case?", a: "In the demand details, use the 'Link to Case' option to associate with an existing litigation case." },
    ],
    relatedPages: ["demand-approval", "taxpayer-ledger", "register-5"],
  },

  "taxpayer-ledger": {
    title: "Taxpayer Ledger",
    overview: "The Taxpayer Ledger provides a complete financial record for each taxpayer — all assessments, demand notices, payments, and refunds in one place.",
    workflow: [
      "Search for a taxpayer by TIN or name.",
      "Review the ledger entries — assessments, demands, and payments in chronological order.",
      "Verify outstanding balance.",
      "Export the ledger for audit or taxpayer communication.",
    ],
    actions: ["Search taxpayer", "View ledger entries", "Record payment", "Export ledger"],
    faqs: [
      { q: "What does the ledger show?", a: "All financial transactions related to the taxpayer: assessments raised, demand notices issued, payments received, refunds granted, and adjustments made." },
      { q: "Can I add manual entries to the ledger?", a: "Manual entries require Tax Commissioner authorization. Contact Admin to enable manual adjustments." },
      { q: "Why is the balance different from what the taxpayer claims?", a: "Compare each line item with the taxpayer's records. Common discrepancies include unprocessed payments or misapplied receipts." },
      { q: "Can taxpayers see their ledger?", a: "Taxpayers can view their own ledger through the NBR e-service portal." },
      { q: "How far back does the ledger go?", a: "The ledger contains all entries from the time the taxpayer was registered in the system." },
    ],
    relatedPages: ["demand-entry", "refund-adjustment"],
  },

  "demand-approval": {
    title: "Demand Approval",
    overview: "The approval workflow for reviewing and authorizing tax demand notices before they are formally issued to taxpayers.",
    workflow: [
      "Review pending demand entries requiring your approval.",
      "Open each entry to verify accuracy of amount, taxpayer details, and assessment basis.",
      "Approve to authorize issuance, or return for correction.",
    ],
    actions: ["Review pending demands", "Approve demand", "Return for correction", "Export approved demands"],
    faqs: [
      { q: "Who can approve demand notices?", a: "Tax Commissioners and designated Deputy Commissioners." },
      { q: "What checks must be done before approving?", a: "Verify TIN, assessment year, demand amount calculation, and that the correct taxpayer category is applied." },
      { q: "Can I approve demands in bulk?", a: "Bulk approval is not supported — each demand requires individual review." },
      { q: "What happens after I approve a demand?", a: "The demand notice is formally generated and the taxpayer's ledger is updated." },
      { q: "Can I reject a demand I previously approved?", a: "No. Contact the Commissioner to initiate a formal correction or adjustment." },
    ],
    relatedPages: ["demand-entry", "taxpayer-ledger"],
  },

  "refund-adjustment": {
    title: "Refund & Adjustment",
    overview: "Manages tax refund requests and adjustment entries for cases where taxpayers have overpaid or are due a credit.",
    workflow: [
      "Review refund requests or adjustment applications.",
      "Verify the overpayment amount against the taxpayer ledger.",
      "Approve the refund or adjustment with required documentation.",
      "Update the taxpayer ledger upon completion.",
    ],
    actions: ["View refund requests", "Approve refund", "Reject request", "Record adjustment", "Export records"],
    statuses: [
      { label: "Requested", meaning: "Taxpayer has applied for a refund or adjustment." },
      { label: "Under Review", meaning: "Being verified by an officer." },
      { label: "Approved", meaning: "Refund or adjustment authorized." },
      { label: "Processed", meaning: "Refund issued or adjustment applied to ledger." },
      { label: "Rejected", meaning: "Request denied with documented reasons." },
    ],
    faqs: [
      { q: "What qualifies for a tax refund?", a: "Overpayment of tax, advance tax paid in excess of liability, or correction of erroneous assessments." },
      { q: "How long does a refund take?", a: "Processing time is 30–90 days depending on the amount and complexity." },
      { q: "Can I approve my own refund application?", a: "No — refund approvals require review by a different officer than the one who raised the adjustment." },
      { q: "What documentation is required for a refund?", a: "Original payment receipts, assessment records showing overpayment, and a formal refund application." },
      { q: "What is an adjustment vs a refund?", a: "A refund returns money to the taxpayer. An adjustment credits the overpayment against future liabilities." },
    ],
    relatedPages: ["taxpayer-ledger", "demand-entry"],
  },

  // ─── ADMINISTRATION ──────────────────────────────────────────────────────────

  "user-management": {
    title: "User Management",
    overview: "Manages all system user accounts — creating new users, assigning roles and circles, updating profiles, and deactivating accounts.",
    workflow: [
      "View the list of all system users.",
      "Create a new user account with name, designation, email, and circle assignment.",
      "Assign roles to control module access.",
      "Deactivate users who leave or change roles.",
    ],
    actions: ["Create user", "Edit user profile", "Assign role", "Activate/deactivate user", "Export user list"],
    statuses: [
      { label: "Active", meaning: "User account is enabled and can log in." },
      { label: "Inactive", meaning: "Account disabled — user cannot log in." },
      { label: "Pending", meaning: "Account created but awaiting activation." },
    ],
    faqs: [
      { q: "Who can create new user accounts?", a: "Only Admin Users and Tax Commissioners can create and manage user accounts." },
      { q: "How do I reset a user's password?", a: "Use the 'Reset Password' action in the user details. The user will receive a reset link." },
      { q: "Can a user be in multiple circles?", a: "Yes — a user can be assigned to multiple circles if their role requires it." },
      { q: "What happens to a user's data when they are deactivated?", a: "Their records and actions are preserved. Only their login access is disabled." },
      { q: "How do I give a user access to a new module?", a: "Update the user's role assignment in Role Management to include the required module." },
    ],
    relatedPages: ["role-management", "user-activity-report"],
  },

  "role-management": {
    title: "Role Management",
    overview: "Defines access control roles that determine which modules and actions each category of user can perform.",
    workflow: [
      "Review existing roles and their permissions.",
      "Create a new role with specific module access.",
      "Assign roles to user accounts.",
      "Update role permissions as operational requirements change.",
    ],
    actions: ["View roles", "Create role", "Edit role permissions", "Assign role to user", "Export role list"],
    faqs: [
      { q: "What is role-based access control (RBAC)?", a: "RBAC means access to modules and actions is determined by the user's assigned role, not individual permissions. This simplifies management and ensures consistency." },
      { q: "Can a user have multiple roles?", a: "Yes — a user can have multiple roles, combining permissions from each." },
      { q: "What is the difference between a role and a designation?", a: "Designation is the user's job title. Role controls their system access. A Deputy Commissioner (designation) may have an Approver role (system access)." },
      { q: "How do I prevent a role from accessing a module?", a: "Edit the role and uncheck the relevant module permission." },
      { q: "Can roles be deleted?", a: "Only if no users are currently assigned to that role." },
    ],
    relatedPages: ["user-management"],
  },

  "special-registration": {
    title: "Special Registration",
    overview: "Handles the registration process for taxpayers requiring special category treatment — non-residents, SEZ entities, diplomatic missions, and other exceptions.",
    workflow: [
      "Receive and review the special registration application.",
      "Verify the taxpayer's eligibility for special category status.",
      "Submit for Commissioner approval.",
      "Assign the special TIN and update the Tax Registry.",
    ],
    actions: ["View applications", "Process registration", "Approve/reject", "Export registrations"],
    faqs: [
      { q: "Who qualifies for special registration?", a: "Non-resident individuals, foreign companies, SEZ entities, diplomatic missions, and others defined by NBR guidelines." },
      { q: "What is different about special registration?", a: "Special registrations have different tax treatment rules, filing requirements, and applicable rates." },
      { q: "Who approves special registrations?", a: "All special registrations require Tax Commissioner approval." },
      { q: "Can a special registration be converted to regular?", a: "Yes, if the entity's circumstances change. This requires a formal application and Commissioner approval." },
      { q: "Is there a TIN format difference for special registrations?", a: "TIN format follows NBR standard. Special category is recorded as a classification field, not in the TIN format." },
    ],
    relatedPages: ["tax-registry", "user-management"],
  },

  "time-extension": {
    title: "Time Extension Requests",
    overview: "Manages formal applications from taxpayers requesting an extension to the standard filing deadline.",
    workflow: [
      "Review incoming time extension applications.",
      "Verify the taxpayer's circumstances and reason for extension.",
      "Approve or reject the application with justification.",
      "Communicate the decision to the taxpayer.",
    ],
    actions: ["View applications", "Review details", "Approve extension", "Reject with reason", "Export list"],
    statuses: [
      { label: "Submitted", meaning: "Application received by the system." },
      { label: "Under Review", meaning: "Being evaluated by an officer." },
      { label: "Approved", meaning: "Extension granted to the taxpayer." },
      { label: "Rejected", meaning: "Application denied." },
    ],
    faqs: [
      { q: "What is the maximum extension that can be granted?", a: "Per NBR guidelines, extensions of up to 60 days may be granted by the Circle Officer. Longer extensions require Commissioner authorization." },
      { q: "What are valid reasons for an extension?", a: "Medical emergencies, natural disasters, technical issues with e-filing, or documented business disruptions." },
      { q: "Can an extension be granted multiple times?", a: "No — only one extension per assessment year per taxpayer is permitted under standard rules." },
      { q: "Does an extension waive late filing penalties?", a: "Yes — if approved before the original deadline, penalties do not apply during the extension period." },
      { q: "How is the taxpayer notified of the decision?", a: "The decision is communicated through the e-service portal and a formal letter is generated." },
    ],
    relatedPages: ["user-management", "return-view-approval"],
  },

  "audit-selection": {
    title: "Audit Selection",
    overview: "The process of selecting taxpayers for formal tax audit based on risk criteria, random selection, or Commissioner directives.",
    workflow: [
      "Review the audit selection criteria and pool of eligible taxpayers.",
      "Apply selection criteria (risk score, random, specific TIN).",
      "Confirm the selected taxpayers for the audit batch.",
      "Submit for Commissioner approval.",
      "Notify selected taxpayers and initiate the audit process.",
    ],
    actions: ["Review selection pool", "Apply criteria", "Confirm selection", "Submit for approval", "Export audit list"],
    statuses: [
      { label: "Draft", meaning: "Selection in progress, not finalized." },
      { label: "Pending Approval", meaning: "Submitted for Commissioner review." },
      { label: "Approved", meaning: "Audit selection finalized and authorized." },
      { label: "Notified", meaning: "Selected taxpayers formally notified." },
      { label: "Audit In Progress", meaning: "Audit process has begun for these taxpayers." },
    ],
    faqs: [
      { q: "Who can select taxpayers for audit?", a: "Circle Officers can propose audit selections; final approval requires the Tax Commissioner." },
      { q: "What are the risk criteria for audit selection?", a: "High declared losses, large fluctuations in income, mismatch between lifestyle and declared income, and statistical outliers." },
      { q: "Can a taxpayer refuse an audit?", a: "No — taxpayers selected for audit are legally required to cooperate per the Income Tax Act." },
      { q: "How many taxpayers are typically selected per year?", a: "This varies by circle size. The Commissioner sets annual audit targets based on NBR directives." },
      { q: "What happens after audit selection is approved?", a: "Audit notices are generated and issued to selected taxpayers, and audit teams are assigned." },
    ],
    relatedPages: ["user-management"],
  },

  "data-entry-request": {
    title: "Certificate Data Entry",
    overview: "Used by authorized operators to enter details of tax certificates received from the Commissioner's office into the system.",
    workflow: [
      "Receive certificate batch with official reference.",
      "Enter certificate numbers, type, and received quantity.",
      "Submit the entry for supervisor verification.",
      "Certificates become available in the Stock Register after approval.",
    ],
    actions: ["Create entry", "Edit pending entry", "Submit for verification", "Export entries"],
    faqs: [
      { q: "What types of certificates are entered here?", a: "Tax Clearance Certificates, Income Tax Certificates, and other official NBR certificates issued by the Commissioner's office." },
      { q: "What is the certificate batch reference?", a: "An official number assigned by the issuing Commissioner's office to each batch of certificates." },
      { q: "Can I edit an entry after submission?", a: "No — submitted entries must be verified by a supervisor before changes can be made." },
      { q: "What if a certificate number is wrong?", a: "Notify your supervisor immediately. Do not proceed with issuing certificates until the error is corrected." },
      { q: "How are certificates tracked after entry?", a: "They move to the Stock Register and are tracked by serial number through issuance, usage, and disposal." },
    ],
    relatedPages: ["approval-request", "stock-register", "disposal-history"],
  },

  "approval-request": {
    title: "Certificate Approval Request",
    overview: "The approval workflow for certificate data entries — supervisors verify entered certificate details before making them available for use.",
    workflow: [
      "Review certificate data entries awaiting approval.",
      "Verify quantity and serial numbers against official documentation.",
      "Approve to add certificates to the Stock Register.",
      "Return entries with errors for correction.",
    ],
    actions: ["Review entries", "Approve entry", "Return for correction", "Export approved entries"],
    faqs: [
      { q: "What documentation should I check against?", a: "The official dispatch letter from the Commissioner's office that accompanies each certificate batch." },
      { q: "Can I partially approve an entry?", a: "No — entries are approved in full. If some certificates have errors, return the whole entry for correction." },
      { q: "What is the timeline for approving certificate entries?", a: "Entries should be approved within 2 working days of submission." },
      { q: "Who has final approval authority?", a: "The supervising Circle Officer or Stock Manager." },
      { q: "What if the quantities don't match the dispatch letter?", a: "Do not approve. Escalate immediately to the Tax Commissioner and document the discrepancy." },
    ],
    relatedPages: ["data-entry-request", "stock-register"],
  },

  "edit-request": {
    title: "Certificate Edit Request",
    overview: "Manages formal requests to correct errors in approved certificate entries.",
    workflow: [
      "Identify the certificate entry requiring correction.",
      "Submit an edit request with detailed justification.",
      "Supervisor reviews and approves or rejects the request.",
      "If approved, the entry is unlocked for correction.",
    ],
    actions: ["View edit requests", "Submit edit request", "Approve/reject request"],
    faqs: [
      { q: "When should an edit request be raised?", a: "Only when data was entered incorrectly and has been formally approved. Minor corrections before approval use the standard edit function." },
      { q: "Who approves certificate edit requests?", a: "Tax Commissioner or designated senior officer." },
      { q: "Can I cancel an edit request?", a: "Yes — pending requests can be cancelled before they are reviewed." },
      { q: "What information must be included in the edit request?", a: "Certificate batch number, specific error, correct value, and supporting documentation." },
      { q: "How long does an edit request take?", a: "Standard processing is 5 working days." },
    ],
    relatedPages: ["data-entry-request", "disposal-history"],
  },

  "disposal-history": {
    title: "Certificate Disposal History",
    overview: "A complete audit trail of all certificate disposals — accounting for every certificate issued, used, and disposed of.",
    workflow: [
      "Review the disposal log for a specific batch or date range.",
      "Track certificates from receipt through to final disposal.",
      "Export the disposal record for Commissioner submission.",
    ],
    actions: ["View disposal history", "Search by batch/date", "Export disposal record"],
    faqs: [
      { q: "What is a certificate disposal?", a: "The formal recording that certificates have been accounted for — either used, returned, or cancelled. This prevents unauthorized certificates from being issued." },
      { q: "Can disposal records be edited?", a: "No — disposal records are permanent audit entries." },
      { q: "How often should disposal records be reconciled?", a: "Monthly reconciliation is required. Quarterly submission to the Commissioner's office." },
      { q: "What if my disposal numbers don't balance?", a: "Stop all certificate activities and report to the Tax Commissioner immediately. This is a serious compliance issue." },
      { q: "Who submits the disposal report to the Commissioner?", a: "The Stock Manager or designated officer, authorized by the Tax Commissioner." },
    ],
    relatedPages: ["data-entry-request", "stock-register"],
  },
};

// ─────────────────────────────────────────────────────────────────
// ROLE GUIDES
// ─────────────────────────────────────────────────────────────────

export const ROLE_GUIDES: RoleGuide[] = [
  {
    role: "Tax Commissioner",
    icon: "Crown",
    responsibilities: [
      "Overall supervision of the tax circle or range",
      "Final authority on approvals, disputes, and escalations",
      "Authorizing appeals, litigation cases, and audit selections",
      "Managing user access and system administration",
    ],
    actions: [
      "Approve all types of records (PSR, demand, certificate, audit)",
      "Override or reverse decisions with documented justification",
      "Authorize special registrations and time extensions",
      "Access all reports and export any data",
      "Manage user accounts and role assignments",
    ],
    modules: [
      "All modules with full access",
      "User Activity Report (exclusive)",
      "Audit Selection",
      "Role Management",
    ],
    approvalFlow: "Final approver for all workflows. No further approval required for any action.",
    escalationFlow: "Escalates to the Commissioner of Taxes at the Divisional or National level for issues beyond circle authority.",
  },
  {
    role: "Deputy Commissioner",
    icon: "ShieldCheck",
    responsibilities: [
      "Assisting the Tax Commissioner in day-to-day operations",
      "Reviewing and approving operational records within delegated authority",
      "Managing circle workflows and supervising officers",
    ],
    actions: [
      "Approve PSRs, demand entries, and return records within delegated authority",
      "Review and forward litigation cases",
      "Access all operational reports",
      "Supervise Circle Officers and operators",
    ],
    modules: [
      "Dashboard", "Reports", "Return Register", "PSR & Verification",
      "Case & Financial Management", "Register & Stock",
    ],
    approvalFlow: "Approves within delegated authority. Items exceeding delegated amount or complexity are forwarded to the Tax Commissioner.",
    escalationFlow: "Escalates to Tax Commissioner for items above authority threshold.",
  },
  {
    role: "Circle Officer",
    icon: "UserCheck",
    responsibilities: [
      "Day-to-day management of taxpayer records in assigned circle",
      "Reviewing and approving returns, PSRs, and demands",
      "Maintaining registers (Register-4, Register-5)",
      "Monitoring dormant and invalid records",
    ],
    actions: [
      "Approve returns and PSRs",
      "Create and approve demand entries",
      "Process transfer requests",
      "Export registers",
      "Manage certificate data entry approvals",
    ],
    modules: [
      "Dashboard", "Return Register", "PSR & Verification",
      "Register & Stock", "Misfiled Returns", "Case & Financial",
      "Administration (limited)",
    ],
    approvalFlow: "Approves routine operational records. Complex items escalated to Deputy Commissioner or Tax Commissioner.",
    escalationFlow: "Escalates to Deputy Commissioner or Tax Commissioner for disputed records, litigation, and high-value demands.",
  },
  {
    role: "Auditor",
    icon: "Search",
    responsibilities: [
      "Reviewing tax records for compliance and accuracy",
      "Verifying audit selections",
      "Reporting discrepancies and anomalies",
    ],
    actions: [
      "Read-only access to all records",
      "View audit trails and user activity",
      "Export data for audit review",
      "Flag records for supervisor attention",
    ],
    modules: [
      "Dashboard (view only)", "Reports (all)", "Return Register (view only)",
      "PSR & Verification (view only)", "Case & Financial (view only)",
      "Audit Selection",
    ],
    approvalFlow: "Auditors do not approve records. They flag issues for the relevant officer.",
    escalationFlow: "Reports audit findings to the Tax Commissioner or external audit authority.",
  },
  {
    role: "Data Entry Operator",
    icon: "Keyboard",
    responsibilities: [
      "Entering offline return data into the system",
      "Entering certificate batch details",
      "Data entry for Register-4 and other registers",
    ],
    actions: [
      "Create and edit data entries (before approval)",
      "Submit entries for supervisor approval",
      "View assigned records",
    ],
    modules: [
      "Offline Return Register (entry only)",
      "Register & Stock (entry only)",
      "Certificate Data Entry",
    ],
    approvalFlow: "Submits entries for Circle Officer or supervisor approval.",
    escalationFlow: "Reports data discrepancies to the supervising Circle Officer.",
  },
  {
    role: "Stock Manager",
    icon: "Package",
    responsibilities: [
      "Managing inventory of official forms and certificates",
      "Recording issuances and returns",
      "Monthly stock reconciliation",
      "Submitting disposal reports",
    ],
    actions: [
      "Manage Stock Register",
      "Approve certificate data entries",
      "Record issuance and returns",
      "Export and submit disposal records",
    ],
    modules: [
      "Stock Register (full access)",
      "Certificate Management (full access)",
    ],
    approvalFlow: "Approves certificate data entries. Reports to Circle Officer and Tax Commissioner.",
    escalationFlow: "Escalates stock discrepancies immediately to the Tax Commissioner.",
  },
  {
    role: "Admin User",
    icon: "Settings",
    responsibilities: [
      "System configuration and user management",
      "Managing roles and permissions",
      "System-level troubleshooting",
    ],
    actions: [
      "Create, edit, and deactivate user accounts",
      "Assign and modify roles",
      "Manage system settings",
      "Access all administrative reports",
    ],
    modules: [
      "Administration (full access)",
      "User Management",
      "Role Management",
      "User Activity Report",
    ],
    approvalFlow: "Does not participate in operational approvals. Manages the system infrastructure.",
    escalationFlow: "Escalates system issues to the IT support team or NBR central administration.",
  },
];

// ─────────────────────────────────────────────────────────────────
// MODULE DOCUMENTATION
// ─────────────────────────────────────────────────────────────────

export const MODULE_DOCS: ModuleDoc[] = [
  {
    module: "Dashboard",
    purpose: "Provides a real-time overview of the circle's operations — return submissions, PSR status, pending approvals, and key performance metrics.",
    workflow: [
      "Load dashboard on login",
      "Review summary cards for pending items",
      "Navigate to modules by clicking action cards",
      "Use assessment year selector for period-specific data",
    ],
    dataSources: ["Return Register", "PSR database", "Demand Register", "User activity logs"],
    approvalLogic: "Dashboard is view-only. Actions are performed in their respective modules.",
    statusMeanings: [
      { label: "Pending", meaning: "Records awaiting action" },
      { label: "Approved", meaning: "Records processed and authorized" },
    ],
    actions: ["View metrics", "Navigate modules", "Switch assessment year"],
    commonErrors: ["Forgetting to change assessment year before reviewing data", "Navigating to wrong module from a card"],
    bestPractices: [
      "Start each session by reviewing the dashboard for pending items",
      "Use the PSR Dashboard daily to track PSR completion rates",
    ],
    relatedModules: ["Report", "PSR & Verification"],
  },
  {
    module: "Report",
    purpose: "Generates official NBR reports covering returns, tax categories, certificates, user activity, litigation, appeal, tribunal, payment, and demand data.",
    workflow: [
      "Select report type from sidebar",
      "Apply assessment year, zone, circle, and date filters",
      "Review the generated data table",
      "Export to Excel as needed",
    ],
    dataSources: ["Return Register", "Case & Financial Management", "PSR system", "User activity logs"],
    approvalLogic: "Reports are read-only generated views. No approval workflow applies.",
    statusMeanings: [],
    actions: ["Filter data", "View report", "Export to Excel"],
    commonErrors: ["Not applying the correct assessment year filter", "Exporting unfiltered data when a specific subset is needed"],
    bestPractices: [
      "Always confirm filters before exporting",
      "Use date range filters for period-specific compliance reports",
    ],
    relatedModules: ["Dashboard", "Return Register", "Case & Financial Management"],
  },
  {
    module: "Return Register",
    purpose: "Manages the complete lifecycle of tax return submissions — online (e-filed) and offline (paper) — from receipt through approval.",
    workflow: [
      "Receive return (online via e-filing portal, or offline via physical submission)",
      "Data entry operator enters offline returns",
      "Officer reviews in Return View & Approval",
      "Approve or return for correction",
      "Approved returns are archived at year-end",
    ],
    dataSources: ["NBR e-filing portal", "Physical submissions entered by operators"],
    approvalLogic: "Returns require Circle Officer or Deputy Commissioner approval. High-value returns may require Commissioner sign-off.",
    statusMeanings: [
      { label: "Submitted", meaning: "Return received by system" },
      { label: "Under Review", meaning: "Officer reviewing" },
      { label: "Approved", meaning: "Authorized and locked" },
      { label: "Returned", meaning: "Sent back for correction" },
    ],
    actions: ["View register", "Approve returns", "Return for correction", "Export register", "Archive"],
    commonErrors: [
      "Approving without verifying TIN in Tax Registry",
      "Not documenting reasons when returning submissions",
    ],
    bestPractices: [
      "Process returns within 30 working days",
      "Cross-check online and offline registers monthly",
    ],
    relatedModules: ["PSR & Verification", "Register & Stock"],
  },
  {
    module: "Register & Stock",
    purpose: "Maintains the official taxpayer registry (Register-4, Tax Registry) and tracks physical stock of official forms and certificates (Stock Register).",
    workflow: [
      "Register new taxpayers in Tax Registry",
      "Maintain annual Register-4 with submission status",
      "Receive certificate batches → enter in data entry → approve → add to stock",
      "Issue from stock to officers → record in Stock Register",
      "Monthly reconciliation and disposal reporting",
    ],
    dataSources: ["Tax Registry (master)", "Certificate batch dispatches from Commissioner's office"],
    approvalLogic: "Certificate entries require Stock Manager or Circle Officer approval. Registry changes require Commissioner authorization.",
    statusMeanings: [
      { label: "Active", meaning: "Taxpayer in registry, expected to file" },
      { label: "In Stock", meaning: "Certificates/forms available for issuance" },
    ],
    actions: ["Manage registry", "Track stock", "Issue certificates", "Export registers"],
    commonErrors: [
      "Issuing certificates without stock register entry",
      "Not recording returns of unused certificates",
    ],
    bestPractices: [
      "Reconcile stock monthly",
      "Never issue certificates without a signed receipt from the receiving officer",
    ],
    relatedModules: ["Return Register", "Administration"],
  },
  {
    module: "PSR & Verification",
    purpose: "Manages Personal Submission Records and the double-entry verification system to ensure accuracy and integrity of return submission data.",
    workflow: [
      "Taxpayer submits return → PSR created",
      "Circle Officer reviews PSR in PSR Approval",
      "Double-entry verification: two operators enter data independently",
      "Discrepancies resolved by supervisor",
      "Approved PSRs contribute to assessment year totals",
    ],
    dataSources: ["Return Register", "e-filing portal submissions"],
    approvalLogic: "PSRs approved by Circle Officers. Edit requests require Commissioner approval.",
    statusMeanings: [
      { label: "Pending", meaning: "Awaiting approval" },
      { label: "Approved", meaning: "Authorized and counted" },
      { label: "Dormant", meaning: "No submission for 2+ years" },
      { label: "Invalid", meaning: "Failed validation" },
    ],
    actions: ["Approve PSRs", "Handle dormant/invalid records", "Double-entry verification", "Transfer records"],
    commonErrors: [
      "Not checking TIN against Registry before PSR approval",
      "The same operator performing both double entries",
    ],
    bestPractices: [
      "Review dormant list monthly and issue notices on schedule",
      "Resolve discrepancies within 2 working days",
    ],
    relatedModules: ["Return Register", "Register & Stock"],
  },
  {
    module: "Misfiled Returns",
    purpose: "Handles returns that have been submitted to the wrong circle or under an incorrect TIN — facilitating investigation and formal transfer.",
    workflow: [
      "Identify misfiled return (TIN mismatch or wrong circle)",
      "Review in Invalid List or Approval List",
      "Submit correction/transfer request",
      "Commissioner of both circles approves",
      "Record appears in Transfer History after completion",
    ],
    dataSources: ["Return Register", "PSR system", "Tax Registry"],
    approvalLogic: "Misfiled corrections require approval from Circle Officers of both source and destination circles.",
    statusMeanings: [
      { label: "Invalid", meaning: "Flagged for data error" },
      { label: "Transferred", meaning: "Moved to correct circle" },
    ],
    actions: ["Identify misfiled records", "Approve corrections", "Track transfers"],
    commonErrors: ["Approving a transfer without confirming the destination circle TIN"],
    bestPractices: [
      "Review Invalid List weekly to catch errors early",
      "Document all transfers with official correspondence references",
    ],
    relatedModules: ["Return Register", "PSR & Verification"],
  },
  {
    module: "Case & Financial Management",
    purpose: "Manages the full lifecycle of tax disputes, legal proceedings, demand issuance, taxpayer ledgers, and refund/adjustment processing.",
    workflow: [
      "Tax demand issued and recorded in Demand Register",
      "Non-payment triggers escalation to Litigation",
      "Taxpayer may appeal to Commissioner → Tribunal → High Court",
      "Payments recorded in Taxpayer Ledger",
      "Refunds processed for overpayments",
    ],
    dataSources: ["Demand Register", "Return Register", "Court records"],
    approvalLogic: "Demands approved by Circle Officer/Commissioner. Litigation cases managed by Commissioner. Refunds require Commissioner approval.",
    statusMeanings: [
      { label: "Active", meaning: "Case or demand currently open" },
      { label: "Resolved", meaning: "Concluded through payment or decision" },
      { label: "Appealed", meaning: "Under formal appeal process" },
    ],
    actions: ["Manage demands", "Track litigation", "Process appeals", "Manage refunds"],
    commonErrors: [
      "Not updating case status promptly after hearings",
      "Missing response deadlines in appeal cases",
    ],
    bestPractices: [
      "Set calendar reminders for all court hearing dates",
      "Reconcile Taxpayer Ledger monthly with Demand Register",
    ],
    relatedModules: ["PSR & Verification", "Register & Stock"],
  },
  {
    module: "Administration & Requests",
    purpose: "System administration including user management, role assignment, special registrations, audit selection, time extensions, and certificate management.",
    workflow: [
      "Create user accounts and assign roles",
      "Process special registration applications",
      "Review time extension requests",
      "Manage audit selection",
      "Oversee certificate lifecycle (entry → approval → stock → disposal)",
    ],
    dataSources: ["System user database", "NBR registration database", "Certificate dispatch records"],
    approvalLogic: "User management approved by Admin/Commissioner. Certificates approved by Stock Manager. All major changes require Commissioner sign-off.",
    statusMeanings: [
      { label: "Active", meaning: "User or registration in good standing" },
      { label: "Pending", meaning: "Awaiting review or activation" },
    ],
    actions: ["Manage users", "Manage roles", "Process registrations", "Audit selection", "Certificate management"],
    commonErrors: [
      "Assigning overly broad roles to users",
      "Not deactivating user accounts promptly after staff changes",
    ],
    bestPractices: [
      "Review user access quarterly",
      "Apply principle of least privilege when assigning roles",
    ],
    relatedModules: ["Dashboard", "Register & Stock"],
  },
];

// ─────────────────────────────────────────────────────────────────
// WHAT'S NEW
// ─────────────────────────────────────────────────────────────────

export const WHATS_NEW: WhatsNewEntry[] = [
  {
    version: "2.4.0",
    releaseDate: "June 2026",
    features: [
      "Help & User Guide system — contextual documentation available from every page",
      "Excel export for all table reports (.xlsx format)",
      "Crossfade transition animation for login slideshow",
    ],
    fixes: [
      "Filter label translation keys now display correctly in all languages",
      "Login page slider image transitions improved",
    ],
    uiChanges: [
      "Unified Material Design 3 button and form component system",
      "Improved modal system with consistent bottom-sheet behavior on mobile",
      "New search field component across all topbar and filter areas",
    ],
    systemUpdates: [
      "Assessment year selector now applies globally to all modules",
      "Improved keyboard navigation and ARIA accessibility across all dialogs",
    ],
  },
  {
    version: "2.3.0",
    releaseDate: "May 2026",
    features: [
      "Double Entry Verification dashboard",
      "Transfer History module for misfiled returns",
      "Certificate Disposal History tracking",
    ],
    fixes: [
      "PSR approval status sync issue resolved",
      "Mobile navigation drawer animation stabilized",
    ],
    uiChanges: [
      "Breadcrumb navigation added to all pages",
      "Mobile bottom-sheet modal pattern applied consistently",
    ],
    systemUpdates: [
      "Notification system enhanced with unread count badge",
      "Performance improvements for large data tables",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// QUICK ACTIONS (Getting Started)
// ─────────────────────────────────────────────────────────────────

export const QUICK_ACTIONS = [
  {
    title: "Getting Started",
    description: "First login, navigation overview, and initial setup steps for new users.",
    icon: "PlayCircle",
    content: [
      "Log in with your credentials provided by your Admin User.",
      "On first login, change your password via the profile menu (top right).",
      "Select the correct Assessment Year from the topbar dropdown.",
      "Use the sidebar to navigate to your primary module.",
      "Check the Dashboard for any pending items requiring your action.",
    ],
  },
  {
    title: "System Navigation",
    description: "How to move between modules, use search, and access key features.",
    icon: "Map",
    content: [
      "The left sidebar contains all main modules — click to expand sub-navigation.",
      "The topbar search (desktop) searches across reports, cases, and taxpayers.",
      "Breadcrumbs at the top of each page show your current location.",
      "The Bell icon shows system notifications and pending approval alerts.",
      "The Profile menu (top right) provides access to account settings and sign-out.",
    ],
  },
  {
    title: "Assessment Year Selection",
    description: "How the Assessment Year selector works and affects all modules.",
    icon: "Calendar",
    content: [
      "The Assessment Year dropdown is in the topbar, visible on all pages.",
      "Changing the year updates all module data globally.",
      "The default is the current active assessment year.",
      "Historical data from previous years can be accessed by selecting a past year.",
      "Reports and exports always reflect the currently selected assessment year.",
    ],
  },
  {
    title: "Downloading & Exporting",
    description: "How to export data from any page as Excel files.",
    icon: "Download",
    content: [
      "Look for the Download or Export button in the top-right of any table page.",
      "Exports include all currently filtered data in Excel (.xlsx) format.",
      "Apply your filters before exporting to download only the relevant subset.",
      "The filename includes the module name and date for easy identification.",
      "For print-quality reports, use the Print button where available.",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// SEARCH INDEX
// ─────────────────────────────────────────────────────────────────

export interface SearchResult {
  type: "page" | "role" | "module" | "faq" | "action";
  title: string;
  excerpt: string;
  pageKey?: string;
  sectionIndex?: number;
}

export function searchHelpContent(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search page guides
  for (const [key, guide] of Object.entries(PAGE_GUIDES)) {
    const haystack = [
      guide.title, guide.overview,
      ...guide.workflow, ...guide.actions,
      ...(guide.statuses?.map(s => s.label + " " + s.meaning) ?? []),
      ...(guide.commonErrors ?? []),
      ...(guide.bestPractices ?? []),
      ...guide.faqs.flatMap(f => [f.q, f.a]),
    ].join(" ").toLowerCase();

    if (haystack.includes(q)) {
      // Prioritize FAQ matches
      const faqMatch = guide.faqs.find(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
      if (faqMatch) {
        results.push({ type: "faq", title: faqMatch.q, excerpt: faqMatch.a, pageKey: key });
      } else {
        results.push({ type: "page", title: guide.title, excerpt: guide.overview.slice(0, 120) + "…", pageKey: key });
      }
    }
  }

  // Search role guides
  for (const role of ROLE_GUIDES) {
    const haystack = [
      role.role, ...role.responsibilities, ...role.actions, ...role.modules,
      role.approvalFlow, role.escalationFlow,
    ].join(" ").toLowerCase();
    if (haystack.includes(q)) {
      results.push({ type: "role", title: role.role, excerpt: role.responsibilities[0] });
    }
  }

  // Search module docs
  for (const mod of MODULE_DOCS) {
    const haystack = [
      mod.module, mod.purpose, ...mod.workflow, ...mod.actions,
      ...mod.commonErrors, ...mod.bestPractices,
    ].join(" ").toLowerCase();
    if (haystack.includes(q)) {
      results.push({ type: "module", title: mod.module, excerpt: mod.purpose.slice(0, 120) + "…" });
    }
  }

  return results.slice(0, 12);
}
